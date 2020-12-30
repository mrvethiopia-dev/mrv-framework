Ext.ns('Ext.core.finance.ux.voucherPrefix');
/**
* @desc      voucherPrefix registration form
* @author    Dawit Kiros
* @copyright (c) 2010, Cybersoft
* @date      November 01, 2010
* @namespace Ext.core.finance.ux.voucherPrefix
* @class     Ext.core.finance.ux.voucherPrefix.Form
* @extends   Ext.form.FormPanel
*/
Ext.core.finance.ux.voucherPrefix.Form = function (config) {
    Ext.core.finance.ux.voucherPrefix.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: VoucherPrefix.Get,
            submit: VoucherPrefix.Save
        },
        paramOrder: ['id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'voucherPrefix-form',
        padding: 5,
        labelWidth: 100,
        autoHeight: true,
        border: false,
        baseCls: 'x-plain',
        items: [{
            name: 'Id',
            xtype: 'hidden'
        }, {
             name: 'Code',
             xtype: 'textfield',
             fieldLabel: 'Code',
             allowBlank: false
        }, {
            name: 'Name',
            xtype: 'textfield',
            fieldLabel: 'Name',
            allowBlank: false
        }, {
             name: 'CreatedAt',
             xtype: 'hidden'
         }]
    }, config));
};
Ext.extend(Ext.core.finance.ux.voucherPrefix.Form, Ext.form.FormPanel);
Ext.reg('voucherPrefix-form', Ext.core.finance.ux.voucherPrefix.Form);

/**
* @desc      Voucher Prefix registration form host window
* @author    Dawit Kiros
* @copyright (c) 2010, Cybersoft
* @date      November 01, 2010
* @namespace Ext.core.finance.ux.voucherPrefix
* @class     Ext.core.finance.ux.voucherPrefix.Window
* @extends   Ext.Window
*/
Ext.core.finance.ux.voucherPrefix.Window = function (config) {
    Ext.core.finance.ux.voucherPrefix.Window.superclass.constructor.call(this, Ext.apply({
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
                this.form.getForm().findField('Id').setValue(this.voucherPrefixId);
                if (this.voucherPrefixId != '') {
                    this.form.load({ params: { id: this.voucherPrefixId} });
                }
            },
            scope: this
        }
    }, config));
};
Ext.extend(Ext.core.finance.ux.voucherPrefix.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.core.finance.ux.voucherPrefix.Form();
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
        Ext.core.finance.ux.voucherPrefix.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {
        if (!this.form.getForm().isValid()) return;
        this.form.getForm().submit({
            waitMsg: 'Please wait...',
            success: function () {
                Ext.getCmp('voucherPrefix-form').getForm().reset();
                Ext.getCmp('voucherPrefix-paging').doRefresh();
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
Ext.reg('voucherPrefix-window', Ext.core.finance.ux.voucherPrefix.Window);

/**
* @desc      Voucher Prefix grid
* @author    Dawit Kiros
* @copyright (c) 2010, Cybersoft
* @date      November 01, 2010
* @namespace Ext.core.finance.ux.voucherPrefix
* @class     Ext.core.finance.ux.voucherPrefix.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.core.finance.ux.voucherPrefix.Grid = function (config) {
    Ext.core.finance.ux.voucherPrefix.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: VoucherPrefix.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Code',
                direction: 'ASC'
            },
            fields: ['Id', 'Code', 'Name'],
            remoteSort: true
        }),
        id: 'voucherPrefix-grid',
        pageSize: 20,
        stripeRows: true,
        border: false,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        viewConfig: {
            
        },
        columns: [{
            dataIndex: 'Id',
            header: 'Id',
            sortable: true,
            hidden: true,
            width: 100,
            menuDisabled: true
        }, new Ext.grid.RowNumberer(), {
            dataIndex: 'Code',
            header: 'Code',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'Name',
            header: 'Name',
            sortable: true,
            width: 200,
            menuDisabled: true
        }]
    }, config));
};
Ext.extend(Ext.core.finance.ux.voucherPrefix.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.bbar = new Ext.PagingToolbar({
            id: 'voucherPrefix-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.core.finance.ux.voucherPrefix.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getStore().load({
            params: {
                start: 0,
                limit: this.pageSize
            }
        });
        Ext.core.finance.ux.voucherPrefix.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('voucherPrefix-grid', Ext.core.finance.ux.voucherPrefix.Grid);

/**
* @desc      Voucher Prefix panel
* @author    Dawit Kiros
* @copyright (c) 2010, Cybersoft
* @date      November 01, 2010
* @version   $Id: voucherPrefix.js, 0.1
* @namespace Ext.core.finance.ux.voucherPrefix
* @class     Ext.core.finance.ux.voucherPrefix.Panel
* @extends   Ext.Panel
*/
Ext.core.finance.ux.voucherPrefix.Panel = function (config) {
    Ext.core.finance.ux.voucherPrefix.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false,
        tbar: {
            xtype: 'toolbar',
            items: [{
                xtype: 'button',
                text: 'Add',
                iconCls: 'icon-add',
                disabled: !Ext.core.finance.ux.Reception.getPermission('Voucher Prefix', 'CanAdd'),
                handler: this.onAddClick
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Edit',
                iconCls: 'icon-edit',
                disabled: !Ext.core.finance.ux.Reception.getPermission('Voucher Prefix', 'CanEdit'),
                handler: this.onEditClick
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Delete',
                iconCls: 'icon-delete',
                disabled: !Ext.core.finance.ux.Reception.getPermission('Voucher Prefix', 'CanDelete'),
                handler: this.onDeleteClick
            }]
        }
    }, config));
};
Ext.extend(Ext.core.finance.ux.voucherPrefix.Panel, Ext.Panel, {
    initComponent: function () {
        this.items = [{
            xtype: 'voucherPrefix-grid',
            id: 'voucherPrefix-grid'
        }];
        Ext.core.finance.ux.voucherPrefix.Panel.superclass.initComponent.apply(this, arguments);
    },
    onAddClick: function () {
        new Ext.core.finance.ux.voucherPrefix.Window({
            voucherPrefixId: 0,
            title: 'Add Voucher Prefix '
        }).show();
    },
    onEditClick: function () {
        var grid = Ext.getCmp('voucherPrefix-grid');
        if (!grid.getSelectionModel().hasSelection()) {
            Ext.MessageBox.show({
                title: 'Select',
                msg: 'You must select a Voucher Prefix to edit.',
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
        var id = grid.getSelectionModel().getSelected().get('Id');
        new Ext.core.finance.ux.voucherPrefix.Window({
            voucherPrefixId: id,
            title: 'Edit Voucher Prefix'
        }).show();
    },
    onDeleteClick: function () {
        var grid = Ext.getCmp('voucherPrefix-grid');
        if (!grid.getSelectionModel().hasSelection()) {
            Ext.MessageBox.show({
                title: 'Select',
                msg: 'You must select a Voucher Prefix  to delete.',
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
        Ext.MessageBox.show({
            title: 'Delete',
            msg: 'Are you sure you want to delete the selected Voucher Prefix ',
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
                    VoucherPrefix.Delete(id, function (result, response) {
                        Ext.getCmp('voucherPrefix-paging').doRefresh();
                    }, this);
                }
            }
        });
    }
});
Ext.reg('voucherPrefix-panel', Ext.core.finance.ux.voucherPrefix.Panel);