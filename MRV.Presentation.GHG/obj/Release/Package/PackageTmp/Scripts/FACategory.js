Ext.ns('Ext.core.finance.ux.faCategory');
/**
* @desc      Asset Categories registration form
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.faCategory
* @class     Ext.core.finance.ux.faCategory.Form
* @extends   Ext.form.FormPanel
*/
Ext.core.finance.ux.faCategory.Form = function (config) {
    Ext.core.finance.ux.faCategory.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: FixedAssetCategory.Get,
            submit: FixedAssetCategory.Save
        },
        paramOrder: ['Id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'faCategory-form',
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
            name: 'Code',
            xtype: 'textfield',
            fieldLabel: 'Code',
            allowBlank: false
        }, {
           name: 'Description',
            xtype: 'textfield',
            fieldLabel: 'Description',            
            allowBlank: false
        }, {
            name: 'ControlAccountId',
            xtype: 'combo',
            fieldLabel: 'Control Account',
            typeAhead: true,
            hideTrigger: true,
            minChars: 1,
            allowBlank: false,
            listWidth: 280,
            mode: 'remote',
            tpl: '<tpl for="."><div ext:qtip="{Id}. {Name}" class="x-combo-list-item">' +
                '<h3><span>{Account}</span></h3> {Name}</div></tpl>',
            store: new Ext.data.DirectStore({
                reader: new Ext.data.JsonReader({
                    successProperty: 'success',
                    idProperty: 'Id',
                    totalProperty: 'total',
                    root: 'data',
                    fields: ['Id', 'Account', 'Name']
                }),                
                api: { read: Tsa.GetControlAccounts }
            }),
            displayField: 'Account',
            pageSize: 10
        }, {
            name: 'AccumulatedDepreciationAccountId',
            xtype: 'combo',
            fieldLabel: 'Accumulated Depreciation Account',
            typeAhead: true,
            hideTrigger: true,
            minChars: 1,
            allowBlank: false,
            listWidth: 280,
            mode: 'remote',
            tpl: '<tpl for="."><div ext:qtip="{Id}. {Name}" class="x-combo-list-item">' +
                '<h3><span>{Account}</span></h3> {Name}</div></tpl>',
            store: new Ext.data.DirectStore({
                reader: new Ext.data.JsonReader({
                    successProperty: 'success',
                    idProperty: 'Id',
                    totalProperty: 'total',
                    root: 'data',
                    fields: ['Id', 'Account', 'Name']
                }),
                api: { read: Tsa.GetControlAccounts }
            }),
            displayField: 'Account',
            pageSize: 10
        },  {
            name: 'DepreciationExpenseAccountId',
            xtype: 'combo',
            fieldLabel: 'Depreciation Expense Account',
            typeAhead: true,
            hideTrigger: true,
            allowBlank: false,
            minChars: 1,
            listWidth: 280,
            mode: 'remote',
            tpl: '<tpl for="."><div ext:qtip="{Id}. {Name}" class="x-combo-list-item">' +
                '<h3><span>{Account}</span></h3> {Name}</div></tpl>',
            store: new Ext.data.DirectStore({
                reader: new Ext.data.JsonReader({
                    successProperty: 'success',
                    idProperty: 'Id',
                    totalProperty: 'total',
                    root: 'data',
                    fields: ['Id', 'Account', 'Name']
                }),
                api: { read: Tsa.GetControlAccounts }
            }),
            displayField: 'Account',
            pageSize: 10
        }, {
            name: 'UsesSameRate',
            xtype: 'checkbox',
            fieldLabel: 'UsesSameRate'           
            
        }, {
            name: 'YearOneDepreciationRate',
            xtype: 'numberfield',
            fieldLabel: 'Year One Depreciation Rate',            
            allowBlank: false
        }, {
            name: 'RemainingYearDepreciationRate',
            xtype: 'numberfield',
            fieldLabel: 'Remaining Year Depreciation Rate',            
            allowBlank: false
        }]
    }, config));
}
Ext.extend(Ext.core.finance.ux.faCategory.Form, Ext.form.FormPanel);
Ext.reg('faCategory-form', Ext.core.finance.ux.faCategory.Form);

/**
* @desc      Asset Categories registration form host window
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.faCategory
* @class     Ext.core.finance.ux.faCategory.Window
* @extends   Ext.Window
*/
Ext.core.finance.ux.faCategory.Window = function (config) {
    Ext.core.finance.ux.faCategory.Window.superclass.constructor.call(this, Ext.apply({
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
                this.form.getForm().findField('Id').setValue(this.payrollRegionsId);
                if (this.payrollRegionsId != '') {
                    this.form.load({ params: { Id: this.payrollRegionsId} });
                }
            },
            scope: this
        }
    }, config));
}
Ext.extend(Ext.core.finance.ux.faCategory.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.core.finance.ux.faCategory.Form();
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

        Ext.core.finance.ux.faCategory.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {

        if (!this.form.getForm().isValid()) return;
        this.form.getForm().submit({
            waitMsg: 'Please wait...',
            success: function () {
                Ext.getCmp('faCategory-form').getForm().reset();
                Ext.getCmp('faCategory-paging').doRefresh();
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
Ext.reg('faCategory-window', Ext.core.finance.ux.faCategory.Window);

/**
* @desc      Asset Categories grid
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.faCategory
* @class     Ext.core.finance.ux.faCategory.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.core.finance.ux.faCategory.Grid = function (config) {
    Ext.core.finance.ux.faCategory.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: FixedAssetCategory.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Code',
                direction: 'ASC'
            },
            fields: ['Id', 'Description', 'YearOneDepreciationRate', 'RemainingYearDepreciationRate'],
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
        id: 'faCategory-grid',
        searchCriteria: {},
        pageSize: 38,
        title: 'Asset Categories List',
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
                var form = Ext.getCmp('faCategory-form');
                if (id != null) {
                  
                }
            },
            scope: this,
            rowdblclick: function () {
                if (!this.getSelectionModel().hasSelection()) return;
                var id = this.getSelectionModel().getSelected().get('Id');

                if (id != null) {
                    var hasEditPermission = Ext.core.finance.ux.Reception.getPermission('Asset Categories', 'CanEdit');
                    if (hasEditPermission) {
                        new Ext.core.finance.ux.faCategory.Window({
                            payrollRegionsId: id,
                            title: 'Edit Asset Categories'
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
             dataIndex: 'Description',
             header: 'Description',
             sortable: true,
             width: 55,
             menuDisabled: true
         },{
             dataIndex: 'YearOneDepreciationRate',
             header: 'YearOneDepreciationRate',
             sortable: true,
             width: 55,
             menuDisabled: true
         }, {
             dataIndex: 'RemainingYearDepreciationRate',
             header: 'RemainingYearDepreciationRate',
             sortable: true,
             width: 55,
             menuDisabled: true
         }]
    }, config));
};
Ext.extend(Ext.core.finance.ux.faCategory.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ mode: 'get' }) };
        this.tbar = [];
        this.bbar = new Ext.PagingToolbar({
            id: 'faCategory-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.core.finance.ux.faCategory.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getStore().load({
            params: { start: 0, limit: this.pageSize }
        });
        Ext.core.finance.ux.faCategory.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('faCategory-grid', Ext.core.finance.ux.faCategory.Grid);

/**
* @desc      Asset Categories panel
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @version   $Id: faCategory.js, 0.1
* @namespace Ext.core.finance.ux.faCategory
* @class     Ext.core.finance.ux.faCategory.Panel
* @extends   Ext.Panel
*/
Ext.core.finance.ux.faCategory.Panel = function (config) {
    Ext.core.finance.ux.faCategory.Panel.superclass.constructor.call(this, Ext.apply({
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
                disabled: !Ext.core.finance.ux.Reception.getPermission('Asset Categories', 'CanAdd')
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Edit',
                id: 'editpayrollRegions',
                iconCls: 'icon-edit',
                handler: this.onEditClick,
                disabled: !Ext.core.finance.ux.Reception.getPermission('Asset Categories', 'CanEdit')
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Delete',
                id: 'deletepayrollRegions',
                iconCls: 'icon-delete',
                handler: this.onDeleteClick,
                disabled: !Ext.core.finance.ux.Reception.getPermission('Asset Categories', 'CanDelete')
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
Ext.extend(Ext.core.finance.ux.faCategory.Panel, Ext.Panel, {
    initComponent: function () {
        this.items = [{
            xtype: 'faCategory-grid',
            id: 'faCategory-grid'
        }];
        Ext.core.finance.ux.faCategory.Panel.superclass.initComponent.apply(this, arguments);
    },

    onAddClick: function () {
        new Ext.core.finance.ux.faCategory.Window({
            payrollRegionsId: 0,
            title: 'Add Asset Categories'
        }).show();
    },
    onEditClick: function () {
        var grid = Ext.getCmp('faCategory-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');
        new Ext.core.finance.ux.faCategory.Window({
            payrollRegionsId: id,
            title: 'Edit Asset Categories'
        }).show();
    },
    onDeleteClick: function () {
        var grid = Ext.getCmp('faCategory-grid');
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
                    FixedAssetCategory.Delete(id, function (result, response) {
                        Ext.getCmp('faCategory-paging').doRefresh();
                    }, this);
                }
            }
        });
    },
    onRegionsPrintClick: function () {
        var grid = Ext.getCmp('faCategory-grid');
        Ext.ux.GridPrinter.stylesheetPath = '/Content/css/print.css';
        Ext.ux.GridPrinter.print(grid);
    }
});
Ext.reg('faCategory-panel', Ext.core.finance.ux.faCategory.Panel);