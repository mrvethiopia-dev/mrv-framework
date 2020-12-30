namespace CyberErp.Presentation.Payroll.Web.Classes
{
    using System;
    using System.Data;
    using CyberErp.Business.Component.Payroll;
    using CyberErp.Data.Model;
    using CyberErp.Presentation.Payroll.Web.Classes;
    using CyberErp.Presentation.Payroll.Web.MappingComponents;

    public class ReportController
    {
        private ReusableResourcesUI.ReportName RPT_TYPE_NAME;
        private readonly SearchCriteria SC = new SearchCriteria();
        private readonly PFSheet _pfSheet;
        private readonly PFDepositSlip _pfDepositSlip;
        private readonly PFDepositSheet _pfDepositSheet;
        private readonly ErPEntities _context;

        public ReportController(SearchCriteria _sc)
        {
            this.SC = _sc;
            this._context = new ErPEntities(Constants.ConnectionString);
            this._pfSheet = new PFSheet(this._context);
            this._pfDepositSlip = new PFDepositSlip(this._context);
            this._pfDepositSheet = new PFDepositSheet(this._context);
        }

        public void PopulateReport(out string reportURL, out DataView dv_Primary, out DataView dv_Secondary)
        {
            reportURL = String.Empty;
            Enum.TryParse(this.SC.RptName, out this.RPT_TYPE_NAME);

            dv_Primary = new DataView();
            dv_Secondary = new DataView();

            switch (this.RPT_TYPE_NAME)
            {
                case ReusableResourcesUI.ReportName.rpt_PFSheet:

                    #region 1 PF Report Sheet

                    {
                        DS_Mappings_Rpt.Rpt_PFSheetDataTable _dt_ = new DS_Mappings_Rpt.Rpt_PFSheetDataTable();
                        PayrollReports l_rpt = new PayrollReports();

                        DataTable right = new DataTable();

                        l_rpt.GetPFSheet(this.SC, out right);

                        dv_Primary = new DataView(right, String.Empty, _dt_.EmployeeNameColumn.ColumnName, DataViewRowState.CurrentRows);

                        reportURL = "Reports/RDLCReportViewer.aspx";

                        break;
                    }

                    #endregion

                case ReusableResourcesUI.ReportName.rpt_PFDepositSheet:

                    #region 2 PF Deposit Sheet

                    {
                        DS_Mappings_Rpt.Rpt_PFDepositSlipDataTable _dt_ = new DS_Mappings_Rpt.Rpt_PFDepositSlipDataTable();
                        PayrollReports l_rpt = new PayrollReports();

                        DataTable right = new DataTable();

                        l_rpt.GetPFDepositSheet(this.SC, out right);

                        dv_Primary = new DataView(right, String.Empty, _dt_.EmployeeNameColumn.ColumnName, DataViewRowState.CurrentRows);

                        reportURL = "Reports/RDLCReportViewer.aspx";

                        break;
                    }

                    #endregion

                case ReusableResourcesUI.ReportName.rpt_PFSlip:

                    #region 3 PF Balance Slip

                    {
                        DS_Mappings_Rpt.Rpt_PFSlipDataTable _dt_ = new DS_Mappings_Rpt.Rpt_PFSlipDataTable();
                        PayrollReports l_rpt = new PayrollReports();

                        DataTable left = new DataTable();
                        DataTable right = new DataTable();

                        l_rpt.GetPFSlip(this.SC, out left, out right);

                        dv_Primary = new DataView(left, String.Empty, _dt_.EmployeeNameColumn.ColumnName, DataViewRowState.CurrentRows);
                        dv_Secondary = new DataView(right, String.Empty, _dt_.EmployeeNameColumn.ColumnName, DataViewRowState.CurrentRows);

                        reportURL = "Reports/RDLCReportViewer.aspx";

                        break;
                    }

                    #endregion

                case ReusableResourcesUI.ReportName.rpt_ARRAPFSheet:

                    #region 4 PF ARRA PF Sheet

                    {
                        DS_Mappings_Rpt.Rpt_PFSlipDataTable _dt_ = new DS_Mappings_Rpt.Rpt_PFSlipDataTable();
                        PayrollReports l_rpt = new PayrollReports();

                        DataTable right = new DataTable();

                        l_rpt.GetARRAPFSheet(this.SC, out right);

                        dv_Primary = new DataView(right, String.Empty, _dt_.EmployeeNameColumn.ColumnName, DataViewRowState.CurrentRows);

                        reportURL = "Reports/RDLCReportViewer.aspx";

                        break;
                    }

                    #endregion

                case ReusableResourcesUI.ReportName.r_PFWithdraw:

                    #region 5 PF Withdraw

                    {
                        DS_Mappings_Rpt.Rpt_PFWithdrawDataTable _dt_ = new DS_Mappings_Rpt.Rpt_PFWithdrawDataTable();
                        PayrollReports l_rpt = new PayrollReports();

                        DataTable right = new DataTable();

                        l_rpt.GetPFWithdraw(this.SC, out right);

                        dv_Primary = new DataView(right, String.Empty, _dt_.EmployeeNameColumn.ColumnName, DataViewRowState.CurrentRows);

                        reportURL = "Reports/RDLCReportViewer.aspx";

                        break;
                    }

                    #endregion
            }
        }
    }
}
