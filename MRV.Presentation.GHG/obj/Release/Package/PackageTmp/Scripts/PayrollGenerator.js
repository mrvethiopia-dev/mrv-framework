Ext.ns('Ext.core.finance.ux.Transaction');
Ext.ns('Ext.core.finance.ux.payrollGenerator');
/**
* @desc      payrollGenerator registration form
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      April 24, 2013
* @namespace Ext.core.finance.ux.payrollGenerator
* @class     Ext.core.finance.ux.payrollGenerator.Form
* @extends   Ext.form.FormPanel
*/
Ext.core.finance.ux.payrollGenerator.Form = function (config) {
    Ext.core.finance.ux.payrollGenerator.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: PayrollItems.Get,
            submit: PayrollItems.Save
        },
        paramOrder: ['id'],
        defaults: {
            anchor: '50%',
            msgTarget: 'side',
            labelStyle: 'text-align:right;'
        },
        id: 'payrollGenerator-form',
        labelWidth: 115,
        height: 27,
        border: false,
        layout: 'form',
        bodyStyle: 'background:transparent;padding:5px',
        baseCls: 'x-plain',
        tbar: [{
            xtype: 'button',
            text: 'Add Emps',
            id: 'addpayrollGenerator',
            iconCls: 'icon-UserAdd',
            handler: function () {

                var arg = true;
                var emSelWindow = new Ext.core.finance.ux.EmployeeSelection.Window({ Caller: 'PayrollGeneratorWindow' });
                emSelWindow.show();
            }
        }, {
            xtype: 'tbseparator'
        }, 'Generate For All ', {
            id: 'chkGenerateForAll',
            text: '',
            xtype: 'checkbox'
        }, {
            xtype: 'tbseparator'
        }, 'Period', {
            id: 'PeriodId', xtype: 'combo', anchor: '55%',  fieldLabel: 'Period', triggerAction: 'all', mode: 'local', editable: true, typeAhead: true,
            forceSelection: true, emptyText: '---Select Period---', allowBlank: false,
            store: new Ext.data.DirectStore({
                reader: new Ext.data.JsonReader({
                    successProperty: 'success',
                    idProperty: 'Id',
                    root: 'data',
                    fields: ['Id', 'Name']
                }),
                autoLoad: true,
                api: { read: window.Tsa.GetActivePeriods }
            }),
            valueField: 'Id', displayField: 'Name',
            listeners: {
                select: function () {
                    var periodId = Ext.getCmp('PeriodId').getValue();
                    window.PayrollTransactions.GetClosedStatus(periodId, function (response) {

                        if (response.success) {
                            if (response.isClosed) {
                                Ext.getCmp('cmdClosePeriod').setDisabled(true);
                            } else {
                                Ext.getCmp('cmdClosePeriod').setDisabled(false);
                            }
                        }
                    });

                }
            }
        }, {
            xtype: 'tbseparator'
        },{
            id: 'BatchId',
            hiddenName: 'BatchId',
            xtype: 'combo',
            fieldLabel: 'Batch No',
            triggerAction: 'all',
            mode: 'local',
            
            editable: false,
            forceSelection: false,
            emptyText: '---Select---',
            allowBlank: false,
            store: new Ext.data.ArrayStore({
                fields: ['Id', 'Name'],
                data: [
                    ['FirstBatch', 'First Batch'],
                    ['SecondBatch', 'Second Batch'],
                    ['ThirdBatch', 'Third Batch'],
                    ['FourthBatch', 'Fourth Batch']
                ]
            }),
            valueField: 'Id',
            displayField: 'Name',
            listeners: {
                select: function (cmb, rec, idx) {
                }
            }
        }, {
            xtype: 'tbseparator'
        }, {
            text: 'Generate',
            xtype: 'button',
            align: 'left',
            id: 'generatePayroll',
            iconCls: 'icon-generate',
            disabled: !Ext.core.finance.ux.Reception.getPermission('Generate Payroll', 'CanAdd'),
            handler: function () {
                var grid = Ext.getCmp('payrollGenerator-grid');
                var empId;
                var rec = '';
                var periodId = Ext.getCmp('PeriodId').getValue();
                var isDeletePrevious = Ext.getCmp('deleteExisting').getValue();
                var skipOCEmps = Ext.getCmp('skipOCEmployees').getValue();
                var batchId = Ext.getCmp('BatchId').getValue();

                var isGenerateForAll = "";
                isGenerateForAll = Ext.getCmp('chkGenerateForAll').getValue();

                //isGenerateForAll = isGenerateForAll.toString();

                if (!grid.getStore().getCount() > 0 && !isGenerateForAll) {
                    Ext.MessageBox.show({
                        title: 'Select Employees',
                        msg: 'You must select employees to generate payroll.',
                        buttons: Ext.Msg.OK,
                        icon: Ext.MessageBox.INFO,
                        scope: this
                    });
                    return;
                }
                if (periodId == '') {
                    Ext.MessageBox.show({
                        title: 'Period not selected',
                        msg: 'You must select a period.',
                        buttons: Ext.Msg.OK,
                        icon: Ext.MessageBox.INFO,
                        scope: this
                    });
                    return;
                }
                if (batchId == '') {
                    Ext.MessageBox.show({
                        title: 'Payroll Batch not selected',
                        msg: 'You must select Payroll Batch No.',
                        buttons: Ext.Msg.OK,
                        icon: Ext.MessageBox.INFO,
                        scope: this
                    });
                    return;
                }

                var msgIcon;
                var message;
                if (isDeletePrevious == true) {
                    msgIcon = Ext.MessageBox.WARNING;
                    message = 'If the Delete Existing Transaction option is selected, previously generated transactions for the selected period will be deleted, are you sure you want to proceed?';
                } else {
                    msgIcon = Ext.MessageBox.QUESTION;
                    message = 'Are you sure you want to generate payroll for the selected employees';
                }
                Ext.MessageBox.show({
                    title: 'Generate',
                    msg: message,
                    buttons: {
                        ok: 'Yes',
                        no: 'No'
                    },
                    icon: msgIcon,
                    scope: this,
                    //animEl: 'delete',
                    fn: function (btn) {
                        if (btn == 'ok') {
                            var store = grid.getStore();

                            Ext.MessageBox.show({
                                msg: 'Generating Payroll, please wait...',
                                progressText: 'Saving...',
                                width: 300,
                                wait: true,
                                waitConfig: { interval: 200 }
                            });
                            var selectedEmps = grid.getStore();
                            selectedEmps.each(function (item) {

                                if ((item.data['Id'] != '')) {
                                    rec = rec + item.data['Id'] + ';';
                                }

                            });
                            Ext.Ajax.timeout = 60000000;
                            window.PayrollTransactions.Generate(rec, periodId, isDeletePrevious, isGenerateForAll,skipOCEmps,batchId, function (response) {
                                if (response.success) {
                                    Ext.MessageBox.show({
                                        title: response.title,
                                        msg: response.data,
                                        buttons: Ext.Msg.OK,
                                        height: 30,
                                        scrollable: true,
                                        icon: Ext.MessageBox.INFO,
                                       cls: 'msgbox-info',
                                        scope: this
                                    });

                                } else {
                                    Ext.MessageBox.show({
                                        title: response.title,
                                        msg: response.data,
                                        buttons: Ext.Msg.OK,
                                        icon: Ext.MessageBox.ERROR,
                                        scope: this
                                    });
                                }
                            });


                        }


                    }
                });
            }


        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'View Transactions',
            id: 'viewTransactions',
            hidden:true,
            iconCls: 'icon-transaction',
            disabled: !Ext.core.finance.ux.Reception.getPermission('Generate Payroll', 'CanView'),
            handler: function () {
                var result = {};
                var periodId = Ext.getCmp('PeriodId').getValue();
                Ext.MessageBox.show({
                    title: 'Payroll Transactions',
                    msg: 'Getting records, please wait...',
                    progressText: 'Retrieving...',
                    width: 300,
                    wait: true

                });
                Ext.Ajax.timeout = 6000000;
                PayrollTransactions.ViewTransactions(periodId, function (response) {
                    Ext.core.finance.ux.SystemMessageManager.hide();
                    if (response.success == false) {
                        Ext.MessageBox.show({
                            title: 'Error',
                            msg: response.data,
                            buttons: Ext.Msg.OK,
                            icon: Ext.MessageBox.ERROR,
                            scope: this
                        });
                        return;
                    }
                    var storeData = Ext.util.JSON.decode(response.data.transEntries);
                    var storeFields = response.data.fields;
                    var grid = Ext.getCmp('Transaction-grid');
                    var store = new Ext.core.finance.ux.Transaction.Store({
                        fields: (function () {
                            var fields = [];
                            for (var i = 0; i < response.total; i++) {
                                fields.push(storeFields[i]);
                            }
                            return fields;
                        }).createDelegate(this)()
                    });
                    var columns = new Ext.grid.ColumnModel((function () {
                        var columns = [];

                        columns.push(new Ext.grid.RowNumberer());
                        columns.push({
                            dataIndex: storeFields[0],
                            header: 'Employee Id',
                            sortable: true,
                            width: 150,
                            menuDisabled: true
                        });
                        columns.push({
                            dataIndex: storeFields[1],
                            header: 'Employee Name',
                            sortable: true,
                            width: 500,
                            menuDisabled: true
                        });
                        for (var i = 2; i < response.total; i++) {
                            var col = {
                                dataIndex: storeFields[i],
                                header: storeFields[i],
                                sortable: true,
                                width: 200,
                                menuDisabled: true,
                                renderer: function (value) {
                                    return Ext.util.Format.number(value, '0,000.00 ');
                                },
                                editor: new Ext.form.NumberField({
                                    allowBlank: false,
                                    allowNegative: false,
                                    listeners: {
                                        focus: function (field) {
                                            field.selectText();
                                        }
                                    }
                                })
                            };
                            columns.push(col);
                        }
                        return columns;
                    }).createDelegate(this)());
                    grid.reconfigure(store, columns);
                    store.loadData(storeData);
                });
            }
        },
         {
            xtype: 'button',
            text: 'Close Period',
            id: 'cmdClosePeriod',
            iconCls: 'icon-CloseTrans',
            disabled: true,
            handler: function () {
                var periodId = Ext.getCmp('PeriodId').getValue();

                Ext.MessageBox.show({
                    title: 'Delete',
                    msg: 'Are you sure you want to close the period?',
                    icon: Ext.MessageBox.ERROR,
                    buttons: {
                        ok: 'Yes',
                        no: 'No'
                    },
                    icon: Ext.MessageBox.QUESTION,
                    scope: this,
                    animEl: 'Delete',
                    fn: function (btn) {
                        if (btn == 'ok') {
                            Ext.MessageBox.show({
                                title: 'Warning',
                                msg: 'Once a payroll period is closed, the system will authomatically lock out that period.' +
                                    ' Therefore you will not be able to generate payroll for that month again. Press Ok to Close the Period, Press Cancel to abort.',
                                buttons: {
                                    ok: 'Ok',
                                    cancel: 'Cancel'
                                },
                                icon: Ext.MessageBox.WARNING,
                                scope: this,
                                fn: function (btn) {
                                    if (btn == 'ok') {
                                        window.PayrollTransactions.ClosePeriod(periodId, function (response) {
                                            if (response.success) {
                                                Ext.MessageBox.show({
                                                    title: 'Period Closing',
                                                    msg: response.data,
                                                    buttons: Ext.Msg.OK,
                                                    icon: Ext.MessageBox.INFO,
                                                    scope: this
                                                });
                                                Ext.getCmp('cmdClosePeriod').setDisabled(true);
                                            } else {
                                                Ext.MessageBox.show({
                                                    title: 'Period Closing',
                                                    msg: response.data,
                                                    buttons: Ext.Msg.OK,
                                                    icon: Ext.MessageBox.ERROR,
                                                    scope: this
                                                });
                                            }

                                        });
                                    }
                                }
                            });
                        }
                    }
                });
            }
        }, {
            xtype: 'tbfill'
        },

        //'Include Overtime',
        {
        xtype: 'checkbox',
        align: 'left',
        name: 'includeOvertime',
        checked: true,
        hidden: true
        }, {
            xtype: 'tbseparator',
            hidden: true
        },
    //'Exempt Loan',
        {
            xtype: 'checkbox',
            align: 'left',
            id: 'exemptLoan',
            hidden: true
        },{
            xtype: 'tbseparator',
            hidden: true
        },
    //'Exempt Attendance',
        {
        xtype: 'checkbox',
        align: 'left',
        id: 'exemptAttendance',
        hidden: true
        }, {
            xtype: 'tbseparator',
            hidden: true
        },
        'Skip OC Employees',
        {
            xtype: 'checkbox',
            align: 'left',
            id: 'skipOCEmployees',
            tooltip: 'Skip Out of Contract Employees',
            checked: true
        },
        'Delete Existing',
        {
            xtype: 'checkbox',
            align: 'left',
            id: 'deleteExisting',
            tooltip: 'Delete all Existing transactions for the selected period',
            checked: true
        }, {
            xtype: 'tbseparator',
            
        }, {
            xtype: 'button',
            text: 'Remove Existing',
            id: 'deleteTransactions',
            iconCls: 'icon-delete',
            disabled: !Ext.core.finance.ux.Reception.getPermission('Generate Payroll', 'CanDelete'),
            handler: function () {
                var msgIcon;
                var message;

                msgIcon = Ext.MessageBox.QUESTION;
                message = 'Are you sure you want to remove the transactions for the selected period?';

                Ext.MessageBox.show({
                    title: 'Generate',
                    msg: message,
                    buttons: {
                        ok: 'Yes',
                        no: 'No'
                    },
                    icon: msgIcon,
                    scope: this,
                    //animEl: 'delete',
                    fn: function (btn) {
                        if (btn == 'ok') {
                            var grid = Ext.getCmp('payrollGenerator-grid');
                            var empId;
                            var rec = '';
                            var periodId = Ext.getCmp('PeriodId').getValue();
                            var isDeletePrevious = Ext.getCmp('deleteExisting').getValue();
                            var skipOCEmps = Ext.getCmp('skipOCEmployees').getValue();
                            var batchId = Ext.getCmp('BatchId').getValue();

                            var isGenerateForAll = "";
                            isGenerateForAll = Ext.getCmp('chkGenerateForAll').getValue();


                            if (periodId == '') {
                                Ext.MessageBox.show({
                                    title: 'Period not selected',
                                    msg: 'You must select a period.',
                                    buttons: Ext.Msg.OK,
                                    icon: Ext.MessageBox.INFO,
                                    scope: this
                                });
                                return;
                            }
                            if (batchId == '') {
                                Ext.MessageBox.show({
                                    title: 'Payroll Batch not selected',
                                    msg: 'You must select Payroll Batch No.',
                                    buttons: Ext.Msg.OK,
                                    icon: Ext.MessageBox.INFO,
                                    scope: this
                                });
                                return;
                            }
                            Ext.Ajax.timeout = 60000000;
                            window.PayrollTransactions.DeletePayrollTransactions(periodId, batchId, function (response) {
                                if (response.success) {
                                    Ext.MessageBox.show({
                                        title: response.title,
                                        msg: response.data,
                                        buttons: Ext.Msg.OK,
                                        height: 30,
                                        scrollable: true,
                                        icon: Ext.MessageBox.INFO,
                                        cls: 'msgbox-info',
                                        scope: this
                                    });

                                } else {
                                    Ext.MessageBox.show({
                                        title: response.title,
                                        msg: response.data,
                                        buttons: Ext.Msg.OK,
                                        icon: Ext.MessageBox.ERROR,
                                        scope: this
                                    });
                                }
                            });
                        }
                    }
                });


            }
        }],
    items: []

}, config));
};
Ext.extend(Ext.core.finance.ux.payrollGenerator.Form, Ext.form.FormPanel);
Ext.reg('payrollGenerator-form', Ext.core.finance.ux.payrollGenerator.Form);

/**
* @desc      payrollGenerator grid
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      April 24, 2013
* @namespace Ext.core.finance.ux.payrollGenerator
* @class     Ext.core.finance.ux.payrollGenerator.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.core.finance.ux.payrollGenerator.Grid = function (config) {
    Ext.core.finance.ux.payrollGenerator.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: Tsa.GetPagedEmployee,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Code',
                direction: 'ASC'
            },
            fields: ['Id', 'IdentityNo', 'FirstName', 'MiddleName', 'LastName', 'SalaryETB', 'HasPension'],
            remoteSort: true,
            listeners: {
                beforeLoad: function () { Ext.getCmp('payrollGenerator-grid').body.mask('Loading...', 'x-mask-loading'); },
                load: function () { Ext.getCmp('payrollGenerator-grid').body.unmask(); },
                loadException: function () { Ext.getCmp('payrollGenerator-grid').body.unmask(); },
                scope: this
            }
        }),
        id: 'payrollGenerator-grid',
        pageSize: 30,

        stripeRows: true,
        border: true,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        viewConfig: {
            forceFit: false,
            autoExpandColumn: 'IdentityNumber',
            autoFill: true
        },
        listeners: {},



        columns: [new Ext.erp.ux.grid.PagingRowNumberer({
            width: 35
        }), {
            dataIndex: 'Id',
            header: 'Id',
            sortable: true,
            hidden: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'IdentityNo',
            header: 'IdentityNo',
            sortable: true,
            width: 220,
            menuDisabled: false
        }, {
            dataIndex: 'FirstName',
            header: 'First Name',
            sortable: true,
            width: 220,
            menuDisabled: false
        }, {
            dataIndex: 'MiddleName',
            header: 'Middle Name',
            sortable: true,
            width: 200,
            menuDisabled: true
        }, {
            dataIndex: 'LastName',
            header: 'Last Name',
            sortable: true,
            width: 220,
            menuDisabled: true
        }, {
            dataIndex: 'SalaryETB',
            header: 'Salary(ETB)',
            sortable: true,
            width: 220,
            menuDisabled: true
        }, {
            dataIndex: 'HasPension',
            header: 'HasPension',
            sortable: true,
            width: 220,
            menuDisabled: true
        }]
    }, config));
}

Ext.extend(Ext.core.finance.ux.payrollGenerator.Grid, Ext.grid.EditorGridPanel, {
    initComponent: function () {
        height: 100,
        this.bbar = new Ext.PagingToolbar({
            id: 'payrollGenerator-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        this.bbar.refresh.hide();
        Ext.core.finance.ux.payrollGenerator.Grid.superclass.initComponent.apply(this, arguments);
    }

});
Ext.reg('payrollGenerator-grid', Ext.core.finance.ux.payrollGenerator.Grid);

/**********************************************************************************************
***********************************************************************************************
********************                                                       ********************
********************                                                       ********************
********************                                                       ********************
********************                 TRANSACTION GRID                      ********************/


Ext.core.finance.ux.Transaction.Store = function (config) {
    Ext.core.finance.ux.Transaction.Store.superclass.constructor.call(this, Ext.apply({
        //directFn: PayrollTransactions.GetAll,
        paramsAsHash: false,
        paramOrder: 'start|limit|sort|dir|record',
        root: 'data',
        idProperty: 'Id',
        totalProperty: 'total',
        sortInfo: {
            field: 'Description',
            direction: 'ASC'
        },
        remoteSort: true
    }, config));
};
Ext.extend(Ext.core.finance.ux.Transaction.Store, Ext.data.DirectStore);
Ext.reg('Transaction-store', Ext.core.finance.ux.Transaction.Store);

/**
* @desc      Transaction grid
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      November 01, 2013
* @namespace Ext.core.finance.ux.Transaction
* @class     Ext.core.finance.ux.Transaction.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.core.finance.ux.Transaction.Grid = function (config) {
    Ext.core.finance.ux.Transaction.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: PayrollTransactions.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Code',
                direction: 'ASC'
            },
            fields: ['Id', 'PayrollTransaction'],
            remoteSort: true,
            listeners: {
                beforeLoad: function () {
                    Ext.getCmp('Transaction-grid').body.mask('Loading...', 'x-mask-loading');
                },
                load: function () {
                    var grid = Ext.getCmp('Transaction-grid');
                    grid.body.unmask();
                    Ext.core.finance.ux.SystemMessageManager.hide();
                },
                loadException: function () {
                    Ext.getCmp('Transaction-grid').body.unmask();
                },
                scope: this
            }
        }),
        id: 'Transaction-grid',
        pageSize: 10,
        height: 300,
        stripeRows: true,
        columnLines: true,
        border: true,
        clicksToEdit: 1,
        sm: new Ext.grid.RowSelectionModel({ singleSelect: true }),
        listeners: {
            afteredit: function (e) {
                var record = e.record;
                var total = 0;
                for (var i = 3; i < record.fields.length; i++) {
                    var field = record.fields.items[i].name;
                    var fieldValue = parseFloat(record.data[field]);
                    total += fieldValue;
                }
                record.set('Total', total);
            }
        },
        viewConfig: {
            forceFit: true,
            autoFill: true
        },
        columns: [{
            dataIndex: 'Id',
            header: 'Id',
            sortable: false,
            hidden: true,
            width: 100,
            menuDisabled: true
        }, new Ext.grid.RowNumberer(), {
            dataIndex: 'PayrollTransaction',
            header: '',
            sortable: false,
            width: 100,
            menuDisabled: true
        }]
    }, config));
};
Ext.extend(Ext.core.finance.ux.Transaction.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ fiscalYearId: 0 }) };
        this.tbar = [{
            xtype: 'button',
            text: 'Refresh Transactions',
            id: 'transRefresh',
            iconCls: 'icon-RefreshTrans',
            handler: this.onRefreshClick
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Email Pay Slip',
            id: 'cmdEmailSlip',
            iconCls: 'icon-Email ',
            handler: this.onSendEmailClick
        }];
        Ext.core.finance.ux.Transaction.Grid.superclass.initComponent.apply(this, arguments);
    },
    onRefreshClick: function () {
        var result = {};
        var periodId = Ext.getCmp('PeriodId').getValue();
        Ext.MessageBox.show({
            title: 'Payroll Transactions',
            msg: 'Getting records, please wait...',
            progressText: 'Retrieving...',
            width: 300,
            wait: true

        });
        PayrollTransactions.ViewTransactions(periodId, function (response) {
            Ext.core.finance.ux.SystemMessageManager.hide();
            if (response.success == false) {
                Ext.MessageBox.show({
                    title: 'Error',
                    msg: response.data,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.ERROR,
                    scope: this
                });
                return;
            }
            var storeData = Ext.util.JSON.decode(response.data.transEntries);
            var storeFields = response.data.fields;
            var grid = Ext.getCmp('Transaction-grid');
            var store = new Ext.core.finance.ux.Transaction.Store({
                fields: (function () {
                    var fields = [];
                    for (var i = 0; i < response.total; i++) {
                        fields.push(storeFields[i]);
                    }
                    return fields;
                }).createDelegate(this)()
            });
            var columns = new Ext.grid.ColumnModel((function () {
                var columns = [];

                columns.push(new Ext.grid.RowNumberer());
                columns.push({
                    dataIndex: storeFields[0],
                    header: 'Employee Id',
                    sortable: true,
                    width: 150,
                    menuDisabled: true
                });
                columns.push({
                    dataIndex: storeFields[1],
                    header: 'Employee Name',
                    sortable: true,
                    width: 500,
                    menuDisabled: true
                });
                for (var i = 2; i < response.total; i++) {
                    var col = {
                        dataIndex: storeFields[i],
                        header: storeFields[i],
                        sortable: true,
                        width: 200,
                        menuDisabled: true,
                        renderer: function (value) {
                            return Ext.util.Format.number(value, '0,000.00 ');
                        },
                        editor: new Ext.form.NumberField({
                            allowBlank: false,
                            allowNegative: false,
                            listeners: {
                                focus: function (field) {
                                    field.selectText();
                                }
                            }
                        })
                    };
                    columns.push(col);
                }
                return columns;
            }).createDelegate(this)());
            grid.reconfigure(store, columns);
            store.loadData(storeData);
        });
    },

    onSendEmailClick: function () {
        var periodId = Ext.getCmp('PeriodId').getValue();
        if (periodId == '') {
            Ext.MessageBox.show({
                title: 'Period not selected',
                msg: 'You must select a period.',
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
        Ext.MessageBox.show({
            title: 'Email pay slip',
            msg: 'Are you sure you want to send pay slips to all employees? Is it your final payroll generation? ',
            buttons: {
                ok: 'Yes',
                no: 'No'
            },
            icon: Ext.MessageBox.QUESTION,
            scope: this,
            fn: function (btn) {
                if (btn == 'ok') {
                    Ext.MessageBox.show({
                        msg: 'Sending Email, please wait...',
                        progressText: 'Creating attachments...',
                        width: 300,
                        wait: true,
                        waitConfig: { interval: 200 }
                    });
                    Ext.Ajax.timeout = 60000000;
                    window.Tsa.SendEmail(periodId, function (response) {
                        if (response.success) {
                            Ext.MessageBox.show({
                                title: 'Email Pay Slip',
                                msg: response.data,
                                buttons: Ext.Msg.OK,
                                icon: Ext.MessageBox.INFO

                            });
                        } else {
                            Ext.MessageBox.show({
                                title: 'Error Sending Pay Slip',
                                msg: response.data,
                                buttons: Ext.Msg.OK,
                                icon: Ext.MessageBox.ERROR

                            });
                        }
                    });
                } else {
                    return;
                }
            }
        });
    }

});
Ext.reg('Transaction-grid', Ext.core.finance.ux.Transaction.Grid);

Ext.core.finance.ux.Transaction.Panel = function (config) {
    Ext.core.finance.ux.Transaction.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false
    }, config));
};

















/*******************                                                       ********************
********************                                                       ********************
********************                                                       ********************
********************                                                       ********************
***********************************************************************************************
***********************************************************************************************/


/**
* @desc      payrollGenerator panel
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      April 24, 2013
* @namespace Ext.core.finance.ux.payrollGenerator
* @class     Ext.core.finance.ux.payrollGenerator.Panel
* @extends   Ext.Panel
*/
Ext.core.finance.ux.payrollGenerator.Panel = function (config) {
    Ext.core.finance.ux.payrollGenerator.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false
    }, config));
};
Ext.extend(Ext.core.finance.ux.payrollGenerator.Panel, Ext.Panel, {
    initComponent: function () {
        this.form = new Ext.core.finance.ux.payrollGenerator.Form();
        this.grid = new Ext.core.finance.ux.payrollGenerator.Grid();
        this.TransactionGrid = new Ext.core.finance.ux.Transaction.Grid();
        this.items = [{
            layout: 'border',
            border: false,
            items: [{
                region: 'center',
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
                    items: [this.form, this.grid, this.TransactionGrid]
                }]
            }]
        }];
        Ext.core.finance.ux.payrollGenerator.Panel.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('generatePayroll-panel', Ext.core.finance.ux.payrollGenerator.Panel);