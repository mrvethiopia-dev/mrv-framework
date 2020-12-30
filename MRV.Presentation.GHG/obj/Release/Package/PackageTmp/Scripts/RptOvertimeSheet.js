Ext.ns('Ext.core.finance.ux.rptOvertimeSheet');

/**
* @desc      Overtime Sheet Report Criteria form
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      December 24, 2013
* @namespace Ext.core.finance.ux.rptOvertimeSheet
* @class     Ext.core.finance.ux.rptOvertimeSheet.Form
* @extends   Ext.form.FormPanel
*/
Ext.core.finance.ux.rptOvertimeSheet.Form = function (config) {
    Ext.core.finance.ux.rptOvertimeSheet.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            submit: ERPReport.SetFixedAssetReportParam
        },
        defaults: {
            anchor: '95%',
            msgTarget: 'side',
            labelStyle: 'text-align:right;'
        },
        id: 'rptOvertimeSheet-form',
        padding: 5,
        labelWidth: 110,
        height: 150,
        border: false,
        width: 840,
        baseCls: 'x-plain',
        items: [{
            id: 'rptOvertimeSheetPeriodId', xtype: 'combo', anchor: '85%', fieldLabel: 'Select Period', triggerAction: 'all', mode: 'local', editable: false, typeAhead: true,
            forceSelection: true, emptyText: '---Period---', allowBlank: false,
            store: new Ext.data.DirectStore({
                reader: new Ext.data.JsonReader({
                    successProperty: 'success',
                    idProperty: 'Id',
                    root: 'data',
                    fields: ['Id', 'Name']
                }),
                autoLoad: true,
                api: { read: Ifms.GetActivePeriods }
            }),
            valueField: 'Id', displayField: 'Name'
        }],
        buttons: [{
            text: 'Preview',
            iconCls: 'icon-preview',
            handler: function () {
                var periodId = Ext.getCmp('rptOvertimeSheetPeriodId').getValue();
                var form = Ext.getCmp('rptOvertimeSheet-form');
                form.getForm().submit({
                    waitMsg: 'Please wait...',
                    success: function () {
                        var iframePanel = Ext.getCmp('rptOvertimeSheet-iframePanel');
                        var url = 'Reports/ReportViewer.aspx?rt=OvertimeSheet' + '&' + periodId;
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
                form = Ext.getCmp('rptOvertimeSheet-form').getForm().reset();
            },
            scope: this
        }]
    }, config));
};
Ext.extend(Ext.core.finance.ux.rptOvertimeSheet.Form, Ext.form.FormPanel);
Ext.reg('rptOvertimeSheet-form', Ext.core.finance.ux.rptOvertimeSheet.Form);

/**
* @desc      Overtime Sheet Report viewer panel
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      November 01, 2013
* @namespace Ext.core.finance.ux.rptOvertimeSheet
* @class     Ext.core.finance.ux.rptOvertimeSheet.Panel
* @extends   Ext.Panel
*/
Ext.core.finance.ux.rptOvertimeSheet.Panel = function (config) {
    Ext.core.finance.ux.rptOvertimeSheet.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false
    }, config));
}
Ext.extend(Ext.core.finance.ux.rptOvertimeSheet.Panel, Ext.Panel, {
    initComponent: function () {
        this.url = 'Empty.aspx';
        this.form = new Ext.core.finance.ux.rptOvertimeSheet.Form();
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
                title: 'Report - [Overtime]',
                items: [this.form]
            }, {
                region: 'center',
                border: true,
                layout: 'fit',
                id: 'rptOvertimeSheet-iframePanel',
                items: [this.iframeComponent]
            }]
        }];

        Ext.core.finance.ux.rptOvertimeSheet.Panel.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('rptOvertimeSheet-panel', Ext.core.finance.ux.rptOvertimeSheet.Panel);