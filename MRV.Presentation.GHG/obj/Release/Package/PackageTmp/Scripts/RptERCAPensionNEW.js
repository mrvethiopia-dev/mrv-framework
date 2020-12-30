Ext.ns('Ext.core.finance.ux.RptERCAPensionNEW');
Ext.ns('Ext.core.finance.ux.RptERCAPensionNEWFilterCriteria');

/**
* @desc      Pay RptERCAPensionNEW Report Criteria form
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      December 24, 2013
* @namespace Ext.core.finance.ux.RptERCAPensionNEW
* @class     Ext.core.finance.ux.RptERCAPensionNEW.Form
* @extends   Ext.form.FormPanel
*/
Ext.core.finance.ux.RptERCAPensionNEW.Form = function (config) {
    Ext.core.finance.ux.RptERCAPensionNEW.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            submit: PayrollItems.Get
        },
        defaults: {
            anchor: '100%',
            msgTarget: 'side',
            labelStyle: 'text-align:right;'
        },
        id: 'RptERCAPensionNEW-form',
        padding: 3,
        labelWidth: 100,
        height: 150,
        border: false,
        autoWidth: true,
        baseCls: 'x-plain',
        items: [{
            id: 'RptERCAPensionNEWPeriodId', xtype: 'combo', anchor: '100%', fieldLabel: 'Select Period', triggerAction: 'all', mode: 'local', editable: false, typeAhead: true,
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

        }]
    }, config));
};
Ext.extend(Ext.core.finance.ux.RptERCAPensionNEW.Form, Ext.form.FormPanel);
Ext.reg('RptERCAPensionNEW-form', Ext.core.finance.ux.RptERCAPensionNEW.Form);
var selModelFiltCriteria = new Ext.grid.CheckboxSelectionModel();

/**
* @desc      Pay RptERCAPensionNEW Report viewer panel
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      November 01, 2013
* @namespace Ext.core.finance.ux.RptERCAPensionNEW
* @class     Ext.core.finance.ux.RptERCAPensionNEW.Panel
* @extends   Ext.Panel
*/
Ext.core.finance.ux.RptERCAPensionNEW.Panel = function (config) {
    Ext.core.finance.ux.RptERCAPensionNEW.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false
    }, config));
}
Ext.extend(Ext.core.finance.ux.RptERCAPensionNEW.Panel, Ext.Panel, {
    initComponent: function () {
        this.url = 'Empty.aspx';
        this.form = new Ext.core.finance.ux.RptERCAPensionNEW.Form();
        this.FilterGrid = new Ext.core.finance.ux.RptERCAPensionNEWFilterCriteria.Grid();

        this.iframeComponent = new Ext.core.finance.ux.common.IFrameComponent({ url: this.url });

        this.items = [{
            layout: 'border',
            border: false,
            items: [{
                region: 'west',
                border: true,
                collapsible: true,
                title: 'Report - [ERCA - Pension]',
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
                    items: [this.form, this.FilterGrid]
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
                    id: 'RptERCAPensionNEW-iframePanel',
                    items: [this.iframeComponent]
                }]
            }]
        }];

        Ext.core.finance.ux.RptERCAPensionNEW.Panel.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('RptERCAPensionNEW-panel', Ext.core.finance.ux.RptERCAPensionNEW.Panel);




/********************                 Departments GRID                 ********************/


Ext.core.finance.ux.RptERCAPensionNEWFilterCriteria.Store = function (config) {
    Ext.core.finance.ux.RptERCAPensionNEWFilterCriteria.Store.superclass.constructor.call(this, Ext.apply({
        directFn: Tsa.GetRptDepartments,
        paramsAsHash: false,
        paramOrder: 'start|limit|sort|dir|record',
        root: 'data',
        idProperty: 'Id',
        totalProperty: 'total',
        sortInfo: {
            field: 'Description',
            direction: 'ASC'
        },
        remoteSort: true
    }, config));
};
Ext.extend(Ext.core.finance.ux.RptERCAPensionNEWFilterCriteria.Store, Ext.data.DirectStore);
Ext.reg('RptERCAPensionNEWFilterCriteria-store', Ext.core.finance.ux.RptERCAPensionNEWFilterCriteria.Store);

/**
* @desc      RptERCAPensionNEWFilterCriteria grid
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      November 01, 2013
* @namespace Ext.core.finance.ux.RptERCAPensionNEWFilterCriteria
* @class     Ext.core.finance.ux.RptERCAPensionNEWFilterCriteria.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.core.finance.ux.RptERCAPensionNEWFilterCriteria.Grid = function (config) {
    Ext.core.finance.ux.RptERCAPensionNEWFilterCriteria.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: Tsa.GetRptDepartments,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Code',
                direction: 'ASC'
            },
            fields: ['Id', 'Sector', 'Code'],
            remoteSort: true,
            listeners: {
                beforeLoad: function () {
                    Ext.getCmp('RptERCAPensionNEWFilterCriteria-grid').body.mask('Loading...', 'x-mask-loading');
                },
                load: function () {
                    var grid = Ext.getCmp('RptERCAPensionNEWFilterCriteria-grid');
                    grid.body.unmask();
                    Ext.core.finance.ux.SystemMessageManager.hide();
                },
                loadException: function () {
                    Ext.getCmp('RptERCAPensionNEWFilterCriteria-grid').body.unmask();
                },
                scope: this
            }
        }),
        id: 'RptERCAPensionNEWFilterCriteria-grid',
        pageSize: 10,
        height: 700,
        stripeRows: true,
        columnLines: true,
        border: true,
        clicksToEdit: 1,
        sm: selModelFiltCriteria,
        listeners: {

        },
        viewConfig: {
            forceFit: true,
            autoFill: true
        },
        columns: []
    }, config));
};
Ext.extend(Ext.core.finance.ux.RptERCAPensionNEWFilterCriteria.Grid, Ext.grid.EditorGridPanel, {
    initComponent: function () {

        this.tbar = ['Filter By', {
            id: 'cmbRptERCAPensionNEWFilterBy',
            hiddenName: 'FilterBy',
            xtype: 'combo',
            fieldLabel: 'Filter By',
            triggerAction: 'all',
            width: 150,
            mode: 'local',
            disabled: true,
            editable: false,
            forceSelection: false,
            emptyText: '---Select---',
            allowBlank: true,
            store: new Ext.data.ArrayStore({
                fields: ['Id', 'Units'],
                data: [[1, 'Departments'], [2, 'Regions'], [3, 'Woredas'], [4, 'Employees']]
            }),
            valueField: 'Id',
            displayField: 'Units',
            listeners: {
                select: function (combo, record, index) {

                    var selText = Ext.getCmp('cmbRptERCAPensionNEWFilterBy').lastSelectionText;

                    if (selText == 'Departments') {
                        Tsa.GetRptDepartments(function (response) {
                            var storeData = Ext.util.JSON.decode(response.data.baseEntries);
                            var storeFields = response.data.fields;
                            var grid = Ext.getCmp('RptERCAPensionNEWFilterCriteria-grid');
                            var store = new Ext.core.finance.ux.RptERCAPensionNEWFilterCriteria.Store({
                                fields: (function () {
                                    var fields = [];
                                    for (var i = 0; i < response.total; i++) {
                                        fields.push(storeFields[i]);
                                    }
                                    return fields;
                                }).createDelegate(this)()
                            });

                            var columns = new Ext.grid.ColumnModel((function () {
                                var columns = [];
                                columns.push(selModelFiltCriteria);
                                columns.push({
                                    dataIndex: storeFields[0],
                                    header: 'Id',
                                    sortable: true,
                                    hidden: true,
                                    autoWidth: true,
                                    menuDisabled: true
                                });
                                columns.push({
                                    dataIndex: storeFields[1],
                                    header: 'Departments',
                                    sortable: true,
                                    autoWidth: true,
                                    menuDisabled: true
                                });

                                return columns;
                            }).createDelegate(this)());

                            grid.reconfigure(store, columns);
                            store.loadData(storeData);
                        });

                    }

                    
                }
            }

        }, {
            xtype: 'tbseparator'
        }, {
            id: 'cmdRptERCAPensionNEWPreview',
            text: 'Preview',
            iconCls: 'icon-preview',
            scope: this,
            hidden: false,
            handler: this.onPreviewClick,
            disabled: !Ext.core.finance.ux.Reception.getPermission('ERCA Reports (Pension Form)', 'CanView')
        }, {
            xtype: 'tbseparator'
        }, {
            id: 'cmdRptERCAPensionNEWReset',
            text: 'Reset',
            hidden: false,
            iconCls: 'icon-exit',
            handler: function () {
                form = Ext.getCmp('RptERCAPensionNEW-form').getForm().reset();
                Ext.getCmp('RptERCAPensionNEWFilterCriteria-grid').getStore().removeAll();
                //                Ext.getCmp('RptERCAPensionNEWFilterCriteria-paging').doRefresh();
            },
            scope: this
        }];

        this.bbar = new Ext.PagingToolbar({
            id: 'RptERCAPensionNEWFilterCriteria-paging',
            store: this.store,
            displayInfo: false,

            pageSize: this.pageSize

        });
        this.bbar.refresh.hide();
        Ext.core.finance.ux.RptERCAPensionNEWFilterCriteria.Grid.superclass.initComponent.apply(this, arguments);
    },
    onPreviewClick: function () {
        Ext.MessageBox.show({
            msg: 'Generating ERCA Pension Form, please wait...',
            progressText: 'Loading...',
            width: 300,
            wait: true,
            waitConfig: { interval: 200 }
        });
        var periodId = Ext.getCmp('RptERCAPensionNEWPeriodId').getValue();
        var periodName = Ext.getCmp('RptERCAPensionNEWPeriodId').getRawValue();
        var filterBy = Ext.getCmp('cmbRptERCAPensionNEWFilterBy').getRawValue();
        var grid = Ext.getCmp('RptERCAPensionNEWFilterCriteria-grid');
        var groupIds = grid.getSelectionModel().getSelections();
        var iframePanel = Ext.getCmp('RptERCAPensionNEW-iframePanel');
        var GroupId = [];

        for (var i = 0, r; r = groupIds[i]; i++) {
            Array.add(GroupId, groupIds[i].get('Id'));
        }

        if (!grid.getSelectionModel().hasSelection())
            Array.add(GroupId, 0);


        if (periodId == '') {
            Ext.MessageBox.show({
                title: 'Period not selected',
                msg: 'You must select a period.',
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
        var form = Ext.getCmp('RptERCAPensionNEW-form');

        var selectedReport = 'rpt_ERCAPensionNEW';
        PayrollReports.ViewReport(selectedReport, periodId, periodName, filterBy, GroupId,0,"", function (result, response) {
            if (result.success) {
                var url = result.URL;

                iframePanel.removeAll();
                iframePanel.add(new Ext.core.finance.ux.common.IFrameComponent({ url: url }));
                iframePanel.doLayout();
                Ext.MessageBox.hide();
            }

        });

        //        form.getForm().submit({
        //            waitMsg: 'Please wait...',
        //            success: function () {
        //                var iframePanel = Ext.getCmp('RptERCAPensionNEW-iframePanel');
        //                var url = 'Reports/ReportViewer.aspx?rt=PayRptERCAPensionNEW' + '&' + periodId + '&' + periodName + '&' + GroupId;
        //                iframePanel.removeAll();
        //                iframePanel.add(new Ext.core.finance.ux.common.IFrameComponent({ url: url }));
        //                iframePanel.doLayout();
        //            }
        //        });

    }

});
Ext.reg('RptERCAPensionNEWFilterCriteria-grid', Ext.core.finance.ux.RptERCAPensionNEWFilterCriteria.Grid);

Ext.core.finance.ux.RptERCAPensionNEWFilterCriteria.Panel = function (config) {
    Ext.core.finance.ux.RptERCAPensionNEWFilterCriteria.Panel.superclass.constructor.call(this, Ext.apply({


        layout: 'fit',
        border: false
    }, config));
};

/*******************              END OF SECTORS/LOCATIONS GRID                ********************/
