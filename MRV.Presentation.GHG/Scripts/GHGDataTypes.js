Ext.ns('Ext.mrv.ghginventory.ux.dataTypes');
/**
* @desc      Data Types registration form
* @author    Dawit Kiros 
* @namespace Ext.mrv.ghginventory.ux.dataTypes
* @class     Ext.mrv.ghginventory.ux.dataTypes.Form
* @extends   Ext.form.FormPanel
*/
Ext.mrv.ghginventory.ux.dataTypes.Form = function (config) {
    Ext.mrv.ghginventory.ux.dataTypes.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: GHGDataTypes.Get,
            submit: GHGDataTypes.Save
        },
        paramOrder: ['Id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'dataTypes-form',
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
Ext.extend(Ext.mrv.ghginventory.ux.dataTypes.Form, Ext.form.FormPanel);
Ext.reg('dataTypes-form', Ext.mrv.ghginventory.ux.dataTypes.Form);

/**
* @desc      Data Types registration form host window
* @author    Dawit Kiros


* @namespace Ext.mrv.ghginventory.ux.dataTypes
* @class     Ext.mrv.ghginventory.ux.dataTypes.Window
* @extends   Ext.Window
*/
Ext.mrv.ghginventory.ux.dataTypes.Window = function (config) {
    Ext.mrv.ghginventory.ux.dataTypes.Window.superclass.constructor.call(this, Ext.apply({
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
                this.form.getForm().findField('Id').setValue(this.dataTypeId);
                if (this.dataTypeId != '') {
                    this.form.load({ params: { Id: this.dataTypeId} });
                }
            },
            scope: this
        }
    }, config));
}
Ext.extend(Ext.mrv.ghginventory.ux.dataTypes.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.mrv.ghginventory.ux.dataTypes.Form();
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

        Ext.mrv.ghginventory.ux.dataTypes.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {

        if (!this.form.getForm().isValid()) return;
        this.form.getForm().submit({
            waitMsg: 'Please wait...',
            success: function () {
                Ext.getCmp('dataTypes-form').getForm().reset();
                Ext.getCmp('dataTypes-paging').doRefresh();
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
Ext.reg('dataTypes-window', Ext.mrv.ghginventory.ux.dataTypes.Window);

/**
* @desc      Data Types grid
* @author    Dawit Kiros


* @namespace Ext.mrv.ghginventory.ux.dataTypes
* @class     Ext.mrv.ghginventory.ux.dataTypes.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.mrv.ghginventory.ux.dataTypes.Grid = function (config) {
    Ext.mrv.ghginventory.ux.dataTypes.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: GHGDataTypes.GetAll,
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
        id: 'dataTypes-grid',
        searchCriteria: {},
        pageSize: 38,
        title: 'Data Types List',
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
                var form = Ext.getCmp('dataTypes-form');
                if (id != null) {
                  
                }
            },
            scope: this,
            rowdblclick: function () {
                if (!this.getSelectionModel().hasSelection()) return;
                var id = this.getSelectionModel().getSelected().get('Id');

                if (id != null) {
                    var hasEditPermission = Ext.mrv.ghginventory.ux.Reception.getPermission('Data Types', 'CanEdit');
                    if (hasEditPermission) {
                        new Ext.mrv.ghginventory.ux.dataTypes.Window({
                            dataTypeId: id,
                            title: 'Edit Data Types'
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
             header: 'Data Types',
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
Ext.extend(Ext.mrv.ghginventory.ux.dataTypes.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ mode: 'get' }) };
        this.tbar = [];
        this.bbar = new Ext.PagingToolbar({
            id: 'dataTypes-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.mrv.ghginventory.ux.dataTypes.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getStore().load({
            params: { start: 0, limit: this.pageSize }
        });
        Ext.mrv.ghginventory.ux.dataTypes.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('dataTypes-grid', Ext.mrv.ghginventory.ux.dataTypes.Grid);

/**
* @desc      Data Types panel
* @author    Dawit Kiros


* @version   $Id: dataTypes.js, 0.1
* @namespace Ext.mrv.ghginventory.ux.dataTypes
* @class     Ext.mrv.ghginventory.ux.dataTypes.Panel
* @extends   Ext.Panel
*/
Ext.mrv.ghginventory.ux.dataTypes.Panel = function (config) {
    Ext.mrv.ghginventory.ux.dataTypes.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false,
        tbar: {
            xtype: 'toolbar',
            items: [{
                xtype: 'button',
                text: 'Add',
                id: 'addDataTypes',
                iconCls: 'icon-add',
                handler: this.onAddClick,
                disabled: !Ext.mrv.ghginventory.ux.Reception.getPermission('Data Types', 'CanAdd')
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Edit',
                id: 'editDataTypes',
                iconCls: 'icon-edit',
                handler: this.onEditClick,
                disabled: !Ext.mrv.ghginventory.ux.Reception.getPermission('Data Types', 'CanEdit')
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Delete',
                id: 'deleteDataTypes',
                iconCls: 'icon-delete',
                handler: this.onDeleteClick,
                disabled: !Ext.mrv.ghginventory.ux.Reception.getPermission('Data Types', 'CanDelete')
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Print List',
                id: 'printDataTypes',
                iconCls: 'icon-Print',
                handler: this.onDataTypesPrintClick

            }]
        }
    }, config));
}
Ext.extend(Ext.mrv.ghginventory.ux.dataTypes.Panel, Ext.Panel, {
    initComponent: function () {
        this.items = [{
            xtype: 'dataTypes-grid',
            id: 'dataTypes-grid'
        }];
        Ext.mrv.ghginventory.ux.dataTypes.Panel.superclass.initComponent.apply(this, arguments);
    },

    onAddClick: function () {
        new Ext.mrv.ghginventory.ux.dataTypes.Window({
            dataTypeId: 0,
            title: 'Add Data Types'
        }).show();
    },
    onEditClick: function () {
        var grid = Ext.getCmp('dataTypes-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');
        new Ext.mrv.ghginventory.ux.dataTypes.Window({
            dataTypeId: id,
            title: 'Edit Data Types'
        }).show();
    },
    onDeleteClick: function () {
        var grid = Ext.getCmp('dataTypes-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        Ext.MessageBox.show({
            title: 'Delete',
            msg: 'Are you sure you want to delete the selected Data Types?',
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
                    GHGDataTypes.Delete(id, function (result, response) {
                        Ext.getCmp('dataTypes-paging').doRefresh();
                    }, this);
                }
            }
        });
    },
    onDataTypesPrintClick: function () {
        var grid = Ext.getCmp('dataTypes-grid');
        Ext.ux.GridPrinter.stylesheetPath = '/Content/css/print.css';
        Ext.ux.GridPrinter.print(grid);
    }
});
Ext.reg('dataTypes-panel', Ext.mrv.ghginventory.ux.dataTypes.Panel);