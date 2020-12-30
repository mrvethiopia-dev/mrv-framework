namespace MRV.Presentation.GHG.Classes
{
    public static class Constants
    {
        #region Members
        //used for accessing lookups 
        public const string BusinessForm = "lupBusinessForm";

        public const string Regions = "lupRegion";
        public const string Accounts = "lupAccounts";
        public const string Banks = "lupBanks";
        public const string Departments = "lupDepartments";
        public const string Position = "lupPosition";
        public const string Woreda = "lupWoreda";
        public const string PayrollItemAppMethod = "lupPayrollAmountApplicationMethod";
        public const string PayrollOTTypes = "lupPayrollOTTypes";
        public const string PayrollSettings = "ifmsPayrollSettings";
        public const string WorkingHoursPerMonth = "EmployeeWorkingHoursPerMonth";
        public const string WorkingHoursPerDay = "EmployeeWorkingHoursPerDay";
        public const string FuelPricePerLiter = "FuelPricePerLiter";
        public const string TransportPItemId = "TransportPayrollItemId";
        public const string OvertimePItemId = "OvertimePayrollItemId";
        public const string IncomeTaxId = "IncomeTaxId";
        public const string PensionEmployeeContId = "PensionEmployeeContId";
        public const string PensionEmployerContId = "PensionEmployerContId";
        public const string BasicSalaryPItemId = "BasicSalaryPItemId";
        public const string NetSalaryPItemId = "NetSalaryPItemId";
        public const string TotalWorkingDays = "TotalWorkingDays";
        public const string ExchangeRate = "ExchangeRate";
        public const string ExchangeRatePeriodId = "ExchangeRatePeriodId";

        public const string EmployerEnterpriseNo = "EmployerEnterpriseNo";
        public const string EmployerTaxAccount = "EmployerTaxAccount";

        public const string IdentityNoPrefix = "IdentityNoPrefix";
        public const string DefaultAccountForPosting = "DefaultAccountForPosting";
        public const string SeverancePayPItemId = "SeverancePayId";
        public const string AbsenteeismDeductionPayrollItemId = "AbsenteeismDeductionPayrollItemId";
        public const string Key = "0b1f131c";
        public const string PercentageApplicationType = "Percentage Of Basic Salary";
        public const string FixedAmntApplicationType = "Fixed Amount";

        public const string NetPayControlAccountId = "NetPayControlAccountId";
        public const string IncomeTaxControlAccountId = "IncomeTaxControlAccountId";
        public const string PensionControlAccountId = "PensionControlAccountId";
        public const string TerminationProvisionAccountId = "TerminationProvisionAccountId";

        public const string EmailSenderAddress = "EmailSenderAddress";
        public const string EmailSMTPServer = "EmailSMTPServer";
        public const string EmailIsAuthRequired = "EmailIsAuthRequired";
        public const string EmailUserName = "EmailUserName";
        public const string EmailPassword = "EmailPassword";
        public const string EmailServerProtocol = "EmailServerProtocol";
        public const string EmailEncoding = "EmailEncoding";
        public const string EmailSubject = "EmailSubject";
        public const string EmailPath = "EmailPath";

        public const string ApplyTaxAfter = "ApplyTaxAfter";
        public const string ApplyTaxAfterPercentage = "ApplyTaxAfterPercentage";
        public const string ReasonExchangeRate = "Exchange Rate Difference";
        public const string ReasonNewEmployeeAdded = "New Employee Added";
        public const string ReasonInactiveEmployee = "Employee was made inactive";
        public const string ReasonActiveEmployee = "Employee was made active";
        public const string ReasonEmployeeTerminated = "Employee has been terminated";
        public const string ReasonPayrollItemAttached = "Payroll Item Attached";
        public const string ReasonPayrollItemsChanged = "Payroll Item Amount Changed";
        public const string ReasonPayrollItemAttachmentDeleted = "Payroll Item Attachment Deleted";

        public const string ActiveFiscalYear = "ActiveFiscalYear";

        public const string CurrencyGBP = "GBP";
        public const string CurrencyETB = "ETB";
        public const string SerialNo = "BankSerialNo";

        public const string BalanceSide = "lupBalanceSide";
        public const string VoucherType = "lupVoucherType";
        public const string ReferenceType = "lupReferenceType";
        public const string WorkShops = "lupWorkshops";
        public const string InternationalConsultants = "lupInternationalConsultant";
        public const string OutsideCompanies = "lupOutsideCompanies";
        public const string BudgetCodes = "lupBudgetCodes";
        public const string ModeOfPayment = "lupModeOfPayment";
        public const string POTypes = "lupPOTypes";
        public const string ParentBudgetCode = "lupParentBudgetCodes";
        public const string FINAdvanceControlAcctId = "FINAdvanceControlAcctId";
        public const string FINSeveranceControlAcctId = "FINSeveranceControlAcctId";
        public const string FINDefaultLocationId = "FINDefaultLocationId";
        public const string ImportToolLocation = "ImportToolPath";
        public const string TransactionType = "lupTransactionType";

        public static string ApplicationPath = string.Empty;
        public static string CurrentCulture = "CurrentCulture";
        public static string DefaultLanguage = "en-US";
        public static string ConnectionString = string.Empty;
        public static string CurrentUser = "CurrentUser";
        public static string CurrentSubsystem = "CurrentSubsystem";
        public const string UserPermission = "UserPermission";

        public const string GHGInventory = "GHGInventory";       
        public const string CanAdd = "CanAdd";
        public const string CanEdit = "CanEdit";
        public const string CanDelete = "CanDelete";
        public const string CanView = "CanView";
        public const string All = "All";
        public const string CLIENT_REQUEST_TYPE_DIRECT = "";
        public const string TIME_SERIES_DATE_FORMAT = "";
        public const string CLIENT_REQUEST_TYPE_JSON = "";

        public const string DEPARTMENTS = "Departments";
        public const string REGIONS = "Regions";
        public const string WOREDAS = "Woredas";
        public const string EMPLOYEES = "Employees";

        #endregion
    }

    public enum ReportFormat
    {
        Pdf = 0,
        Excel,
        Word,
        Rtf,
        Html
    }

    public enum ReportAction
    {
        ShowPage = 0,
        ShowLastPage,
        Export,
        Search
    }
}