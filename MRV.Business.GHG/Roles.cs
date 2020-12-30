using System;
using System.Linq.Expressions;
using System.Collections.Generic;
using System.Data.Objects;
using MRV.Data.Infrastructure;
using MRV.Data.Model;


namespace MRV.Business.GHG
{
    public class Roles
    {
        #region Members

        /// <summary>
        /// Manage Roles
        /// </summary>
        private readonly IRepository<sysRole> _repository;

        #endregion

        #region Constructor

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="objectContext"></param>
        public Roles(ObjectContext objectContext)
        {
            _repository = new Repository<sysRole>(objectContext, true);
        }

        #endregion

        #region Methods

        /// <summary>
        /// Gets Roles by id
        /// </summary>
        /// <param name="id">Roles id</param>
        /// <returns>A single Roles</returns>
        public sysRole Get(int id)
        {

            return _repository.Single(o => o.Id.Equals(id));
        }

        /// <summary>
        /// Gets all Roles
        /// </summary>
        /// <returns>IEnumerable of Roles</returns>
        public IEnumerable<sysRole> GetAll()
        {
            return _repository.GetAll();
        }

        /// <summary>
        /// Gets all Roles as paged
        /// </summary>
        /// <param name="page">page number</param>
        /// <param name="pageSize">page size</param>
        /// <returns>IEnumerable of Roles</returns>
        public IEnumerable<sysRole> GetAll(int page, int pageSize)
        {
            return _repository.GetAll(page, pageSize);
        }

        /// <summary>
        /// Finds Roles based on the given predicate
        /// </summary>
        /// <param name="predicate">where clause</param>
        /// <returns>A single Roles</returns>
        public sysRole Find(Expression<Func<sysRole, bool>> predicate)
        {
            return _repository.First(predicate);
        }

        /// <summary>
        /// Finds Roles based on the given predicate
        /// </summary>
        /// <param name="predicate">where clause</param>
        /// <returns>IEnumerable of Roles</returns>
        public IEnumerable<sysRole> FindAll(Expression<Func<sysRole, bool>> predicate)
        {
            return _repository.Find(predicate);
        }

        /// <summary>
        /// Adds a new Roles
        /// </summary>
        /// <param name="Roles">Roles</param>
        /// <param name="saveChanges">saveChanges</param>
        public void AddNew(sysRole Roles)
        {
            _repository.Add(Roles);
            SaveChanges();
        }

        /// <summary>
        /// Edits loaded Roles
        /// </summary>
        /// <param name="Roles">Roles</param>
        /// <param name="saveChanges">saveChanges</param>
        public void Edit(sysRole Roles)
        {
            _repository.Edit(Roles);
            SaveChanges();
        }

        /// <summary>
        /// Deletes Roles by id
        /// </summary>
        /// <param name="id">Roles id</param>
        public void Delete(int id)
        {
            _repository.Delete(o => o.Id.Equals(id));
            _repository.SaveChanges();
        }

        /// <summary>
        /// Deletes Roles entity and related entities
        /// </summary>
        /// <param name="Roles">Roles entity</param>
        public void DeleteRelatedEntities(sysRole Roles)
        {
            _repository.DeleteRelatedEntities(Roles);
            _repository.SaveChanges();
        }

        /// <summary>
        /// Gets Roles count
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
