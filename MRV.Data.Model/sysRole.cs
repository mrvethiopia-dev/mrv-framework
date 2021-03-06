//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

using System;
using System.Collections;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Collections.Specialized;

namespace MRV.Data.Model
{
    public partial class sysRole
    {
        #region Primitive Properties
    
        public virtual int Id
        {
            get;
            set;
        }
    
        public virtual string Name
        {
            get;
            set;
        }
    
        public virtual string Code
        {
            get;
            set;
        }

        #endregion

        #region Navigation Properties
    
        public virtual ICollection<sysRolePermission> sysRolePermission
        {
            get
            {
                if (_sysRolePermission == null)
                {
                    var newCollection = new FixupCollection<sysRolePermission>();
                    newCollection.CollectionChanged += FixupsysRolePermission;
                    _sysRolePermission = newCollection;
                }
                return _sysRolePermission;
            }
            set
            {
                if (!ReferenceEquals(_sysRolePermission, value))
                {
                    var previousValue = _sysRolePermission as FixupCollection<sysRolePermission>;
                    if (previousValue != null)
                    {
                        previousValue.CollectionChanged -= FixupsysRolePermission;
                    }
                    _sysRolePermission = value;
                    var newValue = value as FixupCollection<sysRolePermission>;
                    if (newValue != null)
                    {
                        newValue.CollectionChanged += FixupsysRolePermission;
                    }
                }
            }
        }
        private ICollection<sysRolePermission> _sysRolePermission;
    
        public virtual ICollection<sysUserRole> sysUserRole
        {
            get
            {
                if (_sysUserRole == null)
                {
                    var newCollection = new FixupCollection<sysUserRole>();
                    newCollection.CollectionChanged += FixupsysUserRole;
                    _sysUserRole = newCollection;
                }
                return _sysUserRole;
            }
            set
            {
                if (!ReferenceEquals(_sysUserRole, value))
                {
                    var previousValue = _sysUserRole as FixupCollection<sysUserRole>;
                    if (previousValue != null)
                    {
                        previousValue.CollectionChanged -= FixupsysUserRole;
                    }
                    _sysUserRole = value;
                    var newValue = value as FixupCollection<sysUserRole>;
                    if (newValue != null)
                    {
                        newValue.CollectionChanged += FixupsysUserRole;
                    }
                }
            }
        }
        private ICollection<sysUserRole> _sysUserRole;

        #endregion

        #region Association Fixup
    
        private void FixupsysRolePermission(object sender, NotifyCollectionChangedEventArgs e)
        {
            if (e.NewItems != null)
            {
                foreach (sysRolePermission item in e.NewItems)
                {
                    item.sysRole = this;
                }
            }
    
            if (e.OldItems != null)
            {
                foreach (sysRolePermission item in e.OldItems)
                {
                    if (ReferenceEquals(item.sysRole, this))
                    {
                        item.sysRole = null;
                    }
                }
            }
        }
    
        private void FixupsysUserRole(object sender, NotifyCollectionChangedEventArgs e)
        {
            if (e.NewItems != null)
            {
                foreach (sysUserRole item in e.NewItems)
                {
                    item.sysRole = this;
                }
            }
    
            if (e.OldItems != null)
            {
                foreach (sysUserRole item in e.OldItems)
                {
                    if (ReferenceEquals(item.sysRole, this))
                    {
                        item.sysRole = null;
                    }
                }
            }
        }

        #endregion

    }
}
