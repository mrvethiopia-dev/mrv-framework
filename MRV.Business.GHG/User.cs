using System;
using System.Linq.Expressions;
using System.Collections.Generic;
using System.Data.Objects;
using MRV.Data.Infrastructure;
using MRV.Data.Model;


namespace MRV.Business.GHG
{
    public class User
    {
        #region Members

        /// <summary>
        /// Manage User
        /// </summary>
        private readonly IRepository<sysUser> _repository;

        #endregion

        #region Constructor

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="objectContext"></param>
        public User(ObjectContext objectContext)
        {
            _repository = new Repository<sysUser>(objectContext, true);
        }

        #endregion

        #region Methods

        /// <summary>
        /// Gets User by id
        /// </summary>
        /// <param name="id">User id</param>
        /// <returns>A single User</returns>
        public sysUser Get(int id)
        {

            return _repository.Single(o => o.Id.Equals(id));
        }

        /// <summary>
        /// Gets User by id
        /// </summary>
        /// <param name="id">User id</param>
        /// <returns>A single User</returns>
        public sysUser GetUserByUserName(string username)
        {

            return _repository.Single(o => o.Username.Equals(username));
        }
        /// <summary>
        /// Gets all User
        /// </summary>
        /// <returns>IEnumerable of User</returns>
        public IEnumerable<sysUser> GetAll()
        {
            return _repository.GetAll();
        }

        /// <summary>
        /// Gets all User as paged
        /// </summary>
        /// <param name="page">page number</param>
        /// <param name="pageSize">page size</param>
        /// <returns>IEnumerable of User</returns>
        public IEnumerable<sysUser> GetAll(int page, int pageSize)
        {
            return _repository.GetAll(page, pageSize);
        }

        /// <summary>
        /// Finds User based on the given predicate
        /// </summary>
        /// <param name="predicate">where clause</param>
        /// <returns>A single User</returns>
        public sysUser Find(Expression<Func<sysUser, bool>> predicate)
        {
            return _repository.First(predicate);
        }

        /// <summary>
        /// Finds User based on the given predicate
        /// </summary>
        /// <param name="predicate">where clause</param>
        /// <returns>IEnumerable of User</returns>
        public IEnumerable<sysUser> FindAll(Expression<Func<sysUser, bool>> predicate)
        {
            return _repository.Find(predicate);
        }

        /// <summary>
        /// Adds a new User
        /// </summary>
        /// <param name="User">User</param>
        /// <param name="saveChanges">saveChanges</param>
        public void AddNew(sysUser User)
        {
            _repository.Add(User);
            SaveChanges();
        }

        /// <summary>
        /// Edits loaded User
        /// </summary>
        /// <param name="User">User</param>
        /// <param name="saveChanges">saveChanges</param>
        public void Edit(sysUser User)
        {
            _repository.Edit(User);
            SaveChanges();
        }

        /// <summary>
        /// Deletes User by id
        /// </summary>
        /// <param name="id">User id</param>
        public void Delete(int id)
        {
            _repository.Delete(o => o.Id.Equals(id));
            _repository.SaveChanges();
        }

        /// <summary>
        /// Deletes User entity and related entities
        /// </summary>
        /// <param name="User">User entity</param>
        public void DeleteRelatedEntities(sysUser User)
        {
            _repository.DeleteRelatedEntities(User);
            _repository.SaveChanges();
        }

        /// <summary>
        /// Gets User count
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
