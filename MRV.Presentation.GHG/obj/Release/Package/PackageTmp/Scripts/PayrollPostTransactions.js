Ext.ns('Ext.core.finance.ux.PayrollPostTransactions');
/**
* @desc      Posting Transactions registration form
* @author    Dawit Kiros
* @copyright (c) 2013, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.PayrollPostTransactions
* @class     Ext.core.finance.ux.PayrollPostTransactions.Form
* @extends   Ext.form.FormPanel
*/
Ext.core.finance.ux.PayrollPostTransactions.Form = function (config) {
    Ext.core.finance.ux.PayrollPostTransactions.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: PayrollJournals.GetJournalsByPeriodIdId,
            submit: PayrollItems.Save
        },
        paramOrder: ['Id'],
        defaults: {
            labelStyle: 'text-align:left;',
            msgTarget: 'side'
        },
        id: 'PayrollPostTransactions-form',
        padding: 5,
        labelWidth: 120,
        autoHeight: true,
        border: false,
        isFormLoad: false,
        frame: true,
        items: []
    }, config));
}
Ext.extend(Ext.core.finance.ux.PayrollPostTransactions.Form, Ext.form.FormPanel);
Ext.reg('PayrollPostTransactions-form', Ext.core.finance.ux.PayrollPostTransactions.Form);


/**
* @desc      Posting Transactions registration form host window
* @author    Dawit Kiros
* @copyright (c) 2013, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.PayrollPostTransactions
* @class     Ext.core.finance.ux.PayrollPostTransactions.Window
* @extends   Ext.Window
*/
Ext.core.finance.ux.PayrollPostTransactions.Window = function (config) {
    Ext.core.finance.ux.PayrollPostTransactions.Window.superclass.constructor.call(this, Ext.apply({
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
                this.form.getForm().findField('Id').setValue(this.PayrollPostTransactionsId);
                if (this.PayrollPostTransactionsId != '') {
                    this.form.load({ params: { Id: this.PayrollPostTransactionsId} });
                }
            },
            scope: this
        }
    }, config));
}
Ext.extend(Ext.core.finance.ux.PayrollPostTransactions.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.core.finance.ux.PayrollPostTransactions.Form();
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

        Ext.core.finance.ux.PayrollPostTransactions.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {

        if (!this.form.getForm().isValid()) return;
        this.form.getForm().submit({
            waitMsg: 'Please wait...',
            success: function () {
                Ext.getCmp('PayrollPostTransactions-form').getForm().reset();
                Ext.getCmp('PayrollPostTransactions-paging').doRefresh();
            }
        });
    },
    onClose: function () {
        this.close();
    }
});
Ext.reg('PayrollPostTransactions-window', Ext.core.finance.ux.PayrollPostTransactions.Window);

/**
* @desc      Posting Transactionss grid
* @author    Dawit Kiros
* @copyright (c) 2013, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.PayrollPostTransactions
* @class     Ext.core.finance.ux.PayrollPostTransactions.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.core.finance.ux.PayrollPostTransactions.Grid = function (config) {
    Ext.core.finance.ux.PayrollPostTransactions.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn:  PayrollJournals.GetJournalsByPeriodIdId,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|PeriodId',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'ASC'
            },
            fields: ['Id', 'Description', 'Department', 'Account', 'Debit', 'Credit'],
            remoteSort: true,
            listeners: {
                beforeLoad: function () {
                    Ext.getCmp('PayrollPostTransactions-grid').body.mask('Loading...', 'x-mask-loading');
                },
                load: function () {
                    var grid = Ext.getCmp('PayrollPostTransactions-grid');
                    //var store = grid.getStore();

                    grid.body.unmask();
                },
                loadException: function () {
                    Ext.getCmp('PayrollPostTransactions-grid').body.unmask();
                },
                remove: function (store) {
                    var grid = Ext.getCmp('PayrollPostTransactions-grid');

                },
                scope: this
            }
        }),
        id: 'PayrollPostTransactions-grid',
        PeriodId: 0,
        pageSize: 30,
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
            dataIndex: 'Description', 
            header: 'Description',
            sortable: true,
            width: 220,
            menuDisabled: false
        }, {
            dataIndex: 'Department', 
            header: 'Department',
            sortable: true,
            width: 200,
            menuDisabled: true,
            hidden: true
        }, {
            dataIndex: 'Account',
            header: 'Account',
            sortable: true,
            width: 200,
            menuDisabled: true
        }, {
            dataIndex:  'Debit', 
            header: 'Debit',
            sortable: true,
            width: 220,
            menuDisabled: true
        }, {
            dataIndex: 'Credit',
            header: 'Credit',
            sortable: true,
            width: 220,
            hidden: false,
            menuDisabled: true
        }]
    }, config));
};
Ext.extend(Ext.core.finance.ux.PayrollPostTransactions.Grid, Ext.grid.EditorGridPanel, {
    initComponent: function () {
       // this.store.baseParams = { record: Ext.encode({ mode: 'get' }) };
//        this.tbar = [];
//        this.bbar = new Ext.PagingToolbar({
//            id: 'PayrollPostTransactions-paging',
//            store: this.store,
//            displayInfo: true,
//            pageSize: this.pageSize
//        });
        Ext.core.finance.ux.PayrollPostTransactions.Grid.superclass.initComponent.apply(this, arguments);
    }
//    afterRender: function () {
//        this.getStore().load({
//            params: { start: 0, limit: this.pageSize }
//        });
//        Ext.core.finance.ux.PayrollPostTransactions.Grid.superclass.afterRender.apply(this, arguments);
//    }
});
Ext.reg('PayrollPostTransactions-grid', Ext.core.finance.ux.PayrollPostTransactions.Grid);

/**
* @desc      Posting Transactionss panel
* @author    Dawit Kiros
* @copyright (c) 2013, LIFT
* @date      July 01, 2013
* @version   $Id: PayrollPostTransactions.js, 0.1
* @namespace Ext.core.finance.ux.PayrollPostTransactions
* @class     Ext.core.finance.ux.PayrollPostTransactions.Panel
* @extends   Ext.Panel
*/
Ext.core.finance.ux.PayrollPostTransactions.Panel = function (config) {
    Ext.core.finance.ux.PayrollPostTransactions.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false,
        tbar: {
            xtype: 'toolbar',
            items: [{
            xtype: 'displayfield',
            value: 'Select Period',
            width: 95
        }, 
        {
            id: 'postingPeriodId', xtype: 'combo', anchor: '55%', fieldLabel: 'Period', triggerAction: 'all', mode: 'local', editable: false, typeAhead: true,
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
             select: function() {
                    var periodId = Ext.getCmp('postingPeriodId').getValue();

                    var jrnlGrid = Ext.getCmp('PayrollPostTransactions-grid');
                    Ext.Ajax.timeout = 6000000;
                    jrnlGrid.getStore().load({
                        params: {
                            start: 0,
                            limit: 10,
                            sort: '',
                            dir: '',
                            PeriodId: periodId
                        }

                    });

                }


            }
    }
    , {
        xtype: 'tbseparator'
    }, {
                xtype: 'button',
                text: 'Generate Journal',
                id: 'postPayrollPostTransactions',
                iconCls: 'icon-transaction',
                handler: this.onGenerateJournalClick,
                disabled: !Ext.core.finance.ux.Reception.getPermission('Generate Payroll Journal', 'CanAdd')
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Post to Finance',
                id: 'btnPostToFinance',
                iconCls: 'icon-lists',
                handler: this.onPostJournalClick,
                disabled: !Ext.core.finance.ux.Reception.getPermission('Generate Payroll Journal', 'CanAdd')
            }]
        }
    }, config));
}
Ext.extend(Ext.core.finance.ux.PayrollPostTransactions.Panel, Ext.Panel, {
    initComponent: function () {
        this.items = [{
            xtype: 'PayrollPostTransactions-grid',
            id: 'PayrollPostTransactions-grid'
        }];
        Ext.core.finance.ux.PayrollPostTransactions.Panel.superclass.initComponent.apply(this, arguments);
    },

    onGenerateJournalClick: function () {
        Ext.MessageBox.show({
            msg: 'The process of journalizing payroll for the selected month may take several minutes depending on the size of transactions, please wait...',
            progressText: 'Saving...',
            title : 'Journalizing Transactions',
            width: 400,
            wait: true,
            waitConfig: { interval: 5000 }
        });
                    var periodId = Ext.getCmp('postingPeriodId').getValue();

                    Ext.Ajax.timeout = 6000000;
                    PayrollJournals.GenerateJournals(periodId, function (result) {
                        if (result.success) {
                            Ext.MessageBox.alert('Payroll Journal', 'Payroll Journal for the selected month has been generated successfully!');

                            var periodId = Ext.getCmp('postingPeriodId').getValue();
                            var jrnlGrid = Ext.getCmp('PayrollPostTransactions-grid');
                            jrnlGrid.getStore().load({
                                params: {

                                    start: 0,
                                    limit: 10,
                                    sort: '',
                                    dir: '',
                                    PeriodId: periodId
                                }

                            });
                        }else {
                            Ext.MessageBox.show({
                                title: 'Error',
                                msg: result.data,
                                buttons: Ext.Msg.OK,
                                icon: Ext.MessageBox.ERROR,
                                scope: this
                            });
                        }
                    });


                    //Ext.MessageBox.hide();
            
     

    }, onPostJournalClick: function () {
        Ext.MessageBox.show({
            msg: 'Posting transactions to finance module, please wait...',
            progressText: 'Creating JV...',
            title : 'Posting',
            width: 400,
            wait: true,
            waitConfig: { interval: 3000 }
        });
                    var periodId = Ext.getCmp('postingPeriodId').getValue();

                    Ext.Ajax.timeout = 6000000;
                    window.PayrollJournals.PostToFinance(periodId, function (response) {
                        if (response.success) {
                            Ext.MessageBox.show({
                                title: response.title,
                                msg: response.data,
                                buttons: Ext.Msg.OK,
                                icon: Ext.MessageBox.INFO,
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


                    //Ext.MessageBox.hide();
            
     

    }

});
Ext.reg('PayrollPostTransactions-panel', Ext.core.finance.ux.PayrollPostTransactions.Panel);