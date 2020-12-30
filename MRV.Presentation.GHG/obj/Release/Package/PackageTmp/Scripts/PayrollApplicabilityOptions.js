Ext.ns('Ext.core.finance.ux.payrollApplicabilityOptions');
/**
* @desc      Payroll Applicability Options  form
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      October 08, 2013
* @namespace Ext.core.finance.ux.payrollApplicabilityOptions
* @class     Ext.core.finance.ux.payrollApplicabilityOptions.Form
* @extends   Ext.form.FormPanel
*/

Ext.core.finance.ux.payrollApplicabilityOptions.Form = function (config) {
    Ext.core.finance.ux.payrollApplicabilityOptions.Form.superclass.constructor.call(this, Ext.apply({
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:left;',
            msgTarget: 'side',
            bodyStyle: 'background:transparent;padding:5px'
        },
        id: 'payrollApplicabilityOptions-form',
        labelWidth: 115,
        height: 100,
        border: false,
        layout: 'form',
        bodyStyle: 'background:transparent;padding:5px',
        baseCls: 'x-plain',

        items: [{ xtype: 'combo', name: 'ApplyAlways', xtype: 'combo', fieldLabel: 'Apply Always', triggerAction: 'all', mode: 'local', editable: false,
            typeAhead: true, forceSelection: true, emptyText: '---Select---', allowBlank: true,
            store: new Ext.data.SimpleStore({
                fields: ['id', 'name'],
                data: [['1', 'No'], ['2', 'Yes']]
            }),
            valueField: 'name',
            displayField: 'name',
            width: 120,
            listeners: {
                select: function () {
                    
                    var form = Ext.getCmp('payrollApplicabilityOptions-form').getForm();
                    var xx = this.getRawValue();
                    switch (this.getRawValue()) {
                        case 'Yes':
                            form.findField('PItemApplicableFrom').setDisabled(true);
                            form.findField('PItemApplicableFrom').setValue('1/1/2000');
                            form.findField('PItemApplicableTo').setDisabled(true);
                            form.findField('PItemApplicableTo').setValue('1/1/2099');
                            break;
                        case 'No':
                            form.reset();
//                            form.findField('PItemApplicableFrom').show();
//                            form.findField('PItemApplicableTo').show();
                            form.findField('PItemApplicableFrom').setDisabled(false);
                            form.findField('PItemApplicableTo').setDisabled(false);
                            break;
                        default:
                            break;
                    }
                }
            }
        }, {
            name: 'PItemApplicableFrom',
            xtype: 'datefield',
            fieldLabel: 'Applicable From',
            //altFormats: 'c',
            editable: true,
            allowBlank: true
        }, {
            name: 'PItemApplicableTo',
            xtype: 'datefield',
            fieldLabel: 'Applicable To',
            //altFormats: 'c',
            editable: true,
            allowBlank: true
        }]
    }, config));
};
Ext.extend(Ext.core.finance.ux.payrollApplicabilityOptions.Form, Ext.form.FormPanel);
Ext.reg('payrollApplicabilityOptions-form', Ext.core.finance.ux.payrollApplicabilityOptions.Form);


/**
* @desc      payrollApplicabilityOptions window
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      October 08, 2013
* @namespace Ext.core.finance.ux.payrollApplicabilityOptions
* @class     Ext.core.finance.ux.payrollApplicabilityOptions.Window
* @extends   Ext.Window
*/
Ext.core.finance.ux.payrollApplicabilityOptions.Window = function (config) {
    Ext.core.finance.ux.payrollApplicabilityOptions.Window.superclass.constructor.call(this, Ext.apply({
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
Ext.extend(Ext.core.finance.ux.payrollApplicabilityOptions.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.core.finance.ux.payrollApplicabilityOptions.Form();
        this.items = [this.form];
        this.buttons = [{
            text: 'Add',
            iconCls: 'icon-save',
            handler: this.onAdd,
            scope: this
        }, {
            text: 'Close',
            iconCls: 'icon-exit',
            handler: this.onClose,
            scope: this
        }];

        Ext.core.finance.ux.payrollApplicabilityOptions.Window.superclass.initComponent.call(this, arguments);
    },
    onAdd: function () {

        if (this.CallerId > 0) {
            var grid = Ext.getCmp('attachPayrollItemsDetail-grid');
            var count = grid.getStore().getCount();
            var models = grid.getStore().getRange();

            var appAlways = this.form.getForm().findField('ApplyAlways').getValue();
            var appFrom = this.form.getForm().findField('PItemApplicableFrom').getValue();
            var appto = this.form.getForm().findField('PItemApplicableTo').getValue();

            for (var i = 0; i < count; i++) {

                models[i].set("ApplyAlways", appAlways);
                models[i].set("ApplicableFrom", appFrom);
                models[i].set("ApplicableTo", appto);
            }


        }

    },
    onClose: function () {
        this.close();
    }
});
Ext.reg('PayrollItems-window', Ext.core.finance.ux.payrollApplicabilityOptions.Window);
