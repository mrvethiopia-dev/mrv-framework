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
    public class GHGInventoryYearsController : Controller
    {
        #region Members

        private readonly ObjectContext _context;
        private readonly BizGHGInventoryYears _bizGHGInventoryYears;
        

        #endregion

        #region Constructor

        public GHGInventoryYearsController()
        {
            _context = new ENTRO_MISEntities(Constants.ConnectionString);
            _bizGHGInventoryYears = new BizGHGInventoryYears(_context);
        }

        #endregion

        #region Actions

        public DirectResult Get(int id)
        {
            
            var objPayrolItem = _bizGHGInventoryYears.Get(id);
            var pItem = new
            {
                objPayrolItem.Id,
                objPayrolItem.Name                
                
            };
            return this.Direct(new { success = true, data = pItem });
        }

        public DirectResult GetAll(int start, int limit, string sort, string dir, string record)
        {
            try
            {
                var hashtable = JsonConvert.DeserializeObject<Hashtable>(record);
                var filtered = _bizGHGInventoryYears.GetAll();
                var count = filtered.Count();
                filtered = filtered.Skip(start).Take(limit);
                var pItem = filtered.Select(item => new
                {
                    item.Id,
                    item.Name
                    
                }).Cast<object>().ToList();
                return this.Direct(new { total = count, data = pItem });
            }
            catch (Exception exception)
            {
                return this.Direct(new { success = false, data = exception.Message });
            }
        }

        [FormHandler]
        public DirectResult Save(GHGInventoryYear tblInventoryYear)
        {
            using (var transaction = new TransactionScope())
            {
                _context.Connection.Open();
                try
                {  
                    if (tblInventoryYear.Id.Equals(0))
                    {
                        #region Check if the Identity Number is not duplicated
                        var checkDeptCode = _bizGHGInventoryYears.GetAll().Where(e => e.Name.Equals(tblInventoryYear.Name, System.StringComparison.InvariantCultureIgnoreCase));

                        if (checkDeptCode.Any())
                        {
                            return this.Direct(new { success = false, data = "There is an existing Inventory Year with the specified NAme. Please provide a different NAme and try again!" });
                        }
                        #endregion

                        tblInventoryYear.IsDeleted = false;
                        _bizGHGInventoryYears.AddNew(tblInventoryYear);
                    }
                    else
                    {
                        tblInventoryYear.IsDeleted = false;
                        _bizGHGInventoryYears.Edit(tblInventoryYear);
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
                _bizGHGInventoryYears.Delete(id);
                return this.Direct(new { success = true, data = "The selected Inventory Year has been deleted successfully!" });
            }
            catch (Exception exception)
            {
                return this.Direct(new { success = false, data = exception.Message });
            }
        }

        #endregion

        public void ExportToExcel()
        {
            var filtered = _bizGHGInventoryYears.GetAll();
            var Items = filtered.Select(item => new
            {
                //item.Id,
                item.Name
                


            }).Cast<object>();
            //var exportToExcelHelper = new ExportToExcelHelper();
            //exportToExcelHelper.ToExcel(Response, Items);



        }
    }

   
}
