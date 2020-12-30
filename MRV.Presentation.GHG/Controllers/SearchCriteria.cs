namespace MRV.Presentation.GHG.Classes
{
    using System;
using System.Collections.Generic;


    [AttributeUsage(AttributeTargets.All)]
    public class SearchCriteria : Attribute
    {
        public string RptName = String.Empty;
        public string BatchId = String.Empty;
        public int RptPeriodId = new int();
        public int RptPeriodToId = new int();
        public int RptPayrollItemId = new int();
        public DateTime StartDate = DateTime.Now;
        public DateTime EndDate = DateTime.Now;
        public int ProjectId = new int();

        public string GroupName = String.Empty; 
        public IList<int> GroupsId;
        public string FilterBy = String.Empty;
        public int RptBankBranchId = new int();
        public int RptBankId = new int();
        //public int LocationId =  new int();
        public int RptPeriodTwoId = new int();
    }
}
