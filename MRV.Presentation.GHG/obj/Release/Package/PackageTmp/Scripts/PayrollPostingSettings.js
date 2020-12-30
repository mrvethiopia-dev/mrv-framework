Ext.ns('Ext.core.finance.ux.unitAccountMapping');
Ext.ns('Ext.core.finance.ux.pstPayrollItems');
/**
* @desc      pstPayrollItems form
* @author    Dawit Kiros
* @copyright (c) 2013, LIFT
* @date      April 24, 2013
* @namespace Ext.core.finance.ux.pstPayrollItems
* @class     Ext.core.finance.ux.pstPayrollItems.Form
* @extends   Ext.form.FormPanel
*/
Ext.core.finance.ux.pstPayrollItems.Form = function (config) {
    Ext.core.finance.ux.pstPayrollItems.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: PayrollItems.Get,
            submit: PayrollItems.Save
        },
        paramOrder: ['id'],
        defaults: {
            anchor: '50%',
            msgTarget: 'side',
            labelStyle: 'text-align:right;'
        },
        id: 'pstPayrollItems-form',
        labelWidth: 115,
        height: 27,
        border: false,
        layout: 'form',
        bodyStyle: 'background:transparent;padding:5px',
        baseCls: 'x-plain',
        tbar: [],
        items: []

    }, config));
};
Ext.extend(Ext.core.finance.ux.pstPayrollItems.Form, Ext.form.FormPanel);
Ext.reg('pstPayrollItems-form', Ext.core.finance.ux.pstPayrollItems.Form);

/**
* @desc      pstPayrollItems grid
* @author    Dawit Kiros
* @copyright (c) 2013, LIFT
* @date      April 24, 2013
* @namespace Ext.core.finance.ux.pstPayrollItems
* @class     Ext.core.finance.ux.pstPayrollItems.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.core.finance.ux.pstPayrollItems.Grid = function (config) {
    Ext.core.finance.ux.pstPayrollItems.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: PayrollItems.GetAllForAccountMapping,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Code',
                direction: 'ASC'
            },
            fields: ['Id', 'PItemName', 'IsActive','Account'],
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
        id: 'pstPayrollItems-grid',
        searchCriteria: {},
        pageSize: 20,
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
//                var payrollItemsGrid = Ext.getCmp('pstPayrollItems-grid');
//                if (!payrollItemsGrid.getSelectionModel().hasSelection()) return;
//                var id = this.getSelectionModel().getSelected().get('Id');
//                var unitAccountMapping = Ext.getCmp('unitAccountMapping-grid');



//                unitAccountMapping.getStore().load({
//                    params: {
//                    
//                        start: 0,
//                        limit: 10,
//                        sort: '',
//                        dir: '',

//                        PItemId: id
//                    }
//                });
                //}

            },
            scope: this
        },               
        columns: [
        {
            dataIndex: 'Id',
            header: 'Id',
            sortable: true,
            hidden: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'PItemName',
            header: 'Payroll Item',
            sortable: true,
            width: 220,
            menuDisabled: false
        
        }, {
            dataIndex: 'IsActive',
            header: 'Is Active',
            sortable: true,
            width: 250,
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                if (value)
                    return '<img src="Content/images/app/yes.png"/>';
                else
                    return '<img src="Content/images/app/no.png"/>';
            }

        }, {
            dataIndex: 'Account',
            header: 'Account',
            sortable: true,
            width: 250,
            menuDisabled: true,
            xtype: 'combocolumn',
            editor: new Ext.form.ComboBox({
                hiddenName: 'CostCenterId',
                typeAhead: true,
                triggerAction: 'all',
                mode: 'local',
                store: new Ext.data.DirectStore({
                    reader: new Ext.data.JsonReader({
                        successProperty: 'success',
                        idProperty: 'Id',
                        root: 'data',
                        fields: ['Id', 'CodeAndName']
                    }),
                    autoLoad: true,
                    api: { read: window.Tsa.GetAccounts }
                }),
                valueField: 'Id',
                displayField: 'CodeAndName'
            })
        }]
    }, config));
}

Ext.extend(Ext.core.finance.ux.pstPayrollItems.Grid, Ext.grid.EditorGridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ mode: 'get' }) };
        this.bbar = new Ext.PagingToolbar({
            id: 'pstPayrollItems-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        this.bbar.refresh.hide();
        Ext.core.finance.ux.pstPayrollItems.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getStore().load({
            params: { start: 0, limit: this.pageSize }
        });
        Ext.core.finance.ux.pstPayrollItems.Grid.superclass.afterRender.apply(this, arguments);
    }

});
Ext.reg('pstPayrollItems-grid', Ext.core.finance.ux.pstPayrollItems.Grid);



/**
* @desc      pstPayrollItems panel
* @author    Dawit Kiros
* @copyright (c) 2013, LIFT
* @date      April 24, 2013
* @namespace Ext.core.finance.ux.pstPayrollItems
* @class     Ext.core.finance.ux.pstPayrollItems.Panel
* @extends   Ext.Panel
*/
Ext.core.finance.ux.pstPayrollItems.Panel = function (config) {
    Ext.core.finance.ux.pstPayrollItems.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false
    }, config));
};
Ext.extend(Ext.core.finance.ux.pstPayrollItems.Panel, Ext.Panel, {
    initComponent: function () {
        this.form = new Ext.core.finance.ux.pstPayrollItems.Form();
        this.pstPayrollItemsGrid = new Ext.core.finance.ux.pstPayrollItems.Grid();
        
        this.items = [{
            layout: 'border',
            border: false,
            items: [{
                region: 'center',
                border: false,
                layout: 'fit',
                items: [{
                    layout: 'vbox',
                    layoutConfig: {
                        type: 'hbox',
                        align: 'stretch',
                        pack: 'start'
                    },
                    defaults: {
                        flex: 1
                    },
                    items: [this.form, this.pstPayrollItemsGrid]
                }]
            }]
        }];
        Ext.core.finance.ux.pstPayrollItems.Panel.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('pstPayrollItems-panel', Ext.core.finance.ux.pstPayrollItems.Panel);

/**********************************************************************************************
***********************************************************************************************
********************                                                       ********************
********************                                                       ********************
********************                                                       ********************
********************                 unitAccountMapping GRID               ********************/


/**
* @desc      unitAccountMapping grid
* @author    Dawit Kiros
* @copyright (c) 2013, LIFT
* @date      April 24, 2013
* @namespace Ext.core.finance.ux.unitAccountMapping
* @class     Ext.core.finance.ux.unitAccountMapping.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.core.finance.ux.unitAccountMapping.Grid = function (config) {
    Ext.core.finance.ux.unitAccountMapping.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: PayrollItemsAccount.GetDetailByPItemId,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|PItemId',

            root: 'data',            
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Code',
                direction: 'ASC'
            },
            fields: ['Id', 'Department', 'Account'],
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
        id: 'unitAccountMapping-grid',
        searchCriteria: {},
        pageSize: 1000,
        //height: 600,
        stripeRows: true,
        columnLines: true,
        border: false,
        //sm: selModel,
        viewConfig: {
            forceFit: true,
            autoFill: true
        },
        listeners: {

        },
        columns: [
        {
            dataIndex: 'Id',
            header: 'Id',
            sortable: true,
            hidden: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'Department',
            header: 'Units',
            sortable: true,
            width: 220,
            menuDisabled: false

        }
        , {
            dataIndex: 'Account',
            header: 'Account',
            sortable: true,
            width: 250,
            menuDisabled: true,
            xtype: 'combocolumn',
            editor: new Ext.form.ComboBox({
                hiddenName: 'Account1',
                typeAhead: true,
                triggerAction: 'all',
                mode: 'local',
                store: new Ext.data.DirectStore({
                    reader: new Ext.data.JsonReader({
                        successProperty: 'success',
                        idProperty: 'Id',
                        root: 'data',
                        fields: ['Id', 'CodeAndName']
                    }),
                    autoLoad: true,
                    api: { read: window.Tsa.GetAccounts }
                }),
                valueField: 'Id',
                displayField: 'CodeAndName'
            })
        }
        ]
    }, config));
}

Ext.extend(Ext.core.finance.ux.unitAccountMapping.Grid, Ext.grid.EditorGridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ mode: 'get' }) };
        this.bbar = new Ext.PagingToolbar({
            id: 'unitAccountMapping-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        this.bbar.refresh.hide();
        Ext.core.finance.ux.unitAccountMapping.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getStore().load({
            params: { start: 0, limit: this.pageSize, PItemId:'' }
        });
        Ext.core.finance.ux.unitAccountMapping.Grid.superclass.afterRender.apply(this, arguments);
    }

});
Ext.reg('unitAccountMapping-grid', Ext.core.finance.ux.unitAccountMapping.Grid);



/**
* @desc      unitAccountMapping panel
* @author    Dawit Kiros
* @copyright (c) 2013, LIFT
* @date      April 24, 2013
* @namespace Ext.core.finance.ux.unitAccountMapping
* @class     Ext.core.finance.ux.unitAccountMapping.Panel
* @extends   Ext.Panel
*/
Ext.core.finance.ux.unitAccountMapping.Panel = function (config) {
    Ext.core.finance.ux.unitAccountMapping.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false
    }, config));
};
Ext.extend(Ext.core.finance.ux.unitAccountMapping.Panel, Ext.Panel, {
    initComponent: function () {
       // this.form = new Ext.core.finance.ux.unitAccountMapping.Form();
        this.unitAccountGrid = new Ext.core.finance.ux.unitAccountMapping.Grid();
        
        this.items = [{
            layout: 'border',
            border: false,
            items: [{
                region: 'center',
                border: false,
                layout: 'fit',
                items: [{
                    layout: 'vbox',
                    layoutConfig: {
                        type: 'hbox',
                        align: 'stretch',
                        pack: 'start'
                    },
                    defaults: {
                        flex: 1
                    },
                    items: [ this.unitAccountGrid]
                }]
            }]
        }];
        Ext.core.finance.ux.unitAccountMapping.Panel.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('unitAccountMapping-panel', Ext.core.finance.ux.unitAccountMapping.Panel);

















/*******************                                                       ********************
********************                                                       ********************
********************                                                       ********************
********************                                                       ********************
***********************************************************************************************
***********************************************************************************************/