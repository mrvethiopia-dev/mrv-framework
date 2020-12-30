Ext.ns('Ext.core.finance.ux.voucherSearch');
Ext.core.finance.ux.voucherSearch.Observable = new Ext.util.Observable();
Ext.core.finance.ux.voucherSearch.Observable.addEvents('searchvoucher');

/**
* @desc      VoucherSearch form
* @author    Dawit Kiros
* @copyright (c) 2010, Cybersoft
* @date      November 01, 2010
* @namespace Ext.core.finance.ux.voucherSearch
* @class     Ext.core.finance.ux.voucherSearch.Form
* @extends   Ext.form.FormPanel
*/

Ext.apply(Ext.form.VTypes, {
    daterange: function (val, field) {
        var date = field.parseDate(val);
        if (!date) {
            return false;
        }
        if (field.startDateField && (!this.dateRangeMax || (date.getTime() != this.dateRangeMax.getTime()))) {
            var start = Ext.getCmp(field.startDateField);
            start.setMaxValue(date);
            this.dateRangeMax = date;
        }
        else if (field.endDateField && (!this.dateRangeMin || (date.getTime() != this.dateRangeMin.getTime()))) {
            var end = Ext.getCmp(field.endDateField);
            end.setMinValue(date);
            this.dateRangeMin = date;
        }
        return true;
    }
});

Ext.core.finance.ux.voucherSearch.Form = function (config) {
    Ext.core.finance.ux.voucherSearch.Form.superclass.constructor.call(this, Ext.apply({
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'voucherSearch-form',
        padding: 5,
        labelWidth: 150,
        autoHeight: true,
        border: false,
        baseCls: 'x-plain',
        items: [{
            hiddenName: 'VoucherTypeId',
            xtype: 'combo',
            fieldLabel: 'Voucher Type',
            triggerAction: 'all',
            mode: 'local',
            editable: true,
            forceSelection: true,
            emptyText: '---Select---',
            store: new Ext.data.DirectStore({
                reader: new Ext.data.JsonReader({
                    successProperty: 'success',
                    idProperty: 'Id',
                    root: 'data',
                    fields: ['Id', 'Name']
                }),
                autoLoad: true,
                api: { read: window.Ifms.GetVoucherTypes }
            }),
            valueField: 'Id',
            displayField: 'Name'
        }, {
            hiddenName: 'ProjectId',
            xtype: 'combo',
            fieldLabel: 'Project',
            triggerAction: 'all',
            mode: 'local',
            editable: false,
            forceSelection: true,
            emptyText: '---Select---',
            allowBlank: false,
            store: new Ext.data.DirectStore({
                reader: new Ext.data.JsonReader({
                    successProperty: 'success',
                    idProperty: 'Id',
                    root: 'data',
                    fields: ['Id', 'Code']
                }),
                autoLoad: true,
                api: { read: window.Ifms.GetAllProjects }
            }),
            valueField: 'Id',
            displayField: 'Code'
        }, {
            name: 'ReferenceNo',
            xtype: 'textfield',
            fieldLabel: 'Reference No'
        }, {
            id: 'StartDate',
            name: 'StartDate',
            xtype: 'datefield',
            fieldLabel: 'Start Date',
            altFormats: 'c',
            editable: true,
            vtype: 'daterange',
            endDateField: 'EndDate',
            showToday: false
        }, {
            id: 'EndDate',
            name: 'EndDate',
            xtype: 'datefield',
            fieldLabel: 'End Date',
            altFormats: 'c',
            editable: true,
            vtype: 'daterange',
            startDateField: 'StartDate',
            showToday: false
        }]
    }, config));
};
Ext.extend(Ext.core.finance.ux.voucherSearch.Form, Ext.form.FormPanel);
Ext.reg('voucherSearch-form', Ext.core.finance.ux.voucherSearch.Form);

/**
* @desc      VoucherSearch form host window
* @author    Dawit Kiros
* @copyright (c) 2010, Cybersoft
* @date      November 01, 2010
* @namespace Ext.core.finance.ux.voucherSearch
* @class     Ext.core.finance.ux.voucherSearch.Window
* @extends   Ext.Window
*/
Ext.core.finance.ux.voucherSearch.Window = function (config) {
    Ext.core.finance.ux.voucherSearch.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        width: 400,
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;'
    }, config));
};
Ext.extend(Ext.core.finance.ux.voucherSearch.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.core.finance.ux.voucherSearch.Form();
        /*if (this.source == 'voucher') {
            this.form.getForm().findField('TransactionStatus').hide();
        }*/
        this.items = [this.form];
        this.bbar = [{
            xtype: 'tbfill'
        }, {
            text: 'Filter',
            iconCls: 'icon-filter',
            handler: this.onFilter,
            scope: this
        }, {
            xtype: 'tbseparator'
        }, {
            text: 'Close',
            iconCls: 'icon-exit',
            handler: this.onClose,
            scope: this
        }];
        var searchForm = this.form;
        this.tools = [{
            id: 'refresh',
            qtip: 'Reset',
            handler: function () {
                searchForm.getForm().reset();
            },
            scope: this
        }];
        Ext.core.finance.ux.voucherSearch.Window.superclass.initComponent.call(this, arguments);
    },
    onFilter: function () {
        var form = Ext.getCmp('voucherSearch-form').getForm();
        var result = {};
        result['voucherType'] = form.findField('VoucherTypeId').getValue();
        result['project'] = form.findField('ProjectId').getValue();
        result['referenceNo'] = form.findField('ReferenceNo').getValue();
        result['startDate'] = form.findField('StartDate').getValue();
        result['endDate'] = form.findField('EndDate').getValue();
        //result['transactionStatus'] = form.findField('TransactionStatus').getValue();
        Ext.core.finance.ux.voucherSearch.Observable.fireEvent('searchvoucher', result);
    },
    onClose: function () {
        this.close();
    }
});
Ext.reg('voucherSearch-window', Ext.core.finance.ux.voucherSearch.Window);