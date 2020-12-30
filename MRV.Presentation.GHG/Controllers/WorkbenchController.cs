using System.Collections;
using System.Data.Objects;
using System.Linq;
using System.Web.Mvc;
using MRV.Business.GHG;
using MRV.Presentation.GHG.Classes;
using MRV.Data.Model;
using Ext.Direct.Mvc;
using System.Collections.Generic;
using System;

namespace MRV.Presentation.GHG.Controllers
{
    public class WorkbenchController : Controller
    {
        #region Members

        private const string Key = "0b1f131c";
        private readonly ObjectContext _context;
        private readonly Menus _menues;
        private readonly Systems _systems;
        private readonly SubMenu _subMenu;
        private readonly UserRole _userRole;
        private readonly RolePermission _rolePermission;
        private readonly User _user;

        #endregion

        #region Constructor

        public WorkbenchController()
        {
            _context = new ENTRO_MISEntities(Constants.ConnectionString);
            _menues = new Menus(_context);
            _systems = new Systems(_context);
            _subMenu = new SubMenu(_context);
            _userRole = new UserRole(_context);
            _rolePermission = new RolePermission(_context);
            _user = new User(_context);
        }

        #endregion

        #region Actions

        public ActionResult Index()
        {
            SetRootPath();
            string queryString = Server.HtmlDecode(Request.QueryString["loginParam"]);
            if (queryString != null)
            {
                string loginParam = Encryption.DecryptString(queryString, Key);
                int separatorIndex = loginParam.IndexOf("/");
                if (separatorIndex != -1)
                {
                    string userName = loginParam.Substring(0, separatorIndex);
                    string password = loginParam.Substring(separatorIndex + 1);
                    var objUser = _user.Find(u => u.Username == userName && u.Password == password);
                    if (objUser != null)
                    {
                        SetUserPermission(objUser);
                        Response.Redirect(Constants.ApplicationPath + "/Workbench");
                    }
                    else
                    {
                        Response.Redirect(Constants.ApplicationPath + "/Reception");
                    }
                }
                else
                {
                    Response.Redirect(Constants.ApplicationPath + "/Reception");
                }
            }

            return View();
        }

        public DirectResult InitializeApp()
        {
            try
            {
                if (Session[Constants.CurrentUser] == null || Session[Constants.UserPermission] == null)
                {
                    return this.Direct(new { success = false, data = new { Constants.ApplicationPath } });
                }
                else
                {
                    var currentUser = Session[Constants.CurrentUser] as sysUser;
                    var permissions = Session[Constants.UserPermission] as List<Permission>;
                    return this.Direct(new { success = true, data = new { Constants.ApplicationPath, currentUser.Id, currentUser.Username,currentUser.FullName, Permissions = permissions } });
                }
            }
            catch (System.Exception ex)
            {
                return this.Direct(new { success = false, data = ex.InnerException.Message });
            } 
        }

        public DirectResult GetModules()
        {
            var objSubsystem = _systems.Find(s => s.Name == Constants.GHGInventory);
            var modules = _menues.FindAll(m => m.SystemId == objSubsystem.Id).OrderBy(p=> p.Code);
            var subsystemModules = new List<object>();

            foreach (var module in modules.Where(secModule => HasOperation(secModule.Id)))
            {
                subsystemModules.Add(new
                {
                    id = module.Id,
                    text = module.Name,
                    href = string.Empty,
                    iconCls = module.IconCls,
                    leaf = true
                });
            }
            var result = new { total = subsystemModules.Count(), data = subsystemModules };
            return this.Direct(result);
        }

        public DirectResult GetOperations(string nodeId)
        {
            var moduleId = int.Parse(nodeId);
            var operations = _subMenu.FindAll(m => m.MenuId == moduleId).OrderBy(s=> s.Code);
            var filtered = new ArrayList();
            foreach (var operation in operations)
            {
                filtered.Add(new
                {
                    id = operation.Id,
                    text = operation.Name,
                    href = operation.Href,
                    iconCls = operation.IconCls,
                    leaf = true,
                    hidden = !CheckViewPermission(operation.Name,Constants.CanView)
                });
            }
            return this.Direct(filtered.ToArray());
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

        private bool CheckViewPermission(string operation, string accessLevel)
        {
            var userPermissions = Session[Constants.UserPermission] as List<Permission>;

            if (userPermissions != null)
            {
                userPermissions = userPermissions.Where(p => p.Operation == operation && p.CanView.Equals(true)).ToList();

                if (userPermissions != null)
                {
                    return userPermissions.Count() > 0;
                }
            }
            return false;
        }

        public bool HasOperation(int moduleId)
        {
            var operations = _subMenu.FindAll(m => m.MenuId == moduleId);
            var filtered = new ArrayList();
            foreach (var operation in operations)
            {
                if (CheckViewPermission(operation.Name, Constants.CanView))
                    filtered.Add(new
                    {
                        id = operation.Id,
                        text = operation.Name,
                        href = operation.Href,
                        iconCls = operation.IconCls,
                        leaf = true,
                        hidden = !CheckViewPermission(operation.Name, Constants.CanView)
                    });
            }

            return filtered.Count > 0;
        }

        public ActionResult Logout()
        {
            Session[Constants.CurrentCulture] = null;
            Session[Constants.CurrentUser] = null;
            Session[Constants.UserPermission] = null;
            return this.Direct(new { success = true, data = new { Constants.ApplicationPath } });
        }

        private void SetUserPermission(sysUser currentUser)
        {
            var userPermissions = new List<Permission>();
            var userRoles =  _userRole.FindAll(r => r.UserId == currentUser.Id);
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
        #endregion
    }
}