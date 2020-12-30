using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MRV.Presentation.GHG.Classes
{
    public class Permission
    {
        public string User { get; set; }
        public string Role { get; set; }
        public string Operation { get; set; }
        public bool CanAdd { get; set; }
        public bool CanEdit { get; set; }
        public bool CanDelete { get; set; }
        public bool CanView { get; set; }
        public bool CanApprove { get; set; }
        public bool CanCheck { get; set; }
        public bool CanAuthorize { get; set; }
        
    }
}