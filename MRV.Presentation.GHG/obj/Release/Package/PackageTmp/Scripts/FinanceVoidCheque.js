Ext.ns('Ext.core.finance.ux.FinanceVoidCheques');
/**
* @desc      Void Cheques form
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.FinanceVoidCheques
* @class     Ext.core.finance.ux.FinanceVoidCheques.Form
* @extends   Ext.form.FormPanel
*/
Ext.core.finance.ux.FinanceVoidCheques.Form = function (config) {
    Ext.core.finance.ux.FinanceVoidCheques.Form.superclass.constructor.call(this, Ext.apply({
        api: {
           // load: FinanceVoidCheques.Get,
            submit: FinanceBankCheques.VoidCheque
        },
        paramOrder: ['Id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'FinanceVoidCheques-form',
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
            name: 'ChequeId',
            xtype: 'textfield',
            hidden: true
        }, {
            name: 'VoidNumber',
            xtype: 'textfield',
            fieldLabel: 'Void Number',
            anchor: '75%',
            allowBlank: false
        }]
    }, config));
}
Ext.extend(Ext.core.finance.ux.FinanceVoidCheques.Form, Ext.form.FormPanel);
Ext.reg('FinanceVoidCheques-form', Ext.core.finance.ux.FinanceVoidCheques.Form);

/**
* @desc      Void Cheques form host window
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.FinanceVoidCheques
* @class     Ext.core.finance.ux.FinanceVoidCheques.Window
* @extends   Ext.Window
*/
Ext.core.finance.ux.FinanceVoidCheques.Window = function (config) {
    Ext.core.finance.ux.FinanceVoidCheques.Window.superclass.constructor.call(this, Ext.apply({
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
                this.form.getForm().findField('ChequeId').setValue(this.chequeId);

                
                var grid = Ext.getCmp('FinanceVoidCheques-grid');
               
                var parentId = this.form.getForm().findField('ChequeId').getValue();
                grid.getStore().load({
                    params: {

                        start: 0,
                        limit: 100,
                        sort: '',
                        dir: '',
                        ChequeId: parentId
                    }
                });
                
            },
            scope: this
        }
    }, config));
}
Ext.extend(Ext.core.finance.ux.FinanceVoidCheques.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.core.finance.ux.FinanceVoidCheques.Form();
        this.grid = new Ext.core.finance.ux.FinanceVoidCheques.Grid();
        this.items = [this.form, this.grid];
        this.buttons = [{
            text: 'Void',
            iconCls: 'icon-void',
            handler: this.onSave,
            scope: this
        }, {
            text: 'Close',
            iconCls: 'icon-exit',
            handler: this.onClose,
            scope: this
        }];

        Ext.core.finance.ux.FinanceVoidCheques.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {

        if (!this.form.getForm().isValid()) return;
        this.form.getForm().submit({
            waitMsg: 'Please wait...',
            success: function () {
                var form = Ext.getCmp('FinanceVoidCheques-form');
                var grid = Ext.getCmp('FinanceVoidCheques-grid');
                form.getForm().findField('VoidNumber').reset();
                var parentId = form.getForm().findField('ChequeId').getValue();
                grid.getStore().load({
                    params: {

                        start: 0,
                        limit: 100,
                        sort: '',
                        dir: '',
                        ChequeId: parentId
                    }
                });
            }
        });
    },
    onClose: function () {
        this.close();
    }
});
Ext.reg('FinanceVoidCheques-window', Ext.core.finance.ux.FinanceVoidCheques.Window);

Ext.core.finance.ux.FinanceVoidCheques.Grid = function (config) {
    Ext.core.finance.ux.FinanceVoidCheques.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: FinanceBankCheques.GetVoidNumbersByChequeId,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|ChequeId',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Code',
                direction: 'ASC'
            },
            fields: ['Id', 'VoidNumber', 'VoidBy', 'VoidDate'],
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
        id: 'FinanceVoidCheques-grid',
        searchCriteria: {},
        pageSize: 1000,
        height: 200,
        stripeRows: true,
        columnLines: true,
        border: true,
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
                var form = Ext.getCmp('FinanceVoidCheques-form');
                if (id > 0) {
                    form.load({ params: { Id: id} });
                }
            },
            scope: this
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
             dataIndex: 'VoidNumber',
             header: 'Void Number',
             sortable: true,
             width: 55,
             menuDisabled: true
         }, {
             dataIndex: 'VoidBy',
             header: 'Void By',
             sortable: true,
             width: 55,
             menuDisabled: true
         }, {
             dataIndex: 'VoidDate',
             header: 'Void Date',
             sortable: true,
             width: 55,
             menuDisabled: true
         }]
    }, config));
};
Ext.extend(Ext.core.finance.ux.FinanceVoidCheques.Grid, Ext.grid.GridPanel, {
    initComponent: function () {

        this.bbar = new Ext.PagingToolbar({
            id: 'FinanceVoidCheques-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        this.bbar.refresh.hide();
        Ext.core.finance.ux.FinanceVoidCheques.Grid.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('FinanceVoidCheques-grid', Ext.core.finance.ux.FinanceVoidCheques.Grid);
