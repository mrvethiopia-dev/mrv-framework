using System;
using System.Linq.Expressions;
using System.Collections.Generic;
using System.Data.Objects;
using MRV.Data.Infrastructure;
using MRV.Data.Model;


namespace MRV.Business.GHG
{
    public class Systems
    {
        #region Members

        /// <summary>
        /// Manage Systems
        /// </summary>
        private readonly IRepository<sysSystems> _repository;

        #endregion

        #region Constructor

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="objectContext"></param>
        public Systems(ObjectContext objectContext)
        {
            _repository = new Repository<sysSystems>(objectContext, true);
        }

        #endregion

        #region Methods

        /// <summary>
        /// Gets Systems by id
        /// </summary>
        /// <param name="id">Systems id</param>
        /// <returns>A single Systems</returns>
        public sysSystems Get(int id)
        {

            return _repository.Single(o => o.Id.Equals(id));
        }

        /// <summary>
        /// Gets all Systems
        /// </summary>
        /// <returns>IEnumerable of Systems</returns>
        public IEnumerable<sysSystems> GetAll()
        {
            return _repository.GetAll();
        }

        /// <summary>
        /// Gets all Systems as paged
        /// </summary>
        /// <param name="page">page number</param>
        /// <param name="pageSize">page size</param>
        /// <returns>IEnumerable of Systems</returns>
        public IEnumerable<sysSystems> GetAll(int page, int pageSize)
        {
            return _repository.GetAll(page, pageSize);
        }

        /// <summary>
        /// Finds Systems based on the given predicate
        /// </summary>
        /// <param name="predicate">where clause</param>
        /// <returns>A single Systems</returns>
        public sysSystems Find(Expression<Func<sysSystems, bool>> predicate)
        {
            return _repository.First(predicate);
        }

        /// <summary>
        /// Finds Systems based on the given predicate
        /// </summary>
        /// <param name="predicate">where clause</param>
        /// <returns>IEnumerable of Systems</returns>
        public IEnumerable<sysSystems> FindAll(Expression<Func<sysSystems, bool>> predicate)
        {
            return _repository.Find(predicate);
        }

        /// <summary>
        /// Adds a new Systems
        /// </summary>
        /// <param name="Systems">Systems</param>
        /// <param name="saveChanges">saveChanges</param>
        public void AddNew(sysSystems Systems)
        {
            _repository.Add(Systems);
            SaveChanges();
        }

        /// <summary>
        /// Edits loaded Systems
        /// </summary>
        /// <param name="Systems">Systems</param>
        /// <param name="saveChanges">saveChanges</param>
        public void Edit(sysSystems Systems)
        {
            _repository.Edit(Systems);
            SaveChanges();
        }

        /// <summary>
        /// Deletes Systems by id
        /// </summary>
        /// <param name="id">Systems id</param>
        public void Delete(int id)
        {
            _repository.Delete(o => o.Id.Equals(id));
            _repository.SaveChanges();
        }

        /// <summary>
        /// Deletes Systems entity and related entities
        /// </summary>
        /// <param name="Systems">Systems entity</param>
        public void DeleteRelatedEntities(sysSystems Systems)
        {
            _repository.DeleteRelatedEntities(Systems);
            _repository.SaveChanges();
        }

        /// <summary>
        /// Gets Systems count
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
