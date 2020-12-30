Ext.ns('Ext.core.finance.ux.payrollOvertimeHeader');
/**
* @desc      payrollOvertimeHeader registration form
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      April 24, 2013
* @namespace Ext.core.finance.ux.payrollOvertimeHeader
* @class     Ext.core.finance.ux.payrollOvertimeHeader.Form
* @extends   Ext.form.FormPanel
*/
Ext.core.finance.ux.payrollOvertimeHeader.Form = function (config) {
    Ext.core.finance.ux.payrollOvertimeHeader.Form.superclass.constructor.call(this, Ext.apply({
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
        id: 'payrollOvertimeHeader-form',
        labelWidth: 115,
        height: 30,
        border: false,
        layout: 'form',
        bodyStyle: 'background:transparent;padding:5px',
        baseCls: 'x-plain',
        tbar: [{
            xtype: 'displayfield',
            id: 'payrollOvertimeHeader',
            style: 'font-weight: bold'
        }, {
            xtype: 'button',
            text: 'Save OT',
            id: 'addEmployeeDetail',
            iconCls: 'icon-save',
            disabled: !Ext.core.finance.ux.Reception.getPermission('Employee Overtime', 'CanAdd'),
            handler: function () {
                var gridHeader = Ext.getCmp('payrollOvertimeHeader-grid');
                var gridDetail = Ext.getCmp('payrollOvertimeDetail-grid');
                var empId;
                var rec = '';

                var periodId = Ext.getCmp('periodId').getValue();

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
                if (!gridHeader.getSelectionModel().hasSelection()) {
                    Ext.MessageBox.show({
                        title: 'Employee not selected',
                        msg: 'You must select an employee to attach an overtime.',
                        buttons: Ext.Msg.OK,
                        icon: Ext.MessageBox.INFO,
                        scope: this
                    });
                    return;
                }
                else {
                    empId = gridHeader.getSelectionModel().getSelected().get('Id');
                }

                var otHours = gridDetail.getStore();
                var empOvertime = [];

                otHours.each(function (item) {

                    if ((item.data['HoursWorked'] != 0 && item.data['OvertimeType'] != '')) {
                        var hours = item.data['HoursWorked'];
                        var otType = item.data['OvertimeType'];
                        var otDate = item.data['OTDate'];
                         otDate= otDate.format('M/d/yyyy');
            

                        rec = rec + otType + ':' + hours + ':' + otDate + ';';
                    }
                });
                PayrollEmployeeOvertimeHours.SaveOvertime(rec, empId, periodId, function (result, response) {
                    if (result.success) {
                        Ext.MessageBox.alert('Employee Overtime', 'The overtime hour has been successfully saved!');
                    }
                });

            }
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Remove OT',
            id: 'editEmployeeDetail',
            iconCls: 'icon-delete',
            disabled: !Ext.core.finance.ux.Reception.getPermission('Employee Overtime', 'CanDelete'),
            handler: function () {
                var gridHeader = Ext.getCmp('payrollOvertimeHeader-grid');
                var gridDetail = Ext.getCmp('payrollOvertimeDetail-grid');

                var empId;
                var otId;
                var rec = '';

                var periodId = Ext.getCmp('periodId').getValue();

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
                if (!gridHeader.getSelectionModel().hasSelection()) {
                    Ext.MessageBox.show({
                        title: 'Employee not selected',
                        msg: 'You must select an employee to delete a particular overtime.',
                        buttons: Ext.Msg.OK,
                        icon: Ext.MessageBox.INFO,
                        scope: this
                    });
                    return;
                }
                else {
                    empId = gridHeader.getSelectionModel().getSelected().get('Id');
                }

                if (!gridDetail.getSelectionModel().hasSelection()) {
                    Ext.MessageBox.show({
                        title: 'Overtime Type not selected',
                        msg: 'You must select an overtime.',
                        buttons: Ext.Msg.OK,
                        icon: Ext.MessageBox.INFO,
                        scope: this
                    });
                    return;
                }
                else {
                    otId = gridDetail.getSelectionModel().getSelected().get('OvertimeType');
                }
                Ext.MessageBox.show({
                    title: 'Delete',
                    msg: 'Are you sure you want to remove this overtime?',
                    buttons: {
                        ok: 'Yes',
                        no: 'No'
                    },
                    icon: Ext.MessageBox.QUESTION,
                    scope: this,
                    animEl: 'Delete',
                    fn: function (btn) {
                        if (btn == 'ok') {
                            Ext.MessageBox.show({
                                title: 'Warning',
                                msg: 'Deleting this overtime could make other related data invalid. Press Ok to delete, Press Cancel to abort.',
                                buttons: {
                                    ok: 'Ok',
                                    cancel: 'Cancel'
                                },
                                icon: Ext.MessageBox.WARNING,
                                scope: this,
                                fn: function (btn) {
                                    if (btn == 'ok') {
                                        PayrollEmployeeOvertimeHours.Delete(otId, empId, periodId, function (result, response) {
                                            if (result.success) {
                                                var gridOTHours = Ext.getCmp('payrollOvertimeDetail-grid');
                                                var gridEmployees = Ext.getCmp('payrollOvertimeHeader-grid');
                                                if (!gridEmployees.getSelectionModel().hasSelection()) return;
                                                var empId = gridEmployees.getSelectionModel().getSelected().get('Id');
                                                var PeriodId = Ext.getCmp('periodId').getValue();
                                                var records = new Array();

                                                gridOTHours.getStore().load({
                                                    params: {

                                                        start: 0,
                                                        limit: 10,
                                                        sort: '',
                                                        dir: '',
                                                        EmpId: empId,
                                                        PeriodId: PeriodId
                                                    }

                                                });
                                            }
                                        });
                                    }
                                }
                            });
                        }
                    }
                });
            }
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'displayfield',
            value: 'Select Period',
            width: 95
        }, {
            id: 'periodId', xtype: 'combo', anchor: '55%', fieldLabel: 'Period', triggerAction: 'all', mode: 'local', editable: false, typeAhead: true,
            forceSelection: true, emptyText: '---Select Period---', allowBlank: false,
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
            valueField: 'Id', displayField: 'Name',
            listeners: {

                select: function () {
                    var gridOTHours = Ext.getCmp('payrollOvertimeDetail-grid');
                    var gridEmployees = Ext.getCmp('payrollOvertimeHeader-grid');
                    if (!gridEmployees.getSelectionModel().hasSelection()) return;
                    var empId = gridEmployees.getSelectionModel().getSelected().get('Id');
                    var PeriodId = Ext.getCmp('periodId').getValue();
                    var records = new Array();

                    gridOTHours.getStore().load({
                        params: {

                            start: 0,
                            limit: 10,
                            sort: '',
                            dir: '',
                            EmpId: empId,
                            PeriodId: PeriodId
                        }

                    });

                },
                scope: this
            }
        }, '->',{
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
                            var empGrid = Ext.getCmp('payrollOvertimeHeader-grid');
                            empGrid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue() });
                            empGrid.store.load({ params: { start: 0, limit: empGrid.pageSize} });
                        }
                    },
                    keyup: function (field) {
                        if (field.getValue() == '') {
                            var empGrid = Ext.getCmp('payrollOvertimeHeader-grid');
                            empGrid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue() });
                            empGrid.store.load({ params: { start: 0, limit: empGrid.pageSize} });
                        }
                    }
                }
            }]

    }, config));
};
Ext.extend(Ext.core.finance.ux.payrollOvertimeHeader.Form, Ext.form.FormPanel);
Ext.reg('payrollOvertimeHeader-form', Ext.core.finance.ux.payrollOvertimeHeader.Form);

/**
* @desc      payrollOvertimeHeader grid
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      April 24, 2013
* @namespace Ext.core.finance.ux.payrollOvertimeHeader
* @class     Ext.core.finance.ux.payrollOvertimeHeader.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.core.finance.ux.payrollOvertimeHeader.Grid = function (config) {
    Ext.core.finance.ux.payrollOvertimeHeader.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: Tsa.GetPagedEmployee,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Code',
                direction: 'ASC'
            },
            fields: ['Id', 'IdentityNo', 'FirstName', 'MiddleName', 'LastName', 'Position', 'IsActive'],
            remoteSort: true,
            listeners: {
                beforeLoad: function () { Ext.getCmp('payrollOvertimeHeader-grid').body.mask('Loading...', 'x-mask-loading'); },
                load: function () { Ext.getCmp('payrollOvertimeHeader-grid').body.unmask(); },
                loadException: function () { Ext.getCmp('payrollOvertimeHeader-grid').body.unmask(); },
                scope: this
            }
        }),
        id: 'payrollOvertimeHeader-grid',
        pageSize: 50,
        stripeRows: true,
        border: true,
        clicksToEdit: 1,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        viewConfig: {
            forceFit: false,
            autoExpandColumn: 'IdentityNumber',
            autoFill: true
        },
        listeners: {
            rowClick: function() {
                                var gridOTHours = Ext.getCmp('payrollOvertimeDetail-grid');
                    var gridEmployees = Ext.getCmp('payrollOvertimeHeader-grid');
                    if (!gridEmployees.getSelectionModel().hasSelection()) return;
                    var empId = gridEmployees.getSelectionModel().getSelected().get('Id');
                    var PeriodId = Ext.getCmp('periodId').getValue();
                    var records = new Array();

                    gridOTHours.getStore().load({
                        params: {

                            start: 0,
                            limit: 10,
                            sort: '',
                            dir: '',
                            EmpId: empId,
                            PeriodId: PeriodId
                        }

                    });
            }
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
            width: 100,
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
            width: 200,
            menuDisabled: true
        },{
            dataIndex: 'IsActive',
            header: 'Is Active',
            sortable: true,
            width: 100,
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                if (value)
                    return '<img src="Content/images/app/yes.png"/>';
                else
                    return '<img src="Content/images/app/no.png"/>';
            }

        }, {
            dataIndex: 'Position',
            header: 'Position',
            sortable: true,
            width: 250,
            menuDisabled: true
        }]
    }, config));
}

Ext.extend(Ext.core.finance.ux.payrollOvertimeHeader.Grid, Ext.grid.EditorGridPanel, {
    initComponent: function () {
        //        this.store.baseParams = { record: Ext.encode({ UnitId: this.unitId, SearchParam: this.searchParam }) };
        this.tbar = [];
        this.bbar = new Ext.PagingToolbar({
            id: 'employeeMain-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.core.finance.ux.payrollOvertimeHeader.Grid.superclass.initComponent.apply(this, arguments);
    },
   
});
Ext.reg('payrollOvertimeHeader-grid', Ext.core.finance.ux.payrollOvertimeHeader.Grid);

/**
* @desc      payrollOvertimeHeader panel
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      April 24, 2013
* @namespace Ext.core.finance.ux.payrollOvertimeHeader
* @class     Ext.core.finance.ux.payrollOvertimeHeader.Panel
* @extends   Ext.Panel
*/
Ext.core.finance.ux.payrollOvertimeHeader.Panel = function (config) {
    Ext.core.finance.ux.payrollOvertimeHeader.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false
    }, config));
};
Ext.extend(Ext.core.finance.ux.payrollOvertimeHeader.Panel, Ext.Panel, {
    initComponent: function () {
        this.form = new Ext.core.finance.ux.payrollOvertimeHeader.Form();
        this.OTgrid = new Ext.core.finance.ux.payrollOvertimeHeader.Grid();
        this.OTtree = new Ext.core.finance.ux.departmentsTree.Tree({grid: this.OTgrid});
       
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
                items: [this.OTtree]
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
                    items: [this.form, this.OTgrid]
                }]
            }]
        }];
        Ext.core.finance.ux.payrollOvertimeHeader.Panel.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('payrollOvertimeHeader-panel', Ext.core.finance.ux.payrollOvertimeHeader.Panel);
