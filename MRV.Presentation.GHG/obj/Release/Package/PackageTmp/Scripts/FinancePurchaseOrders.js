Ext.ns('Ext.core.finance.ux.FinancePurchaseOrders');
Ext.ns('Ext.core.finance.ux.FinancePurchaseOrdersMain');
Ext.ns('Ext.core.finance.ux.FinancePurchaseOrdersFooter');
/**
* @desc      JV registration form
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.FinancePurchaseOrders
* @class     Ext.core.finance.ux.FinancePurchaseOrders.Form
* @extends   Ext.form.FormPanel
*/
Ext.core.finance.ux.FinancePurchaseOrders.Form = function (config) {
    Ext.core.finance.ux.FinancePurchaseOrders.Form.superclass.constructor.call(this, Ext.apply({
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
        id: 'FinancePurchaseOrders-form',
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
                id: 'newVoucherJV',
                iconCls: 'icon-add',
                handler: this.onNewClick
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Save',
                id: 'savePurchaseOrder',
                iconCls: 'icon-save',
                handler: FinPOHandlers.onSavePOClick
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Remove',
                id: 'deleteVoucherDetailJV',
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
                    name: 'Description',
                    xtype: 'textfield',
                    fieldLabel: 'Description',
                    anchor: '100%',
                    allowBlank: true,
                    hidden: false

                }, {
                    name: 'Date',
                    xtype: 'datefield',
                    fieldLabel: 'Date',
                    altFormats: 'c',
                    editable: true,
                    anchor: '75%',
                    allowBlank: false
                }, {
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

Ext.extend(Ext.core.finance.ux.FinancePurchaseOrders.Form, Ext.form.FormPanel);
Ext.reg('FinancePurchaseOrders-form', Ext.core.finance.ux.FinancePurchaseOrders.Form);
//var k = !Ext.core.finance.ux.Reception.getPermission('Journal Voucher (JV)', 'CanApprove');
var FinPOHandlers = function () {
    return {
        onSavePOClick: function () {
            var grid = Ext.getCmp('FinancePurchaseOrders-grid');
            var form = Ext.getCmp('FinancePurchaseOrders-form');

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

                    Ext.getCmp('FinancePurchaseOrders-grid').onNextEntry();
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
* @namespace Ext.core.finance.ux.FinancePurchaseOrders
* @class     Ext.core.finance.ux.FinancePurchaseOrders.Window
* @extends   Ext.Window
*/
Ext.core.finance.ux.FinancePurchaseOrders.Window = function (config) {
    Ext.core.finance.ux.FinancePurchaseOrders.Window.superclass.constructor.call(this, Ext.apply({
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


                if (this.FinancePurchaseOrdersId != 0) {
                    this.form.load({ params: { Id: this.FinancePurchaseOrdersId} });
                    LoadPOGridDetails(this.FinancePurchaseOrdersId);

                    //                    window.FinancePurchaseOrder.IsContentEditable(this.FinancePurchaseOrdersId, function (response) {

                    //                        if (response.success) {
                    //                            var grid = Ext.getCmp('FinancePurchaseOrders-grid');
                    //                            grid.setDisabled(false);
                    //                        } else {
                    //                            var grid = Ext.getCmp('FinancePurchaseOrders-grid');
                    //                            grid.setDisabled(true);
                    //                        }
                    //                    });
                }
            },
            scope: this
        }
    }, config));
}
Ext.extend(Ext.core.finance.ux.FinancePurchaseOrders.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.core.finance.ux.FinancePurchaseOrders.Form();
        this.grid = new Ext.core.finance.ux.FinancePurchaseOrders.Grid();

        this.items = [this.form, this.grid];

        this.buttons = [{
            text: 'Close',
            iconCls: 'icon-exit',
            handler: this.onClose,
            scope: this
        }];

        Ext.core.finance.ux.FinancePurchaseOrders.Window.superclass.initComponent.call(this, arguments);
    },

    onClose: function () {
        this.close();
    }
});
Ext.reg('FinancePurchaseOrders-window', Ext.core.finance.ux.FinancePurchaseOrders.Window);

/**
* @desc      JV grid
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.FinancePurchaseOrders
* @class     Ext.core.finance.ux.FinancePurchaseOrdersMain.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.core.finance.ux.FinancePurchaseOrdersMain.Grid = function (config) {
    Ext.core.finance.ux.FinancePurchaseOrdersMain.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: FinancePurchaseOrder.GetAllHeaders,
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
        id: 'FinancePurchaseOrdersMain-grid',
        searchCriteria: {},
        pageSize: 38,
        //height: 300,
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
                var form = Ext.getCmp('FinancePurchaseOrders-form');
                if (id != null) {

                }
            },
            scope: this,
            rowdblclick: function () {
                if (!this.getSelectionModel().hasSelection()) return;
                var id = this.getSelectionModel().getSelected().get('Id');

                if (id != null) {
                    var hasEditPermission = Ext.core.finance.ux.Reception.getPermission('JV', 'CanEdit');
                    if (hasEditPermission) {
                        new Ext.core.finance.ux.FinancePurchaseOrders.Window({
                            FinancePurchaseOrdersId: id,
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
          {
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
Ext.extend(Ext.core.finance.ux.FinancePurchaseOrdersMain.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ mode: 'get' }) };
        this.tbar = [];
        this.bbar = new Ext.PagingToolbar({
            id: 'FinancePurchaseOrdersMain-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.core.finance.ux.FinancePurchaseOrdersMain.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getStore().load({
            params: { start: 0, limit: this.pageSize }
        });
        Ext.core.finance.ux.FinancePurchaseOrdersMain.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('FinancePurchaseOrdersMain-grid', Ext.core.finance.ux.FinancePurchaseOrdersMain.Grid);

var SCriteria = '';


var LoadPOGridDetails = function (selectedRow) {

    var poDetailGrid = Ext.getCmp('FinancePurchaseOrders-grid');
    var poDetailStore = poDetailGrid.getStore();
    var poHeaderId = selectedRow;
    poDetailStore.baseParams = { record: Ext.encode({ voucherHeaderId: poHeaderId, mode: this.mode }) };
    poDetailStore.load({
        params: { start: 0, limit: 100 }
    });

}


/**
* @desc      FinancePurchaseOrders grid
* @author    Dawit Kiros
* @copyright (c) 2010, Cybersoft
* @date      November 01, 2010
* @namespace Ext.core.finance.ux.FinancePurchaseOrders
* @class     Ext.core.finance.ux.FinancePurchaseOrders.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.core.finance.ux.FinancePurchaseOrders.Grid = function (config) {
    Ext.core.finance.ux.FinancePurchaseOrders.Grid.superclass.constructor.call(this, Ext.apply({
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
                    Ext.getCmp('FinancePurchaseOrders-grid').body.mask('Loading...', 'x-mask-loading');
                },
                load: function () {
                    var grid = Ext.getCmp('FinancePurchaseOrders-grid');
                    grid.body.unmask();
                },
                loadException: function () {
                    Ext.getCmp('FinancePurchaseOrders-grid').body.unmask();
                },
                remove: function (store) {

                },
                scope: this
            }
        }),
        id: 'FinancePurchaseOrders-grid',
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
            //                var grid = Ext.getCmp('FinancePurchaseOrders-grid');
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
Ext.extend(Ext.core.finance.ux.FinancePurchaseOrders.Grid, Ext.grid.EditorGridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ voucherTypeId: this.voucherTypeId }) };
        this.tbar = [{}];

        Ext.core.finance.ux.FinancePurchaseOrders.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.addRow();
        Ext.core.finance.ux.FinancePurchaseOrders.Grid.superclass.afterRender.apply(this, arguments);
    },
    addRow: function () {
        var grid = Ext.getCmp('FinancePurchaseOrders-grid');
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
        var form = Ext.getCmp('FinancePurchaseOrders-form').getForm();

        var voucherDetailGrid = Ext.getCmp('FinancePurchaseOrders-grid');
        var voucherDetailStore = voucherDetailGrid.getStore();

        form.findField('Id').reset();


        voucherDetailStore.removeAll();
        voucherDetailGrid.addRow();


    }
});
Ext.reg('FinancePurchaseOrders-grid', Ext.core.finance.ux.FinancePurchaseOrders.Grid);

/**
* @desc      JV panel
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @version   $Id: FinancePurchaseOrders.js, 0.1
* @namespace Ext.core.finance.ux.FinancePurchaseOrders
* @class     Ext.core.finance.ux.FinancePurchaseOrders.Panel
* @extends   Ext.Panel
*/
Ext.core.finance.ux.FinancePurchaseOrders.Panel = function (config) {
    Ext.core.finance.ux.FinancePurchaseOrders.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false,
        tbar: {
            xtype: 'toolbar',
            items: [{
                xtype: 'button',
                text: 'Add',
                id: 'addFinancePurchaseOrders',
                iconCls: 'icon-add',
                handler: this.onAddClick
                //disabled: !Ext.core.finance.ux.Reception.getPermission('JV', 'CanAdd')
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Edit',
                id: 'editFinancePurchaseOrders',
                iconCls: 'icon-edit',
                handler: this.onEditClick
                // disabled: !Ext.core.finance.ux.Reception.getPermission('JV', 'CanEdit')
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Delete',
                id: 'deleteFinancePurchaseOrders',
                iconCls: 'icon-delete',
                handler: this.onDeleteClick
                //disabled: !Ext.core.finance.ux.Reception.getPermission('JV', 'CanDelete')
            }, {
                xtype: 'button',
                text: 'Preview',
                id: 'previewFinancePurchaseOrders',
                iconCls: 'icon-preview',
                handler: this.onPreviewClick
                //disabled: !Ext.core.finance.ux.Reception.getPermission('JV', 'CanDelete')
            }]
        }
    }, config));
}
Ext.extend(Ext.core.finance.ux.FinancePurchaseOrders.Panel, Ext.Panel, {
    initComponent: function () {
        this.items = [{
            xtype: 'FinancePurchaseOrdersMain-grid',
            id: 'FinancePurchaseOrdersMain-grid'
        }];
        Ext.core.finance.ux.FinancePurchaseOrders.Panel.superclass.initComponent.apply(this, arguments);
    },

    onAddClick: function () {
        new Ext.core.finance.ux.FinancePurchaseOrders.Window({
            FinancePurchaseOrdersId: 0,
            title: 'Add PO'
        }).show();
    },
    onEditClick: function () {
        var grid = Ext.getCmp('FinancePurchaseOrdersMain-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');
        new Ext.core.finance.ux.FinancePurchaseOrders.Window({
            FinancePurchaseOrdersId: id,
            title: 'Edit PO'
        }).show();
    },
    onDeleteClick: function () {
        var grid = Ext.getCmp('FinancePurchaseOrdersMain-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        Ext.MessageBox.show({
            title: 'Delete',
            msg: 'Are you sure you want to delete the selected PO?',
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
                    FinancePurchaseOrders.Delete(id, function (result, response) {
                        Ext.getCmp('FinancePurchaseOrders-paging').doRefresh();
                    }, this);
                }
            }
        });
    },
    onPreviewClick: function () {
        var grid = Ext.getCmp('FinancePurchaseOrdersMain-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var voucherHeaderId = grid.getSelectionModel().getSelected().get('Id');
        var voucherType = grid.getSelectionModel().getSelected().get('VoucherType');
        var windowParameter = null;
        var reportType = 'Voucher';
        windowParameter = 'width=900,height=700,toolbar=yes,location=yes,directories=yes,status=yes,menubar=yes,scrollbars=yes,copyhistory=yes,resizable=yes';
        window.open('Reports/CReportViewer.aspx?rt=' + reportType + '&id=' + voucherHeaderId + '&vt=' + voucherType, '', windowParameter);

    }
});
Ext.reg('FinancePurchaseOrders-panel', Ext.core.finance.ux.FinancePurchaseOrders.Panel);