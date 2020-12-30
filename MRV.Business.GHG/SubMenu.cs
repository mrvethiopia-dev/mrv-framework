using System;
using System.Linq.Expressions;
using System.Collections.Generic;
using System.Data.Objects;
using MRV.Data.Infrastructure;
using MRV.Data.Model;


namespace MRV.Business.GHG
{
    public class SubMenu
    {
        #region Members

        /// <summary>
        /// Manage SubMenu
        /// </summary>
        private readonly IRepository<sysSubMenu> _repository;

        #endregion

        #region Constructor

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="objectContext"></param>
        public SubMenu(ObjectContext objectContext)
        {
            _repository = new Repository<sysSubMenu>(objectContext, true);
        }

        #endregion

        #region Methods

        /// <summary>
        /// Gets SubMenu by id
        /// </summary>
        /// <param name="id">SubMenu id</param>
        /// <returns>A single SubMenu</returns>
        public sysSubMenu Get(int id)
        {

            return _repository.Single(o => o.Id.Equals(id));
        }

        /// <summary>
        /// Gets all SubMenu
        /// </summary>
        /// <returns>IEnumerable of SubMenu</returns>
        public IEnumerable<sysSubMenu> GetAll()
        {
            return _repository.GetAll();
        }

        /// <summary>
        /// Gets all SubMenu as paged
        /// </summary>
        /// <param name="page">page number</param>
        /// <param name="pageSize">page size</param>
        /// <returns>IEnumerable of SubMenu</returns>
        public IEnumerable<sysSubMenu> GetAll(int page, int pageSize)
        {
            return _repository.GetAll(page, pageSize);
        }

        /// <summary>
        /// Finds SubMenu based on the given predicate
        /// </summary>
        /// <param name="predicate">where clause</param>
        /// <returns>A single SubMenu</returns>
        public sysSubMenu Find(Expression<Func<sysSubMenu, bool>> predicate)
        {
            return _repository.First(predicate);
        }

        /// <summary>
        /// Finds SubMenu based on the given predicate
        /// </summary>
        /// <param name="predicate">where clause</param>
        /// <returns>IEnumerable of SubMenu</returns>
        public IEnumerable<sysSubMenu> FindAll(Expression<Func<sysSubMenu, bool>> predicate)
        {
            return _repository.Find(predicate);
        }

        /// <summary>
        /// Adds a new SubMenu
        /// </summary>
        /// <param name="SubMenu">SubMenu</param>
        /// <param name="saveChanges">saveChanges</param>
        public void AddNew(sysSubMenu SubMenu)
        {
            _repository.Add(SubMenu);
            SaveChanges();
        }

        /// <summary>
        /// Edits loaded SubMenu
        /// </summary>
        /// <param name="SubMenu">SubMenu</param>
        /// <param name="saveChanges">saveChanges</param>
        public void Edit(sysSubMenu SubMenu)
        {
            _repository.Edit(SubMenu);
            SaveChanges();
        }

        /// <summary>
        /// Deletes SubMenu by id
        /// </summary>
        /// <param name="id">SubMenu id</param>
        public void Delete(int id)
        {
            _repository.Delete(o => o.Id.Equals(id));
            _repository.SaveChanges();
        }

        /// <summary>
        /// Deletes SubMenu entity and related entities
        /// </summary>
        /// <param name="SubMenu">SubMenu entity</param>
        public void DeleteRelatedEntities(sysSubMenu SubMenu)
        {
            _repository.DeleteRelatedEntities(SubMenu);
            _repository.SaveChanges();
        }

        /// <summary>
        /// Gets SubMenu count
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
