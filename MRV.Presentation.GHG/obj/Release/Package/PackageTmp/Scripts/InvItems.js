Ext.ns('Ext.core.finance.ux.invItems');
/**
* @desc      Inventory Items registration form
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.invItems
* @class     Ext.core.finance.ux.invItems.Form
* @extends   Ext.form.FormPanel
*/
Ext.core.finance.ux.invItems.Form = function (config) {
    Ext.core.finance.ux.invItems.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: InventoryItems.Get,
            submit: InventoryItems.Save
        },
        paramOrder: ['Id'],
        defaults: {

            //anchor: '90%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'invItems-form',
        padding: 0,        
        autoHeight: true,
        isFormLoad: false,
        frame: true,
        items: [{
            layout: 'column',
            items: [{
                columnWidth: .50,
                defaults: {
                    labelStyle: 'text-align:left;',
                    msgTarget: 'side'
                },
                border: true,
                layout: 'form',
                items: [{
                    name: 'Id',
                    xtype: 'textfield',
                    hidden: true
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
                    name: 'Description',
                    xtype: 'textarea',
                    fieldLabel: 'Description',
                   
                    allowBlank: false
                }, {
                    hiddenName: 'UnitOfMeasureId',
                    xtype: 'combo',
                    fieldLabel: 'Unit Of Measure',
                   
                    triggerAction: 'all',
                    mode: 'local',
                    editable: true,
                    typeAhead: true,
                    forceSelection: true,
                    emptyText: '',
                    allowBlank: false,
                    store: new Ext.data.DirectStore({
                        reader: new Ext.data.JsonReader({
                            successProperty: 'success',
                            idProperty: 'Id',
                            root: 'data',
                            fields: ['Id', 'Name']
                        }),
                        autoLoad: true
                        //api: { read: Tsa.GetPositions }
                    }),
                    valueField: 'Id', displayField: 'Name'
                }, {
                    hiddenName: 'ItemStoreId',
                    xtype: 'combo',
                    fieldLabel: 'Store',
                   
                    triggerAction: 'all',
                    mode: 'local',
                    editable: true,
                    typeAhead: true,
                    forceSelection: true,
                    emptyText: '',
                    allowBlank: false,
                    store: new Ext.data.DirectStore({
                        reader: new Ext.data.JsonReader({
                            successProperty: 'success',
                            idProperty: 'Id',
                            root: 'data',
                            fields: ['Id', 'Name']
                        }),
                        autoLoad: true
                        //api: { read: Tsa.GetPositions }
                    }),
                    valueField: 'Id', displayField: 'Name'
                }, {
                    name: 'IsFunctional',
                    hiddenName: 'IsFunctional',
                    xtype: 'combo',
                    fieldLabel: 'Functional/Non Functional',
                    triggerAction: 'all',
                    mode: 'local',
                    editable: false,
                    forceSelection: false,
                    emptyText: '',
                    allowBlank: false,
                    store: new Ext.data.ArrayStore({
                        fields: ['Id', 'Name'],
                        data: [
                            ['1', 'Functional'],
                            ['2', 'Non Functional']
                        ]
                    }),
                    valueField: 'Id',
                    displayField: 'Name',
                    listeners: {
                        select: function (cmb, rec, idx) {
                        }
                    }
                }]
            }, {
                columnWidth: .5,
                defaults: {
                    labelStyle: 'text-align:right;',
                    msgTarget: 'side'
                },
                border: false,
                layout: 'form',
                items: [{
                    name: 'OpeningQty',
                    xtype: 'numberfield',
                    fieldLabel: 'Opening Qty'
                    
                }, {
                    name: 'CurrentQty',
                    xtype: 'numberfield',
                    fieldLabel: 'Current Qty'
                }, {
                    name: 'MaxQty',
                    xtype: 'numberfield',
                    fieldLabel: 'Maximum Qty'
                }, {
                    name: 'MinQty',
                    xtype: 'numberfield',
                    fieldLabel: 'Minimum Qty'
                }, {
                    name: 'ShelfNumber',
                    xtype: 'textfield',
                    fieldLabel: 'Shelf Number'
                }]

            }]
        }]
    }, config));
}
Ext.extend(Ext.core.finance.ux.invItems.Form, Ext.form.FormPanel);
Ext.reg('invItems-form', Ext.core.finance.ux.invItems.Form);

/**
* @desc      Inventory Items registration form host window
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.invItems
* @class     Ext.core.finance.ux.invItems.Window
* @extends   Ext.Window
*/
Ext.core.finance.ux.invItems.Window = function (config) {
    Ext.core.finance.ux.invItems.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        width: 650,
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;',
        listeners: {
            show: function () {
                this.form.getForm().findField('Id').setValue(this.payrollRegionsId);
                if (this.payrollRegionsId != '') {
                    this.form.load({ params: { Id: this.payrollRegionsId } });
                }
            },
            scope: this
        }
    }, config));
}
Ext.extend(Ext.core.finance.ux.invItems.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.core.finance.ux.invItems.Form();
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

        Ext.core.finance.ux.invItems.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {

        if (!this.form.getForm().isValid()) return;
        this.form.getForm().submit({
            waitMsg: 'Please wait...',
            success: function () {
                Ext.getCmp('invItems-form').getForm().reset();
                Ext.getCmp('invItems-paging').doRefresh();
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
Ext.reg('invItems-window', Ext.core.finance.ux.invItems.Window);

/**
* @desc      Inventory Items grid
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.invItems
* @class     Ext.core.finance.ux.invItems.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.core.finance.ux.invItems.Grid = function (config) {
    Ext.core.finance.ux.invItems.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: InventoryItems.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Code',
                direction: 'ASC'
            },
            fields: ['Id', 'Name', 'Code', 'Unit', 'CurrentQty'],
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
        id: 'invItems-grid',
        searchCriteria: {},
        pageSize: 38,
        title: 'Inventory Items List',
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
                var form = Ext.getCmp('invItems-form');
                if (id != null) {

                }
            },
            scope: this,
            rowdblclick: function () {
                if (!this.getSelectionModel().hasSelection()) return;
                var id = this.getSelectionModel().getSelected().get('Id');

                if (id != null) {
                    var hasEditPermission = Ext.core.finance.ux.Reception.getPermission('Inventory Items', 'CanEdit');
                    if (hasEditPermission) {
                        new Ext.core.finance.ux.invItems.Window({
                            payrollRegionsId: id,
                            title: 'Edit Inventory Items'
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
             header: 'Item Name',
             sortable: true,
             width: 55,
             menuDisabled: true
         }, {
             dataIndex: 'Code',
             header: 'Item Code',
             sortable: true,
             width: 55,
             menuDisabled: true
         }, {
             dataIndex: 'Unit',
             header: 'Item Unit',
             sortable: true,
             width: 55,
             menuDisabled: true
         },  {
             dataIndex: 'CurrentQty',
             header: 'Current Qty',
             sortable: true,
             width: 55,
             menuDisabled: true
         }]
    }, config));
};
Ext.extend(Ext.core.finance.ux.invItems.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ mode: 'get' }) };
        this.tbar = [];
        this.bbar = new Ext.PagingToolbar({
            id: 'invItems-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.core.finance.ux.invItems.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getStore().load({
            params: { start: 0, limit: this.pageSize }
        });
        Ext.core.finance.ux.invItems.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('invItems-grid', Ext.core.finance.ux.invItems.Grid);

/**
* @desc      Inventory Items panel
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @version   $Id: invItems.js, 0.1
* @namespace Ext.core.finance.ux.invItems
* @class     Ext.core.finance.ux.invItems.Panel
* @extends   Ext.Panel
*/
Ext.core.finance.ux.invItems.Panel = function (config) {
    Ext.core.finance.ux.invItems.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false,
        tbar: {
            xtype: 'toolbar',
            items: [{
                xtype: 'button',
                text: 'Add',
                id: 'addpayrollRegions',
                iconCls: 'icon-add',
                hidden:true,
                handler: this.onAddClick,
                //disabled: !Ext.core.finance.ux.Reception.getPermission('Inventory Items', 'CanAdd')
            },  {
                xtype: 'button',
                text: 'Edit',
                id: 'editpayrollRegions',
                iconCls: 'icon-edit',
                handler: this.onEditClick,
                //disabled: !Ext.core.finance.ux.Reception.getPermission('Inventory Items', 'CanEdit')
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Delete',
                id: 'deletepayrollRegions',
                iconCls: 'icon-delete',
                handler: this.onDeleteClick,
                //disabled: !Ext.core.finance.ux.Reception.getPermission('Inventory Items', 'CanDelete')
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Print List',
                id: 'printRegions',
                iconCls: 'icon-Print',
                handler: this.onRegionsPrintClick

            }]
        }
    }, config));
}
Ext.extend(Ext.core.finance.ux.invItems.Panel, Ext.Panel, {
    initComponent: function () {
        this.items = [{
            xtype: 'invItems-grid',
            id: 'invItems-grid'
        }];
        Ext.core.finance.ux.invItems.Panel.superclass.initComponent.apply(this, arguments);
    },

    onAddClick: function () {
        new Ext.core.finance.ux.invItems.Window({
            payrollRegionsId: 0,
            title: 'Add Inventory Items'
        }).show();
    },
    onEditClick: function () {
        var grid = Ext.getCmp('invItems-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');
        new Ext.core.finance.ux.invItems.Window({
            payrollRegionsId: id,
            title: 'Edit Inventory Items'
        }).show();
    },
    onDeleteClick: function () {
        var grid = Ext.getCmp('invItems-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        Ext.MessageBox.show({
            title: 'Delete',
            msg: 'Are you sure you want to delete the selected Account?',
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
                    InventoryItems.Delete(id, function (result, response) {
                        Ext.getCmp('invItems-paging').doRefresh();
                    }, this);
                }
            }
        });
    },
    onRegionsPrintClick: function () {
        var grid = Ext.getCmp('invItems-grid');
        Ext.ux.GridPrinter.stylesheetPath = '/Content/css/print.css';
        Ext.ux.GridPrinter.print(grid);
    }
});
Ext.reg('invItems-panel', Ext.core.finance.ux.invItems.Panel);