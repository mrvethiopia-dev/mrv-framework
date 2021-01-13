Ext.ns('Ext.mrv.ghginventory.ux.Menus');
/**
* @desc      Menus registration form
* @author    Dawit Kiros Woldemichael


* @namespace Ext.mrv.ghginventory.ux.Menus
* @class     Ext.mrv.ghginventory.ux.Menus.Form
* @extends   Ext.form.FormPanel
*/
Ext.mrv.ghginventory.ux.Menus.Form = function (config) {
    Ext.mrv.ghginventory.ux.Menus.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: Menus.Get,
            submit: Menus.Save
        },
        paramOrder: ['id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'Menus-form',
        padding: 5,
        labelWidth: 150,
        autoHeight: true,
        border: false,
        baseCls: 'x-plain',
        items: [{
            name: 'Id',
            xtype: 'hidden'
        }, {
            name: 'systemId',
            xtype: 'hidden'
        }, {
            name: 'system',
            xtype: 'textfield',
            fieldLabel: 'system',
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
        }]
    }, config));
}
Ext.extend(Ext.mrv.ghginventory.ux.Menus.Form, Ext.form.FormPanel);
Ext.reg('Menus-form', Ext.mrv.ghginventory.ux.Menus.Form);

/**
* @desc      Menus registration form host window
* @author    Dawit Kiros Woldemichael


* @namespace Ext.mrv.ghginventory.ux.Menus
* @class     Ext.mrv.ghginventory.ux.Menus.Window
* @extends   Ext.Window
*/
Ext.mrv.ghginventory.ux.Menus.Window = function (config) {
    Ext.mrv.ghginventory.ux.Menus.Window.superclass.constructor.call(this, Ext.apply({
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
                this.form.getForm().findField('Id').setValue(this.MenuId);
                var grid = Ext.getCmp('Menus-grid');
                var subsytemKeyValue = grid.searchResult['systemId'].split(';');
                this.form.getForm().findField('system').setValue(subsytemKeyValue[1]);
                if (this.MenuId > 0) {
                    this.form.load({
                        params: { id: this.MenuId },
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
Ext.extend(Ext.mrv.ghginventory.ux.Menus.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.mrv.ghginventory.ux.Menus.Form();
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
            },
            scope: this
        }];
        Ext.mrv.ghginventory.ux.Menus.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {
        if (!this.form.getForm().isValid()) return;
        var systemId = Ext.getCmp('Menus-grid').systemId;
        this.form.getForm().findField('systemId').setValue(systemId);
        this.form.getForm().submit({
            waitMsg: 'Please wait...',
            success: function () {
                var form = Ext.getCmp('Menus-form').getForm();
                form.findField('Id').reset();
                form.findField('Name').reset();
                form.findField('Code').reset();
                Ext.getCmp('Menus-paging').doRefresh();
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
Ext.reg('Menus-window', Ext.mrv.ghginventory.ux.Menus.Window);

/**
* @desc      Menus grid
* @author    Dawit Kiros Woldemichael


* @namespace Ext.mrv.ghginventory.ux.Menus
* @class     Ext.mrv.ghginventory.ux.Menus.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.mrv.ghginventory.ux.Menus.Grid = function (config) {
    Ext.mrv.ghginventory.ux.Menus.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: Menus.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Name',
                direction: 'ASC'
            },
            fields: ['Id', 'Name', 'Code'],
            remoteSort: true,
            listeners: {
                load: function () {
                    this.controlButton();
                },
                scope: this
            }
        }),
        id: 'Menus-grid',
        systemId: 0,
        searchResult: {},
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
        }]
    }, config));
}
Ext.extend(Ext.mrv.ghginventory.ux.Menus.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.bbar = new Ext.PagingToolbar({
            id: 'Menus-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.mrv.ghginventory.ux.Menus.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.controlButton();
        Ext.mrv.ghginventory.ux.Menus.Grid.superclass.afterRender.apply(this, arguments);
    },
    controlButton: function () {
        var enabled = !this.getSelectionModel().hasSelection();
        Ext.getCmp('editMenu').setDisabled(enabled);
        Ext.getCmp('deleteMenu').setDisabled(enabled);
    }
});
Ext.reg('Menus-grid', Ext.mrv.ghginventory.ux.Menus.Grid);

/**
* @desc      Menus panel
* @author    Dawit Kiros Woldemichael

* @date      November 01, 2014c
* @version   $Id: Menus.js, 0.1
* @namespace Ext.mrv.ghginventory.ux.Menus
* @class     Ext.mrv.ghginventory.ux.Menus.Panel
* @extends   Ext.Panel
*/
Ext.mrv.ghginventory.ux.Menus.Panel = function (config) {
    Ext.mrv.ghginventory.ux.Menus.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false,
        tbar: {
            xtype: 'toolbar',
            items: [{
                xtype: 'button',
                text: 'Filter',
                id: 'filterMenu',
                iconCls: 'icon-filter',                
                handler: this.onFilterClick
            }, {
                xtype: 'tbseparator',
                hidden: true
            }, {
                xtype: 'button',
                text: 'Add',
                id: 'addMenu',
                iconCls: 'icon-add',
                hidden: false,
                handler: this.onAddClick
            }, {
                xtype: 'tbseparator',
                hidden: false
            }, {
                xtype: 'button',
                text: 'Edit',
                id: 'editMenu',
                iconCls: 'icon-edit',
                hidden: false,
                handler: this.onEditClick
            }, {
                xtype: 'tbseparator',
                hidden: true
            }, {
                xtype: 'button',
                text: 'Delete',
                id: 'deleteMenu',
                iconCls: 'icon-delete',
                hidden: false,
                handler: this.onDeleteClick
            }, {
                xtype: 'tbfill'
            }, {
                xtype: 'displayfield',
                id: 'Menus-sitemap',
                style: 'font-weight: bold'
            }]
        }
    }, config));
}
Ext.extend(Ext.mrv.ghginventory.ux.Menus.Panel, Ext.Panel, {
    initComponent: function () {
        this.items = [{
            xtype: 'Menus-grid',
            id: 'Menus-grid'
        }];
        Ext.mrv.ghginventory.ux.Menus.Panel.superclass.initComponent.apply(this, arguments);
    },
    onFilterClick: function () {
        Ext.mrv.ghginventory.ux.searchMenu.Observable.on('search-Menus', function (result) {
            var grid = Ext.getCmp('Menus-grid');
            grid.searchResult = result;
            var systemKeyValue = result['SystemId'].split(';');
            grid.systemId = systemKeyValue[0] > 0 ? systemKeyValue[0] : 0;
            grid.store.baseParams = { record: Ext.encode({ systemId: grid.systemId }) };
            grid.store.load({ params: { start: 0, limit: grid.pageSize} });
            var systemKeyValue = grid.searchResult['systemId'].split(';');
            if (grid.systemId > 0) {
                var siteMap = systemKeyValue[1];
                Ext.getCmp('Menus-sitemap').setValue(siteMap + ' Menus');
            }
        }, this);
        var searchMenuWindow = new Ext.mrv.ghginventory.ux.searchMenu.Window({
            title: 'Filter Menus',
            searchEvent: 'search-Menus'
        });
        searchMenuWindow.show();
    },
    onAddClick: function () {
        var grid = Ext.getCmp('Menus-grid');
        if (grid.systemId <= 0) {
            Ext.MessageBox.show({
                title: 'Select',
                msg: 'You must select sysbsystem first.',
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
        new Ext.mrv.ghginventory.ux.Menus.Window({
            MenuId: 0,
            title: 'Add Menus'
        }).show();
    },
    onEditClick: function () {
        var grid = Ext.getCmp('Menus-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');
        new Ext.mrv.ghginventory.ux.Menus.Window({
            MenuId: id,
            title: 'Edit Menus'
        }).show();
    },
    onDeleteClick: function () {
        var grid = Ext.getCmp('Menus-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        Ext.MessageBox.show({
            title: 'Delete',
            msg: 'Are you sure you want to delete the selected Menus',
            buttons: {
                ok: 'Yes',
                no: 'No'
            },
            icon: Ext.MessageBox.QUESTION,
            scope: this,
            fn: function (btn) {
                if (btn == 'ok') {
                    var id = grid.getSelectionModel().getSelected().get('Id');
                    window.Menus.Delete(id, function (result, response) {
                        Ext.getCmp('Menus-paging').doRefresh();
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
Ext.reg('Menus-panel', Ext.mrv.ghginventory.ux.Menus.Panel);
