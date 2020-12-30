﻿Ext.ns('Ext.core.finance.ux.searchSubmenu');
Ext.core.finance.ux.searchSubmenu.Observable = new Ext.util.Observable();
Ext.core.finance.ux.searchSubmenu.Observable.addEvents('search-operation');

/**
* @desc      Menu form
* @author    Dawit Kiros Woldemichael
* @copyright (c) 2014, 
* @date      November 01, 2014
* @namespace Ext.core.finance.ux.searchSubmenu
* @class     Ext.core.finance.ux.searchSubmenu.Form
* @extends   Ext.form.FormPanel
*/
Ext.core.finance.ux.searchSubmenu.Form = function (config) {
    Ext.core.finance.ux.searchSubmenu.Form.superclass.constructor.call(this, Ext.apply({
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'searchSubmenu-form',
        padding: 5,
        labelWidth: 150,
        autoHeight: true,
        border: false,
        baseCls: 'x-plain',
        items: [{
            hiddenName: 'SystemId',
            xtype: 'combo',
            fieldLabel: 'System',
            triggerAction: 'all',
            mode: 'remote',
            editable: false,
            forceSelection: true,
            emptyText: '---Select---',
            allowBlank: true,
            store: new Ext.data.DirectStore({
                reader: new Ext.data.JsonReader({
                    successProperty: 'success',
                    idProperty: 'Id',
                    root: 'data',
                    fields: ['Id', 'Name']
                }),
                autoLoad: true,
                api: { read: window.Tsa.GetSystems }
            }),
            valueField: 'Id',
            displayField: 'Name',
            listeners: {
                'select': function (cmb, rec, idx) {
                    var form = Ext.getCmp('searchSubmenu-form').getForm();
                    var moduleCombo = form.findField('MenuId');
                    moduleCombo.clearValue();
                    moduleCombo.store.load({ params: { systemId: this.getValue()} });
                }
            }
        }, {
            hiddenName: 'MenuId',
            xtype: 'combo',
            fieldLabel: 'Menu',
            triggerAction: 'all',
            mode: 'local',
            editable: false,
            forceSelection: true,
            emptyText: '---Select---',
            allowBlank: true,
            store: new Ext.data.DirectStore({
                reader: new Ext.data.JsonReader({
                    successProperty: 'success',
                    idProperty: 'Id',
                    root: 'data',
                    fields: ['Id', 'Name']
                }),
                paramOrder: ['systemId'],
                api: { read: window.Tsa.GetMenus }
            }),
            valueField: 'Id',
            displayField: 'Name'
        }]
    }, config));
}
Ext.extend(Ext.core.finance.ux.searchSubmenu.Form, Ext.form.FormPanel);
Ext.reg('searchSubmenu-form', Ext.core.finance.ux.searchSubmenu.Form);

/**
* @desc      AccountSearch registration form host window
* @author    Dawit Kiros Woldemichael
* @copyright (c) 2014, 
* @date      November 01, 2014
* @namespace Ext.core.finance.ux.searchSubmenu
* @class     Ext.core.finance.ux.searchSubmenu.Window
* @extends   Ext.Window
*/
Ext.core.finance.ux.searchSubmenu.Window = function (config) {
    Ext.core.finance.ux.searchSubmenu.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        width: 600,
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;'
    }, config));
}
Ext.extend(Ext.core.finance.ux.searchSubmenu.Window, Ext.Window, {
    initComponent: function () {
        var form = new Ext.core.finance.ux.searchSubmenu.Form();
        this.items = [form];
        this.bbar = [{
            xtype: 'tbfill'
        }, {
            text: 'Filter',
            iconCls: 'icon-filter',
            handler: this.onFilter,
            scope: this
        }, {
            xtype: 'tbseparator'
        }, {
            text: 'Close',
            iconCls: 'icon-exit',
            handler: this.onClose,
            scope: this
        }];
        this.tools = [{
            id: 'refresh',
            qtip: 'Reset',
            handler: function () {
                this.form.getForm().reset();
            },
            scope: this
        }];
        Ext.core.finance.ux.searchSubmenu.Window.superclass.initComponent.call(this, arguments);
    },
    onFilter: function () {
        var form = Ext.getCmp('searchSubmenu-form').getForm();
        var formElements = form.items;
        var result = {};
        formElements.each(function (cmb) {
            if (!cmb.hidden) {
                result[cmb.hiddenName] = cmb.getValue() + ';' + cmb.getRawValue();
            }
        });
        Ext.core.finance.ux.searchSubmenu.Observable.fireEvent(this.searchEvent, result);
    },
    onClose: function () {
        this.close();
    }
});
Ext.reg('searchSubmenu-window', Ext.core.finance.ux.searchSubmenu.Window);
