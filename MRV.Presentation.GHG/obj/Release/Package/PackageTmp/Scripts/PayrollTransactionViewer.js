Ext.ns('Ext.core.finance.ux.TransactionViewer');
/**
* @desc      Transaction Viewer registration form
* @author    Dawit Kiros
* @copyright (c) 2013, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.TransactionViewer
* @class     Ext.core.finance.ux.TransactionViewer.Form
* @extends   Ext.form.FormPanel
*/
Ext.core.finance.ux.TransactionViewer.Form = function (config) {
    Ext.core.finance.ux.TransactionViewer.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: PayrollJournals.GetJournalsByPeriodIdId,
            submit: PayrollItems.Save
        },
        paramOrder: ['Id'],
        defaults: {
            labelStyle: 'text-align:left;',
            msgTarget: 'side'
        },
        id: 'TransactionViewer-form',
        padding: 5,
        labelWidth: 120,
        autoHeight: true,
        border: false,
        isFormLoad: false,
        frame: true,
        items: []
    }, config));
}
Ext.extend(Ext.core.finance.ux.TransactionViewer.Form, Ext.form.FormPanel);
Ext.reg('TransactionViewer-form', Ext.core.finance.ux.TransactionViewer.Form);


/**
* @desc      Transaction Viewer registration form host window
* @author    Dawit Kiros
* @copyright (c) 2013, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.TransactionViewer
* @class     Ext.core.finance.ux.TransactionViewer.Window
* @extends   Ext.Window
*/
Ext.core.finance.ux.TransactionViewer.Window = function (config) {
    Ext.core.finance.ux.TransactionViewer.Window.superclass.constructor.call(this, Ext.apply({
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
                this.form.getForm().findField('Id').setValue(this.TransactionViewerId);
                if (this.TransactionViewerId != '') {
                    this.form.load({ params: { Id: this.TransactionViewerId} });
                }
            },
            scope: this
        }
    }, config));
}

Ext.extend(Ext.core.finance.ux.TransactionViewer.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.core.finance.ux.TransactionViewer.Form();
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

        Ext.core.finance.ux.TransactionViewer.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {

        if (!this.form.getForm().isValid()) return;
        this.form.getForm().submit({
            waitMsg: 'Please wait...',
            success: function () {
                Ext.getCmp('TransactionViewer-form').getForm().reset();
                Ext.getCmp('TransactionViewer-paging').doRefresh();
            }
        });
    },
    onClose: function () {
        this.close();
    }
});
Ext.reg('TransactionViewer-window', Ext.core.finance.ux.TransactionViewer.Window);

/**
* @desc      Transaction Viewers grid
* @author    Dawit Kiros
* @copyright (c) 2013, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.TransactionViewer
* @class     Ext.core.finance.ux.TransactionViewer.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.core.finance.ux.TransactionViewer.Grid = function (config) {
    Ext.core.finance.ux.TransactionViewer.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: PayrollTransactions.GetComparedPeriods,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|PeriodOneId|PeriodTwoId',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'ASC'
            },
            fields: ['Id', 'EmpId', 'Employee_Name', 'Period_One_Salary', 'Period_Two_Salary', 'Difference', 'Base_Currency'],
            remoteSort: true,
            listeners: {
                beforeLoad: function () {
                    Ext.getCmp('TransactionViewer-grid').body.mask('Loading...', 'x-mask-loading');
                },
                load: function () {
                    var grid = Ext.getCmp('TransactionViewer-grid');
                    //var store = grid.getStore();

                    grid.body.unmask();
                },
                loadException: function () {
                    Ext.getCmp('TransactionViewer-grid').body.unmask();
                },
                remove: function (store) {
                    var grid = Ext.getCmp('TransactionViewer-grid');

                },
                scope: this
            }
        }),
        id: 'TransactionViewer-grid',
        PeriodId: 0,
        pageSize: 30,
        title: 'Payroll Transactions List',
        stripeRows: true,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        border: false,
        columnLines: true,
        clicksToEdit: 1,
        listeners: {

        },
        viewConfig: {
            forceFit: true,
            autoFill: true
        },
        columns: [{
            dataIndex: 'Id',
            header: 'Id',
            sortable: true,
            hidden: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'EmpId',
            header: 'IdentityNo',
            sortable: true,
            width: 220,
            hidden: true,
            menuDisabled: false
        }, {
            dataIndex: 'Employee_Name',
            header: 'Employee Name',
            sortable: true,
            width: 220,
            menuDisabled: false
        }, {
            dataIndex: 'Period_One_Salary',
            header: 'Period One Salary',
            sortable: true,
            width: 200,
            menuDisabled: true
        }, {
            dataIndex: 'Period_Two_Salary',
            header: 'Period Two Salary',
            sortable: true,
            width: 220,
            menuDisabled: true
        }, {
            dataIndex: 'Difference',
            header: 'Difference',
            sortable: true,
            width: 220,
            menuDisabled: true
        }, {
            dataIndex: 'Base_Currency',
            header: 'Base Currency',
            sortable: true,
            width: 220,
            menuDisabled: true
        }]
    }, config));
};
Ext.extend(Ext.core.finance.ux.TransactionViewer.Grid, Ext.grid.EditorGridPanel, {
    initComponent: function () {
        var TransGrid = Ext.getCmp('TransactionViewer-grid');
        
        // this.store.baseParams = { record: Ext.encode({ mode: 'get' }) };
        this.tbar = [new Ext.ux.Exporter.Button({
            store: TransGrid.getStore(),
            exportFunction: 'exportStore',
            id: 'btn-employee-export',
            text: "Export to Excel",
            //iconCls: 'icon-Excel',
            listeners: {
                click: function () {
                    var grid = Ext.getCmp('TransactionViewer-grid');
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
                        title: 'Transaction Differences'
                    });
                }
            }
        }) ];
        //        this.bbar = new Ext.PagingToolbar({
        //            id: 'TransactionViewer-paging',
        //            store: this.store,
        //            displayInfo: true,
        //            pageSize: this.pageSize
        //        });
        Ext.core.finance.ux.TransactionViewer.Grid.superclass.initComponent.apply(this, arguments);
    }
    //    afterRender: function () {
    //        this.getStore().load({
    //            params: { start: 0, limit: this.pageSize }
    //        });
    //        Ext.core.finance.ux.TransactionViewer.Grid.superclass.afterRender.apply(this, arguments);
    //    }
});
Ext.reg('TransactionViewer-grid', Ext.core.finance.ux.TransactionViewer.Grid);

/**
* @desc      Transaction Viewers panel
* @author    Dawit Kiros
* @copyright (c) 2013, LIFT
* @date      July 01, 2013
* @version   $Id: TransactionViewer.js, 0.1
* @namespace Ext.core.finance.ux.TransactionViewer
* @class     Ext.core.finance.ux.TransactionViewer.Panel
* @extends   Ext.Panel
*/



Ext.core.finance.ux.TransactionViewer.Panel = function (config) {
    Ext.core.finance.ux.TransactionViewer.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false,
        tbar: {
            xtype: 'toolbar',
            items: ['Period One', {
                id: 'TransPeriodOneId', xtype: 'combo', anchor: '55%', fieldLabel: 'Period', triggerAction: 'all', mode: 'local', editable: true, typeAhead: true,
                forceSelection: true, emptyText: '---Select Period---', allowBlank: false,
                store: new Ext.data.DirectStore({
                    reader: new Ext.data.JsonReader({
                        successProperty: 'success',
                        idProperty: 'Id',
                        root: 'data',
                        fields: ['Id', 'Name']
                    }),
                    autoLoad: true,
                    api: { read: Tsa.GetActivePeriods }
                }),
                valueField: 'Id', displayField: 'Name',
                listeners: {
                    select: function () {
                        var periodOneId = Ext.getCmp('TransPeriodOneId').getValue();
                        var periodTwoId = Ext.getCmp('TransPeriodTwoId').getValue();

                        if (periodOneId == '' || periodTwoId == '')
                            return;

                        var jrnlGrid = Ext.getCmp('TransactionViewer-grid');
                        jrnlGrid.getStore().load({
                            params: {
                                start: 0,
                                limit: 10,
                                sort: '',
                                dir: '',
                                PeriodOneId: periodOneId,
                                PeriodTwoId: periodTwoId
                            }

                        });

                    }


                }
            }, {
                xtype: 'tbseparator'
            }, 'Period Two', {
                id: 'TransPeriodTwoId', xtype: 'combo', anchor: '55%', fieldLabel: 'Period', triggerAction: 'all', mode: 'local', editable: true, typeAhead: true,
                forceSelection: true, emptyText: '---Select Period---', allowBlank: false,
                store: new Ext.data.DirectStore({
                    reader: new Ext.data.JsonReader({
                        successProperty: 'success',
                        idProperty: 'Id',
                        root: 'data',
                        fields: ['Id', 'Name']
                    }),
                    autoLoad: true,
                    api: { read: Tsa.GetActivePeriods }
                }),
                valueField: 'Id', displayField: 'Name',
                listeners: {
                    select: function () {
                        var periodOneId = Ext.getCmp('TransPeriodOneId').getValue();
                        var periodTwoId = Ext.getCmp('TransPeriodTwoId').getValue();

                        if (periodOneId == '' || periodTwoId == '')
                            return;

                        var jrnlGrid = Ext.getCmp('TransactionViewer-grid');
                        jrnlGrid.getStore().load({
                            params: {
                                start: 0,
                                limit: 10,
                                sort: '',
                                dir: '',
                                PeriodOneId: periodOneId,
                                PeriodTwoId: periodTwoId
                            }

                        });

                    }


                }
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Compare',
                id: 'btnComparePeriods',
                iconCls: 'icon-Compare',
                handler: function () {

                    Ext.MessageBox.show({
                        msg: 'Please wait...',
                        progressText: 'Processing...',
                        width: 300,
                        wait: true,
                        waitConfig: { interval: 40 }
                    });

                    Ext.Ajax.timeout = 6000000;

                    var periodOne = Ext.getCmp('TransPeriodOneId').getValue();
                    var periodTwo = Ext.getCmp('TransPeriodTwoId').getValue();
                    window.PayrollTransactions.SaveTransactionDifferences(periodOne, periodTwo, function (response) {
                        if (response.success) {
                            Ext.MessageBox.show({
                                title: 'Payroll Differences',
                                msg: response.data,
                                buttons: Ext.Msg.OK,
                                icon: Ext.MessageBox.INFO,
                                scope: this
                            });

                        } else {
                            Ext.MessageBox.show({
                                title: 'Payroll Differences',
                                msg: response.data,
                                buttons: Ext.Msg.OK,
                                icon: Ext.MessageBox.ERROR,
                                scope: this
                            });
                        }
                    });
                }
            }, {
                xtype: 'tbseparator'
            },  {
                xtype: 'button',
                text: 'Reconcile Periods',
                id: 'btnReconcile',
                iconCls: 'icon-reconcile',
                disabled: !Ext.core.finance.ux.Reception.getPermission('Generate Payroll', 'CanView'),
                handler: function () {
                    new Ext.core.finance.ux.PayrollReconciliation.Window({
                        title: 'Reconciliation Window', CallerId: 0
                    }).show();
                }
            }]
        }
    }, config));
}
Ext.extend(Ext.core.finance.ux.TransactionViewer.Panel, Ext.Panel, {
    initComponent: function () {
        this.items = [{
            xtype: 'TransactionViewer-grid',
            id: 'TransactionViewer-grid'
        }];
        Ext.core.finance.ux.TransactionViewer.Panel.superclass.initComponent.apply(this, arguments);
    }

    
});
Ext.reg('TransactionViewer-panel', Ext.core.finance.ux.TransactionViewer.Panel);
