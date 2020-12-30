Ext.ns('Ext.core.finance.ux.PayrollEmployees');
/**
* @desc      Payroll Item registration form
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
                columnWidth: .440,
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
                    allowBlank: false
                },{
                    name: 'FirstName',
                    xtype: 'textfield',
                    fieldLabel: 'FirstName',
                    anchor: '90%',
                    allowBlank: false
                }, {
                    name: 'MiddleName',
                    xtype: 'textfield',
                    fieldLabel: 'MiddleName',
                    anchor: '90%',
                    allowBlank: false
                }, {
                    name: 'LastName',
                    xtype: 'textfield',
                    fieldLabel: 'LastName',
                    anchor: '90%',
                    allowBlank: false
                }, {
                    name: 'Sex',
                    xtype: 'textfield',
                    fieldLabel: 'Sex',
                    anchor: '90%',
                    allowBlank: false
                }, {
                    name: 'Salary',
                    xtype: 'numberfield',
                    fieldLabel: 'Salary',
                    anchor: '90%',
                    allowBlank: false
                }, {
                    name: 'EmploymentDate',
                    xtype: 'datefield',
                    fieldLabel: 'EmploymentDate',
                    anchor: '90%',
                    allowBlank: false
                }, {
                    name: 'Nationality',
                    xtype: 'textfield',
                    fieldLabel: 'Nationality',
                    anchor: '90%',
                    allowBlank: false
                }, {
                    name: 'IsPermanent',
                    xtype: 'checkbox',
                    disabled: true,
                    checked: false,
                    fieldLabel: 'IsPermanent'
                }]
            }, {
                columnWidth: .460,
                defaults: {

                    labelStyle: 'text-align:left;',
                    msgTarget: 'side'
                },
                border: true,
                layout: 'form',
                items: [{
                    hiddenName: 'PositionId',
                    xtype: 'combo',
                    fieldLabel: 'Position',
                    anchor: '90%',
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
                    anchor: '90%',
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
                    anchor: '90%',
                    triggerAction: 'all',
                    mode: 'local',
                    editable: true,
                    typeAhead: true,
                    forceSelection: true,
                    emptyText: '---Select Account---',
                    allowBlank: false,
                    store: new Ext.data.DirectStore({
                        reader: new Ext.data.JsonReader({
                            successProperty: 'success',
                            idProperty: 'Id',
                            root: 'data',
                            fields: ['Id', 'Name']
                        }),
                        autoLoad: true,
                        api: { read: Tsa.GetAccounts }
                    }),
                    valueField: 'Id', displayField: 'Name'
                }, {
                    hiddenName: 'BankId',
                    xtype: 'combo',
                    fieldLabel: 'Bank',
                    anchor: '90%',
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
                    valueField: 'Id', displayField: 'Name'
                }, {
                    name: 'BankAccountNo',
                    xtype: 'textfield',
                    fieldLabel: 'Bank Account No',
                    anchor: '90%',
                    allowBlank: false
                }, {
                    hiddenName: 'WoredaId',
                    xtype: 'combo',
                    fieldLabel: 'Woreda',
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
                            fields: ['Id', 'Name']
                        }),
                        autoLoad: true,
                        api: { read: Tsa.GetWoreda }
                    }),
                    valueField: 'Id', displayField: 'Name'
                }, {
                    name: 'IsUnderProbation',
                    xtype: 'checkbox',
                    checked: true,
                    fieldLabel: 'Is Under Probation'
                }, {
                    name: 'IsTerminated',
                    xtype: 'checkbox',
                    checked: false,
                    fieldLabel: 'Is Terminated',
                    
                }]

            }]

        }, {
            name: 'Remark',
            xtype: 'textarea',
            checked: false,
            fieldLabel: 'Remark',
            width: 500
        }]
    }, config));
}
Ext.extend(Ext.core.finance.ux.PayrollEmployees.Form, Ext.form.FormPanel);
Ext.reg('PayrollEmployees-form', Ext.core.finance.ux.PayrollEmployees.Form);

var selModel = new Ext.grid.CheckboxSelectionModel();
/**
* @desc      Payroll Item registration form host window
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
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;',
        listeners: {
            show: function () {
                this.form.getForm().findField('Id').setValue(this.PayrollEmployeesId);
                if (this.PayrollEmployeesId != '') {
                    this.form.load({ params: { Id: this.PayrollEmployeesId} });
                }
            },
            scope: this
        }
    }, config));
}
Ext.extend(Ext.core.finance.ux.PayrollEmployees.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.core.finance.ux.PayrollEmployees.Form();
        this.Employees = [this.form];
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
        this.form.getForm().submit({
            waitMsg: 'Please wait...',
            success: function () {
                Ext.getCmp('PayrollEmployees-form').getForm().reset();
                Ext.getCmp('PayrollEmployees-paging').doRefresh();
            }
        });
    },
    onClose: function () {
        this.close();
    }
});
Ext.reg('PayrollEmployees-window', Ext.core.finance.ux.PayrollEmployees.Window);

/**
* @desc      Payroll Employees grid
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
            fields: ['Id', 'PItemName', 'PItemIsAddition', 'PItemIsTaxed', 'PItemApplicationType', 'PItemInitialTaxableAmount'],
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
        pageSize: 50,
        //height: 600,
        stripeRows: true,
        columnLines: true,
        border: false,
        sm: selModel,
        viewConfig: {
            forceFit: true,
            autoFill: true
        },
        listeners: {
            rowClick: function () {
                if (!this.getSelectionModel().hasSelection()) return;
                var id = this.getSelectionModel().getSelected().get('Id');
                
            },
            scope: this
        },
        columns: [
        selModel, {
            dataIndex: 'Id',
            header: 'Id',
            sortable: true,
            hidden: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'PItemName',
            header: 'Payroll Item Name',
            sortable: true,
            width: 220,
            menuDisabled: false
        },{
            dataIndex: 'PItemIsAddition',
            header: 'Is Addition',
            sortable: true,
            width: 200,
            menuDisabled: true
        }, {
            dataIndex: 'PItemIsTaxed',
            header: 'Is Taxed',
            sortable: true,
            width: 220,
            menuDisabled: true
        }, {
            dataIndex: 'PItemApplicationType',
            header: 'Application Type',
            sortable: true,
            width: 220,
            menuDisabled: true
        }, {
            dataIndex: 'PItemAmount',
            header: ' Payroll Item Amount',
            sortable: true,
            width: 220,
            menuDisabled: true
        }, {
            dataIndex: 'PItemInitialTaxableAmount',
            header: 'Initial Taxable Amount',
            sortable: true,
            width: 220,
            menuDisabled: true
        }]
    }, config));
};
Ext.extend(Ext.core.finance.ux.PayrollEmployees.Grid, Ext.grid.EditorGridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ mode: 'get' }) };
        this.tbar = [];
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
* @desc      Payroll Employees panel
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
                id: 'addPayrollEmployees',
                iconCls: 'icon-add',
                handler: this.onAddClick
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Edit',
                id: 'editPayrollEmployees',
                iconCls: 'icon-edit',                
                handler: this.onEditClick
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Deactivate',
                id: 'DeactivatePayrollEmployees',
                iconCls: 'icon-exclamation',
                disabled:'true',
                handler: this.onDeactivateClick
            }]
        }
    }, config));
}
Ext.extend(Ext.core.finance.ux.PayrollEmployees.Panel, Ext.Panel, {
    initComponent: function () {
        this.Employees = [{
            xtype: 'PayrollEmployees-grid',
            id: 'PayrollEmployees-grid'
        }];
        Ext.core.finance.ux.PayrollEmployees.Panel.superclass.initComponent.apply(this, arguments);
    },

    onAddClick: function () {
        new Ext.core.finance.ux.PayrollEmployees.Window({
            PayrollEmployeesId: 0,
            title: 'Add Payroll Employees'
        }).show();
    },
    onEditClick: function () {
        var grid = Ext.getCmp('PayrollEmployees-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');
        new Ext.core.finance.ux.PayrollEmployees.Window({
            PayrollEmployeesId: id,
            title: 'Edit Payroll Employees'
        }).show();
    },
    onDeactivateClick: function () {
        var grid = Ext.getCmp('PayrollEmployees-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');
        var btn = Ext.getCmp('DeactivatePayrollEmployees').getText();
        PayrollEmployees.ActivateDeactivate(id, btn, function (result, response) {
            if (result.success) {
                Ext.getCmp('PayrollEmployees-paging').doRefresh();
                //Ext.MessageBox.alert('Employee Payroll Item Attachment', 'Attachment has been completed successfully.');
            }
        });
    }
});
Ext.reg('payrollEmployees-panel', Ext.core.finance.ux.PayrollEmployees.Panel);