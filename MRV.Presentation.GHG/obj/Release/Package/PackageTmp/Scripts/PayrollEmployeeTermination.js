Ext.ns('Ext.core.finance.ux.payrollEmployeeTermination');
/**
* @desc      Payroll Change Password  form
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      October 08, 2013
* @namespace Ext.core.finance.ux.payrollEmployeeTermination
* @class     Ext.core.finance.ux.payrollEmployeeTermination.Form
* @extends   Ext.form.FormPanel
*/

Ext.core.finance.ux.payrollEmployeeTermination.Form = function (config) {
    Ext.core.finance.ux.payrollEmployeeTermination.Form.superclass.constructor.call(this, Ext.apply({
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:left;',
            msgTarget: 'side',
            bodyStyle: 'background:transparent;padding:5px'
        },
        id: 'payrollEmployeeTermination-form',
        labelWidth: 115,
        height: 100,
        border: false,
        layout: 'form',
        bodyStyle: 'background:transparent;padding:5px',
        baseCls: 'x-plain',

        items: [{
            name: 'EmpId',
            xtype: 'textfield',
            fieldLabel: 'EmpId',
            allowBlank: true,
            hidden: true
        }, {
            name: 'Reason',
            xtype: 'textarea',
            fieldLabel: 'Reason',
            allowBlank: true
        }, {
            name: 'TerminationDate',
            xtype: 'datefield',
            fieldLabel: 'Termination Date',
            //altFormats: 'c',
            editable: true,
            allowBlank: false
        }]
    }, config));
};
Ext.extend(Ext.core.finance.ux.payrollEmployeeTermination.Form, Ext.form.FormPanel);
Ext.reg('payrollEmployeeTermination-form', Ext.core.finance.ux.payrollEmployeeTermination.Form);


/**
* @desc      payrollEmployeeTermination window
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      October 08, 2013
* @namespace Ext.core.finance.ux.payrollEmployeeTermination
* @class     Ext.core.finance.ux.payrollEmployeeTermination.Window
* @extends   Ext.Window
*/
Ext.core.finance.ux.payrollEmployeeTermination.Window = function (config) {
    Ext.core.finance.ux.payrollEmployeeTermination.Window.superclass.constructor.call(this, Ext.apply({
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
                this.form.getForm().findField('EmpId').setValue(this.EmployeeId);
                
            },
            scope: this
        }
    }, config));
}
Ext.extend(Ext.core.finance.ux.payrollEmployeeTermination.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.core.finance.ux.payrollEmployeeTermination.Form();
        this.items = [this.form];
        this.buttons = [{
            text: 'Terminate',
            iconCls: 'icon-exclamation',
            handler: this.onTermination,
            scope: this
        }, {
            text: 'Close',
            iconCls: 'icon-exit',
            handler: this.onClose,
            scope: this
        }];

        Ext.core.finance.ux.payrollEmployeeTermination.Window.superclass.initComponent.call(this, arguments);
    },
    onTermination: function () {


        var empId = this.form.getForm().findField('EmpId').getValue();
        var reason = this.form.getForm().findField('Reason').getValue();
        var termDate = this.form.getForm().findField('TerminationDate').getValue();

        
 
        window.PayrollEmployees.Terminate(empId, reason, termDate, function (response) {
            var form = Ext.getCmp('payrollEmployeeTermination-form');
            var gridEmployees = Ext.getCmp('PayrollEmployees-grid');
            form.getForm().reset();
            gridEmployees.getStore().load({
                params: { start: 0, limit: gridEmployees.pageSize }
            });
            Ext.MessageBox.alert('Employee Termination', response.data);
        });
    },
    onClose: function () {
        this.close();
    }
});
Ext.reg('payrollEmployeeTermination-window', Ext.core.finance.ux.payrollEmployeeTermination.Window);
