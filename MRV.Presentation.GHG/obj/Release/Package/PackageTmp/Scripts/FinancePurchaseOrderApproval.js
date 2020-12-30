Ext.ns('Ext.core.finance.ux.FinancePurchaseOrderApproval');
Ext.ns('Ext.core.finance.ux.FinancePurchaseOrderApprovalMain');
Ext.ns('Ext.core.finance.ux.FinancePurchaseOrderApprovalFooter');
/**
* @desc      JV registration form
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.FinancePurchaseOrderApproval
* @class     Ext.core.finance.ux.FinancePurchaseOrderApproval.Form
* @extends   Ext.form.FormPanel
*/
Ext.core.finance.ux.FinancePurchaseOrderApproval.Form = function (config) {
    Ext.core.finance.ux.FinancePurchaseOrderApproval.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: FinancePurchaseOrder.Get,
            submit: FinancePurchaseOrder.Save
        },
        paramOrder: ['Id'],
        defaults: {
            // anchor: '75%',
            labelStyle: 'text-align:left;',
            msgTarget: 'side'
        },
        id: 'FinancePurchaseOrderApproval-form',
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
                id: 'newPOApproval',
                iconCls: 'icon-add',
                handler: this.onNewClick
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Save',
                id: 'savePOApproval',
                iconCls: 'icon-save',
                handler: Handlers.onSaveJVClick
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Remove',
                id: 'deletePOApproval',
                iconCls: 'icon-delete',
                handler: this.onDeleteClick
            }]
        },
        items: [{
            layout: 'column',
            items: [{
                columnWidth: .50,
                defaults: {
                    labelStyle: 'text-align:right;',
                    msgTarget: 'side'
                },
                border: false,
                layout: 'form',
                items: [{
                    name: 'Id',
                    xtype: 'textfield',
                    hidden: true
                }, {
                id: 'Description',
                    name: 'Description',
                    xtype: 'textfield',
                    fieldLabel: 'Description',
                    anchor: '100%',
                    allowBlank: true,
                    hidden: false

                }, {
                    id: 'Date',
                    name: 'Date',
                    xtype: 'datefield',
                    fieldLabel: 'Date',
                    altFormats: 'c',
                    editable: true,
                    anchor: '75%',
                    allowBlank: false
                }, {
                    id: 'ReferenceNo',
                    name: 'ReferenceNo',
                    xtype: 'textfield',
                    fieldLabel: 'Reference No',
                    anchor: '95%',
                    value: 'LIFT/PO01/002',
                    disabled: false,
                    allowBlank: false

                }]
            }, {
                columnWidth: .50,
                defaults: {
                    labelStyle: 'text-align:right;',
                    msgTarget: 'side'
                },
                border: false,
                layout: 'form',
                items: []

            }]
        }]
    }, config));

},

Ext.extend(Ext.core.finance.ux.FinancePurchaseOrderApproval.Form, Ext.form.FormPanel);
Ext.reg('FinancePurchaseOrderApproval-form', Ext.core.finance.ux.FinancePurchaseOrderApproval.Form);
//var k = !Ext.core.finance.ux.Reception.getPermission('Journal Voucher (JV)', 'CanApprove');
var Handlers = function () {
    return {
        onSaveJVClick: function () {
            var grid = Ext.getCmp('FinancePurchaseOrderApproval-grid');
            var form = Ext.getCmp('FinancePurchaseOrderApproval-form');

            if (!form.getForm().isValid()) return;
            var store = grid.getStore();
            var rec = '';
            store.each(function (item) {
                if (item.data['POTypeId'] != '' && item.data['Description'] != '') {
                    if ((item.data['Amount'] != 0)) {
                        rec = rec + item.data['Id'] + ':' +
                        item.data['Description'] + ':' +
                        item.data['POTypeId'] + ':' +
                        item.data['Amount'] + ';';
                    }
                }
            });



            form.getForm().submit({
                waitMsg: 'Please wait...',
                params: { record: Ext.encode({ voucherDetails: rec }) },
                success: function () {
                    form.getForm().reset();

                    Ext.getCmp('FinancePurchaseOrderApproval-grid').onNextEntry();
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
        }
    }
} ();

/**
* @desc      JV registration form host window
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.FinancePurchaseOrderApproval
* @class     Ext.core.finance.ux.FinancePurchaseOrderApproval.Window
* @extends   Ext.Window
*/
Ext.core.finance.ux.FinancePurchaseOrderApproval.Window = function (config) {
    Ext.core.finance.ux.FinancePurchaseOrderApproval.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        width: 650,
        height: 450,
        closeAction: 'close',
        modal: true,
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:0px;',
        listeners: {
            show: function () {


                if (this.FinancePurchaseOrderApprovalId != 0) {
                    this.form.load({ params: { Id: this.FinancePurchaseOrderApprovalId} });
                    LoadPOGridDetails(this.FinancePurchaseOrderApprovalId);

                    window.FinancePurchaseOrder.IsContentEditable(this.FinancePurchaseOrderApprovalId, function (response) {

                        if (response.success) {
                            var grid = Ext.getCmp('FinancePurchaseOrderApproval-grid');
                           
                            grid.setDisabled(false);
                            EnableDisable(false);
                        } else {
                            var grid = Ext.getCmp('FinancePurchaseOrderApproval-grid');
                            grid.setDisabled(true);
                            EnableDisable(true);
                        }
                    });
                }
            },
            scope: this
        }
    }, config));
}
Ext.extend(Ext.core.finance.ux.FinancePurchaseOrderApproval.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.core.finance.ux.FinancePurchaseOrderApproval.Form();
        this.grid = new Ext.core.finance.ux.FinancePurchaseOrderApproval.Grid();

        this.items = [this.form, this.grid];

        this.buttons = [{
            text: 'Close',
            iconCls: 'icon-exit',
            handler: this.onClose,
            scope: this
        }];

        Ext.core.finance.ux.FinancePurchaseOrderApproval.Window.superclass.initComponent.call(this, arguments);
    },

    onClose: function () {
        this.close();
    }
});
Ext.reg('FinancePurchaseOrderApproval-window', Ext.core.finance.ux.FinancePurchaseOrderApproval.Window);
var poApprovalSelModel = new Ext.grid.CheckboxSelectionModel();
/**
* @desc      JV grid
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.FinancePurchaseOrderApproval
* @class     Ext.core.finance.ux.FinancePurchaseOrderApprovalMain.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.core.finance.ux.FinancePurchaseOrderApprovalMain.Grid = function (config) {
    Ext.core.finance.ux.FinancePurchaseOrderApprovalMain.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: FinancePurchaseOrder.GetAllPurchaseOrders,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Code',
                direction: 'ASC'
            },
            fields: ['Id', 'ReferenceNo', 'Date', 'IsApproved'],
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
        id: 'FinancePurchaseOrderApprovalMain-grid',
        searchCriteria: {},
        pageSize: 38,
        //height: 300,
        stripeRows: true,
        columnLines: true,
        border: false,
        sm: poApprovalSelModel,
        viewConfig: {
            forceFit: true,
            autoFill: true
        },
        listeners: {
            rowClick: function () {
                if (!this.getSelectionModel().hasSelection()) return;
                var id = this.getSelectionModel().getSelected().get('Id');
                var form = Ext.getCmp('FinancePurchaseOrderApproval-form');
                if (id != null) {

                }
            },
            scope: this,
            rowdblclick: function () {
                if (!this.getSelectionModel().hasSelection()) return;
                var id = this.getSelectionModel().getSelected().get('Id');

                if (id != null) {
                    var hasEditPermission = Ext.core.finance.ux.Reception.getPermission('Approve Requisition', 'CanEdit');
                    if (hasEditPermission) {
                        new Ext.core.finance.ux.FinancePurchaseOrderApproval.Window({
                            FinancePurchaseOrderApprovalId: id,
                            title: 'Edit JV'
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
          poApprovalSelModel,{
              dataIndex: 'ReferenceNo',
              header: 'Reference No',
              sortable: true,
              width: 55,
              menuDisabled: true
          }, {
              dataIndex: 'Date',
              header: 'Date',
              sortable: true,
              width: 55,
              menuDisabled: true
          }, {
              dataIndex: 'IsApproved',
              header: 'Approved',
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
  Ext.extend(Ext.core.finance.ux.FinancePurchaseOrderApprovalMain.Grid, Ext.grid.EditorGridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ mode: 'get' }) };
        this.tbar = [];
        this.bbar = new Ext.PagingToolbar({
            id: 'FinancePurchaseOrderApprovalMain-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.core.finance.ux.FinancePurchaseOrderApprovalMain.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getStore().load({
            params: { start: 0, limit: this.pageSize }
        });
        Ext.core.finance.ux.FinancePurchaseOrderApprovalMain.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('FinancePurchaseOrderApprovalMain-grid', Ext.core.finance.ux.FinancePurchaseOrderApprovalMain.Grid);

var SCriteria = '';


var LoadPOGridDetails = function (selectedRow) {

    var poDetailGrid = Ext.getCmp('FinancePurchaseOrderApproval-grid');
    var poDetailStore = poDetailGrid.getStore();
    var poHeaderId = selectedRow;
    poDetailStore.baseParams = { record: Ext.encode({ voucherHeaderId: poHeaderId, mode: this.mode }) };
    poDetailStore.load({
        params: { start: 0, limit: 100 }
    });

}

var EnableDisable = function (trueFalse) {

    var form = Ext.getCmp('FinancePurchaseOrderApproval-form');
    var descr = Ext.getCmp('Description');
    var dt = Ext.getCmp('Date');
    var ref = Ext.getCmp('ReferenceNo');
    var btnsave = Ext.getCmp('savePOApproval');
    var btnNew = Ext.getCmp('newPOApproval');
    var btnDelete = Ext.getCmp('deletePOApproval');    

    descr.setDisabled(trueFalse);
    dt.setDisabled(trueFalse);
    ref.setDisabled(trueFalse);

    btnsave.setDisabled(trueFalse);
    btnNew.setDisabled(trueFalse);
    btnDelete.setDisabled(trueFalse);


}
/**
* @desc      FinancePurchaseOrderApproval grid
* @author    Dawit Kiros
* @copyright (c) 2010, Cybersoft
* @date      November 01, 2010
* @namespace Ext.core.finance.ux.FinancePurchaseOrderApproval
* @class     Ext.core.finance.ux.FinancePurchaseOrderApproval.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.core.finance.ux.FinancePurchaseOrderApproval.Grid = function (config) {
    Ext.core.finance.ux.FinancePurchaseOrderApproval.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: window.FinancePurchaseOrder.GetAllDetails,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',

            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Code',
                direction: 'ASC'
            },
            fields: ['Id', 'Description', 'POTypeId', 'Amount'],
            remoteSort: true,
            listeners: {
                beforeLoad: function () {
                    Ext.getCmp('FinancePurchaseOrderApproval-grid').body.mask('Loading...', 'x-mask-loading');
                },
                load: function () {
                    var grid = Ext.getCmp('FinancePurchaseOrderApproval-grid');
                    grid.body.unmask();
                },
                loadException: function () {
                    Ext.getCmp('FinancePurchaseOrderApproval-grid').body.unmask();
                },
                remove: function (store) {

                },
                scope: this
            }
        }),
        id: 'FinancePurchaseOrderApproval-grid',
        selectedVoucherTypeId: 0,
        pageSize: 10,
        height: 257,
        stripeRows: true,
        selectedCriteria: '',
        columnLines: true,
        border: true,
        clicksToEdit: 1,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true,
            onEditorKey: function (field, e) {
                var k = e.getKey(), newCell = null, g = this.grid, ed = g.activeEditor;
                var shift = e.shiftKey;
                if (k == e.TAB) {

                    e.stopEvent();
                    ed.completeEdit();
                    if (shift) {
                        newCell = g.walkCells(ed.row, ed.col - 1, -1, this.acceptsNav, this);
                    } else {
                        newCell = g.walkCells(ed.row, ed.col + 1, 1, this.acceptsNav, this);
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
        listeners: {
            //             afteredit: function(e) {
            //                var record = e.record;
            //                var grid = Ext.getCmp('FinancePurchaseOrderApproval-grid');
            //                if (e.field == 'POTypeId') {
            //                    record.set('POTypeId', e.originalValue);
            //                 }
            //             }
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
            dataIndex: 'Description',
            header: 'Description',
            sortable: true,
            width: 200,
            menuDisabled: true,
            align: 'left',
            editor: new Ext.form.TextField({
                allowBlank: false,

                listeners: {
                    focus: function (field) {
                        field.selectText();
                    }
                }
            })

        }, {
            dataIndex: 'POTypeId',
            header: 'PO Type',
            sortable: true,
            width: 90,
            menuDisabled: true,

            xtype: 'combocolumn',
            editor: new Ext.form.ComboBox({
                hiddenName: 'CriteriaId',
                typeAhead: true,
                triggerAction: 'all',
                mode: 'local',
                editable: false,
                store: new Ext.data.DirectStore({
                    reader: new Ext.data.JsonReader({
                        successProperty: 'success',
                        idProperty: 'Id',
                        root: 'data',
                        fields: ['Id', 'Name']
                    }),
                    autoLoad: true,
                    api: { read: window.Tsa.GetPOTypes }
                }),
                valueField: 'Id',
                displayField: 'Name'
            })//,
            //            renderer: function(val) {
            //                index = this.Store.findExact('value', val);
            //            }

        }, {
            dataIndex: 'Amount',
            header: 'Amount',
            sortable: true,
            width: 90,
            menuDisabled: true,
            align: 'right',
            renderer: function (value) {
                return Ext.util.Format.number(value, '0,000.00 ');
            },
            editor: new Ext.form.NumberField({
                allowBlank: false,
                allowNegative: false,
                listeners: {
                    focus: function (field) {
                        field.selectText();
                    }
                }
            })
        }]
    }, config));
};
Ext.extend(Ext.core.finance.ux.FinancePurchaseOrderApproval.Grid, Ext.grid.EditorGridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ voucherTypeId: this.voucherTypeId }) };
        this.tbar = [{}];

        Ext.core.finance.ux.FinancePurchaseOrderApproval.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.addRow();
        Ext.core.finance.ux.FinancePurchaseOrderApproval.Grid.superclass.afterRender.apply(this, arguments);
    },
    addRow: function () {
        var grid = Ext.getCmp('FinancePurchaseOrderApproval-grid');
        var store = grid.getStore();
        var voucher = store.recordType;
        var p = new voucher({


            Amount: 0

        });
        var count = store.getCount();
        grid.stopEditing();
        store.insert(count, p);
        if (count > 0) {
            grid.startEditing(count, 2);
        }
    },
    onNextEntry: function () {
        var form = Ext.getCmp('FinancePurchaseOrderApproval-form').getForm();

        var voucherDetailGrid = Ext.getCmp('FinancePurchaseOrderApproval-grid');
        var voucherDetailStore = voucherDetailGrid.getStore();

        form.findField('Id').reset();


        voucherDetailStore.removeAll();
        voucherDetailGrid.addRow();


    }
});
Ext.reg('FinancePurchaseOrderApproval-grid', Ext.core.finance.ux.FinancePurchaseOrderApproval.Grid);

/**
* @desc      JV panel
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @version   $Id: FinancePurchaseOrderApproval.js, 0.1
* @namespace Ext.core.finance.ux.FinancePurchaseOrderApproval
* @class     Ext.core.finance.ux.FinancePurchaseOrderApproval.Panel
* @extends   Ext.Panel
*/
Ext.core.finance.ux.FinancePurchaseOrderApproval.Panel = function (config) {
    Ext.core.finance.ux.FinancePurchaseOrderApproval.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false,
        tbar: {
            xtype: 'toolbar',
            items: [{
                xtype: 'button',
                text: 'Approve',
                id: 'btnApprove',
                iconCls: 'icon-approve',
                handler: this.onApproveClick,
                disabled: !Ext.core.finance.ux.Reception.getPermission('Approve Requisition', 'CanApprove')
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'DisApprove',
                id: 'btnDisApprove',
                iconCls: 'icon-disapprove',
                handler: this.onDisApproveClick,
                disabled: !Ext.core.finance.ux.Reception.getPermission('Approve Requisition', 'CanApprove')
            }]
        }
    }, config));
}
Ext.extend(Ext.core.finance.ux.FinancePurchaseOrderApproval.Panel, Ext.Panel, {
    initComponent: function () {
        this.items = [{
            xtype: 'FinancePurchaseOrderApprovalMain-grid',
            id: 'FinancePurchaseOrderApprovalMain-grid'
        }];
        Ext.core.finance.ux.FinancePurchaseOrderApproval.Panel.superclass.initComponent.apply(this, arguments);
    },

    onApproveClick: function () {
        var grid = Ext.getCmp('FinancePurchaseOrderApprovalMain-grid');
        
        var rec;
        

        if (!grid.getSelectionModel().hasSelection()) return;
        var selectedPOs = grid.getSelectionModel().getSelections();
        for (var i = 0; i < selectedPOs.length; i++) {
            rec = rec + ':' + selectedPOs[i].get('Id');
        }
        window.FinancePurchaseOrder.ApprovePOs(rec, function (response) {
            if (response.success) {
                Ext.MessageBox.show({
                    title: response.title,
                    msg: response.data,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.INFO,
                    scope: this
                });

            } else {
                Ext.MessageBox.show({
                    title: response.title,
                    msg: response.data,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.ERROR,
                    scope: this
                });
            }
        });
    },
    onDisApproveClick: function () {
        var grid = Ext.getCmp('FinancePurchaseOrderApprovalMain-grid');
        
        var rec;
        

        if (!grid.getSelectionModel().hasSelection()) return;
        var selectedPOs = grid.getSelectionModel().getSelections();
        for (var i = 0; i < selectedPOs.length; i++) {
            rec = rec + ':' + selectedPOs[i].get('Id');
        }
        window.FinancePurchaseOrder.DisApprovePOs(rec, function (response) {
            if (response.success) {
                Ext.MessageBox.show({
                    title: response.title,
                    msg: response.data,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.INFO,
                    scope: this
                });

            } else {
                Ext.MessageBox.show({
                    title: response.title,
                    msg: response.data,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.ERROR,
                    scope: this
                });
            }
        });
    }
   
});
Ext.reg('FinancePurchaseOrderApproval-panel', Ext.core.finance.ux.FinancePurchaseOrderApproval.Panel);