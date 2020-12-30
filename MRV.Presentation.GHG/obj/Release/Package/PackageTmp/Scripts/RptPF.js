/*  *************************************************************************************
*   *************************************************************************************
*   
*
*
*   General UI Layout or Map
*   ________________________
*
*   *******************************************
*   *          *                              *
*   *          *                              *
*   * Report   *                              *
*   * Criteria *          Report Area         *
*   *  (Form   *                              *
*   *    &     *                              *
*   *  Grid)   *                              *
*   *          *                              *
*   *          *                              *
*   *******************************************
*
*****************************************************************************************
*****************************************************************************************/




Ext.ns('Ext.core.finance.ux.rptPF');
Ext.ns('Ext.core.finance.ux.rptCriteria.Grid');


/**
* @desc      Provident fund Report Criteria form
* @author    Dawit Kiros Woldemichael
* @copyright (c) 2014, LIFT
* @date      Jan 01, 2014
* @namespace Ext.core.finance.ux.rptPF
* @class     Ext.core.finance.ux.rptPF.Form
* @extends   Ext.form.FormPanel
*/

Ext.core.finance.ux.rptPF.Form = function (config) {
    Ext.core.finance.ux.rptPF.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: RptPF.GetRptSettings
        },
        defaults: {
            anchor: '100%',
            msgTarget: 'side',
            labelStyle: 'text-align:right;'
        },
        id: 'rptPF-form',
        padding: 3,
        labelWidth: 100,
        autoHeight: true,
        border: false,
        autoWidth: true,
        baseCls: 'x-plain',
        items: [{
            hiddenName: 'RptName',
            xtype: 'combo',
            fieldLabel: 'Report Name',
            triggerAction: 'all',
            mode: 'local',
            editable: false,
            forceSelection: false,
            emptyText: '---Select---',
            allowBlank: false,
            width: 150,
            id: 'rptName-combo',
            store: new Ext.data.ArrayStore({
                fields: ['Id', 'Name'],
                data: [['rpt_ARRAPFSheet', 'Tax on PF'], ['rpt_PFDepositSheet', 'PF Deposit Sheet'], ['rpt_PFSlip', 'PF Slip'],
                ['r_PFWithdraw', 'PF Withdraw']]
            }),
            valueField: 'Id', displayField: 'Name',
            listeners: {
                select: function (combo, record, index) {

                    var rptName = Ext.getCmp('rptName-combo').getValue();

                    if (rptName == 'rpt_PFDepositSheet') {
                        Ext.getCmp('rptPeriod-combo').setVisible(true);
                        Ext.getCmp('rptPeriodTo-combo').setVisible(true);
                        
                    } else if (rptName == 'rpt_PFSlip') {
                        Ext.getCmp('rptPeriod-combo').disabled = true;
                        Ext.getCmp('rptPeriod-combo').setVisible(false);
                        Ext.getCmp('rptPeriodTo-combo').setVisible(false);
                    }
                    else if (rptName == 'r_PFWithdraw') {
                        Ext.getCmp('rptPeriod-combo').setVisible(true);
                        Ext.getCmp('rptPeriodTo-combo').setVisible(true);
                    }
                    else {
                        Ext.getCmp('rptPeriod-combo').disabled = false;
                        Ext.getCmp('rptPeriod-combo').setVisible(true);
                        Ext.getCmp('rptPeriodTo-combo').setVisible(false);
                    }
                }
            }
        }, {
            hiddenName: 'RptPeriodId',
            id: 'rptPeriod-combo',
            xtype: 'combo',
            width: 150,
            fieldLabel: 'Period',
            triggerAction: 'all',
            mode: 'local',
            editable: false,
            typeAhead: true,
            forceSelection: true,
            emptyText: '---Select---',
            allowBlank: false,
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
            valueField: 'Id', displayField: 'Name',
            listeners: {
                select: function (combo, record, index) {
                    var periodId = record.get('Id');

                    var toPeriodCmb = Ext.getCmp('rptPeriodTo-combo');

                    toPeriodCmb.clearValue();
                    toPeriodCmb.store.load({ params: { PeriodId: periodId} });
                }
            }
        }, {
            hiddenName: 'RptPeriodToId',
            id: 'rptPeriodTo-combo',
            xtype: 'combo',
            width: 150,
            fieldLabel: 'To Period',
            triggerAction: 'all',
            mode: 'local',
            editable: false,
            typeAhead: true,
            forceSelection: true,
            emptyText: '---Select---',
            allowBlank: false,
            hidden: true,
            disabled: false,
            store: new Ext.data.DirectStore({
                reader: new Ext.data.JsonReader({
                    successProperty: 'success',
                    idProperty: 'Id',
                    root: 'data',
                    fields: ['Id', 'Name']
                }),
                paramOrder: ['PeriodId'],
                api: { read: Ifms.GetPeriodsFiltered }
            }),
            valueField: 'Id', displayField: 'Name'
        }, {
            hiddenName: 'RptCriteria',
            id: 'rptCriteria-combo',
            xtype: 'combo',
            width: 150,
            fieldLabel: 'Group By',
            triggerAction: 'all',
            mode: 'local',
            editable: false,
            typeAhead: true,
            forceSelection: true,
            emptyText: '---Select---',
            allowBlank: false,
            disabled: false,
            store: new Ext.data.ArrayStore({
                fields: ['Id', 'Name'],
                data: [['1', 'Project'], ['2', 'Sector']]
            }),
            valueField: 'Id', displayField: 'Name',
            listeners: {
                select: function (combo, record, index) {

                    var criteriaName = Ext.getCmp('rptCriteria-combo').getRawValue();

                    if (criteriaName == 'Project') {
                        Ext.getCmp('rptProject-combo').setVisible(true);
                        Ext.getCmp('rptProject-combo').disabled = false;
                    } else if (criteriaName == 'Sector') {
                        Ext.getCmp('rptProject-combo').disabled = true;
                        Ext.getCmp('rptProject-combo').setVisible(false);

                        var selText = Ext.getCmp('rptCriteria-combo').lastSelectionText;

                        Ifms.GetSectorsAndLocations(selText, function (response) {

                            var storeData = Ext.util.JSON.decode(response.data.baseEntries);
                            var storeFields = response.data.fields;
                            var grid = Ext.getCmp('rptCriteria-grid');
                            var store = new Ext.core.finance.ux.rptCriteria.Store({
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

                                if (selText == 'Sector') {
                                    columns.push({
                                        dataIndex: storeFields[1],
                                        header: 'Sector',
                                        sortable: true,
                                        autoWidth: true,
                                        menuDisabled: true
                                    });
                                }
                                return columns;
                            }).createDelegate(this)());

                            grid.reconfigure(store, columns);
                            store.loadData(storeData);
                        });
                    }
                }
            }
        }, {
            hiddenName: 'RptProjectId',
            id: 'rptProject-combo',
            xtype: 'combo',
            width: 150,
            fieldLabel: 'Project',
            triggerAction: 'all',
            mode: 'local',
            editable: false,
            typeAhead: true,
            forceSelection: true,
            emptyText: '---Select---',
            allowBlank: false,
            hidden: true,
            store: new Ext.data.DirectStore({
                reader: new Ext.data.JsonReader({
                    successProperty: 'success',
                    idProperty: 'Id',
                    root: 'data',
                    fields: ['Id', 'Name']
                }),
                autoLoad: true,
                api: { read: Ifms.GetProjects }
            }),
            valueField: 'Id', displayField: 'Name',
            listeners: {
                select: function (combo, record, index) {
                    var projectId = record.get('Id');
                    var selText = Ext.getCmp('rptCriteria-combo').getRawValue();

                    if (projectId != '') {

                        Ifms.GetProjectSectors(selText, projectId,  function (response) {

                            var storeData = Ext.util.JSON.decode(response.data.baseEntries);
                            var storeFields = response.data.fields;
                            var grid = Ext.getCmp('rptCriteria-grid');
                            var store = new Ext.core.finance.ux.rptCriteria.Store({
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

                                if (selText == 'Project') {
                                    columns.push({
                                        dataIndex: storeFields[1],
                                        header: 'Locations',
                                        sortable: true,
                                        autoWidth: true,
                                        menuDisabled: true
                                    });
                                }

                                return columns;
                            }).createDelegate(this)());

                            grid.reconfigure(store, columns);
                            store.loadData(storeData);
                        });
                    }
                }
            }
        }]
    }, config));
};
Ext.extend(Ext.core.finance.ux.rptPF.Form, Ext.form.FormPanel);
Ext.reg('rptPF-form', Ext.core.finance.ux.rptPF.Form);


/**
* @desc      rptCriteria grid
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      November 01, 2013
* @namespace Ext.core.finance.ux.rptCriteria
* @class     Ext.core.finance.ux.rptCriteria.Grid
* @extends   Ext.grid.GridPanel
*/

Ext.core.finance.ux.rptCriteria.Store = function (config) {
    Ext.core.finance.ux.rptCriteria.Store.superclass.constructor.call(this, Ext.apply({
        directFn: Ifms.GetSectorsAndLocations,
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
Ext.extend(Ext.core.finance.ux.rptCriteria.Store, Ext.data.DirectStore);
Ext.reg('rptCriteria-store', Ext.core.finance.ux.rptCriteria.Store);

Ext.core.finance.ux.rptCriteria.Grid = function (config) {
    Ext.core.finance.ux.rptCriteria.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: Ifms.GetSectorsAndLocations,
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
                    Ext.getCmp('rptCriteria-grid').body.mask('Loading...', 'x-mask-loading');
                },
                load: function () {
                    var grid = Ext.getCmp('rptCriteria-grid');

                    grid.body.unmask();
                    Ext.core.finance.ux.SystemMessageManager.hide();
                },
                loadException: function () {
                    Ext.getCmp('rptCriteria-grid').body.unmask();
                },
                scope: this
            }
        }),
        id: 'rptCriteria-grid',
        pageSize: 10,
        height: 375,
        stripeRows: true,
        columnLines: true,
        border: true,
        clicksToEdit: 1,
        sm: selModelFiltCriteria,
        viewConfig: { forceFit: true, autoFill: true
        },
        columns: [{ dataIndex: 'Id', header: '', sortable: false, hidden: true, width: 100, menuDisabled: true
        }, new Ext.grid.RowNumberer(), { dataIndex: 'Sector', header: '', sortable: false, width: 100, menuDisabled: true
        }, { dataIndex: 'Code', header: '', sortable: false, width: 100, menuDisabled: true
        }]
    }, config));
};
Ext.extend(Ext.core.finance.ux.rptCriteria.Grid, Ext.grid.EditorGridPanel, {
    initComponent: function () {

        this.tbar = [{
            text: 'Preview',
            iconCls: 'icon-preview',
            scope: this,
            handler: this.onPreviewClick
        }, {
            xtype: 'tbseparator'
        }, {
            text: 'Reset',
            iconCls: 'icon-exit',
            handler: function () {
                form = Ext.getCmp('rptPF-form').getForm().reset();
                Ext.getCmp('rptCriteria-grid').getStore().removeAll();
            },
            scope: this
        }];

        this.bbar = new Ext.PagingToolbar({
            id: 'rptCriteria-paging',
            store: this.store,
            displayInfo: false,
            pageSize: this.pageSize
        });

        this.bbar.refresh.hide();

        Ext.core.finance.ux.rptCriteria.Grid.superclass.initComponent.apply(this, arguments);
    }, onSaveClick: function () {
    }, onPreviewClick: function () {

        var rptNameId = Ext.getCmp('rptName-combo').getValue(); // report name as an id
        var periodId = Ext.getCmp('rptPeriod-combo').getValue();
        var periodToId = Ext.getCmp('rptPeriodTo-combo').getValue();
        var iframePanel = Ext.getCmp('rptPF-iframePanel'); //  
        var selText = Ext.getCmp('rptCriteria-combo').getRawValue();
        var grid = Ext.getCmp('rptCriteria-grid');
        var groupIds = grid.getSelectionModel().getSelections();
        var GroupId = [];
        var projectId = Ext.getCmp('rptProject-combo').getValue();
        var Project = Ext.getCmp('rptProject-combo').getRawValue();

        for (var i = 0, r; r = groupIds[i]; i++) {

            if (groupIds[i].get('Id') != '') {
                Array.add(GroupId, groupIds[i].get('Id'));
            }
        }

//        if (!grid.getSelectionModel().hasSelection()) Array.add(GroupId, '00000000-0000-0000-0000-000000000000');

        if (periodId == '') {
            periodId = '00000000-0000-0000-0000-000000000000';
        }

        if (periodToId == '') {
            periodToId = '00000000-0000-0000-0000-000000000000';
        }

        if (projectId == '') {
            projectId = '00000000-0000-0000-0000-000000000000';
        }

        iframePanel.el.mask('Loading...', 'x-mask-loading');

        // Invoke and set report params and populate along-with
        RptPF.PopulateReport(periodId, periodToId, projectId, Project, rptNameId, selText, GroupId, function (result, response) {
            if (result.success) {
                var url = result.URL;

                iframePanel.removeAll();
                iframePanel.add(new Ext.core.finance.ux.common.IFrameComponent({ url: url }));
                iframePanel.doLayout();
            }
        });

        iframePanel.el.unmask();
    }
});
Ext.reg('rptCriteria-grid', Ext.core.finance.ux.rptCriteria.Grid);


/**
* @desc      Provident fund Report viewer panel
* @author    Dawit Kiros Woldemichael
* @copyright (c) 2014, LIFT
* @date      Jan 01, 2014
* @namespace Ext.core.finance.ux.rptPF
* @class     Ext.core.finance.ux.rptPF.Panel
* @extends   Ext.Panel
*/

Ext.core.finance.ux.rptPF.Panel = function (config) {
    Ext.core.finance.ux.rptPF.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false
    }, config));
}
Ext.extend(Ext.core.finance.ux.rptPF.Panel, Ext.Panel, {
    initComponent: function () {
        this.url = 'Empty.aspx';
        this.form = new Ext.core.finance.ux.rptPF.Form();
        this.iframeComponent = new Ext.core.finance.ux.common.IFrameComponent({ url: this.url });
        this.criteriaGrid = new Ext.core.finance.ux.rptCriteria.Grid();
        this.items = [{
            layout: 'border',
            border: false,
            items: [{
                region: 'west',
                border: true,
                collapsible: true,
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
                    items: [this.form, this.criteriaGrid]
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
                    id: 'rptPF-iframePanel',
                    items: [this.iframeComponent]
                }]
            }]
        }];

        Ext.core.finance.ux.rptPF.Panel.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('rptPF-panel', Ext.core.finance.ux.rptPF.Panel);