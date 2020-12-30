Ext.ns('Ext.core.finance.ux.InvVouchersCRnV');
Ext.ns('Ext.core.finance.ux.InvVouchersCRnVMain');
Ext.ns('Ext.core.finance.ux.InvVouchersCRnVFooter');
/**
* @desc      CRnV registration form
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.InvVouchersCRnV
* @class     Ext.core.finance.ux.InvVouchersCRnV.Form
* @extends   Ext.form.FormPanel
*/
Ext.core.finance.ux.InvVouchersCRnV.Form = function (config) {
    Ext.core.finance.ux.InvVouchersCRnV.Form.superclass.constructor.call(this, Ext.apply({
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
        id: 'InvVouchersCRnV-form',
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
                id: 'newVoucherCRnV',
                iconCls: 'icon-add',
                handler: CRnVHandlers.onNewCRnVClick
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Save',
                id: 'saveVoucherCRnV',
                iconCls: 'icon-save',
                handler: function () {
                    handler: CRnVHandlers.onSaveCRnVClick(false);
                }

            }, {
                xtype: 'tbseparator',
                hidden: true
            }, {
                xtype: 'button',
                text: 'Remove Row',
                hidden: true,
                id: 'deleteVoucherDetailCRnV',
                iconCls: 'icon-RowDelete',
                handler: CRnVHandlers.onDeleteCRnVRowClick
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Insert Row',
                hidden: true,
                id: 'insertVoucherDetailCRnV',
                iconCls: 'icon-RowAdd',
                handler: CRnVHandlers.onInsertCRnVRowClick
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
                   value: 'CRnV'
               }, {
                   hiddenName: 'LocationId',
                   xtype: 'combo',
                   fieldLabel: 'Location',
                   triggerAction: 'all',
                   mode: 'local',
                   hidden: true,
                   editable: true,
                   typeAhead: true,
                   forceSelection: true,
                   emptyText: '- Select Location -',
                   allowBlank: true,
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
               }, {
                   id: 'ReturnedById',
                   hiddenName: 'ReturnedById',
                   xtype: 'combo',
                   fieldLabel: 'Returned By',
                   triggerAction: 'all',
                   mode: 'local',
                   editable: true,
                   typeAhead: true,
                   listWidth: 250,
                   allowBlank: true,
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
                   id: 'ReturnedToId',
                   hiddenName: 'ReturnedToId',
                   xtype: 'combo',
                   fieldLabel: 'Returned To ',
                   triggerAction: 'all',
                   mode: 'local',
                   editable: true,
                   typeAhead: true,
                   listWidth: 250,
                   allowBlank: true,
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
                            var form = Ext.getCmp('InvVouchersCRnV-form').getForm();

                            var date = form.findField('Date').getValue();
                            var location = form.findField('LocationId').getValue();

                            window.FinanceVoucher.GetVoucherInfo('CRnV', date, location, function (result, response) {
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
                    fieldLabel: 'CRnV No',
                    anchor: '95%',
                    disabled: false,
                    allowBlank: false
                }
                ]

            }]
        }]
    }, config));

},

Ext.extend(Ext.core.finance.ux.InvVouchersCRnV.Form, Ext.form.FormPanel);
Ext.reg('InvVouchersCRnV-form', Ext.core.finance.ux.InvVouchersCRnV.Form);

var CRnVHandlers = function () {
    return {
        onSaveCRnVClick: function (isClosed) {
            SaveCRnV(isClosed);
        },
        onDeleteCRnVRowClick: function () {
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
                        var grid = Ext.getCmp('InvVouchersCRnV-grid');
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
        onInsertCRnVRowClick: function () {
            var gridCRnV = Ext.getCmp('InvVouchersCRnV-grid');
            //gridCRnV.addRow();
        },

        onNewCRnVClick: function () {
            var form = Ext.getCmp('InvVouchersCRnV-form');
            var dirty = form.getForm().isDirty();
            var formFooter = Ext.getCmp('InvVouchersCRnVFooter-form');

            if (dirty)
                Ext.MessageBox.show({
                    title: 'Save Changes',
                    msg: 'Do you want to save the changes made before opening a new Document?',
                    buttons: Ext.Msg.YESNOCANCEL,
                    fn: function (btnId) {
                        if (btnId === 'yes') {
                            CRnVHandlers.onSaveCRnVClick(false);

                        }
                        else if (btnId === 'no') {
                            form.getForm().reset();
                            formFooter.getForm().reset();
                            Ext.getCmp('InvVouchersCRnV-grid').onNextEntry();
                        }
                    }
                });

            return !dirty;
        }
    }
}();

var SaveCRnV = function (isClosed) {
    var grid = Ext.getCmp('InvVouchersCRnV-grid');
    var form = Ext.getCmp('InvVouchersCRnV-form');
    var formFooter = Ext.getCmp('InvVouchersCRnVFooter-form');
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

                Ext.getCmp('InvVouchersCRnV-grid').onNextEntry();
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

var OnEditCRnV = function () {

    var grid = Ext.getCmp('InvVouchersCRnVMain-grid');
    if (!grid.getSelectionModel().hasSelection()) return;
    var id = grid.getSelectionModel().getSelected().get('Id');
    var isPosted = false;// grid.getSelectionModel().getSelected().get('IsPosted');

    new Ext.core.finance.ux.InvVouchersCRnV.Window({
        InvVouchersCRnVId: id,
        InvVouchersCRnVIsPosted: isPosted,
        title: 'Edit CRnV'
    }).show();
    //var isChecked = grid.getSelectionModel().getSelected().get('IsChecked');

    //var hasCheckPermission = Ext.core.finance.ux.Reception.getPermission('FA Store Issue Voucher', 'CanCheck');
    //if (hasCheckPermission == true) {
    //    new Ext.core.finance.ux.InvVouchersCRnV.Window({
    //        InvVouchersCRnVId: id,
    //        InvVouchersCRnVIsPosted: isPosted,
    //        title: 'Edit CRnV'
    //    }).show();
    //} else if (isChecked == true && hasCheckPermission == false) {
    //    new Ext.core.finance.ux.InvVouchersCRnV.Window({
    //        InvVouchersCRnVId: id,
    //        InvVouchersCRnVIsPosted: true,
    //        title: 'Edit CRnV'
    //    }).show();
    //} else if (isChecked == false && hasCheckPermission == false) {
    //    new Ext.core.finance.ux.InvVouchersCRnV.Window({
    //        InvVouchersCRnVId: id,
    //        InvVouchersCRnVIsPosted: isPosted,
    //        title: 'Edit CRnV'
    //    }).show();
    //}
};
/**
* @desc      Banks registration form
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.InvVouchersCRnVFooter
* @class     Ext.core.finance.ux.InvVouchersCRnVFooter.Form
* @extends   Ext.form.FormPanel
*/
Ext.core.finance.ux.InvVouchersCRnVFooter.Form = function (config) {
    Ext.core.finance.ux.InvVouchersCRnVFooter.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: FixedAssetVoucher.Get
            // submit: InvVouchersCRnVFooter.Save

        },
        paramOrder: ['Id'],
        defaults: {
            labelStyle: 'text-align:left;',
            msgTarget: 'side'

        },
        id: 'InvVouchersCRnVFooter-form',
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
Ext.extend(Ext.core.finance.ux.InvVouchersCRnVFooter.Form, Ext.form.FormPanel);
Ext.reg('InvVouchersCRnVFooter-form', Ext.core.finance.ux.InvVouchersCRnVFooter.Form);

/**
* @desc      CRnV registration form host window
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.InvVouchersCRnV
* @class     Ext.core.finance.ux.InvVouchersCRnV.Window
* @extends   Ext.Window
*/
Ext.core.finance.ux.InvVouchersCRnV.Window = function (config) {
    Ext.core.finance.ux.InvVouchersCRnV.Window.superclass.constructor.call(this, Ext.apply({
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
                var footerForm = Ext.getCmp('InvVouchersCRnVFooter-form');

                var loggedInUserFullName = Ext.getCmp('loggedInUserFullName-toolbar');

                footerForm.getForm().findField('PreparedBy').setValue(loggedInUserFullName.value);
                this.form.getForm().findField('Id').setValue(this.InvVouchersCRnVId);
                if (this.InvVouchersCRnVId != '') {
                    this.form.load({ params: { Id: this.InvVouchersCRnVId } });
                    LoadCRnVGridDetails(this.InvVouchersCRnVId);
                    footerForm.load({ params: { Id: this.InvVouchersCRnVId } });

                    if (this.InvVouchersCRnVIsPosted) {
                        isCRnVVoucherPosted = true;
                        this.form.setDisabled(true);
                    } else {
                        isCRnVVoucherPosted = false;
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
                                CRnVHandlers.onSaveCRnVClick(true);
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
                var grid = Ext.getCmp('InvVouchersCRnV-grid');
                grid.setSize(1330, 350);
            }, restore: function (window) {

                window.setWidth(870);
                window.setHeight(630);
                var grid = Ext.getCmp('InvVouchersCRnV-grid');
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
Ext.extend(Ext.core.finance.ux.InvVouchersCRnV.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.core.finance.ux.InvVouchersCRnV.Form();
        this.grid = new Ext.core.finance.ux.InvVouchersCRnV.Grid();
        this.form2 = new Ext.core.finance.ux.InvVouchersCRnVFooter.Form();
        this.items = [this.form, this.grid, this.form2];

        this.buttons = [{
            text: 'Close',
            iconCls: 'icon-exit',
            handler: this.onClose,
            scope: this
        }];

        Ext.core.finance.ux.InvVouchersCRnV.Window.superclass.initComponent.call(this, arguments);
    },

    onClose: function () {
        this.close();
    }
});
Ext.reg('InvVouchersCRnV-window', Ext.core.finance.ux.InvVouchersCRnV.Window);

var CRnVSelModel = new Ext.grid.CheckboxSelectionModel();
/**
* @desc      CRnV grid
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.InvVouchersCRnV
* @class     Ext.core.finance.ux.InvVouchersCRnVMain.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.core.finance.ux.InvVouchersCRnVMain.Grid = function (config) {
    Ext.core.finance.ux.InvVouchersCRnVMain.Grid.superclass.constructor.call(this, Ext.apply({
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
        id: 'InvVouchersCRnVMain-grid',
        searchCriteria: {},
        pageSize: 38,
        gridVoucherType: 'CRnV',
        //height: 600,
        stripeRows: true,
        columnLines: true,
        border: false,
        sm: CRnVSelModel,
        viewConfig: {
            forceFit: true,
            autoFill: true
        },
        listeners: {
            rowClick: function () {
                if (!this.getSelectionModel().hasSelection()) return;
                var id = this.getSelectionModel().getSelected().get('Id');
                var form = Ext.getCmp('InvVouchersCRnV-form');
                if (id != null) {

                }
            },
            scope: this,
            rowdblclick: function () {


                var hasEditPermission = Ext.core.finance.ux.Reception.getPermission('FA Store Issue Voucher', 'CanEdit');
                if (hasEditPermission) {
                    OnEditCRnV();
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
        }, CRnVSelModel, new Ext.erp.ux.grid.PagingRowNumberer(),
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
Ext.extend(Ext.core.finance.ux.InvVouchersCRnVMain.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ SearchText: '', SearchBy: '', FromDate: '', ToDate: '', mode: 'get' }), vType: 'CRnV' };

        this.tbar = [];
        this.bbar = new Ext.PagingToolbar({
            id: 'InvVouchersCRnVMain-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.core.finance.ux.InvVouchersCRnVMain.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getStore().load({
            params: { start: 0, limit: this.pageSize, vType: this.gridVoucherType }
        });
        Ext.core.finance.ux.InvVouchersCRnVMain.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('InvVouchersCRnVMain-grid', Ext.core.finance.ux.InvVouchersCRnVMain.Grid);

var SCriteria = '';
var LoadCRnVGridDetails = function (selectedRow) {

    var crvDetailGrid = Ext.getCmp('InvVouchersCRnV-grid');
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
        CRnVHandlers.onSaveCRnVClick(false);
        ele.preventDefault();
    }
}]);
var gridInstance;
var gridRowType;
var iRow;
var iDept;
var iFixedAsset;
var iUnit;

var mnuCRnVContext = new Ext.menu.Menu({
    items: [{
        id: 'btnCRnVInsertRow',
        iconCls: 'icon-RowAdd',
        text: 'Insert Row'
    }, {
        id: 'btnCRnVRemoveRow',
        iconCls: 'icon-RowDelete',
        text: 'Remove Row'
    },
            '-'
    , {
        id: 'btnCRnVCopyRow',
        iconCls: 'icon-Copy',
        text: 'Copy Row'
    }, {
        id: 'btnCRnVPasteRow',
        iconCls: 'icon-Paste',
        text: 'Paste Row',
        disabled: true
    }],
    listeners: {
        itemclick: function (item) {
            if (isCRnVVoucherPosted) {
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
                case 'btnCRnVInsertRow':
                    {
                        var grid = Ext.getCmp('InvVouchersCRnV-grid');
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
                case 'btnCRnVRemoveRow':
                    {
                        var grid = Ext.getCmp('InvVouchersCRnV-grid');
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
                        CRnVHandlers.onDeleteCRnVRowClick();
                    }
                    break;
                case 'btnCRnVCopyRow':
                    {
                        gridInstance = Ext.getCmp('InvVouchersCRnV-grid');
                        gridRowType = gridInstance.getStore().recordType;
                        iRow = new gridRowType({
                            UnitPrice: 0,
                            TotalPrice: 0
                        });

                        var grid = Ext.getCmp('InvVouchersCRnV-grid');
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

                        var k = Ext.getCmp('btnCRnVPasteRow');
                        k.setDisabled(false);

                    }
                    break;
                case 'btnCRnVPasteRow':
                    {
                        var grid = Ext.getCmp('InvVouchersCRnV-grid');
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
* @desc      InvVouchersCRnV grid
* @author    Dawit Kiros
* @copyright (c) 2010, Cybersoft
* @date      November 01, 2010
* @namespace Ext.core.finance.ux.InvVouchersCRnV
* @class     Ext.core.finance.ux.InvVouchersCRnV.Grid
* @extends   Ext.grid.GridPanel
*/
var isCRnVVoucherPosted = false;
Ext.core.finance.ux.InvVouchersCRnV.Grid = function (config) {
    Ext.core.finance.ux.InvVouchersCRnV.Grid.superclass.constructor.call(this, Ext.apply({
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
                    Ext.getCmp('InvVouchersCRnV-grid').body.mask('Loading...', 'x-mask-loading');
                },
                load: function () {
                    var grid = Ext.getCmp('InvVouchersCRnV-grid');
                    var store = grid.getStore();

                    grid.body.unmask();
                },
                loadException: function () {
                    Ext.getCmp('InvVouchersCRnV-grid').body.unmask();
                },
                remove: function (store) {
                    var grid = Ext.getCmp('InvVouchersCRnV-grid');

                },
                scope: this
            }
        }),
        id: 'InvVouchersCRnV-grid',
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
                var grid = Ext.getCmp('InvVouchersCRnV-grid');
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
                mnuCRnVContext.showAt(event.xy);
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
            header: 'Item',
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
Ext.extend(Ext.core.finance.ux.InvVouchersCRnV.Grid, Ext.grid.EditorGridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ voucherTypeId: this.voucherTypeId }) };
        this.tbar = [{
            xtype: 'button',
            text: 'Select Items',
            id: 'CRnVItemSelector',
            iconCls: 'icon-RowAdd',
            handler: function () {
                var custodianId = Ext.getCmp('ReturnedById').getValue();
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
                var empWindow = new Ext.core.finance.ux.FASelection.Window({ Caller: 'GoodsReturnVoucher', CustodianId: custodianId });
                empWindow.show();
            }
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Remove Row',
            id: 'CRnVRemoveRow',
            iconCls: 'icon-RowDelete',
            handler: CRnVHandlers.onDeleteCRnVRowClick
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
        Ext.core.finance.ux.InvVouchersCRnV.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        //this.addRow();
        Ext.core.finance.ux.InvVouchersCRnV.Grid.superclass.afterRender.apply(this, arguments);
    },
    addRow: function () {
        var grid = Ext.getCmp('InvVouchersCRnV-grid');
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

        var voucherDetailGrid = Ext.getCmp('InvVouchersCRnV-grid');
        var voucherDetailStore = voucherDetailGrid.getStore();
        voucherDetailStore.removeAll();
        //voucherDetailGrid.addRow();
    },
    onNextEntry: function () {
        var form = Ext.getCmp('InvVouchersCRnV-form').getForm();
        var voucherHeaderGrid = Ext.getCmp('voucherHeader-grid');
        var voucherDetailGrid = Ext.getCmp('InvVouchersCRnV-grid');
        var voucherDetailStore = voucherDetailGrid.getStore();

        form.findField('Id').reset();


        voucherDetailStore.removeAll();
        //voucherDetailGrid.addRow();


    },
    onSaveClick: function () {
        var grid = Ext.getCmp('InvVouchersCRnV-grid');
        var form = Ext.getCmp('InvVouchersCRnV-form');
        var formFooter = Ext.getCmp('InvVouchersCRnVFooter-form');
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
                Ext.getCmp('InvVouchersCRnV-grid').onNextEntry();
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
        var grid = Ext.getCmp('InvVouchersCRnV-grid');
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
Ext.reg('InvVouchersCRnV-grid', Ext.core.finance.ux.InvVouchersCRnV.Grid);

/**
* @desc      CRnV panel
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @version   $Id: InvVouchersCRnV.js, 0.1
* @namespace Ext.core.finance.ux.InvVouchersCRnV
* @class     Ext.core.finance.ux.InvVouchersCRnV.Panel
* @extends   Ext.Panel
*/
Ext.core.finance.ux.InvVouchersCRnV.Panel = function (config) {
    Ext.core.finance.ux.InvVouchersCRnV.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false,
        tbar: {
            xtype: 'toolbar',
            items: [{
                xtype: 'button',
                text: 'Add',
                id: 'addInvVouchersCRnV',
                iconCls: 'icon-add',
                handler: this.onAddClick,
                disabled: !Ext.core.finance.ux.Reception.getPermission('FA Store Issue Voucher', 'CanAdd')
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Edit',
                id: 'editInvVouchersCRnV',
                iconCls: 'icon-edit',
                handler: this.onEditClick,
                disabled: !Ext.core.finance.ux.Reception.getPermission('FA Store Issue Voucher', 'CanEdit')
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Delete',
                id: 'deleteInvVouchersCRnV',
                iconCls: 'icon-delete',
                handler: this.onDeleteClick,
                disabled: !Ext.core.finance.ux.Reception.getPermission('FA Store Issue Voucher', 'CanDelete')
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Check',
                id: 'checkInvVouchersCRnV',
                iconCls: 'icon-check',
                hidden: true,
                handler: function () {
                    onCRnVStatusChange('Check');
                },
                disabled: !Ext.core.finance.ux.Reception.getPermission('FA Store Issue Voucher', 'CanCheck')
            }, {
                xtype: 'button',
                text: 'Change Location',
                id: 'changeLocInvVouchersCRnV',
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
                id: 'approveInvVouchersCRnV',
                iconCls: 'icon-approve',
                handler: function () {
                    onCRnVStatusChange('Approve');
                },
                disabled: !Ext.core.finance.ux.Reception.getPermission('FA Store Issue Voucher', 'CanApprove')
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Authorize',
                hidden: true,
                id: 'authorizeInvVouchersCRnV',
                iconCls: 'icon-authorize',
                handler: function () {
                    onCRnVStatusChange('Authorize');
                },
                disabled: !Ext.core.finance.ux.Reception.getPermission('FA Store Issue Voucher', 'CanAuthorize')
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Export',
                id: 'btnCRnVPreviewExport',
                iconCls: 'icon-Preview',
                handler: this.onCRnVPreviewClick
                //disabled: !Ext.core.finance.ux.Reception.getPermission('JVR', 'CanDelete')
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Print',
                id: 'previewInvVouchersCRnV',
                iconCls: 'icon-Print',
                handler: this.onCRnVPrintClick
                //disabled: !Ext.core.finance.ux.Reception.getPermission('JVR', 'CanDelete')
            }, {
                xtype: 'button',
                text: 'Import Tool',
                id: 'importToolInvVouchersCRnV',
                iconCls: 'icon-win',
                handler: this.onRunCRnVImportTool,
                hidden: true
                //disabled: !Ext.core.finance.ux.Reception.getPermission('JVR', 'CanDelete')
            }, '->', {
                id: 'cmbCRnVSearchBy',
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
                        var startDate = Ext.getCmp('CRnVSearchFromDate');
                        var endDate = Ext.getCmp('CRnVSearchToDate');
                        var srchTxt = Ext.getCmp('CRnVSearchText');

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
                id: 'CRnVSearchText',
                xtype: 'textfield',
                anchor: '95%',
                emptyText: 'Search Text',
                allowBlank: true,
                hidden: true,
                listeners: {
                    specialkey: function (field, e) {
                        if (e.getKey() == e.ENTER) {
                            onSearchCRnVHit();
                        }
                    }
                }

            }, ' ', {
                id: 'CRnVSearchFromDate',
                xtype: 'datefield',
                anchor: '95%',
                emptyText: 'From Date',
                allowBlank: true,
                hidden: true,
                listeners: {
                    specialkey: function (field, e) {
                        if (e.getKey() == e.ENTER) {
                            onSearchCRnVHit();
                        }
                    }
                }

            }, ' ', {
                id: 'CRnVSearchToDate',
                xtype: 'datefield',
                anchor: '95%',
                emptyText: 'To Date',
                allowBlank: true,
                hidden: true,
                listeners: {
                    specialkey: function (field, e) {
                        if (e.getKey() == e.ENTER) {
                            onSearchCRnVHit();
                        }
                    }
                }

            }, ' ', {
                xtype: 'button',
                tooltip: 'Search',
                id: 'btnSearchCRnVs',

                iconCls: 'icon-filter',
                handler: this.onShowSearchWindow

            }, {
                xtype: 'button',
                tooltip: 'Search',
                id: 'searchInvVouchersCRnV',
                iconCls: 'icon-filter',
                hidden: true,
                handler: this.onCRnVSearchClick

            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                tooltip: 'Reset Search',
                id: 'resetInvVouchersCRnV',
                iconCls: 'icon-refresh',
                handler: this.onCRnVRefreshClick

            }]
        }
    }, config));
}
Ext.extend(Ext.core.finance.ux.InvVouchersCRnV.Panel, Ext.Panel, {
    initComponent: function () {
        this.items = [{
            xtype: 'InvVouchersCRnVMain-grid',
            id: 'InvVouchersCRnVMain-grid'
        }];
        Ext.core.finance.ux.InvVouchersCRnV.Panel.superclass.initComponent.apply(this, arguments);
    },

    onAddClick: function () {
        new Ext.core.finance.ux.InvVouchersCRnV.Window({
            InvVouchersCRnVId: 0,
            title: 'Add CRnV'
        }).show();
    },
    onEditClick: function () {
        OnEditCRnV();
    },
    onDeleteClick: function () {
        var grid = Ext.getCmp('InvVouchersCRnVMain-grid');
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
                        Ext.getCmp('InvVouchersCRnVMain-paging').doRefresh();
                    }, this);
                }
            }
        });
    },
    onShowSearchWindow: function () {
        new Ext.core.finance.ux.FinanceVouchersSearch.Window({
            title: 'Search CRnV',
            caller: 'CRnV'
        }).show();
    },
    onCRnVPrintClick: function () {

        var reportType = 'rpt_CRnV';
        var grid = Ext.getCmp('InvVouchersCRnVMain-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var voucherHeaderId = grid.getSelectionModel().getSelected().get('Id');
        FinanceReports.ViewReport(reportType, voucherHeaderId, function (result, response) {
            if (result.success) {
                var url = result.URL;
                var voucherType = 'CRnV';
                var reportType = 'Voucher';
                var isPrint = 1;
                windowParameter = 'width=900,height=700,toolbar=yes,location=yes,directories=yes,status=yes,menubar=yes,scrollbars=yes,copyhistory=yes,resizable=yes';
                window.open('Reports/Financial/FinancialReportsViewer.aspx?rt=' + reportType + '&id=' + voucherHeaderId + '&vt=' + voucherType + '&printMode=' + true, '', windowParameter);

            }

        });

    },
    onCRnVPreviewClick: function () {

        var reportType = 'rpt_CRnV';
        var grid = Ext.getCmp('InvVouchersCRnVMain-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var voucherHeaderId = grid.getSelectionModel().getSelected().get('Id');
        FinanceReports.ViewReport(reportType, voucherHeaderId, function (result, response) {
            if (result.success) {
                var url = result.URL;
                var voucherType = 'CRnV';
                var reportType = 'Voucher';
                var isPrint = 0;
                windowParameter = 'width=900,height=700,toolbar=yes,location=yes,directories=yes,status=yes,menubar=yes,scrollbars=yes,copyhistory=yes,resizable=yes';
                window.open('Reports/Financial/FinancialReportsViewer.aspx?rt=' + reportType + '&id=' + voucherHeaderId + '&vt=' + voucherType + '&printMode=' + false, '', windowParameter);

            }

        });

    },
    onCRnVSearchClick: function () {
        //        var jvGrid = Ext.getCmp('InvVouchersCRnVMain-grid');
        //        var jvStore = jvGrid.getStore();
        //        var txt = Ext.getCmp('CRnVSearchText').getValue();
        //        var srchBy = Ext.getCmp('cmbCRnVSearchBy').getValue();
        //        var startDate = Ext.getCmp('CRnVSearchFromDate').getValue();
        //        var endDate = Ext.getCmp('CRnVSearchToDate').getValue();
        //        
        //        jvStore.baseParams = { record: Ext.encode({ SearchText: txt, SearchBy: srchBy,FromDate: startDate, ToDate:endDate, mode: 'search' }), vType: 'CRnV' };
        //        
        //        jvStore.load({
        //            params: { start: 0, limit: 100 }
        //        });
        onSearchCRnVHit();
    },
    onCRnVRefreshClick: function () {
        var jvGrid = Ext.getCmp('InvVouchersCRnVMain-grid');
        Ext.getCmp('cmbCRnVSearchBy').reset();
        Ext.getCmp('CRnVSearchFromDate').reset();
        Ext.getCmp('CRnVSearchToDate').reset();
        Ext.getCmp('CRnVSearchText').reset();

        var jvStore = jvGrid.getStore();

        jvStore.baseParams = { record: Ext.encode({ SearchText: '', SearchBy: '', FromDate: '', ToDate: '', mode: 'get' }), vType: 'CRnV' };

        jvStore.load({
            params: { start: 0, limit: 100 }
        });
    }, onRunCRnVImportTool: function () {
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
var onCRnVStatusChange = function (status) {
    //onCRnVStatusChange: function (status) {
    var grid = Ext.getCmp('InvVouchersCRnVMain-grid');
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
            Ext.getCmp('InvVouchersCRnVMain-paging').doRefresh();
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
Ext.reg('InvVouchersCRnV-panel', Ext.core.finance.ux.InvVouchersCRnV.Panel);

var onSearchCRnVHit = function () {
    var jvGrid = Ext.getCmp('InvVouchersCRnVMain-grid');
    var jvStore = jvGrid.getStore();
    var txt = Ext.getCmp('CRnVSearchText').getValue();
    var srchBy = Ext.getCmp('cmbCRnVSearchBy').getValue();
    var startDate = Ext.getCmp('CRnVSearchFromDate').getValue();
    var endDate = Ext.getCmp('CRnVSearchToDate').getValue();

    jvStore.baseParams = { record: Ext.encode({ SearchText: txt, SearchBy: srchBy, FromDate: startDate, ToDate: endDate, mode: 'search' }), vType: 'CRnV' };

    jvStore.load({
        params: { start: 0, limit: 100 }
    });
};