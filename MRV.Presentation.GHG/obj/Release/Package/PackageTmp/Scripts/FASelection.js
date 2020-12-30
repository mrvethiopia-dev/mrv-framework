Ext.ns('Ext.core.finance.ux.FASelection');
/**
* @desc      FA Selection registration form
* @author    Dawit Kiros
* @copyright (c) 2012, LIFT
* @date      April 24, 2012
* @namespace Ext.core.finance.ux.FA Selection
* @class     Ext.core.finance.ux.FA Selection.Form
* @extends   Ext.form.FormPanel
*/

Ext.core.finance.ux.FASelection.Form = function (config) {
    Ext.core.finance.ux.FASelection.Form.superclass.constructor.call(this, Ext.apply({
        paramOrder: ['Id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side',
            bodyStyle: 'background:transparent;padding:5px'
        },
        id: 'FASelection-form',
        labelWidth: 115,
        height: 100,
        border: false,
        layout: 'form',
        bodyStyle: 'background:transparent;padding:5px',
        baseCls: 'x-plain',
        items: [{
            name: 'custId',
            xtype: 'textfield',
            hidden:true,
            fieldLabel : 'Custodian Id'
        }]
    }, config));
};
Ext.extend(Ext.core.finance.ux.FASelection.Form, Ext.form.FormPanel);
Ext.reg('FASelection-form', Ext.core.finance.ux.FASelection.Form);


var FASelectionModel = new Ext.grid.CheckboxSelectionModel();

/**
* @desc      FASelection grid
* @author    Dawit Kiros
* @copyright (c) 2012, LIFT
* @date      April 24, 2012
* @namespace Ext.core.finance.ux.FASelection
* @class     Ext.core.finance.ux.FASelection.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.core.finance.ux.FASelection.Grid = function (config) {
    Ext.core.finance.ux.FASelection.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: FixedAsset.GetAllByCustodian,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Code',
                direction: 'ASC'
            },
            //fields: ['Id', 'IdentityNo', 'FirstName', 'MiddleName', 'LastName', 'SalaryETB', 'Position', 'Department', 'HasPension'],
            fields: ['Id', 'GRNDate', 'InvoiceNumber', 'Description', 'ReferenceCode', 'Unit','UnitId', 'Qty', 'PurchaseCost', 'emptyCol'],
            remoteSort: true,
            listeners: {
                beforeLoad: function () { Ext.getCmp('FASelection-grid').body.mask('Loading...', 'x-mask-loading'); },
                load: function () { Ext.getCmp('FASelection-grid').body.unmask(); },
                loadException: function () { Ext.getCmp('FASelection-grid').body.unmask(); },
                scope: this
            }
        }),
        id: 'FASelection-grid',
        pageSize: 100,
        height: 300,
        stripeRows: true,
        border: true,
        sm: FASelectionModel,
        viewConfig: {
            forceFit: false,
            autoExpandColumn: 'IdentityNumber',
            autoFill: true
        },
        columns: [
        //new Ext.erp.ux.grid.PagingRowNumberer({
        //    width: 35
        //}),
        FASelectionModel,
        {
            dataIndex: 'Id',
            header: 'Id',
            sortable: false,
            hidden: true,
            width: 40,
            menuDisabled: true
        }, new Ext.grid.RowNumberer(), {
            dataIndex: 'GRNDate',
            header: 'GRN Date',
            sortable: false,
            width: 90//,
            //menuDisabled: true
        }, {
            dataIndex: 'InvoiceNumber',
            header: 'GRN Number',
            sortable: false,
            width: 90,
            menuDisabled: true
        }, {
            dataIndex: 'Description',
            header: 'Description',
            sortable: false,
            width: 210,
            menuDisabled: true
        }, {
            dataIndex: 'ReferenceCode',
            header: 'Tag Number',
            sortable: false,
            width: 210,
            menuDisabled: true
        }, {
            dataIndex: 'Unit',
            header: 'Unit',
            sortable: false,
            width: 30,
            menuDisabled: true
        }, {
            dataIndex: 'UnitId',
            header: 'UnitId',
            sortable: false,
            width: 50,
            hidden: true,
            menuDisabled: true,
            align: 'left'
        }, {
            dataIndex: 'Qty',
            header: 'Qty',
            sortable: false,
            width: 50,
            menuDisabled: true,
            align: 'right'
        }, {
            dataIndex: 'PurchaseCost',
            header: 'Unit Price',
            sortable: false,
            width: 90,
            menuDisabled: true,
            align: 'right'
        }, {
            dataIndex: 'emptyCol',
            header: ' ',
            sortable: false,
            width: 10,
            menuDisabled: true,
            align: 'right'
        }]
    }, config));
}
Ext.extend(Ext.core.finance.ux.FASelection.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ searchParam: '' }) };
        this.bbar = new Ext.PagingToolbar({
            id: 'FASelection-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.core.finance.ux.FASelection.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        //var form = Ext.getCmp('FASelection-form').getForm();
        //var _CUSTID = this._CUSTODIAN_ID;
        
        //this.getStore().load({
        //    params: { start: 0, limit: this.pageSize, CustodianId: _CUSTID }
        //});
        Ext.core.finance.ux.fixedAsset.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('FASelection-grid', Ext.core.finance.ux.FASelection.Grid);


var _CUSTODIAN_ID = this.CustodianId;
var countFAsAdded = 0;
/**
* @desc      FASelection window
* @author    Dawit Kiros
* @editor    Dawit Kiros Woldemichael
* @copyright (c) 2012, LIFT
* @date      April 24, 2012
* @namespace Ext.core.finance.ux.FASelection
* @class     Ext.core.finance.ux.FASelection.Window
* @extends   Ext.Window
*/
Ext.core.finance.ux.FASelection.Window = function (config) {
    Ext.core.finance.ux.FASelection.Window.superclass.constructor.call(this, Ext.apply({
        title: 'FA Selection Criteria',
        width: 750,
        height: 490,
        layout: 'hbox',
        bodyStyle: 'margin: 5px; padding-right: 10px',
        align: 'stretch',
        closeAction: 'close',
        modal: true,
        resizable: false,
        buttonAlign: 'right',
        listeners: {
            show: function () {
                this.form.getForm().findField('custId').setValue(this.CustodianId);

                var dvDetailGrid = Ext.getCmp('FASelection-grid');
                var dvDetailStore = dvDetailGrid.getStore();
                
                dvDetailStore.baseParams = { record: Ext.encode({ searchParam: '', custodianId: this.CustodianId }) };
                dvDetailStore.load({
                    params: { start: 0, limit: 100 }
                });
            }
        }

    }, config));
}
Ext.extend(Ext.core.finance.ux.FASelection.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.core.finance.ux.FASelection.Form();
        this.grid = new Ext.core.finance.ux.FASelection.Grid();
        
        this.items = [{
            xtype: 'panel',
            width: 10,
            bodyStyle: 'background:transparent',
            border: false,
            flex: 1
        }, {
            xtype: 'panel',
            layout: 'vbox',
            height: 430,
            width: 700,
            bodyStyle: 'background:transparent',
            border: false,
            flex: 1,
            align: 'stretch',
            items: [{
                xtype: 'panel',
                title: 'Selection Criteria',
                height: 130,
                layout: 'fit',
                width: 700,
                bodyStyle: 'background:transparent; padding-top: 10px;',
                flex: 1,
                items: [this.form]
            }, {
                xtype: 'panel',
                height: 30,
                width: 500,
                bodyStyle: 'background:transparent;',
                border: false,
                flex: 1,
                items: [{
                    xtype: 'toolbar',
                    style: {
                        background: 'none',
                        border: 'none',
                        paddingTop: '5px'
                    },
                    items: []

                }]
            }, {
                xtype: 'panel',
                layout: 'fit',
                width: 700,
                height: 270,
                bodyStyle: 'background:transparent',
                flex: 1,
                items: [this.grid]
            }]
        }];
        this.bbar = [{
            xtype: 'tbfill'
        }, {
            text: 'Select',
            iconCls: 'icon-selection',
            scope: this,
            handler: this.onSelect
        }, {
            xtype: 'tbseparator'
        }, {
            text: 'Close',
            iconCls: 'icon-exit',
            handler: this.onClose,
            scope: this
        }];
        Ext.core.finance.ux.FASelection.Window.superclass.initComponent.call(this, arguments);
    },
    onSelect: function () {
        var grid;

        var callerName = this.Caller;

        switch (callerName) {
            case 'StoreIssueVoucher':
                grid = Ext.getCmp('FAVouchersSIV-grid');
                break;
            case 'GoodsReturnVoucher':
                grid = Ext.getCmp('FAVouchersGRV-grid');
                break;
            case 'AssetTransferVoucher':
                grid = Ext.getCmp('FAVouchersATV-grid');
                break;
        }
        var selectionGrid = Ext.getCmp('FASelection-grid');
        if (!selectionGrid.getSelectionModel().hasSelection()) return;
        var selectedEmployees = selectionGrid.getSelectionModel().getSelections();
        var store = grid.getStore();
        var employee = store.recordType;
                

        var empRecords = [];
        var gridStore = grid.getStore();

        grid.getStore().each(function (model) {
            empRecords.push(model.data);
        });
        countFAsAdded = 0;
        for (var i = 0; i < selectedEmployees.length; i++) {
                       

            var p = new employee({

                Id: 0,
                FixedAssetId: selectedEmployees[i].get('Id'),
                FixedAsset: selectedEmployees[i].get('Description'),
                UnitId: selectedEmployees[i].get('UnitId'),
                Unit: 'PCS',
                Quantity: 1,
                UnitPrice: selectedEmployees[i].get('PurchaseCost'),
                TotalPrice: selectedEmployees[i].get('PurchaseCost'),
            });

            var count = store.getCount();

            // this piece of code will stop from loading similar or selected FAs onto the destination grid
            try {

                var recordIndex = gridStore.findBy(
                function (record, id) {
                    if (record.get('FixedAssetId') == p.data.Id) {
                        return true;
                    }
                    return false;
                });

                if (recordIndex != -1) {
                }
                else {
                    store.insert(count, p);
                }
            }
            catch (e) {
                var exc = e.Message;
                continue;
            }
            countFAsAdded++;
        }
    },
    onClose: function () {
        this.close();
    }
});
Ext.reg('FASelection-window', Ext.core.finance.ux.FASelection.Window);