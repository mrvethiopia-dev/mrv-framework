namespace MRV.Business.GHG
{
    using System;
    using System.Linq.Expressions;
    using System.Collections.Generic;
    using System.Data.Objects;
    using MRV.Data.Infrastructure;
    using MRV.Data.Model;


    public class BizGHGSectors
    {
        #region Members

        /// <summary>
        /// Manage GHGSectors
        /// </summary>
        private readonly IRepository<GHGSectors> _repository;

        #endregion

        #region Constructor

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="objectContext"></param>
        public BizGHGSectors(ObjectContext objectContext)
        {
            _repository = new Repository<GHGSectors>(objectContext, true);
        }

        #endregion

        #region Methods

        /// <summary>
        /// Gets GHGSectors by id
        /// </summary>
        /// <param name="id">GHGSectors id</param>
        /// <returns>A single GHGSectors</returns>
        public GHGSectors Get(int id)
        {

            return _repository.Single(o => o.Id.Equals(id) & o.IsDeleted == false);
        }
        
        public GHGSectors GetRecord(int id)
        {
            return _repository.Single(o => o.Id.Equals(id));
        }

        /// <summary>
        /// Gets all GHGSectors
        /// </summary>
        /// <returns>IEnumerable of GHGSectors</returns>
        public IEnumerable<GHGSectors> GetAll()
        {
            return _repository.Find(i => i.IsDeleted == false);
        }

        /// <summary>
        /// Gets all GHGSectors as paged
        /// </summary>
        /// <param name="page">page number</param>
        /// <param name="pageSize">page size</param>
        /// <returns>IEnumerable of GHGSectors</returns>
        public IEnumerable<GHGSectors> GetAll(int page, int pageSize)
        {
            return _repository.GetAll(page, pageSize);
        }

        /// <summary>
        /// Finds GHGSectors based on the given predicate
        /// </summary>
        /// <param name="predicate">where clause</param>
        /// <returns>A single GHGSectors</returns>
        public GHGSectors Find(Expression<Func<GHGSectors, bool>> predicate)
        {
            return _repository.First(predicate);
        }

        /// <summary>
        /// Finds GHGSectors based on the given predicate
        /// </summary>
        /// <param name="predicate">where clause</param>
        /// <returns>IEnumerable of GHGSectors</returns>
        public IEnumerable<GHGSectors> FindAll(Expression<Func<GHGSectors, bool>> predicate)
        {
            return _repository.Find(predicate);
        }

        /// <summary>
        /// Adds a new GHGSectors
        /// </summary>
        /// <param name="GHGSectors">GHGSectors</param>
        /// <param name="saveChanges">saveChanges</param>
        public void AddNew(GHGSectors GHGSectors)
        {
            
            _repository.Add(GHGSectors);
            SaveChanges();
        }

        /// <summary>
        /// Edits a loaded GHGSectors
        /// </summary>
        /// <param name="GHGSectors">GHGSectors</param>
        /// <param name="saveChanges">saveChanges</param>
        public void Edit(GHGSectors GHGSectors)
        {
            _repository.Edit(GHGSectors);
            SaveChanges();
        }

        /// <summary>
        /// Deletes GHGSectors by id
        /// </summary>
        /// <param name="id">GHGSectors id</param>
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
        /// DeleteRelatedEntities a loaded GHGSectors
        /// </summary>
        /// <param name="GHGSectors">GHGSectors</param>
        /// <param name="saveChanges">saveChanges</param>
        public void DeleteRelatedEntities(GHGSectors GHGSectors)
        {
            GHGSectors.IsDeleted = true;
           
            _repository.Edit(GHGSectors);
            SaveChanges();
        }

        /// <summary>
        /// Gets GHGSectors count
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
