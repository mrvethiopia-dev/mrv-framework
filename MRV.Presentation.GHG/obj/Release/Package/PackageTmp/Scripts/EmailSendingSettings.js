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




Ext.ns('Ext.core.finance.ux.emailSendingSettings');


/**
* @desc      Bank Letter Settings form
* @Author    Dawit Kiros Woldemichael
* @copyright (c) 2013, LIFT
* @date      Dec 15, 2013
* @namespace Ext.core.finance.ux.emailSendingSettings
* @class     Ext.core.finance.ux.emailSendingSettings.Form
* @extends   Ext.form.FormPanel
*/

Ext.core.finance.ux.emailSendingSettings.Form = function (config) {
    Ext.core.finance.ux.emailSendingSettings.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: ConfigurationSettings.GetSettings,
            submit: ConfigurationSettings.Update
        },
        defaults: { labelStyle: 'text-align:right;', msgTarget: 'side' },
        id: 'emailSendingSettings-form',
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
            title: 'Email Settings',
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
                        name: 'EmailSenderAddress',
                        xtype: 'textfield',
                        anchor: '100%',
                        fieldLabel: 'Sender E-mail',
                        allowBlank: false
                    }, {
                        name: 'EmailSMTPServer',
                        xtype: 'textfield',
                        anchor: '100%',
                        fieldLabel: 'SMTP Server',
                        allowBlank: false
                    }, {
                        name: 'EmailIsAuthRequired',
                        xtype: 'checkbox',
                        anchor: '100%',
                        fieldLabel: 'Authentication Required',
                        allowBlank: false
                    }, {
                        name: 'EmailUserName',
                        xtype: 'textfield',
                        anchor: '85%',
                        fieldLabel: 'User name',
                        allowBlank: false
                    }, {
                        name: 'EmailPassword',
                        xtype: 'textfield',
                        anchor: '85%',
                        inputType: 'password',
                        fieldLabel: 'Email Password',
                        allowBlank: false
                    },
                    {
                        name: 'EmailServerProtocol',
                        xtype: 'combo',
                        fieldLabel: 'Server Protocol',
                        triggerAction: 'all',
                        anchor: '100%',
                        mode: 'local',
                        editable: false,
                        forceSelection: false,
                        emptyText: '---Select---',
                        allowBlank: true,
                        store: new Ext.data.ArrayStore({
                           
                            fields: ['Id', 'Protocols'],
                            data: [[0, 'SMTP Protocol - Recommended'], [1, 'Exchange Web Service - Exchange 2007/2010'], [2, 'Exchange WebDav - Exchange 2000/2003']]
                        }),
                        valueField: 'Id',
                        displayField: 'Protocols'
                    },
                     {
                         name: 'EmailEncoding',
                         xtype: 'textfield',
                         anchor: '100%',
                         fieldLabel: 'Encoding',
                         allowBlank: false
                     },
                     {
                         name: 'EmailSubject',
                         xtype: 'textfield',
                         anchor: '100%',
                         fieldLabel: 'Subject',
                         allowBlank: false
                     },{
                         name: 'EmailPath',
                         xtype: 'textfield',
                         anchor: '100%',
                         fieldLabel: 'Temp. Files Path',
                         allowBlank: false
                     }]
                }]
            }]
        }]
        }]
    }, config));
}
Ext.extend(Ext.core.finance.ux.emailSendingSettings.Form, Ext.form.FormPanel);
Ext.reg('emailSendingSettings-form', Ext.core.finance.ux.emailSendingSettings.Form);