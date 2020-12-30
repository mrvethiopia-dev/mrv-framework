Ext.ns('Ext.core.finance.ux.userSubsystem');
/**
* @desc      UserSubsystem registration form
* @author    Dawit Kiros Woldemichael
* @copyright (c) 2014, 
* @date      November 01, 2014
* @namespace Ext.core.finance.ux.userSubsystem
* @class     Ext.core.finance.ux.userSubsystem.Form
* @extends   Ext.form.FormPanel
*/

Ext.core.finance.ux.userSubsystem.Form = function (config) {
    Ext.core.finance.ux.userSubsystem.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: window.UserSubsystem.Get,
            submit: window.UserSubsystem.Save
        },
        paramOrder: ['id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'userSubsystem-form',
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
            allowBlank: false,
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
            displayField: 'Name'
        }]
    }, config));
}
Ext.extend(Ext.core.finance.ux.userSubsystem.Form, Ext.form.FormPanel);
Ext.reg('userSubsystem-form', Ext.core.finance.ux.userSubsystem.Form);

/**
* @desc      UserSubsystem registration form host window
* @author    Dawit Kiros Woldemichael
* @copyright (c) 2014, 
* @date      November 01, 2014
* @namespace Ext.core.finance.ux.userSubsystem
* @class     Ext.core.finance.ux.userSubsystem.Window
* @extends   Ext.Window
*/
Ext.core.finance.ux.userSubsystem.Window = function (config) {
    Ext.core.finance.ux.userSubsystem.Window.superclass.constructor.call(this, Ext.apply({
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
Ext.extend(Ext.core.finance.ux.userSubsystem.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.core.finance.ux.userSubsystem.Form();
        this.grid = new Ext.core.finance.ux.userSubsystem.Grid({ userId: this.userId });
        this.items = [this.form, this.grid];
        this.buttons = [{
            text: 'Save',
            iconCls: 'icon-save',
            handler: this.onUserSubsystemSave,
            scope: this
        }, {
            text: 'Delete',
            iconCls: 'icon-delete',
            handler: this.onUserSubsystemDelete,
            scope: this
        }, {
            text: 'Close',
            iconCls: 'icon-exit',
            handler: this.onUserSubsystemClose,
            scope: this
        }];
        Ext.core.finance.ux.userSubsystem.Window.superclass.initComponent.call(this, arguments);
    },
    onUserSubsystemSave: function () {
        if (!this.form.getForm().isValid()) return;
        this.form.getForm().submit({
            waitMsg: 'Please wait...',
            success: function () {
                Ext.getCmp('userSubsystem-form').getForm().reset();
                Ext.getCmp('userSubsystem-paging').doRefresh();
            },
            failure: function () {
                Ext.MessageBox.show({
                    title: 'Failure',
                    msg: 'The selected Module has already been registered',
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
    onUserSubsystemDelete: function () {
        if (!this.grid.getSelectionModel().hasSelection()) return;
        Ext.MessageBox.show({
            title: 'Delete',
            msg: 'Are you sure you want to delete the selected Module',
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
                    window.UserSubsystem.Delete(id, function (/*result, response*/) {
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
    onUserSubsystemClose: function () {
        this.close();
    }
});
Ext.reg('userSubsystem-window', Ext.core.finance.ux.userSubsystem.Window);

/**
* @desc      UserSubsystem grid
* @author    Dawit Kiros Woldemichael
* @copyright (c) 2014, 
* @date      November 01, 2014
* @namespace Ext.core.finance.ux.userSubsystem
* @class     Ext.core.finance.ux.userSubsystem.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.core.finance.ux.userSubsystem.Grid = function (config) {
    Ext.core.finance.ux.userSubsystem.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: window.UserSubsystem.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Code',
                direction: 'ASC'
            },
            fields: ['Id', 'SubSystem'],
            remoteSort: true,
            listeners: {
                beforeLoad: function () { Ext.getCmp('userSubsystem-grid').body.mask('Loading...', 'x-mask-loading'); },
                load: function () { Ext.getCmp('userSubsystem-grid').body.unmask(); },
                loadException: function () { Ext.getCmp('userSubsystem-grid').body.unmask(); },
                scope: this
            }
        }),
        id: 'userSubsystem-grid',
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
                Ext.getCmp('userSubsystem-form').getForm().load({ params: { id: id} });
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
            dataIndex: 'SubSystem',
            header: 'SubSystem',
            sortable: true,
            width: 100,
            menuDisabled: true
        }]
    }, config));
}
Ext.extend(Ext.core.finance.ux.userSubsystem.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ userId: this.userId }) };
        this.bbar = new Ext.PagingToolbar({
            id: 'userSubsystem-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.core.finance.ux.userSubsystem.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getStore().load({ params: { start: 0, limit: this.pageSize} });
        Ext.core.finance.ux.userSubsystem.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('userSubsystem-grid', Ext.core.finance.ux.userSubsystem.Grid);
