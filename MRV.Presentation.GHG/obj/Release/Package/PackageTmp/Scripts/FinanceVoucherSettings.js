Ext.ns('Ext.core.finance.ux.financeVoucherSettings');
/**
* @desc      Payroll Overtime Rate registration form
* @author    Dawit Kiros
* @copyright (c) 2013, 
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.financeVoucherSettings
* @class     Ext.core.finance.ux.financeVoucherSettings.Form
* @extends   Ext.form.FormPanel
*/
Ext.core.finance.ux.financeVoucherSettings.Form = function (config) {
    Ext.core.finance.ux.financeVoucherSettings.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: FinanceVoucherSetting.Get,
            submit: FinanceVoucherSetting.Save
        },
        paramOrder: ['Id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'financeVoucherSettings-form',
        padding: 0,
        autoLabelWidth: true,
        border: false,
        isFormLoad: false,
        labelStyle: 'text-align:right;',
        labelWidth: 150,
        
        frame: true,
        items: [{
            name: 'Id',
            xtype: 'hidden'
        }, {
            id: 'RegionId',
            hiddenName: 'RegionId',
            xtype: 'combo',
            anchor: '75%',
            fieldLabel: 'Region',
            triggerAction: 'all',
            mode: 'local',
            editable: true,
            typeAhead: true,
            forceSelection: true,
            emptyText: '---Select Region---',
            allowBlank: false,
            store: new Ext.data.DirectStore({
                reader: new Ext.data.JsonReader({
                    successProperty: 'success',
                    idProperty: 'Id',
                    root: 'data',
                    fields: ['Id', 'Name']
                }),
                autoLoad: true,
                api: { read: Tsa.GetRegions }
            }),
            valueField: 'Id',
            displayField: 'Name',
            listeners: {
                select: function () {
                    var regionId = Ext.getCmp('RegionId').getValue();
                    var grid = Ext.getCmp('financeVoucherSettings-grid');
                    grid.getStore().load({
                        params: {
                            start: 0,
                            limit: 10,
                            sort: '',
                            dir: '',
                            RegionId: regionId
                        }
                    });
                }
            }
        },  {
            hiddenName: 'VoucherTypeId',
            xtype: 'combo',
            fieldLabel: 'Voucher Type',
            triggerAction: 'all',
            mode: 'local',
            editable: false,
            forceSelection: true,
            allowBlank: false,
            
            store: new Ext.data.DirectStore({
                reader: new Ext.data.JsonReader({
                    successProperty: 'success',
                    idProperty: 'Id',
                    root: 'data',
                    fields: ['Id', 'Name']
                }),
                autoLoad: true,
                api: { read: window.Tsa.GetVoucherTypes }
            }),
            valueField: 'Id',
            displayField: 'Name'
        }, {
            name: 'DefaultAccountId',
            xtype: 'hidden'
        },  {
            name: 'StartingNumber',
            id: 'StartingNumber',
            xtype: 'numberfield',
            fieldLabel: 'Starting Number',
            allowBlank: false
        }, {
            name: 'CurrentNumber',
            xtype: 'numberfield',
            fieldLabel: 'Current Number',
            allowBlank: false
        }, {
            name: 'NumberOfDigits',
            xtype: 'numberfield',
            fieldLabel: 'Number of Digits',
            allowBlank: false
            //disabled: true
        }]
    }, config));
}
Ext.extend(Ext.core.finance.ux.financeVoucherSettings.Form, Ext.form.FormPanel);
Ext.reg('financeVoucherSettings-form', Ext.core.finance.ux.financeVoucherSettings.Form);

/**
* @desc      Payroll Overtime Rate registration form host window
* @author    Dawit Kiros
* @copyright (c) 2013, 
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.financeVoucherSettings
* @class     Ext.core.finance.ux.financeVoucherSettings.Window
* @extends   Ext.Window
*/
Ext.core.finance.ux.financeVoucherSettings.Window = function (config) {
    Ext.core.finance.ux.financeVoucherSettings.Window.superclass.constructor.call(this, Ext.apply({
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
Ext.extend(Ext.core.finance.ux.financeVoucherSettings.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.core.finance.ux.financeVoucherSettings.Form();
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

        Ext.core.finance.ux.financeVoucherSettings.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {

        if (!this.form.getForm().isValid()) return;
        this.form.getForm().submit({
            waitMsg: 'Please wait...',
            success: function () {
                Ext.getCmp('financeVoucherSettings-form').getForm().reset();
                Ext.getCmp('financeVoucherSettings-paging').doRefresh();
            }
        });
    },
    onClose: function () {
        this.close();
    }
});
Ext.reg('financeVoucherSettings-window', Ext.core.finance.ux.financeVoucherSettings.Window);

/**
* @desc      Payroll Overtime Rate grid
* @author    Dawit Kiros
* @copyright (c) 2013, 
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.financeVoucherSettings
* @class     Ext.core.finance.ux.financeVoucherSettings.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.core.finance.ux.financeVoucherSettings.Grid = function (config) {
    Ext.core.finance.ux.financeVoucherSettings.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: FinanceVoucherSetting.GetAllByRegion,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record|RegionId',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Code',
                direction: 'ASC'
            },
            fields: ['Id', 'VoucherType', 'StartingNumber', 'CurrentNumber', 'NumberOfDigits'],
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
        id: 'financeVoucherSettings-grid',
        pageSize: 20,
        columnLines: true,
        stripeRows: true,
        border: true,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }), listeners: {
            rowClick: function() {
                if (!this.getSelectionModel().hasSelection()) return;
                var id = this.getSelectionModel().getSelected().get('Id');
                var form = Ext.getCmp('financeVoucherSettings-form');
                if (id != null) {
                    

                    form.load({ params: { Id: id} });

                    
                }
            }
        },
        columns: [{
            dataIndex: 'Id',
            header: 'Id',
            sortable: false,
            hidden: true,
            width: 100,
            menuDisabled: true
        }, new Ext.grid.RowNumberer(),  {
            dataIndex: 'VoucherType',
            header: 'Voucher Type',
            sortable: false,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'StartingNumber',
            header: 'Starting Number',
            sortable: false,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'CurrentNumber',
            header: 'Current Number',
            sortable: false,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'NumberOfDigits',
            header: 'Number of Digits',
            sortable: false,
            width: 100,
            menuDisabled: true
        }]
    }, config));
};
Ext.extend(Ext.core.finance.ux.financeVoucherSettings.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ mode: 'get' }) };
        this.tbar = [];
        this.bbar = new Ext.PagingToolbar({
            id: 'financeVoucherSettings-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.core.finance.ux.financeVoucherSettings.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
//        this.getStore().load({
//            params: { start: 0, limit: this.pageSize }
//        });
        Ext.core.finance.ux.financeVoucherSettings.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('financeVoucherSettings-grid', Ext.core.finance.ux.financeVoucherSettings.Grid);

/**
* @desc      Payroll Overtime Rate panel
* @author    Dawit Kiros
* @copyright (c) 2013, 
* @date      July 01, 2013
* @version   $Id: financeVoucherSettings.js, 0.1
* @namespace Ext.core.finance.ux.financeVoucherSettings
* @class     Ext.core.finance.ux.financeVoucherSettings.Panel
* @extends   Ext.Panel
*/
Ext.core.finance.ux.financeVoucherSettings.Panel = function (config) {
    Ext.core.finance.ux.financeVoucherSettings.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false,
        tbar: {
            xtype: 'toolbar',
            items: [{
                xtype: 'button',
                text: 'Add',
                id: 'addpayrollOvertimeRate',
                iconCls: 'icon-add',
                handler: this.onAddClick
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Edit',
                id: 'editpayrollOvertimeRate',
                iconCls: 'icon-edit',
                handler: this.onEditClick
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Delete',
                id: 'deletepayrollOvertimeRate',
                iconCls: 'icon-delete',
                handler: this.onDeleteClick
            }]
        }
    }, config));
}
Ext.extend(Ext.core.finance.ux.financeVoucherSettings.Panel, Ext.Panel, {
    initComponent: function () {
        this.items = [{
            xtype: 'financeVoucherSettings-grid',
            id: 'financeVoucherSettings-grid'
        }];
        Ext.core.finance.ux.financeVoucherSettings.Panel.superclass.initComponent.apply(this, arguments);
    },

    onAddClick: function () {
        new Ext.core.finance.ux.financeVoucherSettings.Window({
            payrollOvertimeRateId: 0,
            title: 'Add Payroll Overtime Rate'
        }).show();
    },
    onEditClick: function () {
        var grid = Ext.getCmp('financeVoucherSettings-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');
        new Ext.core.finance.ux.financeVoucherSettings.Window({
            payrollOvertimeRateId: id,
            title: 'Edit Payroll Overtime Rate'
        }).show();
    },
    onDeleteClick: function () {
        var grid = Ext.getCmp('financeVoucherSettings-grid');
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
                    FinanceVoucherSettings.Delete(id, function (result, response) {
                        Ext.getCmp('financeVoucherSettings-paging').doRefresh();
                    }, this);
                }
            }
        });
    }
});
Ext.reg('financeVoucherSettings-panel', Ext.core.finance.ux.financeVoucherSettings.Panel);