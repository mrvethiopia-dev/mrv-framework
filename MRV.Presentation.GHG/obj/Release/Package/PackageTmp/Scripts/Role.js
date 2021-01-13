Ext.ns('Ext.mrv.ghginventory.ux.role');
/**
* @desc      Role registration form
* @author    Dawit Kiros Woldemichael


* @namespace Ext.mrv.ghginventory.ux.role
* @class     Ext.mrv.ghginventory.ux.role.Form
* @extends   Ext.form.FormPanel
*/
Ext.mrv.ghginventory.ux.role.Form = function (config) {
    Ext.mrv.ghginventory.ux.role.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: window.Role.Get,
            submit: window.Role.Save
        },
        paramOrder: ['id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'role-form',
        padding: 5,
        labelWidth: 100,
        autoHeight: true,
        border: false,
        baseCls: 'x-plain',
        items: [{
            name: 'Id',
            xtype: 'hidden'
        }, {
            name: 'Name',
            xtype: 'textfield',
            fieldLabel: 'Name', // window.Resource.Name,
            allowBlank: false
        }, {
            name: 'Code',
            xtype: 'textfield',
            fieldLabel: 'Code', //window.Resource.Code,
            allowBlank: false
        }]
    }, config));
}
Ext.extend(Ext.mrv.ghginventory.ux.role.Form, Ext.form.FormPanel);
Ext.reg('role-form', Ext.mrv.ghginventory.ux.role.Form);

/**
* @desc      Role registration form host window
* @author    Dawit Kiros Woldemichael


* @namespace Ext.mrv.ghginventory.ux.role
* @class     Ext.mrv.ghginventory.ux.role.Window
* @extends   Ext.Window
*/
Ext.mrv.ghginventory.ux.role.Window = function (config) {
    Ext.mrv.ghginventory.ux.role.Window.superclass.constructor.call(this, Ext.apply({
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
                this.form.getForm().findField('Id').setValue(this.roleId);
                if (this.roleId > 0) {
                    this.form.load({
                        params: { id: this.roleId },
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
}
Ext.extend(Ext.mrv.ghginventory.ux.role.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.mrv.ghginventory.ux.role.Form();
        this.items = [this.form];

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
        Ext.mrv.ghginventory.ux.role.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {
        if (!this.form.getForm().isValid()) return;
        this.form.getForm().submit({
            waitMsg: 'Please wait...',
            success: function () {
                Ext.getCmp('role-form').getForm().reset();
                Ext.getCmp('role-paging').doRefresh();
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
Ext.reg('role-window', Ext.mrv.ghginventory.ux.role.Window);

/**
* @desc      Role Permission window
* @author    Dawit Kiros


* @namespace Ext.mrv.ghginventory.ux.role
* @class     Ext.mrv.ghginventory.ux.role.PermissionWindow
* @extends   Ext.Window
*/
Ext.mrv.ghginventory.ux.role.PermissionWindow = function (config) {
    Ext.mrv.ghginventory.ux.role.PermissionWindow.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        width: 900,
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;',
        listeners: {
            show: function () {
                
            },
            scope: this
        }
    }, config));
}
Ext.extend(Ext.mrv.ghginventory.ux.role.PermissionWindow, Ext.Window, {
    initComponent: function () {
        this.grid = new Ext.mrv.ghginventory.ux.role.PermissionGrid();
        this.grid.roleId = this.roleId;
        this.items = [this.grid];

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

        Ext.mrv.ghginventory.ux.role.PermissionWindow.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {
        var permissions = this.grid.getStore().data.items;
        var length = permissions.length;
        var permissionString = '';
        for (var i = 0; i < length; i++) {
            permissionString = permissionString + permissions[i].data.Id + ':' + permissions[i].data.Add + ':' + permissions[i].data.Edit + ':' + permissions[i].data.Delete + ':' + permissions[i].data.View + ':' + permissions[i].data.Approve + ':' + permissions[i].data.Check + ':' + permissions[i].data.Authorize + ':' + permissions[i].data.BulkUpdate + ';';
        }

        Role.SaveRolePermissions(this.grid.subsystemId, this.roleId, permissionString, function (result, response) {
            Ext.getCmp('rolePermission-paging').doRefresh();
            Ext.MessageBox.show({
                title: result.success ? 'Success' : 'Error',
                msg: result.data,
                buttons: Ext.Msg.OK,
                icon: result.success ? Ext.MessageBox.INFO : Ext.MessageBox.ERROR,
                scope: this
            });
        }, this);
    },
    onClose: function () {
        this.close();
    }
});
Ext.reg('role-permissionWindow', Ext.mrv.ghginventory.ux.role.PermissionWindow);

/**
* @desc      Role grid
* @author    Dawit Kiros Woldemichael


* @namespace Ext.mrv.ghginventory.ux.role
* @class     Ext.mrv.ghginventory.ux.role.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.mrv.ghginventory.ux.role.Grid = function (config) {
    Ext.mrv.ghginventory.ux.role.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: Role.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Name',
                direction: 'ASC'
            },
            fields: ['Id', 'Name', 'Code'],
            remoteSort: true
        }),
        id: 'role-grid',
        pageSize: 20,
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
            containermousedown: function (grid, e) {
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
            dataIndex: 'Name',
            header: 'Name',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'Code',
            header: 'Code',
            sortable: true,
            width: 100,
            menuDisabled: true
        }]
    }, config));
}
Ext.extend(Ext.mrv.ghginventory.ux.role.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.bbar = new Ext.PagingToolbar({
            id: 'role-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.mrv.ghginventory.ux.role.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getStore().load({
            params: { start: 0, limit: this.pageSize }
        });
        Ext.mrv.ghginventory.ux.role.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('role-grid', Ext.mrv.ghginventory.ux.role.Grid);

/**
* @desc      Role Permison grid
* @author    Dawit Kiros Woldemichael


* @namespace Ext.mrv.ghginventory.ux.role
* @class     Ext.mrv.ghginventory.ux.role.PermissionGrid
* @extends   Ext.grid.GridPanel
*/
Ext.mrv.ghginventory.ux.role.PermissionGrid = function (config) {
    Ext.mrv.ghginventory.ux.role.PermissionGrid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: Role.GetOperations,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Name',
                direction: 'ASC'
            },
            fields: ['Id', 'Module', 'Operation', 'Add', 'Edit', 'Delete', 'View', 'Approve', 'Check', 'Authorize', 'BulkUpdate'],
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
        height: 400,
        id: 'rolePermission-grid',
        roleId: 0,
        subsystemId: 0,
        pageSize: 100,
        stripeRows: true,
        columnLines: true,
        border: true,
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
            dataIndex: 'Module',
            header: 'Menu',
            width: 200,
            menuDisabled: true
        }, {
            dataIndex: 'Operation',
            header: 'Sub Menu',
            width: 200,
            menuDisabled: true
        },
        new Ext.grid.CheckColumn({
            header: '<div><input type="checkbox" id="chkAdd" onclick="javascript: return selectAll(this, \'Add\');">&nbsp;Add</div>',
            dataIndex: 'Add',
            width: 80,
            menuDisabled: true
        }),
        new Ext.grid.CheckColumn({
            header: '<div><input type="checkbox" id="chkEdit" onclick="javascript: return selectAll(this, \'Edit\');">&nbsp;Edit</div>',
            dataIndex: 'Edit',
            width: 80,
            menuDisabled: true
        }),
        new Ext.grid.CheckColumn({
            header: '<div><input type="checkbox" id="chkDelete" onclick="javascript: return selectAll(this, \'Delete\');">&nbsp;Delete</div>',
            dataIndex: 'Delete',
            width: 80,
            menuDisabled: true
        }),
        new Ext.grid.CheckColumn({
            header: '<div><input type="checkbox" id="chkView" onclick="javascript: return selectAll(this, \'View\');">&nbsp;View</div>',
            dataIndex: 'View',
            width: 80,
            menuDisabled: true
        }),
        new Ext.grid.CheckColumn({
            header: '<div><input type="checkbox" id="chkApprove" onclick="javascript: return selectAll(this, \'Approve\');">&nbsp;Approve</div>',
            dataIndex: 'Approve',
            width: 85,
            menuDisabled: true
        }),
        new Ext.grid.CheckColumn({
            header: '<div><input type="checkbox" id="chkCheck" onclick="javascript: return selectAll(this, \'Check\');">&nbsp;Check</div>',
            dataIndex: 'Check',
            width: 85,
            menuDisabled: true
        }),
        new Ext.grid.CheckColumn({
            header: '<div><input type="checkbox" id="chkAuthorize" onclick="javascript: return selectAll(this, \'Authorize\');">&nbsp;Authorize</div>',
            dataIndex: 'Authorize',
            width: 85,
            menuDisabled: true
        }),
        new Ext.grid.CheckColumn({
            header: '<div><input type="checkbox" id="chkBulkUpdate" onclick="javascript: return selectAll(this, \'BulkUpdate\');">&nbsp;BulkUpdate</div>',
            dataIndex: 'BulkUpdate',
            width: 85,
            menuDisabled: true
        })]
    }, config));
}
Ext.extend(Ext.mrv.ghginventory.ux.role.PermissionGrid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.tbar = ['->',
        {
            xtype: 'label',
            text: 'Select System: ',
            style: 'font-weight:bold; padding-right: 5px;'
        }, {
            hiddenName: 'SubsystemId',
            xtype: 'combo',
            fieldLabel: 'Subsystem',
            triggerAction: 'all',
            mode: 'remote',
            editable: false,
            forceSelection: true,
            emptyText: '---Select---',
            allowBlank: true,
            store: new Ext.data.DirectStore({
                reader: new Ext.data.JsonReader({
                    successProperty: 'success',
                    idProperty: 'Id',
                    root: 'data',
                    fields: ['Id', 'Name']
                }),
                autoLoad: true,
                api: { read: window.Tsa.GetSystems }
            }),
            valueField: 'Id',
            displayField: 'Name',
            listeners: {
                'select': function (cmb, rec, idx) {
                    var grid = Ext.getCmp('rolePermission-grid');
                    grid.subsystemId = this.getValue();
                    grid.store.baseParams = { record: Ext.encode({ subsystemId: this.getValue(), roleId: grid.roleId }) };
                    grid.store.load({ params: { start: 0, limit: grid.pageSize} });
                }
            }
        }];
        this.bbar = new Ext.PagingToolbar({
            id: 'rolePermission-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.mrv.ghginventory.ux.role.PermissionGrid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {

        Ext.mrv.ghginventory.ux.role.PermissionGrid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('rolePermission-grid', Ext.mrv.ghginventory.ux.role.PermissionGrid);

/**
* @desc      Role panel
* @author    Dawit Kiros Woldemichael

* @date      November 01, 2014c
* @version   $Id: Role.js, 0.1
* @namespace Ext.mrv.ghginventory.ux.role
* @class     Ext.mrv.ghginventory.ux.role.Panel
* @extends   Ext.Panel
*/
Ext.mrv.ghginventory.ux.role.Panel = function (config) {
    Ext.mrv.ghginventory.ux.role.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false,
        tbar: {
            xtype: 'toolbar',
            items: [{
                xtype: 'button',
                text: 'Add',
                id: 'addRole',
                iconCls: 'icon-add',
                disabled: !Ext.mrv.ghginventory.ux.Reception.getPermission('Role', 'CanAdd'),
                handler: this.onAddClick
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Edit',
                id: 'editRole',
                iconCls: 'icon-edit',
                disabled: !Ext.mrv.ghginventory.ux.Reception.getPermission('Role', 'CanEdit'),
                handler: this.onEditClick
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Delete',
                id: 'deleteRole',
                iconCls: 'icon-delete',
                disabled: !Ext.mrv.ghginventory.ux.Reception.getPermission('Role', 'CanDelete'),
                handler: this.onDeleteClick
            }, {
                xtype: 'button',
                text: 'Permissions',
                id: 'saveRolePermission',
                iconCls: 'icon-accept',
                disabled: !Ext.mrv.ghginventory.ux.Reception.getPermission('Role', 'CanEdit'),
                handler: this.onSaveRolePermissionClick
            }, {
                xtype: 'tbfill'
            }, {
                xtype: 'button',
                text: 'Fiscal Year',
                id: 'btnEditFiscalYear',
                iconCls: 'icon-FiscalYear',
                disabled: !Ext.mrv.ghginventory.ux.Reception.getPermission('Role', 'CanEdit'),
                handler: this.onEditFiscalYear
            },{
                xtype: 'button',
                text: 'Periods',
                id: 'btnEditPeriods',
                iconCls: 'icon-Calendar',
                disabled: !Ext.mrv.ghginventory.ux.Reception.getPermission('Role', 'CanEdit'),
                handler: this.onEditPeriods
            }]
        }
    }, config));
}
Ext.extend(Ext.mrv.ghginventory.ux.role.Panel, Ext.Panel, {
    initComponent: function () {
        this.items = [{
            xtype: 'role-grid',
            id: 'role-grid'
        }];
        Ext.mrv.ghginventory.ux.role.Panel.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {

        Ext.mrv.ghginventory.ux.role.Panel.superclass.afterRender.apply(this, arguments);
    },
    onAddClick: function () {
        new Ext.mrv.ghginventory.ux.role.Window({
            roleId: 0,
            title: 'Add Role'
        }).show();
    },
    onEditFiscalYear: function () {
        new Ext.mrv.ghginventory.ux.fiscalYear.Window({
            title: 'Edit Fiscal Year', CallerId: 0
        }).show();
    },
    onEditPeriods: function () {
        new Ext.mrv.ghginventory.ux.payrollPeriods.Window({
            title: 'Edit Periods'
        }).show();
    },
    onEditClick: function () {
        var grid = Ext.getCmp('role-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');
        new Ext.mrv.ghginventory.ux.role.Window({
            roleId: id,
            title: 'Edit Role'
        }).show();
    },
    onDeleteClick: function () {
        var grid = Ext.getCmp('role-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        Ext.MessageBox.show({
            title: 'Delete',
            msg: 'Are you sure you want to delete the selected role',
            buttons: {
                ok: 'Yes',
                no: 'No'
            },
            icon: Ext.MessageBox.QUESTION,
            scope: this,
            fn: function (btn) {
                if (btn == 'ok') {
                    var id = grid.getSelectionModel().getSelected().get('Id');
                    window.Role.Delete(id, function (result, response) {
                        Ext.getCmp('role-paging').doRefresh();
                        Ext.MessageBox.show({
                            title: result.success ? 'Success' : 'Error',
                            msg: result.data,
                            buttons: Ext.Msg.OK,
                            icon: result.success ? Ext.MessageBox.INFO : Ext.MessageBox.ERROR,
                            scope: this
                        });
                    }, this);
                }
            }
        });
    },
    onSaveRolePermissionClick: function () {
        var grid = Ext.getCmp('role-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');
        new Ext.mrv.ghginventory.ux.role.PermissionWindow({
            roleId: id,
            title: 'Edit Role Permission'
        }).show();
    }
});
Ext.reg('role-panel', Ext.mrv.ghginventory.ux.role.Panel);

function selectAll(cb, operation){
    var grid = Ext.getCmp('rolePermission-grid');
    grid.store.each(function(record, index) {
        switch(operation)
        {
            case 'Add':
                record.set('Add', cb.checked); 
                break;
            case 'Edit':
                record.set('Edit', cb.checked); 
                break;
            case 'Delete':
                record.set('Delete', cb.checked); 
                break;
            case 'View':
                record.set('View', cb.checked); 
                break;
            case 'Approve':
                record.set('Approve', cb.checked);
                break;
            case 'Check':
                record.set('Check', cb.checked);
                break;
            case 'Authorize':
                record.set('Authorize', cb.checked);
                break;
            case 'BulkUpdate':
                record.set('BulkUpdate', cb.checked);
                break;
        }
    });
    
}