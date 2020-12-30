Ext.ns('Ext.core.finance.ux.positionsPicker');

/**
* @desc      Items Picker  window
* @author    Dawit Kiros
* @copyright (c) 2012, LIFT
* @date      April 24, 2012
* @namespace Ext.core.finance.ux.positionsPicker
* @class     Ext.core.finance.ux.positionsPicker.Window
* @extends   Ext.Window
*/
var selectedItemType = '';
Ext.core.finance.ux.positionsPicker.Window = function (config) {
    Ext.core.finance.ux.positionsPicker.Window.superclass.constructor.call(this, Ext.apply({
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
                    var grid = Ext.getCmp('positionsPicker-grid');
                    grid.getStore().load({
                        params: {
                            start: 0,
                            limit: 1000,
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

Ext.extend(Ext.core.finance.ux.positionsPicker.Window, Ext.Window, {
    initComponent: function () {
        this.grid = new Ext.core.finance.ux.positionsPicker.Grid();
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
        Ext.core.finance.ux.positionsPicker.Window.superclass.initComponent.call(this, arguments);
    },
    onSelect: function() {
           var grid = Ext.getCmp('financeAccountPositionMapping-grid');
               

        var selectionGrid = Ext.getCmp('positionsPicker-grid');
        if (!selectionGrid.getSelectionModel().hasSelection()) return;
        var selectedEmployees = selectionGrid.getSelectionModel().getSelections();
        var store = grid.getStore();
        var employee = store.recordType;
        

        var empRecords = [];
        var gridStore = grid.getStore();

        grid.getStore().each(function (model) {
            empRecords.push(model.data);
        });
        countEmpsAdded = 0;
        for (var i = 0; i < selectedEmployees.length; i++) {
        
            var p = new employee({
               
                Id: selectedEmployees[i].get('Id'),
               
                Name: selectedEmployees[i].get('Name') 
            });

            var count = store.getCount();

            // this piece of code will stop from loading similar or selected employees onto the destination grid
            try {

                var recordIndex = gridStore.findBy(
                function (record, id) {
                    if (record.get('Id') == p.data.Id) {
                        return true;
                    }
                    return false;
                });

                if (recordIndex != -1) {
                }
                else {
                    store.insert(count, p);
                }
            }
            catch (e) {
                var exc = e.Message;
                continue;
            }
            countEmpsAdded++;
        }
    },
    onClose: function () {
        this.close();
    }
});
Ext.reg('positionsPicker-window', Ext.core.finance.ux.positionsPicker.Window);


var ItemsPickerSelModel = new Ext.grid.CheckboxSelectionModel();

/**
* @desc      positionsPicker selection grid
* @author    Dawit Kiros
* @copyright (c) 2012, LIFT
* @date      April 24, 2012
* @namespace Ext.core.finance.ux.positionsPicker.positionsPicker
* @class     Ext.core.finance.ux.positionsPicker.positionsPicker.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.core.finance.ux.positionsPicker.Grid = function (config) {
    Ext.core.finance.ux.positionsPicker.Grid.superclass.constructor.call(this, Ext.apply({
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
                beforeLoad: function () { Ext.getCmp('positionsPicker-grid').body.mask('Loading...', 'x-mask-loading'); },
                load: function () { Ext.getCmp('positionsPicker-grid').body.unmask(); },
                loadException: function () { Ext.getCmp('positionsPicker-grid').body.unmask(); },
                scope: this
            }
        }),
        id: 'positionsPicker-grid',
        pageSize: 1000,
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
            width: 100
            //menuDisabled: true
        }, {
            dataIndex: 'Name',
            header: 'Name',
            sortable: true,
            width: 100,
            menuDisabled: true
        }]
    }, config));
}
Ext.extend(Ext.core.finance.ux.positionsPicker.Grid, Ext.grid.GridPanel, {
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
                        var empGrid = Ext.getCmp('positionsPicker-grid');
                        empGrid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue() });
                        empGrid.store.load({ params: { start: 0, limit: empGrid.pageSize} });
                    }
                },
                keyup: function (field) {
                    if (field.getValue() == '') {
                        var empGrid = Ext.getCmp('positionsPicker-grid');
                        empGrid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue() });
                        empGrid.store.load({ params: { start: 0, limit: empGrid.pageSize} });
                    }
                }
            }
        }];
        this.bbar = new Ext.PagingToolbar({
            id: 'positionsPicker-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.core.finance.ux.positionsPicker.Grid.superclass.initComponent.apply(this, arguments);
    },
//    afterRender: function () {
//        this.getStore().load({ params: { start: 0, limit: this.pageSize} });
//        Ext.core.finance.ux.positionsPicker.Grid.superclass.afterRender.apply(this, arguments);
//    }
});
Ext.reg('positionsPicker-grid', Ext.core.finance.ux.positionsPicker.Grid);