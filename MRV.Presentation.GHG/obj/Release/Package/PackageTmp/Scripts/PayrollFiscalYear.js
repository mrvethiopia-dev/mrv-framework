Ext.ns('Ext.core.finance.ux.fiscalYear');
/**
* @desc      Payroll Change FiscalYear  form
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      October 08, 2013
* @namespace Ext.core.finance.ux.fiscalYear
* @class     Ext.core.finance.ux.fiscalYear.Form
* @extends   Ext.form.FormPanel
*/

Ext.core.finance.ux.fiscalYear.Form = function (config) {
    Ext.core.finance.ux.fiscalYear.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: ConfigurationSettings.LoadFiscalYear,
            submit: Tsa.SaveFiscalYear
        },
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:left;',
            msgTarget: 'side',
            bodyStyle: 'background:transparent;padding:5px'
        },
        id: 'fiscalYear-form',
        labelWidth: 115,
        height: 35,
        border: false,
        layout: 'form',
        bodyStyle: 'background:transparent;padding:5px',
        baseCls: 'x-plain',

        items: [{
            name: 'Id',
            xtype: 'hidden'
        }, {
            name: 'ActiveFiscalYear',
            xtype: 'textfield',
            fieldLabel: 'Active Fiscal Year',            
            allowBlank: false
        }]
    }, config));
};
Ext.extend(Ext.core.finance.ux.fiscalYear.Form, Ext.form.FormPanel);
Ext.reg('fiscalYear-form', Ext.core.finance.ux.fiscalYear.Form);


/**
* @desc      fiscalYear window
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      October 08, 2013
* @namespace Ext.core.finance.ux.fiscalYear
* @class     Ext.core.finance.ux.fiscalYear.Window
* @extends   Ext.Window
*/
Ext.core.finance.ux.fiscalYear.Window = function (config) {
    Ext.core.finance.ux.fiscalYear.Window.superclass.constructor.call(this, Ext.apply({
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
                this.form.load();
            },
            scope: this
        }
    }, config));
}
Ext.extend(Ext.core.finance.ux.fiscalYear.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.core.finance.ux.fiscalYear.Form();
        this.items = [this.form];
        this.buttons = [{
            text: 'Set',
            iconCls: 'icon-Unclose',
            handler: this.onSave,
            scope: this
        }, {
            text: 'Close',
            iconCls: 'icon-exit',
            handler: this.onClose,
            scope: this
        }];

        Ext.core.finance.ux.fiscalYear.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {
        if (!this.form.getForm().isValid()) return;
        var fYear = this.form.getForm().findField('ActiveFiscalYear').getValue();
        window.Tsa.SaveFiscalYear(fYear, function (response) {
            
            Ext.MessageBox.alert('Active Fiscal Year', response.data);
        });
    },
    onClose: function () {
        this.close();
    }
});
Ext.reg('fiscalYear-window', Ext.core.finance.ux.fiscalYear.Window);
