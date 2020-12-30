Ext.ns('Ext.core.finance.ux.faChangeLocation');
/**
* @desc      Payroll Change Salary Or Position  form
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      October 08, 2013
* @namespace Ext.core.finance.ux.faChangeLocation
* @class     Ext.core.finance.ux.faChangeLocation.Form
* @extends   Ext.form.FormPanel
*/

Ext.core.finance.ux.faChangeLocation.Form = function (config) {
    Ext.core.finance.ux.faChangeLocation.Form.superclass.constructor.call(this, Ext.apply({
        api: {

            //submit: PayrollEmployees.BatchCurrencyChange
        },
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:left;',
            msgTarget: 'side'
        },
        id: 'faChangeLocation-form',
        labelWidth: 115,
        autoHeight: true,
        border: false,
        layout: 'form',
        bodyStyle: 'background:transparent;padding:5px',
        baseCls: 'x-plain',
        items: [{
            xtype: 'fieldset',
            title: 'Current Location',
            autoHeight: true,

            items: [{
                name:'VoucherId',
                xtype: 'textfield',
                fieldLabel: 'Voucher No',
                disabled: true,
                value: 'LIFT/19/HO/SIV/03/012'
                
            },                {
                name:'currentLocation',
                xtype: 'textfield',
                fieldLabel: 'Current Location',
                disabled: true,
                value: 'H1 - AA Head Office'
                
            }]
        },
        {
            xtype: 'fieldset',
            title: 'To Location',
            autoHeight: true,

            items: [{
                hiddenName: 'LocationId',
                xtype: 'combo',
                fieldLabel: 'To Location',
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
            }, {
                name: 'Date',
                xtype: 'datefield',
                fieldLabel: 'Effective From',
                altFormats: 'c',
                editable: true,
                anchor: '75%',
                allowBlank: false,
                listeners: {
                    select: function () {
                        
                    }
                }
            }]
        }
        ]
    }, config));
};
Ext.extend(Ext.core.finance.ux.faChangeLocation.Form, Ext.form.FormPanel);
Ext.reg('faChangeLocation-form', Ext.core.finance.ux.faChangeLocation.Form);


/**
* @desc      faChangeLocation window
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      October 08, 2013
* @namespace Ext.core.finance.ux.faChangeLocation
* @class     Ext.core.finance.ux.faChangeLocation.Window
* @extends   Ext.Window
*/
Ext.core.finance.ux.faChangeLocation.Window = function (config) {
    Ext.core.finance.ux.faChangeLocation.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        width: 450,
        height: 300,
        //autoHeight: true,
        closeAction: 'close',
        modal: true,
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;',
        listeners: {
            show: function () {

            },
            scope: this
        }
    }, config));
}
Ext.extend(Ext.core.finance.ux.faChangeLocation.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.core.finance.ux.faChangeLocation.Form();
        
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
                Ext.getCmp('faChangeLocation-form').getForm().reset();
                var grid = Ext.getCmp('faChangeLocation-grid');
                var store = grid.getStore();
                store.removeAll();
            },
            scope: this
        }, {
            text: 'Close',
            iconCls: 'icon-exit',
            handler: this.onClose,
            scope: this
        }];

        Ext.core.finance.ux.faChangeLocation.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {
        Ext.MessageBox.show({
            title: 'Asset Location Change',
            msg: 'Asset Location has been changed successfully!',
            buttons: Ext.Msg.OK,
            icon: Ext.MessageBox.OK,
            scope: this
        });
    },
    onClose: function () {
        this.close();
    }
});
Ext.reg('faChangeLocation-window', Ext.core.finance.ux.faChangeLocation.Window);




