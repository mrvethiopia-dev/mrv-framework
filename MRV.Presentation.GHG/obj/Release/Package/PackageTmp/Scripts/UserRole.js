Ext.ns('Ext.core.finance.ux.userRole');


/**
* @desc      UserRole registration form
* @author    Dawit Kiros Woldemichael
* @copyright (c) 2014, 
* @date      November 01, 2014
* @namespace Ext.core.finance.ux.userRole
* @class     Ext.core.finance.ux.userRole.Form
* @extends   Ext.form.FormPanel
*/

Ext.core.finance.ux.userRole.Form = function (config) {
    Ext.core.finance.ux.userRole.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: window.UserRole.Get,
            submit: window.UserRole.Save
        },
        paramOrder: ['id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'userRole-form',
        padding: 5,
        labelWidth: 150,
        autoHeight: true,
        border: false,
        baseCls: 'x-plain',
        items: [{
            name: 'Id',
            xtype: 'hidden'
        }, {
            hiddenName: 'RoleId',
            xtype: 'combo',
            fieldLabel: 'Role',
            triggerAction: 'all',
            mode: 'remote',
            editable: false,
            forceSelection: true,
            emptyText: '---Select---',
            allowBlank: false,
            store: new Ext.data.DirectStore({
                reader: new Ext.data.JsonReader({
                    successProperty: 'success',
                    idProperty: 'Id',
                    root: 'data',
                    fields: ['Id', 'Name']
                }),
                autoLoad: true,
                api: { read: window.SysMgr.GetRoles }
            }),
            valueField: 'Id',
            displayField: 'Name'
        }]
    }, config));
}
Ext.extend(Ext.core.finance.ux.userRole.Form, Ext.form.FormPanel);
Ext.reg('userRole-form', Ext.core.finance.ux.userRole.Form);

/**
* @desc      UserRole registration form host window
* @author    Dawit Kiros Woldemichael
* @copyright (c) 2014, 
* @date      November 01, 2014
* @namespace Ext.core.finance.ux.userRole
* @class     Ext.core.finance.ux.userRole.Window
* @extends   Ext.Window
*/
Ext.core.finance.ux.userRole.Window = function (config) {
    Ext.core.finance.ux.userRole.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'form',
        width: 500,
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;'
    }, config));
}
Ext.extend(Ext.core.finance.ux.userRole.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.core.finance.ux.userRole.Form();
        this.grid = new Ext.core.finance.ux.userRole.Grid({ userId: this.userId });
        this.items = [this.form, this.grid];
        this.buttons = [{
            text: 'Save',
            iconCls: 'icon-save',
            handler: this.onSaveUserRole,
            scope: this
        }, {
            text: 'Remove',
            iconCls: 'icon-delete',
            handler: this.onDeleteUserRole,
            scope: this
        }, {
            text: 'Close',
            iconCls: 'icon-exit',
            handler: this.onCloseUserRole,
            scope: this
        }];
        Ext.core.finance.ux.userRole.Window.superclass.initComponent.call(this, arguments);
    },
    onSaveUserRole: function () {
        if (!this.form.getForm().isValid()) return;
        this.form.getForm().submit({
            waitMsg: 'Please wait...',
            success: function () {
                Ext.getCmp('userRole-form').getForm().reset();
                Ext.getCmp('userRole-paging').doRefresh();
            },
            failure: function () {
                Ext.MessageBox.show({
                    title: 'Failure',
                    msg: 'The selected user has already been registered',
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.ERROR,
                    scope: this
                });
            },
            params: {
                record: Ext.encode({ userId: this.userId })
            }
        });
    },
    onDeleteUserRole: function () {
        if (!this.grid.getSelectionModel().hasSelection()) return;
        Ext.MessageBox.show({
            title: 'Delete',
            msg: 'Are you sure you want to delete the selected user',
            buttons: {
                ok: 'Yes',
                no: 'No'
            },
            icon: Ext.MessageBox.QUESTION,
            scope: this,
            animEl: 'delete',
            fn: function (btn) {
                if (btn == 'ok') {
                    var id = this.grid.getSelectionModel().getSelected().get('Id');
                    window.UserRole.Delete(id, function (/*result, response*/) {
                        this.grid.getStore().load({
                            params: {
                                start: 0,
                                limit: this.grid.pageSize
                            }
                        });
                    }, this);
                }
            }
        });
    },
    onCloseUserRole: function () {
        this.close();
    }
});
Ext.reg('userRole-window', Ext.core.finance.ux.userRole.Window);

/**
* @desc      UserRole grid
* @author    Dawit Kiros Woldemichael
* @copyright (c) 2014, 
* @date      November 01, 2014
* @namespace Ext.core.finance.ux.userRole
* @class     Ext.core.finance.ux.userRole.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.core.finance.ux.userRole.Grid = function (config) {
    Ext.core.finance.ux.userRole.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: window.UserRole.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Code',
                direction: 'ASC'
            },
            fields: ['Id', 'Role'],
            remoteSort: true,
            listeners: {
                beforeLoad: function () { Ext.getCmp('userRole-grid').body.mask('Loading...', 'x-mask-loading'); },
                load: function () { Ext.getCmp('userRole-grid').body.unmask(); },
                loadException: function () { Ext.getCmp('userRole-grid').body.unmask(); },
                scope: this
            }
        }),
        id: 'userRole-grid',
        pageSize: 10,
        height: 300,
        stripeRows: true,
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
                Ext.getCmp('userRole-form').getForm().load({ params: { id: id} });
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
        }, {
            dataIndex: 'Role',
            header: 'Role',
            sortable: true,
            width: 100,
            menuDisabled: true
        }]
    }, config));
}
Ext.extend(Ext.core.finance.ux.userRole.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ userId: this.userId }) };
        this.bbar = new Ext.PagingToolbar({
            id: 'userRole-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.core.finance.ux.userRole.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getStore().load({ params: { start: 0, limit: this.pageSize} });
        Ext.core.finance.ux.userRole.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('userRole-grid', Ext.core.finance.ux.userRole.Grid);
