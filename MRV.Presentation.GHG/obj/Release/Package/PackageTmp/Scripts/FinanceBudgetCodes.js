Ext.ns('Ext.core.finance.ux.FinanceBudgetCodes');
/**
* @desc      Budget Codes registration form
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.FinanceBudgetCodes
* @class     Ext.core.finance.ux.FinanceBudgetCodes.Form
* @extends   Ext.form.FormPanel
*/
Ext.core.finance.ux.FinanceBudgetCodes.Form = function (config) {
    Ext.core.finance.ux.FinanceBudgetCodes.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: FinanceBudgetCodes.Get,
            submit: FinanceBudgetCodes.Save
        },
        paramOrder: ['Id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'FinanceBudgetCodes-form',
        padding: 5,
        labelWidth: 150,
        autoHeight: true,
        border: false,
        baseCls: 'x-plain',
        items: [{
            name: 'Id',
            xtype: 'textfield',
           hidden: true
       },{
           hiddenName: 'ParentBudgetCodeId',
            xtype: 'combo',
            anchor: '100%',
            fieldLabel: 'Parent Code',
            triggerAction: 'all',
            mode: 'local',
            editable: true,
            typeAhead: true,
            forceSelection: true,
            emptyText: 'Select Parent',
            allowBlank: false,
            store: new Ext.data.DirectStore({
                reader: new Ext.data.JsonReader({
                    successProperty: 'success',
                    idProperty: 'Id',
                    root: 'data',
                    fields: ['Id', 'CodeAndName']
                }),
                autoLoad: true,
                api: { read: Tsa.GetParentBudgetCodes }
            }),
            valueField: 'Id', displayField: 'CodeAndName'
        }, {
            name: 'Code',
            xtype: 'textfield',
            fieldLabel: 'Budget Code',
            anchor: '75%',
            allowBlank: false
        },{
            name: 'Name',
            xtype: 'textfield',
            fieldLabel: 'Budget Name',
            anchor: '95%',
            allowBlank: false
        }]
    }, config));
}
Ext.extend(Ext.core.finance.ux.FinanceBudgetCodes.Form, Ext.form.FormPanel);
Ext.reg('FinanceBudgetCodes-form', Ext.core.finance.ux.FinanceBudgetCodes.Form);

/**
* @desc      Budget Codes registration form host window
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.FinanceBudgetCodes
* @class     Ext.core.finance.ux.FinanceBudgetCodes.Window
* @extends   Ext.Window
*/
Ext.core.finance.ux.FinanceBudgetCodes.Window = function (config) {
    Ext.core.finance.ux.FinanceBudgetCodes.Window.superclass.constructor.call(this, Ext.apply({
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
                this.form.getForm().findField('Id').setValue(this.payrollWoredasId);
                if (this.payrollWoredasId != '') {
                    this.form.load({ params: { Id: this.payrollWoredasId} });
                }
            },
            scope: this
        }
    }, config));
}
Ext.extend(Ext.core.finance.ux.FinanceBudgetCodes.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.core.finance.ux.FinanceBudgetCodes.Form();
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

        Ext.core.finance.ux.FinanceBudgetCodes.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {

        if (!this.form.getForm().isValid()) return;
        this.form.getForm().submit({
            waitMsg: 'Please wait...',
            success: function () {
                Ext.getCmp('FinanceBudgetCodes-form').getForm().reset();
                Ext.getCmp('FinanceBudgetCodes-paging').doRefresh();
            }
        });
    },
    onClose: function () {
        this.close();
    }
});
Ext.reg('FinanceBudgetCodes-window', Ext.core.finance.ux.FinanceBudgetCodes.Window);

/**
* @desc      Budget Codes grid
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.FinanceBudgetCodes
* @class     Ext.core.finance.ux.FinanceBudgetCodes.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.core.finance.ux.FinanceBudgetCodes.Grid = function (config) {
    Ext.core.finance.ux.FinanceBudgetCodes.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: FinanceBudgetCodes.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Code',
                direction: 'ASC'
            },
            fields: ['Id', 'Name', 'Code','ParentCode'],
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
        id: 'FinanceBudgetCodes-grid',
        searchCriteria: {},
        pageSize: 38,
        title: 'Budget Codes List',
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
                var form = Ext.getCmp('FinanceBudgetCodes-form');
                if (id != null) {
                  
                }
            },
            scope: this,
            rowdblclick: function () {
                if (!this.getSelectionModel().hasSelection()) return;
                var id = this.getSelectionModel().getSelected().get('Id');

                if (id != null) {
                    var hasEditPermission = Ext.core.finance.ux.Reception.getPermission('Budget Codes', 'CanEdit');
                    if (hasEditPermission) {
                        new Ext.core.finance.ux.FinanceBudgetCodes.Window({
                            payrollWoredasId: id,
                            title: 'Edit Budget Codes'
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
             header: 'Budget Name',
             sortable: true,
             width: 55,
             menuDisabled: true
         }, {
             dataIndex: 'Code',
             header: 'Budget Code',
             sortable: true,
             width: 55,
             menuDisabled: true
         }, {
             dataIndex: 'ParentCode',
             header: 'Parent Budget Code',
             sortable: true,
             width: 55,
             menuDisabled: true
         }]
    }, config));
};
Ext.extend(Ext.core.finance.ux.FinanceBudgetCodes.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ mode: 'get' }) };
        this.tbar = [];
        this.bbar = new Ext.PagingToolbar({
            id: 'FinanceBudgetCodes-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.core.finance.ux.FinanceBudgetCodes.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getStore().load({
            params: { start: 0, limit: this.pageSize }
        });
        Ext.core.finance.ux.FinanceBudgetCodes.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('FinanceBudgetCodes-grid', Ext.core.finance.ux.FinanceBudgetCodes.Grid);

/**
* @desc      Budget Codes panel
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @version   $Id: FinanceBudgetCodes.js, 0.1
* @namespace Ext.core.finance.ux.FinanceBudgetCodes
* @class     Ext.core.finance.ux.FinanceBudgetCodes.Panel
* @extends   Ext.Panel
*/
Ext.core.finance.ux.FinanceBudgetCodes.Panel = function (config) {
    Ext.core.finance.ux.FinanceBudgetCodes.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false,
        tbar: {
            xtype: 'toolbar',
            items: [{
                xtype: 'button',
                text: 'Add',
                id: 'addBudgetCodes',
                iconCls: 'icon-add',
                handler: this.onAddClick,
                disabled: !Ext.core.finance.ux.Reception.getPermission('Budget Codes', 'CanAdd')
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Edit',
                id: 'editBudgetCodes',
                iconCls: 'icon-edit',
                handler: this.onEditClick,
                disabled: !Ext.core.finance.ux.Reception.getPermission('Budget Codes', 'CanEdit')
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Delete',
                id: 'deleteBudgetCodes',
                iconCls: 'icon-delete',
                handler: this.onDeleteClick,
                disabled: !Ext.core.finance.ux.Reception.getPermission('Budget Codes', 'CanDelete')
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Print List',
                id: 'printBudgetCodes',
                iconCls: 'icon-Print',
                handler: this.onBudgetCodesPrintClick

            }]
        }
    }, config));
}
Ext.extend(Ext.core.finance.ux.FinanceBudgetCodes.Panel, Ext.Panel, {
    initComponent: function () {
        this.items = [{
            xtype: 'FinanceBudgetCodes-grid',
            id: 'FinanceBudgetCodes-grid'
        }];
        Ext.core.finance.ux.FinanceBudgetCodes.Panel.superclass.initComponent.apply(this, arguments);
    },

    onAddClick: function () {
        new Ext.core.finance.ux.FinanceBudgetCodes.Window({
            payrollWoredasId: 0,
            title: 'Add Budget Codes'
        }).show();
    },
    onEditClick: function () {
        var grid = Ext.getCmp('FinanceBudgetCodes-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');
        new Ext.core.finance.ux.FinanceBudgetCodes.Window({
            payrollWoredasId: id,
            title: 'Edit Budget Codes'
        }).show();
    },
    onDeleteClick: function () {
        var grid = Ext.getCmp('FinanceBudgetCodes-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        Ext.MessageBox.show({
            title: 'Delete',
            msg: 'Are you sure you want to delete the selected Budget?',
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
                    FinanceBudgetCodes.Delete(id, function (result, response) {
                        Ext.getCmp('-paging').doRefresh();
                    }, this);
                }
            }
        });
    },
    onBudgetCodesPrintClick: function () {
        var grid = Ext.getCmp('FinanceBudgetCodes-grid');
        Ext.ux.GridPrinter.stylesheetPath = '/Content/css/print.css';
        Ext.ux.GridPrinter.print(grid);
    }
});
Ext.reg('FinanceBudgetCodes-panel', Ext.core.finance.ux.FinanceBudgetCodes.Panel);