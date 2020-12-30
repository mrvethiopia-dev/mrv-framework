<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="CReportVoucherViewer.aspx.cs" Inherits="NBI.Presentation.Tsa.Reports.CReportVoucherViewer" EnableViewState="true" %>

<%@ Register Assembly="CrystalDecisions.Web, Version=13.0.2000.0, Culture=neutral, PublicKeyToken=692fbea5521e1304"
Namespace="CrystalDecisions.Web" TagPrefix="CR" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>CoreFinance - Report</title> 
    <link type="text/css" href="~/Content/css/Footer.css" rel="Stylesheet" />
  <link type="text/css" href="~/Content/css/reportviewer.css" rel="Stylesheet" />
     <script type="text/javascript">
         function Print() {
             var dvReport = document.getElementById("dvReport");
             var frame1 = dvReport.getElementsByTagName("iframe")[0];
             if (navigator.appName.indexOf("Internet Explorer") != -1 || navigator.appVersion.indexOf("Trident") != -1) {
                 frame1.name = frame1.id;
                 window.frames[frame1.id].focus();
                 window.frames[frame1.id].print();
             } else {
                 var frameDoc = frame1.contentWindow ? frame1.contentWindow : frame1.contentDocument.document ? frame1.contentDocument.document : frame1.contentDocument;
                 frameDoc.print();
             }
         }  
</script>  
</head>
<body>
    
    <form id="form1" runat="server">
         <input id="btnPrint" type="button" value="Print" onclick="Print()" />  
         <div id="dvReport">  
            <CR:CrystalReportViewer ID="reportViewer" runat="server" AutoDataBind="true" 
                ToolPanelView="None" Width="350px" Height="50px" PrintMode="ActiveX" 
                    HasPrintButton="False" SeparatePages="False"  />
                    </div>  
    </form>
    
</body>
</html>
