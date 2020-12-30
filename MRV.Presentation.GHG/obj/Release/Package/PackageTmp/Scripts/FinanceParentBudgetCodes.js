Ext.ns('Ext.core.finance.ux.FinanceParentBudgetCodes');
/**
* @desc      Budget Code Groups registration form
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.FinanceParentBudgetCodes
* @class     Ext.core.finance.ux.FinanceParentBudgetCodes.Form
* @extends   Ext.form.FormPanel
*/
Ext.core.finance.ux.FinanceParentBudgetCodes.Form = function (config) {
    Ext.core.finance.ux.FinanceParentBudgetCodes.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: FinanceParentBudgetCodes.Get,
            submit: FinanceParentBudgetCodes.Save
        },
        paramOrder: ['Id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'FinanceParentBudgetCodes-form',
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
Ext.extend(Ext.core.finance.ux.FinanceParentBudgetCodes.Form, Ext.form.FormPanel);
Ext.reg('FinanceParentBudgetCodes-form', Ext.core.finance.ux.FinanceParentBudgetCodes.Form);

/**
* @desc      Budget Code Groups registration form host window
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.FinanceParentBudgetCodes
* @class     Ext.core.finance.ux.FinanceParentBudgetCodes.Window
* @extends   Ext.Window
*/
Ext.core.finance.ux.FinanceParentBudgetCodes.Window = function (config) {
    Ext.core.finance.ux.FinanceParentBudgetCodes.Window.superclass.constructor.call(this, Ext.apply({
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
Ext.extend(Ext.core.finance.ux.FinanceParentBudgetCodes.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.core.finance.ux.FinanceParentBudgetCodes.Form();
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

        Ext.core.finance.ux.FinanceParentBudgetCodes.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {

        if (!this.form.getForm().isValid()) return;
        this.form.getForm().submit({
            waitMsg: 'Please wait...',
            success: function () {
                Ext.getCmp('FinanceParentBudgetCodes-form').getForm().reset();
                Ext.getCmp('FinanceParentBudgetCodes-paging').doRefresh();
            }
        });
    },
    onClose: function () {
        this.close();
    }
});
Ext.reg('FinanceParentBudgetCodes-window', Ext.core.finance.ux.FinanceParentBudgetCodes.Window);

/**
* @desc      Budget Code Groups grid
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.FinanceParentBudgetCodes
* @class     Ext.core.finance.ux.FinanceParentBudgetCodes.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.core.finance.ux.FinanceParentBudgetCodes.Grid = function (config) {
    Ext.core.finance.ux.FinanceParentBudgetCodes.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: FinanceParentBudgetCodes.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Code',
                direction: 'ASC'
            },
            fields: ['Id', 'Name', 'Code'],
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
        id: 'FinanceParentBudgetCodes-grid',
        searchCriteria: {},
        pageSize: 38,
        title: 'Parent Budget Codes List',
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
                var form = Ext.getCmp('FinanceParentBudgetCodes-form');
                if (id != null) {
                  
                }
            },
            scope: this,
            rowdblclick: function () {
                if (!this.getSelectionModel().hasSelection()) return;
                var id = this.getSelectionModel().getSelected().get('Id');

                if (id != null) {
                    var hasEditPermission = Ext.core.finance.ux.Reception.getPermission('Budget Code Groups', 'CanEdit');
                    if (hasEditPermission) {
                        new Ext.core.finance.ux.FinanceParentBudgetCodes.Window({
                            payrollWoredasId: id,
                            title: 'Edit Budget Code Groups'
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
         }]
    }, config));
};
Ext.extend(Ext.core.finance.ux.FinanceParentBudgetCodes.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ mode: 'get' }) };
        this.tbar = [];
        this.bbar = new Ext.PagingToolbar({
            id: 'FinanceParentBudgetCodes-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.core.finance.ux.FinanceParentBudgetCodes.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getStore().load({
            params: { start: 0, limit: this.pageSize }
        });
        Ext.core.finance.ux.FinanceParentBudgetCodes.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('FinanceParentBudgetCodes-grid', Ext.core.finance.ux.FinanceParentBudgetCodes.Grid);

/**
* @desc      Budget Code Groups panel
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @version   $Id: FinanceParentBudgetCodes.js, 0.1
* @namespace Ext.core.finance.ux.FinanceParentBudgetCodes
* @class     Ext.core.finance.ux.FinanceParentBudgetCodes.Panel
* @extends   Ext.Panel
*/
Ext.core.finance.ux.FinanceParentBudgetCodes.Panel = function (config) {
    Ext.core.finance.ux.FinanceParentBudgetCodes.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false,
        tbar: {
            xtype: 'toolbar',
            items: [{
                xtype: 'button',
                text: 'Add',
                id: 'addParentBudgetCodes',
                iconCls: 'icon-add',
                handler: this.onAddClick,
                disabled: !Ext.core.finance.ux.Reception.getPermission('Budget Code Groups', 'CanAdd')
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Edit',
                id: 'editParentBudgetCodes',
                iconCls: 'icon-edit',
                handler: this.onEditClick,
                disabled: !Ext.core.finance.ux.Reception.getPermission('Budget Code Groups', 'CanEdit')
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Delete',
                id: 'deleteParentBudgetCodes',
                iconCls: 'icon-delete',
                handler: this.onDeleteClick,
                disabled: !Ext.core.finance.ux.Reception.getPermission('Budget Code Groups', 'CanDelete')
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Print List',
                id: 'printParentBudgetCodes',
                iconCls: 'icon-Print',
                handler: this.onParentBudgetCodesPrintClick

            }]
        }
    }, config));
}
Ext.extend(Ext.core.finance.ux.FinanceParentBudgetCodes.Panel, Ext.Panel, {
    initComponent: function () {
        this.items = [{
            xtype: 'FinanceParentBudgetCodes-grid',
            id: 'FinanceParentBudgetCodes-grid'
        }];
        Ext.core.finance.ux.FinanceParentBudgetCodes.Panel.superclass.initComponent.apply(this, arguments);
    },

    onAddClick: function () {
        new Ext.core.finance.ux.FinanceParentBudgetCodes.Window({
            payrollWoredasId: 0,
            title: 'Add Budget Code Groups'
        }).show();
    },
    onEditClick: function () {
        var grid = Ext.getCmp('FinanceParentBudgetCodes-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');
        new Ext.core.finance.ux.FinanceParentBudgetCodes.Window({
            payrollWoredasId: id,
            title: 'Edit Budget Code Groups'
        }).show();
    },
    onDeleteClick: function () {
        var grid = Ext.getCmp('FinanceParentBudgetCodes-grid');
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
                    FinanceParentBudgetCodes.Delete(id, function (result, response) {
                        Ext.getCmp('-paging').doRefresh();
                    }, this);
                }
            }
        });
    },
    onParentBudgetCodesPrintClick: function () {
        var grid = Ext.getCmp('FinanceParentBudgetCodes-grid');
        Ext.ux.GridPrinter.stylesheetPath = '/Content/css/print.css';
        Ext.ux.GridPrinter.print(grid);
    }
});
Ext.reg('FinanceParentBudgetCodes-panel', Ext.core.finance.ux.FinanceParentBudgetCodes.Panel);