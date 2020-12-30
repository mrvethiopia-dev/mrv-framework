using System;
using System.Collections;
using System.Collections.Generic;
using System.Data.Objects;
using System.Linq;
using System.Web.Mvc;
using Ext.Direct.Mvc;
using MRV.Business.GHG;
using MRV.Data.Model;
using MRV.Presentation.GHG.Classes;
using Newtonsoft.Json;

namespace MRV.Presentation.GHG.Controllers
{
    public class UserController : Controller
    {
        #region Members

        /**
         * Define a reference to the data context
         
         */
        private readonly ObjectContext context;

        /**
         * Define a reference to user object
         */
        private readonly User _user;

        /**
         * Define a reference to user roles
         */
        private readonly UserRole _userRole;

        /**
         * Define a reference to user subsystems
         */
        private readonly UserSystems _userSystems;

        #endregion

        #region Constructor

        /// <summary>
        /// Initialize objects
        /// </summary>
        public UserController()
        {
             context = new ENTRO_MISEntities(Constants.ConnectionString);
            _user = new User(context);
            _userRole = new UserRole(context);
            _userSystems = new UserSystems(context);
            
        }

        #endregion

        #region Methods

        /// <summary>
        /// Get user by id
        /// </summary>
        /// <param name="id">user id</param>
        /// <returns>user object in the form of json</returns>
        public ActionResult Get(int id)
        {
            /**
             * Select user by the specified id
             */
            var objUser = _user.Get(id);

            /**
             * Format and return user info as json
             */
            var user = new
            {
                objUser.Id,
                objUser.Username,
                objUser.IsActive,
                objUser.FullName,
                Password = Encryption.DecryptString(objUser.Password, Constants.Key),
                
            };

            return this.Direct(new
            {
                success = true,
                data = user
            });
        }

        /// <summary>
        /// Get all users as paged
        /// </summary>
        /// <param name="start">page number</param>
        /// <param name="limit">page size</param>
        /// <param name="sort">sort field</param>
        /// <param name="dir">sort direction(asc or desc)</param>
        /// <param name="record"></param>
        /// <returns>List of user in json format</returns>
        public ActionResult GetAll(int start, int limit, string sort, string dir, string record)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(record);
            var searchText = hashtable["searchText"] != null ? hashtable["searchText"].ToString() : "";

            var filtered = _user.GetAll();
            filtered = searchText != "" ? filtered.Where(s => s.Username.ToUpper().Contains(searchText.ToUpper())) : filtered;


            switch (sort)
            {
                case "UserName":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.Username) : filtered.OrderByDescending(u => u.Username);
                    break;
            }

            var sysUsers = filtered as IList<sysUser> ?? filtered.ToList();
            var count = sysUsers.Count();
            filtered = sysUsers.Skip(start).Take(limit);
            /**
             * Format and return users list as json
             */
            var users = filtered.Select(item => new
            {
                item.Id,
                item.Username,
                item.FullName,
                MemberOf = _userRole.Find(u=> u.UserId == item.Id).sysRole.Name,
                item.IsActive
            }).Cast<object>().ToList();
            var result = new
            {
                total = count,
                data = users
            };
            return this.Direct(result);
        }

        /// <summary>
        /// Save user
        /// </summary>
        /// <param name="user">user object populated from the client</param>
        /// <returns>success or failure object as json</returns>
        [FormHandler]
        public ActionResult Save(sysUser user)
        {
            try
            {
               
                user.Password = Encryption.EncryptString(user.Password, Constants.Key);
                
                if (user.Id.Equals(0))
                {
                    /**
                     * Check if the user has already been registered
                     */
                    var users = _user.GetAll();
                    //var objUser = users.Where(o => o.Username.Equals(user.Username)).SingleOrDefault();
                    var objUser = users.SingleOrDefault(o => o.Username.Equals(user.Username));
                    if (objUser != null)
                    {
                        return this.Direct(new { success = false, data = "User has already been registered!" });
                    }
                    
                    user.IsActive = true;
                    user.IsDeleted = false;
                    _user.AddNew(user);
                }
                else
                {
                    
                    user.IsActive = true;
                    user.IsDeleted = false;
                    _user.Edit(user);
                }

                /**
                 * Extract params sent from the client
                 */
                var hashtable = JsonConvert.DeserializeObject<Hashtable>(Request.Params["record"]);

                /**
                 * Get roles (concatinated with a colon (:)) assigned to this user
                 */
                var rolesString = hashtable["roles"].ToString();

                /**
                 * Make sure at least one role is selected
                 */
                if (rolesString.IndexOf(':') > 0)
                {
                    /**
                     * Remove the last colon
                     */
                    rolesString = rolesString.Remove(rolesString.Length - 1);

                    /**
                     * Get selected roles
                     */
                    var roles = rolesString.Split(new[] { ':' });

                    /**
                     * Save the selected roles
                     */
                    SaveUserRoles(user.Id, roles);
                }

                /**
                 * Get subsystems (concatinated with colons (:)) that the user is allowed to logon
                 */
                var subsystemsString = hashtable["subsystems"].ToString();

                /**
                 * Make sure at least one subsystem is selected
                 */
                if (subsystemsString.IndexOf(':') > 0)
                {
                    /**
                     * Remove the last colon
                     */
                    subsystemsString = subsystemsString.Remove(subsystemsString.Length - 1);
                    
                    /**
                     * Get selected subsystems
                     */
                    var subsystems = subsystemsString.Split(new[] { ':' });

                    /**
                     * Save selected subsystems
                     */
                    SaveUserSubsystems(user.Id, subsystems);
                }

                /**
                 * Notify the client that the user is successflly saved
                 */
                return this.Direct(new { success = true, data = "User has been added successfully!" });
            }
            catch (Exception ex)
            {
                return this.Direct(new { success = false, data = ex.InnerException.Message });
            }
        }

        /// <summary>
        /// Delete user specified by a given id
        /// </summary>
        /// <param name="id">user id</param>
        /// <returns>success or failure object as json</returns>
        public ActionResult Delete(int id)
        {
            try
            {
                /**
                 * Get all roles assigned to this user
                 */
                var userRoles = _userRole.GetAll().Where(u => u.UserId == id).ToList();

                /**
                 * Detach this user from these roles
                 */
                foreach (var userRole in userRoles)
                {
                    _userRole.Delete(userRole.Id);
                }

                /**
                 * Get all subsystems this user is can logon to
                 */
                var userSubsystems = _userSystems.GetAll().Where(u => u.UserId == id).ToList();

                /**
                 * Detach this user from these subsystems
                 */
                foreach (var userSystems in userSubsystems)
                {
                    _userSystems.Delete(userSystems.Id);
                }

                /**
                 * Finally, delete the user itself
                 */
                _user.Delete(id);

                /**
                 * Notify the client whether the user is deleted or not
                 */
                return this.Direct(new { success = true, data = "User has been deleted successfully!" });                
            }
            catch (Exception ex)
            {
                return this.Direct(new { success = false, data = ex.Message });
            }
        }

        public ActionResult GetUserRolesAndSystems(int userId)
        {
            var filteredUserRoles = _userRole.GetAll().Where(u => u.UserId == userId);
            var filteredUserSystems = _userSystems.GetAll().Where(u => u.UserId == userId);
            var secUserRoles = filteredUserRoles as IList<sysUserRole> ?? filteredUserRoles.ToList();
            var countUserRoles = secUserRoles.Count();
            var secUserSubsystems = filteredUserSystems as IList<sysUserSystems> ?? filteredUserSystems.ToList();
            var countUserSubsystems = secUserSubsystems.Count();
            var roles = secUserRoles.Select(r => new { r.Id, r.RoleId }).Cast<object>().ToList();
            var subsystems = secUserSubsystems.Select(s => new { s.Id, s.SystemId }).Cast<object>().ToList();
            var result = new
            {
                countUserRoles,
                countUserSubsystems,
                roles,
                subsystems
            };
            return this.Direct(result);
        }


        public ActionResult ChangePassword(string oldPassword, string newPassword, string confirmPassword, string userName)
        {
            try
            {
                userName = userName.Replace(" ", string.Empty);
                userName = userName.Replace("-", string.Empty);
                var user = _user.GetUserByUserName(userName);
                var encryptedpassword = Encryption.EncryptString(oldPassword, Constants.Key);

                if (user.Password == encryptedpassword)
                {
                    user.Password = Encryption.EncryptString(newPassword, Constants.Key);

                    context.Detach(user);
                    _user.Edit(user);

                    return this.Direct(new {success = true, data = "Password has been successfully changed!"});
                }

                return this.Direct(new {success = false, data = "Old password supplied does not match with the existing one!"});
            }
            catch (Exception ex)
            {
                return this.Direct(new { success = false, data = "An error occured while changing password!" });
            }
        }
        /// <summary>
        /// Save user roles
        /// </summary>
        /// <param name="userId">user id</param>
        /// <param name="roles">an array of roles</param>
        private void SaveUserRoles(int userId, string[] roles)
        {
            /**
             * First delete all previously assigned roles
             */
            _userRole.Delete(u => u.UserId == userId);

            /**
             * Iterate through the roles and assign to the user
             */
            for (int i = 0; i < roles.Count(); i++)
            {
                var userRole = new sysUserRole
                {
                    UserId = userId,
                    RoleId = int.Parse(roles[i]),
                    
                };
                _userRole.AddNew(userRole);
            }
        }

        /// <summary>
        /// Save user subsystems
        /// </summary>
        /// <param name="userId">user id</param>
        /// <param name="subsystems">an array of subsystems</param>
        private void SaveUserSubsystems(int userId, string[] subsystems)
        {
            /**
             * First delete all previously assigned subsystems for the user
             */
            _userSystems.Delete(u => u.UserId == userId);

            /**
             * Iterate through the subsystems and assign to the user
             */
            for (int j = 0; j < subsystems.Count(); j++)
            {
                var userSystems = new sysUserSystems
                {
                    UserId = userId,
                    SystemId = int.Parse(subsystems[j]),
                    
                };
                _userSystems.AddNew(userSystems);
            }
        }

        #endregion
    }
}
