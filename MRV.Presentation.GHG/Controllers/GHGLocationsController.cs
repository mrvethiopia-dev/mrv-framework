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
    public class LocationController : Controller
    {
        #region Members

        private readonly ObjectContext _context;
        private readonly BizGHGLocations _locations;
        

        #endregion

        #region Constructor

        public LocationController()
        {
            _context = new ENTRO_MISEntities(Constants.ConnectionString);
            _locations = new BizGHGLocations(_context);
            
        }

        #endregion

        #region Actions

        public ActionResult Get(int id)
        {
            var objlocation = _locations.Get(id);
            var location = new
            {
                objlocation.Id,
                objlocation.Name,                
                objlocation.Code,                
                objlocation.ParentId,
                objlocation.CanCaptureData,
                objlocation.LocationTypeId
            };
            return this.Direct(new
            {
                success = true,
                data = location
            });
        }

        public ActionResult GetAll(int start, int limit, string sort, string dir, string record)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(record);
            int locationId;
            int.TryParse(hashtable["locationId"].ToString(), out locationId);


            var currentUser = Session[Constants.CurrentUser] as sysUser;

            var filtered = locationId > 0
                               ? _locations.FindAll(u => u.ParentId == locationId)
                               : _locations.FindAll(u => u.ParentId == null);
            var count = filtered.Count();
            filtered = filtered.Skip(start).Take(limit);
            var locations = filtered.Select(location => new
            {
                location.Id,
                location.Name,
                location.Code,
                location.ParentId,
                location.LocationTypeId,
                Parent = location.GHGLocations2 == null ? "" : location.GHGLocations2.Name
            }).Cast<object>().ToList();
            var result = new
            {
                total = count,
                data = locations
            };
            return this.Direct(result);


        }



        public ActionResult PopulateTree(string nodeId)
        {

            int selectedNodeId;
            int.TryParse(nodeId, out selectedNodeId);
            var locations = selectedNodeId == 0
                            ? _locations.GetAll().Where(u => u.ParentId == null)
                            : _locations.GetAll().Where(u => u.ParentId == selectedNodeId);
            var filtered = new ArrayList();
            foreach (var sect in locations)
            {
                filtered.Add(new
                {
                    id = sect.Id,
                    text =  sect.Name,

                    href = string.Empty,

                });
            }
            return this.Direct(filtered.ToArray());
        }

       


        [FormHandler]
        public ActionResult Save(GHGLocations location)
        {
            var objlocation = _locations.Find(u =>  (u.Code.Equals(location.Code) && u.Id != location.Id));
            if (objlocation != null)
            {
                var result = new { success = false, data = "Location has already been registered!" };
                return this.Direct(result);
            }
            

           
            
            if (location.Id.Equals(0))
            {
                _locations.AddNew(location);
            }
            else
            {
                _locations.Edit(location);
            }
            return this.Direct(new { success = true, data = "Location has been added successfully!" });
        }

        public ActionResult Delete(int id)
        {
            var units = _locations.FindAll(u => u.ParentId == id);
            if (units.Count() > 0) return this.Direct(new { success = false, data = "The system could not remove the selected location. Try removing child locations first please!" });
            _locations.Delete(id);
            return this.Direct(new { success = true, data = "Location has been successfully deleted!" });
        }

        public DirectResult Restructure(int childNodeId, int parentNodeId)
        {
            try
            {
                var objlocation = _locations.Get(childNodeId);
                objlocation.ParentId = parentNodeId;
                _locations.SaveChanges();

                return this.Direct(new { success = true, data = "Reordering completed successfully" });  
            }
            catch (Exception exception)
            {
                return this.Direct(new { success = false, data = exception.Message });    
            }
        }

        #endregion

        #region Methods

        private bool HasChildlocations(int locationId)
        {
            var objlocation = _locations.Find(u => u.ParentId == locationId);
            return objlocation != null ? true: false;
        }

        #endregion
    }
}
