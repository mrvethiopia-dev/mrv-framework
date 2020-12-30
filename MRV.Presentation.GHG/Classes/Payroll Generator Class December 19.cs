
using System;
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
using System.Globalization;
namespace NBI.Presentation.Tsa.Classes
{
    public class PayrollGenerator2
    {
        #region Members
        private readonly ObjectContext _context;
        private readonly PayrollTransactions _PayrollTransactions;
        public PrlPeriod _period;
        private readonly PayrollEmployeePayrollItems _empPItems;
        public readonly PayrollEmployees _employee;
        private readonly PayrollItems _payrollItems;
        private readonly PayrollEmployeeOvertimeHours _empOTHours;
        
        PayrollTransactionsController _payTrans;
        IEnumerable<PrlEmployeePayrollItems> _payrollEmployeePayrollItems;
        
        public readonly PayrollSettings _payrollSettings;
        public readonly PayrollAttendance _payrollAttendance;

        public string generationCaller = String.Empty;
        IEnumerable<PrlAttendance> _payrollEmployeeAttendance;

        public readonly PayrollEmployeeTermination _employeeTermination;
        public readonly PayrollChangesMade _changesMade;
        public readonly PayrollPeriods _periods;

        ArrayList empCols;
        int _employeeId = 0;
        decimal _totalOvertime = 0;
        decimal _loanDuductable = 0;
        decimal _basicPay = 0;
        decimal _totalAdditions = 0;
        decimal _taxableAdditions = 0;
        decimal _tax = 0;				// computed....
        decimal _totalDeductions = 0;    // computed            
        decimal _taxableIncome = 0;
        decimal _contToIncomeTax = 0;
        int IncomeTaxId = 0;
        decimal _pensionEmployee = 0;
        decimal _pensionEmployer = 0;
        decimal _exchangeRate = 0;
        decimal _totalWorkingDays = 0;
        decimal _BasicSalaryGBP;
        double _noOfDaysWorked = 0;


        DataTable l_TransactionTable = new DataTable();

        public List<PayrollGenerator2> _lst_payrollGen = new List<PayrollGenerator2>();

        #endregion

        #region Constants
        /// <summary>
        /// EmpId
        /// </summary>
        public const string COL_EMP_ID = "EmpId";
        /// <summary>
        /// BasicPay
        /// </summary>
        public const string COL_EMP_NAME = "EmployeeName";
        /// <summary>
        /// EmployeeName
        /// </summary>
        public const string COL_BASIC_PAY = "BasicPay";
        /// <summary>
        /// TotalAdditions
        /// </summary>
        public const string COL_ADDITIONS = "TotalAdditions";
        /// <summary>
        /// TaxableAdditions
        /// </summary>
        public const string COL_TAXABLE_ADDITIONS = "TaxableAdditions";
        /// <summary>
        /// Loan
        /// </summary>
        public const string COL_LOAN = "Loan";
        /// <summary>
        /// TotalOvertime
        /// </summary>
        public const string COL_OVERTIME = "TotalOvertime";
        /// <summary>
        /// TaxableOvertime
        /// </summary>
        public const string COL_TAXABLE_OVERTIME = "TaxableOvertime";
        /// <summary>
        /// GrossSalary
        /// </summary>
        public const string COL_GROSS_SALARY = "GrossSalary";
        /// <summary>
        /// TaxableIncome
        /// </summary>
        public const string COL_TAXABLE_INCOME = "TaxableIncome";
        /// <summary>
        /// Tax
        /// </summary>
        public const string COL_TAX = "Tax";
        /// <summary>
        /// TotalDeductions
        /// </summary>
        public const string COL_DEDUCTIONS = "TotalDeductions";
        /// <summary>
        /// Net Payment
        /// </summary>
        public const string COL_NET_PAYMENT = "NetPayment";
        
        /// <summary>
        /// Net Payment
        /// </summary>
        //public const string COL_CONT_TO_INCOME_TAX = "ContToIncomeTax";

        #endregion

        #region Constructor

        public PayrollGenerator2()
        {
            _context = new ENTRO_MISEntities(Constants.ConnectionString);
            _PayrollTransactions = new PayrollTransactions(_context);
            _empPItems = new PayrollEmployeePayrollItems(_context);
            _employee = new PayrollEmployees(_context);
            _payrollItems = new PayrollItems(_context);
            _empOTHours = new PayrollEmployeeOvertimeHours(_context);
            
            _payrollSettings = new PayrollSettings(_context);
            _payrollAttendance = new PayrollAttendance(_context);
            _employeeTermination = new PayrollEmployeeTermination(_context);
            _periods = new PayrollPeriods(_context);
        }

        #endregion

        #region Properties

        /// <summary>
        /// Gets the reference to the PayrollEmployees Id object of the 
        /// current PayrollGenerator2 instance.
        /// </summary>
        public int EmployeeId
        {
            get { return _employeeId; }
            set { _employeeId = value; }
        }

        public bool IncludeOvertime { get; set; }
        public bool ExemptLoan { get; set; }
        public bool ExemptAttendance { get; set; }
        public bool DeleteExisting { get; set; }
        public bool ExemptAdvance { get; set; }

        public string MailAddress { get; set; }

        public decimal GrossPay { get; set; }
        public decimal LateReportToDutyDeduction { get; set; }
        /// <summary>
        /// Gets the reference to the Pay Period object of the 
        /// current PayrollGenerator2 instance.
        /// </summary>
        public PrlPeriod Period
        {
            get { return _period; }
            set { _period = value; }
        }
        /// <summary>
        /// Gets the reference to the TotalOvertime object of the 
        /// current PayrollGenerator2 instance.
        /// </summary>
        public decimal TotalOvertime
        {
            get { return _totalOvertime; }
            set { _totalOvertime = value; }
        }
        /// <summary>
        /// Gets the reference to the LoanDeductable object of the 
        /// current PayrollGenerator2 instance.
        /// </summary>
        public decimal LoanDeductable
        {
            get { return _loanDuductable; }
            set { _loanDuductable = value; }
        }
        /// <summary>
        /// Gets the reference to the BasicPay object of the 
        /// current PayrollGenerator2 instance.
        /// </summary>
        public decimal BasicPay
        {
            get { return _basicPay; }
            set { _basicPay = value; }
        }
        /// <summary>
        /// Gets the reference to the TotalAdditions object of the 
        /// current PayrollGenerator2 instance.
        /// </summary>
        public decimal TotalAdditions
        {
            get { return _totalAdditions; }
            set { _totalAdditions = value; }
        }
        /// <summary>
        /// Gets the reference to the TaxableAdditions object of the 
        /// current PayrollGenerator2 instance.
        /// </summary>
        public decimal TaxableAdditions
        {
            get { return _taxableAdditions; }
            set { _taxableAdditions = value; }
        }
        /// <summary>
        /// Gets the reference to the Tax object of the 
        /// current PayrollGenerator2 instance.
        /// </summary>
        public decimal Tax
        {
            get { return _tax; }
            set { _tax = value; }
        }
        /// <summary>
        /// Gets the reference to the TotalDeduction of the 
        /// current PayrollGenerator2 instance.
        /// </summary>
        public decimal TotalDeductions
        {
            get { return _totalDeductions; }
            set { _totalDeductions = value; }
        }
        /// <summary>
        /// Gets the reference to the TaxableIncome object of the 
        /// current PayrollGenerator2 instance.
        /// </summary>
        public decimal TaxableIncome
        {
            get { return _taxableIncome; }
            set { _taxableIncome = value; }
        }
        /// <summary>
        /// Gets the reference to the PensionEmployee object of the 
        /// current PayrollGenerator2 instance.
        /// </summary>
        public decimal PensionEmployee
        {
            get { return _pensionEmployee; }
            set { _pensionEmployee = value; }
        }

        /// <summary>
        /// Gets the reference to the PensionEmployer object of the 
        /// current PayrollGenerator2 instance.
        /// </summary>
        public decimal PensionEmployer
        {
            get { return _pensionEmployer; }
            set { _pensionEmployer = value; }
        }

        /// <summary>
        /// Gets the reference to the ExchangeRate object of the 
        /// current PayrollGenerator2 instance.
        /// </summary>
        public decimal ExchangeRate
        {
            get { return _exchangeRate; }
            set { _exchangeRate = value; }
        }

        /// <summary>
        /// Gets the reference to the ExchangeRate object of the 
        /// current PayrollGenerator2 instance.
        /// </summary>
        public decimal TotalWorkingDays
        {
            get { return _totalWorkingDays; }
            set { _totalWorkingDays = value; }
        }

        /// <summary>
        /// Gets the reference to the ExchangeRate object of the 
        /// current PayrollGenerator2 instance.
        /// </summary>
        public double NoOfDaysWorked
        {
            get { return _noOfDaysWorked; }
            set { _noOfDaysWorked = value; }
        }
        /// <summary>
        /// Gets the reference to the BasicSalaryGBP object of the 
        /// current PayrollGenerator2 instance.
        /// </summary>
        public decimal BasicSalaryGBP
        {
            get { return _BasicSalaryGBP; }
            set { _BasicSalaryGBP = value; }
        }
        /// <summary>
        /// Gets the reference to the PayrollEmployees Payroll Items object of the 
        /// current PayrollGenerator2 instance and current PayrollEmployees instance.
        /// </summary>
        public IEnumerable<PrlEmployeePayrollItems> EmployeePayrollItems
        {
            get { return _payrollEmployeePayrollItems; }
            set { _payrollEmployeePayrollItems = value; }
        }

        /// <summary>
        /// Gets the reference to the Employee Attendance object of the 
        /// current PayrollGenerator2 instance and current Employee instance.
        /// </summary>
        public IEnumerable<PrlAttendance> EmployeeAttendance
        {
            get { return _payrollEmployeeAttendance; }
            set { _payrollEmployeeAttendance = value; }
        }
        #endregion

        #region Methods

        public bool Generate(IList<int> empGroup, PayrollGenerator2 lGen)
        {
            #region Declarations
            PayrollTaxRatesController taxRates = new PayrollTaxRatesController();
            bool isTaxLoaded = taxRates.LoadTaxRanges();
            IEnumerable<PrlAttendance> EmpAttendanceList = null;
            List<PrlChangesMade> _listChangesMade = new List<PrlChangesMade>();
            PrlChangesMade changesMade;
            bool results = true;
            #endregion

            #region Validate

            #endregion

            #region Delete Existing Data

            #endregion

            #region Cache all required data for payroll generation

            //
            //Load overtime worked hours data and the rates for all selected Employees
            //

            

            //if (lGen.IncludeOvertime)
            //{
            var OTData = _empOTHours.GetAll().Where(p => empGroup.Contains(p.EmpId) && p.PeriodId == this.Period.Id);
            //}

            //
            //Load loan data and the rates for all selected Employees
            //            
            //if (!lGen.ExemptLoan)
            //{
            //var LoanData = _empLoanData.GetAll().Where(p => empGroup.Contains(p.EmpId) && p.LoanDate <= this.Period.StartDate && p.IsLoanCompleted == false);
            //}

            //
            //Load employee payroll items selected Employees
            //            
            var EmpPItemData = _empPItems.GetAll().Where(p => empGroup.Contains(p.EmpId) && p.ApplicableFrom <= this.Period.StartDate && p.ApplicableTo >= this.Period.EndDate || 
                p.ApplicableFrom == this.Period.StartDate && p.ApplicableTo == this.Period.EndDate && p.IsDeleted == false);


            //Load Attendance info 
            if (!lGen.ExemptAttendance)
            {
                EmpAttendanceList = _payrollAttendance.GetAll().Where(p => p.PeriodId == this.Period.Id);
            }
            #endregion

            #region load tax table
               

            if (!isTaxLoaded)
                return false;
            #endregion

            #region Get Constants 
            TotalWorkingDays = Convert.ToDecimal(lGen.Period.TotalWorkingDays);// int.Parse(_payrollSettings.Get(Constants.TotalWorkingDays).SettingValue);
            ExchangeRate = decimal.Parse(_payrollSettings.Get(Constants.ExchangeRate).SettingValue);
            int pensionPItemIde = int.Parse(_payrollSettings.Get(Constants.PensionEmployeeContId).SettingValue);
            decimal empPensionPencent = _payrollItems.Get(pensionPItemIde).PItemAmount;               
                
            int pensionPItemIdr = int.Parse(_payrollSettings.Get(Constants.PensionEmployerContId).SettingValue);
            decimal emprPensionPencent = _payrollItems.Get(pensionPItemIdr).PItemAmount;

            #endregion
            for (int i = 0; i < empGroup.Count; i++)
            {
                EmployeeAttendance = null;
                int _employeeId = empGroup[i];

                _listChangesMade = new List<PrlChangesMade>();
                EmployeeId = _employeeId;
                BasicPay = 0;
                TotalAdditions = 0;
                TaxableAdditions = 0;
                Tax = 0;
                TotalDeductions = 0;
                TaxableIncome = 0;
                LateReportToDutyDeduction = 0;

                var currentEmpObject = _employee.Get(_employeeId);

                #region Copy employee payroll items, overtime data, loan data and c & s data

                var _rowEmpOTHours = OTData.Where(m => m.EmpId == _employeeId && m.PeriodId == this.Period.Id);
                var _rowEmpPTems = EmpPItemData.Where(m => m.EmpId == _employeeId && m.PrlItems.IgnoreOnPayrollGen == false);
                //var _rowEmpLoan = LoanData.Where(m => m.EmpId == _employeeId);

                EmployeePayrollItems = EmpPItemData.Where(m => m.EmpId == _employeeId);

                if (currentEmpObject.SalaryGBP == 0)
                    BasicPay = currentEmpObject.SalaryETB;
                else
                    BasicPay = Convert.ToDecimal(currentEmpObject.SalaryGBP) * ExchangeRate;

                BasicSalaryGBP = Convert.ToDecimal(currentEmpObject.SalaryGBP);

                #region Check period overlap


                #endregion

                #region Check Attendance
                var filtAttendance = _payrollAttendance.Get(EmployeeId, lGen.Period.Id);

                if (filtAttendance != null)
                    NoOfDaysWorked = filtAttendance.TotalDaysWorked;
                else
                    NoOfDaysWorked = Convert.ToDouble(TotalWorkingDays);
                #endregion
                
                #region Check to skip employee due to termination


                if (currentEmpObject.IsTerminated == true)
                {
                    DateTime terminationDate = Convert.ToDateTime(_employeeTermination.GetByEmpId(currentEmpObject.Id).TerminationDate);

                    if (Period.StartDate > terminationDate)
                        continue;
                    if (Period.StartDate.ToShortDateString() == terminationDate.ToShortDateString())
                        continue;

                    if (Period.StartDate < terminationDate && terminationDate < Period.EndDate)
                    {
                        int daysWorked = GetNumberOfWorkingDays(Period.StartDate, terminationDate);
                        decimal PreviousSalary = _PayrollTransactions.GetByPeriodAndEmp(lGen.Period.Id - 1, currentEmpObject.Id).BasicPay;
                        decimal? dailyWage = BasicPay / this.Period.TotalWorkingDays;
                        double? absenceDays = this.Period.TotalWorkingDays - daysWorked;
                        LateReportToDutyDeduction = Convert.ToDecimal(dailyWage * Convert.ToDecimal(absenceDays));
                        BasicPay = BasicPay - LateReportToDutyDeduction;
                        NoOfDaysWorked = daysWorked;


                        #region  Save the employee termination details to the reconciliation table 
                        
                        int basicSalaryPItemId = Convert.ToInt16(_payrollSettings.Get(Constants.BasicSalaryPItemId).SettingValue);                        
                        string MonthName = DateTime.Now.ToString("MMMM", CultureInfo.InvariantCulture);
                        var periodObject = _periods.GetFromFiscalYearAndMonth(DateTime.Now.Year, MonthName);
                        
                        changesMade = new PrlChangesMade
                        {
                            PItemId = basicSalaryPItemId,
                            EmpId = EmployeeId,
                            PreviousAmount = PreviousSalary,
                            ChangedAmount = BasicPay,
                            Difference = Math.Abs(PreviousSalary - BasicPay),
                            DateChanged = DateTime.Now,
                            ReasonForChange = Constants.ReasonEmployeeTerminated,
                            IsDetectedOnPGeneration = true,            
                            ChangePeriodId = Period.Id
                        };
                
                        _listChangesMade.Add(changesMade);
                        #endregion
                    }
                }

                #endregion

                #region check if to skip employee due to employment date

                //Skip Employee if the selected period is before the current employee's employment date
                if (currentEmpObject.EmploymentDate.Year >= this.Period.StartDate.Year)
                {
                    if (currentEmpObject.EmploymentDate.Year > this.Period.StartDate.Year)
                        continue;
                    if (currentEmpObject.EmploymentDate.Month > this.Period.StartDate.Month)
                        continue;
                }



                #endregion

                #region Deduction due to Employment Date
                //Check Employement Date 
                int mTotalDaysWorked = 0;
                DateTime employmentDate = currentEmpObject.EmploymentDate;
                string periodMonthAndYear = this.Period.StartDate.Month.ToString() + this.Period.StartDate.Year.ToString();
                string employmentMonthYear = employmentDate.Month.ToString() + employmentDate.Year.ToString();

                if (employmentMonthYear == periodMonthAndYear)
                {
                    int daysWorked = 0;
                    if (this.Period.StartDate.Day < employmentDate.Day)
                    {
                        int indx = 0;
                        for (var j = employmentDate.Day; j <= this.Period.EndDate.Day; j++)
                        {
                            DateTime currentDate = new DateTime(employmentDate.Year, employmentDate.Month,
                                employmentDate.Day + indx);
                            if (currentDate.DayOfWeek != DayOfWeek.Saturday &&
                                currentDate.DayOfWeek != DayOfWeek.Sunday)
                            {
                                daysWorked++;
                            }
                            indx++;
                        }
                        decimal ActualSalary = BasicPay;
                        decimal? dailyWage = BasicPay / this.Period.TotalWorkingDays;
                        double? absenceDays = this.Period.TotalWorkingDays - daysWorked;
                        LateReportToDutyDeduction = Convert.ToDecimal(dailyWage * Convert.ToDecimal(absenceDays));
                        BasicPay = BasicPay - LateReportToDutyDeduction;
                        NoOfDaysWorked = daysWorked;
                        // TotalDeductions = TotalDeductions + LateReportToDutyDeduction;

                        #region  Save the employee Late Report to Duty deduction details to the chages made table
                        //int basicSalaryPItemId = Convert.ToInt16(_payrollSettings.Get(Constants.BasicSalaryPItemId).SettingValue);
                        
                        //changesMade = new PrlChangesMade
                        //{
                        //    PItemId = basicSalaryPItemId,
                        //    EmpId = EmployeeId,
                        //    PreviousAmount = ActualSalary,
                        //    ChangedAmount = BasicPay,
                        //    Difference = Math.Abs(ActualSalary - BasicPay),
                        //    DateChanged = DateTime.Now,
                        //    ReasonForChange = "Deduction due to Late Report to duty.",
                        //    IsDetectedOnPGeneration = true,            
                        //    ChangePeriodId = Period.Id
                        //};
                
                        //_listChangesMade.Add(changesMade);
                        #endregion

                    }

                    else if (this.Period.StartDate.Day == employmentDate.Day)
                    {
                        decimal? dailyWage = BasicPay / this.Period.TotalWorkingDays;
                        double? absenceDays = 0;
                        LateReportToDutyDeduction = Convert.ToDecimal(dailyWage * Convert.ToDecimal(absenceDays));

                        // TotalDeductions = TotalDeductions + LateReportToDutyDeduction;
                        BasicPay = BasicPay - LateReportToDutyDeduction;
                    }

                }

                #endregion 
                
                MailAddress = currentEmpObject.Email;
                

                if (!lGen.ExemptAttendance && EmpAttendanceList != null)
                {
                    EmployeeAttendance = EmpAttendanceList.Where(m => m.EmpId == _employeeId);
                    if (EmployeeAttendance.Count() > 0)
                    {
                        decimal ded = EmployeeAttendance.FirstOrDefault().DeductableAmount;
                        decimal ActualSalary = BasicPay;
                        BasicPay = BasicPay - (ded);
                        BasicSalaryGBP = BasicPay/ExchangeRate;
                        // TotalDeductions = TotalDeductions + EmployeeAttendance.FirstOrDefault().DeductableAmount;

                        #region  Save the employee Absenteesm Deduction details to the chages made table
                        int basicSalaryPItemId = Convert.ToInt16(_payrollSettings.Get(Constants.BasicSalaryPItemId).SettingValue);
                        
                        changesMade = new PrlChangesMade
                        {
                            PItemId = basicSalaryPItemId,
                            EmpId = EmployeeId,
                            PreviousAmount = ActualSalary,
                            ChangedAmount = BasicPay,
                            Difference = Math.Abs(ActualSalary - BasicPay),
                            DateChanged = DateTime.Now,
                            ReasonForChange = "Absenteeism Deduction",
                            IsDetectedOnPGeneration = true,            
                            ChangePeriodId = Period.Id
                        };
                
                        _listChangesMade.Add(changesMade);
                        #endregion
                    }

                }
                //Copy overtime hours and Loan Amounts 
                if (lGen.IncludeOvertime)
                {
                    TotalOvertime = ComputeOvertime(_rowEmpOTHours);
                }

                if (!lGen.ExemptLoan)
                {
                    //var m = _rowEmpLoan.ToList();
                    //if (m.Count == 0)
                    //    LoanDeductable = 0;
                    //else
                    //    LoanDeductable = ComputeLoan(_rowEmpLoan);
                }

                #endregion

                #region Generate Payroll

                //compute total additions 
                foreach (var empAdditions in _rowEmpPTems)
                {
                    if (empAdditions.PrlItems.PItemIsAddition == true && empAdditions.PrlItems.IgnoreOnPayrollGen == false)
                    {
                        TotalAdditions = TotalAdditions + empAdditions.Amount ;
                    }
                }


                //compute total deductions 
                foreach (var empDeductions in _rowEmpPTems)
                {
                    if (empDeductions.PrlItems.PItemIsAddition == false && empDeductions.PrlItems.IgnoreOnPayrollGen == false)
                    {
                        //Include Absenteesm Deduction 
                        if (EmployeeAttendance.Count() > 0 || LateReportToDutyDeduction !=0)
                        {
                            if (empDeductions.PrlItems.PItemApplicationType == "Percentage Of Basic Salary")
                            {
                                var newAmount = empDeductions.PrlItems.PItemAmount*BasicPay/100;
                                TotalDeductions = TotalDeductions + newAmount;
                            }
                        }
                        else
                            TotalDeductions = TotalDeductions + empDeductions.Amount;
                    }
                }
                //compute taxable additions
                foreach (var empTaxableAdditions in _rowEmpPTems)
                {
                    if (empTaxableAdditions.PrlItems.PItemIsTaxed == true && empTaxableAdditions.PrlItems.IgnoreOnPayrollGen == false)
                    {
                        if (empTaxableAdditions.Amount > empTaxableAdditions.PrlItems.PItemInitialTaxableAmount)
                            TaxableAdditions = TaxableAdditions + (empTaxableAdditions.Amount - empTaxableAdditions.PrlItems.PItemInitialTaxableAmount);
                    }
                }

                //Include Absenteesm Deduction 
                if (EmployeeAttendance.Count() > 0)
                {
                    //Compute Income Tax
                    decimal ded = EmployeeAttendance.FirstOrDefault().DeductableAmount;
                    TaxableIncome = BasicPay + TaxableAdditions + TotalOvertime;
                    
                    
                    GrossPay = BasicPay + TotalAdditions;
                }
                else
                {
                    //Compute Income Tax
                    TaxableIncome = BasicPay + TaxableAdditions + TotalOvertime;
                    GrossPay = BasicPay + TotalAdditions;
                }
                float m_IncomeTax = taxRates.ComputeTax(TaxableIncome);
                Tax = Convert.ToDecimal(m_IncomeTax);

                   

                TotalAdditions = TotalAdditions + TotalOvertime ;
                TotalDeductions = TotalDeductions + Tax + LoanDeductable ;// + PensionEmployee;
                TaxableAdditions = TaxableAdditions + TotalOvertime;


                #region Compute Pension
                //Compute Pension PayrollEmployees Side  ..... { MUST Check first if the employee is entitled to Pension } //To be done
                var checkPensionEntitlment = EmpPItemData.Where(p => p.EmpId == _employeeId && p.PItemId == pensionPItemIde);

                if (checkPensionEntitlment.Count() > 0)
                {
                    PensionEmployee = empPensionPencent * BasicPay / 100;


                    //Compute Pension Employer Side  ..... { MUST Check first if the employee is entitled to Pension } //To be done
                    PensionEmployer = emprPensionPencent * BasicPay / 100;

                }
                else
                {
                    PensionEmployee = 0;
                    PensionEmployer = 0;
                }
                #endregion
                #endregion

                #region Save...
                _payTrans = new PayrollTransactionsController();

               // _payTrans.SaveTransactions(this, _listChangesMade);

                #endregion

                #region Finalize Generation

                #endregion
            }
                
                
            return results;
            
        }

        public decimal ComputeOvertime(IEnumerable<PrlEmployeeOvertimeHours> _empOTHours)
        {
            decimal totalOvertime = 0;
            PayrollOvertimeRates _otRates = new PayrollOvertimeRates(_context);
            PayrollSettings _payrollSettings = new PayrollSettings(_context);
            foreach (var otHrs in _empOTHours)
            {
                decimal m_OTRate = Convert.ToDecimal(_otRates.Get(otHrs.OTId).OTRateAmount);
                decimal? m_workingHours = 177;

                if (m_workingHours == null || m_workingHours == 0)
                    m_workingHours = 192;
                if (m_workingHours != null || m_workingHours > 0)
                    totalOvertime = (totalOvertime) + (Convert.ToDecimal(otHrs.OTWorkedHours) * m_OTRate * this.BasicPay / Convert.ToDecimal(m_workingHours));
            }

            return totalOvertime;

        }
        

        public DataTable ViewTransactions(int m_period)
        {
            DataTable dt_Transaction = new DataTable();
            using (ENTRO_MISEntities erpEntities = new ENTRO_MISEntities())
            {

                var m_payTrans = erpEntities.vwPrlTransactionDetails;
                var m_payrollTransactions = erpEntities.vwPrlTransactionDetails.ToList();

                dt_Transaction = CreateGridColumns(m_payTrans);

                
                var all_apyrollTransactions = _PayrollTransactions.GetAll().Where(p => p.PeriodId == m_period && p.IsDeleted == false);
                int count = _PayrollTransactions.GetAll().Where(p => p.IsDeleted == false).Count();


                int l_row = 0;
                foreach (var m_Trans in all_apyrollTransactions)
                {
                    dt_Transaction.Rows.Add();
                    int colCount = dt_Transaction.Columns.Count;

                    for (int i = 0; i < colCount; i++)
                    {
                        dt_Transaction.Rows[l_row][i] = 0;
                    }

                    bool first_row = true;
                    var m_payrollTrans = m_payTrans.Where(p => p.TransactionId == m_Trans.Id);
                    foreach (var m_pTrans in m_payrollTrans)
                    {
                        if (first_row)
                        {
                            dt_Transaction.Rows[l_row][COL_EMP_ID] = m_pTrans.IdentityNo;
                            dt_Transaction.Rows[l_row][COL_EMP_NAME] = m_pTrans.EmployeeName;
                            dt_Transaction.Rows[l_row][COL_BASIC_PAY] = m_pTrans.BasicPay;                           
                            dt_Transaction.Rows[l_row][COL_ADDITIONS] = m_pTrans.TotalAdditions;
                            dt_Transaction.Rows[l_row][COL_TAXABLE_ADDITIONS] = m_pTrans.TaxableAdditions;
                            dt_Transaction.Rows[l_row][COL_OVERTIME] = m_pTrans.TotalOvertime;
                            //dt_Transaction.Rows[l_row][COL_TAXABLE_OVERTIME] = 0;
                            dt_Transaction.Rows[l_row][COL_GROSS_SALARY] = m_pTrans.GrossSalary;
                            dt_Transaction.Rows[l_row][COL_TAXABLE_INCOME] = m_pTrans.TaxableIncome;
                           // dt_Transaction.Rows[l_row][COL_TAX] = m_pTrans.Tax;
                            dt_Transaction.Rows[l_row][COL_DEDUCTIONS] = m_pTrans.TotalDeductions;
                            dt_Transaction.Rows[l_row][COL_NET_PAYMENT] = m_pTrans.NetPayment;
                            dt_Transaction.Rows[l_row][COL_LOAN] = m_pTrans.Loan;

                        }

                        dt_Transaction.Rows[l_row][m_pTrans.PItemName] = m_pTrans.PItemAmount;
                        first_row = false;
                    }
                    l_row++;

                }


            }


            return dt_Transaction;
        }

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

        public DataTable CreateGridColumns(IEnumerable<vwPrlTransactionDetails> m_payTrans)
        {

            empCols = new ArrayList(new string[] { COL_EMP_ID, COL_EMP_NAME, COL_BASIC_PAY });
            ArrayList al = new ArrayList(new string[] { 
					  COL_ADDITIONS, COL_TAXABLE_ADDITIONS,  
					  COL_OVERTIME, COL_TAXABLE_OVERTIME, 
					  COL_GROSS_SALARY, 
					  COL_TAXABLE_INCOME, COL_TAX, 
					  COL_DEDUCTIONS, COL_NET_PAYMENT
					 });

            foreach (string l_empCol in empCols)
            {
                l_TransactionTable.Columns.Add(l_empCol);
            }
            string[] l_additions = null;
            string[] l_deductions = null;

            GetDistinctAdditionsAndDeductions(ref l_additions, ref l_deductions, m_payTrans);

            if ((l_additions != null) && (l_additions.Length > 0))
            {

                foreach (string l_add in l_additions)
                {
                    if (l_add != null)
                        l_TransactionTable.Columns.Add(l_add);
                }

            }
            
            l_TransactionTable.Columns.Add(COL_OVERTIME);
            l_TransactionTable.Columns.Add(COL_ADDITIONS);
            l_TransactionTable.Columns.Add(COL_TAXABLE_ADDITIONS);
            l_TransactionTable.Columns.Add(COL_GROSS_SALARY);
            l_TransactionTable.Columns.Add(COL_TAXABLE_INCOME);


            if ((l_deductions != null) && (l_deductions.Length > 0))
            {

                foreach (string l_ded in l_deductions)
                {
                    if (l_ded != null)
                    {
                        //string ded = l_ded.Replace(" ", "");
                        l_TransactionTable.Columns.Add(l_ded);
                    }
                }
            }
            l_TransactionTable.Columns.Add(COL_LOAN);
           // l_TransactionTable.Columns.Add(COL_TAX);
            l_TransactionTable.Columns.Add(COL_DEDUCTIONS);
            l_TransactionTable.Columns.Add(COL_NET_PAYMENT);


            return l_TransactionTable;

        }

        /// <summary>
        /// Returns the names of distinct additions and deductions, based on the last used 
        /// data retrieval criteria.
        /// </summary>
        /// <param name="additions"></param>
        /// <param name="deductions"></param>
        /// <returns></returns>
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

        public object[] GetTransactionColumns()
        {
            string[] m_columnList;
            DataTable dt_Transaction = new DataTable();
            using (ENTRO_MISEntities erpEntities = new ENTRO_MISEntities())
            {

                var m_payTrans = erpEntities.vwPrlTransactionDetails;
                var m_payrollTransactions = erpEntities.vwPrlTransactionDetails.ToList();


                //DataTable dt = ToDataTable(m_payrollTransactions);

                dt_Transaction = CreateGridColumns(m_payTrans);

                int i = 0;
                m_columnList = new string[dt_Transaction.Columns.Count];
                foreach (DataColumn dc in dt_Transaction.Columns)
                {
                    m_columnList[i] = dc.Caption;
                    i++;
                }
            }
            return m_columnList;
        }

        public int GetNumberOfWorkingDays(DateTime dateOne, DateTime dateTwo)
        {
            int daysWorked = 0;

            int indx = 0;
            //for loop to get the number of working days between two given dates 
            for (var j = dateOne.Day; j < dateTwo.Day; j++)
            {
                DateTime currentDate = new DateTime(dateOne.Year, dateOne.Month,
                    dateOne.Day + indx);
                if (currentDate.DayOfWeek != DayOfWeek.Saturday && currentDate.DayOfWeek != DayOfWeek.Sunday)
                {
                    daysWorked++;
                }
                indx++;
            }

            return daysWorked;
        }

        public void SaveChangesMadeOnPItems(int pItemId, int empId, decimal newAmount, decimal existingAmount, string reason)
        {

            var changesMade = new PrlChangesMade();
            changesMade.PItemId = pItemId;
            changesMade.EmpId = empId;
            changesMade.PreviousAmount = existingAmount;
            changesMade.ChangedAmount = newAmount;
            changesMade.Difference = Math.Abs(existingAmount - newAmount);
            changesMade.DateChanged = DateTime.Now;
            changesMade.ReasonForChange = reason;
            changesMade.IsDetectedOnPGeneration = false;

            string MonthName = DateTime.Now.ToString("MMMM", CultureInfo.InvariantCulture);
            var periodObject = _periods.GetFromFiscalYearAndMonth(DateTime.Now.Year, MonthName);
            changesMade.ChangePeriodId = periodObject.Id;

            _changesMade.AddNew(changesMade);

        }
        #endregion

    }


   
}
