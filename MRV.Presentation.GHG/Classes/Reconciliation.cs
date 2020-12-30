using System;
using System.Collections.Generic;
using System.Linq;
using System.Data;
using NBI.Data.Model;
using NBI.Business.Tsa;
using System.Data.Objects;
using System.Transactions;
using System.Reflection;
using NBI.Presentation.Tsa.Controllers;


namespace NBI.Presentation.Tsa.Classes
{
    public class Reconciliation
    {
        #region Members

        private readonly ObjectContext _context;
        public readonly PayrollTransactions _PayrollTransactions;
        public PrlPeriod _period;
        private readonly PayrollEmployeePayrollItems _empPItems;
        public readonly PayrollEmployees _employee;
        private readonly PayrollItems _payrollItems;
        private readonly PayrollSettings _payrollSettings;
        private readonly PayrollReconciliation _payrollReconciliation;
        private readonly PayrollAttendance _payrollAttendance;
        private readonly PayrollPeriods _payrollPeriods;
        private readonly PayrollTransactionPItems _payrollTransactionPItems;
        private readonly PayrollChangesMade _changesMade;

        private readonly PayrollDifferences _transDifferences;
        private readonly PayrollAttendanceDetail _attendanceDetail;
        private readonly PayrollEmployeeTermination _empTermination;
        private readonly PayrollDifferencesPItems _transDifferencesPItems;

        private readonly PayrollSalaryPositionChange _SalaryPositionChange;

        private decimal  _TOT_P_ITEM_PERIOD_ONE = 0;
        private decimal  _TOT_P_ITEM_PERIOD_TWO = 0;
        #endregion

        #region Constructor
        public Reconciliation()
        {
            _context = new ENTRO_MISEntities(Constants.ConnectionString);
            _PayrollTransactions = new PayrollTransactions(_context);
            _empPItems = new PayrollEmployeePayrollItems(_context);
            _payrollPeriods = new PayrollPeriods(_context);
            _employee = new PayrollEmployees(_context);
            _payrollAttendance = new PayrollAttendance(_context);
            _payrollItems = new PayrollItems(_context);
            _payrollSettings = new PayrollSettings(_context);
            _payrollReconciliation = new PayrollReconciliation(_context);
            _payrollTransactionPItems = new PayrollTransactionPItems(_context);
            _changesMade = new PayrollChangesMade(_context);
            _transDifferences = new PayrollDifferences(_context);
            _attendanceDetail = new PayrollAttendanceDetail(_context);
            _empTermination = new PayrollEmployeeTermination(_context);
            _transDifferencesPItems = new PayrollDifferencesPItems(_context);
            _SalaryPositionChange = new PayrollSalaryPositionChange(_context);
        }
        #endregion

        #region Methods

        public bool DoReconciliation(int periodOne, int periodTwo)
        {
            #region Declarations

            bool isExchangeRateChanged = false;
            var AdditionPItemIdsList = new List<string>();
            var AdditionIDListOfNewEmployees = new List<string>();

            var DeductionPItemIdsList = new List<string>();
            var DeductionIDListOfNewEmployees = new List<string>();

            clsReconcile recln;
            clsReconcile tempReclnObj;
            clsReconcile tempAdditionReclnObj;
            clsReconcile tempDeductionReclnObj;
            var reclnList = new List<clsReconcile>();
            var tempReclnList = new List<clsReconcile>();
            var tempAdditionReclnList = new List<clsReconcile>();
            var tempDeductionReclnList = new List<clsReconcile>();

            var severancePayId = int.Parse(_payrollSettings.Get(Constants.SeverancePayPItemId).SettingValue);
            int pensionEmployerPItemId = int.Parse(_payrollSettings.Get(Constants.PensionEmployerContId).SettingValue);
            int pensionEmployeePItemId = int.Parse(_payrollSettings.Get(Constants.PensionEmployeeContId).SettingValue);
            int incomeTaxPItemId = int.Parse(_payrollSettings.Get(Constants.IncomeTaxId).SettingValue);
            List<vwPrlTransactionDetails> additionTransDetailsForPeriodOne;
            List<vwPrlTransactionDetails> additionTransDetailsForPeriodTwo;
            List<vwPrlTransactionDetails> deductionTransDetailsForPeriodOne;
            List<vwPrlTransactionDetails> deductionTransDetailsForPeriodTwo;

            //Variable to track and sum up all basic salary chanages regardless of their cause/reason 
            decimal mSumUpAllBasicSalaryChanges = 0;
            decimal mSumUpAllIncomeTaxChanges = 0;
            decimal mSumUpAllEmployerChanges = 0;
            decimal mSumUpAllEmployeeChanges = 0;
            using (var erpEntities = new ENTRO_MISEntities())
            {

                additionTransDetailsForPeriodOne = erpEntities.vwPrlTransactionDetails.Where(p => p.PeriodId == periodOne && p.IsDeleted == false
                    && p.PItemId != severancePayId && p.PItemId != pensionEmployerPItemId && p.PItemIsAddition == true).ToList();

                additionTransDetailsForPeriodTwo = erpEntities.vwPrlTransactionDetails.Where(p => p.PeriodId == periodTwo && p.IsDeleted == false
                   && p.PItemId != severancePayId && p.PItemId != pensionEmployerPItemId && p.PItemIsAddition == true).ToList();

                deductionTransDetailsForPeriodOne = erpEntities.vwPrlTransactionDetails.Where(p => p.PeriodId == periodOne && p.IsDeleted == false
                   && p.PItemIsAddition == false && p.PItemId != incomeTaxPItemId).ToList();

                deductionTransDetailsForPeriodTwo = erpEntities.vwPrlTransactionDetails.Where(p => p.PeriodId == periodTwo && p.IsDeleted == false
                   && p.PItemIsAddition == false && p.PItemId != incomeTaxPItemId).ToList();
            }

            var _PeriodOnePayTrans = _PayrollTransactions.GetAll().Where(p => p.PeriodId == periodOne);
            var _PeriodTwoPayTrans = _PayrollTransactions.GetAll().Where(p => p.PeriodId == periodTwo);

            var periodOneBasicPayTotalGBP = Convert.ToDecimal(_PayrollTransactions.GetAll().Where(p => p.PeriodId == periodOne).Sum(p => p.BasicSalaryGBP));
            var periodTwoBasicPayTotalGBP = Convert.ToDecimal(_PayrollTransactions.GetAll().Where(p => p.PeriodId == periodTwo).Sum(p => p.BasicSalaryGBP));



            var periodOneNetPayTotalGBP = Convert.ToDecimal(_PayrollTransactions.GetAll().Where(p => p.PeriodId == periodOne).Sum(p => p.NetPaymentGBP));
            var periodTwoNetPayTotalGBP = Convert.ToDecimal(_PayrollTransactions.GetAll().Where(p => p.PeriodId == periodTwo).Sum(p => p.NetPaymentGBP));

            var periodOneIncomeTaxTotal = _PayrollTransactions.GetAll().Where(p => p.PeriodId == periodOne).Sum(p => p.Tax);
            var periodTwoIncomeTaxTotal = _PayrollTransactions.GetAll().Where(p => p.PeriodId == periodTwo).Sum(p => p.Tax);


            var periodOneBasicPayTotal = _PayrollTransactions.GetAll().Where(p => p.PeriodId == periodOne).Sum(p => p.BasicPay);
            var periodTwoBasicPayTotal = _PayrollTransactions.GetAll().Where(p => p.PeriodId == periodTwo).Sum(p => p.BasicPay);

            var periodOneTotalAdditions = _PayrollTransactions.GetAll().Where(p => p.PeriodId == periodOne).Sum(p => p.TotalAdditions);
            var periodTwoTotalAdditions = _PayrollTransactions.GetAll().Where(p => p.PeriodId == periodTwo).Sum(p => p.TotalAdditions);

            var periodOneTotalDeductions = _PayrollTransactions.GetAll().Where(p => p.PeriodId == periodOne).Sum(p => p.TotalDeductions);
            var periodTwoTotalDeductions = _PayrollTransactions.GetAll().Where(p => p.PeriodId == periodTwo).Sum(p => p.TotalDeductions);

            var periodOneNetPayTotal = Convert.ToDecimal(_PayrollTransactions.GetAll().Where(p => p.PeriodId == periodOne).Sum(p => p.NetPayment));
            var periodTwoNetPayTotal = Convert.ToDecimal(_PayrollTransactions.GetAll().Where(p => p.PeriodId == periodTwo).Sum(p => p.NetPayment));

            var periodOnePensionEmployerTotal = Convert.ToDecimal(_PayrollTransactions.GetAll().Where(p => p.PeriodId == periodOne).Sum(p => p.PensionEmployer));
            var periodTwoPensionEmployerTotal = Convert.ToDecimal(_PayrollTransactions.GetAll().Where(p => p.PeriodId == periodTwo).Sum(p => p.PensionEmployer));

            var periodOnePensionEmployeeTotal = Convert.ToDecimal(_PayrollTransactions.GetAll().Where(p => p.PeriodId == periodOne).Sum(p => p.PensionEmployee));
            var periodTwoPensionEmployeeTotal = Convert.ToDecimal(_PayrollTransactions.GetAll().Where(p => p.PeriodId == periodTwo).Sum(p => p.PensionEmployee));

            // ReSharper disable once PossibleNullReferenceException
            var periodOneExchangeRate = Convert.ToDecimal(_PayrollTransactions.GetAll().FirstOrDefault(p => p.PeriodId == periodOne).ExchangeRate);
            // ReSharper disable once PossibleNullReferenceException
            var periodTwoExchangeRate = Convert.ToDecimal(_PayrollTransactions.GetAll().FirstOrDefault(p => p.PeriodId == periodTwo).ExchangeRate);

            if (periodOneExchangeRate != periodTwoExchangeRate)
                isExchangeRateChanged = true;
            #endregion

            if (periodOneNetPayTotal == periodTwoNetPayTotal)
            {
                #region Net Pay Differences for the two periods
                recln = new clsReconcile
                {
                    PayrollItem = "Total Net Pay",
                    PeriodOneId = periodOne,
                    PeriodTwoId = periodTwo,
                    PeriodOnePItemAmount = periodOneNetPayTotal,
                    PeriodTwoPItemAmount = periodTwoNetPayTotal,
                    ReasonForDifference = "No Difference",
                    AmountDueToReason = 0.00M,
                    TotalDifference = 0.00M
                };

                reclnList.Add(recln);
                #endregion
            }
            else
            {

                #region Basic Salary Differences for the two periods

                #region Check if the Basic Salary Difference is caused by Exchange rate (This If clause will be executed only if there is the same list of employees
                if (periodOneBasicPayTotalGBP == periodTwoBasicPayTotalGBP && periodOneBasicPayTotal != periodTwoBasicPayTotal)
                {
                    //recln = new clsReconcile
                    //{
                    //    PayrollItem = "Basic Salary",
                    //    PeriodOneId = periodOne,
                    //    PeriodTwoId = periodTwo,
                    //    PeriodOnePItemAmount = periodOneBasicPayTotal,
                    //    PeriodTwoPItemAmount = periodTwoBasicPayTotal,
                    //    ReasonForDifference = "Difference caused by exchange rate.",
                    //    AmountDueToReason = Math.Abs(periodOneBasicPayTotal - periodTwoBasicPayTotal),
                    //    TotalDifference = 0.00M
                    //};

                    //reclnList.Add(recln);
                }
                #endregion

                #region Check If there was any Salary Change for every employee
                if (periodOneBasicPayTotalGBP != periodTwoBasicPayTotalGBP || periodOneBasicPayTotal != periodTwoBasicPayTotal)
                {
                    //Check every employee's salary in the second period 
                    foreach (var periodOneTrans in _PeriodOnePayTrans)
                    {

                        var currEmpTransForPeriodTwo = _PeriodTwoPayTrans.FirstOrDefault(p => p.EmpId == periodOneTrans.EmpId);
                        var currEmployee = _employee.Get(periodOneTrans.EmpId);
                        string employeeFullName = currEmployee.FirstName + " " + currEmployee.MiddleName + " " +
                                                  currEmployee.LastName;

                        //Check the Basic Salary in ETB for those who are paid in Birr
                        if (periodOneTrans.BasicSalaryGBP == 0)
                        {
                            //Check If the employee has Reported Lately in the first Period
                            if (currEmpTransForPeriodTwo != null && (periodOneTrans.NumberOfDaysWorked < periodOneTrans.TotalWorkingDays && currEmpTransForPeriodTwo.NumberOfDaysWorked == currEmpTransForPeriodTwo.TotalWorkingDays))
                            {
                                recln = new clsReconcile
                                {
                                    PayrollItem = "Basic Salary",
                                    PeriodOneId = periodOne,
                                    PeriodTwoId = periodTwo,
                                    PeriodOnePItemAmount = periodOneTrans.BasicPay,
                                    PeriodTwoPItemAmount = currEmpTransForPeriodTwo.BasicPay,
                                    ReasonForDifference =
                                        "The basic salary amount for " + employeeFullName + " was changed as a result of Late Report to Duty in the first period",
                                    AmountDueToReason = currEmpTransForPeriodTwo.BasicPay - periodOneTrans.BasicPay,
                                    TotalDifference = 0.00M
                                };

                                reclnList.Add(recln);

                                mSumUpAllBasicSalaryChanges = mSumUpAllBasicSalaryChanges + recln.AmountDueToReason;

                                #region If a change in the Basic Salary (ETB) is detected, Track down all payroll Items which depend on Percentage of Basic Salary

                                var PItemsOnPercentageOfSalary = _payrollItems.GetAll().Where(p => p.PItemApplicationType == Constants.PercentageApplicationType);

                                foreach (var perc in PItemsOnPercentageOfSalary)
                                {
                                    PrlItems prlItems = perc;
                                    var periodOneVAR = _payrollTransactionPItems.Find(p => p.PrlTransactions.EmpId == periodOneTrans.EmpId && p.PItemId == prlItems.Id && p.PrlTransactions.PeriodId == periodOne);
                                    var periodTwoVAR = _payrollTransactionPItems.Find(p => p.PrlTransactions.EmpId == periodOneTrans.EmpId && p.PItemId == prlItems.Id && p.PrlTransactions.PeriodId == periodTwo);

                                    if (periodOneVAR == null && periodTwoVAR == null)
                                        continue;
                                    else if (periodOneVAR == null)
                                        periodOneVAR.PItemAmount = 0;
                                    else if (periodTwoVAR == null)
                                        periodTwoVAR.PItemAmount = 0;

                                    decimal periodOnePItemAmount = periodOneVAR.PItemAmount;
                                    decimal periodTwoPItemAmount = periodTwoVAR.PItemAmount;
                                    //If the payroll item is an addition, append it to the Additions temp reconciliation list 
                                    if (perc.PItemIsAddition == true)
                                    {
                                        tempAdditionReclnObj = new clsReconcile
                                        {
                                            PayrollItem = "Total Additions",
                                            PeriodOneId = periodOne,
                                            PeriodTwoId = periodTwo,
                                            PeriodOnePItemAmount = periodOnePItemAmount,
                                            PeriodTwoPItemAmount = periodTwoPItemAmount,
                                            ReasonForDifference =
                                                "The " + perc.PItemName + " amount paid was less in the first period than in the second, due to Late Report to Duty for an employee named " +
                                                employeeFullName + ".",
                                            AmountDueToReason =
                                                Math.Abs(periodOnePItemAmount - periodTwoPItemAmount),
                                            TotalDifference = 0.00M
                                        };

                                        tempAdditionReclnList.Add(tempAdditionReclnObj);

                                        //Collect the sum of pension employer amount 
                                        if (perc.Id == pensionEmployerPItemId)
                                            mSumUpAllEmployerChanges = mSumUpAllEmployerChanges + tempAdditionReclnObj.AmountDueToReason;


                                    }
                                    //If the payroll item is a deduction, append it to the Deductions temp reconciliation list 
                                    else
                                    {
                                        tempDeductionReclnObj = new clsReconcile
                                        {
                                            PayrollItem = "Total Deductions",
                                            PeriodOneId = periodOne,
                                            PeriodTwoId = periodTwo,
                                            PeriodOnePItemAmount = periodOnePItemAmount,
                                            PeriodTwoPItemAmount = periodTwoPItemAmount,
                                            ReasonForDifference =
                                                "The " + perc.PItemName + " amount paid was less in the first period than in the second, due to Late Report to Duty for an employee named " +
                                                employeeFullName + ".",
                                            AmountDueToReason =
                                                Math.Abs(periodOnePItemAmount - periodTwoPItemAmount),
                                            TotalDifference = 0.00M
                                        };


                                        tempDeductionReclnList.Add(tempDeductionReclnObj);

                                        //Collect the sum of pension employee amount 
                                        if (perc.Id == pensionEmployeePItemId)
                                            mSumUpAllEmployeeChanges = mSumUpAllEmployeeChanges + tempDeductionReclnObj.AmountDueToReason;
                                    }
                                }
                                #endregion

                                tempReclnObj = new clsReconcile
                                {
                                    PayrollItem = "Total Deductions",
                                    PeriodOneId = periodOne,
                                    PeriodTwoId = periodTwo,
                                    PeriodOnePItemAmount = periodOneTrans.Tax,
                                    PeriodTwoPItemAmount = Convert.ToDecimal(currEmpTransForPeriodTwo.Tax),
                                    ReasonForDifference = "The Income Tax amount paid was less in the first period than in the second, due to Late Report to Duty for an employee named " + employeeFullName + ".",
                                    AmountDueToReason = Math.Abs(currEmpTransForPeriodTwo.Tax - periodOneTrans.Tax),
                                    TotalDifference = 0.00M
                                };

                                tempReclnList.Add(tempReclnObj);
                                mSumUpAllIncomeTaxChanges = mSumUpAllIncomeTaxChanges + tempReclnObj.AmountDueToReason;
                            }
                            ////////////////////////////// The Basic Pay Amount in ETB was directly changed in the employees management section /////////////////////////
                            else if (currEmpTransForPeriodTwo != null && periodOneTrans.BasicPay != currEmpTransForPeriodTwo.BasicPay)
                            {

                                recln = new clsReconcile
                                {
                                    PayrollItem = "Basic Salary",
                                    PeriodOneId = periodOne,
                                    PeriodTwoId = periodTwo,
                                    PeriodOnePItemAmount = periodOneTrans.BasicPay,
                                    PeriodTwoPItemAmount = currEmpTransForPeriodTwo.BasicPay,
                                    ReasonForDifference = "The ETB basic salary amount for " + employeeFullName + "was changed.",
                                    AmountDueToReason = Math.Abs(periodOneTrans.BasicPay - currEmpTransForPeriodTwo.BasicPay),
                                    TotalDifference = 0.00M
                                };

                                reclnList.Add(recln);
                                mSumUpAllBasicSalaryChanges = mSumUpAllBasicSalaryChanges + recln.AmountDueToReason;

                                #region If there is a direct ETB change, Manually Track down the change in 11% Percent employer contribution
                                tempAdditionReclnObj = new clsReconcile
                                {
                                    PayrollItem = "Total Additions",
                                    PeriodOneId = periodOne,
                                    PeriodTwoId = periodTwo,
                                    PeriodOnePItemAmount = periodOneTrans.PensionEmployer,
                                    PeriodTwoPItemAmount = currEmpTransForPeriodTwo.PensionEmployer,
                                    ReasonForDifference = "The Pension Employer Cont was different as a result of a change in the ETB (basic salary)" +
                                                          " for an employee named  " + employeeFullName + ".",
                                    AmountDueToReason = Math.Abs(periodOneTrans.PensionEmployer - currEmpTransForPeriodTwo.PensionEmployer),
                                    TotalDifference = 0.00M
                                };

                                tempAdditionReclnList.Add(tempAdditionReclnObj);

                                mSumUpAllEmployerChanges = mSumUpAllEmployerChanges + tempAdditionReclnObj.AmountDueToReason;
                                #endregion

                                #region If there is a direct ETB change, Manually Track down the change in 7% Percent employee contribution
                                tempDeductionReclnObj = new clsReconcile
                                {
                                    PayrollItem = "Total Deductions",
                                    PeriodOneId = periodOne,
                                    PeriodTwoId = periodTwo,
                                    PeriodOnePItemAmount = periodOneTrans.PensionEmployee,
                                    PeriodTwoPItemAmount = currEmpTransForPeriodTwo.PensionEmployee,
                                    ReasonForDifference = "The Pension Employee Cont was different as a result of a change in the ETB (basic salary)" +
                                                          " for an employee named  " + employeeFullName + ".",
                                    AmountDueToReason = Math.Abs(periodOneTrans.PensionEmployee - currEmpTransForPeriodTwo.PensionEmployee),
                                    TotalDifference = 0.00M
                                };

                                tempDeductionReclnList.Add(tempDeductionReclnObj);

                                mSumUpAllEmployeeChanges = mSumUpAllEmployeeChanges + tempDeductionReclnObj.AmountDueToReason;
                                #endregion

                                #region If there apears to be a direct change in ETB then, there definitely will be a change in income tax
                                string reasonForDiff = "";

                                //Check At which period is the income tax amount less
                                if (periodOneTrans.Tax < currEmpTransForPeriodTwo.Tax)
                                {
                                    reasonForDiff =
                                        "The Income Tax amount paid was less in the first period than in the second, due to Late Report to Duty for an employee named " +
                                        employeeFullName + ".";
                                }
                                else
                                {
                                    reasonForDiff =
                                        "The Income Tax amount paid was less in the second period than in the first, due to Late Report to Duty for an employee named " +
                                        employeeFullName + ".";
                                }
                                tempReclnObj = new clsReconcile
                                {
                                    PayrollItem = "Total Deductions",
                                    PeriodOneId = periodOne,
                                    PeriodTwoId = periodTwo,
                                    PeriodOnePItemAmount = periodOneTrans.Tax,
                                    PeriodTwoPItemAmount = Convert.ToDecimal(currEmpTransForPeriodTwo.Tax),
                                    ReasonForDifference = reasonForDiff,
                                    AmountDueToReason = Math.Abs(currEmpTransForPeriodTwo.Tax - periodOneTrans.Tax),
                                    TotalDifference = 0.00M
                                };

                                tempReclnList.Add(tempReclnObj);
                                mSumUpAllIncomeTaxChanges = mSumUpAllIncomeTaxChanges + tempReclnObj.AmountDueToReason;
                                #endregion
                            }
                        }
                        //Check the GBP amount
                        else
                        {
                            var attendanceListPeriodOne = _payrollAttendance.Get(currEmployee.Id, periodOne);
                            var attendanceListPeriodTwo = _payrollAttendance.Get(currEmployee.Id, periodTwo);
                            var periodOneObject = _payrollPeriods.Get(periodOne);
                            var periodTwoObject = _payrollPeriods.Get(periodTwo);
                            if (currEmpTransForPeriodTwo != null && (periodOneTrans.BasicSalaryGBP != currEmpTransForPeriodTwo.BasicSalaryGBP || periodOneTrans.BasicPay != currEmpTransForPeriodTwo.BasicPay))
                            {
                                if (attendanceListPeriodOne != null)
                                {
                                    recln = new clsReconcile
                                    {
                                        PayrollItem = "Basic Salary",
                                        PeriodOneId = periodOne,
                                        PeriodTwoId = periodTwo,
                                        PeriodOnePItemAmount = 0,
                                        PeriodTwoPItemAmount = attendanceListPeriodOne.DeductableAmount,
                                        ReasonForDifference =
                                            "The ETB basic salary amount for " + employeeFullName + " was changed as a result of Absenteesm Deduction in the first period",
                                        AmountDueToReason = attendanceListPeriodOne.DeductableAmount,
                                        TotalDifference = 0.00M
                                    };

                                    reclnList.Add(recln);
                                    mSumUpAllBasicSalaryChanges = mSumUpAllBasicSalaryChanges + recln.AmountDueToReason;
                                }
                                else if (periodOneTrans.NumberOfDaysWorked < periodOneTrans.TotalWorkingDays && currEmpTransForPeriodTwo.NumberOfDaysWorked == currEmpTransForPeriodTwo.TotalWorkingDays)
                                {
                                    recln = new clsReconcile
                                    {
                                        PayrollItem = "Basic Salary",
                                        PeriodOneId = periodOne,
                                        PeriodTwoId = periodTwo,
                                        PeriodOnePItemAmount = periodOneTrans.BasicPay,
                                        PeriodTwoPItemAmount = currEmpTransForPeriodTwo.BasicPay,
                                        ReasonForDifference =
                                            "The basic salary amount for " + employeeFullName + " was changed as a result of Late Report to Duty in the first period",
                                        AmountDueToReason = currEmpTransForPeriodTwo.BasicPay - periodOneTrans.BasicPay,
                                        TotalDifference = 0.00M
                                    };

                                    reclnList.Add(recln);

                                    mSumUpAllBasicSalaryChanges = mSumUpAllBasicSalaryChanges + recln.AmountDueToReason;

                                    #region Since a change in basic salary is detected, track down the 11 % employer contribution for that particular employee
                                    tempAdditionReclnObj = new clsReconcile
                                    {
                                        PayrollItem = "Total Additions",
                                        PeriodOneId = periodOne,
                                        PeriodTwoId = periodTwo,
                                        PeriodOnePItemAmount = periodOneTrans.PensionEmployer,
                                        PeriodTwoPItemAmount = Convert.ToDecimal(currEmpTransForPeriodTwo.PensionEmployer),
                                        ReasonForDifference = "The Pension Employer Cont amount paid was less in the first period than in the second, due to Late Report to Duty for an employee named" + employeeFullName + ".",
                                        AmountDueToReason = Math.Abs(currEmpTransForPeriodTwo.PensionEmployer - periodOneTrans.PensionEmployer),
                                        TotalDifference = 0.00M
                                    };

                                    tempAdditionReclnList.Add(tempAdditionReclnObj);

                                    mSumUpAllEmployerChanges = mSumUpAllEmployerChanges + tempAdditionReclnObj.AmountDueToReason;
                                    #endregion

                                    #region Since a change in basic salary is detected, track down the 7 % employee contribution for that particular employee
                                    tempDeductionReclnObj = new clsReconcile
                                    {
                                        PayrollItem = "Total Deductions",
                                        PeriodOneId = periodOne,
                                        PeriodTwoId = periodTwo,
                                        PeriodOnePItemAmount = periodOneTrans.PensionEmployee,
                                        PeriodTwoPItemAmount = Convert.ToDecimal(currEmpTransForPeriodTwo.PensionEmployee),
                                        ReasonForDifference = "The Pension Employee Cont amount paid was less in the first period than in the second, due to Late Report to Duty for an employee named" + employeeFullName + ".",
                                        AmountDueToReason = Math.Abs(currEmpTransForPeriodTwo.PensionEmployee - periodOneTrans.PensionEmployee),
                                        TotalDifference = 0.00M
                                    };

                                    tempDeductionReclnList.Add(tempDeductionReclnObj);

                                    mSumUpAllEmployeeChanges = mSumUpAllEmployeeChanges + tempDeductionReclnObj.AmountDueToReason;
                                    #endregion

                                    tempReclnObj = new clsReconcile
                                    {
                                        PayrollItem = "Total Deductions",
                                        PeriodOneId = periodOne,
                                        PeriodTwoId = periodTwo,
                                        PeriodOnePItemAmount = periodOneTrans.Tax,
                                        PeriodTwoPItemAmount = Convert.ToDecimal(currEmpTransForPeriodTwo.Tax),
                                        ReasonForDifference = "The Income Tax amount paid was less in the first period than in the second, due to Late Report to Duty for an employee named " + employeeFullName + ".",
                                        AmountDueToReason = Math.Abs(currEmpTransForPeriodTwo.Tax - periodOneTrans.Tax),
                                        TotalDifference = 0.00M
                                    };

                                    tempReclnList.Add(tempReclnObj);

                                    mSumUpAllIncomeTaxChanges = mSumUpAllIncomeTaxChanges + tempReclnObj.AmountDueToReason;
                                }
                                else if (currEmpTransForPeriodTwo.NumberOfDaysWorked < currEmpTransForPeriodTwo.TotalWorkingDays && periodOneTrans.NumberOfDaysWorked == periodOneTrans.TotalWorkingDays)
                                {
                                    recln = new clsReconcile
                                    {
                                        PayrollItem = "Basic Salary",
                                        PeriodOneId = periodOne,
                                        PeriodTwoId = periodTwo,
                                        PeriodOnePItemAmount = periodOneTrans.BasicPay,
                                        PeriodTwoPItemAmount = currEmpTransForPeriodTwo.BasicPay,
                                        ReasonForDifference =
                                            "The basic salary amount for " + employeeFullName + " was changed as a result of Absenteesm Deduction in the second period",
                                        AmountDueToReason = periodOneTrans.BasicPay - currEmpTransForPeriodTwo.BasicPay,
                                        TotalDifference = 0.00M
                                    };

                                    reclnList.Add(recln);

                                    mSumUpAllBasicSalaryChanges = mSumUpAllBasicSalaryChanges + recln.AmountDueToReason;

                                    #region Since a change in basic salary is detected, track down the 11 % employer contribution for that particular employee
                                    tempAdditionReclnObj = new clsReconcile
                                    {
                                        PayrollItem = "Total Additions",
                                        PeriodOneId = periodOne,
                                        PeriodTwoId = periodTwo,
                                        PeriodOnePItemAmount = periodOneTrans.PensionEmployer,
                                        PeriodTwoPItemAmount = Convert.ToDecimal(currEmpTransForPeriodTwo.PensionEmployer),
                                        ReasonForDifference = "The Pension Employer Cont amount paid was less in the second period than in the first, due to Absenteesm Deduction for an employee named" + employeeFullName + ".",
                                        AmountDueToReason = Math.Abs(currEmpTransForPeriodTwo.PensionEmployer - periodOneTrans.PensionEmployer),
                                        TotalDifference = 0.00M
                                    };

                                    tempAdditionReclnList.Add(tempAdditionReclnObj);

                                    mSumUpAllEmployerChanges = mSumUpAllEmployerChanges + tempAdditionReclnObj.AmountDueToReason;
                                    #endregion

                                    #region Since a change in basic salary is detected, track down the 7 % employee contribution for that particular employee
                                    tempDeductionReclnObj = new clsReconcile
                                    {
                                        PayrollItem = "Total Deductions",
                                        PeriodOneId = periodOne,
                                        PeriodTwoId = periodTwo,
                                        PeriodOnePItemAmount = periodOneTrans.PensionEmployee,
                                        PeriodTwoPItemAmount = Convert.ToDecimal(currEmpTransForPeriodTwo.PensionEmployee),
                                        ReasonForDifference = "The Pension Employee Cont amount paid was less in the second period than in the first, due to Absenteesm Deduction for an employee named" + employeeFullName + ".",
                                        AmountDueToReason = Math.Abs(currEmpTransForPeriodTwo.PensionEmployee - periodOneTrans.PensionEmployee),
                                        TotalDifference = 0.00M
                                    };

                                    tempDeductionReclnList.Add(tempDeductionReclnObj);

                                    mSumUpAllEmployeeChanges = mSumUpAllEmployeeChanges + tempDeductionReclnObj.AmountDueToReason;
                                    #endregion

                                    tempReclnObj = new clsReconcile
                                    {
                                        PayrollItem = "Total Deductions",
                                        PeriodOneId = periodOne,
                                        PeriodTwoId = periodTwo,
                                        PeriodOnePItemAmount = periodOneTrans.Tax,
                                        PeriodTwoPItemAmount = Convert.ToDecimal(currEmpTransForPeriodTwo.Tax),
                                        ReasonForDifference = "The Income Tax amount paid is less in the second period than in the first, due to Absenteesm Deduction for an employee named " + employeeFullName + ".",
                                        AmountDueToReason = Math.Abs(currEmpTransForPeriodTwo.Tax - periodOneTrans.Tax),
                                        TotalDifference = 0.00M
                                    };

                                    tempReclnList.Add(tempReclnObj);

                                    mSumUpAllIncomeTaxChanges = mSumUpAllIncomeTaxChanges + tempReclnObj.AmountDueToReason;
                                }
                                else if (attendanceListPeriodTwo != null)
                                {
                                    recln = new clsReconcile
                                    {
                                        PayrollItem = "Basic Salary",
                                        PeriodOneId = periodOne,
                                        PeriodTwoId = periodTwo,
                                        PeriodOnePItemAmount = 0,
                                        PeriodTwoPItemAmount = attendanceListPeriodTwo.DeductableAmount,
                                        ReasonForDifference =
                                            "The ETB basic salary amount for " + employeeFullName + " was changed as a result of Absenteesm Deduction in the second period",
                                        AmountDueToReason = attendanceListPeriodTwo.DeductableAmount,
                                        TotalDifference = 0.00M
                                    };

                                    reclnList.Add(recln);

                                    mSumUpAllBasicSalaryChanges = mSumUpAllBasicSalaryChanges + recln.AmountDueToReason;
                                }
                                else
                                {
                                    decimal val1 = Convert.ToDecimal(periodOneTrans.BasicSalaryGBP);
                                    decimal val2 = Convert.ToDecimal(currEmpTransForPeriodTwo.BasicSalaryGBP);

                                    if (val1 != val2)
                                    {
                                        recln = new clsReconcile
                                        {
                                            PayrollItem = "Basic Salary",
                                            PeriodOneId = periodOne,
                                            PeriodTwoId = periodTwo,
                                            PeriodOnePItemAmount = val1,
                                            PeriodTwoPItemAmount = val2,
                                            ReasonForDifference =
                                                "The GBP basic salary amount for " + employeeFullName + " was changed.",
                                            AmountDueToReason = Math.Abs(val1 - val2) * Convert.ToDecimal(currEmpTransForPeriodTwo.ExchangeRate),
                                            TotalDifference = 0.00M
                                        };

                                        reclnList.Add(recln);

                                        mSumUpAllBasicSalaryChanges = mSumUpAllBasicSalaryChanges + recln.AmountDueToReason;
                                    }
                                }


                            }
                        }
                    }
                }

                #endregion

                #region Check if there is a new employee
                if (periodOneBasicPayTotalGBP != periodTwoBasicPayTotalGBP || periodOneBasicPayTotal != periodTwoBasicPayTotal)
                {
                    //Check if every employee found in period two also exists in period one 
                    foreach (var periodTwoTrans in _PeriodTwoPayTrans)
                    {
                        var currEmpTransForPeriodOne = _PeriodOnePayTrans.FirstOrDefault(p => p.EmpId == periodTwoTrans.EmpId);
                        var newEmp = _employee.Get(periodTwoTrans.EmpId);
                        var newEmpFullName = newEmp.FirstName + " " + newEmp.MiddleName + " " +
                                                  newEmp.LastName;
                        if (currEmpTransForPeriodOne == null)
                        {
                            recln = new clsReconcile
                            {
                                PayrollItem = "Basic Salary",
                                PeriodOneId = periodOne,
                                PeriodTwoId = periodTwo,
                                PeriodOnePItemAmount = 0,
                                PeriodTwoPItemAmount = Convert.ToDecimal(periodTwoTrans.BasicPay),
                                ReasonForDifference = "Payroll has been generated for an employee named " + newEmpFullName + " in the second period. No Payroll transaction for this emplyee was found in the first period.",
                                AmountDueToReason = Convert.ToDecimal(periodTwoTrans.BasicPay),
                                TotalDifference = 0.00M
                            };
                            reclnList.Add(recln);

                            mSumUpAllBasicSalaryChanges = mSumUpAllBasicSalaryChanges + recln.AmountDueToReason;

                            #region If a new employee is detected, then certainly it will affect the total deduction amount due to an increase in income tax. therefore temporarly store the Income tax amount
                            tempReclnObj = new clsReconcile
                            {
                                PayrollItem = "Total Deductions",
                                PeriodOneId = periodOne,
                                PeriodTwoId = periodTwo,
                                PeriodOnePItemAmount = 0,
                                PeriodTwoPItemAmount = Convert.ToDecimal(periodTwoTrans.Tax),
                                ReasonForDifference = "The Income Tax balance has been affected due to Payroll Generation for an employee named " + newEmpFullName + " in the second period.",
                                AmountDueToReason = Convert.ToDecimal(periodTwoTrans.Tax),
                                TotalDifference = 0.00M
                            };

                            tempReclnList.Add(tempReclnObj);

                            mSumUpAllIncomeTaxChanges = mSumUpAllIncomeTaxChanges + tempReclnObj.AmountDueToReason;
                            #endregion

                            #region If a new employee is detected, Check if the employee is entitled to pension and Populate the Employer Side to the tempAdditions Reconciliation List
                            tempAdditionReclnObj = new clsReconcile
                            {
                                PayrollItem = "Total Additions",
                                PeriodOneId = periodOne,
                                PeriodTwoId = periodTwo,
                                PeriodOnePItemAmount = 0,
                                PeriodTwoPItemAmount = Convert.ToDecimal(periodTwoTrans.PensionEmployer),
                                ReasonForDifference = "Pension Employer Contribution for an employee named " + newEmpFullName + " in the second period.",
                                AmountDueToReason = Convert.ToDecimal(periodTwoTrans.PensionEmployer),
                                TotalDifference = 0.00M
                            };

                            if (Convert.ToDecimal(periodTwoTrans.PensionEmployer) > 0)
                                tempAdditionReclnList.Add(tempAdditionReclnObj);

                            mSumUpAllEmployerChanges = mSumUpAllEmployerChanges + tempAdditionReclnObj.AmountDueToReason;
                            #endregion

                            AdditionIDListOfNewEmployees.Add(periodTwoTrans.EmpId.ToString());
                        }
                    }
                }

                #endregion

                #region Check if there is a Basic Salary Difference at all due to exchange rate
                //If IDListOfNewEmployees is greater that zero, calculate the sum of Basic Salary ETB without the added employees

                decimal newBaicPayForPeriodTwoTotal = periodTwoBasicPayTotal;
                if (AdditionIDListOfNewEmployees.Count > 0)
                {
                    foreach (var VARIABLE in (AdditionIDListOfNewEmployees))
                    {
                        var sal = _employee.Get(int.Parse(VARIABLE)).SalaryETB;
                        var iTax = _PeriodTwoPayTrans.FirstOrDefault(p => p.EmpId == int.Parse(VARIABLE)).Tax;

                        newBaicPayForPeriodTwoTotal = newBaicPayForPeriodTwoTotal - sal;
                    }
                }
                if (periodOneExchangeRate != periodTwoExchangeRate)
                {
                    recln = new clsReconcile
                    {
                        PayrollItem = "Basic Salary",
                        PeriodOneId = periodOne,
                        PeriodTwoId = periodTwo,
                        PeriodOnePItemAmount = 0,
                        PeriodTwoPItemAmount = 0,
                        ReasonForDifference = "Basic Salary difference caused by exchange rate.",
                        AmountDueToReason = Math.Abs(periodOneBasicPayTotal - periodTwoBasicPayTotal) - mSumUpAllBasicSalaryChanges,
                        TotalDifference = 0.00M
                    };
                    reclnList.Add(recln);

                    tempAdditionReclnObj = new clsReconcile
                    {
                        PayrollItem = "Total Additions",
                        PeriodOneId = periodOne,
                        PeriodTwoId = periodTwo,
                        PeriodOnePItemAmount = 0,
                        PeriodTwoPItemAmount = 0,
                        ReasonForDifference = "Pension Employer Contribution difference caused by exchange rate.",
                        AmountDueToReason = Math.Abs(periodOnePensionEmployerTotal - periodTwoPensionEmployerTotal) - mSumUpAllEmployerChanges,
                        TotalDifference = 0.00M
                    };
                    tempAdditionReclnList.Add(tempAdditionReclnObj);

                    tempReclnObj = new clsReconcile
                    {
                        PayrollItem = "Total Deductions",
                        PeriodOneId = periodOne,
                        PeriodTwoId = periodTwo,
                        PeriodOnePItemAmount = 0,
                        PeriodTwoPItemAmount = 0,
                        ReasonForDifference = "Income Tax difference caused by exchange rate.",
                        AmountDueToReason = Math.Abs(periodOneIncomeTaxTotal - periodTwoIncomeTaxTotal) - mSumUpAllIncomeTaxChanges,
                        TotalDifference = 0.00M
                    };
                    tempReclnList.Add(tempReclnObj);
                }
                #endregion

                //Check if there is a terminated employee 
                #endregion

                #region Total Addition Differences for the two periods

                //If the difference of the total additions between the two periods is equal to zero, there is no difference in total additions
                if ((periodOneTotalAdditions - periodTwoTotalAdditions) == 0)
                {
                    recln = new clsReconcile
                    {
                        PayrollItem = "Total Additions",
                        PeriodOneId = periodOne,
                        PeriodTwoId = periodTwo,
                        PeriodOnePItemAmount = periodOneTotalAdditions,
                        PeriodTwoPItemAmount = periodTwoTotalAdditions,
                        ReasonForDifference = "No Difference",
                        AmountDueToReason = 0.00M,
                        TotalDifference = 0.00M
                    };

                    reclnList.Add(recln);
                }
                //If there appears to be any difference in the total addition, track down the source 
                else if (periodTwoTotalAdditions > periodOneTotalAdditions)
                {
                    //Since periodTwoTotalAdditions is greater than periodOneTotalAdditions
                    //Start from period two and check if all the EmPitems are found in period one from the PayrollTransactionsDetail View
                    foreach (var pOneTrans in additionTransDetailsForPeriodTwo)
                    {
                        vwPrlTransactionDetails trans = pOneTrans;
                        var result =
                            additionTransDetailsForPeriodOne.Where(
                                p => p.EmpId == trans.EmpId && p.PItemId == trans.PItemId);

                        var currEmployee = _employee.Get(pOneTrans.EmpId);
                        string employeeFullName = currEmployee.FirstName + " " + currEmployee.MiddleName + " " +
                                                  currEmployee.LastName;

                        //If result is equal to null: it means that a new payroll item attachment to a particular employee has been made 
                        if (!result.Any())
                        {
                            recln = new clsReconcile
                            {
                                PayrollItem = "Total Additions",
                                PeriodOneId = periodOne,
                                PeriodTwoId = periodTwo,
                                PeriodOnePItemAmount = 0,
                                PeriodTwoPItemAmount = pOneTrans.PItemAmount,
                                ReasonForDifference =
                                    pOneTrans.PItemName + " has been attached for an employee named " + employeeFullName +
                                    " in the second period",
                                AmountDueToReason = pOneTrans.PItemAmount,
                                TotalDifference = 0.00M
                            };

                            reclnList.Add(recln);
                        }
                        //If that particular Payroll Item for the same employee is found in the previous period, then, check the payroll item amount 
                        else
                        {
                            if (pOneTrans.PItemAmount != result.FirstOrDefault().PItemAmount)
                            //check if the Pitem Amount for that particular employee is the same for the two periods 
                            {
                                if (pOneTrans.PItemApplicationType == "Percentage Of Basic Salary" &&
                                    isExchangeRateChanged == true)
                                {
                                    if (AdditionPItemIdsList.Contains(pOneTrans.PItemId.ToString()) == false)
                                    {
                                        #region Get the total difference between the two periods for that particular Payroll Item
                                        //For Example Total Sum Of Housing Allowance for Period One - Total Sum of Housing Allowance for Period Two
                                        var PItemTotalAmountPeriodOne = additionTransDetailsForPeriodOne.Where(p => p.PItemId == pOneTrans.PItemId).Sum(p => p.PItemAmount);
                                        var PItemTotalAmountPeriodTwo = additionTransDetailsForPeriodTwo.Where(p => p.PItemId == pOneTrans.PItemId).Sum(p => p.PItemAmount);
                                        var Difference = Math.Abs(PItemTotalAmountPeriodTwo - PItemTotalAmountPeriodOne);

                                        #endregion
                                        //recln = new clsReconcile
                                        //{
                                        //    PayrollItem = "Total Additions",
                                        //    PeriodOneId = periodOne,
                                        //    PeriodTwoId = periodTwo,
                                        //    PeriodOnePItemAmount = PItemTotalAmountPeriodOne,
                                        //    PeriodTwoPItemAmount = PItemTotalAmountPeriodTwo,
                                        //    ReasonForDifference =
                                        //        "The " + pOneTrans.PItemName +
                                        //        " amount has been changed in the second period because of exchange rate difference for all employees entitled to this payroll item.",
                                        //    AmountDueToReason = Difference,
                                        //    TotalDifference = 0.00M
                                        //};

                                        //reclnList.Add(recln);
                                        AdditionPItemIdsList.Add(pOneTrans.PItemId.ToString());
                                    }
                                }
                            }
                        }
                    }
                }
                else if (periodOneTotalAdditions > periodTwoTotalAdditions)
                {
                    //Since periodOneTotalAdditions is greater than periodTwoTotalAdditions
                    //Start from period one and check if all the EmPitems are found in period two from the PayrollTransactionsDetail View
                    foreach (var pOneTrans in additionTransDetailsForPeriodOne)
                    {
                        vwPrlTransactionDetails trans = pOneTrans;
                        var result =
                            additionTransDetailsForPeriodTwo.Where(
                                p => p.EmpId == trans.EmpId && p.PItemId == trans.PItemId);

                        var currEmployee = _employee.Get(pOneTrans.EmpId);
                        string employeeFullName = currEmployee.FirstName + " " + currEmployee.MiddleName + " " +
                                                  currEmployee.LastName;

                        //If result is equal to null: it means that a payroll item attachment has been removed in the second period
                        if (!result.Any())
                        {
                            recln = new clsReconcile
                            {
                                PayrollItem = "Total Additions",
                                PeriodOneId = periodOne,
                                PeriodTwoId = periodTwo,
                                PeriodOnePItemAmount = pOneTrans.PItemAmount,
                                PeriodTwoPItemAmount = 0,
                                ReasonForDifference =
                                    pOneTrans.PItemName + " has been removed for an employee named " + employeeFullName +
                                    " in the second period",
                                AmountDueToReason = pOneTrans.PItemAmount,
                                TotalDifference = 0.00M
                            };

                            reclnList.Add(recln);
                        }
                        //If that particular Payroll Item for the same employee is found in the second period, then, check the payroll item amount 
                        else
                        {
                            //check if the Pitem Amount for that particular employee is the same for the two periods 
                            if (pOneTrans.PItemAmount != result.FirstOrDefault().PItemAmount)
                            {
                                if (pOneTrans.PItemApplicationType == "Percentage Of Basic Salary" &&
                                     isExchangeRateChanged == true)
                                {
                                    if (AdditionPItemIdsList.Contains(pOneTrans.PItemId.ToString()) == false)
                                    {
                                        #region Get the total difference between the two periods for that particular Payroll Item
                                        //For Example Total Sum Of Housing Allowance for Period One - Total Sum of Housing Allowance for Period Two
                                        var PItemTotalAmountPeriodOne = additionTransDetailsForPeriodOne.Where(p => p.PItemId == pOneTrans.PItemId).Sum(p => p.PItemAmount);
                                        var PItemTotalAmountPeriodTwo = additionTransDetailsForPeriodTwo.Where(p => p.PItemId == pOneTrans.PItemId).Sum(p => p.PItemAmount);
                                        var Difference = Math.Abs(PItemTotalAmountPeriodTwo - PItemTotalAmountPeriodOne);

                                        #endregion
                                        recln = new clsReconcile
                                        {
                                            PayrollItem = "Total Additions",
                                            PeriodOneId = periodOne,
                                            PeriodTwoId = periodTwo,
                                            PeriodOnePItemAmount = PItemTotalAmountPeriodOne,
                                            PeriodTwoPItemAmount = PItemTotalAmountPeriodTwo,
                                            ReasonForDifference =
                                                "The " + pOneTrans.PItemName +
                                                " amount has been changed in the second period because of exchange rate difference for all employees entitled to this payroll item.",
                                            AmountDueToReason = Difference,
                                            TotalDifference = 0.00M
                                        };

                                        reclnList.Add(recln);
                                        AdditionPItemIdsList.Add(pOneTrans.PItemId.ToString());
                                    }
                                }
                            }
                        }
                    }
                }

                //Populate the Addition Reconciliation results that has been tracked down so far (from the change in Basic Salary)
                if (tempAdditionReclnList.Count != 0)
                {
                    reclnList.AddRange(tempAdditionReclnList);
                }
                #endregion

                #region Total Deduction Differences for the two periods

                //Populate the Deduction Reconciliation results that has been tracked down so far (from the change in Basic Salary)
                if (tempDeductionReclnList.Count != 0)
                {
                    reclnList.AddRange(tempDeductionReclnList);
                }

                //If the difference of the total deductions between the two periods is equal to zero, there is no difference in total deductions
                if ((periodOneTotalDeductions - periodTwoTotalDeductions) == 0)
                {
                    recln = new clsReconcile
                    {
                        PayrollItem = "Total Deductions",
                        PeriodOneId = periodOne,
                        PeriodTwoId = periodTwo,
                        PeriodOnePItemAmount = periodOneTotalDeductions,
                        PeriodTwoPItemAmount = periodTwoTotalDeductions,
                        ReasonForDifference = "No Difference",
                        AmountDueToReason = 0.00M,
                        TotalDifference = 0.00M
                    };

                    reclnList.Add(recln);
                }
                //If there appears to be any difference in the total addition, track down the source 
                else if (periodTwoTotalDeductions > periodOneTotalDeductions)
                {
                    //Since periodTwoTotalDeductions is greater than periodOneTotalDeductions
                    //Start from period two and check if all the EmPitems are found in period one from the PayrollTransactionsDetail View
                    foreach (var pOneTrans in deductionTransDetailsForPeriodTwo)
                    {
                        vwPrlTransactionDetails trans = pOneTrans;
                        var result = deductionTransDetailsForPeriodOne.Where(p => p.EmpId == trans.EmpId && p.PItemId == trans.PItemId);

                        var currEmployee = _employee.Get(pOneTrans.EmpId);
                        string employeeFullName = currEmployee.FirstName + " " + currEmployee.MiddleName + " " + currEmployee.LastName;

                        //If result is equal to null: it means that a new payroll item attachment to a particular employee has been made 
                        if (!result.Any())
                        {
                            recln = new clsReconcile
                            {
                                PayrollItem = "Total Deductions",
                                PeriodOneId = periodOne,
                                PeriodTwoId = periodTwo,
                                PeriodOnePItemAmount = 0,
                                PeriodTwoPItemAmount = pOneTrans.PItemAmount,
                                ReasonForDifference =
                                    pOneTrans.PItemName + " has been attached for an employee named " + employeeFullName +
                                    " in the second period",
                                AmountDueToReason = pOneTrans.PItemAmount,
                                TotalDifference = 0.00M
                            };

                            reclnList.Add(recln);

                            if (pOneTrans.PItemId == pensionEmployeePItemId)
                                mSumUpAllEmployeeChanges = mSumUpAllEmployeeChanges + recln.AmountDueToReason;
                        }
                        //If that particular Payroll Item for the same employee is found in the previous period, then, check the payroll item amount 
                        else
                        {
                            if (pOneTrans.PItemAmount != result.FirstOrDefault().PItemAmount)
                            //check if the Pitem Amount for that particular employee is the same for the two periods 
                            {
                                if (pOneTrans.PItemApplicationType == "Percentage Of Basic Salary" &&
                                    isExchangeRateChanged == true)
                                {
                                    if (DeductionPItemIdsList.Contains(pOneTrans.PItemId.ToString()) == false)
                                    {

                                        #region Get the total difference between the two periods for that particular Payroll Item
                                        //For Example Total Sum Of Housing Allowance for Period One - Total Sum of Housing Allowance for Period Two
                                        var PItemTotalAmountPeriodOne = deductionTransDetailsForPeriodOne.Where(p => p.PItemId == pOneTrans.PItemId).Sum(p => p.PItemAmount);
                                        var PItemTotalAmountPeriodTwo = deductionTransDetailsForPeriodTwo.Where(p => p.PItemId == pOneTrans.PItemId).Sum(p => p.PItemAmount);
                                        var Difference = Math.Abs(PItemTotalAmountPeriodTwo - PItemTotalAmountPeriodOne);

                                        #endregion

                                        //recln = new clsReconcile
                                        //{
                                        //    PayrollItem = "Total Deductions",
                                        //    PeriodOneId = periodOne,
                                        //    PeriodTwoId = periodTwo,
                                        //    PeriodOnePItemAmount = PItemTotalAmountPeriodOne,
                                        //    PeriodTwoPItemAmount = PItemTotalAmountPeriodTwo,
                                        //    ReasonForDifference =
                                        //        "The " + pOneTrans.PItemName +
                                        //        " amount has been changed in the second period because of exchange rate difference for all employees entitled to this payroll item.",
                                        //    AmountDueToReason = Difference,
                                        //    TotalDifference = 0.00M
                                        //};

                                        //reclnList.Add(recln);
                                        DeductionPItemIdsList.Add(pOneTrans.PItemId.ToString());
                                    }
                                }
                            }
                        }
                    }
                }
                else if (periodOneTotalDeductions > periodTwoTotalDeductions)
                {
                    //Since periodOneTotalDeductions is greater than periodTwoTotalDeductions
                    //Start from period one and check if all the EmPitems are found in period two from the PayrollTransactionsDetail View
                    foreach (var pOneTrans in deductionTransDetailsForPeriodOne)
                    {
                        vwPrlTransactionDetails trans = pOneTrans;
                        var result =
                            deductionTransDetailsForPeriodTwo.Where(
                                p => p.EmpId == trans.EmpId && p.PItemId == trans.PItemId);

                        var currEmployee = _employee.Get(pOneTrans.EmpId);
                        string employeeFullName = currEmployee.FirstName + " " + currEmployee.MiddleName + " " +
                                                  currEmployee.LastName;

                        //If result is equal to null: it means that a payroll item attachment has been removed in the second period
                        if (!result.Any())
                        {
                            recln = new clsReconcile
                            {
                                PayrollItem = "Total Deductions",
                                PeriodOneId = periodOne,
                                PeriodTwoId = periodTwo,
                                PeriodOnePItemAmount = pOneTrans.PItemAmount,
                                PeriodTwoPItemAmount = 0,
                                ReasonForDifference =
                                    pOneTrans.PItemName + " has been removed for an employee named " + employeeFullName +
                                    " in the second period",
                                AmountDueToReason = pOneTrans.PItemAmount,
                                TotalDifference = 0.00M
                            };

                            reclnList.Add(recln);

                            if (pOneTrans.PItemId == pensionEmployeePItemId)
                                mSumUpAllEmployeeChanges = mSumUpAllEmployeeChanges + recln.AmountDueToReason;
                        }
                        //If that particular Payroll Item for the same employee is found in the second period, then, check the payroll item amount 
                        else
                        {
                            //check if the Pitem Amount for that particular employee is the same for the two periods 
                            if (pOneTrans.PItemAmount != result.FirstOrDefault().PItemAmount)
                            {
                                if (pOneTrans.PItemApplicationType == "Percentage Of Basic Salary" &&
                                     isExchangeRateChanged == true)
                                {
                                    if (DeductionPItemIdsList.Contains(pOneTrans.PItemId.ToString()) == false)
                                    {
                                        #region Get the total difference between the two periods for that particular Payroll Item
                                        //For Example Total Sum Of Housing Allowance for Period One - Total Sum of Housing Allowance for Period Two
                                        var PItemTotalAmountPeriodOne = deductionTransDetailsForPeriodOne.Where(p => p.PItemId == pOneTrans.PItemId).Sum(p => p.PItemAmount);
                                        var PItemTotalAmountPeriodTwo = deductionTransDetailsForPeriodTwo.Where(p => p.PItemId == pOneTrans.PItemId).Sum(p => p.PItemAmount);
                                        var Difference = Math.Abs(PItemTotalAmountPeriodTwo - PItemTotalAmountPeriodOne);

                                        #endregion
                                        //recln = new clsReconcile
                                        //{
                                        //    PayrollItem = "Total Deductions",
                                        //    PeriodOneId = periodOne,
                                        //    PeriodTwoId = periodTwo,
                                        //    PeriodOnePItemAmount = PItemTotalAmountPeriodOne,
                                        //    PeriodTwoPItemAmount = PItemTotalAmountPeriodTwo,
                                        //    ReasonForDifference =
                                        //        "The " + pOneTrans.PItemName +
                                        //        " amount has been changed in the second period because of exchange rate difference for all employees entitled to this payroll item.",
                                        //    AmountDueToReason = Difference,
                                        //    TotalDifference = 0.00M
                                        //};

                                        //reclnList.Add(recln);
                                        DeductionPItemIdsList.Add(pOneTrans.PItemId.ToString());
                                    }
                                }
                            }
                        }
                    }
                }

                //Track down the Pension Employee Contribution difference caused by Exchange rate 
                tempDeductionReclnObj = new clsReconcile
                {
                    PayrollItem = "Total Deductions",
                    PeriodOneId = periodOne,
                    PeriodTwoId = periodTwo,
                    PeriodOnePItemAmount = 0,
                    PeriodTwoPItemAmount = 0,
                    ReasonForDifference = "Pension Employee Contribution difference caused by exchange rate.",
                    AmountDueToReason = Math.Abs(periodOnePensionEmployeeTotal - periodTwoPensionEmployeeTotal) - mSumUpAllEmployeeChanges,
                    TotalDifference = 0.00M
                };



                //Populate the reconciliation List from the list of Income Tax values for the newly recruited employees
                if (tempReclnList.Count != 0)
                {
                    reclnList.AddRange(tempReclnList);
                }

                //Populate the reconciliation List from the list of Pension Employee Contribution values 
                if (tempDeductionReclnObj != null)
                {
                    reclnList.Add(tempDeductionReclnObj);
                }
                #endregion

            }
            SaveResult(reclnList, periodOne, periodTwo);
            return true;
        }

        public bool ReconcilePeriods(int periodOne, int periodTwo)
        {



            #region Declarations

            decimal _AMOUNT_DIFFERENCE = 0;

            var _PERIOD_ONE = _payrollPeriods.Get(periodOne);
            var _PERIOD_TWO = _payrollPeriods.Get(periodTwo);

            var TotalWorkingDaysPOne = _payrollPeriods.Get(periodOne).TotalWorkingDays;
            var TotalWorkingDaysPTwo = _payrollPeriods.Get(periodTwo).TotalWorkingDays;

            var _ALL_PERIOD_ONE_TRANS = _PayrollTransactions.GetAll().Where(p => p.PeriodId == periodOne).ToList();
            var _ALL_PERIOD_TWO_TRANS = _PayrollTransactions.GetAll().Where(p => p.PeriodId == periodTwo).ToList();

            var _ALL_PERIOD_ONE_TRANS_PITEMS = _payrollTransactionPItems.GetAll().Where(p => p.PrlTransactions.PeriodId == periodOne).ToList();
            var _ALL_PERIOD_TWO_TRANS_PITEMS = _payrollTransactionPItems.GetAll().Where(p => p.PrlTransactions.PeriodId == periodTwo).ToList();

            decimal _periodOneExchangeRate = (decimal)_ALL_PERIOD_ONE_TRANS.FirstOrDefault().ExchangeRate;
            decimal _periodTwoExchangeRate = (decimal)_ALL_PERIOD_TWO_TRANS.FirstOrDefault().ExchangeRate;

            #region Remove (remove from the changes made table)Employees that have been made Active in the second period and whom doesnt have a transaction in both periods

            var _ACTIVATED_EMPS = _changesMade.GetAll().Where(l => l.ChangePeriodId == periodTwo && l.ReasonForChange == Constants.ReasonActiveEmployee).ToList();
            using (var transaction = new TransactionScope())
            {

                if (_ACTIVATED_EMPS.Any())
                {
                    foreach (var _activeEmp in _ACTIVATED_EMPS)
                    {
                        var recordExist = _ALL_PERIOD_TWO_TRANS.Where(u => u.EmpId == _activeEmp.EmpId).ToList();

                        if (recordExist.Any())
                        {
                            continue;
                        }
                        else
                        {
                            _changesMade.Delete(_activeEmp.Id);

                        }
                    }
                }
                transaction.Complete();
                _context.AcceptAllChanges();
            }
            #endregion

            #region Remove the Change in GBP changes for those employees who are paid in Birr
            var _GBP_EMPS = _changesMade.GetAll().Where(l => l.ChangePeriodId == periodTwo && l.ReasonForChange == "Change in GBP Salary").ToList();

            if (_GBP_EMPS.Any())
            {
                foreach (var _GBPEmp in _GBP_EMPS)
                {
                    var recordExist = _ALL_PERIOD_TWO_TRANS.Where(u => u.EmpId == _GBPEmp.EmpId && u.BasicSalaryGBP == 0).ToList();

                    if (recordExist.Any())
                    {
                        _changesMade.Delete(_GBPEmp.Id);
                    }
                    else
                    {
                        continue;
                    }
                }
            }
            #endregion

            List<int> _listOfEmpsOnBothPeriods = new List<int>();

            clsReconcile reclnObject;
            var reclnObjectList = new List<clsReconcile>();

            clsReconcile tempAdditionReclnObject;
            var tempAdditionReclnObjectList = new List<clsReconcile>();

            clsReconcile tempDeductionReclnObject;
            var tempDeductionReclnObjectList = new List<clsReconcile>();

            //Get The payroll Item Id for Basic salary 
            var _BS_PITEM_ID = int.Parse(_payrollSettings.Get(Constants.BasicSalaryPItemId).SettingValue);
            //Get The payroll Item Id for Severance Pay  
            var _SP_PITEM_ID = int.Parse(_payrollSettings.Get(Constants.SeverancePayPItemId).SettingValue);

            var changesMadeOnPeriodTwo = _changesMade.GetAll().Where(e => e.ChangePeriodId == periodTwo);

            // TODO: Check the changesMadeOnPeriodTwo is not null

            var _ALL_PERIOD_TWO_CHANGES = changesMadeOnPeriodTwo as PrlChangesMade[] ?? changesMadeOnPeriodTwo.ToArray();

            var _ALL_BS_CHANGES = _ALL_PERIOD_TWO_CHANGES.Where(e => e.PItemId == _BS_PITEM_ID && e.ReasonForChange != Constants.ReasonExchangeRate);
            var _ALL_ADD_CHANGES = _ALL_PERIOD_TWO_CHANGES.Where(e => e.PrlItems.PItemIsAddition && e.PItemId != _BS_PITEM_ID && e.PItemId != _SP_PITEM_ID && e.ReasonForChange != Constants.ReasonExchangeRate);
            var _ALL_DED_CHANGES = _ALL_PERIOD_TWO_CHANGES.Where(e => e.PrlItems.PItemIsAddition == false && e.PItemId != _BS_PITEM_ID && e.ReasonForChange != Constants.ReasonExchangeRate);

            var _ALL_NEW_RECRUITMENT_CHANGES = _ALL_PERIOD_TWO_CHANGES.Where(e => e.PItemId == _BS_PITEM_ID && e.ReasonForChange == Constants.ReasonNewEmployeeAdded);
            #endregion


            #region Get list of employees with COMMON payroll generation FOR BOTH periods

            foreach (var k in _ALL_PERIOD_ONE_TRANS)
            {
                var _IsEmpOnPeriodTwo = _ALL_PERIOD_TWO_TRANS.Where(e => e.EmpId == k.EmpId);

                if (_IsEmpOnPeriodTwo.Any())
                    _listOfEmpsOnBothPeriods.Add(k.EmpId);
            }
            #endregion

            #region Get All Changes caused by exchange rate difference on period two except for those employees contained in _listOfEmpsSkippedOnPeriodTwo

            var _ALL_BS_ER_CHANGES = _ALL_PERIOD_TWO_CHANGES.Where(e => e.PItemId == _BS_PITEM_ID && e.ReasonForChange == Constants.ReasonExchangeRate && _listOfEmpsOnBothPeriods.Contains(e.EmpId));

            DataTable dt = ToDataTable(_ALL_BS_ER_CHANGES.ToList());
            var _ALL_ADD_ER_CHANGES = _ALL_PERIOD_TWO_CHANGES.Where(e => e.PrlItems.PItemIsAddition && e.PItemId != _BS_PITEM_ID && e.PItemId != _SP_PITEM_ID && e.ReasonForChange == Constants.ReasonExchangeRate && _listOfEmpsOnBothPeriods.Contains(e.EmpId));
            var _ALL_DED_ER_CHANGES = _ALL_PERIOD_TWO_CHANGES.Where(e => e.PrlItems.PItemIsAddition == false && e.PItemId != _BS_PITEM_ID && e.ReasonForChange == Constants.ReasonExchangeRate && _listOfEmpsOnBothPeriods.Contains(e.EmpId));

            var _ALL_ADD_PERCENTAGE_PITEMS = _payrollItems.GetAll().Where(p => p.PItemApplicationType == Constants.PercentageApplicationType && p.PItemIsAddition == true && p.Id != _SP_PITEM_ID);
            var _ALL_DED_PERCENTAGE_PITEMS = _payrollItems.GetAll().Where(p => p.PItemApplicationType == Constants.PercentageApplicationType && p.PItemIsAddition == false && p.Id != _SP_PITEM_ID);
            #endregion

            #region Get all changes caused by employee PREVIOUS MONTH attendace


            var _PREV_MONTH_ATTENDANCE = new List<vwAttendance>();

            using (ENTRO_MISEntities erpEntities = new ENTRO_MISEntities())
            {
                _PREV_MONTH_ATTENDANCE = erpEntities.vwAttendance.Where(e => e.PeriodId == periodOne & e.IsActive == true & e.IsTerminated == false).ToList();

            }
            #endregion

            #region Get Differences on BASIC SALARY

            foreach (var BS_Changes in _ALL_BS_CHANGES)
            {
                //Check if newly added employees have payroll generation before considering adding to reconciliation 
                bool isToBeSkipped = false;

                if (BS_Changes.ReasonForChange == Constants.ReasonNewEmployeeAdded)
                {
                    var recordExists = _ALL_PERIOD_TWO_TRANS.Where(p => p.EmpId == BS_Changes.EmpId);

                    if (recordExists.Any())
                        isToBeSkipped = false;
                    else
                        isToBeSkipped = true;

                }

                _AMOUNT_DIFFERENCE = 0;
                _AMOUNT_DIFFERENCE = BS_Changes.Difference;

                if (BS_Changes.PreviousAmount > BS_Changes.ChangedAmount)
                    _AMOUNT_DIFFERENCE = _AMOUNT_DIFFERENCE * (-1);

                reclnObject = new clsReconcile
                {
                    PayrollItem = BS_Changes.PrlItems.PItemName,
                    PeriodOneId = periodOne,
                    PeriodTwoId = periodTwo,
                    PeriodOnePItemAmount = BS_Changes.PreviousAmount,
                    PeriodTwoPItemAmount = BS_Changes.ChangedAmount,
                    ReasonForDifference = BS_Changes.ReasonForChange
                    + " (" + GetEmployeeFullName(BS_Changes.EmpId) + ")",
                    AmountDueToReason = _AMOUNT_DIFFERENCE,
                    TotalDifference = 0.00M,
                    IsAddition = true
                };

                if (isToBeSkipped == false)
                    reclnObjectList.Add(reclnObject);

            }

            //Get the difference in basic salary caused by exchange rate difference 
            if (_ALL_BS_ER_CHANGES.Any())
            {
                _AMOUNT_DIFFERENCE = 0;
                _AMOUNT_DIFFERENCE = _ALL_BS_ER_CHANGES.Sum(e => e.Difference);

                if (_periodOneExchangeRate > _periodTwoExchangeRate)
                    _AMOUNT_DIFFERENCE = _AMOUNT_DIFFERENCE * (-1);

                reclnObject = new clsReconcile
                {
                    PayrollItem = _ALL_BS_ER_CHANGES.FirstOrDefault().PrlItems.PItemName,
                    PeriodOneId = periodOne,
                    PeriodTwoId = periodTwo,
                    PeriodOnePItemAmount = 0,
                    PeriodTwoPItemAmount = 0,
                    ReasonForDifference = "Basic Salary difference caused by exchange rate.",
                    AmountDueToReason = _AMOUNT_DIFFERENCE,
                    TotalDifference = 0.00M,
                    IsAddition = true
                };

                reclnObjectList.Add(reclnObject);
            }


            //Get the difference in basic salary caused by employee previous month attendance
            foreach (var prevMonthAtt in _PREV_MONTH_ATTENDANCE)
            {
                if (prevMonthAtt.SalaryGBP == 0)
                {
                    decimal prevAmount = 0;
                    decimal currAmount = 0;

                    var prevAmount1 = _PayrollTransactions.GetByPeriodAndEmp(periodOne, prevMonthAtt.EmpId);
                    var currAmount1 = _PayrollTransactions.GetByPeriodAndEmp(periodTwo, prevMonthAtt.EmpId);

                    if (prevAmount1 != null)
                        prevAmount = prevAmount1.BasicPay;

                    if (currAmount1 != null)
                        currAmount = currAmount1.BasicPay;

                    reclnObject = new clsReconcile
                    {
                        PayrollItem = "Basic Salary",
                        PeriodOneId = periodOne,
                        PeriodTwoId = periodTwo,
                        PeriodOnePItemAmount = prevAmount,
                        PeriodTwoPItemAmount = currAmount,
                        ReasonForDifference = "Change in Basic salary for " + GetEmployeeFullName(prevMonthAtt.EmpId) + "), as a result of absenteeism deduction on the first period.",
                        AmountDueToReason = prevMonthAtt.DeductableAmount,
                        TotalDifference = 0.00M,
                        IsAddition = true
                    };

                    reclnObjectList.Add(reclnObject);
                }
                else
                {
                    //TO:DO ************************ Update the following code if payment in in GBP

                    decimal prevAmount = 0;
                    decimal currAmount = 0;

                    var prevAmount1 = _PayrollTransactions.GetByPeriodAndEmp(periodOne, prevMonthAtt.EmpId);
                    var currAmount1 = _PayrollTransactions.GetByPeriodAndEmp(periodTwo, prevMonthAtt.EmpId);

                    if (prevAmount1 != null)
                        prevAmount = prevAmount1.BasicPay;

                    if (currAmount1 != null)
                        currAmount = currAmount1.BasicPay;

                    reclnObject = new clsReconcile
                    {
                        PayrollItem = "Basic Salary",
                        PeriodOneId = periodOne,
                        PeriodTwoId = periodTwo,
                        PeriodOnePItemAmount = prevAmount,
                        PeriodTwoPItemAmount = currAmount,
                        ReasonForDifference = "Change in Basic salary for " + GetEmployeeFullName(prevMonthAtt.EmpId) + "), as a result of absenteeism deduction on the first period.",
                        AmountDueToReason = prevMonthAtt.DeductableAmount,
                        TotalDifference = 0.00M,
                        IsAddition = true
                    };

                    reclnObjectList.Add(reclnObject);
                }

            }
            #endregion

            #region Get Differences caused by list of skipped employees (Employees skipped on payroll generation on period two )

            foreach (var d in _ALL_PERIOD_ONE_TRANS)
            {
                //Check if payroll has been generated for the current employee in the second period 
                var checkOnPeriodTwo = _ALL_PERIOD_TWO_TRANS.Find(e => e.EmpId == d.EmpId);

                //if payroll is generated continue loop
                if (checkOnPeriodTwo != null)
                    continue;

                //else Identify the reason why payroll was not generated for the employee 
                else
                {
                    //If the reason is Employee Deactivation, continue with loop 
                    var checkIfTheEmpWasDeactivated = _ALL_PERIOD_TWO_CHANGES.Where(e => e.EmpId == d.EmpId && e.ReasonForChange == Constants.ReasonInactiveEmployee);

                    //If the reason is Employee Deactivation, continue with loop
                    if (checkIfTheEmpWasDeactivated != null)
                        continue;

                    //Else, the employee has been skipped on the second Period                     
                    else
                    {
                        _AMOUNT_DIFFERENCE = 0;
                        _AMOUNT_DIFFERENCE = d.BasicPay;

                        _AMOUNT_DIFFERENCE = _AMOUNT_DIFFERENCE * (-1);
                        reclnObject = new clsReconcile
                        {
                            PayrollItem = "Basic Salary",
                            PeriodOneId = periodOne,
                            PeriodTwoId = periodTwo,
                            PeriodOnePItemAmount = d.BasicPay,
                            PeriodTwoPItemAmount = 0,
                            ReasonForDifference = "The employee (" + GetEmployeeFullName(d.EmpId) + "), was skipped during payroll generation on the second period.",
                            AmountDueToReason = _AMOUNT_DIFFERENCE,
                            TotalDifference = 0.00M,
                            IsAddition = true
                        };

                        reclnObjectList.Add(reclnObject);

                        #region Get the additions and deductions of this particular employee (as the payroll items would have an effect on the reconciliation)

                        //Get The payroll Item Id for Pension Employer contribution   
                        var _PEMPR_PITEM_ID = int.Parse(_payrollSettings.Get(Constants.PensionEmployerContId).SettingValue);

                        //Get The payroll Item Id for Pension Employee contribution
                        var _PEMP_PITEM_ID = int.Parse(_payrollSettings.Get(Constants.PensionEmployeeContId).SettingValue);

                        var _PERIOD_ONE_EMPLOYEE_PITEMS = _ALL_PERIOD_ONE_TRANS_PITEMS.Where(p => p.PrlTransactions.EmpId == d.EmpId);
                        foreach (var f in _PERIOD_ONE_EMPLOYEE_PITEMS)
                        {
                            if (f.PrlItems.PItemIsAddition == true)
                            {
                                _AMOUNT_DIFFERENCE = 0;
                                _AMOUNT_DIFFERENCE = f.PItemAmount;

                                _AMOUNT_DIFFERENCE = _AMOUNT_DIFFERENCE * (-1);
                                tempAdditionReclnObject = new clsReconcile
                                {
                                    PayrollItem = f.PrlItems.PItemName,
                                    PeriodOneId = periodOne,
                                    PeriodTwoId = periodTwo,
                                    PeriodOnePItemAmount = f.PItemAmount,
                                    PeriodTwoPItemAmount = 0,
                                    ReasonForDifference = "Difference on " + f.PrlItems.PItemName + " for the employee (" + GetEmployeeFullName(d.EmpId) + "). Employee skipped during payroll generation on the second period.",
                                    AmountDueToReason = _AMOUNT_DIFFERENCE,
                                    TotalDifference = 0.00M,
                                    IsAddition = true
                                };

                                tempAdditionReclnObjectList.Add(tempAdditionReclnObject);
                            }
                            else
                            {
                                _AMOUNT_DIFFERENCE = 0;
                                _AMOUNT_DIFFERENCE = f.PItemAmount;

                                _AMOUNT_DIFFERENCE = _AMOUNT_DIFFERENCE * (-1);
                                tempDeductionReclnObject = new clsReconcile
                                {
                                    PayrollItem = f.PrlItems.PItemName,
                                    PeriodOneId = periodOne,
                                    PeriodTwoId = periodTwo,
                                    PeriodOnePItemAmount = f.PItemAmount,
                                    PeriodTwoPItemAmount = 0,
                                    ReasonForDifference = "Difference on " + f.PrlItems.PItemName + " for the employee (" + GetEmployeeFullName(d.EmpId) + "). Employee skipped during payroll generation on the second period.",
                                    AmountDueToReason = _AMOUNT_DIFFERENCE,
                                    TotalDifference = 0.00M,
                                    IsAddition = false
                                };

                                tempDeductionReclnObjectList.Add(tempDeductionReclnObject);
                            }
                        }
                        #endregion
                    }

                }
            }
            #endregion

            #region Get Differences caused by list of skipped employees (Employees skipped on payroll generation on period one)

            foreach (var d in _ALL_PERIOD_TWO_TRANS)
            {
                //Check if payroll has been generated for the current employee in the FIRST period 
                var checkOnPeriodOne = _ALL_PERIOD_ONE_TRANS.Find(e => e.EmpId == d.EmpId);

                //if payroll is generated continue loop
                if (checkOnPeriodOne != null)
                    continue;

                //else Identify the reason why payroll was not generated for the employee 
                else
                {
                    //If the reason is Employee Deactivation, continue with loop 
                    var checkIfTheEmpWasActivated = _ALL_PERIOD_TWO_CHANGES.Where(e => e.EmpId == d.EmpId && e.ReasonForChange == Constants.ReasonActiveEmployee);

                    //If the reason is Employee Deactivation, continue with loop
                    if (checkIfTheEmpWasActivated.Any())
                        continue;

                    //If the reason is New employee addition to the database, Continue with loop 
                    var checkIfTheEmpWasRecruited = _ALL_PERIOD_TWO_CHANGES.Where(e => e.EmpId == d.EmpId && e.ReasonForChange == Constants.ReasonNewEmployeeAdded);

                    //If the reason is Employee Recruitment, continue with loop
                    if (checkIfTheEmpWasRecruited.Any())
                        continue;

                    //Else, the employee has been skipped on the first Period 
                    else
                    {
                        reclnObject = new clsReconcile
                        {
                            PayrollItem = "Basic Salary",
                            PeriodOneId = periodOne,
                            PeriodTwoId = periodTwo,
                            PeriodOnePItemAmount = 0,
                            PeriodTwoPItemAmount = d.BasicPay,
                            ReasonForDifference = "The employee (" + GetEmployeeFullName(d.EmpId) + "), was skipped during payroll generation on the first period.",
                            AmountDueToReason = d.BasicPay,
                            TotalDifference = 0.00M,
                            IsAddition = true
                        };

                        reclnObjectList.Add(reclnObject);

                        #region Get the additions and deductions of this particular employee (as the payroll items would have an effect on the reconciliation)

                        //Get The payroll Item Id for Pension Employer contribution   
                        var _PEMPR_PITEM_ID = int.Parse(_payrollSettings.Get(Constants.PensionEmployerContId).SettingValue);

                        //Get The payroll Item Id for Pension Employee contribution
                        var _PEMP_PITEM_ID = int.Parse(_payrollSettings.Get(Constants.PensionEmployeeContId).SettingValue);

                        var _PERIOD_TWO_EMPLOYEE_PITEMS = _ALL_PERIOD_TWO_TRANS_PITEMS.Where(p => p.PrlTransactions.EmpId == d.EmpId);
                        foreach (var f in _PERIOD_TWO_EMPLOYEE_PITEMS)
                        {
                            if (f.PrlItems.PItemIsAddition == true)
                            {
                                //If the reason is New employee addition to the database, Continue with loop 
                                checkIfTheEmpWasRecruited = _ALL_PERIOD_TWO_CHANGES.Where(e => e.EmpId == d.EmpId && e.ReasonForChange == Constants.ReasonNewEmployeeAdded && e.PItemId == f.PItemId);

                                //If the reason is Employee Recruitment, continue with loop
                                if (checkIfTheEmpWasRecruited.Any())
                                    continue;
                                else
                                {
                                    tempAdditionReclnObject = new clsReconcile
                                    {
                                        PayrollItem = f.PrlItems.PItemName,
                                        PeriodOneId = periodOne,
                                        PeriodTwoId = periodTwo,
                                        PeriodOnePItemAmount = 0,
                                        PeriodTwoPItemAmount = f.PItemAmount,
                                        ReasonForDifference = "Difference on " + f.PrlItems.PItemName + " for the employee (" + GetEmployeeFullName(d.EmpId) + "). Employee skipped during payroll generation on the first period.",
                                        AmountDueToReason = f.PItemAmount,
                                        TotalDifference = 0.00M,
                                        IsAddition = true
                                    };

                                    tempAdditionReclnObjectList.Add(tempAdditionReclnObject);
                                }
                            }
                            else
                            {
                                //If the reason is New employee addition to the database, Continue with loop 
                                checkIfTheEmpWasRecruited = _ALL_PERIOD_TWO_CHANGES.Where(e => e.EmpId == d.EmpId && e.ReasonForChange == Constants.ReasonNewEmployeeAdded && e.PItemId == f.PItemId);

                                //If the reason is Employee Recruitment, continue with loop
                                if (checkIfTheEmpWasRecruited.Any())
                                    continue;
                                else
                                {
                                    tempDeductionReclnObject = new clsReconcile
                                    {
                                        PayrollItem = f.PrlItems.PItemName,
                                        PeriodOneId = periodOne,
                                        PeriodTwoId = periodTwo,
                                        PeriodOnePItemAmount = 0,
                                        PeriodTwoPItemAmount = f.PItemAmount,
                                        ReasonForDifference = "Difference on " + f.PrlItems.PItemName + " for the employee (" + GetEmployeeFullName(d.EmpId) + "). Employee skipped during payroll generation on the first period.",
                                        AmountDueToReason = f.PItemAmount,
                                        TotalDifference = 0.00M,
                                        IsAddition = false
                                    };

                                    tempDeductionReclnObjectList.Add(tempDeductionReclnObject);
                                }
                            }
                        }
                        #endregion
                    }

                }
            }
            #endregion

            #region Get Differences caused by Late Report to Duty on Period one

            //Get The payroll Item Id for iNCOME tAX  
            var _IT_PITEM_ID = int.Parse(_payrollSettings.Get(Constants.IncomeTaxId).SettingValue);

            foreach (var emp in _listOfEmpsOnBothPeriods)
            {
                PrlEmployees empObject = _employee.Get(emp);

                var NumberOfDaysWorked = _PayrollTransactions.GetByPeriodAndEmp(periodOne, emp).NumberOfDaysWorked;

                if (empObject.EmploymentDate > _PERIOD_ONE.StartDate && NumberOfDaysWorked < TotalWorkingDaysPOne)
                {
                    //Late report to duty on Period one for the current employee detected 
                    //Therefore track down the change/difference in basic salary  with period two 

                    decimal PeriodOneBPAmount = _PayrollTransactions.GetByPeriodAndEmp(periodOne, emp).BasicPay;
                    decimal PeriodTwoBPAmount = _PayrollTransactions.GetByPeriodAndEmp(periodTwo, emp).BasicPay;
                    var ERdifference = _ALL_BS_ER_CHANGES.Where(e => e.EmpId == emp).FirstOrDefault();
                    decimal ERBSDiff = 0;
                    if (ERdifference != null)
                    {
                        ERBSDiff = ERdifference.Difference;

                        if (_periodOneExchangeRate > _periodTwoExchangeRate)
                            PeriodTwoBPAmount = PeriodTwoBPAmount + ERBSDiff;
                        else if (_periodOneExchangeRate < _periodTwoExchangeRate)
                            PeriodTwoBPAmount = PeriodTwoBPAmount - ERBSDiff;
                    }
                    reclnObject = new clsReconcile
                    {
                        PayrollItem = "Basic Salary",
                        PeriodOneId = periodOne,
                        PeriodTwoId = periodTwo,
                        PeriodOnePItemAmount = PeriodOneBPAmount,
                        PeriodTwoPItemAmount = PeriodTwoBPAmount,
                        ReasonForDifference = "Change in Basic salary for (" + GetEmployeeFullName(emp) + "), as a result of late report to duty on the first period.",
                        AmountDueToReason = Math.Abs(PeriodOneBPAmount - PeriodTwoBPAmount),
                        TotalDifference = 0.00M,
                        IsAddition = true
                    };

                    reclnObjectList.Add(reclnObject);

                    #region Get the additions and deductions of this particular employee (as the payroll items would have an effect on the reconciliation)

                    //Get Payroll Items (p Items that depend only on percentage of basic salary paid in the first period 
                    //Payroll Items other than 'Percentage of Basic salary' doesnt affect the reconciliation at all 
                    var _PERIOD_ONE_EMPLOYEE_PITEMS = _ALL_PERIOD_ONE_TRANS_PITEMS.Where(p => p.PrlTransactions.EmpId == emp & p.PrlItems.PItemApplicationType == Constants.PercentageApplicationType);
                    foreach (var f in _PERIOD_ONE_EMPLOYEE_PITEMS)
                    {
                        decimal periodtwoAmount = _payrollTransactionPItems.GetByPeriodEmpPItem(periodTwo, emp, f.PItemId).PItemAmount;

                        if (f.PrlItems.PItemIsAddition == true)
                        {
                            decimal ERPIDiff = 0;
                            var ERPIdifference = _ALL_ADD_ER_CHANGES.Where(p => p.PItemId == f.PrlItems.Id && p.EmpId == emp).FirstOrDefault();

                            if (ERPIdifference != null)
                            {
                                ERPIDiff = ERPIdifference.Difference;

                                if (_periodOneExchangeRate > _periodTwoExchangeRate)
                                    periodtwoAmount = periodtwoAmount + ERPIDiff;
                                else if (_periodOneExchangeRate < _periodTwoExchangeRate)
                                    periodtwoAmount = periodtwoAmount - ERPIDiff;
                            }
                            tempAdditionReclnObject = new clsReconcile
                            {
                                PayrollItem = f.PrlItems.PItemName,
                                PeriodOneId = periodOne,
                                PeriodTwoId = periodTwo,
                                PeriodOnePItemAmount = f.PItemAmount,
                                PeriodTwoPItemAmount = periodtwoAmount,
                                ReasonForDifference = "The  " + f.PrlItems.PItemName + " amount paid was less in the first period than in the second, due to late report to duty for (" + GetEmployeeFullName(emp) + ").",
                                AmountDueToReason = Math.Abs(f.PItemAmount - periodtwoAmount),
                                TotalDifference = 0.00M,
                                IsAddition = true
                            };

                            tempAdditionReclnObjectList.Add(tempAdditionReclnObject);
                        }
                        else
                        {
                            decimal ERPIDiff = 0;
                            var ERPIdifference = _ALL_DED_ER_CHANGES.Where(p => p.PItemId == f.PrlItems.Id && p.EmpId == emp).FirstOrDefault();

                            if (ERPIdifference != null)
                            {
                                ERPIDiff = ERPIdifference.Difference;

                                if (_periodOneExchangeRate > _periodTwoExchangeRate)
                                    periodtwoAmount = periodtwoAmount + ERPIDiff;
                                else if (_periodOneExchangeRate < _periodTwoExchangeRate)
                                    periodtwoAmount = periodtwoAmount - ERPIDiff;
                            }
                            if (f.PItemId != _IT_PITEM_ID) //Ignore if the difference is on income tax to avoid duplication. (the change in IT is recorded in another section )
                            {
                                tempDeductionReclnObject = new clsReconcile
                                {
                                    PayrollItem = f.PrlItems.PItemName,
                                    PeriodOneId = periodOne,
                                    PeriodTwoId = periodTwo,
                                    PeriodOnePItemAmount = f.PItemAmount,
                                    PeriodTwoPItemAmount = periodtwoAmount,
                                    ReasonForDifference = "The  " + f.PrlItems.PItemName + " amount paid was less in the first period than in the second, due to late report to duty for (" + GetEmployeeFullName(emp) + ").",
                                    AmountDueToReason = Math.Abs(f.PItemAmount - periodtwoAmount),
                                    TotalDifference = 0.00M,
                                    IsAddition = false
                                };

                                tempDeductionReclnObjectList.Add(tempDeductionReclnObject);
                            }
                        }
                    }
                    #endregion

                }

            }
            #endregion

            #region Get Differences on ADDITIONS
            foreach (var ADD_Changes in _ALL_ADD_CHANGES)
            {
                //Check if newly added employees have payroll generation before considering adding to reconciliation 
                bool isToBeSkipped = false;

                if (ADD_Changes.ReasonForChange == Constants.ReasonNewEmployeeAdded)
                {
                    var recordExists = _ALL_PERIOD_TWO_TRANS.Where(p => p.EmpId == ADD_Changes.EmpId);

                    if (recordExists.Any())
                        isToBeSkipped = false;
                    else
                        isToBeSkipped = true;

                }
                _AMOUNT_DIFFERENCE = 0;
                _AMOUNT_DIFFERENCE = ADD_Changes.Difference;

                if (ADD_Changes.PreviousAmount > ADD_Changes.ChangedAmount)
                    _AMOUNT_DIFFERENCE = _AMOUNT_DIFFERENCE * (-1);

                reclnObject = new clsReconcile
                {
                    PayrollItem = ADD_Changes.PrlItems.PItemName,
                    PeriodOneId = periodOne,
                    PeriodTwoId = periodTwo,
                    PeriodOnePItemAmount = ADD_Changes.PreviousAmount,
                    PeriodTwoPItemAmount = ADD_Changes.ChangedAmount,
                    ReasonForDifference = ADD_Changes.PrlItems.PItemName + " - " + ADD_Changes.ReasonForChange
                    + " (" + GetEmployeeFullName(ADD_Changes.EmpId) + ")",
                    AmountDueToReason = _AMOUNT_DIFFERENCE,
                    TotalDifference = 0.00M,
                    IsAddition = true
                };
                if (isToBeSkipped == false)
                    reclnObjectList.Add(reclnObject);

            }

            foreach (var g in tempAdditionReclnObjectList)
            {
                reclnObjectList.Add(g);
            }

            foreach (var p in _ALL_ADD_PERCENTAGE_PITEMS)
            {
                _AMOUNT_DIFFERENCE = 0;
                _AMOUNT_DIFFERENCE = _ALL_ADD_ER_CHANGES.Where(a => a.PItemId == p.Id).Sum(e => e.Difference);

                if (_periodOneExchangeRate > _periodTwoExchangeRate)
                    _AMOUNT_DIFFERENCE = _AMOUNT_DIFFERENCE * (-1);

                reclnObject = new clsReconcile
                {
                    PayrollItem = p.PItemName,
                    PeriodOneId = periodOne,
                    PeriodTwoId = periodTwo,
                    PeriodOnePItemAmount = 0,
                    PeriodTwoPItemAmount = 0,
                    ReasonForDifference = p.PItemName + " difference caused by exchange rate.",
                    AmountDueToReason = _AMOUNT_DIFFERENCE,
                    TotalDifference = 0.00M,
                    IsAddition = true
                };

                if (reclnObject.AmountDueToReason != 0)
                    reclnObjectList.Add(reclnObject);
            }
            #endregion

            #region Get Differences on DEDUCTIONS
            foreach (var DED_Changes in _ALL_DED_CHANGES)
            {
                //Check if newly added employees have payroll generation before considering adding to reconciliation 
                bool isToBeSkipped = false;

                if (DED_Changes.ReasonForChange == Constants.ReasonNewEmployeeAdded)
                {
                    var recordExists = _ALL_PERIOD_TWO_TRANS.Where(p => p.EmpId == DED_Changes.EmpId);

                    if (recordExists.Any())
                        isToBeSkipped = false;
                    else
                        isToBeSkipped = true;

                }

                _AMOUNT_DIFFERENCE = 0;
                _AMOUNT_DIFFERENCE = DED_Changes.Difference;

                if (DED_Changes.PreviousAmount > DED_Changes.ChangedAmount)
                    _AMOUNT_DIFFERENCE = _AMOUNT_DIFFERENCE * (-1);
                reclnObject = new clsReconcile
                {
                    PayrollItem = DED_Changes.PrlItems.PItemName,
                    PeriodOneId = periodOne,
                    PeriodTwoId = periodTwo,
                    PeriodOnePItemAmount = DED_Changes.PreviousAmount,
                    PeriodTwoPItemAmount = DED_Changes.ChangedAmount,
                    ReasonForDifference = DED_Changes.PrlItems.PItemName + " - " + DED_Changes.ReasonForChange + " (" + GetEmployeeFullName(DED_Changes.EmpId) + ")",
                    AmountDueToReason = _AMOUNT_DIFFERENCE,
                    TotalDifference = 0.00M,
                    IsAddition = false
                };

                if (isToBeSkipped == false)
                    reclnObjectList.Add(reclnObject);


            }

            //If the reclnObjectList is not null, track down the change in income tax by |PeriodOne.IncomeTax - PeriodTwo.IncomeTax| 
            //from the list _listOfEmpsOnBothPeriods

            foreach (var x in _listOfEmpsOnBothPeriods)
            {
                decimal _POneAmount = _ALL_PERIOD_ONE_TRANS.Where(e => e.EmpId == x).FirstOrDefault().Tax;
                decimal _PTwoAmount = _ALL_PERIOD_TWO_TRANS.Where(e => e.EmpId == x).FirstOrDefault().Tax;

                _AMOUNT_DIFFERENCE = 0;
                _AMOUNT_DIFFERENCE = _PTwoAmount - _POneAmount;

                reclnObject = new clsReconcile
                {
                    PayrollItem = "Income Tax",
                    PeriodOneId = periodOne,
                    PeriodTwoId = periodTwo,
                    PeriodOnePItemAmount = _POneAmount,
                    PeriodTwoPItemAmount = _PTwoAmount,
                    ReasonForDifference = "Income Tax difference (" + GetEmployeeFullName(x) + ")",
                    AmountDueToReason = _AMOUNT_DIFFERENCE,
                    TotalDifference = 0.00M,
                    IsAddition = false
                };
                if (reclnObject.AmountDueToReason != 0)
                    reclnObjectList.Add(reclnObject);
            }

            foreach (var y in _ALL_NEW_RECRUITMENT_CHANGES)
            {
                //Check if payroll is generated for the new employee before calculating the income tax difference 
                var _recordExists = _ALL_PERIOD_TWO_TRANS.Where(e => e.EmpId == y.EmpId);

                if (_recordExists.Any())
                {
                    reclnObject = new clsReconcile
                    {
                        PayrollItem = "Income Tax",
                        PeriodOneId = periodOne,
                        PeriodTwoId = periodTwo,
                        PeriodOnePItemAmount = 0,
                        PeriodTwoPItemAmount = _recordExists.FirstOrDefault().Tax,
                        ReasonForDifference = "Income Tax difference, for the new employee, (" + GetEmployeeFullName(y.EmpId) + ")",
                        AmountDueToReason = _recordExists.FirstOrDefault().Tax,
                        TotalDifference = 0.00M,
                        IsAddition = false
                    };
                    reclnObjectList.Add(reclnObject);
                }
            }

            foreach (var g in tempDeductionReclnObjectList)
            {
                reclnObjectList.Add(g);
            }

            foreach (var p in _ALL_DED_PERCENTAGE_PITEMS)
            {
                _AMOUNT_DIFFERENCE = 0;
                _AMOUNT_DIFFERENCE = _ALL_DED_ER_CHANGES.Where(a => a.PItemId == p.Id).Sum(e => e.Difference);

                if (_periodOneExchangeRate > _periodTwoExchangeRate)
                    _AMOUNT_DIFFERENCE = _AMOUNT_DIFFERENCE * (-1);

                reclnObject = new clsReconcile
                {
                    PayrollItem = p.PItemName,
                    PeriodOneId = periodOne,
                    PeriodTwoId = periodTwo,
                    PeriodOnePItemAmount = 0,
                    PeriodTwoPItemAmount = 0,
                    ReasonForDifference = p.PItemName + " difference caused by exchange rate.",
                    AmountDueToReason = _AMOUNT_DIFFERENCE,
                    TotalDifference = 0.00M,
                    IsAddition = false
                };

                if (reclnObject.AmountDueToReason != 0)
                    reclnObjectList.Add(reclnObject);
            }
            #endregion

            SaveResult(reclnObjectList, periodOne, periodTwo);
            return true;
        }

        public bool ReconcilePayrollTransactions(int periodOne, int periodTwo)
        {
            using (var transaction = new TransactionScope(TransactionScopeOption.Required,
                                  new System.TimeSpan(0, 15, 0)))
            {
                // _context.Connection.Open();
                _context.CommandTimeout = int.MaxValue;

                #region Declarations
                var _listOfEmpsOnBothPeriods = new List<int>();

                clsReconcile reclnObject;

                PrlEmployees _CURRENT_EMP_OBJ;

                var reclnObjectList = new List<clsReconcile>();

                string m_reason = "";

                var _P_ONE_OBJECT = _payrollPeriods.Get(periodOne);

                var _P_TWO_OBJECT = _payrollPeriods.Get(periodTwo);

                bool isExchangeRateDifference = false;

                var _BS_PITEM_ID = int.Parse(_payrollSettings.Get(Constants.BasicSalaryPItemId).SettingValue);
                //Get The payroll Item Id for Severance Pay  
                var _SP_PITEM_ID = int.Parse(_payrollSettings.Get(Constants.SeverancePayPItemId).SettingValue);

                var _IT_PITEM_ID = int.Parse(_payrollSettings.Get(Constants.IncomeTaxId).SettingValue);

                var _ALL_PERIOD_ONE_TRANS = _PayrollTransactions.FindAll(p => p.PeriodId == periodOne).ToList();
                var _ALL_PERIOD_TWO_TRANS = _PayrollTransactions.FindAll(p => p.PeriodId == periodTwo).ToList();

                var _ALL_PERIOD_ONE_OT_TRANS = _ALL_PERIOD_ONE_TRANS.Where(c => c.TotalOvertime != 0);
                var _ALL_PERIOD_TWO_OT_TRANS = _ALL_PERIOD_TWO_TRANS.Where(c => c.TotalOvertime != 0);

                decimal _AMOUNT_DIFFERENCE = 0;
                decimal _P_ONE_EXCHANGE_RATE = 0;
                decimal _P_TWO_EXCHANGE_RATE = 0;
                decimal _DEDUCTABLE_AMOUNT = 0;


                #endregion

                #region Compare and save Values On Basic Salary

                var prlTransactions1 = _PayrollTransactions.GetByPeriod(periodOne).FirstOrDefault();
                if (prlTransactions1 != null)
                {
                    _P_ONE_EXCHANGE_RATE = (decimal)prlTransactions1.ExchangeRate;
                }

                var prlTransactions2 = _PayrollTransactions.GetByPeriod(periodTwo).FirstOrDefault();
                if (prlTransactions2 != null)
                {
                    _P_TWO_EXCHANGE_RATE = (decimal)prlTransactions2.ExchangeRate;
                }

                var allEmployees = _employee.GetAll();

                var _ALL_EMPLOYEES = allEmployees as PrlEmployees[] ?? allEmployees.ToArray();

                PrlTransactionDifferences _DiffObject;
                var _iList = new List<PrlTransactionDifferences>();

                decimal m_POneAmount = 0;
                decimal m_PTwoAmount = 0;
                decimal m_Difference = 0;
                foreach (var employee in _ALL_EMPLOYEES)
                {
                    m_POneAmount = 0;
                    m_PTwoAmount = 0;
                    m_Difference = 0;

                    var filtOne = _PayrollTransactions.GetByPeriodAndEmp(periodOne, employee.Id);
                    var filtTwo = _PayrollTransactions.GetByPeriodAndEmp(periodTwo, employee.Id);

                    if (filtOne != null)
                        m_POneAmount = filtOne.BasicPay;

                    if (filtTwo != null)
                        m_PTwoAmount = filtTwo.BasicPay;

                    m_Difference = m_PTwoAmount - m_POneAmount;
                    _DiffObject = new PrlTransactionDifferences
                    {
                        EmpId = employee.Id,
                        EmpName = GetEmployeeFullName(employee.Id),
                        PeriodOneVal = m_POneAmount,
                        PeriodTwoVal = m_PTwoAmount,
                        Difference = m_Difference,
                        BaseCurrency = employee.SalaryGBP != 0 ? Constants.CurrencyGBP : Constants.CurrencyETB,
                        PeriodOneId = periodOne,
                        PeriodTwoId = periodTwo
                    };

                    if (m_POneAmount > 0 || m_PTwoAmount > 0)
                        _iList.Add(_DiffObject);


                }
                var _payTransCont = new PayrollTransactionsController();

                _payTransCont.SaveTransactionDiff(_iList, periodOne, periodTwo);

                #endregion

                #region Compare and save Values On PItems


                PrlTransactionDifferencesPItems _DiffObjectPItems;
                var _iListPItems = new List<PrlTransactionDifferencesPItems>();

                var _ALL_PITEMS =
                    _payrollItems.FindAll(p => p.IsDeleted == false & p.IsActive == true & p.Id != _SP_PITEM_ID);

                var vw_PayrollTrans = new List<vwPrlTransactionDetails>();
                using (var erpEntities = new ENTRO_MISEntities())
                {
                    var k = erpEntities.vwPrlTransactionDetails;
                    vw_PayrollTrans = erpEntities.vwPrlTransactionDetails.Where(p => p.PeriodId == periodOne || p.PeriodId == periodTwo & p.IsDeleted == false).ToList();

                }

                foreach (var emp in _ALL_EMPLOYEES)
                {


                    PrlEmployees employee = emp;
                    var x = vw_PayrollTrans.Where(p => p.EmpId == employee.Id);

                    foreach (var p in _ALL_PITEMS)
                    {
                        m_POneAmount = 0;
                        m_PTwoAmount = 0;

                        PrlItems p1 = p;
                        var filtOne = x.Where(e => e.PeriodId == periodOne & e.PItemId == p1.Id);//  _payrollTransactionPItems.GetByPeriodEmpPItem(periodOne, employee.Id, p.Id);
                        var filtTwo = x.Where(e => e.PeriodId == periodTwo & e.PItemId == p1.Id);//_payrollTransactionPItems.GetByPeriodEmpPItem(periodTwo, employee.Id, p.Id);

                        var one = filtOne as vwPrlTransactionDetails[] ?? filtOne.ToArray();
                        var two = filtTwo as vwPrlTransactionDetails[] ?? filtTwo.ToArray();
                        if (!one.Any() && !two.Any())
                            continue;

                        if (one.Any())
                            m_POneAmount = one.FirstOrDefault().PItemAmount;

                        if (two.Any())
                            m_PTwoAmount = two.FirstOrDefault().PItemAmount;

                        m_Difference = m_PTwoAmount - m_POneAmount;
                        _DiffObjectPItems = new PrlTransactionDifferencesPItems
                        {
                            EmpId = employee.Id,
                            PItemId = p.Id,
                            PeriodOneVal = m_POneAmount,
                            PeriodTwoVal = m_PTwoAmount,
                            Difference = m_Difference,
                            PeriodOneId = periodOne,
                            PeriodTwoId = periodTwo
                        };

                        if ((m_POneAmount >= 0 || m_PTwoAmount >= 0) && m_Difference != 0)
                            _iListPItems.Add(_DiffObjectPItems);
                    }

                }
                _payTransCont = new PayrollTransactionsController();

                _payTransCont.SaveTransactionDiffOnPItems(_iListPItems, periodOne, periodTwo);

                #endregion

                List<vwPrlTransactionDifferencesPItems> _ALL_P_ITEM_DIFF;
                using (var erpEntities = new ENTRO_MISEntities())
                {
                    _ALL_P_ITEM_DIFF = erpEntities.vwPrlTransactionDifferencesPItems.Where(p => p.PeriodOneId == periodOne & p.PeriodTwoId == periodTwo).ToList();

                }

                var _ALL_IT_DIFFERENCES = _ALL_P_ITEM_DIFF.Where(c => c.PItemId == _IT_PITEM_ID);

                var _ALL_ADD_DIFFERENCES = _ALL_P_ITEM_DIFF.Where(c => c.PItemIsAddition).OrderBy(c => c.PItemId);

                var _ALL_DED_DIFFERENCES = _ALL_P_ITEM_DIFF.Where(c => c.PItemId != _IT_PITEM_ID & c.PItemIsAddition == false).OrderBy(c => c.PItemId);

                var changesMadeOnPeriodTwo = _changesMade.FindAll(e => e.ChangePeriodId == periodTwo);

                // TODO: Check the changesMadeOnPeriodTwo is not null

                var _ALL_PERIOD_TWO_CHANGES = changesMadeOnPeriodTwo as PrlChangesMade[] ?? changesMadeOnPeriodTwo.ToArray();

                var _ALL_SALARY_CHANGES = _SalaryPositionChange.FindAll(e => e.EffectivePeriodId == periodTwo & e.IsSalaryChanged);

                #region Get list of employees with COMMON payroll generation FOR BOTH periods

                foreach (var k in _ALL_PERIOD_ONE_TRANS)
                {
                    var _IsEmpOnPeriodTwo = _ALL_PERIOD_TWO_TRANS.Where(e => e.EmpId == k.EmpId);

                    if (_IsEmpOnPeriodTwo.Any())
                        _listOfEmpsOnBothPeriods.Add(k.EmpId);
                }
                #endregion

                var _ALL_BS_ER_CHANGES = _ALL_PERIOD_TWO_CHANGES.Where(e => e.PItemId == _BS_PITEM_ID && e.ReasonForChange == Constants.ReasonExchangeRate && _listOfEmpsOnBothPeriods.Contains(e.EmpId));

                #region Get Differences on BASIC SALARY

                var _BS_DIFFERENCES =
                    _transDifferences.FindAll(e => e.PeriodOneId == periodOne && e.PeriodTwoId == periodTwo & e.Difference != 0);

                decimal _TOTAL_BS_Diff = 0;
                foreach (var diffObj in _BS_DIFFERENCES)
                {
                    PrlTransactionDifferences d = diffObj;


                    m_reason = "";
                    if (d.EmpId == 551)
                    {

                    }
                    isExchangeRateDifference = true;

                    #region New Employee Added

                    // Check If Emp Trans is available in the first period 
                    var isEmpNew =
                        _changesMade.FindAll(e => e.ChangePeriodId == periodTwo & e.ReasonForChange == Constants.ReasonNewEmployeeAdded & e.EmpId == d.EmpId);

                    bool _IsEmpNew = false;

                    if (d.PrlEmployees.EmploymentDate >= _P_ONE_OBJECT.EndDate &&
                        d.PrlEmployees.EmploymentDate <= _P_TWO_OBJECT.EndDate)
                    {
                        _IsEmpNew = true;
                    }
                    if (_IsEmpNew)
                    {
                        m_reason = Constants.ReasonNewEmployeeAdded + " (" + GetEmployeeFullName(d.EmpId) + ")";


                        reclnObject = new clsReconcile
                        {
                            PayrollItem = "Basic Salary",
                            PeriodOneId = periodOne,
                            PeriodTwoId = periodTwo,
                            PeriodOnePItemAmount = d.PeriodOneVal,
                            PeriodTwoPItemAmount = d.PeriodTwoVal,
                            ReasonForDifference = m_reason,
                            AmountDueToReason = d.Difference,
                            TotalDifference = 0.00M,
                            IsAddition = true
                        };


                        reclnObjectList.Add(reclnObject);

                        continue;
                    }

                    #endregion

                    #region Check Employment Date

                    if (d.PrlEmployees.EmploymentDate > _P_ONE_OBJECT.StartDate && d.PrlEmployees.EmploymentDate <= _P_TWO_OBJECT.StartDate)
                    {
                        //m_reason = "Change in Basic salary for ( " + GetEmployeeFullName(d.EmpId) +
                        //           "), as a result of late report to duty on the first period."

                        m_reason = m_reason + " late report to duty deduction on the first period,";

                    }

                    #endregion

                    #region Check Attendance

                    var attendanceExistsPOne =
                        _attendanceDetail.FindAll(e => e.EmpId == d.EmpId & e.PeriodId == periodOne);

                    var attendanceExistsPTwo =
                        _attendanceDetail.FindAll(e => e.EmpId == d.EmpId & e.PeriodId == periodTwo);

                    if (attendanceExistsPOne.Any())
                        m_reason = m_reason + " absentieesm deduction on the first period,";
                    if (attendanceExistsPTwo.Any())
                        m_reason = m_reason + " absentieesm deduction on the second period,";


                    #endregion



                    #region Check Termination

                    var isEmployeeTerminated =
                        _empTermination.FindAll(
                                e =>
                                    e.EmpId == d.EmpId && e.TerminationDate >=
                                        _P_ONE_OBJECT.StartDate && e.TerminationDate <= _P_TWO_OBJECT.EndDate);

                    if (isEmployeeTerminated.Any())
                        m_reason = m_reason + " employee has been terminated,";

                    #endregion

                    #region Skipped Employees
                    //TO:DO
                    #endregion

                    #region Inactive Employees

                    if (d.PeriodTwoVal == 0)
                    {
                        var s =
                            _changesMade.FindAll(p => p.EmpId == d.EmpId & p.ReasonForChange == Constants.ReasonInactiveEmployee & p.ChangePeriodId == periodTwo);

                        if (s.Any())
                            m_reason = m_reason + " employee was made inactive on the second period,";
                    }

                    #endregion

                    #region Active Employees


                    if (d.PeriodOneVal == 0 && d.PeriodTwoVal > 0)
                    {
                        var s =
                            _changesMade.FindAll(p => p.EmpId == d.EmpId & p.ReasonForChange == Constants.ReasonActiveEmployee & p.ChangePeriodId == periodOne);

                        if (s.Any())
                            m_reason = m_reason + " employee was made active on the second period,";
                    }


                    #endregion

                    #region Check Salary Change

                    var salaryChangeExists =
                        _ALL_SALARY_CHANGES.Where(
                            c =>
                                c.EmpId == d.EmpId & c.EffectiveDate >= _P_TWO_OBJECT.StartDate &&
                                c.EffectiveDate <= _P_TWO_OBJECT.EndDate);

                    if (salaryChangeExists.Any())
                        m_reason = m_reason + " as a result of salary change/position change on the second period,";
                    #endregion

                    #region Check Exchange Rate Difference

                    if (m_reason == "" && d.BaseCurrency == "GBP")
                        isExchangeRateDifference = true;
                    else
                        isExchangeRateDifference = false;

                    #endregion

                    #region Check If to deduct the current employee's Exchange Rate Change from the Toatal Exchange Rate Difference

                    if (m_reason != "" && d.BaseCurrency == "GBP")
                    {
                        //The Change in exchangeRate Difference for this Particular Employee should not be addedd
                        //To the total Exchange rate Difference (_BS_ER_DIFFERENCE)
                        if (_ALL_BS_ER_CHANGES.Any())
                        {
                            var x = _ALL_BS_ER_CHANGES.Where(a => a.EmpId == d.EmpId && a.PItemId == _BS_PITEM_ID);

                            decimal k = 0;
                            if (x.Any())
                                k = x.FirstOrDefault().Difference;
                            //_ALL_BS_ER_CHANGES.FirstOrDefault(a => a.EmpId == d.EmpId && a.PItemId == _BS_PITEM_ID)
                            //    .Difference;
                            //var x =
                            //    _ALL_BS_ER_CHANGES.FirstOrDefault(a => a.EmpId == d.EmpId && a.PItemId == _BS_PITEM_ID)
                            //        .Difference;

                            _DEDUCTABLE_AMOUNT = _DEDUCTABLE_AMOUNT + k;
                        }


                    }
                    #endregion

                    if (m_reason == "")
                        m_reason = "Change in Basic Salary for  (" + GetEmployeeFullName(d.EmpId) + ") for - unknown reason";
                    else
                        m_reason = " Change in Basic salary for (" + GetEmployeeFullName(d.EmpId) + ") " + m_reason;

                    if (!isExchangeRateDifference)
                    {
                        //Collect and add all changes except Exchange rate differences 
                        //_TOTAL_BS_Diff = _TOTAL_BS_Diff + d.Difference;
                        reclnObject = new clsReconcile
                        {
                            PayrollItem = "Basic Salary",
                            PeriodOneId = periodOne,
                            PeriodTwoId = periodTwo,
                            PeriodOnePItemAmount = d.PeriodOneVal,
                            PeriodTwoPItemAmount = d.PeriodTwoVal,
                            ReasonForDifference = m_reason,
                            AmountDueToReason = d.Difference,
                            TotalDifference = 0.00M,
                            IsAddition = true
                        };


                        reclnObjectList.Add(reclnObject);
                    }

                }

                decimal _BS_ER_DIFFERENCE = 0;
                #region Get the difference caused by exchange rate

                var sum_BS_PeriodOne = _ALL_PERIOD_ONE_TRANS.Sum(o => o.BasicPay);
                var sum_BS_PeriodTwo = _ALL_PERIOD_TWO_TRANS.Sum(o => o.BasicPay);
                var diff_OF_BS = sum_BS_PeriodTwo - sum_BS_PeriodOne;
                _TOTAL_BS_Diff = reclnObjectList.Sum(c => c.AmountDueToReason);
                _BS_ER_DIFFERENCE = diff_OF_BS - _TOTAL_BS_Diff;

                //if (_P_ONE_EXCHANGE_RATE > _P_TWO_EXCHANGE_RATE && _BS_ER_DIFFERENCE > 0)
                //    _BS_ER_DIFFERENCE = _BS_ER_DIFFERENCE * (-1);

                reclnObject = new clsReconcile
                {
                    PayrollItem = "Basic Salary",//_ALL_BS_ER_CHANGES.FirstOrDefault().PrlItems.PItemName,
                    PeriodOneId = periodOne,
                    PeriodTwoId = periodTwo,
                    PeriodOnePItemAmount = 0,
                    PeriodTwoPItemAmount = 0,
                    ReasonForDifference = "Basic Salary difference caused by exchange rate.",
                    AmountDueToReason = _BS_ER_DIFFERENCE,
                    TotalDifference = 0.00M,
                    IsAddition = true
                };

                //_BS_ER_DIFFERENCE = _AMOUNT_DIFFERENCE;
                reclnObjectList.Add(reclnObject);

                //Get the difference in basic salary caused by exchange rate difference 
                //if (_ALL_BS_ER_CHANGES.Any())
                //{
                //    _AMOUNT_DIFFERENCE = _ALL_BS_ER_CHANGES.Sum(e => e.Difference);

                //    //_DEDUCTABLE_AMOUNT is an amount that is traced from the changes made table as an Exchange rate Difference 
                //    //But that echange rate difference is already included as another reason, so it should be subtracted 
                //    //from the total sum of ER 
                //    _AMOUNT_DIFFERENCE = _AMOUNT_DIFFERENCE - _DEDUCTABLE_AMOUNT;

                //    if (_P_ONE_EXCHANGE_RATE > _P_TWO_EXCHANGE_RATE)
                //        _AMOUNT_DIFFERENCE = _AMOUNT_DIFFERENCE * (-1);

                //    reclnObject = new clsReconcile
                //    {
                //        PayrollItem = _ALL_BS_ER_CHANGES.FirstOrDefault().PrlItems.PItemName,
                //        PeriodOneId = periodOne,
                //        PeriodTwoId = periodTwo,
                //        PeriodOnePItemAmount = 0,
                //        PeriodTwoPItemAmount = 0,
                //        ReasonForDifference = "Basic Salary difference caused by exchange rate.",
                //        AmountDueToReason = _AMOUNT_DIFFERENCE,
                //        TotalDifference = 0.00M,
                //        IsAddition = true
                //    };

                //    _BS_ER_DIFFERENCE = _AMOUNT_DIFFERENCE;
                //    reclnObjectList.Add(reclnObject);
                //}

                #endregion

                #endregion

                #region Get Differences on ADDITIONS


                foreach (var addDiffObj in _ALL_ADD_DIFFERENCES)
                {
                    //if (addDiffObj.EmpId == 344 && addDiffObj.PItemId == 64)
                    //{

                    //}
                    _CURRENT_EMP_OBJ = new PrlEmployees();

                    vwPrlTransactionDifferencesPItems k = addDiffObj;

                    _CURRENT_EMP_OBJ = _ALL_EMPLOYEES.FirstOrDefault(c => c.Id == k.EmpId);

                    m_reason = "";
                    isExchangeRateDifference = true;

                    #region Payroll Item attached

                    // Check If Emp Trans is available in the first period 
                    var isEmpNew =
                        _changesMade.FindAll(e => e.ChangePeriodId == periodTwo & e.ReasonForChange == Constants.ReasonPayrollItemAttached & e.EmpId == k.EmpId & e.PItemId == k.PItemId);

                    if (isEmpNew.Any())
                    {
                        m_reason = Constants.ReasonPayrollItemAttached + " (" + k.EmployeeName + ")";


                        reclnObject = new clsReconcile
                        {
                            PayrollItem = k.PItemName,
                            PeriodOneId = periodOne,
                            PeriodTwoId = periodTwo,
                            PeriodOnePItemAmount = k.PeriodOneVal,
                            PeriodTwoPItemAmount = k.PeriodTwoVal,
                            ReasonForDifference = m_reason,
                            AmountDueToReason = k.Difference,
                            TotalDifference = 0.00M,
                            IsAddition = true
                        };


                        reclnObjectList.Add(reclnObject);

                        continue;
                    }

                    #endregion

                    #region Payroll Item removed

                    // Check If Emp Trans is available in the first period 
                    var isPItemDeleted =
                        _changesMade.FindAll(e => e.ChangePeriodId == periodTwo & e.ReasonForChange == Constants.ReasonPayrollItemAttachmentDeleted & e.EmpId == k.EmpId & e.PItemId == k.PItemId);

                    if (isPItemDeleted.Any())
                    {
                        m_reason = Constants.ReasonPayrollItemAttachmentDeleted + " (" + k.EmployeeName + ")";

                        reclnObject = new clsReconcile
                        {
                            PayrollItem = k.PItemName,
                            PeriodOneId = periodOne,
                            PeriodTwoId = periodTwo,
                            PeriodOnePItemAmount = k.PeriodOneVal,
                            PeriodTwoPItemAmount = k.PeriodTwoVal,
                            ReasonForDifference = m_reason,
                            AmountDueToReason = k.Difference,
                            TotalDifference = 0.00M,
                            IsAddition = true
                        };


                        reclnObjectList.Add(reclnObject);

                        continue;
                    }

                    #endregion

                    #region Payroll Item Changed

                    // Check If Emp Trans is available in the first period 
                    var isPItemChanged =
                        _changesMade.FindAll(e => e.ChangePeriodId == periodTwo & e.ReasonForChange == Constants.ReasonPayrollItemsChanged & e.EmpId == k.EmpId & e.PItemId == k.PItemId);

                    if (isPItemChanged.Any())
                    {
                        m_reason = Constants.ReasonPayrollItemsChanged + " (" + k.EmployeeName + ")";

                        reclnObject = new clsReconcile
                        {
                            PayrollItem = k.PItemName,
                            PeriodOneId = periodOne,
                            PeriodTwoId = periodTwo,
                            PeriodOnePItemAmount = k.PeriodOneVal,
                            PeriodTwoPItemAmount = k.PeriodTwoVal,
                            ReasonForDifference = m_reason,
                            AmountDueToReason = k.Difference,
                            TotalDifference = 0.00M,
                            IsAddition = true
                        };


                        reclnObjectList.Add(reclnObject);

                        continue;
                    }

                    #endregion

                    #region New Employee Added

                    // Check If Emp Trans is available in the first period 
                    var isEmpNew2 =
                        _changesMade.FindAll(e => e.ChangePeriodId == periodTwo & e.ReasonForChange == Constants.ReasonNewEmployeeAdded & e.EmpId == k.EmpId);

                    if (isEmpNew2.Any() && k.PItemApplicationType == Constants.PercentageApplicationType)
                    {
                        m_reason = Constants.ReasonNewEmployeeAdded + " (" + k.EmployeeName + ")";


                        reclnObject = new clsReconcile
                        {
                            PayrollItem = k.PItemName,
                            PeriodOneId = periodOne,
                            PeriodTwoId = periodTwo,
                            PeriodOnePItemAmount = k.PeriodOneVal,
                            PeriodTwoPItemAmount = k.PeriodTwoVal,
                            ReasonForDifference = m_reason,
                            AmountDueToReason = k.Difference,
                            TotalDifference = 0.00M,
                            IsAddition = true
                        };


                        reclnObjectList.Add(reclnObject);

                        continue;
                    }

                    #endregion

                    #region Check Employment Date

                    if (_CURRENT_EMP_OBJ.EmploymentDate > _P_ONE_OBJECT.StartDate && _CURRENT_EMP_OBJ.EmploymentDate <= _P_TWO_OBJECT.StartDate)
                    {
                        //m_reason = "Change in Basic salary for ( " + GetEmployeeFullName(d.EmpId) +
                        //           "), as a result of late report to duty on the first period."

                        if (k.PItemApplicationType == Constants.PercentageApplicationType)
                            m_reason = m_reason + " late report to duty deduction on the first period,";

                    }

                    #endregion

                    #region Check Attendance

                    var attendanceExistsPOne =
                        _attendanceDetail.FindAll(e => e.EmpId == k.EmpId & e.PeriodId == periodOne);

                    var attendanceExistsPTwo =
                        _attendanceDetail.FindAll(e => e.EmpId == k.EmpId & e.PeriodId == periodTwo);

                    if (k.PItemApplicationType == Constants.PercentageApplicationType)
                    {
                        if (attendanceExistsPOne.Any())
                            m_reason = m_reason + " absentieesm deduction on the first period,";
                        if (attendanceExistsPTwo.Any())
                            m_reason = m_reason + " absentieesm deduction on the second period,";

                    }

                    #endregion

                    #region Check Termination

                    var isEmployeeTerminated =
                        _empTermination.FindAll(
                                e =>
                                    e.EmpId == k.EmpId && e.TerminationDate >=
                                        _P_ONE_OBJECT.StartDate && e.TerminationDate <= _P_TWO_OBJECT.EndDate);

                    if (isEmployeeTerminated.Any())
                        m_reason = m_reason + " employee has been terminated,";

                    #endregion

                    #region Skipped Employees
                    //TODO : check
                    #endregion

                    #region Inactive Employees

                    if (k.PeriodTwoVal == 0)
                    {
                        var s =
                            _changesMade.FindAll(p => p.EmpId == k.EmpId & p.ReasonForChange == Constants.ReasonInactiveEmployee & p.ChangePeriodId == periodTwo);

                        if (s.Any())
                            m_reason = m_reason + " employee was made inactive on the second period,";
                    }

                    #endregion

                    #region Active Employees


                    if (k.PeriodOneVal == 0 && k.PeriodTwoVal > 0)
                    {
                        var s =
                            _changesMade.FindAll(p => p.EmpId == k.EmpId & p.ReasonForChange == Constants.ReasonActiveEmployee & p.ChangePeriodId == periodOne);

                        if (s.Any())
                            m_reason = m_reason + " employee was made active on the second period,";
                    }


                    #endregion

                    #region Check Salary Change
                    var salaryChangeExists =
                        _ALL_SALARY_CHANGES.Where(
                            c =>
                                c.EmpId == k.EmpId & c.EffectiveDate >= _P_TWO_OBJECT.StartDate &&
                                c.EffectiveDate <= _P_TWO_OBJECT.EndDate);

                    if (salaryChangeExists.Any())
                        m_reason = m_reason + " as a result of salary change/position change on the second period,";
                    #endregion

                    #region Check Exchange Rate Difference

                    if (m_reason == "" && _CURRENT_EMP_OBJ.SalaryGBP != 0 && k.PItemApplicationType == Constants.PercentageApplicationType)
                        isExchangeRateDifference = true;
                    else
                        isExchangeRateDifference = false;

                    #endregion

                    #region Check if there was a change associated with the payroll item

                    //var changeExists = _changesMade.FindAll().FirstOrDefault(p => p.ChangePeriodId == periodTwo & p.PItemId == k.PItemId);

                    //if (changeExists != null)
                    //    m_reason = m_reason + changeExists.ReasonForChange + ",";
                    #endregion

                    if (m_reason == "")
                        m_reason = "Difference in " + k.PItemName + " for  (" + k.EmployeeName + ") for - unknown reason";
                    else
                        m_reason = "Change in " + k.PItemName + " for (" + k.EmployeeName + ") " + m_reason;

                    if (!isExchangeRateDifference)
                    {
                        reclnObject = new clsReconcile
                        {
                            PayrollItem = k.PItemName,
                            PeriodOneId = periodOne,
                            PeriodTwoId = periodTwo,
                            PeriodOnePItemAmount = k.PeriodOneVal,
                            PeriodTwoPItemAmount = k.PeriodTwoVal,
                            ReasonForDifference = m_reason,
                            AmountDueToReason = k.Difference,
                            TotalDifference = 0.00M,
                            IsAddition = true
                        };


                        reclnObjectList.Add(reclnObject);
                    }

                }

                #region Get the difference caused by exchange rate for each payroll item

                //var _All_PERCENTAGE_PITEMS =
                //    _payrollItems.FindAll()
                //        .Where(
                //            d =>
                //                d.IsActive == true & d.IsDeleted == false &
                //                d.PItemApplicationType == Constants.PercentageApplicationType);
                //foreach (var item in _All_PERCENTAGE_PITEMS)
                //{
                //    if (!item.PItemIsAddition)
                //        continue;

                //    var hasPItemTrans =
                //        _changesMade.FindAll().Where(c => c.ChangePeriodId == periodTwo & c.PItemId == item.Id);

                //    if (!hasPItemTrans.Any())
                //        continue;

                //    if (item.Id == _SP_PITEM_ID)
                //        continue;

                //    m_reason = item.PItemName + " difference caused by exchange rate.";

                //    decimal _amnt = _BS_ER_DIFFERENCE * item.PItemAmount / 100;

                //    /////////////////////////////////////////////////////////////////

                //    /// /////////////////////////////////////////////////////////////

                //    if (item.Id == 54)
                //    {
                //        decimal dedAmount1 = 0;
                //        decimal dedAmount2 = 0;
                //        decimal salary1 = 0;
                //        //Deduct For Hailu Woldes Pension (Id = 415)
                //        var e = _employee.Get(415);

                //        if (e != null)
                //        {
                //            salary1 = e.SalaryETB;
                //            dedAmount1 = salary1 * item.PItemAmount / 100;

                //            _amnt = _amnt + dedAmount1;
                //        }

                //        //Deduct For Legese Yihdegos Pension (Id = 44)
                //        var e2 = _employee.Get(44);

                //        if (e2 != null)
                //        {
                //            var salary2 = (decimal)e2.SalaryGBP * _P_TWO_EXCHANGE_RATE;
                //            dedAmount2 = salary2 * item.PItemAmount / 100;

                //            _amnt = _amnt + dedAmount2;
                //        }

                //    }
                //    //Get the list of employees who are not entitled for this payroll item
                //    // var k = _ALL_EMPLOYEES.Where(c => !_empPItems.FindAll().Select(b => b.EmpId).Contains(c.Id));
                //    reclnObject = new clsReconcile
                //    {
                //        PayrollItem = item.PItemName,
                //        PeriodOneId = periodOne,
                //        PeriodTwoId = periodTwo,
                //        PeriodOnePItemAmount = 0,
                //        PeriodTwoPItemAmount = 0,
                //        ReasonForDifference = m_reason,
                //        AmountDueToReason = _amnt,
                //        TotalDifference = 0.00M,
                //        IsAddition = true
                //    };
                //    reclnObjectList.Add(reclnObject);

                //}



                #endregion

                #region Get Differences on Overtime Payment 

                decimal m_OTDifference = 0;
                decimal m_OT_POneAmount = 0;
                decimal m_OT_PTwoAmount = 0;

                foreach (var e in _ALL_EMPLOYEES)
                {
                    string empName = GetEmployeeFullName(e.Id);
                    m_OT_POneAmount = 0;
                    m_OT_PTwoAmount = 0;
                    m_OTDifference = 0;

                    var filtOne = _PayrollTransactions.GetByPeriodAndEmp(periodOne, e.Id);
                    var filtTwo = _PayrollTransactions.GetByPeriodAndEmp(periodTwo, e.Id);

                    if (filtOne != null)
                        m_OT_POneAmount = filtOne.TotalOvertime;

                    if (filtTwo != null)
                        m_OT_PTwoAmount = filtTwo.TotalOvertime;

                    m_OTDifference = Math.Abs(m_OT_POneAmount - m_OT_PTwoAmount);

                    if (m_OTDifference != 0)
                    {
                        reclnObject = new clsReconcile
                        {
                            PayrollItem = "Overtime",
                            PeriodOneId = periodOne,
                            PeriodTwoId = periodTwo,
                            PeriodOnePItemAmount = m_OT_POneAmount,
                            PeriodTwoPItemAmount = m_OT_PTwoAmount,
                            ReasonForDifference = "Difference in Overtime Payment for " + empName,
                            AmountDueToReason = m_OTDifference,
                            TotalDifference = 0.00M,
                            IsAddition = true
                        };


                        reclnObjectList.Add(reclnObject);
                    }
                }

                #endregion

                #endregion

                #region Get Differences on DEDUCTIONS

                foreach (var dedDiffObj in _ALL_DED_DIFFERENCES)
                {
                    //if (addDiffObj.EmpId == 344 && addDiffObj.PItemId == 64)
                    //{

                    //}
                    _CURRENT_EMP_OBJ = new PrlEmployees();

                    vwPrlTransactionDifferencesPItems k = dedDiffObj;

                    _CURRENT_EMP_OBJ = _ALL_EMPLOYEES.FirstOrDefault(c => c.Id == k.EmpId);

                    m_reason = "";


                    #region Payroll Item attached

                    // Check If Emp Trans is available in the first period 
                    var isEmpNew =
                        _changesMade.FindAll(e => e.ChangePeriodId == periodTwo & e.ReasonForChange == Constants.ReasonPayrollItemAttached & e.EmpId == k.EmpId & e.PItemId == k.PItemId);

                    if (isEmpNew.Any())
                    {
                        m_reason = Constants.ReasonPayrollItemAttached + " (" + k.EmployeeName + ")";


                        reclnObject = new clsReconcile
                        {
                            PayrollItem = k.PItemName,
                            PeriodOneId = periodOne,
                            PeriodTwoId = periodTwo,
                            PeriodOnePItemAmount = k.PeriodOneVal,
                            PeriodTwoPItemAmount = k.PeriodTwoVal,
                            ReasonForDifference = m_reason,
                            AmountDueToReason = k.Difference,
                            TotalDifference = 0.00M,
                            IsAddition = false
                        };


                        reclnObjectList.Add(reclnObject);

                        continue;
                    }

                    #endregion

                    #region Payroll Item removed

                    // Check If Emp Trans is available in the first period 
                    var isPItemDeleted =
                        _changesMade.FindAll(e => e.ChangePeriodId == periodTwo & e.ReasonForChange == Constants.ReasonPayrollItemAttachmentDeleted & e.EmpId == k.EmpId & e.PItemId == k.PItemId);

                    if (isPItemDeleted.Any())
                    {
                        m_reason = Constants.ReasonPayrollItemAttachmentDeleted + " (" + k.EmployeeName + ")";

                        reclnObject = new clsReconcile
                        {
                            PayrollItem = k.PItemName,
                            PeriodOneId = periodOne,
                            PeriodTwoId = periodTwo,
                            PeriodOnePItemAmount = k.PeriodOneVal,
                            PeriodTwoPItemAmount = k.PeriodTwoVal,
                            ReasonForDifference = m_reason,
                            AmountDueToReason = k.Difference,
                            TotalDifference = 0.00M,
                            IsAddition = false
                        };


                        reclnObjectList.Add(reclnObject);

                        continue;
                    }

                    #endregion

                    #region Payroll Item Changed

                    // Check If Emp Trans is available in the first period 
                    var isPItemChanged =
                        _changesMade.FindAll(e => e.ChangePeriodId == periodTwo & e.ReasonForChange == Constants.ReasonPayrollItemsChanged & e.EmpId == k.EmpId & e.PItemId == k.PItemId);

                    if (isPItemChanged.Any())
                    {
                        m_reason = Constants.ReasonPayrollItemsChanged + " (" + k.EmployeeName + ")";

                        reclnObject = new clsReconcile
                        {
                            PayrollItem = k.PItemName,
                            PeriodOneId = periodOne,
                            PeriodTwoId = periodTwo,
                            PeriodOnePItemAmount = k.PeriodOneVal,
                            PeriodTwoPItemAmount = k.PeriodTwoVal,
                            ReasonForDifference = m_reason,
                            AmountDueToReason = k.Difference,
                            TotalDifference = 0.00M,
                            IsAddition = false
                        };


                        reclnObjectList.Add(reclnObject);

                        continue;
                    }

                    #endregion

                    #region New Employee Added

                    // Check If Emp Trans is available in the first period 
                    var isEmpNew2 =
                        _changesMade.FindAll(e => e.ChangePeriodId == periodTwo & e.ReasonForChange == Constants.ReasonNewEmployeeAdded & e.EmpId == k.EmpId);

                    if (isEmpNew2.Any() && k.PItemApplicationType == Constants.PercentageApplicationType)
                    {
                        m_reason = Constants.ReasonNewEmployeeAdded + " (" + k.EmployeeName + ")";


                        reclnObject = new clsReconcile
                        {
                            PayrollItem = k.PItemName,
                            PeriodOneId = periodOne,
                            PeriodTwoId = periodTwo,
                            PeriodOnePItemAmount = k.PeriodOneVal,
                            PeriodTwoPItemAmount = k.PeriodTwoVal,
                            ReasonForDifference = m_reason,
                            AmountDueToReason = k.Difference,
                            TotalDifference = 0.00M,
                            IsAddition = false

                        };


                        reclnObjectList.Add(reclnObject);

                        continue;
                    }

                    #endregion

                    #region Check Employment Date

                    if (_CURRENT_EMP_OBJ.EmploymentDate > _P_ONE_OBJECT.StartDate && _CURRENT_EMP_OBJ.EmploymentDate <= _P_TWO_OBJECT.StartDate)
                    {
                        //m_reason = "Change in Basic salary for ( " + GetEmployeeFullName(d.EmpId) +
                        //           "), as a result of late report to duty on the first period."

                        if (k.PItemApplicationType == Constants.PercentageApplicationType)
                            m_reason = m_reason + " late report to duty deduction on the first period,";

                    }

                    #endregion

                    #region Check Attendance

                    var attendanceExistsPOne =
                        _attendanceDetail.FindAll(e => e.EmpId == k.EmpId & e.PeriodId == periodOne);

                    var attendanceExistsPTwo =
                        _attendanceDetail.FindAll(e => e.EmpId == k.EmpId & e.PeriodId == periodTwo);

                    if (k.PItemApplicationType == Constants.PercentageApplicationType)
                    {
                        if (attendanceExistsPOne.Any())
                            m_reason = m_reason + " absentieesm deduction on the first period,";
                        if (attendanceExistsPTwo.Any())
                            m_reason = m_reason + " absentieesm deduction on the second period,";

                    }

                    #endregion


                    #region Check Termination

                    var isEmployeeTerminated =
                        _empTermination.FindAll(
                                e =>
                                    e.EmpId == k.EmpId && e.TerminationDate >=
                                        _P_ONE_OBJECT.StartDate && e.TerminationDate <= _P_TWO_OBJECT.EndDate);

                    if (isEmployeeTerminated.Any())
                        m_reason = m_reason + " employee has been terminated,";

                    #endregion

                    #region Skipped Employees
                    //TODO : check
                    #endregion

                    #region Inactive Employees

                    if (k.PeriodTwoVal == 0)
                    {
                        var s =
                            _changesMade.FindAll(p => p.EmpId == k.EmpId & p.ReasonForChange == Constants.ReasonInactiveEmployee & p.ChangePeriodId == periodTwo);

                        if (s.Any())
                            m_reason = m_reason + " employee was made inactive on the second period,";
                    }

                    #endregion

                    #region Active Employees


                    if (k.PeriodOneVal == 0 && k.PeriodTwoVal > 0)
                    {
                        var s =
                            _changesMade.FindAll(p => p.EmpId == k.EmpId & p.ReasonForChange == Constants.ReasonActiveEmployee & p.ChangePeriodId == periodOne);

                        if (s.Any())
                            m_reason = m_reason + " employee was made active on the second period,";
                    }


                    #endregion

                    #region Check Salary Change
                    var salaryChangeExists =
                        _ALL_SALARY_CHANGES.Where(
                            c =>
                                c.EmpId == k.EmpId & c.EffectiveDate >= _P_TWO_OBJECT.StartDate &&
                                c.EffectiveDate <= _P_TWO_OBJECT.EndDate);

                    if (salaryChangeExists.Any())
                        m_reason = m_reason + " as a result of salary change/position change on the second period,";
                    #endregion

                    #region Check Exchange Rate Difference

                    if (m_reason == "" && _CURRENT_EMP_OBJ.SalaryGBP != 0 && k.PItemApplicationType == Constants.PercentageApplicationType)
                        isExchangeRateDifference = true;
                    else
                        isExchangeRateDifference = false;

                    #endregion

                    #region Check if there was a change associated with the payroll item

                    //var changeExists = _changesMade.FindAll().FirstOrDefault(p => p.ChangePeriodId == periodTwo & p.PItemId == k.PItemId);

                    //if (changeExists != null)
                    //    m_reason = m_reason + changeExists.ReasonForChange + ",";
                    #endregion

                    if (m_reason == "")
                        m_reason = "Difference in " + k.PItemName + " for  (" + k.EmployeeName + ") for - unknown reason";
                    else
                        m_reason = "Change in " + k.PItemName + " for (" + k.EmployeeName + ") " + m_reason;

                    if (!isExchangeRateDifference)
                    {
                        reclnObject = new clsReconcile
                        {
                            PayrollItem = k.PItemName,
                            PeriodOneId = periodOne,
                            PeriodTwoId = periodTwo,
                            PeriodOnePItemAmount = k.PeriodOneVal,
                            PeriodTwoPItemAmount = k.PeriodTwoVal,
                            ReasonForDifference = m_reason,
                            AmountDueToReason = k.Difference,
                            TotalDifference = 0.00M,
                            IsAddition = false
                        };


                        reclnObjectList.Add(reclnObject);
                    }

                }

                #region Get the difference caused by exchange rate for each payroll item


                //foreach (var item in _All_PERCENTAGE_PITEMS)
                //{
                //    if (item.PItemIsAddition)
                //        continue;

                //    PrlItems item1 = item;
                //    var hasPItemTrans =
                //        _changesMade.FindAll().Where(c => c.ChangePeriodId == periodTwo & c.PItemId == item1.Id);

                //    if (!hasPItemTrans.Any())
                //        continue;

                //    if (item.Id == _IT_PITEM_ID)
                //        continue;

                //    m_reason = item.PItemName + " difference caused by exchange rate.";

                //    decimal _amnt = _BS_ER_DIFFERENCE * item1.PItemAmount / 100;

                //    if (item.Id == 53)
                //    {
                //        decimal dedAmount1 = 0;
                //        decimal dedAmount2 = 0;
                //        decimal salary1 = 0;
                //        //Deduct For Hailu Woldes Pension (Id = 415)
                //        var e = _employee.Get(415);

                //        if (e != null)
                //        {
                //            salary1 = e.SalaryETB;
                //            dedAmount1 = salary1 * item.PItemAmount / 100;

                //            _amnt = _amnt + dedAmount1;
                //        }

                //        //Deduct For Legese Yihdegos Pension (Id = 44)
                //        var e2 = _employee.Get(44);

                //        if (e2 != null)
                //        {
                //            var salary2 = (decimal)e2.SalaryGBP * _P_TWO_EXCHANGE_RATE;
                //            dedAmount2 = salary2 * item.PItemAmount / 100;

                //            _amnt = _amnt + dedAmount2;
                //        }

                //    }
                //    reclnObject = new clsReconcile
                //    {
                //        PayrollItem = item.PItemName,
                //        PeriodOneId = periodOne,
                //        PeriodTwoId = periodTwo,
                //        PeriodOnePItemAmount = 0,
                //        PeriodTwoPItemAmount = 0,
                //        ReasonForDifference = m_reason,
                //        AmountDueToReason = _amnt,
                //        TotalDifference = 0.00M,
                //        IsAddition = false
                //    };
                //    reclnObjectList.Add(reclnObject);

                //}

                #endregion


                #endregion

                #region Get Differences on INCOME TAX

                foreach (var it in _ALL_IT_DIFFERENCES)
                {
                    reclnObject = new clsReconcile
                    {
                        PayrollItem = "Income Tax",
                        PeriodOneId = periodOne,
                        PeriodTwoId = periodTwo,
                        PeriodOnePItemAmount = it.PeriodOneVal,
                        PeriodTwoPItemAmount = it.PeriodTwoVal,
                        ReasonForDifference = "Income Tax difference for (" + it.EmployeeName + ")",
                        AmountDueToReason = it.Difference,
                        TotalDifference = 0.00M,
                        IsAddition = false
                    };

                    reclnObjectList.Add(reclnObject);
                }
                #endregion


                SaveResult(reclnObjectList, periodOne, periodTwo);

                transaction.Complete();
                _context.AcceptAllChanges();

                return true;
            }
        }

        private void SaveResult(IEnumerable<clsReconcile> reclnList, int periodOne, int periodTwo)
        {
            #region Check for existing reconciliation information and remove one if exists
            var _SavedReconciliation = _payrollReconciliation.GetAll().Where(p => p.PeriodOneId == periodOne && p.PeriodTwoId == periodTwo);

            if (_SavedReconciliation.Any())
            {
                _payrollReconciliation.Delete(periodOne, periodTwo);
            }
            #endregion

            using (var transaction = new TransactionScope())
            {
                _context.Connection.Open();
                int index = 0;
                var prevPayrollItem = "";
                foreach (var recln in reclnList)
                {
                    if (prevPayrollItem != recln.PayrollItem)
                        index++;
                    PrlReconciliation payRecln = new PrlReconciliation();
                    PayrollReconciliation _prlReconciliation = new PayrollReconciliation(_context);

                    payRecln.PeriodOneId = recln.PeriodOneId;
                    payRecln.PeriodTwoId = recln.PeriodTwoId;
                    payRecln.PayrollItem = recln.PayrollItem;// "[" + index + "]. " + recln.PayrollItem;
                    payRecln.PeriodOnePItemAmount = recln.PeriodOnePItemAmount;
                    payRecln.PeriodTwoPItemAmount = recln.PeriodTwoPItemAmount;
                    payRecln.ReasonForDifference = recln.ReasonForDifference;
                    payRecln.AmountDueToReason = recln.AmountDueToReason;
                    payRecln.TotalDifference = recln.TotalDifference;
                    payRecln.IsAddition = recln.IsAddition;



                    _prlReconciliation.AddNew(payRecln);

                    prevPayrollItem = recln.PayrollItem;
                }
                transaction.Complete();
                _context.AcceptAllChanges();
            }




            //Collect Payroll items That depend on Percentage of basic salary 
            using (var transaction = new TransactionScope())
            {
                //_context.Connection.Open();

                clsReconcile reclnObject = new clsReconcile();
                var reclnObjectList = new List<clsReconcile>();

                bool isAddition = false;
                int index = 0;
                //Get The payroll Item Id for Severance Pay  
                var _SP_PITEM_ID = int.Parse(_payrollSettings.Get(Constants.SeverancePayPItemId).SettingValue);

                            var _All_PERCENTAGE_PITEMS =
                _payrollItems.GetAll()
                    .Where(
                        d =>
                            d.IsActive == true & d.IsDeleted == false &
                            d.PItemApplicationType == Constants.PercentageApplicationType);
                foreach (var item in _All_PERCENTAGE_PITEMS)
                {
                    
                    var hasPItemTrans =
                        _changesMade.GetAll().Where(c => c.ChangePeriodId == periodTwo & c.PItemId == item.Id);

                    if (!hasPItemTrans.Any())
                        continue;

                    if (item.Id == _SP_PITEM_ID)
                        continue;

                    if (item.PItemIsAddition)
                        isAddition = true;

                    string m_reason = item.PItemName + " difference caused by exchange rate.";

                    var sum = _payrollReconciliation.GetAll()
                        .Where(
                            c =>
                                c.PeriodOneId == periodOne & c.PeriodTwoId == periodTwo &
                                c.PayrollItem == item.PItemName).Sum(c=> c.AmountDueToReason);
                    if (sum != null)
                    {
                        var sumFromReconciliation =
                            (decimal)sum;
                        
                        var sumPeriodOne =
                            _payrollTransactionPItems.FindAll(c => c.PrlTransactions.PeriodId == periodOne & c.PItemId == item.Id)
                                .Sum(c => c.PItemAmount);

                        var sumPeriodTwo = _payrollTransactionPItems.FindAll(c => c.PrlTransactions.PeriodId == periodTwo & c.PItemId == item.Id).Sum(c => c.PItemAmount);

                        var sumDifference = sumPeriodTwo - sumPeriodOne;
                        decimal _amnt = sumDifference - sumFromReconciliation;

                        reclnObject = new clsReconcile
                        {
                            PayrollItem = item.PItemName,
                            PeriodOneId = periodOne,
                            PeriodTwoId = periodTwo,
                            PeriodOnePItemAmount = 0,
                            PeriodTwoPItemAmount = 0,
                            ReasonForDifference = m_reason,
                            AmountDueToReason = _amnt,
                            TotalDifference = 0.00M,
                            IsAddition = isAddition
                        };
                    }
                    reclnObjectList.Add(reclnObject);
                }


                foreach (var recln in reclnObjectList)
                {
                   
                    PrlReconciliation payRecln = new PrlReconciliation();
                    PayrollReconciliation _prlReconciliation = new PayrollReconciliation(_context);

                    payRecln.PeriodOneId = recln.PeriodOneId;
                    payRecln.PeriodTwoId = recln.PeriodTwoId;
                    payRecln.PayrollItem = recln.PayrollItem;// "[" + index + "]. " + recln.PayrollItem;
                    payRecln.PeriodOnePItemAmount = recln.PeriodOnePItemAmount;
                    payRecln.PeriodTwoPItemAmount = recln.PeriodTwoPItemAmount;
                    payRecln.ReasonForDifference = recln.ReasonForDifference;
                    payRecln.AmountDueToReason = recln.AmountDueToReason;
                    payRecln.TotalDifference = recln.TotalDifference;
                    payRecln.IsAddition = recln.IsAddition;



                    _prlReconciliation.AddNew(payRecln);
                
                }
                transaction.Complete();
                _context.AcceptAllChanges();
            }
        }

        private string GetEmployeeFullName(int empId)
        {
            var empObject = _employee.Get(empId);
            string empFullName = empObject.FirstName + " " + empObject.MiddleName + " " + empObject.LastName;

            return empFullName;
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
        #endregion
    }

    public class clsReconcile
    {
        public int Id
        {
            get;
            set;
        }

        public int PeriodOneId
        {
            get;
            set;
        }

        public int PeriodTwoId
        {
            get;
            set;
        }

        public string PayrollItem
        {
            get;
            set;
        }
        public decimal PeriodOnePItemAmount
        {
            get;
            set;
        }
        public decimal PeriodTwoPItemAmount
        {
            get;
            set;
        }
        public string ReasonForDifference
        {
            get;
            set;
        }

        public decimal AmountDueToReason
        {
            get;
            set;
        }

        public decimal TotalDifference
        {
            get;
            set;
        }

        public string Remark
        {
            get;
            set;
        }
        public bool IsAddition
        {
            get;
            set;
        }
    }
}