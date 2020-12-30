Ext.ns('Ext.core.finance.ux.itemsPicker');

/**
* @desc      Items Picker  window
* @author    Dawit Kiros
* @copyright (c) 2012, LIFT
* @date      April 24, 2012
* @namespace Ext.core.finance.ux.itemsPicker
* @class     Ext.core.finance.ux.itemsPicker.Window
* @extends   Ext.Window
*/
var selectedItemType = '';
Ext.core.finance.ux.itemsPicker.Window = function (config) {
    Ext.core.finance.ux.itemsPicker.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'form',
        width: 500,
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        saveMode: 'add',
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;',
        listeners: {
            show: function () {

                if (this.SelectedCriteria != '') {
                    var grid = Ext.getCmp('itemsPicker-grid');
                    grid.getStore().load({
                        params: {
                            start: 0,
                            limit: 10000,
                            sort: '',
                            dir: '',
                            SelectedCriteria: this.SelectedCriteria
                        }

                    });
                }
            },
            scope: this
        }
    }, config));
}

Ext.extend(Ext.core.finance.ux.itemsPicker.Window, Ext.Window, {
    initComponent: function () {
        this.grid = new Ext.core.finance.ux.itemsPicker.Grid();
       this.items = [this.grid];
        this.bbar = [{
            xtype: 'tbfill'
        }, {
            text: 'Select',
            iconCls: 'icon-select',
            scope: this,
            handler: this.onSelect
        }, {
            xtype: 'tbseparator'
        }, {
            text: 'Close',
            iconCls: 'icon-exit',
            handler: this.onClose,
            scope: this
        }];
        Ext.core.finance.ux.itemsPicker.Window.superclass.initComponent.call(this, arguments);
    },
    onSelect: function() {
    var grid = Ext.getCmp('itemsPicker-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var selectedItems = grid.getSelectionModel().getSelections();
        
        var rec = '';
        for (var i = 0; i < selectedItems.length; i++) {
            rec = rec + selectedItems[i].get('Code') + ";";
        }
        rec = rec.substring(0, rec.length - 1); 
        var form = this.parentForm;    
        form.findField('SelectedCriterias').setValue(rec);
        form.findField('StaffCode').setValue('');
        form.findField('displayCriteria').setValue(rec);
        this.close();
    },
    onClose: function () {
        this.close();
    }
});
Ext.reg('itemsPicker-window', Ext.core.finance.ux.itemsPicker.Window);


var ItemsPickerSelModel = new Ext.grid.CheckboxSelectionModel();

/**
* @desc      itemsPicker selection grid
* @author    Dawit Kiros
* @copyright (c) 2012, LIFT
* @date      April 24, 2012
* @namespace Ext.core.finance.ux.itemsPicker.itemsPicker
* @class     Ext.core.finance.ux.itemsPicker.itemsPicker.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.core.finance.ux.itemsPicker.Grid = function (config) {
    Ext.core.finance.ux.itemsPicker.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
           directFn: Tsa.GetItems,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|SelectedCriteria',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Code',
                direction: 'ASC'
            },
            fields: ['Id', 'Code', 'Name'],
            remoteSort: true,
            listeners: {
                beforeLoad: function () { Ext.getCmp('itemsPicker-grid').body.mask('Loading...', 'x-mask-loading'); },
                load: function () { Ext.getCmp('itemsPicker-grid').body.unmask(); },
                loadException: function () { Ext.getCmp('itemsPicker-grid').body.unmask(); },
                scope: this
            }
        }),
        id: 'itemsPicker-grid',
        pageSize: 10000,
        height: 300,
        stripeRows: true,
        border: true,
        sm: ItemsPickerSelModel,
        viewConfig: {
            forceFit: true,
            autoFill: true
        },
        columns: [ItemsPickerSelModel,{
            dataIndex: 'Id',
            header: 'Id',
            sortable: true,
            hidden: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'Code',
            header: 'Code',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'Name',
            header: 'Name',
            sortable: true,
            width: 100,
            menuDisabled: true
        }]
    }, config));
}
Ext.extend(Ext.core.finance.ux.itemsPicker.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ controlAccountId: this.controlAccountId }) };
        this.tbar = [{
            id: 'txtSearchEmployee',
            xtype: 'textfield',
            emptyText: 'Search',
            hidden:true,
            submitEmptyText: false,
            enableKeyEvents: true,
            style: {
                borderRadius: '5px',
                padding: '0 10px',
                width: '179px'
            },
            listeners: {
                specialkey: function (field, e) {
                    if (e.getKey() == e.ENTER) {
                        var empGrid = Ext.getCmp('itemsPicker-grid');
                        empGrid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue() });
                        empGrid.store.load({ params: { start: 0, limit: empGrid.pageSize} });
                    }
                },
                keyup: function (field) {
                    if (field.getValue() == '') {
                        var empGrid = Ext.getCmp('itemsPicker-grid');
                        empGrid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue() });
                        empGrid.store.load({ params: { start: 0, limit: empGrid.pageSize} });
                    }
                }
            }
        }];
        this.bbar = new Ext.PagingToolbar({
            id: 'itemsPicker-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.core.finance.ux.itemsPicker.Grid.superclass.initComponent.apply(this, arguments);
    },
//    afterRender: function () {
//        this.getStore().load({ params: { start: 0, limit: this.pageSize} });
//        Ext.core.finance.ux.itemsPicker.Grid.superclass.afterRender.apply(this, arguments);
//    }
});
Ext.reg('itemsPicker-grid', Ext.core.finance.ux.itemsPicker.Grid);