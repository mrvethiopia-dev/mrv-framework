Ext.ns('Ext.core.finance.ux.batchCurrencyChanger');
/**
* @desc      Payroll Change Salary Or Position  form
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      October 08, 2013
* @namespace Ext.core.finance.ux.batchCurrencyChanger
* @class     Ext.core.finance.ux.batchCurrencyChanger.Form
* @extends   Ext.form.FormPanel
*/

Ext.core.finance.ux.batchCurrencyChanger.Form = function (config) {
    Ext.core.finance.ux.batchCurrencyChanger.Form.superclass.constructor.call(this, Ext.apply({
        api: {

            submit: PayrollEmployees.BatchCurrencyChange
        },
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:left;',
            msgTarget: 'side'
        },
        id: 'batchCurrencyChanger-form',
        labelWidth: 115,
        autoHeight: true,
        border: false,
        layout: 'form',
        bodyStyle: 'background:transparent;padding:5px',
        baseCls: 'x-plain',
        items: [{
            xtype: 'fieldset',
            title: 'Batch Currency Change Type',
            autoHeight: true,
            
            items: [{
            xtype: 'radiogroup',
            //fieldLabel: 'Auto Layout',
            items: [
                { boxLabel: 'ETB to GBP', name: 'rb-ETBtoGBP', inputValue: 'ETB to GBP', checked: true },
                { boxLabel: 'GBP to ETB', name: 'rb-ETBtoGBP', inputValue: 'GBP to ETB' }
            ]
        }]
    },
        {
            id: 'EffectivePeriodId', hiddenName: 'EffectivePeriodId', xtype: 'combo', fieldLabel: 'Effective Period', triggerAction: 'all', mode: 'local', editable: true, typeAhead: true,
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
        {
            xtype: 'numberfield',
            id: 'ExchangeRate',
            name: 'ExchangeRate',
            anchor: '65%',
            decimalPrecision: '4',
            fieldLabel: 'Current Exchange Rate',
            allowBlank: false
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
                    var grid = Ext.getCmp('batchCurrencyChanger-grid');
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
                anchor: '30%',
                text: 'Add Exceptions List ...',

                iconCls: 'icon-add',

                handler: function () {
                    
                    var arg = true;
                    var emSelWindow = new Ext.core.finance.ux.EmployeeSelection.Window({ Caller: 'BatchCurrencyChanger' });
                    emSelWindow.show();
                }
            }
        ]
    }, config));
};
Ext.extend(Ext.core.finance.ux.batchCurrencyChanger.Form, Ext.form.FormPanel);
Ext.reg('batchCurrencyChanger-form', Ext.core.finance.ux.batchCurrencyChanger.Form);


/**
* @desc      batchCurrencyChanger window
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      October 08, 2013
* @namespace Ext.core.finance.ux.batchCurrencyChanger
* @class     Ext.core.finance.ux.batchCurrencyChanger.Window
* @extends   Ext.Window
*/
Ext.core.finance.ux.batchCurrencyChanger.Window = function (config) {
    Ext.core.finance.ux.batchCurrencyChanger.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        width: 450,
        height: 550,
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
Ext.extend(Ext.core.finance.ux.batchCurrencyChanger.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.core.finance.ux.batchCurrencyChanger.Form();
        this.panel = new Ext.core.finance.ux.batchCurrencyChanger.Panel();
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
                Ext.getCmp('batchCurrencyChanger-form').getForm().reset();
                var grid = Ext.getCmp('batchCurrencyChanger-grid');
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

        Ext.core.finance.ux.batchCurrencyChanger.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {
        var exRate = Ext.getCmp('ExchangeRate').getValue();
        var fromTo = Ext.DomQuery.selectValue('input[name=rb-ETBtoGBP]:checked/@value');
        var effectivePeriodId = Ext.getCmp('EffectivePeriodId').getValue();

        if (exRate == '') {
            Ext.MessageBox.show({
                title: 'Exchange Rate',
                msg: 'Exchange Rate field can not be empty!',
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.ERROR,
                scope: this
            });
            return;
        }
        Ext.MessageBox.show({
            title: 'Delete',
            msg: 'Are you sure you want to process a batch currency change?',
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
                        msg: 'The system will now process the batch currency change for all employees. Once completed, you will not be able to reverse the changes made.' +
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
                                var grid = Ext.getCmp('batchCurrencyChanger-grid');
                                var store = grid.getStore();
                                var exceptionsList = '';

                                store.each(function (item) {
                                    exceptionsList = exceptionsList + item.data['Id'] + ';';
                                });
                                exceptionsList = exceptionsList.slice(0, -1);
                                window.PayrollEmployees.ProcessBatchCurrencyChange(fromTo, exRate, effectivePeriodId, exceptionsList, function (response) {
                                    if (response.success) {
                                        Ext.MessageBox.show({
                                            title: 'Batch Salary Change',
                                            msg: response.data,
                                            buttons: Ext.Msg.OK,
                                            icon: Ext.MessageBox.INFO,
                                            scope: this
                                        });

                                        Ext.getCmp('batchCurrencyChanger-form').getForm().reset();

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
Ext.reg('batchCurrencyChanger-window', Ext.core.finance.ux.batchCurrencyChanger.Window);


/**
* @desc      Employee Detail grid
* @author   Dawit Kiros
* @copyright (c) 2014, LIFT
* @date     June 13, 2013
* @namespace Ext.core.finance.ux.batchCurrencyChanger
* @class     Ext.core.finance.ux.batchCurrencyChanger.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.core.finance.ux.batchCurrencyChanger.Grid = function (config) {
    Ext.core.finance.ux.batchCurrencyChanger.Grid.superclass.constructor.call(this, Ext.apply({
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
                    Ext.getCmp('batchCurrencyChanger-grid').body.mask('Loading...', 'x-mask-loading');
                },
                load: function () {
                    var grid = Ext.getCmp('batchCurrencyChanger-grid');
                    //var store = grid.getStore();

                    grid.body.unmask();
                },
                loadException: function () {
                    Ext.getCmp('batchCurrencyChanger-grid').body.unmask();
                },
                remove: function (store) {
                    var grid = Ext.getCmp('batchCurrencyChanger-grid');

                },
                scope: this
            }
        }),
        id: 'batchCurrencyChanger-grid',
       
        pageSize: 15,
        stripeRows: true,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        border: false,
        columnLines: true,
        height: 220,
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
Ext.extend(Ext.core.finance.ux.batchCurrencyChanger.Grid, Ext.grid.EditorGridPanel, {
    initComponent: function () {

        Ext.core.finance.ux.batchCurrencyChanger.Grid.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('batchCurrencyChanger-grid', Ext.core.finance.ux.batchCurrencyChanger.Grid);



/**
* @desc      Employee Detail panel
* @author   Dawit Kiros
* @copyright (c) 2014, LIFT
* @date     June 13, 2013
* @version   $Id: batchCurrencyChanger.js, 0.1
* @namespace Ext.core.finance.ux.batchCurrencyChanger
* @class     Ext.core.finance.ux.batchCurrencyChanger.Panel
* @extends   Ext.Panel
*/
Ext.core.finance.ux.batchCurrencyChanger.Panel = function (config) {
    Ext.core.finance.ux.batchCurrencyChanger.Panel.superclass.constructor.call(this, Ext.apply({
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

Ext.extend(Ext.core.finance.ux.batchCurrencyChanger.Panel, Ext.Panel, {
    initComponent: function () {
        this.grid = new Ext.core.finance.ux.batchCurrencyChanger.Grid();
        this.items = [{
            xtype: 'batchCurrencyChanger-grid',
            id: 'batchCurrencyChanger-grid'
        }];
        Ext.core.finance.ux.batchCurrencyChanger.Panel.superclass.initComponent.apply(this, arguments);
    },


    onApplyApplicability: function () {

    },
    onRemoveEmpClick: function () {
        var grid = Ext.getCmp('batchCurrencyChanger-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var record = grid.getSelectionModel().getSelected();


        grid.store.remove(record);


    },

    onRemoveAllClick: function () {

    },
    onRefreshClick: function () {

    }
});
Ext.reg('batchCurrencyChanger-panel', Ext.core.finance.ux.batchCurrencyChanger.Panel);
