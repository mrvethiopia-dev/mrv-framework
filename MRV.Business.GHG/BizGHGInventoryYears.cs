namespace MRV.Business.GHG
{
    using System;
    using System.Linq.Expressions;
    using System.Collections.Generic;
    using System.Data.Objects;
    using MRV.Data.Infrastructure;
    using MRV.Data.Model;


    public class BizGHGInventoryYears
    {
        #region Members

        /// <summary>
        /// Manage GHGInventoryYear
        /// </summary>
        private readonly IRepository<GHGInventoryYear> _repository;

        #endregion

        #region Constructor

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="objectContext"></param>
        public BizGHGInventoryYears(ObjectContext objectContext)
        {
            _repository = new Repository<GHGInventoryYear>(objectContext, true);
        }

        #endregion

        #region Methods

        /// <summary>
        /// Gets GHGInventoryYear by id
        /// </summary>
        /// <param name="id">GHGInventoryYear id</param>
        /// <returns>A single GHGInventoryYear</returns>
        public GHGInventoryYear Get(int id)
        {

            return _repository.Single(o => o.Id.Equals(id) & o.IsDeleted == false);
        }
        
        public GHGInventoryYear GetRecord(int id)
        {
            return _repository.Single(o => o.Id.Equals(id));
        }

        /// <summary>
        /// Gets all GHGInventoryYear
        /// </summary>
        /// <returns>IEnumerable of GHGInventoryYear</returns>
        public IEnumerable<GHGInventoryYear> GetAll()
        {
            return _repository.Find(i => i.IsDeleted == false);
        }

        /// <summary>
        /// Gets all GHGInventoryYear as paged
        /// </summary>
        /// <param name="page">page number</param>
        /// <param name="pageSize">page size</param>
        /// <returns>IEnumerable of GHGInventoryYear</returns>
        public IEnumerable<GHGInventoryYear> GetAll(int page, int pageSize)
        {
            return _repository.GetAll(page, pageSize);
        }

        /// <summary>
        /// Finds GHGInventoryYear based on the given predicate
        /// </summary>
        /// <param name="predicate">where clause</param>
        /// <returns>A single GHGInventoryYear</returns>
        public GHGInventoryYear Find(Expression<Func<GHGInventoryYear, bool>> predicate)
        {
            return _repository.First(predicate);
        }

        /// <summary>
        /// Finds GHGInventoryYear based on the given predicate
        /// </summary>
        /// <param name="predicate">where clause</param>
        /// <returns>IEnumerable of GHGInventoryYear</returns>
        public IEnumerable<GHGInventoryYear> FindAll(Expression<Func<GHGInventoryYear, bool>> predicate)
        {
            return _repository.Find(predicate);
        }

        /// <summary>
        /// Adds a new GHGInventoryYear
        /// </summary>
        /// <param name="GHGInventoryYear">GHGInventoryYear</param>
        /// <param name="saveChanges">saveChanges</param>
        public void AddNew(GHGInventoryYear GHGInventoryYear)
        {
            
            _repository.Add(GHGInventoryYear);
            SaveChanges();
        }

        /// <summary>
        /// Edits a loaded GHGInventoryYear
        /// </summary>
        /// <param name="GHGInventoryYear">GHGInventoryYear</param>
        /// <param name="saveChanges">saveChanges</param>
        public void Edit(GHGInventoryYear GHGInventoryYear)
        {
            _repository.Edit(GHGInventoryYear);
            SaveChanges();
        }

        /// <summary>
        /// Deletes GHGInventoryYear by id
        /// </summary>
        /// <param name="id">GHGInventoryYear id</param>
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
        /// DeleteRelatedEntities a loaded GHGInventoryYear
        /// </summary>
        /// <param name="GHGInventoryYear">GHGInventoryYear</param>
        /// <param name="saveChanges">saveChanges</param>
        public void DeleteRelatedEntities(GHGInventoryYear GHGInventoryYear)
        {
            GHGInventoryYear.IsDeleted = true;
           
            _repository.Edit(GHGInventoryYear);
            SaveChanges();
        }

        /// <summary>
        /// Gets GHGInventoryYear count
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
