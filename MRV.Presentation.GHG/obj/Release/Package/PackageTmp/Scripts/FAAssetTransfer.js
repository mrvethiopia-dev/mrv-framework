Ext.ns('Ext.core.finance.ux.faAssetTransfer');
/**
* @desc      Regions registration form
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.faAssetTransfer
* @class     Ext.core.finance.ux.faAssetTransfer.Form
* @extends   Ext.form.FormPanel
*/
Ext.core.finance.ux.faAssetTransfer.Form = function (config) {
    Ext.core.finance.ux.faAssetTransfer.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: PayrollRegions.Get,
            submit: PayrollRegions.Save
        },
        paramOrder: ['Id'],
        defaults: {
            labelStyle: 'text-align:left;',
            msgTarget: 'side'
        },
        id: 'faAssetTransfer-form',
        padding: 0,
        //labelWidth: 80,
        autoHeight: true,
        //border: true,
        isFormLoad: false,
        frame: true,
        items: [{
            layout: 'column',
            items: [{
                columnWidth: .35,
                defaults: {
                    labelStyle: 'text-align:left;',
                    msgTarget: 'side'
                },
                border: true,
                layout: 'form',
                items: [
                {
                    name: 'CurrentlyOwnedById',
                    xtype: 'textfield',
                    fieldLabel: 'Currently Owned By',
                    allowBlank: true,
                    disabled:true,
                    value: 'Abebe Kebede Alemu'
                }
                ]
            }, {
                columnWidth: .30,
                defaults: {
                    labelStyle: 'text-align:right;',
                    msgTarget: 'side'
                },
                border: false,
                layout: 'form',
                items: [ {
                    hiddenName: 'LocationId',
                    xtype: 'combo',
                    fieldLabel: 'To Location',
                    anchor: '90%',
                    triggerAction: 'all',
                    mode: 'local',
                    editable: true,
                    typeAhead: true,
                    forceSelection: true,
                    //emptyText: '- Select Location -',
                    allowBlank: false,
                    store: new Ext.data.DirectStore({
                        reader: new Ext.data.JsonReader({
                            successProperty: 'success',
                            idProperty: 'Id',
                            root: 'data',
                            fields: ['Id', 'CodeAndName']
                        }),
                        autoLoad: true,
                        api: { read: Tsa.GetWoreda }
                    }),
                    valueField: 'Id', displayField: 'CodeAndName'
                }, {
                    name: 'ToCustodian',
                    xtype: 'textfield',
                    fieldLabel: 'To Custodian',
                    allowBlank: false,
                    
                    
                }]

            }, {
                columnWidth: .35,
                defaults: {
                    labelStyle: 'text-align:right;',
                    msgTarget: 'side'
                },
                border: false,
                layout: 'form',
                items: [
                 {
                     name: 'Id',
                     xtype: 'textfield',
                     hidden: true
                 },  {
                    name: 'IsPosted',
                    xtype: 'checkbox',
                    fieldLabel: 'IsPosted'
                }
                ]

            }]
        }]
    }, config));
}
Ext.extend(Ext.core.finance.ux.faAssetTransfer.Form, Ext.form.FormPanel);
Ext.reg('faAssetTransfer-form', Ext.core.finance.ux.faAssetTransfer.Form);

/**
* @desc      Regions registration form host window
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.faAssetTransfer
* @class     Ext.core.finance.ux.faAssetTransfer.Window
* @extends   Ext.Window
*/
Ext.core.finance.ux.faAssetTransfer.Window = function (config) {
    Ext.core.finance.ux.faAssetTransfer.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        width: 800,
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
Ext.extend(Ext.core.finance.ux.faAssetTransfer.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.core.finance.ux.faAssetTransfer.Form();
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

        Ext.core.finance.ux.faAssetTransfer.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {

        if (!this.form.getForm().isValid()) return;
        this.form.getForm().submit({
            waitMsg: 'Please wait...',
            success: function () {
                Ext.getCmp('faAssetTransfer-form').getForm().reset();
                Ext.getCmp('faAssetTransfer-paging').doRefresh();
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
Ext.reg('faAssetTransfer-window', Ext.core.finance.ux.faAssetTransfer.Window);

/**
* @desc      Regions grid
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.faAssetTransfer
* @class     Ext.core.finance.ux.faAssetTransfer.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.core.finance.ux.faAssetTransfer.Grid = function (config) {
    Ext.core.finance.ux.faAssetTransfer.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: PayrollRegions.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Code',
                direction: 'ASC'
            },
            fields: ['Id', 'Name', 'ShortName', 'Code'],
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
        id: 'faAssetTransfer-grid',
        searchCriteria: {},
        pageSize: 38,
        title: 'Regions List',
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
                var form = Ext.getCmp('faAssetTransfer-form');
                if (id != null) {

                }
            },
            scope: this,
            rowdblclick: function () {
                if (!this.getSelectionModel().hasSelection()) return;
                var id = this.getSelectionModel().getSelected().get('Id');

                if (id != null) {
                    var hasEditPermission = Ext.core.finance.ux.Reception.getPermission('Regions', 'CanEdit');
                    if (hasEditPermission) {
                        new Ext.core.finance.ux.faAssetTransfer.Window({
                            payrollRegionsId: id,
                            title: 'Edit Regions'
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
             header: 'Region Name',
             sortable: true,
             width: 55,
             menuDisabled: true
         }, {
             dataIndex: 'ShortName',
             header: 'Short Name',
             sortable: true,
             width: 55,
             menuDisabled: true
         }, {
             dataIndex: 'Code',
             header: 'Region Code',
             sortable: true,
             width: 55,
             menuDisabled: true
         }]
    }, config));
};
Ext.extend(Ext.core.finance.ux.faAssetTransfer.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ mode: 'get' }) };
        this.tbar = [];
        this.bbar = new Ext.PagingToolbar({
            id: 'faAssetTransfer-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.core.finance.ux.faAssetTransfer.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getStore().load({
            params: { start: 0, limit: this.pageSize }
        });
        Ext.core.finance.ux.faAssetTransfer.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('faAssetTransfer-grid', Ext.core.finance.ux.faAssetTransfer.Grid);

/**
* @desc      Regions panel
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @version   $Id: faAssetTransfer.js, 0.1
* @namespace Ext.core.finance.ux.faAssetTransfer
* @class     Ext.core.finance.ux.faAssetTransfer.Panel
* @extends   Ext.Panel
*/
Ext.core.finance.ux.faAssetTransfer.Panel = function (config) {
    Ext.core.finance.ux.faAssetTransfer.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false,
        tbar: {
            xtype: 'toolbar',
            items: [{
                xtype: 'button',
                text: 'Add',
                id: 'addpayrollRegions',
                iconCls: 'icon-add',
                handler: this.onAddClick,
                disabled: !Ext.core.finance.ux.Reception.getPermission('Regions', 'CanAdd')
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Edit',
                id: 'editpayrollRegions',
                iconCls: 'icon-edit',
                handler: this.onEditClick,
                disabled: !Ext.core.finance.ux.Reception.getPermission('Regions', 'CanEdit')
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Delete',
                id: 'deletepayrollRegions',
                iconCls: 'icon-delete',
                handler: this.onDeleteClick,
                disabled: !Ext.core.finance.ux.Reception.getPermission('Regions', 'CanDelete')
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
Ext.extend(Ext.core.finance.ux.faAssetTransfer.Panel, Ext.Panel, {
    initComponent: function () {
        this.items = [{
            xtype: 'faAssetTransfer-grid',
            id: 'faAssetTransfer-grid'
        }];
        Ext.core.finance.ux.faAssetTransfer.Panel.superclass.initComponent.apply(this, arguments);
    },

    onAddClick: function () {
        new Ext.core.finance.ux.faAssetTransfer.Window({
            payrollRegionsId: 0,
            title: 'Add Regions'
        }).show();
    },
    onEditClick: function () {
        var grid = Ext.getCmp('faAssetTransfer-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');
        new Ext.core.finance.ux.faAssetTransfer.Window({
            payrollRegionsId: id,
            title: 'Edit Regions'
        }).show();
    },
    onDeleteClick: function () {
        var grid = Ext.getCmp('faAssetTransfer-grid');
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
                    PayrollRegions.Delete(id, function (result, response) {
                        Ext.getCmp('faAssetTransfer-paging').doRefresh();
                    }, this);
                }
            }
        });
    },
    onRegionsPrintClick: function () {
        var grid = Ext.getCmp('faAssetTransfer-grid');
        Ext.ux.GridPrinter.stylesheetPath = '/Content/css/print.css';
        Ext.ux.GridPrinter.print(grid);
    }
});
Ext.reg('faAssetTransfer-panel', Ext.core.finance.ux.faAssetTransfer.Panel);