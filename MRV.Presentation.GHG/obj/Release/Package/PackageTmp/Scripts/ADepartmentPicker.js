Ext.ns('Ext.core.finance.ux.departmentPicker');

/**
* @desc      Account Picker  window
* @author    Dawit Kiros
* @copyright (c) 2012, LIFT
* @date      April 24, 2012
* @namespace Ext.core.finance.ux.departmentPicker
* @class     Ext.core.finance.ux.departmentPicker.Window
* @extends   Ext.Window
*/

Ext.core.finance.ux.departmentPicker.Window = function (config) {
    Ext.core.finance.ux.departmentPicker.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'form',
        width: 500,
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        saveMode: 'add',
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;'
    }, config));
}

Ext.extend(Ext.core.finance.ux.departmentPicker.Window, Ext.Window, {
    initComponent: function () {
        if (this.find == "Department") {
            this.grid = new Ext.core.finance.ux.departmentPicker.Grid({
                accountId: this.accountId
            });
        }

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
        Ext.core.finance.ux.departmentPicker.Window.superclass.initComponent.call(this, arguments);
    },
    onSelect: function () {
        if (!this.grid.getSelectionModel().hasSelection()) return;
        var id = this.grid.getSelectionModel().getSelected().get('Id');
        var code = this.grid.getSelectionModel().getSelected().get('Code');
        var name = this.grid.getSelectionModel().getSelected().get('Name');
        var form = this.parentForm;
        form.findField(this.controlIdField).setValue(id);
        form.findField(this.controlNameField).setValue( name);
        this.close();
    },
    onClose: function () {
        this.close();
    }
});
Ext.reg('departmentPicker-window', Ext.core.finance.ux.departmentPicker.Window);




/**
* @desc      departmentPicker selection grid
* @author    Dawit Kiros
* @copyright (c) 2012, LIFT
* @date      April 24, 2012
* @namespace Ext.core.finance.ux.departmentPicker.departmentPicker
* @class     Ext.core.finance.ux.departmentPicker.departmentPicker.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.core.finance.ux.departmentPicker.Grid = function (config) {
    Ext.core.finance.ux.departmentPicker.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: PayrollDepartments.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Code',
                direction: 'ASC'
            },
            fields: ['Id', 'Code','Name'],
            remoteSort: true,
            listeners: {
                beforeLoad: function () { Ext.getCmp('departmentPicker-grid').body.mask('Loading...', 'x-mask-loading'); },
                load: function () { Ext.getCmp('departmentPicker-grid').body.unmask(); },
                loadException: function () { Ext.getCmp('departmentPicker-grid').body.unmask(); },
                scope: this
            }
        }),
        id: 'departmentPicker-grid',
        pageSize: 100,
        height: 300,
        stripeRows: true,
        border: true,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        viewConfig: {
            forceFit: true,
            autoFill: true
        },
        columns: [{
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
Ext.extend(Ext.core.finance.ux.departmentPicker.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ controlAccountId: this.controlAccountId }) };
        this.tbar = [{
            id: 'txtSearchEmployee',
            xtype: 'textfield',
            emptyText: 'Search',
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
                        var empGrid = Ext.getCmp('departmentPicker-grid');
                        empGrid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue() });
                        empGrid.store.load({ params: { start: 0, limit: empGrid.pageSize} });
                    }
                },
                keyup: function (field) {
                    if (field.getValue() == '') {
                        var empGrid = Ext.getCmp('departmentPicker-grid');
                        empGrid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue() });
                        empGrid.store.load({ params: { start: 0, limit: empGrid.pageSize} });
                    }
                }
            }
        }];
        this.bbar = new Ext.PagingToolbar({
            id: 'departmentPicker-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.core.finance.ux.departmentPicker.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getStore().load({ params: { start: 0, limit: this.pageSize} });
        Ext.core.finance.ux.departmentPicker.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('departmentPicker-grid', Ext.core.finance.ux.departmentPicker.Grid);