namespace CyberErp.Presentation.Payroll.Web.Controllers
{
    using System;
    using System.Collections;
    using System.Collections.Generic;
    using System.Data.Objects;
    using System.Linq;
    using System.Text;
    using System.Transactions;
    using System.Web.Mvc;
    using CyberErp.Business.Component.Core;
    
    using CyberErp.Business.Component.Hrms;
    using CyberErp.Business.Component.Payroll;
    using CyberErp.Data.Model;
    using CyberErp.Presentation.Payroll.Web.Classes;
    using Ext.Direct.Mvc;
    using Newtonsoft.Json;


    public class IfmsController : Controller
    {
        #region Members

        private readonly ObjectContext _context;
        private readonly CyberErp.Business.Component.Core.Lookups _lookup;
        private readonly CostCenter _costCenter;
        private readonly AccountCategory _accountCategory;
        private readonly AccountType _accountType;
        private readonly AccountGroup _accountGroup;
        private readonly ControlAccount _controlAccount;
        private readonly SubsidiaryAccount _subsidiaryAccount;
        private readonly FiscalYear _fiscalYear;
        private readonly Period _period;
        //private readonly FixedAssetCategory _fixedAssetCategory;
        //private readonly FixedAsset _fixedAsset;
        private readonly CyberErp.Business.Component.Core.Position _position;
        private readonly Unit _unit;
        private readonly Employee _employee;
        private readonly Person _person;
        private readonly PayrollItems _pItems;
        private readonly PayrollEmployeerPayrollItems _orgsPItems;
        

        private readonly PayrollTransactions _payrollTrans;
        
        PayrollSettings _payrollSettings;

        #endregion

        #region Constructor

        public IfmsController()
        {
            _context = new CERPEntities(Constants.ConnectionString);
            _lookup = new CyberErp.Business.Component.Core.Lookups(_context);
            _costCenter = new CostCenter(_context);
            _accountCategory = new AccountCategory(_context);
            _accountType = new AccountType(_context);
            _accountGroup = new AccountGroup(_context);
            _controlAccount = new ControlAccount(_context);
            _subsidiaryAccount = new SubsidiaryAccount(_context);
            _fiscalYear = new FiscalYear(_context);
            _period = new Period(_context);
            //_fixedAssetCategory = new FixedAssetCategory(_context);
            //_fixedAsset = new FixedAsset(_context);
            _position = new Position(_context);
            _unit = new Unit(_context);
            _employee = new Employee(_context);
            _person = new Person(_context);
            _pItems = new PayrollItems(_context);
            
            _payrollSettings = new PayrollSettings(_context);
        
          
            this._orgsPItems = new PayrollEmployeerPayrollItems(this._context);
            this._payrollTrans = new PayrollTransactions(this._context);
            

        }

        #endregion

        #region Actions

        public DirectResult GetAccountCategories()
        {
            var filtered = _accountCategory.GetAll();
            var count = filtered.Count();
            var accountCategories = filtered.Select(a => new { a.Id, a.Name }).Cast<object>().ToList();
            var result = new
            {
                total = count,
                data = accountCategories
            };
            return this.Direct(result);
        }

        public DirectResult GetControlAccountsByCategory(string accountCategoryId)
        {
            int id;
            int.TryParse(accountCategoryId, out id);
            var filtered = id != 0 ? _controlAccount.GetAll().Where(a => a.coreAccountGroup.coreAccountType.AccountCategoryId == id) : _controlAccount.GetAll();
            var count = filtered.Count();
            var controlAccounts = filtered.Select(a => new { a.Id, a.Name, Code = string.Format("{0}-{1}", a.Code, a.Name) }).Cast<object>().ToList();
            var result = new
            {
                total = count,
                data = controlAccounts
            };
            return this.Direct(result);
        }

        public DirectResult GetFiscalYears()
        {
            var filtered = _fiscalYear.GetAll();
            var fiscalYears = filtered.Select(fiscalYear => new
            {
                fiscalYear.Id,
                fiscalYear.Name
            });
            var result = new
            {
                total = fiscalYears.Count(),
                data = fiscalYears
            };
            return this.Direct(result);
        }

        public DirectResult GetTransportPItemId(int pitem)
        {
            int TransportAllowanceID = int.Parse(_payrollSettings.Get(Constants.TransportPItemId).SettingValue);
            string ll = "ll";

            var result = new { success = true, TransId = ll, data = "" };

            return this.Direct(result);
        }

        public DirectResult GetPeriods()
        {
            DateTime activeYear = DateTime.Today;

            int currYear = Convert.ToInt16(activeYear.Year);

            string currentYear = activeYear.Year + "/" + currYear;
            var filtered = _period.GetAll().Where(p => p.coreFiscalYear.Name == currentYear);
            var count = filtered.Count();
            var periods = filtered.Select(period => new
            {
                period.Id,
                period.Name
            });

            var result = new
            {
                total = count,
                data = periods
            };
            return this.Direct(result);
        }

        public DirectResult GetActivePeriods()
        {
            var objActiveFiscalYear = _fiscalYear.Find(f => f.IsActive == true);
            var filtered = objActiveFiscalYear != null ? _period.GetAll().Where(p => p.FiscalYearId.Equals(objActiveFiscalYear.Id)) : _period.GetAll();
            var count = filtered.Count();
            var periods = filtered.Select(period => new
            {
                period.Id,
                period.Name
            });
            var result = new
            {
                total = count,
                data = periods
            };
            return this.Direct(result);
        }

        public DirectResult GetPeriodsFiltered(int PeriodId)
        {
            var objActiveFiscalYear = _fiscalYear.Find(f => f.IsActive == true);
            var filtered = objActiveFiscalYear != null ? _period.GetAll().Where(p => p.FiscalYearId.Equals(objActiveFiscalYear.Id)) : _period.GetAll();
            var selectedPeriod = filtered.FirstOrDefault(p => p.Id == PeriodId);
            var remainingPeriods = filtered.Where(p => p.StartDate > selectedPeriod.StartDate).ToList();
            var count = remainingPeriods.Count();
            var periods = remainingPeriods.Select(period => new
            {
                period.Id,
                period.Name
            });
            var result = new
            {
                total = count,
                data = periods
            };
            return this.Direct(result);
        }

        public DirectResult GetCostCenters()
        {
            var filtered = _costCenter.GetAll();
            var costCenters = filtered.Select(costCenter => new
            {
                costCenter.Id,
                costCenter.Name,
                costCenter.Code
            });
            var result = new
            {
                total = costCenters.Count(),
                data = costCenters
            };
            return this.Direct(result);
        }

        public DirectResult GetControlAccounts()
        {
            var filtered = _controlAccount.GetAll();
            var count = filtered.Count();
            var controlAccounts = filtered.Select(a =>
                new
                {
                    a.Id,
                    a.Name,
                    Code = string.Format("{0}-{1}", a.Code, a.Name)
                }).Cast<object>().ToList();
            var result = new
            {
                total = count,
                data = controlAccounts
            };
            var kk = this.Direct(result);
            return this.Direct(result);
        }

        public DirectResult GetSubsidiaryAccounts(string controlAccountId)
        {
            int id;
            int.TryParse(controlAccountId, out id);
            var filtered = id > 0 ? _subsidiaryAccount.GetAll().Where(a => a.ControlAccountId.Equals(id)) : _subsidiaryAccount.GetAll();
            var count = filtered.Count();
            var subsidiaryAccounts = filtered.Select(a => new { a.Id, a.Name, Code = string.Format("{0}-{1}", a.Code, a.Name) }).Cast<object>().ToList();
            var result = new
            {
                total = count,
                data = subsidiaryAccounts
            };
            return this.Direct(result);
        }

        public DirectResult GetCapitalAccounts()
        {
            List<object> accountsList = new List<object>();
            var objAccountCategory = _accountCategory.Find(c => c.Name == "Capital");
            var accountTypes = _accountType.GetAll().Where(t => t.AccountCategoryId == objAccountCategory.Id);
            foreach (var accountType in accountTypes)
            {
                var accountGroups = _accountGroup.GetAll().Where(g => g.AccountTypeId == accountType.Id);
                foreach (var accountGroup in accountGroups)
                {
                    var controlAccounts = _controlAccount.GetAll().Where(c => c.AccountGroupId == accountGroup.Id);
                    foreach (var controlAccount in controlAccounts)
                    {
                        var subsidiaryAccounts = _subsidiaryAccount.GetAll().Where(s => s.ControlAccountId == controlAccount.Id).ToList();

                        foreach (var subsidiaryAccount in subsidiaryAccounts)
                        {
                            accountsList.Add(new
                            {
                                subsidiaryAccount.Id,
                                Name = subsidiaryAccount.Name,
                                Code = string.Format("{0}-{1}", subsidiaryAccount.coreControlAccount.Code, subsidiaryAccount.Code)
                            });
                        }
                    }
                }
            }
            var count = accountsList != null ? accountsList.Count() : 0;
            var result = new
            {
                total = count,
                data = accountsList
            };
            return this.Direct(result);
        }

        public DirectResult GetPagedSLByControlAccount(int start, int limit, string sort, string dir, string record)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(record);
            List<coreSubsidiaryAccount> slAccountList = new List<coreSubsidiaryAccount>();

            int controlAccountId;
            int.TryParse(hashtable["controlAccountId"].ToString(), out controlAccountId);

            var filtered = controlAccountId != 0 ? _subsidiaryAccount.GetAll().Where(s => s.ControlAccountId == controlAccountId) : _subsidiaryAccount.GetAll();
            var count = filtered.Count();
            filtered = filtered.Skip(start).Take(limit);
            var slAccounts = filtered.Select(slAccount => new
            {
                slAccount.Id,
                Name = slAccount.Name + "(" + slAccount.coreControlAccount.Code + "-" + slAccount.Code + ")",
                ControlAccountId = slAccount.ControlAccountId,
                ControlAccountCode = slAccount.coreControlAccount.Code,
                ControlAccountName = slAccount.coreControlAccount.Name,
                SLAccountCode = slAccount.Code,
                SLAccountName = slAccount.Name,
            });
            var result = new
            {
                total = count,
                data = slAccounts
            };
            return this.Direct(result);
        }

        public DirectResult GetSLAccount()
        {
            var filtered = _subsidiaryAccount.GetAll();
            var slAccounts = filtered.Select(slAccount => new
            {
                SLAccount = slAccount.coreControlAccount.Code + "-" + slAccount.Code + "  " + slAccount.Name,
                slAccount.Id,
                slAccount.Name
            });
            var result = new
            {
                total = slAccounts.Count(),
                data = slAccounts
            };
            return this.Direct(result);
        }

        
        
        private DirectResult Search(string table)
        {
            return this.Direct(new { });
        }

        public ActionResult GetPagedEmployee(int start, int limit, string sort, string dir, string record)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(record);
            int unitId;
            int.TryParse(hashtable["unitId"].ToString(), out unitId);

            IEnumerable<hrmsEmployee> employeeList;
            int genderId;
            string searchBy;
            string criteria;
            string searchValue;
            string searchParam;
            searchParam = hashtable["searchParam"] == null ? "" : hashtable["searchParam"].ToString();
            searchBy = searchParam.Split(';')[0];

            var coreSubAccounts = this._subsidiaryAccount.GetAll();

            if (unitId > 0)
            {
                employeeList = _employee.GetAll().Where(e => e.IsTerminated == false && e.corePosition.UnitId == unitId);
                if (searchBy != "")
                {
                    if (searchBy == "Gender")
                    {
                        int.TryParse(searchParam.Split(';')[1], out genderId);
                        employeeList = employeeList.Where(e => e.corePerson.GenderId == genderId);
                    }
                    else
                    {
                        criteria = searchParam.Split(';')[1];
                        searchValue = searchParam.Split(';')[2];
                        if (searchBy == "Identity No.")
                        {
                            if (criteria == "Starts With") employeeList = employeeList.Where(e => e.IdentityNumber.StartsWith(searchValue, StringComparison.OrdinalIgnoreCase));
                            else if (criteria == "Contains") employeeList = employeeList.Where(e => e.IdentityNumber.ToUpper().Contains(searchValue.ToUpper()));
                            else if (criteria == "Ends With") employeeList = employeeList.Where(e => e.IdentityNumber.EndsWith(searchValue, StringComparison.OrdinalIgnoreCase));
                        }
                        else if (searchBy == "First Name")
                        {
                            if (criteria == "Starts With") employeeList = employeeList.Where(e => e.corePerson.FirstName.StartsWith(searchValue, StringComparison.OrdinalIgnoreCase));
                            else if (criteria == "Contains") employeeList = employeeList.Where(e => e.corePerson.FirstName.ToUpper().Contains(searchValue.ToUpper()));
                            else if (criteria == "Ends With") employeeList = employeeList.Where(e => e.corePerson.FirstName.EndsWith(searchValue, StringComparison.OrdinalIgnoreCase));
                        }
                        else if (searchBy == "Middle Name")
                        {
                            if (criteria == "Starts With") employeeList = employeeList.Where(e => e.corePerson.FatherName.StartsWith(searchValue, StringComparison.OrdinalIgnoreCase));
                            else if (criteria == "Contains") employeeList = employeeList.Where(e => e.corePerson.FatherName.ToUpper().Contains(searchValue.ToUpper()));
                            else if (criteria == "Ends With") employeeList = employeeList.Where(e => e.corePerson.FatherName.EndsWith(searchValue, StringComparison.OrdinalIgnoreCase));
                        }
                        else if (searchBy == "Last Name")
                        {
                            if (criteria == "Starts With") employeeList = employeeList.Where(e => e.corePerson.GrandFatherName.StartsWith(searchValue, StringComparison.OrdinalIgnoreCase));
                            else if (criteria == "Contains") employeeList = employeeList.Where(e => e.corePerson.GrandFatherName.ToUpper().Contains(searchValue.ToUpper()));
                            else if (criteria == "Ends With") employeeList = employeeList.Where(e => e.corePerson.GrandFatherName.EndsWith(searchValue, StringComparison.OrdinalIgnoreCase));
                        }
                    }
                }
            }
            else
            {
                employeeList = _employee.GetAll().Where(e => e.IsTerminated == false);
                if (searchBy != "")
                {
                    if (searchBy == "Gender")
                    {
                        int.TryParse(searchParam.Split(';')[1], out genderId);
                        employeeList = employeeList.Where(e => e.corePerson.GenderId == genderId);
                    }
                    else
                    {
                        criteria = searchParam.Split(';')[1];
                        searchValue = searchParam.Split(';')[2];
                        if (searchBy == "Identity No.")
                        {
                            if (criteria == "Starts With") employeeList = employeeList.Where(e => e.IdentityNumber.StartsWith(searchValue, StringComparison.OrdinalIgnoreCase));
                            else if (criteria == "Contains") employeeList = employeeList.Where(e => e.IdentityNumber.ToUpper().Contains(searchValue.ToUpper()));
                            else if (criteria == "Ends With") employeeList = employeeList.Where(e => e.IdentityNumber.EndsWith(searchValue, StringComparison.OrdinalIgnoreCase));
                        }
                        else if (searchBy == "First Name")
                        {
                            if (criteria == "Starts With") employeeList = employeeList.Where(e => e.corePerson.FirstName.StartsWith(searchValue, StringComparison.OrdinalIgnoreCase));
                            else if (criteria == "Contains") employeeList = employeeList.Where(e => e.corePerson.FirstName.ToUpper().Contains(searchValue.ToUpper()));
                            else if (criteria == "Ends With") employeeList = employeeList.Where(e => e.corePerson.FirstName.EndsWith(searchValue, StringComparison.OrdinalIgnoreCase));
                        }
                        else if (searchBy == "Middle Name")
                        {
                            if (criteria == "Starts With") employeeList = employeeList.Where(e => e.corePerson.FatherName.StartsWith(searchValue, StringComparison.OrdinalIgnoreCase));
                            else if (criteria == "Contains") employeeList = employeeList.Where(e => e.corePerson.FatherName.ToUpper().Contains(searchValue.ToUpper()));
                            else if (criteria == "Ends With") employeeList = employeeList.Where(e => e.corePerson.FatherName.EndsWith(searchValue, StringComparison.OrdinalIgnoreCase));
                        }
                        else if (searchBy == "Last Name")
                        {
                            if (criteria == "Starts With") employeeList = employeeList.Where(e => e.corePerson.GrandFatherName.StartsWith(searchValue, StringComparison.OrdinalIgnoreCase));
                            else if (criteria == "Contains") employeeList = employeeList.Where(e => e.corePerson.GrandFatherName.ToUpper().Contains(searchValue.ToUpper()));
                            else if (criteria == "Ends With") employeeList = employeeList.Where(e => e.corePerson.GrandFatherName.EndsWith(searchValue, StringComparison.OrdinalIgnoreCase));
                        }
                    }
                }
            }
           
            var count = employeeList.Count();

            employeeList = employeeList.Skip(start).Take(limit).ToList();
            var employees = employeeList.Select(item => new
            {
                item.Id,
                item.IdentityNumber,
                Name = item.corePerson.FirstName + " " + item.corePerson.FatherName + " " + item.corePerson.GrandFatherName,
                FirstName = item.corePerson.FirstName,
                FatherName = item.corePerson.FatherName,
                GrandFatherName = item.corePerson.GrandFatherName,
                Gender = item.corePerson.lupGender.Name,
                PositionCode = item.corePosition.Code,
                PositionName = item.corePosition.corePositionClass.Name,
                Salary = item.Salary,               
                Account =item.SubsidiaryAccountId
            }).Cast<object>().ToList();
            var result = new { total = count, data = employees };
            return this.Direct(result);
        }

        
        public ActionResult PopulateUnitTree(string nodeId)
        {
            int selectedNodeId;
            int.TryParse(nodeId, out selectedNodeId);
            var units = selectedNodeId == 0
                            ? _unit.GetAll().Where(u => u.ParentId == null)
                            : _unit.GetAll().Where(u => u.ParentId == selectedNodeId);
            var filtered = new ArrayList();
            foreach (var unit in units)
            {
                filtered.Add(new
                {
                    id = unit.Id,
                    text = unit.Name,
                    href = string.Empty,
                    unitTypeId = unit.TypeId
                });
            }
            return this.Direct(filtered.ToArray());
        }

       
        public DirectResult GetPayrollItems()
        {
            try
            {
                var filtered = this._pItems.GetAll();

                var elements = filtered.Select(c => new
                {
                    c.Id,
                    Name = c.PItemName
                }).Cast<object>().ToList();

                var result = new { data = elements };

                return this.Direct(result);
            }
            catch (Exception)
            {
                return this.Direct(new DirectResult());
            }
        }
        public DirectResult GetUnits()
        {
            var filtered = _unit.GetAll();
            var units = filtered.Select(unit => new
            {
                Units = unit.Name,
                unit.Id,
                unit.Code
                
            });
            StringBuilder stringBuilder = new StringBuilder();
            stringBuilder.Append("{total:" + " 5 " + ", data:[{");
            int i = 0;
            foreach (var unit in units)
            {
                if (i > 0)
                    stringBuilder.Append("},{");

                stringBuilder.Append("'Id' : " + "'" + unit.Id + "'" + "," + "'Units' : " + "'" + unit.Units + "',");
                i++;
            }
            stringBuilder.Append("},");
            stringBuilder.Append("]}");
            string str = stringBuilder.Replace(",}", "}").ToString();
            var baseEntries = stringBuilder.Replace(",]}", "]}").ToString();

            object[] fieldNames = { "Id", "Units" };

            var result = new { success = true, total = fieldNames.Length, data = new { fields = fieldNames, baseEntries = baseEntries } };
            return this.Direct(result);
        }
        public DirectResult GetUserPayrollItems()
        {
            try
            {
                var filtered = this._pItems.GetAll().Where(p => p.IsBuiltin == false);

                var elements = filtered.Select(c => new
                {
                    c.Id,
                    Name = c.PItemName
                }).Cast<object>().ToList();

                var result = new { data = elements };

                return this.Direct(result);
            }
            catch (Exception)
            {
                return this.Direct(new DirectResult());
            }
        }

        public DirectResult GetAllUnits(int start, int limit, string sort, string dir, string record)
        {
            try
            {

                var hashtable = JsonConvert.DeserializeObject<Hashtable>(record);
                var filtered = _unit.GetAll();
                var count = filtered.Count();

                filtered = filtered.Skip(start).Take(limit);
                var units = filtered.Select(item => new
                {

                    item.Id,
                    Unit = item.Name
                    
                }).Cast<object>().ToList();
                return this.Direct(new { total = count, data = units });
            }
            catch (Exception exception)
            {
                return this.Direct(new { success = false, data = exception.Message });
            }
        }
        public DirectResult GetOrgsPayrollItems()
        {
            try
            {
                List<ItemTemple> items = new List<ItemTemple>();
                ItemTemple it = new ItemTemple();

                it.Id = 1;
                it.ItemCode = ReusableResourcesUI.OrgsItemCode.PF_001.ToString();

                items.Add(it);

                it = new ItemTemple();

                it.Id = 2;
                it.ItemCode = ReusableResourcesUI.OrgsItemCode.Pension_002.ToString();

                items.Add(it);

                var elements = items.Select(c => new
                {
                    c.Id,
                    c.ItemCode
                }).Cast<object>().ToList();

                var result = new { data = elements };

                return this.Direct(result);
            }
            catch (Exception)
            {
                return this.Direct(new DirectResult());
            }
        }

        public DirectResult SaveEmployee(IList<string> empDetails)
        {
            using (var transaction = new TransactionScope())
            {
                this._context.Connection.Open();
                var empDetail = empDetails[0].Split(new[] { ';' });

                for (var i = 0; i < empDetail.Count(); i++)
                {
                    if (empDetail[i] != String.Empty)
                    {
                        string[] vals = empDetail[i].Split(':');
                        hrmsEmployee employee = this._employee.Get(int.Parse(vals[1]));

                        employee.SubsidiaryAccountId = int.Parse(vals[0]);
                        
                        employee.Id = int.Parse(vals[1]);
                        employee.IdentityNumber = (vals[2]).ToString();

                        this._context.Refresh(RefreshMode.ClientWins, employee);
                        this._context.Detach(employee);
                        this._employee.Edit(employee);
                    }
                }

                this._context.SaveChanges();
                transaction.Complete();
                this._context.AcceptAllChanges();

                return this.Direct(new { success = true, data = "The new Payroll Item has been saved successfully!" });
            }
        }

        #endregion

        #region Lookups

        private DirectResult GetAll(string table)
        {
            var lookup = _lookup.GetAll(table);
            var result = new
            {
                total = lookup.Count(),
                data = lookup
            };
            return this.Direct(result);
        }

        public DirectResult GetBalanceSides()
        {
            return GetAll(Constants.BalanceSide);
        }

        public DirectResult GetVoucherTypes()
        {
            return GetAll(Constants.VoucherType);
        }

        public DirectResult GetModeOfPayments()
        {
            return GetAll(Constants.ModeOfPayment);
        }

        public DirectResult GetFixedAssetDisposalMethod()
        {
            return GetAll(Constants.FixedAssetDisposalMethod);
        }

        public DirectResult GetGenders()
        {
            return GetAll(Constants.Gender);
        }

        public DirectResult GetEmploymentNatures()
        {
            return GetAll(Constants.EmploymentNature);
        }

        public DirectResult GetPItemApplicationMethod()
        {
            return GetAll(Constants.PayrollItemAppMethod);
        }

        public DirectResult GetOvertimeTypes()
        {
            return GetAll(Constants.PayrollOTTypes);
        }

        #endregion
    }
}
