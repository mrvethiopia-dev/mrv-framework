Ext.ns('Ext.core.finance.ux.EmployeeSelection');
/**
* @desc      Employee Selection registration form
* @author    Dawit Kiros
* @copyright (c) 2012, LIFT
* @date      April 24, 2012
* @namespace Ext.core.finance.ux.Employee Selection
* @class     Ext.core.finance.ux.Employee Selection.Form
* @extends   Ext.form.FormPanel
*/

Ext.core.finance.ux.EmployeeSelection.Form = function (config) {
    Ext.core.finance.ux.EmployeeSelection.Form.superclass.constructor.call(this, Ext.apply({
        paramOrder: ['GeneratePayroll'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side',
            bodyStyle: 'background:transparent;padding:5px'
        },
        id: 'EmployeeSelection-form',
        labelWidth: 115,
        height: 100,
        border: false,
        layout: 'form',
        bodyStyle: 'background:transparent;padding:5px',
        baseCls: 'x-plain',
        items: []
    }, config));
};
Ext.extend(Ext.core.finance.ux.EmployeeSelection.Form, Ext.form.FormPanel);
Ext.reg('EmployeeSelection-form', Ext.core.finance.ux.EmployeeSelection.Form);


var EmpsSelModel = new Ext.grid.CheckboxSelectionModel();

/**
* @desc      EmployeeSelection grid
* @author    Dawit Kiros
* @copyright (c) 2012, LIFT
* @date      April 24, 2012
* @namespace Ext.core.finance.ux.EmployeeSelection
* @class     Ext.core.finance.ux.EmployeeSelection.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.core.finance.ux.EmployeeSelection.Grid = function (config) {
    Ext.core.finance.ux.EmployeeSelection.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: Tsa.GetPagedEmployeeForGeneration,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Code',
                direction: 'ASC'
            },
            fields: ['Id', 'IdentityNo', 'FirstName', 'MiddleName', 'LastName', 'SalaryETB', 'Position', 'Department', 'HasPension'],
            remoteSort: true,
            listeners: {
                beforeLoad: function () { Ext.getCmp('EmployeeSelection-grid').body.mask('Loading...', 'x-mask-loading'); },
                load: function () { Ext.getCmp('EmployeeSelection-grid').body.unmask(); },
                loadException: function () { Ext.getCmp('EmployeeSelection-grid').body.unmask(); },
                scope: this
            }
        }),
        id: 'EmployeeSelection-grid',
        pageSize: 100,
        height: 300,
        stripeRows: true,
        border: true,
        sm: EmpsSelModel,
        viewConfig: {
            forceFit: false,
            autoExpandColumn: 'IdentityNumber',
            autoFill: true
        },
        columns: [
        new Ext.erp.ux.grid.PagingRowNumberer({
            width: 35
        }),
        EmpsSelModel,
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
            dataIndex: 'SalaryETB',
            header: 'SalaryETB(ETB)',
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
            dataIndex: 'Department',
            header: 'Department',
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
Ext.extend(Ext.core.finance.ux.EmployeeSelection.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
//        this.store.baseParams = { record: Ext.encode({ IsPFGenerator: this.IsPFGenerator }) };
        this.bbar = new Ext.PagingToolbar({
            id: 'employeeWCheckBox-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.core.finance.ux.EmployeeSelection.Grid.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('EmployeeSelection-grid', Ext.core.finance.ux.EmployeeSelection.Grid);


/**
* @desc      EmployeeSelection tree
* @author    Dawit Kiros
* @copyright (c) 2012, LIFT
* @date      April 24, 2012
* @namespace Ext.erp.hrms.ux.EmployeeSelection
* @class     Ext.erp.hrms.ux.EmployeeSelection.Tree
* @extends   Ext.tree.TreePanel
*/
Ext.core.finance.ux.EmployeeSelection.Tree = function (config) {
    Ext.core.finance.ux.EmployeeSelection.Tree.superclass.constructor.call(this, Ext.apply({
        id: 'EmployeeSelection-tree',
        loader: new Ext.tree.TreeLoader({
            directFn: Tsa.PopulateDepartmentsTree
        }),
        selecteddeptId: 0,
        //selecteddeptTypeId: 0,
        border: false,
        rootVisible: true,
        lines: true,
        autoScroll: true,
        stateful: false,
        root: {
            text: 'Departments',
            id: 'root-dept'
        },
        tbar: [{
            xtype: 'displayfield',
            id: 'selected-dept',
            style: 'font-weight: bold'
        }, {
            xtype: 'tbfill'
        }, {
            xtype: 'button',
            id: 'expand-all-EmployeeSelection',
            iconCls: 'icon-expand-all',
            tooltip: 'Expand All',
            handler: function () {
                Ext.getCmp('EmployeeSelection-tree').expandAll();
            }
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            id: 'collapse-all-EmployeeSelection',
            iconCls: 'icon-collapse-all',
            tooltip: 'Collapse All',
            handler: function () {
                Ext.getCmp('EmployeeSelection-tree').collapseAll();
            }
        }],
        listeners: {
            click: function (node, e) {
                var searchText = Ext.getCmp('txtSearchEmployee');
                searchText.setValue('');
                e.stopEvent();
                node.select();
                node.reload();
                //node.getOwnerTree().selecteddeptTypeId = node.attributes.id == 'root-dept' ? 0 : node.attributes.text;
                node.getOwnerTree().selecteddeptId = node.attributes.id == 'root-dept' ? 0 : node.attributes.id;
                var employeeSelectionGrid = Ext.getCmp('EmployeeSelection-grid');
                var selecteddept = node.attributes.id == 'root-dept' ? '' : '[' + node.attributes.text + ']';
                Ext.getCmp('selected-dept').setValue(selecteddept);
                employeeSelectionGrid.store.baseParams['record'] = Ext.encode({ deptId: node.id, IsPFGenerator: this.IsPFGenerator, PeriodId: this.PeriodId });
                employeeSelectionGrid.store.load({ params: { start: 0, limit: employeeSelectionGrid.pageSize} });
            },
            expand: function (p) {
                p.syncSize();
            }
        }
    }, config));
}
Ext.extend(Ext.core.finance.ux.EmployeeSelection.Tree, Ext.tree.TreePanel, {
    initComponent: function () {
        this.tbar = [{
            xtype: 'displayfield',
            id: 'selected-dept',
            style: 'font-weight: bold'
        }, {
            xtype: 'tbfill'
        }, {
            xtype: 'button',
            id: 'expand-all-assets',
            iconCls: 'icon-expand-all',
            tooltip: 'Expand All',
            handler: function () {
                Ext.getCmp('fixedAsset-tree').expandAll();
            }
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            id: 'collapse-all-assets',
            iconCls: 'icon-collapse-all',
            tooltip: 'Collapse All',
            handler: function () {
                Ext.getCmp('fixedAsset-tree').collapseAll();
            }
        }];
        Ext.core.finance.ux.EmployeeSelection.Tree.superclass.initComponent.call(this, arguments);
    }
});
Ext.reg('EmployeeSelection-tree', Ext.core.finance.ux.EmployeeSelection.Tree);
var countEmpsAdded = 0;
/**
* @desc      EmployeeSelection window
* @author    Dawit Kiros
* @editor    Dawit Kiros Woldemichael
* @copyright (c) 2012, LIFT
* @date      April 24, 2012
* @namespace Ext.core.finance.ux.EmployeeSelection
* @class     Ext.core.finance.ux.EmployeeSelection.Window
* @extends   Ext.Window
*/
Ext.core.finance.ux.EmployeeSelection.Window = function (config) {
    Ext.core.finance.ux.EmployeeSelection.Window.superclass.constructor.call(this, Ext.apply({
        title: 'Employee Selection Criteria',
        width: 900,
        height: 490,
        layout: 'hbox',
        bodyStyle: 'margin: 5px; padding-right: 10px',
        align: 'stretch',
        closeAction: 'close',
        modal: true,
        resizable: false,
        buttonAlign: 'right'

    }, config));
}
Ext.extend(Ext.core.finance.ux.EmployeeSelection.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.core.finance.ux.EmployeeSelection.Form();
        this.grid = new Ext.core.finance.ux.EmployeeSelection.Grid();
        this.Etree = new Ext.core.finance.ux.EmployeeSelection.Tree({ IsPFGenerator: this.IsPFGenerator, PeriodId: this.PeriodId });

        this.items = [{
            xtype: 'panel',
            width: 300,
            height: 430,
            layout: 'fit',
            bodyStyle: 'background:transparent',
            flex: 1,
            items: [this.Etree]
        }, {
            xtype: 'panel',
            width: 10,
            bodyStyle: 'background:transparent',
            border: false,
            flex: 1
        }, {
            xtype: 'panel',
            layout: 'vbox',
            height: 430,
            width: 570,
            bodyStyle: 'background:transparent',
            border: false,
            flex: 1,
            align: 'stretch',
            items: [{
                xtype: 'panel',
                title: 'Selection Criteria',
                height: 130,
                layout: 'fit',
                width: 565,
                bodyStyle: 'background:transparent; padding-top: 10px;',
                flex: 1,
                items: [this.form]
            }, {
                xtype: 'panel',
                height: 30,
                width: 565,
                bodyStyle: 'background:transparent;',
                border: false,
                flex: 1,
                items: [{
                    xtype: 'toolbar',
                    style: {
                        background: 'none',
                        border: 'none',
                        paddingTop: '5px'
                    },
                    items: [{
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
                                    var empGrid = Ext.getCmp('EmployeeSelection-grid');
                                    empGrid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue() });
                                    empGrid.store.load({ params: { start: 0, limit: empGrid.pageSize} });
                                }
                            },
                            keyup: function (field) {
                                if (field.getValue() == '') {
                                    var empGrid = Ext.getCmp('EmployeeSelection-grid');
                                    empGrid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue() });
                                    empGrid.store.load({ params: { start: 0, limit: empGrid.pageSize} });
                                }
                            }
                        }
                    }]

                }]
            }, {
                xtype: 'panel',
                layout: 'fit',
                width: 565,
                height: 270,
                bodyStyle: 'background:transparent',
                flex: 1,
                items: [this.grid]
            }]
        }];
        this.bbar = [{
            xtype: 'tbfill'
        }, {
            text: 'Select',
            iconCls: 'icon-selection',
            scope: this,
            handler: this.onSelect
        }, {
            xtype: 'tbseparator'
        }, {
            text: 'Close',
            iconCls: 'icon-exit',
            handler: this.onClose,
            scope: this
        }];
        Ext.core.finance.ux.EmployeeSelection.Window.superclass.initComponent.call(this, arguments);
    },
    onSelect: function () {
        var grid;

        var callerName = this.Caller;

        switch (callerName) {
            case 'PayrollGeneratorWindow':
                grid = Ext.getCmp('payrollGenerator-grid');
                break;
            case 'PayrollItemsAttachment':
                grid = Ext.getCmp('attachPayrollItemsDetail-grid');
                break;
            case 'BatchSalaryChange':
                grid = Ext.getCmp('batchSalaryChange-grid');
                break;
            case 'BatchCurrencyChanger':
                    grid = Ext.getCmp('batchCurrencyChanger-grid');
                break;
        }

        var selectionGrid = Ext.getCmp('EmployeeSelection-grid');
        if (!selectionGrid.getSelectionModel().hasSelection()) return;
        var selectedEmployees = selectionGrid.getSelectionModel().getSelections();
        var store = grid.getStore();
        var employee = store.recordType;


        var defaultCostCenterId;
        //            if (response.result.success) {
        //                defaultCostCenterId = response.result.data.DefaultCostCenterId == 0 ? '' : response.result.data.DefaultCostCenterId;
        //            } else {
        defaultCostCenterId = '';
        //            }

        var empRecords = [];
        var gridStore = grid.getStore();

        grid.getStore().each(function (model) {
            empRecords.push(model.data);
        });
        countEmpsAdded = 0;
        for (var i = 0; i < selectedEmployees.length; i++) {

            var pItemAmount;
            var salary;
            if (this.ApplicationType == "Fixed Amount")
                pItemAmount = this.PItemAmount;
            else {
                salary = selectedEmployees[i].get('SalaryETB');
                pItemAmount = this.PItemAmount * salary / 100;
            }

            var p = new employee({
               
                Id: selectedEmployees[i].get('Id'),
                IdentityNo: selectedEmployees[i].get('IdentityNo'),                
                FirstName: selectedEmployees[i].get('FirstName'),
                MiddleName: selectedEmployees[i].get('MiddleName'),
                LastName: selectedEmployees[i].get('LastName'),                
                SalaryETB: selectedEmployees[i].get('SalaryETB'),
                Percentage: 0,
                NewAmount: pItemAmount,
                HasPension: selectedEmployees[i].get('HasPension'),
                Name: selectedEmployees[i].get('FirstName') + ' '+ selectedEmployees[i].get('MiddleName') + ' '+ selectedEmployees[i].get('LastName')
            });

            var count = store.getCount();

            // this piece of code will stop from loading similar or selected employees onto the destination grid
            try {

                var recordIndex = gridStore.findBy(
                function (record, id) {
                    if (record.get('Id') == p.data.Id) {
                        return true;
                    }
                    return false;
                });

                if (recordIndex != -1) {
                }
                else {
                    store.insert(count, p);
                }
            }
            catch (e) {
                var exc = e.Message;
                continue;
            }
            countEmpsAdded++;
        }
    },
    onClose: function () {

        this.close();
    }
});
Ext.reg('EmployeeSelection-window', Ext.core.finance.ux.EmployeeSelection.Window);