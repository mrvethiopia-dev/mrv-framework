using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using CrystalDecisions.Web;
using CrystalDecisions.Shared;
using NBI.Presentation.Tsa.Reports;
using CyberErp.Presentation.Payroll.Web.Classes;
using System.Data.EntityClient;
using System.Data.SqlClient;
using CrystalDecisions.CrystalReports.Engine;
using CyberErp.Presentation.Payroll.Web.Controllers;
using CyberErp.Business.Component.Payroll;
using CyberErp.Data.Model;
using System.Data;
using System.Data.Objects;
using System.Data.SqlClient;
using NBI.Data.Model;
using NBI.Business.Tsa;
using NBI.Presentation.Tsa.Classes;
namespace CyberErp.Presentation.Payroll.Web.Reports
{
    public partial class PayrollReportViewer : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            PayrollGenerator l_gen = new PayrollGenerator();
            ObjectContext _context = new ErPEntities(Constants.ConnectionString);
            

            #region Set Connection Info
            EntityConnectionStringBuilder entityBuilder = new EntityConnectionStringBuilder(Constants.ConnectionString);
            SqlConnectionStringBuilder builder = new SqlConnectionStringBuilder(entityBuilder.ProviderConnectionString);
            ConnectionInfo connectionInfo = new ConnectionInfo();
            connectionInfo.DatabaseName = builder.InitialCatalog;
            connectionInfo.UserID = builder.UserID;
            connectionInfo.Password = builder.Password;
            connectionInfo.ServerName = builder.DataSource;
            connectionInfo.IntegratedSecurity = builder.IntegratedSecurity;

            #endregion

            Guid periodId = Guid.Empty;
            var reportType = Request.QueryString["rt"];
            string ctrstr = Request.QueryString.ToString();
            if (ctrstr != null)
            {
                if (ctrstr != "")
                {
                    string[] qryStr = ctrstr.Split('&');
                    periodId = Guid.Parse(qryStr[1]);
                }
            }

            string reportPath = string.Empty;
            if (reportType == "PaySheet")
            {
                DataTable l_dt = l_gen.ViewTransactions(periodId);
                
                foreach (DataRow dr in l_dt.Rows)
                {
                    int i = 0;
                    ifmsPayrollTempReport tempRpt = new ifmsPayrollTempReport();
                    
                    string idNumber = dr["EmpId"].ToString();
                    string empName = dr["EmployeeName"].ToString();
                    foreach (DataColumn dc in l_dt.Columns)
                    {
                       tempRpt = new ifmsPayrollTempReport();

                       tempRpt.PeriodId = periodId;
                       tempRpt.EmpIdentityNumber = idNumber;
                       tempRpt.EmpName = empName;
                       if (dc.Caption != "EmpId" && dc.Caption != "EmployeeName")
                       {
                           tempRpt.TransactionName = dc.Caption;
                           tempRpt.TransactionAmount = Convert.ToDecimal(dr[dc.Caption]);
                           tempRpt.Id = Guid.NewGuid();
                           
                       }
                    }
                }

               // RptPaySheet objRpt = new RptPaySheet();

                //this.reportViewer.ReportSource = objRpt;

                reportViewer.Zoom(100);

                reportViewer.BorderStyle = BorderStyle.Solid;
                reportViewer.BorderColor = System.Drawing.ColorTranslator.FromHtml("#D0DEF0");
                reportViewer.BorderWidth = Unit.Pixel(1);
                reportViewer.BestFitPage = true;
                reportViewer.HasCrystalLogo = false;
                reportViewer.HasToggleGroupTreeButton = false;
                reportViewer.HasDrillUpButton = false;

                reportViewer.RefreshReport();
            }
        }

        private void SetDBLogonForReport(ConnectionInfo connectionInfo, Tables reportTables)
        {
            foreach (CrystalDecisions.CrystalReports.Engine.Table table in reportTables)
            {
                TableLogOnInfo tableLogonInfo = table.LogOnInfo;
                tableLogonInfo.ConnectionInfo = connectionInfo;
                table.ApplyLogOnInfo(tableLogonInfo);
            }
        }

        private void SetDBLogonForSubReport(ConnectionInfo connectionInfo, ReportDocument rptDoc)
        {
            Tables reportTables = rptDoc.Database.Tables;
            foreach (CrystalDecisions.CrystalReports.Engine.Table table in reportTables)
            {
                TableLogOnInfo tableLogonInfo = table.LogOnInfo;
                tableLogonInfo.ConnectionInfo = connectionInfo;
                table.ApplyLogOnInfo(tableLogonInfo);
            }

            CrystalDecisions.CrystalReports.Engine.ReportDocument subRptDoc;
            CrystalDecisions.CrystalReports.Engine.Subreports subReports;
            subReports = rptDoc.Subreports;

            for (int i = 0; i < subReports.Count; i++)
            {
                subRptDoc = subReports[i];
                reportTables = subRptDoc.Database.Tables;

                foreach (CrystalDecisions.CrystalReports.Engine.Table table in reportTables)
                {
                    TableLogOnInfo tableLogonInfo = table.LogOnInfo;
                    tableLogonInfo.ConnectionInfo = connectionInfo;
                    table.ApplyLogOnInfo(tableLogonInfo);
                }
            }
        }
    }
}