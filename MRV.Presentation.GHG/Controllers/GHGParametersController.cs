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
    public class ParameterController : Controller
    {
        #region Members

        private readonly ObjectContext _context;
        private readonly BizGHGParameters _parameters;
        private readonly BizGHGSectors _sectors;

        #endregion

        #region Constructor

        public ParameterController()
        {
            _context = new ENTRO_MISEntities(Constants.ConnectionString);
            _parameters = new BizGHGParameters(_context);
            _sectors = new BizGHGSectors(_context);
        }

        #endregion

        #region Actions

        public ActionResult Get(int id)
        {
            var objParameter = _parameters.Get(id);
            var parameter = new
            {
                objParameter.Id,
                objParameter.Name,
                objParameter.ParameterID,
                objParameter.SectorId,
                objParameter.DataTypeId,
                objParameter.GHGTypeId,
                objParameter.UnitId,
                objParameter.IsDeleted
            };
            return this.Direct(new
            {
                success = true,
                data = parameter
            });
        }

        public ActionResult GetAll(int start, int limit, string sort, string dir, string record)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(record);
            int sectorId;
            int.TryParse(hashtable["sectorId"].ToString(), out sectorId);


            var currentUser = Session[Constants.CurrentUser] as sysUser;
            var filtered = _parameters.GetAll().Where(o=> o.SectorId == sectorId && !o.IsDeleted);
            var count = filtered.Count();
            filtered = filtered.Skip(start).Take(limit);
            var parameter = filtered.Select(item => new
            {
                item.Id,
                item.Name,
                item.ParameterID,
                item.SectorId,
                item.DataTypeId,
                TypeOfData = item.GHGDataTypes.Name, 
                item.GHGTypeId,
                GHGType = item.GHGTypes.Name,
                item.UnitId,
                UOM = item.GHGUnits.Name,
                item.IsDeleted

            }).Cast<object>().ToList();
            var result = new
            {
                total = count,
                data = parameter
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
        public void Save(GHGSectors parameter)
        {
            //var objParameter = _parameters.Find(u =>  (u.Code.Equals(parameter.Code) && u.Id != parameter.Id));
            //if (objParameter != null)
            //{
            //    var result = new { success = false, data = "Sector has already been registered!" };
            //    return this.Direct(result);
            //}
            

           
            
            //if (parameter.Id.Equals(0))
            //{
            //    _parameters.AddNew(parameter);
            //}
            //else
            //{
            //    _parameters.Edit(parameter);
            //}
            //return this.Direct(new { success = true, data = "Sector has been added successfully!" });
        }

        public void Delete(int id)
        {
            //var units = _parameters.FindAll(u => u.ParentId == id);
            //if (units.Count() > 0) return this.Direct(new { success = false, data = "The system could not remove the selected parameter. Try removing child sectors first please!" });
            //_parameters.Delete(id);
            //return this.Direct(new { success = true, data = "Sector has been successfully deleted!" });
        }

        public DirectResult Restructure(int childNodeId, int parentNodeId)
        {
            try
            {
                var objSector = _sectors.Get(childNodeId);
                objSector.ParentId = parentNodeId;
                _parameters.SaveChanges();

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
