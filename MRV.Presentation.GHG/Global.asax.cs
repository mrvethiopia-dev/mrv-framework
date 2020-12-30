using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using MRV.Presentation.GHG.Classes;
using System.Globalization;

namespace NBI.Presentation.Tsa
{
     //Note: For instructions on enabling IIS6 or IIS7 classic mode, 
     //visit http://go.microsoft.com/?LinkId=9394801

    public class MvcApplication : System.Web.HttpApplication
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");
            routes.IgnoreRoute("{*allaspx}", new { allaspx = @".*(CrystalImageHandler).*" }); //This is required for crystal report runtime image view

            routes.MapRoute(
                "Default", // Route name
                "{controller}/{action}/{id}", // URL with parameters
                new { controller = "Reception", action = "Index", id = UrlParameter.Optional } // Parameter defaults
            );

        }

        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            RegisterRoutes(RouteTable.Routes);
            Constants.ConnectionString = ConfigReader.GetConnectionString("ENTRO_MISEntities");
        }

        protected void Application_AcquireRequestState(object sender, EventArgs e)
        {
            if (HttpContext.Current.Session != null)
            {
                CultureInfo ci = (CultureInfo)this.Session[Constants.CurrentCulture];
                if (ci == null)
                {
                    string langName = Constants.DefaultLanguage;
                    if (HttpContext.Current.Request.UserLanguages != null && HttpContext.Current.Request.UserLanguages.Length != 0)
                    {
                        langName = HttpContext.Current.Request.UserLanguages[0].Substring(0, 2);
                    }
                    ci = new CultureInfo(langName);
                    Session[Constants.CurrentCulture] = ci;
                }
                System.Threading.Thread.CurrentThread.CurrentUICulture = ci;
                System.Threading.Thread.CurrentThread.CurrentCulture = CultureInfo.CreateSpecificCulture(ci.Name);
            }
        }

        protected void Session_Start()
        {
            Session.Timeout = 900;
            //Session.Timeout = 30;
            Session[Constants.CurrentUser] = null;
            Session[Constants.CurrentSubsystem] = null;
            Session[Constants.UserPermission] = null;
        }

        protected void Session_End()
        {
            Session[Constants.CurrentUser] = null;
            Session[Constants.CurrentSubsystem] = null;
            Session[Constants.UserPermission] = null;
        }
    }
}