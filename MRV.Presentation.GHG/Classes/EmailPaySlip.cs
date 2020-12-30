using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Text;
using System.IO;
using System.Data;
//using EASendMail;
using NBI.Data.Model;
using NBI.Business.Tsa;
using System.Data.Objects;
using System.Threading;
using System.Net;
using System.Net.Mail;


namespace NBI.Presentation.Tsa.Classes
{
    public class EmailPaySlip
    {
        public BackgroundWorker myWorker = new BackgroundWorker();
        private static ObjectContext _context;
        public static PayrollSettings _payrollSettings;
        public static PayrollTransactions _payrolltransactions;
        public static string err = "";
        public static int PeriodID = 0;
        public static SearchCriteria SCriteria = new SearchCriteria();
        private static Thread t = new Thread(new ThreadStart(SendEmail)) { IsBackground = true };
        public EmailPaySlip()
        {
            
        }

        public static string ProcessRequest(int periodId, SearchCriteria sc)
        {
            SCriteria = sc;
           
            PeriodID = periodId;
           
            t.Start();
           // t.Join();
            
            
            return "Email will be delivered shortly to the recipients! The delivery process may take some time depending on the speed of your internet connection.";
        }

        public static string CreateTopTable(int empId, int periodId)
        {
            using (var erpEntities = new ENTRO_MISEntities())
            {

                var m_payTrans = erpEntities.vwPrlTransactionDetails.FirstOrDefault(p => p.EmpId == empId && p.PeriodId == periodId);

                var strHTMLBuilder = new StringBuilder();
                strHTMLBuilder.Append("<html >");
                strHTMLBuilder.Append("<head>");
                strHTMLBuilder.Append("</head>");
                strHTMLBuilder.Append("<body>");
                strHTMLBuilder.Append(
                    "<table border='0px'; cellpadding='3'; cellspacing='0'; style='border: solid 1px lightgray;' width = '50%'>");

                strHTMLBuilder.Append("<tr align='left' valign='top' border='1px' bordercolor = 'Red'>");
                strHTMLBuilder.Append("<td align='left' valign='top' width = '20%'  border='1px' bordercolor = 'Red'>");
                strHTMLBuilder.Append("<Font face = 'Arial'  size = '1' > ");
                strHTMLBuilder.Append("<b>Name: </b>");
                strHTMLBuilder.Append("</Font> ");
                strHTMLBuilder.Append("</td>");

                strHTMLBuilder.Append("<td align='left' valign='top'  >");
                strHTMLBuilder.Append("<Font face = 'Arial'  size = '1' > ");
                strHTMLBuilder.Append("<b>");
                strHTMLBuilder.Append(m_payTrans.EmployeeName.ToString());
                strHTMLBuilder.Append("</b>");
                strHTMLBuilder.Append("</font>");
                strHTMLBuilder.Append("</td>");
                strHTMLBuilder.Append("</tr>");

                strHTMLBuilder.Append("<tr align='left' valign='top' border='1px' bordercolor = 'Red'>");
                strHTMLBuilder.Append("<td align='left' valign='top' width = '20%'  border='1px' bordercolor = 'Red'>");
                strHTMLBuilder.Append("<Font face = 'Arial'  size = '1' > ");
                strHTMLBuilder.Append("<b>Id No: </b>");
                strHTMLBuilder.Append("</Font> ");
                strHTMLBuilder.Append("</td>");

                strHTMLBuilder.Append("<td align='left' valign='top'  >");
                strHTMLBuilder.Append("<Font face = 'Arial'  size = '1' > ");
                strHTMLBuilder.Append("<b>");
                strHTMLBuilder.Append(m_payTrans.IdentityNo.ToString());
                strHTMLBuilder.Append("</b>");
                strHTMLBuilder.Append("</font>");
                strHTMLBuilder.Append("</td>");
                strHTMLBuilder.Append("</tr>");

                strHTMLBuilder.Append("<tr align='left' valign='top' border='1px' bordercolor = 'Red'>");
                strHTMLBuilder.Append("<td align='left' valign='top' width = '20%'  border='1px' bordercolor = 'Red'>");
                strHTMLBuilder.Append("<Font face = 'Arial'  size = '1' > ");
                strHTMLBuilder.Append("<b>Duty Station: </b>");
                strHTMLBuilder.Append("</Font> ");
                strHTMLBuilder.Append("</td>");

                strHTMLBuilder.Append("<td align='left' valign='top'  >");
                strHTMLBuilder.Append("<Font face = 'Arial'  size = '1' > ");
                strHTMLBuilder.Append("<b>");
                strHTMLBuilder.Append(m_payTrans.DutyStation.ToString());
                strHTMLBuilder.Append("</b>");
                strHTMLBuilder.Append("</font>");
                strHTMLBuilder.Append("</td>");
                strHTMLBuilder.Append("</tr>");

                strHTMLBuilder.Append("<tr align='left' valign='top' border='1px' bordercolor = 'Red'>");
                strHTMLBuilder.Append("<td align='left' valign='top' width = '20%'  border='1px' bordercolor = 'Red'>");
                strHTMLBuilder.Append("<Font face = 'Arial'  size = '1' > ");
                strHTMLBuilder.Append("<b>Contract Date: </b>");
                strHTMLBuilder.Append("</Font> ");
                strHTMLBuilder.Append("</td>");

                strHTMLBuilder.Append("<td align='left' valign='top'  >");
                strHTMLBuilder.Append("<Font face = 'Arial'  size = '1' > ");
                strHTMLBuilder.Append("<b>");
                strHTMLBuilder.Append(m_payTrans.EmploymentDate.ToString());
                strHTMLBuilder.Append("</b>");
                strHTMLBuilder.Append("</font>");
                strHTMLBuilder.Append("</td>");
                strHTMLBuilder.Append("</tr>");

                strHTMLBuilder.Append("<tr align='left' valign='top' border='1px' bordercolor = 'Red'>");
                strHTMLBuilder.Append("<td align='left' valign='top' width = '20%'  border='1px' bordercolor = 'Red'>");
                strHTMLBuilder.Append("<Font face = 'Arial'  size = '1' > ");
                strHTMLBuilder.Append("<b>Position: </b>");
                strHTMLBuilder.Append("</Font> ");
                strHTMLBuilder.Append("</td>");

                strHTMLBuilder.Append("<td align='left' valign='top'  >");
                strHTMLBuilder.Append("<Font face = 'Arial'  size = '1' > ");
                strHTMLBuilder.Append("<b>");
                strHTMLBuilder.Append(m_payTrans.Position.ToString());
                strHTMLBuilder.Append("</b>");
                strHTMLBuilder.Append("</font>");
                strHTMLBuilder.Append("</td>");
                strHTMLBuilder.Append("</tr>");

                strHTMLBuilder.Append("<tr align='left' valign='top' border='1px' bordercolor = 'Red'>");
                strHTMLBuilder.Append("<td align='left' valign='top' width = '20%'  border='1px' bordercolor = 'Red'>");
                strHTMLBuilder.Append("<Font face = 'Arial'  size = '1' > ");
                strHTMLBuilder.Append("<b>Days in Month: </b>");
                strHTMLBuilder.Append("</Font> ");
                strHTMLBuilder.Append("</td>");

                strHTMLBuilder.Append("<td align='left' valign='top'  >");
                strHTMLBuilder.Append("<Font face = 'Arial'  size = '1' > ");
                strHTMLBuilder.Append("<b>");
                strHTMLBuilder.Append(m_payTrans.TotalWorkingDays.ToString());
                strHTMLBuilder.Append("</b>");
                strHTMLBuilder.Append("</font>");
                strHTMLBuilder.Append("</td>");
                strHTMLBuilder.Append("</tr>");

                strHTMLBuilder.Append("<tr align='left' valign='top' border='1px' bordercolor = 'Red'>");
                strHTMLBuilder.Append("<td align='left' valign='top' width = '20%'  border='1px' bordercolor = 'Red'>");
                strHTMLBuilder.Append("<Font face = 'Arial'  size = '1' > ");
                strHTMLBuilder.Append("<b>Bank: </b>");
                strHTMLBuilder.Append("</Font> ");
                strHTMLBuilder.Append("</td>");

                strHTMLBuilder.Append("<td align='left' valign='top'  >");
                strHTMLBuilder.Append("<Font face = 'Arial'  size = '1' > ");
                strHTMLBuilder.Append("<b>");
                strHTMLBuilder.Append(m_payTrans.BankName.ToString());
                strHTMLBuilder.Append("</b>");
                strHTMLBuilder.Append("</font>");
                strHTMLBuilder.Append("</td>");
                strHTMLBuilder.Append("</tr>");

                strHTMLBuilder.Append("<tr align='left' valign='top' border='1px' bordercolor = 'Red'>");
                strHTMLBuilder.Append("<td align='left' valign='top' width = '20%'  border='1px' bordercolor = 'Red'>");
                strHTMLBuilder.Append("<Font face = 'Arial'  size = '1' > ");
                strHTMLBuilder.Append("<b>Account No: </b>");
                strHTMLBuilder.Append("</Font> ");
                strHTMLBuilder.Append("</td>");

                strHTMLBuilder.Append("<td align='left' valign='top'  >");
                strHTMLBuilder.Append("<Font face = 'Arial'  size = '1' > ");
                strHTMLBuilder.Append("<b>");
                strHTMLBuilder.Append(m_payTrans.BankAccountNo.ToString());
                strHTMLBuilder.Append("</b>");
                strHTMLBuilder.Append("</font>");
                strHTMLBuilder.Append("</td>");
                strHTMLBuilder.Append("</tr>");

                strHTMLBuilder.Append("<tr align='left' valign='top' border='1px' bordercolor = 'Red'>");
                strHTMLBuilder.Append("<td align='left' valign='top' width = '20%'  border='1px' bordercolor = 'Red'>");
                strHTMLBuilder.Append("<Font face = 'Arial'  size = '1' > ");
                strHTMLBuilder.Append("<b>Exchange Rate: </b>");
                strHTMLBuilder.Append("</Font> ");
                strHTMLBuilder.Append("</td>");

                strHTMLBuilder.Append("<td align='left' valign='top'  >");
                strHTMLBuilder.Append("<Font face = 'Arial'  size = '1' > ");
                strHTMLBuilder.Append("<b>");
                strHTMLBuilder.Append(m_payTrans.ExchangeRate.ToString());
                strHTMLBuilder.Append("</b>");
                strHTMLBuilder.Append("</font>");
                strHTMLBuilder.Append("</td>");
                strHTMLBuilder.Append("</tr>");

                //Close tags.  
                strHTMLBuilder.Append("</table>");
                strHTMLBuilder.Append("</body>");
                strHTMLBuilder.Append("</html>");

                string Htmltext = strHTMLBuilder.ToString();

                return Htmltext;
            }
        }

        public static string CreateBottomTable(int empId, int periodId)
        {
            using (ENTRO_MISEntities erpEntities = new ENTRO_MISEntities())
            {

                var m_payTransDetails = erpEntities.vwPrlTransactionDetails.Where(p => p.PeriodId == periodId && p.EmpId == empId).ToList();
                var mPayAdditions = m_payTransDetails.Where(p => p.PItemIsAddition == true);
                var mPayDeductions = m_payTransDetails.Where(p => p.PItemIsAddition == false);
                DataTable dt = new DataTable();

                dt.Columns.Add("Dosage", typeof(int));
                dt.Columns.Add("Drug", typeof(string));
                dt.Columns.Add("Patient", typeof(string));
                dt.Columns.Add("Date", typeof(DateTime));

                // Here we add five DataRows.
                dt.Rows.Add(25, "Indocin", "David", DateTime.Now);
                dt.Rows.Add(50, "Enebrel", "Sam", DateTime.Now);
                dt.Rows.Add(10, "Hydralazine", "Christoff", DateTime.Now);
                dt.Rows.Add(21, "Combivent", "Janet", DateTime.Now);
                dt.Rows.Add(100, "Dilantin", "Melanie", DateTime.Now);


                StringBuilder strHTMLBuilder = new StringBuilder();
                strHTMLBuilder.Append("<html >");
                strHTMLBuilder.Append("<head>");
                strHTMLBuilder.Append("</head>");
                strHTMLBuilder.Append("<body>");
                strHTMLBuilder.Append("<div>");

                #region Bottom Tables First Table

                var frstOrDflt = m_payTransDetails.FirstOrDefault();
                strHTMLBuilder.Append(
                    "<table cellpadding='5';cellspacing='0'; style='display: inline-block; border: 0px solid lightgray; float: left; '> ");

                strHTMLBuilder.Append("<tr >");

                strHTMLBuilder.Append("<td style='display: inline-block; border: 1px solid lightgray; ' >");
                strHTMLBuilder.Append("<Font face = 'Arial'  size = '1' > ");
                strHTMLBuilder.Append("<b>Basic Salary (ETB) </b>");
                strHTMLBuilder.Append("</Font> ");
                strHTMLBuilder.Append("</td >");

                strHTMLBuilder.Append("<td  style='display: inline-block; border: 1px solid lightgray; ' >");
                strHTMLBuilder.Append("<Font face = 'Arial'  size = '1' > ");
                strHTMLBuilder.Append("<b>");
                strHTMLBuilder.Append(decimal.Round(frstOrDflt.BasicPay, 2).ToString());
                strHTMLBuilder.Append("</b>");
                strHTMLBuilder.Append("</Font> ");
                strHTMLBuilder.Append("</td >");

                strHTMLBuilder.Append("</tr >");


                strHTMLBuilder.Append("<tr >");

                strHTMLBuilder.Append("<td style='display: inline-block; border: 1px solid lightgray; ' >");
                strHTMLBuilder.Append("<Font face = 'Arial'  size = '1' > ");
                strHTMLBuilder.Append("<b>Basic Salary (GBP) </b>");
                strHTMLBuilder.Append("</Font/> ");
                strHTMLBuilder.Append("</td >");

                strHTMLBuilder.Append("<td style='display: inline-block; border: 1px solid lightgray; ' >");
                strHTMLBuilder.Append("<Font face = 'Arial'  size = '1' > ");
                strHTMLBuilder.Append("<b >");
                strHTMLBuilder.Append(decimal.Round(Convert.ToDecimal(frstOrDflt.BasicSalaryGBP), 2).ToString());
                strHTMLBuilder.Append("</b >");
                strHTMLBuilder.Append("</Font> ");
                strHTMLBuilder.Append("</td >");

                strHTMLBuilder.Append("</tr >");


                strHTMLBuilder.Append("<tr >");

                strHTMLBuilder.Append("<td style='display: inline-block; border: 1px solid lightgray; ' >");
                strHTMLBuilder.Append("<Font face = 'Arial'  size = '1' > ");
                strHTMLBuilder.Append(" <b>Gross Salary </b>");
                strHTMLBuilder.Append("</Font > ");
                strHTMLBuilder.Append("</td >");

                strHTMLBuilder.Append("<td style='display: inline-block; border: 1px solid lightgray; ' >");
                strHTMLBuilder.Append("<Font face = 'Arial'  size = '1' > ");
                strHTMLBuilder.Append("<b >");
                strHTMLBuilder.Append(decimal.Round(Convert.ToDecimal(frstOrDflt.GrossSalary), 2).ToString());
                strHTMLBuilder.Append("</b >");
                strHTMLBuilder.Append("</Fon> ");
                strHTMLBuilder.Append("</td >");

                strHTMLBuilder.Append("</tr >");

                //Close tags.  
                strHTMLBuilder.Append("</table>");


                #endregion

                #region Bottom Tables Second Table

                strHTMLBuilder.Append(" &nbsp; ");
                strHTMLBuilder.Append(
                    "<table cellpadding='5';cellspacing='0';  style='display: inline-block; border: 0px solid lightgray; '> ");


                strHTMLBuilder.Append("<tr >");

                strHTMLBuilder.Append("<td align='center' colspan = '3' style='display: inline-block; border: 1px solid lightgray; ' >");
                strHTMLBuilder.Append("<Font face = 'Arial'  size = '2' > ");
                strHTMLBuilder.Append("<b>Additions</b>");
                strHTMLBuilder.Append("</Font >");
                strHTMLBuilder.Append("</td >");

                strHTMLBuilder.Append("</tr >");


                foreach (var add in mPayAdditions)
                {
                    strHTMLBuilder.Append("<tr >");

                    strHTMLBuilder.Append("<td align='left' style='display: inline-block; border: 1px solid lightgray; ' >");
                    strHTMLBuilder.Append("<Font face = 'Arial'  size = '1' > ");
                    strHTMLBuilder.Append("<b>");
                    strHTMLBuilder.Append(add.PItemName.ToString());
                    strHTMLBuilder.Append("</b>");
                    strHTMLBuilder.Append("</Font >");
                    strHTMLBuilder.Append("</td >");

                    strHTMLBuilder.Append("<td align='right' style='display: inline-block; border: 1px solid lightgray; ' >");
                    strHTMLBuilder.Append("<Font face = 'Arial'  size = '1.5' > ");
                    strHTMLBuilder.Append("<b>");
                    strHTMLBuilder.Append(decimal.Round(add.PItemAmount, 2).ToString());
                    strHTMLBuilder.Append("</b>");
                    strHTMLBuilder.Append("</Font >");
                    strHTMLBuilder.Append("</td >");

                    strHTMLBuilder.Append("</tr >");
                }








                //foreach (DataColumn myColumn in dt.Columns)
                //{
                //    strHTMLBuilder.Append("<td >");
                //    strHTMLBuilder.Append(myColumn.ColumnName);
                //    strHTMLBuilder.Append("</td>");

                //}
                //strHTMLBuilder.Append("</tr>");


                //foreach (DataRow myRow in dt.Rows)
                //{

                //    strHTMLBuilder.Append("<tr >");
                //    foreach (DataColumn myColumn in dt.Columns)
                //    {
                //        strHTMLBuilder.Append("<td >");
                //        strHTMLBuilder.Append(myRow[myColumn.ColumnName].ToString());
                //        strHTMLBuilder.Append("</td>");

                //    }
                //    strHTMLBuilder.Append("</tr>");
                //}

                //Close tags.  
                strHTMLBuilder.Append("</table>");


                #endregion

                #region Bottom Tables Second Table

                strHTMLBuilder.Append(" &nbsp; ");
                strHTMLBuilder.Append(
                    "<table cellpadding='5';cellspacing='0';  style='display: inline-block; border: 0px solid lightgray; '> ");


                strHTMLBuilder.Append("<tr >");

                strHTMLBuilder.Append("<td align='center' colspan = '3' style='display: inline-block; border: 1px solid lightgray; ' >");
                strHTMLBuilder.Append("<Font face = 'Arial'  size = '2' > ");
                strHTMLBuilder.Append("<b>Deductions</b>");
                strHTMLBuilder.Append("</Font >");
                strHTMLBuilder.Append("</td >");

                strHTMLBuilder.Append("</tr >");


                foreach (var ded in mPayDeductions)
                {
                    strHTMLBuilder.Append("<tr >");

                    strHTMLBuilder.Append("<td align='left' style='display: inline-block; border: 1px solid lightgray; ' >");
                    strHTMLBuilder.Append("<Font face = 'Arial'  size = '1' > ");
                    strHTMLBuilder.Append("<b>");
                    strHTMLBuilder.Append(ded.PItemName.ToString());
                    strHTMLBuilder.Append("</b>");
                    strHTMLBuilder.Append("</Font >");
                    strHTMLBuilder.Append("</td >");

                    strHTMLBuilder.Append("<td align='right' style='display: inline-block; border: 1px solid lightgray; ' >");
                    strHTMLBuilder.Append("<Font face = 'Arial'  size = '1.5' > ");
                    strHTMLBuilder.Append("<b>");
                    strHTMLBuilder.Append(decimal.Round(ded.PItemAmount, 2).ToString());
                    strHTMLBuilder.Append("</b>");
                    strHTMLBuilder.Append("</Font >");
                    strHTMLBuilder.Append("</td >");

                    strHTMLBuilder.Append("</tr >");
                }

                //Close tags.  
                strHTMLBuilder.Append("</table>");


                #endregion

                #region Bottom Tables First Table

                strHTMLBuilder.Append("<P>");
                strHTMLBuilder.Append(
                    "<table cellpadding='5';cellspacing='0'; style='display: inline-block; border: 0px solid lightgray; ' width = '50%'> ");

                strHTMLBuilder.Append("<tr bgcolor = 'lightgray'>");

                strHTMLBuilder.Append("<td align = 'left'style='display: inline-block; border: 1px solid lightgray; ' >");
                strHTMLBuilder.Append("<Font face = 'Arial'  size = '1' > ");
                strHTMLBuilder.Append("<b>Net Pay </b>");
                strHTMLBuilder.Append("</Font> ");
                strHTMLBuilder.Append("</td >");

                strHTMLBuilder.Append("<td  align = 'right' style='display: inline-block; border: 1px solid lightgray; ' >");
                strHTMLBuilder.Append("<Font face = 'Arial'  size = '1' > ");
                strHTMLBuilder.Append("<b>");
                strHTMLBuilder.Append(decimal.Round(Convert.ToDecimal(frstOrDflt.NetPayment), 2).ToString());
                strHTMLBuilder.Append("</b>");
                strHTMLBuilder.Append("</Font> ");
                strHTMLBuilder.Append("</td >");

                strHTMLBuilder.Append("</tr >");



                //Close tags.  
                strHTMLBuilder.Append("</table>");
                strHTMLBuilder.Append("</P>");

                #endregion

                strHTMLBuilder.Append("</div>");
                strHTMLBuilder.Append("</body>");
                strHTMLBuilder.Append("</html>");

                string Htmltext = strHTMLBuilder.ToString();

                return Htmltext;
            }
        }

        public static void CreateAttachments(int periodId)
        {
            using (ENTRO_MISEntities erpEntities = new ENTRO_MISEntities())
            {
                var m_payTrans = new List<PrlTransactions>();

                if (SCriteria.GroupsId.Count > 0 && SCriteria.GroupsId[0] != 0)
                    m_payTrans = erpEntities.PrlTransactions.Where(p => p.PeriodId == periodId & SCriteria.GroupsId.Contains(p.EmpId)).ToList();
                else
                    m_payTrans = erpEntities.PrlTransactions.Where(p => p.PeriodId == periodId).ToList();

                _context = new ENTRO_MISEntities(Constants.ConnectionString);
                _payrollSettings = new PayrollSettings(_context);

                foreach (var trans in m_payTrans)
                {


                    string topTable = CreateTopTable(trans.EmpId, periodId);
                    string bottomTable = CreateBottomTable(trans.EmpId, periodId);

                    StringBuilder strHTMLBuilder = new StringBuilder();
                    strHTMLBuilder.Append(topTable);
                    strHTMLBuilder.Append("<p>");
                    strHTMLBuilder.Append(bottomTable);

                    string Htmltext = strHTMLBuilder.ToString();

                    string filePath = _payrollSettings.Get(Constants.EmailPath).SettingValue ; 
                    string fileName = trans.PrlEmployees.IdentityNo + "_" + trans.PrlPeriod.Name + "_" +
                                      trans.PrlPeriod.FiscalYear;

                    string file = filePath + fileName + ".html";
                    if (File.Exists(file))
                    {
                        File.Delete(file);
                    }

                    StreamWriter SW;
                    SW = File.AppendText(file);

                    SW.WriteLine(Htmltext + Environment.NewLine);
                    SW.Close();
                }

            }
        }

        public static void WorkThread()
        {
            

        }
        public static void SendEmail()
        {
            CreateAttachments(PeriodID);
            _context = new ENTRO_MISEntities(Constants.ConnectionString);
            _payrollSettings = new PayrollSettings(_context);
            _payrolltransactions = new PayrollTransactions(_context);
            
            string senderAddress = "";
            string senderPassword = "";
            string reciverAddress = "";
            string senderUName = _payrollSettings.Get(Constants.EmailUserName).SettingValue; 
            string filePath =  _payrollSettings.Get(Constants.EmailPath).SettingValue; 
            senderAddress = _payrollSettings.Get(Constants.EmailSenderAddress).SettingValue;
            senderPassword = _payrollSettings.Get(Constants.EmailPassword).SettingValue;
                    
            string smtpServer = _payrollSettings.Get(Constants.EmailSMTPServer).SettingValue;
            string subject = _payrollSettings.Get(Constants.EmailSubject).SettingValue;

            IEnumerable<PrlTransactions> m_payTrans;

            if (SCriteria.GroupsId.Count > 0 && SCriteria.GroupsId[0] != 0)
                m_payTrans = _payrolltransactions.GetAll().Where(p => p.PeriodId == PeriodID & SCriteria.GroupsId.Contains(p.EmpId));
            else
                m_payTrans = _payrolltransactions.GetAll().Where(p => p.PeriodId == PeriodID);



            DataTable dt_RecipientsList = new DataTable();

            dt_RecipientsList.Columns.Add("Recipient");
            dt_RecipientsList.Columns.Add("FilePath");
            dt_RecipientsList.Columns.Add("Body");

            foreach (var trans in m_payTrans)
            {
                string fileName = trans.PrlEmployees.IdentityNo + "_" + trans.PrlPeriod.Name + "_" +
                                    trans.PrlPeriod.FiscalYear;

                string file = filePath + fileName + ".html";
                //string body = "Pay Slip for the month of " + trans.PrlPeriod.Name + ", " + trans.PrlPeriod.FiscalYear;
                string body = "<p>Dear Colleague,</p> <p>Please find attached Pay Slip for the month of " + trans.PrlPeriod.Name + ".</p> <p>Very Best,</p> <p>Lift Finance Team.</p>";
    

                PrlEmployees employeeObj = new PrlEmployees();
                employeeObj = trans.PrlEmployees;

                if (trans.PrlEmployees.Email != null)
                {
                    if (trans.PrlEmployees.Email.Trim() != "")
                        dt_RecipientsList.Rows.Add(trans.PrlEmployees.Email, file, body);
                }
                   
                
            }

            foreach (DataRow dr in dt_RecipientsList.Rows)
            {
                if (dr != null)
                    SendEmail(senderAddress, dr["Recipient"].ToString(), subject, dr["Body"].ToString(), dr["FilePath"].ToString(), smtpServer, senderUName, senderPassword);

            }
            ////Using Parallel Multi-Threading send multiple bulk email.
            //Parallel.ForEach(dt_RecipientsList.AsEnumerable(), row =>
            //{
            //    if (row != null)
            //        SendEmail(senderAddress, row["Recipient"].ToString(), subject, row["Body"].ToString(), row["FilePath"].ToString(), smtpServer, senderAddress, senderPassword);
            //});  

          
        }

        private static bool SendEmail(string sender, string recipient, string subject, string body, string filePath, string smtpServer, string uName, string pWord)
        {
            try
            {
                MailMessage mail = new MailMessage();
                SmtpClient SmtpServer = new SmtpClient(smtpServer);

                mail.From = new MailAddress(sender);
                mail.To.Add(recipient);
                mail.Subject = subject;
                mail.Body = body;
                mail.IsBodyHtml = true;
                mail.Attachments.Add(new Attachment(filePath));
                SmtpServer.Port = 587;
                SmtpServer.Credentials = new System.Net.NetworkCredential(uName, pWord);
                SmtpServer.EnableSsl = true;

                SmtpServer.Send(mail);
                
            }
            catch (Exception)
            {
                
            }
            return true;
        }
    } 
}