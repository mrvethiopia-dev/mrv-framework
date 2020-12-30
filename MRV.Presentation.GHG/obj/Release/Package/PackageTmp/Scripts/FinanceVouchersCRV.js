Ext.ns('Ext.core.finance.ux.FinanceVouchersCRV');
Ext.ns('Ext.core.finance.ux.FinanceVouchersCRVMain');
Ext.ns('Ext.core.finance.ux.FinanceVouchersCRVFooter');
/**
* @desc      CRV registration form
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.FinanceVouchersCRV
* @class     Ext.core.finance.ux.FinanceVouchersCRV.Form
* @extends   Ext.form.FormPanel
*/
Ext.core.finance.ux.FinanceVouchersCRV.Form = function (config) {
    Ext.core.finance.ux.FinanceVouchersCRV.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: FinanceVoucher.Get,
            submit: FinanceVoucher.Save
        },
        paramOrder: ['Id'],
        defaults: {
            // anchor: '75%',
            labelStyle: 'text-align:left;',
            msgTarget: 'side'
        },
        id: 'FinanceVouchersCRV-form',
        padding: 5,
        labelWidth: 80,
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
                id: 'newVoucherCRV',
                iconCls: 'icon-add',
                handler: CRVHandlers.onNewCRVClick
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Save',
                id: 'saveVoucherCRV',
                iconCls: 'icon-save',
                handler: function () {
                     handler: CRVHandlers.onSaveCRVClick(false);
                }
               
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Remove Row',
                id: 'deleteVoucherDetailCRV',
                iconCls: 'icon-RowDelete',
                handler: CRVHandlers.onDeleteCRVRowClick
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Insert Row',
                id: 'insertVoucherDetailCRV',
                iconCls: 'icon-RowAdd',
                handler: CRVHandlers.onInsertCRVRowClick
            }]
        },
        items: [{
            layout: 'column',
            items: [{
                columnWidth: .35,
                defaults: {
                    labelStyle: 'text-align:right;',
                    msgTarget: 'side'
                },
                border: false,
                layout: 'form',
                items: [
               {
                    name: 'VoucherType',
                    xtype: 'textfield',
                    fieldLabel: 'Voucher',
                    anchor: '75%',
                    allowBlank: true,
                    hidden: true,
                    value: 'CRV'
                },{
                hiddenName: 'LocationId',
                xtype: 'combo',
                fieldLabel: 'Location',
                anchor: '90%',
                triggerAction: 'all',
                mode: 'local',
                editable: true,
                typeAhead: true,
                forceSelection: true,
                emptyText: '- Select Location -',
                allowBlank: false,
                store: new Ext.data.DirectStore({
                    reader: new Ext.data.JsonReader({
                        successProperty: 'success',
                        idProperty: 'Id',
                        root: 'data',
                        fields: ['Id', 'CodeAndName']
                    }),
                    autoLoad: true,
                    api: { read: Tsa.GetWoreda }
                }),
                valueField: 'Id', displayField: 'CodeAndName'
            },{
                    name: 'PayedToReceivedFrom',
                    xtype: 'textfield',
                    fieldLabel: 'Received From',
                    anchor: '950%',
                    allowBlank: true,
                    hidden: false
                }, {
                    name: 'VendorInvoiceNo',
                    xtype: 'textfield',
                    fieldLabel: 'Vendor Invoice No',
                    allowBlank: true,
                    anchor: '90%',
                    value:'NA'
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
                items: [{
                    hiddenName: 'BankId',
                    xtype: 'combo',
                    fieldLabel: 'Bank',
                    anchor: '100.5%',
                    triggerAction: 'all',
                    mode: 'local',
                    editable: true,
                    typeAhead: true,
                    hidden: true,
                    forceSelection: true,
                    emptyText: 'Select Bank',
                    listWidth : 250,
                    allowBlank: true,
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
                    valueField: 'Id', displayField: 'BranchName',
                    listeners: {
                        'select': function (cmb, rec, idx) {
                            var form = Ext.getCmp('FinanceVouchersCRV-form').getForm();

                            form.findField('AccountNo').setValue(rec.data.AccountNo);
                            var k = cmb;
                            var l = rec;
                            var m = idx;

                        }


                    }
                }, {
                    name: 'AccountNo',
                    xtype: 'textfield',
                    fieldLabel: 'Account No',
                    allowBlank: true,
                    disabled: true,
                    hidden: true,
                    anchor: '90%'
                },
                {
                    name: 'ChequeNo',
                    xtype: 'textfield',
                    hidden: true,
                    fieldLabel: 'Cheque No',
                    allowBlank: true,
                    anchor: '90%'
                }, {
                    hiddenName: 'TransactionTypeId',
                    xtype: 'combo',
                    fieldLabel: 'Transaction Type',
                    anchor: '100%',
                    triggerAction: 'all',
                    mode: 'local',
                    editable: true,
                    typeAhead: true,
                    listWidth: 250,
                    forceSelection: true,
                    //emptyText: '- Select Location -',
                    allowBlank: false,
                    store: new Ext.data.DirectStore({
                        reader: new Ext.data.JsonReader({
                            successProperty: 'success',
                            idProperty: 'Id',
                            root: 'data',
                            fields: ['Id', 'Name']
                        }),
                        autoLoad: true,
                        api: { read: Tsa.GetTransactionTypes }
                    }),
                    valueField: 'Id', displayField: 'Name'
                }, {
                    hiddenName: 'ProjectNumberId',
                    xtype: 'combo',
                    fieldLabel: 'Project Number',
                    anchor: '100%',
                    triggerAction: 'all',
                    mode: 'local',
                    editable: true,
                    typeAhead: true,
                    listWidth: 150,
                    forceSelection: true,
                    store: new Ext.data.DirectStore({
                        reader: new Ext.data.JsonReader({
                            successProperty: 'success',
                            idProperty: 'Id',
                            root: 'data',
                            fields: ['Id', 'ProjectNumber']
                        }),
                        autoLoad: true,
                        api: { read: Tsa.GetProjectNumbers },
                        listeners: {
                            load: function () {
                                Ext.getCmp('FinanceVouchersCRV-form').getForm().findField('ProjectNumberId').setValue("1");
                            }
                        }
                    }),
                    valueField: 'Id', displayField: 'ProjectNumber'
                }]

            }, {
                columnWidth: .35,
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
                     name: 'CreatedAt',
                     xtype: 'datefield',
                     fieldLabel: 'CreatedAt',
                     altFormats: 'c',
                     hidden:true,
                     editable: true,
                     anchor: '75%',
                     allowBlank: true
                 },
                {
                    name: 'Date',
                    xtype: 'datefield',
                    fieldLabel: 'Date',
                    altFormats: 'c',
                    editable: true,
                    anchor: '75%',
                    allowBlank: false,
                    listeners: {
                        select: function () {
                            var form = Ext.getCmp('FinanceVouchersCRV-form').getForm();
                            
                            var date = form.findField('Date').getValue();
                            var location = form.findField('LocationId').getValue();
//                            Ext.core.finance.ux.SystemMessageManager.wait(
//                                new Ext.core.finance.ux.SystemMessage({
//                                    text: 'Please wait, generating reference number...',
//                                    type: Ext.core.finance.ux.SystemMessageManager.TYPE_WAIT
//                                })
//                            );
                            window.FinanceVoucher.GetVoucherInfo('CRV', date,location, function (result, response) {
//                                Ext.core.finance.ux.SystemMessageManager.hide();
                                if (response.result.success) {
                                    form.findField('ReferenceNo').setValue(response.result.data.CurrentNumber);
                                }
                            }, this);
                        }
                    }
                }, {
                    name: 'ReferenceNo',
                    xtype: 'textfield',
                    fieldLabel: 'Voucher No',
                   
                    anchor: '95%',
                    //value: 'LIFT/CRV01/002',
                    disabled: false,
                     allowBlank: false,
                    
                }, {
                    name: 'Purpose',
                    xtype: 'textfield',
                    fieldLabel: 'Purpose',
                    anchor: '95%',
                    allowBlank: false
                     
                },  {
                    name: 'IsChecked',
                    xtype: 'checkbox',
                    fieldLabel: 'IsChecked',
                    hidden: true
                },{
                    name: 'IsApproved',
                    xtype: 'checkbox',
                    fieldLabel: 'IsApproved',
                    hidden: true
                },{
                    name: 'IsAuthorized',
                    xtype: 'checkbox',
                    fieldLabel: 'IsAuthorized',
                    hidden: true
                },{
                    name: 'IsPosted',
                    xtype: 'checkbox',
                    fieldLabel: 'IsPosted',
                    hidden: true
                }
            ]

            }]
        }]
    }, config));

},

Ext.extend(Ext.core.finance.ux.FinanceVouchersCRV.Form, Ext.form.FormPanel);
Ext.reg('FinanceVouchersCRV-form', Ext.core.finance.ux.FinanceVouchersCRV.Form);

var CRVHandlers = function () {
    return {
        onSaveCRVClick: function (isClosed) {
            var crvBalance = Ext.getCmp('txtCRVBalance').getValue();
            if (crvBalance != 0) {
                Ext.MessageBox.show({
                    title: 'Confirmation',
                    msg: 'The Debit balance does not match with the Credit balance. Do you want to save the voucher?',
                    buttons: Ext.Msg.YESNO,
                    icon: Ext.MessageBox.WARNING,
                    fn: function(btnId) {

                        if (btnId == 'no') {
                            return;
                        } else {
                            SaveCRV(isClosed);
                        }
                    }
                });
            } else {
                SaveCRV(isClosed);
            }

        },
        onDeleteCRVRowClick: function () {
            Ext.MessageBox.show({
                title: 'Delete',
                msg: 'Are you sure you want to remove the selected Row? Once the row is deleted, you will not be able to retrieve it again!',
                buttons: {
                    ok: 'Yes',
                    no: 'No'
                },
                icon: Ext.MessageBox.QUESTION,
                scope: this,
                animEl: 'delete',
                fn: function(btn) {
                    if (btn == 'ok') {
                        var grid = Ext.getCmp('FinanceVouchersCRV-grid');
                        if (!grid.getSelectionModel().hasSelection()) return;
                        var record = grid.getSelectionModel().getSelected();
                        if (record !== undefined) {
                            if (record.data.Id != null && record.data.Id != "" && record.data.Id != '') {
                                FinanceVoucher.DeleteVoucherDetail(record.data.Id, function(result) {
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
                onInsertCRVRowClick: function () {
            var gridCRV = Ext.getCmp('FinanceVouchersCRV-grid');
            gridCRV.addRow();
        },
        
        onNewCRVClick: function () {
            var form = Ext.getCmp('FinanceVouchersCRV-form');
                var dirty = form.getForm().isDirty();
                var formFooter = Ext.getCmp('FinanceVouchersCRVFooter-form');
                
                if (dirty)
                    Ext.MessageBox.show({
                        title: 'Save Changes',
                        msg: 'Do you want to save the changes made before opening a new Document?',
                        buttons: Ext.Msg.YESNOCANCEL,
                        fn: function (btnId) {
                            if (btnId === 'yes') {
                                CRVHandlers.onSaveCRVClick(false);
                                
                            }
                            else if (btnId === 'no') {
                                form.getForm().reset();
                                formFooter.getForm().reset();
                                Ext.getCmp('FinanceVouchersCRV-grid').onNextEntry();
                            }
                        }
                    });

                return !dirty;
        }
    }
} ();

var SaveCRV = function(isClosed) {
    var grid = Ext.getCmp('FinanceVouchersCRV-grid');
    var form = Ext.getCmp('FinanceVouchersCRV-form');
    var formFooter = Ext.getCmp('FinanceVouchersCRVFooter-form');
    if (!form.getForm().isValid() || !formFooter.getForm().isValid()) return;
    var store = grid.getStore();


     if (form.disabled == true) {
        //Ext.MessageBox.show({ title: 'Posted Voucher', msg: ' This voucher is posted to the GL. You can not make changes on posted vouchers!', buttons: Ext.Msg.OK, icon: Ext.MessageBox.WARNING, scope: this });
        Ext.MessageBox.show({ title: 'Edit Locked', msg: ' This voucher is either Checked for approval or Posted to the GL, Make sure you have Edit permission on checked or posted vouchers and try again!', buttons: Ext.Msg.OK, icon: Ext.MessageBox.WARNING, scope: this });
        return; 
    }

    var rec = '';
    var index = 0;
    var _eRROR_DETECTED = 0;
    store.each(function(item) {
    index ++;
        if (item.data['AccountCode'] != '' && item.data['DepartmentId'] != '' && item.data['WoredaCode'] != '' && item.data['Criteria'] != '' && item.data['ReferenceCode'] != '') {
            if ((item.data['DebitAmount'] != 0 && item.data['CreditAmount'] == 0) || (item.data['DebitAmount'] == 0 && item.data['CreditAmount'] != 0)) {
                rec = rec + item.data['Id'] + ':' +
                    item.data['Description'] + ':' +
                    item.data['DepartmentId'] + ':' +
                    item.data['AccountId'] + ':' +
                    item.data['WoredaId'] + ':' +
                    item.data['CriteriaId'] + ':' +
                    item.data['ReferenceCode'] + ':' +
                    item.data['DebitAmount'] + ':' +
                    item.data['CreditAmount'] + ';';
            }
        } else {
            if (item.data['AccountId'] == '') {
                Ext.MessageBox.show({ title: 'Error', msg: 'The Account Code on Row Number ' + index + ' is not properly selected. Please try again.', buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR, scope: this });
                _eRROR_DETECTED++;
                return;
            }
            if (item.data['DepartmentId'] == '') {
                Ext.MessageBox.show({ title: 'Error', msg: 'The Department Code on Row Number ' + index + ' is not properly selected. Please try again.', buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR, scope: this });
                _eRROR_DETECTED++;
                return;
            }
            if (item.data['WoredaId'] == '') {
                Ext.MessageBox.show({ title: 'Error', msg: 'The Woreda Code on Row Number ' + index + ' is not properly selected. Please try again.', buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR, scope: this });
                _eRROR_DETECTED++;
                return;
            }
            if (item.data['Criteria'] == '') {
                Ext.MessageBox.show({ title: 'Error', msg: 'The Criteria Code on Row Number ' + index + ' is not properly selected. Please try again.', buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR, scope: this });
                _eRROR_DETECTED++;
                return;
            }
            if (item.data['ReferenceCode'] == '') {
                Ext.MessageBox.show({ title: 'Error', msg: 'The Reference Code on Row Number ' + index + ' is not properly selected. Please try again.', buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR, scope: this });
                _eRROR_DETECTED++;
                return;
            }
        }
    });

    if (_eRROR_DETECTED == 0) {
        var footerRec = '';
        var preparedBy = formFooter.getForm().findField('PreparedBy').getValue();
        var preparedDate = formFooter.getForm().findField('DatePrepared').getValue();
        var checkedBy = formFooter.getForm().findField('CheckedBy').getValue();
        var checkedDate = formFooter.getForm().findField('DateChecked').getValue();
        var approvedBy = formFooter.getForm().findField('ApprovedBy').getValue();
        var approvedDate = formFooter.getForm().findField('DateApproved').getValue();
        var receivedBy = formFooter.getForm().findField('ReceivedBy').getValue();
        var receivedDate = formFooter.getForm().findField('DateReceived').getValue();
        var authorizedBy = formFooter.getForm().findField('AuthorizedBy').getValue();
        var authorizedDate = formFooter.getForm().findField('DateAuthorized').getValue();

        if (preparedDate != '')
            preparedDate = preparedDate.format('M/d/yyyy');
        if (checkedDate != '')
            checkedDate = checkedDate.format('M/d/yyyy');
        if (approvedDate != '')
            approvedDate = approvedDate.format('M/d/yyyy');
        if (receivedDate != '')
            receivedDate = receivedDate.format('M/d/yyyy');
        if (authorizedDate != '')
            authorizedDate = authorizedDate.format('M/d/yyyy');

        footerRec = footerRec + preparedBy + ':' +
            preparedDate + ':' +
            checkedBy + ':' +
            checkedDate + ':' +
            approvedBy + ':' +
            approvedDate + ':' +
            receivedBy + ':' +
            receivedDate + ':' +
            authorizedBy + ':' +
            authorizedDate + ';';
            Ext.Ajax.timeout = 60000000;
        form.getForm().submit({
            waitMsg: 'Please wait...',
            params: { record: Ext.encode({ voucherDetails: rec, voucherFooter: footerRec }) },
            success: function() {
                form.getForm().reset();
                formFooter.getForm().reset();
                Ext.getCmp('FinanceVouchersCRV-form').getForm().findField('ProjectNumberId').setValue("1");
                Ext.getCmp('FinanceVouchersCRV-grid').onNextEntry();
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
    }
};

var OnEditCRV = function () {
    
    var grid = Ext.getCmp('FinanceVouchersCRVMain-grid');
    if (!grid.getSelectionModel().hasSelection()) return;
    var id = grid.getSelectionModel().getSelected().get('Id');
    var isPosted = grid.getSelectionModel().getSelected().get('IsPosted');
    var isChecked = grid.getSelectionModel().getSelected().get('IsChecked');

    var hasCheckPermission = Ext.core.finance.ux.Reception.getPermission('Cash Receipt Voucher (CRV)', 'CanCheck');
    if (hasCheckPermission == true) {
        new Ext.core.finance.ux.FinanceVouchersCRV.Window({
            FinanceVouchersCRVId: id,
            FinanceVouchersCRVIsPosted: isPosted,
            title: 'Edit CRV'
        }).show();
    } else if (isChecked == true && hasCheckPermission == false) {
        new Ext.core.finance.ux.FinanceVouchersCRV.Window({
            FinanceVouchersCRVId: id,
            FinanceVouchersCRVIsPosted: true,
            title: 'Edit CRV'
        }).show();
    } else if (isChecked == false && hasCheckPermission == false) {
        new Ext.core.finance.ux.FinanceVouchersCRV.Window({
            FinanceVouchersCRVId: id,
            FinanceVouchersCRVIsPosted: isPosted,
            title: 'Edit CRV'
        }).show();
    }
};
/**
* @desc      Banks registration form
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.FinanceVouchersCRVFooter
* @class     Ext.core.finance.ux.FinanceVouchersCRVFooter.Form
* @extends   Ext.form.FormPanel
*/
Ext.core.finance.ux.FinanceVouchersCRVFooter.Form = function (config) {
    Ext.core.finance.ux.FinanceVouchersCRVFooter.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: FinanceVoucher.Get
            // submit: FinanceVouchersCRVFooter.Save

        },
        paramOrder: ['Id'],
        defaults: {
            labelStyle: 'text-align:left;',
            msgTarget: 'side'

        },
        id: 'FinanceVouchersCRVFooter-form',
        padding: 5,
        labelWidth: 12,
        autoHeight: true,
        border: true,
        isFormLoad: false,
        frame: true,
        //baseCls: 'x-plain',

        items: [{
            layout: 'column',
            items: [{
                columnWidth: .250,
                defaults: {
                    labelStyle: 'text-align:left;',
                    msgTarget: 'side'
                },
                border: false,

                layout: 'form',
                items: [
                {
                    name: 'Id',
                    xtype: 'hidden'
                }, {
                    hiddenName: 'PreparedBy',
                    xtype: 'combo',
                    emptyText: 'Prepared By',
                    typeAhead: false,
                    hideTrigger: true,
                    minChars: 1,
                    disabled: true,
                    listWidth: 280,
                    mode: 'remote',
                    tpl: '<tpl for="."><div ext:qtip="{Id}. {IdentityNo}" class="x-combo-list-item">' +
                    '<h3><span>{Name}</span></h3> {IdentityNo}</div></tpl>',
                    store: new Ext.data.DirectStore({
                        reader: new Ext.data.JsonReader({
                            successProperty: 'success',
                            idProperty: 'Id',
                            totalProperty: 'total',
                            root: 'data',
                            fields: ['Id', 'IdentityNo', 'Name']
                        }),
                        api: { read: Tsa.GetApprovers }
                    }),
                    valueField: 'Name',
                    displayField: 'Name',
                    pageSize: 10
                },
                {
                    name: 'DatePrepared',
                    xtype: 'datefield',
                    editable: true,
                   disabled:true,
                    altFormats: 'c',
                    anchor: '70%',
                    emptyText: "Date Prepared",
                    allowBlank: true,
                    value: new Date()
                }
            ]
            }, {
                columnWidth: .250,
                defaults: {
                    labelStyle: 'text-align:left;',
                    msgTarget: 'side'
                },
                border: false,
                layout: 'form',
                items: [
                {
                    hiddenName: 'CheckedBy',
                    xtype: 'combo',
                    emptyText: 'Checked By',
                    typeAhead: false,
                    hideTrigger: true,
                    disabled:true,
                    minChars: 1,
                    listWidth: 280,
                    mode: 'remote',
                    tpl: '<tpl for="."><div ext:qtip="{Id}. {IdentityNo}" class="x-combo-list-item">' +
                    '<h3><span>{Name}</span></h3> {IdentityNo}</div></tpl>',
                    store: new Ext.data.DirectStore({
                        reader: new Ext.data.JsonReader({
                            successProperty: 'success',
                            idProperty: 'Id',
                            totalProperty: 'total',
                            root: 'data',
                            fields: ['Id', 'IdentityNo', 'Name']
                        }),
                        api: { read: Tsa.GetApprovers }
                    }),
                    valueField: 'Name',
                    displayField: 'Name',
                    pageSize: 10
                },
                {
                    name: 'DateChecked',
                    xtype: 'datefield',
                    editable: true,
                     altFormats: 'c',
                     disabled:true,
                    anchor: '70%',
                    emptyText: "Date Checked",
                    allowBlank: true
                }
            ]

            }, {
                columnWidth: .250,
                defaults: {
                    labelStyle: 'text-align:left;',
                    msgTarget: 'side'
                },
                border: false,
                layout: 'form',
                items: [
               {
                   hiddenName: 'ApprovedBy',
                   xtype: 'combo',
                   emptyText: 'Approved By',
                   typeAhead: false,
                   hideTrigger: true,
                   minChars: 1,
                   listWidth: 280,
                   disabled:true,
                   mode: 'remote',
                   tpl: '<tpl for="."><div ext:qtip="{Id}. {IdentityNo}" class="x-combo-list-item">' +
                    '<h3><span>{Name}</span></h3> {IdentityNo}</div></tpl>',
                   store: new Ext.data.DirectStore({
                       reader: new Ext.data.JsonReader({
                           successProperty: 'success',
                           idProperty: 'Id',
                           totalProperty: 'total',
                           root: 'data',
                           fields: ['Id', 'IdentityNo', 'Name']
                       }),
                       api: { read: Tsa.GetApprovers }
                   }),
                   valueField: 'Name',
                   displayField: 'Name',
                   pageSize: 10
               },
                {
                    name: 'DateApproved',
                    xtype: 'datefield',
                    editable: true,
                    disabled:true,
                     altFormats: 'c',
                    anchor: '70%',
                    emptyText: "Date Approved",
                    allowBlank: true
                }
            ]

            }, {
                columnWidth: .250,
                defaults: {
                    labelStyle: 'text-align:left;',
                    msgTarget: 'side'
                },
                border: false,

                layout: 'form',
                items: [
               {
                   hiddenName: 'ReceivedBy',
                   xtype: 'combo',
                   emptyText: 'Received By',
                   typeAhead: false,
                   hideTrigger: true,
                   minChars: 1,
                   hidden: true,
                   disabled:true,
                   anchor: '90%',
                   listWidth: 280,
                   mode: 'remote',
                   tpl: '<tpl for="."><div ext:qtip="{Id}. {IdentityNo}" class="x-combo-list-item">' +
                    '<h3><span>{Name}</span></h3> {IdentityNo}</div></tpl>',
                   store: new Ext.data.DirectStore({
                       reader: new Ext.data.JsonReader({
                           successProperty: 'success',
                           idProperty: 'Id',
                           totalProperty: 'total',
                           root: 'data',
                           fields: ['Id', 'IdentityNo', 'Name']
                       }),
                       api: { read: Tsa.GetApprovers }
                   }),
                   valueField: 'Name',
                   displayField: 'Name',
                   pageSize: 10
               }, {
                   name: 'DateReceived',
                   xtype: 'datefield',
                   editable: true,
                   hidden:true,
                   disabled:true,
                   altFormats: 'c',
                   anchor: '70%',
                   emptyText: "Date Received",
                   allowBlank : true
               }]

            }, {
                columnWidth: .25,
                defaults: {
                    labelStyle: 'text-align:left;',
                    msgTarget: 'side'
                },
                border: false,

                layout: 'form',
                items: [
               {
                   hiddenName: 'AuthorizedBy',
                   xtype: 'combo',
                   emptyText: 'Authorized By',
                   typeAhead: false,
                   hideTrigger: true,
                   disabled:true,
                   minChars: 1,
                   anchor: '90%',
                   listWidth: 280,
                   mode: 'remote',
                   tpl: '<tpl for="."><div ext:qtip="{Id}. {IdentityNo}" class="x-combo-list-item">' +
                    '<h3><span>{Name}</span></h3> {IdentityNo}</div></tpl>',
                   store: new Ext.data.DirectStore({
                       reader: new Ext.data.JsonReader({
                           successProperty: 'success',
                           idProperty: 'Id',
                           totalProperty: 'total',
                           root: 'data',
                           fields: ['Id', 'IdentityNo', 'Name']
                       }),
                       api: { read: Tsa.GetApprovers }
                   }),
                   valueField: 'Name',
                   displayField: 'Name',
                   pageSize: 10
               }, {
                   name: 'DateAuthorized',
                   xtype: 'datefield',
                    altFormats: 'c',
                    disabled:true,
                   editable: true,
                   anchor: '70%',
                   emptyText: "Date Authorized",
                   allowBlank : true
               }]

            }]
        }]
    }, config));
}
Ext.extend(Ext.core.finance.ux.FinanceVouchersCRVFooter.Form, Ext.form.FormPanel);
Ext.reg('FinanceVouchersCRVFooter-form', Ext.core.finance.ux.FinanceVouchersCRVFooter.Form);

/**
* @desc      CRV registration form host window
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.FinanceVouchersCRV
* @class     Ext.core.finance.ux.FinanceVouchersCRV.Window
* @extends   Ext.Window
*/
Ext.core.finance.ux.FinanceVouchersCRV.Window = function (config) {
    Ext.core.finance.ux.FinanceVouchersCRV.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        width: 870,
        height: 630,
        closeAction: 'close',
        modal: true,
        constrain: true,
        resizable: false,
        maximizable:true,
        minimizable :true,
        buttonAlign: 'right',
        bodyStyle: 'padding:0px;',
        listeners: {
            show: function () {
             var footerForm = Ext.getCmp('FinanceVouchersCRVFooter-form');
                
                var loggedInUserFullName = Ext.getCmp('loggedInUserFullName-toolbar');

                footerForm.getForm().findField('PreparedBy').setValue(loggedInUserFullName.value);
                this.form.getForm().findField('Id').setValue(this.FinanceVouchersCRVId);
                if (this.FinanceVouchersCRVId != '') {
                    this.form.load({ params: { Id: this.FinanceVouchersCRVId} });
                    LoadCRVGridDetails(this.FinanceVouchersCRVId);
                    footerForm.load({ params: { Id: this.FinanceVouchersCRVId} });

                     if (this.FinanceVouchersCRVIsPosted) {
                         isCRVVoucherPosted = true;
                         this.form.setDisabled(true);
                     } else {
                         isCRVVoucherPosted = false;
                     }
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
                                CRVHandlers.onSaveCRVClick(true);
                                //win.purgeListeners();
                                //win.close();
                            }
                            else if (btnId === 'no') {
                                win.purgeListeners();
                                win.close();
                            }
                        }
                    });

                return !dirty;
            },maximize: function() {
                var grid = Ext.getCmp('FinanceVouchersCRV-grid');
                grid.setSize(1330, 350);
            }, restore: function (window) {

                window.setWidth(870);
                window.setHeight(630);
                var grid = Ext.getCmp('FinanceVouchersCRV-grid');
                grid.setSize(870, 350);
            },
            minimize: function (window, opts) {
                window.collapse();
                window.setWidth(150);
                window.alignTo(Ext.getBody(), 'bl-bl');
            },
            scope: this
        }
    }, config));
}
Ext.extend(Ext.core.finance.ux.FinanceVouchersCRV.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.core.finance.ux.FinanceVouchersCRV.Form();
        this.grid = new Ext.core.finance.ux.FinanceVouchersCRV.Grid();
        this.form2 = new Ext.core.finance.ux.FinanceVouchersCRVFooter.Form();
        this.items = [this.form, this.grid, this.form2];

        this.buttons = [ {
            text: 'Close',
            iconCls: 'icon-exit',
            handler: this.onClose,
            scope: this
        }];

        Ext.core.finance.ux.FinanceVouchersCRV.Window.superclass.initComponent.call(this, arguments);
    },
 
    onClose: function () {
        this.close();
    }
});
Ext.reg('FinanceVouchersCRV-window', Ext.core.finance.ux.FinanceVouchersCRV.Window);

var CRVSelModel = new Ext.grid.CheckboxSelectionModel();
/**
* @desc      CRV grid
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.FinanceVouchersCRV
* @class     Ext.core.finance.ux.FinanceVouchersCRVMain.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.core.finance.ux.FinanceVouchersCRVMain.Grid = function (config) {
    Ext.core.finance.ux.FinanceVouchersCRVMain.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: FinanceVoucher.GetAllHeaders,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record|vType',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Code',
                direction: 'ASC'
            },
            fields: ['Id', 'VoucherType', 'ReferenceNo', 'Date','Purpose', 'IsPosted', 'IsChecked', 'IsApproved', 'IsAuthorized'],
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
        id: 'FinanceVouchersCRVMain-grid',
        searchCriteria: {},
        pageSize: 38,
        gridVoucherType: 'CRV',
        //height: 600,
        stripeRows: true,
        columnLines: true,
        border: false,
        sm: CRVSelModel,
        viewConfig: {
            forceFit: true,
            autoFill: true
        },
        listeners: {
            rowClick: function () {
                if (!this.getSelectionModel().hasSelection()) return;
                var id = this.getSelectionModel().getSelected().get('Id');
                var form = Ext.getCmp('FinanceVouchersCRV-form');
                if (id != null) {

                }
            },
            scope: this,
            rowdblclick: function () {
            

                 var hasEditPermission = Ext.core.finance.ux.Reception.getPermission('Cash Receipt Voucher (CRV)', 'CanEdit');
                if (hasEditPermission) {
                    OnEditCRV();
                }


            }
        },
        columns: [{
            dataIndex: 'Id',
            header: 'Id',
            sortable: true,
            hidden: true,
            width: 55,
            menuDisabled: true
        },CRVSelModel, new Ext.erp.ux.grid.PagingRowNumberer(),
         {
             dataIndex: 'VoucherType',
             header: 'VoucherType',
             sortable: true,
             width: 55,
             menuDisabled: true
         }, {
             dataIndex: 'ReferenceNo',
             header: 'Reference No',
             sortable: true,
             width: 55,
             menuDisabled: true
         }, {
             dataIndex: 'Date',
             header: 'Date',
             sortable: true,
             width: 55,
             menuDisabled: true
         },{
             dataIndex: 'Purpose',
             header: 'Purpose',
             sortable: true,
             width: 55,
             menuDisabled: true
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
            dataIndex: 'IsChecked',
            header: 'Checked',
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
            dataIndex: 'IsApproved',
            header: 'Approved',
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
            dataIndex: 'IsAuthorized',
            header: 'Authorized',
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
Ext.extend(Ext.core.finance.ux.FinanceVouchersCRVMain.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
    this.store.baseParams = { record: Ext.encode({ SearchText: '', SearchBy: '',FromDate: '', ToDate:'',mode: 'get' }), vType:'CRV'  };
    
        this.tbar = [];
        this.bbar = new Ext.PagingToolbar({
            id: 'FinanceVouchersCRVMain-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.core.finance.ux.FinanceVouchersCRVMain.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getStore().load({
            params: { start: 0, limit: this.pageSize, vType: this.gridVoucherType }
        });
        Ext.core.finance.ux.FinanceVouchersCRVMain.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('FinanceVouchersCRVMain-grid', Ext.core.finance.ux.FinanceVouchersCRVMain.Grid);

var SCriteria = '';
var LoadCRVGridDetails = function (selectedRow) {

    var crvDetailGrid = Ext.getCmp('FinanceVouchersCRV-grid');
    var crvDetailStore = crvDetailGrid.getStore();
    var crvHeaderId = selectedRow;
    crvDetailStore.baseParams = { record: Ext.encode({ voucherHeaderId: crvHeaderId, mode: this.mode }) };
    crvDetailStore.load({
        params: { start: 0, limit: 100 }
    });

}

var k = new Ext.KeyMap(Ext.getBody(), [
{
    key: "s",
    ctrl: true,
    fn: function(e, ele) {
        ele.preventDefault();
        CRVHandlers.onSaveCRVClick(false);
        ele.preventDefault();
    }
}]);
var gridInstance;
var gridRowType;
var iRow;
var iDept;
var iAccount;
var iWoreda;

var mnuCRVContext = new Ext.menu.Menu({
    items: [{
        id: 'btnCRVInsertRow',
        iconCls: 'icon-RowAdd',
        text: 'Insert Row'
    },{
        id: 'btnCRVRemoveRow',
        iconCls: 'icon-RowDelete',
        text: 'Remove Row'
    },
            '-'
    ,{
        id: 'btnCRVCopyRow',
        iconCls: 'icon-Copy',
        text: 'Copy Row'
    },{
        id: 'btnCRVPasteRow',
        iconCls: 'icon-Paste',
        text: 'Paste Row',
        disabled: true
    }],
    listeners: {
        itemclick: function(item) {
         if (isCRVVoucherPosted) {
                Ext.MessageBox.show({
                    title: 'Voucher Posted',
                    msg: 'Unable to complete the selected operation for posted vouchers!',
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.ERROR,
                    scope: this
                });
                return;
            }
            switch (item.id) {
                case 'btnCRVInsertRow':
                    {
                        var grid = Ext.getCmp('FinanceVouchersCRV-grid');
                            if (!grid.getSelectionModel().hasSelection()) {
                                Ext.MessageBox.show({
                                    title: 'Empty Selection',
                                    msg: 'You must select a row to complete the action.',
                                    buttons: Ext.Msg.OK,
                                    icon: Ext.MessageBox.WARNING,
                                    scope: this
                                });
                             return;
                        }
                        var store = grid.getStore();
                        var voucher = store.recordType;
                        var p = new voucher({
                            DebitAmount: 0,
                            CreditAmount: 0
                        });
                        
                        var record = grid.getSelectionModel().getSelected();
                        var index = grid.store.indexOf(record);

                        grid.stopEditing();
                        if (index >= 0) {
                            store.insert(index, p);
                        }
                        if (index > 0) {
                            grid.startEditing(index, 3);
                        }
                    }
                    break;
                    case 'btnCRVRemoveRow':
                        {
                         var grid = Ext.getCmp('FinanceVouchersCRV-grid');
                        if (!grid.getSelectionModel().hasSelection()) {
                                Ext.MessageBox.show({
                                    title: 'Empty Selection',
                                    msg: 'You must select a row to complete the action.',
                                    buttons: Ext.Msg.OK,
                                    icon: Ext.MessageBox.WARNING,
                                    scope: this
                                });
                             return;
                        }
                            CRVHandlers.onDeleteCRVRowClick();
                        }
                    break;
                    case 'btnCRVCopyRow':
                    {
                        gridInstance = Ext.getCmp('FinanceVouchersCRV-grid');
                        gridRowType = gridInstance.getStore().recordType;
                        iRow = new gridRowType({
                            DebitAmount: 0,
                            CreditAmount: 0
                        });

                        var grid = Ext.getCmp('FinanceVouchersCRV-grid');
                        if (!grid.getSelectionModel().hasSelection()) {
                                Ext.MessageBox.show({
                                    title: 'Empty Selection',
                                    msg: 'You must select a row to complete the action.',
                                    buttons: Ext.Msg.OK,
                                    icon: Ext.MessageBox.WARNING,
                                    scope: this
                                });
                             return;
                        }
                        
                        var record = grid.getSelectionModel().getSelected();
                        
                        //////////////////////////////////////////////////////
                        var acctId = record.data.AccountId;
                        var cm = grid.getColumnModel();
                        var col = cm.getColumnAt(6);
                        var editor = col.editor;
                        var store = editor.store;
                        

                        if (acctId != null) {
                            var s = store.getById(acctId);

                            if (s != null)
                                iAccount = store.getById(acctId).data.Account;
                            else
                                iAccount = record.data.Account;
                        }
                        /////////////////////////////////////////////////////
                        var depId = record.data.DepartmentId;
                        col = cm.getColumnAt(3);
                        editor = col.editor;
                        store = editor.store;
                        
                        if (depId != null) {
                            var s = store.getById(depId);
                            if (s != null)
                                iDept = store.getById(depId).data.Code;
                            else
                                iDept = record.data.Department;
                        }
                        /////////////////////////////////////////////////////
                        var woredaId = record.data.WoredaId;
                        col = cm.getColumnAt(8);
                        editor = col.editor;
                        store = editor.store;
                        if (woredaId != null) {
                            var s = store.getById(woredaId);
                            if (s != null)
                                iWoreda = store.getById(woredaId).data.Code;
                            else
                                iWoreda = record.data.Woreda;
                        }
                        /////////////////////////////////////////////////////

                        iRow = record;

                        var k = Ext.getCmp('btnCRVPasteRow');
                        k.setDisabled(false);

                    }
                    break;
                    case 'btnCRVPasteRow':
                    {
                        var grid = Ext.getCmp('FinanceVouchersCRV-grid');
                        if (!grid.getSelectionModel().hasSelection()) {
                                Ext.MessageBox.show({
                                    title: 'Empty Selection',
                                    msg: 'You must select a row to complete the action.',
                                    buttons: Ext.Msg.OK,
                                    icon: Ext.MessageBox.WARNING,
                                    scope: this
                                });
                             return;
                        }
                        var store = grid.getStore();
                        var voucher = store.recordType;
                        var p = new voucher({
                            Id: '',
                            DepartmentId: iRow.data.DepartmentId,
                            Department: iDept,
                            Description: iRow.data.Description,
                            AccountId: iRow.data.AccountId,
                            Account: iAccount,
                            WoredaId: iRow.data.WoredaId,
                            Woreda: iWoreda,
                            CriteriaId: iRow.data.CriteriaId,
                            Criteria: iRow.data.Criteria,
                            ReferenceCode: iRow.data.ReferenceCode,
                            DebitAmount: iRow.data.DebitAmount,
                            CreditAmount: iRow.data.CreditAmount
                        });
                        
                        
                        var record = grid.getSelectionModel().getSelected();
                        var index = grid.store.indexOf(record);

                        grid.stopEditing();
                        if (index >= 0) {
                            store.insert(index, p);
                        }
                        if (index > 0) {
                            grid.startEditing(index, 3);
                        }

                        
                        grid.checkBalance(store, 'DebitAmount');
                        grid.checkBalance(store, 'CreditAmount');
                    }
                    break;

            }
        }
    }
});
/**
* @desc      FinanceVouchersCRV grid
* @author    Dawit Kiros
* @copyright (c) 2010, Cybersoft
* @date      November 01, 2010
* @namespace Ext.core.finance.ux.FinanceVouchersCRV
* @class     Ext.core.finance.ux.FinanceVouchersCRV.Grid
* @extends   Ext.grid.GridPanel
*/
var isCRVVoucherPosted = false;
Ext.core.finance.ux.FinanceVouchersCRV.Grid = function (config) {
    Ext.core.finance.ux.FinanceVouchersCRV.Grid.superclass.constructor.call(this, Ext.apply({
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
            fields: ['Id', 'DepartmentId','Department', 'Description', 'AccountId', 'Account', 'WoredaId','Woreda','CriteriaId', 'Criteria', 'ReferenceCode', 'DebitAmount', 'CreditAmount','emptyCol', 'DepartmentName', 'ReferenceName', 'WoredaName'],
            remoteSort: true,
            listeners: {
                beforeLoad: function () {
                    Ext.getCmp('FinanceVouchersCRV-grid').body.mask('Loading...', 'x-mask-loading');
                },
                load: function () {
                    var grid = Ext.getCmp('FinanceVouchersCRV-grid');
                    var store = grid.getStore();
                    grid.checkBalance(store, 'DebitAmount');
                    grid.checkBalance(store, 'CreditAmount');
                    grid.body.unmask();
                },
                loadException: function () {
                    Ext.getCmp('FinanceVouchersCRV-grid').body.unmask();
                },
                remove: function (store) {
                    var grid = Ext.getCmp('FinanceVouchersCRV-grid');
                    grid.checkBalance(store, 'DebitAmount');
                    grid.checkBalance(store, 'CreditAmount');
                },
                scope: this
            }
        }),
        id: 'FinanceVouchersCRV-grid',
        selectedVoucherTypeId: 0,
        pageSize: 10,
        height: 350,
        stripeRows: true,
        selectedCriteria: '',
        columnLines: true,
        border: true,
        clicksToEdit: 2,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true,
            onEditorKey: function (field, e) {
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
                    beforeedit: function(e) {
                        if (isCRVVoucherPosted == true) {
                            //Ext.MessageBox.show({ title: 'Posted Voucher', msg: ' This voucher is posted to the GL. You can not make changes on posted vouchers!', buttons: Ext.Msg.OK, icon: Ext.MessageBox.WARNING, scope: this });
                            Ext.MessageBox.show({ title: 'Edit Locked', msg: ' This voucher is either Checked for approval or Posted to the GL, Make sure you have Edit permission on checked or posted vouchers and try again!', buttons: Ext.Msg.OK, icon: Ext.MessageBox.WARNING, scope: this });
                            return;
                        }
                    },

            afteredit: function(e) {
                var record = e.record;
                var grid = Ext.getCmp('FinanceVouchersCRV-grid');
                var store, cm;
                if (e.field == 'Account') {
                    cm = grid.getColumnModel();
                    var accountCol = cm.getColumnAt(6);
                    var editor = accountCol.editor;
                    store = editor.store;
                    if (store.data.length == 0) {
                        //record.set('Account', e.originalValue);
                        record.set('Account', '');
                        record.set('Description', '');
                        record.set('AccountId', '');
                    } else {
                                               try {
                            var accountName = store.getById(editor.getValue()).data.Name;
                            var accountId = store.getById(editor.getValue()).data.Id;
                            record.set('Description', accountName);
                            record.set('AccountId', accountId);
                            
                        } catch (e) {
                            record.set('AccountId', '');
                            record.set('Description', '');
                            Ext.MessageBox.show({
                                title: 'Error',
                                msg: 'Account Not Selected. Please enter the Account Code appropriately!',
                                buttons: Ext.Msg.OK,
                                icon: Ext.MessageBox.ERROR,
                                scope: this
                            });
                        } 
                    }

                } else if (e.field == 'Department') {
                    cm = grid.getColumnModel();
                    var deptCol = cm.getColumnAt(3);
                    var deptEditor = deptCol.editor;
                    store = deptEditor.store;
                    if (store.data.length == 0) {
                        
                        record.set('Department', '');
                        record.set('DepartmentId', '');
                    } else {

                                               try {
                            var deptId = store.getById(deptEditor.getValue()).data.Id;
                            record.set('DepartmentId', deptId); 
                        } catch (e) {
                            record.set('DepartmentId', '');
                            Ext.MessageBox.show({
                                title: 'Error',
                                msg: 'Department Not Selected. Please enter the department code appropriately!',
                                buttons: Ext.Msg.OK,
                                icon: Ext.MessageBox.ERROR,
                                scope: this
                            });
                            
                        } 
                    }

                } else if (e.field == 'Woreda') {
                    cm = grid.getColumnModel();
                    var woredaCol = cm.getColumnAt(8);
                    var woredaEditor = woredaCol.editor;
                    store = woredaEditor.store;
                    if (store.data.length == 0) {
                        //record.set('AccountCode', e.originalValue);
                        record.set('Woreda', '');
                        record.set('WoredaId', '');
                    } else {

                                                try {
                            var woredaId = store.getById(woredaEditor.getValue()).data.Id;
                            record.set('WoredaId', woredaId);
                        } catch (e) {
                            record.set('WoredaId', '');
                            Ext.MessageBox.show({
                                title: 'Error',
                                msg: 'Woreda Not Selected. Please enter the Woreda Code appropriately!',
                                buttons: Ext.Msg.OK,
                                icon: Ext.MessageBox.ERROR,
                                scope: this
                            });
                        }
                    }

                } else if (e.field == 'Criteria') {

//                    var k = record.getRawValue('Criteria');
//                    grid.selectedCriteria = k;
//                    SCriteria = k;

                    cm = grid.getColumnModel();
                    var criteriaCol = cm.getColumnAt(10);
                    var criteriaEditor = criteriaCol.editor;
                    store = criteriaEditor.store;
                    if (store.data.length == 0) {

                        record.set('Criteria', '');
                        record.set('CriteriaId', '');
                        grid.selectedCriteria = '';
                        SCriteria = '';
                    } else {

                        try {
                            var criteriaId = store.getById(criteriaEditor.getValue()).data.Id;
                            record.set('CriteriaId', criteriaId);

                            var k = store.getById(criteriaEditor.getValue()).data.Code;
                            grid.selectedCriteria = store.getById(criteriaEditor.getValue()).data.Code;
                            SCriteria = k;
                        } catch (e) {
                            record.set('CriteriaId', '');
                            Ext.MessageBox.show({
                                title: 'Error',
                                msg: 'Reference Type not selected. Please enter the Reference Type appropriately!',
                                buttons: Ext.Msg.OK,
                                icon: Ext.MessageBox.ERROR,
                                scope: this
                            });
                        }
                    }

                } else if (e.field == 'ReferenceCode') {
//                    cm = grid.getColumnModel();
//                    var referenceCol = cm.getColumnAt(11);
//                    var referenceEditor = referenceCol.editor;
//                    store = referenceEditor.store;
//                    
//                                        var criteriaCol1 = cm.getColumnAt(10);
//                    var criteriaEditor1 = criteriaCol1.editor;
//                    var criteriaStore = criteriaEditor1.store;
//                    var criteriaId1 = criteriaStore.getById(criteriaEditor1.getValue()).data.Id;
//                    var t = referenceEditor.getValue();
//                    Tsa.ValidateReferenceCode(criteriaId1, t, function(response) {
//                        if (response.success) {


//                        } else {
//                            Ext.MessageBox.show({
//                                title: response.title,
//                                msg: response.data,
//                                buttons: Ext.Msg.OK,
//                                icon: Ext.MessageBox.ERROR,
//                                scope: this
//                            });
//                        }
//                    }, this);

                } else {
                    if (e.field == 'DebitAmount') {
                        store = grid.getStore();
                        grid.checkBalance(store, 'DebitAmount');
                        grid.checkBalance(store, 'CreditAmount');

                    } else if (e.field == 'CreditAmount') {
                        store = grid.getStore();
                        grid.checkBalance(store, 'DebitAmount');
                        grid.checkBalance(store, 'CreditAmount');

                    }
                }
            },
            rowcontextmenu: function(grid, index, event) {
                 event.stopEvent();
                 mnuCRVContext.showAt(event.xy);
            }
        },
        columns: [
        {
            dataIndex: 'Id',
            header: 'Id',
            sortable: false,
            hidden: true,
            width: 100,
            menuDisabled: true
        }, new Ext.grid.RowNumberer(), {
            dataIndex: 'DepartmentId',
            header: 'DepartmentId',
            sortable: false,
            width: 200,
            hidden: true,
            menuDisabled: true,
            align: 'left'
        }, {
            dataIndex: 'Department',
            header: 'Department',
            sortable: false,
            width: 75,
            menuDisabled: true,
            xtype: 'combocolumn',
            editor: new Ext.form.ComboBox({
                hiddenName: 'Department',
                typeAhead: false,
                hideTrigger: true,
                minChars: 1,
                listWidth: 280,
                
                mode: 'remote',
                tpl: '<tpl for="."><div ext:qtip="{Id}. {Name}" class="x-combo-list-item">' +
                    '<h3><span>{Code}</span></h3> {Name}</div></tpl>',
                store: new Ext.data.DirectStore({
                    reader: new Ext.data.JsonReader({
                        successProperty: 'success',
                        idProperty: 'Id',
                        totalProperty: 'total',
                        root: 'data',
                        fields: ['Id', 'Name', 'Code']
                    }),
                    api: { read: Tsa.GetDepartmentsQuery }
                }),
                valueField: 'Id',
                displayField: 'Code',
                pageSize: 10
            })
        }, {
            dataIndex: 'Description',
            header: 'Description',
            sortable: false,
            width: 200,
            menuDisabled: true,
            align: 'left',
            renderer: function(value, metaData, record, row, col, store, gridView) {

                    metaData.attr = 'ext:qtip="' +
                        ' <p> <b>Row Description : </b> </p> ' +
                        ' <p> <b> &nbsp; </b> </p> ' +
                        ' <p> <b>Department </b>(' + record.data.Department + ' : ' + record.data.DepartmentName + ') </p> ' +
                        ' <p> <b>Account </b>(' + record.data.Account + ' : ' + record.data.Description + ') </p> ' +
                        ' <p> <b>Region/Woreda </b>(' + record.data.Woreda + ' : ' + record.data.WoredaName + ') </p> ' +
                        ' <p> <b>Reference </b>(' + record.data.ReferenceCode + ' : ' + record.data.ReferenceName + ') </p> ' +
                        '", ext:qdmDelay="300000"';

                    return value;
                }
        }, {
            dataIndex: 'AccountId',
            header: 'AccountId',
            sortable: false,
            width: 200,
            hidden: true,
            menuDisabled: true,
            align: 'left'
        },{
            dataIndex: 'Account',
            header: 'Account',
            sortable: false,
            width: 75,
            menuDisabled: true,
            xtype: 'combocolumn',
            editor: new Ext.form.ComboBox({
                hiddenName: 'Account',
                typeAhead: false,
                hideTrigger: true,
                minChars: 1,
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
                    api: { read: Tsa.GetControlAccounts }
                }),
                valueField: 'Id',
                displayField: 'Account',
                pageSize: 10
            })
        }, {
            dataIndex: 'WoredaId',
            header: 'WoredaId',
            sortable: false,
            width: 200,
            hidden: true,
            menuDisabled: true,
            align: 'left'
        }, {
            dataIndex: 'Woreda',
            header: 'Woreda',
            sortable: false,
            width: 75,
            menuDisabled: true,
            xtype: 'combocolumn',
            //forceSelection : true,
            editor: new Ext.form.ComboBox({
                hiddenName: 'ControlAccountId',
                typeAhead: false,
                hideTrigger: true,
                minChars: 1,
                listWidth: 280,
                mode: 'remote',
                tpl: '<tpl for="."><div ext:qtip="{Id}. {Name}" class="x-combo-list-item">' +
                    '<h3><span>{Code}</span></h3> {Name}</div></tpl>',
                store: new Ext.data.DirectStore({
                    reader: new Ext.data.JsonReader({
                        successProperty: 'success',
                        idProperty: 'Id',
                        totalProperty: 'total',
                        root: 'data',
                        fields: ['Id', 'Name', 'Code']
                    }),
                    api: { read: Tsa.GetWoredaCodes }
                }),
                valueField: 'Id',
                displayField: 'Code',
                pageSize: 10
            })
        }, {
            dataIndex: 'CriteriaId',
            header: 'CriteriaId',
            sortable: false,
            width: 200,
            hidden: true,
            menuDisabled: true,
            align: 'left'
        }, {
            dataIndex: 'Criteria',
            header: 'Reference Type',
            sortable: false,
            width: 90,
            menuDisabled: true,
            xtype: 'combocolumn',
            editor: new Ext.form.ComboBox({
                hiddenName: 'CriteriaId',
                typeAhead: true,
                triggerAction: 'all',
                mode: 'local',
                forceSelection: true,
                store: new Ext.data.DirectStore({
                    reader: new Ext.data.JsonReader({
                        successProperty: 'success',
                        idProperty: 'Id',
                        root: 'data',
                        fields: ['Id', 'Name', 'Code', 'CodeAndName']
                    }),
                    autoLoad: true,
                    api: { read: window.Tsa.GetFilterCriterias }
                }),
                valueField: 'Id',
                displayField: 'Code'
            })
        }, {
            dataIndex: 'ReferenceCode',
            header: 'Reference',
            sortable: false,
            width: 75,
            menuDisabled: true,
            xtype: 'combocolumn',
            editor: new Ext.form.ComboBox({
                hiddenName: 'ReferenceCodeId',
                typeAhead: true,
                hideTrigger: true,
                minChars: 1,
                listWidth: 280,
                mode: 'remote',
                tpl: '<tpl for="."><div ext:qtip="{Id}. {Name}" class="x-combo-list-item">' +
                    '<h3><span>{Code}</span></h3> {Name}</div></tpl>',
                store: new Ext.data.DirectStore({
                    reader: new Ext.data.JsonReader({
                        successProperty: 'success',
                        idProperty: 'Id',
                        totalProperty: 'total',
                        root: 'data',
                        fields: ['Id', 'Name', 'Code']
                    }),
                    // baseParams: { CriteriaId: SCriteria },
                    api: { read: Tsa.GetReferenceCodes }
                }),
                valueField: 'Code',
                displayField: 'Code',
                pageSize: 13,
                listeners: {
                    beforequery: function (queryEvent) {
                        var grid = Ext.getCmp('FinanceVouchersCRV-grid');

                        this.store.baseParams = { CriteriaId: grid.selectedCriteria };
                    }
                }
            })
        }, {
            dataIndex: 'DebitAmount',
            header: 'Debit Amount',
            sortable: false,
            width: 90,
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
            sortable: false,
            width: 90,
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
        },{
            dataIndex: 'emptyCol',
            header: ' ',
            sortable: false,
            width: 30,
            menuDisabled: true,
            align: 'left'
        }, {
                dataIndex: 'DepartmentName',
                header: 'DepartmentName',
                sortable: false,
                width: 200,
                menuDisabled: true,
                hidden:true,
                align: 'left'
            }, {
                dataIndex: 'ReferenceName',
                header: 'ReferenceName',
                sortable: false,
                width: 200,
                menuDisabled: true,
                hidden: true,
                align: 'left'
            }, {
                dataIndex: 'WoredaName',
                header: 'WoredaName',
                sortable: false,
                width: 200,
                menuDisabled: true,
                hidden: true,
                align: 'left'
            }]
    }, config));
};
Ext.extend(Ext.core.finance.ux.FinanceVouchersCRV.Grid, Ext.grid.EditorGridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ voucherTypeId: this.voucherTypeId }) };
        this.tbar = [{}];
        this.bbar = [{
            xtype: 'button',
            text: 'New',
            id: 'newVoucher',
            hidden: true,
            iconCls: 'icon-add',
            handler: this.onNewClick
        }, {
            xtype: 'button',
            text: 'Save',
            id: 'saveVoucher',
            hidden: true,
            iconCls: 'icon-save',
            handler: this.onSaveClick
        }, {
            xtype: 'button',
            text: 'Remove',
            hidden: true,
            id: 'deleteVoucherDetail',
            iconCls: 'icon-delete',
            handler: this.onDeleteClick
        }, {
            xtype: 'tbfill'
        }, 'Debit Total: ', {
            xtype: 'currencyfield',
            id: 'txtCRVDebitAmount',
            allowNegative: false,
            disabled: true,
            value: 0,
            style: 'font-weight: bold;border: 1px solid black;'
        }, {
            xtype: 'tbspacer',
            width: 10
        }, 'Credit Total: ', {
            xtype: 'currencyfield',
            id: 'txtCRVCreditAmount',
            allowNegative: false,
            disabled: true,
            value: 0,
            style: 'font-weight: bold;border: 1px solid black;'
        }, {
            xtype: 'tbspacer',
            width: 20
        }, {
            xtype: 'currencyfield',
            id: 'txtCRVBalance',
            allowNegative: false,
            readOnly: true,
            value: 0,
            style: 'color: red;font-weight: bold;border: 1px solid black;',
            renderer: function (value) {
                return '';
            }
        }];
        Ext.core.finance.ux.FinanceVouchersCRV.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.addRow();
        Ext.core.finance.ux.FinanceVouchersCRV.Grid.superclass.afterRender.apply(this, arguments);
    },
    addRow: function () {
        var grid = Ext.getCmp('FinanceVouchersCRV-grid');
        var store = grid.getStore();
        var voucher = store.recordType;
        var p = new voucher({


            DebitAmount: 0,
            CreditAmount: 0

        });
        var count = store.getCount();
        grid.stopEditing();
        store.insert(count, p);
        if (count > 0) {
            grid.startEditing(count, 3);
        }
    },
    checkBalance: function (store, field) {
        var total = 0;
        store.each(function (item) {
            total = total + item.data[field];
        });
        Ext.getCmp('txtCRV' + field).setValue(total);

        totalCredit = Ext.getCmp('txtCRVCreditAmount').getValue();
        totalDebit = Ext.getCmp('txtCRVDebitAmount').getValue();
        balance = totalDebit >= totalCredit ? totalDebit - totalCredit : totalCredit - totalDebit;
        Ext.getCmp('txtCRVBalance').setValue(balance);
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

        Ext.getCmp('txtCRVDebitAmount').reset();
        Ext.getCmp('txtCRVCreditAmount').reset();
        Ext.getCmp('txtCRVBalance').reset();
        Ext.getCmp('voucherForm-runningBalance').setText('');

        var voucherDetailGrid = Ext.getCmp('FinanceVouchersCRV-grid');
        var voucherDetailStore = voucherDetailGrid.getStore();
        voucherDetailStore.removeAll();
        voucherDetailGrid.addRow();
    },
    onNextEntry: function () {
        var form = Ext.getCmp('FinanceVouchersCRV-form').getForm();
        var voucherHeaderGrid = Ext.getCmp('voucherHeader-grid');
        var voucherDetailGrid = Ext.getCmp('FinanceVouchersCRV-grid');
        var voucherDetailStore = voucherDetailGrid.getStore();

        form.findField('Id').reset();
//        form.findField('Amount').reset();
//        form.findField('PayedToReceivedFrom').reset();
//        form.findField('Purpose').reset();
//        form.findField('ModeOfPaymentId').reset();
//        form.findField('ChequeNo').reset();
//        form.findField('CreatedAt').reset();
//        form.findField('ChequeNo').hide();

//        Ext.getCmp('voucherHeader-paging').doRefresh();

//        voucherHeaderGrid.getSelectionModel().deselectRange(0, voucherHeaderGrid.pageSize);
        Ext.getCmp('txtCRVDebitAmount').reset();
        Ext.getCmp('txtCRVCreditAmount').reset();
        Ext.getCmp('txtCRVBalance').reset();

        voucherDetailStore.removeAll();
        voucherDetailGrid.addRow();

//        window.FinanceVoucher.GetVoucherInfo(form.findField('VoucherTypeId').getValue(), form.findField('VoucherPrefixId').getValue(), function (result, response) {
//            Ext.core.finance.ux.SystemMessageManager.hide();
//            if (response.result.success) {
//                form.findField('ReferenceNo').setValue(response.result.data.CurrentNumber);
//            }
//        }, this);
    },
    onSaveClick: function () {
        var grid = Ext.getCmp('FinanceVouchersCRV-grid');
        var form = Ext.getCmp('FinanceVouchersCRV-form');
        var formFooter = Ext.getCmp('FinanceVouchersCRVFooter-form');
        if (!form.getForm().isValid() || !formFooter.getForm().isValid()) return;
        var store = grid.getStore();
        var rec = '';
        store.each(function (item) {
            if (item.data['AccountCode'] != '' && item.data['DepartmentId'] != '' && item.data['WoredaCode'] != '' && item.data['Criteria'] != '' && item.data['ReferenceCode'] != '') {
                if ((item.data['DebitAmount'] != 0 && item.data['CreditAmount'] == 0) || (item.data['DebitAmount'] == 0 && item.data['CreditAmount'] != 0)) {
                    rec = rec + item.data['Id'] + ':' +
                        item.data['Description'] + ':' +
                        item.data['DepartmentId'] + ':' +
                        item.data['AccountCode'] + ':' +
                        item.data['WoredaCode'] + ':' +
                        item.data['Criteria'] + ':' +
                        item.data['ReferenceCode'] + ':' +
                        item.data['DebitAmount'] + ':' +
                        item.data['CreditAmount'] + ';';
                }
            }
        });

        var footerRec = '';
        var preparedBy = formFooter.getForm().findField('PreparedBy').getValue();
        var preparedDate = formFooter.getForm().findField('PreparedDate').getValue();
        var checkedBy = formFooter.getForm().findField('CheckedBy').getValue();
        var checkedDate = formFooter.getForm().findField('CheckedDate').getValue();
        var approvedBy = formFooter.getForm().findField('ApprovedBy').getValue();
        var approvedDate = formFooter.getForm().findField('ApprovedDate').getValue();

        footerRec = footerRec + preparedBy + ':' +
                        preparedDate + ':' +
                        checkedBy + ':' +
                        checkedDate + ':' +
                        approvedBy + ':' +
                        approvedDate + ';';

        form.getForm().submit({
            waitMsg: 'Please wait...',
            params: { record: Ext.encode({ voucherDetails: rec, voucherFooter: footerRec }) },
            success: function () {
                Ext.getCmp('FinanceVouchersCRV-grid').onNextEntry();
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
        var grid = Ext.getCmp('FinanceVouchersCRV-grid');
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
Ext.reg('FinanceVouchersCRV-grid', Ext.core.finance.ux.FinanceVouchersCRV.Grid);

/**
* @desc      CRV panel
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @version   $Id: FinanceVouchersCRV.js, 0.1
* @namespace Ext.core.finance.ux.FinanceVouchersCRV
* @class     Ext.core.finance.ux.FinanceVouchersCRV.Panel
* @extends   Ext.Panel
*/
Ext.core.finance.ux.FinanceVouchersCRV.Panel = function (config) {
    Ext.core.finance.ux.FinanceVouchersCRV.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false,
        tbar: {
            xtype: 'toolbar',
            items: [{
                xtype: 'button',
                text: 'Add',
                id: 'addFinanceVouchersCRV',
                iconCls: 'icon-add',
                handler: this.onAddClick,
                disabled: !Ext.core.finance.ux.Reception.getPermission('Cash Receipt Voucher (CRV)', 'CanAdd')
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Edit',
                id: 'editFinanceVouchersCRV',
                iconCls: 'icon-edit',
                handler: this.onEditClick,
                disabled: !Ext.core.finance.ux.Reception.getPermission('Cash Receipt Voucher (CRV)', 'CanEdit')
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Delete',
                id: 'deleteFinanceVouchersCRV',
                iconCls: 'icon-delete',
                handler: this.onDeleteClick,
                disabled: !Ext.core.finance.ux.Reception.getPermission('Cash Receipt Voucher (CRV)', 'CanDelete')
            },{
                xtype: 'tbseparator'
            },{
                xtype: 'button',
                text: 'Check',
                id: 'checkFinanceVouchersCRV',
                iconCls: 'icon-check',
                handler: function() {
                    onCRVStatusChange('Check');
                },
                disabled: !Ext.core.finance.ux.Reception.getPermission('Cash Receipt Voucher (CRV)', 'CanCheck')
            }, {
                xtype: 'tbseparator'
            },{
                xtype: 'button',
                text: 'Approve',
                id: 'approveFinanceVouchersCRV',
                iconCls: 'icon-approve',
                handler: function() {
                    onCRVStatusChange('Approve');
                },
                disabled: !Ext.core.finance.ux.Reception.getPermission('Cash Receipt Voucher (CRV)', 'CanApprove')
            },{
                xtype: 'tbseparator'
            },{
                xtype: 'button',
                text: 'Authorize',
                id: 'authorizeFinanceVouchersCRV',
                iconCls: 'icon-authorize',
                 handler: function() {
                    onCRVStatusChange('Authorize');
                },
                disabled: !Ext.core.finance.ux.Reception.getPermission('Cash Receipt Voucher (CRV)', 'CanAuthorize')
            },{
                xtype: 'tbseparator'
            },{
                xtype: 'button',
                text: 'Export',
                id: 'btnCRVPreviewExport',
                iconCls: 'icon-Preview',
                handler: this.onCRVPreviewClick
                //disabled: !Ext.core.finance.ux.Reception.getPermission('JVR', 'CanDelete')
            },{
                xtype: 'tbseparator'
            },{
                xtype: 'button',
                text: 'Print',
                id: 'previewFinanceVouchersCRV',
                iconCls: 'icon-Print',
                handler: this.onCRVPrintClick
                //disabled: !Ext.core.finance.ux.Reception.getPermission('JVR', 'CanDelete')
            }, {
                xtype: 'button',
                text: 'Import Tool',
                id: 'importToolFinanceVouchersCRV',
                iconCls: 'icon-win',
                handler: this.onRunCRVImportTool,
                 hidden: true
                //disabled: !Ext.core.finance.ux.Reception.getPermission('JVR', 'CanDelete')
            }, '->', {
                    id: 'cmbCRVSearchBy',
                    //hiddenName: 'FilterBy',
                    xtype: 'combo',
                    //fieldLabel: 'Filter By',
                    triggerAction: 'all',
                    width: 150,

                    mode: 'local',
                    editable: true,
                    forceSelection: false,
                    emptyText: 'Search By',
                    allowBlank: true,
                    hidden:true,
                    store: new Ext.data.ArrayStore({
                        fields: ['Id', 'Criteria'],
                        data: [[1, 'Reference No'], [2, 'Date']]
                    }),
                    valueField: 'Criteria',
                    displayField: 'Criteria',
                    listeners : {
                        'select': function(cmb, rec, idx) {

                            var changeTypeCombo = this.getValue();
                            var startDate = Ext.getCmp('CRVSearchFromDate');
                            var endDate = Ext.getCmp('CRVSearchToDate');
                            var srchTxt = Ext.getCmp('CRVSearchText');

                            if (changeTypeCombo == 'Reference No') {
                                startDate.hide();
                                endDate.hide();
                                srchTxt.show();
                            } else {
                                startDate.show();
                                endDate.show();
                                srchTxt.hide();
                            }
                        }
                    }
                }, ' - ', {
                    id: 'CRVSearchText',
                    xtype: 'textfield',
                    anchor: '95%',
                    emptyText: 'Search Text',
                    allowBlank: true,
                    hidden:true,
                    listeners: {
                        specialkey: function (field, e) {
                            if (e.getKey() == e.ENTER) {
                                onSearchCRVHit();
                            }
                        }
                    }

                },  ' ', {
                    id: 'CRVSearchFromDate',
                    xtype: 'datefield',
                    anchor: '95%',
                    emptyText: 'From Date',
                    allowBlank: true,
                    hidden:true,
                    listeners: {
                        specialkey: function (field, e) {
                            if (e.getKey() == e.ENTER) {
                                onSearchCRVHit();
                            }
                        }
                    }

                },  ' ', {
                    id: 'CRVSearchToDate',
                    xtype: 'datefield',
                    anchor: '95%',
                    emptyText: 'To Date',
                    allowBlank: true,
                    hidden:true,
                    listeners: {
                        specialkey: function (field, e) {
                            if (e.getKey() == e.ENTER) {
                                onSearchCRVHit();
                            }
                        }
                    }

                },  ' ', {
                xtype: 'button',
                tooltip: 'Search',
                id: 'btnSearchCRVs',

                iconCls: 'icon-filter',
                handler: this.onShowSearchWindow

            }, {
                    xtype: 'button',
                    tooltip: 'Search',
                    id: 'searchFinanceVouchersCRV',
                    iconCls: 'icon-filter',
                    hidden:true,
                    handler: this.onCRVSearchClick
                    
                }, {
                xtype: 'tbseparator'
            }, {
                    xtype: 'button',
                    tooltip: 'Reset Search',
                    id: 'resetFinanceVouchersCRV',
                    iconCls: 'icon-refresh',
                    handler: this.onCRVRefreshClick
                    
                }]
        }
    }, config));
}
Ext.extend(Ext.core.finance.ux.FinanceVouchersCRV.Panel, Ext.Panel, {
    initComponent: function () {
        this.items = [{
            xtype: 'FinanceVouchersCRVMain-grid',
            id: 'FinanceVouchersCRVMain-grid'
        }];
        Ext.core.finance.ux.FinanceVouchersCRV.Panel.superclass.initComponent.apply(this, arguments);
    },

    onAddClick: function () {
        new Ext.core.finance.ux.FinanceVouchersCRV.Window({
            FinanceVouchersCRVId: 0,
            title: 'Add CRV'
        }).show();
    },
    onEditClick: function () {
        OnEditCRV();
    },
    onDeleteClick: function () { 
        var grid = Ext.getCmp('FinanceVouchersCRVMain-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        Ext.MessageBox.show({
            title: 'Delete',
            msg: 'Are you sure you want to delete the selected Account?',
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
                    FinanceVoucher.Delete(id, function (result, response) {
                        Ext.getCmp('FinanceVouchersCRVMain-paging').doRefresh();
                    }, this);
                }
            }
        });
    },
        onShowSearchWindow : function() {
        new Ext.core.finance.ux.FinanceVouchersSearch.Window({
            title: 'Search CRV',
            caller:'CRV'
        }).show();
    },
    onCRVPrintClick: function () {

          var reportType = 'rpt_CRV';
          var grid = Ext.getCmp('FinanceVouchersCRVMain-grid');
          if (!grid.getSelectionModel().hasSelection()) return;
          var voucherHeaderId = grid.getSelectionModel().getSelected().get('Id');
          FinanceReports.ViewReport(reportType, voucherHeaderId, function (result, response) {
            if (result.success) {
                var url = result.URL;
                var voucherType = 'CRV';
                var reportType = 'Voucher';
                var isPrint = 1;
                windowParameter = 'width=900,height=700,toolbar=yes,location=yes,directories=yes,status=yes,menubar=yes,scrollbars=yes,copyhistory=yes,resizable=yes';
                window.open('Reports/Financial/FinancialReportsViewer.aspx?rt=' + reportType + '&id=' + voucherHeaderId + '&vt=' + voucherType+ '&printMode=' + true, '', windowParameter);

            }

        });

    },
    onCRVPreviewClick: function () {

          var reportType = 'rpt_CRV';
          var grid = Ext.getCmp('FinanceVouchersCRVMain-grid');
          if (!grid.getSelectionModel().hasSelection()) return;
          var voucherHeaderId = grid.getSelectionModel().getSelected().get('Id');
          FinanceReports.ViewReport(reportType, voucherHeaderId, function (result, response) {
            if (result.success) {
                var url = result.URL;
                var voucherType = 'CRV';
                var reportType = 'Voucher';
                var isPrint = 0;
                windowParameter = 'width=900,height=700,toolbar=yes,location=yes,directories=yes,status=yes,menubar=yes,scrollbars=yes,copyhistory=yes,resizable=yes';
                window.open('Reports/Financial/FinancialReportsViewer.aspx?rt=' + reportType + '&id=' + voucherHeaderId + '&vt=' + voucherType+ '&printMode=' + false, '', windowParameter);
                
            }

        });

    },
    onCRVSearchClick: function () {
//        var jvGrid = Ext.getCmp('FinanceVouchersCRVMain-grid');
//        var jvStore = jvGrid.getStore();
//        var txt = Ext.getCmp('CRVSearchText').getValue();
//        var srchBy = Ext.getCmp('cmbCRVSearchBy').getValue();
//        var startDate = Ext.getCmp('CRVSearchFromDate').getValue();
//        var endDate = Ext.getCmp('CRVSearchToDate').getValue();
//        
//        jvStore.baseParams = { record: Ext.encode({ SearchText: txt, SearchBy: srchBy,FromDate: startDate, ToDate:endDate, mode: 'search' }), vType: 'CRV' };
//        
//        jvStore.load({
//            params: { start: 0, limit: 100 }
//        });
        onSearchCRVHit();
    },
    onCRVRefreshClick: function () {
        var jvGrid = Ext.getCmp('FinanceVouchersCRVMain-grid');
        Ext.getCmp('cmbCRVSearchBy').reset();
        Ext.getCmp('CRVSearchFromDate').reset();
        Ext.getCmp('CRVSearchToDate').reset();
        Ext.getCmp('CRVSearchText').reset();

        var jvStore = jvGrid.getStore();
        
        jvStore.baseParams = { record: Ext.encode({ SearchText: '', SearchBy: '',FromDate: '', ToDate:'', mode: 'get' }), vType: 'CRV' };
        
        jvStore.load({
            params: { start: 0, limit: 100 }
        });
    }, onRunCRVImportTool: function () {
        Ext.Ajax.timeout = 6000000;
        window.FinanceVoucher.RunImportTool(function (response) {
            if (!response.success) {
                Ext.MessageBox.show({
                    title: 'Error',
                    msg: 'Unable to run the import tool',
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.ERROR,
                    scope: this
                });

            } 
        });
    }
});
var onCRVStatusChange = function (status) {
    //onCRVStatusChange: function (status) {
        var grid = Ext.getCmp('FinanceVouchersCRVMain-grid');
        if (grid == null) {
            return;
        }
         var vouchers = '';
        if (!grid.getSelectionModel().hasSelection()) {
            Ext.MessageBox.show({
                title: 'Select',
                msg: 'You must select a voucher to ' + status,
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
                                
        var selectedVouchers = grid.getSelectionModel().getSelections();
        for (var i = 0; i < selectedVouchers.length; i++) {
            vouchers = vouchers + ':' + selectedVouchers[i].get('Id');
        }


        window.FinanceVoucher.ChangeStatus(vouchers, status, function (result, response) {
            if (result.success) {
                
                if (status == 'Check') {
                    status = status + 'e';
                }
                Ext.getCmp('FinanceVouchersCRVMain-paging').doRefresh();
                Ext.MessageBox.alert('Status', status + 'd successfully.');
            }else {
                 Ext.MessageBox.show({
                title: 'Error',
                msg: result.data,
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.ERROR,
                scope: this
            });
            }
        });
    }
Ext.reg('FinanceVouchersCRV-panel', Ext.core.finance.ux.FinanceVouchersCRV.Panel);

var onSearchCRVHit = function () {
    var jvGrid = Ext.getCmp('FinanceVouchersCRVMain-grid');
        var jvStore = jvGrid.getStore();
        var txt = Ext.getCmp('CRVSearchText').getValue();
        var srchBy = Ext.getCmp('cmbCRVSearchBy').getValue();
        var startDate = Ext.getCmp('CRVSearchFromDate').getValue();
        var endDate = Ext.getCmp('CRVSearchToDate').getValue();
        
        jvStore.baseParams = { record: Ext.encode({ SearchText: txt, SearchBy: srchBy,FromDate: startDate, ToDate:endDate, mode: 'search' }), vType: 'CRV' };
        
        jvStore.load({
            params: { start: 0, limit: 100 }
        });
};