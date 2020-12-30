﻿Ext.ns('Ext.core.finance.ux.payrollAccounts');
/**
* @desc      Accounts registration form
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.payrollAccounts
* @class     Ext.core.finance.ux.payrollAccounts.Form
* @extends   Ext.form.FormPanel
*/
Ext.core.finance.ux.payrollAccounts.Form = function (config) {
    Ext.core.finance.ux.payrollAccounts.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: PayrollAccounts.Get,
            submit: PayrollAccounts.Save
        },
        paramOrder: ['Id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'payrollAccounts-form',
        padding: 5,
        labelWidth: 150,
        autoHeight: true,
        border: false,
        baseCls: 'x-plain',
        items: [{
            name: 'Id',
            xtype: 'textfield',
           hidden: true
       }, {
            name: 'Code',
            xtype: 'numberfield',
            fieldLabel: 'Account Code',
            anchor: '75%',
            allowBlank: false
        },{
            name: 'Name',
            xtype: 'textfield',
            fieldLabel: 'Account Name',
            anchor: '95%',
            allowBlank: false
        }]
    }, config));
}
Ext.extend(Ext.core.finance.ux.payrollAccounts.Form, Ext.form.FormPanel);
Ext.reg('payrollAccounts-form', Ext.core.finance.ux.payrollAccounts.Form);

/**
* @desc      Accounts registration form host window
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.payrollAccounts
* @class     Ext.core.finance.ux.payrollAccounts.Window
* @extends   Ext.Window
*/
Ext.core.finance.ux.payrollAccounts.Window = function (config) {
    Ext.core.finance.ux.payrollAccounts.Window.superclass.constructor.call(this, Ext.apply({
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
                this.form.getForm().findField('Id').setValue(this.payrollAccountsId);
                if (this.payrollAccountsId != '') {
                    this.form.load({ params: { Id: this.payrollAccountsId} });
                }
            },
            scope: this
        }
    }, config));
}
Ext.extend(Ext.core.finance.ux.payrollAccounts.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.core.finance.ux.payrollAccounts.Form();
        this.items = [this.form];
        this.buttons = [{
            text: 'Save',
            iconCls: 'icon-save',
            handler: this.onSave,
            scope: this
        }, {
            text: 'Close',
            iconCls: 'icon-exit',
            handler: this.onClose,
            scope: this
        }];

        Ext.core.finance.ux.payrollAccounts.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {

        if (!this.form.getForm().isValid()) return;
        this.form.getForm().submit({
            waitMsg: 'Please wait...',
            success: function () {
                Ext.getCmp('payrollAccounts-form').getForm().reset();
                Ext.getCmp('payrollAccounts-paging').doRefresh();
            }
        });
    },
    onClose: function () {
        this.close();
    }
});
Ext.reg('payrollAccounts-window', Ext.core.finance.ux.payrollAccounts.Window);

/**
* @desc      Accounts grid
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.payrollAccounts
* @class     Ext.core.finance.ux.payrollAccounts.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.core.finance.ux.payrollAccounts.Grid = function (config) {
    Ext.core.finance.ux.payrollAccounts.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: PayrollAccounts.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Code',
                direction: 'ASC'
            },
            fields: ['Id', 'Name', 'Code'],
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
        id: 'payrollAccounts-grid',
        searchCriteria: {},
        pageSize: 35,
        //height: 600,
        stripeRows: true,
        columnLines: true,
        border: false,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        viewConfig: {
            forceFit: true,
            autoFill: true
        },
        listeners: {
            rowClick: function () {
                if (!this.getSelectionModel().hasSelection()) return;
                var id = this.getSelectionModel().getSelected().get('Id');
                var form = Ext.getCmp('payrollAccounts-form');
                if (id != null) {
                  
                }
            },
            scope: this,
            rowdblclick: function () {
                if (!this.getSelectionModel().hasSelection()) return;
                var id = this.getSelectionModel().getSelected().get('Id');

                if (id != null) {
                    var hasEditPermission = Ext.core.finance.ux.Reception.getPermission('Accounts', 'CanEdit');
                    if (hasEditPermission) {
                        new Ext.core.finance.ux.payrollAccounts.Window({
                            payrollAccountsId: id,
                            title: 'Edit Accounts'
                        }).show();
                    }

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
        }, new Ext.erp.ux.grid.PagingRowNumberer(),
         {
             dataIndex: 'Name',
             header: 'Account Name',
             sortable: true,
             width: 55,
             menuDisabled: true
         }, {
             dataIndex: 'Code',
             header: 'Account Code',
             sortable: true,
             width: 55,
             menuDisabled: true
         }]
    }, config));
};
Ext.extend(Ext.core.finance.ux.payrollAccounts.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ mode: 'get' }) };
        this.tbar = [];
        this.bbar = new Ext.PagingToolbar({
            id: 'payrollAccounts-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.core.finance.ux.payrollAccounts.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getStore().load({
            params: { start: 0, limit: this.pageSize }
        });
        Ext.core.finance.ux.payrollAccounts.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('payrollAccounts-grid', Ext.core.finance.ux.payrollAccounts.Grid);

/**
* @desc      Accounts panel
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @version   $Id: payrollAccounts.js, 0.1
* @namespace Ext.core.finance.ux.payrollAccounts
* @class     Ext.core.finance.ux.payrollAccounts.Panel
* @extends   Ext.Panel
*/
Ext.core.finance.ux.payrollAccounts.Panel = function (config) {
    Ext.core.finance.ux.payrollAccounts.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false,
        tbar: {
            xtype: 'toolbar',
            items: [{
                xtype: 'button',
                text: 'Add',
                id: 'addpayrollAccounts',
                iconCls: 'icon-add',
                handler: this.onAddClick,
                disabled: !Ext.core.finance.ux.Reception.getPermission('Accounts', 'CanAdd')
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Edit',
                id: 'editpayrollAccounts',
                iconCls: 'icon-edit',
                handler: this.onEditClick,
                disabled: !Ext.core.finance.ux.Reception.getPermission('Accounts', 'CanEdit')
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Delete',
                id: 'deletepayrollAccounts',
                iconCls: 'icon-delete',
                handler: this.onDeleteClick,
                disabled: !Ext.core.finance.ux.Reception.getPermission('Accounts', 'CanDelete')
            }]
        }
    }, config));
}
Ext.extend(Ext.core.finance.ux.payrollAccounts.Panel, Ext.Panel, {
    initComponent: function () {
        this.items = [{
            xtype: 'payrollAccounts-grid',
            id: 'payrollAccounts-grid'
        }];
        Ext.core.finance.ux.payrollAccounts.Panel.superclass.initComponent.apply(this, arguments);
    },

    onAddClick: function () {
        new Ext.core.finance.ux.payrollAccounts.Window({
            payrollAccountsId: 0,
            title: 'Add Accounts'
        }).show();
    },
    onEditClick: function () {
        var grid = Ext.getCmp('payrollAccounts-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');
        new Ext.core.finance.ux.payrollAccounts.Window({
            payrollAccountsId: id,
            title: 'Edit Accounts'
        }).show();
    },
    onDeleteClick: function () {
        var grid = Ext.getCmp('payrollAccounts-grid');
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
                    PayrollAccounts.Delete(id, function (result, response) {
                        Ext.getCmp('payrollAccounts-paging').doRefresh();
                    }, this);
                }
            }
        });
    }
});
Ext.reg('payrollAccounts-panel', Ext.core.finance.ux.payrollAccounts.Panel);