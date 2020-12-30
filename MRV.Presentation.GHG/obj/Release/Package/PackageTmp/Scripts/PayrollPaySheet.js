Ext.ns('Ext.core.finance.ux.rptPaySheet');

/**
* @desc      General Ledger Report Criteria form
* @author    Dawit Kiros
* @copyright (c) 2012, LIFT
* @date      April 24, 2012
* @namespace Ext.core.finance.ux.rptPaySheet
* @class     Ext.core.finance.ux.rptPaySheet.Form
* @extends   Ext.form.FormPanel
*/
Ext.core.finance.ux.rptPaySheet.Form = function (config) {
    Ext.core.finance.ux.rptPaySheet.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            submit: PayrollReport.SetPaySheetReportParam
        },
        defaults: {
            anchor: '95%',
            msgTarget: 'side',
            labelStyle: 'text-align:right;'
        },
        id: 'rptPaySheet-form',
        padding: 5,
        labelWidth: 110,
        autoHeight: true,
        border: false,
        width: 840,
        baseCls: 'x-plain',
        items: [{
            hiddenName: 'ReportName',
            xtype: 'combo',
            fieldLabel: 'Report Name',
            triggerAction: 'all',
            mode: 'local',
            editable: false,
            forceSelection: false,
            emptyText: '---Select---',
            allowBlank: false,
            store: new Ext.data.ArrayStore({
                fields: ['Id', 'Name'],
                data: [['GeneralJournal', 'General Journal'], ['GeneralLedger', 'General Ledger'], ['BalanceSheet', 'Balance Sheet'], ['IncomeStatement', 'Income Statement']]
            }),
            valueField: 'Id',
            displayField: 'Name',
            listeners: {
                select: function (cmb, rec, idx) {
                    var form = Ext.getCmp('rptPaySheet-form').getForm();
                    if (idx == 2 || idx == 3) {
                        form.findField('PeriodId').setVisible(true);
                        form.findField('StartDate').setVisible(false);
                        form.findField('EndDate').setVisible(false);
                    }
                    else {
                        form.findField('PeriodId').setVisible(false);
                        form.findField('StartDate').setVisible(true);
                        form.findField('EndDate').setVisible(true);
                    }
                }
            }
        }, {
            name: 'StartDate',
            xtype: 'datefield',
            fieldLabel: 'Start Date',
            altFormats: 'c',
            value: new Date(),
            editable: true,
            allowBlank: true
        }, {
            name: 'EndDate',
            xtype: 'datefield',
            fieldLabel: 'End Date',
            altFormats: 'c',
            value: new Date(),
            editable: true,
            allowBlank: true
        }, {
            hiddenName: 'PeriodId',
            xtype: 'combo',
            fieldLabel: 'Period',
            triggerAction: 'all',
            mode: 'local',
            editable: true,
            typeAhead: true,
            forceSelection: true,
            emptyText: '---Select---',
            allowBlank: true,
            hidden: true,
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
            valueField: 'Id',
            displayField: 'Name'
        }],
        buttons: [{
            text: 'Preview',
            iconCls: 'icon-preview',
            handler: function () {
                var form = Ext.getCmp('rptPaySheet-form');
                form.getForm().submit({
                    waitMsg: 'Please wait...',
                    success: function () {
                        var iframePanel = Ext.getCmp('rptPaySheet-iframePanel');
                        var url = 'Reports/PayrollReportViewer.aspx?rt=GeneralLedger' + '&' + (new Date).getTime();
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
                form = Ext.getCmp('rptPaySheet-form').getForm().reset();
            },
            scope: this
        }]
    }, config));
};
Ext.extend(Ext.core.finance.ux.rptPaySheet.Form, Ext.form.FormPanel);
Ext.reg('rptPaySheet-form', Ext.core.finance.ux.rptPaySheet.Form);

/**
* @desc      General Ledger Report viewer panel
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      November 01, 2010
* @namespace Ext.core.finance.ux.GeneralLedger
* @class     Ext.core.finance.ux.GeneralLedger.Panel
* @extends   Ext.Panel
*/
Ext.core.finance.ux.rptPaySheet.Panel = function (config) {
    Ext.core.finance.ux.rptPaySheet.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false,
        tbar: {
            xtype: 'toolbar',
            items: [{}]
        }
    }, config));
}
Ext.extend(Ext.core.finance.ux.rptPaySheet.Panel, Ext.Panel, {
    initComponent: function () {
        this.url = 'Reports/PayrollReportViewer.aspx';
        this.form = new Ext.core.finance.ux.rptPaySheet.Form();
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
                items: [this.form]
            }, {
                region: 'center',
                border: true,
                layout: 'fit',
                id: 'rptPaySheet-iframePanel',
                items: [this.iframeComponent]
            }]
        }];

        Ext.core.finance.ux.rptPaySheet.Panel.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('rptPaySheet-panel', Ext.core.finance.ux.rptPaySheet.Panel);