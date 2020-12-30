Ext.ns('Ext.core.finance.ux.payrollOvertimeDetail');


/**
* @desc      payrollOvertimeDetail registration form
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date     June 13, 2013
* @namespace Ext.core.finance.ux.payrollOvertimeDetail
* @class     Ext.core.finance.ux.payrollOvertimeDetail.Form
* @extends   Ext.form.FormPanel
*/
Ext.core.finance.ux.payrollOvertimeDetail.Form = function (config) {
    Ext.core.finance.ux.payrollOvertimeDetail.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: PayrollEmployeeOvertimeHours.GetDetailByEmployeeAndPeriod,
            submit: PayrollItems.Save
        },
        paramOrder: ['start','limit','sort','dir','EmpId','PeriodId'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'payrollOvertimeDetail-form',
        padding: 5,
        labelWidth: 100,


        autoHeight: true,
        border: false,
        baseCls: 'x-plain',
        items: [{
            name: 'Id',
            xtype: 'hidden'
        }]
    }, config));
};
Ext.extend(Ext.core.finance.ux.payrollOvertimeDetail.Form, Ext.form.FormPanel);
Ext.reg('payrollOvertimeDetail-form', Ext.core.finance.ux.payrollOvertimeDetail.Form);




/**
* @desc      Washing Header Grid
* @author    Dawit Kiros
* @copyright (c) 2012, LIFT
* @date      June 22, 2012
* @namespace Ext.core.finance.ux.washing
* @class     Ext.core.finance.ux.washing.Grid
* @extends   Ext.Grid
*/

Ext.core.finance.ux.payrollOvertimeDetail.Grid = function (config) {
    Ext.core.finance.ux.payrollOvertimeDetail.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: PayrollEmployeeOvertimeHours.GetDetailByEmployeeAndPeriod,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|EmpId|PeriodId',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'ASC'
            },
            fields: ['Id', 'OvertimeType', 'HoursWorked', 'OTDate'],
            remoteSort: false,
            listeners: {
                beforeLoad: function () {
                    Ext.getCmp('payrollOvertimeDetail-grid').body.mask('Loading...', 'x-mask-loading');
                },
                load: function () {
                 var grid = Ext.getCmp('payrollOvertimeDetail-grid');
                                       
                    grid.body.unmask();

                },
                loadException: function () {
                    Ext.getCmp('payrollOvertimeDetail-grid').body.unmask();
                },
                scope: this
            }
        }),
        id: 'payrollOvertimeDetail-grid',
        pageSize: 10,
        height: 250,
        stripeRows: true,
        border: true,
        clicksToEdit: 1,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true,
            onEditorKey: function (field, e) {
                var k = e.getKey(), newCell = null, g = this.grid, ed = g.activeEditor;
                var shift = e.shiftKey;
                if (k == e.TAB) {
                    e.stopEvent();
                    ed.completeEdit();
                    if (shift) {
                        newCell = g.walkCells(ed.row, ed.col - 1, -1, this.acceptsNav, this);
                    } else {
                        newCell = g.walkCells(ed.row, ed.col + 1, 1, this.acceptsNav, this);
                        if (!newCell) {
                            g.addRow();
                        }
                    }
                    if (newCell) {
                        g.startEditing(newCell[0], newCell[1]);
                    }
                }
            }
             }),
        
        viewConfig: {
            forceFit: true,
            autoFill: true
        },
        columns: [{
            dataIndex: 'Id',
            header: 'Id',
            sortable: false,
            hidden: true,
            width: 100,
            menuDisabled: true
        }, new Ext.grid.RowNumberer(), {
            dataIndex: 'OvertimeType',
            header: 'Overtime Type',
            sortable: true,
            width: 100,
            menuDisabled: true,
            forceSelection: true,
            xtype: 'combocolumn',
            editor: new Ext.form.ComboBox({
                hiddenName: 'OvertimeTypeId',
                typeAhead: true,
                triggerAction: 'all',
                mode: 'local',
                store: new Ext.data.DirectStore({
                    reader: new Ext.data.JsonReader({
                        successProperty: 'success',
                        idProperty: 'Id',
                        root: 'data',
                        fields: ['Id', 'OTRateName']
                    }),
                    autoLoad: true,
                    api: { read: PayrollOvertimeRates.GetAllOTRates }
                }),
                valueField: 'Id',
                displayField: 'OTRateName'
            })
        }, {
            dataIndex: 'HoursWorked',
            header: 'Hours Worked',
            sortable: true,
            width: 100,
            menuDisabled: true,
            align: 'left',
            editor: new Ext.form.NumberField({
                allowBlank: false,
                allowNegative: false,
                listeners: {
                    focus: function (field) {
                        field.selectText();
                    }
                }
            })

        }, {
            dataIndex: 'OTDate',
            header: 'Date',
            sortable: true,
            width: 250,
            //renderer: Ext.util.Format.dateRenderer('m/d/Y'),
            editor: new Ext.form.DateField({
                format: 'm/d/Y',
                allowBlank: false,
                listeners: {
                    focus: function (field) {
                        field.selectText();
                    }
                }
            })

        } ]
    }, config));
};

Ext.extend(Ext.core.finance.ux.payrollOvertimeDetail.Grid, Ext.grid.EditorGridPanel, {
    initComponent: function () {
        //this.store.baseParams = { record: Ext.encode({ EmpId: this.lrEmpId, PerId: this.lrPerId }) };
        this.bbar = new Ext.PagingToolbar({
            id: 'payrollOvertimeDetail-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        this.bbar.refresh.hide();
        Ext.core.finance.ux.payrollOvertimeDetail.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.addRow();
        Ext.core.finance.ux.payrollOvertimeDetail.Grid.superclass.afterRender.apply(this, arguments);
    },
    addRow: function () {
        var grid = Ext.getCmp('payrollOvertimeDetail-grid');
        var store = grid.getStore();
        var overtime = store.recordType;
        var p = new overtime({
            Id: 0,
            OvertimeType: '',
            HoursWorked: 0
            
        });
        var count = store.getCount();
        grid.stopEditing();
        store.insert(count, p);
        if (count > 0) {
            grid.startEditing(count, 2);
        }
    }
});
Ext.reg('payrollOvertimeDetail-grid', Ext.core.finance.ux.payrollOvertimeDetail.Grid);

//functions

function Amount_MeasurementUnit(val, x, store) {
    return val + ' ' + store.data.MeasurementUnit;
}

/**
* @desc      payrollOvertimeDetail panel
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date     June 13, 2013
* @version   $Id: payrollOvertimeDetail.js, 0.1
* @namespace Ext.core.finance.ux.payrollOvertimeDetail
* @class     Ext.core.finance.ux.payrollOvertimeDetail.Panel
* @extends   Ext.Panel
*/
Ext.core.finance.ux.payrollOvertimeDetail.Panel = function (config) {
    Ext.core.finance.ux.payrollOvertimeDetail.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false,
        title: 'Overtime Hours',
        //height: 250,
        tbar: {
            xtype: 'toolbar',
            items: [{
            xtype: 'button',
            text: 'Insert',
            id: 'insertAll',
            iconCls: 'icon-RowAdd',
            handler: this.onInsertAll
        }]
        }
    }, config));
};
Ext.extend(Ext.core.finance.ux.payrollOvertimeDetail.Panel, Ext.Panel, {
    initComponent: function () {
        this.items = [{
            xtype: 'payrollOvertimeDetail-grid',
            id: 'payrollOvertimeDetail-grid'
        }];
        Ext.core.finance.ux.payrollOvertimeDetail.Panel.superclass.initComponent.apply(this, arguments);
    },
    onInsertAll: function () {
                var gridOTHours = Ext.getCmp('payrollOvertimeDetail-grid');  
                gridOTHours.addRow();
    }
   
});
Ext.reg('payrollOvertimeDetail-panel', Ext.core.finance.ux.payrollOvertimeDetail.Panel);