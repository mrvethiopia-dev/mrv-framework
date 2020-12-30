Ext.ns('Ext.core.finance.ux.batchContractEndDateChanger');
/**
* @desc      Payroll Change Salary Or Position  form
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      October 08, 2013
* @namespace Ext.core.finance.ux.batchContractEndDateChanger
* @class     Ext.core.finance.ux.batchContractEndDateChanger.Form
* @extends   Ext.form.FormPanel
*/

Ext.core.finance.ux.batchContractEndDateChanger.Form = function (config) {
    Ext.core.finance.ux.batchContractEndDateChanger.Form.superclass.constructor.call(this, Ext.apply({
        api: {

            submit: batchContractEndDateChanger.BatchCurrencyChange
        },
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:left;',
            msgTarget: 'side'
        },
        id: 'batchContractEndDateChanger-form',
        labelWidth: 115,
        autoHeight: true,
        border: false,
        layout: 'form',
        bodyStyle: 'background:transparent;padding:5px',
        baseCls: 'x-plain',
        items: [
        ]
    }, config));
};
Ext.extend(Ext.core.finance.ux.batchContractEndDateChanger.Form, Ext.form.FormPanel);
Ext.reg('batchContractEndDateChanger-form', Ext.core.finance.ux.batchContractEndDateChanger.Form);


/**
* @desc      batchContractEndDateChanger window
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      October 08, 2013
* @namespace Ext.core.finance.ux.batchContractEndDateChanger
* @class     Ext.core.finance.ux.batchContractEndDateChanger.Window
* @extends   Ext.Window
*/
Ext.core.finance.ux.batchContractEndDateChanger.Window = function (config) {
    Ext.core.finance.ux.batchContractEndDateChanger.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        width: 550,
        height: 550,
        //autoHeight: true,
        closeAction: 'close',
        modal: true,
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;',
        listeners: {
            show: function () {

            },
            scope: this
        }
    }, config));
}
Ext.extend(Ext.core.finance.ux.batchContractEndDateChanger.Window, Ext.Window, {
    initComponent: function () {
        
        this.panel = new Ext.core.finance.ux.batchContractEndDateChanger.Panel();
        this.items = [this.panel];
        this.buttons = [{
            text: 'Save',
            iconCls: 'icon-save',
            handler: this.onSave,
            scope: this
        },  {
            text: 'Close',
            iconCls: 'icon-exit',
            handler: this.onClose,
            scope: this
        }];

        Ext.core.finance.ux.batchContractEndDateChanger.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {
        

    },
    onClose: function () {
        this.close();
    }
});
Ext.reg('batchContractEndDateChanger-window', Ext.core.finance.ux.batchContractEndDateChanger.Window);

Ext.core.finance.ux.batchContractEndDateChanger.Grid = function (config) {
    Ext.core.finance.ux.batchContractEndDateChanger.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: PayrollEmployees.GetAllActiveEmployees,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Code',
                direction: 'ASC'
            },
            fields: ['Id', 'IdentityNo', 'FirstName', 'MiddleName', 'LastName', 'ContractEndDate', 'EmptyCol'],
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
        id: 'batchContractEndDateChanger-grid',
        searchCriteria: {},
        pageSize: 10000,
       
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
            
            scope: this,
            
        },
        columns: [new Ext.erp.ux.grid.PagingRowNumberer(),
        {
            dataIndex: 'Id',
            header: 'Id',
            sortable: true,
            hidden: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'IdentityNo',
            header: 'IdentityNo',
            sortable: true,
            width: 200,
            menuDisabled: false
        }, {
            dataIndex: 'FirstName',
            header: 'First Name',
            sortable: true,
            width: 220,
            menuDisabled: false
        }, {
            dataIndex: 'MiddleName',
            header: 'Middle Name',
            sortable: true,
            width: 200,
            menuDisabled: true
        }, {
            dataIndex: 'LastName',
            header: 'Last Name',
            sortable: true,
            width: 220,
            menuDisabled: true
        },  {
            dataIndex: 'ContractEndDate',
            header: 'ContractEndDate',
            sortable: true,
            width: 250,
            hidden: true,
            menuDisabled: true,
            //renderer: Ext.util.Format.dateRenderer('m/d/Y'),
            editor: new Ext.form.DateField({
                format: 'm/d/Y',
                altFormats: 'c',
                allowBlank: false,
                listeners: {
                    focus: function (field) {
                        field.selectText();
                    }
                }
            })
        }, {
            dataIndex: 'EmptyCol',
            header: ' ',
            sortable: true,
            width: 10,
            hidden: false,
            menuDisabled: true
        }]
    }, config));
};
Ext.extend(Ext.core.finance.ux.batchContractEndDateChanger.Grid, Ext.grid.EditorGridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ mode: 'get' }) };
        
        
        this.bbar = new Ext.PagingToolbar({
            id: 'batchContractEndDateChanger-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.core.finance.ux.batchContractEndDateChanger.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getStore().load({
            params: { start: 0, limit: this.pageSize }
        });
        Ext.core.finance.ux.batchContractEndDateChanger.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('batchContractEndDateChanger-grid', Ext.core.finance.ux.batchContractEndDateChanger.Grid);


/**
* @desc      Employee Detail panel
* @author   Dawit Kiros
* @copyright (c) 2014, LIFT
* @date     June 13, 2013
* @version   $Id: batchContractEndDateChanger.js, 0.1
* @namespace Ext.core.finance.ux.batchContractEndDateChanger
* @class     Ext.core.finance.ux.batchContractEndDateChanger.Panel
* @extends   Ext.Panel
*/
Ext.core.finance.ux.batchContractEndDateChanger.Panel = function (config) {
    Ext.core.finance.ux.batchContractEndDateChanger.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false,
        title: 'Contract End Date',
        id: 'detailPanel',
        tbar: {
            xtype: 'toolbar',
            items: [{
                xtype: 'button',
                text: 'Add Employees',
                id: 'addattachPayrollItemsDetail',
                iconCls: 'icon-UserAdd',
                hidden: true,
                handler: function () {

                }
            }
               ]
        }
    }, config));
};

Ext.extend(Ext.core.finance.ux.batchContractEndDateChanger.Panel, Ext.Panel, {
    initComponent: function () {
        this.grid = new Ext.core.finance.ux.batchContractEndDateChanger.Grid();
        this.items = [{
            xtype: 'batchContractEndDateChanger-grid',
            id: 'batchContractEndDateChanger-grid'
        }];
        Ext.core.finance.ux.batchContractEndDateChanger.Panel.superclass.initComponent.apply(this, arguments);
    },


    onApplyApplicability: function () {

    },
    onRemoveEmpClick: function () {
        var grid = Ext.getCmp('batchContractEndDateChanger-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var record = grid.getSelectionModel().getSelected();


        grid.store.remove(record);


    },

    onRemoveAllClick: function () {

    },
    onRefreshClick: function () {

    }
});
Ext.reg('batchContractEndDateChanger-panel', Ext.core.finance.ux.batchContractEndDateChanger.Panel);
