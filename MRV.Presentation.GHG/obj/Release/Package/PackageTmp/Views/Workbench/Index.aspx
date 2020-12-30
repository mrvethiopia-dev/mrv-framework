<%@ Page Language="C#" Inherits="System.Web.Mvc.ViewPage" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head id="Head1" runat="server">
    <title>CoreFinance Financial Management System</title>
    <script>
        window.onbeforeunload = function (e) {
            return 'Dialog text here.';
        };
    </script>
    <link type="text/css" href="<% = Url.Content("~/Content/css/ext-all.css") %>" rel="Stylesheet" />  
    <link type="text/css" href="<% = Url.Content("~/Content/css/MultiSelect.css") %>" rel="Stylesheet" /> 
    <link type="text/css" href="<% = Url.Content("~/Content/css/app/main.css") %>" rel="Stylesheet" />
    <link type="text/css" href="<% = Url.Content("~/Content/css/app/icons.css") %>" rel="Stylesheet" />
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/ext-base.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/ext-all.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/tab-close-menu.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/CheckColumn.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/ColumnHeaderGroup.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/ComboColumn.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/CurrencyField.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/RowActions.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/GridSearch.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/PagingRowNumberer.js") %>"></script>
    
    <%--<script type="text/javascript" src="<% = Url.Content("~/Scripts/ext-lang-am.js") %>"></script>--%>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/ux-util.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/array-tree.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/SystemMessage.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/SystemMessageManager.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Login.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Logout.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Reception.js") %>"></script>
   
    
   
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Common.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/examples.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Workbench.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Direct/Api") %>"></script>
    
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/TabScrollerMenu.js") %>"></script>
 
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/PayrollTaxRate.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/PayrollOvertimeRate.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/PayrollAccounts.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/PayrollBanks.js") %>"></script>
     <script type="text/javascript" src="<% = Url.Content("~/Scripts/PayrollBankBranches.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/PayrollDepartments.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/PayrollRegions.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/PayrollWoredas.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/PayrollPositions.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/PayrollItems.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/PayrollEmployees.js") %>"></script>
     <script type="text/javascript" src="<% = Url.Content("~/Scripts/EmployeeSelection.js") %>"></script>

    <script type="text/javascript" src="<% = Url.Content("~/Scripts/PayrollOvertimeDetail.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/PayrollOvertimeHeader.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/PayrollOvertimeMain.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/PayrollItems.js") %>"></script>

    <script type="text/javascript" src="<% = Url.Content("~/Scripts/PayrollAtachPayrollItems.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/PayrollAttachPayrollItemsDetail.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/PayrollAttachPayrollItemsHeader.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/PayrollApplicabilityOptions.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/PayrollGenerator.js") %>"></script>
    <%--<script type="text/javascript" src="<% = Url.Content("~/Scripts/PayrollAttendance.js") %>"></script>--%>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/PayrollCommon.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/PayrollTransactionViewer.js") %>"></script>

    <script type="text/javascript" src="<% = Url.Content("~/Scripts/PayrollItemSettings.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/PayrollConfigurationSettings.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/PayrollPostingSettings.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/PayrollPostTransactions.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/PayrollPostTransactions.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/ChangePassword.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/PayrollEmployeeTermination.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/PayrollReconciliation.js") %>"></script>

    <script type="text/javascript" src="<% = Url.Content("~/Scripts/User.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/UserRole.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/UserSubsystem.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Role.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/RolePermission.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/RoleMember.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Menus.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/SubMenus.js") %>"></script>
     <script type="text/javascript" src="<% = Url.Content("~/Scripts/SearchMenu.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/SearchSubmenu.js") %>"></script>  
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/AttendanceDeptTree.js") %>"></script> 

    <script type="text/javascript" src="<% = Url.Content("~/Scripts/RptPaySheet.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/RptPaySlip.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/RptPayrollSummery.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/RptPayrollItemsSheet.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/RptSeverancePay.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/RptPayrollJournal.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/RptERCAPension.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/RptERCAIncomeTax.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/RptBankLetter.js") %>"></script>
     <script type="text/javascript" src="<% = Url.Content("~/Scripts/RptEmpPItem.js") %>"></script>
      <script type="text/javascript" src="<% = Url.Content("~/Scripts/RptReconciliation.js") %>"></script>
       <script type="text/javascript" src="<% = Url.Content("~/Scripts/LetterSettings.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/EmailSendingSettings.js") %>"></script>

    <script type="text/javascript" src="<% = Url.Content("~/Scripts/PayrollFiscalYear.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/PayrollPeriods.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/RptChangesMade.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Exporter-all.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/PayrollSalaryPositionChange.js") %>"></script>
     <%--<script type="text/javascript" src="<% = Url.Content("~/Scripts/JScript1.js") %>"></script>--%>
      <script type="text/javascript" src="<% = Url.Content("~/Scripts/MultiSelect.js") %>"></script>
      <script type="text/javascript" src="<% = Url.Content("~/Scripts/PayrollAttendanceDetail.js") %>"></script>
      <script type="text/javascript" src="<% = Url.Content("~/Scripts/EmployeePicker.js") %>"></script>
      
      <%-- Finance --%>
      <script type="text/javascript" src="<% = Url.Content("~/Scripts/FinanceChartOfAccount.js") %>"></script>
      <script type="text/javascript" src="<% = Url.Content("~/Scripts/FinanceSearchVoucher.js") %>"></script>
      <script type="text/javascript" src="<% = Url.Content("~/Scripts/FinanceVoucher.js") %>"></script>
      <script type="text/javascript" src="<% = Url.Content("~/Scripts/FinanceVoucherPrefix.js") %>"></script>
      <script type="text/javascript" src="<% = Url.Content("~/Scripts/FinanceVoucherTypeSetting.js") %>"></script>
      <script type="text/javascript" src="<% = Url.Content("~/Scripts/FinanceVouchersJV.js") %>"></script>
      <script type="text/javascript" src="<% = Url.Content("~/Scripts/FinanceVouchersDV.js") %>"></script>
      <script type="text/javascript" src="<% = Url.Content("~/Scripts/FinanceVouchersCRV.js") %>"></script>
      <script type="text/javascript" src="<% = Url.Content("~/Scripts/FinanceTransactions.js") %>"></script>

    <script type="text/javascript" src="<% = Url.Content("~/Scripts/RptFinanceGeneralLedger.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/RptFinanceFinancialReports.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/FinanceBudgetCodes.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/FinanceWorkshops.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/FinanceIC.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/FinanceBankCheques.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/FinanceVoidCheque.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/FinancePurchaseOrders.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/FinancePurchaseOrderApproval.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/FAFixedAsset.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/JScript1.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/FinanceSettings.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/FinanceVoucherSettings.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/FinanceBankTRs.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/FinanceVehicles.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/FinanceParentBudgetCodes.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/FinanceBankReconciliation.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/FinanceTransactionsUnpost.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/FinanceOC.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/AccountPicker.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/PayrollSalaryChangeBatch.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/RptSalaryChangeLetter.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/PayrollSalaryChangeBatchSettings.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/GridPrinter.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/PayrollTimeSheet.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/FinanceExchangeRates.js") %>"></script>
     <script type="text/javascript" src="<% = Url.Content("~/Scripts/FinanceSearchTransactions.js") %>"></script>
     <script type="text/javascript" src="<% = Url.Content("~/Scripts/PayrollTimeSheetOptions.js") %>"></script>
     <script type="text/javascript" src="<% = Url.Content("~/Scripts/FinanceVouchersSearch.js") %>"></script>
     <script type="text/javascript" src="<% = Url.Content("~/Scripts/ItemsPicker.js") %>"></script>
     <script type="text/javascript" src="<% = Url.Content("~/Scripts/PayrollBatchCurrencyChanger.js") %>"></script>
     <script type="text/javascript" src="<% = Url.Content("~/Scripts/PositionsPicker.js") %>"></script>
     <script type="text/javascript" src="<% = Url.Content("~/Scripts/FinanceAccountPositionMapping.js") %>"></script>
     <script type="text/javascript" src="<% = Url.Content("~/Scripts/FinanceProjectNumbers.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/FinanceVouchersTemp.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/PayrollBatchContractEndDateChanger.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/ADepartmentPicker.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/PayrollApplicabilityDepartments.js") %>"></script>


    <script type="text/javascript" src="<% = Url.Content("~/Scripts/RptERCAIncomeTaxNEW.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/RptERCAPensionNEW.js") %>"></script>
</head>
<body>
    <form id="Form1" runat="server">
        <asp:ScriptManager ID="ScriptManagerMain" runat="server" EnableScriptGlobalization="true">
            
        </asp:ScriptManager>
    </form>    
</body>
</html>