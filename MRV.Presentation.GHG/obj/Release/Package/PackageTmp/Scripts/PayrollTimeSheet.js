Ext.ns('Ext.core.finance.ux.PayrollTimeSheet');
/**
* @desc      PayrollTimeSheet registration form
* @author    Dawit Kiros
* @copyright (c) 2013, LIFT
* @date      April 24, 2013
* @namespace Ext.core.finance.ux.PayrollTimeSheet
* @class     Ext.core.finance.ux.PayrollTimeSheet.Form
* @extends   Ext.form.FormPanel
*/

Ext.core.finance.ux.PayrollTimeSheet.Form = function (config) {
    Ext.core.finance.ux.PayrollTimeSheet.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: PayrollItems.Get,
            submit: PayrollItems.Save
        },
        paramOrder: ['id'],
        defaults: {
            anchor: '50%',
            msgTarget: 'side',
            labelStyle: 'text-align:right;'
        },
        id: 'PayrollTimeSheet-form',
        labelWidth: 115,
        height: 27,
        border: false,
        layout: 'form',
        bodyStyle: 'background:transparent;padding:5px',
        baseCls: 'x-plain',
        tbar: [{
            xtype: 'displayfield',
            id: 'PayrollTimeSheet',
            style: 'font-weight: bold'
        }, {
            text: 'Save Timesheet',
            xtype: 'button',
            align: 'left',
            id: 'SaveEmpAttendance',
            iconCls: 'icon-save',
            disabled: !Ext.core.finance.ux.Reception.getPermission('Employee Time Sheet', 'CanAdd'),

            handler: function () {
                var grid = Ext.getCmp('PayrollTimeSheet-grid');
                var rec = '';
                var empDetail = grid.getStore().getModifiedRecords();
                var periodId = Ext.getCmp('AttPeriodId').getValue();

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
                    msg: 'Saving time sheet, please wait...',
                    progressText: 'Saving...',
                    width: 300,
                    wait: true,
                    waitConfig: { interval: 200 }
                });
                for (var i = 0; i < empDetail.length; i++) {

                    var NoOfDaysWorked = empDetail[i].data.NoOfDaysWorked;
                    var empId = empDetail[i].data.Id;

                    rec = rec + NoOfDaysWorked + ':' + empId + ';';
                }
                var totalWorkingDays = Ext.getCmp('totalWorkingDays2').getRawValue();

                PayrollTimeSheet.SaveAttendance(rec, periodId, totalWorkingDays, function (result, response) {
                    if (result.success) {
                        Ext.MessageBox.alert('Time sheet', 'Employee time sheet saved successfully!');
                    }
                });
            }
        }, {
            xtype: 'tbseparator'
        },
        'Select Period',
        {
            id: 'AttPeriodId',
            xtype: 'combo', anchor: '55%', fieldLabel: 'Period', triggerAction: 'all', mode: 'local', editable: false, typeAhead: true,
            forceSelection: true, emptyText: '---Select Period---', allowBlank: false,
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
            valueField: 'Id', displayField: 'Name',
            listeners: {
                select: function () {
                    var periodId = Ext.getCmp('AttPeriodId').getValue();

                    window.Tsa.GetWorkingDays(periodId, function (response) {
                        var text = 'Working Days in a Month = ' + response.data;
                        Ext.getCmp('totalWorkingDays').setValue(text);
                        Ext.getCmp('totalWorkingDays2').setValue(response.data);
                    });
                    Ext.getCmp('btnInsert').setDisabled(false);
                    Ext.getCmp('AttendanceDeptTree-tree').setDisabled(false);
                    //                    var empGrid = Ext.getCmp('PayrollTimeSheet-grid');
                    //                            var periodId = Ext.getCmp('AttPeriodId').getValue();
                    //                            //empGrid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue() });
                    //                            empGrid.store.load({ params: { start: 0, limit: empGrid.pageSize, periodId:periodId} });
                }
            }
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'displayfield',
            style: 'font-weight: italics;',
            value: 'Working Days in a Month =',
            id: 'totalWorkingDays',
            autoWidth: true
        }, {
            xtype: 'displayfield',
            style: 'font-weight: italics;',
            value: '',
            id: 'totalWorkingDays2',
            autoWidth: true,
            hidden: true
        }, {
            xtype: 'tbseparator'
        }, {
            text: 'Insert for all',
            xtype: 'button',
            align: 'left',
            id: 'btnInsert',
            disabled:true,
            iconCls: 'icon-add',
            handler: function () {

                var totalWorkingDays = Ext.getCmp('totalWorkingDays2').getRawValue();

                new Ext.core.finance.ux.payrollTimeSheetOptions.Window({
                    title: 'Populate Working Days for all Employees', TotalDays: totalWorkingDays
                }).show();
            }
        }, '->', {
            id: 'txtSearchEmployee',
            xtype: 'textfield',
            emptyText: 'Search Employee',
            submitEmptyText: false,
            enableKeyEvents: true,
            style: {
                borderRadius: '5px',
                padding: '0 10px',
                width: '179px'
            },
            listeners: {
                specialkey: function (field, e) {
                    if (e.getKey() == e.ENTER) {
                        var empGrid = Ext.getCmp('PayrollTimeSheet-grid');
                        var periodId = Ext.getCmp('AttPeriodId').getValue();
                        empGrid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue() });
                        empGrid.store.load({ params: { start: 0, limit: empGrid.pageSize, periodId: periodId} });
                    }
                },
                keyup: function (field) {
                    if (field.getValue() == '') {
                        var empGrid = Ext.getCmp('PayrollTimeSheet-grid');
                        var periodId = Ext.getCmp('AttPeriodId').getValue();
                        empGrid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue() });
                        empGrid.store.load({ params: { start: 0, limit: empGrid.pageSize, periodId: periodId} });
                    }
                }
            }
        }],
        items: []
    }, config));
};
Ext.extend(Ext.core.finance.ux.PayrollTimeSheet.Form, Ext.form.FormPanel);
Ext.reg('PayrollTimeSheet-form', Ext.core.finance.ux.PayrollTimeSheet.Form);

/**
* @desc      PayrollTimeSheet grid
* @author    Dawit Kiros
* @copyright (c) 2013, LIFT
* @date      April 24, 2013
* @namespace Ext.core.finance.ux.PayrollTimeSheet
* @class     Ext.core.finance.ux.PayrollTimeSheet.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.core.finance.ux.PayrollTimeSheet.Grid = function (config) {
    Ext.core.finance.ux.PayrollTimeSheet.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: PayrollTimeSheet.GetPagedEmployee,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record|periodId',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Code',
                direction: 'ASC'
            },
            fields: ['Id', 'IdentityNo', 'FirstName', 'MiddleName', 'LastName', 'Position', 'NoOfDaysWorked'],
            remoteSort: true,
            listeners: {
                beforeLoad: function () { Ext.getCmp('PayrollTimeSheet-grid').body.mask('Loading...', 'x-mask-loading'); },
                load: function () { Ext.getCmp('PayrollTimeSheet-grid').body.unmask(); },
                loadException: function () { Ext.getCmp('PayrollTimeSheet-grid').body.unmask(); },
                scope: this
            }
        }),
        id: 'PayrollTimeSheet-grid',
        pageSize: 2000,
        stripeRows: true,
        border: true,
        clicksToEdit: 1,
        listeners: {
            afteredit: function (e) {
                var record = e.record;
                var grid = Ext.getCmp('PayrollTimeSheet-grid');
                var store, cm;
                if (e.field == 'NoOfDaysWorked') {
                    cm = grid.getColumnModel();
                    var daysWorked = record.get('NoOfDaysWorked');
                    var totalWorkingDays = Ext.getCmp('totalWorkingDays2').getRawValue();

                    if (daysWorked > totalWorkingDays) {
                        //record.set('NoOfDaysWorked', '');
                        Ext.MessageBox.show({
                            title: 'Reminder',
                            msg: 'The amount provided is greater than the number of working days for the selected month. Are you sure you want to continue? ',
                            buttons: Ext.Msg.OK,
                            icon: Ext.MessageBox.WARNING,
                            scope: this
                        });

                    }
                }
            }
        },
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        viewConfig: {
            forceFit: false,
            autoExpandColumn: 'IdentityNumber',
            autoFill: true
        },
        columns: [{
            dataIndex: 'Id',
            header: 'Id',
            sortable: true,
            hidden: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'IdentityNo',
            header: 'Id No.',
            sortable: true,
            width: 220,
            menuDisabled: false
        }, {
            dataIndex: 'FirstName',
            header: 'First Name',
            sortable: true,
            width: 200,
            menuDisabled: true
        }, {
            dataIndex: 'MiddleName',
            header: 'Middle Name',
            sortable: true,
            typeAhead: true,
            xtype: 'combocolumn',
            width: 200,
            menuDisabled: true
        }, {
            dataIndex: 'LastName',
            header: 'Last Name',
            sortable: true,
            width: 220,
            menuDisabled: true
        }, {
            dataIndex: 'Position',
            header: 'Position',
            sortable: true,
            width: 250,
            menuDisabled: true
        }, {
            dataIndex: 'NoOfDaysWorked',
            header: 'Actual Days',
            sortable: true,
            width: 250,
            menuDisabled: true,
            editor: new Ext.form.NumberField({
                allowBlank: false,
                allowNegative: false,
                listeners: {
                    focus: function (field) {
                        field.selectText();
                    }
                }
            })
        }]
    }, config));
}

Ext.extend(Ext.core.finance.ux.PayrollTimeSheet.Grid, Ext.grid.EditorGridPanel, {
    initComponent: function () {
              // this.store.baseParams = { record: Ext.encode({ UnitId: this.unitId, SearchParam: this.searchParam }) };
        var TransGrid = Ext.getCmp('PayrollTimeSheet-grid');
        this.tbar = [new Ext.ux.Exporter.Button({
            store: TransGrid.getStore(),
            exportFunction: 'exportStore',
            id: 'btn-timesheet-export',
            text: "Export to Excel",
            //iconCls: 'icon-Excel',
            listeners: {
                click: function () {
                    var grid = Ext.getCmp('PayrollTimeSheet-grid');
                    var columns = [];
                    grid.colModel.config.forEach(function (col) {
                        if (!col.hidden) {
                            columns.push(new Ext.data.Field(col.dataIndex));
                        }
                    });

                    Ext.getCmp('btn-timesheet-export').constructor({
                        store: grid.store.getStore(),
                        exportFunction: 'exportStore',
                        columns: columns,
                        text: "Export to Excel",
                        //iconCls: 'icon-Excel',
                        title: ''
                    });
                }
            }
        })];
        this.bbar = new Ext.PagingToolbar({
            id: 'employeeMain-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.core.finance.ux.PayrollTimeSheet.Grid.superclass.initComponent.apply(this, arguments);
    }

});
Ext.reg('PayrollTimeSheet-grid', Ext.core.finance.ux.PayrollTimeSheet.Grid);

/**
* @desc      PayrollTimeSheet panel
* @author    Dawit Kiros
* @copyright (c) 2013, LIFT
* @date      April 24, 2013
* @namespace Ext.core.finance.ux.PayrollTimeSheet
* @class     Ext.core.finance.ux.PayrollTimeSheet.Panel
* @extends   Ext.Panel
*/
Ext.core.finance.ux.PayrollTimeSheet.Panel = function (config) {
    Ext.core.finance.ux.PayrollTimeSheet.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false
    }, config));
};
Ext.extend(Ext.core.finance.ux.PayrollTimeSheet.Panel, Ext.Panel, {
    initComponent: function () {
        this.form = new Ext.core.finance.ux.PayrollTimeSheet.Form();
        this.grid = new Ext.core.finance.ux.PayrollTimeSheet.Grid();
        this.AttTree = new Ext.core.finance.ux.AttendanceDeptTree.Tree({
            grid: this.grid
        });
        this.items = [{
            layout: 'border',
            border: false,
            items: [{
                region: 'west',
                border: true,
                collapsible: true,
                split: true,
                width: 300,
                minSize: 100,
                maxSize: 400,
                layout: 'fit',
                margins: '0 3 0 0',
                items: [this.AttTree]
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
                    items: [this.form, this.grid]
                }]
            }]
        }];
        Ext.core.finance.ux.PayrollTimeSheet.Panel.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('PayrollTimeSheet-panel', Ext.core.finance.ux.PayrollTimeSheet.Panel);