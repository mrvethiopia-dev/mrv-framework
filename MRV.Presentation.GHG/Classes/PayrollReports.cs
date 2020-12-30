using System;
using System.CodeDom;
using System.Collections.Generic;
using System.Collections;
using System.Linq;
using System.Web;
using System.Data;
using NBI.Data.Model;
using NBI.Business.Tsa;
using NBI.Presentation.Tsa.Classes;
using NBI.Presentation.Tsa.Controllers;
using System.Data.Objects;

using System.Transactions;
using Ext.Direct.Mvc;
using System.Reflection;


namespace NBI.Presentation.Tsa.Classes
{
    public class PayrollReports
    {
        private readonly ObjectContext _context;
        public readonly PayrollSettings _payrollSettings;
        public readonly PayrollMthlyPenSmry _payrollPensionSummary;
        public readonly PayrollMthlyIncmTxSmry _payrollITaxSummary;
        public readonly PayrollEmployeeTermination _empTermination;
        public readonly PayrollTransactions _payTrans;
        public readonly PayrollPeriods _period;
        public readonly PayrollItems _pItems;

        #region Constructor
        public PayrollReports()
        {

            _context = new ENTRO_MISEntities(Constants.ConnectionString);           

            _payrollSettings = new PayrollSettings(_context);
            _payrollPensionSummary = new PayrollMthlyPenSmry(_context);
            _payrollITaxSummary = new PayrollMthlyIncmTxSmry(_context);
            _empTermination = new PayrollEmployeeTermination(_context);
            _payTrans = new PayrollTransactions(_context);
            _period = new PayrollPeriods(_context);
            _pItems = new PayrollItems(_context);
        }

        #endregion

        #region Methods

        public DataTable ToDataTable<T>(List<T> items)
        {

            DataTable dataTable = new DataTable(typeof(T).Name);

            //Get all the properties

            PropertyInfo[] Props = typeof(T).GetProperties(BindingFlags.Public | BindingFlags.Instance);

            foreach (PropertyInfo prop in Props)
            {

                //Setting column names as Property names

                dataTable.Columns.Add(prop.Name);

            }

            foreach (T item in items)
            {

                var values = new object[Props.Length];

                for (int i = 0; i < Props.Length; i++)
                {

                    //inserting property values to datatable rows

                    values[i] = Props[i].GetValue(item, null);

                }

                dataTable.Rows.Add(values);

            }

            //put a breakpoint here and check datatable

            return dataTable;
        }

        public DataTable ToDataTable2<T>(List<T> items)
        {
            
            DataTable dataTable = new DataTable(typeof(T).Name);

            //Get all the properties

            PropertyInfo[] Props = typeof(T).GetProperties(BindingFlags.Public | BindingFlags.Instance);

            foreach (PropertyInfo prop in Props)
            {

                //Setting column names as Property names

                dataTable.Columns.Add(prop.Name);

            }
                string m_currEmpId = string.Empty;
                string m_prevEmpId = string.Empty;
            foreach (T item in items)
            {
                

                var values = new object[Props.Length];

                for (int i = 0; i < Props.Length; i++)
                {

                    //inserting property values to datatable rows
                    values[i] = Props[i].GetValue(item, null);
                    
                }

                m_currEmpId = values[1].ToString();

                if (m_currEmpId != m_prevEmpId)
                    dataTable.Rows.Add(values);

                else
                {
                    for (int i = 7; i <= 34; i++)
                    {
                        values[i] = 0;
                    }

                    dataTable.Rows.Add(values);
                }

                m_prevEmpId = m_currEmpId;

            }

            //put a breakpoint here and check datatable

            return dataTable;
        }
        public DataTable GetPayrollTransactions(int PeriodId)
        {
            using (ENTRO_MISEntities erpEntities = new ENTRO_MISEntities())
            {
                var m_payTrans = erpEntities.vwPrlTransactionDetails.Where(p => p.PeriodId == PeriodId && p.IsDeleted == false).OrderBy(p => p.FirstName);

                DataTable l_dt = ToDataTable(m_payTrans.ToList());
                return l_dt;
            }
        }

      
        public void GetPayrollItemAmounts(SearchCriteria sc, out DataTable right)
        {
            right = new DataTable();

            using (ENTRO_MISEntities erpEntities = new ENTRO_MISEntities())
            {
                var m_PItemAmounts = erpEntities.vwPrlTransactionDetails.Where(p =>
                    p.PeriodId == sc.RptPeriodId & p.PItemId == sc.RptPayrollItemId);

                right = ToDataTable(m_PItemAmounts.ToList());

                return;
            }
        }

        public DataTable GetPayrollItemAmounts(SearchCriteria sc)
        {
            DataTable l_dt = new DataTable();

            using (ENTRO_MISEntities erpEntities = new ENTRO_MISEntities())
            {
                var m_PItemAmounts = erpEntities.vwPrlTransactionDetails.Where(p =>
                    p.PeriodId == sc.RptPeriodId & p.PItemId == sc.RptPayrollItemId);

                l_dt = ToDataTable(m_PItemAmounts.ToList());

                return l_dt;
            }
        }
        public DataTable GetLoanData()
        {
            //using (ENTRO_MISEntities erpEntities = new ENTRO_MISEntities())
            //{
            //    var m_loanData = erpEntities.vw_ifmsPayrollEmployeeLoan;

            //    DataTable l_dt = ToDataTable(m_loanData.ToList());
                return new DataTable();
            //}
        }

        public DataTable GetOvertimeData(int periodId)
        {
            //using (ENTRO_MISEntities erpEntities = new ENTRO_MISEntities())
            //{
            //    var m_overtimeData = erpEntities.vw_ifmsPayrollOvertime.Where(p => p.PeriodId == periodId && p.IsDeleted == false);

            //    DataTable l_dt = ToDataTable(m_overtimeData.ToList());
            return new DataTable();
            //}
        }

        public DataTable GetPaySheetTransactions(SearchCriteria sc)
        {
            DataTable l_dt = new DataTable();
            List<vwPrlTransactionDetails> vw_PayrollTrans = new List<vwPrlTransactionDetails>();
            if (sc.FilterBy == Constants.DEPARTMENTS)
            {

                using (ENTRO_MISEntities erpEntities = new ENTRO_MISEntities())
                {
                    
                    var m_payTrans = erpEntities.vwPrlTransactionDetails.Where(p => p.PeriodId == sc.RptPeriodId && p.IsDeleted == false && p.BatchId == sc.BatchId);
                    vw_PayrollTrans = m_payTrans.Where(p => sc.GroupsId.Contains(p.DepartmentId)).OrderBy(p => p.FirstName).ToList();
                    l_dt = ToDataTable2(vw_PayrollTrans);
                    
                }
                return l_dt;
            }
            else if (sc.FilterBy == Constants.REGIONS)
            {

                using (ENTRO_MISEntities erpEntities = new ENTRO_MISEntities())
                {
                    
                    var m_payTrans = erpEntities.vwPrlTransactionDetails.Where(p => p.PeriodId == sc.RptPeriodId && p.IsDeleted == false && p.BatchId == sc.BatchId);
                    vw_PayrollTrans = m_payTrans.Where(p => sc.GroupsId.Contains(p.RegionId)).OrderBy(p => p.FirstName).ToList();
                    l_dt = ToDataTable2(vw_PayrollTrans);

                }
                return l_dt;
            }
            else if (sc.FilterBy == Constants.WOREDAS)
            {

                using (ENTRO_MISEntities erpEntities = new ENTRO_MISEntities())
                {
                    
                    var m_payTrans = erpEntities.vwPrlTransactionDetails.Where(p => p.PeriodId == sc.RptPeriodId && p.IsDeleted == false && p.BatchId == sc.BatchId);
                    vw_PayrollTrans = m_payTrans.Where(p => sc.GroupsId.Contains(p.WoredaId)).OrderBy(p => p.FirstName).ToList();
                    l_dt = ToDataTable2(vw_PayrollTrans);

                }
                return l_dt;
            }
            else if (sc.FilterBy == Constants.EMPLOYEES)
            {

                using (ENTRO_MISEntities erpEntities = new ENTRO_MISEntities())
                {
                    
                    var m_payTrans = erpEntities.vwPrlTransactionDetails.Where(p => p.PeriodId == sc.RptPeriodId && p.IsDeleted == false && p.BatchId == sc.BatchId);
                    vw_PayrollTrans = m_payTrans.Where(p => sc.GroupsId.Contains(p.EmpId)).OrderBy(p => p.FirstName).ToList();
                    l_dt = ToDataTable2(vw_PayrollTrans);

                }
                return l_dt;
            }
            else if (sc.FilterBy == "" && sc.BatchId != "")
            {
                using (ENTRO_MISEntities erpEntities = new ENTRO_MISEntities())
                {
                    var m_payTrans = erpEntities.vwPrlTransactionDetails.Where(p => p.PeriodId == sc.RptPeriodId && p.IsDeleted == false && p.BatchId == sc.BatchId);

                    l_dt = ToDataTable2(m_payTrans.ToList());

                }
                return l_dt;
            }
            else if (sc.FilterBy == "" && sc.BatchId == "")
            {
                using (ENTRO_MISEntities erpEntities = new ENTRO_MISEntities())
                {
                    var m_payTrans = erpEntities.vwPrlTransactionDetails.Where(p => p.PeriodId == sc.RptPeriodId && p.IsDeleted == false);

                    l_dt = ToDataTable2(m_payTrans.ToList());

                }
                return l_dt;
            }
            //if(sc.BatchId != "")
            //{
            //    using (ENTRO_MISEntities erpEntities = new ENTRO_MISEntities())
            //    {
            //        var m_payTrans = erpEntities.vwPrlTransactionDetails.Where(p => p.PeriodId == sc.RptPeriodId && p.IsDeleted == false && p.BatchId == sc.BatchId);

            //        l_dt = ToDataTable2(m_payTrans.ToList());

            //    }
            //    return l_dt;
            //}
            return l_dt;
        }

        public DataTable GetSeverancePayTransactions(SearchCriteria sc)
        {
            DataTable l_dt = new DataTable();
            List<vwPrlSeverancePay> vw_PayrollTrans = new List<vwPrlSeverancePay>();
            

                using (ENTRO_MISEntities erpEntities = new ENTRO_MISEntities())
                {
                    vw_PayrollTrans = erpEntities.vwPrlSeverancePay.ToList();
                    vw_PayrollTrans = vw_PayrollTrans.Where(p => p.PeriodId == sc.RptPeriodId).ToList();
                    l_dt = ToDataTable2(vw_PayrollTrans);

                }
                return l_dt;
                        
        }

        public DataTable GetSalaryChangeDetails(SearchCriteria sc)
        {
            DataTable l_dt = new DataTable();
            var vw_PayrollTrans = new List<vwPrlSalaryPositionChangeDetail>();
            

            if (sc.FilterBy == Constants.EMPLOYEES)
            {

                using (ENTRO_MISEntities erpEntities = new ENTRO_MISEntities())
                {

                    vw_PayrollTrans = erpEntities.vwPrlSalaryPositionChangeDetail.ToList();
                    vw_PayrollTrans = vw_PayrollTrans.Where(p => p.EffectivePeriodId == sc.RptPeriodId & p.IsFromBSC == true).ToList();

                    vw_PayrollTrans = vw_PayrollTrans.Where(p => sc.GroupsId.Contains(p.EmpId)).OrderBy(p => p.EmployeeName).ToList();
                    l_dt = ToDataTable(vw_PayrollTrans);

                }
                return l_dt;
            }
            else
            {
                using (ENTRO_MISEntities erpEntities = new ENTRO_MISEntities())
                {
                    vw_PayrollTrans = erpEntities.vwPrlSalaryPositionChangeDetail.ToList();
                    vw_PayrollTrans = vw_PayrollTrans.Where(p => p.EffectivePeriodId == sc.RptPeriodId & p.IsFromBSC == true).ToList();
                    l_dt = ToDataTable(vw_PayrollTrans);

                }
                return l_dt;
            }
            return l_dt;

        }

        public DataTable GetCurrencyChangeDetails(SearchCriteria sc)
        {
            DataTable l_dt = new DataTable();
            var vw_PayrollTrans = new List<vwPrlSalaryPositionChangeDetail>();


            if (sc.FilterBy == Constants.EMPLOYEES)
            {

                using (ENTRO_MISEntities erpEntities = new ENTRO_MISEntities())
                {

                    vw_PayrollTrans = erpEntities.vwPrlSalaryPositionChangeDetail.ToList();
                    vw_PayrollTrans = vw_PayrollTrans.Where(p => p.EffectivePeriodId == sc.RptPeriodId & p.IsFromBCC == true).ToList();

                    vw_PayrollTrans = vw_PayrollTrans.Where(p => sc.GroupsId.Contains(p.EmpId)).OrderBy(p => p.EmployeeName).ToList();
                    l_dt = ToDataTable(vw_PayrollTrans);

                }
                return l_dt;
            }
            else
            {
                using (ENTRO_MISEntities erpEntities = new ENTRO_MISEntities())
                {
                    vw_PayrollTrans = erpEntities.vwPrlSalaryPositionChangeDetail.ToList();
                    vw_PayrollTrans = vw_PayrollTrans.Where(p => p.EffectivePeriodId == sc.RptPeriodId & p.IsFromBCC == true).ToList();
                    l_dt = ToDataTable(vw_PayrollTrans);

                }
                return l_dt;
            }
            return l_dt;

        }
        public DataTable GetChangesMade(SearchCriteria sc)
        {
            DataTable l_dt = new DataTable();
            List<vwChangesMade> vw_Changes = new List<vwChangesMade>();


            using (ENTRO_MISEntities erpEntities = new ENTRO_MISEntities())
            {
                vw_Changes = erpEntities.vwChangesMade.ToList();
                vw_Changes = vw_Changes.Where(p => p.ChangePeriodId == sc.RptPeriodId).OrderBy(c=> c.ReasonForChange).ThenBy(c=> c.PItemName).ToList();
                l_dt = ToDataTable(vw_Changes);

            }
            return l_dt;

        }
        public DataTable GetPayrollJournals(SearchCriteria sc)
        {
            DataTable l_dt = new DataTable();
            List<vwPrlJournal> vw_PayrollTrans = new List<vwPrlJournal>();


            using (ENTRO_MISEntities erpEntities = new ENTRO_MISEntities())
            {
                vw_PayrollTrans = erpEntities.vwPrlJournal.ToList();
                vw_PayrollTrans = vw_PayrollTrans.Where(p => p.PeriodId == sc.RptPeriodId).ToList();
                l_dt = ToDataTable(vw_PayrollTrans);

            }
            return l_dt;

        }

        public DataTable GetTransactionsForERCAPension(SearchCriteria sc)
        {
            DataTable l_dt = new DataTable();
            List<vwPrlTransactionDetails> vw_PayrollTrans = new List<vwPrlTransactionDetails>();


            using (ENTRO_MISEntities erpEntities = new ENTRO_MISEntities())
            {
                vw_PayrollTrans = erpEntities.vwPrlTransactionDetails.ToList();
                vw_PayrollTrans = vw_PayrollTrans.Where(p => p.PeriodId == sc.RptPeriodId && p.PensionEmployee != 0 && p.PensionEmployer != 0).ToList();
                l_dt = ToDataTable(vw_PayrollTrans);

            }
            return l_dt;

        }

        public DataTable GetTransactionsForERCAIncomeTax(SearchCriteria sc)
        {
            DataTable l_dt = new DataTable();
            List<vwPrlTransactionDetails> vw_PayrollTrans = new List<vwPrlTransactionDetails>();


            using (ENTRO_MISEntities erpEntities = new ENTRO_MISEntities())
            {
                vw_PayrollTrans = erpEntities.vwPrlTransactionDetails.ToList();
                vw_PayrollTrans = vw_PayrollTrans.Where(p => p.PeriodId == sc.RptPeriodId).ToList();
                l_dt = ToDataTable(vw_PayrollTrans);

            }
            return l_dt;

        }

        public DataTable GetReconciliationHeader(SearchCriteria sc)
        {
            DataTable k = GetReconciliationSummary(sc);
            DataTable l_dt = new DataTable();
            DataTable l_TransactionTable = new DataTable();
            int l_row = 0;
            l_TransactionTable.Columns.Add("Period");
            l_TransactionTable.Columns.Add("BasicSalary");
            l_TransactionTable.Columns.Add("PensionEmployer");
            l_TransactionTable.Columns.Add("TotalAddition");
            l_TransactionTable.Columns.Add("TotalDeduction");
            l_TransactionTable.Columns.Add("NetPay");
            l_TransactionTable.Columns.Add("IncomeTax");
            l_TransactionTable.Columns.Add("PensionEmployee");
            l_TransactionTable.Columns.Add("GrossPay");
            l_TransactionTable.Columns.Add("ExchangeRate");

            
            var PeriodOneTrans = _payTrans.GetAll().Where(p => p.PeriodId == sc.RptPeriodId);
            var PeriodTwoTrans = _payTrans.GetAll().Where(p => p.PeriodId == sc.RptPeriodTwoId);

            var periodOne = _period.Get(sc.RptPeriodId).Name;
            var basicPaySumOne = PeriodOneTrans.Sum(p => p.BasicPay);
            var pensionEmployerSumOne = PeriodOneTrans.Sum(p => p.PensionEmployer);
            var totalAdditionsOne = PeriodOneTrans.Sum(p => p.TotalAdditions) + PeriodOneTrans.Sum(p => p.PensionEmployer);
            var grossPayOne = PeriodOneTrans.Sum(p => p.GrossSalary) + PeriodOneTrans.Sum(p => p.PensionEmployer);
            var totalDeductionOne = PeriodOneTrans.Sum(p => p.TotalDeductions);
            var incomeTaxOne = PeriodOneTrans.Sum(p => p.Tax);
            var pensionEmployeeSumOne = PeriodOneTrans.Sum(p => p.PensionEmployee);
            var netPayOne = Convert.ToDecimal(PeriodOneTrans.Sum(p => p.NetPayment));
            var exchangeRateOne = Convert.ToDecimal(PeriodOneTrans.FirstOrDefault().ExchangeRate);

            l_TransactionTable.Rows.Add(new object[] { periodOne, basicPaySumOne, pensionEmployerSumOne, totalAdditionsOne, totalDeductionOne, netPayOne, incomeTaxOne, pensionEmployeeSumOne, grossPayOne, exchangeRateOne });


            var periodTwo = _period.Get(sc.RptPeriodTwoId).Name;
            var basicPaySumTwo = PeriodTwoTrans.Sum(p => p.BasicPay);
            var pensionEmployerSumTwo = PeriodTwoTrans.Sum(p => p.PensionEmployer);
            var totalAdditionsTwo = PeriodTwoTrans.Sum(p => p.TotalAdditions) + PeriodTwoTrans.Sum(p => p.PensionEmployer);
            var grossPayTwo = PeriodTwoTrans.Sum(p => p.GrossSalary) + PeriodTwoTrans.Sum(p => p.PensionEmployer);
            var totalDeductionTwo = PeriodTwoTrans.Sum(p => p.TotalDeductions);
            var incomeTaxTwo = PeriodTwoTrans.Sum(p => p.Tax);
            var pensionEmployeeSumTwo = PeriodTwoTrans.Sum(p => p.PensionEmployee);
            var netPayTwo = Convert.ToDecimal(PeriodTwoTrans.Sum(p => p.NetPayment));
            var exchangeRateTwo = Convert.ToDecimal(PeriodTwoTrans.FirstOrDefault().ExchangeRate);

            l_TransactionTable.Rows.Add(new object[] { periodTwo, basicPaySumTwo,pensionEmployerSumTwo, totalAdditionsTwo, totalDeductionTwo, netPayTwo, incomeTaxTwo, pensionEmployeeSumTwo, grossPayTwo, exchangeRateTwo });

            l_TransactionTable.Rows.Add(new object[] { "Difference", (basicPaySumTwo - basicPaySumOne), (pensionEmployerSumTwo - pensionEmployerSumOne),

                (totalAdditionsTwo - totalAdditionsOne), (totalDeductionTwo - totalDeductionOne), 
                (netPayTwo - netPayOne), (incomeTaxTwo - incomeTaxOne), (pensionEmployeeSumTwo - pensionEmployeeSumOne),
                (grossPayTwo - grossPayOne), (exchangeRateTwo - exchangeRateOne) });


            return l_TransactionTable;

        }

        public DataTable GetReconciliationSummary(SearchCriteria sc)
        {
            DataTable _newDataTable = new DataTable();

            _newDataTable.Columns.Add("Period");
            _newDataTable.Columns.Add("BasicSalary");
            _newDataTable.Columns.Add("Overtime");
            _newDataTable.Columns.Add("GrossSalary");
            _newDataTable.Columns.Add("PItemName");
            _newDataTable.Columns.Add("PItemAmount");
            _newDataTable.Columns.Add("IsAddition");
            _newDataTable.Columns.Add("NetPay");
            _newDataTable.Columns.Add("ExchangeRate");

            using (ENTRO_MISEntities erpEntities = new ENTRO_MISEntities())
            {
                DataTable dt_Transaction = new DataTable();
                var _PITEMS = _pItems.GetAll();
                var _DED_PITEMS = _pItems.GetAll().Where(p=> p.PItemIsAddition == false );

                dt_Transaction = CreateDataTableColumns(sc);
                var periodOne = _period.Get(sc.RptPeriodId).Name;
                var periodTwo = _period.Get(sc.RptPeriodTwoId).Name;

                var PeriodOneTrans = _payTrans.GetAll().Where(p => p.PeriodId == sc.RptPeriodId);
                var PeriodTwoTrans = _payTrans.GetAll().Where(p => p.PeriodId == sc.RptPeriodTwoId);

                var m_payTransOne = erpEntities.vwPrlTransactionDetails.Where(p => p.PeriodId == sc.RptPeriodId);
                var m_payTransTwo = erpEntities.vwPrlTransactionDetails.Where(p => p.PeriodId == sc.RptPeriodTwoId);

                #region First Row

                int l_row = 0;
                int m_row = 0;
                dt_Transaction.Rows.Add();

                int colCount = dt_Transaction.Columns.Count;

                for (int i = 0; i < colCount; i++)
                {
                    dt_Transaction.Rows[l_row][i] = 0;
                }
                                
                
                                
                dt_Transaction.Rows[l_row]["Period"] = periodOne;
                dt_Transaction.Rows[l_row]["BasicSalary"] = PeriodOneTrans.Sum(p => p.BasicPay);
                dt_Transaction.Rows[l_row]["Overtime"] = PeriodOneTrans.Sum(p => p.TotalOvertime);
                dt_Transaction.Rows[l_row]["GrossSalary"] = PeriodOneTrans.Sum(p => p.GrossSalary) + PeriodOneTrans.Sum(p => p.PensionEmployer) + PeriodOneTrans.Sum(p => p.TotalOvertime);
                dt_Transaction.Rows[l_row]["NetPay"] = PeriodOneTrans.Sum(p => p.NetPayment);
                dt_Transaction.Rows[l_row]["ExchangeRate"] = PeriodOneTrans.FirstOrDefault().ExchangeRate;

                

                foreach (var p in _PITEMS)
                {
                    decimal _currPItemSum = 0;
                    string _currPitemName = p.PItemName.Replace(" ", "");
                    var _currPItem = m_payTransOne.Where(e => e.PItemId == p.Id);

                    if (_currPItem.Any())
                    {
                        _currPItemSum = _currPItem.Sum(f => f.PItemAmount);
                        dt_Transaction.Rows[l_row][_currPitemName] = _currPItemSum;

                        _newDataTable.Rows.Add();
                        _newDataTable.Rows[m_row]["Period"] = periodOne;
                        _newDataTable.Rows[m_row]["BasicSalary"] = PeriodOneTrans.Sum(f => f.BasicPay);
                        _newDataTable.Rows[m_row]["Overtime"] = PeriodOneTrans.Sum(f => f.TotalOvertime);
                        _newDataTable.Rows[m_row]["GrossSalary"] = PeriodOneTrans.Sum(f => f.GrossSalary) + PeriodOneTrans.Sum(f => f.PensionEmployer) + PeriodOneTrans.Sum(f => f.TotalOvertime);
                        _newDataTable.Rows[m_row]["NetPay"] = PeriodOneTrans.Sum(f => f.NetPayment);
                        _newDataTable.Rows[m_row]["ExchangeRate"] = PeriodOneTrans.FirstOrDefault().ExchangeRate;

                        _newDataTable.Rows[m_row]["PItemName"] = _currPitemName;
                        _newDataTable.Rows[m_row]["PItemAmount"] = _currPItemSum;
                        _newDataTable.Rows[m_row]["IsAddition"] = p.PItemIsAddition;

                        m_row++;
                    }
                    else
                    {
                       var k = m_payTransTwo.Where(l=> l.PItemId == p.Id);
                       if (k.Any())
                       {
                           _newDataTable.Rows.Add();
                           _newDataTable.Rows[m_row]["Period"] = periodOne;
                           _newDataTable.Rows[m_row]["BasicSalary"] = PeriodOneTrans.Sum(f => f.BasicPay);
                           _newDataTable.Rows[m_row]["Overtime"] = PeriodOneTrans.Sum(f => f.TotalOvertime);
                           _newDataTable.Rows[m_row]["GrossSalary"] = PeriodOneTrans.Sum(f => f.GrossSalary) + PeriodOneTrans.Sum(f => f.PensionEmployer) + PeriodOneTrans.Sum(f => f.TotalOvertime);
                           _newDataTable.Rows[m_row]["NetPay"] = PeriodOneTrans.Sum(f => f.NetPayment);
                           _newDataTable.Rows[m_row]["ExchangeRate"] = PeriodOneTrans.FirstOrDefault().ExchangeRate;

                           _newDataTable.Rows[m_row]["PItemName"] = _currPitemName;
                           _newDataTable.Rows[m_row]["PItemAmount"] = 0;
                           _newDataTable.Rows[m_row]["IsAddition"] = p.PItemIsAddition;

                           m_row++;
                       }
                    }
                }

                

                #endregion

                #region Second Row

                l_row ++;
                dt_Transaction.Rows.Add();                

                for (int i = 0; i < colCount; i++)
                {
                    dt_Transaction.Rows[l_row][i] = 0;
                }

                dt_Transaction.Rows[l_row]["Period"] = periodTwo;
                dt_Transaction.Rows[l_row]["BasicSalary"] = PeriodTwoTrans.Sum(p => p.BasicPay);
                dt_Transaction.Rows[l_row]["Overtime"] = PeriodTwoTrans.Sum(p => p.TotalOvertime);
                dt_Transaction.Rows[l_row]["GrossSalary"] = PeriodTwoTrans.Sum(p => p.GrossSalary) + PeriodTwoTrans.Sum(p => p.PensionEmployer) + PeriodTwoTrans.Sum(p => p.TotalOvertime);
                dt_Transaction.Rows[l_row]["NetPay"] = PeriodTwoTrans.Sum(p => p.NetPayment);
                dt_Transaction.Rows[l_row]["ExchangeRate"] = PeriodTwoTrans.FirstOrDefault().ExchangeRate;

                foreach (var p in _PITEMS)
                {
                    decimal _currPItemSum = 0;
                    string _currPitemName = p.PItemName.Replace(" ", "");
                    var _currPItem = m_payTransTwo.Where(e => e.PItemId == p.Id);

                    if (_currPItem.Any())
                    {
                        _currPItemSum = _currPItem.Sum(f => f.PItemAmount);
                        dt_Transaction.Rows[l_row][_currPitemName] = _currPItemSum;

                        _newDataTable.Rows.Add();
                        _newDataTable.Rows[m_row]["Period"] = periodTwo;
                        _newDataTable.Rows[m_row]["BasicSalary"] = PeriodTwoTrans.Sum(j => j.BasicPay);
                        _newDataTable.Rows[m_row]["Overtime"] = PeriodTwoTrans.Sum(j => j.TotalOvertime);
                        _newDataTable.Rows[m_row]["GrossSalary"] = PeriodTwoTrans.Sum(j => j.GrossSalary) + PeriodTwoTrans.Sum(j => j.PensionEmployer) + PeriodTwoTrans.Sum(j => j.TotalOvertime); 
                        _newDataTable.Rows[m_row]["NetPay"] = PeriodTwoTrans.Sum(j => j.NetPayment);
                        _newDataTable.Rows[m_row]["ExchangeRate"] = PeriodTwoTrans.FirstOrDefault().ExchangeRate;

                        _newDataTable.Rows[m_row]["PItemName"] = _currPitemName;
                        _newDataTable.Rows[m_row]["PItemAmount"] = _currPItemSum;
                        _newDataTable.Rows[m_row]["IsAddition"] = p.PItemIsAddition;

                        m_row++;

                    }
                    else
                    {
                        var k = m_payTransOne.Where(l=> l.PItemId == p.Id);
                        if (k.Any())
                        {
                            _newDataTable.Rows.Add();
                            _newDataTable.Rows[m_row]["Period"] = periodTwo;
                            _newDataTable.Rows[m_row]["BasicSalary"] = PeriodTwoTrans.Sum(j => j.BasicPay);
                            _newDataTable.Rows[m_row]["Overtime"] = PeriodTwoTrans.Sum(j => j.TotalOvertime);
                            _newDataTable.Rows[m_row]["GrossSalary"] = PeriodTwoTrans.Sum(j => j.GrossSalary) + PeriodTwoTrans.Sum(j => j.PensionEmployer) + PeriodTwoTrans.Sum(j => j.TotalOvertime);
                            _newDataTable.Rows[m_row]["NetPay"] = PeriodTwoTrans.Sum(j => j.NetPayment);
                            _newDataTable.Rows[m_row]["ExchangeRate"] = PeriodTwoTrans.FirstOrDefault().ExchangeRate;

                            _newDataTable.Rows[m_row]["PItemName"] = _currPitemName;
                            _newDataTable.Rows[m_row]["PItemAmount"] = 0;
                            _newDataTable.Rows[m_row]["IsAddition"] = p.PItemIsAddition;

                            m_row++;
                        }
                    }
                }

                

                #endregion

                #region Third Row
                l_row++;
                dt_Transaction.Rows.Add();

                for (int i = 0; i < colCount; i++)
                {
                    dt_Transaction.Rows[l_row][i] = 0;
                }

                dt_Transaction.Rows[l_row][0] = "Difference";
                for (int i = 1; i < colCount; i++)
                {
                    dt_Transaction.Rows[l_row][i] = Convert.ToDecimal(dt_Transaction.Rows[l_row - 1][i]) - Convert.ToDecimal(dt_Transaction.Rows[l_row - 2][i]);

                    
                }
                #endregion


                

                //int m_row = 0;
                //foreach (DataRow dr in dt_Transaction.Rows)
                //{
                    
                //    _newDataTable.Rows.Add();
                //    _newDataTable.Rows[m_row][]
                //}
                return _newDataTable;
            }
        }
        public DataTable CreateDataTableColumns(SearchCriteria sc)
        {
            using (ENTRO_MISEntities erpEntities = new ENTRO_MISEntities())
            {

                var m_payTransOne = erpEntities.vwPrlTransactionDetails.Where(p=> p.PeriodId == sc.RptPeriodId);
                var m_payTransTwo = erpEntities.vwPrlTransactionDetails.Where(p => p.PeriodId == sc.RptPeriodTwoId);

                DataTable l_dt = new DataTable();
                DataTable l_TransactionTable = new DataTable();
                int l_row = 0;
                l_TransactionTable.Columns.Add("Period");
                l_TransactionTable.Columns.Add("BasicSalary");
                
                string[] l_additionsPOne = null;
                string[] l_deductionsPOne = null;

                string[] l_additionsPTwo = null;
                string[] l_deductionsPTwo = null;


                GetDistinctAdditionsAndDeductions(ref l_additionsPOne, ref l_deductionsPOne, m_payTransOne);
                GetDistinctAdditionsAndDeductions(ref l_additionsPTwo, ref l_deductionsPTwo, m_payTransTwo);

                //Create the addition columns for period one
                if ((l_additionsPOne != null) && (l_additionsPOne.Length > 0))
                {

                    foreach (string l_add in l_additionsPOne)
                    {
                        if (l_add != null)
                        {
                            string add = l_add.Replace(" ", "");
                            l_TransactionTable.Columns.Add(add);
                        }
                    }

                }

                //Create the addition columns for period two
                if ((l_additionsPTwo != null) && (l_additionsPTwo.Length > 0))
                {
                    foreach (string l_add in l_additionsPTwo)
                    {                        
                        if (l_add != null)
                        {
                            string add = l_add.Replace(" ", "");  
                            if(!l_TransactionTable.Columns.Contains(add))
                                l_TransactionTable.Columns.Add(add);
                        }
                    }

                }


                l_TransactionTable.Columns.Add("Overtime");
                l_TransactionTable.Columns.Add("GrossSalary");

                if ((l_deductionsPOne != null) && (l_deductionsPOne.Length > 0))
                {

                    foreach (string l_ded in l_deductionsPOne)
                    {
                        if (l_ded != null)
                        {
                            string ded = l_ded.Replace(" ", "");
                            l_TransactionTable.Columns.Add(ded);
                        }
                    }
                }

                //create the deducttion columns for period two
                if ((l_deductionsPTwo != null) && (l_deductionsPTwo.Length > 0))
                {
                    foreach (string l_ded in l_deductionsPTwo)
                    {                        
                        if (l_ded != null)
                        {
                            string ded = l_ded.Replace(" ", "");
                            if(!l_TransactionTable.Columns.Contains(ded))
                                l_TransactionTable.Columns.Add(ded);
                        }
                    }
                }
                l_TransactionTable.Columns.Add("NetPay");
                l_TransactionTable.Columns.Add("ExchangeRate");
                return l_TransactionTable;
            }
            
        }

        public bool GetDistinctAdditionsAndDeductions(ref string[] additions, ref string[] deductions, IEnumerable<vwPrlTransactionDetails> m_payTrans)
        {
            var m_Additions = m_payTrans.Where(p => p.PItemIsAddition == true);
            int count = m_Additions.Count();
            string[] m_adds = new string[count];
            int i = 0;
            foreach (var m_ad in m_Additions)
            {
                if (!m_adds.Contains(m_ad.PItemName))
                    m_adds[i] = m_ad.PItemName;
                i++;
            }
            additions = m_adds;


            var m_deductions = m_payTrans.Where(p => p.PItemIsAddition == false);
            count = m_deductions.Count();
            string[] m_deds = new string[count];
            i = 0;
            foreach (var m_ded in m_deductions)
            {
                if (!m_deds.Contains(m_ded.PItemName))
                {


                    //IncomeTaxId = int.Parse(_payrollSettings.Get(Constants.IncomeTaxId).SettingValue);
                    //if(m_ded.PItemId != IncomeTaxId)
                    m_deds[i] = m_ded.PItemName;
                }
                i++;
            }
            deductions = m_deds;

            return true;
        }

        public DataTable GetPensionSummary(SearchCriteria sc)
        {
            
            var pensionSummary = _payrollPensionSummary.GetAll().Where(p => p.PeriodId == sc.RptPeriodId).ToList();


            if (pensionSummary.Count == 0)
            {
                var mPayTrans = _payTrans.GetAll().Where(p => p.PeriodId == sc.RptPeriodId);

                int totalNoOfEmployees = 0;
                decimal totalWage = 0;
                decimal totalEmployee = 0;
                decimal totalEmployer = 0;
                decimal totalPension = 0;

                foreach (var trans in mPayTrans)
                {
                    totalNoOfEmployees++;
                    totalWage += trans.BasicPay;
                    totalEmployee += trans.PensionEmployee;
                    totalEmployer += trans.PensionEmployer;
                    totalPension = totalEmployee + totalEmployer;
                }

                PrlMonthlyPensionSummary penSumm = new PrlMonthlyPensionSummary();

                penSumm.PeriodId = sc.RptPeriodId;
                penSumm.TotalNoOfEmployees = totalNoOfEmployees;
                penSumm.TotalWageAmount = totalWage;
                penSumm.TotalEmployeesContAmount = totalEmployee;
                penSumm.TotalEmployersContAmount = totalEmployer;
                penSumm.TotalPensionAmount = totalPension;
                penSumm.IsDeleted = false;


                _payrollPensionSummary.AddNew(penSumm);

                pensionSummary = _payrollPensionSummary.GetAll().Where(p => p.PeriodId == sc.RptPeriodId).ToList();

            }
            return ToDataTable(pensionSummary);
            

        }

        public DataTable GetIncomeTaxSummary(SearchCriteria sc)
        {

            var iTaxSummary = _payrollITaxSummary.GetAll().Where(p => p.PeriodId == sc.RptPeriodId).ToList();

            if (iTaxSummary.Count == 0)
            {
                var mPayTrans = _payTrans.GetAll().Where(p => p.PeriodId == sc.RptPeriodId);

                int totalNoOfEmployees = 0;
                decimal totalTaxableIncome = 0;
                decimal totalIncomeTax = 0;
                decimal? totalNetPay = 0;

                foreach (var trans in mPayTrans)
                {
                    totalNoOfEmployees ++;
                    totalTaxableIncome += trans.TaxableIncome;
                    totalIncomeTax += trans.Tax;
                    //totalNetPay += trans.NetPayment;
                }

                PrlMonthlyIncomeTaxSummary itSumm = new PrlMonthlyIncomeTaxSummary();

                itSumm.PeriodId = sc.RptPeriodId;
                itSumm.TotalNoOfEmployees = totalNoOfEmployees;
                itSumm.TotalTaxableIncome = totalTaxableIncome;
                itSumm.TotalIncomeTax = totalIncomeTax;
                itSumm.IsDeleted = false;


                _payrollITaxSummary.AddNew(itSumm);

                iTaxSummary = _payrollITaxSummary.GetAll().Where(p => p.PeriodId == sc.RptPeriodId).ToList();
            }

            return ToDataTable(iTaxSummary);


        }
        public DataTable GetTermination(SearchCriteria sc)
        {
            DataTable l_dt = new DataTable();

            using (ENTRO_MISEntities erpEntities = new ENTRO_MISEntities())
            {
                var termination = erpEntities.vwTerminationDetails.Where(p => p.TerminationDate.Value.Month == sc.StartDate.Month
                    && p.TerminationDate.Value.Year == sc.StartDate.Year).ToList();
                l_dt = ToDataTable(termination);
            }

            
            return l_dt;

        }

        public DataTable GetReconciliationResults(SearchCriteria sc)
        {
            DataTable l_dt = new DataTable();

            using (ENTRO_MISEntities erpEntities = new ENTRO_MISEntities())
            {
                var termination = erpEntities.vwPrlReconciliation.Where(p => p.PeriodOneId == sc.RptPeriodId
                    && p.PeriodTwoId == sc.RptPeriodTwoId).OrderByDescending(p=> p.IsAddition).ToList();
                l_dt = ToDataTable(termination);
            }


            return l_dt;

        }

        public DataTable GetBankLetterTransactions(SearchCriteria sc)
        {
            DataTable l_dt = new DataTable();

            List<vwPrlTransactionDetails> vw_PayrollTrans = new List<vwPrlTransactionDetails>();
            using (ENTRO_MISEntities erpEntities = new ENTRO_MISEntities())
            {
                if (sc.RptBankId != 0)
                {
                    if (sc.FilterBy == Constants.DEPARTMENTS)
                    {
                        var m_payTrans =
                            erpEntities.vwPrlTransactionDetails.Where(
                                p =>
                                    p.PeriodId == sc.RptPeriodId && p.IsDeleted == false &&
                                    p.BankBranchId == sc.RptBankBranchId && p.BatchId == sc.BatchId);
                        vw_PayrollTrans = m_payTrans.Where(p => sc.GroupsId.Contains(p.DepartmentId)).OrderBy(p => p.FirstName).ToList();

                        l_dt = ToDataTable2(vw_PayrollTrans.ToList());
                    }
                    else if (sc.FilterBy == Constants.REGIONS)
                    {
                        var m_payTrans =
                            erpEntities.vwPrlTransactionDetails.Where(
                                p =>
                                    p.PeriodId == sc.RptPeriodId && p.IsDeleted == false &&
                                    p.BankBranchId == sc.RptBankBranchId && p.BatchId == sc.BatchId);
                        vw_PayrollTrans = m_payTrans.Where(p => sc.GroupsId.Contains(p.RegionId)).OrderBy(p => p.FirstName).ToList();

                        l_dt = ToDataTable2(vw_PayrollTrans.ToList());
                    }
                    else if (sc.FilterBy == Constants.WOREDAS)
                    {
                        var m_payTrans =
                            erpEntities.vwPrlTransactionDetails.Where(
                                p =>
                                    p.PeriodId == sc.RptPeriodId && p.IsDeleted == false &&
                                    p.BankBranchId == sc.RptBankBranchId && p.BatchId == sc.BatchId);
                        vw_PayrollTrans = m_payTrans.Where(p => sc.GroupsId.Contains(p.WoredaId)).OrderBy(p => p.FirstName).ToList();

                        l_dt = ToDataTable2(vw_PayrollTrans.ToList());
                    }
                    else if (sc.FilterBy == Constants.EMPLOYEES)
                    {
                        var m_payTrans =
                            erpEntities.vwPrlTransactionDetails.Where(
                                p =>
                                    p.PeriodId == sc.RptPeriodId && p.IsDeleted == false &&
                                    p.BankBranchId == sc.RptBankBranchId && p.BatchId == sc.BatchId);
                        vw_PayrollTrans = m_payTrans.Where(p => sc.GroupsId.Contains(p.EmpId)).OrderBy(p => p.FirstName).ToList();

                        l_dt = ToDataTable2(vw_PayrollTrans.ToList());
                    }
                    else
                    {
                        var m_payTrans =
                            erpEntities.vwPrlTransactionDetails.Where(
                                p =>
                                    p.PeriodId == sc.RptPeriodId && p.IsDeleted == false &&
                                    p.BankBranchId == sc.RptBankBranchId && p.BatchId == sc.BatchId && p.BankBranchId == sc.RptBankBranchId);


                        l_dt = ToDataTable2(m_payTrans.ToList());
                    }

                   
                }
                else
                {
                    if (sc.FilterBy == Constants.DEPARTMENTS)
                    {
                        var m_payTrans =
                        erpEntities.vwPrlTransactionDetails.Where(
                            p =>
                                p.PeriodId == sc.RptPeriodId && p.IsDeleted == false && p.BatchId == sc.BatchId && p.BankBranchId == sc.RptBankBranchId);

                        vw_PayrollTrans = m_payTrans.Where(p => sc.GroupsId.Contains(p.DepartmentId)).OrderBy(p => p.FirstName).ToList();
                        l_dt = ToDataTable2(vw_PayrollTrans.ToList());
                    }
                    else if (sc.FilterBy == Constants.REGIONS)
                    {
                        var m_payTrans =
                        erpEntities.vwPrlTransactionDetails.Where(
                            p =>
                                p.PeriodId == sc.RptPeriodId && p.IsDeleted == false && p.BatchId == sc.BatchId && p.BankBranchId == sc.RptBankBranchId);

                        vw_PayrollTrans = m_payTrans.Where(p => sc.GroupsId.Contains(p.RegionId)).OrderBy(p => p.FirstName).ToList();
                        l_dt = ToDataTable2(vw_PayrollTrans.ToList());
                    }
                    else if (sc.FilterBy == Constants.WOREDAS)
                    {
                        var m_payTrans =
                        erpEntities.vwPrlTransactionDetails.Where(
                            p =>
                                p.PeriodId == sc.RptPeriodId && p.IsDeleted == false && p.BatchId == sc.BatchId && p.BankBranchId == sc.RptBankBranchId);

                        vw_PayrollTrans = m_payTrans.Where(p => sc.GroupsId.Contains(p.WoredaId)).OrderBy(p => p.FirstName).ToList();
                        l_dt = ToDataTable2(vw_PayrollTrans.ToList());
                    }
                    else if (sc.FilterBy == Constants.EMPLOYEES)
                    {
                        var m_payTrans =
                        erpEntities.vwPrlTransactionDetails.Where(
                            p =>
                                p.PeriodId == sc.RptPeriodId && p.IsDeleted == false && p.BatchId == sc.BatchId && p.BankBranchId == sc.RptBankBranchId);

                        vw_PayrollTrans = m_payTrans.Where(p => sc.GroupsId.Contains(p.EmpId)).OrderBy(p => p.FirstName).ToList();
                        l_dt = ToDataTable2(vw_PayrollTrans.ToList());
                    }
                    else
                    {
                        var m_payTrans =
                        erpEntities.vwPrlTransactionDetails.Where(
                            p =>
                                p.PeriodId == sc.RptPeriodId && p.IsDeleted == false && p.BatchId == sc.BatchId && p.BankBranchId == sc.RptBankBranchId);

                        l_dt = ToDataTable2(m_payTrans.ToList());
                    }
                   
                }
            }
            return l_dt;
        }
        #endregion
    }
}
