Ext.ns('Ext.core.finance.ux.faAssets');
/**
* @desc      Fixed Assets registration form
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.faAssets
* @class     Ext.core.finance.ux.faAssets.Form
* @extends   Ext.form.FormPanel
*/
Ext.core.finance.ux.faAssets.Form = function (config) {
    Ext.core.finance.ux.faAssets.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: FixedAsset.Get,
            submit: FixedAsset.Save
        },
        paramOrder: ['Id'],
        defaults: {
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'faAssets-form',
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
                    labelStyle: 'text-align:right;',
                    msgTarget: 'side'
                },
                border: true,
                layout: 'form',
                items: [{
                    name: 'Id',
                    xtype: 'hidden'
                }, {
                    hiddenName: 'CategoryId',
                    xtype: 'combo',
                    fieldLabel: 'Category',
                    triggerAction: 'all',
                    mode: 'local',
                    editable: true,
                    typeAhead: true,
                    forceSelection: true,
                    emptyText: '---Select---',
                    allowBlank: false,
                    store: new Ext.data.DirectStore({
                        reader: new Ext.data.JsonReader({
                            successProperty: 'success',
                            idProperty: 'Id',
                            root: 'data',
                            fields: ['Id', 'Name', 'ControlAccountId']
                        }),
                        autoLoad: true,
                        api: { read: Tsa.GetFixedAssetCategory }
                    }),
                    valueField: 'Id',
                    displayField: 'Name',
                    listeners: {
                        select: function (cmb, rec, idx) {
                            //                    var form = Ext.getCmp('fixedAsset-form').getForm();
                            //                    form.findField('SLAccountId').reset();
                            //                    form.findField('SLAccount').reset();
                            //                    var ControlAccountId = this.getStore().getAt(idx).data.ControlAccountId;
                            //                    form.findField('ControlAccountId').setValue(ControlAccountId);
                        }
                    }
                },  {
                    name: 'Description',
                    xtype: 'textfield',
                    fieldLabel: 'Description',
                    allowBlank: false
                },{
                    hiddenName: 'ClassId',
                    xtype: 'combo',
                    fieldLabel: 'Asset Class',
                    triggerAction: 'all',
                    mode: 'local',
                    editable: true,
                    typeAhead: true,
                    forceSelection: true,
                    emptyText: '---Select---',
                    allowBlank: false,
                    store: new Ext.data.DirectStore({
                        reader: new Ext.data.JsonReader({
                            successProperty: 'success',
                            idProperty: 'Id',
                            root: 'data',
                            fields: ['Id', 'Name', 'ControlAccountId']
                        }),
                        autoLoad: true,
                        api: { read: Tsa.GetFixedAssetClass }
                    }),
                    valueField: 'Id',
                    displayField: 'Name',
                    listeners: {
                        select: function (cmb, rec, idx) {
                            //                    var form = Ext.getCmp('fixedAsset-form').getForm();
                            //                    form.findField('SLAccountId').reset();
                            //                    form.findField('SLAccount').reset();
                            //                    var ControlAccountId = this.getStore().getAt(idx).data.ControlAccountId;
                            //                    form.findField('ControlAccountId').setValue(ControlAccountId);
                        }
                    }
                }, {
                    name: 'ReferenceCode',
                    xtype: 'textfield',
                    fieldLabel: 'Reference Code',
                    allowBlank: true
                } , {
                    name: 'BrandName',
                    xtype: 'textfield',
                    fieldLabel: 'Brand Name',
                    allowBlank: true
                }, {
                    name: 'ModelNumber',
                    xtype: 'textfield',
                    fieldLabel: 'Model Number',
                    allowBlank: true
                }, {
                    name: 'Qty',
                    xtype: 'numberfield',
                    fieldLabel: 'Qty',
                    allowBlank: true
                }, {
                    name: 'Size',
                    xtype: 'textfield',
                    fieldLabel: 'Size',
                    allowBlank: true
                }, {
                    name: 'PrevInventoryCode',
                    xtype: 'textfield',
                    fieldLabel: 'Prev Inventory Code',
                    allowBlank: true
                }, {
                    name: 'InventoryCode',
                    xtype: 'textfield',
                    fieldLabel: 'Inventory Code',
                    allowBlank: true
                }]
            }, {
                columnWidth: .30,
                defaults: {
                    labelStyle: 'text-align:right;',
                    msgTarget: 'side'
                },
                border: false,
                layout: 'form',
                items: [{
                    name: 'SerialNumber',
                    xtype: 'textfield',
                    fieldLabel: 'Serial Number',
                    allowBlank: false
                }, {
                    name: 'Location',
                    xtype: 'textfield',
                    fieldLabel: 'Location',
                    allowBlank: false
                }, {
                    name: 'Custodian',
                    xtype: 'textfield',
                    fieldLabel: 'Custodian',
                    allowBlank: true
                }, {
                    name: 'GRNNumber',
                    xtype: 'textfield',
                    fieldLabel: 'GRN Number',
                    allowBlank: false
                }, {
                    name: 'GRNDate',
                    xtype: 'datefield',
                    fieldLabel: 'GRN Date',
                    altFormats: 'c',
                    editable: true,
                    allowBlank: false
                }, {
                    name: 'IsNonFixedAsset',
                    xtype: 'checkbox',
                    fieldLabel: 'Is Non FixedAsset',
                    allowBlank: true
                }, {
                    name: 'LastInventoryDate',
                    xtype: 'datefield',
                    fieldLabel: 'Last Inventory Date',
                    altFormats: 'c',
                    editable: true,
                    allowBlank: false
                }, {
                    xtype: 'fieldset',
                    title: 'Re-Evaluation',
                    autoHeight: true,

                    items: [{
                        name: 'ReevaluationMade',
                        xtype: 'checkbox',
                        fieldLabel: 'Re-evaluation Made?',
                        allowBlank: true
                    }, {
                        name: 'ReevaluationDate',
                        xtype: 'datefield',
                        fieldLabel: 'Date',
                        altFormats: 'c',
                        editable: true
                    }, {
                        name: 'ReevaluationAmount',
                        xtype: 'numberfield',
                        fieldLabel: 'Amount'
                        
                    }]
                }]

            }, {
                columnWidth: .35,
                defaults: {
                    labelStyle: 'text-align:right;',
                    msgTarget: 'side'
                },
                border: false,
                layout: 'form',
                items: [{
                    name: 'InvoiceNumber',
                    xtype: 'textfield',
                    fieldLabel: 'Invoice Number',
                    allowBlank: true
                }, {
                    name: 'PurchaseCost',
                    xtype: 'numberfield',
                    fieldLabel: 'Purchase Cost',
                    allowBlank: true
                }, {
                    name: 'VAT',
                    xtype: 'numberfield',
                    fieldLabel: 'VAT',
                    allowBlank: true
                }, {
                    name: 'VoucherNumber',
                    xtype: 'textfield',
                    fieldLabel: 'Voucher Number',
                    allowBlank: true
                }, {
                    name: 'IsVehicle',
                    xtype: 'checkbox',
                    fieldLabel: 'Is Vehicle',
                    allowBlank: true
                }, {
                    name: 'PlateNumber',
                    xtype: 'textfield',
                    fieldLabel: 'Plate Number',
                    allowBlank: true
                }, {
                    hiddenName: 'RegionId',
                    xtype: 'combo',                    
                    fieldLabel: 'Region',
                    triggerAction: 'all',
                    mode: 'local',
                    editable: true,
                    typeAhead: true,
                    forceSelection: true,
                    emptyText: '---Select Region---',
                    allowBlank: false,
                    store: new Ext.data.DirectStore({
                        reader: new Ext.data.JsonReader({
                            successProperty: 'success',
                            idProperty: 'Id',
                            root: 'data',
                            fields: ['Id', 'Name']
                        }),
                        autoLoad: true,
                        api: { read: Tsa.GetRegions }
                    }),
                    valueField: 'Id', displayField: 'Name'
                }, {
                    name: 'IsRLAS',
                    xtype: 'checkbox',
                    fieldLabel: 'Is RLAS',
                    allowBlank: true
                }, {
                    name: 'Owner',
                    hiddenName: 'Owner',
                    xtype: 'combo',
                    fieldLabel: 'Owner',
                    triggerAction: 'all',
                    mode: 'local',
                    editable: false,
                    forceSelection: false,
                    emptyText: '',
                    allowBlank: false,
                    store: new Ext.data.ArrayStore({
                        fields: ['Id', 'Name'],
                        data: [
                            ['1', 'LIFT'],
                            ['2', 'DFID']
                        ]
                    }),
                    valueField: 'Id',
                    displayField: 'Name',
                    listeners: {
                        select: function (cmb, rec, idx) {
                        }
                    }
                }, {
                    name: 'CreatedAt',
                    xtype: 'datefield',
                    fieldLabel: 'CreatedAt',
                    altFormats: 'c',
                    hidden: true,
                    editable: true,
                    anchor: '75%',
                    allowBlank: true
                }
                ]

            }]
        }]
    }, config));
}
Ext.extend(Ext.core.finance.ux.faAssets.Form, Ext.form.FormPanel);
Ext.reg('faAssets-form', Ext.core.finance.ux.faAssets.Form);

/**
* @desc      Fixed Assets registration form host window
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.faAssets
* @class     Ext.core.finance.ux.faAssets.Window
* @extends   Ext.Window
*/
Ext.core.finance.ux.faAssets.Window = function (config) {
    Ext.core.finance.ux.faAssets.Window.superclass.constructor.call(this, Ext.apply({
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
                this.form.getForm().findField('Id').setValue(this.fixedAssetId);
                if (this.fixedAssetId != '') {
                    this.form.load({ params: { Id: this.fixedAssetId } });
                }
            },
            scope: this
        }
    }, config));
}
Ext.extend(Ext.core.finance.ux.faAssets.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.core.finance.ux.faAssets.Form();
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

        Ext.core.finance.ux.faAssets.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {

        if (!this.form.getForm().isValid()) return;
        this.form.getForm().submit({
            waitMsg: 'Please wait...',
            success: function () {
                Ext.getCmp('faAssets-form').getForm().reset();
                Ext.getCmp('faAssets-paging').doRefresh();
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
Ext.reg('faAssets-window', Ext.core.finance.ux.faAssets.Window);

/**
* @desc      Fixed Assets grid
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.faAssets
* @class     Ext.core.finance.ux.faAssets.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.core.finance.ux.faAssets.Grid = function (config) {
    Ext.core.finance.ux.faAssets.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: FixedAsset.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Code',
                direction: 'ASC'
            },
            fields: ['Id', 'Description', 'Class', 'ReferenceCode', 'Size', 'InventoryCode', 'PrevInventoryCode', 'SerialNumber', 'Location', 'Custodian', 'GRNDate', 'InvoiceNumber', 'PurchaseCost', 'VAT','Category'],
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
        id: 'fixedAsset-grid',
        searchCriteria: {},
        pageSize: 75,
        height: 600,
        stripeRows: true,
        columnLines: true,
        border: true,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        viewConfig: {
            
        },
        listeners: {
            rowClick: function () {
                if (!this.getSelectionModel().hasSelection()) return;
                var id = this.getSelectionModel().getSelected().get('Id');
                var form = Ext.getCmp('fixedAsset-form');
                if (id > 0) {
                    form.load({ params: { id: id} });
                }
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
        }, new Ext.erp.ux.grid.PagingRowNumberer(), {
            dataIndex: 'Description',
            header: 'Description', 
            sortable: true,
            width: 200,
            menuDisabled: true
        }, {
            dataIndex: 'Class',
            header: 'Class', 
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'ReferenceCode',
            header: 'ReferenceCode', 
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'Size',
            header: 'Size', 
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'InventoryCode',
            header: 'InventoryCode', 
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'PrevInventoryCode',
            header: 'PrevInventoryCode', 
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'SerialNumber',
            header: 'SerialNumber', 
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'Location',
            header: 'Location', 
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'Custodian',
            header: 'Custodian', 
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'GRNDate',
            header: 'GRNDate', 
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'InvoiceNumber',
            header: 'InvoiceNumber', 
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'PurchaseCost',
            header: 'PurchaseCost', 
            sortable: true,
            width: 100,
            menuDisabled: true,
            align: 'right',
            renderer: function (value) {
                if (value > 0) {
                    return Ext.util.Format.number(value, '0,000.00 ');
                } else {
                    return '';
                }
            }
        }, {
            dataIndex: 'VAT',
            header: 'VAT',
            sortable: true,
            width: 100,
            menuDisabled: true,
            align: 'right',
            renderer: function (value) {
                if (value > 0) {
                    return Ext.util.Format.number(value, '0,000.00 ');
                } else {
                    return '';
                }
            }
        }, {
            dataIndex:'Category',
            header: 'Category',
            sortable: true,
            width: 100,
            menuDisabled: true
        }]
    }, config));
};
Ext.extend(Ext.core.finance.ux.faAssets.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ mode: 'get' }) };
        this.tbar = [];
        this.bbar = new Ext.PagingToolbar({
            id: 'faAssets-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.core.finance.ux.faAssets.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getStore().load({
            params: { start: 0, limit: this.pageSize }
        });
        Ext.core.finance.ux.faAssets.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('faAssets-grid', Ext.core.finance.ux.faAssets.Grid);

/**
* @desc      Fixed Assets panel
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @version   $Id: faAssets.js, 0.1
* @namespace Ext.core.finance.ux.faAssets
* @class     Ext.core.finance.ux.faAssets.Panel
* @extends   Ext.Panel
*/
Ext.core.finance.ux.faAssets.Panel = function (config) {
    Ext.core.finance.ux.faAssets.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false,
        tbar: {
            xtype: 'toolbar',
            items: [{
                xtype: 'button',
                text: 'Add',
                id: 'addpayrollFixed Assets',
                iconCls: 'icon-add',
                hidden:true,
                handler: this.onAddClick,
                disabled: !Ext.core.finance.ux.Reception.getPermission('Fixed Assets', 'CanAdd')
            }, {
                xtype: 'button',
                text: 'Edit',
                id: 'editpayrollFixed Assets',
                iconCls: 'icon-edit',
                handler: this.onEditClick,
                disabled: !Ext.core.finance.ux.Reception.getPermission('Fixed Assets', 'CanEdit')
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Delete',
                id: 'deletepayrollFixed Assets',
                iconCls: 'icon-delete',
                handler: this.onDeleteClick,
                disabled: !Ext.core.finance.ux.Reception.getPermission('Fixed Assets', 'CanDelete')
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Print List',
                id: 'printFixed Assets',
                iconCls: 'icon-Print',
                handler: this.onFixedAssetsPrintClick

            }]
        }
    }, config));
}
Ext.extend(Ext.core.finance.ux.faAssets.Panel, Ext.Panel, {
    initComponent: function () {
        this.items = [{
            xtype: 'faAssets-grid',
            id: 'faAssets-grid'
        }];
        Ext.core.finance.ux.faAssets.Panel.superclass.initComponent.apply(this, arguments);
    },

    onAddClick: function () {
        new Ext.core.finance.ux.faAssets.Window({
            fixedAssetId: 0,
            title: 'Add Fixed Assets'
        }).show();
    },
    onEditClick: function () {
        var grid = Ext.getCmp('faAssets-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');
        new Ext.core.finance.ux.faAssets.Window({
            fixedAssetId: id,
            title: 'Edit Fixed Assets'
        }).show();
    },
    onDeleteClick: function () {
        var grid = Ext.getCmp('faAssets-grid');
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
                    FixedAsset.Delete(id, function (result, response) {
                        Ext.getCmp('faAssets-paging').doRefresh();
                    }, this);
                }
            }
        });
    },
    onFixedAssetsPrintClick: function () {
        var grid = Ext.getCmp('faAssets-grid');
        Ext.ux.GridPrinter.stylesheetPath = '/Content/css/print.css';
        Ext.ux.GridPrinter.print(grid);
    }
});
Ext.reg('faAssets-panel', Ext.core.finance.ux.faAssets.Panel);