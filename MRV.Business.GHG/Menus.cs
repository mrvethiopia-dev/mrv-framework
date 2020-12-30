using System;
using System.Linq.Expressions;
using System.Collections.Generic;
using System.Data.Objects;
using MRV.Data.Infrastructure;
using MRV.Data.Model;


namespace MRV.Business.GHG
{
    public class Menus
    {
        #region Members

        /// <summary>
        /// Manage Menus
        /// </summary>
        private readonly IRepository<sysMenus> _repository;

        #endregion

        #region Constructor

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="objectContext"></param>
        public Menus(ObjectContext objectContext)
        {
            _repository = new Repository<sysMenus>(objectContext, true);
        }

        #endregion

        #region Methods

        /// <summary>
        /// Gets Menus by id
        /// </summary>
        /// <param name="id">Menus id</param>
        /// <returns>A single Menus</returns>
        public sysMenus Get(int id)
        {

            return _repository.Single(o => o.Id.Equals(id));
        }

        /// <summary>
        /// Gets all Menus
        /// </summary>
        /// <returns>IEnumerable of Menus</returns>
        public IEnumerable<sysMenus> GetAll()
        {
            return _repository.GetAll();
        }

        /// <summary>
        /// Gets all Menus as paged
        /// </summary>
        /// <param name="page">page number</param>
        /// <param name="pageSize">page size</param>
        /// <returns>IEnumerable of Menus</returns>
        public IEnumerable<sysMenus> GetAll(int page, int pageSize)
        {
            return _repository.GetAll(page, pageSize);
        }

        /// <summary>
        /// Finds Menus based on the given predicate
        /// </summary>
        /// <param name="predicate">where clause</param>
        /// <returns>A single Menus</returns>
        public sysMenus Find(Expression<Func<sysMenus, bool>> predicate)
        {
            return _repository.First(predicate);
        }

        /// <summary>
        /// Finds Menus based on the given predicate
        /// </summary>
        /// <param name="predicate">where clause</param>
        /// <returns>IEnumerable of Menus</returns>
        public IEnumerable<sysMenus> FindAll(Expression<Func<sysMenus, bool>> predicate)
        {
            return _repository.Find(predicate);
        }

        /// <summary>
        /// Adds a new Menus
        /// </summary>
        /// <param name="Menus">Menus</param>
        /// <param name="saveChanges">saveChanges</param>
        public void AddNew(sysMenus Menus)
        {
            _repository.Add(Menus);
            SaveChanges();
        }

        /// <summary>
        /// Edits loaded Menus
        /// </summary>
        /// <param name="Menus">Menus</param>
        /// <param name="saveChanges">saveChanges</param>
        public void Edit(sysMenus Menus)
        {
            _repository.Edit(Menus);
            SaveChanges();
        }

        /// <summary>
        /// Deletes Menus by id
        /// </summary>
        /// <param name="id">Menus id</param>
        public void Delete(int id)
        {
            _repository.Delete(o => o.Id.Equals(id));
            _repository.SaveChanges();
        }

        /// <summary>
        /// Deletes Menus entity and related entities
        /// </summary>
        /// <param name="Menus">Menus entity</param>
        public void DeleteRelatedEntities(sysMenus Menus)
        {
            _repository.DeleteRelatedEntities(Menus);
            _repository.SaveChanges();
        }

        /// <summary>
        /// Gets Menus count
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
