Ext.ns('Ext.core.finance.ux.rptLoanSheet');

/**
* @desc      Loan Sheet Report Criteria form
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      December 24, 2013
* @namespace Ext.core.finance.ux.rptLoanSheet
* @class     Ext.core.finance.ux.rptLoanSheet.Form
* @extends   Ext.form.FormPanel
*/
Ext.core.finance.ux.rptLoanSheet.Form = function (config) {
    Ext.core.finance.ux.rptLoanSheet.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            submit: ERPReport.SetFixedAssetReportParam
        },
        defaults: {
            anchor: '95%',
            msgTarget: 'side',
            labelStyle: 'text-align:right;'
        },
        id: 'rptLoanSheet-form',
        padding: 5,
        labelWidth: 110,
        height: 150,
        border: false,
        width: 840,
        baseCls: 'x-plain',
        items: [],
        buttons: [{
            text: 'Preview',
            iconCls: 'icon-preview',
            handler: function () {
                //var periodId = Ext.getCmp('rptLoanTo').getValue();
                var form = Ext.getCmp('rptLoanSheet-form');
                form.getForm().submit({
                    waitMsg: 'Please wait...',
                    success: function () {
                        var iframePanel = Ext.getCmp('rptLoanSheet-iframePanel');
                        var url = 'Reports/ReportViewer.aspx?rt=LoanSheet';
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
                form = Ext.getCmp('rptLoanSheet-form').getForm().reset();
            },
            scope: this
        }]
    }, config));
};
Ext.extend(Ext.core.finance.ux.rptLoanSheet.Form, Ext.form.FormPanel);
Ext.reg('rptLoanSheet-form', Ext.core.finance.ux.rptLoanSheet.Form);

/**
* @desc      Loan Sheet Report viewer panel
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      November 01, 2013
* @namespace Ext.core.finance.ux.rptLoanSheet
* @class     Ext.core.finance.ux.rptLoanSheet.Panel
* @extends   Ext.Panel
*/
Ext.core.finance.ux.rptLoanSheet.Panel = function (config) {
    Ext.core.finance.ux.rptLoanSheet.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false
    }, config));
}
Ext.extend(Ext.core.finance.ux.rptLoanSheet.Panel, Ext.Panel, {
    initComponent: function () {
        this.url = 'Empty.aspx';
        this.form = new Ext.core.finance.ux.rptLoanSheet.Form();
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
                items: [this.form]
            }, {
                region: 'center',
                border: true,
                layout: 'fit',
                id: 'rptLoanSheet-iframePanel',
                items: [this.iframeComponent]
            }]
        }];

        Ext.core.finance.ux.rptLoanSheet.Panel.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('rptLoanSheet-panel', Ext.core.finance.ux.rptLoanSheet.Panel);