namespace MRV.Business.GHG
{
    using System;
    using System.Linq.Expressions;
    using System.Collections.Generic;
    using System.Data.Objects;
    using MRV.Data.Infrastructure;
    using MRV.Data.Model;


    public class BizGHGParameters
    {
        #region Members

        /// <summary>
        /// Manage GHGParameters
        /// </summary>
        private readonly IRepository<GHGParameters> _repository;

        #endregion

        #region Constructor

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="objectContext"></param>
        public BizGHGParameters(ObjectContext objectContext)
        {
            _repository = new Repository<GHGParameters>(objectContext, true);
        }

        #endregion

        #region Methods

        /// <summary>
        /// Gets GHGParameters by id
        /// </summary>
        /// <param name="id">GHGParameters id</param>
        /// <returns>A single GHGParameters</returns>
        public GHGParameters Get(int id)
        {

            return _repository.Single(o => o.Id.Equals(id) & o.IsDeleted == false);
        }
        
        public GHGParameters GetRecord(int id)
        {
            return _repository.Single(o => o.Id.Equals(id));
        }

        /// <summary>
        /// Gets all GHGParameters
        /// </summary>
        /// <returns>IEnumerable of GHGParameters</returns>
        public IEnumerable<GHGParameters> GetAll()
        {
            return _repository.Find(i => i.IsDeleted == false);
        }

        /// <summary>
        /// Gets all GHGParameters as paged
        /// </summary>
        /// <param name="page">page number</param>
        /// <param name="pageSize">page size</param>
        /// <returns>IEnumerable of GHGParameters</returns>
        public IEnumerable<GHGParameters> GetAll(int page, int pageSize)
        {
            return _repository.GetAll(page, pageSize);
        }

        /// <summary>
        /// Finds GHGParameters based on the given predicate
        /// </summary>
        /// <param name="predicate">where clause</param>
        /// <returns>A single GHGParameters</returns>
        public GHGParameters Find(Expression<Func<GHGParameters, bool>> predicate)
        {
            return _repository.First(predicate);
        }

        /// <summary>
        /// Finds GHGParameters based on the given predicate
        /// </summary>
        /// <param name="predicate">where clause</param>
        /// <returns>IEnumerable of GHGParameters</returns>
        public IEnumerable<GHGParameters> FindAll(Expression<Func<GHGParameters, bool>> predicate)
        {
            return _repository.Find(predicate);
        }

        /// <summary>
        /// Adds a new GHGParameters
        /// </summary>
        /// <param name="GHGParameters">GHGParameters</param>
        /// <param name="saveChanges">saveChanges</param>
        public void AddNew(GHGParameters GHGParameters)
        {
            
            _repository.Add(GHGParameters);
            SaveChanges();
        }

        /// <summary>
        /// Edits a loaded GHGParameters
        /// </summary>
        /// <param name="GHGParameters">GHGParameters</param>
        /// <param name="saveChanges">saveChanges</param>
        public void Edit(GHGParameters GHGParameters)
        {
            _repository.Edit(GHGParameters);
            SaveChanges();
        }

        /// <summary>
        /// Deletes GHGParameters by id
        /// </summary>
        /// <param name="id">GHGParameters id</param>
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
        /// DeleteRelatedEntities a loaded GHGParameters
        /// </summary>
        /// <param name="GHGParameters">GHGParameters</param>
        /// <param name="saveChanges">saveChanges</param>
        public void DeleteRelatedEntities(GHGParameters GHGParameters)
        {
            GHGParameters.IsDeleted = true;
           
            _repository.Edit(GHGParameters);
            SaveChanges();
        }

        /// <summary>
        /// Gets GHGParameters count
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
