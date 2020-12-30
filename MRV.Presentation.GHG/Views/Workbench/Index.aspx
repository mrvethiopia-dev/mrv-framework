<%@ Page Language="C#" Inherits="System.Web.Mvc.ViewPage" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head id="Head1" runat="server">
    <title>MRV System</title>
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



    <script type="text/javascript" src="<% = Url.Content("~/Scripts/ChangePassword.js") %>"></script>


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
 

    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Exporter-all.js") %>"></script>
    
      <script type="text/javascript" src="<% = Url.Content("~/Scripts/MultiSelect.js") %>"></script>
     
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/GridPrinter.js") %>"></script>
    

</head>
<body>
    <form id="Form1" runat="server">
        <asp:ScriptManager ID="ScriptManagerMain" runat="server" EnableScriptGlobalization="true">
            
        </asp:ScriptManager>
    </form>    
</body>
</html>