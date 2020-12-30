Ext.ns('Ext.core.finance.ux.payrollTimeSheetOptions');
/**
* @desc      Payroll Applicability Options  form
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      October 08, 2013
* @namespace Ext.core.finance.ux.payrollTimeSheetOptions
* @class     Ext.core.finance.ux.payrollTimeSheetOptions.Form
* @extends   Ext.form.FormPanel
*/

Ext.core.finance.ux.payrollTimeSheetOptions.Form = function (config) {
    Ext.core.finance.ux.payrollTimeSheetOptions.Form.superclass.constructor.call(this, Ext.apply({
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:left;',
            msgTarget: 'side',
            bodyStyle: 'background:transparent;padding:5px'
        },
        id: 'payrollTimeSheetOptions-form',
        labelWidth: 115,
        height: 50,
        border: false,
        layout: 'form',
        bodyStyle: 'background:transparent;padding:5px',
        baseCls: 'x-plain',

        items: [{
            xtype: 'numberfield',
            name: 'ActualDaysWorked',
           fieldLabel: 'Actual Days'
              
        }]
    }, config));
};
Ext.extend(Ext.core.finance.ux.payrollTimeSheetOptions.Form, Ext.form.FormPanel);
Ext.reg('payrollTimeSheetOptions-form', Ext.core.finance.ux.payrollTimeSheetOptions.Form);


/**
* @desc      payrollTimeSheetOptions window
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      October 08, 2013
* @namespace Ext.core.finance.ux.payrollTimeSheetOptions
* @class     Ext.core.finance.ux.payrollTimeSheetOptions.Window
* @extends   Ext.Window
*/
Ext.core.finance.ux.payrollTimeSheetOptions.Window = function (config) {
    Ext.core.finance.ux.payrollTimeSheetOptions.Window.superclass.constructor.call(this, Ext.apply({
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
                //this.CallerId = 1;
            },
            scope: this
        }
    }, config));
}
Ext.extend(Ext.core.finance.ux.payrollTimeSheetOptions.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.core.finance.ux.payrollTimeSheetOptions.Form();
        this.items = [this.form];
        this.buttons = [{
            text: 'Add',
            iconCls: 'icon-save',
            handler: function () {


                var grid = Ext.getCmp('PayrollTimeSheet-grid');
                var count = grid.getStore().getCount();
                var models = grid.getStore().getRange();

                var actDays = this.form.getForm().findField('ActualDaysWorked').getValue();

                if (this.TotalDays < actDays) {
                    Ext.MessageBox.show({
                        title: 'Reminder',
                        msg: 'The amount provided is greater than the number of working days for the selected month. Are you sure you want to continue? ',
                        buttons: Ext.Msg.OK,
                        icon: Ext.MessageBox.WARNING,
                        scope: this
                    });
                }
                for (var i = 0; i < count; i++) {

                    models[i].set("NoOfDaysWorked", actDays);
                }

            },
            scope: this
        }, {
            text: 'Close',
            iconCls: 'icon-exit',
            handler: this.onClose,
            scope: this
        }];

        Ext.core.finance.ux.payrollTimeSheetOptions.Window.superclass.initComponent.call(this, arguments);
    },
    onClose: function () {
        this.close();
    }
});
Ext.reg('PayrollItems-window', Ext.core.finance.ux.payrollTimeSheetOptions.Window);
