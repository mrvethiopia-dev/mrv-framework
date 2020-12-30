Ext.ns('Ext.core.finance.ux.PayrollAttendanceDetail');
/**
* @desc      Transaction Viewer registration form
* @author    Dawit Kiros
* @copyright (c) 2013, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.PayrollAttendanceDetail
* @class     Ext.core.finance.ux.PayrollAttendanceDetail.Form
* @extends   Ext.form.FormPanel
*/
Ext.core.finance.ux.PayrollAttendanceDetail.Form = function (config) {
    Ext.core.finance.ux.PayrollAttendanceDetail.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: PayrollJournals.GetJournalsByPeriodId,
            submit: PayrollItems.Save
        },
        paramOrder: ['Id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:left;',
            msgTarget: 'side',
            bodyStyle: 'background:transparent;padding:5px'
        },
        id: 'PayrollAttendanceDetail-form',
        autoHeight: true,
        border: false,
        isFormLoad: false,
        
       // layout: 'form',
       //bodyStyle: 'background:transparent;padding:5px',
        baseCls: 'x-plain',
        items: [{
            name: 'EmpId',
            xtype: 'textfield',
            allowBlank: false,
            hidden: true
        }, {
            xtype: 'compositefield',
            fieldLabel: 'Employee Name',
            defaults: {
                flex: 1
            },
            items: [{
                xtype: 'textfield',
                name: 'EmpName',
                fieldLabel: 'Employee Name',
                allowBlank: false,
                disabled: true
                
            }, {
                xtype: 'button',
                id: 'findemployee',
                iconCls: 'icon-filter',
                width: 25,
                handler: function () {
                    var form = Ext.getCmp('PayrollAttendanceDetail-form').getForm();
                    new Ext.core.finance.ux.employeePicker.Window({
                        find: 'Employee',
                        controlAccountId: '',
                        parentForm: form,
                        controlIdField: 'EmpId',
                        controlNameField: 'EmpName'
                    }).show();

                }
            }]
        }, {
            id: 'dtpAbsencePeriodPicker',
            xtype: 'combo',
            
            fieldLabel: 'Absence Period',
            triggerAction: 'all',
            mode: 'local',
            editable: true,
            typeAhead: true,
            forceSelection: true,
            emptyText: '---Select Period---',
            allowBlank: false,
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
            valueField: 'Id',
            displayField: 'Name',
            listeners: {
                select: function () {
                    var form = Ext.getCmp('PayrollAttendanceDetail-form').getForm();
                    var periodId = Ext.getCmp('dtpAbsencePeriodPicker').getValue();
                    
                    window.Tsa.GetPeriodEndDate(periodId, function (response) {
                        var form = Ext.getCmp('PayrollAttendanceDetail-form').getForm();
                        if (response.success) {

                            form.findField('EndDate').setValue(response.data);
                            
                        }
                    });
                }
            }
        }, {
            name: 'EndDate',
            xtype: 'textfield',
            fieldLabel: 'End Date',
            allowBlank: true,
            hidden: true
        }, {
            name: 'AbsenceDays',
            xtype: 'numberfield',
            anchor: '50%',
            fieldLabel: 'Total Number of Absence Days',
            allowBlank: false
        }, {
            xtype: 'multiselect',
            fieldLabel: 'Select Absence Days',
            name: 'multiselect',
            width: 250,
            height: 200,
            allowBlank: false,
            store: ds,
           displayField: 'text',
            valueField: 'value',
            tbar: [{
                text: 'clear selection', 
                iconCls: 'icon-Remove',
                handler: function () {
                    var form = Ext.getCmp('PayrollAttendanceDetail-form');
                    form.getForm().findField('multiselect').reset();
                }
            },{
                text: 'Save',
                hidden: true,
                handler: function () {
                    var form = Ext.getCmp('PayrollAttendanceDetail-form');
                    
                    if (form.getForm().isValid()) {
                        Ext.Msg.alert('Submitted Values', 'The following will be sent to the server: <br />' +
                        form.getForm().findField('multiselect').getValue());
                    }
                }
            }],

            ddReorder: true
        }]
    }, config));
}
Ext.extend(Ext.core.finance.ux.PayrollAttendanceDetail.Form, Ext.form.FormPanel);
Ext.reg('PayrollAttendanceDetail-form', Ext.core.finance.ux.PayrollAttendanceDetail.Form);


/**
* @desc      Transaction Viewer registration form host window
* @author    Dawit Kiros
* @copyright (c) 2013, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.PayrollAttendanceDetail
* @class     Ext.core.finance.ux.PayrollAttendanceDetail.Window
* @extends   Ext.Window
*/
Ext.core.finance.ux.PayrollAttendanceDetail.Window = function (config) {
    Ext.core.finance.ux.PayrollAttendanceDetail.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        width: 390,
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;',
        listeners: {
            show: function () {
                
            },
            scope: this
        }
    }, config));
}
Ext.extend(Ext.core.finance.ux.PayrollAttendanceDetail.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.core.finance.ux.PayrollAttendanceDetail.Form();
        this.items = [this.form];
        this.buttons = [{
            text: 'Save',
            iconCls: 'icon-save',
            handler: this.onSave,
            scope: this
        }, {
            text: 'Close',
            iconCls: 'icon-exit',
            handler: this.onClose,
            scope: this
        }];

        Ext.core.finance.ux.PayrollAttendanceDetail.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {

        if (!this.form.getForm().isValid()) return;


        var totalDays;
        var selectedDates;
        var periodEndDay;
        totalDays = this.form.getForm().findField('AbsenceDays').getValue();
        selectedDates = this.form.getForm().findField('multiselect').getValue();
        periodEndDay = this.form.getForm().findField('EndDate').getValue();
        var periodId = this.form.getForm().findField('dtpAbsencePeriodPicker').getValue();
        var hasInvalidDate = false;

        selectedDates = selectedDates.split(',');
        var count = selectedDates.length;

        if (totalDays != count) {
            Ext.MessageBox.show({
                title: 'Mismatch Error',
                msg: 'The total number of absence days is not equal with the selected number of days. Please correct the error and try to proceed.',
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.ERROR,
                scope: this
            });
            return;
        }

        for (var i = 0; i < selectedDates.length; i++) {
            var difference = periodEndDay - selectedDates[i];
            if (difference < 0) {
                hasInvalidDate = true;
                break;
            }
        }

        if (hasInvalidDate) {
            Ext.MessageBox.show({
                title: 'Invalid Date',
                msg: 'Invalid Absence Day has been selected. The selected period has only ' + periodEndDay + ' days!',
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.ERROR,
                scope: this
            });
            return;
        }

        var empId = this.form.getForm().findField('EmpId').getValue();

        Ext.MessageBox.show({
            msg: 'Saving Attendance, please wait...',
            progressText: 'Saving...',
            width: 300,
            wait: true,
            waitConfig: { interval: 200 }
        });
        Ext.Ajax.timeout = 300000;
        window.PayrollAttendanceDetail.Save(selectedDates, empId, periodId, function (result, response) {
            if (result.success) {
                //Ext.MessageBox.hide();
                Ext.MessageBox.alert('Data Saved', 'The Attendance information for the selected employee has been successfully saved!');
            } else {
                Ext.MessageBox.show({
                    title: 'Error',
                    msg: result.data,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.ERROR,
                    scope: this
                });
            }

        });
    },
    onClose: function () {
        this.close();
    }
});
Ext.reg('PayrollAttendanceDetail-window', Ext.core.finance.ux.PayrollAttendanceDetail.Window);

var ds = new Ext.data.ArrayStore({
    data: [
            ['1', '1'], ['2', '2'], ['3', '3'], ['4', '4'], ['5', '5'],
            ['6', '6'], ['7', '7'], ['8', '8'], ['9', '9'], ['10', '10'],
            ['11', '11'], ['12', '12'], ['13', '13'], ['14', '14'], ['15', '15'],
            ['16', '16'], ['17', '17'], ['18', '18'], ['19', '19'], ['20', '20'],
            ['21', '21'], ['22', '22'], ['23', '23'], ['24', '24'], ['25', '25'],
            ['26', '26'], ['27', '27'], ['28', '28'], ['29', '29'], ['30', '30'],
            ['31', '31']
            ],
    fields: ['value', 'text']
//    sortInfo: {
////        field: 'value',
////        direction: 'ASC'
//    }
});

/**
* @desc      Transaction Viewers grid
* @author    Dawit Kiros
* @copyright (c) 2013, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.PayrollAttendanceDetail
* @class     Ext.core.finance.ux.PayrollAttendanceDetail.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.core.finance.ux.PayrollAttendanceDetail.Grid = function (config) {
    Ext.core.finance.ux.PayrollAttendanceDetail.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.GroupingStore({
            proxy: new Ext.data.DirectProxy({
                directFn: window.PayrollAttendanceDetail.GetAllByPeriod,
                paramsAsHash: false,
                paramOrder: 'start|limit|sort|dir|PeriodId'
            }),
            reader: new Ext.data.JsonReader({
                root: 'data',
                idProperty: 'Id',
                totalProperty: 'total',

                fields: ['Id', 'EmpId', 'EmpName', 'AbsenceDate', 'DeductableAmount']
            }),
            groupField: 'AbsenceDate',
            sortInfo: {
                field: 'Id',
                direction: 'ASC'
            },
            remoteSort: true,
            listeners: {
                beforeLoad: function () {
                    Ext.getCmp('PayrollAttendanceDetail-grid').body.mask('Loading...', 'x-mask-loading');
                },
                load: function () {
                    var grid = Ext.getCmp('PayrollAttendanceDetail-grid');
                    //var store = grid.getStore();

                    grid.body.unmask();
                },
                loadException: function () {
                    Ext.getCmp('PayrollAttendanceDetail-grid').body.unmask();
                },
                remove: function (store) {
                    var grid = Ext.getCmp('PayrollAttendanceDetail-grid');

                },
                scope: this
            }
        }),
        id: 'PayrollAttendanceDetail-grid',
        PeriodId: 0,
        pageSize: 30,
        stripeRows: true,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        border: false,
        title: 'Employee Attendance List',
        columnLines: true,
        clicksToEdit: 1,
        listeners: {

        },
        viewConfig: {

        },
        view: new Ext.grid.GroupingView({
            forcefit: true,
            showGroupName: true,
            groupTextTpl: '{text}'
        }),
        columns: [{
            dataIndex: 'Id',
            header: 'Id',
            sortable: true,
            hidden: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'EmpId',
            header: 'Emp Id',
            sortable: true,
            width: 220,
            hidden: true,
            menuDisabled: false
        }, {
            dataIndex: 'EmpName',
            header: 'Employee Name',
            sortable: true,
            width: 220,
            menuDisabled: false
        }, {
            dataIndex: 'AbsenceDate',
            header: 'Absence Date',
            sortable: true,
            width: 200,
            menuDisabled: false
        }, {
            dataIndex: 'DeductableAmount',
            header: 'Deductable Amount',
            sortable: true,
            width: 220,
            menuDisabled: false
        }]
    }, config));
};
Ext.extend(Ext.core.finance.ux.PayrollAttendanceDetail.Grid, Ext.grid.EditorGridPanel, {
    initComponent: function () {

        Ext.core.finance.ux.PayrollAttendanceDetail.Grid.superclass.initComponent.apply(this, arguments);
    }

});
Ext.reg('PayrollAttendanceDetail-grid', Ext.core.finance.ux.PayrollAttendanceDetail.Grid);

/**
* @desc      Transaction Viewers panel
* @author    Dawit Kiros
* @copyright (c) 2013, LIFT
* @date      July 01, 2013
* @version   $Id: PayrollAttendanceDetail.js, 0.1
* @namespace Ext.core.finance.ux.PayrollAttendanceDetail
* @class     Ext.core.finance.ux.PayrollAttendanceDetail.Panel
* @extends   Ext.Panel
*/
Ext.core.finance.ux.PayrollAttendanceDetail.Panel = function (config) {
    Ext.core.finance.ux.PayrollAttendanceDetail.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false,
        tbar: {
            xtype: 'toolbar',
            items: ['Select Period', {
                id: 'dtpAttendancePeriodId', xtype: 'combo', anchor: '55%', fieldLabel: 'Period', triggerAction: 'all', mode: 'local', editable: true, typeAhead: true,
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
                        var periodOneId = Ext.getCmp('dtpAttendancePeriodId').getValue();

                        if (periodOneId == '')
                            return;

                        var jrnlGrid = Ext.getCmp('PayrollAttendanceDetail-grid');
                        jrnlGrid.getStore().load({
                            params: {
                                start: 0,
                                limit: 10,
                                sort: '',
                                dir: '',
                                PeriodId: periodOneId
                            }

                        });

                    }


                }
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Add',
                id: 'btnAddAttendance',
                iconCls: 'icon-add',
                handler: this.onAddClick,
                disabled: !Ext.core.finance.ux.Reception.getPermission('Attendance', 'CanAdd')

            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Delete',
                id: 'btnDeleteAttendance',
                iconCls: 'icon-delete',
                handler: this.onDeleteClick,
                disabled: !Ext.core.finance.ux.Reception.getPermission('Attendance', 'CanDelete')
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Print List',
                id: 'printAtts',
                hidden:true,
                iconCls: 'icon-Print',
                handler: this.onAttPrintClick

            }]
        }
    }, config));
}
Ext.extend(Ext.core.finance.ux.PayrollAttendanceDetail.Panel, Ext.Panel, {
    initComponent: function () {
        this.items = [{
            xtype: 'PayrollAttendanceDetail-grid',
            id: 'PayrollAttendanceDetail-grid'
        }];
        Ext.core.finance.ux.PayrollAttendanceDetail.Panel.superclass.initComponent.apply(this, arguments);
    },
     onAddClick: function () {
        new Ext.core.finance.ux.PayrollAttendanceDetail.Window({
            
            title: 'Add Attendance'
        }).show();
    },
    onAttPrintClick: function () {
        var grid = Ext.getCmp('PayrollAttendanceDetail-grid');
        Ext.ux.GridPrinter.stylesheetPath = '/Content/css/print.css';
        Ext.ux.GridPrinter.print(grid);
    },
    onDeleteClick: function () {
        var grid = Ext.getCmp('PayrollAttendanceDetail-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        Ext.MessageBox.show({
            title: 'Delete',
            msg: 'Are you sure you want to delete the selected Attendance?',
            buttons: {
                ok: 'Yes',
                no: 'No'
            },
            icon: Ext.MessageBox.QUESTION,
            scope: this,
            animEl: 'delete',
            fn: function (btn) {
                if (btn == 'ok') {
                    var id = grid.getSelectionModel().getSelected().get('Id');
                    PayrollAttendanceDetail.Delete(id, function (result, response) {
                        var periodOneId = Ext.getCmp('dtpAttendancePeriodId').getValue();

                        if (periodOneId == '')
                            return;

                        var jrnlGrid = Ext.getCmp('PayrollAttendanceDetail-grid');
                        jrnlGrid.getStore().load({
                            params: {
                                start: 0,
                                limit: 10,
                                sort: '',
                                dir: '',
                                PeriodId: periodOneId
                            }

                        });
                    }, this);
                }
            }
        });
    }

});
Ext.reg('PayrollAttendance-panel', Ext.core.finance.ux.PayrollAttendanceDetail.Panel);