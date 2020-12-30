Ext.ns('Ext.core.finance.ux.FinanceIC');
/**
* @desc      Woredas registration form
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.FinanceIC
* @class     Ext.core.finance.ux.FinanceIC.Form
* @extends   Ext.form.FormPanel
*/
Ext.core.finance.ux.FinanceIC.Form = function (config) {
    Ext.core.finance.ux.FinanceIC.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: FinanceIC.Get,
            submit: FinanceIC.Save
        },
        paramOrder: ['Id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'FinanceIC-form',
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
            name: 'IdentityNo',
            xtype: 'textfield',
            fieldLabel: 'Consultant Code',
            anchor: '75%',
            allowBlank: false,
            maskRe: /[a-zA-Z0-9]+/
        }, {
            name: 'FirstName',
            xtype: 'textfield',
            fieldLabel: 'Consultant Full Name',
            anchor: '95%',
            allowBlank: false
        }]
    }, config));
}
Ext.extend(Ext.core.finance.ux.FinanceIC.Form, Ext.form.FormPanel);
Ext.reg('FinanceIC-form', Ext.core.finance.ux.FinanceIC.Form);

/**
* @desc      Woredas registration form host window
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.FinanceIC
* @class     Ext.core.finance.ux.FinanceIC.Window
* @extends   Ext.Window
*/
Ext.core.finance.ux.FinanceIC.Window = function (config) {
    Ext.core.finance.ux.FinanceIC.Window.superclass.constructor.call(this, Ext.apply({
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
Ext.extend(Ext.core.finance.ux.FinanceIC.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.core.finance.ux.FinanceIC.Form();
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

        Ext.core.finance.ux.FinanceIC.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {

        if (!this.form.getForm().isValid()) return;
        this.form.getForm().submit({
            waitMsg: 'Please wait...',
            success: function () {
                Ext.getCmp('FinanceIC-form').getForm().reset();
                Ext.getCmp('FinanceIC-paging').doRefresh();
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
Ext.reg('FinanceIC-window', Ext.core.finance.ux.FinanceIC.Window);

/**
* @desc      Woredas grid
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.FinanceIC
* @class     Ext.core.finance.ux.FinanceIC.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.core.finance.ux.FinanceIC.Grid = function (config) {
    Ext.core.finance.ux.FinanceIC.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: FinanceIC.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'IdentityNo',
                direction: 'ASC'
            },
            fields: ['Id', 'FirstName', 'IdentityNo'],
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
        id: 'FinanceIC-grid',
        searchCriteria: {},
        pageSize: 38,
        title: 'International Consultants List',
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
                var form = Ext.getCmp('FinanceIC-form');
                if (id != null) {

                }
            },
            scope: this,
            rowdblclick: function () {
                if (!this.getSelectionModel().hasSelection()) return;
                var id = this.getSelectionModel().getSelected().get('Id');

                if (id != null) {
                    var hasEditPermission = Ext.core.finance.ux.Reception.getPermission('International Consultants', 'CanEdit');
                    if (hasEditPermission) {
                        new Ext.core.finance.ux.FinanceIC.Window({
                            payrollWoredasId: id,
                            title: 'Edit IC'
                        }).show();
                    }
                }

            }
        },
        columns: [new Ext.erp.ux.grid.PagingRowNumberer(), {
            dataIndex: 'Id',
            header: 'Id',
            sortable: true,
            hidden: true,
            width: 55,
            menuDisabled: true
        },
         {
             dataIndex: 'FirstName',
             header: 'Consultant Name',
             sortable: true,
             width: 55,
             menuDisabled: false
         }, {
             dataIndex: 'IdentityNo',
             header: 'Consultant Code',
             sortable: true,
             width: 55,
             menuDisabled: true
         }]
    }, config));
};
Ext.extend(Ext.core.finance.ux.FinanceIC.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ mode: 'get' }) };
        this.tbar = [];
        this.bbar = new Ext.PagingToolbar({
            id: 'FinanceIC-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.core.finance.ux.FinanceIC.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getStore().load({
            params: { start: 0, limit: this.pageSize }
        });
        Ext.core.finance.ux.FinanceIC.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('FinanceIC-grid', Ext.core.finance.ux.FinanceIC.Grid);

/**
* @desc      Woredas panel
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @version   $Id: FinanceIC.js, 0.1
* @namespace Ext.core.finance.ux.FinanceIC
* @class     Ext.core.finance.ux.FinanceIC.Panel
* @extends   Ext.Panel
*/
Ext.core.finance.ux.FinanceIC.Panel = function (config) {
    Ext.core.finance.ux.FinanceIC.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false,
        tbar: {
            xtype: 'toolbar',
            items: [{
                xtype: 'button',
                text: 'Add',
                id: 'addIC',
                iconCls: 'icon-add',
                handler: this.onAddClick,
                disabled: !Ext.core.finance.ux.Reception.getPermission('International Consultants', 'CanAdd')
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Edit',
                id: 'editICs',
                iconCls: 'icon-edit',
                handler: this.onEditClick,
                disabled: !Ext.core.finance.ux.Reception.getPermission('International Consultants', 'CanEdit')
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Delete',
                id: 'deleteICs',
                iconCls: 'icon-delete',
                handler: this.onDeleteClick,
                disabled: true//!Ext.core.finance.ux.Reception.getPermission('International Consultants', 'CanDelete')
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Print List',
                id: 'printICs',
                iconCls: 'icon-Print',
                handler: this.onICPrintClick

            }]
        }
    }, config));
}
Ext.extend(Ext.core.finance.ux.FinanceIC.Panel, Ext.Panel, {
    initComponent: function () {
        this.items = [{
            xtype: 'FinanceIC-grid',
            id: 'FinanceIC-grid'
        }];
        Ext.core.finance.ux.FinanceIC.Panel.superclass.initComponent.apply(this, arguments);
    },

    onAddClick: function () {
        new Ext.core.finance.ux.FinanceIC.Window({
            payrollWoredasId: 0,
            title: 'Add IC'
        }).show();
    },
    onEditClick: function () {
        var grid = Ext.getCmp('FinanceIC-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');
        new Ext.core.finance.ux.FinanceIC.Window({
            payrollWoredasId: id,
            title: 'Edit IC'
        }).show();
    },
    onDeleteClick: function () {
        var grid = Ext.getCmp('FinanceIC-grid');
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
                    FinanceIC.Delete(id, function (result, response) {
                        Ext.getCmp('FinanceIC-paging').doRefresh();
                    }, this);
                }
            }
        });
    },
    onICPrintClick: function () {
        var grid = Ext.getCmp('FinanceIC-grid');
        Ext.ux.GridPrinter.stylesheetPath = '/Content/css/print.css';
        Ext.ux.GridPrinter.print(grid);
    }
});
Ext.reg('FinanceIC-panel', Ext.core.finance.ux.FinanceIC.Panel);