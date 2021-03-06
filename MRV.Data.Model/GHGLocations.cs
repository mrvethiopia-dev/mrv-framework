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
    public partial class GHGLocations
    {
        #region Primitive Properties
    
        public virtual int Id
        {
            get;
            set;
        }
    
        public virtual int LocationTypeId
        {
            get { return _locationTypeId; }
            set
            {
                try
                {
                    _settingFK = true;
                    if (_locationTypeId != value)
                    {
                        if (GHGLocationTypes != null && GHGLocationTypes.Id != value)
                        {
                            GHGLocationTypes = null;
                        }
                        _locationTypeId = value;
                    }
                }
                finally
                {
                    _settingFK = false;
                }
            }
        }
        private int _locationTypeId;
    
        public virtual Nullable<int> ParentId
        {
            get { return _parentId; }
            set
            {
                try
                {
                    _settingFK = true;
                    if (_parentId != value)
                    {
                        if (GHGLocations2 != null && GHGLocations2.Id != value)
                        {
                            GHGLocations2 = null;
                        }
                        _parentId = value;
                    }
                }
                finally
                {
                    _settingFK = false;
                }
            }
        }
        private Nullable<int> _parentId;
    
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
    
        public virtual bool CanCaptureData
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
    
        public virtual ICollection<GHGDataEntryHeader> GHGDataEntryHeader
        {
            get
            {
                if (_gHGDataEntryHeader == null)
                {
                    var newCollection = new FixupCollection<GHGDataEntryHeader>();
                    newCollection.CollectionChanged += FixupGHGDataEntryHeader;
                    _gHGDataEntryHeader = newCollection;
                }
                return _gHGDataEntryHeader;
            }
            set
            {
                if (!ReferenceEquals(_gHGDataEntryHeader, value))
                {
                    var previousValue = _gHGDataEntryHeader as FixupCollection<GHGDataEntryHeader>;
                    if (previousValue != null)
                    {
                        previousValue.CollectionChanged -= FixupGHGDataEntryHeader;
                    }
                    _gHGDataEntryHeader = value;
                    var newValue = value as FixupCollection<GHGDataEntryHeader>;
                    if (newValue != null)
                    {
                        newValue.CollectionChanged += FixupGHGDataEntryHeader;
                    }
                }
            }
        }
        private ICollection<GHGDataEntryHeader> _gHGDataEntryHeader;
    
        public virtual ICollection<GHGLocations> GHGLocations1
        {
            get
            {
                if (_gHGLocations1 == null)
                {
                    var newCollection = new FixupCollection<GHGLocations>();
                    newCollection.CollectionChanged += FixupGHGLocations1;
                    _gHGLocations1 = newCollection;
                }
                return _gHGLocations1;
            }
            set
            {
                if (!ReferenceEquals(_gHGLocations1, value))
                {
                    var previousValue = _gHGLocations1 as FixupCollection<GHGLocations>;
                    if (previousValue != null)
                    {
                        previousValue.CollectionChanged -= FixupGHGLocations1;
                    }
                    _gHGLocations1 = value;
                    var newValue = value as FixupCollection<GHGLocations>;
                    if (newValue != null)
                    {
                        newValue.CollectionChanged += FixupGHGLocations1;
                    }
                }
            }
        }
        private ICollection<GHGLocations> _gHGLocations1;
    
        public virtual GHGLocations GHGLocations2
        {
            get { return _gHGLocations2; }
            set
            {
                if (!ReferenceEquals(_gHGLocations2, value))
                {
                    var previousValue = _gHGLocations2;
                    _gHGLocations2 = value;
                    FixupGHGLocations2(previousValue);
                }
            }
        }
        private GHGLocations _gHGLocations2;
    
        public virtual GHGLocationTypes GHGLocationTypes
        {
            get { return _gHGLocationTypes; }
            set
            {
                if (!ReferenceEquals(_gHGLocationTypes, value))
                {
                    var previousValue = _gHGLocationTypes;
                    _gHGLocationTypes = value;
                    FixupGHGLocationTypes(previousValue);
                }
            }
        }
        private GHGLocationTypes _gHGLocationTypes;

        #endregion

        #region Association Fixup
    
        private bool _settingFK = false;
    
        private void FixupGHGLocations2(GHGLocations previousValue)
        {
            if (previousValue != null && previousValue.GHGLocations1.Contains(this))
            {
                previousValue.GHGLocations1.Remove(this);
            }
    
            if (GHGLocations2 != null)
            {
                if (!GHGLocations2.GHGLocations1.Contains(this))
                {
                    GHGLocations2.GHGLocations1.Add(this);
                }
                if (ParentId != GHGLocations2.Id)
                {
                    ParentId = GHGLocations2.Id;
                }
            }
            else if (!_settingFK)
            {
                ParentId = null;
            }
        }
    
        private void FixupGHGLocationTypes(GHGLocationTypes previousValue)
        {
            if (previousValue != null && previousValue.GHGLocations.Contains(this))
            {
                previousValue.GHGLocations.Remove(this);
            }
    
            if (GHGLocationTypes != null)
            {
                if (!GHGLocationTypes.GHGLocations.Contains(this))
                {
                    GHGLocationTypes.GHGLocations.Add(this);
                }
                if (LocationTypeId != GHGLocationTypes.Id)
                {
                    LocationTypeId = GHGLocationTypes.Id;
                }
            }
        }
    
        private void FixupGHGDataEntryHeader(object sender, NotifyCollectionChangedEventArgs e)
        {
            if (e.NewItems != null)
            {
                foreach (GHGDataEntryHeader item in e.NewItems)
                {
                    item.GHGLocations = this;
                }
            }
    
            if (e.OldItems != null)
            {
                foreach (GHGDataEntryHeader item in e.OldItems)
                {
                    if (ReferenceEquals(item.GHGLocations, this))
                    {
                        item.GHGLocations = null;
                    }
                }
            }
        }
    
        private void FixupGHGLocations1(object sender, NotifyCollectionChangedEventArgs e)
        {
            if (e.NewItems != null)
            {
                foreach (GHGLocations item in e.NewItems)
                {
                    item.GHGLocations2 = this;
                }
            }
    
            if (e.OldItems != null)
            {
                foreach (GHGLocations item in e.OldItems)
                {
                    if (ReferenceEquals(item.GHGLocations2, this))
                    {
                        item.GHGLocations2 = null;
                    }
                }
            }
        }

        #endregion

    }
}
