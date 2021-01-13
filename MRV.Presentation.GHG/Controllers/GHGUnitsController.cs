using System.Collections.Generic;
using System.Data.Objects;
using System.Linq;
using System.Web.Mvc;
using Ext.Direct.Mvc;
using Newtonsoft.Json;
using System.Collections;
using System;
using System.Transactions;
using MRV.Business.GHG;
using MRV.Data.Model;
using MRV.Presentation.GHG.Classes;

namespace MRV.Presentation.GHG.Controllers
{
    public class GHGUnitsController : Controller
    {
        #region Members

        private readonly ObjectContext _context;
        private readonly BizGHGUnits _bizGHGUnits;
        

        #endregion

        #region Constructor

        public GHGUnitsController()
        {
            _context = new ENTRO_MISEntities(Constants.ConnectionString);
            _bizGHGUnits = new BizGHGUnits(_context);
        }

        #endregion

        #region Actions

        public DirectResult Get(int id)
        {
            
            var objUnits = _bizGHGUnits.Get(id);
            var unit = new
            {
                objUnits.Id,
                objUnits.Name,
                objUnits.Code,
                objUnits.IsDeleted


            };
            return this.Direct(new { success = true, data = unit });
        }

        public DirectResult GetAll(int start, int limit, string sort, string dir, string record)
        {
            try
            {
                var hashtable = JsonConvert.DeserializeObject<Hashtable>(record);
                var filtered = _bizGHGUnits.GetAll();
                var count = filtered.Count();
                filtered = filtered.Skip(start).Take(limit);
                var unit = filtered.Select(item => new
                {
                    item.Id,
                    item.Name,
                    item.Code, 
                    item.IsDeleted                    
                    
                }).Cast<object>().ToList();
                return this.Direct(new { total = count, data = unit });
            }
            catch (Exception exception)
            {
                return this.Direct(new { success = false, data = exception.Message });
            }
        }

        [FormHandler]
        public DirectResult Save(GHGUnits tblUnits)
        {
            using (var transaction = new TransactionScope())
            {
                _context.Connection.Open();
                try
                {  
                    if (tblUnits.Id.Equals(0))
                    {
                        #region Check if the Code is not duplicated
                        var checkCode = _bizGHGUnits.GetAll().Where(e => e.Code.Equals(tblUnits.Code, System.StringComparison.InvariantCultureIgnoreCase));

                        if (checkCode.Any())
                        {
                            return this.Direct(new { success = false, data = "There is an existing Unit Code. Please provide a different Code and try again!" });
                        }
                        #endregion

                        tblUnits.IsDeleted = false;
                        _bizGHGUnits.AddNew(tblUnits);
                    }
                    else
                    {
                        tblUnits.IsDeleted = false;
                        _bizGHGUnits.Edit(tblUnits);
                    }
                    transaction.Complete();
                    _context.AcceptAllChanges();
                    return this.Direct(new { success = true, data = "Successfully Saved!" });
                }
                catch (Exception exception)
                {
                    return this.Direct(new { success = false, data = exception.Message });
                }
            }
        }

        public DirectResult Delete(int id)
        {
            try
            {
                _bizGHGUnits.Delete(id);
                return this.Direct(new { success = true, data = "The selected Unit has been deleted successfully!" });
            }
            catch (Exception exception)
            {
                return this.Direct(new { success = false, data = exception.Message });
            }
        }

        public DirectResult GetAllUnits()
        {
            var filtered = _bizGHGUnits.GetAll().Where(e => e.IsDeleted == false);
            var lookup = filtered.Select(a => new { a.Id, a.Name, }).Cast<object>().ToList();
            var result = new
            {
                total = lookup.Count(),
                data = lookup
            };
            return this.Direct(result);
        }
        #endregion

        public void ExportToExcel()
        {
            var filtered = _bizGHGUnits.GetAll();
            var Items = filtered.Select(item => new
            {
                //item.Id,
                item.Name,
                item.Code
                
                


            }).Cast<object>();
            //var exportToExcelHelper = new ExportToExcelHelper();
            //exportToExcelHelper.ToExcel(Response, Items);



        }
    }

   
}
