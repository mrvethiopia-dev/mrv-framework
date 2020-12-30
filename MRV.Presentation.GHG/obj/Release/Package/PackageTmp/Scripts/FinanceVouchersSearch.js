Ext.ns('Ext.core.finance.ux.FinanceVouchersSearch');
/**
* @desc      Workshops registration form
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.FinanceVouchersSearch
* @class     Ext.core.finance.ux.FinanceVouchersSearch.Form
* @extends   Ext.form.FormPanel
*/

var CallerId = '';
Ext.core.finance.ux.FinanceVouchersSearch.Form = function (config) {
    Ext.core.finance.ux.FinanceVouchersSearch.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: PayrollItems.Get,
            submit: PayrollItems.Save
        },
        paramOrder: ['Id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'FinanceVouchersSearch-form',
        padding: 5,
        labelWidth: 150,
        autoHeight: true,
        border: false,
        baseCls: 'x-plain',
        items: [{
            id: 'FromDate',
            xtype: 'datefield',
            fieldLabel: 'From Date',
            allowBlank: true,
            listeners: {
                specialkey: function (field, e) {
                    if (e.getKey() == e.ENTER) {
                        onSearchHit();
                    }
                }
            }

        }, {
            id: 'ToDate',
            xtype: 'datefield',
            fieldLabel: 'To Date',
            allowBlank: true,
            listeners: {
                specialkey: function (field, e) {
                    if (e.getKey() == e.ENTER) {
                        onSearchHit();
                    }
                }
            }

        }, {
            id: 'ReferenceNo',
            xtype: 'textfield',
            anchor: '95%',
            fieldLabel: 'Reference No',
            allowBlank: true,
            listeners: {
                specialkey: function (field, e) {
                    if (e.getKey() == e.ENTER) {
                        onSearchHit();
                    }
                }
            }

        }, {
            id: 'PostStatus',
            xtype: 'combo',
            fieldLabel: 'Post Status',
            triggerAction: 'all',
            anchor:'75%',
            mode: 'local',
            editable: true,
            forceSelection: false,
            allowBlank: true,
            store: new Ext.data.ArrayStore({
                fields: ['Id', 'Name'],
                data: [[1, 'Posted'], [2, 'Unposted']]
            }),
            valueField: 'Id',
            displayField: 'Name'

        }, {
            id: 'CheckStatus',
            xtype: 'combo',
            fieldLabel: 'Check Status',
            triggerAction: 'all',
            anchor: '75%',
            mode: 'local',
            editable: true,
            forceSelection: false,
            allowBlank: true,
            store: new Ext.data.ArrayStore({
                fields: ['Id', 'Name'],
                data: [[1, 'Checked'], [2, 'Uncheked']]
            }),
            valueField: 'Id',
            displayField: 'Name'

        }, {
            id: 'ApproveStatus',
            xtype: 'combo',
            fieldLabel: 'Approved Status',
            triggerAction: 'all',
            anchor: '75%',
            mode: 'local',
            editable: true,
            forceSelection: false,
            allowBlank: true,
            store: new Ext.data.ArrayStore({
                fields: ['Id', 'Name'],
                data: [[1, 'Approved'], [2, 'Not Approved']]
            }),
            valueField: 'Id',
            displayField: 'Name'

        }, {
            id: 'AuthorizeStatus',
            xtype: 'combo',
            fieldLabel: 'Authorized Status',
            triggerAction: 'all',
            anchor: '75%',
            mode: 'local',
            editable: true,
            forceSelection: false,
            allowBlank: true,
            store: new Ext.data.ArrayStore({
                fields: ['Id', 'Name'],
                data: [[1, 'Authorized'], [2, 'Not Authorized']]
            }),
            valueField: 'Id',
            displayField: 'Name'

        }]
    }, config));
}
Ext.extend(Ext.core.finance.ux.FinanceVouchersSearch.Form, Ext.form.FormPanel);
Ext.reg('FinanceVouchersSearch-form', Ext.core.finance.ux.FinanceVouchersSearch.Form);

/**
* @desc      Workshops registration form host window
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.FinanceVouchersSearch
* @class     Ext.core.finance.ux.FinanceVouchersSearch.Window
* @extends   Ext.Window
*/
Ext.core.finance.ux.FinanceVouchersSearch.Window = function (config) {
    Ext.core.finance.ux.FinanceVouchersSearch.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        width: 400,
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;',
        listeners: {
            show: function () {
                CallerId = this.caller;
            },
            scope: this
        }
    }, config));
}
Ext.extend(Ext.core.finance.ux.FinanceVouchersSearch.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.core.finance.ux.FinanceVouchersSearch.Form();
        this.items = [this.form];
        this.buttons = [{
            text: 'Search',
            iconCls: 'icon-filter',
            handler: this.onSearch,
            scope: this
        }, {
            text: 'Reset',
            iconCls: 'icon-Reset',
            handler: this.onReset,
            scope: this
        }, {
            text: 'Close',
            iconCls: 'icon-exit',
            handler: this.onClose,
            scope: this
        }];

        Ext.core.finance.ux.FinanceVouchersSearch.Window.superclass.initComponent.call(this, arguments);
    },
    onSearch: function () {
        onSearchHit();
    },
    onReset : function() {
        var form = Ext.getCmp('FinanceVouchersSearch-form').getForm();
        form.reset();
    },
    onClose: function () {
        this.close();
    }
});
Ext.reg('FinanceVouchersSearch-window', Ext.core.finance.ux.FinanceVouchersSearch.Window);
var onSearchHit = function () {
    var jvGrid;

    if (CallerId == "JV") {
        jvGrid = Ext.getCmp('FinanceVouchersJVRMain-grid');
    }
    if (CallerId == "DV") {
        jvGrid = Ext.getCmp('FinanceVouchersDVMain-grid');
    }
    if (CallerId == "CRV") {
        jvGrid = Ext.getCmp('FinanceVouchersCRVMain-grid');
    }

    var jvStore = jvGrid.getStore();
    var referenceNo = Ext.getCmp('ReferenceNo').getValue();
    var srchBy = '';
    var startDate = Ext.getCmp('FromDate').getValue();
    var endDate = Ext.getCmp('ToDate').getValue();

    var posted = Ext.getCmp('PostStatus').getValue();
    var checked = Ext.getCmp('CheckStatus').getValue();
    var approved = Ext.getCmp('ApproveStatus').getValue();
    var authorized = Ext.getCmp('AuthorizeStatus').getValue();

    jvStore.baseParams = { record: Ext.encode({ SearchText: referenceNo, SearchBy: 'Date', FromDate: startDate, ToDate: endDate, mode: 'search',
        PostStatus: posted, CheckStatus: checked, ApproveStatus: approved, AuthorizeStatus: authorized
    }), vType: CallerId
    };

    jvStore.load({
        params: { start: 0, limit: 100 }
    });
};
