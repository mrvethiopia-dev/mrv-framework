Ext.ns('Ext.core.finance.ux.payrollDepartments');
/**
* @desc      Departments registration form
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.payrollDepartments
* @class     Ext.core.finance.ux.payrollDepartments.Form
* @extends   Ext.form.FormPanel
*/
Ext.core.finance.ux.payrollDepartments.Form = function (config) {
    Ext.core.finance.ux.payrollDepartments.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: PayrollDepartments.Get,
            submit: PayrollDepartments.Save
        },
        paramOrder: ['Id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'payrollDepartments-form',
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
            fieldLabel: 'Department Code',
            anchor: '75%',
            allowBlank: false
        },{
            name: 'Name',
            xtype: 'textfield',
            fieldLabel: 'Department Name',
            anchor: '95%',
            allowBlank: false
        }]
    }, config));
}
Ext.extend(Ext.core.finance.ux.payrollDepartments.Form, Ext.form.FormPanel);
Ext.reg('payrollDepartments-form', Ext.core.finance.ux.payrollDepartments.Form);

/**
* @desc      Departments registration form host window
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.payrollDepartments
* @class     Ext.core.finance.ux.payrollDepartments.Window
* @extends   Ext.Window
*/
Ext.core.finance.ux.payrollDepartments.Window = function (config) {
    Ext.core.finance.ux.payrollDepartments.Window.superclass.constructor.call(this, Ext.apply({
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
                this.form.getForm().findField('Id').setValue(this.payrollDepartmentsId);
                if (this.payrollDepartmentsId != '') {
                    this.form.load({ params: { Id: this.payrollDepartmentsId} });
                }
            },
            scope: this
        }
    }, config));
}
Ext.extend(Ext.core.finance.ux.payrollDepartments.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.core.finance.ux.payrollDepartments.Form();
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

        Ext.core.finance.ux.payrollDepartments.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {

        if (!this.form.getForm().isValid()) return;
        this.form.getForm().submit({
            waitMsg: 'Please wait...',
            success: function () {
                Ext.getCmp('payrollDepartments-form').getForm().reset();
                Ext.getCmp('payrollDepartments-paging').doRefresh();
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
Ext.reg('payrollDepartments-window', Ext.core.finance.ux.payrollDepartments.Window);

/**
* @desc      Departments grid
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.payrollDepartments
* @class     Ext.core.finance.ux.payrollDepartments.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.core.finance.ux.payrollDepartments.Grid = function (config) {
    Ext.core.finance.ux.payrollDepartments.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: PayrollDepartments.GetAll,
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
        id: 'payrollDepartments-grid',
        searchCriteria: {},
        pageSize: 38,
        title: 'Departments List',
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
            rowClick: function() {
                if (!this.getSelectionModel().hasSelection()) return;
                var id = this.getSelectionModel().getSelected().get('Id');
                var form = Ext.getCmp('payrollDepartments-form');
                if (id != null) {

                }
            },
            scope: this,
            rowdblclick: function() {
                if (!this.getSelectionModel().hasSelection()) return;
                var id = this.getSelectionModel().getSelected().get('Id');

                if (id != null) {
                    var hasEditPermission = Ext.core.finance.ux.Reception.getPermission('Departments', 'CanEdit');
                    if (hasEditPermission) {
                        new Ext.core.finance.ux.payrollDepartments.Window({
                            payrollDepartmentsId: id,
                            title: 'Edit Departments'
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
             header: 'Department Name',
             sortable: true,
             width: 55,
             menuDisabled: true
         }, {
             dataIndex: 'Code',
             header: 'Department Code',
             sortable: true,
             width: 55,
             menuDisabled: true
         }]
    }, config));
};
Ext.extend(Ext.core.finance.ux.payrollDepartments.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ mode: 'get' }) };
        this.tbar = [];
        this.bbar = new Ext.PagingToolbar({
            id: 'payrollDepartments-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.core.finance.ux.payrollDepartments.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getStore().load({
            params: { start: 0, limit: this.pageSize }
        });
        Ext.core.finance.ux.payrollDepartments.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('payrollDepartments-grid', Ext.core.finance.ux.payrollDepartments.Grid);

/**
* @desc      Departments panel
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @version   $Id: payrollDepartments.js, 0.1
* @namespace Ext.core.finance.ux.payrollDepartments
* @class     Ext.core.finance.ux.payrollDepartments.Panel
* @extends   Ext.Panel
*/
Ext.core.finance.ux.payrollDepartments.Panel = function (config) {
    Ext.core.finance.ux.payrollDepartments.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false,
        tbar: {
            xtype: 'toolbar',
            items: [{
                xtype: 'button',
                text: 'Add',
                id: 'addpayrollDepartments',
                iconCls: 'icon-add',
                handler: this.onAddClick,
                disabled: !Ext.core.finance.ux.Reception.getPermission('Departments', 'CanAdd')
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Edit',
                id: 'editpayrollDepartments',
                iconCls: 'icon-edit',
                handler: this.onEditClick,
                disabled: !Ext.core.finance.ux.Reception.getPermission('Departments', 'CanEdit')
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Delete',
                id: 'deletepayrollDepartments',
                iconCls: 'icon-delete',
                handler: this.onDeleteClick,
                disabled: !Ext.core.finance.ux.Reception.getPermission('Departments', 'CanDelete')
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Print List',
                id: 'printDepartments',
                iconCls: 'icon-Print',
                handler: this.onDepartmentsPrintClick

            }]
        }
    }, config));
}
Ext.extend(Ext.core.finance.ux.payrollDepartments.Panel, Ext.Panel, {
    initComponent: function () {
        this.items = [{
            xtype: 'payrollDepartments-grid',
            id: 'payrollDepartments-grid'
        }];
        Ext.core.finance.ux.payrollDepartments.Panel.superclass.initComponent.apply(this, arguments);
    },

    onAddClick: function () {
        new Ext.core.finance.ux.payrollDepartments.Window({
            payrollDepartmentsId: 0,
            title: 'Add Departments'
        }).show();
    },
    onEditClick: function () {
        var grid = Ext.getCmp('payrollDepartments-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');
        new Ext.core.finance.ux.payrollDepartments.Window({
            payrollDepartmentsId: id,
            title: 'Edit Departments'
        }).show();
    },
    onDeleteClick: function () {
        var grid = Ext.getCmp('payrollDepartments-grid');
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
                    PayrollDepartments.Delete(id, function (result, response) {
                        Ext.getCmp('payrollDepartments-paging').doRefresh();
                    }, this);
                }
            }
        });
    },
    onDepartmentsPrintClick: function () {
        var grid = Ext.getCmp('payrollDepartments-grid');
        Ext.ux.GridPrinter.stylesheetPath = '/Content/css/print.css';
        Ext.ux.GridPrinter.print(grid);
    }
});
Ext.reg('payrollDepartments-panel', Ext.core.finance.ux.payrollDepartments.Panel);