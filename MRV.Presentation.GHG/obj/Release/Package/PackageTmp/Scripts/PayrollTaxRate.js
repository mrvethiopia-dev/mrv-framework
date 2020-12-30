Ext.ns('Ext.core.finance.ux.payrollTaxRate');
/**
* @desc      Payroll Tax Rate registration form
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.payrollTaxRate
* @class     Ext.core.finance.ux.payrollTaxRate.Form
* @extends   Ext.form.FormPanel
*/
Ext.core.finance.ux.payrollTaxRate.Form = function (config) {
    Ext.core.finance.ux.payrollTaxRate.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: window.PayrollTaxRates.Get,
            submit: window.PayrollTaxRates.Save
        },
        paramOrder: ['Id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'payrollTaxRate-form',
        padding: 5,
        labelWidth: 150,
        autoHeight: true,
        border: false,
        baseCls: 'x-plain',
        items: [{
            name: 'Id',
            xtype: 'hidden'
        }, {
            name: 'CreatedAt',
            xtype: 'textfield',
            fieldLabel: 'CreatedAt',
            anchor: '90%',
            hidden: true,
            allowBlank: true
        }, {
            name: 'FromSalary',
            xtype: 'numberfield',
            fieldLabel: 'Basic Salary From',
            anchor: '75%',
            allowBlank: false
        }, {
            name: 'ToSalary',
            xtype: 'numberfield',
            fieldLabel: 'Basic Salary To',
            anchor: '75%',
            allowBlank: false
        }, {
            name: 'Rate',
            xtype: 'numberfield',
            fieldLabel: 'Tax Rate (%)',
            anchor: '75%',
            allowBlank: false
        }, {
            name: 'DeductableAmount',
            xtype: 'numberfield',
            fieldLabel: 'Deductable Amount',
            anchor: '75%',
            allowBlank: false
        }, {
            name: 'Remark',
            xtype: 'textfield',
            fieldLabel: 'Remark',
            anchor: '100%',
            allowBlank: true
        }]
    }, config));
}
Ext.extend(Ext.core.finance.ux.payrollTaxRate.Form, Ext.form.FormPanel);
Ext.reg('payrollTaxRate-form', Ext.core.finance.ux.payrollTaxRate.Form);

/**
* @desc      Payroll Tax Rate registration form host window
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.payrollTaxRate
* @class     Ext.core.finance.ux.payrollTaxRate.Window
* @extends   Ext.Window
*/
Ext.core.finance.ux.payrollTaxRate.Window = function (config) {
    Ext.core.finance.ux.payrollTaxRate.Window.superclass.constructor.call(this, Ext.apply({
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
                this.form.getForm().findField('Id').setValue(this.payrollTaxRateId);
                if (this.payrollTaxRateId > 0) {
                    this.form.load({ params: { Id: this.payrollTaxRateId} });
                }
            },
            scope: this
        }
    }, config));
}
Ext.extend(Ext.core.finance.ux.payrollTaxRate.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.core.finance.ux.payrollTaxRate.Form();
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
        /*this.tools = [{
            id: 'refresh',
            qtip: 'Reset',
            handler: function () {
                this.form.getForm().reset();
            },
            scope: this
        }];*/
        Ext.core.finance.ux.payrollTaxRate.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {

        if (!this.form.getForm().isValid()) return;
        this.form.getForm().submit({
            waitMsg: 'Please wait...',
            success: function () {
                Ext.getCmp('payrollTaxRate-form').getForm().reset();
                Ext.getCmp('payrollTaxRate-paging').doRefresh();
            }
        });
    },
    onClose: function () {
        this.close();
    }
});
Ext.reg('payrollTaxRate-window', Ext.core.finance.ux.payrollTaxRate.Window);

/**
* @desc      Payroll Tax Rate grid
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.payrollTaxRate
* @class     Ext.core.finance.ux.payrollTaxRate.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.core.finance.ux.payrollTaxRate.Grid = function (config) {
    Ext.core.finance.ux.payrollTaxRate.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: window.PayrollTaxRates.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Code',
                direction: 'ASC'
            },
            fields: ['Id', 'FromSalary', 'ToSalary', 'Rate', 'DeductableAmount', 'Remark', 'CreatedAt'],
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
        id: 'payrollTaxRate-grid',
        searchCriteria: {},
        pageSize: 10,
        title: 'Tax Rates',
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
                var form = Ext.getCmp('payrollTaxRate-form');
                if (id > 0) {
                    //form.load({ params: { Id: id} });
                }
            },
            scope: this,
            rowdblclick: function () {
                if (!this.getSelectionModel().hasSelection()) return;
                var id = this.getSelectionModel().getSelected().get('Id');

                if (id != null) {
                    var hasEditPermission = Ext.core.finance.ux.Reception.getPermission('Tax Rate', 'CanEdit');
                    if (hasEditPermission) {
                        new Ext.core.finance.ux.payrollTaxRate.Window({
                            payrollTaxRateId: id,
                            title: 'Edit Payroll Tax Rate'
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
        }, {
            dataIndex: 'FromSalary',
            header: 'From Salary',
            sortable: true,
            width: 55,
            menuDisabled: true
        }, {
            dataIndex: 'ToSalary',
            header: 'To Salary',
            sortable: true,
            width: 55,
            menuDisabled: true
        }, {
            dataIndex: 'Rate',
            header: 'Rate',
            sortable: true,
            width: 55,
            menuDisabled: true
        }, {
            dataIndex: 'DeductableAmount',
            header: 'DeductableAmount',
            sortable: true,
            width: 55,
            menuDisabled: true
        }, {
            dataIndex: 'Remark',
            header: 'Remark',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'CreatedAt',
            header: 'CreatedAt',
            sortable: true,
            hidden: true,
            width: 250,
            menuDisabled: true
        }]
    }, config));
};
Ext.extend(Ext.core.finance.ux.payrollTaxRate.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ mode: 'get' }) };
        this.tbar = [];
        this.bbar = new Ext.PagingToolbar({
            id: 'payrollTaxRate-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.core.finance.ux.payrollTaxRate.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getStore().load({
            params: { start: 0, limit: this.pageSize }
        });
        Ext.core.finance.ux.payrollTaxRate.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('payrollTaxRate-grid', Ext.core.finance.ux.payrollTaxRate.Grid);

/**
* @desc      Payroll Tax Rate panel
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @version   $Id: payrollTaxRate.js, 0.1
* @namespace Ext.core.finance.ux.payrollTaxRate
* @class     Ext.core.finance.ux.payrollTaxRate.Panel
* @extends   Ext.Panel
*/
Ext.core.finance.ux.payrollTaxRate.Panel = function (config) {
    Ext.core.finance.ux.payrollTaxRate.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false,
        tbar: {
            xtype: 'toolbar',
            items: [{
                xtype: 'button',
                text: 'Add',
                id: 'addpayrollTaxRate',
                iconCls: 'icon-add',
                handler: this.onAddClick,                
                disabled: !Ext.core.finance.ux.Reception.getPermission('Tax Rate', 'CanAdd')
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Edit',
                id: 'editpayrollTaxRate',
                iconCls: 'icon-edit',
                handler: this.onEditClick,
                disabled: !Ext.core.finance.ux.Reception.getPermission('Tax Rate', 'CanEdit')
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Delete',
                id: 'deletepayrollTaxRate',
                iconCls: 'icon-delete',
                handler: this.onDeleteClick,
                disabled: !Ext.core.finance.ux.Reception.getPermission('Tax Rate', 'CanDelete')
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Print List',
                id: 'printTaxRates',
                iconCls: 'icon-Print',
                handler: this.onTaxRatesPrintClick

            }]
        }
    }, config));
}
Ext.extend(Ext.core.finance.ux.payrollTaxRate.Panel, Ext.Panel, {
    initComponent: function () {
        this.items = [{
            xtype: 'payrollTaxRate-grid',
            id: 'payrollTaxRate-grid'
        }];
        Ext.core.finance.ux.payrollTaxRate.Panel.superclass.initComponent.apply(this, arguments);
    },
    /*afterRender: function () {
        Workbench.CheckPermission('payrollTaxRate-panel', function (result) {
            Ext.getCmp('addpayrollTaxRate').setDisabled(!result.data.CanAdd);
            Ext.getCmp('editpayrollTaxRate').setDisabled(!result.data.CanEdit);
            Ext.getCmp('deletepayrollTaxRate').setDisabled(!result.data.CanDelete);
        });
        Ext.core.finance.ux.payrollTaxRate.Panel.superclass.afterRender.apply(this, arguments);
    },*/
    onAddClick: function () {
        new Ext.core.finance.ux.payrollTaxRate.Window({
            payrollTaxRateId: 0,
            title: 'Add Payroll Tax Rate'
        }).show();
    },
    onEditClick: function () {
        var grid = Ext.getCmp('payrollTaxRate-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');
        new Ext.core.finance.ux.payrollTaxRate.Window({
            payrollTaxRateId: id,
            title: 'Edit Payroll Tax Rate'
        }).show();
    },
    onDeleteClick: function () {
        var grid = Ext.getCmp('payrollTaxRate-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        Ext.MessageBox.show({
            title: 'Delete',
            msg: 'Are you sure you want to delete the selected Payroll Tax Rate',
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
                    window.PayrollTaxRates.Delete(id, function (result, response) {
                        Ext.getCmp('payrollTaxRate-paging').doRefresh();
                    }, this);
                }
            }
        });
    },
    onTaxRatesPrintClick: function () {
        var grid = Ext.getCmp('payrollTaxRate-grid');
        Ext.ux.GridPrinter.stylesheetPath = '/Content/css/print.css';
        Ext.ux.GridPrinter.print(grid);
    }
});
Ext.reg('payrollTaxRate-panel', Ext.core.finance.ux.payrollTaxRate.Panel);