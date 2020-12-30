Ext.ns('Ext.core.finance.ux.invStores');
/**
* @desc      Stores registration form
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.invStores
* @class     Ext.core.finance.ux.invStores.Form
* @extends   Ext.form.FormPanel
*/
Ext.core.finance.ux.invStores.Form = function (config) {
    Ext.core.finance.ux.invStores.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: InventoryStores.Get,
            submit: InventoryStores.Save
        },
        paramOrder: ['Id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'invStores-form',
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
            fieldLabel: 'Stores Name',
            anchor: '95%',
            allowBlank: false
        }, {
            name: 'Code',
            xtype: 'textfield',
            fieldLabel: 'Stores Code',
            anchor: '75%',
            allowBlank: false
        }]
    }, config));
}
Ext.extend(Ext.core.finance.ux.invStores.Form, Ext.form.FormPanel);
Ext.reg('invStores-form', Ext.core.finance.ux.invStores.Form);

/**
* @desc      Stores registration form host window
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.invStores
* @class     Ext.core.finance.ux.invStores.Window
* @extends   Ext.Window
*/
Ext.core.finance.ux.invStores.Window = function (config) {
    Ext.core.finance.ux.invStores.Window.superclass.constructor.call(this, Ext.apply({
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
Ext.extend(Ext.core.finance.ux.invStores.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.core.finance.ux.invStores.Form();
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

        Ext.core.finance.ux.invStores.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {

        if (!this.form.getForm().isValid()) return;
        this.form.getForm().submit({
            waitMsg: 'Please wait...',
            success: function () {
                Ext.getCmp('invStores-form').getForm().reset();
                Ext.getCmp('invStores-paging').doRefresh();
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
Ext.reg('invStores-window', Ext.core.finance.ux.invStores.Window);

/**
* @desc      Stores grid
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.invStores
* @class     Ext.core.finance.ux.invStores.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.core.finance.ux.invStores.Grid = function (config) {
    Ext.core.finance.ux.invStores.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: InventoryStores.GetAll,
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
        id: 'invStores-grid',
        searchCriteria: {},
        pageSize: 38,
        title: 'Stores List',
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
                var form = Ext.getCmp('invStores-form');
                if (id != null) {

                }
            },
            scope: this,
            rowdblclick: function () {
                if (!this.getSelectionModel().hasSelection()) return;
                var id = this.getSelectionModel().getSelected().get('Id');

                if (id != null) {
                    var hasEditPermission = Ext.core.finance.ux.Reception.getPermission('Stores', 'CanEdit');
                    if (hasEditPermission) {
                        new Ext.core.finance.ux.invStores.Window({
                            payrollRegionsId: id,
                            title: 'Edit Stores'
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
             header: 'Stores Name',
             sortable: true,
             width: 55,
             menuDisabled: true
         },{
             dataIndex: 'Code',
             header: 'Stores Code',
             sortable: true,
             width: 55,
             menuDisabled: true
         }]
    }, config));
};
Ext.extend(Ext.core.finance.ux.invStores.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ mode: 'get' }) };
        this.tbar = [];
        this.bbar = new Ext.PagingToolbar({
            id: 'invStores-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.core.finance.ux.invStores.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getStore().load({
            params: { start: 0, limit: this.pageSize }
        });
        Ext.core.finance.ux.invStores.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('invStores-grid', Ext.core.finance.ux.invStores.Grid);

/**
* @desc      Stores panel
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @version   $Id: invStores.js, 0.1
* @namespace Ext.core.finance.ux.invStores
* @class     Ext.core.finance.ux.invStores.Panel
* @extends   Ext.Panel
*/
Ext.core.finance.ux.invStores.Panel = function (config) {
    Ext.core.finance.ux.invStores.Panel.superclass.constructor.call(this, Ext.apply({
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
                //disabled: !Ext.core.finance.ux.Reception.getPermission('Stores', 'CanAdd')
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Edit',
                id: 'editpayrollRegions',
                iconCls: 'icon-edit',
                handler: this.onEditClick,
                //disabled: !Ext.core.finance.ux.Reception.getPermission('Stores', 'CanEdit')
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Delete',
                id: 'deletepayrollRegions',
                iconCls: 'icon-delete',
                handler: this.onDeleteClick,
                //disabled: !Ext.core.finance.ux.Reception.getPermission('Stores', 'CanDelete')
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
Ext.extend(Ext.core.finance.ux.invStores.Panel, Ext.Panel, {
    initComponent: function () {
        this.items = [{
            xtype: 'invStores-grid',
            id: 'invStores-grid'
        }];
        Ext.core.finance.ux.invStores.Panel.superclass.initComponent.apply(this, arguments);
    },

    onAddClick: function () {
        new Ext.core.finance.ux.invStores.Window({
            payrollRegionsId: 0,
            title: 'Add Stores'
        }).show();
    },
    onEditClick: function () {
        var grid = Ext.getCmp('invStores-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');
        new Ext.core.finance.ux.invStores.Window({
            payrollRegionsId: id,
            title: 'Edit Stores'
        }).show();
    },
    onDeleteClick: function () {
        var grid = Ext.getCmp('invStores-grid');
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
                    InventoryStores.Delete(id, function (result, response) {
                        Ext.getCmp('invStores-paging').doRefresh();
                    }, this);
                }
            }
        });
    },
    onRegionsPrintClick: function () {
        var grid = Ext.getCmp('invStores-grid');
        Ext.ux.GridPrinter.stylesheetPath = '/Content/css/print.css';
        Ext.ux.GridPrinter.print(grid);
    }
});
Ext.reg('invStores-panel', Ext.core.finance.ux.invStores.Panel);