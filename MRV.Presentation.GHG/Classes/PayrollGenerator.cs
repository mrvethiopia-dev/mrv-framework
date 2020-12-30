using System;
using System.Collections.Generic;
using System.Collections;
using System.Linq;
using System.Data;
using System.Transactions;
using NBI.Data.Model;
using NBI.Business.Tsa;
using NBI.Presentation.Tsa.Controllers;
using System.Data.Objects;
using System.Reflection;
using System.Globalization;
using System.Data.SqlClient;
namespace NBI.Presentation.Tsa.Classes
{
    public class PayrollGenerator
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

        public readonly PayrollSettings _payrollSettings;
        public readonly PayrollAttendance _payrollAttendance;

        public string generationCaller = String.Empty;

        public readonly PayrollEmployeeTermination _employeeTermination;
        public readonly PayrollChangesMade _changesMade;
        public readonly PayrollPeriods _periods;

        public readonly PayrollSalaryPositionChange _SalaryChange;
        public readonly PayrollAttendanceDetail _AttendanceDetail;

        ArrayList empCols;
        int _employeeId = 0;
        decimal _contToIncomeTax = 0;
        int IncomeTaxId = 0;


        DataTable l_TransactionTable = new DataTable();

        public List<PayrollGenerator> _lst_payrollGen = new List<PayrollGenerator>();

        List<PrlChangesMade> _listChangesMade = new List<PrlChangesMade>();
        PrlChangesMade changesMade;

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

        public PayrollGenerator()
        {
            NoOfDaysWorked = 0;
            TotalWorkingDays = 0;
            ExchangeRate = 0;
            PensionEmployer = 0;
            PensionEmployee = 0;
            TaxableIncome = 0;
            TotalDeductions = 0;
            Tax = 0;
            TaxableAdditions = 0;
            TotalAdditions = 0;
            BasicPay = 0;
            LoanDeductable = 0;
            TotalOvertime = 0;
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

            _SalaryChange = new PayrollSalaryPositionChange(_context);
            _AttendanceDetail = new PayrollAttendanceDetail(_context);
        }

        #endregion

        #region Properties

        /// <summary>
        /// Gets the reference to the PayrollEmployees Id object of the 
        /// current PayrollGenerator instance.
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

        public string BatchId { get; set; }
        /// <summary>
        /// Gets the reference to the Pay Period object of the 
        /// current PayrollGenerator instance.
        /// </summary>
        public PrlPeriod Period
        {
            get { return _period; }
            set { _period = value; }
        }

        /// <summary>
        /// Gets the reference to the TotalOvertime object of the 
        /// current PayrollGenerator instance.
        /// </summary>
        public decimal TotalOvertime { get; set; }

        /// <summary>
        /// Gets the reference to the LoanDeductable object of the 
        /// current PayrollGenerator instance.
        /// </summary>
        public decimal LoanDeductable { get; set; }

        /// <summary>
        /// Gets the reference to the BasicPay object of the 
        /// current PayrollGenerator instance.
        /// </summary>
        public decimal BasicPay { get; set; }

        /// <summary>
        /// Gets the reference to the TotalAdditions object of the 
        /// current PayrollGenerator instance.
        /// </summary>
        public decimal TotalAdditions { get; set; }

        /// <summary>
        /// Gets the reference to the TaxableAdditions object of the 
        /// current PayrollGenerator instance.
        /// </summary>
        public decimal TaxableAdditions { get; set; }

        /// <summary>
        /// Gets the reference to the Tax object of the 
        /// current PayrollGenerator instance.
        /// </summary>
        public decimal Tax { get; set; }

        /// <summary>
        /// Gets the reference to the TotalDeduction of the 
        /// current PayrollGenerator instance.
        /// </summary>
        public decimal TotalDeductions { get; set; }

        /// <summary>
        /// Gets the reference to the TaxableIncome object of the 
        /// current PayrollGenerator instance.
        /// </summary>
        public decimal TaxableIncome { get; set; }

        /// <summary>
        /// Gets the reference to the PensionEmployee object of the 
        /// current PayrollGenerator instance.
        /// </summary>
        public decimal PensionEmployee { get; set; }

        /// <summary>
        /// Gets the reference to the PensionEmployer object of the 
        /// current PayrollGenerator instance.
        /// </summary>
        public decimal PensionEmployer { get; set; }

        /// <summary>
        /// Gets the reference to the ExchangeRate object of the 
        /// current PayrollGenerator instance.
        /// </summary>
        public decimal ExchangeRate { get; set; }

        /// <summary>
        /// Gets the reference to the ExchangeRate object of the 
        /// current PayrollGenerator instance.
        /// </summary>
        public decimal TotalWorkingDays { get; set; }

        /// <summary>
        /// Gets the reference to the ExchangeRate object of the 
        /// current PayrollGenerator instance.
        /// </summary>
        public double NoOfDaysWorked { get; set; }

        /// <summary>
        /// Gets the reference to the BasicSalaryGBP object of the 
        /// current PayrollGenerator instance.
        /// </summary>
        public decimal BasicSalaryGBP { get; set; }

        /// <summary>
        /// Gets the reference to the PayrollEmployees Payroll Items object of the 
        /// current PayrollGenerator instance and current PayrollEmployees instance.
        /// </summary>
        public IEnumerable<PrlEmployeePayrollItems> EmployeePayrollItems { get; set; }

        /// <summary>
        /// Gets the reference to the Employee Attendance object of the 
        /// current PayrollGenerator instance and current Employee instance.
        /// </summary>
        public IEnumerable<PrlAttendance> EmployeeAttendance { get; set; }

        /// <summary>
        /// Gets the reference to the Employee Attendance object of the 
        /// current PayrollGenerator instance and current Employee instance.
        /// </summary>
        public IEnumerable<PrlAttendanceDetail> EmployeeAttendanceDetail { get; set; }

        /// <summary>
        /// Gets the reference to the SkipOutOfContractEmployees object of the 
        /// current PayrollGenerator instance.
        /// </summary>
        public bool SkipOutOfContractEmployees { get; set; }

        /// <summary>
        /// Gets the reference to the Employee Attendance object of the 
        /// current PayrollGenerator instance and current Employee instance.
        /// </summary>
        public List<string> SkippedOutOfContractList { get; set; }

        #endregion

        #region Methods

        public bool Generate(IList<int> empGroup, PayrollGenerator lGen)
        {
            #region Declarations

            var taxRates = new PayrollTaxRatesController();
            var isTaxLoaded = taxRates.LoadTaxRanges();
            IEnumerable<PrlAttendance> EmpAttendanceList = null;
            SkippedOutOfContractList = new List<string>();
            var results = true;

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
            var EmpPItemData =
                _empPItems.GetAll()
                    .Where(
                        p =>
                            empGroup.Contains(p.EmpId) && p.ApplicableFrom <= this.Period.StartDate &&
                            p.ApplicableTo >= this.Period.EndDate ||
                            p.ApplicableFrom == this.Period.StartDate && p.ApplicableTo == this.Period.EndDate &&
                            p.IsDeleted == false);


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

            TotalWorkingDays = Convert.ToDecimal(lGen.Period.TotalWorkingDays);
                // int.Parse(_payrollSettings.Get(Constants.TotalWorkingDays).SettingValue);
            ExchangeRate = decimal.Parse(_payrollSettings.Get(Constants.ExchangeRate).SettingValue);
            var pensionPItemIde = int.Parse(_payrollSettings.Get(Constants.PensionEmployeeContId).SettingValue);
            var empPensionPencent = _payrollItems.Get(pensionPItemIde).PItemAmount;

            var pensionPItemIdr = int.Parse(_payrollSettings.Get(Constants.PensionEmployerContId).SettingValue);
            var emprPensionPencent = _payrollItems.Get(pensionPItemIdr).PItemAmount;

            #endregion

            using (var transaction = new TransactionScope(TransactionScopeOption.Required,new System.TimeSpan(0, 15, 0)))
            {
                _context.Connection.Open();
                _context.CommandTimeout = int.MaxValue;
                foreach (var emp in empGroup)
                {
                    SqlConnection.ClearAllPools();
                    EmployeeAttendance = null;
                    var _employeeId = emp;



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

                    #region check if to skip employee due to contract end date

                    if (this.SkipOutOfContractEmployees)
                    {
                        if (currentEmpObject.ContractEndDate != null)
                        {
                            DateTime contEndDate = Convert.ToDateTime(currentEmpObject.ContractEndDate);

                            if (contEndDate < this.Period.EndDate)
                            {
                                SkippedOutOfContractList.Add(currentEmpObject.FirstName + " " +
                                                             currentEmpObject.MiddleName + " " +
                                                             currentEmpObject.LastName);
                                continue;

                            }
                        }
                    }

                    #endregion

                    #region Copy employee payroll items, overtime data, loan data and c & s data

                    var _rowEmpOTHours = OTData.Where(m => m.EmpId == _employeeId && m.PeriodId == this.Period.Id);
                    var _rowEmpPTems =
                        EmpPItemData.Where(m => m.EmpId == _employeeId && m.PrlItems.IgnoreOnPayrollGen == false);
                    //var _rowEmpLoan = LoanData.Where(m => m.EmpId == _employeeId);

                    EmployeePayrollItems = EmpPItemData.Where(m => m.EmpId == _employeeId);

                    #endregion

                    BasicPay = ComputeBasicSalary(currentEmpObject, this.Period);

                    BasicSalaryGBP = Convert.ToDecimal(currentEmpObject.SalaryGBP);

                    #region Deduction due to Employment Date

                    ////Check Employement Date 
                    //int mTotalDaysWorked = 0;
                    //DateTime employmentDate = currentEmpObject.EmploymentDate;
                    //string periodMonthAndYear = this.Period.StartDate.Month.ToString() + this.Period.StartDate.Year.ToString();
                    //string employmentMonthYear = employmentDate.Month.ToString() + employmentDate.Year.ToString();

                    //if (employmentMonthYear == periodMonthAndYear)
                    //{
                    //    int daysWorked = 0;
                    //    if (this.Period.StartDate.Day < employmentDate.Day)
                    //    {
                    //        int indx = 0;
                    //        for (var j = employmentDate.Day; j <= this.Period.EndDate.Day; j++)
                    //        {
                    //            DateTime currentDate = new DateTime(employmentDate.Year, employmentDate.Month,
                    //                employmentDate.Day + indx);
                    //            if (currentDate.DayOfWeek != DayOfWeek.Saturday &&
                    //                currentDate.DayOfWeek != DayOfWeek.Sunday)
                    //            {
                    //                daysWorked++;
                    //            }
                    //            indx++;
                    //        }
                    //        decimal ActualSalary = BasicPay;
                    //        decimal? dailyWage = BasicPay / this.Period.TotalWorkingDays;
                    //        double? absenceDays = this.Period.TotalWorkingDays - daysWorked;
                    //        LateReportToDutyDeduction = Convert.ToDecimal(dailyWage * Convert.ToDecimal(absenceDays));
                    //        BasicPay = BasicPay - LateReportToDutyDeduction;
                    //        NoOfDaysWorked = daysWorked;
                    //        // TotalDeductions = TotalDeductions + LateReportToDutyDeduction;

                    //        #region  Save the employee Late Report to Duty deduction details to the chages made table
                    //        //int basicSalaryPItemId = Convert.ToInt16(_payrollSettings.Get(Constants.BasicSalaryPItemId).SettingValue);

                    //        //changesMade = new PrlChangesMade
                    //        //{
                    //        //    PItemId = basicSalaryPItemId,
                    //        //    EmpId = EmployeeId,
                    //        //    PreviousAmount = ActualSalary,
                    //        //    ChangedAmount = BasicPay,
                    //        //    Difference = Math.Abs(ActualSalary - BasicPay),
                    //        //    DateChanged = DateTime.Now,
                    //        //    ReasonForChange = "Deduction due to Late Report to duty.",
                    //        //    IsDetectedOnPGeneration = true,            
                    //        //    ChangePeriodId = Period.Id
                    //        //};

                    //        //_listChangesMade.Add(changesMade);
                    //        #endregion

                    //    }

                    //    else if (this.Period.StartDate.Day == employmentDate.Day)
                    //    {
                    //        decimal? dailyWage = BasicPay / this.Period.TotalWorkingDays;
                    //        double? absenceDays = 0;
                    //        LateReportToDutyDeduction = Convert.ToDecimal(dailyWage * Convert.ToDecimal(absenceDays));

                    //        // TotalDeductions = TotalDeductions + LateReportToDutyDeduction;
                    //        BasicPay = BasicPay - LateReportToDutyDeduction;
                    //    }

                    //}

                    #endregion

                    #region Check Attendance

                    //var filtAttendance = _payrollAttendance.Get(EmployeeId, lGen.Period.Id);

                    //NoOfDaysWorked = filtAttendance != null ? filtAttendance.TotalDaysWorked : Convert.ToDouble(TotalWorkingDays);

                    //if (!lGen.ExemptAttendance && EmpAttendanceList != null)
                    //{
                    //    EmployeeAttendance = EmpAttendanceList.Where(m => m.EmpId == _employeeId);
                    //    if (EmployeeAttendance.Any())
                    //    {
                    //        decimal ded = EmployeeAttendance.FirstOrDefault().DeductableAmount;
                    //        decimal ActualSalary = BasicPay;
                    //        BasicPay = BasicPay - (ded);
                    //        BasicSalaryGBP = BasicPay / ExchangeRate;
                    //        // TotalDeductions = TotalDeductions + EmployeeAttendance.FirstOrDefault().DeductableAmount;

                    //        #region  Save the employee Absenteesm Deduction details to the chages made table
                    //        int basicSalaryPItemId = Convert.ToInt16(_payrollSettings.Get(Constants.BasicSalaryPItemId).SettingValue);

                    //        changesMade = new PrlChangesMade
                    //        {
                    //            PItemId = basicSalaryPItemId,
                    //            EmpId = EmployeeId,
                    //            PreviousAmount = ActualSalary,
                    //            ChangedAmount = BasicPay,
                    //            Difference = Math.Abs(ActualSalary - BasicPay),
                    //            DateChanged = DateTime.Now,
                    //            ReasonForChange = "Absenteeism Deduction",
                    //            IsDetectedOnPGeneration = true,
                    //            ChangePeriodId = Period.Id
                    //        };

                    //        _listChangesMade.Add(changesMade);
                    //        #endregion
                    //    }

                    //}

                    #endregion

                    #region Check to skip employee due to termination


                    if (currentEmpObject.IsTerminated == true)
                    {
                        DateTime terminationDate =
                            Convert.ToDateTime(_employeeTermination.GetByEmpId(currentEmpObject.Id).TerminationDate);

                        if (Period.StartDate > terminationDate)
                            continue;
                        if (Period.StartDate.ToShortDateString() == terminationDate.ToShortDateString())
                            continue;
                    }
                    //    if (Period.StartDate < terminationDate && terminationDate < Period.EndDate)
                    //    {
                    //        int daysWorked = GetNumberOfWorkingDays(Period.StartDate, terminationDate);
                    //        decimal PreviousSalary = _PayrollTransactions.GetByPeriodAndEmp(lGen.Period.Id - 1, currentEmpObject.Id).BasicPay;
                    //        decimal? dailyWage = BasicPay / this.Period.TotalWorkingDays;
                    //        double? absenceDays = this.Period.TotalWorkingDays - daysWorked;
                    //        LateReportToDutyDeduction = Convert.ToDecimal(dailyWage * Convert.ToDecimal(absenceDays));
                    //        BasicPay = BasicPay - LateReportToDutyDeduction;
                    //        NoOfDaysWorked = daysWorked;


                    //        #region  Save the employee termination details to the reconciliation table

                    //        int basicSalaryPItemId = Convert.ToInt16(_payrollSettings.Get(Constants.BasicSalaryPItemId).SettingValue);
                    //        string MonthName = DateTime.Now.ToString("MMMM", CultureInfo.InvariantCulture);
                    //        var periodObject = _periods.GetFromFiscalYearAndMonth(DateTime.Now.Year, MonthName);

                    //        changesMade = new PrlChangesMade
                    //        {
                    //            PItemId = basicSalaryPItemId,
                    //            EmpId = EmployeeId,
                    //            PreviousAmount = PreviousSalary,
                    //            ChangedAmount = BasicPay,
                    //            Difference = Math.Abs(PreviousSalary - BasicPay),
                    //            DateChanged = DateTime.Now,
                    //            ReasonForChange = Constants.ReasonEmployeeTerminated,
                    //            IsDetectedOnPGeneration = true,
                    //            ChangePeriodId = Period.Id
                    //        };

                    //        _listChangesMade.Add(changesMade);
                    //        #endregion
                    //    }
                    //}

                    #endregion

                    MailAddress = currentEmpObject.Email;

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



                    #region Generate Payroll

                    //compute total additions 
                    foreach (var empAdditions in _rowEmpPTems)
                    {
                        if (empAdditions.PrlItems.PItemIsAddition == true &&
                            empAdditions.PrlItems.IgnoreOnPayrollGen == false)
                        {
                            TotalAdditions = TotalAdditions + empAdditions.Amount;
                        }
                    }


                    //compute total deductions 
                    foreach (var empDeductions in _rowEmpPTems)
                    {
                        if (empDeductions.PrlItems.PItemIsAddition == false &&
                            empDeductions.PrlItems.IgnoreOnPayrollGen == false)
                        {
                            if (empDeductions.PrlItems.PItemApplicationType == "Percentage Of Basic Salary")
                            {
                                var newAmount = empDeductions.PrlItems.PItemAmount*BasicPay/100;
                                TotalDeductions = TotalDeductions + newAmount;
                            }
                            else
                                TotalDeductions = TotalDeductions + empDeductions.Amount;
                        }
                    }
                    //compute taxable additions
                    foreach (var empTaxableAdditions in _rowEmpPTems)
                    {
                        if (empTaxableAdditions.PrlItems.PItemIsTaxed == true &&
                            empTaxableAdditions.PrlItems.IgnoreOnPayrollGen == false)
                        {
                            if (empTaxableAdditions.Amount > empTaxableAdditions.PrlItems.PItemInitialTaxableAmount)
                                TaxableAdditions = TaxableAdditions +
                                                   (empTaxableAdditions.Amount -
                                                    empTaxableAdditions.PrlItems.PItemInitialTaxableAmount);
                        }
                    }

                    TotalAdditions = TotalAdditions + TotalOvertime;

                    TaxableAdditions = TaxableAdditions + TotalOvertime;

                    TaxableIncome = BasicPay + TaxableAdditions;
                    GrossPay = BasicPay + TotalAdditions;

                    var m_IncomeTax = taxRates.ComputeTax(TaxableIncome);
                    Tax = Convert.ToDecimal(m_IncomeTax);

                    TotalDeductions = TotalDeductions + Tax + LoanDeductable; // + PensionEmployee;

                    #region Compute Pension

                    //Compute Pension PayrollEmployees Side  ..... { MUST Check first if the employee is entitled to Pension } //To be done
                    var checkPensionEntitlment =
                        EmpPItemData.Where(p => p.EmpId == _employeeId && p.PItemId == pensionPItemIde);

                    if (checkPensionEntitlment.Any())
                    {
                        PensionEmployee = empPensionPencent*BasicPay/100;

                        PensionEmployer = emprPensionPencent*BasicPay/100;

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

                    _payTrans.SaveTransactions(this, _listChangesMade);

                    #endregion

                    #region Finalize Generation

                    #endregion
                }
                transaction.Complete();
                _context.AcceptAllChanges();
            }

            return results;
            
        }

        public decimal ComputeOvertime(IEnumerable<PrlEmployeeOvertimeHours> _empOTHours)
        {
            decimal totalOvertime = 0;
            var _otRates = new PayrollOvertimeRates(_context);
            var _payrollSettings = new PayrollSettings(_context);
            foreach (var otHrs in _empOTHours)
            {

                totalOvertime = totalOvertime + otHrs.Amount;
            }

            return totalOvertime;

        }

        public decimal ComputeBasicSalary(PrlEmployees currentEmpObject, PrlPeriod PeriodObj)
        {
            //if (currentEmpObject.Id == 299 || currentEmpObject.Id == 313)
            //{
                
            //}
            decimal basicSalary = 0;

            int basicSalaryPItemId = Convert.ToInt16(_payrollSettings.Get(Constants.BasicSalaryPItemId).SettingValue);

            IEnumerable<PrlAttendance> empAttendanceList = null;

            empAttendanceList = _payrollAttendance.GetAll().Where(p => p.PeriodId == PeriodObj.Id);

            var periodSalaryChange = _SalaryChange.GetAll().Where(e => e.EffectivePeriodId == PeriodObj.Id & e.EmpId == currentEmpObject.Id & e.IsSalaryChanged == true & e.IsFromBSC != true & e.IsFromBCC != true).OrderBy(e => e.EffectiveDate);
            
            var exc_rate = decimal.Parse(_payrollSettings.Get(Constants.ExchangeRate).SettingValue);

            
            if (currentEmpObject.SalaryGBP == 0)
                basicSalary = currentEmpObject.SalaryETB;
            else
                basicSalary = Convert.ToDecimal(currentEmpObject.SalaryGBP) * exc_rate;

            var _TOTAL_DAYS = 0;

            if (!periodSalaryChange.Any())
            {
                _TOTAL_DAYS = (int)TotalWorkingDays;

                #region Deduction due to Employment Date

                //Check Employement Date 
                var mTotalDaysWorked = 0;
                var employmentDate = currentEmpObject.EmploymentDate;
                var periodMonthAndYear = PeriodObj.StartDate.Month + PeriodObj.StartDate.Year.ToString();
                var employmentMonthYear = employmentDate.Month + employmentDate.Year.ToString();

                if (employmentMonthYear == periodMonthAndYear)
                {
                    var daysWorked = 0;

                    //If the employee is hired after the selected month (has late report to deduction )
                    if (PeriodObj.StartDate.Day < employmentDate.Day)
                    {
                        var indx = 0;
                        //for loop to single out week days and to single out the days before the hiring date 
                        for (var j = employmentDate.Day; j <= PeriodObj.EndDate.Day; j++)
                        {
                            var currentDate = new DateTime(employmentDate.Year, employmentDate.Month,
                                employmentDate.Day + indx);
                            if (currentDate.DayOfWeek != DayOfWeek.Saturday &&
                                currentDate.DayOfWeek != DayOfWeek.Sunday)
                            {
                                daysWorked++;
                            }
                            indx++;
                        }
                        var dailyWage = basicSalary/PeriodObj.TotalWorkingDays;
                        double? absenceDays = PeriodObj.TotalWorkingDays - daysWorked;
                        LateReportToDutyDeduction = Convert.ToDecimal(dailyWage*Convert.ToDecimal(absenceDays));
                        basicSalary = basicSalary - LateReportToDutyDeduction;
                        //NoOfDaysWorked = daysWorked;

                        _TOTAL_DAYS = (int) (_TOTAL_DAYS - absenceDays);

                    }
                    //Else If, if the employment date is equal to the period start date (no late report to duty deduction)
                    else if (PeriodObj.StartDate.Day == employmentDate.Day)
                    {
                        var dailyWage = basicSalary/PeriodObj.TotalWorkingDays;
                        double? absenceDays = 0;
                        LateReportToDutyDeduction = Convert.ToDecimal(dailyWage*Convert.ToDecimal(absenceDays));

                        // TotalDeductions = TotalDeductions + LateReportToDutyDeduction;
                        basicSalary = basicSalary - LateReportToDutyDeduction;
                    }

                }

                #endregion

                #region Deduction due to Attendance
                
                var filtAttendanceDetail = _AttendanceDetail.GetByEmployee(currentEmpObject.Id, PeriodObj.Id);

                var attendanceDetails = filtAttendanceDetail as PrlAttendanceDetail[] ?? filtAttendanceDetail.ToArray();
                int counter = attendanceDetails.Count();

                _TOTAL_DAYS = attendanceDetails.Any() ? Convert.ToInt16(_TOTAL_DAYS) - counter : Convert.ToInt16(_TOTAL_DAYS);
                
                if (attendanceDetails.Any())
                {
                    var firstOrDefault = attendanceDetails.FirstOrDefault();
                    if (firstOrDefault != null)
                    {
                        var ded = firstOrDefault.DeductableAmount * counter;
                        
                        basicSalary = basicSalary - (ded);
                        BasicSalaryGBP = basicSalary/ExchangeRate;
                    }

                   // _listChangesMade.Add(changesMade);

                }

                #endregion

                #region Deduction due to termination


                if (currentEmpObject.IsTerminated == true)
                {
                    var terminationDate =
                        Convert.ToDateTime(_employeeTermination.GetByEmpId(currentEmpObject.Id).TerminationDate);

                    if (PeriodObj.StartDate < terminationDate && terminationDate < PeriodObj.EndDate)
                    {
                        var daysWorked = GetNumberOfWorkingDays(Period.StartDate, terminationDate);
                        var previousSalaryExists = _PayrollTransactions.GetByPeriodAndEmp(PeriodObj.Id - 1, currentEmpObject.Id);
                        decimal previousSalary = 0;
                        if (previousSalaryExists != null)
                            previousSalary = previousSalaryExists.BasicPay;

                        var dailyWage = basicSalary/PeriodObj.TotalWorkingDays;
                        double? absenceDays = PeriodObj.TotalWorkingDays - daysWorked;
                        LateReportToDutyDeduction = Convert.ToDecimal(dailyWage*Convert.ToDecimal(absenceDays));
                        basicSalary = basicSalary - LateReportToDutyDeduction;
                        //NoOfDaysWorked = daysWorked;

                        _TOTAL_DAYS = (int) (_TOTAL_DAYS - absenceDays);

                    }
                }

                #endregion

            }
            else //If there is a salary change
            {
                
                #region Deduction due to Employment Date

                //Check Employement Date 
                var mTotalDaysWorked = 0;
                var employmentDate = currentEmpObject.EmploymentDate;
                var periodMonthAndYear = PeriodObj.StartDate.Month + PeriodObj.StartDate.Year.ToString();
                var employmentMonthYear = employmentDate.Month + employmentDate.Year.ToString();

                if (employmentMonthYear == periodMonthAndYear)
                {
                    
                    if (PeriodObj.StartDate.Day <= employmentDate.Day)
                    {

                        var counter = 0;
                        decimal _SALARY = 0;

                        var prevSalaryChangeInstance = new PrlPositionChange();
                        foreach (var sc in periodSalaryChange)
                        {
                            var daysWorked = 0;

                            var indx = 0;

                            var dtSartDate = counter == 0 ? employmentDate : prevSalaryChangeInstance.EffectiveDate;

                            for (var i = dtSartDate.Day; i < sc.EffectiveDate.Day; i++)
                            {
                                var currentDate = new DateTime(dtSartDate.Year, dtSartDate.Month, dtSartDate.Day + indx);

                                if (currentDate.DayOfWeek != DayOfWeek.Saturday && currentDate.DayOfWeek != DayOfWeek.Sunday)
                                {
                                    daysWorked++;
                                }
                                indx++;
                            }

                            _TOTAL_DAYS = _TOTAL_DAYS + daysWorked;

                            var dailyWage = sc.PreviousSalaryETB/PeriodObj.TotalWorkingDays;

                            _SALARY = (decimal) (_SALARY + (dailyWage*daysWorked));

                            prevSalaryChangeInstance = sc;
                            counter ++;

                        }

                        //The Last salary change instance of the periodSalaryChange wont be accessed via the foreach loop above 
                        // Therefore manually track down the changes after the last Salary Change 

                        var _lastOrDefualt = periodSalaryChange.LastOrDefault();

                        var daysWorked2 = 0;
                        var indx2 = 0;
                        for (var j = _lastOrDefualt.EffectiveDate.Day; j <= PeriodObj.EndDate.Day; j++)
                        {
                            var currentDate = new DateTime(_lastOrDefualt.EffectiveDate.Year, _lastOrDefualt.EffectiveDate.Month,
                                _lastOrDefualt.EffectiveDate.Day + indx2);

                            if (currentDate.DayOfWeek != DayOfWeek.Saturday &&
                                currentDate.DayOfWeek != DayOfWeek.Sunday)
                            {
                                daysWorked2++;
                            }
                            indx2++;
                        }

                        _TOTAL_DAYS = _TOTAL_DAYS + daysWorked2;

                        var dailyWage2 = _lastOrDefualt.NewSalaryETB / PeriodObj.TotalWorkingDays;

                        _SALARY = (decimal)(_SALARY + (dailyWage2 * daysWorked2));

                        basicSalary = _SALARY;


                    }
                }

                #endregion

                #region Check Attendance

                var filtAttendance = _payrollAttendance.Get(EmployeeId, PeriodObj.Id);
                var attendanceDetail = _AttendanceDetail.GetByEmployee(currentEmpObject.Id, PeriodObj.Id);


                var details = attendanceDetail as PrlAttendanceDetail[] ?? attendanceDetail.ToArray();

                decimal _DAILY_WAGE_DEDUCTABLE_SUM = 0;
                EmployeeAttendanceDetail = details.ToList();// empAttendanceList.Where(m => m.EmpId == _employeeId);
                if (details.Any())
                {
                    foreach (var detail in details)
                    {
                        if (detail.AbsenceDate < currentEmpObject.EmploymentDate)
                            continue;
                        if (detail.AbsenceDate.DayOfWeek == DayOfWeek.Saturday || detail.AbsenceDate.DayOfWeek == DayOfWeek.Sunday)
                            continue;

                        _TOTAL_DAYS = _TOTAL_DAYS - 1;
                        var attnDtl = detail;
                        //Check if there is a salary change before this attendance 
                            
                        var salaryChangeBeforeAttendance = periodSalaryChange.Where(e => e.EffectiveDate <= attnDtl.AbsenceDate).OrderBy(e=> e.EffectiveDate);

                        //Check if there is a salary change before this attendance

                        var salaryChangeAfterAttendance = periodSalaryChange.Where(e => e.EffectiveDate >= attnDtl.AbsenceDate).OrderBy(e=> e.EffectiveDate);

                        //If salaryChangeBeforeAttendance == null
                        decimal tempSalary;
                        if (!salaryChangeBeforeAttendance.Any())
                        {
                            // If there is no salary change before the absence day, 
                            //take the PrevSalaryETB value from the next salary change instance from the given month
                            if (salaryChangeAfterAttendance.Any())
                            {
                                tempSalary =
                                    (decimal) salaryChangeAfterAttendance.FirstOrDefault().PreviousSalaryETB;
                                var dailyWage = (decimal) (tempSalary/PeriodObj.TotalWorkingDays);

                                basicSalary = basicSalary - dailyWage;

                                _DAILY_WAGE_DEDUCTABLE_SUM = _DAILY_WAGE_DEDUCTABLE_SUM + dailyWage;
                            }

                            else
                            {
                                //If there is no salary change after the current absence day, 
                                // That in other words, means, there hasnt been any salary change before and after the current absence day,
                                // therefore take the currentEmpObjects.SalaryETB value as a salary.

                                var dailyWage = (decimal) (currentEmpObject.SalaryETB/PeriodObj.TotalWorkingDays);

                                basicSalary =  (basicSalary - dailyWage);

                                _DAILY_WAGE_DEDUCTABLE_SUM = _DAILY_WAGE_DEDUCTABLE_SUM + dailyWage;
                            }
                        }
                        else
                        {
                            tempSalary = (decimal) salaryChangeBeforeAttendance.LastOrDefault().NewSalaryETB;

                            var dailyWage = (decimal)(tempSalary / PeriodObj.TotalWorkingDays);

                            basicSalary = basicSalary - dailyWage;

                            _DAILY_WAGE_DEDUCTABLE_SUM = _DAILY_WAGE_DEDUCTABLE_SUM + dailyWage;

                        }
                    }
                }

                #region  Save the employee Absenteesm Deduction details to the chages made table
                
                #endregion

               

                #endregion

                #region Check to skip employee due to termination

                if (currentEmpObject.IsTerminated == true)
                {
                    var terminationDate =
                        Convert.ToDateTime(_employeeTermination.GetByEmpId(currentEmpObject.Id).TerminationDate);

                    if (PeriodObj.StartDate < terminationDate && terminationDate < PeriodObj.EndDate)
                    {
                        var deductableDays = GetNumberOfDeductionDays(Period.EndDate, terminationDate);

                        var dailyWage = currentEmpObject.SalaryETB / PeriodObj.TotalWorkingDays;

                        //var absenceDays = (decimal) (PeriodObj.TotalWorkingDays - deductableDays);

                        var deductableAmount = (decimal)(dailyWage * deductableDays);

                        //LateReportToDutyDeduction = Convert.ToDecimal(dailyWage * Convert.ToDecimal(deductableDays));

                        basicSalary = basicSalary - deductableAmount;

                        #region  Save the employee termination details to the reconciliation table

                        //var previousSalary =
                        //     _PayrollTransactions.GetByPeriodAndEmp(PeriodObj.Id - 1, currentEmpObject.Id).BasicPay;

                        //changesMade = new PrlChangesMade
                        //{
                        //    PItemId = basicSalaryPItemId,
                        //    EmpId = EmployeeId,
                        //    PreviousAmount = previousSalary,
                        //    ChangedAmount = basicSalary,
                        //    Difference = Math.Abs(previousSalary - basicSalary),
                        //    DateChanged = DateTime.Now,
                        //    ReasonForChange = Constants.ReasonEmployeeTerminated,
                        //    IsDetectedOnPGeneration = true,
                        //    ChangePeriodId = Period.Id
                        //};

                        //_listChangesMade.Add(changesMade);

                        #endregion

                        _TOTAL_DAYS = _TOTAL_DAYS - deductableDays;
                    }

                }

                #endregion


                #region If there is simply a salary change without the aforementioned reasons 

                //Check Employement Date 
               // var mTotalDaysWorked = 0;
                //var employmentDate = currentEmpObject.EmploymentDate;
                ///var periodMonthAndYear = PeriodObj.StartDate.Month + PeriodObj.StartDate.Year.ToString();
                //var employmentMonthYear = employmentDate.Month + employmentDate.Year.ToString();

                
                    if (PeriodObj.StartDate > employmentDate)
                    {

                        var counter = 0;
                        decimal _SALARY = 0;

                        int CHANGE_COUNTER = 1;//   iF THERE ARE 2 INSTANCES OF SALARY CHANGE, IGNORE THE SECOND ONE AS IT WILL BE TREATED IN THE NEXT FOREACH LOOP RIGHT AFTER THIS ONE 
                        foreach (var sc in periodSalaryChange)
                        {
                            var daysWorked = 0;

                            var indx = 0;

                            var dtSartDate = PeriodObj.StartDate;

                            if (CHANGE_COUNTER > 1)
                                continue;

                            for (var i = dtSartDate.Day; i < sc.EffectiveDate.Day; i++)
                            {
                                var currentDate = new DateTime(dtSartDate.Year, dtSartDate.Month, dtSartDate.Day + indx);

                                if (currentDate.DayOfWeek != DayOfWeek.Saturday && currentDate.DayOfWeek != DayOfWeek.Sunday)
                                {
                                    daysWorked++;
                                }
                                indx++;

                                
                            }

                            _TOTAL_DAYS = _TOTAL_DAYS + daysWorked;

                            decimal? dailyWage;
                            if (sc.EmpId == 257)
                            {
                                dailyWage = sc.NewSalaryETB / PeriodObj.TotalWorkingDays;
                            }
                            else
                            {
                                dailyWage = sc.PreviousSalaryETB / PeriodObj.TotalWorkingDays;
                            }

                            

                            _SALARY = (decimal)(_SALARY + (dailyWage * daysWorked));

                            counter++;

                            CHANGE_COUNTER++;

                        }

                        //The Last salary change instance of the periodSalaryChange wont be accessed via the foreach loop above 
                        // Therefore manually track down the changes after the last Salary Change 

                        var _lastOrDefualt = periodSalaryChange.LastOrDefault();

                        var daysWorked2 = 0;
                        var indx2 = 0;
                        for (var j = _lastOrDefualt.EffectiveDate.Day; j <= PeriodObj.EndDate.Day; j++)
                        {
                            var currentDate = new DateTime(_lastOrDefualt.EffectiveDate.Year, _lastOrDefualt.EffectiveDate.Month,
                                _lastOrDefualt.EffectiveDate.Day + indx2);

                            if (currentDate.DayOfWeek != DayOfWeek.Saturday &&
                                currentDate.DayOfWeek != DayOfWeek.Sunday)
                            {
                                daysWorked2++;
                            }
                            indx2++;
                        }

                        _TOTAL_DAYS = _TOTAL_DAYS + daysWorked2;

                        var dailyWage2 = _lastOrDefualt.NewSalaryETB / PeriodObj.TotalWorkingDays;

                        _SALARY = (decimal)(_SALARY + (dailyWage2 * daysWorked2));

                        basicSalary = _SALARY;


                    }
                

                #endregion

            }

            NoOfDaysWorked = _TOTAL_DAYS;
            return basicSalary;

        }

        public DataTable ViewTransactions(int m_period)
        {
            var dt_Transaction = new DataTable();
            using (var erpEntities = new ENTRO_MISEntities())
            {

                var m_payTrans = erpEntities.vwPrlTransactionDetails;
                var m_payrollTransactions = erpEntities.vwPrlTransactionDetails.ToList();

                dt_Transaction = CreateGridColumns(m_payTrans);

                
                var all_apyrollTransactions = _PayrollTransactions.GetAll().Where(p => p.PeriodId == m_period && p.IsDeleted == false);
               


                var l_row = 0;
                foreach (var m_Trans in all_apyrollTransactions)
                {
                    dt_Transaction.Rows.Add();
                    var colCount = dt_Transaction.Columns.Count;

                    for (var i = 0; i < colCount; i++)
                    {
                        dt_Transaction.Rows[l_row][i] = 0;
                    }

                    var first_row = true;
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

            var dataTable = new DataTable(typeof(T).Name);

            //Get all the properties

            var Props = typeof(T).GetProperties(BindingFlags.Public | BindingFlags.Instance);

            foreach (var prop in Props)
            {

                //Setting column names as Property names

                dataTable.Columns.Add(prop.Name);

            }

            foreach (var item in items)
            {

                var values = new object[Props.Length];

                for (var i = 0; i < Props.Length; i++)
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
            var al = new ArrayList(new string[] { 
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

                foreach (var l_add in l_additions)
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

                foreach (var l_ded in l_deductions)
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
            var count = m_Additions.Count();
            var m_adds = new string[count];
            var i = 0;
            foreach (var m_ad in m_Additions)
            {
                if (!m_adds.Contains(m_ad.PItemName))
                    m_adds[i] = m_ad.PItemName;
                i++;
            }
            additions = m_adds;


            var m_deductions = m_payTrans.Where(p => p.PItemIsAddition == false);
            count = m_deductions.Count();
            var m_deds = new string[count];
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
            var dt_Transaction = new DataTable();
            using (var erpEntities = new ENTRO_MISEntities())
            {

                var m_payTrans = erpEntities.vwPrlTransactionDetails;
                var m_payrollTransactions = erpEntities.vwPrlTransactionDetails.ToList();


                //DataTable dt = ToDataTable(m_payrollTransactions);

                dt_Transaction = CreateGridColumns(m_payTrans);

                var i = 0;
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
            var daysWorked = 0;

            var indx = 0;
            //for loop to get the number of working days between two given dates 
            for (var j = dateOne.Day; j < dateTwo.Day; j++)
            {
                var currentDate = new DateTime(dateOne.Year, dateOne.Month,
                    dateOne.Day + indx);
                if (currentDate.DayOfWeek != DayOfWeek.Saturday && currentDate.DayOfWeek != DayOfWeek.Sunday)
                {
                    daysWorked++;
                }
                indx++;
            }

            return daysWorked;
        }
        public int GetNumberOfDeductionDays(DateTime dateOne, DateTime dateTwo)
        {
            var deductableDays = 0;

            var indx = 0;
            //for loop to get the number of working days between two given dates 
            for (var j = dateOne.Day; j >= dateTwo.Day; j--)
            {
                var currentDate = new DateTime(dateOne.Year, dateOne.Month,
                    dateOne.Day - indx);
                if (currentDate.DayOfWeek != DayOfWeek.Saturday && currentDate.DayOfWeek != DayOfWeek.Sunday)
                {
                    deductableDays++;
                }
                indx++;
            }

            return deductableDays;
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

            var MonthName = DateTime.Now.ToString("MMMM", CultureInfo.InvariantCulture);
            var periodObject = _periods.GetFromFiscalYearAndMonth(DateTime.Now.Year, MonthName);
            changesMade.ChangePeriodId = periodObject.Id;

            _changesMade.AddNew(changesMade);

        }
        #endregion

    }

    #region PayGenEmployees
    /// <summary>
    /// This is used during Payroll 
    /// Generation, to hold PayrollEmployees Overtime Hours Data for a Pay Period. 
    /// </summary>
    public class PayGenEmployees
    {
        #region members
        //private EmployeeOvertimeHourCollection m_overtimeHours;
        private DataRow[] m_overtimeData;	// contains employee overtime worked hours information
        private DataRow[] m_loanData;
        private DataRow[] m_advanceData;
        private DataRow[] m_creditPaymentData;
        #endregion

        #region constructor
        /// <summary>
        /// Creates and initializes a new instance of PayGenEmployees class.
        /// </summary>
        public PayGenEmployees()
            : base()
        {

        }

        ~PayGenEmployees()
        {
            m_overtimeData = null;
            m_loanData = null;
            m_advanceData = null;
            m_creditPaymentData = null;
        }
        #endregion

        #region properties

        /// <summary>
        /// Gets or sets an array of data-row objects containing employee overtime worked data 
        /// during a specified period.
        /// </summary>
        public DataRow[] OvertimeData
        {
            get { return m_overtimeData; }
            set { m_overtimeData = value; }
        }
        /// <summary>
        /// Identifies whether an employee has worked Overtime.
        /// </summary>
        /// <returns></returns>
        public bool HasOvertimeData()
        {
            return (m_overtimeData != null) && (m_overtimeData.Length > 0);
        }
        /// <summary>
        /// Gets or sets an array of data-row objects containing employee loan(s) data 
        /// during a specified period.
        /// </summary>
        public DataRow[] LoanData
        {
            get { return m_loanData; }
            set { m_loanData = value; }
        }
        /// <summary>
        /// Identifies whether an employee has taken loan.
        /// </summary>
        /// <returns></returns>
        public bool HasLoanData()
        {
            return (m_loanData != null) && (m_loanData.Length > 0);
        }

        /// <summary>
        /// Gets or sets an array of data-row objects containing employee Advance(s) data 
        /// during a specified period.
        /// </summary>
        public DataRow[] AdvanceData
        {
            get { return m_advanceData; }
            set { m_advanceData = value; }
        }
        /// <summary>
        /// Identifies whether an employee has taken an Advance.
        /// </summary>
        /// <returns></returns>
        public bool HasAdvanceData()
        {
            return (m_advanceData != null) && (m_advanceData.Length > 0);
        }

        /// <summary>
        /// Gets or sets an array of data-row objects containing employee Credit Payments(s) data 
        /// during a specified period.
        /// </summary>
        public DataRow[] CreditPaymentData
        {
            get { return m_creditPaymentData; }
            set { m_creditPaymentData = value; }
        }
        /// <summary>
        /// Identifies whether an employee has taken a Credit Payment.
        /// </summary>
        /// <returns></returns>
        public bool HasCreditPaymentData()
        {
            return (m_creditPaymentData != null) && (m_creditPaymentData.Length > 0);
        }
        #endregion
    }
    #endregion

    #region TEmployeeGroup

    /// <summary>
    /// A structure which contains a group of employees selected 
    /// for a specified operation, such as Payroll Generation.
    /// </summary>
    public struct TEmployeeGroup
    {
        #region members
        private object[] m_selectedEmployees;	// IDs of selected employees.
        private object[] m_unSelectedEmployees;	// IDs of un-selected employees.
        private string m_baseCriteria;		// base criteria string which loaded employees for selection

        private string m_criteria;		// criteria string generated from the current info.
        private string[] m_employeeNames;
        private bool m_isDirty;
        private DataTable m_dtData;		// payroll generation inputs, such as Days/Hours Worked
        #endregion

        #region constants

        /// <summary>
        /// DaysOrHoursWorked
        /// </summary>
        public const string COL_DAYS_OR_HOURS_WORKED = "DaysWorked";
        #endregion

        #region constructor

        public TEmployeeGroup(object[] selectedEmployeeIds)
        {
            m_selectedEmployees = selectedEmployeeIds;
            m_employeeNames = null;
            m_unSelectedEmployees = null;
            m_baseCriteria = "";
            m_criteria = "";
            m_dtData = null;
            m_isDirty = false;
            //InitDataTable();
        }

        #endregion

        #region Dispose

        #endregion

        #region properties

        /// <summary>
        /// Creates and returns an Empty TEmployeeGroup instance, which can load all employees.
        /// </summary>
        public static TEmployeeGroup Empty
        {
            get { return new TEmployeeGroup(null); }
        }

        /// <summary>
        /// Determines whether the members of the current instance are empty.
        /// </summary>
        public bool IsEmpty
        {
            get
            {
                return ((m_selectedEmployees == null) && (m_unSelectedEmployees == null) &&
                        (m_baseCriteria == null) && (m_baseCriteria == ""));
            }
        }

        /// <summary>
        /// Gets or sets an array containing the names of employees selected.
        /// </summary>
        public string[] EmployeeNames
        {
            get { return m_employeeNames; }
            set { m_employeeNames = value; }
        }

        /// <summary>
        /// Gets or sets comma delimited list/string containing the IDs of employees selected.
        /// </summary>
        public object[] SelectedEmployees
        {
            get { return m_selectedEmployees; }
            set { m_selectedEmployees = value; m_isDirty = true; }
        }

        /// <summary>
        /// Gets or sets comma delimited list/string containing the IDs of un-selected employees.
        /// </summary>
        public object[] UnSelectedEmployees
        {
            get { return m_unSelectedEmployees; }
            set { m_unSelectedEmployees = value; m_isDirty = true; }
        }

        /// <summary>
        /// Gets or sets a DataTable containing Payroll Generation inputs. 
        /// Days/Hours worked for some employees
        /// </summary>
        public DataTable Data
        {
            get { return m_dtData; }
            set { m_dtData = value; }
        }

        /// <summary>
        /// Gets or sets a base criteria string which loaded employees for selection
        /// </summary>
        public string BaseCriteria
        {
            get { return m_baseCriteria; }
            set { m_baseCriteria = value; }
        }
        #endregion

        #region GetDaysOrHoursWorked

        /// <summary>
        /// Returns the DaysOrHoursWorked value for a specific PA_Employee.
        /// </summary>
        /// <param name="empId"></param>
        /// <returns></returns>
        //public decimal GetDaysOrHoursWorked(int empId)
        //{
        ////    string criteria = PayrollGenerator.FIELD_EMP_ID + " = '" + empId + "'";
        ////    DataRow[] l_rows = m_dtData.Select(criteria);
        ////    if (l_rows == null || l_rows.Length == 0)
        ////        return 0;
        ////    return Convert.ToDecimal(l_rows[0][COL_DAYS_OR_HOURS_WORKED]);
        //}
        #endregion

        #region InitDataTable

        /// <summary>
        /// Initializes the DataTable, which contains inputs for each PA_Employee
        /// </summary>
        //public void InitDataTable()
        //{
        //    m_dtData = new DataTable();
        //    m_dtData.Columns.Add(PayrollGenerator.FIELD_EMP_ID, typeof(int));
        //    m_dtData.Columns.Add(COL_DAYS_OR_HOURS_WORKED, typeof(decimal));
        //}

        /// <summary>
        /// Adds a new DataRow containing EmployeeId and HoursOrDaysWorked of the employee to 
        /// the DataTable that contains such information.
        /// </summary>
        /// <param name="employeeID"></param>
        /// <param name="hoursOrDaysWorked"></param>
        public void AddData(int empId, object hoursOrDaysWorked)
        {
            m_dtData.Rows.Add(new object[] { empId, hoursOrDaysWorked });
        }
        #endregion

        #region GetCriteria
        /// <summary>
        /// Creates and returns a SQL data retrieval criteria for loading employees
        /// based on the options specified in the object.
        /// </summary>
        /// <returns></returns>
        public string GetCriteria()
        {
            if (!m_isDirty)
                return m_criteria;

            m_criteria = "";

            #region create criteria string using PayrollEmployees Id

            if ((m_selectedEmployees != null) || (m_unSelectedEmployees != null))
            {
                var l_idCriteria = "";

                for (var i = 1; i <= m_selectedEmployees.Length; i++)
                {
                    if (i < m_selectedEmployees.Length)
                        l_idCriteria = l_idCriteria + m_selectedEmployees[i] + ",";
                    else
                        l_idCriteria = l_idCriteria + m_selectedEmployees[i];
                }

                m_criteria = l_idCriteria;

            }

            #endregion

            return m_criteria;
        }
        #endregion

        #region GetEmployees

        /// <summary>
        /// Returns a System.Data.DataTable containing the list of employee records 
        /// that satisfy critreia specified in the current instance.
        /// </summary>
        /// <param name="effectiveFrom">effective date of the employee changing data part</param>
        /// <param name="effectiveTo">effective date of the employee changing data part</param>
        /// <returns></returns>
        //public System.Data.DataTable GetEmployees()
        //{
        //    string l_criteria = this.GetCriteria();
        //    PayrollGenerator pGen = new PayrollGenerator();
        //    DataTable l_dt = pGen._employee.GetAll();
        //   // return FINApp.DBManager.Select(PA_Employee.ViewName, null, l_criteria);
        //}
        #endregion
    }
    #endregion

    public class Generator
    {

    }
}
