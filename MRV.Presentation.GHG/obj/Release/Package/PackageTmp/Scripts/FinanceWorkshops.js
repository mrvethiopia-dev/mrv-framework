﻿Ext.ns('Ext.core.finance.ux.FinanceWorkshops');
/**
* @desc      Workshops registration form
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.FinanceWorkshops
* @class     Ext.core.finance.ux.FinanceWorkshops.Form
* @extends   Ext.form.FormPanel
*/
Ext.core.finance.ux.FinanceWorkshops.Form = function (config) {
    Ext.core.finance.ux.FinanceWorkshops.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: FinanceWorkshops.Get,
            submit: FinanceWorkshops.Save
        },
        paramOrder: ['Id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'FinanceWorkshops-form',
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
            fieldLabel: 'Workshop Code',
            anchor: '75%',
            allowBlank: false
        },{
            name: 'Name',
            xtype: 'textfield',
            fieldLabel: 'Workshop Name',
            anchor: '95%',
            allowBlank: false
        }]
    }, config));
}
Ext.extend(Ext.core.finance.ux.FinanceWorkshops.Form, Ext.form.FormPanel);
Ext.reg('FinanceWorkshops-form', Ext.core.finance.ux.FinanceWorkshops.Form);

/**
* @desc      Workshops registration form host window
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.FinanceWorkshops
* @class     Ext.core.finance.ux.FinanceWorkshops.Window
* @extends   Ext.Window
*/
Ext.core.finance.ux.FinanceWorkshops.Window = function (config) {
    Ext.core.finance.ux.FinanceWorkshops.Window.superclass.constructor.call(this, Ext.apply({
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
Ext.extend(Ext.core.finance.ux.FinanceWorkshops.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.core.finance.ux.FinanceWorkshops.Form();
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

        Ext.core.finance.ux.FinanceWorkshops.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {

        if (!this.form.getForm().isValid()) return;
        this.form.getForm().submit({
            waitMsg: 'Please wait...',
            success: function () {
                Ext.getCmp('FinanceWorkshops-form').getForm().reset();
                Ext.getCmp('FinanceWorkshops-paging').doRefresh();
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
Ext.reg('FinanceWorkshops-window', Ext.core.finance.ux.FinanceWorkshops.Window);

/**
* @desc      Workshops grid
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.FinanceWorkshops
* @class     Ext.core.finance.ux.FinanceWorkshops.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.core.finance.ux.FinanceWorkshops.Grid = function (config) {
    Ext.core.finance.ux.FinanceWorkshops.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: FinanceWorkshops.GetAll,
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
        id: 'FinanceWorkshops-grid',
        searchCriteria: {},
        pageSize: 38,
        title: 'Workshops List',
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
                var form = Ext.getCmp('FinanceWorkshops-form');
                if (id != null) {
                  
                }
            },
            scope: this,
            rowdblclick: function () {
                if (!this.getSelectionModel().hasSelection()) return;
                var id = this.getSelectionModel().getSelected().get('Id');

                if (id != null) {
                    var hasEditPermission = Ext.core.finance.ux.Reception.getPermission('Workshops', 'CanEdit');
                    if (hasEditPermission) {
                        new Ext.core.finance.ux.FinanceWorkshops.Window({
                            payrollWoredasId: id,
                            title: 'Edit Workshops'
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
             header: 'Workshop Name',
             sortable: true,
             width: 55,
             menuDisabled: true
         }, {
             dataIndex: 'Code',
             header: 'Workshop Code',
             sortable: true,
             width: 55,
             menuDisabled: true
         }]
    }, config));
};
Ext.extend(Ext.core.finance.ux.FinanceWorkshops.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ mode: 'get' }) };
        this.tbar = [];
        this.bbar = new Ext.PagingToolbar({
            id: 'FinanceWorkshops-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.core.finance.ux.FinanceWorkshops.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getStore().load({
            params: { start: 0, limit: this.pageSize }
        });
        Ext.core.finance.ux.FinanceWorkshops.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('FinanceWorkshops-grid', Ext.core.finance.ux.FinanceWorkshops.Grid);

/**
* @desc      Workshops panel
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @version   $Id: FinanceWorkshops.js, 0.1
* @namespace Ext.core.finance.ux.FinanceWorkshops
* @class     Ext.core.finance.ux.FinanceWorkshops.Panel
* @extends   Ext.Panel
*/
Ext.core.finance.ux.FinanceWorkshops.Panel = function (config) {
    Ext.core.finance.ux.FinanceWorkshops.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false,
        tbar: {
            xtype: 'toolbar',
            items: [{
                xtype: 'button',
                text: 'Add',
                id: 'addWorkshops',
                iconCls: 'icon-add',
                handler: this.onAddClick,
                disabled: !Ext.core.finance.ux.Reception.getPermission('Workshops', 'CanAdd')
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Edit',
                id: 'editWorkshops',
                iconCls: 'icon-edit',
                handler: this.onEditClick,
                disabled: !Ext.core.finance.ux.Reception.getPermission('Workshops', 'CanEdit')
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Delete',
                id: 'deleteWorkshops',
                iconCls: 'icon-delete',
                handler: this.onDeleteClick,
                disabled: !Ext.core.finance.ux.Reception.getPermission('Workshops', 'CanDelete')
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Print List',
                id: 'printWorkshops',
                iconCls: 'icon-Print',
                handler: this.onWorkshopsPrintClick

            }]
        }
    }, config));
}
Ext.extend(Ext.core.finance.ux.FinanceWorkshops.Panel, Ext.Panel, {
    initComponent: function () {
        this.items = [{
            xtype: 'FinanceWorkshops-grid',
            id: 'FinanceWorkshops-grid'
        }];
        Ext.core.finance.ux.FinanceWorkshops.Panel.superclass.initComponent.apply(this, arguments);
    },

    onAddClick: function () {
        new Ext.core.finance.ux.FinanceWorkshops.Window({
            payrollWoredasId: 0,
            title: 'Add Workshops'
        }).show();
    },
    onEditClick: function () {
        var grid = Ext.getCmp('FinanceWorkshops-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');
        new Ext.core.finance.ux.FinanceWorkshops.Window({
            payrollWoredasId: id,
            title: 'Edit Workshops'
        }).show();
    },
    onDeleteClick: function () {
        var grid = Ext.getCmp('FinanceWorkshops-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        Ext.MessageBox.show({
            title: 'Delete',
            msg: 'Are you sure you want to delete the selected Workshop?',
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
                    FinanceWorkshops.Delete(id, function (result, response) {
                        Ext.getCmp('FinanceWorkshops-paging').doRefresh();
                    }, this);
                }
            }
        });
    },
    onWorkshopsPrintClick: function () {
        var grid = Ext.getCmp('FinanceWorkshops-grid');
        Ext.ux.GridPrinter.stylesheetPath = '/Content/css/print.css';
        Ext.ux.GridPrinter.print(grid);
    }
});
Ext.reg('FinanceWorkshops-panel', Ext.core.finance.ux.FinanceWorkshops.Panel);