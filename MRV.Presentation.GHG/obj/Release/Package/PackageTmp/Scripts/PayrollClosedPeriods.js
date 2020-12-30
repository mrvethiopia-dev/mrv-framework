Ext.ns('Ext.core.finance.ux.payrollClosedPeriods');
/**
* @desc      Payroll Change Password  form
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      October 08, 2013
* @namespace Ext.core.finance.ux.payrollClosedPeriods
* @class     Ext.core.finance.ux.payrollClosedPeriods.Form
* @extends   Ext.form.FormPanel
*/

Ext.core.finance.ux.payrollClosedPeriods.Form = function (config) {
    Ext.core.finance.ux.payrollClosedPeriods.Form.superclass.constructor.call(this, Ext.apply({
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:left;',
            msgTarget: 'side',
            bodyStyle: 'background:transparent;padding:5px'
        },
        id: 'payrollClosedPeriods-form',
        labelWidth: 115,
        height: 100,
        border: false,
        layout: 'form',
        bodyStyle: 'background:transparent;padding:5px',
        baseCls: 'x-plain',

        items: [{
            id: 'closedPeriodId', xtype: 'combo', anchor: '55%', fieldLabel: 'Period', triggerAction: 'all', mode: 'local', editable: true, typeAhead: true,
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
            valueField: 'Id', displayField: 'Name',
            listeners: {

                }
            }
        }]
    }, config));
};
Ext.extend(Ext.core.finance.ux.payrollClosedPeriods.Form, Ext.form.FormPanel);
Ext.reg('payrollClosedPeriods-form', Ext.core.finance.ux.payrollClosedPeriods.Form);


/**
* @desc      payrollClosedPeriods window
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      October 08, 2013
* @namespace Ext.core.finance.ux.payrollClosedPeriods
* @class     Ext.core.finance.ux.payrollClosedPeriods.Window
* @extends   Ext.Window
*/
Ext.core.finance.ux.payrollClosedPeriods.Window = function (config) {
    Ext.core.finance.ux.payrollClosedPeriods.Window.superclass.constructor.call(this, Ext.apply({
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
Ext.extend(Ext.core.finance.ux.payrollClosedPeriods.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.core.finance.ux.payrollClosedPeriods.Form();
        this.items = [this.form];
        this.buttons = [{
            text: 'Unlock',
            iconCls: 'icon-accept',
            handler: this.onChange,
            scope: this
        }, {
            text: 'Close',
            iconCls: 'icon-exit',
            handler: this.onClose,
            scope: this
        }];

        Ext.core.finance.ux.payrollClosedPeriods.Window.superclass.initComponent.call(this, arguments);
    },
    onChange: function () {


       var periodId = Ext.getCmp('PeriodId').getValue();

        if (periodId == '') {

            Ext.MessageBox.show({
                title: 'Period',
                msg: 'Please select a period to close!',
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.ERROR,
                scope: this
            });
            return;
        }
        window.User.payrollClosedPeriods(oldPassword, newPassword, confirmPassword, currentUser, function (response) {
            var form = Ext.getCmp('payrollClosedPeriods-form');
            form.getForm().reset();
            Ext.MessageBox.alert('Change Password', response.data);
        });
    },
    onClose: function () {
        this.close();
    }
});
Ext.reg('payrollClosedPeriods-window', Ext.core.finance.ux.payrollClosedPeriods.Window);
