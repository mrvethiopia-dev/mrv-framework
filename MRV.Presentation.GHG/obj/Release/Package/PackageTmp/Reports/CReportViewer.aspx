<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="CReportViewer.aspx.cs" Inherits="NBI.Presentation.Tsa.Reports.CReportViewer" EnableViewState="true" %>

<%@ Register Assembly="CrystalDecisions.Web, Version=13.0.2000.0, Culture=neutral, PublicKeyToken=692fbea5521e1304"
Namespace="CrystalDecisions.Web" TagPrefix="CR" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
  <title>CoreFinance - Report</title> 
  <link type="text/css" href="~/Content/css/reportviewer.css" rel="Stylesheet" />
 
</head>
<body>
    <form id="form1" runat="server">
       
        <asp:Panel runat="server" ID="pnlReport" >
            
            <CR:CrystalReportViewer ID="reportViewer" runat="server" AutoDataBind="true" 
                ToolPanelView="None" Width="350px" Height="50px" PrintMode="ActiveX" 
                    HasPrintButton="False"  />
                
        </asp:Panel>
    </form>
</body>
</html>
