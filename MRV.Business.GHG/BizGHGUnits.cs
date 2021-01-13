namespace MRV.Business.GHG
{
    using System;
    using System.Linq.Expressions;
    using System.Collections.Generic;
    using System.Data.Objects;
    using MRV.Data.Infrastructure;
    using MRV.Data.Model;


    public class BizGHGUnits
    {
        #region Members

        /// <summary>
        /// Manage GHGUnits
        /// </summary>
        private readonly IRepository<GHGUnits> _repository;

        #endregion

        #region Constructor

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="objectContext"></param>
        public BizGHGUnits(ObjectContext objectContext)
        {
            _repository = new Repository<GHGUnits>(objectContext, true);
        }

        #endregion

        #region Methods

        /// <summary>
        /// Gets GHGUnits by id
        /// </summary>
        /// <param name="id">GHGUnits id</param>
        /// <returns>A single GHGUnits</returns>
        public GHGUnits Get(int id)
        {

            return _repository.Single(o => o.Id.Equals(id) & o.IsDeleted == false);
        }
        
        public GHGUnits GetRecord(int id)
        {
            return _repository.Single(o => o.Id.Equals(id));
        }

        /// <summary>
        /// Gets all GHGUnits
        /// </summary>
        /// <returns>IEnumerable of GHGUnits</returns>
        public IEnumerable<GHGUnits> GetAll()
        {
            return _repository.Find(i => i.IsDeleted == false);
        }

        /// <summary>
        /// Gets all GHGUnits as paged
        /// </summary>
        /// <param name="page">page number</param>
        /// <param name="pageSize">page size</param>
        /// <returns>IEnumerable of GHGUnits</returns>
        public IEnumerable<GHGUnits> GetAll(int page, int pageSize)
        {
            return _repository.GetAll(page, pageSize);
        }

        /// <summary>
        /// Finds GHGUnits based on the given predicate
        /// </summary>
        /// <param name="predicate">where clause</param>
        /// <returns>A single GHGUnits</returns>
        public GHGUnits Find(Expression<Func<GHGUnits, bool>> predicate)
        {
            return _repository.First(predicate);
        }

        /// <summary>
        /// Finds GHGUnits based on the given predicate
        /// </summary>
        /// <param name="predicate">where clause</param>
        /// <returns>IEnumerable of GHGUnits</returns>
        public IEnumerable<GHGUnits> FindAll(Expression<Func<GHGUnits, bool>> predicate)
        {
            return _repository.Find(predicate);
        }

        /// <summary>
        /// Adds a new GHGUnits
        /// </summary>
        /// <param name="GHGUnits">GHGUnits</param>
        /// <param name="saveChanges">saveChanges</param>
        public void AddNew(GHGUnits GHGUnits)
        {
            
            _repository.Add(GHGUnits);
            SaveChanges();
        }

        /// <summary>
        /// Edits a loaded GHGUnits
        /// </summary>
        /// <param name="GHGUnits">GHGUnits</param>
        /// <param name="saveChanges">saveChanges</param>
        public void Edit(GHGUnits GHGUnits)
        {
            _repository.Edit(GHGUnits);
            SaveChanges();
        }

        /// <summary>
        /// Deletes GHGUnits by id
        /// </summary>
        /// <param name="id">GHGUnits id</param>
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
        /// DeleteRelatedEntities a loaded GHGUnits
        /// </summary>
        /// <param name="GHGUnits">GHGUnits</param>
        /// <param name="saveChanges">saveChanges</param>
        public void DeleteRelatedEntities(GHGUnits GHGUnits)
        {
            GHGUnits.IsDeleted = true;
           
            _repository.Edit(GHGUnits);
            SaveChanges();
        }

        /// <summary>
        /// Gets GHGUnits count
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
