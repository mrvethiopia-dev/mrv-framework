Ext.ns('Ext.mrv.ghginventory.ux.inventoryYears');
/**
* @desc      Inventory Year registration form
* @author    Dawit Kiros


* @namespace Ext.mrv.ghginventory.ux.inventoryYears
* @class     Ext.mrv.ghginventory.ux.inventoryYears.Form
* @extends   Ext.form.FormPanel
*/
Ext.mrv.ghginventory.ux.inventoryYears.Form = function (config) {
    Ext.mrv.ghginventory.ux.inventoryYears.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: GHGInventoryYears.Get,
            submit: GHGInventoryYears.Save
        },
        paramOrder: ['Id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'inventoryYears-form',
        padding: 5,
        labelWidth: 150,
        autoHeight: true,
        border: false,
        baseCls: 'x-plain',
        items: [{
            name: 'Id',
            xtype: 'textfield',
           hidden: true
       }, {
            name: 'Name',
            xtype: 'textfield',
            fieldLabel: 'Inventory Year',
            anchor: '95%',
            allowBlank: false
        }]
    }, config));
}
Ext.extend(Ext.mrv.ghginventory.ux.inventoryYears.Form, Ext.form.FormPanel);
Ext.reg('inventoryYears-form', Ext.mrv.ghginventory.ux.inventoryYears.Form);

/**
* @desc      Inventory Year registration form host window
* @author    Dawit Kiros


* @namespace Ext.mrv.ghginventory.ux.inventoryYears
* @class     Ext.mrv.ghginventory.ux.inventoryYears.Window
* @extends   Ext.Window
*/
Ext.mrv.ghginventory.ux.inventoryYears.Window = function (config) {
    Ext.mrv.ghginventory.ux.inventoryYears.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        width: 400,
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;',
        listeners: {
            show: function () {
                this.form.getForm().findField('Id').setValue(this.inventoryYearsId);
                if (this.inventoryYearsId != '') {
                    this.form.load({ params: { Id: this.inventoryYearsId} });
                }
            },
            scope: this
        }
    }, config));
}
Ext.extend(Ext.mrv.ghginventory.ux.inventoryYears.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.mrv.ghginventory.ux.inventoryYears.Form();
        this.items = [this.form];
        this.buttons = [{
            text: 'Save',
            iconCls: 'icon-save',
            handler: this.onSave,
            scope: this
        }, {
            text: 'Close',
            iconCls: 'icon-exit',
            handler: this.onClose,
            scope: this
        }];

        Ext.mrv.ghginventory.ux.inventoryYears.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {

        if (!this.form.getForm().isValid()) return;
        this.form.getForm().submit({
            waitMsg: 'Please wait...',
            success: function () {
                Ext.getCmp('inventoryYears-form').getForm().reset();
                Ext.getCmp('inventoryYears-paging').doRefresh();
            },
            failure: function (f, a) {
                Ext.MessageBox.show({
                    title: 'Error',
                    msg: a.result.data,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.ERROR,
                    scope: this
                });
            }
        });
    },
    onClose: function () {
        this.close();
    }
});
Ext.reg('inventoryYears-window', Ext.mrv.ghginventory.ux.inventoryYears.Window);

/**
* @desc      Inventory Year grid
* @author    Dawit Kiros


* @namespace Ext.mrv.ghginventory.ux.inventoryYears
* @class     Ext.mrv.ghginventory.ux.inventoryYears.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.mrv.ghginventory.ux.inventoryYears.Grid = function (config) {
    Ext.mrv.ghginventory.ux.inventoryYears.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: GHGInventoryYears.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Code',
                direction: 'ASC'
            },
            fields: ['Id', 'Name'],
            remoteSort: true,
            listeners: {
                beforeLoad: function () {
                    this.body.mask('Loading...', 'x-mask-loading');
                },
                load: function () {
                    this.body.unmask();
                },
                loadException: function () {
                    this.body.unmask();
                },
                scope: this
            }
        }),
        id: 'inventoryYears-grid',
        searchCriteria: {},
        pageSize: 38,
        title: 'Inventory Year List',
        //height: 600,
        stripeRows: true,
        columnLines: true,
        border: false,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        viewConfig: {
            forceFit: true,
            autoFill: true
        },
        listeners: {
            rowClick: function () {
                if (!this.getSelectionModel().hasSelection()) return;
                var id = this.getSelectionModel().getSelected().get('Id');
                var form = Ext.getCmp('inventoryYears-form');
                if (id != null) {
                  
                }
            },
            scope: this,
            rowdblclick: function () {
                if (!this.getSelectionModel().hasSelection()) return;
                var id = this.getSelectionModel().getSelected().get('Id');

                if (id != null) {
                    var hasEditPermission = Ext.mrv.ghginventory.ux.Reception.getPermission('Inventory Years', 'CanEdit');
                    if (hasEditPermission) {
                        new Ext.mrv.ghginventory.ux.inventoryYears.Window({
                            inventoryYearsId: id,
                            title: 'Edit Inventory Year'
                        }).show();
                    }
                }

            }
        },
        columns: [{
            dataIndex: 'Id',
            header: 'Id',
            sortable: true,
            hidden: true,
            width: 55,
            menuDisabled: true
        }, new Ext.erp.ux.grid.PagingRowNumberer(),
         {
             dataIndex: 'Name',
             header: 'Inventory Year',
             sortable: true,
             width: 55,
             menuDisabled: true
         }]
    }, config));
};
Ext.extend(Ext.mrv.ghginventory.ux.inventoryYears.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ mode: 'get' }) };
        this.tbar = [];
        this.bbar = new Ext.PagingToolbar({
            id: 'inventoryYears-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.mrv.ghginventory.ux.inventoryYears.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getStore().load({
            params: { start: 0, limit: this.pageSize }
        });
        Ext.mrv.ghginventory.ux.inventoryYears.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('inventoryYears-grid', Ext.mrv.ghginventory.ux.inventoryYears.Grid);

/**
* @desc      Inventory Year panel
* @author    Dawit Kiros


* @version   $Id: inventoryYears.js, 0.1
* @namespace Ext.mrv.ghginventory.ux.inventoryYears
* @class     Ext.mrv.ghginventory.ux.inventoryYears.Panel
* @extends   Ext.Panel
*/
Ext.mrv.ghginventory.ux.inventoryYears.Panel = function (config) {
    Ext.mrv.ghginventory.ux.inventoryYears.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false,
        tbar: {
            xtype: 'toolbar',
            items: [{
                xtype: 'button',
                text: 'Add',
                id: 'addInventoryYears',
                iconCls: 'icon-add',
                handler: this.onAddClick,
                disabled: !Ext.mrv.ghginventory.ux.Reception.getPermission('Inventory Years', 'CanAdd')
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Edit',
                id: 'editInventoryYears',
                iconCls: 'icon-edit',
                handler: this.onEditClick,
                disabled: !Ext.mrv.ghginventory.ux.Reception.getPermission('Inventory Years', 'CanEdit')
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Delete',
                id: 'deleteInventoryYears',
                iconCls: 'icon-delete',
                handler: this.onDeleteClick,
                disabled: !Ext.mrv.ghginventory.ux.Reception.getPermission('Inventory Years', 'CanDelete')
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Print List',
                id: 'printInventoryYears',
                iconCls: 'icon-Print',
                handler: this.onInventoryYearsPrintClick

            }]
        }
    }, config));
}
Ext.extend(Ext.mrv.ghginventory.ux.inventoryYears.Panel, Ext.Panel, {
    initComponent: function () {
        this.items = [{
            xtype: 'inventoryYears-grid',
            id: 'inventoryYears-grid'
        }];
        Ext.mrv.ghginventory.ux.inventoryYears.Panel.superclass.initComponent.apply(this, arguments);
    },

    onAddClick: function () {
        new Ext.mrv.ghginventory.ux.inventoryYears.Window({
            inventoryYearsId: 0,
            title: 'Add Inventory Year'
        }).show();
    },
    onEditClick: function () {
        var grid = Ext.getCmp('inventoryYears-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');
        new Ext.mrv.ghginventory.ux.inventoryYears.Window({
            inventoryYearsId: id,
            title: 'Edit Inventory Year'
        }).show();
    },
    onDeleteClick: function () {
        var grid = Ext.getCmp('inventoryYears-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        Ext.MessageBox.show({
            title: 'Delete',
            msg: 'Are you sure you want to delete the selected Inventory Year?',
            buttons: {
                ok: 'Yes',
                no: 'No'
            },
            icon: Ext.MessageBox.QUESTION,
            scope: this,
            animEl: 'delete',
            fn: function (btn) {
                if (btn == 'ok') {
                    var id = grid.getSelectionModel().getSelected().get('Id');
                    GHGInventoryYears.Delete(id, function (result, response) {
                        Ext.getCmp('inventoryYears-paging').doRefresh();
                    }, this);
                }
            }
        });
    },
    onInventoryYearsPrintClick: function () {
        var grid = Ext.getCmp('inventoryYears-grid');
        Ext.ux.GridPrinter.stylesheetPath = '/Content/css/print.css';
        Ext.ux.GridPrinter.print(grid);
    }
});
Ext.reg('inventoryYears-panel', Ext.mrv.ghginventory.ux.inventoryYears.Panel);