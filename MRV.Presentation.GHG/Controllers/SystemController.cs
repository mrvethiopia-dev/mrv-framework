using System;
using System.Data.Objects;
using System.Linq;
using System.Web.Mvc;
using Ext.Direct.Mvc;
using MRV.Business.GHG;
using MRV.Data.Model;
using MRV.Presentation.GHG.Classes;

namespace MRV.Presentation.GHG.Controllers
{
    public class SubsystemController : Controller
    {
        #region Members

        private readonly Systems _subsystem;

        #endregion

        #region Constructor

        public SubsystemController()
        {
            ObjectContext context = new ENTRO_MISEntities(Constants.ConnectionString);
            _subsystem = new Systems(context);
        }

        #endregion

        #region Actions

        public ActionResult Get(int id)
        {
            var element = _subsystem.Get(id);
            var subsystem = new
            {
                element.Id,
                element.Name,
                element.Code
            };
            return this.Direct(new { success = true, data = subsystem });
        }

        public ActionResult GetAll(int start, int limit, string sort, string dir)
        {
            var count = _subsystem.Count();
            var filtered = _subsystem.GetAll(start, limit);
            var elements = filtered.Select(item => new
            {
                item.Id,
                item.Name,
                item.Code
            }).Cast<object>().ToList();
            var result = new { total = count, data = elements };
            return this.Direct(result);
        }

        [FormHandler]
        public ActionResult Save(sysSystems subsystem)
        {
            try
            {
                var objSubsystem = _subsystem.Find(s => s.Name == subsystem.Name && s.Id != subsystem.Id);
                if (objSubsystem != null)
                {
                    var result = new { success = false, data = "Subsystem has already been registered!" };
                    return this.Direct(result);
                }
                if (subsystem.Id.Equals(0))
                {
                    _subsystem.AddNew(subsystem);
                }
                else
                {
                    _subsystem.Edit(subsystem);
                }
                return this.Direct(new { success = true, data = "Subsystem has been added successfully!" });
            }
            catch (Exception ex)
            {
                return this.Direct(new { success = false, data = ex.InnerException.Message });
            }
        }

        public ActionResult Delete(int id)
        {
            try
            {
                _subsystem.Delete(id);
                return this.Direct(new { success = true, data = "Subsystem has been deleted successfully!" });
            }
            catch (Exception ex)
            {
                return this.Direct(new { success = false, data = ex.InnerException != null ? ex.InnerException.Message : ex.Message });
            }
        }

        #endregion
    }
}
