//Ext.ns('Ext.core.finance.ux.FinanceBankReconciliation');
///**
//* @desc      FinanceBankReconciliation registration form
//* @author    Dawit Kiros
//* @copyright (c) 2013, Cybersoft
//* @date      April 24, 2013
//* @namespace Ext.core.finance.ux.FinanceBankReconciliation
//* @class     Ext.core.finance.ux.FinanceBankReconciliation.Form
//* @extends   Ext.form.FormPanel
//*/
//Ext.core.finance.ux.FinanceBankReconciliation.Form = function (config) {
//    Ext.core.finance.ux.FinanceBankReconciliation.Form.superclass.constructor.call(this, Ext.apply({
//        api: {
//            load: FinanceBankReconciliation.Get,
//            submit: FinanceBankReconciliation.Save
//        },
//        paramOrder: ['Id'],
//        defaults: {
//            anchor: '100%'

//        },
//        id: 'FinanceBankReconciliation-form',
//        height: 100,
//        layout: 'form',
//        labelWidth: 120,
//        bodyStyle: 'background:#ebebeb;padding:5px',
//        baseCls: 'x-plain',
//                items: [{
//            layout: 'column',
//            items: [{
//                columnWidth: .39,
//                bodyStyle: 'background:#ebebeb;padding:5px',
//                defaults: {
//                    labelStyle: 'text-align:right;',
//                    msgTarget: 'side'
//                },
//                border: false,
//                layout: 'form',
//                items: [{
//                    id: 'RclnBankId',
//                    xtype: 'combo',
//                    fieldLabel: 'Select Bank',
//                    anchor:'70%',
//                    triggerAction: 'all',
//                    mode: 'local',
//                    editable: true,
//                    typeAhead: true,
//                    forceSelection: true,
//                    emptyText: 'Select Bank',
//                    listWidth: 250,
//                    allowblank :false,
//                    store: new Ext.data.DirectStore({
//                        reader: new Ext.data.JsonReader({
//                            successProperty: 'success',
//                            idProperty: 'Id',
//                            root: 'data',
//                            accountNo: 'AccountNo',
//                            fields: ['Id', 'BranchName', 'AccountNo']
//                        }),
//                        autoLoad: true,
//                        api: { read: Tsa.GetCompanyBankBranches }
//                    }),
//                    valueField: 'Id',
//                    displayField: 'BranchName',
//                    listeners: {
//                        'select': function(cmb, rec, idx) {
//                            var form = Ext.getCmp('FinanceBankReconciliation-form').getForm();

//                            form.findField('AccountNo').setValue(rec.data.AccountNo);

//                        }
//                    }
//                },{
//                        id: 'ReclnPeriod',
//                        xtype: 'combo',
//                        anchor: '70%',
//                        fieldLabel: 'Period',
//                        triggerAction: 'all',
//                        mode: 'local',
//                        editable: false,
//                        typeAhead: true,
//                        forceSelection: true,
//                        emptyText: '---Select Period---',
//                        allowBlank: false,
//                        store: new Ext.data.DirectStore({
//                            reader: new Ext.data.JsonReader({
//                                successProperty: 'success',
//                                idProperty: 'Id',
//                                root: 'data',
//                                fields: ['Id', 'Name']
//                            }),
//                            autoLoad: true,
//                            api: { read: Tsa.GetActivePeriods }
//                        }),
//                        valueField: 'Id',
//                        displayField: 'Name',
//                        listeners: {
//                            select: function() {
//                                var periodId = Ext.getCmp('ReclnPeriod').getValue();
//                                var bankId = Ext.getCmp('RclnBankId').getValue();

//                                var rclnGrid = Ext.getCmp('FinanceBankReconciliation-grid');
//                                rclnGrid.getStore().load({
//                                    params: {
//                                        start: 0,
//                                        limit: 20000,
//                                        sort: '',
//                                        dir: '',
//                                        PeriodId: periodId,
//                                        BankId : bankId
//                                    }

//                                });

//                                
//                            }
//                        }
//                    }, {
//                        name: 'TotalUnreconciled',
//                        xtype: 'currencyfield',
//                        anchor: '70%',
//                        fieldLabel: 'Total Unreconciled',
//                        disabled:true,
//                        allowBlank: false
//                        
//                    }]
//            }, {
//                columnWidth: .31,
//                defaults: {
//                    labelStyle: 'text-align:right;',
//                    msgTarget: 'side'
//                },
//                border: false,
//                bodyStyle: 'background:#ebebeb;padding:5px',
//                layout: 'form',
//                items: [ {
//                    name: 'AccountNo',
//                    disabled: true,
//                    xtype: 'textfield',
//                    fieldLabel: 'Account No',
//                    allowBlank: false
//                },{
//                    name: 'ShowMatchedItems',
//                    xtype: 'checkbox',
//                    fieldLabel: 'Show Matched Items',
//                    allowBlank: false,
//                    disabled: true
//                },{
//                    name: 'ComputerBalance',
//                    xtype: 'currencyfield',
//                    fieldLabel: 'Computer Balance',
//                    disabled: true,
//                    allowBlank: false
//                    
//                }]

//            }, {
//                columnWidth: .30,
//                defaults: {
//                    labelStyle: 'text-align:right;',
//                    msgTarget: 'side'
//                },
//                border: false,
//                bodyStyle: 'background:#ebebeb;padding:5px',
//                layout: 'form',
//                items: [
//                 {
//                     name: 'ReferenceNo',
//                     xtype: 'textfield',
//                     fieldLabel: 'Ref No',
//                     allowBlank: false
//                     
//                 }, {
//                     name: 'StatementDate',
//                     xtype: 'datefield',
//                     fieldLabel: 'Statement Date',
//                     allowBlank: false
//                 }, {
//                     name: 'StatementBalance',
//                     xtype: 'currencyfield',
//                     fieldLabel: 'Statement Balance'

//                 }
//            ]

//            }]
//        }]
//    }, config));
//};

//Ext.extend(Ext.core.finance.ux.FinanceBankReconciliation.Form, Ext.form.FormPanel);
//Ext.reg('FinanceBankReconciliation-form', Ext.core.finance.ux.FinanceBankReconciliation.Form);
//var BReclnSelModel = new Ext.grid.CheckboxSelectionModel();
///**
//* @desc      FinanceBankReconciliation grid
//* @author    Dawit Kiros
//* @copyright (c) 2013, Cybersoft
//* @date      April 24, 2013
//* @namespace Ext.core.finance.ux.FinanceBankReconciliation
//* @class     Ext.core.finance.ux.FinanceBankReconciliation.Grid
//* @extends   Ext.grid.GridPanel
//*/
//Ext.core.finance.ux.FinanceBankReconciliation.Grid = function (config) {
//    Ext.core.finance.ux.FinanceBankReconciliation.Grid.superclass.constructor.call(this, Ext.apply({
//        store: new Ext.data.DirectStore({
//            directFn: FinanceVoucher.GetAllDetailsForReconciliation,
//            paramsAsHash: false,
//            paramOrder: 'start|limit|sort|dir|PeriodId|BankId',
//            root: 'data',
//            height: 500,
//            idProperty: 'Id',
//            totalProperty: 'total',
//            sortInfo: {
//                field: 'Code',
//                direction: 'ASC'
//            },
//            fields: ['Id', 'Date', 'InvoiceNo', 'Description', 'ChequeNo', 'Amount'],
//            remoteSort: true,
//            listeners: {
//                beforeLoad: function () { Ext.getCmp('FinanceBankReconciliation-grid').body.mask('Loading...', 'x-mask-loading'); },
//                load: function() {
//                    var grid = Ext.getCmp('FinanceBankReconciliation-grid');
//                    var store = grid.getStore();
//                    
//                    grid.getComputerBalance(store);
//                    
//                    grid.body.unmask();
//                },
//                loadException: function () { Ext.getCmp('FinanceBankReconciliation-grid').body.unmask(); },
//                scope: this



//            }
//        }),
//        id: 'FinanceBankReconciliation-grid',
//        pageSize: 20000,
//        stripeRows: true,
//        border: true,
//        sm: BReclnSelModel,
//        viewConfig: {
//            forceFit: false,
//            autoExpandColumn: 'IdentityNumber',
//            autoFill: true
//        },

//        listeners: {
//            rowClick: function () {
//                var empId = this.getSelectionModel().getSelected().get('Id');
//                var form = Ext.getCmp('FinanceBankReconciliation-form');
//                form.getForm().findField('EmpId').setValue(empId);
//                var salary = this.getSelectionModel().getSelected().get('Salary');
//                form.getForm().findField('BasicSalary').setValue(salary);
//                Ext.getCmp('loanFieldSet').setDisabled(false);
//            },
//            scope: this
//        },
//        columns: [new Ext.erp.ux.grid.PagingRowNumberer(),BReclnSelModel,{
//            dataIndex: 'Id',
//            header: 'Id',
//            sortable: true,
//            hidden: true,
//            width: 100,
//            menuDisabled: true
//        }, {
//            dataIndex: 'Date',
//            header: 'Date',
//            sortable: true,
//            width: 220,
//            menuDisabled: false
//        }, {
//            dataIndex: 'InvoiceNo',
//            header: 'InvoiceNo',
//            sortable: true,
//            width: 200,
//            menuDisabled: true
//        }, {
//            dataIndex: 'Description',
//            header: 'Description',
//            sortable: true,
//            typeAhead: true,
//            width: 200,
//            //menuDisabled: true
//        }, {
//            dataIndex: 'ChequeNo',
//            header: 'Cheque No',
//            sortable: true,
//            width: 220,
//            menuDisabled: true
//        }, {
//            dataIndex: 'Amount',
//            header: 'Amount',
//            sortable: true,
//            width: 100,
//            menuDisabled: true,
//            renderer: function (value) {
//                return Ext.util.Format.number(value, '0,000.00 ');
//            }
//        }]
//    }, config));
//}

//Ext.extend(Ext.core.finance.ux.FinanceBankReconciliation.Grid, Ext.grid.EditorGridPanel, {
//    initComponent: function () {
//     this.store.baseParams = { record: Ext.encode({ mode: 'get' }) };
//    this.bbar = new Ext.PagingToolbar({
//        id: 'FinanceBankReconciliation-paging',
//        store: this.store,
//        displayInfo: true,
//        pageSize: this.pageSize
//    });
//    this.bbar.refresh.hide();
//    Ext.core.finance.ux.FinanceBankReconciliation.Grid.superclass.initComponent.apply(this, arguments);
//},

//    getComputerBalance : function(store) {
//        var form = Ext.getCmp('FinanceBankReconciliation-form').getForm();

//        var comBalance = 0;

//        store.each(function(item) {
//            comBalance = comBalance + item.data['Amount'];
//        });


//        form.findField('ComputerBalance').setValue(comBalance);
//    }

//});
//Ext.reg('FinanceBankReconciliation-grid', Ext.core.finance.ux.FinanceBankReconciliation.Grid);

///**
//* @desc      FinanceBankReconciliation panel
//* @author    Dawit Kiros
//* @copyright (c) 2013, Cybersoft
//* @date      April 24, 2013
//* @namespace Ext.core.finance.ux.FinanceBankReconciliation
//* @class     Ext.core.finance.ux.FinanceBankReconciliation.Panel
//* @extends   Ext.Panel
//*/
//Ext.core.finance.ux.FinanceBankReconciliation.Panel = function (config) {
//    Ext.core.finance.ux.FinanceBankReconciliation.Panel.superclass.constructor.call(this, Ext.apply({
//        layout: 'fit',
//        border: false,
//         tbar: {
//            xtype: 'toolbar',
//            items: [{
//                xtype: 'button',
//                text: 'Save',
//                id: 'btnSaveBankReconciliation',
//                iconCls: 'icon-save',
//                handler: this.onSaveClick
//                
//            }]
//        }

//    }, config));
//};
//Ext.extend(Ext.core.finance.ux.FinanceBankReconciliation.Panel, Ext.Panel, {
//    initComponent: function () {
//        this.form = new Ext.core.finance.ux.FinanceBankReconciliation.Form();
//        this.grid = new Ext.core.finance.ux.FinanceBankReconciliation.Grid();
//        
//        this.items = [{
//            layout: 'border',
//            border: false,
//            items: [{
//                region: 'center',
//                border: false,
//                layout: 'fit',
//                items: [{
//                    layout: 'vbox',
//                    layoutConfig: {
//                        type: 'hbox',
//                        align: 'stretch',
//                        pack: 'start'
//                    },
//                    defaults: {
//                        flex: 1
//                    },
//                    items: [this.form, this.grid]
//                }]
//            }]
//        }];
//        Ext.core.finance.ux.FinanceBankReconciliation.Panel.superclass.initComponent.apply(this, arguments);
//    },
//     onSaveClick: function() {
//          var grid = Ext.getCmp('FinanceBankReconciliation-grid');
//     }
//});
//Ext.reg('FinanceBankReconciliation-panel', Ext.core.finance.ux.FinanceBankReconciliation.Panel);
