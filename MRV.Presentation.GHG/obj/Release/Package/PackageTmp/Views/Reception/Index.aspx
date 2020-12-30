<%@ Page Language="C#" Inherits="System.Web.Mvc.ViewPage" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head id="Head1" runat="server">
    <title>Financial Management System</title>
    <link type="text/css" href="<% = Url.Content("~/Content/css/ext-all.css") %>" rel="Stylesheet" />

    <link type="text/css" href="<% = Url.Content("~/Content/css/app/main.css") %>" rel="Stylesheet" />
    <link type="text/css" href="<% = Url.Content("~/Content/css/app/icons.css") %>" rel="Stylesheet" />
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/ext-base.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/ext-all.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/tab-close-menu.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/CheckColumn.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/ux-util.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/array-tree.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/SystemMessage.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/SystemMessageManager.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Login.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Logout.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Reception.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Entry.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Direct/Api") %>"></script>
</head>
<body class='reception-body'>
    <form id="Form1" runat="server">
        <asp:ScriptManager ID="ScriptManagerMain" runat="server" EnableScriptGlobalization="true">
            
        </asp:ScriptManager>
    </form>    
</body>
</html>