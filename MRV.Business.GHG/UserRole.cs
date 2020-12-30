using System;
using System.Linq.Expressions;
using System.Collections.Generic;
using System.Data.Objects;
using MRV.Data.Infrastructure;
using MRV.Data.Model;


namespace MRV.Business.GHG
{
    public class UserRole
    {
        #region Members

        /// <summary>
        /// Manage UserRole
        /// </summary>
        private readonly IRepository<sysUserRole> _repository;

        #endregion

        #region Constructor

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="objectContext"></param>
        public UserRole(ObjectContext objectContext)
        {
            _repository = new Repository<sysUserRole>(objectContext, true);
        }

        #endregion

        #region Methods

        /// <summary>
        /// Gets UserRole by id
        /// </summary>
        /// <param name="id">UserRole id</param>
        /// <returns>A single UserRole</returns>
        public sysUserRole Get(int id)
        {

            return _repository.Single(o => o.Id.Equals(id));
        }

        /// <summary>
        /// Gets all UserRole
        /// </summary>
        /// <returns>IEnumerable of UserRole</returns>
        public IEnumerable<sysUserRole> GetAll()
        {
            return _repository.GetAll();
        }

        /// <summary>
        /// Gets all UserRole as paged
        /// </summary>
        /// <param name="page">page number</param>
        /// <param name="pageSize">page size</param>
        /// <returns>IEnumerable of UserRole</returns>
        public IEnumerable<sysUserRole> GetAll(int page, int pageSize)
        {
            return _repository.GetAll(page, pageSize);
        }

        /// <summary>
        /// Finds UserRole based on the given predicate
        /// </summary>
        /// <param name="predicate">where clause</param>
        /// <returns>A single UserRole</returns>
        public sysUserRole Find(Expression<Func<sysUserRole, bool>> predicate)
        {
            return _repository.First(predicate);
        }

        /// <summary>
        /// Finds UserRole based on the given predicate
        /// </summary>
        /// <param name="predicate">where clause</param>
        /// <returns>IEnumerable of UserRole</returns>
        public IEnumerable<sysUserRole> FindAll(Expression<Func<sysUserRole, bool>> predicate)
        {
            return _repository.Find(predicate);
        }

        /// <summary>
        /// Adds a new UserRole
        /// </summary>
        /// <param name="UserRole">UserRole</param>
        /// <param name="saveChanges">saveChanges</param>
        public void AddNew(sysUserRole UserRole)
        {
            _repository.Add(UserRole);
            SaveChanges();
        }

        /// <summary>
        /// Edits loaded UserRole
        /// </summary>
        /// <param name="UserRole">UserRole</param>
        /// <param name="saveChanges">saveChanges</param>
        public void Edit(sysUserRole UserRole)
        {
            _repository.Edit(UserRole);
            SaveChanges();
        }

        /// <summary>
        /// Deletes UserRole by id
        /// </summary>
        /// <param name="id">UserRole id</param>
        public void Delete(int id)
        {
            _repository.Delete(o => o.Id.Equals(id));
            _repository.SaveChanges();
        }

        /// <summary>
        /// Delete userRole by the specified predicate
        /// </summary>
        /// <param name="predicate"></param>
        public void Delete(Expression<Func<sysUserRole, bool>> predicate)
        {
            _repository.Delete(predicate);
        }

        /// <summary>
        /// Gets UserRole count
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
