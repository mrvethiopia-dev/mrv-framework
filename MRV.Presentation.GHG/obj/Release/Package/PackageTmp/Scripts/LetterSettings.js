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
*   *          Bank Letter                    *
*   *              Settings Form              *
*   *                                         *
*   *                                         *
*   *                                         *
*   *******************************************
*
****************************************************************************************
****************************************************************************************/




Ext.ns('Ext.core.finance.ux.letterSettings');


/**
* @desc      Bank Letter Settings form
* @Author    Dawit Kiros Woldemichael
* @copyright (c) 2013, LIFT
* @date      Dec 15, 2013
* @namespace Ext.core.finance.ux.letterSettings
* @class     Ext.core.finance.ux.letterSettings.Form
* @extends   Ext.form.FormPanel
*/

Ext.core.finance.ux.letterSettings.Form = function (config) {
    Ext.core.finance.ux.letterSettings.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: ConfigurationSettings.GetSettings,
            submit: ConfigurationSettings.Update
        },
        defaults: { labelStyle: 'text-align:right;', msgTarget: 'side' },
        id: 'letterSettings-form',
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
            title: 'Letter Settings',
            bodystyle: 'padding-0px',
            labelstyle: 'text-align:left;',
            autoWidth: true,
            height: 350,
            items: [{
                layout: 'column',
                items: [{
                    columnWidth: .50,
                    defaults: {
                        labelStyle: 'text-align:left;',
                        msgTarget: 'side'
                    },
                    border: false,
                    layout: 'form',
                    items: [{
                        name: 'Id',
                        xtype: 'hidden'
                    }, {
                        name: 'BankName',
                        xtype: 'textfield',
                        anchor: '100%',
                        fieldLabel: 'Bank Name',
                        allowBlank: false
                    }, {
                        name: 'BankBranchName',
                        xtype: 'textfield',
                        anchor: '100%',
                        fieldLabel: 'Bank Branch Name',
                        allowBlank: false
                    }, {
                        name: 'BankRegion',
                        xtype: 'textfield',
                        anchor: '100%',
                        fieldLabel: 'Bank Region',
                        allowBlank: false
                    }, {
                        name: 'BankAccountNo',
                        xtype: 'textfield',
                        anchor: '85%',
                        fieldLabel: 'Bank Account No',
                        allowBlank: false
                    }, 
//                    {
//                        name: 'NameProgrammeManager',
//                        xtype: 'textfield',
//                        anchor: '100%',
//                        fieldLabel: 'Programme Manager',
//                        allowBlank: false
                    //                    }, 
                    {
                        xtype: 'compositefield',
                        fieldLabel: 'Programme Manager',
                        defaults: { flex: 1 },
                        items: [
                            {
                                xtype: 'textfield',
                                name: 'NameProgrammeManager',
                                anchor: '100%',
                                allowBlank: false
                                
                            },
                            {
                                id: 'NameIsProgramMgrActive',
                                name: 'NameIsProgramMgrActive',
                                xtype: 'checkbox',
                               anchor: '100%',
                                width: 15,
                                listeners: {
                                    scope: this,
                                    check: function(Checkbox, checked) {

                                        var form = Ext.getCmp('letterSettings-form').getForm();
                                       
                                        if (checked) {
                                            form.findField('NameIsDeputyMgrActive').setValue(false);
                                        } else {
                                            form.findField('NameIsDeputyMgrActive').setValue(true);
                                        }
                                    }
                                }
                            }
                        ]

                    },
//                    {
//                        name: 'NameViceProgrammManager',
//                        xtype: 'textfield',
//                        anchor: '100%',
//                        fieldLabel: 'Deputy Programme Manager',
//                        allowBlank: false
                        //                    }, 
                    {
                        xtype: 'compositefield',
                        fieldLabel: 'Deputy Programme Manager',
                        defaults: { flex: 1 },
                        items: [
                            {
                                xtype: 'textfield',
                                name: 'NameViceProgrammManager',
                                anchor: '100%',
                                allowBlank: false

                            },
                            {
                                id: 'NameIsDeputyMgrActive',
                                name: 'NameIsDeputyMgrActive',
                                xtype: 'checkbox',
                                anchor: '100%',
                                width: 15,
                                listeners: {
                                    scope: this,
                                    check: function(Checkbox, checked) {
                                        var form = Ext.getCmp('letterSettings-form').getForm();

                                        if (checked) {
                                            form.findField('NameIsProgramMgrActive').setValue(false);
                                        } else {
                                            form.findField('NameIsProgramMgrActive').setValue(true);
                                        }

                                    }
                                }
                            }
                        ]

                    },
                    {
                        name: 'NameFinanceAndLogistics',
                        xtype: 'textfield',
                        anchor: '100%',
                        fieldLabel: 'Finance & Logistics Manager',
                        allowBlank: false
                    }, {
                        name: 'NameMAndEManager',
                        xtype: 'textfield',
                        anchor: '100%',
                        fieldLabel: 'M&E Manager',
                        allowBlank: false
                    }]
                }]
            }]
        }]
        }]
    }, config));
}
Ext.extend(Ext.core.finance.ux.letterSettings.Form, Ext.form.FormPanel);
Ext.reg('letterSettings-form', Ext.core.finance.ux.letterSettings.Form);