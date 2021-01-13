namespace MRV.Business.GHG
{
    using System;
    using System.Linq.Expressions;
    using System.Collections.Generic;
    using System.Data.Objects;
    using MRV.Data.Infrastructure;
    using MRV.Data.Model;


    public class BizGHGLocationTypes
    {
        #region Members

        /// <summary>
        /// Manage GHGLocationTypes
        /// </summary>
        private readonly IRepository<GHGLocationTypes> _repository;

        #endregion

        #region Constructor

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="objectContext"></param>
        public BizGHGLocationTypes(ObjectContext objectContext)
        {
            _repository = new Repository<GHGLocationTypes>(objectContext, true);
        }

        #endregion

        #region Methods

        /// <summary>
        /// Gets GHGLocationTypes by id
        /// </summary>
        /// <param name="id">GHGLocationTypes id</param>
        /// <returns>A single GHGLocationTypes</returns>
        public GHGLocationTypes Get(int id)
        {

            return _repository.Single(o => o.Id.Equals(id) & o.IsDeleted == false);
        }
        
        public GHGLocationTypes GetRecord(int id)
        {
            return _repository.Single(o => o.Id.Equals(id));
        }

        /// <summary>
        /// Gets all GHGLocationTypes
        /// </summary>
        /// <returns>IEnumerable of GHGLocationTypes</returns>
        public IEnumerable<GHGLocationTypes> GetAll()
        {
            return _repository.Find(i => i.IsDeleted == false);
        }

        /// <summary>
        /// Gets all GHGLocationTypes as paged
        /// </summary>
        /// <param name="page">page number</param>
        /// <param name="pageSize">page size</param>
        /// <returns>IEnumerable of GHGLocationTypes</returns>
        public IEnumerable<GHGLocationTypes> GetAll(int page, int pageSize)
        {
            return _repository.GetAll(page, pageSize);
        }

        /// <summary>
        /// Finds GHGLocationTypes based on the given predicate
        /// </summary>
        /// <param name="predicate">where clause</param>
        /// <returns>A single GHGLocationTypes</returns>
        public GHGLocationTypes Find(Expression<Func<GHGLocationTypes, bool>> predicate)
        {
            return _repository.First(predicate);
        }

        /// <summary>
        /// Finds GHGLocationTypes based on the given predicate
        /// </summary>
        /// <param name="predicate">where clause</param>
        /// <returns>IEnumerable of GHGLocationTypes</returns>
        public IEnumerable<GHGLocationTypes> FindAll(Expression<Func<GHGLocationTypes, bool>> predicate)
        {
            return _repository.Find(predicate);
        }

        /// <summary>
        /// Adds a new GHGLocationTypes
        /// </summary>
        /// <param name="GHGLocationTypes">GHGLocationTypes</param>
        /// <param name="saveChanges">saveChanges</param>
        public void AddNew(GHGLocationTypes GHGLocationTypes)
        {
            
            _repository.Add(GHGLocationTypes);
            SaveChanges();
        }

        /// <summary>
        /// Edits a loaded GHGLocationTypes
        /// </summary>
        /// <param name="GHGLocationTypes">GHGLocationTypes</param>
        /// <param name="saveChanges">saveChanges</param>
        public void Edit(GHGLocationTypes GHGLocationTypes)
        {
            _repository.Edit(GHGLocationTypes);
            SaveChanges();
        }

        /// <summary>
        /// Deletes GHGLocationTypes by id
        /// </summary>
        /// <param name="id">GHGLocationTypes id</param>
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
        /// DeleteRelatedEntities a loaded GHGLocationTypes
        /// </summary>
        /// <param name="GHGLocationTypes">GHGLocationTypes</param>
        /// <param name="saveChanges">saveChanges</param>
        public void DeleteRelatedEntities(GHGLocationTypes GHGLocationTypes)
        {
            GHGLocationTypes.IsDeleted = true;
           
            _repository.Edit(GHGLocationTypes);
            SaveChanges();
        }

        /// <summary>
        /// Gets GHGLocationTypes count
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
