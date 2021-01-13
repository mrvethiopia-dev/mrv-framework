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
    public class GHGDataTypesController : Controller
    {
        #region Members

        private readonly ObjectContext _context;
        private readonly BizGHGDataTypes _bizGHGDataTypes;
        

        #endregion

        #region Constructor

        public GHGDataTypesController()
        {
            _context = new ENTRO_MISEntities(Constants.ConnectionString);
            _bizGHGDataTypes = new BizGHGDataTypes(_context);
        }

        #endregion

        #region Actions

        public DirectResult Get(int id)
        {
            
            var objDataType = _bizGHGDataTypes.Get(id);
            var dataType = new
            {
                objDataType.Id,
                objDataType.Name,
                objDataType.Code,
                objDataType.IsDeleted


            };
            return this.Direct(new { success = true, data = dataType });
        }

        public DirectResult GetAll(int start, int limit, string sort, string dir, string record)
        {
            try
            {
                var hashtable = JsonConvert.DeserializeObject<Hashtable>(record);
                var filtered = _bizGHGDataTypes.GetAll();
                var count = filtered.Count();
                filtered = filtered.Skip(start).Take(limit);
                var dataType = filtered.Select(item => new
                {
                    item.Id,
                    item.Name,
                    item.Code, 
                    item.IsDeleted                    
                    
                }).Cast<object>().ToList();
                return this.Direct(new { total = count, data = dataType });
            }
            catch (Exception exception)
            {
                return this.Direct(new { success = false, data = exception.Message });
            }
        }

        [FormHandler]
        public DirectResult Save(GHGDataTypes tblDataTypes)
        {
            using (var transaction = new TransactionScope())
            {
                _context.Connection.Open();
                try
                {  
                    if (tblDataTypes.Id.Equals(0))
                    {
                        #region Check if the Code is not duplicated
                        var checkCode = _bizGHGDataTypes.GetAll().Where(e => e.Code.Equals(tblDataTypes.Code, System.StringComparison.InvariantCultureIgnoreCase));

                        if (checkCode.Any())
                        {
                            return this.Direct(new { success = false, data = "There is an existing Data Type Code. Please provide a different Code and try again!" });
                        }
                        #endregion

                        tblDataTypes.IsDeleted = false;
                        _bizGHGDataTypes.AddNew(tblDataTypes);
                    }
                    else
                    {
                        tblDataTypes.IsDeleted = false;
                        _bizGHGDataTypes.Edit(tblDataTypes);
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
                _bizGHGDataTypes.Delete(id);
                return this.Direct(new { success = true, data = "The selected Data Type has been deleted successfully!" });
            }
            catch (Exception exception)
            {
                return this.Direct(new { success = false, data = exception.Message });
            }
        }

        public DirectResult GetDataTypesQuery(object typeName)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(JsonConvert.SerializeObject(typeName));
            int start;
            int.TryParse(hashtable["start"].ToString(), out start);
            int limit;
            int.TryParse(hashtable["limit"].ToString(), out limit);
            var queryParam = hashtable["query"].ToString();

            var filtereed = _bizGHGDataTypes.GetAll().Where(s => (s.Name).StartsWith(queryParam, StringComparison.OrdinalIgnoreCase) || s.Name.StartsWith(queryParam, StringComparison.OrdinalIgnoreCase) || s.Name.psContains(queryParam, StringComparison.OrdinalIgnoreCase)).OrderBy(c => c.Code);
            var count = filtereed.Count();
            filtereed = filtereed.Skip(start).Take(limit).OrderBy(c => c.Code);
            var accounts = filtereed.Select(a => new
            {
                a.Id,
                a.Name,
                a.Code,

            });
            return this.Direct(new
            {
                total = count,
                data = accounts
            });
        }
        public DirectResult GetAllDataTypes()
        {
            var filtered = _bizGHGDataTypes.GetAll().Where(e => e.IsDeleted == false);
            var lookup = filtered.Select(a => new { a.Id, a.Name,  }).Cast<object>().ToList();
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
            var filtered = _bizGHGDataTypes.GetAll();
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
