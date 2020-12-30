Ext.ns('Ext.core.finance.ux.attachPayrollItemsDetail');
/***
* @desc      attachPayrollItemsDetail registration form
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date     June 13, 2013
* @namespace Ext.core.finance.ux.attachPayrollItemsDetail
* @class     Ext.core.finance.ux.attachPayrollItemsDetail.Form
* @extends   Ext.form.FormPanel
*/
Ext.core.finance.ux.attachPayrollItemsDetail.Form = function (config) {
    Ext.core.finance.ux.attachPayrollItemsDetail.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: PayrollEmployeePayrollItems.GetDetailByPItemId,
            submit: PayrollItems.Save
        },
        paramOrder: ['Id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'attachPayrollItemsDetail-form',
        padding: 5,
        labelWidth: 100,
        autoHeight: true,
        border: false,

        baseCls: 'x-plain',
        items: []
    }, config));
};
Ext.extend(Ext.core.finance.ux.attachPayrollItemsDetail.Form, Ext.form.FormPanel);
Ext.reg('attachPayrollItemsDetail-form', Ext.core.finance.ux.attachPayrollItemsDetail.Form);

/**
* @desc      Employee Detail registration form host window
* @author   Dawit Kiros
* @copyright (c) 2014, LIFT
* @date     June 13, 2013
* @namespace Ext.core.finance.ux.attachPayrollItemsDetail
* @class     Ext.core.finance.ux.attachPayrollItemsDetail.Window
* @extends   Ext.Window
*/



var AttchDetailSelModel = new Ext.grid.CheckboxSelectionModel();
var selModelAttDetails = new Ext.grid.CheckboxSelectionModel();
function render_date(val) {
    val = Ext.util.Format.date(val, 'm/d/Y');
    return val;
}

/**
* @desc      Employee Detail grid
* @author   Dawit Kiros
* @copyright (c) 2014, LIFT
* @date     June 13, 2013
* @namespace Ext.core.finance.ux.attachPayrollItemsDetail
* @class     Ext.core.finance.ux.attachPayrollItemsDetail.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.core.finance.ux.attachPayrollItemsDetail.Grid = function (config) {
    Ext.core.finance.ux.attachPayrollItemsDetail.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: PayrollEmployeePayrollItems.GetDetailByPItemId,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|Id',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'ASC'
            },
            fields: ['Id', 'IdentityNo', 'FirstName', 'MiddleName', 'LastName', 'SalaryETB', 'ApplyAlways', 'ApplicableFrom', 'ApplicableTo', 'NewAmount','Department','DeptId', 'EmptyCol'],
            remoteSort: false,
            listeners: {
                beforeLoad: function () {
                    Ext.getCmp('attachPayrollItemsDetail-grid').body.mask('Loading...', 'x-mask-loading');
                },
                load: function () {
                    var grid = Ext.getCmp('attachPayrollItemsDetail-grid');
                    //var store = grid.getStore();

                    grid.body.unmask();
                },
                loadException: function () {
                    Ext.getCmp('attachPayrollItemsDetail-grid').body.unmask();
                },
                remove: function (store) {
                    var grid = Ext.getCmp('attachPayrollItemsDetail-grid');

                },
                scope: this
            }
        }),
        id: 'attachPayrollItemsDetail-grid',
        formulationId: 0,
        pageSize: 15,
        stripeRows: true,
        sm: selModelAttDetails,
        border: false,
        columnLines: true,
        clicksToEdit: 1,
        listeners: {
            afteredit: function (e) {
                var record = e.record;
                var grid = Ext.getCmp('attachPayrollItemsDetail-grid');
                var store, cm;
                if (e.field == 'Percentage') {
                    cm = grid.getColumnModel();
                    var salary = record.get('Salary');
                    var percentage = record.get('Percentage');
                    var result = salary * percentage / 100;                    
                    if (percentage != 0) {
                        record.set('NewAmount', result);
                    }
                }
                else if (e.field == 'Department') {
                    cm = grid.getColumnModel();
                    var deptCol = cm.getColumnAt(12);
                    var deptEditor = deptCol.editor;
                    store = deptEditor.store;
                    if (store.data.length == 0) {

                        record.set('Department', '');
                        record.set('DeptId', '');
                    } else {
                        var deptId = store.getById(deptEditor.getValue()).data.Id;
                        record.set('DeptId', deptId);
                        
                    }

                }
            }
        },
        viewConfig: {
            forceFit: true,
            autoFill: true
        },
        columns: [selModelAttDetails, new Ext.erp.ux.grid.PagingRowNumberer({
            width: 35
        }),{
            dataIndex: 'Id',
            header: 'Id',
            sortable: true,
            hidden: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'IdentityNo',
            header: 'Id No.',
            sortable: true,
            width: 220,
            menuDisabled: false
        }, {
            dataIndex: 'FirstName',
            header: 'First Name',
            sortable: true,
            width: 200,
            menuDisabled: true
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
            header: 'Salary (ETB)',
            sortable: true,
            width: 220,
            hidden: false,
            menuDisabled: true
        }, {
            dataIndex: 'ApplyAlways',
            header: 'Apply Always',
            sortable: true,
            width: 100,

            menuDisabled: true,
            xtype: 'combocolumn',
            editor: new Ext.form.ComboBox({

                typeAhead: true,
                editable: false,
                triggerAction: 'all',
                mode: 'local',
                store: new Ext.data.SimpleStore({
                    fields: ['id', 'name'],
                    data: [['1', 'No'], ['2', 'Yes']]
                }),
                valueField: 'name',
                displayField: 'name'
            })
        },
        {
            dataIndex: 'ApplicableFrom',
            header: 'Applicable from',            
            sortable: true,
            width: 250,
            //renderer: Ext.util.Format.dateRenderer('m/d/Y'),
            editor: new Ext.form.DateField({
                format: 'm/d/Y',
                allowBlank: false,
                listeners: {
                    focus: function (field) {
                        field.selectText();
                    }
                }
            })

        }, {
            dataIndex: 'ApplicableTo',
            header: 'Applicable to',
            sortable: true,
            width: 250,
           // renderer: Ext.util.Format.dateRenderer('m/d/Y'),
            editor: new Ext.form.DateField({
                format: 'm/d/Y',
                allowBlank: false,
                listeners: {
                    focus: function (field) {
                        field.selectText();
                    }
                }
            })

        }, {
            dataIndex: 'NewAmount',
            header: 'New Amount',
            sortable: true,
            width: 150,

            menuDisabled: true,
            align: 'right',
            //            renderer: function (v, params, record) {
            //                if (record.data.Percentage == 0)
            //                    return Ext.util.Format.number(v,'0,000.00');
            //                else
            //                    return Ext.util.Format.number(record.data.Percentage * record.data.Salary / 100, '0,000.00');
            //            },
            editor: new Ext.form.NumberField({
                allowBlank: false,
                allowNegative: false,
                listeners: {
                    focus: function (field) {
                        field.selectText();
                    }
                }
            })
        },{
            dataIndex: 'Department',
            header: 'Department',
            sortable: false,
            width: 150,
            menuDisabled: true,
            xtype: 'combocolumn',
            editor: new Ext.form.ComboBox({
                hiddenName: 'Department',
                //typeAhead: false,
               // hideTrigger: false,
                //minChars: 1,
                listWidth: 280,
                triggerAction: 'all',
                mode: 'local',
                //mode: 'remote',
                //tpl: '<tpl for="."><div ext:qtip="{Id}. {Name}" class="x-combo-list-item">' +
                //    '<h3><span>{Code}</span></h3> {Name}</div></tpl>',
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
                valueField: 'Id', displayField: 'Name',
                pageSize: 10
            })
        }, {
            dataIndex: 'DeptId',
            header: 'DeptId',
            sortable: true,
            width: 80,
            hidden: true,
            menuDisabled: true
        }, {
            dataIndex: 'EmptyCol',
            header: '',
            sortable: true,
            width: 30,
            hidden: false,
            menuDisabled: true
        }]
    }, config));
};
Ext.extend(Ext.core.finance.ux.attachPayrollItemsDetail.Grid, Ext.grid.EditorGridPanel, {
    initComponent: function () {
//        this.bbar = new Ext.PagingToolbar({
//            id: 'attachPayrollItemsDetail-paging',
//            store: this.store,
//            displayInfo: true,

//            pageSize: this.pageSize
//        });
//        this.bbar.refresh.hide();
        Ext.core.finance.ux.attachPayrollItemsDetail.Grid.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('attachPayrollItemsDetail-grid', Ext.core.finance.ux.attachPayrollItemsDetail.Grid);


//functions

function Amount_MeasurementUnit(val, x, store) {
    return val + ' ' + store.data.MeasurementUnit;
}

/**
* @desc      Employee Detail panel
* @author   Dawit Kiros
* @copyright (c) 2014, LIFT
* @date     June 13, 2013
* @version   $Id: attachPayrollItemsDetail.js, 0.1
* @namespace Ext.core.finance.ux.attachPayrollItemsDetail
* @class     Ext.core.finance.ux.attachPayrollItemsDetail.Panel
* @extends   Ext.Panel
*/
Ext.core.finance.ux.attachPayrollItemsDetail.Panel = function (config) {
    Ext.core.finance.ux.attachPayrollItemsDetail.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false,
        title: 'Employees',
        //height: 600,
        id: 'detailPanel',
        tbar: {
            xtype: 'toolbar',
            items: [{
                xtype: 'button',
                text: 'Add Employees',
                id: 'addattachPayrollItemsDetail',
                iconCls: 'icon-UserAdd',
                handler: function () {
                    var grid = Ext.getCmp('payrollItemsHeader-grid');
                    if (!grid.getSelectionModel().hasSelection()) {
                        Ext.MessageBox.show({
                            title: 'Select',
                            msg: 'You must select a particular payroll item to add an employee.',
                            buttons: Ext.Msg.OK,
                            icon: Ext.MessageBox.INFO,
                            scope: this
                        });
                        return;
                    }

                    //var grid = Ext.getCmp('payrollItemsHeader-grid');
                    var amount = grid.getSelectionModel().getSelected().get('PItemAmount');
                    var appType = grid.getSelectionModel().getSelected().get('PItemApplicationType');
                    var empWindow = new Ext.core.finance.ux.EmployeeSelection.Window({ Caller: 'PayrollItemsAttachment', PItemAmount: amount, ApplicationType: appType });
                    empWindow.show();
                }
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Remove Selected',
                id: 'editattachPayrollItemsDetail',
                iconCls: 'icon-UserRemove',
                handler: this.onDeleteClick,
                disabled: !Ext.core.finance.ux.Reception.getPermission('Employee Additions/Deductions', 'CanDelete')
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Remove All Employees',
                id: 'RemoveAllattachPayrollItemsDetail',
                iconCls: 'icon-GroupRemove',
                hidden:true,
                handler: this.onRemoveAllClick,
                disabled: !Ext.core.finance.ux.Reception.getPermission('Employee Additions/Deductions', 'CanDelete')
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Applicability',
                id: 'ApplyApplicability',
                iconCls: 'icon-cal',
                handler: this.onApplyApplicability
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Populate Depts',
                id: 'btnPopulateDepts',
                iconCls: 'icon-RowAdd',
                handler: this.onApplyDepts
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Refresh',
                id: 'attchmentRefresh',
                iconCls: 'icon-refresh',
                handler: this.onRefreshClick
            }]
        }
    }, config));
};

Ext.extend(Ext.core.finance.ux.attachPayrollItemsDetail.Panel, Ext.Panel, {
    initComponent: function () {
        this.grid = new Ext.core.finance.ux.attachPayrollItemsDetail.Grid();

        //        var form = new Ext.core.finance.ux.attachPayrollItemsDetail.Form();

        //        var appOptions = form.findField('ApplyApplicability');
        //        if (this.IsShow == 1)
        //            appOptions.hide();
        this.items = [{
            xtype: 'attachPayrollItemsDetail-grid',
            id: 'attachPayrollItemsDetail-grid'
        }];
        Ext.core.finance.ux.attachPayrollItemsDetail.Panel.superclass.initComponent.apply(this, arguments);
    },


    onApplyApplicability: function () {

        var grid = Ext.getCmp('attachPayrollItemsDetail-grid');

        if (!grid.getStore().getCount() > 0) {
            Ext.MessageBox.show({
                title: 'Empty Selection',
                msg: 'You must select employees to apply applicability options.',
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
        new Ext.core.finance.ux.payrollApplicabilityOptions.Window({
            title: 'Add Applicability Options', CallerId: 0
        }).show();
    },
    onApplyDepts: function () {

        var grid = Ext.getCmp('attachPayrollItemsDetail-grid');

        if (!grid.getStore().getCount() > 0) {
            Ext.MessageBox.show({
                title: 'Empty Selection',
                msg: 'You must select employees to apply applicability options.',
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
        new Ext.core.finance.ux.payrollApplicabilityDepartments.Window({
            title: 'Populate Departments', CallerId: 0
        }).show();
    },
    onDeleteClick: function () {
        var grid = Ext.getCmp('attachPayrollItemsDetail-grid');
        var PItemGrid = Ext.getCmp('payrollItemsHeader-grid');
        if (!grid.getSelectionModel().hasSelection()) {
            Ext.MessageBox.show({
                title: 'Select',
                msg: 'You must select an Employee to delete.',
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
        Ext.MessageBox.show({
            title: 'Delete',
            msg: 'Are you sure you want to remove the selected employee?',
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
                        msg: 'Deleting this employee could make other related data invalid. Press Ok to delete, Press Cancel to abort.',
                        buttons: {
                            ok: 'Ok',
                            cancel: 'Cancel'
                        },
                        icon: Ext.MessageBox.WARNING,
                        scope: this,
                        fn: function (btn) {
                            if (btn == 'ok') {
                                var selectionGrid = Ext.getCmp('attachPayrollItemsDetail-grid');
                                var emps = '';
                                if (!selectionGrid.getSelectionModel().hasSelection()) return;
                                var selectedEmployees = selectionGrid.getSelectionModel().getSelections();
                                for (var i = 0; i < selectedEmployees.length; i++) {
                                    emps = emps + ':' + selectedEmployees[i].get('Id');
                                }
                                var EmpId = grid.getSelectionModel().getSelected().get('Id');
                                var PItemId = PItemGrid.getSelectionModel().getSelected().get('Id');
                                Ext.Ajax.timeout = 6000000;
                                window.PayrollEmployeePayrollItems.Delete(emps, PItemId, function (result, response) {

                                    var PItemGrid = Ext.getCmp('payrollItemsHeader-grid');
                                    var id = PItemGrid.getSelectionModel().getSelected().get('Id');
                                    var gridEmployees = Ext.getCmp('attachPayrollItemsDetail-grid');

                                    Ext.MessageBox.show({
                                        title: 'Attachment Deleted',
                                        msg: 'The attachment for the selected employee/s was deleted successfully. Refresh the grid to see the result.',
                                        buttons: Ext.Msg.OK,
                                        icon: Ext.MessageBox.INFO,
                                        scope: this
                                    });

                                }, this);
                            }
                        }
                    });
                }
            }
        });
    },

    onRemoveAllClick: function () {
        var grid = Ext.getCmp('attachPayrollItemsDetail-grid');
        var count = 0;
        var emps = grid.getStore();
        emps.each(function (item) {

            count++;

        });
        var PItemGrid = Ext.getCmp('payrollItemsHeader-grid');
        if (count == 0) {

            return;
        }
        Ext.MessageBox.show({
            title: 'Delete',
            msg: 'Are you sure you want to remove all employees?',
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
                        msg: 'Deleting employees could make other related data invalid. Press Ok to delete, Press Cancel to abort.',
                        buttons: {
                            ok: 'Ok',
                            cancel: 'Cancel'
                        },
                        icon: Ext.MessageBox.WARNING,
                        scope: this,
                        fn: function (btn) {
                            if (btn == 'ok') {
                                
                                var PItemId = PItemGrid.getSelectionModel().getSelected().get('Id');
                                PayrollEmployeePayrollItems.DeleteAll(PItemId, function (result, response) {
                                    
                                    var PItemGrid = Ext.getCmp('payrollItemsHeader-grid');
                                    var id = PItemGrid.getSelectionModel().getSelected().get('Id');
                                    var gridEmployees = Ext.getCmp('attachPayrollItemsDetail-grid');
                                    gridEmployees.getStore().load({
                                        params: {

                                            start: 0,
                                            limit: 10,
                                            sort: '',
                                            dir: '',
                                            Id: id
                                        }
                                    });
                                }, this);
                            }
                        }
                    });
                }
            }
        });
    },
    onRefreshClick: function () {
        var PItemGrid = Ext.getCmp('payrollItemsHeader-grid');
        var id = PItemGrid.getSelectionModel().getSelected().get('Id');
        var gridEmployees = Ext.getCmp('attachPayrollItemsDetail-grid');
        gridEmployees.getStore().load({
            params: {

                start: 0,
                limit: 10,
                sort: '',
                dir: '',
                Id: id
            }
        });
    }
});
Ext.reg('attachPayrollItemsDetail-panel', Ext.core.finance.ux.attachPayrollItemsDetail.Panel);