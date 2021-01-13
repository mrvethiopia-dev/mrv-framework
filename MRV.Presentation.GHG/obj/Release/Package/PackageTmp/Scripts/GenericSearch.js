Ext.ns('Ext.mrv.ghginventory.ux.genericSearch');
Ext.mrv.ghginventory.ux.genericSearch.Observable = new Ext.util.Observable();
Ext.mrv.ghginventory.ux.genericSearch.Observable.addEvents('genericSearch');

/**
* @desc      Customer selection window
* @author    Dawit Kiros

* @namespace Ext.mrv.ghginventory.ux.genericSearch
* @class     Ext.mrv.ghginventory.ux.genericSearch.Window
* @extends   Ext.Window
*/
Ext.mrv.ghginventory.ux.genericSearch.Window = function (config) {
    Ext.mrv.ghginventory.ux.genericSearch.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'form',
        width: 500,
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        saveMode: 'add',
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;'
    }, config));
};
Ext.extend(Ext.mrv.ghginventory.ux.genericSearch.Window, Ext.Window, {
    initComponent: function () {
        this.grid = new Ext.mrv.ghginventory.ux.genericSearch.Grid({ tableName: this.tableName });
        this.items = [this.grid];
        this.bbar = [{
            xtype: 'tbfill'
        }, {
            text: 'Select',
            iconCls: 'icon-accept',
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
        Ext.mrv.ghginventory.ux.genericSearch.Window.superclass.initComponent.call(this, arguments);
    },
    onSelect: function () {
        if (!this.grid.getSelectionModel().hasSelection()) return;
        var result = {};
        result['Id'] = this.grid.getSelectionModel().getSelected().get('Id');
        result['Name'] = this.grid.getSelectionModel().getSelected().get('Name');
        Ext.mrv.ghginventory.ux.genericSearch.Observable.fireEvent('genericSearch', result);
        this.close();
    },
    onClose: function () {
        this.close();
    }
});
Ext.reg('generic-window', Ext.mrv.ghginventory.ux.genericSearch.Window);

/**
* @desc      Customer grid
* @author    Dawit Kiros
* @copyright (c) 2010, Panafric
* @date      December 08, 2013
* @namespace Ext.mrv.ghginventory.ux.genericSearch
* @class     Ext.mrv.ghginventory.ux.genericSearch.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.mrv.ghginventory.ux.genericSearch.Grid = function (config) {
    Ext.mrv.ghginventory.ux.genericSearch.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: Ifms.Search,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Code',
                direction: 'ASC'
            },
            fields: ['Id', 'Name'],
            remoteSort: true,
            listeners: {
                beforeLoad: function () { Ext.getCmp('generic-grid').body.mask('Loading...', 'x-mask-loading'); },
                load: function () { Ext.getCmp('generic-grid').body.unmask(); },
                loadException: function () { Ext.getCmp('generic-grid').body.unmask(); },
                scope: this
            }
        }),
        id: 'generic-grid',
        pageSize: 10,
        height: 300,
        stripeRows: true,
        border: true,
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
            dataIndex: 'Name',
            header: 'Name',
            sortable: true,
            width: 100,
            menuDisabled: true
        }]
    }, config));
};
Ext.extend(Ext.mrv.ghginventory.ux.genericSearch.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ tableName: this.tableName }) };
        this.bbar = new Ext.PagingToolbar({
            id: 'generic-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.mrv.ghginventory.ux.genericSearch.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getStore().load({ params: { start: 0, limit: this.pageSize} });
        Ext.mrv.ghginventory.ux.genericSearch.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('generic-grid', Ext.mrv.ghginventory.ux.genericSearch.Grid);