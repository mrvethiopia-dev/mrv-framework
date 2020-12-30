/*  *************************************************************************************
*   *************************************************************************************
*   Provident fund is generated here, employees must be loaded and period must be chosen.
*   Prior to provident fund generation, payroll generation must be made. For those who 
*   are not payroll generated, provident fund would not be generated too.
*   Tables like payrollitem, employer payrollitem, employee-payrollitem association, 
*   payroll transaction, employer payroll transaction, lupPayrollApplicationMethod and
*   others are being used for the provident fund operation.
*
*   General UI Layout or Map
*   ________________________
*
*   *********************************************************
*   *                       *                               *
*   *                       *                               *
*   *  Grid                 *                               *
*   * (Selected Employees)  *         Grid (Result)         *
*   *                       *                               * 
*   *                       *                               *
*   *                       *                               *
*   *                       *                               *
*   *********************************************************
*
*****************************************************************************************
*****************************************************************************************/




Ext.ns('Ext.core.finance.ux.payrollEmployerGenerator');
Ext.ns('Ext.core.finance.ux.payrollEmployerTransaction');
Ext.ns('Ext.core.finance.ux.employerTransactionResult');


/**
* @desc      Payroll Employer Generator grid
* @author    Yonathan W/selassie
* @copyright (c) 2013, LIFT
* @date      April 24, 2013
* @namespace Ext.core.finance.ux.payrollEmployerGenerator
* @class     Ext.core.finance.ux.payrollEmployerGenerator.Grid
* @extends   Ext.grid.GridPanel
*/

var selModel = new Ext.grid.CheckboxSelectionModel();

Ext.core.finance.ux.payrollEmployerGenerator.Grid = function (config) {
    Ext.core.finance.ux.payrollEmployerGenerator.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            //            directFn: Ifms.GetPagedEmployee,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: { field: 'Name', direction: 'ASC' },
            fields: ['Id', 'IdentityNumber', 'Name', 'FirstName', 'FatherName', 'GrandFatherName'],
            remoteSort: true,
            listeners: {
                beforeLoad: function () { Ext.getCmp('payrollEmployerGenerator-grid').body.mask('Loading...', 'x-mask-loading'); },
                load: function () { Ext.getCmp('payrollEmployerGenerator-grid').body.unmask(); },
                loadException: function () { Ext.getCmp('payrollEmployerGenerator-grid').body.unmask(); },
                scope: this
            }
        }),
        id: 'payrollEmployerGenerator-grid',
        pageSize: 100,
        stripeRows: true,
        border: true,
        baseCls: 'x-plain',
        sm: selModelFiltCriteria,
        viewConfig: {
            forceFit: false,
            autoExpandColumn: ['checkBox', 'IdentityNumber', 'Name', 'FirstName', 'FatherName', 'GrandFatherName'],
            autoFill: true
        },
        columns: [new Ext.erp.ux.grid.PagingRowNumberer(), selModelFiltCriteria,
            { dataIndex: 'Id', header: 'Id', sortable: true, hidden: true, width: 100, menuDisabled: true
            }, { dataIndex: 'IdentityNumber', header: 'ID Number', sortable: true, width: 130, menuDisabled: true
            }, { dataIndex: 'Name', header: 'Name', sortable: true, width: 200, menuDisabled: true
            }, { dataIndex: 'FirstName', header: 'First Name', hidden: true, sortable: true, width: 200, menuDisabled: true
            }, { dataIndex: 'FatherName', header: 'Father Name', hidden: true, sortable: true, width: 200, menuDisabled: true
            }, { dataIndex: 'GrandFatherName', header: 'Grandfather Name', hidden: true, sortable: true, width: 200, menuDisabled: true
            }]
    }, config));
}

Ext.extend(Ext.core.finance.ux.payrollEmployerGenerator.Grid, Ext.grid.GridPanel, {
    initComponent: function () {

        this.tbar = [
            'Period: ', {
                id: 'EplyrPeriodId-combo',
                xtype: 'combo',
                fieldLabel: 'Period',
                triggerAction: 'all',
                mode: 'local',
                editable: true,
                typeAhead: true,
                editable: false,
                forceSelection: true,
                emptyText: '---Select Period---',
                allowBlank: false,
                width: 160,
                store: new Ext.data.DirectStore({
                    reader: new Ext.data.JsonReader({
                        successProperty: 'success',
                        idProperty: 'Id',
                        root: 'data',
                        fields: ['Id', 'Name']
                    }),
                    autoLoad: true,
                    api: { read: Ifms.GetActivePeriods }
                }),
                valueField: 'Id', displayField: 'Name',
                listeners: {
                    select: function (combo, record, index) {
                        var periodId = record.get('Id');

                        if (periodId != '') {

                            var employerTransactionResult = Ext.getCmp('employerTransactionResult-grid');
                            var employerTransactionResultStore = employerTransactionResult.getStore();
                            var isPreviousLoad = Ext.getCmp('isPreviousLoad').getValue();

                            if (isPreviousLoad) {
                                //                                employerTransactionResultStore.baseParams =
                                //                                    { record: Ext.encode({ PeriodId: periodId, mode: this.mode }) };
                                //                                employerTransactionResultStore.load({ params: { start: 0, limit: 100} });

                                //                                var status = Ext.getCmp('lastOperationStatusResult');

                                //                                status.setValue('Last Operation Status>>> ' + '  Transactions: ' + employerTransactionResultStore.getRange().length);
                            }
                        }
                    }
                }
            }, '-', {
                xtype: 'button',
                text: 'Employees',
                id: 'addpayrollEmployerGenerator',
                iconCls: 'icon-add',
                handler: function () {
                    var arg = true;

                    var periodId = Ext.getCmp('EplyrPeriodId-combo').getValue();

                    //                    if (periodId == '') {
                    //                        Ext.MessageBox.show({
                    //                            title: 'Period not selected',
                    //                            msg: 'You must select a period.',
                    //                            buttons: Ext.Msg.OK,
                    //                            icon: Ext.MessageBox.INFO,
                    //                            scope: this
                    //                        });
                    //                        return;
                    //                    }

                    var emSelWindow = new Ext.core.finance.ux.employeeSelectionWCheckBox.Window({ Caller: 'PFGenerator', IsPFGenerator: true, PeriodId: periodId });
                    emSelWindow.show();

                    var status = Ext.getCmp('statusBeforeProcess');

                    var payrollEmployerGenerator = Ext.getCmp('payrollEmployerGenerator-grid');
                    var payrollEmployerGeneratorStore = payrollEmployerGenerator.getStore();

                    status.setValue('Employees: ' + payrollEmployerGeneratorStore.getRange().length);
                }
            }, '-', {
                text: 'Drop',
                xtype: 'button',
                align: 'left',
                id: 'dropWithdraw',
                iconCls: 'icon-delete',
                handler: function () {
                    var grid = Ext.getCmp('payrollEmployerGenerator-grid');

                    if (!grid.getSelectionModel().hasSelection()) return;

                    Ext.MessageBox.show({
                        title: 'Remove',
                        msg: 'Are you sure you want to drop the selected employee(s)?',
                        buttons: {
                            ok: 'Yes', no: 'No'
                        },
                        icon: Ext.MessageBox.QUESTION,
                        scope: this,
                        animEl: 'delete',
                        fn: function (btn) {
                            if (btn == 'ok') {
                                var grid_r = Ext.getCmp('payrollEmployerGenerator-grid');
                                var grid_rStore = grid_r.getStore();
                                var fromResult = [];

                                grid_r.getSelectionModel().each(function (model) {
                                    grid_rStore.remove(model);
                                });
                            }
                        }
                    });
                }
            }];

        this.bbar = new Ext.PagingToolbar({
            id: 'payrollEmployerGenerator-paging',
            store: this.store,
            displayInfo: false,
            pageSize: this.pageSize,
            items: ['->', {
                xtype: 'toolbar',
                items: [{
                    xtype: 'displayfield',
                    style: 'font-weight: bold;',
                    value: '[Status]',
                    autoWidth: true,
                    id: 'statusBeforeProcess'
                }]
            }]
        });

        this.bbar.refresh.hide();

        Ext.core.finance.ux.payrollEmployerGenerator.Grid.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('payrollEmployerGenerator-grid', Ext.core.finance.ux.payrollEmployerGenerator.Grid);


/**
* @desc      Payroll Employer Transaction Result grid
* @author    Yonathan W/selassie
* @copyright (c) 2013, LIFT
* @date      April 24, 2013
* @namespace Ext.core.finance.ux.employerTransactionResult
* @class     Ext.core.finance.ux.EmployerTransactionResult.Grid
* @extends   Ext.grid.GridPanel
*/

Ext.core.finance.ux.employerTransactionResult.Grid = function (config) {
    Ext.core.finance.ux.employerTransactionResult.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: PayrollEmployerTransaction.GetProcessedTrans,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: { field: 'Code', direction: 'ASC' },
            fields: ['TransactionId', 'EmpId', 'EmployerPItemId', 'PeriodId', 'Name', 'BasicSalary', 'EmployeeContribution',
                     'NontaxableEmployerContribution', 'TaxableEmployerContribution', 'Tax', 'TotalPFContribution', 'NetPay',
                     'TaxCoverage', 'BSTaxCoverage', 'TaxableIncomeWithPF', 'TaxWithPF', 'TaxWithoutPF', 'TaxDifference'],
            remoteSort: true,
            listeners: {
                beforeLoad: function () { Ext.getCmp('employerTransactionResult-grid').body.mask('Loading...', 'x-mask-loading'); },
                load: function () { Ext.getCmp('employerTransactionResult-grid').body.unmask(); },
                loadException: function () { Ext.getCmp('employerTransactionResult-grid').body.unmask(); },
                scope: this
            }
        }),
        id: 'employerTransactionResult-grid',
        pageSize: 30,
        stripeRows: true,
        border: true,
        loadMask: true,
        baseCls: 'x-plain',
        viewConfig: {
            forceFit: false,
            autoExpandColumn: ['EmployeeContribution', 'NontaxableEmployerContribution',
                               'TaxableEmployerContribution', 'Tax', 'NetPay'],
            autoFill: true
        },
        columns: [
        { dataIndex: 'TransactionId', header: 'TransactionId', sortable: true, hidden: true, width: 100, menuDisabled: true
        }, { dataIndex: 'EmpId', header: 'EmpId', sortable: true, hidden: true, width: 100, menuDisabled: true
        }, { dataIndex: 'PeriodId', header: 'PeriodId', sortable: true, hidden: true, width: 100, menuDisabled: true
        }, { dataIndex: 'EmployerPItemId', header: 'EmployerPItemId', sortable: true, hidden: true, width: 100, menuDisabled: true
        }, { dataIndex: 'Name', header: 'Name', sortable: true, width: 200, menuDisabled: true
        }, { dataIndex: 'BasicSalary', header: 'Basic Salary', sortable: true, width: 200, menuDisabled: true, css: "text-align : right;",
            renderer: function (val) {
                if (val > 0) {
                    return '<span style="color:green;">' + val.toFixed(2) + '</span>';
                } else if (val < 0) {
                    return '<span style="color:red;">' + val.toFixed(2) + '</span>';
                }
                return val.toFixed(2);
            }
        }, { dataIndex: 'EmployeeContribution', header: 'Employee Contribution', sortable: true, width: 200, menuDisabled: true, css: "text-align : right;", hidden: true,
            renderer: function (val) {
                if (val > 0) {
                    return '<span style="color:green;">' + val.toFixed(2) + '</span>';
                } else if (val < 0) {
                    return '<span style="color:red;">' + val.toFixed(2) + '</span>';
                }
                return val.toFixed(2);
            }
        }, { dataIndex: 'NontaxableEmployerContribution', header: 'Non-taxable Employer Contribution', sortable: true, width: 200, menuDisabled: true, css: "text-align : right;", hidden: true,
            renderer: function (val) {
                if (val > 0) {
                    return '<span style="color:green;">' + val.toFixed(2) + '</span>';
                } else if (val < 0) {
                    return '<span style="color:red;">' + val.toFixed(2) + '</span>';
                }
                return val.toFixed(2);
            }
        }, { dataIndex: 'TaxableEmployerContribution', header: 'Taxable Employer Contribution', sortable: true, width: 200, menuDisabled: true, css: "text-align : right;", hidden: true,
            renderer: function (val) {
                if (val > 0) {
                    return '<span style="color:green;">' + val.toFixed(2) + '</span>';
                } else if (val < 0) {
                    return '<span style="color:red;">' + val.toFixed(2) + '</span>';
                }
                return val.toFixed(2);
            }
        }, { dataIndex: 'Tax', header: 'Tax', sortable: true, width: 200, menuDisabled: true, css: "text-align : right;", hidden: true
        }, { dataIndex: 'TotalPFContribution', header: 'Grand Total', sortable: true, width: 200, menuDisabled: true, css: "text-align : right;",
            renderer: function (val) {
                if (val > 0) {
                    return '<span style="color:green;">' + val.toFixed(2) + '</span>';
                } else if (val < 0) {
                    return '<span style="color:red;">' + val.toFixed(2) + '</span>';
                }
                return val.toFixed(2);
            }
        }, { dataIndex: 'NetPay', header: 'Net Deposit', sortable: true, width: 200, menuDisabled: true, css: "text-align : right;", hidden: true,
            renderer: function (val) {
                if (val > 0) {
                    return '<span style="color:green;">' + val.toFixed(2) + '</span>';
                } else if (val < 0) {
                    return '<span style="color:red;">' + val.toFixed(2) + '</span>';
                }
                return val.toFixed(2);
            }
        }, { dataIndex: 'TaxCoverage', header: 'TaxCoverage', sortable: true, width: 200, menuDisabled: true, css: "text-align : right;", hidden: true
        }, { dataIndex: 'BSTaxCoverage', header: 'BSTaxCoverage', sortable: true, width: 200, menuDisabled: true, css: "text-align : right;", hidden: true
        }, { dataIndex: 'TaxableIncomeWithPF', header: 'TaxableIncomeWithPF', sortable: true, width: 200, menuDisabled: true, css: "text-align : right;", hidden: true
        }, { dataIndex: 'TaxWithPF', header: 'TaxWithPF', sortable: true, width: 200, menuDisabled: true, css: "text-align : right;", hidden: true
        }, { dataIndex: 'TaxWithoutPF', header: 'TaxWithoutPF', sortable: true, width: 200, menuDisabled: true, css: "text-align : right;", hidden: true
        }, { dataIndex: 'TaxDifference', header: 'TaxDifference', sortable: true, width: 200, menuDisabled: true, css: "text-align : right;", hidden: true}]
    }, config));
}

Ext.extend(Ext.core.finance.ux.employerTransactionResult.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ PeriodId: this.PeriodId }) };

        this.bbar = new Ext.PagingToolbar({
            id: 'employerTransactionResult-paging',
            store: this.store,
            displayInfo: false,
            pageSize: this.pageSize,
            items: ['->', {
                xtype: 'toolbar',
                items: [{
                    xtype: 'displayfield',
                    style: 'font-weight: bold;',
                    value: 'Last Operation Status: ',
                    id: 'lastOperationStatusResult',
                    autoWidth: true
                }]
            }]
        });

        this.bbar.refresh.hide();

        this.tbar = [
            'Load Previous Transaction', {
                id: 'isPreviousLoad',
                xtype: 'checkbox',
                align: 'left',
                checked: false,
                handler: function () {

                    var isPreviousLoad = Ext.getCmp('isPreviousLoad').getValue();
                    var PeriodCombo = Ext.getCmp('EplyrPeriodId-combo');
                    var btn_refresh = Ext.getCmp('refreshTrans');
                    var periodId = PeriodCombo.getValue();         

                    if (isPreviousLoad && periodId != '') {

                        var employerTransactionResult = Ext.getCmp('employerTransactionResult-grid');
                        var employerTransactionResultStore = employerTransactionResult.getStore();
                        var isPreviousLoad = Ext.getCmp('isPreviousLoad').getValue();

                        btn_refresh.disabled = false;

                        if (isPreviousLoad) {
                            employerTransactionResultStore.baseParams =
                                    { record: Ext.encode({ PeriodId: periodId, mode: this.mode }) };
                            employerTransactionResultStore.load({ params: { start: 0, limit: 100} });

                            var status = Ext.getCmp('lastOperationStatusResult');

                            status.setValue('Last Operation Status>>> ' + '  Transactions: ' + employerTransactionResultStore.getRange().length);
                        }
                    }
                    else if (isPreviousLoad == false) {
                        try {
                            var transDetail = Ext.getCmp('employerTransactionResult-grid');
                            var transDetailStore = transDetail.getStore();

                            transDetailStore.removeAll();

                            btn_refresh.disabled = true;
                        } catch (e) {

                        }
                    }
                }
            }, '-',
            'Delete Previous Transaction', {
                id: 'isdeletePreviousTrans',
                xtype: 'checkbox',
                align: 'left',
                checked: true,
                handler: function () {
                }
            }, '-', {
                text: 'Generate',
                xtype: 'button',
                align: 'left',
                id: 'generatePF',
                iconCls: 'icon-generate',
                handler: function () {
                    var grid = Ext.getCmp('payrollEmployerGenerator-grid');
                    var periodId = Ext.getCmp('EplyrPeriodId-combo').getValue();
                    var isDeletePreviousTrans = Ext.getCmp('isdeletePreviousTrans').getValue();

                    if (!grid.getStore().getCount() > 0) {
                        Ext.MessageBox.show({
                            title: 'Select Employees',
                            msg: 'You must select employees to generate Provident Fund.',
                            buttons: Ext.Msg.OK,
                            icon: Ext.MessageBox.INFO,
                            scope: this
                        });
                        return;
                    }

                    if (periodId == '') {
                        Ext.MessageBox.show({
                            title: 'Period not selected',
                            msg: 'You must select a period.',
                            buttons: Ext.Msg.OK,
                            icon: Ext.MessageBox.INFO,
                            scope: this
                        });
                        return;
                    }

                    Ext.MessageBox.show({
                        title: 'Process',
                        msg: 'Please press Yes to continue or No to abort operation. Be aware, generating does override an existing transaction, if any transaction found in the specified period.',
                        buttons: { ok: 'Yes', no: 'No' },
                        icon: Ext.MessageBox.QUESTION,
                        scope: this,
                        fn: function (btn) {
                            if (btn == 'ok') {

                                var processRequests = grid.getStore().getRange();
                                var employees = [];

                                for (var i = 0; i < processRequests.length; i++) {
                                    Array.add(employees, processRequests[i].get('Id'));
                                }

                                // the next few lines of code does invoke the provident fund processor,
                                // on success (true), it populates the processed result onto the result grid-view
                                // on failure (false), other wise, it displays error message
                                PayrollEmployerTransaction.Process(employees, periodId, isDeletePreviousTrans, function (result, response) {
                                    if (result.success) {

                                        var grid_r = Ext.getCmp('employerTransactionResult-grid');
                                        var store = grid_r.getStore();
                                        var processedEmployees = store.recordType;

                                        store.removeAll();

                                        grid_r.el.mask('Processing...', 'x-mask-loading');

                                        // the names given below have to be similar with the incoming type,
                                        // unless it will be impossible to de-serialize by jsonLib
                                        for (var i = 0; i < result.records.length; i++) {
                                            var p = new processedEmployees({
                                                EmpId: result.records[i].EmpId,
                                                EmployerPItemId: result.records[i].EmployerPItemId,
                                                PeriodId: result.records[i].PeriodId,
                                                Name: result.records[i].Name,
                                                EmployeeContribution: result.records[i].EmployeeContribution,
                                                NontaxableEmployerContribution: result.records[i].NontaxableEmployerContribution,
                                                TaxableEmployerContribution: result.records[i].TaxableEmployerContribution,
                                                Tax: result.records[i].Tax,
                                                NetPay: result.records[i].NetPay,
                                                BasicSalary: result.records[i].BasicSalary,
                                                TransactionId: result.records[i].TransactionId,
                                                TotalPFContribution: result.records[i].TotalPFContribution,
                                                TaxCoverage: result.records[i].TaxCoverage,
                                                BSTaxCoverage: result.records[i].BSTaxCoverage,
                                                TaxableIncomeWithPF: result.records[i].TaxableIncomeWithPF,
                                                TaxWithPF: result.records[i].TaxWithPF,
                                                TaxWithoutPF: result.records[i].TaxWithoutPF,
                                                TaxDifference: result.records[i].TaxDifference
                                            });

                                            var count = store.getCount();
                                            store.insert(count, p);
                                        }

                                        grid_r.el.unmask();

                                        // Ext.apply(myGrid, { store: p });
                                        Ext.MessageBox.alert('Generate PF', 'Provident fund has been successfully generated.');
                                    }

                                    var status = Ext.getCmp('statusBeforeProcess');

                                    status.setValue('Employees: ' + result.records.length);

                                    if (!result.success) {
                                        Ext.MessageBox.alert('Generate PF', result.data);
                                    }
                                });
                            }
                        }
                    });
                }
            }, '-', {
                text: 'Save',
                xtype: 'button',
                align: 'left',
                id: 'saveTrans',
                iconCls: 'icon-save',
                handler: this.onSaveClick
            },
            '-', {
                text: 'Refresh',
                xtype: 'button',
                align: 'left',
                id: 'refreshTrans',
                iconCls: 'icon-refresh',
                disabled: true,
                handler: function () {

                    var isPreviousLoad = Ext.getCmp('isPreviousLoad').getValue();
                    var periodId = Ext.getCmp('EplyrPeriodId-combo').getValue();

                    if (isPreviousLoad && periodId != '') {

                        var transDetail = Ext.getCmp('employerTransactionResult-grid');
                        var transDetailStore = transDetail.getStore();

                        Ext.getCmp('employerTransactionResult-paging').doRefresh();
                    }
                }
            }, '->', {
                text: 'Make Final',
                xtype: 'button',
                align: 'left',
                id: 'makeFinal',
                iconCls: 'icon-shield_go'
            }];

        Ext.core.finance.ux.employerTransactionResult.Grid.superclass.initComponent.apply(this, arguments);
    },
    onSaveClick: function () {
        // Collect transaction information from the grid, and store it into an array variable
        var grid_r = Ext.getCmp('employerTransactionResult-grid');
        var fromResult = [];

        grid_r.getStore().each(function (model) {
            fromResult.push(model.data);
        });

        // Invoke an action method which is responsible for saving provident fund transactions
        PayrollEmployerTransaction.SaveResult(fromResult, function (result, response) {
            if (result.success) {
                Ext.MessageBox.show({
                    title: 'Operation Message',
                    msg: result.message + '</br>' + 'Succeeded Count: ' +
                            result.succeededCount + '</br>' + 'Failed Count: ' + result.failedCount,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.INFO,
                    scope: this
                });
            }

            var status = Ext.getCmp('lastOperationStatusResult');
            var staticValue = status.getValue();

            status.setValue('Last Operation Status>>> ' + ' ' + result.message + ' | Succeeded Count: ' +
                    result.succeededCount + ' | Failed Count: ' + result.failedCount);
        });
    }
});
Ext.reg('employerTransactionResult-grid', Ext.core.finance.ux.employerTransactionResult.Grid);


/**
* @desc      Payroll Employer Generator Panel
* @author    Yonathan W/selassie
* @copyright (c) 2013, LIFT
* @date      April 24, 2013
* @namespace Ext.core.finance.ux.payrollEmployerTransaction
* @class     Ext.core.finance.ux.payrollEmployerTransaction.Panel
* @extends   Ext.Panel
*/

Ext.core.finance.ux.payrollEmployerTransaction.Panel = function (config) {
    Ext.core.finance.ux.payrollEmployerTransaction.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false
    }, config));
};
Ext.extend(Ext.core.finance.ux.payrollEmployerTransaction.Panel, Ext.Panel, {
    initComponent: function () {

        this.grid_t = new Ext.core.finance.ux.payrollEmployerGenerator.Grid();
        this.grid_r = new Ext.core.finance.ux.employerTransactionResult.Grid();
        
        this.items = [{
            layout: 'border',
            border: false,
            items: [{
                region: 'west',
                border: true,
                collapsible: true,
                split: true,
                width: 360,
                minSize: 100,
                maxSize: 400,
                layout: 'fit',
                margins: '0 0 0 0',
                items: [this.grid_t]
            }, {
                region: 'center',
                collapsible: false,
                border: false,
                layout: 'fit',
                items: [{
                    layout: 'vbox',
                    layoutConfig: {
                        type: 'hbox',
                        align: 'stretch',
                        pack: 'start'
                    },
                    defaults: {
                        flex: 1
                    },
                    items: [{ xtype: 'toolbar', height: '20' }, this.grid_r]
                }]
            }]
        }];

        Ext.core.finance.ux.payrollEmployerTransaction.Panel.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('payrollEmployerTransaction-panel', Ext.core.finance.ux.payrollEmployerTransaction.Panel);
