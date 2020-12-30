Ext.ns('Ext.core.finance.ux.faAssetDisposal');
/**
* @desc      Asset Disposal registration form
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.faAssetDisposal
* @class     Ext.core.finance.ux.faAssetDisposal.Form
* @extends   Ext.form.FormPanel
*/
Ext.core.finance.ux.faAssetDisposal.Form = function (config) {
    Ext.core.finance.ux.faAssetDisposal.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: FixedAssetDisposal.Get,
            submit: FixedAssetDisposal.Save
        },
        paramOrder: ['Id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'faAssetDisposal-form',
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
                    xtype: 'fieldset',
                    title: 'Asset to be Disposed',
                    autoHeight: true,

                    items: [{
                        hiddenName: 'FixedAssetId',
                        fieldLabel: 'FixedAsset',
                        xtype: 'combo',
                        typeAhead: false,
                        hideTrigger: true,
                        minChars: 1,
                        listWidth: 280,

                        mode: 'remote',
                        tpl: '<tpl for="."><div ext:qtip="{Id}. {Description}" class="x-combo-list-item">' +
                            '<h3><span>{ReferenceCode}</span></h3> {Description}</div></tpl>',
                        store: new Ext.data.DirectStore({
                            reader: new Ext.data.JsonReader({
                                successProperty: 'success',
                                idProperty: 'Id',
                                totalProperty: 'total',
                                root: 'data',
                                fields: ['Id', 'Description', 'ReferenceCode']
                            }),
                            api: { read: Tsa.GetFixedAssets }
                        }),
                        valueField: 'Id',
                        displayField: 'Description',
                        pageSize: 10
                    }, {
                        name: 'CurrentlyOwnedById',
                        xtype: 'textfield',
                        fieldLabel: 'Currently Owned By',
                        allowBlank: true,
                        disabled: true,
                        value: 'Abebe Kebede Alemu'
                    }]
                }]
            }, {
                columnWidth: .50,
                defaults: {
                    labelStyle: 'text-align:right;',
                    msgTarget: 'side'
                },
                border: false,
                layout: 'form',
                items: [{
                    id: 'DisposalMethod',
                    hiddenName: 'DisposalMethod',
                    xtype: 'combo',
                    fieldLabel: 'Disposal Method',
                    triggerAction: 'all',
                    mode: 'local',
                    editable: false,
                    forceSelection: false,
                    emptyText: '---Select---',
                    allowBlank: false,
                    store: new Ext.data.ArrayStore({
                        fields: ['Id', 'Name'],
                        data: [
                            ['1', 'Sale'],
                            ['2', 'Exchange'],
                            ['3', 'Discard']
                        ]
                    }),
                    valueField: 'Id',
                    displayField: 'Name',
                    listeners: {
                        select: function (cmb, rec, idx) {
                        }
                    }
                }, {
                    name: 'CashProceeds',
                    xtype: 'numberfield',
                    fieldLabel: 'Cash Proceeds',
                    allowBlank: true
                }, {
                    name: 'NonCashProceeds',
                    xtype: 'textfield',
                    fieldLabel: 'Non Cash Proceeds',
                    allowBlank: true
                }, {
                    name: 'SalesExpense',
                    xtype: 'textfield',
                    fieldLabel: 'Sales Expense',
                    allowBlank: true
                }, {
                    name: 'DisposalDate',
                    xtype: 'datefield',
                    fieldLabel: 'DisposalDate',
                    altFormats: 'c',
                    editable: true
                }, {
                    name: 'DisposalReason',
                    xtype: 'textarea',
                    fieldLabel: 'DisposalReason',
                    altFormats: 'c',
                    editable: true
                }, {
                    id: 'DisposalApprovedby',
                    hiddenName: 'DisposalApprovedby',
                    xtype: 'combo',
                    fieldLabel: 'Approved by',
                    triggerAction: 'all',
                    mode: 'local',
                    editable: true,
                    listWidth: 250,
                    allowBlank: true,
                    store: new Ext.data.DirectStore({
                        reader: new Ext.data.JsonReader({
                            successProperty: 'success',
                            idProperty: 'Id',
                            root: 'data',
                            fields: ['Id', 'Name']
                        }),
                        autoLoad: true,
                        api: { read: window.Tsa.GetEmployeesList }
                    }),
                    valueField: 'Id', displayField: 'Name'
                }]

            }]
        }]
    }, config));
}
Ext.extend(Ext.core.finance.ux.faAssetDisposal.Form, Ext.form.FormPanel);
Ext.reg('faAssetDisposal-form', Ext.core.finance.ux.faAssetDisposal.Form);

/**
* @desc      Asset Disposal registration form host window
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.faAssetDisposal
* @class     Ext.core.finance.ux.faAssetDisposal.Window
* @extends   Ext.Window
*/
Ext.core.finance.ux.faAssetDisposal.Window = function (config) {
    Ext.core.finance.ux.faAssetDisposal.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        width: 600,
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
Ext.extend(Ext.core.finance.ux.faAssetDisposal.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.core.finance.ux.faAssetDisposal.Form();
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

        Ext.core.finance.ux.faAssetDisposal.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {

        if (!this.form.getForm().isValid()) return;
        this.form.getForm().submit({
            waitMsg: 'Please wait...',
            success: function () {
                Ext.getCmp('faAssetDisposal-form').getForm().reset();
                Ext.getCmp('faAssetDisposal-paging').doRefresh();
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
Ext.reg('faAssetDisposal-window', Ext.core.finance.ux.faAssetDisposal.Window);

/**
* @desc      Asset Disposal grid
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.faAssetDisposal
* @class     Ext.core.finance.ux.faAssetDisposal.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.core.finance.ux.faAssetDisposal.Grid = function (config) {
    Ext.core.finance.ux.faAssetDisposal.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: FixedAssetDisposal.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Code',
                direction: 'ASC'
            },
            fields: ['Id', 'FixedAsset', 'DisposalMethod', 'DisposalDate', 'DisposalReason'],
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
        id: 'faAssetDisposal-grid',
        searchCriteria: {},
        pageSize: 38,
        title: 'Asset Disposal List',
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
                var form = Ext.getCmp('faAssetDisposal-form');
                if (id != null) {

                }
            },
            scope: this,
            rowdblclick: function () {
                if (!this.getSelectionModel().hasSelection()) return;
                var id = this.getSelectionModel().getSelected().get('Id');

                if (id != null) {
                    var hasEditPermission = Ext.core.finance.ux.Reception.getPermission('Asset Disposal', 'CanEdit');
                    if (hasEditPermission) {
                        new Ext.core.finance.ux.faAssetDisposal.Window({
                            payrollRegionsId: id,
                            title: 'Edit Asset Disposal'
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
             dataIndex: 'FixedAsset',
             header: 'Fixed Asset',
             sortable: true,
             width: 55,
             menuDisabled: true
         }, {
             dataIndex: 'DisposalMethod',
             header: 'Disposal Method',
             sortable: true,
             width: 55,
             menuDisabled: true
         }, {
             dataIndex: 'DisposalDate',
             header: 'Disposal Date',
             sortable: true,
             width: 55,
             menuDisabled: true
         }, {
             dataIndex: 'DisposalReason',
             header: 'DisposalReason',
             sortable: true,
             width: 55,
             menuDisabled: true
         }]
    }, config));
};
Ext.extend(Ext.core.finance.ux.faAssetDisposal.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ mode: 'get' }) };
        this.tbar = [];
        this.bbar = new Ext.PagingToolbar({
            id: 'faAssetDisposal-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.core.finance.ux.faAssetDisposal.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getStore().load({
            params: { start: 0, limit: this.pageSize }
        });
        Ext.core.finance.ux.faAssetDisposal.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('faAssetDisposal-grid', Ext.core.finance.ux.faAssetDisposal.Grid);

/**
* @desc      Asset Disposal panel
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @version   $Id: faAssetDisposal.js, 0.1
* @namespace Ext.core.finance.ux.faAssetDisposal
* @class     Ext.core.finance.ux.faAssetDisposal.Panel
* @extends   Ext.Panel
*/
Ext.core.finance.ux.faAssetDisposal.Panel = function (config) {
    Ext.core.finance.ux.faAssetDisposal.Panel.superclass.constructor.call(this, Ext.apply({
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
                disabled: !Ext.core.finance.ux.Reception.getPermission('Asset Disposal', 'CanAdd')
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Edit',
                id: 'editpayrollRegions',
                iconCls: 'icon-edit',
                handler: this.onEditClick,
                disabled: !Ext.core.finance.ux.Reception.getPermission('Asset Disposal', 'CanEdit')
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Delete',
                id: 'deletepayrollRegions',
                iconCls: 'icon-delete',
                handler: this.onDeleteClick,
                disabled: !Ext.core.finance.ux.Reception.getPermission('Asset Disposal', 'CanDelete')
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
Ext.extend(Ext.core.finance.ux.faAssetDisposal.Panel, Ext.Panel, {
    initComponent: function () {
        this.items = [{
            xtype: 'faAssetDisposal-grid',
            id: 'faAssetDisposal-grid'
        }];
        Ext.core.finance.ux.faAssetDisposal.Panel.superclass.initComponent.apply(this, arguments);
    },

    onAddClick: function () {
        new Ext.core.finance.ux.faAssetDisposal.Window({
            payrollRegionsId: 0,
            title: 'Add Asset Disposal'
        }).show();
    },
    onEditClick: function () {
        var grid = Ext.getCmp('faAssetDisposal-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');
        new Ext.core.finance.ux.faAssetDisposal.Window({
            payrollRegionsId: id,
            title: 'Edit Asset Disposal'
        }).show();
    },
    onDeleteClick: function () {
        var grid = Ext.getCmp('faAssetDisposal-grid');
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
                    FixedAssetDisposal.Delete(id, function (result, response) {
                        Ext.getCmp('faAssetDisposal-paging').doRefresh();
                    }, this);
                }
            }
        });
    },
    onRegionsPrintClick: function () {
        var grid = Ext.getCmp('faAssetDisposal-grid');
        Ext.ux.GridPrinter.stylesheetPath = '/Content/css/print.css';
        Ext.ux.GridPrinter.print(grid);
    }
});
Ext.reg('faAssetDisposal-panel', Ext.core.finance.ux.faAssetDisposal.Panel);