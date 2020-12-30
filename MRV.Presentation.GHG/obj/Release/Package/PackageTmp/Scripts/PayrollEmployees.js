Ext.ns('Ext.core.finance.ux.PayrollEmployees');
/**
* @desc      Employee registration form
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.PayrollEmployees
* @class     Ext.core.finance.ux.PayrollEmployees.Form
* @extends   Ext.form.FormPanel
*/
Ext.core.finance.ux.PayrollEmployees.Form = function (config) {
    Ext.core.finance.ux.PayrollEmployees.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: PayrollEmployees.Get,
            submit: PayrollEmployees.Save
        },
        paramOrder: ['Id'],
        defaults: {
            labelStyle: 'text-align:left;',
            msgTarget: 'side'
        },
        id: 'PayrollEmployees-form',
        padding: 5,
        labelWidth: 120,
        autoHeight: true,
        border: false,
        isFormLoad: false,
        frame: true,
        items: [{
            layout: 'column',
            items: [{
                columnWidth: .50,
                defaults: {
                    labelStyle: 'text-align:left;',
                    msgTarget: 'side'
                },
                border: false,
                layout: 'form',
                items: [{
                    name: 'Id',
                    xtype: 'hidden'
                }, {
                    name: 'IdentityNo',
                    xtype: 'textfield',
                    fieldLabel: 'IdentityNo',
                    anchor: '90%',
                    allowBlank: false,
                    //regex: /[a-zA-Z0-9]+/,
                    maskRe: /[a-zA-Z0-9]+/
                }, {
                    name: 'FirstName',
                    xtype: 'textfield',
                    fieldLabel: 'FirstName',
                    anchor: '100%',
                    allowBlank: false
                }, {
                    name: 'FirstNameAmharic',
                    xtype: 'textfield',
                    fieldLabel: 'ስም',
                    labelStyle: 'text-align:right;',
                    anchor: '90%',
                    allowBlank: true

                }, {
                    name: 'MiddleName',
                    xtype: 'textfield',
                    fieldLabel: 'MiddleName',
                    anchor: '100%',
                    allowBlank: false
                }, {
                    name: 'MiddleNameAmharic',
                    xtype: 'textfield',
                    fieldLabel: 'የአባት ስም',
                    labelStyle: 'text-align:right;',
                    anchor: '90%',
                    allowBlank: true
                }, {
                    name: 'LastName',
                    xtype: 'textfield',
                    fieldLabel: 'LastName',
                    anchor: '100%',
                    allowBlank: false
                }, {
                    name: 'LastNameAmharic',
                    xtype: 'textfield',
                    fieldLabel: 'የአያት ስም',
                    labelStyle: 'text-align:right;',
                    anchor: '90%',
                    allowBlank: true
                }, {
                    name: 'Sex',
                    xtype: 'textfield',
                    fieldLabel: 'Sex',
                    anchor: '90%',
                    allowBlank: false
                }, {
                    xtype: 'currencyfield',
                    name: 'SalaryETB',
                    fieldLabel: 'Salary ETB',
                    allowNegative: false,
                    value: 0,
                    currencySymbol: 'B',
                    anchor: '90%',
                    style: 'font-weight: normal; color: Navy;border: 1px solid black;',

                    listeners: {
                        //                        'change': function () {
                        //                            var form = Ext.getCmp('PayrollEmployees-form');
                        //                            var etBirr = form.getForm().findField('SalaryETB').getValue();
                        //                            var gbPound = form.getForm().findField('SalaryGBP').getValue();
                        //                            var excRate = form.getForm().findField('ExchangeRate').getValue();
                        //                            if (etBirr == "" || etBirr == 0) {
                        //                                return;
                        //                            }
                        //                            var result = etBirr / excRate;
                        //                            form.getForm().findField('SalaryGBP').setValue(result);
                        //                        }
                    }
                }, {
                    xtype: 'currencyfield',
                    name: 'SalaryGBP',
                    fieldLabel: 'Salary GBP',
                    allowNegative: false,
                    value: 0,
                    currencySymbol: '£',
                    anchor: '90%',
                    style: 'font-weight: normal; color: Navy;border: 1px solid black;',

                    listeners: {
                        'change': function () {
                            var form = Ext.getCmp('PayrollEmployees-form');
                            var etBirr = form.getForm().findField('SalaryETB').getValue();
                            var gbPound = form.getForm().findField('SalaryGBP').getValue();
                            var excRate = form.getForm().findField('ExchangeRate').getValue();
                            if (gbPound == "" || gbPound == 0) {
                                return;
                            }
                            var result = gbPound * excRate;
                            form.getForm().findField('SalaryETB').setValue(result);
                        }
                    }
                }, {
                    name: 'EmploymentDate',
                    xtype: 'datefield',
                    fieldLabel: 'Employment Date',
                    altFormats: 'c',
                    anchor: '90%',
                    allowBlank: false
                }, {
                    name: 'Nationality',
                    xtype: 'textfield',
                    fieldLabel: 'Nationality',
                    anchor: '90%',
                    value: 'Ethiopian',
                    allowBlank: false
                }]
            }, {
                columnWidth: .50,
                padding: 5,
                defaults: {

                    labelStyle: 'text-align:left;',
                    msgTarget: 'side'
                },
                border: true,
                layout: 'form',
                items: [{
                    name: 'Email',
                    xtype: 'textfield',
                    fieldLabel: 'E-mail',
                    anchor: '90%',
                    allowBlank: true
                }, {
                    name: 'IsPermanent',
                    xtype: 'checkbox',
                    disabled: false,
                    checked: true,
                    fieldLabel: 'IsPermanent'
                }, {
                    hiddenName: 'PositionId',
                    xtype: 'combo',
                    fieldLabel: 'Position',
                    anchor: '96.5%',
                    triggerAction: 'all',
                    mode: 'local',
                    editable: true,
                    typeAhead: true,
                    forceSelection: true,
                    emptyText: '---Select Position---',
                    allowBlank: false,
                    store: new Ext.data.DirectStore({
                        reader: new Ext.data.JsonReader({
                            successProperty: 'success',
                            idProperty: 'Id',
                            root: 'data',
                            fields: ['Id', 'Name']
                        }),
                        autoLoad: true,
                        api: { read: Tsa.GetPositions }
                    }),
                    valueField: 'Id', displayField: 'Name'
                }, {
                    hiddenName: 'DepartmentId',
                    xtype: 'combo',
                    fieldLabel: 'Department',
                    anchor: '96.5%',
                    triggerAction: 'all',
                    mode: 'local',
                    editable: true,
                    typeAhead: true,
                    forceSelection: true,
                    emptyText: '---Select Department---',
                    allowBlank: false,
                    store: new Ext.data.DirectStore({
                        reader: new Ext.data.JsonReader({
                            successProperty: 'success',
                            idProperty: 'Id',
                            root: 'data',
                            fields: ['Id', 'Name']
                        }),
                        autoLoad: true,
                        api: { read: Tsa.GetDepartments }
                    }),
                    valueField: 'Id', displayField: 'Name'
                }, {
                    hiddenName: 'AccountId',
                    xtype: 'combo',
                    fieldLabel: 'Account',
                    anchor: '96.5%',
                    triggerAction: 'all',
                    mode: 'local',
                    editable: true,
                    hidden: true,
                    typeAhead: true,
                    forceSelection: true,
                    emptyText: '---Select Account---',
                    allowBlank: true,
                    store: new Ext.data.DirectStore({
                        reader: new Ext.data.JsonReader({
                            successProperty: 'success',
                            idProperty: 'Id',
                            root: 'data',
                            fields: ['Id', 'CodeAndName']
                        }),
                        autoLoad: true,
                        api: { read: Tsa.GetAccounts }
                    }),
                    valueField: 'Id', displayField: 'CodeAndName'
                }, {
                    hiddenName: 'BankId',
                    xtype: 'combo',
                    fieldLabel: 'Bank',
                    anchor: '96.5%',
                    triggerAction: 'all',
                    mode: 'local',
                    editable: true,
                    typeAhead: true,
                    forceSelection: true,
                    emptyText: '---Select Bank---',
                    allowBlank: false,
                    store: new Ext.data.DirectStore({
                        reader: new Ext.data.JsonReader({
                            successProperty: 'success',
                            idProperty: 'Id',
                            root: 'data',
                            fields: ['Id', 'Name']
                        }),
                        autoLoad: true,
                        api: { read: Tsa.GetBanks }
                    }),
                    valueField: 'Id', displayField: 'Name',
                    listeners: {
                        select: function (combo, record, index) {
                            var form = Ext.getCmp('PayrollEmployees-form').getForm();
                            var id = record.data.Id;
                            var branch = form.findField('BankBranch');
                            branch.clearValue();
                            branch.store.load({ params: { parentId: id } });
                        },
                        change: function (ele, newValue, oldValue) {
                            var k = 0;
                        }

                    }
                }, {
                    hiddenName: 'BankBranch',
                    xtype: 'combo',
                    fieldLabel: 'Bank Branch',
                    anchor: '96.5%',
                    triggerAction: 'all',
                    mode: 'local',
                    editable: true,
                    typeAhead: true,
                    forceSelection: true,
                    emptyText: '---Select Bank---',
                    allowBlank: false,
                    store: new Ext.data.DirectStore({
                        reader: new Ext.data.JsonReader({
                            successProperty: 'success',
                            idProperty: 'Id',
                            root: 'data',
                            fields: ['Id', 'BranchName']
                        }),
                        paramOrder: ['parentId'],
                        //autoLoad: true,
                        api: { read: Tsa.GetBankBranches }
                    }),
                    valueField: 'Id', displayField: 'BranchName',
                    listeners: {
                        select: function (combo, record, index) {
                            var form = Ext.getCmp('PayrollEmployees-form').getForm();
                            var branchId = record.data.Id;
                            var fieldbranchId = form.findField('BankBranchId');
                            fieldbranchId.setValue(branchId);
                        },
                        change: function (ele, newValue, oldValue) {
                            var k = 0;
                        }

                    }
                }, {
                    name: 'BankBranchId',
                    xtype: 'textfield',
                    fieldLabel: 'BankBranchId',
                    anchor: '90%',
                    allowBlank: false,
                    hidden: true
                }, {
                    name: 'BankAccountNo',
                    xtype: 'textfield',
                    fieldLabel: 'Bank Account No',
                    anchor: '90%',
                    allowBlank: false
                }, {
                    hiddenName: 'WoredaId',
                    xtype: 'combo',
                    fieldLabel: 'Duty Station',
                    anchor: '90%',
                    triggerAction: 'all',
                    mode: 'local',
                    editable: true,
                    typeAhead: true,
                    forceSelection: true,
                    emptyText: '---Select Woreda---',
                    allowBlank: false,
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
                    valueField: 'Id', displayField: 'CodeAndName'
                }, {
                    name: 'IsActive',
                    xtype: 'checkbox',
                    checked: true,
                    hidden: true,
                    fieldLabel: 'IsActive'
                }, {
                    name: 'IsTerminated',
                    xtype: 'checkbox',
                    checked: false,
                    fieldLabel: 'Is Terminated',
                    hidden: true

                }, {
                    name: 'ExchangeRate',
                    xtype: 'textfield',
                    fieldLabel: 'ExchangeRate',
                    anchor: '100%',
                    hidden: true

                }, {
                    name: 'TINNumber',
                    xtype: 'textfield',
                    fieldLabel: 'TIN Number',
                    anchor: '100%',
                    hidden: false

                }, {
                    name: 'HasPension',
                    xtype: 'checkbox',
                    checked: false,
                    fieldLabel: 'Has Pension',
                    hidden: true
                }, {
                    name: 'ContractEndDate',
                    xtype: 'datefield',
                    fieldLabel: 'Contract End Date',
                    altFormats: 'c',
                    anchor: '90%'
                }, {
                    xtype: 'fieldset',
                    id: 'fsReferenceCode',
                    region: 'north',
                    title: 'Reference Code',
                    bodystyle: 'padding-0px',
                    labelstyle: 'text-align:right;',
                    autoWidth: true,

                    items: [{
                        name: 'SalaryExpenceAccountId',
                        xtype: 'hidden',
                        value: '22e089c2-fc29-4a19-8b3c-216c2eed04be'
                    }, {
                        xtype: 'compositefield',
                        fieldLabel: 'Salary Exp. Account',
                        defaults: { flex: 1 },
                        items: [
                            {
                                xtype: 'textfield',
                                name: 'SalaryExpenceAccount',
                                fieldLabel: 'Salary Exp. Account',
                                anchor: '90%',
                                allowBlank: false,
                                disabled: true,
                                value: '90101 - Salary Expense'
                            },
                            {
                                xtype: 'button',
                                id: 'findSLAccount',
                                iconCls: 'icon-filter',
                                width: 25,
                                handler: function () {
                                    var form = Ext.getCmp('PayrollEmployees-form').getForm();
                                    new Ext.core.finance.ux.accountPicker.Window({
                                        find: 'SLAccount',
                                        controlAccountId: '',
                                        parentForm: form,
                                        controlIdField: 'SalaryExpenceAccountId',
                                        controlNameField: 'SalaryExpenceAccount'
                                    }).show();
                                }
                            }
                        ]

                    }
                    ]
                }
                            
                ]

            }]

        }]
    }, config));
}
Ext.extend(Ext.core.finance.ux.PayrollEmployees.Form, Ext.form.FormPanel);
Ext.reg('PayrollEmployees-form', Ext.core.finance.ux.PayrollEmployees.Form);

var EmployeeSelModel = new Ext.grid.CheckboxSelectionModel();
/**
* @desc      Employee registration form host window
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.PayrollEmployees
* @class     Ext.core.finance.ux.PayrollEmployees.Window
* @extends   Ext.Window
*/
Ext.core.finance.ux.PayrollEmployees.Window = function (config) {
    Ext.core.finance.ux.PayrollEmployees.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        width: 750,
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        resizable: true,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;',
        listeners: {
            show: function () {
                this.form.getForm().findField('Id').setValue(this.PayrollItemsId);
                if (this.PayrollItemsId > 0) {
                    this.form.load({ params: { Id: this.PayrollItemsId} });
                }
                this.form.getForm().findField('ExchangeRate').setValue(this.ExchangeRate);

                if (this.IdPrefix != '') {
                    this.form.getForm().findField('IdentityNo').setValue(this.IdPrefix);
                }

                if (this.SetDisabled == true) {
//                    this.form.getForm().findField('SalaryETB').setDisabled(true);
//                    this.form.getForm().findField('SalaryGBP').setDisabled(true);
//                    this.form.getForm().findField('PositionId').setDisabled(true);

//                    this.form.getForm().findField('SalaryETB').hide();
//                    this.form.getForm().findField('SalaryGBP').hide();
                    //this.form.getForm().findField('PositionId').hide();
                }
                else {
//                    this.form.getForm().findField('SalaryETB').setDisabled(false);
//                    this.form.getForm().findField('SalaryGBP').setDisabled(false);
                    //                    this.form.getForm().findField('PositionId').setDisabled(true);

                    this.form.getForm().findField('SalaryETB').show();
                    this.form.getForm().findField('SalaryGBP').show();
                    //this.form.getForm().findField('PositionId').show();
                }
            },
            scope: this
        }
    }, config));
}

var isDisabled = false;
Ext.extend(Ext.core.finance.ux.PayrollEmployees.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.core.finance.ux.PayrollEmployees.Form();
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

        Ext.core.finance.ux.PayrollEmployees.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {

        if (!this.form.getForm().isValid()) return;
        var etBirr = this.form.getForm().findField('SalaryETB').getValue();
        var gbPound = this.form.getForm().findField('SalaryGBP').getValue();
        if (etBirr <= 0 && gbPound <= 0) {
            Ext.MessageBox.show({
                title: 'Error',
                msg: 'Employee salary can not be empty or zero. Please provide a valid salary.',
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.ERROR,
                scope: this
            });
            return;
        }
        Ext.Ajax.timeout = 6000000;
        this.form.getForm().submit({
            waitMsg: 'Please wait...',
            success: function () {
                Ext.getCmp('PayrollEmployees-form').getForm().reset();
                Ext.getCmp('PayrollEmployees-paging').doRefresh();
            },
            failure: function (f,a) {
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
Ext.reg('PayrollEmployees-window', Ext.core.finance.ux.PayrollEmployees.Window);

/**
* @desc      Employee grid
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.PayrollEmployees
* @class     Ext.core.finance.ux.PayrollEmployees.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.core.finance.ux.PayrollEmployees.Grid = function (config) {
    Ext.core.finance.ux.PayrollEmployees.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: PayrollEmployees.GetAllActiveEmployees,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Code',
                direction: 'ASC'
            },
            fields: ['Id', 'IdentityNo', 'FirstName', 'MiddleName', 'LastName', 'Position', 'Email', 'DutyStation', 'Region', 'BankAccountNo', 'EmploymentDate', 'IsActive', 'SalaryETB', 'SalaryGBP', 'ContractEndDate'],
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
        id: 'PayrollEmployees-grid',
        searchCriteria: {},
        pageSize: 1000,
        title: 'Employees List',
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

                var isActive = this.getSelectionModel().getSelected().get('IsActive');
                var btn = Ext.getCmp('deActivateEmployee');

                if (isActive) {

                    btn.setText('Deactivate');
                    btn.enable();
                }
                else {
                    btn.setText('Activate');
                    btn.enable();
                }

            },
            scope: this,
            rowdblclick: function () {
                if (!this.getSelectionModel().hasSelection()) return;
                var id = this.getSelectionModel().getSelected().get('Id');

                if (id != null) {

                    Tsa.GetExchangeRateAndPrefix(function (response) {
                        if (response.success == true) {
                            excRate = response.ExchangeRate;
                            var grid = Ext.getCmp('PayrollEmployees-grid');
                            if (!grid.getSelectionModel().hasSelection()) return;
                            var idNum = grid.getSelectionModel().getSelected().get('Id');
                            var hasEditPermission = Ext.core.finance.ux.Reception.getPermission('Employees', 'CanEdit');
                            if (hasEditPermission) {

                                new Ext.core.finance.ux.PayrollEmployees.Window({
                                    PayrollItemsId: idNum,
                                    ExchangeRate: excRate,
                                    IdPrefix: prefix,
                                    title: 'Edit Employee',
                                    SetDisabled : true
                                }).show();
                            }
                        }

                    });

                }

            }
        },
        columns: [new Ext.erp.ux.grid.PagingRowNumberer(),
        {
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
            dataIndex: 'Position',
            header: 'Position',
            sortable: true,
            width: 220,
            menuDisabled: true
        }, {
            dataIndex: 'Email',
            header: 'Email',
            sortable: true,
            width: 220,
            menuDisabled: true
        }, {
            dataIndex: 'DutyStation',
            header: 'Duty Station',
            sortable: true,
            width: 220,
            menuDisabled: true
        }, {
            dataIndex: 'Region',
            header: 'Region',
            sortable: true,
            width: 220,
            menuDisabled: true
        }, {
            dataIndex: 'BankAccountNo',
            header: 'Bank Acc. No',
            sortable: true,
            width: 220,
            menuDisabled: true
        },  {
            dataIndex: 'EmploymentDate',
            header: 'Employment Date',
            sortable: true,
            width: 220,
            renderer: Ext.util.Format.dateRenderer('d-M-Y'),
            menuDisabled: true
        }, {
            dataIndex: 'SalaryETB',
            header: 'Salary ETB',
            sortable: true,
            width: 220,
            hidden: false,
            menuDisabled: true
        }, {
            dataIndex: 'SalaryGBP',
            header: 'Salary GBP',
            sortable: true,
            width: 220,
            hidden: false,
            menuDisabled: true
        },{
            dataIndex: 'ContractEndDate',
            header: 'ContractEndDate',
            sortable: true,
            width: 220,
            hidden: false,
            menuDisabled: true
        },{
            dataIndex: 'IsActive',
            header: 'Is Active',
            sortable: true,
            width: 250,
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                if (value)
                    return '<img src="Content/images/app/yes.png"/>';
                else
                    return '<img src="Content/images/app/no.png"/>';
            }

        },  {
            dataIndex: 'Currency',
            header: 'Currency',
            sortable: true,
            width: 220,
            hidden: true,
            menuDisabled: true
        } ]
    }, config));
};
Ext.extend(Ext.core.finance.ux.PayrollEmployees.Grid, Ext.grid.EditorGridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ mode: 'get' }) };
        var TransGrid = Ext.getCmp('PayrollEmployees-grid');
        this.tbar = [new Ext.ux.Exporter.Button({
            store: TransGrid.getStore(),
            exportFunction: 'exportStore',
            id: 'btn-employee-export',
            text: "Export to Excel",
            //iconCls: 'icon-Excel',
            listeners: {
                click: function () {
                    var grid = Ext.getCmp('PayrollEmployees-grid');
                    var columns = [];
                    grid.colModel.config.forEach(function (col) {
                        if (!col.hidden) {
                            columns.push(new Ext.data.Field(col.dataIndex));
                        }
                    });

                    Ext.getCmp('btn-employee-export').constructor({
                        store: grid.getStore(),
                        exportFunction: 'exportStore',
                        columns: columns,
                        text: "Export to Excel",
                        //iconCls: 'icon-Excel',
                        title: 'Employees List'
                    });
                }
            }
        })];
        this.bbar = new Ext.PagingToolbar({
            id: 'PayrollEmployees-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.core.finance.ux.PayrollEmployees.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getStore().load({
            params: { start: 0, limit: this.pageSize }
        });
        Ext.core.finance.ux.PayrollEmployees.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('PayrollEmployees-grid', Ext.core.finance.ux.PayrollEmployees.Grid);

/**
* @desc      Employee panel
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @version   $Id: PayrollEmployees.js, 0.1
* @namespace Ext.core.finance.ux.PayrollEmployees
* @class     Ext.core.finance.ux.PayrollEmployees.Panel
* @extends   Ext.Panel
*/
Ext.core.finance.ux.PayrollEmployees.Panel = function (config) {
    Ext.core.finance.ux.PayrollEmployees.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false,
        tbar: {
            xtype: 'toolbar',
            items: [{
                xtype: 'button',
                text: 'Add',
                id: 'addEmployees',
                iconCls: 'icon-add',
                handler: this.onAddClick,
                disabled: !Ext.core.finance.ux.Reception.getPermission('Employees', 'CanAdd')
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Edit',
                id: 'editEmployees',
                iconCls: 'icon-edit',
                handler: this.onEditClick,
                disabled: !Ext.core.finance.ux.Reception.getPermission('Employees', 'CanEdit')
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Deactivate',
                id: 'deActivateEmployee',
                iconCls: 'icon-DeActive',
                handler: this.onDeactivateClick,
                disabled: !Ext.core.finance.ux.Reception.getPermission('Employees', 'CanEdit')
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Terminate Employee',
                id: 'terminateEmployee',
                iconCls: 'icon-exclamation',
                handler: this.onTerminateClick,
                disabled: !Ext.core.finance.ux.Reception.getPermission('Employees', 'CanEdit')
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Print List',
                id: 'printEmployees',
                iconCls: 'icon-Print',
                handler: this.onEmployeesPrintClick

            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Change Salary/Position',
                id: 'changeSalary',
                iconCls: 'icon-Money',
                handler: this.onChangeSalaryPosition,
                disabled: !Ext.core.finance.ux.Reception.getPermission('Employees', 'CanEdit')
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Batch Salary Change',
                id: 'batchSalaryChange',
                iconCls: 'icon-coins',
                handler: this.onBatchSalaryChange,
                disabled: !Ext.core.finance.ux.Reception.getPermission('Employees', 'CanEdit')
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Change Currency',
                id: 'btnCurrencyChanger',
                iconCls: 'icon-cheque',
                handler: this.onCurrencyChanger,
                disabled: !Ext.core.finance.ux.Reception.getPermission('Employees', 'CanEdit')
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Contract Date',
                id: 'btnContractDate',
                iconCls: 'icon-Calendar',
                handler: this.onContractChanger,
                disabled: !Ext.core.finance.ux.Reception.getPermission('Employees', 'CanEdit')
            }, {
                xtype: 'tbfill'
            }, {
                id: 'txtSearchEmployee',
                xtype: 'textfield',
                emptyText: 'Search',
                submitEmptyText: false,
                enableKeyEvents: true,
                style: {
                    borderRadius: '5px',
                    padding: '0 10px',
                    width: '179px'
                },
                listeners: {
                    specialkey: function (field, e) {
                        if (e.getKey() == e.ENTER) {
                            var empGrid = Ext.getCmp('PayrollEmployees-grid');
                            empGrid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue() });
                            empGrid.store.load({ params: { start: 0, limit: empGrid.pageSize} });
                        }
                    },
                    keyup: function (field) {
                        if (field.getValue() == '') {
                            var empGrid = Ext.getCmp('PayrollEmployees-grid');
                            empGrid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue() });
                            empGrid.store.load({ params: { start: 0, limit: empGrid.pageSize} });
                        }
                    }
                }
            }]
        }
    }, config));
}
var excRate = 44.50;
var prefix = '';
Ext.extend(Ext.core.finance.ux.PayrollEmployees.Panel, Ext.Panel, {
    initComponent: function () {
        this.items = [{
            xtype: 'PayrollEmployees-grid',
            id: 'PayrollEmployees-grid'
        }];
        Ext.core.finance.ux.PayrollEmployees.Panel.superclass.initComponent.apply(this, arguments);
    },
    onUpdateIdClick: function () {
        Ext.Ajax.timeout = 6000000;
        window.Tsa.UpdateEmpIds(function (response) {
            //if (response.result.success == true) {

                Ext.MessageBox.alert('Edit Id no','Success!');
            //}
        });

    },
    onAddClick: function () {

        window.Tsa.GetExchangeRateAndPrefix(function (response) {
            if (response.success == true) {

                excRate = response.ExchangeRate;
                prefix = response.IdPrefix;
                new Ext.core.finance.ux.PayrollEmployees.Window({
                    PayrollItemsId: 0,
                    ExchangeRate: excRate,
                    IdPrefix : prefix,
                    title: 'Add Employee',
                    SetDisabled: false
                }).show();
            }
        });

    },
    onEditClick: function () {
        Tsa.GetExchangeRateAndPrefix(function (response) {
            if (response.success == true) {
                excRate = response.ExchangeRate;
                var grid = Ext.getCmp('PayrollEmployees-grid');
                if (!grid.getSelectionModel().hasSelection()) return;
                var id = grid.getSelectionModel().getSelected().get('Id');
                new Ext.core.finance.ux.PayrollEmployees.Window({
                    PayrollItemsId: id,
                    ExchangeRate: excRate,
                    IdPrefix: prefix,
                    title: 'Edit Employee',
                    SetDisabled: true
                }).show();
            }

        });
    },
    onTerminateClick: function () {
        var grid = Ext.getCmp('PayrollEmployees-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');
        new Ext.core.finance.ux.payrollEmployeeTermination.Window({
            title: 'Terminate Employee',
            EmployeeId: id
        }).show();
    },
    onChangeSalaryPosition: function () {
     
        window.Tsa.GetExchangeRateAndPrefix(function (response) {
            if (response.success == true) {
                excRate = response.ExchangeRate;
                var grid = Ext.getCmp('PayrollEmployees-grid');
                if (!grid.getSelectionModel().hasSelection()) return;
                var id = grid.getSelectionModel().getSelected().get('Id');
                var position = grid.getSelectionModel().getSelected().get('Position');
                var salary = grid.getSelectionModel().getSelected().get('SalaryETB');
                var currency = grid.getSelectionModel().getSelected().get('Currency');
                new Ext.core.finance.ux.salaryPositionChange.Window({
                    title: 'Change Salary/Position',
                    EmployeeId: id,
                    ExchangeRate: excRate,
                    Position: position,
                    Salary:salary,
                    Currency : currency
                }).show();
            }

        });
    },
    onBatchSalaryChange: function () {

        new Ext.core.finance.ux.batchSalaryChange.Window({
            title: 'Batch Salary Change'
        }).show();

    },
    onCurrencyChanger: function () {
        new Ext.core.finance.ux.batchCurrencyChanger.Window({
            title: 'Batch Currency Changer'
        }).show();

    }, onContractChanger: function () {
        new Ext.core.finance.ux.batchContractEndDateChanger.Window({
            title: 'Batch Contract End Date'
        }).show();

    },
    onDeactivateClick: function () {
        var grid = Ext.getCmp('PayrollEmployees-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');
        var btn = Ext.getCmp('deActivateEmployee').getText();
        window.PayrollEmployees.ActivateDeactivate(id, btn, function (result, response) {
            if (result.success) {
                Ext.getCmp('PayrollEmployees-paging').doRefresh();
                var grid = Ext.getCmp('PayrollEmployees-grid');
                var isActive = grid.getSelectionModel().getSelected().get('IsActive');
                var btn = Ext.getCmp('deActivateEmployee');

                if (isActive) {

                    btn.setText('Deactivate');
                    
                }
                else {
                    btn.setText('Activate');
                   
                }
                
            }
        });
    },
    onEmployeesPrintClick: function () {
        var grid = Ext.getCmp('PayrollEmployees-grid');
        Ext.ux.GridPrinter.stylesheetPath = '/Content/css/print.css';
        Ext.ux.GridPrinter.print(grid);
    }

});
Ext.reg('payrollEmployees-panel', Ext.core.finance.ux.PayrollEmployees.Panel);