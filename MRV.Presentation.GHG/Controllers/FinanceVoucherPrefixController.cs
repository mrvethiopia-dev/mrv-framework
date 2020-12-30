using System.Collections.Generic;
using System.Data.Objects;
using System.Linq;
using System.Web.Mvc;
using NBI.Data.Model;
using Ext.Direct.Mvc;

using NBI.Business.Tsa;
using NBI.Presentation.Tsa.Classes;
using Newtonsoft.Json;
using System.Collections;
using System;
using System.Transactions;

namespace NBI.Presentation.Tsa.Controllers
{
    public class FinanceVoucherPrefixController: Controller
    {

        #region Members

        private readonly ObjectContext _context;
        private readonly FinanceVoucherPrefix _voucherPrefix;

        #endregion

        #region Constructor

        public FinanceVoucherPrefixController()
        {
            _context = new ENTRO_MISEntities(Constants.ConnectionString);
            _voucherPrefix = new FinanceVoucherPrefix(_context);
        }

        #endregion

        #region Actions

        public DirectResult Get(Guid id)
        {
            var objVoucherPrefix = _voucherPrefix.Get(id);
            var voucherPrefix = new
            {
                objVoucherPrefix.Id,
                objVoucherPrefix.Code,
                objVoucherPrefix.Name,
                objVoucherPrefix.CreatedAt

            };
            return this.Direct(new
            {
                success = true,
                data = voucherPrefix
            });
        }
   
        public DirectResult GetAll(int start, int limit, string sort, string dir)
        {
            var filtered = _voucherPrefix.GetAll();
            var count = filtered.Count();
            filtered = filtered.Skip(start).Take(limit);
            filtered = filtered.OrderBy(o => o.Code);
            var voucherPrefix = filtered.Select(VoucherPrefix => new
            {
                VoucherPrefix.Id,
                VoucherPrefix.Code,
                VoucherPrefix.Name,
                VoucherPrefix.IsDeleted,
                VoucherPrefix.LastUpdated
            }).Cast<object>().ToList();
            var result = new { total = count, data = voucherPrefix };
            return this.Direct(result);
        }
        
        [FormHandler]
        public DirectResult Save(FinVoucherPrefix voucherPrefix)
        {
            if (voucherPrefix.Id == Guid.Empty)
            {
                var voucherPrefixes = _voucherPrefix.GetAll();
                var objVoucherPrefixs = voucherPrefixes.Where(o => o.Code.Equals(voucherPrefix.Code)).SingleOrDefault();
                if (objVoucherPrefixs != null) 
                {
                    var result = new { success = false, data = "The Voucher Prefix has already been registered!" };
                    return this.Direct(result);
                }
                voucherPrefix.Id = Guid.NewGuid();
                _voucherPrefix.AddNew(voucherPrefix);
            }
            else
            {
                _voucherPrefix.Edit(voucherPrefix);
            }
            return this.Direct(new { success = true, data = "Voucher Prefix has been added successfully!" });
        }

        public DirectResult Delete(Guid id)
        {
            _voucherPrefix.Delete(id);
            return this.Direct("Voucher Prefix has been successfully deleted!");
        }

        #endregion
    }
}