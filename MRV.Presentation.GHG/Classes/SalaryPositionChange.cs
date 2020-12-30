using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace NBI.Presentation.Tsa.Classes
{
    public class SalaryPositionChange
    {        
        public int Id
        {
            get;
            set;
        }

        public int EmpId
        {
            get;
            set;
        }

        public string ChangeType
        {
            get;
            set;
        }

        public int NewPositionId
        {
            get;
            set;
        }
        public string NewBaseCurrency
        {
            get;
            set;
        }
        public decimal NewSalaryETB
        {
            get;
            set;
        }
        public decimal NewSalaryGBP
        {
            get;
            set;
        }

        public DateTime EffectiveDate
        {
            get;
            set;
        }
        public int EffectivePeriodId
        {
            get;
            set;
        }
        public string Reason
        {
            get;
            set;
        }

        public bool? IsFromBSC
        {
            get;
            set;
        }
            
    }
}