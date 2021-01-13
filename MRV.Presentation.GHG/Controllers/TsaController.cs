using System.Collections;
using System.Collections.Generic;
using System.Data.Objects;
using System.Linq;
using System.Net;
using System.Security.Cryptography.X509Certificates;
using System.Transactions;
using System.Web.Mvc;
using MRV.Business.GHG;
using MRV.Data.Infrastructure;
using MRV.Presentation.GHG.Classes;
using MRV.Data.Model;
using Ext.Direct.Mvc;
using Newtonsoft.Json;
using System;
using System.Text;
using MRV.Presentation.GHG.Controllers;

namespace MRV.Presentation.GHG.Controllers
{
    public class TsaController : Controller
    {
        #region Members

        private readonly Lookups _lookup;
        private readonly ObjectContext _context;
        
        private readonly Roles _roles;
        private readonly Systems _systems;
        private readonly Menus _menus;
        private readonly BizGHGLocationTypes _locationTypes;
        private readonly SearchCriteria SC = new SearchCriteria();
        
        #endregion

        #region Constructor

        public TsaController()
        {
            
            _context = new ENTRO_MISEntities(Constants.ConnectionString);
            _lookup = new Lookups(_context);
            _locationTypes = new BizGHGLocationTypes(_context);
            _roles = new Roles(_context);
            _systems = new Systems(_context);
            _menus = new Menus(_context);
            
            
        }

        #endregion

        #region Actions
       
        private DirectResult Search(string table)
        {
            return this.Direct(new { });
        }

        
        #endregion

        #region Methods 
          
        #endregion 

        #region Lookups
          

        private DirectResult GetAll(string table)
        {
            var filtered = _lookup.GetAll(table).Where(e=> e.IsDeleted == false);
            var lookup = filtered.Select(a => new { a.Id, a.Code, a.Name, CodeAndName = string.Format("{0} - {1}", a.Code, a.Name) }).Cast<object>().ToList();
            var result = new
            {
                total = lookup.Count(),
                data = lookup
            };
            return this.Direct(result);
        }
             
        private DirectResult GetAllGuid(string table)
        {
            var filtered = _lookup.GetAllGuid(table);
            var lookup = filtered.Select(a => new { a.Id, a.Name, a.Code, CodeAndName = string.Format("{0} - {1}", a.Code, a.Name) }).Cast<object>().ToList();
            var result = new
            {
                total = lookup.Count(),
                data = lookup
            };
            return this.Direct(result);
        }
        
        
        public DirectResult OpenPDFHelp()
        {
            try
            {
                string filePath = @"D:\BProjects\Cyber\LIFT\App\NBI.Presentation.Tsa\Content\Help\UserManual.pdf"; //Server.MapPath(@"Content\Help\UserManual.pdf");
                WebClient User = new WebClient();
                Byte[] fileBuffer = User.DownloadData(filePath);
                if (fileBuffer != null)
                {
                    //Response.ContentType = "application/pdf";
                    Response.AddHeader("content-length", fileBuffer.Length.ToString());
                    Response.BinaryWrite(fileBuffer);

                }
                return this.Direct(new { success = true, data = "" });
            }
            catch (Exception exception)
            {
                return this.Direct(new { success = false, data = exception.Message });
            }
        }
      
        public ActionResult GetRolesAndSystems()
        {
            var filteredRoles = _roles.GetAll();
            var filteredSystems = _systems.GetAll();
            var secRoles = filteredRoles as IList<sysRole> ?? filteredRoles.ToList();
            var countRoles = secRoles.Count();
            var secSubsystems = filteredSystems as IList<sysSystems> ?? filteredSystems.ToList();
            var countSubsystems = secSubsystems.Count();
            var roles = secRoles.Select(s => new { s.Id, s.Name }).Cast<object>().ToList();
            var subsystems = secSubsystems.Select(s => new { s.Id, s.Name }).Cast<object>().ToList();
            var result = new
            {
                countRoles,
                countSubsystems,
                roles,
                subsystems
            };
            return this.Direct(result);
        }

        public ActionResult GetSystems()
        {
            var filtered = _systems.GetAll();
            var secSubsystems = filtered as IList<sysSystems> ?? filtered.ToList();
            var count = secSubsystems.Count();
            var systems = secSubsystems.Select(s => new { s.Id, s.Name }).Cast<object>().ToList();
            var result = new
            {
                total = count,
                data = systems
            };
            return this.Direct(result);
        }

        public ActionResult GetMenus(string systemId)
        {
            int id;
            int.TryParse(systemId, out id);
            var filtered = _menus.FindAll(a => a.SystemId.Equals(id));
            var secModules = filtered as IList<sysMenus> ?? filtered.ToList();
            var count = secModules.Count();
            var modules = secModules.Select(item => new { item.Id, item.Name }).Cast<object>().ToList();
            var result = new
            {
                total = count,
                data = modules
            };
            return this.Direct(result);
        }

        public ActionResult GetLocationTypes()
        {
            var filtered = _locationTypes.GetAll().Where(e => e.IsDeleted == false);
            var lookup = filtered.Select(a => new { a.Id, a.Name }).Cast<object>().ToList();
            var result = new
            {
                total = lookup.Count(),
                data = lookup
            };
            return this.Direct(result);
        }
        #endregion
    }

    public static class ExtensionMethod
    {
        public static bool psContains(this string source, string toCheck, StringComparison comp)
        {
            return source != null && toCheck != null && source.IndexOf(toCheck, comp) >= 0;
        }
    }

    public  class NAClass
    {
        public string Code { get; set; }
        public string Name { get; set; }
    }
}