Ext.ns('Ext.core.finance.ux.FinanceProjectNumbers');
/**
* @desc      Project Numbers registration form
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.FinanceProjectNumbers
* @class     Ext.core.finance.ux.FinanceProjectNumbers.Form
* @extends   Ext.form.FormPanel
*/
Ext.core.finance.ux.FinanceProjectNumbers.Form = function (config) {
    Ext.core.finance.ux.FinanceProjectNumbers.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: FinanceProjectNumbers.Get,
            submit: FinanceProjectNumbers.Save
        },
        paramOrder: ['Id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'FinanceProjectNumbers-form',
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
           name: 'ProjectNumber',
            xtype: 'textfield',
            fieldLabel: 'Project Number',
            anchor: '75%',
            allowBlank: false
        },{
            name: 'IsDefault',
            xtype: 'checkbox',
            fieldLabel: 'Is Default',
            anchor: '95%'
            
        }]
    }, config));
}
Ext.extend(Ext.core.finance.ux.FinanceProjectNumbers.Form, Ext.form.FormPanel);
Ext.reg('FinanceProjectNumbers-form', Ext.core.finance.ux.FinanceProjectNumbers.Form);

/**
* @desc      Project Numbers registration form host window
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.FinanceProjectNumbers
* @class     Ext.core.finance.ux.FinanceProjectNumbers.Window
* @extends   Ext.Window
*/
Ext.core.finance.ux.FinanceProjectNumbers.Window = function (config) {
    Ext.core.finance.ux.FinanceProjectNumbers.Window.superclass.constructor.call(this, Ext.apply({
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
Ext.extend(Ext.core.finance.ux.FinanceProjectNumbers.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.core.finance.ux.FinanceProjectNumbers.Form();
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

        Ext.core.finance.ux.FinanceProjectNumbers.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {

        if (!this.form.getForm().isValid()) return;
        this.form.getForm().submit({
            waitMsg: 'Please wait...',
            success: function () {
                Ext.getCmp('FinanceProjectNumbers-form').getForm().reset();
                Ext.getCmp('FinanceProjectNumbers-paging').doRefresh();
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
Ext.reg('FinanceProjectNumbers-window', Ext.core.finance.ux.FinanceProjectNumbers.Window);

/**
* @desc      Project Numbers grid
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.FinanceProjectNumbers
* @class     Ext.core.finance.ux.FinanceProjectNumbers.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.core.finance.ux.FinanceProjectNumbers.Grid = function (config) {
    Ext.core.finance.ux.FinanceProjectNumbers.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: FinanceProjectNumbers.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Code',
                direction: 'ASC'
            },
            fields: ['Id', 'ProjectNumber', 'IsDefault'],
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
        id: 'FinanceProjectNumbers-grid',
        searchCriteria: {},
        pageSize: 38,
        title: 'Project Numbers List',
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
                var form = Ext.getCmp('FinanceProjectNumbers-form');
                if (id != null) {
                  
                }
            },
            scope: this,
            rowdblclick: function () {
                if (!this.getSelectionModel().hasSelection()) return;
                var id = this.getSelectionModel().getSelected().get('Id');

                if (id != null) {
                    var hasEditPermission = Ext.core.finance.ux.Reception.getPermission('Project Numbers', 'CanEdit');
                    if (hasEditPermission) {
                        new Ext.core.finance.ux.FinanceProjectNumbers.Window({
                            payrollWoredasId: id,
                            title: 'Edit Project Numbers'
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
             dataIndex: 'ProjectNumber',
             header: 'Project Number',
             sortable: true,
             width: 55,
             menuDisabled: true
         },{
            dataIndex: 'IsDefault',
            header: 'IsDefault',
            sortable: true,
            width: 50,
            menuDisabled: true,
            align: 'center',
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                if (value)
                    return '<img src="Content/images/app/yes.png"/>';
                else
                    return '<img src="Content/images/app/no.png"/>';
            }
        }]
    }, config));
};
Ext.extend(Ext.core.finance.ux.FinanceProjectNumbers.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ mode: 'get' }) };
        this.tbar = [];
        this.bbar = new Ext.PagingToolbar({
            id: 'FinanceProjectNumbers-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.core.finance.ux.FinanceProjectNumbers.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getStore().load({
            params: { start: 0, limit: this.pageSize }
        });
        Ext.core.finance.ux.FinanceProjectNumbers.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('FinanceProjectNumbers-grid', Ext.core.finance.ux.FinanceProjectNumbers.Grid);

/**
* @desc      Project Numbers panel
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @version   $Id: FinanceProjectNumbers.js, 0.1
* @namespace Ext.core.finance.ux.FinanceProjectNumbers
* @class     Ext.core.finance.ux.FinanceProjectNumbers.Panel
* @extends   Ext.Panel
*/
Ext.core.finance.ux.FinanceProjectNumbers.Panel = function (config) {
    Ext.core.finance.ux.FinanceProjectNumbers.Panel.superclass.constructor.call(this, Ext.apply({
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
                disabled: !Ext.core.finance.ux.Reception.getPermission('Project Numbers', 'CanAdd')
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Edit',
                id: 'editOC',
                iconCls: 'icon-edit',
                handler: this.onEditClick,
                disabled: !Ext.core.finance.ux.Reception.getPermission('Project Numbers', 'CanEdit')
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Delete',
                id: 'deleteOC',
                iconCls: 'icon-delete',
                handler: this.onDeleteClick,
                disabled: !Ext.core.finance.ux.Reception.getPermission('Project Numbers', 'CanDelete')
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
Ext.extend(Ext.core.finance.ux.FinanceProjectNumbers.Panel, Ext.Panel, {
    initComponent: function () {
        this.items = [{
            xtype: 'FinanceProjectNumbers-grid',
            id: 'FinanceProjectNumbers-grid'
        }];
        Ext.core.finance.ux.FinanceProjectNumbers.Panel.superclass.initComponent.apply(this, arguments);
    },

    onAddClick: function () {
        new Ext.core.finance.ux.FinanceProjectNumbers.Window({
            payrollWoredasId: 0,
            title: 'Add Project Numbers'
        }).show();
    },
    onEditClick: function () {
        var grid = Ext.getCmp('FinanceProjectNumbers-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');
        new Ext.core.finance.ux.FinanceProjectNumbers.Window({
            payrollWoredasId: id,
            title: 'Edit Project Numbers'
        }).show();
    },
    onDeleteClick: function () {
        var grid = Ext.getCmp('FinanceProjectNumbers-grid');
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
                    FinanceProjectNumbers.Delete(id, function (result, response) {
                        Ext.getCmp('FinanceProjectNumbers-paging').doRefresh();
                    }, this);
                }
            }
        });
    },
    onOCsPrintClick: function () {
        var grid = Ext.getCmp('FinanceProjectNumbers-grid');
        Ext.ux.GridPrinter.stylesheetPath = '/Content/css/print.css';
        Ext.ux.GridPrinter.print(grid);
    }
});
Ext.reg('FinanceProjectNumbers-panel', Ext.core.finance.ux.FinanceProjectNumbers.Panel);