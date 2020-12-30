Ext.ns('Ext.core.finance.ux.FAVouchersSIV');
Ext.ns('Ext.core.finance.ux.FAVouchersSIVMain');
Ext.ns('Ext.core.finance.ux.FAVouchersSIVFooter');
/**
* @desc      SIV registration form
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.FAVouchersSIV
* @class     Ext.core.finance.ux.FAVouchersSIV.Form
* @extends   Ext.form.FormPanel
*/
Ext.core.finance.ux.FAVouchersSIV.Form = function (config) {
    Ext.core.finance.ux.FAVouchersSIV.Form.superclass.constructor.call(this, Ext.apply({
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
        id: 'FAVouchersSIV-form',
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
                id: 'newVoucherSIV',
                iconCls: 'icon-add',
                handler: SIVHandlers.onNewSIVClick
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Save',
                id: 'saveVoucherSIV',
                iconCls: 'icon-save',
                handler: function () {
                     handler: SIVHandlers.onSaveSIVClick(false);
                }
               
            }, {
                xtype: 'tbseparator',
                hidden:true
            }, {
                xtype: 'button',
                text: 'Remove Row',
                hidden:true,
                id: 'deleteVoucherDetailSIV',
                iconCls: 'icon-RowDelete',
                handler: SIVHandlers.onDeleteSIVRowClick
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Insert Row',
                hidden:true,
                id: 'insertVoucherDetailSIV',
                iconCls: 'icon-RowAdd',
                handler: SIVHandlers.onInsertSIVRowClick
            }, {
                xtype: 'tbfill'
            }, {
                xtype: 'displayfield',
                id: 'lblVoucherType',
                style: 'font-weight: bold; color: red',
                value: 'STORE ISSUE VOUCHER'
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
                    value: 'SIV'
               },  {
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
                               Ext.getCmp('FAVouchersSIV-form').getForm().findField('LocationId').setValue("159");
                           }
                       }
                   }),
                   valueField: 'Id', displayField: 'CodeAndName'
               },
               
                   {
                   id: 'IssuedToId',
                   hiddenName: 'IssuedToId',
                   xtype: 'combo',
                   fieldLabel: 'Issued To',
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
                   id: 'IssuedById',
                   hiddenName: 'IssuedById',
                   xtype: 'combo',
                   fieldLabel: 'Issued By',
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
                    anchor:'100%',
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
                            var form = Ext.getCmp('FAVouchersSIV-form').getForm();
                            
                            var date = form.findField('Date').getValue();
                            var location = form.findField('LocationId').getValue();

                            window.FinanceVoucher.GetVoucherInfo('SIV', date,location, function (result, response) {
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
                    fieldLabel: 'SIV No',                   
                    anchor: '95%',                    
                    disabled: false,
                     allowBlank: false                    
                }, {
                    name: 'IsRLAS',
                    xtype: 'checkbox',
                    fieldLabel: 'Is RLAS'
                }
            ]

            }]
        }, {
            name: 'Dept',
            xtype: 'textfield',
            fieldLabel: 'Dept/Region',
            allowBlank: true,
            anchor: '100%'
        }]
    }, config));

},

Ext.extend(Ext.core.finance.ux.FAVouchersSIV.Form, Ext.form.FormPanel);
Ext.reg('FAVouchersSIV-form', Ext.core.finance.ux.FAVouchersSIV.Form);

var SIVHandlers = function () {
    return {
        onSaveSIVClick: function (isClosed) {
            SaveSIV(isClosed);
        },
        onDeleteSIVRowClick: function () {
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
                        var grid = Ext.getCmp('FAVouchersSIV-grid');
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
                onInsertSIVRowClick: function () {
            var gridSIV = Ext.getCmp('FAVouchersSIV-grid');
            //gridSIV.addRow();
        },
        
        onNewSIVClick: function () {
            var form = Ext.getCmp('FAVouchersSIV-form');
                var dirty = form.getForm().isDirty();
                var formFooter = Ext.getCmp('FAVouchersSIVFooter-form');
                
                if (dirty)
                    Ext.MessageBox.show({
                        title: 'Save Changes',
                        msg: 'Do you want to save the changes made before opening a new Document?',
                        buttons: Ext.Msg.YESNOCANCEL,
                        fn: function (btnId) {
                            if (btnId === 'yes') {
                                SIVHandlers.onSaveSIVClick(false);
                                
                            }
                            else if (btnId === 'no') {
                                form.getForm().reset();
                                formFooter.getForm().reset();
                                Ext.getCmp('FAVouchersSIV-grid').onNextEntry();
                            }
                        }
                    });

                return !dirty;
        }
    }
} ();

var SaveSIV = function(isClosed) {
    var grid = Ext.getCmp('FAVouchersSIV-grid');
    var form = Ext.getCmp('FAVouchersSIV-form');
    var formFooter = Ext.getCmp('FAVouchersSIVFooter-form');
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
    if (item.data['FixedAssetId'] != '' && item.data['UnitId'] != ''  && item.data['Quantity'] != '' ) {
        if ((item.data['Quantity'] != 0 )) {
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
            success: function() {
                form.getForm().reset();
                formFooter.getForm().reset();
                
                Ext.getCmp('FAVouchersSIV-grid').onNextEntry();
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

var OnEditSIV = function () {
    
    var grid = Ext.getCmp('FAVouchersSIVMain-grid');
    if (!grid.getSelectionModel().hasSelection()) return;
    var id = grid.getSelectionModel().getSelected().get('Id');
    var isPosted = false;// grid.getSelectionModel().getSelected().get('IsPosted');

    new Ext.core.finance.ux.FAVouchersSIV.Window({
        FAVouchersSIVId: id,
        FAVouchersSIVIsPosted: isPosted,
        title: 'Edit SIV'
    }).show();
    //var isChecked = grid.getSelectionModel().getSelected().get('IsChecked');

    //var hasCheckPermission = Ext.core.finance.ux.Reception.getPermission('FA Store Issue Voucher', 'CanCheck');
    //if (hasCheckPermission == true) {
    //    new Ext.core.finance.ux.FAVouchersSIV.Window({
    //        FAVouchersSIVId: id,
    //        FAVouchersSIVIsPosted: isPosted,
    //        title: 'Edit SIV'
    //    }).show();
    //} else if (isChecked == true && hasCheckPermission == false) {
    //    new Ext.core.finance.ux.FAVouchersSIV.Window({
    //        FAVouchersSIVId: id,
    //        FAVouchersSIVIsPosted: true,
    //        title: 'Edit SIV'
    //    }).show();
    //} else if (isChecked == false && hasCheckPermission == false) {
    //    new Ext.core.finance.ux.FAVouchersSIV.Window({
    //        FAVouchersSIVId: id,
    //        FAVouchersSIVIsPosted: isPosted,
    //        title: 'Edit SIV'
    //    }).show();
    //}
};
/**
* @desc      Banks registration form
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.FAVouchersSIVFooter
* @class     Ext.core.finance.ux.FAVouchersSIVFooter.Form
* @extends   Ext.form.FormPanel
*/
Ext.core.finance.ux.FAVouchersSIVFooter.Form = function (config) {
    Ext.core.finance.ux.FAVouchersSIVFooter.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: FixedAssetVoucher.Get
            // submit: FAVouchersSIVFooter.Save

        },
        paramOrder: ['Id'],
        defaults: {
            labelStyle: 'text-align:left;',
            msgTarget: 'side'

        },
        id: 'FAVouchersSIVFooter-form',
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
                    hiddenName: 'IssuedBy',
                    xtype: 'combo',
                    emptyText: 'Issued By',
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
                    name: 'DateIssued',
                    xtype: 'datefield',
                    editable: true,
                     altFormats: 'c',
                     disabled:true,
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
                   hidden: true,
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
                    disabled: true,
                   hidden:true,
                   editable: true,
                   anchor: '70%',
                   emptyText: "Date Authorized",
                   allowBlank : true
               }]

            }]
        }]
    }, config));
}
Ext.extend(Ext.core.finance.ux.FAVouchersSIVFooter.Form, Ext.form.FormPanel);
Ext.reg('FAVouchersSIVFooter-form', Ext.core.finance.ux.FAVouchersSIVFooter.Form);

/**
* @desc      SIV registration form host window
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.FAVouchersSIV
* @class     Ext.core.finance.ux.FAVouchersSIV.Window
* @extends   Ext.Window
*/
Ext.core.finance.ux.FAVouchersSIV.Window = function (config) {
    Ext.core.finance.ux.FAVouchersSIV.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        width: 870,
        height: 630,
        closeAction: 'close',
        modal: true,
        resizable: false,
        maximizable:true,
        minimizable :true,
        buttonAlign: 'right',
        bodyStyle: 'padding:0px;',
        listeners: {
            show: function () {
             var footerForm = Ext.getCmp('FAVouchersSIVFooter-form');
                
                var loggedInUserFullName = Ext.getCmp('loggedInUserFullName-toolbar');

                footerForm.getForm().findField('PreparedBy').setValue(loggedInUserFullName.value);
                this.form.getForm().findField('Id').setValue(this.FAVouchersSIVId);
                if (this.FAVouchersSIVId != '') {
                    this.form.load({ params: { Id: this.FAVouchersSIVId} });
                    LoadSIVGridDetails(this.FAVouchersSIVId);
                    footerForm.load({ params: { Id: this.FAVouchersSIVId} });

                     if (this.FAVouchersSIVIsPosted) {
                         isSIVVoucherPosted = true;
                         this.form.setDisabled(true);
                     } else {
                         isSIVVoucherPosted = false;
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
                                SIVHandlers.onSaveSIVClick(true);
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
                var grid = Ext.getCmp('FAVouchersSIV-grid');
                grid.setSize(1330, 350);
            }, restore: function (window) {

                window.setWidth(870);
                window.setHeight(630);
                var grid = Ext.getCmp('FAVouchersSIV-grid');
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
Ext.extend(Ext.core.finance.ux.FAVouchersSIV.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.core.finance.ux.FAVouchersSIV.Form();
        this.grid = new Ext.core.finance.ux.FAVouchersSIV.Grid();
        this.form2 = new Ext.core.finance.ux.FAVouchersSIVFooter.Form();
        this.items = [this.form, this.grid, this.form2];

        this.buttons = [ {
            text: 'Close',
            iconCls: 'icon-exit',
            handler: this.onClose,
            scope: this
        }];

        Ext.core.finance.ux.FAVouchersSIV.Window.superclass.initComponent.call(this, arguments);
    },
 
    onClose: function () {
        this.close();
    }
});
Ext.reg('FAVouchersSIV-window', Ext.core.finance.ux.FAVouchersSIV.Window);

var SIVSelModel = new Ext.grid.CheckboxSelectionModel();
/**
* @desc      SIV grid
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.FAVouchersSIV
* @class     Ext.core.finance.ux.FAVouchersSIVMain.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.core.finance.ux.FAVouchersSIVMain.Grid = function (config) {
    Ext.core.finance.ux.FAVouchersSIVMain.Grid.superclass.constructor.call(this, Ext.apply({
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
        id: 'FAVouchersSIVMain-grid',
        searchCriteria: {},
        pageSize: 38,
        gridVoucherType: 'SIV',
        //height: 600,
        stripeRows: true,
        columnLines: true,
        border: false,
        sm: SIVSelModel,
        viewConfig: {
            forceFit: true,
            autoFill: true
        },
        listeners: {
            rowClick: function () {
                if (!this.getSelectionModel().hasSelection()) return;
                var id = this.getSelectionModel().getSelected().get('Id');
                var form = Ext.getCmp('FAVouchersSIV-form');
                if (id != null) {

                }
            },
            scope: this,
            rowdblclick: function () {
            

                 var hasEditPermission = Ext.core.finance.ux.Reception.getPermission('FA Store Issue Voucher', 'CanEdit');
                if (hasEditPermission) {
                    OnEditSIV();
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
        },SIVSelModel, new Ext.erp.ux.grid.PagingRowNumberer(),
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
Ext.extend(Ext.core.finance.ux.FAVouchersSIVMain.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
    this.store.baseParams = { record: Ext.encode({ SearchText: '', SearchBy: '',FromDate: '', ToDate:'',mode: 'get' }), vType:'SIV'  };
    
        this.tbar = [];
        this.bbar = new Ext.PagingToolbar({
            id: 'FAVouchersSIVMain-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.core.finance.ux.FAVouchersSIVMain.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getStore().load({
            params: { start: 0, limit: this.pageSize, vType: this.gridVoucherType }
        });
        Ext.core.finance.ux.FAVouchersSIVMain.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('FAVouchersSIVMain-grid', Ext.core.finance.ux.FAVouchersSIVMain.Grid);

var SCriteria = '';
var LoadSIVGridDetails = function (selectedRow) {

    var crvDetailGrid = Ext.getCmp('FAVouchersSIV-grid');
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
        SIVHandlers.onSaveSIVClick(false);
        ele.preventDefault();
    }
}]);
var gridInstance;
var gridRowType;
var iRow;
var iDept;
var iFixedAsset;
var iUnit;

var mnuSIVContext = new Ext.menu.Menu({
    items: [{
        id: 'btnSIVInsertRow',
        iconCls: 'icon-RowAdd',
        text: 'Insert Row'
    },{
        id: 'btnSIVRemoveRow',
        iconCls: 'icon-RowDelete',
        text: 'Remove Row'
    },
            '-'
    ,{
        id: 'btnSIVCopyRow',
        iconCls: 'icon-Copy',
        text: 'Copy Row'
    },{
        id: 'btnSIVPasteRow',
        iconCls: 'icon-Paste',
        text: 'Paste Row',
        disabled: true
    }],
    listeners: {
        itemclick: function(item) {
         if (isSIVVoucherPosted) {
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
                case 'btnSIVInsertRow':
                    {
                        var grid = Ext.getCmp('FAVouchersSIV-grid');
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
                    case 'btnSIVRemoveRow':
                        {
                         var grid = Ext.getCmp('FAVouchersSIV-grid');
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
                            SIVHandlers.onDeleteSIVRowClick();
                        }
                    break;
                    case 'btnSIVCopyRow':
                    {
                        gridInstance = Ext.getCmp('FAVouchersSIV-grid');
                        gridRowType = gridInstance.getStore().recordType;
                        iRow = new gridRowType({
                            UnitPrice: 0,
                            TotalPrice: 0
                        });

                        var grid = Ext.getCmp('FAVouchersSIV-grid');
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

                        var k = Ext.getCmp('btnSIVPasteRow');
                        k.setDisabled(false);

                    }
                    break;
                    case 'btnSIVPasteRow':
                    {
                        var grid = Ext.getCmp('FAVouchersSIV-grid');
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
* @desc      FAVouchersSIV grid
* @author    Dawit Kiros
* @copyright (c) 2010, Cybersoft
* @date      November 01, 2010
* @namespace Ext.core.finance.ux.FAVouchersSIV
* @class     Ext.core.finance.ux.FAVouchersSIV.Grid
* @extends   Ext.grid.GridPanel
*/
var isSIVVoucherPosted = false;
Ext.core.finance.ux.FAVouchersSIV.Grid = function (config) {
    Ext.core.finance.ux.FAVouchersSIV.Grid.superclass.constructor.call(this, Ext.apply({
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
            fields: ['Id',  'FixedAssetId', 'FixedAsset','UnitId','Unit', 'Quantity', 'UnitPrice', 'TotalPrice'],
            remoteSort: true,
            listeners: {
                beforeLoad: function () {
                    Ext.getCmp('FAVouchersSIV-grid').body.mask('Loading...', 'x-mask-loading');
                },
                load: function () {
                    var grid = Ext.getCmp('FAVouchersSIV-grid');
                    var store = grid.getStore();
                    
                    grid.body.unmask();
                },
                loadException: function () {
                    Ext.getCmp('FAVouchersSIV-grid').body.unmask();
                },
                remove: function (store) {
                    var grid = Ext.getCmp('FAVouchersSIV-grid');
                    
                },
                scope: this
            }
        }),
        id: 'FAVouchersSIV-grid',
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
                  itemcontextmenu: function(view, rec, node, index, e) {
                    e.stopEvent();
                    contextMenu.showAt(e.getXY());
                    return false;
                }
            }
        },
        listeners: {


            afteredit: function(e) {
                var record = e.record;
                var grid = Ext.getCmp('FAVouchersSIV-grid');
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
            rowcontextmenu: function(grid, index, event) {
                 event.stopEvent();
                 mnuSIVContext.showAt(event.xy);
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
Ext.extend(Ext.core.finance.ux.FAVouchersSIV.Grid, Ext.grid.EditorGridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ voucherTypeId: this.voucherTypeId }) };
        this.tbar = [{
            xtype: 'button',
            text: 'Select Items',
            id: 'sivItemSelector',            
            iconCls: 'icon-RowAdd',
            handler: function () {
                var empWindow = new Ext.core.finance.ux.FASelection.Window({ Caller: 'StoreIssueVoucher', CustodianId : 0 });
                empWindow.show();
            }
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Remove Row',
            id: 'sivRemoveRow',
            iconCls: 'icon-RowDelete',
            handler: SIVHandlers.onDeleteSIVRowClick
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
        Ext.core.finance.ux.FAVouchersSIV.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        //this.addRow();
        Ext.core.finance.ux.FAVouchersSIV.Grid.superclass.afterRender.apply(this, arguments);
    },
    addRow: function () {
        var grid = Ext.getCmp('FAVouchersSIV-grid');
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
        
        var voucherDetailGrid = Ext.getCmp('FAVouchersSIV-grid');
        var voucherDetailStore = voucherDetailGrid.getStore();
        voucherDetailStore.removeAll();
        //voucherDetailGrid.addRow();
    },
    onNextEntry: function () {
        var form = Ext.getCmp('FAVouchersSIV-form').getForm();
        var voucherHeaderGrid = Ext.getCmp('voucherHeader-grid');
        var voucherDetailGrid = Ext.getCmp('FAVouchersSIV-grid');
        var voucherDetailStore = voucherDetailGrid.getStore();

        form.findField('Id').reset();

       
        voucherDetailStore.removeAll();
        //voucherDetailGrid.addRow();


    },
    onSaveClick: function () {
        var grid = Ext.getCmp('FAVouchersSIV-grid');
        var form = Ext.getCmp('FAVouchersSIV-form');
        var formFooter = Ext.getCmp('FAVouchersSIVFooter-form');
        if (!form.getForm().isValid() || !formFooter.getForm().isValid()) return;
        var store = grid.getStore();
        var rec = '';

        store.each(function (item) {
            if (item.data['FixedAssetId'] != '' && item.data['UnitId'] != '' && item.data['Quantity'] != '' ) {
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
                Ext.getCmp('FAVouchersSIV-grid').onNextEntry();
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
        var grid = Ext.getCmp('FAVouchersSIV-grid');
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
Ext.reg('FAVouchersSIV-grid', Ext.core.finance.ux.FAVouchersSIV.Grid);

/**
* @desc      SIV panel
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @version   $Id: FAVouchersSIV.js, 0.1
* @namespace Ext.core.finance.ux.FAVouchersSIV
* @class     Ext.core.finance.ux.FAVouchersSIV.Panel
* @extends   Ext.Panel
*/
Ext.core.finance.ux.FAVouchersSIV.Panel = function (config) {
    Ext.core.finance.ux.FAVouchersSIV.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false,
        tbar: {
            xtype: 'toolbar',
            items: [{
                xtype: 'button',
                text: 'Add',
                id: 'addFAVouchersSIV',
                iconCls: 'icon-add',
                handler: this.onAddClick,
                disabled: !Ext.core.finance.ux.Reception.getPermission('FA Store Issue Voucher', 'CanAdd')
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Edit',
                id: 'editFAVouchersSIV',
                iconCls: 'icon-edit',
                handler: this.onEditClick,
                disabled: !Ext.core.finance.ux.Reception.getPermission('FA Store Issue Voucher', 'CanEdit')
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Delete',
                id: 'deleteFAVouchersSIV',
                iconCls: 'icon-delete',
                handler: this.onDeleteClick,
                disabled: !Ext.core.finance.ux.Reception.getPermission('FA Store Issue Voucher', 'CanDelete')
            },{
                xtype: 'tbseparator'
            },{
                xtype: 'button',
                text: 'Check',
                id: 'checkFAVouchersSIV',
                iconCls: 'icon-check',
                hidden: true,
                handler: function() {
                    onSIVStatusChange('Check');
                },
                disabled: !Ext.core.finance.ux.Reception.getPermission('FA Store Issue Voucher', 'CanCheck')
            }, {
                xtype: 'button',
                text: 'Change Location',
                id: 'changeLocFAVouchersGRV',
                iconCls: 'icon-check',
                handler: function () {
                    new Ext.core.finance.ux.faChangeLocation.Window({
                        title: 'Change Location'
                    }).show();
                },
               
            }, {
                xtype: 'tbseparator'
            },{
                xtype: 'button',
                text: 'Approve',
                id: 'approveFAVouchersSIV',
                iconCls: 'icon-approve',
                handler: function() {
                    onSIVStatusChange('Approve');
                },
                disabled: !Ext.core.finance.ux.Reception.getPermission('FA Store Issue Voucher', 'CanApprove')
            },{
                xtype: 'tbseparator'
            },{
                xtype: 'button',
                text: 'Authorize',
                hidden:true,
                id: 'authorizeFAVouchersSIV',
                iconCls: 'icon-authorize',
                 handler: function() {
                    onSIVStatusChange('Authorize');
                },
                disabled: !Ext.core.finance.ux.Reception.getPermission('FA Store Issue Voucher', 'CanAuthorize')
            },{
                xtype: 'tbseparator'
            },{
                xtype: 'button',
                text: 'Export',
                id: 'btnSIVPreviewExport',
                iconCls: 'icon-Preview',
                handler: this.onSIVPreviewClick
                //disabled: !Ext.core.finance.ux.Reception.getPermission('JVR', 'CanDelete')
            },{
                xtype: 'tbseparator'
            },{
                xtype: 'button',
                text: 'Print',
                id: 'previewFAVouchersSIV',
                iconCls: 'icon-Print',
                handler: this.onSIVPrintClick
                //disabled: !Ext.core.finance.ux.Reception.getPermission('JVR', 'CanDelete')
            }, {
                xtype: 'button',
                text: 'Import Tool',
                id: 'importToolFAVouchersSIV',
                iconCls: 'icon-win',
                handler: this.onRunSIVImportTool,
                 hidden: true
                //disabled: !Ext.core.finance.ux.Reception.getPermission('JVR', 'CanDelete')
            }, '->', {
                    id: 'cmbSIVSearchBy',
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
                            var startDate = Ext.getCmp('SIVSearchFromDate');
                            var endDate = Ext.getCmp('SIVSearchToDate');
                            var srchTxt = Ext.getCmp('SIVSearchText');

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
                    id: 'SIVSearchText',
                    xtype: 'textfield',
                    anchor: '95%',
                    emptyText: 'Search Text',
                    allowBlank: true,
                    hidden:true,
                    listeners: {
                        specialkey: function (field, e) {
                            if (e.getKey() == e.ENTER) {
                                onSearchSIVHit();
                            }
                        }
                    }

                },  ' ', {
                    id: 'SIVSearchFromDate',
                    xtype: 'datefield',
                    anchor: '95%',
                    emptyText: 'From Date',
                    allowBlank: true,
                    hidden:true,
                    listeners: {
                        specialkey: function (field, e) {
                            if (e.getKey() == e.ENTER) {
                                onSearchSIVHit();
                            }
                        }
                    }

                },  ' ', {
                    id: 'SIVSearchToDate',
                    xtype: 'datefield',
                    anchor: '95%',
                    emptyText: 'To Date',
                    allowBlank: true,
                    hidden:true,
                    listeners: {
                        specialkey: function (field, e) {
                            if (e.getKey() == e.ENTER) {
                                onSearchSIVHit();
                            }
                        }
                    }

                },  ' ', {
                xtype: 'button',
                tooltip: 'Search',
                id: 'btnSearchSIVs',

                iconCls: 'icon-filter',
                handler: this.onShowSearchWindow

            }, {
                    xtype: 'button',
                    tooltip: 'Search',
                    id: 'searchFAVouchersSIV',
                    iconCls: 'icon-filter',
                    hidden:true,
                    handler: this.onSIVSearchClick
                    
                }, {
                xtype: 'tbseparator'
            }, {
                    xtype: 'button',
                    tooltip: 'Reset Search',
                    id: 'resetFAVouchersSIV',
                    iconCls: 'icon-refresh',
                    handler: this.onSIVRefreshClick
                    
                }]
        }
    }, config));
}
Ext.extend(Ext.core.finance.ux.FAVouchersSIV.Panel, Ext.Panel, {
    initComponent: function () {
        this.items = [{
            xtype: 'FAVouchersSIVMain-grid',
            id: 'FAVouchersSIVMain-grid'
        }];
        Ext.core.finance.ux.FAVouchersSIV.Panel.superclass.initComponent.apply(this, arguments);
    },

    onAddClick: function () {
        new Ext.core.finance.ux.FAVouchersSIV.Window({
            FAVouchersSIVId: 0,
            title: 'Add SIV'
        }).show();
    },
    onEditClick: function () {
        OnEditSIV();
    },
    onDeleteClick: function () { 
        var grid = Ext.getCmp('FAVouchersSIVMain-grid');
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
                        Ext.getCmp('FAVouchersSIVMain-paging').doRefresh();
                    }, this);
                }
            }
        });
    },
        onShowSearchWindow : function() {
        new Ext.core.finance.ux.FinanceVouchersSearch.Window({
            title: 'Search SIV',
            caller:'SIV'
        }).show();
    },
    onSIVPrintClick: function () {

          var reportType = 'rpt_SIV';
          var grid = Ext.getCmp('FAVouchersSIVMain-grid');
          if (!grid.getSelectionModel().hasSelection()) return;
          var voucherHeaderId = grid.getSelectionModel().getSelected().get('Id');
          FinanceReports.ViewReport(reportType, voucherHeaderId, function (result, response) {
            if (result.success) {
                var url = result.URL;
                var voucherType = 'SIV';
                var reportType = 'Voucher';
                var isPrint = 1;
                windowParameter = 'width=900,height=700,toolbar=yes,location=yes,directories=yes,status=yes,menubar=yes,scrollbars=yes,copyhistory=yes,resizable=yes';
                window.open('Reports/Financial/FinancialReportsViewer.aspx?rt=' + reportType + '&id=' + voucherHeaderId + '&vt=' + voucherType+ '&printMode=' + true, '', windowParameter);

            }

        });

    },
    onSIVPreviewClick: function () {

          var reportType = 'rpt_SIV';
          var grid = Ext.getCmp('FAVouchersSIVMain-grid');
          if (!grid.getSelectionModel().hasSelection()) return;
          var voucherHeaderId = grid.getSelectionModel().getSelected().get('Id');
          FinanceReports.ViewReport(reportType, voucherHeaderId, function (result, response) {
            if (result.success) {
                var url = result.URL;
                var voucherType = 'SIV';
                var reportType = 'Voucher';
                var isPrint = 0;
                windowParameter = 'width=900,height=700,toolbar=yes,location=yes,directories=yes,status=yes,menubar=yes,scrollbars=yes,copyhistory=yes,resizable=yes';
                window.open('Reports/Financial/FinancialReportsViewer.aspx?rt=' + reportType + '&id=' + voucherHeaderId + '&vt=' + voucherType+ '&printMode=' + false, '', windowParameter);
                
            }

        });

    },
    onSIVSearchClick: function () {
//        var jvGrid = Ext.getCmp('FAVouchersSIVMain-grid');
//        var jvStore = jvGrid.getStore();
//        var txt = Ext.getCmp('SIVSearchText').getValue();
//        var srchBy = Ext.getCmp('cmbSIVSearchBy').getValue();
//        var startDate = Ext.getCmp('SIVSearchFromDate').getValue();
//        var endDate = Ext.getCmp('SIVSearchToDate').getValue();
//        
//        jvStore.baseParams = { record: Ext.encode({ SearchText: txt, SearchBy: srchBy,FromDate: startDate, ToDate:endDate, mode: 'search' }), vType: 'SIV' };
//        
//        jvStore.load({
//            params: { start: 0, limit: 100 }
//        });
        onSearchSIVHit();
    },
    onSIVRefreshClick: function () {
        var jvGrid = Ext.getCmp('FAVouchersSIVMain-grid');
        Ext.getCmp('cmbSIVSearchBy').reset();
        Ext.getCmp('SIVSearchFromDate').reset();
        Ext.getCmp('SIVSearchToDate').reset();
        Ext.getCmp('SIVSearchText').reset();

        var jvStore = jvGrid.getStore();
        
        jvStore.baseParams = { record: Ext.encode({ SearchText: '', SearchBy: '',FromDate: '', ToDate:'', mode: 'get' }), vType: 'SIV' };
        
        jvStore.load({
            params: { start: 0, limit: 100 }
        });
    }, onRunSIVImportTool: function () {
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
var onSIVStatusChange = function (status) {
    //onSIVStatusChange: function (status) {
        var grid = Ext.getCmp('FAVouchersSIVMain-grid');
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
                Ext.getCmp('FAVouchersSIVMain-paging').doRefresh();
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
Ext.reg('FAVouchersSIV-panel', Ext.core.finance.ux.FAVouchersSIV.Panel);

var onSearchSIVHit = function () {
    var jvGrid = Ext.getCmp('FAVouchersSIVMain-grid');
        var jvStore = jvGrid.getStore();
        var txt = Ext.getCmp('SIVSearchText').getValue();
        var srchBy = Ext.getCmp('cmbSIVSearchBy').getValue();
        var startDate = Ext.getCmp('SIVSearchFromDate').getValue();
        var endDate = Ext.getCmp('SIVSearchToDate').getValue();
        
        jvStore.baseParams = { record: Ext.encode({ SearchText: txt, SearchBy: srchBy,FromDate: startDate, ToDate:endDate, mode: 'search' }), vType: 'SIV' };
        
        jvStore.load({
            params: { start: 0, limit: 100 }
        });
};