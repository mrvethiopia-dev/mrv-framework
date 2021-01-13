Ext.ns('Ext.mrv.ghginventory.ux.rolePermission');
/**
* @desc      RolePermission registration form
* @author    Eyosiyas Fisseha


* @namespace Ext.mrv.ghginventory.ux.rolePermission
* @class     Ext.mrv.ghginventory.ux.rolePermission.Form
* @extends   Ext.form.FormPanel
*/
Ext.mrv.ghginventory.ux.rolePermission.Form = function (config) {
    Ext.mrv.ghginventory.ux.rolePermission.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: RolePermission.Get,
            submit: RolePermission.Save
        },
        paramOrder: ['id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'rolePermission-form',
        padding: 5,
        labelWidth: 150,
        autoHeight: true,
        border: false,
        baseCls: 'x-plain',
        items: [{
            name: 'Id',
            xtype: 'hidden'
        }, {
            hiddenName: 'SubsystemId',
            xtype: 'combo',
            fieldLabel: 'Subsystem',
            triggerAction: 'all',
            mode: 'remote',
            editable: false,
            forceSelection: true,
            emptyText: '---Select---',
            store: new Ext.data.DirectStore({
                reader: new Ext.data.JsonReader({
                    successProperty: 'success',
                    idProperty: 'Id',
                    root: 'data',
                    fields: ['Id', 'Name']
                }),
                autoLoad: true,
                api: { read: window.SysMgr.GetSubsystems }
            }),
            valueField: 'Id',
            displayField: 'Name',
            listeners: {
                'select': function (cmb, rec, idx) {
                    var form = Ext.getCmp('rolePermission-form').getForm();
                    var subsystemId = this.getValue();
                    var moduleCombo = form.findField('ModuleId');                    
                    moduleCombo.clearValue();
                    moduleCombo.store.load({ params: { subsystemId: subsystemId} });
                    var operationCombo = form.findField('OperationId');
                    operationCombo.clearValue();
                    operationCombo.store.load({ params: { moduleId: 0} });
                }
            }
        }, {
            hiddenName: 'ModuleId',
            xtype: 'combo',
            fieldLabel: 'Module',
            triggerAction: 'all',
            mode: 'local',
            editable: false,
            forceSelection: true,
            emptyText: '---Select---',
            store: new Ext.data.DirectStore({
                reader: new Ext.data.JsonReader({
                    successProperty: 'success',
                    idProperty: 'Id',
                    root: 'data',
                    fields: ['Id', 'Name']
                }),
                paramOrder: ['subsystemId'],
                api: { read: window.SysMgr.GetModules }
            }),
            valueField: 'Id',
            displayField: 'Name',
            listeners: {
                'select': function (cmb, rec, idx) {
                    var form = Ext.getCmp('rolePermission-form').getForm();
                    var moduleId = this.getValue();
                    var operationCombo = form.findField('OperationId');
                    operationCombo.clearValue();
                    operationCombo.store.load({ params: { moduleId: moduleId} });
                }
            }
        }, {
            hiddenName: 'OperationId',
            xtype: 'combo',
            fieldLabel: 'Operation',
            triggerAction: 'all',
            mode: 'local',
            editable: false,
            forceSelection: true,
            allowBlank: false,
            emptyText: '---Select---',
            store: new Ext.data.DirectStore({
                reader: new Ext.data.JsonReader({
                    successProperty: 'success',
                    idProperty: 'Id',
                    root: 'data',
                    fields: ['Id', 'Name']
                }),
                paramOrder: ['moduleId'],
                api: { read: window.SysMgr.GetOperations }
            }),
            valueField: 'Id',
            displayField: 'Name'
        }, {
            hiddenName: 'AccessLevelId',
            xtype: 'combo',
            fieldLabel: 'Access Level',
            triggerAction: 'all',
            mode: 'remote',
            editable: false,
            forceSelection: true,
            allowBlank: false,
            emptyText: '---Select---',
            store: new Ext.data.DirectStore({
                reader: new Ext.data.JsonReader({
                    successProperty: 'success',
                    idProperty: 'Id',
                    root: 'data',
                    fields: ['Id', 'Name']
                }),
                autoLoad: true,
                api: { read: window.SysMgr.GetAccessLevels }
            }),
            valueField: 'Id',
            displayField: 'Name'
        }]
    }, config));
}
Ext.extend(Ext.mrv.ghginventory.ux.rolePermission.Form, Ext.form.FormPanel);
Ext.reg('rolePermission-form', Ext.mrv.ghginventory.ux.rolePermission.Form);

/**
* @desc      RolePermission registration form host window
* @author    Eyosiyas Fisseha


* @namespace Ext.mrv.ghginventory.ux.rolePermission
* @class     Ext.mrv.ghginventory.ux.rolePermission.Window
* @extends   Ext.Window
*/
Ext.mrv.ghginventory.ux.rolePermission.Window = function (config) {
    Ext.mrv.ghginventory.ux.rolePermission.Window.superclass.constructor.call(this, Ext.apply({
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
Ext.extend(Ext.mrv.ghginventory.ux.rolePermission.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.mrv.ghginventory.ux.rolePermission.Form();
        this.grid = new Ext.mrv.ghginventory.ux.rolePermission.Grid({ roleId: this.roleId });
        this.items = [this.form, this.grid];
        this.buttons = [{
            text: 'Save',
            iconCls: 'icon-save',
            handler: this.onSaveRolePermission,
            scope: this
        }, {
            text: 'Delete',
            iconCls: 'icon-delete',
            handler: this.onDeleteRolePermission,
            scope: this
        }, {
            text: 'Close',
            iconCls: 'icon-exit',
            handler: this.onCloseRolePermission,
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
        Ext.mrv.ghginventory.ux.rolePermission.Window.superclass.initComponent.call(this, arguments);
    },
    onSaveRolePermission: function () {
        if (!this.form.getForm().isValid()) return;
        this.form.getForm().submit({
            waitMsg: 'Please wait...',
            success: function () {
                var form = Ext.getCmp('rolePermission-form').getForm();
                form.findField('OperationId').clearValue();
                form.findField('AccessLevelId').clearValue();
                Ext.getCmp('rolePermission-paging').doRefresh();
            },
            failure: function () {
                Ext.MessageBox.show({
                    title: 'Failure',
                    msg: 'The selected permission has already been registered',
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
    onDeleteRolePermission: function () {
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
                    RolePermission.Delete(id, function (result, response) {
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
    onCloseRolePermission: function () {
        this.close();
    }
});
Ext.reg('rolePermission-window', Ext.mrv.ghginventory.ux.rolePermission.Window);

/**
* @desc      RolePermission grid
* @author    Eyosiyas Fisseha


* @namespace Ext.mrv.ghginventory.ux.rolePermission
* @class     Ext.mrv.ghginventory.ux.rolePermission.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.mrv.ghginventory.ux.rolePermission.Grid = function (config) {
    Ext.mrv.ghginventory.ux.rolePermission.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: RolePermission.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Code',
                direction: 'ASC'
            },
            fields: ['Id', 'Role', 'Operation', 'AccessLevel'],
            remoteSort: true,
            listeners: {
                beforeLoad: function () { Ext.getCmp('rolePermission-grid').body.mask('Loading...', 'x-mask-loading'); },
                load: function () { Ext.getCmp('rolePermission-grid').body.unmask(); },
                loadException: function () { Ext.getCmp('rolePermission-grid').body.unmask(); },
                scope: this
            }
        }),
        id: 'rolePermission-grid',
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
        }, {
            dataIndex: 'Operation',
            header: 'Operation',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'AccessLevel',
            header: 'Access Level',
            sortable: true,
            width: 100,
            menuDisabled: true
        }]
    }, config));
}
Ext.extend(Ext.mrv.ghginventory.ux.rolePermission.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ roleId: this.roleId }) };
        this.bbar = new Ext.PagingToolbar({
            id: 'rolePermission-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.mrv.ghginventory.ux.rolePermission.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getStore().load({ params: { start: 0, limit: this.pageSize} });
        Ext.mrv.ghginventory.ux.rolePermission.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('rolePermission-grid', Ext.mrv.ghginventory.ux.rolePermission.Grid);
