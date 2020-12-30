namespace NBI.Presentation.Tsa.Classes
{
    using System;


    public class ReusableResourcesUI
    {
        // Unit Description
        public enum UnitOfType : byte { FixedAmount = 001, Percent = 002, Liter = 003 };
        public enum OrgsItemCode : byte { PF_001 = 001, Pension_002 = 002 };

        public enum ApplicationMethodType : byte { Fixed_Amount = 001, Percentage_Of_Basic_Salary = 002, Liter = 003 };

        public enum ReportName : byte
        {
            rpt_PFSheet = 1, rpt_PFDepositSheet = 2, rpt_PItemAmounts = 3, rpt_PFSlip = 4, rpt_ARRAPFSheet = 5,
            r_PFWithdraw = 6
        }
        public enum ChangeType : byte
        {
            Salary = 1, Position = 2
        }
        public enum ReportType : byte
        {
            crystal = 1, rdlc = 2, rdl = 3, html = 4, custom = 5 
        }

        public enum PayrollReportName : byte
        {
            rpt_PaySheet = 6, rpt_paySlip = 7, RptOvertimeSheet = 8, RptLoanSheet = 9, rpt_PItemAmount = 10, rpt_PaySheetSummery = 11, rpt_SeverancePay = 12,
            rpt_PayrollJournal = 13, rpt_ERCAPension = 14, rpt_ERCAIncomeTax = 15, rpt_BankLetter = 16,
            rpt_EmpPItem = 17, rpt_Reconciliation = 18, rpt_ChangesMade = 19, rpt_SalaryChangeLetter = 20, rpt_CurrencyChangeLetter = 21,
            rpt_ERCAIncomeTaxNEW = 22, rpt_ERCAPensionNEW = 23
        }

        public enum ReportProtocol : byte { Refresh = 1, Export = 2, Print = 3 };

        public static string SelectedReport = "SelectedReport";
        public static string PayrollItemName = "PayrollItemName";
        public static string ReportSourceDataView_Primary = "ReportSourceDataView_Primary";
        public static string ReportSourceDataView_Secondary = "ReportSourceDataView_Secondary";
        public static string ReportPath = "ReportPath";
        public static string PeriodId = "PeriodId";
        public static string PeriodTwoId = "PeriodTwoId";
        public static string PeriodToId = "PeriodToId";
        public static string Period = "Period";
        public static string PeriodTwo = "PeriodTwo";
        public static string PeriodTo = "PeriodTo";
        public static string FiscalYear = "FiscalYear";
        public static string AsOfDate = "AsOfDate";
        public static string PayrollItem = "PayrollItem";

        public static string StartDate = "StartDate";
        public static string EndDate = "EndDate";
        public static string Project = "Project";
        
        public static string DateFormat_One = "dd/MM/yyyy";
        public static string DateFormat_Two = "MM/dd/yyyy";
        public static string CurrencyFormat = "#,###.##";

        public static string FilterCriteria = "FilterCriteria";
        public static string ReportSourcePayrollItems = "ReportSourcePayrollItems";
        public static string ReportSourcePaySheet = "ReportSourcePaySheet";
        public static string ReportSourcePaySlip1 = "ReportSourcePaySlip1";
        public static string ReportSourcePaySlip2 = "ReportSourcePaySlip2";
        public static string ReportSourceSeverancePay = "ReportSourceSeverancePay";
        public static string ReportSourcePayrollJournal = "ReportSourcePayrollJournal";
        public static string ReportSourceERCAPension = "ReportSourceERCAPension";
        public static string ReportSourceERCAIncomeTax = "ReportSourceERCAIncomeTax";
        public static string ReportSourcePensionSummary = "ReportSourcePensionSummary";
        public static string ReportSourceIncomeTaxSummary = "ReportSourceIncomeTaxSummary";
        public static string ReportSourceTerminationSummary = "ReportSourceTerminationSummary";
        public static string ReportSourceBankLetter = "ReportSourceBankLetter";
        public static string ReportSourceReconciliation = "ReportSourceReconciliation";
        public static string ReportSourceReconciliationHeader = "ReportSourceReconciliationHeader";
        public static string ReportSourceChangesMade = "ReportSourceChangesMade";
        public static string ReportSourceSalaryChangeLetter = "ReportSourceSalaryChangeLetter";
        public static string ReportSourceCurrencyChangeLetter = "ReportSourceCurrencyChangeLetter";
        public static string CurrExchangeRate = "CurrExchangeRate";

        //Variables Used for Bank Letter 
        public static string AccountNo = "AccountNo";
        public static string NetPayAlphaNumeric = "NetPayAlphaNumeric";
        public static string BankBranchName = "BankBranchName";
        public static string BankName = "BankName";
    }
    
    public class ItemTemple
    {
        public byte Id;
        public string ItemCode;
    }
}
