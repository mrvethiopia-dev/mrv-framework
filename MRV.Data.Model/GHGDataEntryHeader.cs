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
    public partial class GHGDataEntryHeader
    {
        #region Primitive Properties
    
        public virtual int Id
        {
            get;
            set;
        }
    
        public virtual int InventoryYearId
        {
            get { return _inventoryYearId; }
            set
            {
                try
                {
                    _settingFK = true;
                    if (_inventoryYearId != value)
                    {
                        if (GHGInventoryYear != null && GHGInventoryYear.Id != value)
                        {
                            GHGInventoryYear = null;
                        }
                        _inventoryYearId = value;
                    }
                }
                finally
                {
                    _settingFK = false;
                }
            }
        }
        private int _inventoryYearId;
    
        public virtual int LocationId
        {
            get { return _locationId; }
            set
            {
                try
                {
                    _settingFK = true;
                    if (_locationId != value)
                    {
                        if (GHGLocations != null && GHGLocations.Id != value)
                        {
                            GHGLocations = null;
                        }
                        _locationId = value;
                    }
                }
                finally
                {
                    _settingFK = false;
                }
            }
        }
        private int _locationId;
    
        public virtual string Status
        {
            get;
            set;
        }
    
        public virtual bool IsChecked
        {
            get;
            set;
        }
    
        public virtual Nullable<System.DateTime> DateChecked
        {
            get;
            set;
        }
    
        public virtual Nullable<int> CheckedById
        {
            get { return _checkedById; }
            set
            {
                try
                {
                    _settingFK = true;
                    if (_checkedById != value)
                    {
                        if (sysUser != null && sysUser.Id != value)
                        {
                            sysUser = null;
                        }
                        _checkedById = value;
                    }
                }
                finally
                {
                    _settingFK = false;
                }
            }
        }
        private Nullable<int> _checkedById;
    
        public virtual bool IsSentForApproval
        {
            get;
            set;
        }
    
        public virtual bool IsApproved
        {
            get;
            set;
        }
    
        public virtual Nullable<System.DateTime> DateApproved
        {
            get;
            set;
        }
    
        public virtual Nullable<int> ApprovedById
        {
            get { return _approvedById; }
            set
            {
                try
                {
                    _settingFK = true;
                    if (_approvedById != value)
                    {
                        if (sysUser1 != null && sysUser1.Id != value)
                        {
                            sysUser1 = null;
                        }
                        _approvedById = value;
                    }
                }
                finally
                {
                    _settingFK = false;
                }
            }
        }
        private Nullable<int> _approvedById;
    
        public virtual string Remark
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
    
        public virtual ICollection<GHGDataEntryDetail> GHGDataEntryDetail
        {
            get
            {
                if (_gHGDataEntryDetail == null)
                {
                    var newCollection = new FixupCollection<GHGDataEntryDetail>();
                    newCollection.CollectionChanged += FixupGHGDataEntryDetail;
                    _gHGDataEntryDetail = newCollection;
                }
                return _gHGDataEntryDetail;
            }
            set
            {
                if (!ReferenceEquals(_gHGDataEntryDetail, value))
                {
                    var previousValue = _gHGDataEntryDetail as FixupCollection<GHGDataEntryDetail>;
                    if (previousValue != null)
                    {
                        previousValue.CollectionChanged -= FixupGHGDataEntryDetail;
                    }
                    _gHGDataEntryDetail = value;
                    var newValue = value as FixupCollection<GHGDataEntryDetail>;
                    if (newValue != null)
                    {
                        newValue.CollectionChanged += FixupGHGDataEntryDetail;
                    }
                }
            }
        }
        private ICollection<GHGDataEntryDetail> _gHGDataEntryDetail;
    
        public virtual GHGInventoryYear GHGInventoryYear
        {
            get { return _gHGInventoryYear; }
            set
            {
                if (!ReferenceEquals(_gHGInventoryYear, value))
                {
                    var previousValue = _gHGInventoryYear;
                    _gHGInventoryYear = value;
                    FixupGHGInventoryYear(previousValue);
                }
            }
        }
        private GHGInventoryYear _gHGInventoryYear;
    
        public virtual sysUser sysUser
        {
            get { return _sysUser; }
            set
            {
                if (!ReferenceEquals(_sysUser, value))
                {
                    var previousValue = _sysUser;
                    _sysUser = value;
                    FixupsysUser(previousValue);
                }
            }
        }
        private sysUser _sysUser;
    
        public virtual sysUser sysUser1
        {
            get { return _sysUser1; }
            set
            {
                if (!ReferenceEquals(_sysUser1, value))
                {
                    var previousValue = _sysUser1;
                    _sysUser1 = value;
                    FixupsysUser1(previousValue);
                }
            }
        }
        private sysUser _sysUser1;
    
        public virtual GHGLocations GHGLocations
        {
            get { return _gHGLocations; }
            set
            {
                if (!ReferenceEquals(_gHGLocations, value))
                {
                    var previousValue = _gHGLocations;
                    _gHGLocations = value;
                    FixupGHGLocations(previousValue);
                }
            }
        }
        private GHGLocations _gHGLocations;

        #endregion

        #region Association Fixup
    
        private bool _settingFK = false;
    
        private void FixupGHGInventoryYear(GHGInventoryYear previousValue)
        {
            if (previousValue != null && previousValue.GHGDataEntryHeader.Contains(this))
            {
                previousValue.GHGDataEntryHeader.Remove(this);
            }
    
            if (GHGInventoryYear != null)
            {
                if (!GHGInventoryYear.GHGDataEntryHeader.Contains(this))
                {
                    GHGInventoryYear.GHGDataEntryHeader.Add(this);
                }
                if (InventoryYearId != GHGInventoryYear.Id)
                {
                    InventoryYearId = GHGInventoryYear.Id;
                }
            }
        }
    
        private void FixupsysUser(sysUser previousValue)
        {
            if (previousValue != null && previousValue.GHGDataEntryHeader.Contains(this))
            {
                previousValue.GHGDataEntryHeader.Remove(this);
            }
    
            if (sysUser != null)
            {
                if (!sysUser.GHGDataEntryHeader.Contains(this))
                {
                    sysUser.GHGDataEntryHeader.Add(this);
                }
                if (CheckedById != sysUser.Id)
                {
                    CheckedById = sysUser.Id;
                }
            }
            else if (!_settingFK)
            {
                CheckedById = null;
            }
        }
    
        private void FixupsysUser1(sysUser previousValue)
        {
            if (previousValue != null && previousValue.GHGDataEntryHeader1.Contains(this))
            {
                previousValue.GHGDataEntryHeader1.Remove(this);
            }
    
            if (sysUser1 != null)
            {
                if (!sysUser1.GHGDataEntryHeader1.Contains(this))
                {
                    sysUser1.GHGDataEntryHeader1.Add(this);
                }
                if (ApprovedById != sysUser1.Id)
                {
                    ApprovedById = sysUser1.Id;
                }
            }
            else if (!_settingFK)
            {
                ApprovedById = null;
            }
        }
    
        private void FixupGHGLocations(GHGLocations previousValue)
        {
            if (previousValue != null && previousValue.GHGDataEntryHeader.Contains(this))
            {
                previousValue.GHGDataEntryHeader.Remove(this);
            }
    
            if (GHGLocations != null)
            {
                if (!GHGLocations.GHGDataEntryHeader.Contains(this))
                {
                    GHGLocations.GHGDataEntryHeader.Add(this);
                }
                if (LocationId != GHGLocations.Id)
                {
                    LocationId = GHGLocations.Id;
                }
            }
        }
    
        private void FixupGHGDataEntryDetail(object sender, NotifyCollectionChangedEventArgs e)
        {
            if (e.NewItems != null)
            {
                foreach (GHGDataEntryDetail item in e.NewItems)
                {
                    item.GHGDataEntryHeader = this;
                }
            }
    
            if (e.OldItems != null)
            {
                foreach (GHGDataEntryDetail item in e.OldItems)
                {
                    if (ReferenceEquals(item.GHGDataEntryHeader, this))
                    {
                        item.GHGDataEntryHeader = null;
                    }
                }
            }
        }

        #endregion

    }
}
