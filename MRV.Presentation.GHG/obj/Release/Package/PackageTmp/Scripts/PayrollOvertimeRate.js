Ext.ns('Ext.core.finance.ux.payrollOvertimeRate');
/**
* @desc      Payroll Overtime Rate registration form
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.payrollOvertimeRate
* @class     Ext.core.finance.ux.payrollOvertimeRate.Form
* @extends   Ext.form.FormPanel
*/
Ext.core.finance.ux.payrollOvertimeRate.Form = function (config) {
    Ext.core.finance.ux.payrollOvertimeRate.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: PayrollOvertimeRates.Get,
            submit: PayrollOvertimeRates.Save
        },
        paramOrder: ['Id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'payrollOvertimeRate-form',
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
           name: 'CreatedAt',
           xtype: 'textfield',
           fieldLabel: 'CreatedAt',
           anchor: '90%',
           hidden: true,
           allowBlank: true
       }, {
            name: 'OTRateName',
            xtype: 'textfield',
            fieldLabel: 'OT Rate Name',
            anchor: '75%',
            allowBlank: true
        }, {
            name: 'OTRateAmount',
            xtype: 'numberfield',
            fieldLabel: 'OT Rate Amount',
            anchor: '75%',
            allowBlank: true
        }, {
            name: 'OTRateIsActive',
            xtype: 'checkbox',
            fieldLabel: 'Is Active',
            anchor: '75%',
            allowBlank: true
        }, {
            name: 'UserCreated',
            xtype: 'textfield',
            fieldLabel: 'UserCreated',
            anchor: '100%',
            allowBlank: true,
            value: 'administrator',
            hidden: true
        }]
    }, config));
}
Ext.extend(Ext.core.finance.ux.payrollOvertimeRate.Form, Ext.form.FormPanel);
Ext.reg('payrollOvertimeRate-form', Ext.core.finance.ux.payrollOvertimeRate.Form);

/**
* @desc      Payroll Overtime Rate registration form host window
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.payrollOvertimeRate
* @class     Ext.core.finance.ux.payrollOvertimeRate.Window
* @extends   Ext.Window
*/
Ext.core.finance.ux.payrollOvertimeRate.Window = function (config) {
    Ext.core.finance.ux.payrollOvertimeRate.Window.superclass.constructor.call(this, Ext.apply({
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
                this.form.getForm().findField('Id').setValue(this.payrollOvertimeRateId);
                if (this.payrollOvertimeRateId != '') {
                    this.form.load({ params: { Id: this.payrollOvertimeRateId} });
                }
            },
            scope: this
        }
    }, config));
}
Ext.extend(Ext.core.finance.ux.payrollOvertimeRate.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.core.finance.ux.payrollOvertimeRate.Form();
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

        Ext.core.finance.ux.payrollOvertimeRate.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {

        if (!this.form.getForm().isValid()) return;
        this.form.getForm().submit({
            waitMsg: 'Please wait...',
            success: function () {
                Ext.getCmp('payrollOvertimeRate-form').getForm().reset();
                Ext.getCmp('payrollOvertimeRate-paging').doRefresh();
            }
        });
    },
    onClose: function () {
        this.close();
    }
});
Ext.reg('payrollOvertimeRate-window', Ext.core.finance.ux.payrollOvertimeRate.Window);

/**
* @desc      Payroll Overtime Rate grid
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.payrollOvertimeRate
* @class     Ext.core.finance.ux.payrollOvertimeRate.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.core.finance.ux.payrollOvertimeRate.Grid = function (config) {
    Ext.core.finance.ux.payrollOvertimeRate.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: PayrollOvertimeRates.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Code',
                direction: 'ASC'
            },
            fields: ['Id', 'OTRateName', 'OTRateAmount', 'OTRateIsActive'],
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
        id: 'payrollOvertimeRate-grid',
        searchCriteria: {},
        pageSize: 10,
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
                var form = Ext.getCmp('payrollOvertimeRate-form');
                if (id != null) {
                    //form.load({ params: { Id: id} });
                }
            },
            scope: this,
            rowdblclick: function () {
                if (!this.getSelectionModel().hasSelection()) return;
                var id = this.getSelectionModel().getSelected().get('Id');

                if (id != null) {
                    var hasEditPermission = Ext.core.finance.ux.Reception.getPermission('Overtime Rates', 'CanEdit');
                    if (hasEditPermission) {
                        new Ext.core.finance.ux.payrollOvertimeRate.Window({
                            payrollOvertimeRateId: id,
                            title: 'Edit Payroll Overtime Rate'
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
             dataIndex: 'OTRateName',
             header: 'Rate Name',
             sortable: true,
             width: 55,
             menuDisabled: true
         }, {
             dataIndex: 'OTRateAmount',
             header: 'Rate Amount',
             sortable: true,
             width: 55,
             menuDisabled: true
         }, {
             dataIndex: 'OTRateIsActive',
             header: 'Is Active',
             sortable: true,
             width: 55,
             menuDisabled: true
         }]
    }, config));
};
Ext.extend(Ext.core.finance.ux.payrollOvertimeRate.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ mode: 'get' }) };
        this.tbar = [];
        this.bbar = new Ext.PagingToolbar({
            id: 'payrollOvertimeRate-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.core.finance.ux.payrollOvertimeRate.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getStore().load({
            params: { start: 0, limit: this.pageSize }
        });
        Ext.core.finance.ux.payrollOvertimeRate.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('payrollOvertimeRate-grid', Ext.core.finance.ux.payrollOvertimeRate.Grid);

/**
* @desc      Payroll Overtime Rate panel
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @version   $Id: payrollOvertimeRate.js, 0.1
* @namespace Ext.core.finance.ux.payrollOvertimeRate
* @class     Ext.core.finance.ux.payrollOvertimeRate.Panel
* @extends   Ext.Panel
*/
Ext.core.finance.ux.payrollOvertimeRate.Panel = function (config) {
    Ext.core.finance.ux.payrollOvertimeRate.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false,
        tbar: {
            xtype: 'toolbar',
            items: [{
                xtype: 'button',
                text: 'Add',
                id: 'addpayrollOvertimeRate',
                iconCls: 'icon-add',
                handler: this.onAddClick,
                disabled: !Ext.core.finance.ux.Reception.getPermission('Overtime Rates', 'CanAdd')
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Edit',
                id: 'editpayrollOvertimeRate',
                iconCls: 'icon-edit',
                handler: this.onEditClick,
                disabled: !Ext.core.finance.ux.Reception.getPermission('Overtime Rates', 'CanEdit')
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Delete',
                id: 'deletepayrollOvertimeRate',
                iconCls: 'icon-delete',
                handler: this.onDeleteClick,
                disabled: !Ext.core.finance.ux.Reception.getPermission('Overtime Rates', 'CanDelete')
            }]
        }
    }, config));
}
Ext.extend(Ext.core.finance.ux.payrollOvertimeRate.Panel, Ext.Panel, {
    initComponent: function () {
        this.items = [{
            xtype: 'payrollOvertimeRate-grid',
            id: 'payrollOvertimeRate-grid'
        }];
        Ext.core.finance.ux.payrollOvertimeRate.Panel.superclass.initComponent.apply(this, arguments);
    },

    onAddClick: function () {
        new Ext.core.finance.ux.payrollOvertimeRate.Window({
            payrollOvertimeRateId: 0,
            title: 'Add Payroll Overtime Rate'
        }).show();
    },
    onEditClick: function () {
        var grid = Ext.getCmp('payrollOvertimeRate-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');
        new Ext.core.finance.ux.payrollOvertimeRate.Window({
            payrollOvertimeRateId: id,
            title: 'Edit Payroll Overtime Rate'
        }).show();
    },
    onDeleteClick: function () {
        var grid = Ext.getCmp('payrollOvertimeRate-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        Ext.MessageBox.show({
            title: 'Delete',
            msg: 'Are you sure you want to delete the selected Payroll Overtime Rate',
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
                    PayrollOvertimeRates.Delete(id, function (result, response) {
                        Ext.getCmp('payrollOvertimeRate-paging').doRefresh();
                    }, this);
                }
            }
        });
    }
});
Ext.reg('payrollOvertimeRate-panel', Ext.core.finance.ux.payrollOvertimeRate.Panel);