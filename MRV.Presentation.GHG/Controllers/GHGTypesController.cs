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
    public class GHGTypesController : Controller
    {
        #region Members

        private readonly ObjectContext _context;
        private readonly BizGHGTypes _bizGHGTypes;
        

        #endregion

        #region Constructor

        public GHGTypesController()
        {
            _context = new ENTRO_MISEntities(Constants.ConnectionString);
            _bizGHGTypes = new BizGHGTypes(_context);
        }

        #endregion

        #region Actions

        public DirectResult Get(int id)
        {
            
            var objTypes = _bizGHGTypes.Get(id);
            var type = new
            {
                objTypes.Id,
                objTypes.Name,
                objTypes.Code,
                objTypes.IsDeleted


            };
            return this.Direct(new { success = true, data = type });
        }

        public DirectResult GetAll(int start, int limit, string sort, string dir, string record)
        {
            try
            {
                var hashtable = JsonConvert.DeserializeObject<Hashtable>(record);
                var filtered = _bizGHGTypes.GetAll();
                var count = filtered.Count();
                filtered = filtered.Skip(start).Take(limit);
                var type = filtered.Select(item => new
                {
                    item.Id,
                    item.Name,
                    item.Code, 
                    item.IsDeleted                    
                    
                }).Cast<object>().ToList();
                return this.Direct(new { total = count, data = type });
            }
            catch (Exception exception)
            {
                return this.Direct(new { success = false, data = exception.Message });
            }
        }

        [FormHandler]
        public DirectResult Save(GHGTypes tblGHGTypes)
        {
            using (var transaction = new TransactionScope())
            {
                _context.Connection.Open();
                try
                {  
                    if (tblGHGTypes.Id.Equals(0))
                    {
                        #region Check if the Code is not duplicated
                        var checkCode = _bizGHGTypes.GetAll().Where(e => e.Code.Equals(tblGHGTypes.Code, System.StringComparison.InvariantCultureIgnoreCase));

                        if (checkCode.Any())
                        {
                            return this.Direct(new { success = false, data = "There is an existing GHG Type Code. Please provide a different Code and try again!" });
                        }
                        #endregion

                        tblGHGTypes.IsDeleted = false;
                        _bizGHGTypes.AddNew(tblGHGTypes);
                    }
                    else
                    {
                        tblGHGTypes.IsDeleted = false;
                        _bizGHGTypes.Edit(tblGHGTypes);
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
                _bizGHGTypes.Delete(id);
                return this.Direct(new { success = true, data = "The selected GHG Type has been deleted successfully!" });
            }
            catch (Exception exception)
            {
                return this.Direct(new { success = false, data = exception.Message });
            }
        }

        public DirectResult GetAllGHGTypes()
        {
            var filtered = _bizGHGTypes.GetAll().Where(e => e.IsDeleted == false);
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
            var filtered = _bizGHGTypes.GetAll();
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
