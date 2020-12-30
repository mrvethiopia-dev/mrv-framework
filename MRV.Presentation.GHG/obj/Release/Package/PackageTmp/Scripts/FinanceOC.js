Ext.ns('Ext.core.finance.ux.FinanceOC');
/**
* @desc      Outside Companies registration form
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.FinanceOC
* @class     Ext.core.finance.ux.FinanceOC.Form
* @extends   Ext.form.FormPanel
*/
Ext.core.finance.ux.FinanceOC.Form = function (config) {
    Ext.core.finance.ux.FinanceOC.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: FinanceOC.Get,
            submit: FinanceOC.Save
        },
        paramOrder: ['Id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'FinanceOC-form',
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
            fieldLabel: 'Consultant Code',
            anchor: '75%',
            allowBlank: false
        },{
            name: 'Name',
            xtype: 'textfield',
            fieldLabel: 'Consultant Name',
            anchor: '95%',
            allowBlank: false
        }]
    }, config));
}
Ext.extend(Ext.core.finance.ux.FinanceOC.Form, Ext.form.FormPanel);
Ext.reg('FinanceOC-form', Ext.core.finance.ux.FinanceOC.Form);

/**
* @desc      Outside Companies registration form host window
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.FinanceOC
* @class     Ext.core.finance.ux.FinanceOC.Window
* @extends   Ext.Window
*/
Ext.core.finance.ux.FinanceOC.Window = function (config) {
    Ext.core.finance.ux.FinanceOC.Window.superclass.constructor.call(this, Ext.apply({
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
Ext.extend(Ext.core.finance.ux.FinanceOC.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.core.finance.ux.FinanceOC.Form();
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

        Ext.core.finance.ux.FinanceOC.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {

        if (!this.form.getForm().isValid()) return;
        this.form.getForm().submit({
            waitMsg: 'Please wait...',
            success: function () {
                Ext.getCmp('FinanceOC-form').getForm().reset();
                Ext.getCmp('FinanceOC-paging').doRefresh();
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
Ext.reg('FinanceOC-window', Ext.core.finance.ux.FinanceOC.Window);

/**
* @desc      Outside Companies grid
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.FinanceOC
* @class     Ext.core.finance.ux.FinanceOC.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.core.finance.ux.FinanceOC.Grid = function (config) {
    Ext.core.finance.ux.FinanceOC.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: FinanceOC.GetAll,
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
        id: 'FinanceOC-grid',
        searchCriteria: {},
        pageSize: 38,
        title: 'Outside Companies List',
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
                var form = Ext.getCmp('FinanceOC-form');
                if (id != null) {
                  
                }
            },
            scope: this,
            rowdblclick: function () {
                if (!this.getSelectionModel().hasSelection()) return;
                var id = this.getSelectionModel().getSelected().get('Id');

                if (id != null) {
                    var hasEditPermission = Ext.core.finance.ux.Reception.getPermission('Outside Companies', 'CanEdit');
                    if (hasEditPermission) {
                        new Ext.core.finance.ux.FinanceOC.Window({
                            payrollWoredasId: id,
                            title: 'Edit Outside Companies'
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
             header: 'OC Name',
             sortable: true,
             width: 55,
             menuDisabled: true
         }, {
             dataIndex: 'Code',
             header: 'OC Code',
             sortable: true,
             width: 55,
             menuDisabled: true
         }]
    }, config));
};
Ext.extend(Ext.core.finance.ux.FinanceOC.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ mode: 'get' }) };
        this.tbar = [];
        this.bbar = new Ext.PagingToolbar({
            id: 'FinanceOC-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.core.finance.ux.FinanceOC.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getStore().load({
            params: { start: 0, limit: this.pageSize }
        });
        Ext.core.finance.ux.FinanceOC.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('FinanceOC-grid', Ext.core.finance.ux.FinanceOC.Grid);

/**
* @desc      Outside Companies panel
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @version   $Id: FinanceOC.js, 0.1
* @namespace Ext.core.finance.ux.FinanceOC
* @class     Ext.core.finance.ux.FinanceOC.Panel
* @extends   Ext.Panel
*/
Ext.core.finance.ux.FinanceOC.Panel = function (config) {
    Ext.core.finance.ux.FinanceOC.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false,
        tbar: {
            xtype: 'toolbar',
            items: [{
                xtype: 'button',
                text: 'Add',
                id: 'addOC',
                iconCls: 'icon-add',
                handler: this.onAddClick,
                disabled: !Ext.core.finance.ux.Reception.getPermission('Outside Companies', 'CanAdd')
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Edit',
                id: 'editOC',
                iconCls: 'icon-edit',
                handler: this.onEditClick,
                disabled: !Ext.core.finance.ux.Reception.getPermission('Outside Companies', 'CanEdit')
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Delete',
                id: 'deleteOC',
                iconCls: 'icon-delete',
                handler: this.onDeleteClick,
                disabled: !Ext.core.finance.ux.Reception.getPermission('Outside Companies', 'CanDelete')
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Print List',
                id: 'printOCs',
                iconCls: 'icon-Print',
                handler: this.onOCsPrintClick

            }]
        }
    }, config));
}
Ext.extend(Ext.core.finance.ux.FinanceOC.Panel, Ext.Panel, {
    initComponent: function () {
        this.items = [{
            xtype: 'FinanceOC-grid',
            id: 'FinanceOC-grid'
        }];
        Ext.core.finance.ux.FinanceOC.Panel.superclass.initComponent.apply(this, arguments);
    },

    onAddClick: function () {
        new Ext.core.finance.ux.FinanceOC.Window({
            payrollWoredasId: 0,
            title: 'Add Outside Companies'
        }).show();
    },
    onEditClick: function () {
        var grid = Ext.getCmp('FinanceOC-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');
        new Ext.core.finance.ux.FinanceOC.Window({
            payrollWoredasId: id,
            title: 'Edit Outside Companies'
        }).show();
    },
    onDeleteClick: function () {
        var grid = Ext.getCmp('FinanceOC-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        Ext.MessageBox.show({
            title: 'Delete',
            msg: 'Are you sure you want to delete the selected Consultant?',
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
                    FinanceOC.Delete(id, function (result, response) {
                        Ext.getCmp('FinanceOC-paging').doRefresh();
                    }, this);
                }
            }
        });
    },
    onOCsPrintClick: function () {
        var grid = Ext.getCmp('FinanceOC-grid');
        Ext.ux.GridPrinter.stylesheetPath = '/Content/css/print.css';
        Ext.ux.GridPrinter.print(grid);
    }
});
Ext.reg('FinanceOC-panel', Ext.core.finance.ux.FinanceOC.Panel);