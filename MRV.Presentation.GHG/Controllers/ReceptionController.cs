using System.Collections.Generic;
using System.Data.Objects;
using System.Linq;
using System.Web.Mvc;
using MRV.Business.GHG;
using MRV.Presentation.GHG.Classes;
using MRV.Data.Model;
using Ext.Direct.Mvc;
using System.Globalization;

namespace MRV.Presentation.GHG.Controllers
{
    public class ReceptionController : Controller
    {
        #region Members

        private const string Key = "0b1f131c";
        private readonly ObjectContext _context;
        private readonly User _user;
        private UserSystems _userSystems;
        private readonly UserRole _userRole;
        private readonly RolePermission _rolePermission;
        private readonly SubMenu _subMenu;
        

        

        #endregion

        #region Constructor

        public ReceptionController()
        {
            _context = new ENTRO_MISEntities(Constants.ConnectionString);
            _user = new User(_context);
            _userSystems = new UserSystems(_context);
            _userRole = new UserRole(_context);
            _rolePermission = new RolePermission(_context);
            _subMenu = new SubMenu(_context);
           
            
        }

        #endregion

        #region Actions

        public ActionResult Index()
        {
            return View();
        }

        [FormHandler]
        public DirectResult Login(sysUser user)
        {
            try
            {
                var language = Request.Params["Language"];
                var password = Encryption.EncryptString(user.Password, Constants.Key);
                var objUser = _user.Find(u => u.Username.Equals(user.Username) && u.Password.Equals(password));
                if (objUser != null)
                {
                    var objUserSubsystem = _userSystems.Find(s => s.UserId == objUser.Id);
                    if (objUserSubsystem == null)
                    {
                        return this.Direct(new { success = false, data = "You are not authorized to access this system!" });
                    }

                    #region Check Serial Number 
                    

                    #endregion 

                    #region Check Authentication 

                    
                    #endregion 

                    SetPermission(objUser);
                    return this.Direct(new { success = true, data = new { userName = objUser.Username } });
                }
                return this.Direct(new { success = false, data = "The username and password combination supplied is invalid!" });
            }
            catch (System.Exception ex)
            {
                return this.Direct(new { success = false, data = ex.InnerException.Message });
            }
        }

        public DirectResult Logout()
        {
            Session[Constants.CurrentCulture] = null;
            Session[Constants.CurrentUser] = null;
            Session[Constants.UserPermission] = null;
            return this.Direct(new { success = true, data = new { Constants.ApplicationPath } });
        }

        public DirectResult ChangeCulture(string language)
        {
            Session[Constants.CurrentCulture] = new CultureInfo(language);
            return this.Direct(new { success = true, data = new { SelectedLanguage = language } });
        }

        public DirectResult GetApplicationPath()
        {
            SetRootPath();
            return this.Direct(new { success = true, data = new { Constants.ApplicationPath } });
        }

        #endregion

        #region Methods

        private void SetRootPath()
        {
            var applicationPath = Request.ApplicationPath;
            if (applicationPath == null) return;
            if (applicationPath.Equals("/"))
            {
                applicationPath = string.Empty;
            }
            Constants.ApplicationPath = applicationPath;
        }

        private void SetPermission(sysUser currentUser)
        {
            
            var userPermissions = new List<Permission>();
            var userRoles = _userRole.FindAll(r => r.UserId == currentUser.Id).ToList();
            foreach (var rolePermissions in userRoles.Select(role => _rolePermission.FindAll(p => p.RoleId == role.RoleId)))
            {
                userPermissions.AddRange(rolePermissions.Select(permission => new Permission 
                {
                    
                    User = currentUser.Username,
                    Role = permission.sysRole.Name,
                    Operation = permission.sysSubMenu.Name,
                    CanAdd = permission.CanAdd,
                    CanEdit = permission.CanEdit,
                    CanDelete = permission.CanDelete,
                    CanView = permission.CanView,
                    CanApprove = permission.CanApprove,
                    CanCheck = permission.CanCheck,
                    CanAuthorize = permission.CanAuthorize
                }));
            }
            Session[Constants.CurrentUser] = currentUser;
            Session[Constants.UserPermission] = userPermissions;
        }

        private string identifier(string wmiClass, string wmiProperty)
        //Return a hardware identifier
        {
            string result = "";
            var mc = new System.Management.ManagementClass(wmiClass);
            System.Management.ManagementObjectCollection moc = mc.GetInstances();
            foreach (var mo in moc)
            {

                //Only get the first one
                if (result == "")
                {
                    try
                    {
                        result = mo[wmiProperty].ToString();
                        break;
                    }
                    catch
                    {
                    }
                }

            }
            return result;
        }
        private string diskId()
        //Main physical hard drive ID
        {
            return identifier("Win32_DiskDrive", "Model")
                    + identifier("Win32_DiskDrive", "Manufacturer")
                    + identifier("Win32_DiskDrive", "Signature")
                    + identifier("Win32_DiskDrive", "TotalHeads");
        }

        private string pack(string text)
        //Packs the string to 8 digits
        {
            //return text;

            string retVal;
            int x = 0;
            int y = 0;
            foreach (char n in text)
            {
                y++;
                x += (n * y);
            }

            retVal = x.ToString() + "00000000";

            return retVal.Substring(0, 8);
        }
        #endregion
    }
}