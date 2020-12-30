using System;
using System.Linq.Expressions;
using System.Collections.Generic;
using System.Data.Objects;
using MRV.Data.Infrastructure;
using MRV.Data.Model;


namespace MRV.Business.GHG
{
    public class UserSystems
    {
        #region Members

        /// <summary>
        /// Manage UserSystems
        /// </summary>
        private readonly IRepository<sysUserSystems> _repository;

        #endregion

        #region Constructor

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="objectContext"></param>
        public UserSystems(ObjectContext objectContext)
        {
            _repository = new Repository<sysUserSystems>(objectContext, true);
        }

        #endregion

        #region Methods

        /// <summary>
        /// Gets UserSystems by id
        /// </summary>
        /// <param name="id">UserSystems id</param>
        /// <returns>A single UserSystems</returns>
        public sysUserSystems Get(int id)
        {

            return _repository.Single(o => o.Id.Equals(id));
        }

        /// <summary>
        /// Gets all UserSystems
        /// </summary>
        /// <returns>IEnumerable of UserSystems</returns>
        public IEnumerable<sysUserSystems> GetAll()
        {
            return _repository.GetAll();
        }

        /// <summary>
        /// Gets all UserSystems as paged
        /// </summary>
        /// <param name="page">page number</param>
        /// <param name="pageSize">page size</param>
        /// <returns>IEnumerable of UserSystems</returns>
        public IEnumerable<sysUserSystems> GetAll(int page, int pageSize)
        {
            return _repository.GetAll(page, pageSize);
        }

        /// <summary>
        /// Finds UserSystems based on the given predicate
        /// </summary>
        /// <param name="predicate">where clause</param>
        /// <returns>A single UserSystems</returns>
        public sysUserSystems Find(Expression<Func<sysUserSystems, bool>> predicate)
        {
            return _repository.First(predicate);
        }

        /// <summary>
        /// Finds UserSystems based on the given predicate
        /// </summary>
        /// <param name="predicate">where clause</param>
        /// <returns>IEnumerable of UserSystems</returns>
        public IEnumerable<sysUserSystems> FindAll(Expression<Func<sysUserSystems, bool>> predicate)
        {
            return _repository.Find(predicate);
        }

        /// <summary>
        /// Adds a new UserSystems
        /// </summary>
        /// <param name="UserSystems">UserSystems</param>
        /// <param name="saveChanges">saveChanges</param>
        public void AddNew(sysUserSystems UserSystems)
        {
            _repository.Add(UserSystems);
            SaveChanges();
        }

        /// <summary>
        /// Edits loaded UserSystems
        /// </summary>
        /// <param name="UserSystems">UserSystems</param>
        /// <param name="saveChanges">saveChanges</param>
        public void Edit(sysUserSystems UserSystems)
        {
            _repository.Edit(UserSystems);
            SaveChanges();
        }

        /// <summary>
        /// Deletes UserSystems by id
        /// </summary>
        /// <param name="id">UserSystems id</param>
        public void Delete(int id)
        {
            _repository.Delete(o => o.Id.Equals(id));
            _repository.SaveChanges();
        }

        /// <summary>
        /// Deletes UserSystems entity and related entities
        /// </summary>
        /// <param name="userSystems">UserSystems entity</param>
        public void DeleteRelatedEntities(sysUserSystems userSystems)
        {
            _repository.DeleteRelatedEntities(userSystems);
            _repository.SaveChanges();
        }
        /// <summary>
        /// Delete userSubsystem by the specified predicate
        /// </summary>
        /// <param name="predicate"></param>
        public void Delete(Expression<Func<sysUserSystems, bool>> predicate)
        {
            _repository.Delete(predicate);
        }
        /// <summary>
        /// Gets UserSystems count
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
