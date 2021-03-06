﻿Ext.ns('Ext.mrv.ghginventory.ux.changePassword');
/**
* @desc      Payroll Change Password  form
* @author    Dawit Kiros


* @namespace Ext.mrv.ghginventory.ux.changePassword
* @class     Ext.mrv.ghginventory.ux.changePassword.Form
* @extends   Ext.form.FormPanel
*/

Ext.mrv.ghginventory.ux.changePassword.Form = function (config) {
    Ext.mrv.ghginventory.ux.changePassword.Form.superclass.constructor.call(this, Ext.apply({
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:left;',
            msgTarget: 'side',
            bodyStyle: 'background:transparent;padding:5px'
        },
        id: 'changePassword-form',
        labelWidth: 115,
        height: 100,
        border: false,
        layout: 'form',
        bodyStyle: 'background:transparent;padding:5px',
        baseCls: 'x-plain',

        items: [{
            name: 'OldPassword',
            xtype: 'textfield',
            fieldLabel: 'Old Password',
            inputType: 'password',
            allowBlank: false
        }, {
            name: 'NewPassword',
            xtype: 'textfield',
            fieldLabel: 'New Password',
            inputType: 'password',
            allowBlank: false
        }, {
            name: 'ConfirmPassword',
            xtype: 'textfield',
            fieldLabel: 'Confirm',
            inputType: 'password',
            allowBlank: false
        }]
    }, config));
};
Ext.extend(Ext.mrv.ghginventory.ux.changePassword.Form, Ext.form.FormPanel);
Ext.reg('changePassword-form', Ext.mrv.ghginventory.ux.changePassword.Form);


/**
* @desc      changePassword window
* @author    Dawit Kiros


* @namespace Ext.mrv.ghginventory.ux.changePassword
* @class     Ext.mrv.ghginventory.ux.changePassword.Window
* @extends   Ext.Window
*/
Ext.mrv.ghginventory.ux.changePassword.Window = function (config) {
    Ext.mrv.ghginventory.ux.changePassword.Window.superclass.constructor.call(this, Ext.apply({
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
Ext.extend(Ext.mrv.ghginventory.ux.changePassword.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.mrv.ghginventory.ux.changePassword.Form();
        this.items = [this.form];
        this.buttons = [{
            text: 'Change',
            iconCls: 'icon-cngpwd',
            handler: this.onChange,
            scope: this
        }, {
            text: 'Close',
            iconCls: 'icon-exit',
            handler: this.onClose,
            scope: this
        }];

        Ext.mrv.ghginventory.ux.changePassword.Window.superclass.initComponent.call(this, arguments);
    },
    onChange: function () {


        var oldPassword = this.form.getForm().findField('OldPassword').getValue();
        var newPassword = this.form.getForm().findField('NewPassword').getValue();
        var confirmPassword = this.form.getForm().findField('ConfirmPassword').getValue();
        var currentUser = Ext.getCmp('loggedInUser-toolbar').getValue();

        if (newPassword != confirmPassword) {

            Ext.MessageBox.show({
                title: 'Change Password',
                msg: 'Password Mismatch!',
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.ERROR,
                scope: this
            });
            return;
        }
        window.User.ChangePassword(oldPassword, newPassword, confirmPassword, currentUser, function (response) {
            var form = Ext.getCmp('changePassword-form');
            form.getForm().reset();
            Ext.MessageBox.alert('Change Password', response.data);
        });
    },
    onClose: function () {
        this.close();
    }
});
Ext.reg('ChangePassword-window', Ext.mrv.ghginventory.ux.changePassword.Window);
