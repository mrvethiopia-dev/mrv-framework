Ext.ns('Ext.mrv.ghginventory.ux.ghgTypes');
/**
* @desc      Type of GHGs registration form
* @author    Dawit Kiros
* @namespace Ext.mrv.ghginventory.ux.ghgTypes
* @class     Ext.mrv.ghginventory.ux.ghgTypes.Form
* @extends   Ext.form.FormPanel
*/
Ext.mrv.ghginventory.ux.ghgTypes.Form = function (config) {
    Ext.mrv.ghginventory.ux.ghgTypes.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: GHGTypes.Get,
            submit: GHGTypes.Save
        },
        paramOrder: ['Id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'ghgTypes-form',
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
            name: 'Name',
            xtype: 'textfield',
            fieldLabel: 'Name',
            anchor: '95%',
            allowBlank: false
       }, {
           name: 'Code',
           xtype: 'textfield',
           fieldLabel: 'Code',
           anchor: '95%',
           allowBlank: true
       }]
    }, config));
}
Ext.extend(Ext.mrv.ghginventory.ux.ghgTypes.Form, Ext.form.FormPanel);
Ext.reg('ghgTypes-form', Ext.mrv.ghginventory.ux.ghgTypes.Form);

/**
* @desc      Type of GHGs registration form host window
* @author    Dawit Kiros


* @namespace Ext.mrv.ghginventory.ux.ghgTypes
* @class     Ext.mrv.ghginventory.ux.ghgTypes.Window
* @extends   Ext.Window
*/
Ext.mrv.ghginventory.ux.ghgTypes.Window = function (config) {
    Ext.mrv.ghginventory.ux.ghgTypes.Window.superclass.constructor.call(this, Ext.apply({
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
                this.form.getForm().findField('Id').setValue(this.ghgTypeId);
                if (this.ghgTypeId != '') {
                    this.form.load({ params: { Id: this.ghgTypeId} });
                }
            },
            scope: this
        }
    }, config));
}
Ext.extend(Ext.mrv.ghginventory.ux.ghgTypes.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.mrv.ghginventory.ux.ghgTypes.Form();
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

        Ext.mrv.ghginventory.ux.ghgTypes.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {

        if (!this.form.getForm().isValid()) return;
        this.form.getForm().submit({
            waitMsg: 'Please wait...',
            success: function () {
                Ext.getCmp('ghgTypes-form').getForm().reset();
                Ext.getCmp('ghgTypes-paging').doRefresh();
            },
            failure: function (f, a) {
                Ext.MessageBox.show({
                    title: 'Error',
                    msg: a.result.data,
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
Ext.reg('ghgTypes-window', Ext.mrv.ghginventory.ux.ghgTypes.Window);

/**
* @desc      Type of GHGs grid
* @author    Dawit Kiros


* @namespace Ext.mrv.ghginventory.ux.ghgTypes
* @class     Ext.mrv.ghginventory.ux.ghgTypes.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.mrv.ghginventory.ux.ghgTypes.Grid = function (config) {
    Ext.mrv.ghginventory.ux.ghgTypes.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: GHGTypes.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Code',
                direction: 'ASC'
            },
            fields: ['Id', 'Name','Code'],
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
        id: 'ghgTypes-grid',
        searchCriteria: {},
        pageSize: 38,
        title: 'Type of GHGs List',
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
                var form = Ext.getCmp('ghgTypes-form');
                if (id != null) {
                  
                }
            },
            scope: this,
            rowdblclick: function () {
                if (!this.getSelectionModel().hasSelection()) return;
                var id = this.getSelectionModel().getSelected().get('Id');

                if (id != null) {
                    var hasEditPermission = Ext.mrv.ghginventory.ux.Reception.getPermission('Type of GHGs', 'CanEdit');
                    if (hasEditPermission) {
                        new Ext.mrv.ghginventory.ux.ghgTypes.Window({
                            ghgTypeId: id,
                            title: 'Edit Type of GHGs'
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
             header: 'Type of GHGs',
             sortable: true,
             width: 55,
             menuDisabled: true
         },
         {
             dataIndex: 'Code',
             header: 'Code',
             sortable: true,
             width: 55,
             menuDisabled: true
         }]
    }, config));
};
Ext.extend(Ext.mrv.ghginventory.ux.ghgTypes.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ mode: 'get' }) };
        this.tbar = [];
        this.bbar = new Ext.PagingToolbar({
            id: 'ghgTypes-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.mrv.ghginventory.ux.ghgTypes.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getStore().load({
            params: { start: 0, limit: this.pageSize }
        });
        Ext.mrv.ghginventory.ux.ghgTypes.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('ghgTypes-grid', Ext.mrv.ghginventory.ux.ghgTypes.Grid);

/**
* @desc      Type of GHGs panel
* @author    Dawit Kiros


* @version   $Id: ghgTypes.js, 0.1
* @namespace Ext.mrv.ghginventory.ux.ghgTypes
* @class     Ext.mrv.ghginventory.ux.ghgTypes.Panel
* @extends   Ext.Panel
*/
Ext.mrv.ghginventory.ux.ghgTypes.Panel = function (config) {
    Ext.mrv.ghginventory.ux.ghgTypes.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false,
        tbar: {
            xtype: 'toolbar',
            items: [{
                xtype: 'button',
                text: 'Add',
                id: 'addghgTypes',
                iconCls: 'icon-add',
                handler: this.onAddClick,
                disabled: !Ext.mrv.ghginventory.ux.Reception.getPermission('Type of GHGs', 'CanAdd')
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Edit',
                id: 'editghgTypes',
                iconCls: 'icon-edit',
                handler: this.onEditClick,
                disabled: !Ext.mrv.ghginventory.ux.Reception.getPermission('Type of GHGs', 'CanEdit')
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Delete',
                id: 'deleteghgTypes',
                iconCls: 'icon-delete',
                handler: this.onDeleteClick,
                disabled: !Ext.mrv.ghginventory.ux.Reception.getPermission('Type of GHGs', 'CanDelete')
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Print List',
                id: 'printghgTypes',
                iconCls: 'icon-Print',
                handler: this.onghgTypesPrintClick

            }]
        }
    }, config));
}
Ext.extend(Ext.mrv.ghginventory.ux.ghgTypes.Panel, Ext.Panel, {
    initComponent: function () {
        this.items = [{
            xtype: 'ghgTypes-grid',
            id: 'ghgTypes-grid'
        }];
        Ext.mrv.ghginventory.ux.ghgTypes.Panel.superclass.initComponent.apply(this, arguments);
    },

    onAddClick: function () {
        new Ext.mrv.ghginventory.ux.ghgTypes.Window({
            ghgTypeId: 0,
            title: 'Add Type of GHGs'
        }).show();
    },
    onEditClick: function () {
        var grid = Ext.getCmp('ghgTypes-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');
        new Ext.mrv.ghginventory.ux.ghgTypes.Window({
            ghgTypeId: id,
            title: 'Edit Type of GHGs'
        }).show();
    },
    onDeleteClick: function () {
        var grid = Ext.getCmp('ghgTypes-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        Ext.MessageBox.show({
            title: 'Delete',
            msg: 'Are you sure you want to delete the selected Type of GHGs?',
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
                    GHGTypes.Delete(id, function (result, response) {
                        Ext.getCmp('ghgTypes-paging').doRefresh();
                    }, this);
                }
            }
        });
    },
    onghgTypesPrintClick: function () {
        var grid = Ext.getCmp('ghgTypes-grid');
        Ext.ux.GridPrinter.stylesheetPath = '/Content/css/print.css';
        Ext.ux.GridPrinter.print(grid);
    }
});
Ext.reg('ghgTypes-panel', Ext.mrv.ghginventory.ux.ghgTypes.Panel);