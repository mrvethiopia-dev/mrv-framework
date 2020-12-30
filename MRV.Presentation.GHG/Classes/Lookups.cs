using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using MRV.Data.Infrastructure;
using System.Data.Objects;
namespace MRV.Presentation.GHG.Classes
{
    public class Lookups
    {
        private readonly Repository _repository;

        public Lookups(ObjectContext objectContext)
        {
            this._repository = new Repository(objectContext);
        }

        public void AddNew(Lookup lookup, string table)
        {
            this._repository.Add(lookup, table);
        }

        public void Delete(int id, string table)
        {
            this._repository.Delete(id, table);
        }

        public void Edit(Lookup lookup, string table)
        {
            this._repository.Edit(lookup, table);
        }

        public Lookup Get(int id, string table)
        {
            return this._repository.Get(id, table);
        }

        public IEnumerable<Lookup> GetAll(string table)
        {
            return this._repository.GetAll(table);
        }

        public IEnumerable<GuidLookup> GetAllGuid(string table)
        {
            return this._repository.GetAllGuid(table);
        }

        public IEnumerable<Lookup> GetAll(int start, int limit, string table)
        {
            return this._repository.GetAll(start, limit, table);
        }
    }
}