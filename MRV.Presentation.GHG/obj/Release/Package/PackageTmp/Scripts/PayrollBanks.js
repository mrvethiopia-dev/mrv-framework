Ext.ns('Ext.core.finance.ux.payrollBanks');
/**
* @desc      Banks registration form
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.payrollBanks
* @class     Ext.core.finance.ux.payrollBanks.Form
* @extends   Ext.form.FormPanel
*/
Ext.core.finance.ux.payrollBanks.Form = function (config) {
    Ext.core.finance.ux.payrollBanks.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: PayrollBanks.Get,
            submit: PayrollBanks.Save
        },
        paramOrder: ['Id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'payrollBanks-form',
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
            fieldLabel: 'Bank Name',
            anchor: '99%',            
            allowBlank: false
        }]
    }, config));
}
Ext.extend(Ext.core.finance.ux.payrollBanks.Form, Ext.form.FormPanel);
Ext.reg('payrollBanks-form', Ext.core.finance.ux.payrollBanks.Form);

/**
* @desc      Banks registration form host window
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.payrollBanks
* @class     Ext.core.finance.ux.payrollBanks.Window
* @extends   Ext.Window
*/
Ext.core.finance.ux.payrollBanks.Window = function (config) {
    Ext.core.finance.ux.payrollBanks.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        width: 500,
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;',
        listeners: {
            show: function () {
                this.form.getForm().findField('Id').setValue(this.payrollBanksId);
                if (this.payrollBanksId != '') {
                    this.form.load({ params: { Id: this.payrollBanksId} });
                }
            },
            scope: this
        }
    }, config));
}
Ext.extend(Ext.core.finance.ux.payrollBanks.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.core.finance.ux.payrollBanks.Form();
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

        Ext.core.finance.ux.payrollBanks.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {

        if (!this.form.getForm().isValid()) return;
        this.form.getForm().submit({
            waitMsg: 'Please wait...',
            success: function () {
                Ext.getCmp('payrollBanks-form').getForm().reset();
                Ext.getCmp('payrollBanks-paging').doRefresh();
            }
        });
    },
    onClose: function () {
        this.close();
    }
});
Ext.reg('payrollBanks-window', Ext.core.finance.ux.payrollBanks.Window);

/**
* @desc      Banks grid
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.payrollBanks
* @class     Ext.core.finance.ux.payrollBanks.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.core.finance.ux.payrollBanks.Grid = function (config) {
    Ext.core.finance.ux.payrollBanks.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: window.PayrollBanks.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Code',
                direction: 'ASC'
            },
            fields: ['Id', 'Name'],
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
        id: 'payrollBanks-grid',
        searchCriteria: {},
        pageSize: 35,
        title: 'Banks List',
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
                var form = Ext.getCmp('payrollBanks-form');
                if (id != null) {
                  
                }
            },
            scope: this,
            rowdblclick: function () {
                if (!this.getSelectionModel().hasSelection()) return;
                var id = this.getSelectionModel().getSelected().get('Id');

                if (id != null) {
                    var hasEditPermission = Ext.core.finance.ux.Reception.getPermission('Banks', 'CanEdit');
                    if (hasEditPermission) {
                        new Ext.core.finance.ux.payrollBanks.Window({
                            payrollBanksId: id,
                            title: 'Edit Banks'
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
             header: 'Bank Name',
             sortable: true,
             width: 55,
             menuDisabled: true
         }]
    }, config));
};
Ext.extend(Ext.core.finance.ux.payrollBanks.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ mode: 'get' }) };
        this.tbar = [];
        this.bbar = new Ext.PagingToolbar({
            id: 'payrollBanks-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.core.finance.ux.payrollBanks.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getStore().load({
            params: { start: 0, limit: this.pageSize }
        });
        Ext.core.finance.ux.payrollBanks.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('payrollBanks-grid', Ext.core.finance.ux.payrollBanks.Grid);

/**
* @desc      Banks panel
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @version   $Id: payrollBanks.js, 0.1
* @namespace Ext.core.finance.ux.payrollBanks
* @class     Ext.core.finance.ux.payrollBanks.Panel
* @extends   Ext.Panel
*/
Ext.core.finance.ux.payrollBanks.Panel = function (config) {
    Ext.core.finance.ux.payrollBanks.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false,
        tbar: {
            xtype: 'toolbar',
            items: [{
                xtype: 'button',
                text: 'Add',
                id: 'addpayrollBanks',
                iconCls: 'icon-add',
                handler: this.onAddClick,
                disabled: !Ext.core.finance.ux.Reception.getPermission('Banks', 'CanAdd')
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Edit',
                id: 'editpayrollBanks',
                iconCls: 'icon-edit',
                handler: this.onEditClick,
                disabled: !Ext.core.finance.ux.Reception.getPermission('Banks', 'CanEdit')
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Delete',
                id: 'deletepayrollBanks',
                iconCls: 'icon-delete',
                handler: this.onDeleteClick,
                disabled: !Ext.core.finance.ux.Reception.getPermission('Banks', 'CanDelete')
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Add Branches',
                id: 'addBranches',
                iconCls: 'icon-bank',
                handler: this.onAddBranchesClick
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Print List',
                id: 'printBanks',
                iconCls: 'icon-Print',
                handler: this.onBanksPrintClick

            }]
        }
    }, config));
}
Ext.extend(Ext.core.finance.ux.payrollBanks.Panel, Ext.Panel, {
    initComponent: function () {
        this.items = [{
            xtype: 'payrollBanks-grid',
            id: 'payrollBanks-grid'
        }];
        Ext.core.finance.ux.payrollBanks.Panel.superclass.initComponent.apply(this, arguments);
    },

    onAddClick: function () {
        new Ext.core.finance.ux.payrollBanks.Window({
            payrollBanksId: 0,
            title: 'Add Banks'
        }).show();
    },
    onEditClick: function () {
        var grid = Ext.getCmp('payrollBanks-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');
        new Ext.core.finance.ux.payrollBanks.Window({
            payrollBanksId: id,
            title: 'Edit Banks'
        }).show();
    },
    onDeleteClick: function () {
        var grid = Ext.getCmp('payrollBanks-grid');
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
                    PayrollBanks.Delete(id, function (result, response) {
                        Ext.getCmp('payrollBanks-paging').doRefresh();
                    }, this);
                }
            }
        });
    },
    onAddBranchesClick: function () {
       

        
        var grid = Ext.getCmp('payrollBanks-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');
        new Ext.core.finance.ux.payrollBankBranches.Window({
            payrollBanksId: id,
            title: 'Add Bank Branches'
        }).show();

        var gridBranches = Ext.getCmp('payrollBankBranches-grid');
        gridBranches.getStore().load({
            params: {

                start: 0,
                limit: 100,
                sort: '',
                dir: '',
                ParentId: id
            }
        });

    },
    onBanksPrintClick: function () {
        var grid = Ext.getCmp('payrollBanks-grid');
        Ext.ux.GridPrinter.stylesheetPath = '/Content/css/print.css';
        Ext.ux.GridPrinter.print(grid);
    }
});
Ext.reg('payrollBanks-panel', Ext.core.finance.ux.payrollBanks.Panel);