Ext.ns('Ext.erp.CoreFin.ux.FinanceTransactionUnpost');

/**
* @desc      Voucher grid
* @author    Dawit Kiros
* @copyright (c) 2010, Cybersoft
* @date      November 01, 2010
* @namespace Ext.erp.CoreFin.ux.FinanceTransactionUnpost
* @class     Ext.erp.CoreFin.ux.FinanceTransactionUnpost.HeaderGrid
* @extends   Ext.grid.GridPanel
*/

var selModelTransactionsUnpost = new Ext.grid.CheckboxSelectionModel();

Ext.erp.CoreFin.ux.FinanceTransactionUnpost.HeaderGrid = function (config) {
    Ext.erp.CoreFin.ux.FinanceTransactionUnpost.HeaderGrid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: FinanceTransaction.GetAllHeaders,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Code',
                direction: 'ASC'
            },
            fields: ['Id', 'VoucherType', 'ReferenceNo', 'Date', 'PayedToReceivedFrom', 'Purpose', 'Amount', 'ModeOfPayment', 'IsBalanced', 'IsPosted', 'IsVoid', 'IsAdjustment'],
            remoteSort: true,
            listeners: {
                beforeLoad: function () {
                    this.body.mask('Loading...', 'x-mask-loading');
                },
                load: function () {
                    this.body.unmask();
                    this.controlButton();
                },
                loadException: function () {
                    this.body.unmask();
                },
                scope: this
            }
        }),
        id: 'FinanceTransactionUnpostHeader-grid',
        searchCriteria: {},
        mode: 'get',
        pageSize: 30,
        height: 300,
        stripeRows: true,
        columnLines: true,
        border: false,
        sm: selModelTransactionsUnpost,
        listeners: {
            rowClick: function (grid, rowIndex, e) {
                var selectedRow = grid.getStore().getAt(rowIndex);
                var isBalanced = selectedRow.get('IsBalanced');
                if (isBalanced) {
                    this.loadVoucherDetail2(selectedRow);
                    this.controlButton();
                }
                else {
                    this.loadVoucherDetail2(selectedRow);
                    this.controlButton();
                    //grid.getSelectionModel().deselectRow(rowIndex);
                }

            },
            containermousedown: function (grid) {
                grid.getSelectionModel().deselectRange(0, grid.pageSize);
                Ext.getCmp('txtUnpostDebitAmount').reset();
                Ext.getCmp('txtUnpostCreditAmount').reset();
                var FinanceTransactionDetailGrid = Ext.getCmp('TransactionsUnpostDetail-grid');
                var FinanceTransactionDetailStore = FinanceTransactionDetailGrid.getStore();
                FinanceTransactionDetailStore.removeAll();
                this.controlButton();
            },
            scope: this
        },
        columns: [
        new Ext.erp.ux.grid.PagingRowNumberer(),
        selModelTransactionsUnpost,
        {
            dataIndex: 'Id',
            header: 'Id',
            sortable: true,
            hidden: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'VoucherType',
            header: 'Type',
            sortable: true,
            width: 50,
            menuDisabled: true,
            renderer: this.customRenderer
        }, {
            dataIndex: 'ReferenceNo',
            header: 'Reference No',
            sortable: true,
            width: 100,
            menuDisabled: true,
            renderer: this.customRenderer
        }, {
            dataIndex: 'Date',
            header: 'Date',
            sortable: true,
            width: 85,
            menuDisabled: true,
            renderer: this.customRenderer
        }, {
            dataIndex: 'ModeOfPayment',
            header: 'Mode of Payment',
            sortable: true,
            hidden: true,
            width: 100,
            menuDisabled: true,
            renderer: this.customRenderer
        }, {
            dataIndex: 'IsPosted',
            header: 'Posted',
            sortable: true,
            width: 50,
            menuDisabled: true,
            align: 'center',
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                if (value)
                    return '<img src="Content/images/app/yes.png"/>';
                else
                    return '<img src="Content/images/app/no.png"/>';
            }
        }, {
            dataIndex: 'IsVoid',
            header: 'Void',
            sortable: true,
            width: 50,
            menuDisabled: true,
            align: 'center',
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                if (value)
                    return '<img src="Content/images/app/yes.png"/>';
                else
                    return '<img src="Content/images/app/no.png"/>';
            }
        }]
    }, config));
};
Ext.extend(Ext.erp.CoreFin.ux.FinanceTransactionUnpost.HeaderGrid, Ext.grid.GridPanel, {
    initComponent: function () {
        
        var param = { mode: 'get', voucherType: '', project: '', periodId: '', isAuthorized: '', referenceNo: '', startDate: '', endDate: '', transactionStatus: 'posted' };
        this.store.baseParams = { record: Ext.encode(param) };
        this.tbar = [{
            id: 'unpostFinanceTransaction',
            text: 'Unpost',
            hidden: false,
            iconCls: 'icon-accept',
            handler: this.onUnpostFinanceTransaction2
        }, {
            xtype: 'tbseparator',
            hidden: true
        },{
            id: 'voidUnpostTransaction',
            text: 'Void',
            iconCls: 'icon-delete',
            handler: this.onVoidFinanceTransaction2
        } , {
            xtype: 'tbseparator',
            hidden: true
        },{
            xtype: 'tbfill'
        }, '->', {
            id: 'UnpostTransRefNo',
            xtype: 'textfield',
            width: 120,
            emptyText: 'Ref No',
            hidden: true,
            allowBlank: true,
            listeners: {
                specialkey: function (field, e) {
                    if (e.getKey() == e.ENTER) {
                        onSearchUnpostTransactions();
                    }
                }
            }

        }, {
            id: 'UnpostTransStartDate',
            xtype: 'datefield',
            anchor: '30%',
            emptyText: 'StartDate',
            hidden: true,
            allowBlank: true,
            listeners: {
                select: function () {
                    var endDate = Ext.getCmp('UnpostTransEndDate').getValue();
                    if (endDate != '') {
                        onSearchUnpostTransactions();
                    }
                }
            }

        },  {
            id: 'UnpostTransEndDate',
            xtype: 'datefield',
            //fieldLabel: 'Purpose',
            anchor: '30%',
            emptyText: 'EndDate',
            hidden:true,
            allowBlank: true,
            listeners: {
                select: function () {
                    var startDate = Ext.getCmp('UnpostTransStartDate').getValue();
                    if (startDate != '') {
                        onSearchUnpostTransactions();
                    }
                }
            }

        }, {
            xtype: 'button',
            tooltip: 'Reset',
            text: 'Reset',
            id: 'searchFinanceVouchersTrans',
            iconCls: 'icon-refresh',
            handler: this.onUnpostTransRefreshClick

        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            id: 'btnSearchTransactions',
            iconCls: 'icon-filter',
            tooltip: 'Search',
            text: 'Search',
            handler: function () {
                new Ext.core.finance.ux.searchTransactions.Window({
                    title: 'Search Transactions', CallerId: 0, CallerGrid: 'FinanceTransactionUnpostHeader-grid'
                }).show();
            }
        }];
        this.bbar = new Ext.PagingToolbar({
            id: 'FinanceTransactionUnpostHeader-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.CoreFin.ux.FinanceTransactionUnpost.HeaderGrid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getStore().load({
            params: { start: 0, limit: this.pageSize }
        });
        Ext.erp.CoreFin.ux.FinanceTransactionUnpost.HeaderGrid.superclass.afterRender.apply(this, arguments);
    },


    onVoidFinanceTransaction2: function () {
        var grid = Ext.getCmp('FinanceTransactionUnpostHeader-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var msg = Ext.MessageBox;

        Ext.MessageBox.show({
            title: 'Void Transactions',
            msg: 'Are you sure you want to void the selected vouchers?',
            buttons: msg.YESNO,
            icon: msg.QUESTION,
            cls: 'msgbox-question',
            width: 400,
            fn: function (buttonType) {
                if (buttonType == 'yes') {
                    Ext.MessageBox.show({
                        msg: 'Void Transaction , please wait...',
                        progressText: 'Void...',
                        width: 300,
                        wait: true,
                        waitConfig: { interval: 200 }
                    });

                    var selectedVouchers = grid.getSelectionModel().getSelections();

                    var voucherHeaderIds = '';
                    for (var i = 0; i < selectedVouchers.length; i++) {
                        if ( /*selectedVouchers[i].get('IsPosted') &&*/!selectedVouchers[i].get('IsVoid')) {
                            if (i == selectedVouchers.length - 1) {
                                voucherHeaderIds += selectedVouchers[i].get('Id');
                            } else {
                                voucherHeaderIds += selectedVouchers[i].get('Id') + ';';
                            }
                        } else {
                            Ext.MessageBox.show({
                                title: 'Void Failed',
                                msg: 'The transaction has already been void.',
                                buttons: msg.OK,
                                icon: msg.INFO,
                                //cls: 'msgbox-critical',
                                width: 400
                            });
                        }
                    }
                    if (voucherHeaderIds.slice(-1) == ';') {
                        voucherHeaderIds = voucherHeaderIds.slice(0, voucherHeaderIds.length - 1);
                    }

                    if (voucherHeaderIds != '') {
                        Ext.Ajax.timeout = 6000000;
                        FinanceTransaction.Void(voucherHeaderIds, function (result, response) {
                            Ext.MessageBox.hide();
                            if (response.result.success) {
                                var record = grid.getSelectionModel().getSelected();
                                if (record !== undefined) {
                                    grid.store.remove(record);
                                }
                                var FinanceTransactionDetailGrid = Ext.getCmp('TransactionsUnpostDetail-grid');
                                var FinanceTransactionDetailStore = FinanceTransactionDetailGrid.getStore();
                                FinanceTransactionDetailStore.removeAll();
                                Ext.getCmp('FinanceTransactionUnpostHeader-paging').doRefresh();
                                Ext.MessageBox.show({
                                    title: 'Void Succeeded',
                                    msg: response.result.data,
                                    buttons: msg.OK,
                                    icon: msg.INFO,
                                    cls: 'msgbox-info',
                                    width: 400
                                });
                            } else {
                                Ext.MessageBox.show({
                                    title: 'Voiding this FinanceTransactionUnpost failed',
                                    msg: response.result.data,
                                    buttons: msg.OK,
                                    icon: msg.ERROR,
                                    cls: 'msgbox-critical',
                                    width: 400
                                });
                            }
                        }, this);
                    }
                }
            }
        });
    },
    onUnpostFinanceTransaction2: function () {
        Ext.Ajax.timeout = 6000000;
        var grid = Ext.getCmp('FinanceTransactionUnpostHeader-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var msg = Ext.MessageBox;
        Ext.MessageBox.show({
            title: 'Unpost Transactions',
            msg: 'Are you sure you want to Unpost the selected transactions?',
            buttons: msg.YESNO,
            icon: msg.QUESTION,
            cls: 'msgbox-question',
            width: 400,
            fn: function (buttonType) {
                if (buttonType == 'yes') {
                    Ext.MessageBox.show({
                        msg: 'Unposting Transactions, please wait...',
                        progressText: 'Unposting...',
                        width: 300,
                        wait: true,
                        waitConfig: { interval: 200 }
                    });
                    var selectedVouchers = grid.getSelectionModel().getSelections();
                    var voucherHeaderIds = '';
                    for (var i = 0; i < selectedVouchers.length; i++) {
                        if (!selectedVouchers[i].get('IsPosted')) {
                            continue;
                        }
                        if (i == selectedVouchers.length - 1) {
                            voucherHeaderIds += selectedVouchers[i].get('Id');
                        }
                        else {
                            voucherHeaderIds += selectedVouchers[i].get('Id') + ';';
                        }
                    }
                    if (voucherHeaderIds.slice(-1) == ';') {
                        voucherHeaderIds = voucherHeaderIds.slice(0, voucherHeaderIds.length - 1);
                    }
                    if (voucherHeaderIds != '') {
                        FinanceTransaction.Unpost(voucherHeaderIds, function (result, response) {
                            Ext.MessageBox.hide();
                            if (response.result.success) {
                                Ext.getCmp('FinanceTransactionUnpostHeader-paging').doRefresh();

                                var FinanceTransactionDetailGrid = Ext.getCmp('TransactionsUnpostDetail-grid');
                                var FinanceTransactionDetailStore = FinanceTransactionDetailGrid.getStore();
                                FinanceTransactionDetailStore.removeAll();
                                Ext.MessageBox.show({
                                    title: 'Unposting Succeeded',
                                    msg: response.result.data,
                                    buttons: msg.OK,
                                    icon: msg.INFO,
                                    cls: 'msgbox-info',
                                    width: 400
                                });
                            } else {
                                Ext.MessageBox.show({
                                    title: 'Unposting Failed',
                                    msg: response.result.data,
                                    buttons: msg.OK,
                                    icon: msg.ERROR,
                                    cls: 'msgbox-critical',
                                    width: 400
                                });
                            }
                        }, this);
                    }
                    else {
                        Ext.MessageBox.show({
                            title: 'Unposting failed',
                            msg: 'Select at least one posted FinanceTransactionUnpost for unposting!',
                            buttons: msg.OK,
                            icon: msg.ERROR,
                            cls: 'msgbox-critical',
                            width: 400
                        });
                    }
                }
            }
        });
    },

    loadVoucherDetail2: function (selectedRow) {
        var FinanceTransactionDetailGrid = Ext.getCmp('TransactionsUnpostDetail-grid');
        var FinanceTransactionDetailStore = FinanceTransactionDetailGrid.getStore();
        var FinanceTransactionHeaderId = selectedRow.get('Id');
        FinanceTransactionDetailStore.baseParams = { record: Ext.encode({ voucherHeaderId: FinanceTransactionHeaderId, mode: this.mode }) };
        FinanceTransactionDetailStore.load({
            params: { start: 0, limit: 100 }
        });
    },
    controlButton: function () {

    },
    customRenderer: function (value, metaData, record, rowIndex, colIndex, store) {
        if (record.data.IsBalanced) {
            return '<span style="color:green;">' + value + '</span>';
        }
        else if (record.data.IsVoid) {
            return '<span style="color:orange;">' + value + '</span>';
        }
        else {
            return '<span style="color:red;">' + value + '</span>';
        }
    }
    ,
    onUnpostTransRefreshClick: function () {
        Ext.getCmp('UnpostTransRefNo').reset();
        Ext.getCmp('UnpostTransStartDate').reset();
        Ext.getCmp('UnpostTransEndDate').reset();
        onSearchUnpostTransactions();
    }
});
Ext.reg('FinanceTransactionUnpostHeader-grid', Ext.erp.CoreFin.ux.FinanceTransactionUnpost.HeaderGrid);

var onSearchUnpostTransactions = function () {
    var transGrid = Ext.getCmp('FinanceTransactionUnpostHeader-grid');
    var transStore = transGrid.getStore();
    var refNo = Ext.getCmp('UnpostTransRefNo').getValue();
    var startDt = Ext.getCmp('UnpostTransStartDate').getValue();
    var endDt = Ext.getCmp('UnpostTransEndDate').getValue();

    
    transStore.baseParams = { record: Ext.encode({ voucherType: '', project: '', periodId: '', isAuthorized: true, referenceNo: '', startDate: '', endDate: '', transactionStatus: 'posted', mode: 'search' }) };
    transStore.load({
        params: { start: 0, limit: 30 }
    });
};
/**
* @desc      Voucher grid
* @author    Dawit Kiros
* @copyright (c) 2010, Cybersoft
* @date      November 01, 2010
* @namespace Ext.erp.CoreFin.ux.FinanceTransactionUnpost
* @class     Ext.erp.CoreFin.ux.FinanceTransactionUnpost.DetailGrid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.CoreFin.ux.FinanceTransactionUnpost.DetailGrid = function (config) {
    Ext.erp.CoreFin.ux.FinanceTransactionUnpost.DetailGrid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: FinanceTransaction.GetAllDetails,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Code',
                direction: 'ASC'
            },
            fields: ['Id', 'Description', 'Department', 'Account', 'Woreda', 'Reference', 'DebitAmount', 'CreditAmount'],
            remoteSort: true,
            listeners: {
                beforeLoad: function () { Ext.getCmp('TransactionsUnpostDetail-grid').body.mask('Loading...', 'x-mask-loading'); },
                load: function () {
                    var grid = Ext.getCmp('TransactionsUnpostDetail-grid');
                    var store = grid.getStore();
                    grid.checkBalance(store, 'DebitAmount');
                    grid.checkBalance(store, 'CreditAmount');
                    grid.body.unmask();
                },
                loadException: function () { Ext.getCmp('TransactionsUnpostDetail-grid').body.unmask(); },
                scope: this
            }
        }),
        id: 'TransactionsUnpostDetail-grid',
        selectedVoucherTypeId: 0,
        pageSize: 10,
        height: 500,
        stripeRows: true,
        columnLines: true,
        border: true,
        sm: new Ext.grid.RowSelectionModel({ singleSelect: true }),
        listeners: {
            containermousedown: function (grid) {
                grid.getSelectionModel().deselectRange(0, grid.pageSize);
            },
            scope: this
        },
        columns: [{
            dataIndex: 'Id',
            header: 'Id',
            sortable: false,
            hidden: true,
            width: 100,
            menuDisabled: true
        }, new Ext.grid.RowNumberer(), {
            dataIndex: 'Description',
            header: 'Description',
            sortable: true,
            width: 190,
            menuDisabled: true,
            xtype: 'combocolumn'
        }, {
            dataIndex: 'Department',
            header: 'Department',
            sortable: true,
            width: 70,
            menuDisabled: true,
            xtype: 'combocolumn'
        }, {
            dataIndex: 'Account',
            header: 'Account',
            sortable: true,
            width: 70,
            menuDisabled: true,
            xtype: 'combocolumn'
        }, {
            dataIndex: 'Woreda',
            header: 'Woreda',
            sortable: true,
            width: 70,
            menuDisabled: true
        }, {
            dataIndex: 'Reference',
            header: 'Reference',
            sortable: false,
            width: 70,
            menuDisabled: true
        }, {
            dataIndex: 'DebitAmount',
            header: 'Debit Amount',
            sortable: true,
            width: 90,
            menuDisabled: true,
            align: 'right',
            renderer: function (value) {
                if (value > 0) {
                    return Ext.util.Format.number(value, '0,000.00 ');
                } else {
                    return '';
                }
            }
        }, {
            dataIndex: 'CreditAmount',
            header: 'Credit Amount',
            sortable: true,
            width: 90,
            menuDisabled: true,
            align: 'right',
            renderer: function (value) {
                if (value > 0) {
                    return Ext.util.Format.number(value, '0,000.00 ');
                } else {
                    return '';
                }
            }
        }]
    }, config));
};
Ext.extend(Ext.erp.CoreFin.ux.FinanceTransactionUnpost.DetailGrid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ voucherTypeId: this.voucherTypeId }) };
        this.bbar = [{
            xtype: 'tbfill'
        }, 'Debit Total: ', {
            xtype: 'currencyfield',
            id: 'txtUnpostDebitAmount',
            allowNegative: false,
            disabled: true,
            value: 0,
            currencySymbol: 'ETB',
            style: 'font-weight: bold;border: 1px solid black;'
        }, ' Credit Total: ', {
            xtype: 'currencyfield',
            id: 'txtUnpostCreditAmount',
            allowNegative: false,
            disabled: true,
            value: 0,
            currencySymbol: 'ETB',
            style: 'font-weight: bold;border: 1px solid black;'
        }];
        Ext.erp.CoreFin.ux.FinanceTransactionUnpost.DetailGrid.superclass.initComponent.apply(this, arguments);
    },
    checkBalance: function (store, field) {
        var total = 0;
        store.each(function (item) {
            total = total + item.data[field];
        });
        //Ext.getCmp('txtFinanceTransaction' + field).setValue(total);
    }
});
Ext.reg('TransactionsUnpostDetail-grid', Ext.erp.CoreFin.ux.FinanceTransactionUnpost.DetailGrid);

/**
* @desc      Voucher panel
* @author    Dawit Kiros
* @copyright (c) 2010, Cybersoft
* @date      November 01, 2010
* @version   $Id: Voucher.js, 0.1
* @namespace Ext.erp.CoreFin.ux.FinanceTransactionUnpost
* @class     Ext.erp.CoreFin.ux.FinanceTransactionUnpost.Panel
* @extends   Ext.Panel
*/
Ext.erp.CoreFin.ux.FinanceTransactionUnpost.Panel = function (config) {
    Ext.erp.CoreFin.ux.FinanceTransactionUnpost.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false
    }, config));
};
Ext.extend(Ext.erp.CoreFin.ux.FinanceTransactionUnpost.Panel, Ext.Panel, {
    initComponent: function () {
        this.unpostHeaderGrid = new Ext.erp.CoreFin.ux.FinanceTransactionUnpost.HeaderGrid();
        this.unpostDetailGrid = new Ext.erp.CoreFin.ux.FinanceTransactionUnpost.DetailGrid();
        this.items = [{
            layout: 'border',
            border: false,
            items: [{
                region: 'west',
                border: true,
                collapsible: true,
                split: true,
                width: 500,
                minSize: 200,
                maxSize: 600,
                layout: 'fit',
                margins: '0 3 0 0',
                items: [this.unpostHeaderGrid]
            }, {
                region: 'center',
                border: false,
                layout: 'fit',
                items: [this.unpostDetailGrid]
            }]
        }];
        Ext.erp.CoreFin.ux.FinanceTransactionUnpost.Panel.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('FinanceTransactionUnpost-panel', Ext.erp.CoreFin.ux.FinanceTransactionUnpost.Panel);