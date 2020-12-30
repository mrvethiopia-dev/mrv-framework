using System;
using System.Collections;
using System.Data.Objects;
using System.Linq;
using System.Web.Mvc;
using Ext.Direct.Mvc;
using MRV.Business.GHG;
using MRV.Data.Model;
using MRV.Presentation.GHG.Classes;
using Newtonsoft.Json;
using System.Transactions;

namespace MRV.Presentation.GHG.Controllers
{
    public class SubMenuController : Controller
    {
        #region Members

        /*
         * Define reference to data context object
         */
        private readonly ObjectContext _context;

        /*
         * Define reference to business objects
         */
        private readonly SubMenu _subMenu;
        private readonly RolePermission _rolePermission;

        #endregion

        #region Constructor

        /// <summary>
        /// Initialize data context and business objects 
        /// </summary>
        public SubMenuController()
        {
            _context = new ENTRO_MISEntities(Constants.ConnectionString);
            
            _subMenu = new SubMenu(_context);
            _rolePermission = new RolePermission(_context);
        }

        #endregion

        #region Methods

        /// <summary>
        /// Get SubMenu by id
        /// </summary>
        /// <param name="id">SubMenu id</param>
        /// <returns>SubMenu object as json</returns>
        public ActionResult Get(int id)
        {
            var objSubMenu = _subMenu.Get(id);
            var subMenu = new
            {
                objSubMenu.Id,
                objSubMenu.MenuId,
                objSubMenu.Name,
                objSubMenu.Code,
                objSubMenu.Href,
                objSubMenu.IconCls
            };
            return this.Direct(new
            {
                success = true,
                data = subMenu
            });
        }

        /// <summary>
        /// Get all SubMenus
        /// </summary>
        /// <param name="start">page number</param>
        /// <param name="limit">page size</param>
        /// <param name="sort">sort field</param>
        /// <param name="dir">sort direction(asc or desc)</param>
        /// <param name="record">additional params</param>
        /// <returns>SubMenu list as json</returns>
        public ActionResult GetAll(int start, int limit, string sort, string dir, string record)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(record);
            int menuId;
            int.TryParse(hashtable["menuId"].ToString(), out menuId);
            var filtered = _subMenu.FindAll(o => o.MenuId == menuId);
            var count = filtered.Count();
            filtered = filtered.Skip(start).Take(limit);
            var subMenus = filtered.Select(subMenu => new
            {
                subMenu.Id,
                Menus = subMenu.sysMenus.Name,
                subMenu.Name,
                subMenu.Code,
                subMenu.Href,
                subMenu.IconCls
            }).Cast<object>().ToList();
            var result = new
            {
                total = count,
                data = subMenus
            };
            return this.Direct(result);
        }

        /// <summary>
        /// Save SubMenu
        /// </summary>
        /// <returns>success or failure object as json</returns>
        [FormHandler]
        public ActionResult Save(sysSubMenu subMenu)
        {
            try
            {
                var objSubMenu = _subMenu.Find(o => o.MenuId == subMenu.MenuId && o.Name == subMenu.Name && o.Id != subMenu.Id);
                //if (Request.Params["IsMenu"] == "on") subMenu.IsMenu = true;
                if (string.IsNullOrEmpty(subMenu.Href)) subMenu.Href = string.Empty;
                if (string.IsNullOrEmpty(subMenu.IconCls)) subMenu.IconCls = string.Empty;
                if (objSubMenu != null)
                {
                    var result = new { success = false, data = "SubMenu has already been registered!" };
                    return this.Direct(result);
                }
                if (subMenu.Id.Equals(0))
                {
                    _subMenu.AddNew(subMenu);
                }
                else
                {
                    _subMenu.Edit(subMenu);
                }
                return this.Direct(new { success = true, data = "SubMenu has been added successfully!" });
            }
            catch (Exception ex)
            {
                return this.Direct(new { success = false, data = ex.InnerException.Message });
            }
            
        }

        /// <summary>
        /// Delete SubMenu and related entities
        /// </summary>
        /// <param name="id">SubMenu id</param>
        /// <returns>success or failure object as json</returns>
        public ActionResult Delete(int id)
        {
            try
            {
                using (var transaction = new TransactionScope())
                {
                    _context.Connection.Open();

                    var rolePermissions = _rolePermission.GetAll().Where(u => u.SubMenuId == id).ToList();
                    foreach (var rolePermission in rolePermissions)
                    {
                        _rolePermission.Delete(rolePermission.Id);
                    }
                    _subMenu.Delete(id);

                    transaction.Complete();
                    _context.AcceptAllChanges();
                    return this.Direct(new { success = true, data = "SubMenu has been deleted successfully!" });
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
