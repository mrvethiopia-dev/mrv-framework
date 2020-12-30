/*  ************************************************************************************
*   ************************************************************************************
*   
*
*
*   General UI Layout or Map
*   ________________________
*
*   *******************************************
*   *                                         *
*   *                                         *
*   *                                         *
*   *          Payroll Configuration          *
*   *              Settings Form              *
*   *                                         *
*   *                                         *
*   *                                         *
*   *******************************************
*
****************************************************************************************
****************************************************************************************/




Ext.ns('Ext.core.finance.ux.configurationSettings');


/**
* @desc      Configuration Settings form
* @Author    Dawit Kiros Woldemichael
* @copyright (c) 2013, LIFT
* @date      Dec 15, 2013
* @namespace Ext.core.finance.ux.configurationSettings
* @class     Ext.core.finance.ux.configurationSettings.Form
* @extends   Ext.form.FormPanel
*/

Ext.core.finance.ux.configurationSettings.Form = function (config) {
    Ext.core.finance.ux.configurationSettings.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: ConfigurationSettings.GetSettings,
            submit: ConfigurationSettings.Update
        },
        defaults: { labelStyle: 'text-align:right;', msgTarget: 'side' },
        id: 'configurationSettings-form',
        padding: 0,
        autoLabelWidth: true,
        border: false,
        isFormLoad: false,
        labelStyle: 'text-align:right;',
        labelWidth: 150,
        autoHeight: true,

        frame: true,
        items: [
        { items: [{
            xtype: 'fieldset',
            region: 'north',
            title: 'Other Settings',
            bodystyle: 'padding-0px',
            labelstyle: 'text-align:right;',
            autoWidth: true,
            autoHeight: true,
            items: [{
                layout: 'column',
                items: [{
                    columnWidth: .50,
                    defaults: {
                        labelStyle: 'text-align:right;',
                        msgTarget: 'side'
                    },
                    border: false,
                    layout: 'form',
                    items: [{
                        name: 'Id',
                        xtype: 'hidden'
                    }, { name: 'FuelPrice', xtype: 'numberfield', anchor: '90%', fieldLabel: 'Fuel Price', value: '0.00 ', allowBlank: false },
                    
                    { xtype: 'compositefield',
                        fieldLabel: 'Period Exchange Rate',
            defaults: { flex: 1 },
            items: [
            {
                name: 'ExchangeRate',
                xtype: 'numberfield',
                anchor: '50%',
                fieldLabel: 'ETB to GBP Exchange Rate',
                decimalPrecision: '4',
                allowBlank: false
            }, {
                id: 'ExchangeRatePeriodId', hiddenName: 'ExchangeRatePeriodId', xtype: 'combo', fieldLabel: 'Period', triggerAction: 'all', mode: 'local', editable: true, typeAhead: true,
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
            }]

        },
                    {
                        name: 'IdentityNoPrefix',
                        xtype: 'textfield',
                        anchor: '90%',
                        fieldLabel: 'Identity No. Prefix',
                        allowBlank: false
                        
                    },
                    {
                        name: 'EmployerTaxAccount',
                        xtype: 'textfield',
                        anchor: '90%',
                        fieldLabel: 'Employer Tax Account',
                        allowBlank: true

                    },
                    {
                        name: 'EmployerEnterpriseNo',
                        xtype: 'textfield',
                        anchor: '90%',
                        fieldLabel: 'Employer Enterprise No',
                        allowBlank: true

                    }]
                }]
            }]
        }, {
            xtype: 'fieldset',
            region: 'north',
            title: 'Payroll Journal Settings',
            bodystyle: 'padding-0px',
            labelstyle: 'text-align:right;',
            autoWidth: true,
            height: 200,
            items: [{
                layout: 'column',
                items: [{
                    columnWidth: .50,
                    defaults: {
                        labelStyle: 'text-align:right;',
                        msgTarget: 'side'
                    },
                    border: false,
                    layout: 'form',
                    items: [{
                        hiddenName: 'DefaultAccountForPosting',
                        xtype: 'combo',
                        fieldLabel: 'Default Account For Journals',
                        anchor: '100%',
                        triggerAction: 'all',
                        mode: 'local',
                        editable: true,
                        typeAhead: true,
                        forceSelection: true,
                        emptyText: '---Select---',
                        allowBlank: false,
                        editable: false,
                        store: new Ext.data.DirectStore({
                            reader: new Ext.data.JsonReader({
                                successProperty: 'success',
                                idProperty: 'Id',
                                root: 'data',
                                fields: ['Id', 'CodeAndName']
                            }),
                            autoLoad: true,
                            api: { read: Tsa.GetAllControlAccounts }
                        }),
                        valueField: 'Id', displayField: 'CodeAndName'
                    }, {
                        hiddenName: 'NetPayControlAccountId',
                        xtype: 'combo',
                        fieldLabel: 'Net Pay Account',
                        anchor: '100%',
                        triggerAction: 'all',
                        mode: 'local',

                        typeAhead: true,
                        forceSelection: true,
                        emptyText: '---Select---',
                        allowBlank: false,
                        editable: false,
                        store: new Ext.data.DirectStore({
                            reader: new Ext.data.JsonReader({
                                successProperty: 'success',
                                idProperty: 'Id',
                                root: 'data',
                                fields: ['Id', 'CodeAndName']
                            }),
                            autoLoad: true,
                            api: { read: Tsa.GetAllControlAccounts }
                        }),
                        valueField: 'Id', displayField: 'CodeAndName'
                    }, {
                        hiddenName: 'IncomeTaxControlAccountId',
                        xtype: 'combo',
                        fieldLabel: 'Income Tax Account',
                        anchor: '100%',
                        triggerAction: 'all',
                        mode: 'local',

                        typeAhead: true,
                        forceSelection: true,
                        emptyText: '---Select---',
                        allowBlank: false,
                        editable: false,
                        store: new Ext.data.DirectStore({
                            reader: new Ext.data.JsonReader({
                                successProperty: 'success',
                                idProperty: 'Id',
                                root: 'data',
                                fields: ['Id', 'CodeAndName']
                            }),
                            autoLoad: true,
                            api: { read: Tsa.GetAllControlAccounts }
                        }),
                        valueField: 'Id', displayField: 'CodeAndName'
                    }, {
                        hiddenName: 'PensionControlAccountId',
                        xtype: 'combo',
                        fieldLabel: 'Employee Pension Account',
                        anchor: '100%',
                        triggerAction: 'all',
                        mode: 'local',

                        typeAhead: true,
                        forceSelection: true,
                        emptyText: '---Select---',
                        allowBlank: false,
                        editable: false,
                        store: new Ext.data.DirectStore({
                            reader: new Ext.data.JsonReader({
                                successProperty: 'success',
                                idProperty: 'Id',
                                root: 'data',
                                fields: ['Id', 'CodeAndName']
                            }),
                            autoLoad: true,
                            api: { read: Tsa.GetAllControlAccounts }
                        }),
                        valueField: 'Id', displayField: 'CodeAndName'
                    }, {
                        hiddenName: 'TerminationProvisionAccountId',
                        xtype: 'combo',
                        fieldLabel: 'Termination Provision Account',
                        anchor: '100%',
                        triggerAction: 'all',
                        mode: 'local',

                        typeAhead: true,
                        forceSelection: true,
                        emptyText: '---Select---',
                        allowBlank: false,
                        editable: false,
                        store: new Ext.data.DirectStore({
                            reader: new Ext.data.JsonReader({
                                successProperty: 'success',
                                idProperty: 'Id',
                                root: 'data',
                                fields: ['Id', 'CodeAndName']
                            }),
                            autoLoad: true,
                            api: { read: Tsa.GetAllControlAccounts }
                        }),
                        valueField: 'Id', displayField: 'CodeAndName'
                    }]
                }]
            }]
        }]
        }]
    }, config));
}
Ext.extend(Ext.core.finance.ux.configurationSettings.Form, Ext.form.FormPanel);
Ext.reg('configurationSettings-form', Ext.core.finance.ux.configurationSettings.Form);