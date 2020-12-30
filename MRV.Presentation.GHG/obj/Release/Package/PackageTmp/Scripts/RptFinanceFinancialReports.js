Ext.ns('Ext.core.finance.ux.rptFinancialReports');


/**
* @desc      Pay Sheet Report Criteria form
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      December 24, 2013
* @namespace Ext.core.finance.ux.rptFinancialReports
* @class     Ext.core.finance.ux.rptFinancialReports.Form
* @extends   Ext.form.FormPanel
*/
Ext.core.finance.ux.rptFinancialReports.Form = function (config) {
    Ext.core.finance.ux.rptFinancialReports.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            submit: FinanceReports.ViewFinancialReports

        },
        defaults: {
            anchor: '100%',
            msgTarget: 'side',
            labelStyle: 'text-align:right;'
        },
        id: 'rptFinancialReports-form',
        padding: 3,
        labelWidth: 100,
        autoHeight: false,
        height: 150,
        border: false,
        autoWidth: true,
        baseCls: 'x-plain',
        items: [{
            hiddenName: 'ReportName',
            xtype: 'combo',
            fieldLabel: 'Report Name',
            triggerAction: 'all',
            mode: 'local',
            editable: false,
            forceSelection: false,
            anchor: '75%',
            emptyText: '---Select---',
            allowBlank: false,
            store: new Ext.data.ArrayStore({
                fields: ['Id', 'Name'],
                data: [
                    ['BalanceSheet', 'Balance Sheet'],
                    ['BalanceSheetV2', 'Balance Sheet V2']
                    
                    /*,
                    ['IncomeStatement', 'Income Statement']*/
                ]
            }),
            valueField: 'Id',
            displayField: 'Name',
            listeners: {
                select: function (cmb, rec, idx) {
                    var form = Ext.getCmp('rptFinancialReports-form').getForm();
                    if (idx == 1) {
                        form.findField('isVersion2').setValue(true);
                        
                    }
                    else if (idx == 3) {
                        form.findField('isVersion2').setValue(true);
                       
                    }
                    else
                    {
                        form.findField('isVersion2').setValue(false);
                    }
                }
            }
        },
         {
             name: 'isVersion2',
            hidden:true,
            xtype: 'textfield',
            fieldLabel: 'Is Version2',
            allowBlank: true
        },
//         {
//            hiddenName: 'FiscalYearId',
//            xtype: 'combo',
//            fieldLabel: 'Fiscal Year',
//            triggerAction: 'all',
//            mode: 'local',
//            editable: true,
//            typeAhead: true,
//            forceSelection: true,
//            emptyText: '---Select---',
//            allowBlank: false,
//            store: new Ext.data.DirectStore({
//                reader: new Ext.data.JsonReader({
//                    successProperty: 'success',
//                    idProperty: 'Id',
//                    root: 'data',
//                    fields: ['Id', 'Name']
//                }),
//                autoLoad: true,
//                api: { read: Ifms.GetFiscalYears }
//            }),
//            valueField: 'Id',
//            displayField: 'Name',
//            listeners: {
//                select: function (cbo, rec, idx) {
//                    var form = Ext.getCmp('rptFinancialReports-form').getForm();
//                    var periodCombo = form.findField('PeriodId');
//                    periodCombo.clearValue();
//                    periodCombo.store.load({ params: { fiscalYearId: this.getValue()} });
//                }
//            }
//        },
        {
        id: 'PeriodId',
        hiddenName: 'PeriodId',
            xtype: 'combo',
            anchor: '75%',
            fieldLabel: 'Period',
            triggerAction: 'all',
            mode: 'local',
            editable: true,
            typeAhead: true,
            forceSelection: true,
            emptyText: '---Select Period---',
            allowBlank: true,
            store: new Ext.data.DirectStore({
                reader: new Ext.data.JsonReader({
                    successProperty: 'success',
                    idProperty: 'Id',
                    root: 'data',
                    fields: ['Id', 'Name']
                }),
                autoLoad: true,
                api: { read: window.Tsa.GetActivePeriods }
            }),
            valueField: 'Id',
            displayField: 'Name',
            listeners: {

            }
        }, {
            hiddenName: 'LocationId',
            xtype: 'combo',
            fieldLabel: 'Location',
            anchor: '90%',
            triggerAction: 'all',
            mode: 'local',
            editable: true,
            typeAhead: true,
            hidden: true,
            forceSelection: true,
            emptyText: '- Select Location -',
            allowBlank: true,
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
        }
//        , 
//        {
//            hiddenName: 'ProjectId',
//            xtype: 'combo',
//            fieldLabel: 'Project',
//            triggerAction: 'all',
//            mode: 'local',
//            editable: false,
//            forceSelection: true,
//            emptyText: '---Select---',
//            allowBlank: true,
//            hidden: true,
//            store: new Ext.data.DirectStore({
//                reader: new Ext.data.JsonReader({
//                    successProperty: 'success',
//                    idProperty: 'Id',
//                    root: 'data',
//                    fields: ['Id', 'Code']
//                }),
//                autoLoad: true,
//                api: { read: window.Ifms.GetProjects }
//            }),
//            valueField: 'Id',
//            displayField: 'Code'
//        }, 
//        {
//            hiddenName: 'UnitId',
//            xtype: 'combo',
//            fieldLabel: 'Location',
//            triggerAction: 'all',
//            mode: 'local',
//            editable: false,
//            forceSelection: true,
//            allowBlank: true,
//            hidden: true,
//            store: new Ext.data.DirectStore({
//                reader: new Ext.data.JsonReader({
//                    successProperty: 'success',
//                    idProperty: 'Id',
//                    root: 'data',
//                    fields: ['Id', 'Name']
//                }),
//                autoLoad: true,
//                api: { read: window.Ifms.GetLocations }
//            }),
//            valueField: 'Id',
//            displayField: 'Name'
//        }
        ],
        buttons: [{
            text: 'Export',
            iconCls: 'icon-Preview',
            hidden: true,
            handler: function () {
                var form = Ext.getCmp('rptFinancialReports-form');
                form.getForm().submit({
                    waitMsg: 'Please wait...',
                    success: function () {
                        var iframePanel = Ext.getCmp('rptFinancialReports-iframePanel');

                        var url = 'Reports/Financial/FinancialReportsViewer.aspx?rt=GeneralLedger' + '&printMode=' + false;
                        iframePanel.removeAll();
                        iframePanel.add(new Ext.core.finance.ux.common.IFrameComponent({ url: url }));
                        iframePanel.doLayout();
                    }
                });
            },
            scope: this
        },{
            text: 'Preview',
            iconCls: 'icon-preview',
            handler: function () {
                var form = Ext.getCmp('rptFinancialReports-form');
                form.getForm().submit({
                    waitMsg: 'Please wait...',
                    success: function () {
                        var iframePanel = Ext.getCmp('rptFinancialReports-iframePanel');

                        var url = 'Reports/Financial/FinancialReportsViewer.aspx?rt=GeneralLedger' + '&printMode=' + true;
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
                form = Ext.getCmp('rptFinancialReports-form').getForm().reset();
            },
            scope: this
        }]
    }, config));
};
Ext.extend(Ext.core.finance.ux.rptFinancialReports.Form, Ext.form.FormPanel);
Ext.reg('rptFinancialReports-form', Ext.core.finance.ux.rptFinancialReports.Form);
var selModelFiltCriteria = new Ext.grid.CheckboxSelectionModel();







/**
* @desc      Pay Sheet Report viewer panel
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      November 01, 2013
* @namespace Ext.core.finance.ux.rptFinancialReports
* @class     Ext.core.finance.ux.rptFinancialReports.Panel
* @extends   Ext.Panel
*/
Ext.core.finance.ux.rptFinancialReports.Panel = function (config) {
    Ext.core.finance.ux.rptFinancialReports.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false
    }, config));
}
Ext.extend(Ext.core.finance.ux.rptFinancialReports.Panel, Ext.Panel, {
    initComponent: function () {
        this.url = 'Empty.aspx';
        this.form = new Ext.core.finance.ux.rptFinancialReports.Form();
        
        this.iframeComponent = new Ext.core.finance.ux.common.IFrameComponent({ url: this.url });

        this.items = [{
            layout: 'border',
            border: false,
            items: [{
                region: 'west',
                border: true,
                collapsible: true,
                title: 'Report - Financial Reports',
                split: true,
                width: 345,
                minSize: 300,
                layout: 'fit',
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
                    items: [this.form]
                }]
            }, {
                region: 'center',
                border: false,
                layout: 'fit',
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
                    id: 'rptFinancialReports-iframePanel',
                    items: [this.iframeComponent]
                }]
            }]
        }];

        Ext.core.finance.ux.rptFinancialReports.Panel.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('rptFinancialReports-panel', Ext.core.finance.ux.rptFinancialReports.Panel);

