Ext.ns('Ext.core.finance.ux.FinanceBankReconciliation');
Ext.ns('Ext.core.finance.ux.FinanceBankReconciliationMain');
Ext.ns('Ext.ux.grid');

Ext.ux.grid.CheckColumn = Ext.extend(Ext.grid.Column, {
    // private
    initComponent: function () {
        Ext.ux.grid.CheckColumn.superclass.initComponent.call(this);

        this.addEvents(
        'checkchange'
      );
    },

    processEvent: function (name, e, grid, rowIndex, colIndex) {
        if (name == 'mousedown') {
            var record = grid.store.getAt(rowIndex);
            record.set(this.dataIndex, !record.data[this.dataIndex]);

            this.fireEvent('checkchange', this, record.data[this.dataIndex],record);

            return false; // Cancel row selection.
        } else {
            return Ext.grid.ActionColumn.superclass.processEvent.apply(this, arguments);
        }
    },

    renderer: function (v, p, record) {
        p.css += ' x-grid3-check-col-td';
        return String.format('<div class="x-grid3-check-col{0}">&#160;</div>', v ? '-on' : '');
    },

    // Deprecate use as a plugin. Remove in 4.0
    init: Ext.emptyFn
});

// register ptype. Deprecate. Remove in 4.0
Ext.preg('checkcolumn', Ext.ux.grid.CheckColumn);

// backwards compat. Remove in 4.0
Ext.grid.CheckColumn = Ext.ux.grid.CheckColumn;

// register Column xtype
Ext.grid.Column.types.checkcolumn = Ext.ux.grid.CheckColumn;




/**
* @desc      RECLN registration form
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.FinanceBankReconciliation
* @class     Ext.core.finance.ux.FinanceBankReconciliation.Form
* @extends   Ext.form.FormPanel
*/
Ext.core.finance.ux.FinanceBankReconciliation.Form = function (config) {
    Ext.core.finance.ux.FinanceBankReconciliation.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: FinanceBankReconciliation.Get,
            submit: FinanceBankReconciliation.Save
        },
        paramOrder: ['Id'],
        defaults: {
            // anchor: '75%',
            labelStyle: 'text-align:left;',
            msgTarget: 'side'
        },
        id: 'FinanceBankReconciliation-form',
               padding: 5,
        labelWidth: 120,
        autoHeight: true,
        border: true,
        isFormLoad: false,
        frame: true,
        tbar: {
            xtype: 'toolbar',
            border: true,
            valign: 'top',
            padding: 5,
            items: [{
                xtype: 'button',
                text: 'New',
                id: 'newVoucherRECLN',
                iconCls: 'icon-add',
                handler: RECLNHandlers.onNewRECLNClick
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Save',
                id: 'saveVoucherRECLN',
                iconCls: 'icon-save',
                handler: function () {
                    RECLNHandlers.onSaveRECLNClick(false);
                }
                
            }]
        },
        items: [
            {
                layout: 'column',
                items: [
                    {
                        columnWidth: .39,

                        defaults: {
                            labelStyle: 'text-align:right;',
                            msgTarget: 'side'
                        },
                        border: false,
                        layout: 'form',
                        items: [
                            {
                                name: 'Id',
                                xtype: 'textfield',
                                hidden: true
                            }, {
                                hiddenName: 'BankId',
                                id: 'BankId',
                                xtype: 'combo',
                                fieldLabel: 'Select Bank',
                                anchor: '80%',
                                triggerAction: 'all',
                                mode: 'local',
                                editable: true,
                                typeAhead: true,
                                forceSelection: true,
                                emptyText: 'Select Bank',
                                listWidth: 250,
                                allowblank: false,
                                store: new Ext.data.DirectStore({
                                    reader: new Ext.data.JsonReader({
                                        successProperty: 'success',
                                        idProperty: 'Id',
                                        root: 'data',
                                        accountNo: 'AccountNo',
                                        fields: ['Id', 'BranchName', 'AccountNo']
                                    }),
                                    autoLoad: true,
                                    api: { read: Tsa.GetCompanyBankBranches }
                                }),
                                valueField: 'Id',
                                displayField: 'BranchName',
                                listeners: {
                                    'select': function(cmb, rec, idx) {
                                        var form = Ext.getCmp('FinanceBankReconciliation-form').getForm();

                                        form.findField('AccountNo').setValue(rec.data.AccountNo);

                                    }
                                }
                            }, {
                                hiddenName: 'PeriodId',
                                id: 'PeriodId',
                                xtype: 'combo',
                                anchor: '80%',
                                fieldLabel: 'Period',
                                triggerAction: 'all',
                                mode: 'local',
                                editable: false,
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
                                    select: function() {
                                        var periodId = Ext.getCmp('PeriodId').getValue();
                                        var bankId = Ext.getCmp('BankId').getValue();

                                        SelectedPeriodId = periodId;
                                        SelectedBankId = bankId;

                                        var rclnGrid = Ext.getCmp('FinanceBankReconciliation-grid');
                                        rclnGrid.getStore().load({
                                            params: {
                                                start: 0,
                                                limit: 200000,
                                                sort: '',
                                                dir: '',
                                                PeriodId: periodId,
                                                BankId: bankId
                                            }

                                        });


                                    }
                                }
                            }, {
                                name: 'TotalUnreconciledAmount',
                                xtype: 'numberfield',
                                anchor: '80%',
                                fieldLabel: 'Total Unreconciled',
                                allowBlank: false

                            }, {
                                name: 'TempTotalUnreconciledAmount',
                                xtype: 'numberfield',
                                anchor: '80%',
                                fieldLabel: 'Total Unreconciled',
                                allowBlank: true,
                                hidden: true,

                            }, {
                                name: 'BankErrorDeposit',
                                xtype: 'numberfield',
                                anchor: '80%',
                                fieldLabel: 'Bank Error Deposit',
                                allowBlank: true,
                                value :0,
                                allowNegative :false

                            },  {
                                name: 'BankErrorPayment',
                                xtype: 'numberfield',
                                anchor: '80%',
                                fieldLabel: 'Bank Error Payment',
                                allowBlank: true,
                                allowNegative: false,
                                value: 0

                            },  {
                                name: 'DepositInTransit',
                                xtype: 'numberfield',
                                anchor: '80%',
                                fieldLabel: 'Deposit In Transit',
                                allowBlank: true,
                                allowNegative: false,
                                value: 0

                            }
                        ]
                    }, {
                        columnWidth: .31,
                        defaults: {
                            labelStyle: 'text-align:right;',
                            msgTarget: 'side'
                        },
                        border: false,

                        layout: 'form',
                        items: [
                            {
                                name: 'AccountNo',
                                disabled: true,
                                xtype: 'textfield',
                                fieldLabel: 'Account No'
                            }, {
                                name: 'ShowMatchedItems',
                                xtype: 'checkbox',
                                fieldLabel: 'Show Matched Items',
                                disabled: true
                            }, {
                                name: 'CashBookBankBalance',
                                xtype: 'numberfield',
                                fieldLabel: 'CashBook Balance',

                                allowBlank: false

                            }
                        ]

                    }, {
                        columnWidth: .30,
                        defaults: {
                            labelStyle: 'text-align:right;',
                            msgTarget: 'side'
                        },
                        border: false,

                        layout: 'form',
                        items: [
                            {
                                name: 'BankStatementRefNo',
                                xtype: 'textfield',
                                fieldLabel: 'Ref No',
                                allowBlank: true

                            }, {

                                hiddenName: 'BankStatementDate',
                                id: 'BankStatementDate',
                                xtype: 'datefield',
                                altFormats: 'c',
                                fieldLabel: 'Statement Date',
                                allowBlank: true
                            }, {
                                name: 'BankStatementBalance',
                                xtype: 'numberfield',
                                fieldLabel: 'Statement Balance',
                                allowBlank: false

                            }
                        ]

                    }
                ]
            }
        ]
    }, config));

},

Ext.extend(Ext.core.finance.ux.FinanceBankReconciliation.Form, Ext.form.FormPanel);
Ext.reg('FinanceBankReconciliation-form', Ext.core.finance.ux.FinanceBankReconciliation.Form);

var RECLNHandlers = function () {
    return {
        onSaveRECLNClick: function (isClosed) {
       

        SaveRECLN(isClosed);
            

        },
       
        
        onNewRECLNClick: function () {
            var form = Ext.getCmp('FinanceBankReconciliation-form');
                var dirty = form.getForm().isDirty();
                var formFooter = Ext.getCmp('FinanceVouchersRECLNFooter-form');
                
                if (dirty)
                    Ext.MessageBox.show({
                        title: 'Save Changes',
                        msg: 'Do you want to save the changes made before opening a new Document?',
                        buttons: Ext.Msg.YESNOCANCEL,
                        fn: function (btnId) {
                            if (btnId === 'yes') {
                                RECLNHandlers.onSaveRECLNClick(false);
                                
                            }
                            else if (btnId === 'no') {
                                form.getForm().reset();
                                Ext.getCmp('chkIsAuditAdjustment').setChecked(false);
                                formFooter.getForm().reset();
                                Ext.getCmp('FinanceBankReconciliation-grid').onNextEntry();
                            }
                        }
                    });

                return !dirty;
        }
    }
} ();

var SaveRECLN = function(isClosed) {
    var grid = Ext.getCmp('FinanceBankReconciliation-grid');
    var form = Ext.getCmp('FinanceBankReconciliation-form');

    if (!form.getForm().isValid()) return;
    var store = grid.getStore();

    var rec = '';

//    var selections = grid.getSelectionModel().getSelections();
//    var allItems = store.data.items;

//    var uncheckedRaws = [];
//    for (var i = 0; i < allItems.length; i++) {
//        var found = 0;
//        for (var j = 0; j < selections.length; j++) {
//            if (allItems[i] == selections[j]) {
//                found ++;
//            }
//            
//        }
//        if (found == 0) {
//                uncheckedRaws.push(allItems[i]);
//            }
//    }
//    
//    for (var i=0; i < uncheckedRaws.length; i++) {
//        rec = rec + uncheckedRaws[i].id + ';';
//    }

    var reclnDetail = grid.getStore().data.items;
    var length = reclnDetail.length;
    var reclnString = '';
    for (var i = 0; i < length; i++) {
        reclnString = reclnString + reclnDetail[i].data.Id + ':' + reclnDetail[i].data.IsReconciled + ';';
    }

    form.getForm().submit({
        waitMsg: 'Please wait...',
        params: { record: Ext.encode({ reconciliationDetails: reclnString }) },
        success: function() {
            form.getForm().reset();

            Ext.getCmp('FinanceBankReconciliation-grid').onNextEntry();
            if (isClosed) {
                var wind = Ext.WindowMgr.getActive();
                if (wind) {
                    wind.purgeListeners();
                    wind.close();
                }
            }
        },
        failure: function(form, action) {
            Ext.MessageBox.show({
                title: 'Failure',
                msg: action.result.data,
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.ERROR,
                scope: this
            });
        }
    });
};

/**
* @desc      RECLN registration form host window
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.FinanceBankReconciliation
* @class     Ext.core.finance.ux.FinanceBankReconciliation.Window
* @extends   Ext.Window
*/
Ext.core.finance.ux.FinanceBankReconciliation.Window = function (config) {
    Ext.core.finance.ux.FinanceBankReconciliation.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        width: 1000,
        height: 630,
        closeAction: 'close',
        modal: true,
        resizable: true,
        buttonAlign: 'right',
        bodyStyle: 'padding:0px;',
        listeners: {
            show: function () {

                this.form.getForm().findField('Id').setValue(this.FinanceVouchersRECLNId);
                SelectedPeriodId = this.FinanceVouchersRECLNPeriodId;
                SelectedBankId = this.FinanceVouchersRECLNBankId;
            if (this.FinanceVouchersRECLNId != 0) {
                SelectedPeriodId = this.FinanceVouchersRECLNPeriodId;
                SelectedBankId = this.FinanceVouchersRECLNBankId;
                    this.form.load({ params: { Id: this.FinanceVouchersRECLNId} });
                     LoadRECLNGridDetails(this.FinanceVouchersRECLNId);
                     
                }
            }, 
            beforeclose: function (win) {
                var dirty = this.form.getForm().isDirty();

                
                if (dirty)
                    Ext.MessageBox.show({
                        title: 'Save Changes',
                        msg: 'Do you want to save the changes made before closing?',
                        buttons: Ext.Msg.YESNOCANCEL,
                        fn: function (btnId) {
                            if (btnId === 'yes') {
                                RECLNHandlers.onSaveRECLNClick(true);
                                
                            }
                            else if (btnId === 'no') {
                                win.purgeListeners();
                                win.close();
                            }
                        }
                    });

                return !dirty;
            },
            scope: this
        }
    }, config));
}
Ext.extend(Ext.core.finance.ux.FinanceBankReconciliation.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.core.finance.ux.FinanceBankReconciliation.Form();
        this.grid = new Ext.core.finance.ux.FinanceBankReconciliation.Grid();
        
        this.items = [this.form, this.grid];

        this.buttons = [ {
            text: 'Close',
            iconCls: 'icon-exit',
            handler: this.onClose,
            scope: this
        }];

        Ext.core.finance.ux.FinanceBankReconciliation.Window.superclass.initComponent.call(this, arguments);
    },
 
    onClose: function () {
        this.close();
    }
});
Ext.reg('FinanceBankReconciliation-window', Ext.core.finance.ux.FinanceBankReconciliation.Window);

var RECLNSelModel = new Ext.grid.CheckboxSelectionModel();

/**
* @desc      RECLN grid
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.FinanceBankReconciliation
* @class     Ext.core.finance.ux.FinanceBankReconciliationMain.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.core.finance.ux.FinanceBankReconciliationMain.Grid = function (config) {
    Ext.core.finance.ux.FinanceBankReconciliationMain.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: FinanceBankReconciliation.GetAllHeaders,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Code',
                direction: 'ASC'
            },
            fields: ['Id', 'Bank', 'Period', 'TotalUnreconciledAmount', 'CashBookBankBalance','BankStatementBalance', 'PeriodId','BankId'],
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
        id: 'FinanceBankReconciliationMain-grid',
        searchCriteria: {},
        pageSize: 38,
        
        stripeRows: true,
        columnLines: true,
        border: false,
        sm: RECLNSelModel,
        viewConfig: {
            forceFit: true,
            autoFill: true,
                listeners: {
                itemcontextmenu: function(view, rec, node, index, e) {
                    e.stopEvent();
                    contextMenu.showAt(e.getXY());
                    return false;
                }
            }

        },
        listeners: {
            rowClick: function () {
                if (!this.getSelectionModel().hasSelection()) return;
                var id = this.getSelectionModel().getSelected().get('Id');
                var form = Ext.getCmp('FinanceBankReconciliation-form');
                if (id != null) {

                }
            },
            scope: this,
            rowdblclick: function() {
                OnEditReconciliation();

            }

        },
        columns: [{
            dataIndex: 'Id',
            header: 'Id',
            sortable: true,
            hidden: true,
            width: 55,
            menuDisabled: false
        },RECLNSelModel, new Ext.erp.ux.grid.PagingRowNumberer(),
         {
             dataIndex: 'Period',
             header: 'Period',
             sortable: true,
             width: 55,
             menuDisabled: false
         }, {
             dataIndex: 'Bank',
             header: 'Bank',
             sortable: true,
             width: 55,
             menuDisabled: true
         }, {
             dataIndex: 'TotalUnreconciledAmount',
             header: 'Unreconciled Amount',
             sortable: true,
             width: 55,
             menuDisabled: true
         }, {
             dataIndex: 'CashBookBankBalance',
             header: 'Cash Book Balance',
             sortable: true,
             width: 55,
             menuDisabled: true
         },{
             dataIndex: 'BankStatementBalance',
             header: 'Bank Statement Balance',
             sortable: true,
             width: 55,
             menuDisabled: true
         }, {
             dataIndex: 'PeriodId',
             header: 'Period Id',
             sortable: true,
             width: 55,
             hidden : true,
             menuDisabled: true
         }, {
             dataIndex: 'BankId',
             header: 'Bank Id',
             sortable: true,
             width: 55,
             hidden:true,
             menuDisabled: true
         }]
    }, config));
};
Ext.extend(Ext.core.finance.ux.FinanceBankReconciliationMain.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ mode: 'get' })  };
        this.tbar = [];
        this.bbar = new Ext.PagingToolbar({
            id: 'FinanceBankReconciliationMain-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.core.finance.ux.FinanceBankReconciliationMain.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getStore().load({

            params: { start: 0, limit: this.pageSize }
        });
        Ext.core.finance.ux.FinanceBankReconciliationMain.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('FinanceBankReconciliationMain-grid', Ext.core.finance.ux.FinanceBankReconciliationMain.Grid);

var SCriteria = '';
var LoadRECLNGridDetails = function (selectedRow) {

    var RECLNDetailGrid = Ext.getCmp('FinanceBankReconciliation-grid');
    var RECLNDetailStore = RECLNDetailGrid.getStore();
    var RECLNHeaderId = selectedRow;
    var periodId = SelectedPeriodId;// Ext.getCmp('PeriodId').getValue(); 
    var bankId = SelectedBankId;// Ext.getCmp('BankId').getValue();
    //RECLNDetailStore.baseParams = { record: Ext.encode({ voucherHeaderId: RECLNHeaderId, mode: this.mode }) };
    RECLNDetailStore.load({
        params: { start: 0, limit: 200000 , PeriodId:SelectedPeriodId, BankId : SelectedBankId}
    });

}
var k = new Ext.KeyMap(Ext.getBody(), [
{
    key: "s",
    ctrl: true,
    fn: function(e, ele) {
        ele.preventDefault();
        RECLNHandlers.onSaveRECLNClick(false);
        ele.preventDefault();
    }
}]);

/**
* @desc      FinanceBankReconciliation grid
* @author    Dawit Kiros
* @copyright (c) 2010, Cybersoft
* @date      November 01, 2010
* @namespace Ext.core.finance.ux.FinanceBankReconciliation
* @class     Ext.core.finance.ux.FinanceBankReconciliation.Grid
* @extends   Ext.grid.GridPanel
*/
var BReclnSelModel = new Ext.grid.CheckboxSelectionModel();
Ext.core.finance.ux.FinanceBankReconciliation.Grid = function (config) {
    Ext.core.finance.ux.FinanceBankReconciliation.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: FinanceBankReconciliation.GetAllDetailsForReconciliation,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|PeriodId|BankId',
            root: 'data',
            
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Code',
                direction: 'ASC'
            },
            fields: ['Id','IsReconciled', 'Date', 'InvoiceNo', 'Description', 'ChequeNo', 'DebitAmount', 'CreditAmount'],
            remoteSort: true,
            listeners: {
                beforeLoad: function () { Ext.getCmp('FinanceBankReconciliation-grid').body.mask('Loading...', 'x-mask-loading'); },
                load: function() {
                    var grid = Ext.getCmp('FinanceBankReconciliation-grid');
                    var store = grid.getStore();
                    
                    grid.getComputerBalance(store);
                    grid.GetTotalUnreconciledAmount(store);
                    grid.body.unmask();
                },
                loadException: function () { Ext.getCmp('FinanceBankReconciliation-grid').body.unmask(); },
                scope: this



            }
        }),
        id: 'FinanceBankReconciliation-grid',
        pageSize: 20000,
        stripeRows: true,
        border: true,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        viewConfig: {
            forceFit: false,
            autoExpandColumn: 'IdentityNumber',
            autoFill: true
        },
        height: 380,
        listeners: {
            rowClick:  function (inthis, rowIndex, e) {
//                var form = Ext.getCmp('FinanceBankReconciliation-form').getForm();
//                var record = inthis.getStore().getAt(rowIndex);
//                var debitAmnt = record.data.DebitAmount;
//                var creditAmnt = record.data.CreditAmount;
//                var sumDbtCrdt = debitAmnt + creditAmnt;

//                var totalUnreconciled = form.findField('TotalUnreconciledAmount').getValue();

//                var diff = totalUnreconciled - sumDbtCrdt;

//                if (diff > 0) {
//                    form.findField('TotalUnreconciledAmount').setValue(diff);
//                } else {
//                    form.findField('TotalUnreconciledAmount').setValue(0);
//                }
                
            },afteredit: function(e) {
                
            },
            scope: this
        },
        columns: [new Ext.erp.ux.grid.PagingRowNumberer(),
        {
            dataIndex: 'Id',
            header: 'Id',
            sortable: true,
            hidden: true,
            width: 100,
            menuDisabled: true
        },new Ext.grid.CheckColumn({
            header: '<div><input type="checkbox" id="chkIsReconciled" onclick="javascript: return bankReconciliationSelectAll(this);">&nbsp;IsReconciled</div>',
            dataIndex: 'IsReconciled',
            width: 90,
            menuDisabled: true, editor: {
                xtype: 'checkbox',
                cls: 'x-grid-checkheader-editor'
            },
            listeners: {
                checkchange: function (column, recordIndex,record) {
//                    var reclnDetail = this.grid.getStore().data.items;
//                    var isReconciled = reclnDetail[i].data.Add
                    var form = Ext.getCmp('FinanceBankReconciliation-form').getForm();
                    
                    var debitAmnt = record.data.DebitAmount;
                    var creditAmnt = record.data.CreditAmount;
                    var sumDbtCrdt = debitAmnt + creditAmnt;

                    var totalUnreconciled = form.findField('TotalUnreconciledAmount').getValue();

                    var diff = 0;

                    if (recordIndex) {
                        diff = totalUnreconciled - sumDbtCrdt;
                    } else {
                        diff = totalUnreconciled + sumDbtCrdt;
                    }

                    if (diff > 0) {
                        form.findField('TotalUnreconciledAmount').setValue(diff);
                    } else {
                        form.findField('TotalUnreconciledAmount').setValue(0);
                    }
                }
            }
        }), {
            dataIndex: 'Date',
            header: 'Date',
            sortable: true,
            width: 220,
            menuDisabled: false
        }, {
            dataIndex: 'InvoiceNo',
            header: 'InvoiceNo',
            sortable: true,
            width: 200,
            menuDisabled: true
        }, {
            dataIndex: 'Description',
            header: 'Description',
            sortable: true,
            typeAhead: true,
            width: 200
            //menuDisabled: true
        }, {
            dataIndex: 'ChequeNo',
            header: 'Cheque No',
            sortable: true,
            width: 220,
            menuDisabled: true
        }, {
            dataIndex: 'DebitAmount',
            header: 'DebitAmount',
            sortable: true,
            width: 100,
            menuDisabled: true,
            renderer: function (value) {
                return Ext.util.Format.number(value, '0,000.00 ');
            }
        }, {
            dataIndex: 'CreditAmount',
            header: 'CreditAmount',
            sortable: true,
            width: 100,
            menuDisabled: true,
            renderer: function (value) {
                return Ext.util.Format.number(value, '0,000.00 ');
            }
        }]
    }, config));
};
Ext.extend(Ext.core.finance.ux.FinanceBankReconciliation.Grid, Ext.grid.EditorGridPanel, {
    initComponent: function () {

        this.store.baseParams = { record: Ext.encode({ voucherTypeId: this.voucherTypeId }) };


        Ext.core.finance.ux.FinanceBankReconciliation.Grid.superclass.initComponent.apply(this, arguments);
    },
     GetTotalUnreconciledAmount : function(store) {
        var form = Ext.getCmp('FinanceBankReconciliation-form').getForm();

        var unRecAmount = 0;
        var drBalance = 0;
        var crBalance = 0;
        store.each(function(item) {
            drBalance = drBalance + item.data['DebitAmount'];
            crBalance = crBalance + item.data['CreditAmount'];
        });

            unRecAmount = drBalance + crBalance;

            form.findField('TotalUnreconciledAmount').setValue(unRecAmount);
            form.findField('TempTotalUnreconciledAmount').setValue(unRecAmount);
    } ,
        getComputerBalance : function(store) {
        var form = Ext.getCmp('FinanceBankReconciliation-form').getForm();

        var periodId = SelectedPeriodId;
        var bankId = SelectedBankId;

        window.FinanceBankReconciliation.GetCashBookBalance(periodId, bankId, function (response) {
            if (response.success) {
                var form = Ext.getCmp('FinanceBankReconciliation-form').getForm();
                form.findField('CashBookBankBalance').setValue(response.data);
//                var text = 'Total working days for the selected month = ' + response.data;
//                Ext.getCmp('totalWorkingDays').setValue(text);
//                Ext.getCmp('totalWorkingDays2').setValue(response.data);
            }
        });
//        var comBalance = 0;
//        var drBalance = 0;
//        var crBalance = 0;
//        store.each(function(item) {
//            drBalance = drBalance + item.data['DebitAmount'];
//            crBalance = crBalance + item.data['CreditAmount'];
//        });

//            comBalance = drBalance - crBalance;

        //form.findField('CashBookBankBalance').setValue(comBalance);

    } ,   onNextEntry: function() {
        var form = Ext.getCmp('FinanceBankReconciliation-form').getForm();
        
        var reclnGrid = Ext.getCmp('FinanceBankReconciliation-grid');
        var reclnStore = reclnGrid.getStore();

        form.findField('Id').reset();


        reclnStore.removeAll();


    }
});
Ext.reg('FinanceBankReconciliation-grid', Ext.core.finance.ux.FinanceBankReconciliation.Grid);

/**
* @desc      RECLN panel
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @version   $Id: FinanceBankReconciliation.js, 0.1
* @namespace Ext.core.finance.ux.FinanceBankReconciliation
* @class     Ext.core.finance.ux.FinanceBankReconciliation.Panel
* @extends   Ext.Panel
*/
Ext.core.finance.ux.FinanceBankReconciliation.Panel = function (config) {
    Ext.core.finance.ux.FinanceBankReconciliation.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false,
        tbar: {
            xtype: 'toolbar',
            items: [{
                xtype: 'button',
                text: 'Add',
                id: 'addFinanceVouchersRECLN',
                iconCls: 'icon-add',
                handler: this.onAddClick,
                disabled: !Ext.core.finance.ux.Reception.getPermission('Bank Reconciliation', 'CanAdd')
                
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Edit',
                id: 'editFinanceVouchersRECLN',
                iconCls: 'icon-edit',
                handler: this.onEditClick,
                disabled: !Ext.core.finance.ux.Reception.getPermission('Bank Reconciliation', 'CanEdit')
                
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Delete',
                id: 'deleteFinanceVouchersRECLN',
                iconCls: 'icon-delete',
                handler: this.onDeleteClick,
                disabled: !Ext.core.finance.ux.Reception.getPermission('Bank Reconciliation', 'CanDelete')
                
            }]
        }
    }, config));
}
Ext.extend(Ext.core.finance.ux.FinanceBankReconciliation.Panel, Ext.Panel, {
    initComponent: function () {
        this.items = [{
            xtype: 'FinanceBankReconciliationMain-grid',
            id: 'FinanceBankReconciliationMain-grid'
        }];
        Ext.core.finance.ux.FinanceBankReconciliation.Panel.superclass.initComponent.apply(this, arguments);
    },

    onAddClick: function () {
        new Ext.core.finance.ux.FinanceBankReconciliation.Window({
            FinanceVouchersRECLNId: 0,
            title: 'Add Reconciliation'
        }).show();
    },
    onEditClick: function () {
        OnEditReconciliation();
    },
    onDeleteClick: function () {
        var grid = Ext.getCmp('FinanceBankReconciliationMain-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        Ext.MessageBox.show({
            title: 'Delete',
            msg: 'Are you sure you want to delete the selected Row?',
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
                    FinanceBankReconciliation.Delete(id, function (result, response) {
                        Ext.getCmp('FinanceBankReconciliationMain-paging').doRefresh();
                    }, this);
                }
            }
        });
    }
   
});

Ext.reg('FinanceBankReconciliation-panel', Ext.core.finance.ux.FinanceBankReconciliation.Panel);

var SelectedPeriodId = 0;
var SelectedBankId = 0;
function bankReconciliationSelectAll(cb) {
    var grid = Ext.getCmp('FinanceBankReconciliation-grid');
    grid.store.each(function(record, index) {

        record.set('IsReconciled', cb.checked);

    });

    if (cb.checked) {
        var form = Ext.getCmp('FinanceBankReconciliation-form').getForm();
        form.findField('TotalUnreconciledAmount').setValue(0);
        
    } else {
        var form = Ext.getCmp('FinanceBankReconciliation-form').getForm();
        var unRecAmount = form.findField('TempTotalUnreconciledAmount').getValue();
        form.findField('TotalUnreconciledAmount').setValue(unRecAmount);
    }
}

var OnEditReconciliation = function() {
    var grid = Ext.getCmp('FinanceBankReconciliationMain-grid');
    if (!grid.getSelectionModel().hasSelection()) return;
    var id = grid.getSelectionModel().getSelected().get('Id');
    var periodId = grid.getSelectionModel().getSelected().get('PeriodId');
    var bankId = grid.getSelectionModel().getSelected().get('BankId');
    new Ext.core.finance.ux.FinanceBankReconciliation.Window({
        FinanceVouchersRECLNId: id,
        FinanceVouchersRECLNPeriodId: periodId,
        FinanceVouchersRECLNBankId: bankId,
        title: 'Edit RECLN'
    }).show();
}

