Ext.ns('Ext.core.finance.ux.EmployeePayrollItems');

/**
* @desc      EmployeePayrollItems form
* @author    Dawit Kiros
* @copyright (c) 2012, LIFT
* @date      April 24, 2012
* @namespace Ext.core.finance.ux.EmployeePayrollItems
* @class     Ext.core.finance.ux.EmployeePayrollItems.Form
* @extends   Ext.form.FormPanel
*/
Ext.core.finance.ux.EmployeePayrollItems.Form = function (config) {
    Ext.core.finance.ux.EmployeePayrollItems.Form.superclass.constructor.call(this, Ext.apply({
        defaults: {
            anchor: '95%',
            msgTarget: 'side',
            labelStyle: 'text-align:right;'
        },
        id: 'EmployeePayrollItems-form',
        padding: 5,
        labelWidth: 115,
        autoHeight: true,
        border: false,
        baseCls: 'x-plain',
        items: [{
            xtype: 'radio',
            name: 'startDateOption',
            inputValue: 'GRN',
            boxLabel: 'GRN Date:'
        }, {
            xtype: 'radio',
            name: 'startDateOption',
            inputValue: 'Assignment',
            boxLabel: 'Assignment Date:'
        }, {
            xtype: 'compositefield',
            defaults: {
                flex: 1
            },
            items: [{
                xtype: 'radio',
                name: 'startDateOption',
                inputValue: 'Other',
                boxLabel: 'Other',
                checked: true,
                listeners: {
                    check: function (cb, value) {
                        var form = Ext.getCmp('EmployeePayrollItems-form').getForm();
                        var dfStartDate = form.findField('StartDate');
                        if (value) dfStartDate.show();
                        else dfStartDate.hide();
                    }
                }
            }, {
                name: 'StartDate',
                xtype: 'datefield',
                altFormats: 'c',
                editable: true,
                value: new Date(),
                allowBlank: false
            }]
        }]
    }, config));
};
Ext.extend(Ext.core.finance.ux.EmployeePayrollItems.Form, Ext.form.FormPanel);
Ext.reg('EmployeePayrollItems-form', Ext.core.finance.ux.EmployeePayrollItems.Form);

/**
* @desc      FixedAsset search form
* @author    Dawit Kiros
* @copyright (c) 2012, LIFT
* @date      April 24, 2012
* @namespace Ext.core.finance.ux.EmployeePayrollItems
* @class     Ext.core.finance.ux.EmployeePayrollItems.SearchForm
* @extends   Ext.form.FormPanel
*/
Ext.core.finance.ux.EmployeePayrollItems.SearchForm = function (config) {
    Ext.core.finance.ux.EmployeePayrollItems.SearchForm.superclass.constructor.call(this, Ext.apply({
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'EmployeePayrollItemsSearch-form',
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
                        var form = Ext.getCmp('EmployeePayrollItemsSearch-form').getForm();
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
                    var form = Ext.getCmp('EmployeePayrollItemsSearch-form').getForm();
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
                api: { read: Ifms.GetFixedAssetCategory }
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
                api: { read: Ifms.GetSLAccount }
            }),
            valueField: 'Id',
            displayField: 'Name'
        }]
    }, config));
};
Ext.extend(Ext.core.finance.ux.EmployeePayrollItems.SearchForm, Ext.form.FormPanel);
Ext.reg('EmployeePayrollItemsSearch-form', Ext.core.finance.ux.EmployeePayrollItems.SearchForm);

/**
* @desc      EmployeePayrollItems form host window
* @author    Dawit Kiros
* @copyright (c) 2012, LIFT
* @date      April 24, 2012
* @namespace Ext.core.finance.ux.EmployeePayrollItems
* @class     Ext.core.finance.ux.EmployeePayrollItems.Window
* @extends   Ext.Window
*/
Ext.core.finance.ux.EmployeePayrollItems.Window = function (config) {
    Ext.core.finance.ux.EmployeePayrollItems.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        width: 500,
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;'
    }, config));
};
Ext.extend(Ext.core.finance.ux.EmployeePayrollItems.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.core.finance.ux.EmployeePayrollItems.Form();
        this.items = [this.form];
        this.title = 'Depreciation Calculation Setting';
        this.bbar = [{
            xtype: 'tbfill'
        }, {
            text: 'Calculate Depreciation',
            iconCls: 'icon-accept',
            scope: this,
            handler: this.onCalculateDepreciation
        }, {
            xtype: 'tbseparator'
        }, {
            text: 'Close',
            iconCls: 'icon-exit',
            handler: this.onClose,
            scope: this
        }];
        Ext.core.finance.ux.EmployeePayrollItems.Window.superclass.initComponent.call(this, arguments);
    },
    onCalculateDepreciation: function () {
        var form = Ext.getCmp('EmployeePayrollItems-form');
        var grid = Ext.getCmp('EmployeePayrollItems-grid');
        var window = this;
        if (!grid.getSelectionModel().hasSelection()) return;
        var selectedAssets = grid.getSelectionModel().getSelections();
        var assetIds = '';
        for (var i = 0; i < selectedAssets.length; i++) {
            if (i == selectedAssets.length - 1) {
                assetIds += selectedAssets[i].get('Id');
            }
            else {
                assetIds += selectedAssets[i].get('Id') + ';';
            }
        }
        var depCalculationOption = form.getForm().findField('startDateOption').getGroupValue();
        var dtStartDate = depCalculationOption == 'Other' ? form.getForm().findField('StartDate').getValue() : null;
        Ext.core.finance.ux.SystemMessageManager.wait(
            new Ext.core.finance.ux.SystemMessage({
                text: 'Please wait, calculating fixed asset depreciation...',
                type: Ext.core.finance.ux.SystemMessageManager.TYPE_WAIT
            })
        );
        FixedAssetDepreciation.CalculateDepreciation(assetIds, depCalculationOption, dtStartDate, function (result, response) {
            Ext.core.finance.ux.SystemMessageManager.hide();
            if (result.success) {
                Ext.MessageBox.alert('Success', result.data);
                window.close();
                Ext.getCmp('EmployeePayrollItems-paging').doRefresh();
            }
            else {
                Ext.MessageBox.alert('Error', result.data);
            }
        });
    },
    onClose: function () {
        this.close();
    }
});
Ext.reg('fixedAsset-window', Ext.core.finance.ux.EmployeePayrollItems.Window);

/**
* @desc      EmployeePayrollItemsSearch form host window
* @author    Dawit Kiros
* @copyright (c) 2012, LIFT
* @date      April 24, 2012
* @namespace Ext.core.finance.ux.EmployeePayrollItems
* @class     Ext.core.finance.ux.EmployeePayrollItems.SearchWindow
* @extends   Ext.Window
*/
Ext.core.finance.ux.EmployeePayrollItems.SearchWindow = function (config) {
    Ext.core.finance.ux.EmployeePayrollItems.SearchWindow.superclass.constructor.call(this, Ext.apply({
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
Ext.extend(Ext.core.finance.ux.EmployeePayrollItems.SearchWindow, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.core.finance.ux.EmployeePayrollItems.SearchForm();
        this.items = [this.form];
        var window = this;
        this.bbar = [{
            xtype: 'tbfill'
        }, {
            text: 'Select',
            iconCls: 'icon-select',
            handler: function () {
                var form = Ext.getCmp('EmployeePayrollItemsSearch-form').getForm();
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

                var EmployeePayrollItemsGrid = Ext.getCmp('EmployeePayrollItems-grid');
                EmployeePayrollItemsGrid.store.baseParams = { record: Ext.encode({ searchParam: searchParams }) };
                EmployeePayrollItemsGrid.store.load({ params: { start: 0, limit: EmployeePayrollItemsGrid.pageSize} });
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
        Ext.core.finance.ux.EmployeePayrollItems.SearchWindow.superclass.initComponent.call(this, arguments);
    }
});
Ext.reg('EmployeePayrollItemsSearch-window', Ext.core.finance.ux.EmployeePayrollItems.SearchWindow);

/**
* @desc      EmployeePayrollItems grid
* @author    Dawit Kiros
* @copyright (c) 2012, LIFT
* @date      April 24, 2012
* @namespace Ext.core.finance.ux.EmployeePayrollItems
* @class     Ext.core.finance.ux.EmployeePayrollItems.Grid
* @extends   Ext.grid.GridPanel
*/
var EmpPItemsSelModel = new Ext.grid.CheckboxSelectionModel();

Ext.core.finance.ux.EmployeePayrollItems.Grid = function (config) {
    Ext.core.finance.ux.EmployeePayrollItems.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: FixedAssetDepreciation.GetAllFixedAsset,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Code',
                direction: 'ASC'
            },
            fields: ['Id', 'Category', 'SLAccount', 'AccumulatedDepreciationAccount', 'DepreciationExpenseAccount', 'Description'],
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
        id: 'EmployeePayrollItems-grid',
        searchCriteria: {},
        pageSize: 10,
        height: 600,
        stripeRows: true,
        border: false,
        sm: EmpPItemsSelModel,
        columns: [
        new Ext.erp.ux.grid.PagingRowNumberer(),
        EmpPItemsSelModel,
        {
            dataIndex: 'Id',
            header: 'Id',
            sortable: true,
            hidden: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'Category',
            header: 'Category',
            sortable: true,
            width: 300,
            menuDisabled: true
        }, {
            dataIndex: 'SLAccount',
            header: 'SL Account',
            sortable: true,
            width: 300,
            menuDisabled: true
        }, {
            dataIndex: 'AccumulatedDepreciationAccount',
            header: 'Accumulated Depreciation Acc.',
            sortable: true,
            width: 300,
            menuDisabled: true
        }, {
            dataIndex: 'DepreciationExpenseAccount',
            header: 'Depreciation Expense Acc.',
            sortable: true,
            width: 300,
            menuDisabled: true
        }, {
            dataIndex: 'Description',
            header: 'Description',
            sortable: true,
            width: 300,
            menuDisabled: true
        }]
    }, config));
};
Ext.extend(Ext.core.finance.ux.EmployeePayrollItems.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ searchParam: '' }) };
        this.tbar = [{
            xtype: 'button',
            text: 'Search',
            id: 'searchFixedAsset',
            iconCls: 'icon-filter',
            handler: function () {
                new Ext.core.finance.ux.EmployeePayrollItems.SearchWindow().show();
            }
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Calculate Depreciation',
            id: 'calculateDepreciation',
            iconCls: 'icon-accept',
            handler: function () {
                var grid = Ext.getCmp('EmployeePayrollItems-grid');
                if (!grid.getSelectionModel().hasSelection()) {
                    Ext.MessageBox.alert('Error', 'Select at least one asset for Fixed Asset Depreciation Calculation.');
                    return;
                }
                new Ext.core.finance.ux.EmployeePayrollItems.Window().show();
            }
        }];
        this.bbar = new Ext.PagingToolbar({
            id: 'EmployeePayrollItems-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.core.finance.ux.EmployeePayrollItems.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getStore().load({
            params: { start: 0, limit: this.pageSize }
        });
        Ext.core.finance.ux.EmployeePayrollItems.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('EmployeePayrollItems-grid', Ext.core.finance.ux.EmployeePayrollItems.Grid);

/**
* @desc      EmployeePayrollItems panel
* @author    Dawit Kiros
* @copyright (c) 2012, LIFT
* @date      April 24, 2012
* @namespace Ext.core.finance.ux.EmployeePayrollItems
* @class     Ext.core.finance.ux.EmployeePayrollItems.Panel
* @extends   Ext.Panel
*/
Ext.core.finance.ux.EmployeePayrollItems.Panel = function (config) {
    Ext.core.finance.ux.EmployeePayrollItems.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false
    }, config));
};
Ext.extend(Ext.core.finance.ux.EmployeePayrollItems.Panel, Ext.Panel, {
    initComponent: function () {
        this.grid = new Ext.core.finance.ux.EmployeePayrollItems.Grid();
        this.items = [{
            layout: 'border',
            border: false,
            items: [{
                region: 'center',
                border: false,
                layout: 'fit',
                items: [this.grid]
            }]
        }];
        Ext.core.finance.ux.EmployeePayrollItems.Panel.superclass.initComponent.apply(this, arguments);
    }
});


/**
* @desc      EmployeePayrollItems grid
* @author    Dawit Kiros
* @copyright (c) 2012, LIFT
* @date      June 01, 2013
* @namespace Ext.core.finance.ux.EmployeePayrollItems
* @class     Ext.core.finance.ux.EmployeePayrollItems.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.core.finance.ux.EmployeePayrollItems.Grid = function (config) {
    Ext.core.finance.ux.EmployeePayrollItems.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: PayrollItems.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Code',
                direction: 'ASC'
            },
            fields: ['Id', 'PItemAccountID', 'PItemName', 'PItemIsAddition', 'PItemIsTaxed', 'PItemIsFixedAmount', 'PItemInitialTaxableAmount', 'PItemAmount', 'PItemApplicableFrom', 'ApplicableTo'],
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
        id: 'EmployeePayrollItems-grid',
        searchCriteria: {},
        pageSize: 10,
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
                var form = Ext.getCmp('EmployeePayrollItems-form');
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
        }, {
            dataIndex: 'PItemAccountID',
            header: 'PItemAccountID',
            sortable: true,
            width: 220,
            menuDisabled: false
        }, {
            dataIndex: 'PItemName',
            header: 'PItemName',
            sortable: true,
            width: 200,
            menuDisabled: true
        }, {
            dataIndex: 'PItemIsAddition',
            header: 'PItemIsAddition',
            sortable: true,
            width: 200,
            menuDisabled: true
        }, {
            dataIndex: 'PItemIsTaxed',
            header: 'PItemIsTaxed',
            sortable: true,
            width: 220,
            menuDisabled: true
        }, {
            dataIndex: 'PItemIsFixedAmount',
            header: 'PItemIsFixedAmount',
            sortable: true,
            width: 220,
            menuDisabled: true
        }, {
            dataIndex: 'PItemInitialTaxableAmount',
            header: 'PItemInitialTaxableAmount',
            sortable: true,
            width: 220,
            menuDisabled: true
        }, {
            dataIndex: 'PItemAmount',
            header: 'PItemAmount',
            sortable: true,
            width: 220,
            menuDisabled: true
        }, {
            dataIndex: 'PItemApplicableFrom',
            header: 'PItemApplicableFrom',
            sortable: true,
            width: 250,
            menuDisabled: true
        }, {
            dataIndex: 'PItemApplicableTo',
            header: 'PItemApplicableTo',
            sortable: true,
            width: 250,
            menuDisabled: true
        }]
    }, config));
};
Ext.extend(Ext.core.finance.ux.EmployeePayrollItems.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ mode: 'get' }) };
        this.tbar = [];
        this.bbar = new Ext.PagingToolbar({
            id: 'EmployeePayrollItems-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.core.finance.ux.EmployeePayrollItems.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getStore().load({
            params: { start: 0, limit: this.pageSize }
        });
        Ext.core.finance.ux.EmployeePayrollItems.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('EmployeePayrollItems-grid', Ext.core.finance.ux.EmployeePayrollItems.Grid);

/**
* @desc      EmployeePayrollItems panel
* @author    Dawit Kiros
* @copyright (c) 2012, LIFT
* @date      June 01, 2013
* @namespace Ext.core.finance.ux.EmployeePayrollItems
* @class     Ext.core.finance.ux.EmployeePayrollItems.Panel
* @extends   Ext.Panel
*/
Ext.core.finance.ux.EmployeePayrollItems.Panel = function (config) {
    Ext.core.finance.ux.EmployeePayrollItems.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false,
        tbar: {
            xtype: 'toolbar',
            items: [{
                xtype: 'button',
                text: 'Save',
                id: 'savePayrollItems',
                iconCls: 'icon-save',
                handler: function () {
                    form = Ext.getCmp('EmployeePayrollItems-form').getForm();
                    if (!form.isValid()) return;
                    form.submit({
                        waitMsg: 'Please wait...',
                        success: function () {
                            form.reset();
                            Ext.getCmp('EmployeePayrollItems-paging').doRefresh();
                        }
                    });
                }
            }, {
                xtype: 'button',
                text: 'Delete',
                id: 'deletePayrollItems',
                iconCls: 'icon-delete',
                handler: function () {
                    var grid = Ext.getCmp('EmployeePayrollItems-grid');
                    if (!grid.getSelectionModel().hasSelection()) return;
                    Ext.MessageBox.show({
                        title: 'Delete',
                        msg: 'Are you sure you want to delete the selected Fixed Asset Category',
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
                                EmployeePayrollItems.Delete(id, function (result, response) {
                                    Ext.getCmp('EmployeePayrollItems-form').getForm().reset();
                                    Ext.getCmp('EmployeePayrollItems-paging').doRefresh();
                                }, this);
                            }
                        }
                    });
                }
            }, {
                xtype: 'tbfill'
            }, {
                xtype: 'button',
                text: 'Cancel',
                id: 'resetPayrollItems',
                iconCls: 'icon-cancel',
                handler: function () {
                    Ext.getCmp('EmployeePayrollItems-form').getForm().reset();
                }
            }]
        }
    }, config));
};
Ext.extend(Ext.core.finance.ux.EmployeePayrollItems.Panel, Ext.Panel, {
    initComponent: function () {
        this.form = new Ext.core.finance.ux.EmployeePayrollItems.Form();
        this.grid = new Ext.core.finance.ux.EmployeePayrollItems.Grid();
        this.items = [{
            layout: 'border',
            border: false,
            items: [{
                region: 'center',
                border: false,
                layout: 'fit',
                items: [{
                    layout: 'vbox',
                    layoutConfig: {
                        type: 'hbox',
                        align: 'stretch',
                        pack: 'start'
                    },
                    defaults: {
                        flex: 1
                    },
                    items: [this.form, this.grid]
                }]
            }]
        }];
        Ext.core.finance.ux.EmployeePayrollItems.Panel.superclass.initComponent.apply(this, arguments);
    }
});

Ext.reg('EmployeePayrollItems-panel', Ext.core.finance.ux.EmployeePayrollItems.Panel);

