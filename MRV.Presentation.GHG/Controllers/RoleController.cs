using System;
using System.Collections;
using System.Collections.Generic;
using System.Data.Objects;
using System.Linq;
using System.Transactions;
using System.Web.Mvc;
using Ext.Direct.Mvc;
using MRV.Business.GHG;
using MRV.Data.Model;
using MRV.Presentation.GHG.Classes;
using Newtonsoft.Json;

namespace MRV.Presentation.GHG.Controllers
{
    public class RoleController : Controller
    {
        #region Members

        /**
         * Define reference to data context object
         */
        private readonly ObjectContext _context;

        /**
         * Define reference to business objects
         */
        private readonly Roles _role;
        private readonly SubMenu _subMenu;
        private readonly RolePermission _rolePermission;

        #endregion

        #region Constructor

        /// <summary>
        /// Initialize data context and business objects
        /// </summary>
        public RoleController()
        {
            _context = new ENTRO_MISEntities(Constants.ConnectionString);
            _role = new Roles(_context);
            _subMenu = new SubMenu(_context);
            _rolePermission = new RolePermission(_context);
        }

        #endregion

        #region Methods

        public ActionResult Get(int id)
        {
            var objRole = _role.Get(id);
            var role = new
            {
                objRole.Id,
                objRole.Name,
                objRole.Code
            };
            return this.Direct(new
            {
                success = true,
                data = role
            });
        }

        public ActionResult GetAll(int start, int limit, string sort, string dir)
        {
            var count = _role.Count();
            var filtered = _role.GetAll();
            filtered = filtered.OrderBy(r => r.Name);
            filtered = filtered.Skip(start).Take(limit);
            var roles = filtered.Select(item => new
            {
                item.Id,
                item.Name,
                item.Code
            }).Cast<object>().ToList();
            var result = new
            {
                total = count,
                data = roles
            };
            return this.Direct(result);
        }

        public ActionResult GetOperations(int start, int limit, string sort, string dir, string record)
        {
            
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(record);
            int roleId, subsystemId;
            int.TryParse(hashtable["roleId"].ToString(), out roleId);
            int.TryParse(hashtable["subsystemId"].ToString(), out subsystemId);

            var rolePermissions = _rolePermission.GetAll().Where(r => r.RoleId == roleId && r.sysSubMenu.sysMenus.SystemId == subsystemId);

            var filtered = _subMenu.GetAll().Where(o => o.sysMenus.SystemId == subsystemId).OrderBy(o=>o.MenuId).AsEnumerable();
            var secOperations = filtered as IList<sysSubMenu> ?? filtered.ToList();
            var count = secOperations.Count();
            filtered = secOperations.Skip(start).Take(limit);
            var operations = new List<object>();
            foreach (var item in filtered)
            {
                var permissions = rolePermissions as IList<sysRolePermission> ?? rolePermissions.ToList();
                var secRolePermissions = rolePermissions as IList<sysRolePermission> ?? permissions.ToList();
                var rolePermission = secRolePermissions.FirstOrDefault(rp => rp.SubMenuId == item.Id);
                operations.Add(new
                {
                    item.Id,
                    Module = item.sysMenus.Name,
                    Operation = item.Name,
                    Add = rolePermission != null && rolePermission.CanAdd,
                    Edit = rolePermission != null && rolePermission.CanEdit,
                    Delete = rolePermission != null && rolePermission.CanDelete,
                    View = rolePermission != null && rolePermission.CanView,
                    Approve = rolePermission != null && rolePermission.CanApprove,
                    Check = rolePermission != null && rolePermission.CanCheck,
                    Authorize = rolePermission != null && rolePermission.CanAuthorize
                });
            }


            var result = new
            {
                total = count,
                data = operations
            };
            return this.Direct(result);
        }

        [FormHandler]
        public ActionResult Save(sysRole role)
        {
            try
            {
                if (role.Id.Equals(0))
                {
                    var roles = _role.GetAll();
                    var objRole = roles.SingleOrDefault(o => o.Name.Equals(role.Name));
                    if (objRole != null)
                    {
                        return this.Direct(new { success = false, data = "Role has already been registered!" });
                    }
                    _role.AddNew(role);
                }
                else
                {
                    _role.Edit(role);
                }
                
                return this.Direct(new { success = true, data = "Role has been added successfully!" });
            }
            catch (Exception ex)
            {
                return this.Direct(new { success = true, data = ex.InnerException.Message });
            }
        }

        public ActionResult SaveRolePermissions(int subSystemId, int roleId, string permissionString)
        {
            try
            {
                using (var transaction = new TransactionScope())
                {
                    _context.Connection.Open();
                    
                    permissionString = permissionString.Remove(permissionString.Length - 1);
                    var permissions = permissionString.Split(new[] { ';' });
                   
                    _rolePermission.Delete(r => r.sysSubMenu.sysMenus.SystemId == subSystemId && r.RoleId == roleId);
                    for (int i = 0; i < permissions.Count(); i++)
                    {
                        string[] permission = permissions[i].Split(new[] { ':' });
                        var objPermission = new sysRolePermission()
                        {
                            RoleId = roleId,
                            SubMenuId = int.Parse(permission[0]),
                            CanAdd = bool.Parse(permission[1]),
                            CanEdit = bool.Parse(permission[2]),
                            CanDelete = bool.Parse(permission[3]),
                            CanView = bool.Parse(permission[4]),
                            CanApprove = bool.Parse(permission[5]),
                            CanCheck = bool.Parse(permission[6]),
                            CanAuthorize = bool.Parse(permission[7])
                        };
                        _rolePermission.AddNew(objPermission);
                    }

                    transaction.Complete();
                    _context.AcceptAllChanges();
                    return this.Direct(new { success = true, data = "Role Permission has been saved successfully!" });
                }
            }
            catch (Exception exception)
            {
                return this.Direct(new { success = false, data = exception.InnerException != null ? exception.InnerException.Message : exception.Message });
            }
        }

        public ActionResult Delete(int id)
        {
            try
            {
                using (var transaction = new TransactionScope())
                {
                    _context.Connection.Open();

                    var rolePermissions = _rolePermission.GetAll().Where(u => u.RoleId == id).ToList();
                    foreach (var rolePermission in rolePermissions)
                    {
                        _rolePermission.Delete(rolePermission.Id);
                    }
                    if (id != 1 && id != 20) // Administrator and Employee Role Should not be Deleted
                        _role.Delete(id);

                    transaction.Complete();
                    _context.AcceptAllChanges();
                    return this.Direct(new { success = true, data = "Role has been deleted successfully!" });
                }
            }
            catch (Exception ex)
            {
                return this.Direct(new { success = false, data = ex.InnerException.Message });
            }
        }

        #endregion
    }
}
