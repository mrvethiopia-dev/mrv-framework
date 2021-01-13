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
    public partial class GHGLocationTypes
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
    
        public virtual bool IsDeleted
        {
            get;
            set;
        }

        #endregion

        #region Navigation Properties
    
        public virtual ICollection<GHGLocations> GHGLocations
        {
            get
            {
                if (_gHGLocations == null)
                {
                    var newCollection = new FixupCollection<GHGLocations>();
                    newCollection.CollectionChanged += FixupGHGLocations;
                    _gHGLocations = newCollection;
                }
                return _gHGLocations;
            }
            set
            {
                if (!ReferenceEquals(_gHGLocations, value))
                {
                    var previousValue = _gHGLocations as FixupCollection<GHGLocations>;
                    if (previousValue != null)
                    {
                        previousValue.CollectionChanged -= FixupGHGLocations;
                    }
                    _gHGLocations = value;
                    var newValue = value as FixupCollection<GHGLocations>;
                    if (newValue != null)
                    {
                        newValue.CollectionChanged += FixupGHGLocations;
                    }
                }
            }
        }
        private ICollection<GHGLocations> _gHGLocations;

        #endregion

        #region Association Fixup
    
        private void FixupGHGLocations(object sender, NotifyCollectionChangedEventArgs e)
        {
            if (e.NewItems != null)
            {
                foreach (GHGLocations item in e.NewItems)
                {
                    item.GHGLocationTypes = this;
                }
            }
    
            if (e.OldItems != null)
            {
                foreach (GHGLocations item in e.OldItems)
                {
                    if (ReferenceEquals(item.GHGLocationTypes, this))
                    {
                        item.GHGLocationTypes = null;
                    }
                }
            }
        }

        #endregion

    }
}