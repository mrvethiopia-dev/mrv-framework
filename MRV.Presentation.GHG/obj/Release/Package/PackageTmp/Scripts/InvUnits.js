Ext.ns('Ext.core.finance.ux.invUnits');
/**
* @desc      Unit of Measure registration form
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.invUnits
* @class     Ext.core.finance.ux.invUnits.Form
* @extends   Ext.form.FormPanel
*/
Ext.core.finance.ux.invUnits.Form = function (config) {
    Ext.core.finance.ux.invUnits.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: InventoryUnits.Get,
            submit: InventoryUnits.Save
        },
        paramOrder: ['Id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'invUnits-form',
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
            fieldLabel: 'Unit Name',
            anchor: '95%',
            allowBlank: false
        }, {
            name: 'Code',
            xtype: 'textfield',
            fieldLabel: 'Unit Code',
            anchor: '75%',
            allowBlank: false
        }]
    }, config));
}
Ext.extend(Ext.core.finance.ux.invUnits.Form, Ext.form.FormPanel);
Ext.reg('invUnits-form', Ext.core.finance.ux.invUnits.Form);

/**
* @desc      Unit of Measure registration form host window
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.invUnits
* @class     Ext.core.finance.ux.invUnits.Window
* @extends   Ext.Window
*/
Ext.core.finance.ux.invUnits.Window = function (config) {
    Ext.core.finance.ux.invUnits.Window.superclass.constructor.call(this, Ext.apply({
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
Ext.extend(Ext.core.finance.ux.invUnits.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.core.finance.ux.invUnits.Form();
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

        Ext.core.finance.ux.invUnits.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {

        if (!this.form.getForm().isValid()) return;
        this.form.getForm().submit({
            waitMsg: 'Please wait...',
            success: function () {
                Ext.getCmp('invUnits-form').getForm().reset();
                Ext.getCmp('invUnits-paging').doRefresh();
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
Ext.reg('invUnits-window', Ext.core.finance.ux.invUnits.Window);

/**
* @desc      Unit of Measure grid
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.invUnits
* @class     Ext.core.finance.ux.invUnits.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.core.finance.ux.invUnits.Grid = function (config) {
    Ext.core.finance.ux.invUnits.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: InventoryUnits.GetAll,
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
        id: 'invUnits-grid',
        searchCriteria: {},
        pageSize: 38,
        title: 'Unit of Measure List',
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
                var form = Ext.getCmp('invUnits-form');
                if (id != null) {

                }
            },
            scope: this,
            rowdblclick: function () {
                if (!this.getSelectionModel().hasSelection()) return;
                var id = this.getSelectionModel().getSelected().get('Id');

                if (id != null) {
                    var hasEditPermission = Ext.core.finance.ux.Reception.getPermission('Unit of Measure', 'CanEdit');
                    if (hasEditPermission) {
                        new Ext.core.finance.ux.invUnits.Window({
                            payrollRegionsId: id,
                            title: 'Edit Unit of Measure'
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
             header: 'Unit Name',
             sortable: true,
             width: 55,
             menuDisabled: true
         }, {
             dataIndex: 'Code',
             header: 'Unit Code',
             sortable: true,
             width: 55,
             menuDisabled: true
         }]
    }, config));
};
Ext.extend(Ext.core.finance.ux.invUnits.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ mode: 'get' }) };
        this.tbar = [];
        this.bbar = new Ext.PagingToolbar({
            id: 'invUnits-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.core.finance.ux.invUnits.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getStore().load({
            params: { start: 0, limit: this.pageSize }
        });
        Ext.core.finance.ux.invUnits.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('invUnits-grid', Ext.core.finance.ux.invUnits.Grid);

/**
* @desc      Unit of Measure panel
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @version   $Id: invUnits.js, 0.1
* @namespace Ext.core.finance.ux.invUnits
* @class     Ext.core.finance.ux.invUnits.Panel
* @extends   Ext.Panel
*/
Ext.core.finance.ux.invUnits.Panel = function (config) {
    Ext.core.finance.ux.invUnits.Panel.superclass.constructor.call(this, Ext.apply({
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
                //disabled: !Ext.core.finance.ux.Reception.getPermission('Unit of Measure', 'CanAdd')
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Edit',
                id: 'editpayrollRegions',
                iconCls: 'icon-edit',
                handler: this.onEditClick,
                //disabled: !Ext.core.finance.ux.Reception.getPermission('Unit of Measure', 'CanEdit')
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Delete',
                id: 'deletepayrollRegions',
                iconCls: 'icon-delete',
                handler: this.onDeleteClick,
                //disabled: !Ext.core.finance.ux.Reception.getPermission('Unit of Measure', 'CanDelete')
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
Ext.extend(Ext.core.finance.ux.invUnits.Panel, Ext.Panel, {
    initComponent: function () {
        this.items = [{
            xtype: 'invUnits-grid',
            id: 'invUnits-grid'
        }];
        Ext.core.finance.ux.invUnits.Panel.superclass.initComponent.apply(this, arguments);
    },

    onAddClick: function () {
        new Ext.core.finance.ux.invUnits.Window({
            payrollRegionsId: 0,
            title: 'Add Unit of Measure'
        }).show();
    },
    onEditClick: function () {
        var grid = Ext.getCmp('invUnits-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');
        new Ext.core.finance.ux.invUnits.Window({
            payrollRegionsId: id,
            title: 'Edit Unit of Measure'
        }).show();
    },
    onDeleteClick: function () {
        var grid = Ext.getCmp('invUnits-grid');
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
                    InventoryUnits.Delete(id, function (result, response) {
                        Ext.getCmp('invUnits-paging').doRefresh();
                    }, this);
                }
            }
        });
    },
    onRegionsPrintClick: function () {
        var grid = Ext.getCmp('invUnits-grid');
        Ext.ux.GridPrinter.stylesheetPath = '/Content/css/print.css';
        Ext.ux.GridPrinter.print(grid);
    }
});
Ext.reg('invUnits-panel', Ext.core.finance.ux.invUnits.Panel);