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

namespace MRV.Presentation.GHG.Controllers
{
    public class MenusController : Controller
    {
        #region Members

        /*
         * Define reference to data context object
         */
        private readonly ObjectContext _context;

        /*
         * Define reference to business objects
         */
        private readonly Menus _menu;

        #endregion

        #region Constructor

        /// <summary>
        /// Initialize data context and business objects
        /// </summary>
        public MenusController()
        {
            _context = new ENTRO_MISEntities(Constants.ConnectionString);
           
            _menu = new Menus(_context);
        }

        #endregion

        #region Actions

        /// <summary>
        /// Get Menus by id
        /// </summary>
        /// <param name="id">Menus id</param>
        /// <returns>Menus object as json</returns>
        public ActionResult Get(int id)
        {
            var objMenus = _menu.Get(id);
            var menus = new
            {
                objMenus.Id,
                objMenus.SystemId,
                objMenus.Name,
                objMenus.Code,
                objMenus.IconCls
            };
            return this.Direct(new { success = true, data = menus });
        }

        /// <summary>
        /// Get list of Menuss
        /// </summary>
        /// <param name="start">page number</param>
        /// <param name="limit">page size</param>
        /// <param name="sort">sort field</param>
        /// <param name="dir">sort direction</param>
        /// <param name="record">additional params</param>
        /// <returns>list of Menus as json</returns>
        public ActionResult GetAll(int start, int limit, string sort, string dir, string record)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(record);
            int systemId;
            int.TryParse(hashtable["systemId"].ToString(), out systemId);
            var filtered = _menu.GetAll().OrderBy(c=> c.Code);
            var count = filtered.Count();
            filtered = (IOrderedEnumerable<sysMenus>) filtered.Skip(start).Take(limit);
            var menus = filtered.Select(menu => new
            {
                menu.Id,
                System =  menu.sysSystems.Name,
                menu.Name,
                menu.Code,
                menu.IconCls
            }).Cast<object>().ToList();
            var result = new { total = count, data = menus };
            return this.Direct(result);
        }

        /// <summary>
        /// Save Menus
        /// </summary>
        /// <param name="menu">Menus object</param>
        /// <returns>success or failure object as json</returns>
        [FormHandler]
        public ActionResult Save(sysMenus menu)
        {
            try
            {
                var objMenus = _menu.Find(m => m.SystemId == menu.SystemId && m.Name == menu.Name && m.Id != menu.Id);
                if (objMenus != null)
                {
                    var result = new { success = false, data = "Menus has already been registered!" };
                    return this.Direct(result);
                }
                if (menu.Id.Equals(0))
                {
                    _menu.AddNew(menu);
                }
                else
                {
                    _menu.Edit(menu);
                }
                return this.Direct(new { success = true, data = "Menus has been added successfully!" });
            }
            catch (Exception ex)
            {
                return this.Direct(new { success = false, data = ex.InnerException.Message });
            }
            
        }

        /// <summary>
        /// Delete Menus
        /// </summary>
        /// <param name="id">Menus id</param>
        /// <returns>success or failure object as json</returns>
        public ActionResult Delete(int id)
        {
            try
            {
                _menu.Delete(id);
                return this.Direct(new { success = true, data = "Menus has been deleted successfully!" });
            }
            catch (Exception ex)
            {
                return this.Direct(new { success = false, data = ex.InnerException.Message });
            }
        }

        #endregion
    }
}
