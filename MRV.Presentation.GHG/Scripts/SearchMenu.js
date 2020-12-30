﻿Ext.ns('Ext.core.finance.ux.searchMenu');
Ext.core.finance.ux.searchMenu.Observable = new Ext.util.Observable();
Ext.core.finance.ux.searchMenu.Observable.addEvents('search-Menu');

/**
* @desc      Menu form
* @author    Dawit Kiros Woldemichael
* @copyright (c) 2014, 
* @date      November 01, 2014
* @namespace Ext.core.finance.ux.searchMenu
* @class     Ext.core.finance.ux.searchMenu.Form
* @extends   Ext.form.FormPanel
*/
Ext.core.finance.ux.searchMenu.Form = function (config) {
    Ext.core.finance.ux.searchMenu.Form.superclass.constructor.call(this, Ext.apply({
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'searchMenu-form',
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
            displayField: 'Name'
        }]
    }, config));
}
Ext.extend(Ext.core.finance.ux.searchMenu.Form, Ext.form.FormPanel);
Ext.reg('searchMenu-form', Ext.core.finance.ux.searchMenu.Form);


/**
* @desc      AccountSearch registration form host window
* @author    Dawit Kiros Woldemichael
* @copyright (c) 2014, 
* @date      November 01, 2014
* @namespace Ext.core.finance.ux.searchMenu
* @class     Ext.core.finance.ux.searchMenu.Window
* @extends   Ext.Window
*/

Ext.core.finance.ux.searchMenu.Window = function (config) {
    Ext.core.finance.ux.searchMenu.Window.superclass.constructor.call(this, Ext.apply({
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
Ext.extend(Ext.core.finance.ux.searchMenu.Window, Ext.Window, {
    initComponent: function () {
        var form = new Ext.core.finance.ux.searchMenu.Form();
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
        Ext.core.finance.ux.searchMenu.Window.superclass.initComponent.call(this, arguments);
    },
    onFilter: function () {
        var form = Ext.getCmp('searchMenu-form').getForm();
        var formElements = form.items;
        var result = {};
        formElements.each(function (cmb) {
            if (!cmb.hidden) {
                result[cmb.hiddenName] = cmb.getValue() + ';' + cmb.getRawValue();
            }
        });
        Ext.core.finance.ux.searchMenu.Observable.fireEvent(this.searchEvent, result);
    },
    onClose: function () {
        this.close();
    }
});
Ext.reg('searchMenu-window', Ext.core.finance.ux.searchMenu.Window);
