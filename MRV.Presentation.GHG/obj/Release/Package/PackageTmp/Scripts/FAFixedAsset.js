Ext.ns('Ext.core.finance.ux.fixedAsset');
/**
* @desc      FixedAsset registration form
* @author    Wondwosen Desalegn
* @copyright (c) 2012, Cybersoft
* @date      April 24, 2012
* @namespace Ext.core.finance.ux.fixedAsset
* @class     Ext.core.finance.ux.fixedAsset.Form
* @extends   Ext.form.FormPanel
*/
Ext.core.finance.ux.fixedAsset.Form = function (config) {
    Ext.core.finance.ux.fixedAsset.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: FixedAsset.Get,
            submit: FixedAsset.Save
        },
        paramOrder: ['id'],
        defaults: {
            anchor: '98%',
            msgTarget: 'side',
            labelStyle: 'text-align:right;',
            bodyStyle: 'background:transparent;padding:5px'
        },
        id: 'fixedAsset-form',
        padding: 5,
        labelWidth: 150,
        autoHeight: true,
        border: false,
        layout: 'form',
        bodyStyle: 'background:transparent;padding:5px',
        baseCls: 'x-plain',
        width: 840,
        
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
            name: 'InventoryCode',
            xtype: 'textfield',
            fieldLabel: 'Inventory Code',
            allowBlank: true
        }, {
            name: 'PrevInventoryCode',
            xtype: 'textfield',
            fieldLabel: 'Prev Inventory Code',
            allowBlank: true
        }, {
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
        } ],
        buttons: [{
            text: 'Save',
            iconCls: 'icon-save',
            handler: function () {
                form = Ext.getCmp('fixedAsset-form').getForm();
                if (!form.isValid()) return;
                if (form.findField('SLAccountId').getValue() == '') {
                    Ext.MessageBox.alert('Invalid input', 'SL account should be selected');
                    return;
                }
                form.submit({
                    waitMsg: 'Please wait...',
                    success: function () {
                        form.reset();
                        Ext.getCmp('fixedAsset-paging').doRefresh();
                    }
                });
            },
            scope: this
        }, {
            text: 'Delete',
            iconCls: 'icon-delete',
            handler: function () {
                var grid = Ext.getCmp('fixedAsset-grid');
                if (!grid.getSelectionModel().hasSelection()) return;
                Ext.MessageBox.show({
                    title: 'Delete',
                    msg: 'Are you sure you want to delete the selected Fixed Asset',
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
                                if (result.success) {
                                    Ext.getCmp('fixedAsset-form').getForm().reset();
                                    Ext.getCmp('fixedAsset-paging').doRefresh();
                                }
                                else {
                                    Ext.MessageBox.alert('Delete Error', result.data);
                                }
                            }, this);
                        }
                    }
                });
            },
            scope: this
        }, {
            text: 'Cancel',
            iconCls: 'icon-cancel',
            handler: function () {
                form = Ext.getCmp('fixedAsset-form').getForm();
                form.reset();
            },
            scope: this
        }]
    }, config));
};
Ext.extend(Ext.core.finance.ux.fixedAsset.Form, Ext.form.FormPanel);
Ext.reg('fixedAsset-form', Ext.core.finance.ux.fixedAsset.Form);

/**
* @desc      FixedAsset search form
* @author    Wondwosen Desalegn
* @copyright (c) 2012, Cybersoft
* @date      April 24, 2012
* @namespace Ext.core.finance.ux.fixedAsset
* @class     Ext.core.finance.ux.fixedAsset.SearchForm
* @extends   Ext.form.FormPanel
*/
Ext.core.finance.ux.fixedAsset.SearchForm = function (config) {
    Ext.core.finance.ux.fixedAsset.SearchForm.superclass.constructor.call(this, Ext.apply({
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'fixedAssetSearch-form',
        padding: 5,
        labelWidth: 115,
        autoHeight: true,
        border: false,
        baseCls: 'x-plain',
        items: [{
            xtype: 'compositefield',
            fieldLabel: 'Search by',
            defaults: {
                flex: 1
            },
            items: [{
                hiddenName: 'SearchBy',
                xtype: 'combo',
                fieldLabel: 'Search by',
                triggerAction: 'all',
                mode: 'local',
                editable: false,
                forceSelection: false,
                emptyText: '---Select---',
                allowBlank: true,
                store: new Ext.data.ArrayStore({
                    fields: ['Id', 'Name'],
                    data: [[1, 'Category'], [2, 'SL Account'], [3, 'Description'], [4, 'GRN Number']]
                }),
                valueField: 'Id',
                displayField: 'Name',
                listeners: {
                    'select': function (cmb, rec, idx) {
                        var form = Ext.getCmp('fixedAssetSearch-form').getForm();
                        var searchByCombo = this.getValue();
                        var criteriaCombo = form.findField('Criteria');
                        var searchText = form.findField('SearchText');
                        var categoryCombo = form.findField('CategoryId');
                        var slAccountCombo = form.findField('SLAccountId');
                        if (searchByCombo == 1) {
                            criteriaCombo.hide();
                            searchText.hide();
                            categoryCombo.show();
                            slAccountCombo.hide();
                        }
                        else if (searchByCombo == 2) {
                            criteriaCombo.hide();
                            searchText.hide();
                            categoryCombo.hide();
                            slAccountCombo.show();
                        }
                        else {
                            criteriaCombo.show();
                            searchText.show();
                            categoryCombo.hide();
                            slAccountCombo.hide();
                        }
                    }
                }
            }, {
                xtype: 'button',
                id: 'resetControls',
                iconCls: 'icon-refresh',
                width: 25,
                handler: function () {
                    var form = Ext.getCmp('fixedAssetSearch-form').getForm();
                    var searchBy = form.findField('SearchBy');
                    var criteriaCombo = form.findField('Criteria');
                    var searchTextCombo = form.findField('SearchText');
                    var categoryCombo = form.findField('CategoryId');
                    var slAccountCombo = form.findField('SLAccountId');
                    searchBy.reset();
                    categoryCombo.reset(); categoryCombo.hide();
                    slAccountCombo.reset(); slAccountCombo.hide();
                    criteriaCombo.reset(); criteriaCombo.hide();
                    searchTextCombo.reset(); searchTextCombo.hide();
                }
            }]
        }, {
            hiddenName: 'Criteria',
            xtype: 'combo',
            fieldLabel: 'Criteria',
            hidden: true,
            triggerAction: 'all',
            mode: 'local',
            editable: false,
            forceSelection: false,
            emptyText: '---Select---',
            allowBlank: true,
            store: new Ext.data.ArrayStore({
                fields: ['Id', 'Name'],
                data: [[1, 'Starts With'], [2, 'Contains'], [3, 'Ends With']]
            }),
            valueField: 'Id',
            displayField: 'Name'
        }, {
            name: 'SearchText',
            xtype: 'textfield',
            hidden: true,
            fieldLabel: 'Search Text'
        }, {
            hiddenName: 'CategoryId',
            xtype: 'combo',
            fieldLabel: 'Category',
            hidden: true,
            triggerAction: 'all',
            mode: 'local',
            editable: false,
            forceSelection: false,
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
                api: { read: Tsa.GetFixedAssetCategory }
            }),
            valueField: 'Id',
            displayField: 'Name'
        }, {
            hiddenName: 'SLAccountId',
            xtype: 'combo',
            fieldLabel: 'SL Account',
            hidden: true,
            triggerAction: 'all',
            mode: 'local',
            editable: false,
            forceSelection: false,
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
                api: { read: Tsa.GetSLAccount }
            }),
            valueField: 'Id',
            displayField: 'Name'
        }]
    }, config));
};
Ext.extend(Ext.core.finance.ux.fixedAsset.SearchForm, Ext.form.FormPanel);
Ext.reg('fixedAssetSearch-form', Ext.core.finance.ux.fixedAsset.SearchForm);

/**
* @desc      FixedAssetSearch form host window
* @author    Wondwosen Desalegn
* @copyright (c) 2012, Cybersoft
* @date      April 24, 2012
* @namespace Ext.core.finance.ux.fixedAsset
* @class     Ext.core.finance.ux.fixedAsset.Window
* @extends   Ext.Window
*/
Ext.core.finance.ux.fixedAsset.Window = function (config) {
    Ext.core.finance.ux.fixedAsset.Window.superclass.constructor.call(this, Ext.apply({
        title: 'Fixed Asset Search',
        width: 450,
        height: 150,
        layout: 'fit',
        closeAction: 'close',
        modal: true,
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;'
    }, config));
}
Ext.extend(Ext.core.finance.ux.fixedAsset.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.core.finance.ux.fixedAsset.SearchForm();
        this.items = [this.form];
        var window = this;
        this.bbar = [{
            xtype: 'tbfill'
        }, {
            text: 'Select',
            iconCls: 'icon-select',
            handler: function () {
                var form = Ext.getCmp('fixedAssetSearch-form').getForm();
                var searchByComboValue = form.findField('SearchBy').getRawValue();
                var criteriaComboValue = form.findField('Criteria').getRawValue();
                var searchTextValue = form.findField('SearchText').getValue();
                var categoryComboValue = form.findField('CategoryId').getValue();
                var slAccountComboValue = form.findField('SLAccountId').getValue();

                var searchParams = '';
                if (searchByComboValue == 'Category') {
                    searchParams = searchByComboValue + ';' + categoryComboValue;
                }
                else if (searchByComboValue == 'SL Account') {
                    searchParams = searchByComboValue + ';' + slAccountComboValue;
                }
                else {
                    searchParams = searchByComboValue + ';' + criteriaComboValue + ';' + searchTextValue;
                }

                var fixedAssetGrid = Ext.getCmp('fixedAsset-grid');
                fixedAssetGrid.store.baseParams = { record: Ext.encode({ searchParam: searchParams }) };
                fixedAssetGrid.store.load({ params: { start: 0, limit: fixedAssetGrid.pageSize} });
            }
        }, {
            text: 'Close',
            iconCls: 'icon-exit',
            handler: function () {
                window.close();
            }
        }]
        this.tools = [{
            id: 'refresh',
            qtip: 'Reset',
            handler: function () {
                this.form.getForm().reset();
            },
            scope: this
        }];
        Ext.core.finance.ux.fixedAsset.Window.superclass.initComponent.call(this, arguments);
    }
});
Ext.reg('fixedAssetSearch-window', Ext.core.finance.ux.fixedAsset.Window);

/**
* @desc      FixedAsset grid
* @author    Wondwosen Desalegn
* @copyright (c) 2012, Cybersoft
* @date      April 24, 2012
* @namespace Ext.core.finance.ux.fixedAsset
* @class     Ext.core.finance.ux.fixedAsset.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.core.finance.ux.fixedAsset.Grid = function (config) {
    Ext.core.finance.ux.fixedAsset.Grid.superclass.constructor.call(this, Ext.apply({
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
Ext.extend(Ext.core.finance.ux.fixedAsset.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ searchParam: '' }) };
        this.tbar = [{
            xtype: 'button',
            text: 'Search',
            id: 'searchFixedAsset',
            iconCls: 'icon-filter',
            handler: function () {
                new Ext.core.finance.ux.fixedAsset.Window().show();
            }
        }];
        this.bbar = new Ext.PagingToolbar({
            id: 'fixedAsset-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.core.finance.ux.fixedAsset.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getStore().load({
            params: { start: 0, limit: this.pageSize }
        });
        Ext.core.finance.ux.fixedAsset.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('fixedAsset-grid', Ext.core.finance.ux.fixedAsset.Grid);

/**
* @desc      FixedAsset panel
* @author    Wondwosen Desalegn
* @copyright (c) 2012, Cybersoft
* @date      April 24, 2012
* @namespace Ext.core.finance.ux.fixedAsset
* @class     Ext.core.finance.ux.fixedAsset.Panel
* @extends   Ext.Panel
*/
Ext.core.finance.ux.fixedAsset.Panel = function (config) {
    Ext.core.finance.ux.fixedAsset.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false
    }, config));
};
Ext.extend(Ext.core.finance.ux.fixedAsset.Panel, Ext.Panel, {
    initComponent: function () {
        this.form = new Ext.core.finance.ux.fixedAsset.Form();
        this.grid = new Ext.core.finance.ux.fixedAsset.Grid();
        this.items = [{
            layout: 'border',
            border: false,
            items: [{
                region: 'west',
                border: true,
                collapsible: true,
                split: true,
                width: 400,
                minSize: 300,
                maxSize: 600,
                layout: 'fit',
                margins: '0 3 0 0',
                items: [this.form]
            }, {
                region: 'center',
                border: false,
                layout: 'fit',
                items: [this.grid]
            }]
        }];
        Ext.core.finance.ux.fixedAsset.Panel.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('FixedAsset-panel', Ext.core.finance.ux.fixedAsset.Panel);