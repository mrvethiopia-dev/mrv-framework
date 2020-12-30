Ext.ns('Ext.core.finance.ux.roleMember');
/**
* @desc      RoleMember registration form
* @author    Dawit Kiros Woldemichael
* @copyright (c) 2014, 
* @date      November 01, 2014
* @namespace Ext.core.finance.ux.roleMember
* @class     Ext.core.finance.ux.roleMember.Form
* @extends   Ext.form.FormPanel
*/
Ext.core.finance.ux.roleMember.Form = function (config) {
    Ext.core.finance.ux.roleMember.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: RoleMember.Get,
            submit: RoleMember.Save
        },
        paramOrder: ['id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'roleMember-form',
        padding: 5,
        labelWidth: 150,
        autoHeight: true,
        border: false,
        baseCls: 'x-plain',
        items: [{
            name: 'Id',
            xtype: 'hidden'
        }, {
            hiddenName: 'UserId',
            xtype: 'combo',
            fieldLabel: 'User',
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
                    fields: ['Id', 'FullName']
                }),
                autoLoad: true,
                api: { read: window.SysMgr.GetUsers }
            }),
            valueField: 'Id',
            displayField: 'FullName'
        }]
    }, config));
}
Ext.extend(Ext.core.finance.ux.roleMember.Form, Ext.form.FormPanel);
Ext.reg('roleMember-form', Ext.core.finance.ux.roleMember.Form);

/**
* @desc      RoleMember registration form host window
* @author    Dawit Kiros Woldemichael
* @copyright (c) 2014, 
* @date      November 01, 2014
* @namespace Ext.core.finance.ux.roleMember
* @class     Ext.core.finance.ux.roleMember.Window
* @extends   Ext.Window
*/
Ext.core.finance.ux.roleMember.Window = function (config) {
    Ext.core.finance.ux.roleMember.Window.superclass.constructor.call(this, Ext.apply({
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
Ext.extend(Ext.core.finance.ux.roleMember.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.core.finance.ux.roleMember.Form();
        this.grid = new Ext.core.finance.ux.roleMember.Grid({ roleId: this.roleId });
        this.items = [this.form, this.grid];
        this.buttons = [{
            text: 'Save',
            iconCls: 'icon-save',
            handler: this.onSaveRoleMember,
            scope: this
        }, {
            text: 'Delete',
            iconCls: 'icon-delete',
            handler: this.onDeleteRoleMember,
            scope: this
        }, {
            text: 'Close',
            iconCls: 'icon-exit',
            handler: this.onCloseRoleMember,
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
        Ext.core.finance.ux.roleMember.Window.superclass.initComponent.call(this, arguments);
    },
    onSaveRoleMember: function () {
        if (!this.form.getForm().isValid()) return;
        this.form.getForm().submit({
            waitMsg: 'Please wait...',
            success: function () {
                Ext.getCmp('roleMember-form').getForm().reset();
                Ext.getCmp('roleMember-paging').doRefresh();
            },
            failure: function () {
                Ext.MessageBox.show({
                    title: 'Failure',
                    msg: 'The selected Role has already been registered',
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.ERROR,
                    scope: this
                });
            },
            params: {
                record: Ext.encode({ roleId: this.roleId })
            }
        });
    },
    onDeleteRoleMember: function () {
        if (!this.grid.getSelectionModel().hasSelection()) return;
        Ext.MessageBox.show({
            title: 'Delete',
            msg: 'Are you sure you want to delete the selected Role',
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
                    RoleMember.Delete(id, function (result, response) {
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
    onCloseRoleMember: function () {
        this.close();
    }
});
Ext.reg('roleMember-window', Ext.core.finance.ux.roleMember.Window);

/**
* @desc      RoleMember grid
* @author    Dawit Kiros Woldemichael
* @copyright (c) 2014, 
* @date      November 01, 2014
* @namespace Ext.core.finance.ux.roleMember
* @class     Ext.core.finance.ux.roleMember.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.core.finance.ux.roleMember.Grid = function (config) {
    Ext.core.finance.ux.roleMember.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: RoleMember.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Code',
                direction: 'ASC'
            },
            fields: ['Id', 'FirstName', 'LastName', 'UserName'],
            remoteSort: true,
            listeners: {
                beforeLoad: function () { Ext.getCmp('roleMember-grid').body.mask('Loading...', 'x-mask-loading'); },
                load: function () { Ext.getCmp('roleMember-grid').body.unmask(); },
                loadException: function () { Ext.getCmp('roleMember-grid').body.unmask(); },
                scope: this
            }
        }),
        id: 'roleMember-grid',
        pageSize: 10,
        height: 300,
        stripeRows: true,
        border: true,
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
                Ext.getCmp('roleMember-form').getForm().load({ params: { id: id} });
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
            dataIndex: 'FirstName',
            header: 'First Name',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'LastName',
            header: 'Last Name',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'UserName',
            header: 'User Name',
            sortable: true,
            width: 100,
            menuDisabled: true
        }]
    }, config));
}
Ext.extend(Ext.core.finance.ux.roleMember.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ roleId: this.roleId }) };
        this.bbar = new Ext.PagingToolbar({
            id: 'roleMember-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.core.finance.ux.roleMember.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getStore().load({ params: { start: 0, limit: this.pageSize} });
        Ext.core.finance.ux.roleMember.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('roleMember-grid', Ext.core.finance.ux.roleMember.Grid);
