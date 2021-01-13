Ext.ns('Ext.mrv.ghginventory.ux.units');
/**
* @desc      Unit of Measurement registration form
* @author    Dawit Kiros
* @namespace Ext.mrv.ghginventory.ux.units
* @class     Ext.mrv.ghginventory.ux.units.Form
* @extends   Ext.form.FormPanel
*/
Ext.mrv.ghginventory.ux.units.Form = function (config) {
    Ext.mrv.ghginventory.ux.units.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: GHGUnits.Get,
            submit: GHGUnits.Save
        },
        paramOrder: ['Id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'units-form',
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
Ext.extend(Ext.mrv.ghginventory.ux.units.Form, Ext.form.FormPanel);
Ext.reg('units-form', Ext.mrv.ghginventory.ux.units.Form);

/**
* @desc      Unit of Measurement registration form host window
* @author    Dawit Kiros


* @namespace Ext.mrv.ghginventory.ux.units
* @class     Ext.mrv.ghginventory.ux.units.Window
* @extends   Ext.Window
*/
Ext.mrv.ghginventory.ux.units.Window = function (config) {
    Ext.mrv.ghginventory.ux.units.Window.superclass.constructor.call(this, Ext.apply({
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
                this.form.getForm().findField('Id').setValue(this.unitId);
                if (this.unitId != '') {
                    this.form.load({ params: { Id: this.unitId} });
                }
            },
            scope: this
        }
    }, config));
}
Ext.extend(Ext.mrv.ghginventory.ux.units.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.mrv.ghginventory.ux.units.Form();
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

        Ext.mrv.ghginventory.ux.units.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {

        if (!this.form.getForm().isValid()) return;
        this.form.getForm().submit({
            waitMsg: 'Please wait...',
            success: function () {
                Ext.getCmp('units-form').getForm().reset();
                Ext.getCmp('units-paging').doRefresh();
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
Ext.reg('units-window', Ext.mrv.ghginventory.ux.units.Window);

/**
* @desc      Unit of Measurement grid
* @author    Dawit Kiros


* @namespace Ext.mrv.ghginventory.ux.units
* @class     Ext.mrv.ghginventory.ux.units.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.mrv.ghginventory.ux.units.Grid = function (config) {
    Ext.mrv.ghginventory.ux.units.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: GHGUnits.GetAll,
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
        id: 'units-grid',
        searchCriteria: {},
        pageSize: 38,
        title: 'Unit of Measurement List',
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
                var form = Ext.getCmp('units-form');
                if (id != null) {
                  
                }
            },
            scope: this,
            rowdblclick: function () {
                if (!this.getSelectionModel().hasSelection()) return;
                var id = this.getSelectionModel().getSelected().get('Id');

                if (id != null) {
                    var hasEditPermission = Ext.mrv.ghginventory.ux.Reception.getPermission('Unit of Measurement', 'CanEdit');
                    if (hasEditPermission) {
                        new Ext.mrv.ghginventory.ux.units.Window({
                            unitId: id,
                            title: 'Edit Unit of Measurement'
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
             header: 'Unit of Measurement',
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
Ext.extend(Ext.mrv.ghginventory.ux.units.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ mode: 'get' }) };
        this.tbar = [];
        this.bbar = new Ext.PagingToolbar({
            id: 'units-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.mrv.ghginventory.ux.units.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getStore().load({
            params: { start: 0, limit: this.pageSize }
        });
        Ext.mrv.ghginventory.ux.units.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('units-grid', Ext.mrv.ghginventory.ux.units.Grid);

/**
* @desc      Unit of Measurement panel
* @author    Dawit Kiros


* @version   $Id: units.js, 0.1
* @namespace Ext.mrv.ghginventory.ux.units
* @class     Ext.mrv.ghginventory.ux.units.Panel
* @extends   Ext.Panel
*/
Ext.mrv.ghginventory.ux.units.Panel = function (config) {
    Ext.mrv.ghginventory.ux.units.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false,
        tbar: {
            xtype: 'toolbar',
            items: [{
                xtype: 'button',
                text: 'Add',
                id: 'addUnits',
                iconCls: 'icon-add',
                handler: this.onAddClick,
                disabled: !Ext.mrv.ghginventory.ux.Reception.getPermission('Unit of Measurement', 'CanAdd')
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Edit',
                id: 'editUnits',
                iconCls: 'icon-edit',
                handler: this.onEditClick,
                disabled: !Ext.mrv.ghginventory.ux.Reception.getPermission('Unit of Measurement', 'CanEdit')
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Delete',
                id: 'deleteUnits',
                iconCls: 'icon-delete',
                handler: this.onDeleteClick,
                disabled: !Ext.mrv.ghginventory.ux.Reception.getPermission('Unit of Measurement', 'CanDelete')
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Print List',
                id: 'printUnits',
                iconCls: 'icon-Print',
                handler: this.onUnitsPrintClick

            }]
        }
    }, config));
}
Ext.extend(Ext.mrv.ghginventory.ux.units.Panel, Ext.Panel, {
    initComponent: function () {
        this.items = [{
            xtype: 'units-grid',
            id: 'units-grid'
        }];
        Ext.mrv.ghginventory.ux.units.Panel.superclass.initComponent.apply(this, arguments);
    },

    onAddClick: function () {
        new Ext.mrv.ghginventory.ux.units.Window({
            unitId: 0,
            title: 'Add Unit of Measurement'
        }).show();
    },
    onEditClick: function () {
        var grid = Ext.getCmp('units-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');
        new Ext.mrv.ghginventory.ux.units.Window({
            unitId: id,
            title: 'Edit Unit of Measurement'
        }).show();
    },
    onDeleteClick: function () {
        var grid = Ext.getCmp('units-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        Ext.MessageBox.show({
            title: 'Delete',
            msg: 'Are you sure you want to delete the selected Unit of Measurement?',
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
                    GHGUnits.Delete(id, function (result, response) {
                        Ext.getCmp('units-paging').doRefresh();
                    }, this);
                }
            }
        });
    },
    onUnitsPrintClick: function () {
        var grid = Ext.getCmp('units-grid');
        Ext.ux.GridPrinter.stylesheetPath = '/Content/css/print.css';
        Ext.ux.GridPrinter.print(grid);
    }
});
Ext.reg('units-panel', Ext.mrv.ghginventory.ux.units.Panel);