Ext.ns('Ext.core.finance.ux.employeeHeader');
/**
* @desc      employeeHeader registration form
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date     June 13, 2013
* @namespace Ext.core.finance.ux.employeeHeader
* @class     Ext.core.finance.ux.employeeHeader.Form
* @extends   Ext.form.FormPanel
*/
Ext.core.finance.ux.employeeHeader.Form = function (config) {
    Ext.core.finance.ux.employeeHeader.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: EmployeesWithPayrollItem.Get,
            submit: EmployeesWithPayrollItem.Save
        },
        paramOrder: ['id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'employeeHeader-form',
        padding: 5,
        labelWidth: 100,
        autoHeight: true,
        border: false,

        baseCls: 'x-plain',
        items: [
                {
                    name: 'Id',
                    xtype: 'hidden'
                },
                {
                    name: 'employeeHeaderId',
                    xtype: 'hidden'
                }, {
                    hiddenName: 'IngredientsorRawmaterialId',
                    xtype: 'combo',
                    fieldLabel: 'Raw Material',
                    triggerAction: 'all',
                    mode: 'local',
                    editable: false,
                    forceSelection: true,
                    emptyText: '---Select---',
                    allowBlank: false,
                    store: new Ext.data.DirectStore({
                        reader: new Ext.data.JsonReader({
                            successProperty: 'success',
                            idProperty: 'Id',
                            root: 'data',
                            fields: ['Id', 'Name']
                        }),
                        autoLoad: true,
                        api: { read: Psis.GetRawMaterial }
                    }),
                    valueField: 'Id',
                    displayField: 'Name'
                },
                {
                    name: 'Quantity',
                    xtype: 'numberfield',
                    fieldLabel: 'Quantity',
                    allowBlank: false,
                    allowDecimals: true,
                    allowNegative: false
                },
                 {
                     hiddenName: 'MeasurementId',
                     xtype: 'combo',
                     fieldLabel: 'Measurement Unit',
                     triggerAction: 'all',
                     mode: 'local',
                     editable: false,
                     forceSelection: true,
                     emptyText: '---Select---',
                     allowBlank: false,
                     store: new Ext.data.DirectStore({
                         reader: new Ext.data.JsonReader({
                             successProperty: 'success',
                             idProperty: 'Id',
                             root: 'data',
                             fields: ['Id', 'Name']
                         }),
                         autoLoad: true,
                         api: { read: Psis.GetMeasurementUnit }
                     }),
                     valueField: 'Id',
                     displayField: 'Name'

                 }, {
                     name: 'Remark',
                     xtype: 'textarea',
                     fieldLabel: 'Remark',
                     width: 100,
                     allowBlank: true
                 }]
    }, config));
};
Ext.extend(Ext.core.finance.ux.employeeHeader.Form, Ext.form.FormPanel);
Ext.reg('employeeHeader-form', Ext.core.finance.ux.employeeHeader.Form);

/**
* @desc      Employee Detail registration form host window
* @author   Dawit Kiros
* @copyright (c) 2014, LIFT
* @date     June 13, 2013
* @namespace Ext.core.finance.ux.employeeHeader
* @class     Ext.core.finance.ux.employeeHeader.Window
* @extends   Ext.Window
*/
Ext.core.finance.ux.employeeHeader.Window = function (config) {
    Ext.core.finance.ux.employeeHeader.Window.superclass.constructor.call(this, Ext.apply({
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
                this.form.getForm().findField('Id').setValue(this.detailId);
                this.form.getForm().findField('employeeHeaderId').setValue(this.headerId);
                if (this.detailId > 0) {
                    this.form.load({ params: { id: this.detailId} });
                }
            },
            scope: this
        }
    }, config));
};
Ext.extend(Ext.core.finance.ux.employeeHeader.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.core.finance.ux.employeeHeader.Form();
        this.items = [this.form];
        this.buttons = [{
            text: 'Save',
            iconCls: 'icon-save',
            handler: this.onSave,
            scope: this
        }, {
            xtype: 'tbseparator'
        }, {
            text: 'Close',
            iconCls: 'icon-exit',
            handler: this.onClose,
            scope: this
        }];
        this.tools = [{
            id: 'refresh',
            qtip: 'Reset',
            handler: function () {
                this.form.getForm().reset();
            },
            scope: this
        }];
        Ext.core.finance.ux.employeeHeader.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {
        if (!this.form.getForm().isValid()) return;
        this.form.getForm().submit({
            waitMsg: 'Please wait...',
            success: function () {
                Ext.getCmp('employeeHeader-form').getForm().reset();
                var grid = Ext.getCmp('employeeHeader-grid');
                grid.getStore().reload();
            },
            failure: function (form, action) {
                Ext.MessageBox.show({
                    title: 'Error',
                    msg: action.result.data,
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
Ext.reg('employeeHeader-window', Ext.core.finance.ux.employeeHeader.Window);

/**
* @desc      Employee Detail grid
* @author   Dawit Kiros
* @copyright (c) 2014, LIFT
* @date     June 13, 2013
* @namespace Ext.core.finance.ux.employeeHeader
* @class     Ext.core.finance.ux.employeeHeader.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.core.finance.ux.employeeHeader.Grid = function (config) {
    Ext.core.finance.ux.employeeHeader.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            //directFn: MediaSolutionFormulationDetail.GetDetailByHeaderId,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|headerId',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'ASC'
            },
            fields: ['Id', 'IdentityNumber', 'FirstName', 'FatherName', 'GrandFatherName', 'Gender', 'PositionName', 'PositionCode'],
            remoteSort: true
        }),
        id: 'employeeHeader-grid',
        formulationId: 0,
        pageSize: 30,
        height: 600,
        stripeRows: true,
        border: false,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        viewConfig: {
            forceFit: true,
            autoFill: true
        },
        columns: [{
            dataIndex: 'Id',
            header: 'Id',
            sortable: true,
            hidden: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'IdentityNumber',
            header: 'Id No.',
            sortable: true,
            width: 220,
            menuDisabled: false
        }, {
            dataIndex: 'FirstName',
            header: 'First Name',
            sortable: true,
            width: 200,
            menuDisabled: true
        }, {
            dataIndex: 'FatherName',
            header: 'Father Name',
            sortable: true,
            width: 200,
            menuDisabled: true
        }, {
            dataIndex: 'GrandFatherName',
            header: 'GrandFather Name',
            sortable: true,
            width: 220,
            menuDisabled: true
        }, {
            dataIndex: 'PositionName',
            header: 'Position Name',
            sortable: true,
            width: 250,
            menuDisabled: true
        }]
    }, config));
};
Ext.extend(Ext.core.finance.ux.employeeHeader.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.bbar = new Ext.PagingToolbar({
            id: 'employeeHeader-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.core.finance.ux.employeeHeader.Grid.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('employeeHeader-grid', Ext.core.finance.ux.employeeHeader.Grid);


//functions

function Amount_MeasurementUnit(val, x, store) {
    return val + ' ' + store.data.MeasurementUnit;
}

/**
* @desc      Employee Detail panel
* @author   Dawit Kiros
* @copyright (c) 2014, LIFT
* @date     June 13, 2013
* @version   $Id: employeeHeader.js, 0.1
* @namespace Ext.core.finance.ux.employeeHeader
* @class     Ext.core.finance.ux.employeeHeader.Panel
* @extends   Ext.Panel
*/
Ext.core.finance.ux.employeeHeader.Panel = function (config) {
    Ext.core.finance.ux.employeeHeader.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false,
        title: 'Employees',
        height: 250,
        tbar: {
            xtype: 'toolbar',
            items: [{
                xtype: 'button',
                text: 'Add Employees',
                id: 'addemployeeHeader',
                iconCls: 'icon-add',
                handler: this.onAddEmployee
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Remove Employees',
                id: 'editemployeeHeader',
                iconCls: 'icon-delete',
                handler: this.onEditClick
            }, {
                xtype: 'tbseparator'
            }]
        }
    }, config));
};
Ext.extend(Ext.core.finance.ux.employeeHeader.Panel, Ext.Panel, {
    initComponent: function () {
        this.grid = new Ext.core.finance.ux.employeeSelection.Grid();
        this.items = [{
            xtype: 'employeeHeader-grid',
            id: 'employeeHeader-grid'
        }];
        Ext.core.finance.ux.employeeHeader.Panel.superclass.initComponent.apply(this, arguments);
    },

    onAddEmployee: function () {
        new Ext.core.finance.ux.employeeSelectionWCheckBox.Window({
        }).show();
    },
    onEditClick: function () {
        var grid = Ext.getCmp('employeeHeader-grid');
        if (!grid.getSelectionModel().hasSelection()) {
            Ext.MessageBox.show({
                title: 'Select',
                msg: 'Empty selection. Please select an employee from the grid.',
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
        var id = grid.getSelectionModel().getSelected().get('Id');
        new Ext.core.finance.ux.employeeHeader.Window({
            detailId: id,
            title: 'Edit Employee'
        }).show();
    },
    onDeleteClick: function () {
        var grid = Ext.getCmp('employeeHeader-grid');
        if (!grid.getSelectionModel().hasSelection()) {
            Ext.MessageBox.show({
                title: 'Select',
                msg: 'You must select Employee to delete.',
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
        Ext.MessageBox.show({
            title: 'Delete',
            msg: 'Are you sure you want to remove the selected employee?',
            buttons: {
                ok: 'Yes',
                no: 'No'
            },
            icon: Ext.MessageBox.QUESTION,
            scope: this,
            animEl: 'Delete',
            fn: function (btn) {
                if (btn == 'ok') {
                    Ext.MessageBox.show({
                        title: 'Warning',
                        msg: 'Deleting this Employee could make other related data invalid. Press Ok to delete, Press Cancel to abort.',
                        buttons: {
                            ok: 'Ok',
                            cancel: 'Cancel'
                        },
                        icon: Ext.MessageBox.WARNING,
                        scope: this,
                        fn: function (btn) {
                            if (btn == 'ok') {
                                var id = grid.getSelectionModel().getSelected().get('Id');
                                SolutionDetail.Delete(id, function (result, response) {
                                    Ext.getCmp('employeeHeader-paging').doRefresh();
                                }, this);
                            }
                        }
                    });
                }
            }
        });
    }
});
Ext.reg('employeeHeader-panel', Ext.core.finance.ux.employeeHeader.Panel);