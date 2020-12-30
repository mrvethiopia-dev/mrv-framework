using System;
using System.Collections.Generic;
using System.Data.Objects;
using System.Linq;
using System.Web;
using MRV.Business.GHG;
using MRV.Data.Model;

namespace MRV.Presentation.GHG.Classes
{
    public class Utils
    {
        
        private readonly ObjectContext _context;
        
       
        
        private readonly Lookups _lookup;
       
       
        public Utils()
        {
            _context = new ENTRO_MISEntities(Constants.ConnectionString);            
            _lookup = new Lookups(_context);           
            
        }
        
        public static string InSingleQuoteAndBrace(string paramString)
        {
            if (paramString == "")
            {
                return (char)39 + "" + (char)39;
            }
            else
            {
                return (char)39 + "{" + paramString + "}" + (char)39;
            }

        }

        public static string InSingleQuote(string paramString)
        {
            if (paramString == "")
            {
                return (char)39 + "" + (char)39;
            }
            else
            {
                return (char)39 + paramString + (char)39;
            }

        }
        
    }

    

    public class ChangePassword
    {
        public string NewPassword
        {
            get;
            set;
        }

        public string OldPassword
        {
            get;
            set;
        }

        public string ConfirmPassword
        {
            get;
            set;
        }
    }
}