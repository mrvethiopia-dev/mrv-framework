Ext.ns('Ext.core.finance.ux.payrollPositions');
/**
* @desc      Positions registration form
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.payrollPositions
* @class     Ext.core.finance.ux.payrollPositions.Form
* @extends   Ext.form.FormPanel
*/
Ext.core.finance.ux.payrollPositions.Form = function (config) {
    Ext.core.finance.ux.payrollPositions.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: PayrollPositions.Get,
            submit: PayrollPositions.Save
        },
        paramOrder: ['Id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'payrollPositions-form',
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
            fieldLabel: 'Position Code',
            anchor: '75%',
            allowBlank: false
        },{
            name: 'Name',
            xtype: 'textfield',
            fieldLabel: 'Position Name',
            anchor: '95%',
            allowBlank: false
        }, {
            id: 'BudgetCodeId',
            hiddenName: 'BudgetCodeId',
            xtype: 'combo',
            fieldLabel: 'Budget Code',
            triggerAction: 'all',
            mode: 'local',
            editable: true,
            listWidth: 250,
            allowBlank: true,
            store: new Ext.data.DirectStore({
                reader: new Ext.data.JsonReader({
                    successProperty: 'success',
                    idProperty: 'Id',
                    root: 'data',
                    fields: ['Id', 'Code']
                }),
                autoLoad: true,
                api: { read: window.Tsa.GetAllBudgetCodes }
            }),
            valueField: 'Id', displayField: 'Code'
        }]
    }, config));
}
Ext.extend(Ext.core.finance.ux.payrollPositions.Form, Ext.form.FormPanel);
Ext.reg('payrollPositions-form', Ext.core.finance.ux.payrollPositions.Form);

/**
* @desc      Positions registration form host window
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.payrollPositions
* @class     Ext.core.finance.ux.payrollPositions.Window
* @extends   Ext.Window
*/
Ext.core.finance.ux.payrollPositions.Window = function (config) {
    Ext.core.finance.ux.payrollPositions.Window.superclass.constructor.call(this, Ext.apply({
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
                this.form.getForm().findField('Id').setValue(this.payrollPositionsId);
                if (this.payrollPositionsId != '') {
                    this.form.load({ params: { Id: this.payrollPositionsId} });
                }
            },
            scope: this
        }
    }, config));
}
Ext.extend(Ext.core.finance.ux.payrollPositions.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.core.finance.ux.payrollPositions.Form();
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

        Ext.core.finance.ux.payrollPositions.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {

        if (!this.form.getForm().isValid()) return;
        this.form.getForm().submit({
            waitMsg: 'Please wait...',
            success: function () {
                Ext.getCmp('payrollPositions-form').getForm().reset();
                Ext.getCmp('payrollPositions-paging').doRefresh();
            }
        });
    },
    onClose: function () {
        this.close();
    }
});
Ext.reg('payrollPositions-window', Ext.core.finance.ux.payrollPositions.Window);

/**
* @desc      Positions grid
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.payrollPositions
* @class     Ext.core.finance.ux.payrollPositions.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.core.finance.ux.payrollPositions.Grid = function (config) {
    Ext.core.finance.ux.payrollPositions.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: PayrollPositions.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Code',
                direction: 'ASC'
            },
            fields: ['Id', 'Name', 'Code', 'BudgetCode'],
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
        id: 'payrollPositions-grid',
        searchCriteria: {},
        pageSize: 38,
        title: 'Positions List',
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
                var form = Ext.getCmp('payrollPositions-form');
                if (id != null) {
                  
                }
            },
            scope: this,
            rowdblclick: function () {
                if (!this.getSelectionModel().hasSelection()) return;
                var id = this.getSelectionModel().getSelected().get('Id');

                if (id != null) {
                    var hasEditPermission = Ext.core.finance.ux.Reception.getPermission('Positions', 'CanEdit');
                    if (hasEditPermission) {
                        new Ext.core.finance.ux.payrollPositions.Window({
                            payrollPositionsId: id,
                            title: 'Edit Positions'
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
             header: 'Positions Name',
             sortable: true,
             width: 55,
             menuDisabled: true
         }, {
             dataIndex: 'Code',
             header: 'Positions Code',
             sortable: true,
             width: 55,
             menuDisabled: true
         }, {
             dataIndex: 'BudgetCode',
             header: 'Budget Code',
             sortable: true,
             width: 55,
             menuDisabled: true
         }]
    }, config));
};
Ext.extend(Ext.core.finance.ux.payrollPositions.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ mode: 'get' }) };
        this.tbar = [];
        this.bbar = new Ext.PagingToolbar({
            id: 'payrollPositions-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.core.finance.ux.payrollPositions.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getStore().load({
            params: { start: 0, limit: this.pageSize }
        });
        Ext.core.finance.ux.payrollPositions.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('payrollPositions-grid', Ext.core.finance.ux.payrollPositions.Grid);

/**
* @desc      Positions panel
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @version   $Id: payrollPositions.js, 0.1
* @namespace Ext.core.finance.ux.payrollPositions
* @class     Ext.core.finance.ux.payrollPositions.Panel
* @extends   Ext.Panel
*/
Ext.core.finance.ux.payrollPositions.Panel = function (config) {
    Ext.core.finance.ux.payrollPositions.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false,
        tbar: {
            xtype: 'toolbar',
            items: [{
                xtype: 'button',
                text: 'Add',
                id: 'addpayrollPositions',
                iconCls: 'icon-add',
                handler: this.onAddClick,
                disabled: !Ext.core.finance.ux.Reception.getPermission('Positions', 'CanAdd')
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Edit',
                id: 'editpayrollPositions',
                iconCls: 'icon-edit',
                handler: this.onEditClick,
                disabled: !Ext.core.finance.ux.Reception.getPermission('Positions', 'CanEdit')
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Delete',
                id: 'deletepayrollPositions',
                iconCls: 'icon-delete',
                handler: this.onDeleteClick,
                disabled: !Ext.core.finance.ux.Reception.getPermission('Positions', 'CanDelete')
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Print List',
                id: 'printPositions',
                iconCls: 'icon-Print',
                handler: this.onPositionsPrintClick

            }]
        }
    }, config));
}
Ext.extend(Ext.core.finance.ux.payrollPositions.Panel, Ext.Panel, {
    initComponent: function () {
        this.items = [{
            xtype: 'payrollPositions-grid',
            id: 'payrollPositions-grid'
        }];
        Ext.core.finance.ux.payrollPositions.Panel.superclass.initComponent.apply(this, arguments);
    },

    onAddClick: function () {
        new Ext.core.finance.ux.payrollPositions.Window({
            payrollPositionsId: 0,
            title: 'Add Positions'
        }).show();
    },
    onEditClick: function () {
        var grid = Ext.getCmp('payrollPositions-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');
        new Ext.core.finance.ux.payrollPositions.Window({
            payrollPositionsId: id,
            title: 'Edit Positions'
        }).show();
    },
    onDeleteClick: function () {
        var grid = Ext.getCmp('payrollPositions-grid');
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
                    PayrollPositions.Delete(id, function (result, response) {
                        Ext.getCmp('payrollPositions-paging').doRefresh();
                    }, this);
                }
            }
        });
    },
    onPositionsPrintClick: function () {
        var grid = Ext.getCmp('payrollPositions-grid');
        Ext.ux.GridPrinter.stylesheetPath = '/Content/css/print.css';
        Ext.ux.GridPrinter.print(grid);
    }
});
Ext.reg('payrollPositions-panel', Ext.core.finance.ux.payrollPositions.Panel);