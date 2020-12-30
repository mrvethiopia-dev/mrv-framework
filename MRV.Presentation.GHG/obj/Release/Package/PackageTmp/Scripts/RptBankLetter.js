Ext.ns('Ext.core.finance.ux.rptBankLetter');
Ext.ns('Ext.core.finance.ux.rptBankLetterFilterCriteria');

/**
* @desc      Bank Letter Report Criteria form
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      December 24, 2013
* @namespace Ext.core.finance.ux.rptBankLetter
* @class     Ext.core.finance.ux.rptBankLetter.Form
* @extends   Ext.form.FormPanel
*/
Ext.core.finance.ux.rptBankLetter.Form = function (config) {
    Ext.core.finance.ux.rptBankLetter.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            submit: PayrollItems.Get
        },
        defaults: {
            anchor: '100%',
            msgTarget: 'side',
            labelStyle: 'text-align:right;'
        },
        id: 'rptBankLetter-form',
        padding: 3,
        labelWidth: 100,
        autoHeight: false,
        height: 150,
        border: false,
        autoWidth: true,
        baseCls: 'x-plain',
        items: [{
            id: 'rptBankLetterPeriodId', xtype: 'combo', anchor: '100%', fieldLabel: 'Select Period', triggerAction: 'all', mode: 'local', editable: false, typeAhead: true,
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

        }, {
            id: 'rptBankId',
            xtype: 'combo',
            fieldLabel: 'Bank',
            anchor: '96.5%',
            triggerAction: 'all',
            mode: 'local',
            editable: false,
            typeAhead: true,
            forceSelection: true,
            emptyText: '---Select Bank---',
            allowBlank: true,
            store: new Ext.data.DirectStore({
                reader: new Ext.data.JsonReader({
                    successProperty: 'success',
                    idProperty: 'Id',
                    root: 'data',
                    fields: ['Id', 'Name']
                }),
                autoLoad: true,
                api: { read: Tsa.GetBanks }
            }),
            valueField: 'Id', displayField: 'Name',
            listeners: {
                select: function (combo, record, index) {
                    var form = Ext.getCmp('rptBankLetter-form').getForm();
                    var id = record.data.Id;
                    var branch = form.findField('rptBranchId');
                    branch.clearValue();
                    branch.store.load({ params: { parentId: id} });
                }
            }
        }, {
            id: 'rptBranchId',
            hiddenName: 'rptBranchId',
            xtype: 'combo',
            fieldLabel: 'Bank Branch',
            anchor: '96.5%',
            triggerAction: 'all',
            mode: 'local',
            editable: true,
            typeAhead: true,
            forceSelection: true,
            emptyText: '---Select Bank---',
            allowBlank: false,
            store: new Ext.data.DirectStore({
                reader: new Ext.data.JsonReader({
                    successProperty: 'success',
                    idProperty: 'Id',
                    root: 'data',
                    fields: ['Id', 'BranchName']
                }),
                paramOrder: ['parentId'],
                //autoLoad: true,
                api: { read: Tsa.GetBankBranches }
            }),
            valueField: 'Id', displayField: 'BranchName',
            listeners: {
                select: function (combo, record, index) {
                    //var form = Ext.getCmp('rptBankLetter-form').getForm();
                    //var branchId = record.data.Id;
                    //var fieldbranchId = form.findField('BankBranchId');
                    //fieldbranchId.setValue(branchId);
                },
                change: function (ele, newValue, oldValue) {
                    var k = 0;
                }

            }
        }, {
            id: 'BankBranchId',
            hiddenName: 'BankBranchId',
            xtype: 'textfield',
            fieldLabel: 'BankBranchId',
            anchor: '90%',
            allowBlank: false,
            hidden: true
        }, {
            id: 'rptBankBatchId',
            hiddenName: 'rptBankBatchId',
            xtype: 'combo',
            fieldLabel: 'Batch No',
            triggerAction: 'all',
            mode: 'local',
            editable: false,
            forceSelection: false,
            emptyText: '---Select---',
            allowBlank: false,
            store: new Ext.data.ArrayStore({
                fields: ['Id', 'Name'],
                data: [
                    ['FirstBatch', 'First Batch'],
                    ['SecondBatch', 'Second Batch'],
                    ['ThirdBatch', 'Third Batch'],
                    ['FourthBatch', 'Fourth Batch']
                ]
            }),
            valueField: 'Id',
            displayField: 'Name',
            listeners: {
                select: function (cmb, rec, idx) {
                }
            }
        }, {
            id: 'rptBankBranchId',
            xtype: 'combo',
            fieldLabel: 'Bank Branch',
            anchor: '96.5%',
            triggerAction: 'all',
            mode: 'local',
            editable: false,
            typeAhead: true,
            forceSelection: true,
            emptyText: '---Select Bank---',
            allowBlank: true,
            hidden: true,
            store: new Ext.data.DirectStore({
                reader: new Ext.data.JsonReader({
                    successProperty: 'success',
                    idProperty: 'Id',
                    root: 'data',
                    fields: ['Id', 'BranchName']
                }),
                paramOrder: ['parentId'],
                //autoLoad: true,
                api: { read: Tsa.GetBankBranches }
            }),
            valueField: 'Id', displayField: 'BranchName'
        }]
    }, config));
};
Ext.extend(Ext.core.finance.ux.rptBankLetter.Form, Ext.form.FormPanel);
Ext.reg('rptBankLetter-form', Ext.core.finance.ux.rptBankLetter.Form);
var selModelFiltCriteria = new Ext.grid.CheckboxSelectionModel();







/**
* @desc      Bank Letter Report viewer panel
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      November 01, 2013
* @namespace Ext.core.finance.ux.rptBankLetter
* @class     Ext.core.finance.ux.rptBankLetter.Panel
* @extends   Ext.Panel
*/
Ext.core.finance.ux.rptBankLetter.Panel = function (config) {
    Ext.core.finance.ux.rptBankLetter.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false
    }, config));
}
Ext.extend(Ext.core.finance.ux.rptBankLetter.Panel, Ext.Panel, {
    initComponent: function () {
        this.url = 'Empty.aspx';
        this.form = new Ext.core.finance.ux.rptBankLetter.Form();
        this.FilterGrid = new Ext.core.finance.ux.rptBankLetterFilterCriteria.Grid();

        this.iframeComponent = new Ext.core.finance.ux.common.IFrameComponent({ url: this.url });

        this.items = [{
            layout: 'border',
            border: false,
            items: [{
                region: 'west',
                border: true,
                collapsible: true,
                title: 'Report - [Bank Letter]',
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
                    id: 'rptBankLetter-iframePanel',
                    items: [this.iframeComponent]
                }]
            }]
        }];

        Ext.core.finance.ux.rptBankLetter.Panel.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('rptBankLetter-panel', Ext.core.finance.ux.rptBankLetter.Panel);




/********************                 Departments GRID                 ********************/


Ext.core.finance.ux.rptBankLetterFilterCriteria.Store = function (config) {
    Ext.core.finance.ux.rptBankLetterFilterCriteria.Store.superclass.constructor.call(this, Ext.apply({
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
Ext.extend(Ext.core.finance.ux.rptBankLetterFilterCriteria.Store, Ext.data.DirectStore);
Ext.reg('rptBankLetterFilterCriteria-store', Ext.core.finance.ux.rptBankLetterFilterCriteria.Store);

/**
* @desc      rptBankLetterFilterCriteria grid
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      November 01, 2013
* @namespace Ext.core.finance.ux.rptBankLetterFilterCriteria
* @class     Ext.core.finance.ux.rptBankLetterFilterCriteria.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.core.finance.ux.rptBankLetterFilterCriteria.Grid = function (config) {
    Ext.core.finance.ux.rptBankLetterFilterCriteria.Grid.superclass.constructor.call(this, Ext.apply({
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
                    Ext.getCmp('rptBankLetterFilterCriteria-grid').body.mask('Loading...', 'x-mask-loading');
                },
                load: function () {
                    var grid = Ext.getCmp('rptBankLetterFilterCriteria-grid');
                    grid.body.unmask();
                    Ext.core.finance.ux.SystemMessageManager.hide();
                },
                loadException: function () {
                    Ext.getCmp('rptBankLetterFilterCriteria-grid').body.unmask();
                },
                scope: this
            }
        }),
        id: 'rptBankLetterFilterCriteria-grid',
        pageSize: 10,
        //height: 700,
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
Ext.extend(Ext.core.finance.ux.rptBankLetterFilterCriteria.Grid, Ext.grid.EditorGridPanel, {
    initComponent: function () {

        this.tbar = ['Filter By', {
            id: 'cmbBankLetterFilterBy',
            hiddenName: 'FilterBy',
            xtype: 'combo',
            fieldLabel: 'Filter By',
            triggerAction: 'all',
            width: 150,

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

                    var selText = Ext.getCmp('cmbBankLetterFilterBy').lastSelectionText;

                    if (selText == 'Departments') {
                        Tsa.GetRptDepartments(function (response) {
                            var storeData = Ext.util.JSON.decode(response.data.baseEntries);
                            var storeFields = response.data.fields;
                            var grid = Ext.getCmp('rptBankLetterFilterCriteria-grid');
                            var store = new Ext.core.finance.ux.rptBankLetterFilterCriteria.Store({
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
                            var grid = Ext.getCmp('rptBankLetterFilterCriteria-grid');
                            var store = new Ext.core.finance.ux.rptBankLetterFilterCriteria.Store({
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
                            var grid = Ext.getCmp('rptBankLetterFilterCriteria-grid');
                            var store = new Ext.core.finance.ux.rptBankLetterFilterCriteria.Store({
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
                            var grid = Ext.getCmp('rptBankLetterFilterCriteria-grid');
                            var store = new Ext.core.finance.ux.rptBankLetterFilterCriteria.Store({
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
            id: 'cmdBankLetterPreview',
            text: 'Preview',
            iconCls: 'icon-preview',
            scope: this,
            hidden: false,
            handler: this.onPreviewClick,
            disabled: !Ext.core.finance.ux.Reception.getPermission('Bank Letter', 'CanView')
        }, {
            xtype: 'tbseparator'
        }, {
            id: 'cmdBankLetterReset',
            text: 'Reset',
            hidden: false,
            iconCls: 'icon-exit',
            handler: function () {
                form = Ext.getCmp('rptBankLetter-form').getForm().reset();
                Ext.getCmp('rptBankLetterFilterCriteria-grid').getStore().removeAll();
                //                Ext.getCmp('rptBankLetterFilterCriteria-paging').doRefresh();
            },
            scope: this
        }];

    
       
        Ext.core.finance.ux.rptBankLetterFilterCriteria.Grid.superclass.initComponent.apply(this, arguments);
    },
    onPreviewClick: function () {
        Ext.MessageBox.show({
            msg: 'Generating Bank Letter, please wait...',
            progressText: 'Loading...',
            width: 300,
            wait: true,
            waitConfig: { interval: 200 }
        });
        var periodId = Ext.getCmp('rptBankLetterPeriodId').getValue();
        var batchId = Ext.getCmp('rptBankBatchId').getValue();
        var periodName = Ext.getCmp('rptBankLetterPeriodId').getRawValue();
        //var bankBranchId = Ext.getCmp('rptBranchId').getValue();
        var bankId = Ext.getCmp('rptBranchId').getValue();
        var iframePanel = Ext.getCmp('rptBankLetter-iframePanel');
        var filterBy = Ext.getCmp('cmbBankLetterFilterBy').getRawValue();
        var grid = Ext.getCmp('rptBankLetterFilterCriteria-grid');

        var GroupId = [];
        var groupIds = grid.getSelectionModel().getSelections();
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
        if (bankId == '') {
            Ext.MessageBox.show({
                title: 'Bank Branch not selected',
                msg: 'You must select a Bank Branch.',
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
//        if (branchId == '') {
//            Ext.MessageBox.show({
//                title: 'Bank Branch not selected',
//                msg: 'You must specify the Branch Name.',
//                buttons: Ext.Msg.OK,
//                icon: Ext.MessageBox.INFO,
//                scope: this
//            });
//            return;
//        }
        if (bankId == '') {
            bankId = 0;
        } 
        var form = Ext.getCmp('rptBankLetter-form');

        var selectedReport = 'rpt_BankLetter';
        PayrollReports.ViewOtherReport(selectedReport, periodId, periodName, bankId, filterBy, GroupId,batchId, function (result, response) {
            if (result.success) {
                var url = result.URL;

                iframePanel.removeAll();
                iframePanel.add(new Ext.core.finance.ux.common.IFrameComponent({ url: url }));
                iframePanel.doLayout();
                Ext.MessageBox.hide();
            }

        });

       

    }

});
Ext.reg('rptBankLetterFilterCriteria-grid', Ext.core.finance.ux.rptBankLetterFilterCriteria.Grid);

Ext.core.finance.ux.rptBankLetterFilterCriteria.Panel = function (config) {
    Ext.core.finance.ux.rptBankLetterFilterCriteria.Panel.superclass.constructor.call(this, Ext.apply({


        layout: 'fit',
        border: false
    }, config));
};

/*******************              END OF SECTORS/LOCATIONS GRID                ********************/
