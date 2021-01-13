Ext.ns('Ext.mrv.ghginventory.ux.subMenu');
/**
* @desc      subMenu registration form
* @author    Dawit Kiros Woldemichael


* @namespace Ext.mrv.ghginventory.ux.subMenu
* @class     Ext.mrv.ghginventory.ux.subMenu.Form
* @extends   Ext.form.FormPanel
*/
Ext.mrv.ghginventory.ux.subMenu.Form = function (config) {
    Ext.mrv.ghginventory.ux.subMenu.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: window.SubMenu.Get,
            submit: window.SubMenu.Save
        },
        paramOrder: ['id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'subMenu-form',
        padding: 5,
        labelWidth: 150,
        autoHeight: true,
        border: false,
        baseCls: 'x-plain',
        items: [{
            name: 'Id',
            xtype: 'hidden'
        }, {
            name: 'MenuId',
            xtype: 'hidden'
        }, {
            name: 'System',
            xtype: 'textfield',
            fieldLabel: 'System',
            disabled: true
        }, {
            name: 'Menu',
            xtype: 'textfield',
            fieldLabel: 'Menu',
            disabled: true
        }, {
            name: 'Name',
            xtype: 'textfield',
            fieldLabel: 'Name',
            allowBlank: false
        }, {
            name: 'Code',
            xtype: 'textfield',
            fieldLabel: 'Code',
            allowBlank: false
        }, {
            name: 'IsMenu',
            xtype: 'checkbox',
            fieldLabel: 'Display as Menu',
            listeners: {
                'check': function (chk, val) {
                    var form = Ext.getCmp('subMenu-form').getForm(); ;
                    var txtHref = form.findField('Href');
                    var txtIconCls = form.findField('IconCls');
                    txtHref.reset();
                    txtIconCls.reset();
                    if (val) {
                        txtHref.show();
                        txtIconCls.show();
                    }
                    else {
                        txtHref.hide();
                        txtIconCls.hide();
                    }
                    Ext.getCmp('subMenu-form').ownerCt.syncSize();
                }
            }
        }, {
            name: 'Href',
            xtype: 'textfield',
            fieldLabel: 'Href',
            hidden: false,
            allowBlank: true
        }, {
            name: 'IconCls',
            xtype: 'textfield',
            fieldLabel: 'Icon Class',
            hidden: false,
            allowBlank: true
        }]
    }, config));
}
Ext.extend(Ext.mrv.ghginventory.ux.subMenu.Form, Ext.form.FormPanel);
Ext.reg('subMenu-form', Ext.mrv.ghginventory.ux.subMenu.Form);

/**
* @desc      subMenu registration form host window
* @author    Dawit Kiros Woldemichael


* @namespace Ext.mrv.ghginventory.ux.subMenu
* @class     Ext.mrv.ghginventory.ux.subMenu.Window
* @extends   Ext.Window
*/
Ext.mrv.ghginventory.ux.subMenu.Window = function (config) {
    Ext.mrv.ghginventory.ux.subMenu.Window.superclass.constructor.call(this, Ext.apply({
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
                this.form.getForm().findField('Id').setValue(this.subMenuId);
                var grid = Ext.getCmp('subMenu-grid');
                var subsytemKeyValue = grid.searchResult['SystemId'].split(';');
                var menuKeyValue = grid.searchResult['MenuId'].split(';');
                this.form.getForm().findField('System').setValue(subsytemKeyValue[1]);
                this.form.getForm().findField('Menu').setValue(menuKeyValue[1]);
                if (this.subMenuId > 0) {
                    this.form.load({
                        params: { id: this.subMenuId },
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
Ext.extend(Ext.mrv.ghginventory.ux.subMenu.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.mrv.ghginventory.ux.subMenu.Form();
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
                var form = this.form.getForm();
                form.findField('Name').reset();
                form.findField('Code').reset();
                form.findField('IsMenu').reset();
                form.findField('Href').reset();
                form.findField('IconCls').reset();
            },
            scope: this
        }];
        Ext.mrv.ghginventory.ux.subMenu.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {
        if (!this.form.getForm().isValid()) return;
        var menuId = Ext.getCmp('subMenu-grid').MenuId;
        this.form.getForm().findField('MenuId').setValue(menuId);
        this.form.getForm().submit({
            waitMsg: 'Please wait...',
            success: function () {
                var form = Ext.getCmp('subMenu-form').getForm();
                form.findField('Id').reset();
                form.findField('Name').reset();
                form.findField('Code').reset();
                form.findField('IsMenu').reset();
                form.findField('Href').reset();
                form.findField('IconCls').reset();
                Ext.getCmp('subMenu-paging').doRefresh();
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
Ext.reg('subMenu-window', Ext.mrv.ghginventory.ux.subMenu.Window);

/**
* @desc      subMenu grid
* @author    Dawit Kiros Woldemichael


* @namespace Ext.mrv.ghginventory.ux.subMenu
* @class     Ext.mrv.ghginventory.ux.subMenu.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.mrv.ghginventory.ux.subMenu.Grid = function (config) {
    Ext.mrv.ghginventory.ux.subMenu.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: SubMenu.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Name',
                direction: 'ASC'
            },
            fields: ['Id', 'Name', 'Code', 'Href', 'IconCls'],
            remoteSort: true,
            listeners: {
                load: function () {
                    this.controlButton();
                },
                scope: this
            }
        }),
        id: 'subMenu-grid',
        MenuId: 0,
        searchResult: {},
        pageSize: 10,
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
                this.controlButton();
            },
            containermousedown: function (grid, e) {
                grid.getSelectionModel().deselectRange(0, grid.pageSize);
                this.controlButton();
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
        }, {
            dataIndex: 'Href',
            header: 'Href',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'IconCls',
            header: 'Icon Class',
            sortable: true,
            width: 100,
            menuDisabled: true
        }]
    }, config));
}
Ext.extend(Ext.mrv.ghginventory.ux.subMenu.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.bbar = new Ext.PagingToolbar({
            id: 'subMenu-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.mrv.ghginventory.ux.subMenu.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.controlButton();
        Ext.mrv.ghginventory.ux.subMenu.Grid.superclass.afterRender.apply(this, arguments);
    },
    controlButton: function () {
        var enabled = !this.getSelectionModel().hasSelection();
        Ext.getCmp('editsubMenu').setDisabled(enabled);
        Ext.getCmp('deletesubMenu').setDisabled(enabled);
    }
});
Ext.reg('subMenu-grid', Ext.mrv.ghginventory.ux.subMenu.Grid);

/**
* @desc      subMenu panel
* @author    Dawit Kiros Woldemichael

* @date      November 01, 2014c
* @version   $Id: subMenu.js, 0.1
* @namespace Ext.mrv.ghginventory.ux.subMenu
* @class     Ext.mrv.ghginventory.ux.subMenu.Panel
* @extends   Ext.Panel
*/
Ext.mrv.ghginventory.ux.subMenu.Panel = function (config) {
    Ext.mrv.ghginventory.ux.subMenu.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false,
        tbar: {
            xtype: 'toolbar',
            items: [{
                xtype: 'button',
                text: 'Filter',
                id: 'filtersubMenu',
                iconCls: 'icon-filter',
                handler: this.onFilterClick
            }, {
                xtype: 'tbseparator',
                hidden: true
            }, {
                xtype: 'button',
                text: 'Add',
                id: 'addsubMenu',
                iconCls: 'icon-add',
                hidden: false,
                handler: this.onAddClick
            }, {
                xtype: 'tbseparator',
                hidden: false
            }, {
                xtype: 'button',
                text: 'Edit',
                id: 'editsubMenu',
                iconCls: 'icon-edit',
                hidden: false,
                handler: this.onEditClick
            }, {
                xtype: 'tbseparator',
                hidden: false
            }, {
                xtype: 'button',
                text: 'Delete',
                id: 'deletesubMenu',
                iconCls: 'icon-delete',
                hidden: false,
                handler: this.onDeleteClick
            }, {
                xtype: 'tbfill'
            }, {
                xtype: 'displayfield',
                id: 'subMenu-sitemap',
                style: 'font-weight: bold'
            }]
        }
    }, config));
}
Ext.extend(Ext.mrv.ghginventory.ux.subMenu.Panel, Ext.Panel, {
    initComponent: function () {
        this.items = [{
            xtype: 'subMenu-grid',
            id: 'subMenu-grid'
        }];
        Ext.mrv.ghginventory.ux.subMenu.Panel.superclass.initComponent.apply(this, arguments);
    },
    onFilterClick: function () {
        Ext.mrv.ghginventory.ux.searchSubmenu.Observable.on('search-subMenu', function (result) {
            var grid = Ext.getCmp('subMenu-grid');
            grid.searchResult = result;
            var menuKeyValue = result['MenuId'].split(';');
            grid.MenuId = menuKeyValue[0] > 0 ? menuKeyValue[0] : 0;
            grid.store.baseParams = { record: Ext.encode({ menuId: grid.MenuId }) };
            grid.store.load({ params: { start: 0, limit: grid.pageSize} });
            var menuKeyValue = grid.searchResult['MenuId'].split(';');
            if (grid.MenuId > 0) {
                var siteMap = menuKeyValue[1];
                Ext.getCmp('subMenu-sitemap').setValue(siteMap + ' subMenu');
            }
        }, this);
        var searchsubMenuWindow = new Ext.mrv.ghginventory.ux.searchSubmenu.Window({
            title: 'Filter subMenu',
            searchEvent: 'search-subMenu'
        });
        searchsubMenuWindow.show();
    },
    onAddClick: function () {
        var grid = Ext.getCmp('subMenu-grid');
        if (grid.subsystemId <= 0) {
            Ext.MessageBox.show({
                title: 'Select',
                msg: 'You must select sysbsystem first.',
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
        new Ext.mrv.ghginventory.ux.subMenu.Window({
            subMenuId: 0,
            title: 'Add subMenu'
        }).show();
    },
    onEditClick: function () {
        var grid = Ext.getCmp('subMenu-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');
        new Ext.mrv.ghginventory.ux.subMenu.Window({
            subMenuId: id,
            title: 'Edit subMenu'
        }).show();
    },
    onDeleteClick: function () {
        var grid = Ext.getCmp('subMenu-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        Ext.MessageBox.show({
            title: 'Delete',
            msg: 'Are you sure you want to delete the selected subMenu',
            buttons: {
                ok: 'Yes',
                no: 'No'
            },
            icon: Ext.MessageBox.QUESTION,
            scope: this,
            fn: function (btn) {
                if (btn == 'ok') {
                    var id = grid.getSelectionModel().getSelected().get('Id');
                    SubMenu.Delete(id, function (result, response) {
                        Ext.getCmp('subMenu-paging').doRefresh();
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
Ext.reg('subMenu-panel', Ext.mrv.ghginventory.ux.subMenu.Panel);
