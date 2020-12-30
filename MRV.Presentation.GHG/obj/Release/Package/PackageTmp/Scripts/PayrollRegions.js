Ext.ns('Ext.core.finance.ux.payrollRegions');
/**
* @desc      Regions registration form
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.payrollRegions
* @class     Ext.core.finance.ux.payrollRegions.Form
* @extends   Ext.form.FormPanel
*/
Ext.core.finance.ux.payrollRegions.Form = function (config) {
    Ext.core.finance.ux.payrollRegions.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: PayrollRegions.Get,
            submit: PayrollRegions.Save
        },
        paramOrder: ['Id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'payrollRegions-form',
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
            name: 'Code',
            xtype: 'textfield',
            fieldLabel: 'Region Code',
            anchor: '75%',
            allowBlank: false
        },{
            name: 'Name',
            xtype: 'textfield',
            fieldLabel: 'Region Name',
            anchor: '95%',
            allowBlank: false
        }, {
            name: 'ShortName',
            xtype: 'textfield',
            fieldLabel: 'Short Name',
            anchor: '95%',
            allowBlank: false
        }]
    }, config));
}
Ext.extend(Ext.core.finance.ux.payrollRegions.Form, Ext.form.FormPanel);
Ext.reg('payrollRegions-form', Ext.core.finance.ux.payrollRegions.Form);

/**
* @desc      Regions registration form host window
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.payrollRegions
* @class     Ext.core.finance.ux.payrollRegions.Window
* @extends   Ext.Window
*/
Ext.core.finance.ux.payrollRegions.Window = function (config) {
    Ext.core.finance.ux.payrollRegions.Window.superclass.constructor.call(this, Ext.apply({
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
                    this.form.load({ params: { Id: this.payrollRegionsId} });
                }
            },
            scope: this
        }
    }, config));
}
Ext.extend(Ext.core.finance.ux.payrollRegions.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.core.finance.ux.payrollRegions.Form();
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

        Ext.core.finance.ux.payrollRegions.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {

        if (!this.form.getForm().isValid()) return;
        this.form.getForm().submit({
            waitMsg: 'Please wait...',
            success: function () {
                Ext.getCmp('payrollRegions-form').getForm().reset();
                Ext.getCmp('payrollRegions-paging').doRefresh();
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
Ext.reg('payrollRegions-window', Ext.core.finance.ux.payrollRegions.Window);

/**
* @desc      Regions grid
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.payrollRegions
* @class     Ext.core.finance.ux.payrollRegions.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.core.finance.ux.payrollRegions.Grid = function (config) {
    Ext.core.finance.ux.payrollRegions.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: PayrollRegions.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Code',
                direction: 'ASC'
            },
            fields: ['Id', 'Name','ShortName', 'Code'],
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
        id: 'payrollRegions-grid',
        searchCriteria: {},
        pageSize: 38,
        title: 'Regions List',
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
                var form = Ext.getCmp('payrollRegions-form');
                if (id != null) {
                  
                }
            },
            scope: this,
            rowdblclick: function () {
                if (!this.getSelectionModel().hasSelection()) return;
                var id = this.getSelectionModel().getSelected().get('Id');

                if (id != null) {
                    var hasEditPermission = Ext.core.finance.ux.Reception.getPermission('Regions', 'CanEdit');
                    if (hasEditPermission) {
                        new Ext.core.finance.ux.payrollRegions.Window({
                            payrollRegionsId: id,
                            title: 'Edit Regions'
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
             header: 'Region Name',
             sortable: true,
             width: 55,
             menuDisabled: true
         },{
             dataIndex: 'ShortName',
             header: 'Short Name',
             sortable: true,
             width: 55,
             menuDisabled: true
         }, {
             dataIndex: 'Code',
             header: 'Region Code',
             sortable: true,
             width: 55,
             menuDisabled: true
         }]
    }, config));
};
Ext.extend(Ext.core.finance.ux.payrollRegions.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ mode: 'get' }) };
        this.tbar = [];
        this.bbar = new Ext.PagingToolbar({
            id: 'payrollRegions-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.core.finance.ux.payrollRegions.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getStore().load({
            params: { start: 0, limit: this.pageSize }
        });
        Ext.core.finance.ux.payrollRegions.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('payrollRegions-grid', Ext.core.finance.ux.payrollRegions.Grid);

/**
* @desc      Regions panel
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @version   $Id: payrollRegions.js, 0.1
* @namespace Ext.core.finance.ux.payrollRegions
* @class     Ext.core.finance.ux.payrollRegions.Panel
* @extends   Ext.Panel
*/
Ext.core.finance.ux.payrollRegions.Panel = function (config) {
    Ext.core.finance.ux.payrollRegions.Panel.superclass.constructor.call(this, Ext.apply({
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
                disabled: !Ext.core.finance.ux.Reception.getPermission('Regions', 'CanAdd')
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Edit',
                id: 'editpayrollRegions',
                iconCls: 'icon-edit',
                handler: this.onEditClick,
                disabled: !Ext.core.finance.ux.Reception.getPermission('Regions', 'CanEdit')
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Delete',
                id: 'deletepayrollRegions',
                iconCls: 'icon-delete',
                handler: this.onDeleteClick,
                disabled: !Ext.core.finance.ux.Reception.getPermission('Regions', 'CanDelete')
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
Ext.extend(Ext.core.finance.ux.payrollRegions.Panel, Ext.Panel, {
    initComponent: function () {
        this.items = [{
            xtype: 'payrollRegions-grid',
            id: 'payrollRegions-grid'
        }];
        Ext.core.finance.ux.payrollRegions.Panel.superclass.initComponent.apply(this, arguments);
    },

    onAddClick: function () {
        new Ext.core.finance.ux.payrollRegions.Window({
            payrollRegionsId: 0,
            title: 'Add Regions'
        }).show();
    },
    onEditClick: function () {
        var grid = Ext.getCmp('payrollRegions-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');
        new Ext.core.finance.ux.payrollRegions.Window({
            payrollRegionsId: id,
            title: 'Edit Regions'
        }).show();
    },
    onDeleteClick: function () {
        var grid = Ext.getCmp('payrollRegions-grid');
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
                    PayrollRegions.Delete(id, function (result, response) {
                        Ext.getCmp('payrollRegions-paging').doRefresh();
                    }, this);
                }
            }
        });
    },
    onRegionsPrintClick: function () {
        var grid = Ext.getCmp('payrollRegions-grid');
        Ext.ux.GridPrinter.stylesheetPath = '/Content/css/print.css';
        Ext.ux.GridPrinter.print(grid);
    }
});
Ext.reg('payrollRegions-panel', Ext.core.finance.ux.payrollRegions.Panel);