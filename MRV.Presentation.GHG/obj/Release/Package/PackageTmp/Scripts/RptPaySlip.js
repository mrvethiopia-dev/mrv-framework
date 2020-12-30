Ext.ns('Ext.core.finance.ux.rptPaySlip');
Ext.ns('Ext.core.finance.ux.rptSlipFilterCriteria');

/**
* @desc      Pay Slip Report Criteria form
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      December 24, 2013
* @namespace Ext.core.finance.ux.rptPaySlip
* @class     Ext.core.finance.ux.rptPaySlip.Form
* @extends   Ext.form.FormPanel
*/
Ext.core.finance.ux.rptPaySlip.Form = function (config) {
    Ext.core.finance.ux.rptPaySlip.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            submit: PayrollItems.Get
        },
        defaults: {
            anchor: '100%',
            msgTarget: 'side',
            labelStyle: 'text-align:right;'
        },
        id: 'rptPaySlip-form',
        padding: 3,
        labelWidth: 100,
        height: 150,
        border: false,
        autoWidth: true,
        baseCls: 'x-plain',
        items: [{
            id: 'rptSlipPeriodId', xtype: 'combo', anchor: '100%', fieldLabel: 'Select Period', triggerAction: 'all', mode: 'local', editable: false, typeAhead: true,
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
Ext.extend(Ext.core.finance.ux.rptPaySlip.Form, Ext.form.FormPanel);
Ext.reg('rptPaySlip-form', Ext.core.finance.ux.rptPaySlip.Form);
var selModelFiltCriteria = new Ext.grid.CheckboxSelectionModel();







/**
* @desc      Pay Slip Report viewer panel
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      November 01, 2013
* @namespace Ext.core.finance.ux.rptPaySlip
* @class     Ext.core.finance.ux.rptPaySlip.Panel
* @extends   Ext.Panel
*/
Ext.core.finance.ux.rptPaySlip.Panel = function (config) {
    Ext.core.finance.ux.rptPaySlip.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false
    }, config));
}
Ext.extend(Ext.core.finance.ux.rptPaySlip.Panel, Ext.Panel, {
    initComponent: function () {
        this.url = 'Empty.aspx';
        this.form = new Ext.core.finance.ux.rptPaySlip.Form();
        this.FilterGrid = new Ext.core.finance.ux.rptSlipFilterCriteria.Grid();

        this.iframeComponent = new Ext.core.finance.ux.common.IFrameComponent({ url: this.url });

        this.items = [{
            layout: 'border',
            border: false,
            items: [{
                region: 'west',
                border: true,
                collapsible: true,
                title: 'Report - [Pay Slip]',
                split: true,
                width: 355,
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
                    id: 'rptPaySlip-iframePanel',
                    items: [this.iframeComponent]
                }]
            }]
        }];

        Ext.core.finance.ux.rptPaySlip.Panel.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('rptPaySlip-panel', Ext.core.finance.ux.rptPaySlip.Panel);




/********************                 Departments GRID                 ********************/


Ext.core.finance.ux.rptSlipFilterCriteria.Store = function (config) {
    Ext.core.finance.ux.rptSlipFilterCriteria.Store.superclass.constructor.call(this, Ext.apply({
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
Ext.extend(Ext.core.finance.ux.rptSlipFilterCriteria.Store, Ext.data.DirectStore);
Ext.reg('rptSlipFilterCriteria-store', Ext.core.finance.ux.rptSlipFilterCriteria.Store);

/**
* @desc      rptSlipFilterCriteria grid
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      November 01, 2013
* @namespace Ext.core.finance.ux.rptSlipFilterCriteria
* @class     Ext.core.finance.ux.rptSlipFilterCriteria.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.core.finance.ux.rptSlipFilterCriteria.Grid = function (config) {
    Ext.core.finance.ux.rptSlipFilterCriteria.Grid.superclass.constructor.call(this, Ext.apply({
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
                    Ext.getCmp('rptSlipFilterCriteria-grid').body.mask('Loading...', 'x-mask-loading');
                },
                load: function () {
                    var grid = Ext.getCmp('rptSlipFilterCriteria-grid');
                    grid.body.unmask();
                    Ext.core.finance.ux.SystemMessageManager.hide();
                },
                loadException: function () {
                    Ext.getCmp('rptSlipFilterCriteria-grid').body.unmask();
                },
                scope: this
            }
        }),
        id: 'rptSlipFilterCriteria-grid',
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
Ext.extend(Ext.core.finance.ux.rptSlipFilterCriteria.Grid, Ext.grid.EditorGridPanel, {
    initComponent: function () {

        this.tbar = ['Filter By', {
            id: 'cmbSlipFilterBy',
            hiddenName: 'FilterBy',
            xtype: 'combo',
            fieldLabel: 'Filter',
            triggerAction: 'all',
            width: 75,
            mode: 'local',
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

                    var selText = Ext.getCmp('cmbSlipFilterBy').lastSelectionText;

                    if (selText == 'Departments') {
                        Tsa.GetRptDepartments(function (response) {
                            var storeData = Ext.util.JSON.decode(response.data.baseEntries);
                            var storeFields = response.data.fields;
                            var grid = Ext.getCmp('rptSlipFilterCriteria-grid');
                            var store = new Ext.core.finance.ux.rptSlipFilterCriteria.Store({
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
                            var grid = Ext.getCmp('rptSlipFilterCriteria-grid');
                            var store = new Ext.core.finance.ux.rptSlipFilterCriteria.Store({
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
                            var grid = Ext.getCmp('rptSlipFilterCriteria-grid');
                            var store = new Ext.core.finance.ux.rptSlipFilterCriteria.Store({
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
                            var grid = Ext.getCmp('rptSlipFilterCriteria-grid');
                            var store = new Ext.core.finance.ux.rptSlipFilterCriteria.Store({
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
            id: 'cmdSlipPreview',
            text: 'Preview',
            iconCls: 'icon-preview',
            scope: this,
            hidden: false,
            handler: this.onPreviewClick,
            disabled: !Ext.core.finance.ux.Reception.getPermission('Pay Slips', 'CanView')
        }, {
            xtype: 'tbseparator'
        }, {
            id: 'cmdSlipReset',
            text: 'Reset',
            hidden: false,
            iconCls: 'icon-exit',
            handler: function () {
                form = Ext.getCmp('rptPaySlip-form').getForm().reset();
                Ext.getCmp('rptSlipFilterCriteria-grid').getStore().removeAll();
                //                Ext.getCmp('rptSlipFilterCriteria-paging').doRefresh();
            },
            scope: this
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Email Pay Slip',
            id: 'cmdEmailSlip',
            iconCls: 'icon-Email ',
            handler: this.onSendEmailClick
        }];

        this.bbar = new Ext.PagingToolbar({
            id: 'rptSlipFilterCriteria-paging',
            store: this.store,
            displayInfo: false,

            pageSize: this.pageSize

        });
        this.bbar.refresh.hide();
        Ext.core.finance.ux.rptSlipFilterCriteria.Grid.superclass.initComponent.apply(this, arguments);
    },
    onPreviewClick: function () {
        Ext.MessageBox.show({
            msg: 'Generating Pay Slip, please wait...',
            progressText: 'Loading...',
            width: 300,
            wait: true,
            waitConfig: { interval: 200 }
        });
        var periodId = Ext.getCmp('rptSlipPeriodId').getValue();
        var periodName = Ext.getCmp('rptSlipPeriodId').getRawValue();
        var filterBy = Ext.getCmp('cmbSlipFilterBy').getRawValue();
        var grid = Ext.getCmp('rptSlipFilterCriteria-grid');
        var groupIds = grid.getSelectionModel().getSelections();
        var iframePanel = Ext.getCmp('rptPaySlip-iframePanel');
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
        var form = Ext.getCmp('rptPaySlip-form');

        var selectedReport = 'rpt_paySlip';
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
        //                var iframePanel = Ext.getCmp('rptPaySlip-iframePanel');
        //                var url = 'Reports/ReportViewer.aspx?rt=PaySlip' + '&' + periodId + '&' + periodName + '&' + GroupId;
        //                iframePanel.removeAll();
        //                iframePanel.add(new Ext.core.finance.ux.common.IFrameComponent({ url: url }));
        //                iframePanel.doLayout();
        //            }
        //        });

    },
    onSendEmailClick: function () {
        var periodId = Ext.getCmp('rptSlipPeriodId').getValue();
        var grid = Ext.getCmp('rptSlipFilterCriteria-grid');
        var groupIds = grid.getSelectionModel().getSelections();
        
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
        Ext.MessageBox.show({
            title: 'Email pay slip',
            msg: 'Are you sure you want to send pay slips to employees? Is it your final payroll generation? ',
            buttons: {
                ok: 'Yes',
                no: 'No'
            },
            icon: Ext.MessageBox.QUESTION,
            scope: this,
            fn: function (btn) {
                if (btn == 'ok') {
                    Ext.MessageBox.show({
                        msg: 'Sending Email, please wait...',
                        progressText: 'Creating attachments...',
                        width: 300,
                        wait: true,
                        waitConfig: { interval: 200 }
                    });
                    Ext.Ajax.timeout = 600000000;
                    window.Tsa.SendEmail(periodId,GroupId, function (response) {
                        if (response.success) {
                            Ext.MessageBox.show({
                                title: 'Email Pay Slip',
                                msg: response.data,
                                buttons: Ext.Msg.OK,
                                icon: Ext.MessageBox.INFO

                            });
                        } else {
                            Ext.MessageBox.show({
                                title: 'Error Sending Pay Slip',
                                msg: response.data,
                                buttons: Ext.Msg.OK,
                                icon: Ext.MessageBox.ERROR

                            });
                        }
                    });
                } else {
                    return;
                }
            }
        });
    }

});
Ext.reg('rptSlipFilterCriteria-grid', Ext.core.finance.ux.rptSlipFilterCriteria.Grid);

Ext.core.finance.ux.rptSlipFilterCriteria.Panel = function (config) {
    Ext.core.finance.ux.rptSlipFilterCriteria.Panel.superclass.constructor.call(this, Ext.apply({


        layout: 'fit',
        border: false
    }, config));
};

/*******************              END OF SECTORS/LOCATIONS GRID                ********************/
