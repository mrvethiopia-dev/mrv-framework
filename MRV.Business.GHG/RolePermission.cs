using System;
using System.Linq.Expressions;
using System.Collections.Generic;
using System.Data.Objects;
using MRV.Data.Infrastructure;
using MRV.Data.Model;


namespace MRV.Business.GHG
{
    public class RolePermission
    {
        #region Members

        /// <summary>
        /// Manage RolePermission
        /// </summary>
        private readonly IRepository<sysRolePermission> _repository;

        #endregion

        #region Constructor

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="objectContext"></param>
        public RolePermission(ObjectContext objectContext)
        {
            _repository = new Repository<sysRolePermission>(objectContext, true);
        }

        #endregion

        #region Methods

        /// <summary>
        /// Gets RolePermission by id
        /// </summary>
        /// <param name="id">RolePermission id</param>
        /// <returns>A single RolePermission</returns>
        public sysRolePermission Get(int id)
        {

            return _repository.Single(o => o.Id.Equals(id));
        }

        /// <summary>
        /// Gets all RolePermission
        /// </summary>
        /// <returns>IEnumerable of RolePermission</returns>
        public IEnumerable<sysRolePermission> GetAll()
        {
            return _repository.GetAll();
        }

        /// <summary>
        /// Gets all RolePermission as paged
        /// </summary>
        /// <param name="page">page number</param>
        /// <param name="pageSize">page size</param>
        /// <returns>IEnumerable of RolePermission</returns>
        public IEnumerable<sysRolePermission> GetAll(int page, int pageSize)
        {
            return _repository.GetAll(page, pageSize);
        }

        /// <summary>
        /// Finds RolePermission based on the given predicate
        /// </summary>
        /// <param name="predicate">where clause</param>
        /// <returns>A single RolePermission</returns>
        public sysRolePermission Find(Expression<Func<sysRolePermission, bool>> predicate)
        {
            return _repository.First(predicate);
        }

        /// <summary>
        /// Finds RolePermission based on the given predicate
        /// </summary>
        /// <param name="predicate">where clause</param>
        /// <returns>IEnumerable of RolePermission</returns>
        public IEnumerable<sysRolePermission> FindAll(Expression<Func<sysRolePermission, bool>> predicate)
        {
            return _repository.Find(predicate);
        }

        /// <summary>
        /// Adds a new RolePermission
        /// </summary>
        /// <param name="RolePermission">RolePermission</param>
        /// <param name="saveChanges">saveChanges</param>
        public void AddNew(sysRolePermission RolePermission)
        {
            _repository.Add(RolePermission);
            SaveChanges();
        }

        /// <summary>
        /// Edits loaded RolePermission
        /// </summary>
        /// <param name="RolePermission">RolePermission</param>
        /// <param name="saveChanges">saveChanges</param>
        public void Edit(sysRolePermission RolePermission)
        {
            _repository.Edit(RolePermission);
            SaveChanges();
        }

        /// <summary>
        /// Deletes RolePermission by id
        /// </summary>
        /// <param name="id">RolePermission id</param>
        public void Delete(int id)
        {
            _repository.Delete(o => o.Id.Equals(id));
            _repository.SaveChanges();
        }

        /// <summary>
        /// Deletes RolePermission entity and related entities
        /// </summary>
        /// <param name="RolePermission">RolePermission entity</param>
        public void DeleteRelatedEntities(sysRolePermission RolePermission)
        {
            _repository.DeleteRelatedEntities(RolePermission);
            _repository.SaveChanges();
        }

        /// <summary>
        /// Delete rolePermission by the specified predicate
        /// </summary>
        /// <param name="predicate"></param>
        public void Delete(Expression<Func<sysRolePermission, bool>> predicate)
        {
            _repository.Delete(predicate);
        }
        /// <summary>
        /// Gets RolePermission count
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
