Ext.ns('Ext.core.finance.ux.FinanceExchangeRates');
/**
* @desc      Periods registration form
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.FinanceExchangeRates
* @class     Ext.core.finance.ux.FinanceExchangeRates.Form
* @extends   Ext.form.FormPanel
*/
Ext.core.finance.ux.FinanceExchangeRates.Form = function (config) {
    Ext.core.finance.ux.FinanceExchangeRates.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: PayrollBankBranches.Get,
            submit: PayrollBankBranches.Save
        },
        paramOrder: ['Id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:left;',
            msgTarget: 'side'
        },
        id: 'FinanceExchangeRates-form',
        padding: 5,
        labelWidth: 150,
        autoHeight: true,
        border: true,
        baseCls: 'x-plain',
        items: [{ }]
    }, config));
}
Ext.extend(Ext.core.finance.ux.FinanceExchangeRates.Form, Ext.form.FormPanel);
Ext.reg('FinanceExchangeRates-form', Ext.core.finance.ux.FinanceExchangeRates.Form);

/**
* @desc      Periods registration form host window
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.FinanceExchangeRates
* @class     Ext.core.finance.ux.FinanceExchangeRates.Window
* @extends   Ext.Window
*/
Ext.core.finance.ux.FinanceExchangeRates.Window = function (config) {
    Ext.core.finance.ux.FinanceExchangeRates.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        width: 700,
        height: 350,
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
Ext.extend(Ext.core.finance.ux.FinanceExchangeRates.Window, Ext.Window, {
    initComponent: function () {
        
        this.grid = new Ext.core.finance.ux.FinanceExchangeRates.Grid();
        this.items = [this.grid];
        this.buttons = [ {
            text: 'Exit',
            iconCls: 'icon-exit',
            handler: this.onClose,
            disabled: false,
            scope: this
        }];

        Ext.core.finance.ux.FinanceExchangeRates.Window.superclass.initComponent.call(this, arguments);
    },
    
    onClose: function () {
        this.close();
    }
});
Ext.reg('FinanceExchangeRates-window', Ext.core.finance.ux.FinanceExchangeRates.Window);

/**
* @desc      Periods grid
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.FinanceExchangeRates
* @class     Ext.core.finance.ux.FinanceExchangeRates.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.core.finance.ux.FinanceExchangeRates.Grid = function (config) {
    Ext.core.finance.ux.FinanceExchangeRates.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: FinanceExchangeRates.GetDetailByPeriod,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|PeriodId',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Code',
                direction: 'ASC'
            },
            fields: ['Id', 'FromDate', 'ToDate', 'ExchangeRate'],
            remoteSort: true,
            listeners: {
                beforeLoad: function () {
                    this.body.mask('Loading...', 'x-mask-loading');
                },
                load: function () {
                    this.body.unmask();
                },
                loadException: function () {
                    this.body.unmask();
                },
                scope: this
            }
        }),
        id: 'FinanceExchangeRates-grid',
        searchCriteria: {},
        pageSize: 30,
        PeriodId: 0,
        //height: 600,
        stripeRows: true,
        columnLines: true,
        border: false,
        clicksToEdit: 2,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true,
            onEditorKey: function(field, e) {
                var k = e.getKey(), newCell = null, g = this.grid, ed = g.activeEditor;
                var shift = e.shiftKey;
                
                if ((k == e.TAB || k == e.ENTER) && e.ctrlKey == false) {
                    e.stopEvent();
                    field.gridEditor.completeEdit();

                    if (shift) {
                        newCell = g.walkCells(field.gridEditor.row, field.gridEditor.col - 1, -1, this.acceptsNav, this);
                    } else {
                        newCell = g.walkCells(field.gridEditor.row, field.gridEditor.col + 1, 1, this.acceptsNav, this);
                        if (!newCell) {
                            g.addRow();
                        }
                    }
                }
                if (newCell) {
                    g.startEditing(newCell[0], newCell[1]);
                }
            }
        }),
        viewConfig: {
            forceFit: true,
            autoFill: true
        },
        listeners: {
            rowClick: function () {
              

            },
            scope: this,
            rowdblclick: function () {
           
            }
        },
        columns: [
       {
            dataIndex: 'Id',
            header: 'Id',
            hidden:true,
            width: 50,
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
        }, {
            dataIndex: 'FromDate',
            header: 'From Date',
            width: 175,
            menuDisabled: true,
             
            editor: new Ext.form.DateField({
                format: 'm/d/Y',
                allowBlank: false,
                listeners: {
                    focus: function (field) {
                        field.selectText();
                    }
                }
            })
        }, {
            dataIndex: 'ToDate',
            header: 'To Date',
            width: 175,
            menuDisabled: true,

            editor: new Ext.form.DateField({
                format: 'm/d/Y',
                allowBlank: false,
                listeners: {
                    focus: function (field) {
                        field.selectText();
                    }
                }
            })
        }, {
            dataIndex: 'ExchangeRate',
            header: 'Exchange Rate',
            width: 75,
            menuDisabled: true,        
            
            editor: new Ext.form.TextField({
              
            })
        }]
    }, config));
};
Ext.extend(Ext.core.finance.ux.FinanceExchangeRates.Grid, Ext.grid.EditorGridPanel, {
    initComponent: function () {
        //this.store.baseParams = { record: Ext.encode({ mode: 'get' }) };
        this.tbar = [{
            id: 'exchangeRatePeriodId', xtype: 'combo', anchor: '55%', fieldLabel: 'Period', triggerAction: 'all', mode: 'local', editable: false, typeAhead: true,
            forceSelection: true, emptyText: '', allowBlank: false,
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
                    var periodId = Ext.getCmp('exchangeRatePeriodId').getValue();

                    var exRateGrid = Ext.getCmp('FinanceExchangeRates-grid');
                    exRateGrid.getStore().load({
                        params: {
                            start: 0,
                            limit: 10,
                            sort: '',
                            dir: '',
                            PeriodId: periodId
                        }

                    });
                    
                    AddRow();
                }


            }
        }, {
            xtype: 'tbseparator'
        },{
            xtype: 'button',
            text: 'Insert Row',
            id: 'btnInsertExchangeRates',
            iconCls: 'icon-RowAdd',
            handler: this.onInsert
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Save',
            id: 'btnSaveExchangeRates',
            iconCls: 'icon-save',
            handler: this.onSave
        } , {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Delete',
            id: 'btnDeleteExchangeRates',
            iconCls: 'icon-delete',
            handler: this.onDelete
        }];

        Ext.core.finance.ux.FinanceExchangeRates.Grid.superclass.initComponent.apply(this, arguments);
    },

    addRow  : function () {
        var grid = Ext.getCmp('FinanceExchangeRates-grid');
                var store = grid.getStore();
        var voucher = store.recordType;
        var p = new voucher({

            Id:0,
            ExchangeRate: 0
            

        });
        var count = store.getCount();
        grid.stopEditing();
        store.insert(count, p);
        if (count > 0) {
            grid.startEditing(count, 1);
        }
    },
    onSave: function () {

        var gridDetail = Ext.getCmp('FinanceExchangeRates-grid');

        var periodId = Ext.getCmp('exchangeRatePeriodId').getValue();

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
     

        var exchangeRatesDetail = gridDetail.getStore();

        var rec = '';
        exchangeRatesDetail.each(function (item) {

            if ((item.data['ExchangeRate'] != 0 && item.data['FromDate'] != '' && item.data['ToDate'] != '')) {

                var id = item.data['Id'];

                var fromDate = new Date(item.data['FromDate']);
                var toDate = new Date(item.data['ToDate']);
                var dtFrom = fromDate.format('M/d/yyyy');
                var dtTo = toDate.format('M/d/yyyy');

                var exRate = item.data['ExchangeRate'];



                rec = rec + id + ':' + dtFrom + ':' + dtTo + ':' + exRate + ';';
            }
        });
        window.FinanceExchangeRates.SaveExchangeRates(rec, periodId, function (result, response) {
            if (result.success) {
                //Ext.MessageBox.alert('Exchange Rates', 'The exchange rates have been successfully saved!');
                 Ext.MessageBox.show({
                                            title: result.title,
                                            msg: result.data,
                                            buttons: Ext.Msg.OK,
                                            icon: Ext.MessageBox.INFO,
                                            scope: this
                                        });
            } else {
                Ext.MessageBox.show({
                                            title: result.title,
                                            msg: result.data,
                                            buttons: Ext.Msg.OK,
                                            icon: Ext.MessageBox.ERROR,
                                            scope: this
                                        });
            }
        });

    },
    onInsert : function() {
            var periodId = Ext.getCmp('exchangeRatePeriodId').getValue();

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
        AddRow();
    }, onDelete: function () {
            Ext.MessageBox.show({
                title: 'Delete',
                msg: 'Are you sure you want to remove the selected Row? ',
                buttons: {
                    ok: 'Yes',
                    no: 'No'
                },
                icon: Ext.MessageBox.QUESTION,
                scope: this,
                animEl: 'delete',
                fn: function(btn) {
                    if (btn == 'ok') {
                        var grid = Ext.getCmp('FinanceExchangeRates-grid');
                        if (!grid.getSelectionModel().hasSelection()) return;
                        var record = grid.getSelectionModel().getSelected();
                        if (record !== undefined) {
                            if (record.data.Id != null && record.data.Id != "" && record.data.Id != '') {
                                FinanceExchangeRates.Delete(record.data.Id, function(result) {
                                    if (!result.success) {
                                        Ext.MessageBox.show({
                                            title: 'Error',
                                            msg: result.data,
                                            buttons: Ext.Msg.OK,
                                            icon: Ext.MessageBox.ERROR,
                                            scope: this
                                        });
                                    } else {
                                        grid.store.remove(record);
                                    }
                                }, this);
                            } else {
                                grid.store.remove(record);
                            }
                        }
                    }
                }
            });
        },
});
Ext.reg('FinanceExchangeRates-grid', Ext.core.finance.ux.FinanceExchangeRates.Grid);

/**
* @desc      Payroll Items panel
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @version   $Id: FinanceExchangeRates.js, 0.1
* @namespace Ext.core.finance.ux.FinanceExchangeRates
* @class     Ext.core.finance.ux.FinanceExchangeRates.Panel
* @extends   Ext.Panel
*/
Ext.core.finance.ux.FinanceExchangeRates.Panel = function (config) {
    Ext.core.finance.ux.FinanceExchangeRates.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false,
        tbar: {
            xtype: 'toolbar',
            items: [ {
                xtype: 'button',
                text: 'Close',
                id: 'btnCloseUnclose',
                iconCls: 'icon-exclamation',

                handler: this.OnCloseUncloseClick
            }]
        }
    }, config));
}
Ext.extend(Ext.core.finance.ux.FinanceExchangeRates.Panel, Ext.Panel, {
    initComponent: function () {
        this.items = [{
            xtype: 'FinanceExchangeRates-grid',
            id: 'FinanceExchangeRates-grid'
        }];
        Ext.core.finance.ux.FinanceExchangeRates.Panel.superclass.initComponent.apply(this, arguments);
    },


});
Ext.reg('FinanceExchangeRates-panel', Ext.core.finance.ux.FinanceExchangeRates.Panel);

var AddRow = function() {
    var exGrid = Ext.getCmp('FinanceExchangeRates-grid');
    exGrid.addRow();
}