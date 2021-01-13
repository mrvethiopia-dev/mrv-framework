namespace MRV.Business.GHG
{
    using System;
    using System.Linq.Expressions;
    using System.Collections.Generic;
    using System.Data.Objects;
    using MRV.Data.Infrastructure;
    using MRV.Data.Model;


    public class BizGHGTypes
    {
        #region Members

        /// <summary>
        /// Manage GHGTypes
        /// </summary>
        private readonly IRepository<GHGTypes> _repository;

        #endregion

        #region Constructor

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="objectContext"></param>
        public BizGHGTypes(ObjectContext objectContext)
        {
            _repository = new Repository<GHGTypes>(objectContext, true);
        }

        #endregion

        #region Methods

        /// <summary>
        /// Gets GHGTypes by id
        /// </summary>
        /// <param name="id">GHGTypes id</param>
        /// <returns>A single GHGTypes</returns>
        public GHGTypes Get(int id)
        {

            return _repository.Single(o => o.Id.Equals(id) & o.IsDeleted == false);
        }
        
        public GHGTypes GetRecord(int id)
        {
            return _repository.Single(o => o.Id.Equals(id));
        }

        /// <summary>
        /// Gets all GHGTypes
        /// </summary>
        /// <returns>IEnumerable of GHGTypes</returns>
        public IEnumerable<GHGTypes> GetAll()
        {
            return _repository.Find(i => i.IsDeleted == false);
        }

        /// <summary>
        /// Gets all GHGTypes as paged
        /// </summary>
        /// <param name="page">page number</param>
        /// <param name="pageSize">page size</param>
        /// <returns>IEnumerable of GHGTypes</returns>
        public IEnumerable<GHGTypes> GetAll(int page, int pageSize)
        {
            return _repository.GetAll(page, pageSize);
        }

        /// <summary>
        /// Finds GHGTypes based on the given predicate
        /// </summary>
        /// <param name="predicate">where clause</param>
        /// <returns>A single GHGTypes</returns>
        public GHGTypes Find(Expression<Func<GHGTypes, bool>> predicate)
        {
            return _repository.First(predicate);
        }

        /// <summary>
        /// Finds GHGTypes based on the given predicate
        /// </summary>
        /// <param name="predicate">where clause</param>
        /// <returns>IEnumerable of GHGTypes</returns>
        public IEnumerable<GHGTypes> FindAll(Expression<Func<GHGTypes, bool>> predicate)
        {
            return _repository.Find(predicate);
        }

        /// <summary>
        /// Adds a new GHGTypes
        /// </summary>
        /// <param name="GHGTypes">GHGTypes</param>
        /// <param name="saveChanges">saveChanges</param>
        public void AddNew(GHGTypes GHGTypes)
        {
            
            _repository.Add(GHGTypes);
            SaveChanges();
        }

        /// <summary>
        /// Edits a loaded GHGTypes
        /// </summary>
        /// <param name="GHGTypes">GHGTypes</param>
        /// <param name="saveChanges">saveChanges</param>
        public void Edit(GHGTypes GHGTypes)
        {
            _repository.Edit(GHGTypes);
            SaveChanges();
        }

        /// <summary>
        /// Deletes GHGTypes by id
        /// </summary>
        /// <param name="id">GHGTypes id</param>
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
        /// DeleteRelatedEntities a loaded GHGTypes
        /// </summary>
        /// <param name="GHGTypes">GHGTypes</param>
        /// <param name="saveChanges">saveChanges</param>
        public void DeleteRelatedEntities(GHGTypes GHGTypes)
        {
            GHGTypes.IsDeleted = true;
           
            _repository.Edit(GHGTypes);
            SaveChanges();
        }

        /// <summary>
        /// Gets GHGTypes count
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
