Ext.ns('Ext.core.finance.ux.rptGeneralLedger');


/**
* @desc      Pay Sheet Report Criteria form
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      December 24, 2013
* @namespace Ext.core.finance.ux.rptGeneralLedger
* @class     Ext.core.finance.ux.rptGeneralLedger.Form
* @extends   Ext.form.FormPanel
*/
Ext.core.finance.ux.rptGeneralLedger.Form = function(config) {
    Ext.core.finance.ux.rptGeneralLedger.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            //submit: FinanceReports.SetGeneralLedgerReportParam
            submit: FinanceReports.ViewFinancialReports
        },
        defaults: {
            anchor: '90%',
            msgTarget: 'side',

            labelStyle: 'text-align:right;'
        },
        //Capture Enter key and force button Click Event
        keys: [
            {
                key: [10, 13],
                fn: function() {
                    onSubmitForm();
                }
            }
        ],
        id: 'rptGeneralLedger-form',
        padding: 3,
        labelWidth: 100,
        autoHeight: true,
        //height: 150,
        border: false,
        autoWidth: true,
        baseCls: 'x-plain',
        items: [

            ///////////////////////////////////////////////////////////////////////////////////////////
            {
                xtype: 'fieldset',
                id: 'fsMainCriteria',
                region: 'north',
                title: 'Main Criteria',
                bodystyle: 'padding-0px',
                labelstyle: 'text-align:right;',
                autoWidth: true,

                items: [
                    /* Fieldset Item number 1 - Text Field */
                    {
                        hiddenName: 'ReportName',
                        xtype: 'combo',
                        fieldLabel: 'Report Name',
                        triggerAction: 'all',
                        mode: 'local',
                        editable: false,
                        forceSelection: false,
                        emptyText: '---Select---',
                        allowBlank: false,
                        store: new Ext.data.ArrayStore({
                            fields: ['Id', 'Name'],
                            data: [
                                ['GeneralJournal', 'General Journal'],
                                ['GeneralLedger', 'General Ledger'],
                                ['AdvanceControl', 'Advance Control Summary'],
                                ['AdvanceControlDetail', 'Advance Control Detail'],
                                ['CashBook', 'Cash Book'],
                                ['BankReconciliation', 'Bank Reconciliation'],
                                ['SummaryOfExpenses', 'Summary Of Expenses'],
                                ['TrialBalance', 'Trial Balance'],
                                ['TrialBalanceV2', 'Trial Balance V2'],
                                ['ChartOfAccounts', 'Chart Of Accounts'],
                                ['GeneralLedgerV2', 'General Ledger V2'],
                                ['EmployeeExpenseSummary', 'Employee Expense Summary'],
                                ['EmployeeExpenseDetail', 'Employee Expense Detail'],
                                ['ExpenseSummary', 'Expense Summary'],
                                ['ExpenseDetail', 'Expense Detail']
                            ]
                        }),
                        valueField: 'Id',
                        displayField: 'Name',
                        listeners: {
                            select: function(cmb, rec, idx) {
                                var form = Ext.getCmp('rptGeneralLedger-form').getForm();
                                form.findField('SortBy').show();
                                form.findField('SortThenBy').show();
                                form.findField('ShowZeroBalance').hide();
                                if (idx == 2 || idx == 3) { //Advance Control Summary and Detail

                                    form.findField('BankId').hide();
                                    Ext.getCmp('fsAccount').hide();
                                    Ext.getCmp('fsOtherCriteria').hide();

                                    form.findField('SortBy').hide();
                                    form.findField('SortThenBy').hide();

                                    if (idx == 2) {
                                        form.findField('ShowZeroBalance').show();
                                    }

                                    Ext.getCmp('fsReferenceCode').show();
                                    //form.findField('SortBy').show();
                                    form.findField('PeriodTwoId').hide();
                                    form.findField('PeriodTwoId').reset();
                                    form.findField('AccountNo').reset();
                                    form.findField('AccountFrom').reset();
                                    form.findField('AccountTo').reset();
                                    form.findField('EmployeeRegionId').show();
                                    form.findField('EmployeeRegionId').reset();
                                } else if (idx == 5) { //Bank Reconciliation

                                    form.findField('BankId').show();
                                    Ext.getCmp('fsAccount').hide();
                                    Ext.getCmp('fsOtherCriteria').hide();
                                    Ext.getCmp('fsReferenceCode').hide();
                                    form.findField('SortBy').hide();
                                    form.findField('PeriodTwoId').hide();

                                } else if (idx == 6) { //Summary Of Expences

                                    form.findField('BankId').hide();
                                    Ext.getCmp('fsAccount').hide();
                                    Ext.getCmp('fsOtherCriteria').hide();
                                    Ext.getCmp('fsReferenceCode').hide();
                                    form.findField('SortBy').hide();
                                    form.findField('ReferenceNo').hide();
                                    form.findField('PeriodTwoId').hide();

                                } else if (idx == 7 || idx == 8) { //Trial Balance or trial Balance V2

                                    form.findField('BankId').hide();
                                    Ext.getCmp('fsAccount').show();
                                    Ext.getCmp('fsOtherCriteria').hide();
                                    Ext.getCmp('fsReferenceCode').hide();
                                    form.findField('SortBy').hide();
                                    form.findField('SortThenBy').hide();


                                } else { //General Journal, General Ledger, cash Book
                                    form.findField('BankId').hide();
                                    Ext.getCmp('fsAccount').show(); //Show Account Field Set
                                    Ext.getCmp('fsReferenceCode').show(); //Show Reference Code Fioeld Set
                                    Ext.getCmp('fsOtherCriteria').show();
                                    form.findField('SortBy').show();
                                    //form.findField('PeriodTwoId').show();
                                    form.findField('ReferenceNo').show();
                                    form.findField('EmployeeRegionId').hide();


                                }
                                if (idx > 4) { //Bank Reconciliation, Summary Of Expences,Trial Balance or trial Balance V2
                                    form.findField('StartDate').hide();
                                    form.findField('StartDate').reset();
                                    form.findField('EndDate').hide();
                                    form.findField('EndDate').reset();
                                } else if (idx <= 4) { //General Journal, General Ledger,General Ledger V2, Advance Control, Cash Book
                                    form.findField('StartDate').show();
                                    form.findField('StartDate').reset();
                                    form.findField('EndDate').show();
                                    form.findField('EndDate').reset();
                                }
                                if (idx == 8) { //Trial Balance V2
                                    form.findField('isVersion2').setValue(true);

                                } else {
                                    form.findField('isVersion2').setValue(false);
                                }
                                if (idx >= 10) { //General Journal, General Ledger,General Ledger V2, Advance Control, Cash Book
                                    form.findField('StartDate').show();
                                    form.findField('StartDate').reset();
                                    form.findField('EndDate').show();
                                    form.findField('EndDate').reset();
                                }
                                if (idx == 11 || idx == 12|| idx == 13 || idx == 14) { //Expense Summary and Detail
                                    form.findField('StaffCode').hide();
                                    form.findField('StaffCode').reset();
                                
                                } else {
                                    form.findField('StaffCode').show();
                                    form.findField('StaffCode').reset();
                                }
                            }
                        }
                    }, {
                        name: 'isVersion2',
                        hidden: true,
                        xtype: 'textfield',
                        fieldLabel: 'Is Version2',
                        allowBlank: true
                    }, {
                        hiddenName: 'PeriodId',
                        xtype: 'combo',
                        fieldLabel: 'As of Period',
                        triggerAction: 'all',
                        mode: 'local',
                        editable: true,
                        typeAhead: true,
                        forceSelection: true,
                        emptyText: '---Select---',
                        allowBlank: true,
                        store: new Ext.data.DirectStore({
                            reader: new Ext.data.JsonReader({
                                successProperty: 'success',
                                idProperty: 'Id',
                                root: 'data',
                                fields: ['Id', 'Name']
                            }),
                            autoLoad: true,
                            api: { read: window.Tsa.GetPeriods }
                        }),
                        valueField: 'Id',
                        displayField: 'Name'
                    }, {
                        name: 'StartDate',
                        xtype: 'datefield',
                        fieldLabel: 'Start Date',
                        altFormats: 'c',
                        hidden: false,
                        //value: new Date(),
                        editable: true,
                        allowBlank: true
                    }, {
                        name: 'EndDate',
                        xtype: 'datefield',
                        fieldLabel: 'End Date',
                        altFormats: 'c',
                        hidden: false,
                        // value: new Date(),
                        editable: true,
                        allowBlank: true
                    }, {
                        hiddenName: 'PeriodTwoId',
                        xtype: 'combo',
                        fieldLabel: 'To Period',
                        triggerAction: 'all',
                        mode: 'local',
                        editable: true,
                        typeAhead: true,
                        forceSelection: true,
                        emptyText: '---Select---',
                        hidden: true,
                        allowBlank: true,
                        store: new Ext.data.DirectStore({
                            reader: new Ext.data.JsonReader({
                                successProperty: 'success',
                                idProperty: 'Id',
                                root: 'data',
                                fields: ['Id', 'Name']
                            }),
                            autoLoad: true,
                            api: { read: window.Tsa.GetPeriods }
                        }),
                        valueField: 'Id',
                        displayField: 'Name'
                    }, {
                        name: 'StartDate',
                        xtype: 'datefield',
                        fieldLabel: 'Start Date',
                        altFormats: 'c',
                        hidden: true,
                        //value: new Date(),
                        editable: true,
                        allowBlank: true
                    }, {
                        name: 'EndDate',
                        xtype: 'datefield',
                        fieldLabel: 'End Date',
                        altFormats: 'c',
                        hidden: true,
                        // value: new Date(),
                        editable: true,
                        allowBlank: true
                    }
                ]
            },
            ///////////////////////////////////////////////////////////////////////////////////////////
            {
                xtype: 'fieldset',
                id: 'fsAccount',
                region: 'north',
                title: 'Account Number',
                bodystyle: 'padding-0px',
                labelstyle: 'text-align:right;',
                autoWidth: true,

                items: [
                    /* Fieldset Item number 1 - Text Field */
                    {
                        xtype: 'compositefield',
                        fieldLabel: 'Selection',

                        defaults: {
                            flex: 1

                        },
                        items: [
                            {
                                text: 'Single',
                                xtype: 'label',
                                style: 'text-align: left;padding: 3px 3px 3px 0;'
                            },
                            {
                                name: 'chkSingleAccount',
                                xtype: 'checkbox',
                                checked: false,
                                listeners: {
                                    scope: this,
                                    check: function(Checkbox, checked) {

                                        var form = Ext.getCmp('rptGeneralLedger-form').getForm();
                                        var chkAll = form.findField('chkAllAccount');
                                        var chkRange = form.findField('chkRangeAccount');
                                        if (checked) {
                                            chkAll.suspendEvents(true);
                                            chkAll.setValue(false);
                                            chkAll.resumeEvents();

                                            chkRange.suspendEvents(true);
                                            chkRange.setValue(false);
                                            chkRange.resumeEvents();

                                            form.findField('AccountFrom').setDisabled(true);
                                            form.findField('AccountFrom').reset();

                                            form.findField('AccountTo').setDisabled(true);
                                            form.findField('AccountTo').reset();

                                            form.findField('AccountNo').setDisabled(false);
                                        }
                                    }
                                }

                            }, {
                                text: 'All',
                                xtype: 'label',
                                width: 20,
                                style: 'text-align: center;padding: 3px 3px 3px 0;'
                            }, {
                                name: 'chkAllAccount',
                                xtype: 'checkbox',
                                checked: true,
                                fieldLabel: 'All',
                                listeners: {
                                    scope: this,
                                    check: function(Checkbox, checked) {

                                        var form = Ext.getCmp('rptGeneralLedger-form').getForm();
                                        var chkSingle = form.findField('chkSingleAccount');
                                        var chkRange = form.findField('chkRangeAccount');
                                        if (checked) {
                                            chkSingle.suspendEvents(true);
                                            chkSingle.setValue(false);
                                            chkSingle.resumeEvents();

                                            chkRange.suspendEvents(true);
                                            chkRange.setValue(false);
                                            chkRange.resumeEvents();

                                            form.findField('AccountNo').setDisabled(true);
                                            form.findField('AccountNo').reset();

                                            form.findField('AccountFrom').setDisabled(true);
                                            form.findField('AccountFrom').reset();

                                            form.findField('AccountTo').setDisabled(true);
                                            form.findField('AccountTo').reset();
                                        }
                                    }
                                }
                            }, {
                                text: 'Range',
                                xtype: 'label',
                                style: 'text-align: left;padding: 3px 3px 3px 0;'
                            }, {
                                name: 'chkRangeAccount',
                                xtype: 'checkbox',
                                checked: false,
                                fieldLabel: 'Range',
                                listeners: {
                                    scope: this,
                                    check: function(Checkbox, checked) {

                                        var form = Ext.getCmp('rptGeneralLedger-form').getForm();
                                        var chkAll = form.findField('chkAllAccount');
                                        var chkSingle = form.findField('chkSingleAccount');
                                        if (checked) {
                                            chkAll.suspendEvents(true);
                                            chkAll.setValue(false);
                                            chkAll.resumeEvents();

                                            chkSingle.suspendEvents(true);
                                            chkSingle.setValue(false);
                                            chkSingle.resumeEvents();

                                            form.findField('AccountNo').setDisabled(true);
                                            form.findField('AccountNo').reset();

                                            form.findField('AccountFrom').setDisabled(false);
                                            form.findField('AccountTo').setDisabled(false);

                                        }
                                    }
                                }
                            }
                        ]
                    }, {
                        hiddenName: 'AccountNo',
                        xtype: 'combo',
                        fieldLabel: 'Account No',
                        typeAhead: true,
                        hideTrigger: true,
                        minChars: 1,
                        listWidth: 280,
                        mode: 'remote',
                        tpl: '<tpl for="."><div ext:qtip="{Id}. {Name}" class="x-combo-list-item">' +
                            '<h3><span>{Account}</span></h3> {Name}</div></tpl>',
                        store: new Ext.data.DirectStore({
                            reader: new Ext.data.JsonReader({
                                successProperty: 'success',
                                idProperty: 'Id',
                                totalProperty: 'total',
                                root: 'data',
                                fields: ['Id', 'Account', 'Name']
                            }),
                            //autoLoad: true,
                            //baseParams: { start: 0, limit: 10 },
                            api: { read: Tsa.GetControlAccounts }
                        }),
                        displayField: 'Account',
                        pageSize: 10
                    },
                    /* Fieldset Item number 2 - a Composite Field */
                    {
                        xtype: 'compositefield',
                        fieldLabel: 'From',

                        defaults: {
                            flex: 1
                            //width : 20
                        },
                        items: [
                            {
                                hiddenName: 'AccountFrom',
                                xtype: 'combo',
                                fieldLabel: 'Account',
                                typeAhead: true,
                                hideTrigger: true,
                                //disabled:true,
                                minChars: 1,
                                listWidth: 280,
                                mode: 'remote',
                                tpl: '<tpl for="."><div ext:qtip="{Id}. {Name}" class="x-combo-list-item">' +
                                    '<h3><span>{Account}</span></h3> {Name}</div></tpl>',
                                store: new Ext.data.DirectStore({
                                    reader: new Ext.data.JsonReader({
                                        successProperty: 'success',
                                        idProperty: 'Id',
                                        totalProperty: 'total',
                                        root: 'data',
                                        fields: ['Id', 'Account', 'Name']
                                    }),
                                    api: { read: Tsa.GetControlAccounts }
                                }),
                                displayField: 'Account',
                                pageSize: 10
                            }, {
                                text: 'to',
                                xtype: 'label',
                                width: 20,
                                style: 'text-align: center;padding: 3px 3px 3px 0;'
                            }, {
                                hiddenName: 'AccountTo',
                                xtype: 'combo',
                                fieldLabel: 'Account',
                                typeAhead: true,
                                hideTrigger: true,
                                minChars: 1,
                                //disabled:true,
                                listWidth: 280,
                                mode: 'remote',
                                tpl: '<tpl for="."><div ext:qtip="{Id}. {Name}" class="x-combo-list-item">' +
                                    '<h3><span>{Account}</span></h3> {Name}</div></tpl>',
                                store: new Ext.data.DirectStore({
                                    reader: new Ext.data.JsonReader({
                                        successProperty: 'success',
                                        idProperty: 'Id',
                                        totalProperty: 'total',
                                        root: 'data',
                                        fields: ['Id', 'Account', 'Name']
                                    }),
                                    api: { read: Tsa.GetControlAccounts }
                                }),
                                displayField: 'Account',
                                pageSize: 10
                            }
                        ]
                    }
                ]
            },

            /////////////////////////////////////////////////////////////////////////////////////////
            {
                xtype: 'fieldset',
                id: 'fsReferenceCode',
                region: 'north',
                title: 'Reference Code',
                bodystyle: 'padding-0px',
                labelstyle: 'text-align:right;',
                autoWidth: true,

                items: [
                    /* Fieldset Item number 1 - Text Field */
                    {
                        hiddenName: 'Criteria',
                        xtype: 'combo',
                        fieldLabel: 'Reference Type',
                        anchor: '90%',
                        triggerAction: 'all',
                        mode: 'local',
                        editable: true,
                        typeAhead: true,
                        forceSelection: true,
                        emptyText: 'PN, WS, VEHICLE, IC, NA etc.',
                        store: new Ext.data.DirectStore({
                            reader: new Ext.data.JsonReader({
                                successProperty: 'success',
                                idProperty: 'Id',
                                root: 'data',
                                fields: ['Id', 'Name', 'Code', 'CodeAndName']
                            }),
                            autoLoad: true,
                            api: { read: window.Tsa.GetFilterCriterias }
                        }),
                        valueField: 'Code',
                        displayField: 'Code'
                    }, {
                        hiddenName: 'StaffCode',
                        fieldLabel: 'Reference Code',
                        xtype: 'combo',
                        //emptyText: '- Staff Code -',
                        typeAhead: false,
                        hideTrigger: true,
                        //forceSelection: true,
                        minChars: 1,
                        listWidth: 280,
                        mode: 'remote',
                        tpl: '<tpl for="."><div ext:qtip="{Id}. {Name}" class="x-combo-list-item">' +
                            '<h3><span>{Code}</span></h3> {Name}</div></tpl>',
                        store: new Ext.data.DirectStore({
                            reader: new Ext.data.JsonReader({
                                successProperty: 'success',
                                idProperty: 'Id',
                                totalProperty: 'total',
                                root: 'data',
                                fields: ['Id', 'Name', 'Code']
                            }),

                            api: { read: Tsa.GetAllReferenceCodes }
                        }),

                        valueField: 'Code',
                        displayField: 'Code',
                        pageSize: 10,
                        listeners: {
                            beforequery: function(queryEvent) {
                                var form = Ext.getCmp('rptGeneralLedger-form').getForm();
                                var criteria = form.findField('Criteria');
                                this.store.baseParams = { CriteriaId: criteria.value };
                            }
                        }
                    }, {
                        xtype: 'compositefield',
                        fieldLabel: 'Select range',
                        defaults: { flex: 1 },
                        items: [
                            {
                                id: 'displayCriteria',
                                xtype: 'textfield',
                                name: 'displayCriteria',
                                fieldLabel: 'Selected Criterias',
                                width: 175,
                                allowBlank: false,
                                disabled: true
                            },
                            {
                                xtype: 'button',
                                id: 'btnAddRange',
                                iconCls: 'icon-filter',
                                width: 25,
                                handler: function() {
                                    var form = Ext.getCmp('rptGeneralLedger-form').getForm();
                                    var criteria = form.findField('Criteria').value;
                                    new Ext.core.finance.ux.itemsPicker.Window({
                                        parentForm: form,
                                        SelectedCriteria: criteria
                                    }).show();
                                }
                            }
                        ]

                    }, {
                        id: 'SelectedCriterias',
                        xtype: 'textfield',
                        name: 'SelectedCriterias',
                        fieldLabel: 'Selected Criterias',
                        width: 175,
                        hidden: true
                    }
                ]

            },


///////////////////////////////////////////////////////////////////////
            {
                xtype: 'fieldset',
                id: 'fsOtherCriteria',
                region: 'north',
                title: 'Other Criterias',
                bodystyle: 'padding-0px',
                labelstyle: 'text-align:left;',
                autoWidth: true,

                items: [
                    {
                        layout: 'column',
                        border: false,
                        items: [
                            {
                                columnWidth: 1,

                                defaults: {
                                    labelStyle: 'text-align:left;',
                                    msgTarget: 'side'
                                },
                                border: false,
                                layout: 'form',
                                items: [
                                    {
                                        hiddenName: 'DeptCode',
                                        xtype: 'combo',
                                        fieldLabel: 'Department Code',
                                        typeAhead: false,
                                        hideTrigger: true,
                                        minChars: 1,
                                        listWidth: 280,
                                        mode: 'remote',
                                        tpl: '<tpl for="."><div ext:qtip="{Id}. {Name}" class="x-combo-list-item">' +
                                            '<h3><span>{Code}</span></h3> {Name}</div></tpl>',
                                        store: new Ext.data.DirectStore({
                                            reader: new Ext.data.JsonReader({
                                                successProperty: 'success',
                                                idProperty: 'Id',
                                                totalProperty: 'total',
                                                root: 'data',
                                                fields: ['Id', 'Name', 'Code']
                                            }),
                                            api: { read: Tsa.GetDepartmentsQuery }
                                        }),
                                        displayField: 'Code',
                                        pageSize: 10
                                    }, {
                                        hiddenName: 'Location',
                                        xtype: 'combo',
                                        fieldLabel: 'Location',
                                        typeAhead: false,
                                        hideTrigger: true,
                                        minChars: 1,
                                        listWidth: 280,
                                        mode: 'remote',
                                        tpl: '<tpl for="."><div ext:qtip="{Id}. {Name}" class="x-combo-list-item">' +
                                            '<h3><span>{Code}</span></h3> {Name}</div></tpl>',
                                        store: new Ext.data.DirectStore({
                                            reader: new Ext.data.JsonReader({
                                                successProperty: 'success',
                                                idProperty: 'Id',
                                                totalProperty: 'total',
                                                root: 'data',
                                                fields: ['Id', 'Name', 'Code']
                                            }),
                                            api: { read: Tsa.GetWoredaCodes }
                                        }),
                                        displayField: 'Code',
                                        pageSize: 10
                                    }, {
                                        hiddenName: 'BudgetCode',
                                        xtype: 'combo',
                                        fieldLabel: 'Budget Code',
                                        typeAhead: false,
                                        hideTrigger: true,
                                        minChars: 1,
                                        listWidth: 280,
                                        mode: 'remote',
                                        tpl: '<tpl for="."><div ext:qtip="{Id}. {Name}" class="x-combo-list-item">' +
                                            '<h3><span>{Code}</span></h3> {Name}</div></tpl>',
                                        store: new Ext.data.DirectStore({
                                            reader: new Ext.data.JsonReader({
                                                successProperty: 'success',
                                                idProperty: 'Id',
                                                totalProperty: 'total',
                                                root: 'data',
                                                fields: ['Id', 'Code', 'Name']
                                            }),
                                            api: { read: Tsa.GetBudgetCode }
                                        }),
                                        displayField: 'Code',
                                        pageSize: 10
                                    }, {
                                        hiddenName: 'VoucherTypeId',
                                        xtype: 'combo',
                                        fieldLabel: 'Voucher Type',
                                        triggerAction: 'all',
                                        mode: 'local',
                                        editable: true,
                                        typeAhead: true,
                                        hidden: true,
                                        forceSelection: true,
                                        emptyText: '---Select---',
                                        allowBlank: true,
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
                                        hiddenName: 'LocationId',
                                        xtype: 'combo',
                                        fieldLabel: 'Location',
                                        anchor: '90%',
                                        triggerAction: 'all',
                                        mode: 'local',
                                        editable: true,
                                        typeAhead: true,
                                        forceSelection: true,
                                        hidden: true,
                                        emptyText: '- Location -',

                                        store: new Ext.data.DirectStore({
                                            reader: new Ext.data.JsonReader({
                                                successProperty: 'success',
                                                idProperty: 'Id',
                                                root: 'data',
                                                fields: ['Id', 'CodeAndName']
                                            }),
                                            autoLoad: true,
                                            api: { read: Tsa.GetWoreda }
                                        }),
                                        valueField: 'Id',
                                        displayField: 'CodeAndName'
                                    }, {
                                        xtype: 'compositefield',
                                        fieldLabel: 'Reference No.',
                                        hidden: true,
                                        defaults: {
                                            flex: 1
                                        },
                                        items: [
                                            {
                                                xtype: 'textfield',
                                                name: 'ReferenceFrom',
                                                hidden: true,
                                                fieldLabel: 'Reference From',
                                                allowBlank: true
                                            }, {
                                                text: 'to',
                                                xtype: 'label',
                                                hidden: true,
                                                width: 20,
                                                style: 'text-align: center;padding: 3px 3px 3px 0;'
                                            }, {
                                                xtype: 'textfield',
                                                name: 'ReferenceTo',
                                                fieldLabel: 'Reference To',
                                                hidden: true,
                                                allowBlank: true
                                            }
                                        ]
                                    }, {
                                        hiddenName: 'ReferenceNo',
                                        xtype: 'combo',
                                        fieldLabel: 'Invoice No',
                                        typeAhead: true,
                                        hideTrigger: true,
                                        minChars: 1,
                                        listWidth: 280,
                                        mode: 'remote',
                                        tpl: '<tpl for="."><div ext:qtip="{Id}. {Name}" class="x-combo-list-item">' +
                                            '<h3><span>{Reference}</span></h3> {Date}</div></tpl>',
                                        store: new Ext.data.DirectStore({
                                            reader: new Ext.data.JsonReader({
                                                successProperty: 'success',
                                                idProperty: 'Id',
                                                totalProperty: 'total',
                                                root: 'data',
                                                fields: ['Id', 'Reference', 'Date']
                                            }),
                                            api: { read: Tsa.GetVoucherReferenceNo }
                                        }),
                                        displayField: 'Reference',
                                        pageSize: 10
                                    }, {
                                        name: 'IsRunningTotalDisplayed',
                                        xtype: 'checkbox',
                                        fieldLabel: 'Show Running Totals',
                                        hidden: true
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            /////////////////////////////////////////////////////////////////////////////
            {
                hiddenName: 'BankId',
                xtype: 'combo',
                fieldLabel: 'Select Bank',
                hidden: true,
                triggerAction: 'all',
                mode: 'local',
                editable: true,
                typeAhead: true,
                forceSelection: true,
                emptyText: 'Select Bank',
                listWidth: 250,
                allowblank: false,
                store: new Ext.data.DirectStore({
                    reader: new Ext.data.JsonReader({
                        successProperty: 'success',
                        idProperty: 'Id',
                        root: 'data',
                        accountNo: 'AccountNo',
                        fields: ['Id', 'BranchName', 'AccountNo']
                    }),
                    autoLoad: true,
                    api: { read: Tsa.GetCompanyBankBranches }
                }),
                valueField: 'Id',
                displayField: 'BranchName'

            }, {
                hiddenName: 'SortBy',
                xtype: 'combo',
                fieldLabel: 'Sort By',
                triggerAction: 'all',
                mode: 'local',
                editable: false,
                forceSelection: false,
                emptyText: '---Select---',
                allowBlank: true,
                store: new Ext.data.ArrayStore({
                    fields: ['Id', 'Name'],
                    data: [
                        ['InvoiceDate', 'Invoice Date'],
                        ['InvoiceRefNo', 'Invoice Ref No'],
                        ['ReferenceCode', 'Reference Code']
                    ]
                }),
                valueField: 'Id',
                displayField: 'Name'
            }, {
                hiddenName: 'SortThenBy',
                xtype: 'combo',
                fieldLabel: 'Then By',
                triggerAction: 'all',
                mode: 'local',
                editable: false,
                forceSelection: false,
                emptyText: '---Select---',
                allowBlank: true,
                store: new Ext.data.ArrayStore({
                    fields: ['Id', 'Name'],
                    data: [
                        ['InvoiceDate', 'Invoice Date'],
                        ['InvoiceRefNo', 'Invoice Ref No'],
                        ['ReferenceCode', 'Reference Code']
                    ]
                }),
                valueField: 'Id',
                displayField: 'Name'
            }, {
                hiddenName: 'EmployeeRegionId',
                xtype: 'combo',
                anchor: '75%',
                fieldLabel: 'Emp Region',
                triggerAction: 'all',
                mode: 'local',
                editable: true,
                hidden: true,
                typeAhead: true,
                forceSelection: true,
                emptyText: '---Select Region---',

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
                displayField: 'Name'
            }, {
                name: 'ShowZeroBalance',
                hiddenName: 'ShowZeroBalance',
                xtype: 'checkbox',
                fieldLabel: 'Show Zero Balance',
                hidden: true
            }
        ],
        buttons: [
            {
                text: 'Export',
                iconCls: 'icon-Preview',
                hidden: true,
                handler: function() {
                    Ext.Ajax.timeout = 6000000;
                    var form = Ext.getCmp('rptGeneralLedger-form');
                    form.getForm().submit({
                        waitMsg: 'Please wait...',
                        success: function() {
                            var iframePanel = Ext.getCmp('rptGeneralLedger-iframePanel');

                            var url = 'Reports/Financial/FinancialReportsViewer.aspx?rt=GeneralLedger' + '&printMode=' + false;
                            iframePanel.removeAll();
                            iframePanel.add(new Ext.core.finance.ux.common.IFrameComponent({ url: url }));
                            iframePanel.doLayout();
                        }
                    });
                },
                scope: this
            }, {
                text: 'Preview',
                iconCls: 'icon-preview',
                handler: function() {
                    //                Ext.Ajax.timeout = 6000000;
                    //                var form = Ext.getCmp('rptGeneralLedger-form');
                    //                form.getForm().submit({
                    //                    waitMsg: 'Please wait...',
                    //                    success: function () {
                    //                        var iframePanel = Ext.getCmp('rptGeneralLedger-iframePanel');
                    //                        //var url = 'Reports/CReportViewer.aspx?rt=GeneralLedger' + '&' + (new Date).getTime();   
                    //                        var url = 'Reports/Financial/FinancialReportsViewer.aspx?rt=GeneralLedger' + '&printMode=' + true;
                    //                        iframePanel.removeAll();
                    //                        iframePanel.add(new Ext.core.finance.ux.common.IFrameComponent({ url: url }));
                    //                        iframePanel.doLayout();
                    //                    }
                    //                });
                    onSubmitForm();
                },
                scope: this
            }, {
                text: 'Reset',
                iconCls: 'icon-exit',
                handler: function() {
                    form = Ext.getCmp('rptGeneralLedger-form').getForm();
                    form.reset();
                    //                form.findField('VoucherTypeId').reset();
                    //                form.findField('ReferenceFrom').reset();
                    //                form.findField('ReferenceTo').reset();
                    //                form.findField('AccountFrom').reset();
                    //                form.findField('AccountTo').reset();
                    //               
                    //                form.findField('StaffCode').reset();
                },
                scope: this
            }
        ]
    }, config));
};
Ext.extend(Ext.core.finance.ux.rptGeneralLedger.Form, Ext.form.FormPanel);
Ext.reg('rptGeneralLedger-form', Ext.core.finance.ux.rptGeneralLedger.Form);
var selModelFiltCriteria = new Ext.grid.CheckboxSelectionModel();







/**
* @desc      Pay Sheet Report viewer panel
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      November 01, 2013
* @namespace Ext.core.finance.ux.rptGeneralLedger
* @class     Ext.core.finance.ux.rptGeneralLedger.Panel
* @extends   Ext.Panel
*/
Ext.core.finance.ux.rptGeneralLedger.Panel = function (config) {
    Ext.core.finance.ux.rptGeneralLedger.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false
    }, config));
}
Ext.extend(Ext.core.finance.ux.rptGeneralLedger.Panel, Ext.Panel, {
    initComponent: function () {
        this.url = 'Empty.aspx';
        this.form = new Ext.core.finance.ux.rptGeneralLedger.Form();

        this.iframeComponent = new Ext.core.finance.ux.common.IFrameComponent({ url: this.url });

        this.items = [{
            layout: 'border',
            border: false,
            items: [{
                region: 'west',
                border: true,
                collapsible: true,
                title: 'Report - Financial Reports',
                split: true,
                width: 345,

                minSize: 345,
                layout: 'fit',
                autoScroll: true,
                items: [{
                    layout: 'fit',
                    autoScroll: true,
                    layoutConfig: {
                        type: 'hbox',
                        align: 'stretch',
                        pack: 'start'
                    },
                    defaults: {
                        flex: 1
                    },
                    items: [this.form]

                }]
            }, {
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
                    id: 'rptGeneralLedger-iframePanel',
                    items: [this.iframeComponent]
                }]
            }]
        }];

        Ext.core.finance.ux.rptGeneralLedger.Panel.superclass.initComponent.apply(this, arguments);
    }
});

var onSubmitForm = function () {
    Ext.Ajax.timeout = 6000000;
    var form = Ext.getCmp('rptGeneralLedger-form');
    form.getForm().submit({
        waitMsg: 'Please wait...',
        success: function () {
            var iframePanel = Ext.getCmp('rptGeneralLedger-iframePanel');

            var url = 'Reports/Financial/FinancialReportsViewer.aspx?rt=GeneralLedger' + '&printMode=' + false;
            iframePanel.removeAll();
            iframePanel.add(new Ext.core.finance.ux.common.IFrameComponent({ url: url }));
            iframePanel.doLayout();
        }
    });
};

Ext.reg('rptGeneralLedger-panel', Ext.core.finance.ux.rptGeneralLedger.Panel);

