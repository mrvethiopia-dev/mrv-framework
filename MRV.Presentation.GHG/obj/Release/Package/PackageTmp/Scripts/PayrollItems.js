Ext.ns('Ext.core.finance.ux.PayrollItems');
/**
* @desc      Payroll Item registration form
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.PayrollItems
* @class     Ext.core.finance.ux.PayrollItems.Form
* @extends   Ext.form.FormPanel
*/
Ext.core.finance.ux.PayrollItems.Form = function (config) {
    Ext.core.finance.ux.PayrollItems.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: PayrollItems.Get,
            submit: PayrollItems.Save
        },
        paramOrder: ['Id'],
        defaults: {
            labelStyle: 'text-align:left;',
            msgTarget: 'side'
        },
        id: 'PayrollItems-form',
        padding: 5,
        labelWidth: 120,
        autoHeight: true,
        border: false,
        isFormLoad: false,
        frame: true,
        items: [
        {
            layout: 'column',
            items: [
                {
                    columnWidth: .50,
                    defaults: {
                        labelStyle: 'text-align:left;',
                        msgTarget: 'side'
                    },
                    border: false,
                    layout: 'form',
                    items: [
                        {
                            name: 'Id',

                            xtype: 'hidden'
                        }, {
                            name: 'PItemName',
                            xtype: 'textfield',
                            fieldLabel: 'Name',
                            anchor: '99%',
                            allowBlank: false
                        }, {
                            name: 'PItemAmount',
                            xtype: 'numberfield',
                            anchor: '99%',
                            fieldLabel: 'Amount',
                            value: '0.00 ',
                            allowBlank: false
                        }, {
                            hiddenName: 'PItemApplicationType',
                            xtype: 'combo',
                            fieldLabel: 'Application Type',
                            anchor: '99%',
                            triggerAction: 'all',
                            mode: 'local',
                            editable: true,
                            typeAhead: true,
                            forceSelection: true,
                            emptyText: '---Select---',
                            allowBlank: false,
                            store: new Ext.data.ArrayStore({
                                fields: ['Id', 'Name'],
                                data: [[1, 'Fixed Amount'], [2, 'Percentage Of Basic Salary']]
                            }),
                            valueField: 'Name',
                            displayField: 'Name'
                        }, {
                            name: 'PItemIsAddition',
                            xtype: 'checkbox',
                            checked: false,
                            fieldLabel: 'Is Addition',
                            listeners: {
                                scope: this,
                                check: function(Checkbox, checked) {

                                    var form = Ext.getCmp('PayrollItems-form').getForm();
                                    var tAmount = form.findField('PItemInitialTaxableAmount');
                                    if (checked) {
                                        form.findField('PItemIsTaxed').setDisabled(false);
                                        tAmount.show();
                                    } else {
                                        form.findField('PItemIsTaxed').setDisabled(true);
                                        tAmount.reset();
                                        tAmount.hide();
                                    }
                                }
                            }
                        }, {
                            name: 'PItemIsTaxed',
                            xtype: 'checkbox',
                            disabled: true,
                            checked: false,
                            fieldLabel: 'Taxable'
                        }, {
                            name: 'PItemInitialTaxableAmount',
                            xtype: 'numberfield',
                            fieldLabel: 'Taxable After',
                            hidden: true,
                            anchor: '99%',
                            allowBlank: true
                        }
                    ]
                }, {
                    columnWidth: .50,
                    defaults: {
                        labelStyle: 'text-align:right;',
                        msgTarget: 'side'
                    },
                    border: true,
                    layout: 'form',
                    items: [
                        {
                            name: 'AccountId',
                            xtype: 'hidden'
                        }, {
                            xtype: 'compositefield',
                            fieldLabel: 'SL Account',
                            defaults: { flex: 1 },
                            items: [
                                {
                                    xtype: 'textfield',
                                    name: 'SLAccount',
                                    fieldLabel: 'SL Account',
                                    anchor: '90%',
                                    allowBlank: false,
                                    disabled: true
                                },
                                {
                                    xtype: 'button',
                                    id: 'findSLAccount',
                                    iconCls: 'icon-filter',
                                    width: 25,
                                    handler: function() {
                                        var form = Ext.getCmp('PayrollItems-form').getForm();
                                        new Ext.core.finance.ux.accountPicker.Window({
                                            find: 'SLAccount',
                                            controlAccountId: '',
                                            parentForm: form,
                                            controlIdField: 'AccountId',
                                            controlNameField: 'SLAccount'
                                        }).show();
                                    }
                                }
                            ]

                        },


                        {
                            name: 'DepartmentId',
                            xtype: 'hidden'
                        }, {
                            xtype: 'compositefield',
                            fieldLabel: 'Dept',
                            hidden: true,
                            defaults: { flex: 1 },
                            items: [
                                {
                                    xtype: 'textfield',
                                    name: 'DepartmentName',
                                    fieldLabel: 'Department',
                                    anchor: '90%',
                                    allowBlank: false,
                                    disabled: true
                                },
                                {
                                    xtype: 'button',
                                    id: 'findDept',
                                    iconCls: 'icon-filter',
                                    width: 25,
                                    handler: function () {
                                        var form = Ext.getCmp('PayrollItems-form').getForm();
                                        new Ext.core.finance.ux.departmentPicker.Window({
                                            find: 'Department',
                                            controlAccountId: '',
                                            parentForm: form,
                                            controlIdField: 'DepartmentId',
                                            controlNameField: 'DepartmentName'
                                        }).show();
                                    }
                                }
                            ]

                        },





                        {
                            name: 'IsDependentOnWorkingDays',
                            xtype: 'checkbox',
                            checked: false,
                            fieldLabel: 'Attendance Dependent'

                        }, {
                            name: 'ApplyForAllEmployees',
                            xtype: 'checkbox',
                            checked: false,
                            fieldLabel: 'Apply For All Employees'
                        }, {
                            name: 'IsActive',
                            xtype: 'checkbox',
                            checked: true,
                            hidden: true,
                            fieldLabel: 'Is Active'
                        }, {
                            name: 'IgnoreOnPayrollGen',
                            xtype: 'checkbox',
                            checked: false,
                            hidden: false,
                            fieldLabel: 'Ignore On Payroll Generation'
                        }, {
                            name: 'IsDisplayedOnSettings',
                            xtype: 'checkbox',
                            checked: true,
                            hidden: false,
                            fieldLabel: 'Visible on Settings'
                        }, {
                            name: 'HasEmployerSide',
                            xtype: 'checkbox',
                            checked: false,
                            hidden: false,
                            fieldLabel: 'Has Employer Side',
                            listeners: {

                            }
                        }
                    ]

                }
            ]
        }, {
            id: 'HasEmployerSide1',
            xtype: 'fieldset',
            region: 'north',
            title: 'Employer Side Details',
            checkboxToggle: true,
            collapsed: false,
            bodystyle: 'padding-0px',
            labelstyle: 'text-align:right;',
            autoWidth: true,
            listeners: {
                expand: function (p) {
                    var form = Ext.getCmp('PayrollItems-form').getForm();
                    var t = form.findField('EmplrPItemName');
                    var q = form.findField('EmplrPItemAmount');
                    var r = form.findField('EmplrPItemApplicationType');

                    t.enable();
                    q.enable();
                    r.enable();
                },
                collapse: function (j) {
                    var form = Ext.getCmp('PayrollItems-form').getForm();
                    var t = form.findField('EmplrPItemName');
                    var p = form.findField('EmplrPItemAmount');
                    var r = form.findField('EmplrPItemApplicationType');

                    t.disable();
                    p.disable();
                    r.disable();
                }
            },
            items: [{
                layout: 'column',
                items: [{
                    columnWidth: .53,
                    defaults: {
                        labelStyle: 'text-align:right;',
                        msgTarget: 'side'
                    },
                    border: false,
                    layout: 'form',
                    items: [{
                        name: 'ChildId',
                        xtype: 'textfield',
                        hidden: true
                    }, {
                        name: 'EmplrPItemName',
                        xtype: 'textfield',
                        fieldLabel: 'Employer Side Name',
                        anchor: '100%',
                        disabled: false,
                        hidden: false,
                        allowBlank: false
                    }, {
                        name: 'EmplrPItemAmount',
                        xtype: 'numberfield',
                        anchor: '100%',
                        fieldLabel: 'Amount',
                        value: '0.00 ',
                        disabled: false,
                        hidden: false,
                        allowBlank: false
                    }, {
                        name: 'EmplrPItemApplicationType',
                        xtype: 'combo',
                        fieldLabel: 'Application Type',
                        anchor: '100%',
                        triggerAction: 'all',
                        mode: 'local',
                        editable: true,
                        disabled: false,
                        hidden: false,
                        typeAhead: true,
                        forceSelection: true,
                        emptyText: '---Select---',
                        allowBlank: false,
                        store: new Ext.data.ArrayStore({
                            fields: ['Id', 'Name'],
                            data: [[1, 'Fixed Amount'], [2, 'Percentage Of Basic Salary']]
                        }),
                        valueField: 'Name', displayField: 'Name'
                    }]
                }]
            }]
        }]
    }, config));
}
Ext.extend(Ext.core.finance.ux.PayrollItems.Form, Ext.form.FormPanel);
Ext.reg('PayrollItems-form', Ext.core.finance.ux.PayrollItems.Form);
var colapsed = true;
var PItemsSelModel = new Ext.grid.CheckboxSelectionModel();
/**
* @desc      Payroll Item registration form host window
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.PayrollItems
* @class     Ext.core.finance.ux.PayrollItems.Window
* @extends   Ext.Window
*/
Ext.core.finance.ux.PayrollItems.Window = function (config) {
    Ext.core.finance.ux.PayrollItems.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        width: 700,
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;',
        listeners: {
            show: function () {
                this.form.getForm().findField('Id').setValue(this.PayrollItemsId);
                
                if (this.PayrollItemsId != '') {
                    this.form.load({ params: { Id: this.PayrollItemsId} });
                }
            },
            scope: this
        }
    }, config));
}
Ext.extend(Ext.core.finance.ux.PayrollItems.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.core.finance.ux.PayrollItems.Form();
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

        Ext.core.finance.ux.PayrollItems.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {

        if (!this.form.getForm().isValid()) return;
        Ext.Ajax.timeout = 6000000;
        this.form.getForm().submit({
            waitMsg: 'Please wait...',
            success: function () {
                Ext.getCmp('PayrollItems-form').getForm().reset();
                Ext.getCmp('PayrollItems-paging').doRefresh();
            }
        });
    },
    onClose: function () {
        this.close();
    }
});
Ext.reg('PayrollItems-window', Ext.core.finance.ux.PayrollItems.Window);

/**
* @desc      Payroll Items grid
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.PayrollItems
* @class     Ext.core.finance.ux.PayrollItems.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.core.finance.ux.PayrollItems.Grid = function (config) {
    Ext.core.finance.ux.PayrollItems.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: PayrollItems.GetAllUserPayrollItems,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Code',
                direction: 'ASC'
            },
            fields: ['Id', 'PItemName', 'PItemIsAddition', 'PItemIsTaxed', 'PItemApplicationType', 'PItemInitialTaxableAmount', 'PItemAmount', 'IsReadOnly', 'IsActive', 'CreatedAt'],
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
        id: 'PayrollItems-grid',
        searchCriteria: {},
        pageSize: 50,
        title: 'Payroll Items List',
        //height: 600,
        stripeRows: true,
        columnLines: true,
        border: false,
        sm: PItemsSelModel,
        viewConfig: {
            forceFit: true,
            autoFill: true
        },
        listeners: {
            rowClick: function () {
                if (!this.getSelectionModel().hasSelection()) return;
                var id = this.getSelectionModel().getSelected().get('Id');
                var isActive = this.getSelectionModel().getSelected().get('IsActive');
                var btn = Ext.getCmp('DeactivatePayrollItems');

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
                    var hasEditPermission = Ext.core.finance.ux.Reception.getPermission('Additions and Deductions', 'CanEdit');
                    if (hasEditPermission) {
                        new Ext.core.finance.ux.PayrollItems.Window({
                            PayrollItemsId: id,
                            title: 'Edit Payroll Items'
                        }).show();
                    }
                }

            }
        },
        columns: [
        PItemsSelModel, {
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
        }, {
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
        }, {
            dataIndex: 'IsReadOnly',
            header: 'Is Read Only',
            sortable: true,
            hidden: true,
            width: 250,
            menuDisabled: true
        }, {
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
Ext.extend(Ext.core.finance.ux.PayrollItems.Grid, Ext.grid.EditorGridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ mode: 'get' }) };
        this.tbar = [];
        this.bbar = new Ext.PagingToolbar({
            id: 'PayrollItems-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.core.finance.ux.PayrollItems.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getStore().load({
            params: { start: 0, limit: this.pageSize }
        });
        Ext.core.finance.ux.PayrollItems.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('PayrollItems-grid', Ext.core.finance.ux.PayrollItems.Grid);

/**
* @desc      Payroll Items panel
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @version   $Id: PayrollItems.js, 0.1
* @namespace Ext.core.finance.ux.PayrollItems
* @class     Ext.core.finance.ux.PayrollItems.Panel
* @extends   Ext.Panel
*/
Ext.core.finance.ux.PayrollItems.Panel = function (config) {
    Ext.core.finance.ux.PayrollItems.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false,
        tbar: {
            xtype: 'toolbar',
            items: [{
                xtype: 'button',
                text: 'Add',
                id: 'addPayrollItems',
                iconCls: 'icon-add',
                handler: this.onAddClick,
                disabled: !Ext.core.finance.ux.Reception.getPermission('Additions and Deductions', 'CanAdd')

            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Edit',
                id: 'editPayrollItems',
                iconCls: 'icon-edit',
                handler: this.onEditClick,
                disabled: !Ext.core.finance.ux.Reception.getPermission('Additions and Deductions', 'CanEdit')
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Delete',
                id: 'deletepayrollTaxRate',
                iconCls: 'icon-delete',
                handler: this.onDeleteClick,
                disabled: !Ext.core.finance.ux.Reception.getPermission('Additions and Deductions', 'CanDelete')
            }, {
                xtype: 'button',
                text: 'Deactivate',
                id: 'DeactivatePayrollItems',
                iconCls: 'icon-exclamation',
                disabled: 'true',
                handler: this.onDeactivateClick
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Print List',
                id: 'printPayrollItems',
                iconCls: 'icon-Print',
                handler: this.onPayrollItemsPrintClick

            }]
        }
    }, config));
}
Ext.extend(Ext.core.finance.ux.PayrollItems.Panel, Ext.Panel, {
    initComponent: function () {
        this.items = [{
            xtype: 'PayrollItems-grid',
            id: 'PayrollItems-grid'
        }];
        Ext.core.finance.ux.PayrollItems.Panel.superclass.initComponent.apply(this, arguments);
    },

    onAddClick: function () {
        new Ext.core.finance.ux.PayrollItems.Window({
            PayrollItemsId: 0,
            title: 'Add Payroll Items'
        }).show();
    },
    onEditClick: function () {
        var grid = Ext.getCmp('PayrollItems-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');
        new Ext.core.finance.ux.PayrollItems.Window({
            PayrollItemsId: id,
            title: 'Edit Payroll Items'
        }).show();
    },
    onDeactivateClick: function () {
        var grid = Ext.getCmp('PayrollItems-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');
        var btn = Ext.getCmp('DeactivatePayrollItems').getText();
        PayrollItems.ActivateDeactivate(id, btn, function (result, response) {
            if (result.success) {
                Ext.getCmp('PayrollItems-paging').doRefresh();
                //Ext.MessageBox.alert('Employee Payroll Item Attachment', 'Attachment has been completed successfully.');
            }
        });
    },
    onPayrollItemsPrintClick: function () {
        var grid = Ext.getCmp('PayrollItems-grid');
        Ext.ux.GridPrinter.stylesheetPath = '/Content/css/print.css';
        Ext.ux.GridPrinter.print(grid);
    }
});
Ext.reg('payrollitems-panel', Ext.core.finance.ux.PayrollItems.Panel);