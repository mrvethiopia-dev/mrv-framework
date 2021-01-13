namespace MRV.Business.GHG
{
    using System;
    using System.Linq.Expressions;
    using System.Collections.Generic;
    using System.Data.Objects;
    using MRV.Data.Infrastructure;
    using MRV.Data.Model;


    public class BizGHGLocations
    {
        #region Members

        /// <summary>
        /// Manage GHGLocations
        /// </summary>
        private readonly IRepository<GHGLocations> _repository;

        #endregion

        #region Constructor

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="objectContext"></param>
        public BizGHGLocations(ObjectContext objectContext)
        {
            _repository = new Repository<GHGLocations>(objectContext, true);
        }

        #endregion

        #region Methods

        /// <summary>
        /// Gets GHGLocations by id
        /// </summary>
        /// <param name="id">GHGLocations id</param>
        /// <returns>A single GHGLocations</returns>
        public GHGLocations Get(int id)
        {

            return _repository.Single(o => o.Id.Equals(id) & o.IsDeleted == false);
        }
        
        public GHGLocations GetRecord(int id)
        {
            return _repository.Single(o => o.Id.Equals(id));
        }

        /// <summary>
        /// Gets all GHGLocations
        /// </summary>
        /// <returns>IEnumerable of GHGLocations</returns>
        public IEnumerable<GHGLocations> GetAll()
        {
            return _repository.Find(i => i.IsDeleted == false);
        }

        /// <summary>
        /// Gets all GHGLocations as paged
        /// </summary>
        /// <param name="page">page number</param>
        /// <param name="pageSize">page size</param>
        /// <returns>IEnumerable of GHGLocations</returns>
        public IEnumerable<GHGLocations> GetAll(int page, int pageSize)
        {
            return _repository.GetAll(page, pageSize);
        }

        /// <summary>
        /// Finds GHGLocations based on the given predicate
        /// </summary>
        /// <param name="predicate">where clause</param>
        /// <returns>A single GHGLocations</returns>
        public GHGLocations Find(Expression<Func<GHGLocations, bool>> predicate)
        {
            return _repository.First(predicate);
        }

        /// <summary>
        /// Finds GHGLocations based on the given predicate
        /// </summary>
        /// <param name="predicate">where clause</param>
        /// <returns>IEnumerable of GHGLocations</returns>
        public IEnumerable<GHGLocations> FindAll(Expression<Func<GHGLocations, bool>> predicate)
        {
            return _repository.Find(predicate);
        }

        /// <summary>
        /// Adds a new GHGLocations
        /// </summary>
        /// <param name="GHGLocations">GHGLocations</param>
        /// <param name="saveChanges">saveChanges</param>
        public void AddNew(GHGLocations GHGLocations)
        {
            
            _repository.Add(GHGLocations);
            SaveChanges();
        }

        /// <summary>
        /// Edits a loaded GHGLocations
        /// </summary>
        /// <param name="GHGLocations">GHGLocations</param>
        /// <param name="saveChanges">saveChanges</param>
        public void Edit(GHGLocations GHGLocations)
        {
            _repository.Edit(GHGLocations);
            SaveChanges();
        }

        /// <summary>
        /// Deletes GHGLocations by id
        /// </summary>
        /// <param name="id">GHGLocations id</param>
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
        /// DeleteRelatedEntities a loaded GHGLocations
        /// </summary>
        /// <param name="GHGLocations">GHGLocations</param>
        /// <param name="saveChanges">saveChanges</param>
        public void DeleteRelatedEntities(GHGLocations GHGLocations)
        {
            GHGLocations.IsDeleted = true;
           
            _repository.Edit(GHGLocations);
            SaveChanges();
        }

        /// <summary>
        /// Gets GHGLocations count
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
