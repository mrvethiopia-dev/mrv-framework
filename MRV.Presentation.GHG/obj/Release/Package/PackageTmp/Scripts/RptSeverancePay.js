﻿Ext.ns('Ext.core.finance.ux.rptSeverancePay');
Ext.ns('Ext.core.finance.ux.rptSeverancePayFilterCriteria');

/**
* @desc      Pay SeverancePay Report Criteria form
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      December 24, 2013
* @namespace Ext.core.finance.ux.rptSeverancePay
* @class     Ext.core.finance.ux.rptSeverancePay.Form
* @extends   Ext.form.FormPanel
*/
Ext.core.finance.ux.rptSeverancePay.Form = function (config) {
    Ext.core.finance.ux.rptSeverancePay.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            submit: PayrollItems.Get
        },
        defaults: {
            anchor: '100%',
            msgTarget: 'side',
            labelStyle: 'text-align:right;'
        },
        id: 'rptSeverancePay-form',
        padding: 3,
        labelWidth: 100,
        //autoHeight: true,
        height: 150,
        border: false,
        autoWidth: true,
        baseCls: 'x-plain',
        items: [{
            id: 'rptSeverancePayPeriodId', xtype: 'combo', anchor: '100%', fieldLabel: 'Select Period', triggerAction: 'all', mode: 'local', editable: false, typeAhead: true,
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
Ext.extend(Ext.core.finance.ux.rptSeverancePay.Form, Ext.form.FormPanel);
Ext.reg('rptSeverancePay-form', Ext.core.finance.ux.rptSeverancePay.Form);
var selModelFiltCriteria = new Ext.grid.CheckboxSelectionModel();







/**
* @desc      Pay SeverancePay Report viewer panel
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      November 01, 2013
* @namespace Ext.core.finance.ux.rptSeverancePay
* @class     Ext.core.finance.ux.rptSeverancePay.Panel
* @extends   Ext.Panel
*/
Ext.core.finance.ux.rptSeverancePay.Panel = function (config) {
    Ext.core.finance.ux.rptSeverancePay.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false
    }, config));
}
Ext.extend(Ext.core.finance.ux.rptSeverancePay.Panel, Ext.Panel, {
    initComponent: function () {
        this.url = 'Empty.aspx';
        this.form = new Ext.core.finance.ux.rptSeverancePay.Form();
        this.FilterGrid = new Ext.core.finance.ux.rptSeverancePayFilterCriteria.Grid();

        this.iframeComponent = new Ext.core.finance.ux.common.IFrameComponent({ url: this.url });

        this.items = [{
            layout: 'border',
            border: false,
            items: [{
                region: 'west',
                border: true,
                collapsible: true,
                title: 'Report - [Severance Pay Journal]',
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
                    id: 'rptSeverancePay-iframePanel',
                    items: [this.iframeComponent]
                }]
            }]
        }];

        Ext.core.finance.ux.rptSeverancePay.Panel.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('rptSeverancePay-panel', Ext.core.finance.ux.rptSeverancePay.Panel);




/********************                 Departments GRID                 ********************/


Ext.core.finance.ux.rptSeverancePayFilterCriteria.Store = function (config) {
    Ext.core.finance.ux.rptSeverancePayFilterCriteria.Store.superclass.constructor.call(this, Ext.apply({
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
Ext.extend(Ext.core.finance.ux.rptSeverancePayFilterCriteria.Store, Ext.data.DirectStore);
Ext.reg('rptSeverancePayFilterCriteria-store', Ext.core.finance.ux.rptSeverancePayFilterCriteria.Store);

/**
* @desc      rptSeverancePayFilterCriteria grid
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      November 01, 2013
* @namespace Ext.core.finance.ux.rptSeverancePayFilterCriteria
* @class     Ext.core.finance.ux.rptSeverancePayFilterCriteria.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.core.finance.ux.rptSeverancePayFilterCriteria.Grid = function (config) {
    Ext.core.finance.ux.rptSeverancePayFilterCriteria.Grid.superclass.constructor.call(this, Ext.apply({
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
                    Ext.getCmp('rptSeverancePayFilterCriteria-grid').body.mask('Loading...', 'x-mask-loading');
                },
                load: function () {
                    var grid = Ext.getCmp('rptSeverancePayFilterCriteria-grid');
                    grid.body.unmask();
                    Ext.core.finance.ux.SystemMessageManager.hide();
                },
                loadException: function () {
                    Ext.getCmp('rptSeverancePayFilterCriteria-grid').body.unmask();
                },
                scope: this
            }
        }),
        id: 'rptSeverancePayFilterCriteria-grid',
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
Ext.extend(Ext.core.finance.ux.rptSeverancePayFilterCriteria.Grid, Ext.grid.EditorGridPanel, {
    initComponent: function () {

        this.tbar = ['Filter By', {
            id: 'cmbSeverancePayFilterBy',
            hiddenName: 'FilterBy',
            xtype: 'combo',
            fieldLabel: 'Filter By',
            triggerAction: 'all',
            width: 150,
            mode: 'local',
            editable: false,
            disabled: true,
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

                    var selText = Ext.getCmp('cmbSeverancePayFilterBy').lastSelectionText;

                    if (selText == 'Departments') {
                        Tsa.GetRptDepartments(function (response) {
                            var storeData = Ext.util.JSON.decode(response.data.baseEntries);
                            var storeFields = response.data.fields;
                            var grid = Ext.getCmp('rptSeverancePayFilterCriteria-grid');
                            var store = new Ext.core.finance.ux.rptSeverancePayFilterCriteria.Store({
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

                    if (selText == 'Regions') {
                        Tsa.GetRptRegions(function (response) {
                            var storeData = Ext.util.JSON.decode(response.data.baseEntries);
                            var storeFields = response.data.fields;
                            var grid = Ext.getCmp('rptSeverancePayFilterCriteria-grid');
                            var store = new Ext.core.finance.ux.rptSeverancePayFilterCriteria.Store({
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
                                    header: 'Regions',
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

                    if (selText == 'Woredas') {
                        Tsa.GetRptWoredas(function (response) {
                            var storeData = Ext.util.JSON.decode(response.data.baseEntries);
                            var storeFields = response.data.fields;
                            var grid = Ext.getCmp('rptSeverancePayFilterCriteria-grid');
                            var store = new Ext.core.finance.ux.rptSeverancePayFilterCriteria.Store({
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
                                    header: 'Woredas',
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

                    if (selText == 'Employees') {
                        Tsa.GetRptEmployees(function (response) {
                            var storeData = Ext.util.JSON.decode(response.data.baseEntries);
                            var storeFields = response.data.fields;
                            var grid = Ext.getCmp('rptSeverancePayFilterCriteria-grid');
                            var store = new Ext.core.finance.ux.rptSeverancePayFilterCriteria.Store({
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
                                    header: 'Employees',
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
            id: 'cmdSeverancePayPreview',
            text: 'Preview',
            iconCls: 'icon-preview',
            scope: this,
            hidden: false,
            handler: this.onPreviewClick,
            disabled: !Ext.core.finance.ux.Reception.getPermission('Severance Pay Journals', 'CanView')
        }, {
            xtype: 'tbseparator'
        }, {
            id: 'cmdSeverancePayReset',
            text: 'Reset',
            hidden: false,
            iconCls: 'icon-exit',
            handler: function () {
                form = Ext.getCmp('rptSeverancePay-form').getForm().reset();
                Ext.getCmp('rptSeverancePayFilterCriteria-grid').getStore().removeAll();
                //                Ext.getCmp('rptSeverancePayFilterCriteria-paging').doRefresh();
            },
            scope: this
        }];

        this.bbar = new Ext.PagingToolbar({
            id: 'rptSeverancePayFilterCriteria-paging',
            store: this.store,
            displayInfo: false,

            pageSize: this.pageSize

        });
        this.bbar.refresh.hide();
        Ext.core.finance.ux.rptSeverancePayFilterCriteria.Grid.superclass.initComponent.apply(this, arguments);
    },
    onPreviewClick: function () {
        Ext.MessageBox.show({
            msg: 'Generating Pay SeverancePay, please wait...',
            progressText: 'Loading...',
            width: 300,
            wait: true,
            waitConfig: { interval: 200 }
        });
        var periodId = Ext.getCmp('rptSeverancePayPeriodId').getValue();
        var periodName = Ext.getCmp('rptSeverancePayPeriodId').getRawValue();
        var filterBy = Ext.getCmp('cmbSeverancePayFilterBy').getRawValue();
        var grid = Ext.getCmp('rptSeverancePayFilterCriteria-grid');
        var groupIds = grid.getSelectionModel().getSelections();
        var iframePanel = Ext.getCmp('rptSeverancePay-iframePanel');
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
        var form = Ext.getCmp('rptSeverancePay-form');

        var selectedReport = 'rpt_SeverancePay';
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
        //                var iframePanel = Ext.getCmp('rptSeverancePay-iframePanel');
        //                var url = 'Reports/ReportViewer.aspx?rt=SeverancePay' + '&' + periodId + '&' + periodName + '&' + GroupId;
        //                iframePanel.removeAll();
        //                iframePanel.add(new Ext.core.finance.ux.common.IFrameComponent({ url: url }));
        //                iframePanel.doLayout();
        //            }
        //        });

    }

});
Ext.reg('rptSeverancePayFilterCriteria-grid', Ext.core.finance.ux.rptSeverancePayFilterCriteria.Grid);

Ext.core.finance.ux.rptSeverancePayFilterCriteria.Panel = function (config) {
    Ext.core.finance.ux.rptSeverancePayFilterCriteria.Panel.superclass.constructor.call(this, Ext.apply({


        layout: 'fit',
        border: false
    }, config));
};

/*******************              END OF SECTORS/LOCATIONS GRID                ********************/
