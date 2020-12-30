Ext.ns('Ext.core.finance.ux.invSuppliers');
/**
* @desc      Suppliers registration form
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.invSuppliers
* @class     Ext.core.finance.ux.invSuppliers.Form
* @extends   Ext.form.FormPanel
*/
Ext.core.finance.ux.invSuppliers.Form = function (config) {
    Ext.core.finance.ux.invSuppliers.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: InventorySuppliers.Get,
            submit: InventorySuppliers.Save
        },
        paramOrder: ['Id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'invSuppliers-form',
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
            fieldLabel: 'Supplier Name',
            anchor: '95%',
            allowBlank: false
        }, {
            name: 'Code',
            xtype: 'textfield',
            fieldLabel: 'Supplier Code',
            anchor: '90%',
            allowBlank: false
        }, {
            name: 'Address',
            xtype: 'textarea',
            fieldLabel: 'Address',
            anchor: '90%',
            allowBlank: false
        }, {
            name: 'IsLocal',
            xtype: 'checkbox',
            fieldLabel: 'Is Local',
            anchor: '75%',
            allowBlank: false
        }]
    }, config));
}
Ext.extend(Ext.core.finance.ux.invSuppliers.Form, Ext.form.FormPanel);
Ext.reg('invSuppliers-form', Ext.core.finance.ux.invSuppliers.Form);

/**
* @desc      Suppliers registration form host window
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.invSuppliers
* @class     Ext.core.finance.ux.invSuppliers.Window
* @extends   Ext.Window
*/
Ext.core.finance.ux.invSuppliers.Window = function (config) {
    Ext.core.finance.ux.invSuppliers.Window.superclass.constructor.call(this, Ext.apply({
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
                this.form.getForm().findField('Id').setValue(this.payrollRegionsId);
                if (this.payrollRegionsId != '') {
                    this.form.load({ params: { Id: this.payrollRegionsId } });
                }
            },
            scope: this
        }
    }, config));
}
Ext.extend(Ext.core.finance.ux.invSuppliers.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.core.finance.ux.invSuppliers.Form();
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

        Ext.core.finance.ux.invSuppliers.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {

        if (!this.form.getForm().isValid()) return;
        this.form.getForm().submit({
            waitMsg: 'Please wait...',
            success: function () {
                Ext.getCmp('invSuppliers-form').getForm().reset();
                Ext.getCmp('invSuppliers-paging').doRefresh();
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
Ext.reg('invSuppliers-window', Ext.core.finance.ux.invSuppliers.Window);

/**
* @desc      Suppliers grid
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.invSuppliers
* @class     Ext.core.finance.ux.invSuppliers.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.core.finance.ux.invSuppliers.Grid = function (config) {
    Ext.core.finance.ux.invSuppliers.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: InventorySuppliers.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Code',
                direction: 'ASC'
            },
            fields: ['Id', 'Name', 'Code'],
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
        id: 'invSuppliers-grid',
        searchCriteria: {},
        pageSize: 38,
        title: 'Suppliers List',
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
                var form = Ext.getCmp('invSuppliers-form');
                if (id != null) {

                }
            },
            scope: this,
            rowdblclick: function () {
                if (!this.getSelectionModel().hasSelection()) return;
                var id = this.getSelectionModel().getSelected().get('Id');

                if (id != null) {
                    var hasEditPermission = Ext.core.finance.ux.Reception.getPermission('Suppliers', 'CanEdit');
                    if (hasEditPermission) {
                        new Ext.core.finance.ux.invSuppliers.Window({
                            payrollRegionsId: id,
                            title: 'Edit Suppliers'
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
             header: 'Supplier Name',
             sortable: true,
             width: 55,
             menuDisabled: true
         }, {
             dataIndex: 'Code',
             header: 'Supplier Code',
             sortable: true,
             width: 55,
             menuDisabled: true
         }]
    }, config));
};
Ext.extend(Ext.core.finance.ux.invSuppliers.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ mode: 'get' }) };
        this.tbar = [];
        this.bbar = new Ext.PagingToolbar({
            id: 'invSuppliers-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.core.finance.ux.invSuppliers.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getStore().load({
            params: { start: 0, limit: this.pageSize }
        });
        Ext.core.finance.ux.invSuppliers.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('invSuppliers-grid', Ext.core.finance.ux.invSuppliers.Grid);

/**
* @desc      Suppliers panel
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @version   $Id: invSuppliers.js, 0.1
* @namespace Ext.core.finance.ux.invSuppliers
* @class     Ext.core.finance.ux.invSuppliers.Panel
* @extends   Ext.Panel
*/
Ext.core.finance.ux.invSuppliers.Panel = function (config) {
    Ext.core.finance.ux.invSuppliers.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false,
        tbar: {
            xtype: 'toolbar',
            items: [{
                xtype: 'button',
                text: 'Add',
                id: 'addpayrollRegions',
                iconCls: 'icon-add',
                handler: this.onAddClick,
                //disabled: !Ext.core.finance.ux.Reception.getPermission('Suppliers', 'CanAdd')
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Edit',
                id: 'editpayrollRegions',
                iconCls: 'icon-edit',
                handler: this.onEditClick,
                //disabled: !Ext.core.finance.ux.Reception.getPermission('Suppliers', 'CanEdit')
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Delete',
                id: 'deletepayrollRegions',
                iconCls: 'icon-delete',
                handler: this.onDeleteClick,
                //disabled: !Ext.core.finance.ux.Reception.getPermission('Suppliers', 'CanDelete')
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Print List',
                id: 'printRegions',
                iconCls: 'icon-Print',
                handler: this.onRegionsPrintClick

            }]
        }
    }, config));
}
Ext.extend(Ext.core.finance.ux.invSuppliers.Panel, Ext.Panel, {
    initComponent: function () {
        this.items = [{
            xtype: 'invSuppliers-grid',
            id: 'invSuppliers-grid'
        }];
        Ext.core.finance.ux.invSuppliers.Panel.superclass.initComponent.apply(this, arguments);
    },

    onAddClick: function () {
        new Ext.core.finance.ux.invSuppliers.Window({
            payrollRegionsId: 0,
            title: 'Add Suppliers'
        }).show();
    },
    onEditClick: function () {
        var grid = Ext.getCmp('invSuppliers-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');
        new Ext.core.finance.ux.invSuppliers.Window({
            payrollRegionsId: id,
            title: 'Edit Suppliers'
        }).show();
    },
    onDeleteClick: function () {
        var grid = Ext.getCmp('invSuppliers-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        Ext.MessageBox.show({
            title: 'Delete',
            msg: 'Are you sure you want to delete the selected Account?',
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
                    InventorySuppliers.Delete(id, function (result, response) {
                        Ext.getCmp('invSuppliers-paging').doRefresh();
                    }, this);
                }
            }
        });
    },
    onRegionsPrintClick: function () {
        var grid = Ext.getCmp('invSuppliers-grid');
        Ext.ux.GridPrinter.stylesheetPath = '/Content/css/print.css';
        Ext.ux.GridPrinter.print(grid);
    }
});
Ext.reg('invSuppliers-panel', Ext.core.finance.ux.invSuppliers.Panel);