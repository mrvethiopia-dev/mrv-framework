Ext.ns('Ext.core.finance.ux.payrollWoredas');
/**
* @desc      Woredas registration form
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.payrollWoredas
* @class     Ext.core.finance.ux.payrollWoredas.Form
* @extends   Ext.form.FormPanel
*/
Ext.core.finance.ux.payrollWoredas.Form = function (config) {
    Ext.core.finance.ux.payrollWoredas.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: PayrollWoredas.Get,
            submit: PayrollWoredas.Save
        },
        paramOrder: ['Id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'payrollWoredas-form',
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
            fieldLabel: 'Woreda Code',
            anchor: '75%',
            allowBlank: false
        },{
            name: 'Name',
            xtype: 'textfield',
            fieldLabel: 'Woreda Name',
            anchor: '95%',
            allowBlank: false
        }, {
            hiddenName: 'RegionId',
            xtype: 'combo',
            anchor: '75%',
            fieldLabel: 'Region',
            triggerAction: 'all',
            mode: 'local',
            editable: true,
            typeAhead: true,
            forceSelection: true,
            emptyText: '---Select Region---',
            allowBlank: false,
            store: new Ext.data.DirectStore({
                reader: new Ext.data.JsonReader({
                    successProperty: 'success',
                    idProperty: 'Id',
                    root: 'data',
                    fields: ['Id', 'Name']
                }),
                autoLoad: true,
                api: { read: Tsa.GetRegions }
            }),
            valueField: 'Id', displayField: 'Name'
        }]
    }, config));
}
Ext.extend(Ext.core.finance.ux.payrollWoredas.Form, Ext.form.FormPanel);
Ext.reg('payrollWoredas-form', Ext.core.finance.ux.payrollWoredas.Form);

/**
* @desc      Woredas registration form host window
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.payrollWoredas
* @class     Ext.core.finance.ux.payrollWoredas.Window
* @extends   Ext.Window
*/
Ext.core.finance.ux.payrollWoredas.Window = function (config) {
    Ext.core.finance.ux.payrollWoredas.Window.superclass.constructor.call(this, Ext.apply({
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
Ext.extend(Ext.core.finance.ux.payrollWoredas.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.core.finance.ux.payrollWoredas.Form();
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

        Ext.core.finance.ux.payrollWoredas.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {

        if (!this.form.getForm().isValid()) return;
        this.form.getForm().submit({
            waitMsg: 'Please wait...',
            success: function () {
                Ext.getCmp('payrollWoredas-form').getForm().reset();
                Ext.getCmp('payrollWoredas-paging').doRefresh();
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
Ext.reg('payrollWoredas-window', Ext.core.finance.ux.payrollWoredas.Window);

/**
* @desc      Woredas grid
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.payrollWoredas
* @class     Ext.core.finance.ux.payrollWoredas.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.core.finance.ux.payrollWoredas.Grid = function (config) {
    Ext.core.finance.ux.payrollWoredas.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: PayrollWoredas.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Code',
                direction: 'ASC'
            },
            fields: ['Id', 'Name', 'Code', 'Region'],
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
        id: 'payrollWoredas-grid',
        searchCriteria: {},
        pageSize: 38,
        title: 'Woredas List',
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
                var form = Ext.getCmp('payrollWoredas-form');
                if (id != null) {
                  
                }
            },
            scope: this,
            rowdblclick: function () {
                if (!this.getSelectionModel().hasSelection()) return;
                var id = this.getSelectionModel().getSelected().get('Id');

                if (id != null) {
                    var hasEditPermission = Ext.core.finance.ux.Reception.getPermission('Woredas', 'CanEdit');
                    if (hasEditPermission) {
                        new Ext.core.finance.ux.payrollWoredas.Window({
                            payrollWoredasId: id,
                            title: 'Edit Woredas'
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
             header: 'Woreda Name',
             sortable: true,
             width: 55,
             menuDisabled: true
         }, {
             dataIndex: 'Code',
             header: 'Woreda Code',
             sortable: true,
             width: 55,
             menuDisabled: true
         }, {
             dataIndex: 'Region',
             header: 'Region',
             sortable: true,
             width: 55,
             menuDisabled: true
         }]
    }, config));
};
Ext.extend(Ext.core.finance.ux.payrollWoredas.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ mode: 'get' }) };
        this.tbar = [];
        this.bbar = new Ext.PagingToolbar({
            id: 'payrollWoredas-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.core.finance.ux.payrollWoredas.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getStore().load({
            params: { start: 0, limit: this.pageSize }
        });
        Ext.core.finance.ux.payrollWoredas.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('payrollWoredas-grid', Ext.core.finance.ux.payrollWoredas.Grid);

/**
* @desc      Woredas panel
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @version   $Id: payrollWoredas.js, 0.1
* @namespace Ext.core.finance.ux.payrollWoredas
* @class     Ext.core.finance.ux.payrollWoredas.Panel
* @extends   Ext.Panel
*/
Ext.core.finance.ux.payrollWoredas.Panel = function (config) {
    Ext.core.finance.ux.payrollWoredas.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false,
        tbar: {
            xtype: 'toolbar',
            items: [{
                xtype: 'button',
                text: 'Add',
                id: 'addpayrollWoredas',
                iconCls: 'icon-add',
                handler: this.onAddClick,
                disabled: !Ext.core.finance.ux.Reception.getPermission('Woredas', 'CanAdd')
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Edit',
                id: 'editpayrollWoredas',
                iconCls: 'icon-edit',
                handler: this.onEditClick,
                disabled: !Ext.core.finance.ux.Reception.getPermission('Woredas', 'CanEdit')
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Delete',
                id: 'deletepayrollWoredas',
                iconCls: 'icon-delete',
                handler: this.onDeleteClick,
                disabled: !Ext.core.finance.ux.Reception.getPermission('Woredas', 'CanDelete')
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Export List',
                iconCls: 'icon-excel',
                handler: function () {
                    var searchText = 'CSV';
                    window.open('PayrollWoredas/ExportToExcel?st=' + searchText, '', '');
                }
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Print List',
                id: 'printWoredas',
                iconCls: 'icon-Print',
                handler: this.onWoredasPrintClick

            }]
        }
    }, config));
}
Ext.extend(Ext.core.finance.ux.payrollWoredas.Panel, Ext.Panel, {
    initComponent: function () {
        this.items = [{
            xtype: 'payrollWoredas-grid',
            id: 'payrollWoredas-grid'
        }];
        Ext.core.finance.ux.payrollWoredas.Panel.superclass.initComponent.apply(this, arguments);
    },

    onAddClick: function () {
        new Ext.core.finance.ux.payrollWoredas.Window({
            payrollWoredasId: 0,
            title: 'Add Woredas'
        }).show();
    },
    onEditClick: function () {
        var grid = Ext.getCmp('payrollWoredas-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');
        new Ext.core.finance.ux.payrollWoredas.Window({
            payrollWoredasId: id,
            title: 'Edit Woredas'
        }).show();
    },
    onDeleteClick: function () {
        var grid = Ext.getCmp('payrollWoredas-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        Ext.MessageBox.show({
            title: 'Delete',
            msg: 'Are you sure you want to delete the selected Woreda?',
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
                    PayrollWoredas.Delete(id, function (result, response) {
                        Ext.getCmp('payrollWoredas-paging').doRefresh();
                    }, this);
                }
            }
        });
    },
    onWoredasPrintClick: function () {
        var grid = Ext.getCmp('payrollWoredas-grid');
        Ext.ux.GridPrinter.stylesheetPath = '/Content/css/print.css';
        Ext.ux.GridPrinter.print(grid);
    }
});
Ext.reg('payrollWoredas-panel', Ext.core.finance.ux.payrollWoredas.Panel);