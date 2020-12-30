Ext.ns('Ext.core.finance.ux.voucher');
/**
* @desc      VoucherHeader registration form
* @author    Dawit Kiros
* @copyright (c) 2010, Cybersoft
* @date      November 01, 2010
* @namespace Ext.core.finance.ux.voucher
* @class     Ext.core.finance.ux.voucher.Form
* @extends   Ext.form.FormPanel
*/
Ext.core.finance.ux.voucher.Form = function (config) {
    Ext.core.finance.ux.voucher.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: window.FinanceVoucher.Get,
            submit: window.FinanceVoucher.Save
        },
        paramOrder: ['id'],
        defaults: {
            anchor: '90%',
            msgTarget: 'side',
            labelStyle: 'text-align:right;'
        },
        id: 'voucher-form',
        padding: 5,
        labelWidth: 150,
        autoHeight: true,
        border: false,
        width: 840,
        height: 330,
        baseCls: 'x-plain',
        items: [{
            name: 'Id',
            xtype: 'hidden'
        }, {
            name: 'Date',
            xtype: 'datefield',
            fieldLabel: 'Date',
            altFormats: 'c',
            editable: true,
            anchor: '55%',
            allowBlank: false
        }, {
            name: 'ReferenceNo',
            xtype: 'textfield',
            fieldLabel: 'Reference No',
            allowBlank: false,
            anchor: '55%',
            disabled: false,
            readOnly: false
        }, {
            name: 'DefaultAccountId',
            xtype: 'hidden'
        }, {
            xtype: 'compositefield',
            fieldLabel: 'Default Account',
            anchor: '55%',
            id: 'voucher-defaultAccount',
            hidden:true,
            defaults: {
                flex: 1
            },
            items: [{
                hiddenName: 'DefaultAccount',
                xtype: 'combo',
                fieldLabel: 'Default Account',
                typeAhead: true,
                hideTrigger: true,
                minChars: 2,
                listWidth: 280,
                mode: 'remote',
                tpl: '<tpl for="."><div ext:qtip="{Name}" class="x-combo-list-item">' +
                     '<h3><span>{Account}</span></h3> {Name}</div></tpl>',
                store: new Ext.data.DirectStore({
                    reader: new Ext.data.JsonReader({
                        successProperty: 'success',
                        idProperty: 'Id',
                        totalProperty: 'total',
                        root: 'data',
                        fields: ['Id', 'ControlAccountId', 'Account', 'Name', 'RunningBalance']
                    }),
                    api: { read: Tsa.GetFinAccounts }
                }),
                valueField: 'Id',
                displayField: 'Account',
                pageSize: 10,
                listeners: {
                    select: function (cmb, rec, idx) {
                        var form = Ext.getCmp('voucher-form').getForm();
                        form.findField('DefaultAccountId').setValue(rec.id);
                        if (rec.data.RunningBalance == -1 || rec.data.RunningBalance == '') {
                            Ext.getCmp('voucherForm-runningBalance').setText('');
                        }
                        else {
                            Ext.getCmp('voucherForm-runningBalance').setText(Ext.util.Format.number(rec.data.RunningBalance, '0,000.00 '));
                        }
                    }
                }
            }, {
                text: '',
                id: 'voucherForm-runningBalance',
                xtype: 'label',
                width: 120,
                style: 'text-align: right;padding: 3px 3px 3px 0;'
            }]
        }, {
            name: 'CashierId',
            xtype: 'hidden'
        }, {
            hiddenName: 'Cashier',
            xtype: 'combo',
            fieldLabel: 'Cashier',
            typeAhead: true,
            hideTrigger: true,
            minChars: 2,
            listWidth: 280,
            anchor: '55%',
            hidden: true,
            mode: 'remote',
            tpl: '<tpl for="."><div ext:qtip="{Name}" class="x-combo-list-item">' +
                     '<h3><span>{IdentityNumber}</span></h3> {FullName}</div></tpl>',
            store: new Ext.data.DirectStore({
                reader: new Ext.data.JsonReader({
                    successProperty: 'success',
                    idProperty: 'Id',
                    totalProperty: 'total',
                    root: 'data',
                    fields: ['Id', 'IdentityNumber', 'FullName']
                }),
                api: { read: Tsa.GetEmployees }
            }),
            valueField: 'Id',
            displayField: 'IdentityNumber',
            pageSize: 10,
            listeners: {
                select: function (cmb, rec, idx) {
                    var form = Ext.getCmp('voucher-form').getForm();
                    form.findField('CashierId').setValue(rec.id);
                }
            }
        }, {
            name: 'Purpose',
            xtype: 'textfield',
            fieldLabel: 'Purpose',
            anchor: '70%',
            allowBlank: true
        }, {
            name: 'Amount',
            xtype: 'numberfield',
            fieldLabel: 'Amount',
            allowBlank: true,
            anchor: '55%',
            hidden: true,
            listeners: {
                specialkey: {
                    fn: this.onSpecialKey,
                    scope: this
                }
            }
        }, {
            name: 'PayedToReceivedFrom',
            xtype: 'textfield',
            fieldLabel: 'Received From',
            anchor: '55%',
            allowBlank: true,
            hidden: true
        }, {
            hiddenName: 'ModeOfPaymentId',
            xtype: 'combo',
            fieldLabel: 'Mode of Payment',
            triggerAction: 'all',
            mode: 'local',
            editable: false,
            forceSelection: true,
            emptyText: '---Select---',
            allowBlank: true,
            anchor: '55%',
            hidden: true,
            store: new Ext.data.DirectStore({
                reader: new Ext.data.JsonReader({
                    successProperty: 'success',
                    idProperty: 'Id',
                    root: 'data',
                    fields: ['Id', 'Name']
                }),
                autoLoad: true,
                api: { read: window.Tsa.GetModeOfPayments }
            }),
            valueField: 'Id',
            displayField: 'Name',
            listeners: {
                select: function () {
                    var form = Ext.getCmp('voucher-form').getForm();
                    var chequeNo = form.findField('ChequeNo');
                    switch (this.getRawValue()) {
                        case 'Cheque':
                            chequeNo.show();
                            break;
                        case 'Cash':
                            chequeNo.reset();
                            chequeNo.hide();
                            break;
                        default:
                            chequeNo.hide();
                            break;
                    }
                }
            }
        }, {
            name: 'ChequeNo',
            xtype: 'textfield',
            fieldLabel: 'Cheque Number',
            allowBlank: true,
            anchor: '55%',
            hidden: true
        }, {
            name: 'CreatedAt',
            xtype: 'hidden'
        }]
    }, config));
};
Ext.extend(Ext.core.finance.ux.voucher.Form, Ext.form.FormPanel, {
    onSpecialKey: function (textField, eventObject) {
        var keyCode = eventObject.getKey();
        var eO = Ext.EventObject;
        if (keyCode != eO.ENTER && keyCode != eO.RETURN) {
            return;
        }
    }
});
Ext.reg('voucher-form', Ext.core.finance.ux.voucher.Form);

/**
* @desc      Voucher grid
* @author    Dawit Kiros
* @copyright (c) 2010, Cybersoft
* @date      November 01, 2010
* @namespace Ext.core.finance.ux.voucher
* @class     Ext.core.finance.ux.voucher.HeaderGrid
* @extends   Ext.grid.GridPanel
*/
Ext.core.finance.ux.voucher.HeaderGrid = function (config) {
    Ext.core.finance.ux.voucher.HeaderGrid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: window.FinanceVoucher.GetAllHeaders,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Code',
                direction: 'ASC'
            },
            fields: ['Id', 'VoucherPrefix', 'VoucherType', 'ReferenceNo', 'Date', 'PayedToReceivedFrom', 'Purpose', 'Amount', 'ModeOfPayment', 'ChequeNo'],
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
        id: 'voucherHeader-grid',
        searchCriteria: {},
        pageSize: 20,
        height: 300,
        stripeRows: true,
        border: false,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        viewConfig: {
            
        },
        listeners: {
            rowClick: function () {
                this.loadVoucherHeader();
                this.loadVoucherDetail();
            },
            scope: this
        },
        columns: [{
            dataIndex: 'Id',
            header: 'Id',
            sortable: true,
            hidden: true,
            width: 100,
            menuDisabled: true
        }, new Ext.grid.RowNumberer(), {
            dataIndex: 'VoucherPrefix',
            header: 'Voucher Prefix',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'VoucherType',
            header: 'Voucher Type',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'ReferenceNo',
            header: 'Reference No',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'Date',
            header: 'Date',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'ModeOfPayment',
            header: 'Mode of Payment',
            sortable: true,
            hidden: true,
            width: 100,
            menuDisabled: true
        }]
    }, config));
};
Ext.extend(Ext.core.finance.ux.voucher.HeaderGrid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ mode: 'get' }) };
        this.tbar = [{
            xtype: 'button',
            text: 'Preview',
            id: 'previewVoucher',
            iconCls: 'icon-preview',
            handler: this.onPreview
        }, {
            xtype: 'tbfill'
        }, {
            id: 'searchVoucher',
            text: 'Search',
            hidden: true,
            iconCls: 'icon-filter',
            handler: this.onSearchVoucher
        }];
        this.bbar = new Ext.PagingToolbar({
            id: 'voucherHeader-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.core.finance.ux.voucher.HeaderGrid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getStore().load({
            params: { start: 0, limit: this.pageSize }
        });
        Ext.core.finance.ux.voucher.HeaderGrid.superclass.afterRender.apply(this, arguments);
    },
    onPreview: function () {
        var grid = Ext.getCmp('voucherHeader-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var voucherHeaderId = grid.getSelectionModel().getSelected().get('Id');
        var voucherType = grid.getSelectionModel().getSelected().get('VoucherType');
        var windowParameter = null;
        var reportType = 'Voucher';
        windowParameter = 'width=900,height=700,toolbar=yes,location=yes,directories=yes,status=yes,menubar=yes,scrollbars=yes,copyhistory=yes,resizable=yes';
        window.open('Reports/ErpReportViewer.aspx?rt=' + reportType + '&id=' + voucherHeaderId + '&vt=' + voucherType, '', windowParameter);
    },
    onSearchVoucher: function () {
        Ext.core.finance.ux.voucherSearch.Observable.on('searchvoucher', function (result) {
            result['mode'] = 'search';
            var grid = Ext.getCmp('voucherHeader-grid');
            grid.searchCriteria = result;
            grid.store.baseParams = { record: Ext.encode(result) };
            grid.store.load({ params: { start: 0, limit: grid.pageSize} });
        }, this);
        new Ext.core.finance.ux.voucherSearch.Window({ title: 'Search Vouchers' }).show();
    },
    loadVoucherHeader: function () {
        if (!this.getSelectionModel().hasSelection()) return;
        var id = this.getSelectionModel().getSelected().get('Id');
        var form = Ext.getCmp('voucher-form');
        var modeOfPayment = form.getForm().findField('ModeOfPaymentId');
        var chequeNo = form.getForm().findField('ChequeNo');
        var voucherType = form.getForm().findField('VoucherTypeId');
        var paidToReceivedFrom = form.getForm().findField('PayedToReceivedFrom');
        var amount = form.getForm().findField('Amount');
        var cashier = form.getForm().findField('Cashier');
        var defaultAccount = Ext.getCmp('voucher-defaultAccount');
        if (id != '') {
            form.load({
                params: { id: id },
                success: function (form, action) {
                    paidToReceivedFrom.setVisible(voucherType.getRawValue() != 'JV');
                    modeOfPayment.setVisible(voucherType.getRawValue() != 'JV');
                    amount.setVisible(voucherType.getRawValue() != 'JV');
                    chequeNo.setVisible(modeOfPayment.getRawValue() == 'Cheque');
                    cashier.setVisible(voucherType.getRawValue() == 'PCPV');
                    defaultAccount.setVisible(voucherType.getRawValue() != 'JV');

                    var runningBalance = action.result.data.RunningBalance;
                    if (runningBalance == -1 || runningBalance == '') {
                        Ext.getCmp('voucherForm-runningBalance').setText('');
                    }
                    else {
                        Ext.getCmp('voucherForm-runningBalance').setText(Ext.util.Format.number(action.result.data.RunningBalance, '0,000.00 '));
                    }

                    Ext.getCmp('voucherDetail-grid').addRow();
                }
            });
        }
    },
    loadVoucherDetail: function () {
        var voucherDetailGrid = Ext.getCmp('voucherDetail-grid');
        var voucherDetailStore = voucherDetailGrid.getStore();
        var voucherHeaderId = 0;
        if (this.getSelectionModel().hasSelection()) {
            voucherHeaderId = this.getSelectionModel().getSelected().get('Id');
        }
        voucherDetailStore.baseParams = { record: Ext.encode({ voucherHeaderId: voucherHeaderId }) };
        voucherDetailStore.load({
            params: { start: 0, limit: 100 }
        });
    }
});
Ext.reg('voucherHeader-grid', Ext.core.finance.ux.voucher.HeaderGrid);


/**
* @desc      Voucher grid
* @author    Dawit Kiros
* @copyright (c) 2010, Cybersoft
* @date      November 01, 2010
* @namespace Ext.core.finance.ux.voucher
* @class     Ext.core.finance.ux.voucher.DetailGrid
* @extends   Ext.grid.GridPanel
*/
Ext.core.finance.ux.voucher.DetailGrid = function (config) {
    Ext.core.finance.ux.voucher.DetailGrid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: window.FinanceVoucher.GetAllDetails,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Code',
                direction: 'ASC'
            },
            fields: ['Id', 'BudgetAgreementId', 'Location', 'Sector', 'BudgetItem', 'ControlAccountId', 'AccountId', 'AccountCode', 'AccountName', 'DebitAmount', 'CreditAmount', 'BusinessPartnerCode', 'StaffCode'],
            remoteSort: true,
            listeners: {
                beforeLoad: function () {
                    Ext.getCmp('voucherDetail-grid').body.mask('Loading...', 'x-mask-loading');
                },
                load: function () {
                    var grid = Ext.getCmp('voucherDetail-grid');
                    var store = grid.getStore();
                    grid.checkBalance(store, 'DebitAmount');
                    grid.checkBalance(store, 'CreditAmount');
                    grid.body.unmask();
                },
                loadException: function () {
                    Ext.getCmp('voucherDetail-grid').body.unmask();
                },
                remove: function (store) {
                    var grid = Ext.getCmp('voucherDetail-grid');
                    grid.checkBalance(store, 'DebitAmount');
                    grid.checkBalance(store, 'CreditAmount');
                },
                scope: this
            }
        }),
        id: 'voucherDetail-grid',
        selectedVoucherTypeId: 0,
        pageSize: 10,
        stripeRows: true,
        columnLines: true,
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
                        if (!newCell) { g.addRow(); }
                    }
                }
                if (newCell) {
                    g.startEditing(newCell[0], newCell[1]);
                }
            }
        }),
        listeners: {
            afteredit: function (e) {
                var record = e.record;
                var grid = Ext.getCmp('voucherDetail-grid');
                var store, cm;
                if (e.field == 'AccountCode') {
                    cm = grid.getColumnModel();
                    var accountCol = cm.getColumnAt(5);
                    var editor = accountCol.editor;
                    store = editor.store;
                    if (store.data.length == 0) {
                        record.set('AccountCode', e.originalValue);
                    }
                    else {
                        var controlAccountId = store.getById(editor.getValue()).data.ControlAccountId;
                        var accountId = store.getById(editor.getValue()).data.Id;
                        var accountName = store.getById(editor.getValue()).data.Name;
                        record.set('ControlAccountId', controlAccountId);
                        record.set('AccountId', accountId);
                        record.set('AccountName', accountName);
                    }
                } else if (e.field == 'BudgetItem') {
                    cm = grid.getColumnModel();
                    var budgetItemCol = cm.getColumnAt(4);
                    var editor = budgetItemCol.editor;
                    store = editor.store;
                    if (store.data.length == 0) {
                        record.set('BudgetItem', e.originalValue);
                    }
                    else {
                        var form = Ext.getCmp('voucher-form').getForm();
                        var projectId = form.findField('ProjectId').getValue();
                        var locationId = record.get('Location') == null ? '' : record.get('Location');
                        var sectorId = record.get('Sector') == null ? '' : record.get('Sector');
                        var budgetItemId = record.get('BudgetItem') == null ? '' : record.get('BudgetItem');
                        if (projectId == '' || locationId == '' || sectorId == '' || budgetItemId == '') {
                            record.set('BudgetItem', e.originalValue);
                            Ext.MessageBox.show({
                                title: 'Error',
                                msg: 'Project, Location, Sector and Budget Item can not be empty',
                                buttons: Ext.Msg.OK,
                                icon: Ext.MessageBox.ERROR,
                                scope: this
                            });
                            return;
                        }
                        Tsa.IsApprovedBudget(projectId, locationId, sectorId, budgetItemId, function (result, response) {
                            if (response.result.success) {
                                var controlAccountId = store.getById(editor.getValue()).data.ControlAccountId;
                                var accountId = store.getById(editor.getValue()).data.AccountId;
                                var accountCode = store.getById(editor.getValue()).data.AccountCode;
                                var accountName = store.getById(editor.getValue()).data.AccountName;
                                record.set('ControlAccountId', controlAccountId);
                                record.set('AccountId', accountId);
                                record.set('AccountCode', accountCode);
                                record.set('AccountName', accountName);
                                record.set('BudgetAgreementId', response.result.data.BudgetAgreementId);
                            }
                            else {
                                record.set('BudgetItem', e.originalValue);
                                Ext.MessageBox.show({
                                    title: 'Error',
                                    msg: response.result.data,
                                    buttons: Ext.Msg.OK,
                                    icon: Ext.MessageBox.ERROR,
                                    scope: this
                                });
                            }
                        }, this);


                    }
                } else if (e.field == 'BusinessPartnerCode') {
                    cm = grid.getColumnModel();
                    var businessPartnerCol = cm.getColumnAt(9);
                    var editor = businessPartnerCol.editor;
                    store = editor.store;
                    if (record.get('BusinessPartnerCode') == null || record.get('BusinessPartnerCode') == "") {
                        record.set('BusinessPartnerCode', "");
                    }
                    else if ((store.data.length == 0) || (record.get('StaffCode') != null && record.get('StaffCode') != "")) {
                        record.set('BusinessPartnerCode', e.originalValue);
                    }
                } else if (e.field == 'StaffCode') {
                    cm = grid.getColumnModel();
                    var staffCol = cm.getColumnAt(10);
                    var editor = staffCol.editor;
                    store = editor.store;
                    if (record.get('StaffCode') == null || record.get('StaffCode') == "") {
                        record.set('StaffCode', "");
                    }
                    else if ((store.data.length == 0) || (record.get('BusinessPartnerCode') != null && record.get('BusinessPartnerCode') != "")) {
                        record.set('StaffCode', e.originalValue);
                    }
                }
                else {
                    if (e.field == 'DebitAmount') {
                        if (record.get('CreditAmount') > 0) {
                            record.set('DebitAmount', e.originalValue);
                        } else {
                            var form = Ext.getCmp('voucher-form').getForm();
                           
                            var locationId = record.get('Location') == null ? '' : record.get('Location');
                            var sectorId = record.get('Sector') == null ? '' : record.get('Sector');
                            var budgetItemId = record.get('BudgetItem') == null ? '' : record.get('BudgetItem');
                           
                            store = grid.getStore();
                            grid.checkBalance(store, 'DebitAmount');
                            grid.checkBalance(store, 'CreditAmount');
                        }
                    } else if (e.field == 'CreditAmount') {
                        if (record.get('DebitAmount') > 0) {
                            record.set('CreditAmount', e.originalValue);
                        } else {
                            store = grid.getStore();
                            grid.checkBalance(store, 'DebitAmount');
                            grid.checkBalance(store, 'CreditAmount');
                        }
                    }
                }
            }
        },
        columns: [{
            dataIndex: 'Id',
            header: 'Id',
            sortable: false,
            hidden: true,
            width: 100,
            menuDisabled: true
        }, new Ext.grid.RowNumberer(), {
            dataIndex: 'Location',
            header: 'Location',
            sortable: true,
            width: 100,
            menuDisabled: true,
            xtype: 'combocolumn',
            editor: new Ext.form.ComboBox({
                hiddenName: 'LocationId',
                typeAhead: true,
                triggerAction: 'all',
                mode: 'local',
                store: new Ext.data.DirectStore({
                    reader: new Ext.data.JsonReader({
                        successProperty: 'success',
                        idProperty: 'Id',
                        root: 'data',
                        fields: ['Id', 'Name', 'Code']
                    }),
                    autoLoad: true,
                    api: { read: window.Tsa.GetLocations }
                }),
                valueField: 'Id',
                displayField: 'Code'
            })
        }, {
            dataIndex: 'Sector',
            header: 'Sector',
            sortable: true,
            width: 100,
            menuDisabled: true,
            xtype: 'combocolumn',
            editor: new Ext.form.ComboBox({
                hiddenName: 'SectorId',
                typeAhead: true,
                triggerAction: 'all',
                mode: 'local',
                store: new Ext.data.DirectStore({
                    reader: new Ext.data.JsonReader({
                        successProperty: 'success',
                        idProperty: 'Id',
                        root: 'data',
                        fields: ['Id', 'Name', 'Code']
                    }),
                    autoLoad: true,
                    api: { read: window.Tsa.GetSectors }
                }),
                valueField: 'Id',
                displayField: 'Code'
            })
        }, {
            dataIndex: 'BudgetItem',
            header: 'Budget Item',
            sortable: true,
            width: 100,
            menuDisabled: true,
            xtype: 'combocolumn',
            editor: new Ext.form.ComboBox({
                hiddenName: 'SectorId',
                typeAhead: true,
                triggerAction: 'all',
                mode: 'local',
                store: new Ext.data.DirectStore({
                    reader: new Ext.data.JsonReader({
                        successProperty: 'success',
                        idProperty: 'Id',
                        root: 'data',
                        fields: ['Id', 'BudgetCode', 'AccountId', 'AccountCode', 'AccountName', 'ControlAccountId']
                    }),
                    autoLoad: true,
                    api: { read: window.Tsa.GetBudgetItems }
                }),
                valueField: 'Id',
                displayField: 'BudgetCode'
            })
        }, {
            dataIndex: 'AccountCode',
            header: 'Account Code',
            sortable: true,
            width: 100,
            menuDisabled: true,
            xtype: 'combocolumn',
            editor: new Ext.form.ComboBox({
                hiddenName: 'SubsidiaryAccountId',
                typeAhead: true,
                hideTrigger: true,
                minChars: 2,
                listWidth: 280,
                mode: 'remote',
                tpl: '<tpl for="."><div ext:qtip="{Id}. {Name}" class="x-combo-list-item">' +
                     '<h3><span>{Account}</span></h3> {Name}</div></tpl>',
                store: new Ext.data.DirectStore({
                    reader: new Ext.data.JsonReader({
                        successProperty: 'success',
                        idProperty: 'Id',
                        totalProperty: 'total',
                        root: 'data',
                        fields: ['Id', 'ControlAccountId', 'Account', 'Name', 'RunningBalance']
                    }),
                    api: { read: Tsa.GetFinAccounts }
                }),
                valueField: 'Id',
                displayField: 'Account',
                pageSize: 10
            })
        }, {
            dataIndex: 'AccountName',
            header: 'Account Name',
            sortable: true,
            width: 200,
            menuDisabled: true
        }, {
            dataIndex: 'DebitAmount',
            header: 'Debit Amount',
            sortable: true,
            width: 120,
            menuDisabled: true,
            align: 'right',
            renderer: function (value) {
                return Ext.util.Format.number(value, '0,000.00 ');
            },
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
            dataIndex: 'CreditAmount',
            header: 'Credit Amount',
            sortable: true,
            width: 120,
            menuDisabled: true,
            align: 'right',
            renderer: function (value) {
                return Ext.util.Format.number(value, '0,000.00 ');
            },
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
            dataIndex: 'BusinessPartnerCode',
            header: 'BP Code',
            sortable: true,
            width: 100,
            menuDisabled: true,
            xtype: 'combocolumn',
            editor: new Ext.form.ComboBox({
                hiddenName: 'BusinessPartnerId',
                typeAhead: false,
                hideTrigger: true,
                minChars: 2,
                listWidth: 280,
                mode: 'remote',
                itemSelected: false,
                tpl: '<tpl for="."><div ext:qtip="{Name}" class="x-combo-list-item">' +
                     '<h3><span>{Code}</span></h3>{Name}</div></tpl>',
                store: new Ext.data.DirectStore({
                    reader: new Ext.data.JsonReader({
                        successProperty: 'success',
                        idProperty: 'Id',
                        totalProperty: 'total',
                        root: 'data',
                        fields: ['Id', 'Name', 'Code']
                    }),
                    api: { read: window.Tsa.GetBusinessPartners }
                }),
                valueField: 'Code',
                displayField: 'Code',
                pageSize: 10,
                listeners: {
                    select: function (cmb, rec, idx) {
                        this.itemSelected = true;
                    },
                    blur: function (cmb) {
                        this.itemSelected = false;
                    }
                }
            })
        }, {
            dataIndex: 'StaffCode',
            header: 'Staff Code',
            sortable: true,
            width: 150,
            menuDisabled: true,
            xtype: 'combocolumn',
            editor: new Ext.form.ComboBox({
                hiddenName: 'StaffId',
                typeAhead: false,
                hideTrigger: true,
                minChars: 2,
                listWidth: 280,
                mode: 'remote',
                itemSelected: false,
                tpl: '<tpl for="."><div ext:qtip="{FullName}" class="x-combo-list-item">' +
                     '<h3><span>{IdentityNumber}</span></h3>{FullName}</div></tpl>',
                store: new Ext.data.DirectStore({
                    reader: new Ext.data.JsonReader({
                        successProperty: 'success',
                        idProperty: 'Id',
                        totalProperty: 'total',
                        root: 'data',
                        fields: ['Id', 'FullName', 'IdentityNumber']
                    }),
                    api: { read: window.Tsa.GetEmployees }
                }),
                valueField: 'IdentityNumber',
                displayField: 'IdentityNumber',
                pageSize: 10,
                listeners: {
                    select: function (cmb, rec, idx) {
                        this.itemSelected = true;
                    },
                    blur: function (cmb) {
                        this.itemSelected = false;
                    }
                }
            })
        }]
    }, config));
};
Ext.extend(Ext.core.finance.ux.voucher.DetailGrid, Ext.grid.EditorGridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ voucherTypeId: this.voucherTypeId }) };
        this.tbar = [{}];
        this.bbar = [{
            xtype: 'button',
            text: 'New',
            id: 'newVoucher',
            iconCls: 'icon-add',
            handler: this.onNewClick
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Save',
            id: 'saveVoucher',
            iconCls: 'icon-save',
            handler: this.onSaveClick
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Remove',
            id: 'deleteVoucherDetail',
            iconCls: 'icon-delete',
            handler: this.onDeleteClick
        }, {
            xtype: 'tbfill'
        }, 'Debit Total: ', {
            xtype: 'currencyfield',
            id: 'txtDebitAmount',
            allowNegative: false,
            disabled: true,
            value: 0,
            style: 'font-weight: bold;border: 1px solid black;'
        }, {
            xtype: 'tbspacer',
            width: 10
        }, 'Credit Total: ', {
            xtype: 'currencyfield',
            id: 'txtCreditAmount',
            allowNegative: false,
            disabled: true,
            value: 0,
            style: 'font-weight: bold;border: 1px solid black;'
        }, {
            xtype: 'tbspacer',
            width: 20
        }, {
            xtype: 'currencyfield',
            id: 'txtBalance',
            allowNegative: false,
            readOnly: true,
            value: 0,
            style: 'color: red;font-weight: bold;border: 1px solid black;',
            renderer: function (value) {
                return '';
            }
        }];
        Ext.core.finance.ux.voucher.DetailGrid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.addRow();
        Ext.core.finance.ux.voucher.DetailGrid.superclass.afterRender.apply(this, arguments);
    },
    addRow: function () {
        var grid = Ext.getCmp('voucherDetail-grid');
        var store = grid.getStore();
        var voucher = store.recordType;
        var p = new voucher({
            BudgetAgreementId: '',
            Location: '',
            Sector: '',
            BudgetItem: '',
            ControlAccountId: 0,
            AccountId: 0,
            AccountCode: '',
            AccountName: '',
            DebitAmount: 0,
            CreditAmount: 0,
            BusinessPartnerCode: '',
            StaffCode: ''
        });
        var count = store.getCount();
        grid.stopEditing();
        store.insert(count, p);
        if (count > 0) {
            grid.startEditing(count, 2);
        }
    },
    checkBalance: function (store, field) {
        var total = 0;
        store.each(function (item) {
            total = total + item.data[field];
        });
        Ext.getCmp('txt' + field).setValue(total);

        totalCredit = Ext.getCmp('txtCreditAmount').getValue();
        totalDebit = Ext.getCmp('txtDebitAmount').getValue();
        balance = totalDebit >= totalCredit ? totalDebit - totalCredit : totalCredit - totalDebit;
        Ext.getCmp('txtBalance').setValue(balance);
    },
    onNewClick: function () {
        var voucherHeaderGrid = Ext.getCmp('voucherHeader-grid');
        voucherHeaderGrid.getSelectionModel().deselectRange(0, voucherHeaderGrid.pageSize);

        var form = Ext.getCmp('voucher-form').getForm();
        form.reset();
        form.findField('Amount').hide();
        form.findField('ModeOfPaymentId').hide();
        form.findField('ChequeNo').hide();
        form.findField('PayedToReceivedFrom').hide();
        form.findField('Cashier').hide();
        Ext.getCmp('voucher-defaultAccount').hide();
        
        Ext.getCmp('txtDebitAmount').reset();
        Ext.getCmp('txtCreditAmount').reset();
        Ext.getCmp('txtBalance').reset();
        Ext.getCmp('voucherForm-runningBalance').setText('');

        var voucherDetailGrid = Ext.getCmp('voucherDetail-grid');
        var voucherDetailStore = voucherDetailGrid.getStore();
        voucherDetailStore.removeAll();
        voucherDetailGrid.addRow();
    },
    onNextEntry: function () {
        var form = Ext.getCmp('voucher-form').getForm();
        var voucherHeaderGrid = Ext.getCmp('voucherHeader-grid');
        var voucherDetailGrid = Ext.getCmp('voucherDetail-grid');
        var voucherDetailStore = voucherDetailGrid.getStore();

        form.findField('Id').reset();
        form.findField('Amount').reset();
        form.findField('PayedToReceivedFrom').reset();
        form.findField('Purpose').reset();
        form.findField('ModeOfPaymentId').reset();
        form.findField('ChequeNo').reset();
        form.findField('CreatedAt').reset();
        form.findField('ChequeNo').hide();

        Ext.getCmp('voucherHeader-paging').doRefresh();

        voucherHeaderGrid.getSelectionModel().deselectRange(0, voucherHeaderGrid.pageSize);
        Ext.getCmp('txtDebitAmount').reset();
        Ext.getCmp('txtCreditAmount').reset();
        Ext.getCmp('txtBalance').reset();

        voucherDetailStore.removeAll();
        voucherDetailGrid.addRow();

        window.FinanceVoucher.GetVoucherInfo(form.findField('VoucherTypeId').getValue(), form.findField('VoucherPrefixId').getValue(), function (result, response) {
            Ext.core.finance.ux.SystemMessageManager.hide();
            if (response.result.success) {
                form.findField('ReferenceNo').setValue(response.result.data.CurrentNumber);
            }
        }, this);
    },
    onSaveClick: function () {
        var grid = Ext.getCmp('voucherDetail-grid');
        var form = Ext.getCmp('voucher-form');
        if (!form.getForm().isValid()) return;
        var store = grid.getStore();
        var rec = '';
        store.each(function (item) {
            if (item.data['ControlAccountId'] != 0 && item.data['AccountId'] != 0 && item.data['AccountCode'] != '') {
                if ((item.data['DebitAmount'] != 0 && item.data['CreditAmount'] == 0) || (item.data['DebitAmount'] == 0 && item.data['CreditAmount'] != 0)) {
                    rec = rec + item.data['Id'] + ':' +
                        item.data['Location'] + ':' +
                        item.data['Sector'] + ':' +
                        item.data['BudgetItem'] + ':' +
                        item.data['ControlAccountId'] + ':' +
                        item.data['AccountId'] + ':' +
                        item.data['DebitAmount'] + ':' +
                        item.data['CreditAmount'] + ':' +
                        item.data['BusinessPartnerCode'] + ':' +
                        item.data['StaffCode'] + ':' + item.data['BudgetAgreementId'] + ';';
                }
            }
        });
        
        form.getForm().submit({
            waitMsg: 'Please wait...',
            params: { record: Ext.encode({ voucherDetails: rec }) },
            success: function () {
                Ext.getCmp('voucherDetail-grid').onNextEntry();
            },
            failure: function (form, action) {
                Ext.MessageBox.show({
                    title: 'Failure',
                    msg: action.result.data,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.ERROR,
                    scope: this
                });
            }
        });
    },
    onDeleteClick: function () {
        var grid = Ext.getCmp('voucherDetail-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var record = grid.getSelectionModel().getSelected();
        if (record !== undefined) {
            if (record.data.Id != undefined) {
                Voucher.DeleteVoucherDetail(record.data.Id, function (result) {
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
});
Ext.reg('voucherDetail-grid', Ext.core.finance.ux.voucher.DetailGrid);

/**
* @desc      Voucher panel
* @author    Dawit Kiros
* @copyright (c) 2010, Cybersoft
* @date      November 01, 2010
* @namespace Ext.core.finance.ux.voucher
* @class     Ext.core.finance.ux.voucher.Panel
* @extends   Ext.Panel
*/
Ext.core.finance.ux.voucher.Panel = function (config) {
    Ext.core.finance.ux.voucher.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false
    }, config));
};
Ext.extend(Ext.core.finance.ux.voucher.Panel, Ext.Panel, {
    initComponent: function () {
        this.voucherForm = new Ext.core.finance.ux.voucher.Form();
        this.headerGrid = new Ext.core.finance.ux.voucher.HeaderGrid();
        this.detailGrid = new Ext.core.finance.ux.voucher.DetailGrid();
        this.items = [{
            layout: 'border',
            border: false,
            items: [{
                region: 'west',
                border: true,
                collapsible: true,
                split: true,
                width: 400,
                minSize: 200,
                maxSize: 500,
                layout: 'fit',
                margins: '0 3 0 0',
                items: [this.headerGrid]
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
                    items: [this.voucherForm, this.detailGrid]
                }]
            }]
        }];
        Ext.core.finance.ux.voucher.Panel.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('voucher-panel', Ext.core.finance.ux.voucher.Panel);