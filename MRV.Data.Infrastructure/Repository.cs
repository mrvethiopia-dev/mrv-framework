using System;
using System.Collections.Generic;
using System.Linq;
using System.Data.Objects;
using System.Linq.Expressions;
using System.Data;
using System.Data.Objects.DataClasses;

namespace MRV.Data.Infrastructure
{
    public class Repository<TEntity> : IRepository<TEntity> where TEntity : class, new()
    {
        #region Members

        private ObjectContext _objectContext;
        private readonly IObjectSet<TEntity> _objectSet;

        #endregion

        #region Constructor

        public Repository(ObjectContext objectContext)
        {
            _objectContext = objectContext;
            _objectSet = _objectContext.CreateObjectSet<TEntity>();
        }

        public Repository(ObjectContext objectContext, bool lazyLoadingEnabled)
        {
            _objectContext = objectContext;
            _objectSet = _objectContext.CreateObjectSet<TEntity>();
            _objectContext.ContextOptions.LazyLoadingEnabled = lazyLoadingEnabled;
        }

        #endregion

        #region Methods

        public void SaveChanges()
        {
            _objectContext.SaveChanges();
        }

        public void SaveChanges(SaveOptions saveOptions)
        {
            _objectContext.SaveChanges(saveOptions);
        }

        public void Add(TEntity entity)
        {
            if(entity==null)
            {
                throw new ArgumentNullException("entity");
            }
            _objectSet.AddObject(entity);
        }

        public void Edit(TEntity entity)
        {
            _objectSet.Attach(entity);
            _objectContext.ObjectStateManager.ChangeObjectState(entity, EntityState.Modified);
        }

        public void Delete(TEntity entity)
        {
            if (entity == null)
            {
                throw new ArgumentNullException("entity");
            }
            _objectSet.DeleteObject(entity);
        }

        public void Delete(Expression<Func<TEntity, bool>> predicate)
        {
            var records = Find(predicate);
            foreach (var record in records)
            {
                Delete(record);
            }
        }

        public void DeleteRelatedEntities(TEntity entity)
        {
            if (entity == null)
            {
                throw new ArgumentNullException("entity");
            }
            var relatedEntities =
                ((IEntityWithRelationships) entity).RelationshipManager.GetAllRelatedEnds().SelectMany(
                    e => e.CreateSourceQuery().OfType<TEntity>()).ToList();
            foreach (var relatedEntity in relatedEntities)
            {
                _objectSet.DeleteObject(relatedEntity);
            }
            _objectSet.DeleteObject(entity);
        }

        public IEnumerable<TEntity> GetAll()
        {
            return _objectSet.AsEnumerable();
        }

        public IEnumerable<TEntity> GetAll(int start, int limit)
        {
            return _objectSet.AsEnumerable().Skip(start).Take(limit);
        }

        public IEnumerable<TEntity> Find(Expression<Func<TEntity, bool>> predicate)
        {
            return _objectSet.Where(predicate).AsEnumerable();  
        }

        public IEnumerable<TEntity> Find(int page, int pageSize, Expression<Func<TEntity,bool>> predicate)
        {
            return _objectSet.Where(predicate).Skip(page).Take(pageSize).AsEnumerable();
        }

        public TEntity Single(Expression<Func<TEntity,bool>> predicate)
        {
            return _objectSet.SingleOrDefault(predicate);
        }

        public TEntity Single()
        {
            return _objectSet.SingleOrDefault();
        }

        public TEntity First(Expression<Func<TEntity, bool>> predicate)
        {
            return _objectSet.FirstOrDefault(predicate);
        }

        public int Count()
        {
            return _objectSet.Count();
        }

        public int Count(Expression<Func<TEntity, bool>> predicate)
        {
            throw new NotImplementedException();
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        protected virtual void Dispose(bool disposing)
        {
            if (!disposing) return;
            if (_objectContext == null) return;
            _objectContext.Dispose();
            _objectContext = null;
        }

        #endregion
    }

    public class Repository
    {
        #region Members

        private readonly ObjectContext _objectContext;

        #endregion

        #region Constructor

        public Repository(ObjectContext objectContext)
        {
            _objectContext = objectContext;
        }

        #endregion

        #region Methods

        public void Add(Lookup lookup, string table)
        {
            var commandText = string.Format("Insert into {0}(Name, Code, IsDeleted) Values('{1}', '{2}', {3})", table, lookup.Name, lookup.Code, 0);
            _objectContext.ExecuteStoreCommand(commandText);
        }

        public void Edit(Lookup lookup, string table)
        {
            var commandText = string.Format("Update {0} Set Name='{1}', Code='{2}' Where Id={3}", table, lookup.Name, lookup.Code, lookup.Id);
            _objectContext.ExecuteStoreCommand(commandText);
        }

        public void Delete(int id, string table)
        {
            var commandText = string.Format("Delete {0} Where Id={1}", table, id);
            _objectContext.ExecuteStoreCommand(commandText);
        }

        public Lookup Get(int id, string table)
        {
            var commandText = string.Format("Select * From {0} Where Id={1}", table, id);
            return _objectContext.ExecuteStoreQuery<Lookup>(commandText).SingleOrDefault();
        }

        public IEnumerable<Lookup> GetAll(string table)
        {
            var commandText = string.Format("Select * from {0}", table);
            return _objectContext.ExecuteStoreQuery<Lookup>(commandText).ToList();
        }

        public IEnumerable<GuidLookup> GetAllGuid(string table)
        {
            var commandText = string.Format("Select * from {0}", table);
            return _objectContext.ExecuteStoreQuery<GuidLookup>(commandText).ToList();
        }
        public IEnumerable<Lookup> GetAll(int start, int limit, string table)
        {
            var commandText = string.Format("Select * from {0}", table);
            return _objectContext.ExecuteStoreQuery<Lookup>(commandText).Skip(start).Take(limit);
        }

        #endregion
    }

    public class Lookup
    {
        #region Properties

        public int Id { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        //public string Type { get; set; }
        public bool IsDeleted { get; set; }

        #endregion
    }

    public class GuidLookup
    {
        #region Properties

        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        //public string Type { get; set; }
        public bool IsDeleted { get; set; }

        #endregion
    }
}
