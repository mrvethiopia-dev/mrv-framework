Ext.ns('Ext.core.finance.ux.voucherTypeSetting');

/**
* @desc      Voucher Type Setting registration form
* @author    Dawit Kiros
* @copyright (c) 2010, Cybersoft
* @date      November 01, 2010
* @namespace Ext.core.finance.ux.voucherTypeSetting
* @class     Ext.core.finance.ux.voucherTypeSetting.Form
* @extends   Ext.form.FormPanel
*/
Ext.core.finance.ux.voucherTypeSetting.Form = function (config) {
    Ext.core.finance.ux.voucherTypeSetting.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: VoucherTypeSetting.Get,
            submit: VoucherTypeSetting.Save
        },
        paramOrder: ['id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'voucherTypeSetting-form',
        padding: 5,
        labelWidth: 150,
        autoHeight: true,
        border: false,
        baseCls: 'x-plain',
        items: [{
            name: 'Id',
            xtype: 'hidden'
        }, {
            hiddenName: 'VoucherPrefixId',
            xtype: 'combo',
            fieldLabel: 'Voucher Prefix',
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
                    fields: ['Id', 'Code', 'Name']
                }),
                autoLoad: true,
                api: { read: window.Ifms.GetVoucherPrefixes }
            }),
            valueField: 'Id',
            displayField: 'Code'
        }, {
            hiddenName: 'VoucherTypeId',
            xtype: 'combo',
            fieldLabel: 'Voucher Type',
            triggerAction: 'all',
            mode: 'local',
            editable: false,
            forceSelection: true,
            allowBlank: false,
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
            name: 'DefaultAccountId',
            xtype: 'hidden'
        }, {
            hiddenName: 'DefaultAccount',
            xtype: 'combo',
            fieldLabel: 'Default Account',
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
                    fields: ['Id', 'ControlAccountId', 'Account', 'Name']
                }),
                api: { read: Ifms.GetAccounts }
            }),
            valueField: 'Id',
            displayField: 'Account',
            pageSize: 10,
            listeners: {
                select: function (cmb, rec, idx) {
                    var form = Ext.getCmp('voucherTypeSetting-form').getForm();
                    form.findField('DefaultAccountId').setValue(rec.id);
                }
            }
        }, {
            hiddenName: 'BalanceSideId',
            xtype: 'combo',
            fieldLabel: 'Balance Side',
            triggerAction: 'all',
            mode: 'local',
            editable: true,
            forceSelection: true,
            allowBlank: true,
            store: new Ext.data.DirectStore({
                reader: new Ext.data.JsonReader({
                    successProperty: 'success',
                    idProperty: 'Id',
                    root: 'data',
                    fields: ['Id', 'Name']
                }),
                autoLoad: true,
                api: { read: window.Ifms.GetBalanceSides }
            }),
            valueField: 'Id',
            displayField: 'Name'
        }, {
            name: 'StartingNumber',
            xtype: 'numberfield',
            fieldLabel: 'Starting Number',
            allowBlank: false
        }, {
            name: 'CurrentNumber',
            xtype: 'numberfield',
            fieldLabel: 'Current Number',
            allowBlank: false
        }, {
            name: 'NumberOfDigits',
            xtype: 'numberfield',
            fieldLabel: 'Number of Digits',
            allowBlank: false
        }, {
            name: 'CreatedAt',
            xtype: 'hidden'
        }]
    }, config));
};
Ext.extend(Ext.core.finance.ux.voucherTypeSetting.Form, Ext.form.FormPanel);
Ext.reg('voucherTypeSetting-form', Ext.core.finance.ux.voucherTypeSetting.Form);

/**
* @desc      Voucher Type Setting registration form host window
* @author    Dawit Kiros
* @copyright (c) 2010, Cybersoft
* @date      November 10, 2010
* @namespace Ext.core.finance.ux.voucherTypeSetting
* @class     Ext.core.finance.ux.voucherTypeSetting.Window
* @extends   Ext.Window
*/
Ext.core.finance.ux.voucherTypeSetting.Window = function (config) {
    Ext.core.finance.ux.voucherTypeSetting.Window.superclass.constructor.call(this, Ext.apply({
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
                this.form.getForm().findField('Id').setValue(this.voucherTypeSettingId);
                if (this.voucherTypeSettingId != '') {
                    this.form.load({ params: { id: this.voucherTypeSettingId } });
                }
            },
            scope: this
        }
    }, config));
};
Ext.extend(Ext.core.finance.ux.voucherTypeSetting.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.core.finance.ux.voucherTypeSetting.Form();
        this.items = [this.form];
        this.buttons = [{
            text: 'Save',
            iconCls: 'icon-save',
            handler: this.onSave,
            scope: this
        }, {
            xtype: 'tbseparator'
        }, {
            text: 'Close',
            iconCls: 'icon-exit',
            handler: this.onClose,
            scope: this
        }];
        this.tools = [{
            id: 'refresh',
            qtip: 'Reset',
            handler: function () {
                this.form.getForm().reset();
            },
            scope: this
        }];
        
        this.tools = [{
            id: 'refresh',
            qtip: 'Reset',
            handler: function () {
                this.form.getForm().reset();
            },
            scope: this
        }];
        Ext.core.finance.ux.voucherTypeSetting.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {
        if (!this.form.getForm().isValid()) return;
        this.form.getForm().submit({
            waitMsg: 'Please wait...',
            success: function () {
                Ext.getCmp('voucherTypeSetting-form').getForm().reset();
                Ext.getCmp('voucherTypeSetting-paging').doRefresh();
            },
            failure: function (form, action) {
                Ext.MessageBox.show({
                    title: 'Error',
                    msg: action.result.data,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.ERROR,
                    scope: this
                });
            }
        });
    },
    onClose: function () {
        this.close();
    }
});
Ext.reg('voucherTypeSetting-window', Ext.core.finance.ux.voucherTypeSetting.Window);

/**
* @desc      VoucherTypeSetting grid
* @author    Dawit Kiros
* @copyright (c) 2010, Cybersoft
* @date      November 01, 2010
* @namespace Ext.core.finance.ux.voucherTypeSetting
* @class     Ext.core.finance.ux.voucherTypeSetting.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.core.finance.ux.voucherTypeSetting.Grid = function (config) {
    Ext.core.finance.ux.voucherTypeSetting.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: VoucherTypeSetting.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'VoucherType',
                direction: 'ASC'
            },
            fields: ['Id', 'VoucherPrefix', 'VoucherType', 'DefaultAccount', 'AccountTitle', 'BalanceSide', 'StartingNumber', 'CurrentNumber', 'NumberOfDigits'],
            remoteSort: true,
            listeners: {
                beforeLoad: function () { Ext.getCmp('voucherTypeSetting-grid').body.mask('Loading...', 'x-mask-loading'); },
                load: function () { Ext.getCmp('voucherTypeSetting-grid').body.unmask(); },
                loadException: function () { Ext.getCmp('voucherTypeSetting-grid').body.unmask(); },
                scope: this
            }
        }),
        id: 'voucherTypeSetting-grid',
        pageSize: 20,
        columnLines: true,
        stripeRows: true,
        border: true,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        columns: [{
            dataIndex: 'Id',
            header: 'Id',
            sortable: false,
            hidden: true,
            width: 100,
            menuDisabled: true
        }, new Ext.grid.RowNumberer(), {
            dataIndex: 'VoucherPrefix',
            header: 'Voucher Prefix',
            sortable: false,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'VoucherType',
            header: 'Voucher Type',
            sortable: false,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'DefaultAccount',
            header: 'Default Account',
            sortable: false,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'AccountTitle',
            header: 'Account Title',
            sortable: false,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'BalanceSide',
            header: 'Balance Side',
            sortable: false,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'StartingNumber',
            header: 'Starting Number',
            sortable: false,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'CurrentNumber',
            header: 'Current Number',
            sortable: false,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'NumberOfDigits',
            header: 'Number of Digits',
            sortable: false,
            width: 100,
            menuDisabled: true
        }]
    }, config));
};
Ext.extend(Ext.core.finance.ux.voucherTypeSetting.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.bbar = new Ext.PagingToolbar({
            id: 'voucherTypeSetting-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.core.finance.ux.voucherTypeSetting.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getStore().load({
            params: { start: 0, limit: this.pageSize }
        });
        Ext.core.finance.ux.voucherTypeSetting.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('voucherTypeSetting-grid', Ext.core.finance.ux.voucherTypeSetting.Grid);

/**
* @desc      Voucher Type Setting panel
* @author    Dawit Kiros
* @copyright (c) 2010, Cybersoft
* @date      November 01, 2010
* @namespace Ext.core.finance.ux.voucherTypeSetting
* @class     Ext.core.finance.ux.voucherTypeSetting.Panel
* @extends   Ext.Panel
*/
Ext.core.finance.ux.voucherTypeSetting.Panel = function (config) {
    Ext.core.finance.ux.voucherTypeSetting.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false,
        tbar: {
            xtype: 'toolbar',
            items: [{
                xtype: 'button',
                text: 'Add',
                iconCls: 'icon-add',
                disabled: !Ext.core.finance.ux.Reception.getPermission('Voucher Type Setting', 'CanAdd'),
                handler: this.onAddClick
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Edit',
                iconCls: 'icon-edit',
                disabled: !Ext.core.finance.ux.Reception.getPermission('Voucher Type Setting', 'CanEdit'),
                handler: this.onEditClick
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Delete',
                iconCls: 'icon-delete',
                disabled: !Ext.core.finance.ux.Reception.getPermission('Voucher Type Setting', 'CanDelete'),
                handler: this.onDeleteClick
            }]
        }
    }, config));
};
Ext.extend(Ext.core.finance.ux.voucherTypeSetting.Panel, Ext.Panel, {
    initComponent: function () {
        this.items = [{
            xtype: 'voucherTypeSetting-grid',
            id: 'voucherTypeSetting-grid'
        }];
        Ext.core.finance.ux.voucherTypeSetting.Panel.superclass.initComponent.apply(this, arguments);
    },
    onAddClick: function () {
        new Ext.core.finance.ux.voucherTypeSetting.Window({
            voucherTypeSettingId: 0,
            title: 'Add Voucher Type Setting '
        }).show();
    },
    onEditClick: function () {
        var grid = Ext.getCmp('voucherTypeSetting-grid');
        if (!grid.getSelectionModel().hasSelection()) {
            Ext.MessageBox.show({
                title: 'Select',
                msg: 'You must select a record to edit.',
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
        var id = grid.getSelectionModel().getSelected().get('Id');
        new Ext.core.finance.ux.voucherTypeSetting.Window({
            voucherTypeSettingId: id,
            title: 'Edit Voucher Type Setting'
        }).show();
    },
    onDeleteClick: function () {
        var grid = Ext.getCmp('voucherTypeSetting-grid');
        if (!grid.getSelectionModel().hasSelection()) {
            Ext.MessageBox.show({
                title: 'Select',
                msg: 'You must select a record  to delete.',
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
        Ext.MessageBox.show({
            title: 'Delete',
            msg: 'Are you sure you want to delete the selected record ',
            buttons: {
                ok: 'Yes',
                no: 'No'
            },
            icon: Ext.MessageBox.QUESTION,
            scope: this,
            animEl: 'Delete',
            fn: function (btn) {
                if (btn == 'ok') {
                    var id = grid.getSelectionModel().getSelected().get('Id');
                    VoucherTypeSetting.Delete(id, function (result, response) {
                        Ext.getCmp('voucherTypeSetting-paging').doRefresh();
                    }, this);
                }
            }
        });
    }
});
Ext.reg('voucherTypeSetting-panel', Ext.core.finance.ux.voucherTypeSetting.Panel);