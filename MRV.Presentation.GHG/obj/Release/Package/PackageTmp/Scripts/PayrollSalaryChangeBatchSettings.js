Ext.ns('Ext.core.finance.ux.PayrollBatchSalaryChangeSetting');
Ext.ns('Ext.core.finance.ux.PayrollBatchSalaryChangeSettingMain');

/**
* @desc      BSC registration form
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.PayrollBatchSalaryChangeSetting
* @class     Ext.core.finance.ux.PayrollBatchSalaryChangeSetting.Form
* @extends   Ext.form.FormPanel
*/
Ext.core.finance.ux.PayrollBatchSalaryChangeSetting.Form = function (config) {
    Ext.core.finance.ux.PayrollBatchSalaryChangeSetting.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: PayrollBatchSalaryChange.Get,
            submit: PayrollBatchSalaryChange.Save
        },
        paramOrder: ['Id'],
        defaults: {
            // anchor: '75%',
            labelStyle: 'text-align:left;',
            msgTarget: 'side'
        },
        id: 'PayrollBatchSalaryChangeSetting-form',
        padding: 5,
        labelWidth: 80,
        autoHeight: true,
        border: true,
        isFormLoad: false,
        frame: true,
        tbar: {
            xtype: 'toolbar',
            border: true,
            valign: 'top',
            padding: 5,
            items: [{
                xtype: 'button',
                text: 'New',
                id: 'newVoucherBSC',
                iconCls: 'icon-add',
                handler: BSCHandlers.onNewBSCClick
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Save',
                id: 'saveVoucherBSC',
                iconCls: 'icon-save',
                handler: function () {
                    BSCHandlers.onSaveBSCClick(false);
                }

            }]
        },
        items: [{
            name: 'Id',
            xtype: 'textfield',
            hidden: true
        },
                {
                    name: 'CuttOffDate',
                    xtype: 'datefield',
                    fieldLabel: 'Date',
                    altFormats: 'c',
                    editable: true,
                    anchor: '75%',
                    allowBlank: false,
                    listeners: {
                        select: function () {

                        }
                    }
                }]
    }, config));

},

Ext.extend(Ext.core.finance.ux.PayrollBatchSalaryChangeSetting.Form, Ext.form.FormPanel);
Ext.reg('PayrollBatchSalaryChangeSetting-form', Ext.core.finance.ux.PayrollBatchSalaryChangeSetting.Form);

var BSCHandlers = function () {
    return {
        onSaveBSCClick: function (isClosed) {
                SaveBSC(isClosed);
        },
        onDeleteBSCowClick: function () {
            Ext.MessageBox.show({
                title: 'Delete',
                msg: 'Are you sure you want to remove the selected Row? Once the row is deleted, you will not be able to retrieve it again!',
                buttons: {
                    ok: 'Yes',
                    no: 'No'
                },
                icon: Ext.MessageBox.QUESTION,
                scope: this,
                animEl: 'delete',
                fn: function (btn) {
                    if (btn == 'ok') {
                        var grid = Ext.getCmp('PayrollBatchSalaryChangeSetting-grid');
                        if (!grid.getSelectionModel().hasSelection()) return;
                        var record = grid.getSelectionModel().getSelected();
                        if (record !== undefined) {
                            if (record.data.Id != null && record.data.Id != "" && record.data.Id != '') {
                                PayrollBatchSalaryChangeSetting.DeleteVoucherDetail(record.data.Id, function (result) {
                                    if (!result.success) {
                                        Ext.MessageBox.show({
                                            title: 'Error',
                                            msg: result.data,
                                            buttons: Ext.Msg.OK,
                                            icon: Ext.MessageBox.ERROR,
                                            scope: this
                                        });
                                    } else {
                                        grid.store.remove(record);
                                    }
                                }, this);
                            } else {
                                grid.store.remove(record);
                            }
                        }
                    }
                }
            });
        },



        onNewBSCClick: function () {
            var form = Ext.getCmp('PayrollBatchSalaryChangeSetting-form');
            var dirty = form.getForm().isDirty();
           
            if (dirty)
                Ext.MessageBox.show({
                    title: 'Save Changes',
                    msg: 'Do you want to save the changes made before opening a new Document?',
                    buttons: Ext.Msg.YESNOCANCEL,
                    fn: function (btnId) {
                        if (btnId === 'yes') {
                            BSCHandlers.onSaveBSCClick(false);

                        }
                        else if (btnId === 'no') {
                            
                            Ext.getCmp('PayrollBatchSalaryChangeSetting-grid').onNextEntry();
                        }
                    }
                });

            return !dirty;
        }
    }
} ();

var SaveBSC = function (isClosed) {
    var grid = Ext.getCmp('PayrollBatchSalaryChangeSetting-grid');
    var form = Ext.getCmp('PayrollBatchSalaryChangeSetting-form');
    
    if (!form.getForm().isValid()) return;
    var store = grid.getStore();

   
    var rec = '';
    var index = 0;
    
    store.each(function (item) {
        
                    rec = rec + 
                    item.data['FromMonth'] + ':' +
                    item.data['ToMonth'] + ':' +
                    item.data['Rate'] + ';';
          
    });

   
        

        form.getForm().submit({
            waitMsg: 'Please wait...',
            params: { record: Ext.encode({ salaryChangeDetails: rec }) },
            success: function () {
                form.getForm().reset();
               
                Ext.getCmp('PayrollBatchSalaryChangeSetting-grid').onNextEntry();
                if (isClosed) {
                    var wind = Ext.WindowMgr.getActive();
                    if (wind) {
                        wind.purgeListeners();
                        wind.close();

                    }
                }
            },
            failure: function (form, action) {
                Ext.MessageBox.show({
                    title: 'Failure',
                    msg: action.result.data,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.ERROR,
                    scope: this
                });
            }
        });
    
};

var OnEditBSC = function () {
    var grid = Ext.getCmp('PayrollBatchSalaryChangeSettingMain-grid');
    if (!grid.getSelectionModel().hasSelection()) return;
    var id = grid.getSelectionModel().getSelected().get('Id');
   

    var hasCheckPermission = Ext.core.finance.ux.Reception.getPermission('Batch Salary Change', 'CanEdit');

    if (hasCheckPermission == true) {
        new Ext.core.finance.ux.PayrollBatchSalaryChangeSetting.Window({
            PayrollBatchSalaryChangeSettingId: id,
           
            title: 'Edit Batch Salary Change Settings'
        }).show();
    }

};

/**
* @desc      BSC registration form host window
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.PayrollBatchSalaryChangeSetting
* @class     Ext.core.finance.ux.PayrollBatchSalaryChangeSetting.Window
* @extends   Ext.Window
*/
Ext.core.finance.ux.PayrollBatchSalaryChangeSetting.Window = function (config) {
    Ext.core.finance.ux.PayrollBatchSalaryChangeSetting.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        width: 400,
        height: 400,
        closeAction: 'close',
        modal: true,
        resizable: false,
        maximizable: true,
        buttonAlign: 'right',
        bodyStyle: 'padding:0px;',
        listeners: {
            show: function () {

               
                this.form.getForm().findField('Id').setValue(this.PayrollBatchSalaryChangeSettingId);
                if (this.PayrollBatchSalaryChangeSettingId != 0) {
                    this.form.load({ params: { Id: this.PayrollBatchSalaryChangeSettingId} });
                    LoadBSCGridDetails(this.PayrollBatchSalaryChangeSettingId);
                    
                }
            },
            scope: this
        }
    }, config));
}
Ext.extend(Ext.core.finance.ux.PayrollBatchSalaryChangeSetting.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.core.finance.ux.PayrollBatchSalaryChangeSetting.Form();
        this.grid = new Ext.core.finance.ux.PayrollBatchSalaryChangeSetting.Grid();
        
        this.items = [this.form, this.grid];

        this.buttons = [{
            text: 'Close',
            iconCls: 'icon-exit',
            handler: this.onClose,
            scope: this
        }];

        Ext.core.finance.ux.PayrollBatchSalaryChangeSetting.Window.superclass.initComponent.call(this, arguments);
    },

    onClose: function () {

        this.close();
    }
});
Ext.reg('PayrollBatchSalaryChangeSetting-window', Ext.core.finance.ux.PayrollBatchSalaryChangeSetting.Window);

var BSCSelModel = new Ext.grid.CheckboxSelectionModel();

/**
* @desc      BSC grid
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.PayrollBatchSalaryChangeSetting
* @class     Ext.core.finance.ux.PayrollBatchSalaryChangeSettingMain.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.core.finance.ux.PayrollBatchSalaryChangeSettingMain.Grid = function (config) {
    Ext.core.finance.ux.PayrollBatchSalaryChangeSettingMain.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: PayrollBatchSalaryChange.GetAllHeaders,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Code',
                direction: 'ASC'
            },
            fields: ['Id', 'CuttOffDate'],
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
        id: 'PayrollBatchSalaryChangeSettingMain-grid',
        searchCriteria: {},
        pageSize: 38,
        gridVoucherType: 'BSC',
        //height: 600,
        stripeRows: true,
        columnLines: true,
        border: false,
        sm: BSCSelModel,
        viewConfig: {
            forceFit: true,
            autoFill: true,
            listeners: {

            }
        },
        listeners: {
            rowClick: function () {
           
            },
            scope: this,
            rowdblclick: function () {

            }

        },
        columns: [{
            dataIndex: 'Id',
            header: 'Id',
            sortable: true,
            hidden: true,
            width: 55,
            menuDisabled: false
        }, BSCSelModel, new Ext.erp.ux.grid.PagingRowNumberer(),
         {
             dataIndex: 'CuttOffDate',
             header: 'Cut Off Date',
             sortable: true,
             width: 55,
             menuDisabled: false
         }]
    }, config));
};
Ext.extend(Ext.core.finance.ux.PayrollBatchSalaryChangeSettingMain.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ SearchText: '', SearchBy: '', FromDate: '', ToDate: '', mode: 'get' }), vType: 'BSC' };
        this.tbar = [];
        this.bbar = new Ext.PagingToolbar({
            id: 'PayrollBatchSalaryChangeSettingMain-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.core.finance.ux.PayrollBatchSalaryChangeSettingMain.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getStore().load({

            params: { start: 0, limit: this.pageSize, vType: this.gridVoucherType }
        });
        Ext.core.finance.ux.PayrollBatchSalaryChangeSettingMain.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('PayrollBatchSalaryChangeSettingMain-grid', Ext.core.finance.ux.PayrollBatchSalaryChangeSettingMain.Grid);

var SCriteria = '';
var LoadBSCGridDetails = function (selectedRow) {

    var BSCDetailGrid = Ext.getCmp('PayrollBatchSalaryChangeSetting-grid');
    var BSCDetailStore = BSCDetailGrid.getStore();
    var BSCHeaderId = selectedRow;
    BSCDetailStore.baseParams = { record: Ext.encode({ reconciliationHeaderId: BSCHeaderId, mode: this.mode }) };
    BSCDetailStore.load({
        params: { start: 0, limit: 100 }
    });

}

/**
* @desc      PayrollBatchSalaryChangeSetting grid
* @author    Dawit Kiros
* @copyright (c) 2010, Cybersoft
* @date      November 01, 2010
* @namespace Ext.core.finance.ux.PayrollBatchSalaryChangeSetting
* @class     Ext.core.finance.ux.PayrollBatchSalaryChangeSetting.Grid
* @extends   Ext.grid.GridPanel
*/

Ext.core.finance.ux.PayrollBatchSalaryChangeSetting.Grid = function (config) {
    Ext.core.finance.ux.PayrollBatchSalaryChangeSetting.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: window.PayrollBatchSalaryChange.GetAllDetails,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',

            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Code',
                direction: 'ASC'
            },
            fields: ['Id', 'FromMonth', 'ToMonth', 'Rate'],
            remoteSort: true,
            listeners: {
                beforeLoad: function () {
                    Ext.getCmp('PayrollBatchSalaryChangeSetting-grid').body.mask('Loading...', 'x-mask-loading');
                },
                load: function () {
                    var grid = Ext.getCmp('PayrollBatchSalaryChangeSetting-grid');
                    var store = grid.getStore();
                    
                    grid.body.unmask();
                },
                loadException: function () {
                    Ext.getCmp('PayrollBatchSalaryChangeSetting-grid').body.unmask();
                },
                remove: function (store) {
                    var grid = Ext.getCmp('PayrollBatchSalaryChangeSetting-grid');
                    
                },
                scope: this
            }
        }),
        id: 'PayrollBatchSalaryChangeSetting-grid',
        selectedVoucherTypeId: 0,
        pageSize: 10,
        height: 300,
        //width: 1200,
        stripeRows: true,
        selectedCriteria: '',
        columnLines: true,
        border: true,
        clicksToEdit: 2,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true,
            onEditorKey: function (field, e) {
                var k = e.getKey(), newCell = null, g = this.grid, ed = g.activeEditor;
                var shift = e.shiftKey;
                ctrlKeyPressed = e.ctrlKey;
                if ((k == e.TAB || k == e.ENTER) && e.ctrlKey == false) {
                    e.stopEvent();
                    field.gridEditor.completeEdit();

                    if (shift) {
                        newCell = g.walkCells(field.gridEditor.row, field.gridEditor.col - 1, -1, this.acceptsNav, this);
                    } else {
                        newCell = g.walkCells(field.gridEditor.row, field.gridEditor.col + 1, 1, this.acceptsNav, this);
                        if (!newCell) {
                            g.addRow();
                        }
                    }
                }
                if (newCell) {
                    g.startEditing(newCell[0], newCell[1]);
                }
            }
        }),
        viewConfig: {
            forceFit: true,
            autoFill: true,

            listeners: {
             
            }
        },
        listeners: {

        },
        columns: [
        {
            dataIndex: 'Id',
            header: 'Id',
            sortable: false,
            hidden: true,
            width: 100,
            menuDisabled: true
        }, new Ext.grid.RowNumberer(), {
            dataIndex: 'FromMonth',
            header: 'From Month',
            sortable: false,
            width: 90,
            menuDisabled: true,
            align: 'right',
           
            editor: new Ext.form.NumberField({
                allowBlank: false,
                allowNegative: false,
                listeners: {
                    focus: function (field) {
                        field.selectText();
                    }
                }
            })
        }, {
            dataIndex: 'ToMonth',
            header: 'To Month',
            sortable: false,
            width: 90,
            menuDisabled: true,
            align: 'right',

            editor: new Ext.form.NumberField({
                allowBlank: false,
                allowNegative: false,
                listeners: {
                    focus: function (field) {
                        field.selectText();
                    }
                }
            })
        }, {
            dataIndex: 'Rate',
            header: 'Rate',
            sortable: false,
            width: 90,
            menuDisabled: true,
            align: 'right',

            editor: new Ext.form.NumberField({
                allowBlank: false,
                allowNegative: false,
                listeners: {
                    focus: function (field) {
                        field.selectText();
                    }
                }
            })
        }
        ]
    }, config));
};
Ext.extend(Ext.core.finance.ux.PayrollBatchSalaryChangeSetting.Grid, Ext.grid.EditorGridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ voucherTypeId: this.voucherTypeId }) };
        this.tbar = [];

        Ext.core.finance.ux.PayrollBatchSalaryChangeSetting.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.addRow();
        Ext.core.finance.ux.PayrollBatchSalaryChangeSetting.Grid.superclass.afterRender.apply(this, arguments);
    },
    addRow: function () {
        var grid = Ext.getCmp('PayrollBatchSalaryChangeSetting-grid');
        var store = grid.getStore();
        var voucher = store.recordType;
        var p = new voucher({


            FromMonth: 0,
            ToMonth: 0,
            Rate: 0

        });
        var count = store.getCount();
        grid.stopEditing();
        store.insert(count, p);
        if (count > 0) {
            grid.startEditing(count, 3);
        }
    }
 

});
Ext.reg('PayrollBatchSalaryChangeSetting-grid', Ext.core.finance.ux.PayrollBatchSalaryChangeSetting.Grid);

/**
* @desc      BSC panel
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @version   $Id: PayrollBatchSalaryChangeSetting.js, 0.1
* @namespace Ext.core.finance.ux.PayrollBatchSalaryChangeSetting
* @class     Ext.core.finance.ux.PayrollBatchSalaryChangeSetting.Panel
* @extends   Ext.Panel
*/
Ext.core.finance.ux.PayrollBatchSalaryChangeSetting.Panel = function (config) {
    Ext.core.finance.ux.PayrollBatchSalaryChangeSetting.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false,
        tbar: {
            xtype: 'toolbar',
            items: [{
                xtype: 'button',
                text: 'Add',
                id: 'addPayrollBatchSalaryChangeSetting',
                iconCls: 'icon-add',
                handler: this.onAddClick,
                disabled: !Ext.core.finance.ux.Reception.getPermission('Batch Salary Change', 'CanAdd')

            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Edit',
                id: 'editPayrollBatchSalaryChangeSetting',
                iconCls: 'icon-edit',
                handler: this.onEditClick,
                disabled: !Ext.core.finance.ux.Reception.getPermission('Batch Salary Change', 'CanEdit')

            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Delete',
                id: 'deletePayrollBatchSalaryChangeSetting',
                iconCls: 'icon-delete',
                handler: this.onDeleteClick,
                disabled: !Ext.core.finance.ux.Reception.getPermission('Batch Salary Change', 'CanDelete')

            }]
        }
    }, config));
}
Ext.extend(Ext.core.finance.ux.PayrollBatchSalaryChangeSetting.Panel, Ext.Panel, {
    initComponent: function () {
        this.items = [{
            xtype: 'PayrollBatchSalaryChangeSettingMain-grid',
            id: 'PayrollBatchSalaryChangeSettingMain-grid'
        }];
        Ext.core.finance.ux.PayrollBatchSalaryChangeSetting.Panel.superclass.initComponent.apply(this, arguments);
    },

    onAddClick: function () {
        new Ext.core.finance.ux.PayrollBatchSalaryChangeSetting.Window({
            PayrollBatchSalaryChangeSettingId: 0,
            title: 'Add Batch Salary Change Ranges'
        }).show();
    },
    onEditClick: function () {
        OnEditBSC();
    },
    onDeleteClick: function () {
        var grid = Ext.getCmp('PayrollBatchSalaryChangeSettingMain-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        Ext.MessageBox.show({
            title: 'Delete',
            msg: 'Are you sure you want to delete the selected Row?',
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
                    PayrollBatchSalaryChangeSetting.Delete(id, function (result, response) {
                        Ext.getCmp('PayrollBatchSalaryChangeSettingMain-paging').doRefresh();
                    }, this);
                }
            }
        });
    }
});

Ext.reg('PayrollBatchSalaryChangeSetting-panel', Ext.core.finance.ux.PayrollBatchSalaryChangeSetting.Panel);
