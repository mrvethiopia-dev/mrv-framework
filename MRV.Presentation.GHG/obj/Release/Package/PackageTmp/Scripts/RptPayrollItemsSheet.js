Ext.ns('Ext.core.finance.ux.rptPayrollItemsSheet');


/**
* @desc      Employee Payroll Item Amount Report Criteria form
* @author    Dawit Kiros
* @editor   Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      December 24, 2013
* @namespace Ext.core.finance.ux.rptPayrollItemsSheet
* @class     Ext.core.finance.ux.rptPayrollItemsSheet.Form
* @extends   Ext.form.FormPanel
*/

Ext.core.finance.ux.rptPayrollItemsSheet.Form = function (config) {
    Ext.core.finance.ux.rptPayrollItemsSheet.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            submit: PayrollItems.Get
        },
        defaults: {
            anchor: '95%',
            msgTarget: 'side',
            labelStyle: 'text-align:right;'
        },
        id: 'rptPayrollItemsSheet-form',
        padding: 5,
        labelWidth: 110,
        height: 150,
        border: false,
        width: 840,
        baseCls: 'x-plain',
        items: [{
            id: 'rptPIAmountPeriodId', xtype: 'combo', anchor: '90%', fieldLabel: 'Select Period', triggerAction: 'all', mode: 'local', editable: false, typeAhead: true,
            forceSelection: true, emptyText: '---Period---', allowBlank: false,
            store: new Ext.data.DirectStore({
                reader: new Ext.data.JsonReader({
                    successProperty: 'success',
                    idProperty: 'Id',
                    root: 'data',
                    fields: ['Id', 'Name']
                }),
                autoLoad: true,
                api: { read: Tsa.GetActivePeriods }
            }),
            valueField: 'Id', displayField: 'Name'
        },
        {
            hiddenName: 'RptPItemId',
            xtype: 'combo',
            fieldLabel: 'Payroll Item',
            anchor: '90%',
            triggerAction: 'all',
            mode: 'local',
            editable: false,
            typeAhead: true,
            forceSelection: true,
            emptyText: '---Select---',
            allowBlank: false,
            editable: false,
            id: 'RptPItem-combo',
            store: new Ext.data.DirectStore({
                reader: new Ext.data.JsonReader({
                    successProperty: 'success',
                    idProperty: 'Id',
                    root: 'data',
                    fields: ['Id', 'Name']
                }),
                autoLoad: true,
                api: { read: Tsa.GetUserPayrollItems }
            }),
            valueField: 'Id', displayField: 'Name'
        }],
        buttons: [{
            text: 'Preview',
            iconCls: 'icon-preview',
            handler: function () {
                var periodId = Ext.getCmp('rptPIAmountPeriodId').getValue();
                var PItemId = Ext.getCmp('RptPItem-combo').getValue();
                var form = Ext.getCmp('rptPayrollItemsSheet-form');
                var pItemName = Ext.getCmp('RptPItem-combo').getRawValue();

                form.getForm().submit({
                    waitMsg: 'Please wait...',
                    success: function () {
                        var iframePanel = Ext.getCmp('rptPayrollItemsSheet-iframePanel');
                        var url = 'Reports/ReportViewer.aspx?rt=rpt_EmpPItem' + '&' + periodId + '&' + PItemId + '&' + pItemName;
                        iframePanel.removeAll();
                        iframePanel.add(new Ext.core.finance.ux.common.IFrameComponent({ url: url }));
                        iframePanel.doLayout();
                    }
                });
            },
            scope: this
        }, {
            text: 'Cancel',
            iconCls: 'icon-exit',
            handler: function () {
                form = Ext.getCmp('rptPayrollItemsSheet-form').getForm().reset();
            },
            scope: this
        }]
    }, config));
};
Ext.extend(Ext.core.finance.ux.rptPayrollItemsSheet.Form, Ext.form.FormPanel);
Ext.reg('rptPayrollItemsSheet-form', Ext.core.finance.ux.rptPayrollItemsSheet.Form);


/**
* @desc      Employee Payroll Item Amount Report viewer panel
* @author    Dawit Kiros
* @editor   Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      November 01, 2013
* @namespace Ext.core.finance.ux.rptPayrollItemsSheet
* @class     Ext.core.finance.ux.rptPayrollItemsSheet.Panel
* @extends   Ext.Panel
*/

Ext.core.finance.ux.rptPayrollItemsSheet.Panel = function (config) {
    Ext.core.finance.ux.rptPayrollItemsSheet.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false
    }, config));
}
Ext.extend(Ext.core.finance.ux.rptPayrollItemsSheet.Panel, Ext.Panel, {
    initComponent: function () {
        this.url = 'Empty.aspx';
        this.form = new Ext.core.finance.ux.rptPayrollItemsSheet.Form();
        this.iframeComponent = new Ext.core.finance.ux.common.IFrameComponent({ url: this.url });
        this.items = [{
            layout: 'border',
            border: false,
            items: [{
                region: 'west',
                border: true,
                width: 350,
                minSize: 100,
                maxSize: 500,
                split: true,
                layout: 'fit',
                margins: '0 3 0 0',
                collapsible: true,
                title: 'Report - [Payroll Items]',
                items: [this.form]
            }, {
                region: 'center',
                border: true,
                layout: 'fit',
                id: 'rptPayrollItemsSheet-iframePanel',
                items: [this.iframeComponent]
            }]
        }];

        Ext.core.finance.ux.rptPayrollItemsSheet.Panel.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('rptPayrollItemsSheet-panel', Ext.core.finance.ux.rptPayrollItemsSheet.Panel);