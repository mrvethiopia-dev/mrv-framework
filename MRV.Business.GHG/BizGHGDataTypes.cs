namespace MRV.Business.GHG
{
    using System;
    using System.Linq.Expressions;
    using System.Collections.Generic;
    using System.Data.Objects;
    using MRV.Data.Infrastructure;
    using MRV.Data.Model;


    public class BizGHGDataTypes
    {
        #region Members

        /// <summary>
        /// Manage GHGDataTypes
        /// </summary>
        private readonly IRepository<GHGDataTypes> _repository;

        #endregion

        #region Constructor

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="objectContext"></param>
        public BizGHGDataTypes(ObjectContext objectContext)
        {
            _repository = new Repository<GHGDataTypes>(objectContext, true);
        }

        #endregion

        #region Methods

        /// <summary>
        /// Gets GHGDataTypes by id
        /// </summary>
        /// <param name="id">GHGDataTypes id</param>
        /// <returns>A single GHGDataTypes</returns>
        public GHGDataTypes Get(int id)
        {

            return _repository.Single(o => o.Id.Equals(id) & o.IsDeleted == false);
        }
        
        public GHGDataTypes GetRecord(int id)
        {
            return _repository.Single(o => o.Id.Equals(id));
        }

        /// <summary>
        /// Gets all GHGDataTypes
        /// </summary>
        /// <returns>IEnumerable of GHGDataTypes</returns>
        public IEnumerable<GHGDataTypes> GetAll()
        {
            return _repository.Find(i => i.IsDeleted == false);
        }

        /// <summary>
        /// Gets all GHGDataTypes as paged
        /// </summary>
        /// <param name="page">page number</param>
        /// <param name="pageSize">page size</param>
        /// <returns>IEnumerable of GHGDataTypes</returns>
        public IEnumerable<GHGDataTypes> GetAll(int page, int pageSize)
        {
            return _repository.GetAll(page, pageSize);
        }

        /// <summary>
        /// Finds GHGDataTypes based on the given predicate
        /// </summary>
        /// <param name="predicate">where clause</param>
        /// <returns>A single GHGDataTypes</returns>
        public GHGDataTypes Find(Expression<Func<GHGDataTypes, bool>> predicate)
        {
            return _repository.First(predicate);
        }

        /// <summary>
        /// Finds GHGDataTypes based on the given predicate
        /// </summary>
        /// <param name="predicate">where clause</param>
        /// <returns>IEnumerable of GHGDataTypes</returns>
        public IEnumerable<GHGDataTypes> FindAll(Expression<Func<GHGDataTypes, bool>> predicate)
        {
            return _repository.Find(predicate);
        }

        /// <summary>
        /// Adds a new GHGDataTypes
        /// </summary>
        /// <param name="GHGDataTypes">GHGDataTypes</param>
        /// <param name="saveChanges">saveChanges</param>
        public void AddNew(GHGDataTypes GHGDataTypes)
        {
            
            _repository.Add(GHGDataTypes);
            SaveChanges();
        }

        /// <summary>
        /// Edits a loaded GHGDataTypes
        /// </summary>
        /// <param name="GHGDataTypes">GHGDataTypes</param>
        /// <param name="saveChanges">saveChanges</param>
        public void Edit(GHGDataTypes GHGDataTypes)
        {
            _repository.Edit(GHGDataTypes);
            SaveChanges();
        }

        /// <summary>
        /// Deletes GHGDataTypes by id
        /// </summary>
        /// <param name="id">GHGDataTypes id</param>
        public void Delete(int id)
        {
            var objItem = _repository.Single(i => i.Id == id);
            if (null != objItem)
            {
                objItem.IsDeleted = true;

                this.SaveChanges();
            }
        }

        /// <summary>
        /// DeleteRelatedEntities a loaded GHGDataTypes
        /// </summary>
        /// <param name="GHGDataTypes">GHGDataTypes</param>
        /// <param name="saveChanges">saveChanges</param>
        public void DeleteRelatedEntities(GHGDataTypes GHGDataTypes)
        {
            GHGDataTypes.IsDeleted = true;
           
            _repository.Edit(GHGDataTypes);
            SaveChanges();
        }

        /// <summary>
        /// Gets GHGDataTypes count
        /// </summary>
        /// <returns>count of entities</returns>
        public int Count()
        {
            return _repository.Count();
        }

        /// <summary>
        /// Save the object context
        /// </summary>
        public void SaveChanges()
        {
            _repository.SaveChanges();
        }

        #endregion
    }
}
