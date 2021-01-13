using System;
using System.Collections;
using System.Data.Objects;
using System.Linq;
using System.Web.Mvc;
using Ext.Direct.Mvc;
using Newtonsoft.Json;
using MRV.Business.GHG;
using MRV.Data.Model;
using MRV.Presentation.GHG.Classes;
using System.Collections.Generic;
using MRV.Data.Infrastructure;

namespace MRV.Presentation.GHG.Controllers
{
    public class SectorController : Controller
    {
        #region Members

        private readonly ObjectContext _context;
        private readonly BizGHGSectors _sectors;
        

        #endregion

        #region Constructor

        public SectorController()
        {
            _context = new ENTRO_MISEntities(Constants.ConnectionString);
            _sectors = new BizGHGSectors(_context);
            
        }

        #endregion

        #region Actions

        public ActionResult Get(int id)
        {
            var objSector = _sectors.Get(id);
            var sector = new
            {
                objSector.Id,
                objSector.Name,                
                objSector.Code,                
                objSector.ParentId,
                objSector.CanCaptureData
            };
            return this.Direct(new
            {
                success = true,
                data = sector
            });
        }

        public ActionResult GetAll(int start, int limit, string sort, string dir, string record)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(record);
            int sectorId;
            int.TryParse(hashtable["sectorId"].ToString(), out sectorId);


            var currentUser = Session[Constants.CurrentUser] as sysUser;

            var filtered = sectorId > 0
                               ? _sectors.FindAll(u => u.ParentId == sectorId)
                               : _sectors.FindAll(u => u.ParentId == null);
            var count = filtered.Count();
            filtered = filtered.Skip(start).Take(limit);
            var sectors = filtered.Select(sector => new
            {
                sector.Id,
                sector.Name,
                sector.Code,
                sector.ParentId,
                Parent = sector.GHGSectors2 == null ? "" : sector.GHGSectors2.Name
            }).Cast<object>().ToList();
            var result = new
            {
                total = count,
                data = sectors
            };
            return this.Direct(result);


        }



        public ActionResult PopulateTree(string nodeId)
        {

            int selectedNodeId;
            int.TryParse(nodeId, out selectedNodeId);
            var sectors = selectedNodeId == 0
                            ? _sectors.GetAll().Where(u => u.ParentId == null)
                            : _sectors.GetAll().Where(u => u.ParentId == selectedNodeId);
            var filtered = new ArrayList();
            foreach (var sect in sectors)
            {
                filtered.Add(new
                {
                    id = sect.Id,
                    text = sect.Code + " - " + sect.Name,

                    href = string.Empty,

                });
            }
            return this.Direct(filtered.ToArray());
        }

       


        [FormHandler]
        public ActionResult Save(GHGSectors sector)
        {
            var objSector = _sectors.Find(u =>  (u.Code.Equals(sector.Code) && u.Id != sector.Id));
            if (objSector != null)
            {
                var result = new { success = false, data = "Sector has already been registered!" };
                return this.Direct(result);
            }
            

           
            
            if (sector.Id.Equals(0))
            {
                _sectors.AddNew(sector);
            }
            else
            {
                _sectors.Edit(sector);
            }
            return this.Direct(new { success = true, data = "Sector has been added successfully!" });
        }

        public ActionResult Delete(int id)
        {
            var units = _sectors.FindAll(u => u.ParentId == id);
            if (units.Count() > 0) return this.Direct(new { success = false, data = "The system could not remove the selected sector. Try removing child sectors first please!" });
            _sectors.Delete(id);
            return this.Direct(new { success = true, data = "Sector has been successfully deleted!" });
        }

        public DirectResult Restructure(int childNodeId, int parentNodeId)
        {
            try
            {
                var objSector = _sectors.Get(childNodeId);
                objSector.ParentId = parentNodeId;
                _sectors.SaveChanges();

                return this.Direct(new { success = true, data = "Reordering completed successfully" });  
            }
            catch (Exception exception)
            {
                return this.Direct(new { success = false, data = exception.Message });    
            }
        }

        #endregion

        #region Methods

        private bool HasChildSectors(int sectorId)
        {
            var objSector = _sectors.Find(u => u.ParentId == sectorId);
            return objSector != null ? true: false;
        }

        #endregion
    }
}
