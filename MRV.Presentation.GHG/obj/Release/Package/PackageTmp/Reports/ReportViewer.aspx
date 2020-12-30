<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="ReportViewer.aspx.cs" Inherits="NBI.Presentation.Tsa.Reports.ReportViewer" %>

<%@ Register assembly="Microsoft.ReportViewer.WebForms, Version=10.0.0.0, Culture=neutral, PublicKeyToken=b03f5f7f11d50a3a" 
namespace="Microsoft.Reporting.WebForms" tagprefix="rsweb" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <link type="text/css" href="~/Content/css/reportViewer.css" rel="Stylesheet" />
</head>
<body style="height: 821px">
    <form id="form1" runat="server">
    <div style="height: 801px; width: 1073px;">
    
        <asp:ScriptManager ID="ScriptManager1" runat="server">
        </asp:ScriptManager>
    
        <rsweb:ReportViewer ID="rv_reportViewer" runat="server" AsyncRendering="False"  Width="100%" 
        Height="100%" ShowCredentialPrompts="False" 
        ShowParameterPrompts="False" 
        SizeToReportContent="True" BackColor="#E8E8E8">
            
        </rsweb:ReportViewer>
    
    </div>
    </form>
</body>
</html>
