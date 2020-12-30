Ext.ns('Ext.core.finance.ux.faClasses');
/**
* @desc      Asset Class registration form
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.faClasses
* @class     Ext.core.finance.ux.faClasses.Form
* @extends   Ext.form.FormPanel
*/
Ext.core.finance.ux.faClasses.Form = function (config) {
    Ext.core.finance.ux.faClasses.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: FixedAssetClass.Get,
            submit: FixedAssetClass.Save
        },
        paramOrder: ['Id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'faClasses-form',
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
            hiddenName: 'CategoryId',
            xtype: 'combo',            
            fieldLabel: 'Category',
            triggerAction: 'all',
            mode: 'local',
            editable: true,
            typeAhead: true,
            forceSelection: true,
            emptyText: 'FA Category',
            allowBlank: false,
            store: new Ext.data.DirectStore({
                reader: new Ext.data.JsonReader({
                    successProperty: 'success',
                    idProperty: 'Id',
                    root: 'data',
                    fields: ['Id', 'Name']
                }),
                autoLoad: true,
                api: { read: FixedAssetCategory.GetFixedAssetCategory }
            }),
            valueField: 'Id', displayField: 'Name'
        }, {
            name: 'Code',
            xtype: 'textfield',
            fieldLabel: 'Code',
            
            allowBlank: false
        }, {
            name: 'Name',
            xtype: 'textfield',
            fieldLabel: 'Name',
            
            allowBlank: false
        },{
            xtype: 'fieldset',
            title: 'Tag Number Settings',
            autoHeight: true,

            items: [{
                name: 'StartingNo',
                xtype: 'numberfield',
                fieldLabel: 'Starting No',
                allowBlank: false,
                value: '1'
                
            }, {
                name: 'CurrentNumber',
                xtype: 'numberfield',
                allowBlank: false,
                fieldLabel: 'Current Number',                
                value: '1'
                
            }, {
                name: 'NoOfDigits',
                xtype: 'numberfield',
                allowBlank: false,
                fieldLabel: 'NoOfDigits',
                value: '4'

            }]
        }]
    }, config));
}
Ext.extend(Ext.core.finance.ux.faClasses.Form, Ext.form.FormPanel);
Ext.reg('faClasses-form', Ext.core.finance.ux.faClasses.Form);

/**
* @desc      Asset Class registration form host window
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.faClasses
* @class     Ext.core.finance.ux.faClasses.Window
* @extends   Ext.Window
*/
Ext.core.finance.ux.faClasses.Window = function (config) {
    Ext.core.finance.ux.faClasses.Window.superclass.constructor.call(this, Ext.apply({
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
                    this.form.load({ params: { Id: this.payrollRegionsId } });
                }
            },
            scope: this
        }
    }, config));
}
Ext.extend(Ext.core.finance.ux.faClasses.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.core.finance.ux.faClasses.Form();
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

        Ext.core.finance.ux.faClasses.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {

        if (!this.form.getForm().isValid()) return;
        this.form.getForm().submit({
            waitMsg: 'Please wait...',
            success: function () {
                Ext.getCmp('faClasses-form').getForm().reset();
                Ext.getCmp('faClasses-paging').doRefresh();
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
Ext.reg('faClasses-window', Ext.core.finance.ux.faClasses.Window);

/**
* @desc      Asset Class grid
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.faClasses
* @class     Ext.core.finance.ux.faClasses.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.core.finance.ux.faClasses.Grid = function (config) {
    Ext.core.finance.ux.faClasses.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: FixedAssetClass.GetAll,
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
        id: 'faClasses-grid',
        searchCriteria: {},
        pageSize: 38,
        title: 'Asset Class List',
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
                var form = Ext.getCmp('faClasses-form');
                if (id != null) {

                }
            },
            scope: this,
            rowdblclick: function () {
                if (!this.getSelectionModel().hasSelection()) return;
                var id = this.getSelectionModel().getSelected().get('Id');

                if (id != null) {
                    var hasEditPermission = Ext.core.finance.ux.Reception.getPermission('Asset Class', 'CanEdit');
                    if (hasEditPermission) {
                        new Ext.core.finance.ux.faClasses.Window({
                            payrollRegionsId: id,
                            title: 'Edit Asset Class'
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
             header: 'Class Name',
             sortable: true,
             width: 55,
             menuDisabled: true
         }, {
             dataIndex: 'Code',
             header: 'Class Code',
             sortable: true,
             width: 55,
             menuDisabled: true
         }]
    }, config));
};
Ext.extend(Ext.core.finance.ux.faClasses.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ mode: 'get' }) };
        this.tbar = [];
        this.bbar = new Ext.PagingToolbar({
            id: 'faClasses-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.core.finance.ux.faClasses.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getStore().load({
            params: { start: 0, limit: this.pageSize }
        });
        Ext.core.finance.ux.faClasses.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('faClasses-grid', Ext.core.finance.ux.faClasses.Grid);

/**
* @desc      Asset Class panel
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @version   $Id: faClasses.js, 0.1
* @namespace Ext.core.finance.ux.faClasses
* @class     Ext.core.finance.ux.faClasses.Panel
* @extends   Ext.Panel
*/
Ext.core.finance.ux.faClasses.Panel = function (config) {
    Ext.core.finance.ux.faClasses.Panel.superclass.constructor.call(this, Ext.apply({
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
                //disabled: !Ext.core.finance.ux.Reception.getPermission('Asset Class', 'CanAdd')
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Edit',
                id: 'editpayrollRegions',
                iconCls: 'icon-edit',
                handler: this.onEditClick,
                //disabled: !Ext.core.finance.ux.Reception.getPermission('Asset Class', 'CanEdit')
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Delete',
                id: 'deletepayrollRegions',
                iconCls: 'icon-delete',
                handler: this.onDeleteClick,
                //disabled: !Ext.core.finance.ux.Reception.getPermission('Asset Class', 'CanDelete')
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
Ext.extend(Ext.core.finance.ux.faClasses.Panel, Ext.Panel, {
    initComponent: function () {
        this.items = [{
            xtype: 'faClasses-grid',
            id: 'faClasses-grid'
        }];
        Ext.core.finance.ux.faClasses.Panel.superclass.initComponent.apply(this, arguments);
    },

    onAddClick: function () {
        new Ext.core.finance.ux.faClasses.Window({
            payrollRegionsId: 0,
            title: 'Add Asset Class'
        }).show();
    },
    onEditClick: function () {
        var grid = Ext.getCmp('faClasses-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');
        new Ext.core.finance.ux.faClasses.Window({
            payrollRegionsId: id,
            title: 'Edit Asset Class'
        }).show();
    },
    onDeleteClick: function () {
        var grid = Ext.getCmp('faClasses-grid');
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
                    FixedAssetClass.Delete(id, function (result, response) {
                        Ext.getCmp('faClasses-paging').doRefresh();
                    }, this);
                }
            }
        });
    },
    onRegionsPrintClick: function () {
        var grid = Ext.getCmp('faClasses-grid');
        Ext.ux.GridPrinter.stylesheetPath = '/Content/css/print.css';
        Ext.ux.GridPrinter.print(grid);
    }
});
Ext.reg('faClasses-panel', Ext.core.finance.ux.faClasses.Panel);