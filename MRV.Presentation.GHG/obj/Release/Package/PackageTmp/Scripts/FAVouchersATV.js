Ext.ns('Ext.core.finance.ux.FAVouchersATV');
Ext.ns('Ext.core.finance.ux.FAVouchersATVMain');
Ext.ns('Ext.core.finance.ux.FAVouchersATVFooter');
/**
* @desc      ATV registration form
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.FAVouchersATV
* @class     Ext.core.finance.ux.FAVouchersATV.Form
* @extends   Ext.form.FormPanel
*/
Ext.core.finance.ux.FAVouchersATV.Form = function (config) {
    Ext.core.finance.ux.FAVouchersATV.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: FixedAssetVoucher.Get,
            submit: FixedAssetVoucher.Save
        },
        paramOrder: ['Id'],
        defaults: {
            // anchor: '75%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'FAVouchersATV-form',
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
                id: 'newVoucherATV',
                iconCls: 'icon-add',
                handler: ATVHandlers.onNewATVClick
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Save',
                id: 'saveVoucherATV',
                iconCls: 'icon-save',
                handler: function () {
                    handler: ATVHandlers.onSaveATVClick(false);
                }

            }, {
                xtype: 'tbseparator',
                hidden: true
            }, {
                xtype: 'button',
                text: 'Remove Row',
                hidden: true,
                id: 'deleteVoucherDetailATV',
                iconCls: 'icon-RowDelete',
                handler: ATVHandlers.onDeleteATVRowClick
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Insert Row',
                hidden: true,
                id: 'insertVoucherDetailATV',
                iconCls: 'icon-RowAdd',
                handler: ATVHandlers.onInsertATVRowClick
            }, {
                xtype: 'tbfill'
            }, {
                xtype: 'displayfield',
                id: 'lblVoucherType',
                style: 'font-weight: bold; color: red',
                value: 'ASSET TRANSFER VOUCHER'
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
                   value: 'ATV'
               }, {
                   hiddenName: 'LocationId',
                   xtype: 'combo',
                   fieldLabel: 'Location',
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
                           fields: ['Id', 'CodeAndName']
                       }),
                       autoLoad: true,
                       api: { read: Tsa.GetWoreda },
                       listeners: {
                           load: function () {
                               Ext.getCmp('FAVouchersATV-form').getForm().findField('LocationId').setValue("159");
                           }
                       }
                   }),
                   valueField: 'Id', displayField: 'CodeAndName'
               }, {
                   id: 'TransferFromId',
                   hiddenName: 'TransferFromId',
                   xtype: 'combo',
                   fieldLabel: 'From Custodian',
                   triggerAction: 'all',
                   mode: 'local',
                   editable: true,
                   typeAhead: true,
                   listWidth: 250,
                   allowBlank: false,
                   store: new Ext.data.DirectStore({
                       reader: new Ext.data.JsonReader({
                           successProperty: 'success',
                           idProperty: 'Id',
                           root: 'data',
                           fields: ['Id', 'Name']
                       }),
                       autoLoad: true,
                       api: { read: window.Tsa.GetEmployeesList }
                   }),
                   valueField: 'Id', displayField: 'Name'
               }, {
                   id: 'TransferToId',
                   hiddenName: 'TransferToId',
                   xtype: 'combo',
                   fieldLabel: 'To Custodian ',
                   triggerAction: 'all',
                   mode: 'local',
                   editable: true,
                   typeAhead: true,
                   listWidth: 250,
                   allowBlank: false,
                   store: new Ext.data.DirectStore({
                       reader: new Ext.data.JsonReader({
                           successProperty: 'success',
                           idProperty: 'Id',
                           root: 'data',
                           fields: ['Id', 'Name']
                       }),
                       autoLoad: true,
                       api: { read: window.Tsa.GetEmployeesList }
                   }),
                   valueField: 'Id', displayField: 'Name'
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
                    name: 'Remark',
                    xtype: 'textarea',
                    fieldLabel: 'Remark',
                    anchor: '100%',
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
                     hidden: true,
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
                            var form = Ext.getCmp('FAVouchersATV-form').getForm();

                            var date = form.findField('Date').getValue();
                            var location = form.findField('LocationId').getValue();

                            window.FinanceVoucher.GetVoucherInfo('ATV', date, location, function (result, response) {
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
                    fieldLabel: 'ATV No',
                    anchor: '95%',
                    disabled: false,
                    allowBlank: false
                }
                ]

            }]
        }]
    }, config));

},

Ext.extend(Ext.core.finance.ux.FAVouchersATV.Form, Ext.form.FormPanel);
Ext.reg('FAVouchersATV-form', Ext.core.finance.ux.FAVouchersATV.Form);

var ATVHandlers = function () {
    return {
        onSaveATVClick: function (isClosed) {
            SaveATV(isClosed);
        },
        onDeleteATVRowClick: function () {
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
                fn: function (btn) {
                    if (btn == 'ok') {
                        var grid = Ext.getCmp('FAVouchersATV-grid');
                        if (!grid.getSelectionModel().hasSelection()) return;
                        var record = grid.getSelectionModel().getSelected();
                        if (record !== undefined) {
                            if (record.data.Id != null && record.data.Id != "" && record.data.Id != '') {
                                FixedAssetVoucher.DeleteVoucherDetail(record.data.Id, function (result) {
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
        onInsertATVRowClick: function () {
            var gridATV = Ext.getCmp('FAVouchersATV-grid');
            //gridATV.addRow();
        },

        onNewATVClick: function () {
            var form = Ext.getCmp('FAVouchersATV-form');
            var dirty = form.getForm().isDirty();
            var formFooter = Ext.getCmp('FAVouchersATVFooter-form');

            if (dirty)
                Ext.MessageBox.show({
                    title: 'Save Changes',
                    msg: 'Do you want to save the changes made before opening a new Document?',
                    buttons: Ext.Msg.YESNOCANCEL,
                    fn: function (btnId) {
                        if (btnId === 'yes') {
                            ATVHandlers.onSaveATVClick(false);

                        }
                        else if (btnId === 'no') {
                            form.getForm().reset();
                            formFooter.getForm().reset();
                            Ext.getCmp('FAVouchersATV-grid').onNextEntry();
                        }
                    }
                });

            return !dirty;
        }
    }
}();

var SaveATV = function (isClosed) {
    var grid = Ext.getCmp('FAVouchersATV-grid');
    var form = Ext.getCmp('FAVouchersATV-form');
    var formFooter = Ext.getCmp('FAVouchersATVFooter-form');
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
    store.each(function (item) {
        index++;
        if (item.data['FixedAssetId'] != '' && item.data['UnitId'] != '' && item.data['Quantity'] != '') {
            if ((item.data['Quantity'] != 0)) {
                rec = rec + item.data['Id'] + ':' +
                    item.data['FixedAssetId'] + ':' +
                    item.data['UnitId'] + ':' +
                    item.data['Quantity'] + ':' +
                    item.data['UnitPrice'] + ':' +
                    item.data['TotalPrice'] + ';';
            }
        } else {
            if (item.data['FixedAssetId'] == '') {
                Ext.MessageBox.show({ title: 'Error', msg: 'The FixedAsset Code on Row Number ' + index + ' is not properly selected. Please try again.', buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR, scope: this });
                _eRROR_DETECTED++;
                return;
            }

            if (item.data['UnitId'] == '') {
                Ext.MessageBox.show({ title: 'Error', msg: 'The Unit Code on Row Number ' + index + ' is not properly selected. Please try again.', buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR, scope: this });
                _eRROR_DETECTED++;
                return;
            }

        }
    });

    if (_eRROR_DETECTED == 0) {
        var footerRec = '';
        var preparedBy = formFooter.getForm().findField('PreparedBy').getValue();
        var preparedDate = formFooter.getForm().findField('DatePrepared').getValue();
        var issuedBy = formFooter.getForm().findField('IssuedBy').getValue();
        var issuedDate = formFooter.getForm().findField('DateIssued').getValue();
        var approvedBy = formFooter.getForm().findField('ApprovedBy').getValue();
        var approvedDate = formFooter.getForm().findField('DateApproved').getValue();
        var receivedBy = formFooter.getForm().findField('ReceivedBy').getValue();
        var receivedDate = formFooter.getForm().findField('DateReceived').getValue();
        var authorizedBy = formFooter.getForm().findField('AuthorizedBy').getValue();
        var authorizedDate = formFooter.getForm().findField('DateAuthorized').getValue();

        if (preparedDate != '')
            preparedDate = preparedDate.format('M/d/yyyy');
        if (issuedDate != '')
            issuedDate = issuedDate.format('M/d/yyyy');
        if (approvedDate != '')
            approvedDate = approvedDate.format('M/d/yyyy');
        if (receivedDate != '')
            receivedDate = receivedDate.format('M/d/yyyy');
        if (authorizedDate != '')
            authorizedDate = authorizedDate.format('M/d/yyyy');

        footerRec = footerRec + preparedBy + ':' +
            preparedDate + ':' +
            issuedBy + ':' +
            issuedDate + ':' +
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
            success: function () {
                form.getForm().reset();
                formFooter.getForm().reset();

                Ext.getCmp('FAVouchersATV-grid').onNextEntry();
                if (isClosed) {
                    var wind = Ext.WindowMgr.getActive();
                    if (wind) {
                        wind.purgeListeners();
                        wind.close();
                    }
                }
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
    }
};

var OnEditATV = function () {

    var grid = Ext.getCmp('FAVouchersATVMain-grid');
    if (!grid.getSelectionModel().hasSelection()) return;
    var id = grid.getSelectionModel().getSelected().get('Id');
    var isPosted = false;// grid.getSelectionModel().getSelected().get('IsPosted');

    new Ext.core.finance.ux.FAVouchersATV.Window({
        FAVouchersATVId: id,
        FAVouchersATVIsPosted: isPosted,
        title: 'Edit ATV'
    }).show();
    //var isChecked = grid.getSelectionModel().getSelected().get('IsChecked');

    //var hasCheckPermission = Ext.core.finance.ux.Reception.getPermission('FA Store Issue Voucher', 'CanCheck');
    //if (hasCheckPermission == true) {
    //    new Ext.core.finance.ux.FAVouchersATV.Window({
    //        FAVouchersATVId: id,
    //        FAVouchersATVIsPosted: isPosted,
    //        title: 'Edit ATV'
    //    }).show();
    //} else if (isChecked == true && hasCheckPermission == false) {
    //    new Ext.core.finance.ux.FAVouchersATV.Window({
    //        FAVouchersATVId: id,
    //        FAVouchersATVIsPosted: true,
    //        title: 'Edit ATV'
    //    }).show();
    //} else if (isChecked == false && hasCheckPermission == false) {
    //    new Ext.core.finance.ux.FAVouchersATV.Window({
    //        FAVouchersATVId: id,
    //        FAVouchersATVIsPosted: isPosted,
    //        title: 'Edit ATV'
    //    }).show();
    //}
};
/**
* @desc      Banks registration form
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.FAVouchersATVFooter
* @class     Ext.core.finance.ux.FAVouchersATVFooter.Form
* @extends   Ext.form.FormPanel
*/
Ext.core.finance.ux.FAVouchersATVFooter.Form = function (config) {
    Ext.core.finance.ux.FAVouchersATVFooter.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: FixedAssetVoucher.Get
            // submit: FAVouchersATVFooter.Save

        },
        paramOrder: ['Id'],
        defaults: {
            labelStyle: 'text-align:left;',
            msgTarget: 'side'

        },
        id: 'FAVouchersATVFooter-form',
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
                    disabled: true,
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
                    hiddenName: 'IssuedBy',
                    xtype: 'combo',
                    emptyText: 'Issued By',
                    typeAhead: false,
                    hideTrigger: true,
                    disabled: true,
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
                    name: 'DateIssued',
                    xtype: 'datefield',
                    editable: true,
                    altFormats: 'c',
                    disabled: true,
                    anchor: '70%',
                    emptyText: "Date Issued",
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
                   disabled: true,
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
                    disabled: true,
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

                   disabled: true,
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

                   disabled: true,
                   altFormats: 'c',
                   anchor: '70%',
                   emptyText: "Date Received",
                   allowBlank: true
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
                   hidden: true,
                   emptyText: 'Authorized By',
                   typeAhead: false,
                   hideTrigger: true,
                   disabled: true,
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
                   disabled: true,
                   hidden: true,
                   editable: true,
                   anchor: '70%',
                   emptyText: "Date Authorized",
                   allowBlank: true
               }]

            }]
        }]
    }, config));
}
Ext.extend(Ext.core.finance.ux.FAVouchersATVFooter.Form, Ext.form.FormPanel);
Ext.reg('FAVouchersATVFooter-form', Ext.core.finance.ux.FAVouchersATVFooter.Form);

/**
* @desc      ATV registration form host window
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.FAVouchersATV
* @class     Ext.core.finance.ux.FAVouchersATV.Window
* @extends   Ext.Window
*/
Ext.core.finance.ux.FAVouchersATV.Window = function (config) {
    Ext.core.finance.ux.FAVouchersATV.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        width: 870,
        height: 630,
        closeAction: 'close',
        modal: true,
        resizable: false,
        maximizable: true,
        minimizable: true,
        buttonAlign: 'right',
        bodyStyle: 'padding:0px;',
        listeners: {
            show: function () {
                var footerForm = Ext.getCmp('FAVouchersATVFooter-form');

                var loggedInUserFullName = Ext.getCmp('loggedInUserFullName-toolbar');

                footerForm.getForm().findField('PreparedBy').setValue(loggedInUserFullName.value);
                this.form.getForm().findField('Id').setValue(this.FAVouchersATVId);
                if (this.FAVouchersATVId != '') {
                    this.form.load({ params: { Id: this.FAVouchersATVId } });
                    LoadATVGridDetails(this.FAVouchersATVId);
                    footerForm.load({ params: { Id: this.FAVouchersATVId } });

                    if (this.FAVouchersATVIsPosted) {
                        isATVVoucherPosted = true;
                        this.form.setDisabled(true);
                    } else {
                        isATVVoucherPosted = false;
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
                                ATVHandlers.onSaveATVClick(true);
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
            }, maximize: function () {
                var grid = Ext.getCmp('FAVouchersATV-grid');
                grid.setSize(1330, 350);
            }, restore: function (window) {

                window.setWidth(870);
                window.setHeight(630);
                var grid = Ext.getCmp('FAVouchersATV-grid');
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
Ext.extend(Ext.core.finance.ux.FAVouchersATV.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.core.finance.ux.FAVouchersATV.Form();
        this.grid = new Ext.core.finance.ux.FAVouchersATV.Grid();
        this.form2 = new Ext.core.finance.ux.FAVouchersATVFooter.Form();
        this.items = [this.form, this.grid, this.form2];

        this.buttons = [{
            text: 'Close',
            iconCls: 'icon-exit',
            handler: this.onClose,
            scope: this
        }];

        Ext.core.finance.ux.FAVouchersATV.Window.superclass.initComponent.call(this, arguments);
    },

    onClose: function () {
        this.close();
    }
});
Ext.reg('FAVouchersATV-window', Ext.core.finance.ux.FAVouchersATV.Window);

var ATVSelModel = new Ext.grid.CheckboxSelectionModel();
/**
* @desc      ATV grid
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.FAVouchersATV
* @class     Ext.core.finance.ux.FAVouchersATVMain.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.core.finance.ux.FAVouchersATVMain.Grid = function (config) {
    Ext.core.finance.ux.FAVouchersATVMain.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: FixedAssetVoucher.GetAllHeaders,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record|vType',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Code',
                direction: 'ASC'
            },
            fields: ['Id', 'VoucherType', 'ReferenceNo', 'Date'],
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
        id: 'FAVouchersATVMain-grid',
        searchCriteria: {},
        pageSize: 38,
        gridVoucherType: 'ATV',
        //height: 600,
        stripeRows: true,
        columnLines: true,
        border: false,
        sm: ATVSelModel,
        viewConfig: {
            forceFit: true,
            autoFill: true
        },
        listeners: {
            rowClick: function () {
                if (!this.getSelectionModel().hasSelection()) return;
                var id = this.getSelectionModel().getSelected().get('Id');
                var form = Ext.getCmp('FAVouchersATV-form');
                if (id != null) {

                }
            },
            scope: this,
            rowdblclick: function () {


                var hasEditPermission = Ext.core.finance.ux.Reception.getPermission('FA Store Issue Voucher', 'CanEdit');
                if (hasEditPermission) {
                    OnEditATV();
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
        }, ATVSelModel, new Ext.erp.ux.grid.PagingRowNumberer(),
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
         }]
    }, config));
};
Ext.extend(Ext.core.finance.ux.FAVouchersATVMain.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ SearchText: '', SearchBy: '', FromDate: '', ToDate: '', mode: 'get' }), vType: 'ATV' };

        this.tbar = [];
        this.bbar = new Ext.PagingToolbar({
            id: 'FAVouchersATVMain-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.core.finance.ux.FAVouchersATVMain.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getStore().load({
            params: { start: 0, limit: this.pageSize, vType: this.gridVoucherType }
        });
        Ext.core.finance.ux.FAVouchersATVMain.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('FAVouchersATVMain-grid', Ext.core.finance.ux.FAVouchersATVMain.Grid);

var SCriteria = '';
var LoadATVGridDetails = function (selectedRow) {

    var crvDetailGrid = Ext.getCmp('FAVouchersATV-grid');
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
    fn: function (e, ele) {
        ele.preventDefault();
        ATVHandlers.onSaveATVClick(false);
        ele.preventDefault();
    }
}]);
var gridInstance;
var gridRowType;
var iRow;
var iDept;
var iFixedAsset;
var iUnit;

var mnuATVContext = new Ext.menu.Menu({
    items: [{
        id: 'btnATVInsertRow',
        iconCls: 'icon-RowAdd',
        text: 'Insert Row'
    }, {
        id: 'btnATVRemoveRow',
        iconCls: 'icon-RowDelete',
        text: 'Remove Row'
    },
            '-'
    , {
        id: 'btnATVCopyRow',
        iconCls: 'icon-Copy',
        text: 'Copy Row'
    }, {
        id: 'btnATVPasteRow',
        iconCls: 'icon-Paste',
        text: 'Paste Row',
        disabled: true
    }],
    listeners: {
        itemclick: function (item) {
            if (isATVVoucherPosted) {
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
                case 'btnATVInsertRow':
                    {
                        var grid = Ext.getCmp('FAVouchersATV-grid');
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
                            UnitPrice: 0,
                            TotalPrice: 0
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
                case 'btnATVRemoveRow':
                    {
                        var grid = Ext.getCmp('FAVouchersATV-grid');
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
                        ATVHandlers.onDeleteATVRowClick();
                    }
                    break;
                case 'btnATVCopyRow':
                    {
                        gridInstance = Ext.getCmp('FAVouchersATV-grid');
                        gridRowType = gridInstance.getStore().recordType;
                        iRow = new gridRowType({
                            UnitPrice: 0,
                            TotalPrice: 0
                        });

                        var grid = Ext.getCmp('FAVouchersATV-grid');
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
                        var acctId = record.data.FixedAssetId;
                        var cm = grid.getColumnModel();
                        var col = cm.getColumnAt(6);
                        var editor = col.editor;
                        var store = editor.store;


                        if (acctId != null) {
                            var s = store.getById(acctId);

                            if (s != null)
                                iFixedAsset = store.getById(acctId).data.FixedAsset;
                            else
                                iFixedAsset = record.data.FixedAsset;
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
                        var UnitId = record.data.UnitId;
                        col = cm.getColumnAt(8);
                        editor = col.editor;
                        store = editor.store;
                        if (UnitId != null) {
                            var s = store.getById(UnitId);
                            if (s != null)
                                iUnit = store.getById(UnitId).data.Code;
                            else
                                iUnit = record.data.Unit;
                        }
                        /////////////////////////////////////////////////////

                        iRow = record;

                        var k = Ext.getCmp('btnATVPasteRow');
                        k.setDisabled(false);

                    }
                    break;
                case 'btnATVPasteRow':
                    {
                        var grid = Ext.getCmp('FAVouchersATV-grid');
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
                            FixedAssetId: iRow.data.FixedAssetId,
                            FixedAsset: iFixedAsset,
                            UnitId: iRow.data.UnitId,
                            Unit: iUnit,
                            CriteriaId: iRow.data.CriteriaId,
                            Criteria: iRow.data.Criteria,
                            ReferenceCode: iRow.data.ReferenceCode,
                            UnitPrice: iRow.data.UnitPrice,
                            TotalPrice: iRow.data.TotalPrice
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

            }
        }
    }
});
/**
* @desc      FAVouchersATV grid
* @author    Dawit Kiros
* @copyright (c) 2010, Cybersoft
* @date      November 01, 2010
* @namespace Ext.core.finance.ux.FAVouchersATV
* @class     Ext.core.finance.ux.FAVouchersATV.Grid
* @extends   Ext.grid.GridPanel
*/
var isATVVoucherPosted = false;
Ext.core.finance.ux.FAVouchersATV.Grid = function (config) {
    Ext.core.finance.ux.FAVouchersATV.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: window.FixedAssetVoucher.GetAllDetails,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',

            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Code',
                direction: 'ASC'
            },
            fields: ['Id', 'FixedAssetId', 'FixedAsset', 'UnitId', 'Unit', 'Quantity', 'UnitPrice', 'TotalPrice'],
            remoteSort: true,
            listeners: {
                beforeLoad: function () {
                    Ext.getCmp('FAVouchersATV-grid').body.mask('Loading...', 'x-mask-loading');
                },
                load: function () {
                    var grid = Ext.getCmp('FAVouchersATV-grid');
                    var store = grid.getStore();

                    grid.body.unmask();
                },
                loadException: function () {
                    Ext.getCmp('FAVouchersATV-grid').body.unmask();
                },
                remove: function (store) {
                    var grid = Ext.getCmp('FAVouchersATV-grid');

                },
                scope: this
            }
        }),
        id: 'FAVouchersATV-grid',
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
                            //g.addRow();
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
                itemcontextmenu: function (view, rec, node, index, e) {
                    e.stopEvent();
                    contextMenu.showAt(e.getXY());
                    return false;
                }
            }
        },
        listeners: {


            afteredit: function (e) {
                var record = e.record;
                var grid = Ext.getCmp('FAVouchersATV-grid');
                var store, cm;
                if (e.field == 'FixedAsset') {
                    cm = grid.getColumnModel();
                    var FixedAssetCol = cm.getColumnAt(2);
                    var editor = FixedAssetCol.editor;
                    store = editor.store;
                    if (store.data.length == 0) {
                        record.set('FixedAsset', '');
                        record.set('FixedAssetId', '');
                    } else {
                        try {
                            var FixedAssetName = store.getById(editor.getValue()).data.Name;
                            var FixedAssetId = store.getById(editor.getValue()).data.Id;

                            record.set('FixedAssetId', FixedAssetId);

                        } catch (e) {
                            record.set('FixedAssetId', '');
                            Ext.MessageBox.show({
                                title: 'Error',
                                msg: 'FixedAsset Not Selected. Please enter the FixedAsset Code appropriately!',
                                buttons: Ext.Msg.OK,
                                icon: Ext.MessageBox.ERROR,
                                scope: this
                            });
                        }
                    }
                }
                else if (e.field == 'Unit') {
                    cm = grid.getColumnModel();
                    var FixedAssetCol = cm.getColumnAt(4);
                    var editor = FixedAssetCol.editor;
                    store = editor.store;
                    if (store.data.length == 0) {
                        record.set('Unit', '');
                        record.set('UnitId', '');
                    } else {
                        try {
                            var FixedAssetName = store.getById(editor.getValue()).data.Name;
                            var FixedAssetId = store.getById(editor.getValue()).data.Id;

                            record.set('UnitId', FixedAssetId);

                        } catch (e) {
                            record.set('UnitId', '');
                            Ext.MessageBox.show({
                                title: 'Error',
                                msg: 'Unit Not Selected. Please enter the Unit Code appropriately!',
                                buttons: Ext.Msg.OK,
                                icon: Ext.MessageBox.ERROR,
                                scope: this
                            });
                        }
                    }
                }
            },
            rowcontextmenu: function (grid, index, event) {
                event.stopEvent();
                mnuATVContext.showAt(event.xy);
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
            dataIndex: 'FixedAsset',
            header: 'FixedAsset',
            sortable: false,
            width: 75,
            menuDisabled: false
        }, {
            dataIndex: 'FixedAssetId',
            header: 'FixedAssetId',
            sortable: false,
            width: 200,
            hidden: true,
            menuDisabled: true,
            align: 'left'
        }, {
            dataIndex: 'Unit',
            header: 'Unit',
            sortable: false,
            width: 75,
            menuDisabled: true
        }, {
            dataIndex: 'UnitId',
            header: 'UnitId',
            sortable: false,
            width: 200,
            hidden: true,
            menuDisabled: true,
            align: 'left'
        }, {
            dataIndex: 'Quantity',
            header: 'Quantity',
            sortable: false,
            width: 90,
            menuDisabled: true,
            align: 'right'
        }, {
            dataIndex: 'UnitPrice',
            header: 'Unit Price',
            sortable: false,
            width: 90,
            menuDisabled: true,
            align: 'right'
        }, {
            dataIndex: 'TotalPrice',
            header: 'Total Price',
            sortable: false,
            width: 90,
            menuDisabled: true,
            align: 'right'
        }]
    }, config));
};
Ext.extend(Ext.core.finance.ux.FAVouchersATV.Grid, Ext.grid.EditorGridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ voucherTypeId: this.voucherTypeId }) };
        this.tbar = [{
            xtype: 'button',
            text: 'Select Items',
            id: 'ATVItemSelector',
            iconCls: 'icon-RowAdd',
            handler: function () {
                var custodianId = Ext.getCmp('TransferFromId').getValue();
                if (custodianId == '') {
                    Ext.MessageBox.show({
                        title: 'Custodian not selected',
                        msg: 'You must select a custodian.',
                        buttons: Ext.Msg.OK,
                        icon: Ext.MessageBox.INFO,
                        scope: this
                    });
                    return;
                }
                var empWindow = new Ext.core.finance.ux.FASelection.Window({ Caller: 'AssetTransferVoucher', CustodianId: custodianId });
                empWindow.show();
            }
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Remove Row',
            id: 'ATVRemoveRow',
            iconCls: 'icon-RowDelete',
            handler: ATVHandlers.onDeleteATVRowClick
        }

        ];
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
        }];
        Ext.core.finance.ux.FAVouchersATV.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        //this.addRow();
        Ext.core.finance.ux.FAVouchersATV.Grid.superclass.afterRender.apply(this, arguments);
    },
    addRow: function () {
        var grid = Ext.getCmp('FAVouchersATV-grid');
        var store = grid.getStore();
        var voucher = store.recordType;
        var p = new voucher({

            Quantity: 0,
            UnitPrice: 0,
            TotalPrice: 0

        });
        var count = store.getCount();
        grid.stopEditing();
        store.insert(count, p);
        if (count > 0) {
            grid.startEditing(count, 3);
        }
    },


    onNewClick: function () {
        var voucherHeaderGrid = Ext.getCmp('voucherHeader-grid');
        voucherHeaderGrid.getSelectionModel().deselectRange(0, voucherHeaderGrid.pageSize);

        var form = Ext.getCmp('voucher-form').getForm();
        form.reset();

        Ext.getCmp('voucher-defaultFixedAsset').hide();

        var voucherDetailGrid = Ext.getCmp('FAVouchersATV-grid');
        var voucherDetailStore = voucherDetailGrid.getStore();
        voucherDetailStore.removeAll();
        //voucherDetailGrid.addRow();
    },
    onNextEntry: function () {
        var form = Ext.getCmp('FAVouchersATV-form').getForm();
        var voucherHeaderGrid = Ext.getCmp('voucherHeader-grid');
        var voucherDetailGrid = Ext.getCmp('FAVouchersATV-grid');
        var voucherDetailStore = voucherDetailGrid.getStore();

        form.findField('Id').reset();


        voucherDetailStore.removeAll();
        //voucherDetailGrid.addRow();


    },
    onSaveClick: function () {
        var grid = Ext.getCmp('FAVouchersATV-grid');
        var form = Ext.getCmp('FAVouchersATV-form');
        var formFooter = Ext.getCmp('FAVouchersATVFooter-form');
        if (!form.getForm().isValid() || !formFooter.getForm().isValid()) return;
        var store = grid.getStore();
        var rec = '';

        store.each(function (item) {
            if (item.data['FixedAssetId'] != '' && item.data['UnitId'] != '' && item.data['Quantity'] != '') {
                if ((item.data['Quantity'] != 0)) {
                    rec = rec + item.data['Id'] + ':' +
                        item.data['FixedAssetId'] + ':' +
                        item.data['UnitId'] + ':' +
                        item.data['Quantity'] + ':' +
                        item.data['UnitPrice'] + ':' +
                        item.data['TotalPrice'] + ';';
                }
            }
        });

        var footerRec = '';
        var preparedBy = formFooter.getForm().findField('PreparedBy').getValue();
        var preparedDate = formFooter.getForm().findField('PreparedDate').getValue();
        var issuedBy = formFooter.getForm().findField('IssuedBy').getValue();
        var issuedDate = formFooter.getForm().findField('IssuedDate').getValue();
        var approvedBy = formFooter.getForm().findField('ApprovedBy').getValue();
        var approvedDate = formFooter.getForm().findField('ApprovedDate').getValue();

        footerRec = footerRec + preparedBy + ':' +
                        preparedDate + ':' +
                        issuedBy + ':' +
                        issuedDate + ':' +
                        approvedBy + ':' +
                        approvedDate + ';';

        form.getForm().submit({
            waitMsg: 'Please wait...',
            params: { record: Ext.encode({ voucherDetails: rec, voucherFooter: footerRec }) },
            success: function () {
                Ext.getCmp('FAVouchersATV-grid').onNextEntry();
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
        var grid = Ext.getCmp('FAVouchersATV-grid');
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
Ext.reg('FAVouchersATV-grid', Ext.core.finance.ux.FAVouchersATV.Grid);

/**
* @desc      ATV panel
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @version   $Id: FAVouchersATV.js, 0.1
* @namespace Ext.core.finance.ux.FAVouchersATV
* @class     Ext.core.finance.ux.FAVouchersATV.Panel
* @extends   Ext.Panel
*/
Ext.core.finance.ux.FAVouchersATV.Panel = function (config) {
    Ext.core.finance.ux.FAVouchersATV.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false,
        tbar: {
            xtype: 'toolbar',
            items: [{
                xtype: 'button',
                text: 'Add',
                id: 'addFAVouchersATV',
                iconCls: 'icon-add',
                handler: this.onAddClick,
                disabled: !Ext.core.finance.ux.Reception.getPermission('FA Store Issue Voucher', 'CanAdd')
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Edit',
                id: 'editFAVouchersATV',
                iconCls: 'icon-edit',
                handler: this.onEditClick,
                disabled: !Ext.core.finance.ux.Reception.getPermission('FA Store Issue Voucher', 'CanEdit')
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Delete',
                id: 'deleteFAVouchersATV',
                iconCls: 'icon-delete',
                handler: this.onDeleteClick,
                disabled: !Ext.core.finance.ux.Reception.getPermission('FA Store Issue Voucher', 'CanDelete')
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Check',
                id: 'checkFAVouchersATV',
                iconCls: 'icon-check',
                hidden: true,
                handler: function () {
                    onATVStatusChange('Check');
                },
                disabled: !Ext.core.finance.ux.Reception.getPermission('FA Store Issue Voucher', 'CanCheck')
            }, {
                xtype: 'button',
                text: 'Change Location',
                id: 'changeLocFAVouchersATV',
                iconCls: 'icon-check',
                handler: function () {
                    new Ext.core.finance.ux.faChangeLocation.Window({
                        title: 'Change Location'
                    }).show();
                },

            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Approve',
                id: 'approveFAVouchersATV',
                iconCls: 'icon-approve',
                handler: function () {
                    onATVStatusChange('Approve');
                },
                disabled: !Ext.core.finance.ux.Reception.getPermission('FA Store Issue Voucher', 'CanApprove')
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Authorize',
                hidden: true,
                id: 'authorizeFAVouchersATV',
                iconCls: 'icon-authorize',
                handler: function () {
                    onATVStatusChange('Authorize');
                },
                disabled: !Ext.core.finance.ux.Reception.getPermission('FA Store Issue Voucher', 'CanAuthorize')
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Export',
                id: 'btnATVPreviewExport',
                iconCls: 'icon-Preview',
                handler: this.onATVPreviewClick
                //disabled: !Ext.core.finance.ux.Reception.getPermission('JVR', 'CanDelete')
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Print',
                id: 'previewFAVouchersATV',
                iconCls: 'icon-Print',
                handler: this.onATVPrintClick
                //disabled: !Ext.core.finance.ux.Reception.getPermission('JVR', 'CanDelete')
            }, {
                xtype: 'button',
                text: 'Import Tool',
                id: 'importToolFAVouchersATV',
                iconCls: 'icon-win',
                handler: this.onRunATVImportTool,
                hidden: true
                //disabled: !Ext.core.finance.ux.Reception.getPermission('JVR', 'CanDelete')
            }, '->', {
                id: 'cmbATVSearchBy',
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
                hidden: true,
                store: new Ext.data.ArrayStore({
                    fields: ['Id', 'Criteria'],
                    data: [[1, 'Reference No'], [2, 'Date']]
                }),
                valueField: 'Criteria',
                displayField: 'Criteria',
                listeners: {
                    'select': function (cmb, rec, idx) {

                        var changeTypeCombo = this.getValue();
                        var startDate = Ext.getCmp('ATVSearchFromDate');
                        var endDate = Ext.getCmp('ATVSearchToDate');
                        var srchTxt = Ext.getCmp('ATVSearchText');

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
                id: 'ATVSearchText',
                xtype: 'textfield',
                anchor: '95%',
                emptyText: 'Search Text',
                allowBlank: true,
                hidden: true,
                listeners: {
                    specialkey: function (field, e) {
                        if (e.getKey() == e.ENTER) {
                            onSearchATVHit();
                        }
                    }
                }

            }, ' ', {
                id: 'ATVSearchFromDate',
                xtype: 'datefield',
                anchor: '95%',
                emptyText: 'From Date',
                allowBlank: true,
                hidden: true,
                listeners: {
                    specialkey: function (field, e) {
                        if (e.getKey() == e.ENTER) {
                            onSearchATVHit();
                        }
                    }
                }

            }, ' ', {
                id: 'ATVSearchToDate',
                xtype: 'datefield',
                anchor: '95%',
                emptyText: 'To Date',
                allowBlank: true,
                hidden: true,
                listeners: {
                    specialkey: function (field, e) {
                        if (e.getKey() == e.ENTER) {
                            onSearchATVHit();
                        }
                    }
                }

            }, ' ', {
                xtype: 'button',
                tooltip: 'Search',
                id: 'btnSearchATVs',

                iconCls: 'icon-filter',
                handler: this.onShowSearchWindow

            }, {
                xtype: 'button',
                tooltip: 'Search',
                id: 'searchFAVouchersATV',
                iconCls: 'icon-filter',
                hidden: true,
                handler: this.onATVSearchClick

            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                tooltip: 'Reset Search',
                id: 'resetFAVouchersATV',
                iconCls: 'icon-refresh',
                handler: this.onATVRefreshClick

            }]
        }
    }, config));
}
Ext.extend(Ext.core.finance.ux.FAVouchersATV.Panel, Ext.Panel, {
    initComponent: function () {
        this.items = [{
            xtype: 'FAVouchersATVMain-grid',
            id: 'FAVouchersATVMain-grid'
        }];
        Ext.core.finance.ux.FAVouchersATV.Panel.superclass.initComponent.apply(this, arguments);
    },

    onAddClick: function () {
        new Ext.core.finance.ux.FAVouchersATV.Window({
            FAVouchersATVId: 0,
            title: 'Add ATV'
        }).show();
    },
    onEditClick: function () {
        OnEditATV();
    },
    onDeleteClick: function () {
        var grid = Ext.getCmp('FAVouchersATVMain-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        Ext.MessageBox.show({
            title: 'Delete',
            msg: 'Are you sure you want to delete the selected FixedAsset?',
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
                        Ext.getCmp('FAVouchersATVMain-paging').doRefresh();
                    }, this);
                }
            }
        });
    },
    onShowSearchWindow: function () {
        new Ext.core.finance.ux.FinanceVouchersSearch.Window({
            title: 'Search ATV',
            caller: 'ATV'
        }).show();
    },
    onATVPrintClick: function () {

        var reportType = 'rpt_ATV';
        var grid = Ext.getCmp('FAVouchersATVMain-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var voucherHeaderId = grid.getSelectionModel().getSelected().get('Id');
        FinanceReports.ViewReport(reportType, voucherHeaderId, function (result, response) {
            if (result.success) {
                var url = result.URL;
                var voucherType = 'ATV';
                var reportType = 'Voucher';
                var isPrint = 1;
                windowParameter = 'width=900,height=700,toolbar=yes,location=yes,directories=yes,status=yes,menubar=yes,scrollbars=yes,copyhistory=yes,resizable=yes';
                window.open('Reports/Financial/FinancialReportsViewer.aspx?rt=' + reportType + '&id=' + voucherHeaderId + '&vt=' + voucherType + '&printMode=' + true, '', windowParameter);

            }

        });

    },
    onATVPreviewClick: function () {

        var reportType = 'rpt_ATV';
        var grid = Ext.getCmp('FAVouchersATVMain-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var voucherHeaderId = grid.getSelectionModel().getSelected().get('Id');
        FinanceReports.ViewReport(reportType, voucherHeaderId, function (result, response) {
            if (result.success) {
                var url = result.URL;
                var voucherType = 'ATV';
                var reportType = 'Voucher';
                var isPrint = 0;
                windowParameter = 'width=900,height=700,toolbar=yes,location=yes,directories=yes,status=yes,menubar=yes,scrollbars=yes,copyhistory=yes,resizable=yes';
                window.open('Reports/Financial/FinancialReportsViewer.aspx?rt=' + reportType + '&id=' + voucherHeaderId + '&vt=' + voucherType + '&printMode=' + false, '', windowParameter);

            }

        });

    },
    onATVSearchClick: function () {
        //        var jvGrid = Ext.getCmp('FAVouchersATVMain-grid');
        //        var jvStore = jvGrid.getStore();
        //        var txt = Ext.getCmp('ATVSearchText').getValue();
        //        var srchBy = Ext.getCmp('cmbATVSearchBy').getValue();
        //        var startDate = Ext.getCmp('ATVSearchFromDate').getValue();
        //        var endDate = Ext.getCmp('ATVSearchToDate').getValue();
        //        
        //        jvStore.baseParams = { record: Ext.encode({ SearchText: txt, SearchBy: srchBy,FromDate: startDate, ToDate:endDate, mode: 'search' }), vType: 'ATV' };
        //        
        //        jvStore.load({
        //            params: { start: 0, limit: 100 }
        //        });
        onSearchATVHit();
    },
    onATVRefreshClick: function () {
        var jvGrid = Ext.getCmp('FAVouchersATVMain-grid');
        Ext.getCmp('cmbATVSearchBy').reset();
        Ext.getCmp('ATVSearchFromDate').reset();
        Ext.getCmp('ATVSearchToDate').reset();
        Ext.getCmp('ATVSearchText').reset();

        var jvStore = jvGrid.getStore();

        jvStore.baseParams = { record: Ext.encode({ SearchText: '', SearchBy: '', FromDate: '', ToDate: '', mode: 'get' }), vType: 'ATV' };

        jvStore.load({
            params: { start: 0, limit: 100 }
        });
    }, onRunATVImportTool: function () {
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
var onATVStatusChange = function (status) {
    //onATVStatusChange: function (status) {
    var grid = Ext.getCmp('FAVouchersATVMain-grid');
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
            Ext.getCmp('FAVouchersATVMain-paging').doRefresh();
            Ext.MessageBox.alert('Status', status + 'd successfully.');
        } else {
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
Ext.reg('FAVouchersATV-panel', Ext.core.finance.ux.FAVouchersATV.Panel);

var onSearchATVHit = function () {
    var jvGrid = Ext.getCmp('FAVouchersATVMain-grid');
    var jvStore = jvGrid.getStore();
    var txt = Ext.getCmp('ATVSearchText').getValue();
    var srchBy = Ext.getCmp('cmbATVSearchBy').getValue();
    var startDate = Ext.getCmp('ATVSearchFromDate').getValue();
    var endDate = Ext.getCmp('ATVSearchToDate').getValue();

    jvStore.baseParams = { record: Ext.encode({ SearchText: txt, SearchBy: srchBy, FromDate: startDate, ToDate: endDate, mode: 'search' }), vType: 'ATV' };

    jvStore.load({
        params: { start: 0, limit: 100 }
    });
};