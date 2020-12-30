Ext.ns('Ext.core.finance.ux.payrollApplicabilityDepartments');
/**
* @desc      Payroll Applicability Options  form
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      October 08, 2013
* @namespace Ext.core.finance.ux.payrollApplicabilityDepartments
* @class     Ext.core.finance.ux.payrollApplicabilityDepartments.Form
* @extends   Ext.form.FormPanel
*/

Ext.core.finance.ux.payrollApplicabilityDepartments.Form = function (config) {
    Ext.core.finance.ux.payrollApplicabilityDepartments.Form.superclass.constructor.call(this, Ext.apply({
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:left;',
            msgTarget: 'side',
            bodyStyle: 'background:transparent;padding:5px'
        },
        id: 'payrollApplicabilityDepartments-form',
        labelWidth: 115,
        height: 100,
        border: false,
        layout: 'form',
        bodyStyle: 'background:transparent;padding:5px',
        baseCls: 'x-plain',

        items: [{
            id: 'AppDepartmentId',
            hiddenName: 'AppDepartmentId',
            xtype: 'combo',
            fieldLabel: 'Department',
            anchor: '96.5%',
            triggerAction: 'all',
            mode: 'local',
            editable: true,
            typeAhead: true,
            forceSelection: true,
            emptyText: ' ',
            allowBlank: false,
            store: new Ext.data.DirectStore({
                reader: new Ext.data.JsonReader({
                    successProperty: 'success',
                    idProperty: 'Id',
                    root: 'data',
                    fields: ['Id', 'Name']
                }),
                autoLoad: true,
                api: { read: Tsa.GetDepartments }
            }),
            valueField: 'Id', displayField: 'Name'
        }]
    }, config));
};
Ext.extend(Ext.core.finance.ux.payrollApplicabilityDepartments.Form, Ext.form.FormPanel);
Ext.reg('payrollApplicabilityDepartments-form', Ext.core.finance.ux.payrollApplicabilityDepartments.Form);


/**
* @desc      payrollApplicabilityDepartments window
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      October 08, 2013
* @namespace Ext.core.finance.ux.payrollApplicabilityDepartments
* @class     Ext.core.finance.ux.payrollApplicabilityDepartments.Window
* @extends   Ext.Window
*/
Ext.core.finance.ux.payrollApplicabilityDepartments.Window = function (config) {
    Ext.core.finance.ux.payrollApplicabilityDepartments.Window.superclass.constructor.call(this, Ext.apply({
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
Ext.extend(Ext.core.finance.ux.payrollApplicabilityDepartments.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.core.finance.ux.payrollApplicabilityDepartments.Form();
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

        Ext.core.finance.ux.payrollApplicabilityDepartments.Window.superclass.initComponent.call(this, arguments);
    },
    onAdd: function () {

        if (this.CallerId > 0) {
            var grid = Ext.getCmp('attachPayrollItemsDetail-grid');
            var count = grid.getStore().getCount();
            var models = grid.getStore().getRange();

            var deptId = this.form.getForm().findField('AppDepartmentId').getValue();
            var deptName = this.form.getForm().findField('AppDepartmentId').getRawValue();
            
            for (var i = 0; i < count; i++) {

                models[i].set("Department", deptName);
                models[i].set("DeptId", deptId);
               
            }


        }

    },
    onClose: function () {
        this.close();
    }
});
Ext.reg('PayrollItems-window', Ext.core.finance.ux.payrollApplicabilityDepartments.Window);
