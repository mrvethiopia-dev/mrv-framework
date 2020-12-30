Ext.ns('Ext.core.finance.ux.FinanceVehicles');
/**
* @desc      Vehicles registration form
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.FinanceVehicles
* @class     Ext.core.finance.ux.FinanceVehicles.Form
* @extends   Ext.form.FormPanel
*/
Ext.core.finance.ux.FinanceVehicles.Form = function (config) {
    Ext.core.finance.ux.FinanceVehicles.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: FinanceVehicles.Get,
            submit: FinanceVehicles.Save
        },
        paramOrder: ['Id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'FinanceVehicles-form',
        padding: 5,
        labelWidth: 150,
        autoHeight: true,
        border: false,
        baseCls: 'x-plain',
        items: [{
            name: 'Id',
            xtype: 'textfield',
           hidden: true
       },{
            name: 'Name',
            xtype: 'textfield',
            fieldLabel: 'Vehicle Name',
            anchor: '95%',
            allowBlank: false
        }, {
            name: 'PlateNo',
            xtype: 'textfield',
            fieldLabel: 'Plate No',
            anchor: '75%',
            allowBlank: false
        }, {
            name: 'SerialNo',
            xtype: 'textfield',
            fieldLabel: 'Serial No',
            anchor: '75%',
            allowBlank: false
        }]
    }, config));
}
Ext.extend(Ext.core.finance.ux.FinanceVehicles.Form, Ext.form.FormPanel);
Ext.reg('FinanceVehicles-form', Ext.core.finance.ux.FinanceVehicles.Form);

/**
* @desc      Vehicles registration form host window
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.FinanceVehicles
* @class     Ext.core.finance.ux.FinanceVehicles.Window
* @extends   Ext.Window
*/
Ext.core.finance.ux.FinanceVehicles.Window = function (config) {
    Ext.core.finance.ux.FinanceVehicles.Window.superclass.constructor.call(this, Ext.apply({
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
                this.form.getForm().findField('Id').setValue(this.payrollWoredasId);
                if (this.payrollWoredasId != '') {
                    this.form.load({ params: { Id: this.payrollWoredasId} });
                }
            },
            scope: this
        }
    }, config));
}
Ext.extend(Ext.core.finance.ux.FinanceVehicles.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.core.finance.ux.FinanceVehicles.Form();
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

        Ext.core.finance.ux.FinanceVehicles.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {

        if (!this.form.getForm().isValid()) return;
        this.form.getForm().submit({
            waitMsg: 'Please wait...',
            success: function () {
                Ext.getCmp('FinanceVehicles-form').getForm().reset();
                Ext.getCmp('FinanceVehicles-paging').doRefresh();
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
Ext.reg('FinanceVehicles-window', Ext.core.finance.ux.FinanceVehicles.Window);

/**
* @desc      Vehicles grid
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.FinanceVehicles
* @class     Ext.core.finance.ux.FinanceVehicles.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.core.finance.ux.FinanceVehicles.Grid = function (config) {
    Ext.core.finance.ux.FinanceVehicles.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: FinanceVehicles.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Code',
                direction: 'ASC'
            },
            fields: ['Id', 'Name', 'PlateNo', 'SerialNo'],
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
        id: 'FinanceVehicles-grid',
        searchCriteria: {},
        pageSize: 38,
        title: 'Vehicles List',
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
                var form = Ext.getCmp('FinanceVehicles-form');
                if (id != null) {
                  
                }
            },
            scope: this,
            rowdblclick: function () {
                if (!this.getSelectionModel().hasSelection()) return;
                var id = this.getSelectionModel().getSelected().get('Id');

                if (id != null) {
                    var hasEditPermission = Ext.core.finance.ux.Reception.getPermission('Vehicles', 'CanEdit');
                    if (hasEditPermission) {
                        new Ext.core.finance.ux.FinanceVehicles.Window({
                            payrollWoredasId: id,
                            title: 'Edit Vehicles'
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
             header: 'Name',
             sortable: true,
             width: 55,
             menuDisabled: true
         }, {
             dataIndex: 'PlateNo',
             header: 'Plate No',
             sortable: true,
             width: 55,
             menuDisabled: true
         }, {
             dataIndex: 'SerialNo',
             header: 'Serial No',
             sortable: true,
             width: 55,
             menuDisabled: true
         }]
    }, config));
};
Ext.extend(Ext.core.finance.ux.FinanceVehicles.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ mode: 'get' }) };
        this.tbar = [];
        this.bbar = new Ext.PagingToolbar({
            id: 'FinanceVehicles-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.core.finance.ux.FinanceVehicles.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getStore().load({
            params: { start: 0, limit: this.pageSize }
        });
        Ext.core.finance.ux.FinanceVehicles.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('FinanceVehicles-grid', Ext.core.finance.ux.FinanceVehicles.Grid);

/**
* @desc      Vehicles panel
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @version   $Id: FinanceVehicles.js, 0.1
* @namespace Ext.core.finance.ux.FinanceVehicles
* @class     Ext.core.finance.ux.FinanceVehicles.Panel
* @extends   Ext.Panel
*/
Ext.core.finance.ux.FinanceVehicles.Panel = function (config) {
    Ext.core.finance.ux.FinanceVehicles.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false,
        tbar: {
            xtype: 'toolbar',
            items: [{
                xtype: 'button',
                text: 'Add',
                id: 'addVehicles',
                iconCls: 'icon-add',
                handler: this.onAddClick,
                disabled: !Ext.core.finance.ux.Reception.getPermission('Vehicles', 'CanAdd')
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Edit',
                id: 'editVehicles',
                iconCls: 'icon-edit',
                handler: this.onEditClick,
                disabled: !Ext.core.finance.ux.Reception.getPermission('Vehicles', 'CanEdit')
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Delete',
                id: 'deleteVehicles',
                iconCls: 'icon-delete',
                handler: this.onDeleteClick,
                disabled: !Ext.core.finance.ux.Reception.getPermission('Vehicles', 'CanDelete')
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Print List',
                id: 'printVehicles',
                iconCls: 'icon-Print',
                handler: this.onVehiclesPrintClick

            }]
        }
    }, config));
}
Ext.extend(Ext.core.finance.ux.FinanceVehicles.Panel, Ext.Panel, {
    initComponent: function () {
        this.items = [{
            xtype: 'FinanceVehicles-grid',
            id: 'FinanceVehicles-grid'
        }];
        Ext.core.finance.ux.FinanceVehicles.Panel.superclass.initComponent.apply(this, arguments);
    },

    onAddClick: function () {
        new Ext.core.finance.ux.FinanceVehicles.Window({
            payrollWoredasId: 0,
            title: 'Add Vehicles'
        }).show();
    },
    onEditClick: function () {
        var grid = Ext.getCmp('FinanceVehicles-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');
        new Ext.core.finance.ux.FinanceVehicles.Window({
            payrollWoredasId: id,
            title: 'Edit Vehicles'
        }).show();
    },
    onDeleteClick: function () {
        var grid = Ext.getCmp('FinanceVehicles-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        Ext.MessageBox.show({
            title: 'Delete',
            msg: 'Are you sure you want to delete the selected Budget?',
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
                    FinanceVehicles.Delete(id, function (result, response) {
                        Ext.getCmp('FinanceVehicles-paging').doRefresh();
                    }, this);
                }
            }
        });
    },
    onVehiclesPrintClick: function () {
        var grid = Ext.getCmp('FinanceVehicles-grid');
        Ext.ux.GridPrinter.stylesheetPath = '/Content/css/print.css';
        Ext.ux.GridPrinter.print(grid);
    }
});
Ext.reg('FinanceVehicles-panel', Ext.core.finance.ux.FinanceVehicles.Panel);