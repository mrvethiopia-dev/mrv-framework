/*  *************************************************************************************
*   *************************************************************************************
*   
*   General UI Layout or Map
*   ________________________
*
*   *******************************************
*   *  t1  *  t2  *  t3  *  t4  *  t5  *  ... *
*   *******************************************
*   *                                         *
*   *               Settings                  *
*   *          tab pages fall here            *
*   *                                         *
*   *                                         *
*   *                                         *
*   *******************************************
*
*****************************************************************************************
*****************************************************************************************/



Ext.ns('Ext.core.finance.ux.financeSettings');
Ext.ns('Ext.core.finance.ux.generalSettings');


/**
* @desc      Finance Settings form
* @Author   Dawit Kiros
* @copyright (c) 2013, Cybersoft
* @date      Dec 15, 2013
* @namespace Ext.core.finance.ux.financeSettings
* @class     Ext.core.finance.ux.financeSettings.Form
* @extends   Ext.form.FormPanel
*/

Ext.core.finance.ux.generalSettings.Form = function (config) {
    Ext.core.finance.ux.generalSettings.Form.superclass.constructor.call(this, Ext.apply({
        api: {
           //load: financeSettings.GetSettings,
           //submit: financeSettings.Update
        },
        defaults: { labelStyle: 'text-align:right;', msgTarget: 'side' },
        id: 'generalSettings-form',
        padding: 0,
        autoLabelWidth: true,
        border: false,
        isFormLoad: false,
        labelStyle: 'text-align:right;',
        labelWidth: 150,
        height: 650,
        frame: true,
        items: [{
            hiddenName: 'DefaultLocationId',
            xtype: 'combo',
            fieldLabel: 'Default Location',
            anchor: '90%',
            triggerAction: 'all',
            mode: 'local',
            editable: true,
            typeAhead: true,
            forceSelection: true,
            emptyText: '- Select Location -',
            allowBlank: false,
            store: new Ext.data.DirectStore({
                reader: new Ext.data.JsonReader({
                    successProperty: 'success',
                    idProperty: 'Id',
                    root: 'data',
                    fields: ['Id', 'CodeAndName']
                }),
                autoLoad: true,
                api: { read: Tsa.GetWoreda }
            }),
            valueField: 'Id', displayField: 'CodeAndName'
        }]
    }, config));
}

Ext.extend(Ext.core.finance.ux.generalSettings.Form, Ext.form.FormPanel);
Ext.reg('generalSettings-form', Ext.core.finance.ux.generalSettings.Form);
var tip = new Ext.slider.Tip({
    getText: function (thumb) {
        return String.format('<b>{0}% complete</b>', thumb.value);
    }
});

/**
* @desc     Employer Payroll Items form host window
* @author   Dawit Kiros
* @copyright (c) 2010, Cybersoft
* @date      Dec 15, 2013
* @namespace Ext.core.finance.ux.financeSettings
* @class     Ext.core.finance.ux.financeSettings.Window
* @extends   Ext.Window
*/

Ext.core.finance.ux.financeSettings.Window = function (config) {
    Ext.core.finance.ux.financeSettings.Window.superclass.constructor.call(this, Ext.apply({
        id: 'financeSettings-window',
        title: 'Finance Settings',
        layout: 'fit',
        width: 650,
        height: 375,
        closeAction: 'close',
        modal: true,
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;'
    }, config));
};
Ext.extend(Ext.core.finance.ux.financeSettings.Window, Ext.Window, {
    initComponent: function () {

        this.form_generalSettings = new Ext.core.finance.ux.generalSettings.Form();
        //this.form_generalSettings.load();

        // Finance Voucher Settings (Separate Js File, FinanceVoucherSettings.js)
        this.form_VS = new Ext.core.finance.ux.financeVoucherSettings.Form();
        this.grid_VS = new Ext.core.finance.ux.financeVoucherSettings.Grid();

        var scrollerMenu = new Ext.ux.TabScrollerMenu({ maxText: 15, pageSize: 5 });
        var tabs = new Ext.TabPanel({
            activeTab: 0,
            id: 'tabPanel',
            enableTabScroll: true,
            resizeTabs: true,
            minTabWidth: 75,
            border: false,
            plugins: [scrollerMenu]
        });



        tabs.add(
//        {
//            title: 'General Settings',
//            border: false,
//            layout: 'fit',
//            hidden: true,
//            id: 'genSettings',
//            height: 500,
//            items: [{
//                layout: 'vbox',
//                layoutConfig: {
//                    type: 'hbox',
//                    align: 'stretch',
//                    pack: 'start'
//                },
//                defaults: {
//                    flex: 1
//                },
//                items: [this.form_generalSettings]
//                
//            }]
//        },
        {
            title: 'Voucher Settings',
            border: false,
            layout: 'fit',
            id: 'voucherSettings',
            height: 500,
            items: [{
                layout: 'vbox',
                layoutConfig: {
                    type: 'hbox',
                    align: 'stretch',
                    pack: 'start'
                },
                defaults: {
                    flex: 1
                },
                items: [this.form_VS,this.grid_VS]
            }]
        }
        
        );

        

        this.items = [tabs];
        this.bbar = [{
            xtype: 'tbfill'
        }, {
            xtype: 'button',
            text: 'New',
            id: 'newTrans',
            iconCls: 'icon-add',
            handler: this.onNewClick,
            hidden:true,
            scope: this
        }, { xtype: 'tbseparator' }, {
            xtype: 'button',
            text: 'Save',
            id: 'saveTrans',
            iconCls: 'icon-save',
            handler: this.onSaveClick,
            scope: this
        }, { xtype: 'tbseparator' }, {
            text: 'Close',
            iconCls: 'icon-exit',
            handler: this.onClose,
            scope: this
        }];

        Ext.core.finance.ux.financeSettings.Window.superclass.initComponent.call(this, arguments);
    }, onNewClick: function () {
        Ext.getCmp('financeVoucherSettings-form').getForm().reset();
        var grid = Ext.getCmp('financeVoucherSettings-grid');
        grid.getStore().removeAll();
        grid.getStore().sync();
    },

    onSaveClick: function () {

        var currentTabId = Ext.getCmp('tabPanel').activeTab.id;



        if (currentTabId == 'genSettings') {
            this.form_CompPay.getForm().submit({
                waitMsg: 'Please wait...',
                success: function (form, action) {
                },
                failure: function (form, action) {
                    Ext.MessageBox.show({
                        title: 'Error',
                        msg: action.result.data,
                        buttons: Ext.Msg.OK,
                        icon: Ext.MessageBox.ERROR,
                        scope: this
                    });
                }
            });
        }
        if (currentTabId == 'voucherSettings') {
            this.form_VS.getForm().submit({
                waitMsg: 'Please wait...',
                success: function (form, action) {
                    Ext.getCmp('financeVoucherSettings-form').getForm().reset();
                    var grid = Ext.getCmp('financeVoucherSettings-grid');
                    grid.getStore().removeAll();
                    grid.getStore().sync();
                },
                failure: function (form, action) {
                    Ext.MessageBox.show({
                        title: 'Error',
                        msg: action.result.data,
                        buttons: Ext.Msg.OK,
                        icon: Ext.MessageBox.ERROR,
                        scope: this
                    });
                }
            });
        }
       

  
    },
    onClose: function () {
        this.close();
    }
});
Ext.reg('financeSettings-window', Ext.core.finance.ux.financeSettings.Window);