Ext.ns('Ext.core.finance.ux.user');


/**
* @desc      User registration form
* @author    Dawit Kiros Woldemichael
* @copyright (c) 2014, 
* @date      November 01, 2014
* @namespace Ext.core.finance.ux.user
* @class     Ext.core.finance.ux.user.Form
* @extends   Ext.form.FormPanel
*/

Ext.core.finance.ux.user.Form = function (config) {
    Ext.core.finance.ux.user.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: window.User.Get,
            submit: window.User.Save
        },
        paramOrder: ['id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'user-form',
        autoHeight: true,
        border: false,
        width: 500,
        baseCls: 'x-plain'
    }, config));
};
Ext.extend(Ext.core.finance.ux.user.Form, Ext.form.FormPanel);
Ext.reg('user-form', Ext.core.finance.ux.user.Form);

/**
* @desc      User registration form host window
* @author    Dawit Kiros Woldemichael
* @copyright (c) 2014, 
* @date      November 01, 2014
* @namespace Ext.core.finance.ux.user
* @class     Ext.core.finance.ux.user.Window
* @extends   Ext.Window
*/
Ext.core.finance.ux.user.Window = function (config) {
    Ext.core.finance.ux.user.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'form',
        width: 500,
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;',
        listeners: {
            show: function () {
                this.form.getForm().findField('Id').setValue(this.userId);
                if (this.userId > 0) {
                    this.form.load({
                        params: { id: this.userId },
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
                }
            },
            scope: this
        }
    }, config));
};
Ext.extend(Ext.core.finance.ux.user.Window, Ext.Window, {
    initComponent: function () {        
        this.bbar = [{
            xtype: 'tbfill'
        }, {
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
        Ext.core.finance.ux.user.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {
        if (!this.form.getForm().isValid()) return;
        var roles = '';
        var subsystems = '';
        for(var i=0; i < this.roles.length; i++){
            if(this.roles[i].checked){
                roles = roles + this.roles[i].roleId + ':';
            }
        }
        for(var i=0; i < this.subsystems.length; i++){
            if(this.subsystems[i].checked){
                subsystems = subsystems + this.subsystems[i].subsystemId + ':';
            }
        }
        roles = roles || ':';
        subsystems = subsystems || ':';
        this.form.getForm().submit({
            params: { record: Ext.encode({ roles: roles, subsystems: subsystems }) },
            waitMsg: 'Please wait...',
            success: function () {
                Ext.getCmp('user-form').getForm().reset();
                Ext.getCmp('user-paging').doRefresh();
            },
            failure: function (form, action) {
                Ext.MessageBox.show({
                    title: 'Errors',
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
Ext.reg('user-window', Ext.core.finance.ux.user.Window);


/**
* @desc      User grid
* @author    Dawit Kiros Woldemichael
* @copyright (c) 2014, 
* @date      November 01, 2014
* @namespace Ext.core.finance.ux.user
* @class     Ext.core.finance.ux.user.Grid
* @extends   Ext.grid.GridPanel
*/

Ext.core.finance.ux.user.Grid = function (config) {
    Ext.core.finance.ux.user.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: window.User.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'UserName',
                direction: 'ASC'
            },
            fields: ['Id', 'Username', 'MemberOf', 'IsActive'],
            remoteSort: true
        }),
        loadMask: true,
        id: 'user-grid',
        pageSize: 20,
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
            containermousedown: function (grid/*, e*/) {
                grid.getSelectionModel().deselectRange(0, grid.pageSize);
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
            dataIndex: 'Username',
            header: 'User Name',
            sortable: true,
            width: 100,
            menuDisabled: false
        }, {
            dataIndex: 'MemberOf',
            header: 'Member Of',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'IsActive',
            header: 'Is Active',
            width: 100,
            renderer: function (value/*, metaData, record, rowIndex, colIndex, store*/) {
                if (value)
                    return '<img src="Content/images/app/yes.png"/>';
                else
                    return '<img src="Content/images/app/no.png"/>';
            }
        }]
    }, config));
};
Ext.extend(Ext.core.finance.ux.user.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams['record'] = Ext.encode({ searchText: '' });
        this.bbar = new Ext.PagingToolbar({
            id: 'user-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.core.finance.ux.user.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getStore().load({
            params: { start: 0, limit: this.pageSize }
        });
        Ext.core.finance.ux.user.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('user-grid', Ext.core.finance.ux.user.Grid);

/**
* @desc      User panel
* @author    Dawit Kiros Woldemichael
* @copyright (c) 2014, 
* @date      November 01, 2014c
* @version   $Id: User.js, 0.1
* @namespace Ext.core.finance.ux.user
* @class     Ext.core.finance.ux.user.Panel
* @extends   Ext.Panel
*/
Ext.core.finance.ux.user.Panel = function (config) {
    Ext.core.finance.ux.user.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false,
        tbar: {
            xtype: 'toolbar',
            items: [{
                xtype: 'button',
                text: 'Add',
                id: 'addUser',
                iconCls: 'icon-add',
                disabled: !Ext.core.finance.ux.Reception.getPermission('User', 'CanAdd'),
                handler: this.onAddClick
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Edit',
                id: 'editUser',
                iconCls: 'icon-edit',
                disabled: !Ext.core.finance.ux.Reception.getPermission('User', 'CanEdit'),
                handler: this.onEditClick
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Delete',
                id: 'deleteUser',
                iconCls: 'icon-delete',
                disabled: !Ext.core.finance.ux.Reception.getPermission('User', 'CanDelete'),
                handler: this.onDeleteClick
            }, {
                xtype: 'tbfill'
            }, {
                xtype: 'textfield',
                emptyText: 'Search',
                submitEmptyText: false,
                enableKeyEvents: true,
                style: {
                    borderRadius: '5px',
                    padding: '0 10px',
                    width: '179px'
                },
                listeners: {
                    specialkey: function (field, e) {
                        if (e.getKey() == e.ENTER) {
                            var grid = Ext.getCmp('user-grid');
                            grid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue() });
                            grid.store.load({ params: { start: 0, limit: grid.pageSize} });
                        }
                    },
                    keyup: function (field/*, e*/) {
                        if (field.getValue() == '') {
                            var grid = Ext.getCmp('user-grid');
                            grid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue() });
                            grid.store.load({ params: { start: 0, limit: grid.pageSize} });
                        }
                    }
                }
            }]
        }
    }, config));
};
Ext.extend(Ext.core.finance.ux.user.Panel, Ext.Panel, {
    initComponent: function () {
        this.items = [{
            xtype: 'user-grid',
            id: 'user-grid'
        }];
        Ext.core.finance.ux.user.Panel.superclass.initComponent.apply(this, arguments);
    },
    onAddClick: function () {
        var roleCheckBoxCollection = new Array();
        var subsystemCheckBoxCollection = new Array();
        window.Tsa.GetRolesAndSystems(function (result) {
            for (var i = 0; i < result.countRoles; i++) {
                var roleCheckBox = new Ext.form.Checkbox({
                    name: 'chkRole' + i,
                    roleId: result.roles[i].Id,
                    checkBoxIndex: i,
                    boxLabel: result.roles[i].Name,
                    hideLabel: true
                });
                roleCheckBoxCollection[i] = roleCheckBox;
            }

            for (var j = 0; j < result.countSubsystems; j++) {
                var subsystemCheckBox = new Ext.form.Checkbox({
                    name: 'chkSubsystem' + j,
                    checkBoxIndex: j,
                    subsystemId: result.subsystems[j].Id,
                    boxLabel: result.subsystems[j].Name,
                    hideLabel: true
                });
                subsystemCheckBoxCollection[j] = subsystemCheckBox;
            }

            var form = new Ext.core.finance.ux.user.Form({
                items: [{
                    xtype: 'fieldset',
                    title: 'User Info',
                    defaults: {
                        anchor: '-10',
                        labelStyle: 'text-align:right;'
                    },
                    items: [{
                        name: 'Id',
                        xtype: 'hidden'
                    }, {
                        name: 'Username',
                        xtype: 'textfield',
                        fieldLabel: 'User Name',
                        allowBlank: false

                    } , {
                        name: 'FullName',
                        xtype: 'textfield',
                        fieldLabel: 'Full Name',
                        allowBlank: false

                    }, {
                        name: 'Password',
                        xtype: 'textfield',
                        inputType: 'password',
                        fieldLabel: 'Password',
                        allowBlank: false
                    }, {
                        name: 'IsActive',
                        xtype: 'checkbox',
                        
                        checked: false,
                        fieldLabel: 'Is Active'
                    }]
                }, {
                    layout: 'column',
                    border: false,
                    width: 500,
                    bodyStyle: 'background-color:transparent;',
                    defaults: {
                        columnWidth: .5,
                        border: false,
                        bodyStyle: 'background-color:transparent;',
                        layout: 'form'
                    },
                    items: [{
                        items: [{
                            xtype: 'fieldset',
                            anchor: '95%',
                            title: 'User Roles',
                            items: [roleCheckBoxCollection]
                        }]
                    }, {
                        items: [{
                            xtype: 'fieldset',
                            title: 'User Subsystems',
                            items: [subsystemCheckBoxCollection]
                        }]
                    }]
                }]
            });
            new Ext.core.finance.ux.user.Window({
                form: form,
                roles: roleCheckBoxCollection,
                subsystems: subsystemCheckBoxCollection,
                items: [form],
                userId: 0,
                title: 'Add User'
            }).show();
        });
    },
    onEditClick: function () {
        var grid = Ext.getCmp('user-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');
        var roleCheckBoxCollection = new Array();
        var subsystemCheckBoxCollection = new Array();
        window.Tsa.GetRolesAndSystems(function (result) {
            window.User.GetUserRolesAndSystems(id, function (userRoleSubsystemResult) {
                var userRoles = userRoleSubsystemResult.roles;
                var userSubsystems = userRoleSubsystemResult.subsystems;
                var countUserRoles = userRoleSubsystemResult.countUserRoles;
                var countUserSubsystems = userRoleSubsystemResult.countUserSubsystems;
                var checked;
                for (var i = 0; i < result.countRoles; i++) {
                    checked = false;
                    for (var j = 0; j < countUserRoles; j++) {
                        if (result.roles[i].Id == userRoles[j].RoleId) {
                            checked = true;
                            break;
                        }
                    }
                    var roleCheckBox = new Ext.form.Checkbox({
                        name: 'chkRole' + i,
                        roleId: result.roles[i].Id,
                        checkBoxIndex: i,
                        boxLabel: result.roles[i].Name,
                        hideLabel: true,
                        checked: checked
                    });
                    roleCheckBoxCollection[i] = roleCheckBox;
                }

                for (var i = 0; i < result.countSubsystems; i++) {
                    checked = false;
                    for (var j = 0; j < countUserSubsystems; j++) {
                        if (result.subsystems[i].Id == userSubsystems[j].SubsystemId) {
                            checked = true;
                            break;
                        }
                    }
                    var subsystemCheckBox = new Ext.form.Checkbox({
                        name: 'chkSubsystem' + i,
                        checkBoxIndex: i,
                        subsystemId: result.subsystems[i].Id,
                        boxLabel: result.subsystems[i].Name,
                        hideLabel: true,
                        checked: checked
                    });
                    subsystemCheckBoxCollection[i] = subsystemCheckBox;
                }

                var form = new Ext.core.finance.ux.user.Form({
                    items: [{
                        xtype: 'fieldset',
                        title: 'User Info',
                        defaults: {
                            anchor: '-10',
                            labelStyle: 'text-align:right;'
                        },
                        items: [{
                            name: 'Id',
                            xtype: 'hidden'
                        }, {
                            name: 'Username',
                            xtype: 'textfield',
                            fieldLabel: 'User Name',
                            allowBlank: false
                        },  {
                            name: 'FullName',
                            xtype: 'textfield',
                            fieldLabel: 'Full Name',
                            allowBlank: false

                        }, {
                            name: 'Password',
                            xtype: 'textfield',
                            inputType: 'password',
                            fieldLabel: 'Password',
                            allowBlank: false
                        }, {
                            name: 'IsActive',
                            xtype: 'checkbox',

                            checked: false,
                            fieldLabel: 'Is Active'
                        }]
                    }, {
                        layout: 'column',
                        border: false,
                        width: 500,
                        bodyStyle: 'background-color:transparent;',
                        defaults: {
                            columnWidth: .5,
                            border: false,
                            bodyStyle: 'background-color:transparent;',
                            layout: 'form'
                        },
                        items: [{
                            items: [{
                                xtype: 'fieldset',
                                anchor: '95%',
                                title: 'User Roles',
                                items: [roleCheckBoxCollection]
                            }]
                        }, {
                            items: [{
                                xtype: 'fieldset',
                                title: 'User Subsystems',
                                items: [subsystemCheckBoxCollection]
                            }]
                        }]
                    }]
                });
                new Ext.core.finance.ux.user.Window({
                    form: form,
                    roles: roleCheckBoxCollection,
                    subsystems: subsystemCheckBoxCollection,
                    items: [form],
                    userId: id,
                    title: 'Add User'
                }).show();
            });
        });
    },
    onDeleteClick: function () {
        var grid = Ext.getCmp('user-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        Ext.MessageBox.show({
            title: 'Delete',
            msg: 'Are you sure you want to delete the selected user',
            buttons: {
                ok: 'Yes',
                no: 'No'
            },
            icon: Ext.MessageBox.QUESTION,
            scope: this,
            fn: function (btn) {
                if (btn == 'ok') {
                    var id = grid.getSelectionModel().getSelected().get('Id');
                    window.User.Delete(id, function (result/*, response*/) {
                        Ext.getCmp('user-paging').doRefresh();
                        if (!result.success) {
                            Ext.MessageBox.show({
                                title: 'Error',
                                msg: result.data,
                                buttons: Ext.Msg.OK,
                                icon: Ext.MessageBox.ERROR,
                                scope: this
                            });
                        }
                    }, this);
                }
            }
        });
    }
});
Ext.reg('user-panel', Ext.core.finance.ux.user.Panel);
