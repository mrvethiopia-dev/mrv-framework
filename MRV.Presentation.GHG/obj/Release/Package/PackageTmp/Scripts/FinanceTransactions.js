Ext.ns('Ext.erp.CoreFin.ux.FinanceTransaction');

/**
* @desc      Voucher grid
* @author    Dawit Kiros
* @copyright (c) 2010, Cybersoft
* @date      November 01, 2010
* @namespace Ext.erp.CoreFin.ux.FinanceTransaction
* @class     Ext.erp.CoreFin.ux.FinanceTransaction.HeaderGrid
* @extends   Ext.grid.GridPanel
*/

var selModelTransactions = new Ext.grid.CheckboxSelectionModel();

Ext.erp.CoreFin.ux.FinanceTransaction.HeaderGrid = function (config) {
    Ext.erp.CoreFin.ux.FinanceTransaction.HeaderGrid.superclass.constructor.call(this, Ext.apply({
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
            fields: ['Id', 'VoucherType', 'ReferenceNo', 'Date', 'PayedToReceivedFrom', 'Purpose', 'Amount', 'ModeOfPayment', 'IsBalanced', 'IsAuthorized', , 'IsPosted', 'IsVoid', 'IsAdjustment'],
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
        id: 'FinanceTransactionHeader-grid',
        searchCriteria: {},
        mode: 'get',
        pageSize: 30,
        height: 300,
        stripeRows: true,
        columnLines: true,
        border: false,
        sm: selModelTransactions,
        listeners: {
            rowClick: function (grid, rowIndex, e) {
                var selectedRow = grid.getStore().getAt(rowIndex);
                var isBalanced = selectedRow.get('IsBalanced');
                if (isBalanced) {
                    this.loadVoucherDetail(selectedRow);
                    this.controlButton();
                }
                else {
                    this.loadVoucherDetail(selectedRow);
                    this.controlButton();
                    //grid.getSelectionModel().deselectRow(rowIndex);
                }

            },
            containermousedown: function (grid) {
                grid.getSelectionModel().deselectRange(0, grid.pageSize);
                Ext.getCmp('txtFinanceTransactionDebitAmount').reset();
                Ext.getCmp('txtFinanceTransactionCreditAmount').reset();
                var FinanceTransactionDetailGrid = Ext.getCmp('FinanceTransactionDetail-grid');
                var FinanceTransactionDetailStore = FinanceTransactionDetailGrid.getStore();
                FinanceTransactionDetailStore.removeAll();
                this.controlButton();
            },
            scope: this
        },
        columns: [
        new Ext.erp.ux.grid.PagingRowNumberer(),
        selModelTransactions,
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
            dataIndex: 'IsAuthorized',
            header: 'Authorized',
            sortable: true,
            width: 60,
            menuDisabled: true,
            align: 'center',
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                if (value)
                    return '<img src="Content/images/app/yes.png"/>';
                else
                    return '<img src="Content/images/app/no.png"/>';
            }
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
Ext.extend(Ext.erp.CoreFin.ux.FinanceTransaction.HeaderGrid, Ext.grid.GridPanel, {
    initComponent: function () {
        var param = { mode: 'get', voucherType: '', project: '', periodId: '', isAuthorized: '', referenceNo: '', startDate: '', endDate: '', transactionStatus: 'unposted' };
        this.store.baseParams = { record: Ext.encode(param) };
        this.tbar = [{
            id: 'postFinanceTransaction',
            text: 'Post',
            iconCls: 'icon-accept',
            handler: this.onPostFinanceTransaction
        }, {
            xtype: 'tbseparator',
            hidden: true
        }, {
            id: 'voidFinanceTransaction',
            text: 'Void',
            iconCls: 'icon-delete',
            hidden: true,
            handler: this.onVoidFinanceTransaction
        }, {
            xtype: 'tbseparator',
            hidden: true
        }, {
            id: 'adjustFinanceTransaction',
            text: 'Adjust',
            iconCls: 'icon-adjustment',
            hidden: true,
            handler: this.onAdjustFinanceTransaction
        }, {
            xtype: 'tbfill'
        }, '->', {
            id: 'TransRefNo',
            xtype: 'textfield',
            anchor: '250%',
            hidden: true,
            emptyText: 'Ref No',
            allowBlank: true,
            listeners: {
                specialkey: function (field, e) {
                    if (e.getKey() == e.ENTER) {
                        onSearchTransactions();
                    }
                }
            }

        },  {
            id: 'TransStartDate',
            xtype: 'datefield',
            anchor: '30%',
            hidden: true,
            emptyText: 'StartDate',
            allowBlank: true,
            listeners: {
                select: function () {
                    var endDate = Ext.getCmp('TransEndDate').getValue();
                    if (endDate != '') {
                        onSearchTransactions();
                    }
                }
            }

        }, {
            id: 'TransEndDate',
            xtype: 'datefield',
            //fieldLabel: 'Purpose',
            anchor: '30%',
            hidden: true,
            emptyText: 'EndDate',
            allowBlank: true,
            listeners: {
                select: function () {
                    var startDate = Ext.getCmp('TransStartDate').getValue();
                    if (startDate != '') {
                        onSearchTransactions();
                    }
                }
            }

        },  {
            xtype: 'button',
            tooltip: 'Reset',
            text:'Reset',
            id: 'searchFinanceVouchersTrans',
            iconCls: 'icon-refresh',
            handler: this.onTransRefreshClick

        }, {
            xtype: 'tbseparator'
        },{
            xtype: 'button',
            id: 'btnSearchTransactions',
            iconCls: 'icon-filter',
            tooltip: 'Search',
            text: 'Search',
            handler: function () {
                new Ext.core.finance.ux.searchTransactions.Window({
                    title: 'Search Transactions', CallerId: 0, CallerGrid: 'FinanceTransactionHeader-grid'
                }).show();
            }
        }];
        this.bbar = new Ext.PagingToolbar({
            id: 'FinanceTransactionHeader-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.CoreFin.ux.FinanceTransaction.HeaderGrid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        Ext.Ajax.timeout = 60000000;
        this.getStore().load({
            params: { start: 0, limit: this.pageSize }
        });
        Ext.erp.CoreFin.ux.FinanceTransaction.HeaderGrid.superclass.afterRender.apply(this, arguments);
    },
    onSearchFinanceTransaction: function () {
        Ext.erp.CoreFin.ux.FinanceTransactionSearch.Observable.on('searchFinanceTransaction', function (result) {
            result['mode'] = 'search';
            var grid = Ext.getCmp('FinanceTransactionHeader-grid');
            grid.searchCriteria = result;
            grid.mode = result['transactionStatus'] == '' ? 'get' : 'search';
            grid.store.baseParams = { record: Ext.encode(result) };
            grid.store.load({ params: { start: 0, limit: grid.pageSize} });

            //reset detail grid
            grid.getSelectionModel().deselectRange(0, grid.pageSize);
            Ext.getCmp('txtFinanceTransactionDebitAmount').reset();
            Ext.getCmp('txtFinanceTransactionCreditAmount').reset();
            var FinanceTransactionDetailGrid = Ext.getCmp('FinanceTransactionDetail-grid');
            FinanceTransactionDetailGrid.store.removeAll();
            grid.controlButton();
        }, this);
        new Ext.erp.CoreFin.ux.FinanceTransactionSearch.Window({ title: 'Search FinanceTransactions' }).show();
    },
    onPostFinanceTransaction: function () {
        var grid = Ext.getCmp('FinanceTransactionHeader-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var msg = Ext.MessageBox;
        Ext.MessageBox.show({
            title: 'Posting',
            msg: 'Are you sure you want to post the selected transaction. Once a transaction is posted, you cannot undo the operation.',
            buttons: msg.YESNO,
            icon: msg.QUESTION,
            cls: 'msgbox-question',
            width: 400,
            fn: function (buttonType) {
                if (buttonType == 'yes') {
                    Ext.MessageBox.show({
                        msg: 'Posting Transactions, please wait...',
                        progressText: 'Posting...',
                        width: 300,
                        wait: true,
                        waitConfig: { interval: 200 }
                    });
                    var selectedVouchers = grid.getSelectionModel().getSelections();
                    var voucherHeaderIds = '';
                    for (var i = 0; i < selectedVouchers.length; i++) {
                        if (!selectedVouchers[i].get('IsBalanced')) {
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
                        Ext.Ajax.timeout = 6000000;
                        FinanceTransaction.Post(voucherHeaderIds, function (result, response) {
                            Ext.MessageBox.hide();
                            if (response.result.success) {
                                Ext.getCmp('FinanceTransactionHeader-paging').doRefresh();

                                var FinanceTransactionDetailGrid = Ext.getCmp('FinanceTransactionDetail-grid');
                                var FinanceTransactionDetailStore = FinanceTransactionDetailGrid.getStore();
                                FinanceTransactionDetailStore.removeAll();

                                if (response.result.unpostedTrans) {
                                    Ext.MessageBox.show({
                                        title: 'An-authorized Vouchers',
                                        msg: 'An-authorized vouchers were skipped during the posting process. Please authorize the vouchers and try again.',
                                        buttons: msg.OK,
                                        icon: msg.INFO,
                                        cls: 'msgbox-info',
                                        width: 400
                                    });
                                } else {
                                    Ext.MessageBox.show({
                                        title: 'Posting Succeeded',
                                        msg: response.result.data,
                                        buttons: msg.OK,
                                        icon: msg.INFO,
                                        cls: 'msgbox-info',
                                        width: 400
                                    });
                                }
                            } else {
                                Ext.MessageBox.show({
                                    title: 'Posting failed',
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
                            title: 'Posting failed',
                            msg: 'You can not post unbalanced transactions. Debit total must equal Credit total.',
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
    onVoidFinanceTransaction: function () {
        var grid = Ext.getCmp('FinanceTransactionHeader-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var msg = Ext.MessageBox;

        Ext.MessageBox.show({
            title: 'Voiding',
            msg: 'Are you sure you want to void the selected voucher?',
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
                                var FinanceTransactionDetailGrid = Ext.getCmp('FinanceTransactionDetail-grid');
                                var FinanceTransactionDetailStore = FinanceTransactionDetailGrid.getStore();
                                FinanceTransactionDetailStore.removeAll();
                                Ext.getCmp('FinanceTransactionHeader-paging').doRefresh();
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
                                    title: 'Voiding this FinanceTransaction failed',
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
    onUnpostFinanceTransaction: function () {
        Ext.Ajax.timeout = 6000000;
        var grid = Ext.getCmp('FinanceTransactionHeader-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var msg = Ext.MessageBox;
        Ext.MessageBox.show({
            title: 'Posting',
            msg: 'Are you sure you want to proceed unposting. You cannot undo this operation.',
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
                                Ext.getCmp('FinanceTransactionHeader-paging').doRefresh();

                                var FinanceTransactionDetailGrid = Ext.getCmp('FinanceTransactionDetail-grid');
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
                            msg: 'Select at least one posted FinanceTransaction for unposting!',
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
    onAdjustFinanceTransaction: function () {
        var grid = Ext.getCmp('FinanceTransactionHeader-grid');
        if (!grid.getSelectionModel().hasSelection()) return;

        FinanceTransaction.GetJvNumber('004', function (result, response) {
            if (response.result.success) {
                var id = grid.getSelectionModel().getSelected().get('Id');
                new Ext.erp.CoreFin.ux.adjustment.Window({ voucherHeaderId: id, currentNumber: response.result.data.CurrentNumber }).show();
            } else {

            }
        });
    },
    loadVoucherDetail: function (selectedRow) {
        var FinanceTransactionDetailGrid = Ext.getCmp('FinanceTransactionDetail-grid');
        var FinanceTransactionDetailStore = FinanceTransactionDetailGrid.getStore();
        var FinanceTransactionHeaderId = selectedRow.get('Id');
        FinanceTransactionDetailStore.baseParams = { record: Ext.encode({ voucherHeaderId: FinanceTransactionHeaderId, mode: this.mode }) };
        FinanceTransactionDetailStore.load({
            params: { start: 0, limit: 100 }
        });
    },
    controlButton: function () {
        if (this.getSelectionModel().hasSelection()) {
            var isPosted = this.getSelectionModel().getSelected().get('IsPosted');
            var isVoid = this.getSelectionModel().getSelected().get('IsVoid');
            if (isPosted) {
                //                Ext.getCmp('postFinanceTransaction').setDisabled(true);
                //                Ext.getCmp('voidFinanceTransaction').setDisabled(false);
                //                Ext.getCmp('unpostFinanceTransaction').setDisabled(false);
                //                Ext.getCmp('adjustFinanceTransaction').setDisabled(false);
                //                if (isVoid) {
                //                    Ext.getCmp('voidFinanceTransaction').setDisabled(true);
                //                }

            } else {
                //                Ext.getCmp('postFinanceTransaction').setDisabled(false);
                //                Ext.getCmp('voidFinanceTransaction').setDisabled(true);
                //                Ext.getCmp('unpostFinanceTransaction').setDisabled(true);
                //                Ext.getCmp('adjustFinanceTransaction').setDisabled(true);
            }
        } else {
            //            Ext.getCmp('postFinanceTransaction').setDisabled(true);
            //            Ext.getCmp('voidFinanceTransaction').setDisabled(true);
            //            Ext.getCmp('unpostFinanceTransaction').setDisabled(true);
            //            Ext.getCmp('adjustFinanceTransaction').setDisabled(true);
        }
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
    onTransRefreshClick: function () {
        Ext.getCmp('TransRefNo').reset();
        Ext.getCmp('TransStartDate').reset();
        Ext.getCmp('TransEndDate').reset();
        onSearchTransactions();
    }
});
Ext.reg('FinanceTransactionHeader-grid', Ext.erp.CoreFin.ux.FinanceTransaction.HeaderGrid);
var onSearchTransactions = function () {
    var transGrid = Ext.getCmp('FinanceTransactionHeader-grid');
    var transStore = transGrid.getStore();
    var refNo = Ext.getCmp('TransRefNo').getValue();
    var startDt = Ext.getCmp('TransStartDate').getValue();
    var endDt = Ext.getCmp('TransEndDate').getValue();

    transStore.baseParams = { record: Ext.encode({ voucherType: '', project: '', periodId: '', isAuthorized: '', referenceNo: '', startDate: '', endDate: '', transactionStatus: 'unposted', mode: 'search' }) };

    transStore.load({
        params: { start: 0, limit: 30 }
    });
};

/**
* @desc      Voucher grid
* @author    Dawit Kiros
* @copyright (c) 2010, Cybersoft
* @date      November 01, 2010
* @namespace Ext.erp.CoreFin.ux.FinanceTransaction
* @class     Ext.erp.CoreFin.ux.FinanceTransaction.DetailGrid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.CoreFin.ux.FinanceTransaction.DetailGrid = function (config) {
    Ext.erp.CoreFin.ux.FinanceTransaction.DetailGrid.superclass.constructor.call(this, Ext.apply({
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
                beforeLoad: function () { Ext.getCmp('FinanceTransactionDetail-grid').body.mask('Loading...', 'x-mask-loading'); },
                load: function () {
                    var grid = Ext.getCmp('FinanceTransactionDetail-grid');
                    var store = grid.getStore();
                    grid.checkBalance(store, 'DebitAmount');
                    grid.checkBalance(store, 'CreditAmount');
                    grid.body.unmask();
                },
                loadException: function () { Ext.getCmp('FinanceTransactionDetail-grid').body.unmask(); },
                scope: this
            }
        }),
        id: 'FinanceTransactionDetail-grid',
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
Ext.extend(Ext.erp.CoreFin.ux.FinanceTransaction.DetailGrid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ voucherTypeId: this.voucherTypeId }) };
        this.bbar = [{
            xtype: 'tbfill'
        }, 'Debit Total: ', {
            xtype: 'currencyfield',
            id: 'txtFinanceTransactionDebitAmount',
            allowNegative: false,
            disabled: true,
            value: 0,
            currencySymbol: 'ETB',
            style: 'font-weight: bold;border: 1px solid black;'
        }, ' Credit Total: ', {
            xtype: 'currencyfield',
            id: 'txtFinanceTransactionCreditAmount',
            allowNegative: false,
            disabled: true,
            value: 0,
            currencySymbol: 'ETB',
            style: 'font-weight: bold;border: 1px solid black;'
        }];
        Ext.erp.CoreFin.ux.FinanceTransaction.DetailGrid.superclass.initComponent.apply(this, arguments);
    },
    checkBalance: function (store, field) {
        var total = 0;
        store.each(function (item) {
            total = total + item.data[field];
        });
        Ext.getCmp('txtFinanceTransaction' + field).setValue(total);
    }
});
Ext.reg('FinanceTransactionDetail-grid', Ext.erp.CoreFin.ux.FinanceTransaction.DetailGrid);

/**
* @desc      Voucher panel
* @author    Dawit Kiros
* @copyright (c) 2010, Cybersoft
* @date      November 01, 2010
* @version   $Id: Voucher.js, 0.1
* @namespace Ext.erp.CoreFin.ux.FinanceTransaction
* @class     Ext.erp.CoreFin.ux.FinanceTransaction.Panel
* @extends   Ext.Panel
*/
Ext.erp.CoreFin.ux.FinanceTransaction.Panel = function (config) {
    Ext.erp.CoreFin.ux.FinanceTransaction.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false
    }, config));
};
Ext.extend(Ext.erp.CoreFin.ux.FinanceTransaction.Panel, Ext.Panel, {
    initComponent: function () {
        this.headerGrid = new Ext.erp.CoreFin.ux.FinanceTransaction.HeaderGrid();
        this.detailGrid = new Ext.erp.CoreFin.ux.FinanceTransaction.DetailGrid();
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
                items: [this.headerGrid]
            }, {
                region: 'center',
                border: false,
                layout: 'fit',
                items: [this.detailGrid]
            }]
        }];
        Ext.erp.CoreFin.ux.FinanceTransaction.Panel.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('FinanceTransaction-panel', Ext.erp.CoreFin.ux.FinanceTransaction.Panel);