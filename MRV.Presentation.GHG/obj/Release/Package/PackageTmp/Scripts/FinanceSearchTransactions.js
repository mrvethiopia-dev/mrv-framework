Ext.ns('Ext.core.finance.ux.searchTransactions');
/**
* @desc     Search Transactions  form
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      October 08, 2013
* @namespace Ext.core.finance.ux.searchTransactions
* @class     Ext.core.finance.ux.searchTransactions.Form
* @extends   Ext.form.FormPanel
*/

Ext.core.finance.ux.searchTransactions.Form = function (config) {
    Ext.core.finance.ux.searchTransactions.Form.superclass.constructor.call(this, Ext.apply({
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:left;',
            msgTarget: 'side',
            bodyStyle: 'background:transparent;padding:5px'
        },
        id: 'searchTransactions-form',
        labelWidth: 115,
        height: 155,
        border: false,
        layout: 'form',
        bodyStyle: 'background:transparent;padding:5px',
        baseCls: 'x-plain',

        items: [{
            id: 'TransactionVoucherTypeId',
            xtype: 'combo',
            fieldLabel: 'Voucher Type',
            triggerAction: 'all',
            mode: 'local',
            editable: true,
            typeAhead: true,

            forceSelection: true,
            emptyText: '---Select---',
            allowBlank: true,
            store: new Ext.data.DirectStore({
                reader: new Ext.data.JsonReader({
                    successProperty: 'success',
                    idProperty: 'Id',
                    root: 'data',
                    fields: ['Id', 'Name']
                }),
                autoLoad: true,
                api: { read: window.Tsa.GetVoucherTypes }
            }),
            valueField: 'Id',
            displayField: 'Name'
        }, {
            id: 'TransactionRefNo',
            fieldLabel: 'Reference No',
            xtype: 'textfield',
            emptyText: 'Ref No',
            allowBlank: true,
            listeners: {

            }

        }, {
            id: 'TransactionPeriodId',
            xtype: 'combo',
            fieldLabel: 'Period',
            triggerAction: 'all',
            mode: 'local',
            editable: true,
            typeAhead: true,
            forceSelection: true,
            emptyText: '---Select---',
            allowBlank: true,
            store: new Ext.data.DirectStore({
                reader: new Ext.data.JsonReader({
                    successProperty: 'success',
                    idProperty: 'Id',
                    root: 'data',
                    fields: ['Id', 'Name']
                }),
                autoLoad: true,
                api: { read: window.Tsa.GetPeriods }
            }),
            valueField: 'Id',
            displayField: 'Name'
        }, {
            id: 'TransactionStartDate',
            xtype: 'datefield',
            fieldLabel: 'Start Date',
            anchor: '75%',
            emptyText: 'StartDate',
            allowBlank: true,
            listeners: {

            }

        }, {
            id: 'TransactionEndDate',
            xtype: 'datefield',
            fieldLabel: 'End Date',
            anchor: '75%',
            emptyText: 'EndDate',
            allowBlank: true,
            listeners: {

            }

        }, {
            id: 'TransactionIsAuthorized',
            xtype: 'checkbox',
            checked: false,
            fieldLabel: 'Authorized'
        }]
    }, config));
};
Ext.extend(Ext.core.finance.ux.searchTransactions.Form, Ext.form.FormPanel);
Ext.reg('searchTransactions-form', Ext.core.finance.ux.searchTransactions.Form);


/**
* @desc      searchTransactions window
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      October 08, 2013
* @namespace Ext.core.finance.ux.searchTransactions
* @class     Ext.core.finance.ux.searchTransactions.Window
* @extends   Ext.Window
*/

var callerGrid = '';
Ext.core.finance.ux.searchTransactions.Window = function (config) {
    Ext.core.finance.ux.searchTransactions.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        width: 350,
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;',
        listeners: {
            show: function () {

                this.CallerId = 1;
                callerGrid = this.CallerGrid;
            },
            scope: this
        }
    }, config));
}
Ext.extend(Ext.core.finance.ux.searchTransactions.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.core.finance.ux.searchTransactions.Form();
        this.items = [this.form];
        this.buttons = [{
            text: 'Search',
            iconCls: 'icon-filter',
            handler: this.onSearch,
            scope: this
        }, {
            text: 'Close',
            iconCls: 'icon-exit',
            handler: this.onClose,
            scope: this
        }];

        Ext.core.finance.ux.searchTransactions.Window.superclass.initComponent.call(this, arguments);
    },
    onSearch: function () {

        onFilterTransactions();

    },
    onClose: function () {
        this.close();
    }
});
Ext.reg('SearchTransactions-window', Ext.core.finance.ux.searchTransactions.Window);

var onFilterTransactions = function () {
    var transGrid = Ext.getCmp(callerGrid);
    var transStore = transGrid.getStore();
    var refNo = Ext.getCmp('TransactionRefNo').getValue();
    var startDt = Ext.getCmp('TransactionStartDate').getValue();
    var endDt = Ext.getCmp('TransactionEndDate').getValue();
    var vchrType = Ext.getCmp('TransactionVoucherTypeId').getValue();
    var prdId = Ext.getCmp('TransactionPeriodId').getValue();
    var isAuth = Ext.getCmp('TransactionIsAuthorized').getValue();

    if (callerGrid == 'FinanceTransactionHeader-grid') {
        transStore.baseParams = { record: Ext.encode({ voucherType: vchrType, project: '', periodId: prdId, isAuthorized: isAuth, referenceNo: refNo, startDate: startDt, endDate: endDt, transactionStatus: 'unposted', mode: 'search' }) };
    } else {
        transStore.baseParams = { record: Ext.encode({ voucherType: vchrType, project: '', periodId: prdId, isAuthorized: true, referenceNo: refNo, startDate: startDt, endDate: endDt, transactionStatus: 'posted', mode: 'search' }) };
    }
    transStore.load({
        params: { start: 0, limit: 30 }
    });
};
