Ext.ns('Ext.core.finance.ux.PayrollReconciliation');
/**
* @desc      Payroll Applicability Options  form
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      October 08, 2013
* @namespace Ext.core.finance.ux.PayrollReconciliation
* @class     Ext.core.finance.ux.PayrollReconciliation.Form
* @extends   Ext.form.FormPanel
*/

Ext.core.finance.ux.PayrollReconciliation.Form = function (config) {
    Ext.core.finance.ux.PayrollReconciliation.Form.superclass.constructor.call(this, Ext.apply({
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:left;',
            msgTarget: 'side',
            bodyStyle: 'background:transparent;padding:5px'
        },
        id: 'PayrollReconciliation-form',
        labelWidth: 115,
        height: 100,
        border: false,
        layout: 'form',
        bodyStyle: 'background:transparent;padding:5px',
        baseCls: 'x-plain',

        items: [{
            id: 'cboPeriodOneId', xtype: 'combo', anchor: '90%', fieldLabel: 'Period One', triggerAction: 'all', mode: 'local', editable: false, typeAhead: true,
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
            valueField: 'Id', displayField: 'Name'
        }, {
            id: 'cboPeriodTwoId', xtype: 'combo', anchor: '90%', fieldLabel: 'Period Two', triggerAction: 'all', mode: 'local', editable: false, typeAhead: true,
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
            valueField: 'Id', displayField: 'Name'
        },{
            xtype: 'displayfield',
            style: 'font-weight: italic;',
            value: '',
            id: 'display',
            autoWidth: true
        }]
    }, config));
};
Ext.extend(Ext.core.finance.ux.PayrollReconciliation.Form, Ext.form.FormPanel);
Ext.reg('PayrollReconciliation-form', Ext.core.finance.ux.PayrollReconciliation.Form);


/**
* @desc      PayrollReconciliation window
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      October 08, 2013
* @namespace Ext.core.finance.ux.PayrollReconciliation
* @class     Ext.core.finance.ux.PayrollReconciliation.Window
* @extends   Ext.Window
*/
Ext.core.finance.ux.PayrollReconciliation.Window = function (config) {
    Ext.core.finance.ux.PayrollReconciliation.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        width: 350,
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;',
        listeners: {
            show: function () {
                this.CallerId = 1;
            },
            scope: this
        }
    }, config));
}
Ext.extend(Ext.core.finance.ux.PayrollReconciliation.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.core.finance.ux.PayrollReconciliation.Form();
        this.items = [this.form];
        this.buttons = [{
            text: 'Reconcile',
            iconCls: 'icon-reconcile',
            handler: this.onReconcile,
            scope: this
        }, {
            text: 'Close',
            iconCls: 'icon-exit',
            handler: this.onClose,
            scope: this
        }];

        Ext.core.finance.ux.PayrollReconciliation.Window.superclass.initComponent.call(this, arguments);
    },
    onReconcile: function () {
        Ext.MessageBox.show({
            title: 'Reconcile',
            msg: 'The process of reconciliation may take few minutes. Are you sure you want to proceed?',
            buttons: {
                ok: 'Yes',
                no: 'No'
            },
            icon: Ext.MessageBox.QUESTION,
            scope: this,
            animEl: 'Proceed',
            fn: function (btn) {
                if (btn == 'ok') {
                    var periodOne = Ext.getCmp('cboPeriodOneId').getValue();
                    var periodTwo = Ext.getCmp('cboPeriodTwoId').getValue();

                    if (periodOne == '' || periodTwo == '') {
                        Ext.MessageBox.show({
                            title: 'Periods not selected',
                            msg: 'One or more periods not selected. You must select two periods.',
                            buttons: Ext.Msg.OK,
                            icon: Ext.MessageBox.ERROR,
                            scope: this
                        });
                        return;
                    };
                    if (periodOne == periodTwo) {
                        Ext.MessageBox.show({
                            title: 'Identical Periods',
                            msg: 'Identical periods selected. Please select different periods for reconciliation.',
                            buttons: Ext.Msg.OK,
                            icon: Ext.MessageBox.ERROR,
                            scope: this
                        });
                        return;
                    };
                    if (periodOne > periodTwo) {
                        Ext.MessageBox.show({
                            title: 'Period Sequence Error',
                            msg: 'Invalid period sequence. Please correct the sequence of the periods and try again.',
                            buttons: Ext.Msg.OK,
                            icon: Ext.MessageBox.ERROR,
                            scope: this
                        });
                        return;
                    };
                    Ext.MessageBox.show({
                        msg: 'Performing Reconciliation, please wait...',
                        progressText: 'Processing...',
                        width: 300,
                        wait: true,
                        waitConfig: { interval: 40 }
                    });
                    Ext.Ajax.timeout = 6000000000;
                    window.PayrollTransactions.ReconcilePeriods(periodOne, periodTwo, function (response) {
                        if (response.success) {
                            Ext.MessageBox.show({
                                title: 'Payroll Reconciliation',
                                msg: response.data,
                                buttons: Ext.Msg.OK,
                                icon: Ext.MessageBox.INFO,
                                scope: this
                            });
//                            var reclnWindow = Ext.getCmp('PayrollReconciliation-window');
//                            reclnWindow.close();
                        } else {
                            Ext.MessageBox.show({
                                title: 'Payroll Reconciliation',
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
    },
    onClose: function () {
        this.close();
    }
});
Ext.reg('PayrollReconciliation-window', Ext.core.finance.ux.PayrollReconciliation.Window);
