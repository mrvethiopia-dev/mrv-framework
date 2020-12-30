Ext.ns('Ext.core.finance.ux.batchSalaryChange');
/**
* @desc      Payroll Change Salary Or Position  form
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      October 08, 2013
* @namespace Ext.core.finance.ux.batchSalaryChange
* @class     Ext.core.finance.ux.batchSalaryChange.Form
* @extends   Ext.form.FormPanel
*/

Ext.core.finance.ux.batchSalaryChange.Form = function (config) {
    Ext.core.finance.ux.batchSalaryChange.Form.superclass.constructor.call(this, Ext.apply({
        api: {

            submit: PayrollEmployees.SaveBatchSalaryChange
        },
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:left;',
            msgTarget: 'side'//,
            //bodyStyle: 'background:transparent;padding:5px'
        },
        id: 'batchSalaryChange-form',
        labelWidth: 115,
        autoHeight: true,
        border: false,
        layout: 'form',
        bodyStyle: 'background:transparent;padding:5px',
        baseCls: 'x-plain',
        items: [
        {
            id: 'CutOffDateId',
            hiddenName: 'CutOffDateId',
            xtype: 'combo',
            fieldLabel: 'Cut Off Date',
            triggerAction: 'all',
            mode: 'local',
            editable: true,
            typeAhead: true,
            forceSelection: true,
            emptyText: '',
            allowBlank: false,
            store: new Ext.data.DirectStore({
                reader: new Ext.data.JsonReader({
                    successProperty: 'success',
                    idProperty: 'Id',
                    root: 'data',
                    fields: ['Id', 'CuttOffDate']
                }),
                autoLoad: true,
                api: { read: window.Tsa.GetBatchSalaryChangeCutOffDates }
            }),
            valueField: 'Id',
            displayField: 'CuttOffDate'
        }, {
            id: 'BatchEffectivePeriodId', hiddenName: 'BatchEffectivePeriodId', xtype: 'combo', fieldLabel: 'Effective Period', triggerAction: 'all', mode: 'local', editable: true, typeAhead: true,
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
            valueField: 'Id', displayField: 'Name'
        },
        { xtype: 'compositefield',
            fieldLabel: 'Exceptions',
            defaults: { flex: 1 },
            items: [{
                id: 'ExceptionsId',
                hiddenName: 'ExceptionsId',
                xtype: 'combo',
                fieldLabel: 'Exception',
                triggerAction: 'all',
                mode: 'local',
                editable: true,
                listWidth: 250,
                allowBlank: true,
                store: new Ext.data.DirectStore({
                    reader: new Ext.data.JsonReader({
                        successProperty: 'success',
                        idProperty: 'Id',
                        root: 'data',
                        fields: ['Id', 'Name']
                    }),
                    autoLoad: true,
                    api: { read: window.Tsa.GetEmployeesList }
                }),
                valueField: 'Id', displayField: 'Name'
            },
            { xtype: 'button',
                id: 'AddExceptions',
                iconCls: 'icon-add',
                width: 25,
                handler: function () {
                    var empId = Ext.getCmp('ExceptionsId').getValue();
                    var empName = Ext.getCmp('ExceptionsId').getRawValue();
                    var grid = Ext.getCmp('batchSalaryChange-grid');
                    var store = grid.getStore();
                    var employee = store.recordType;

                    var p = new employee({
                        Id: empId,
                        Name: empName

                    });

                    var count = store.getCount();
                    var gridStore = grid.getStore();

                    if (empId == '') {
                        return;
                    }
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

                    }
                    countEmpsAdded++;
                }
            }]

        },
            {
                xtype: 'button',
                id: 'AddExceptionsList',
                anchor:'30%',
                text: 'Add Exceptions List ...',
                
                iconCls: 'icon-add',

                handler: function () {

                    var arg = true;
                    var emSelWindow = new Ext.core.finance.ux.EmployeeSelection.Window({ Caller: 'BatchSalaryChange' });
                    emSelWindow.show();
                }
            }
        ]
    }, config));
};
Ext.extend(Ext.core.finance.ux.batchSalaryChange.Form, Ext.form.FormPanel);
Ext.reg('batchSalaryChange-form', Ext.core.finance.ux.batchSalaryChange.Form);


/**
* @desc      batchSalaryChange window
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      October 08, 2013
* @namespace Ext.core.finance.ux.batchSalaryChange
* @class     Ext.core.finance.ux.batchSalaryChange.Window
* @extends   Ext.Window
*/
Ext.core.finance.ux.batchSalaryChange.Window = function (config) {
    Ext.core.finance.ux.batchSalaryChange.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        width: 450,
        height: 350,
        //autoHeight: true,
        closeAction: 'close',
        modal: true,
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;',
        listeners: {
            show: function () {

            },
            scope: this
        }
    }, config));
}
Ext.extend(Ext.core.finance.ux.batchSalaryChange.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.core.finance.ux.batchSalaryChange.Form();
        this.panel = new Ext.core.finance.ux.batchSalaryChange.Panel();
        this.items = [this.form, this.panel];
        this.buttons = [{
            text: 'Save',
            iconCls: 'icon-save',
            handler: this.onSave,
            scope: this
        }, {
            text: 'Reset',
            iconCls: 'icon-Reset',
            handler: function () {
                Ext.getCmp('batchSalaryChange-form').getForm().reset();
                var grid = Ext.getCmp('batchSalaryChange-grid');
                var store = grid.getStore();
                store.removeAll();
            },
            scope: this
        }, {
            text: 'Close',
            iconCls: 'icon-exit',
            handler: this.onClose,
            scope: this
        }];

        Ext.core.finance.ux.batchSalaryChange.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {
        var cutOffId = Ext.getCmp('CutOffDateId').getValue();
        var effectivePeriodId = Ext.getCmp('BatchEffectivePeriodId').getValue();

        Ext.MessageBox.show({
            title: 'Delete',
            msg: 'Are you sure you want to process a batch salary change?',
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
                        msg: 'The system will now process the batch salary change for all employees. Once completed, you will not be able to reverse the changes made.' +
                                    'Press Ok to start the process, Press Cancel to abort.',
                        buttons: {
                            ok: 'Ok',
                            cancel: 'Cancel'
                        },
                        icon: Ext.MessageBox.WARNING,
                        scope: this,
                        fn: function (btn) {
                            if (btn == 'ok') {
                                Ext.MessageBox.show({
                                    msg: 'Batch Salary Change in progress, please wait...',
                                    progressText: 'Saving...',
                                    width: 300,
                                    wait: true,
                                    waitConfig: { interval: 200 }
                                });
                                var grid = Ext.getCmp('batchSalaryChange-grid');
                                var store = grid.getStore();
                                var exceptionsList = '';

                                store.each(function (item) {
                                    exceptionsList = exceptionsList + item.data['Id'] + ';';
                                });
                                exceptionsList = exceptionsList.slice(0, -1);
                                window.PayrollEmployees.SaveBatchSalaryChange(cutOffId, effectivePeriodId, exceptionsList, function (response) {
                                    if (response.success) {
                                        Ext.MessageBox.show({
                                            title: 'Batch Salary Change',
                                            msg: response.data,
                                            buttons: Ext.Msg.OK,
                                            icon: Ext.MessageBox.INFO,
                                            scope: this
                                        });

                                        Ext.getCmp('batchSalaryChange-form').getForm().reset();

                                        Ext.getCmp('PayrollEmployees-paging').doRefresh();

                                    } else {
                                        Ext.MessageBox.show({
                                            title: 'Batch Salary Change',
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

    },
    onClose: function () {
        this.close();
    }
});
Ext.reg('batchSalaryChange-window', Ext.core.finance.ux.batchSalaryChange.Window);


/**
* @desc      Employee Detail grid
* @author   Dawit Kiros
* @copyright (c) 2014, LIFT
* @date     June 13, 2013
* @namespace Ext.core.finance.ux.batchSalaryChange
* @class     Ext.core.finance.ux.batchSalaryChange.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.core.finance.ux.batchSalaryChange.Grid = function (config) {
    Ext.core.finance.ux.batchSalaryChange.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            //directFn: PayrollEmployeePayrollItems.GetDetailByPItemId,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'ASC'
            },
            fields: ['Id', 'Name'],
            remoteSort: false,
            listeners: {
                beforeLoad: function () {
                    Ext.getCmp('batchSalaryChange-grid').body.mask('Loading...', 'x-mask-loading');
                },
                load: function () {
                    var grid = Ext.getCmp('batchSalaryChange-grid');
                    //var store = grid.getStore();

                    grid.body.unmask();
                },
                loadException: function () {
                    Ext.getCmp('batchSalaryChange-grid').body.unmask();
                },
                remove: function (store) {
                    var grid = Ext.getCmp('batchSalaryChange-grid');

                },
                scope: this
            }
        }),
        id: 'batchSalaryChange-grid',
        formulationId: 0,
        pageSize: 15,
        stripeRows: true,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        border: false,
        columnLines: true,
        height: 120,
        clicksToEdit: 1,
        listeners: {
            afteredit: function (e) {

            }
        },
        viewConfig: {
            forceFit: true,
            autoFill: true
        },
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
            dataIndex: 'Name',
            header: 'Name',
            sortable: true,
            width: 220,
            menuDisabled: false
        }]
    }, config));
};
Ext.extend(Ext.core.finance.ux.batchSalaryChange.Grid, Ext.grid.EditorGridPanel, {
    initComponent: function () {

        Ext.core.finance.ux.batchSalaryChange.Grid.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('batchSalaryChange-grid', Ext.core.finance.ux.batchSalaryChange.Grid);



/**
* @desc      Employee Detail panel
* @author   Dawit Kiros
* @copyright (c) 2014, LIFT
* @date     June 13, 2013
* @version   $Id: batchSalaryChange.js, 0.1
* @namespace Ext.core.finance.ux.batchSalaryChange
* @class     Ext.core.finance.ux.batchSalaryChange.Panel
* @extends   Ext.Panel
*/
Ext.core.finance.ux.batchSalaryChange.Panel = function (config) {
    Ext.core.finance.ux.batchSalaryChange.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false,
        title: 'List of Exceptions',
        id: 'detailPanel',
        tbar: {
            xtype: 'toolbar',
            items: [{
                xtype: 'button',
                text: 'Add Employees',
                id: 'addattachPayrollItemsDetail',
                iconCls: 'icon-UserAdd',
                hidden: true,
                handler: function () {

                }
            }, {
                xtype: 'button',
                text: 'Remove',
                id: 'removeEmpD',
                iconCls: 'icon-UserRemove',
                handler: this.onRemoveEmpClick,
                hidden: false
                ///disabled: !Ext.core.finance.ux.Reception.getPermission('Employee Additions/Deductions', 'CanDelete')
            }
               ]
        }
    }, config));
};

Ext.extend(Ext.core.finance.ux.batchSalaryChange.Panel, Ext.Panel, {
    initComponent: function () {
        this.grid = new Ext.core.finance.ux.batchSalaryChange.Grid();
        this.items = [{
            xtype: 'batchSalaryChange-grid',
            id: 'batchSalaryChange-grid'
        }];
        Ext.core.finance.ux.batchSalaryChange.Panel.superclass.initComponent.apply(this, arguments);
    },


    onApplyApplicability: function () {

    },
    onRemoveEmpClick: function () {
        var grid = Ext.getCmp('batchSalaryChange-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var record = grid.getSelectionModel().getSelected();


        grid.store.remove(record);


    },

    onRemoveAllClick: function () {

    },
    onRefreshClick: function () {

    }
});
Ext.reg('batchSalaryChange-panel', Ext.core.finance.ux.batchSalaryChange.Panel);
