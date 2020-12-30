Ext.ns('Ext.core.finance.ux.salaryPositionChange');
/**
* @desc      Payroll Change Salary Or Position  form
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      October 08, 2013
* @namespace Ext.core.finance.ux.salaryPositionChange
* @class     Ext.core.finance.ux.salaryPositionChange.Form
* @extends   Ext.form.FormPanel
*/

Ext.core.finance.ux.salaryPositionChange.Form = function (config) {
    Ext.core.finance.ux.salaryPositionChange.Form.superclass.constructor.call(this, Ext.apply({
        api: {

            submit: PayrollEmployees.SaveSalaryPositionChange
        },
         defaults: {
            anchor: '95%',
            labelStyle: 'text-align:left;',
            msgTarget: 'side',
            bodyStyle: 'background:transparent;padding:5px'
        },
        id: 'salaryPositionChange-form',
        labelWidth: 115,
        height: 350,
        border: false,
        layout: 'form',
        bodyStyle: 'background:transparent;padding:5px',
        baseCls: 'x-plain',
        //renderTo: 'multiselect',
        items: [{
            name: 'EmpId',
            xtype: 'textfield',
            fieldLabel: 'EmpId',
            allowBlank: true,
            hidden: true
        }, {
            hiddenName: 'ChangeType',
            xtype: 'combo',
            fieldLabel: 'Change',
            triggerAction: 'all',
            mode: 'local',
            editable: false,
            forceSelection: false,
            emptyText: '---Select---',
            allowBlank: true,
            store: new Ext.data.ArrayStore({
                fields: ['Id', 'Name'],
                data: [[1, 'Salary'], [2, 'Position']]
            }),
            valueField: 'Id',
            displayField: 'Name',
            listeners: {
                'select': function (cmb, rec, idx) {
                    var form = Ext.getCmp('salaryPositionChange-form').getForm();
                    var changeTypeCombo = this.getValue();
                    var baseCurrencyCombo = form.findField('NewBaseCurrency');
                    var effectivePeriodId = form.findField('EffectivePeriodId');
                    var effectiveDate = form.findField('EffectiveDate');
                    var reason = form.findField('Reason');
                    var newPosition = form.findField('NewPositionId');

                    if (changeTypeCombo == 1) {
                        baseCurrencyCombo.setDisabled(false);
                        effectiveDate.setDisabled(false);
                        effectivePeriodId.setDisabled(false);
                        reason.setDisabled(false);
                        newPosition.setDisabled(true);
                        newPosition.setValue('');
                    }
                    else if (changeTypeCombo == 2) {
                        baseCurrencyCombo.setDisabled(false);
                        effectiveDate.setDisabled(false);
                        effectivePeriodId.setDisabled(false);
                        reason.setDisabled(false);
                        newPosition.setDisabled(false);
                    }

                }
            }
        }, {
            name: 'PreviousPosition',
            xtype: 'textfield',
            fieldLabel: 'Previous Position',
            //anchor: '90%',
            allowBlank: true,
            disabled: true
        }, {
            hiddenName: 'NewPositionId',
            xtype: 'combo',
            fieldLabel: 'New Position',
            anchor: '96.5%',
            triggerAction: 'all',
            mode: 'local',
            editable: true,
            typeAhead: true,
            disabled: true,
            forceSelection: true,
            emptyText: '---Select Position---',
            allowBlank: true,
            store: new Ext.data.DirectStore({
                reader: new Ext.data.JsonReader({
                    successProperty: 'success',
                    idProperty: 'Id',
                    root: 'data',
                    fields: ['Id', 'Name']
                }),
                autoLoad: true,
                api: { read: Tsa.GetPositions }
            }),
            valueField: 'Id', displayField: 'Name'
        }, {
            name: 'PreviousCurrency',
            xtype: 'textfield',
            fieldLabel: 'Previous Currency',
            //anchor: '90%',
            allowBlank: true,
            disabled: true
        }, {
            name: 'PreviousSalary',
            xtype: 'textfield',
            fieldLabel: 'Previous Salary',
            //anchor: '90%',
            allowBlank: true,
            disabled: true
        }, {
            hiddenName: 'NewBaseCurrency',
            xtype: 'combo',
            fieldLabel: 'New Base Currency',
            triggerAction: 'all',
            mode: 'local',
            editable: false,
            forceSelection: false,
            disabled: true,
            emptyText: '---Select---',
            allowBlank: true,
            store: new Ext.data.ArrayStore({
                fields: ['Id', 'Name'],
                data: [[1, 'ETB'], [2, 'GBP']]
            }),
            valueField: 'Id',
            displayField: 'Name',
            listeners: {
                'select': function (cmb, rec, idx) {
                    var form = Ext.getCmp('salaryPositionChange-form').getForm();
                    var baseCurrencyCombo = this.getValue();
                    var NewSalaryETB = form.findField('NewSalaryETB');
                    var NewSalaryGBP = form.findField('NewSalaryGBP');

                    var dispFieldETB = form.findField('dispFieldETB');
                    var dispFieldGBP = form.findField('dispFieldGBP');

                    if (baseCurrencyCombo == 1) {

                        NewSalaryGBP.setValue(0);
                        NewSalaryGBP.hide();
                        dispFieldETB.hide();
                    }
                    else if (baseCurrencyCombo == 2) {

                        dispFieldETB.show();
                        NewSalaryETB.hide();
                        dispFieldGBP.hide();
                        NewSalaryGBP.show();
                    }

                }
            }
        }, {
            name: 'NewSalaryETB',
            xtype: 'currencyfield',
            fieldLabel: 'Salary ETB',
            allowNegative: false,
            
            style: 'font-weight: normal; color: Navy;border: 1px solid black;'
            
        }, {
            name: 'dispFieldETB',
            xtype: 'displayfield',
            fieldLabel: 'Salary ETB',
            hidden :true
        }, {
            name: 'NewSalaryGBP',
            xtype: 'currencyfield',
            fieldLabel: 'Salary GBP',
            allowNegative: false,
            style: 'font-weight: normal; color: Navy;border: 1px solid black;',
            
            listeners: {
                'change': function () {
                    var form = Ext.getCmp('salaryPositionChange-form');
                    var etBirr = form.getForm().findField('NewSalaryETB').getValue();
                    var gbPound = form.getForm().findField('NewSalaryGBP').getValue();
                    var excRate = form.getForm().findField('ExchangeRate').getValue();
                    if (gbPound == "" || gbPound == 0) {
                        return;
                    }
                    var result = gbPound * excRate;
                    form.getForm().findField('NewSalaryETB').setValue(result);
                    form.getForm().findField('dispFieldETB').setValue(result);
                }
            }
        }, {
            name: 'dispFieldGBP',
            xtype: 'displayfield',
            fieldLabel: 'Salary GBP',
            hidden: true
        }, {
            hiddenName: 'EffectivePeriodId', xtype: 'combo', fieldLabel: 'Eff. Period', triggerAction: 'all', mode: 'local', editable: true, typeAhead: true,
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
            name: 'EffectiveDate',
            xtype: 'datefield',
            fieldLabel: 'Effective Date',
            //altFormats: 'c',
            editable: true,
            disabled: true,
            allowBlank: false
        }, {
            name: 'Reason',
            xtype: 'textarea',
            disabled: true,
            fieldLabel: 'Reason for Change',
            allowBlank: false
        }, {
            name: 'ExchangeRate',
            xtype: 'textfield',
            disabled: true,
            fieldLabel: 'ER',
            allowBlank: true,
            hidden : true
        }]
    }, config));
};
Ext.extend(Ext.core.finance.ux.salaryPositionChange.Form, Ext.form.FormPanel);
Ext.reg('salaryPositionChange-form', Ext.core.finance.ux.salaryPositionChange.Form);


/**
* @desc      salaryPositionChange window
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      October 08, 2013
* @namespace Ext.core.finance.ux.salaryPositionChange
* @class     Ext.core.finance.ux.salaryPositionChange.Window
* @extends   Ext.Window
*/
Ext.core.finance.ux.salaryPositionChange.Window = function (config) {
    Ext.core.finance.ux.salaryPositionChange.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        width: 350,
        height: 550,
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;',
        listeners: {
            show: function () {
                this.form.getForm().findField('EmpId').setValue(this.EmployeeId);
                this.form.getForm().findField('ExchangeRate').setValue(this.ExchangeRate);

                this.form.getForm().findField('PreviousPosition').setValue(this.Position);
                this.form.getForm().findField('PreviousSalary').setValue(this.Salary);
                this.form.getForm().findField('PreviousCurrency').setValue(this.Currency);
            },
            scope: this
        }
    }, config));
}
Ext.extend(Ext.core.finance.ux.salaryPositionChange.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.core.finance.ux.salaryPositionChange.Form();
        this.items = [this.form];
        this.buttons = [{
            text: 'Save',
            iconCls: 'icon-save',
            handler: this.onSave,
            scope: this
        }, {            
            text: 'Reset',
            iconCls: 'icon-Reset',
            handler: function () {
                form = Ext.getCmp('salaryPositionChange-form').getForm().reset();
               
            },
            scope: this
        },{
            text: 'Close',
            iconCls: 'icon-exit',
            handler: this.onClose,
            scope: this
        }];

        Ext.core.finance.ux.salaryPositionChange.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {


        if (!this.form.getForm().isValid()) return;
        Ext.Ajax.timeout = 6000000;
        this.form.getForm().submit({
        
            waitMsg: 'Please wait...',
            success: function () {
                Ext.getCmp('salaryPositionChange-form').getForm().reset();

            },
            failure: function (fp, o) {
                Ext.MessageBox.show({
                    title: 'Error',
                    msg: o.result.data,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.ERROR,
                    scope: this
                });
                
            }
        });
    },
    onClose: function () {
        this.close();
    }
});
Ext.reg('salaryPositionChange-window', Ext.core.finance.ux.salaryPositionChange.Window);
