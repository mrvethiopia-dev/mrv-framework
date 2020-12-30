Ext.ns('Ext.core.finance.ux.financeAccountPositionMapping');
/**
* @desc      Payroll Change Salary Or Position  form
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      October 08, 2013
* @namespace Ext.core.finance.ux.financeAccountPositionMapping
* @class     Ext.core.finance.ux.financeAccountPositionMapping.Form
* @extends   Ext.form.FormPanel
*/

Ext.core.finance.ux.financeAccountPositionMapping.Form = function (config) {
    Ext.core.finance.ux.financeAccountPositionMapping.Form.superclass.constructor.call(this, Ext.apply({
        api: {

            submit: PayrollEmployees.BatchCurrencyChange
        },
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:left;',
            msgTarget: 'side'
        },
        id: 'financeAccountPositionMapping-form',
        labelWidth: 115,
        autoHeight: true,
        border: false,
        layout: 'form',
        bodyStyle: 'background:transparent;padding:5px',
        baseCls: 'x-plain',
        items: [
        { id: 'ControlAccountId',
                    hiddenName: 'ControlAccountId',
                    xtype: 'combo',
                    fieldLabel: 'Control Account',
                    typeAhead: true,
                    hideTrigger: true,
                    minChars: 1,
                    listWidth: 280,
                    mode: 'remote',
                    tpl: '<tpl for="."><div ext:qtip="{Id}. {Name}" class="x-combo-list-item">' +
                            '<h3><span>{Account}</span></h3> {Name}</div></tpl>',
                    store: new Ext.data.DirectStore({
                        reader: new Ext.data.JsonReader({
                            successProperty: 'success',
                            idProperty: 'Id',
                            totalProperty: 'total',
                            root: 'data',
                            fields: ['Id', 'Account', 'Name']
                        }),
                        //autoLoad: true,
                        //baseParams: { start: 0, limit: 10 },
                        api: { read: Tsa.GetControlAccounts }
                    }),
                    valueField:'Id',
                    displayField: 'Account',
                    pageSize: 10,
            listeners: {
                select: function() {
                    var cntlAcccount = Ext.getCmp('ControlAccountId').getValue();

                    var jrnlGrid = Ext.getCmp('financeAccountPositionMapping-grid');
                    jrnlGrid.getStore().load({
                        params: {
                            start: 0,
                            limit: 1000,
                            sort: '',
                            dir: '',
                            AccountId: cntlAcccount
                        }

                    });

                }
            }


        }
        ]
    }, config));
};
Ext.extend(Ext.core.finance.ux.financeAccountPositionMapping.Form, Ext.form.FormPanel);
Ext.reg('financeAccountPositionMapping-form', Ext.core.finance.ux.financeAccountPositionMapping.Form);


/**
* @desc      financeAccountPositionMapping window
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      October 08, 2013
* @namespace Ext.core.finance.ux.financeAccountPositionMapping
* @class     Ext.core.finance.ux.financeAccountPositionMapping.Window
* @extends   Ext.Window
*/
Ext.core.finance.ux.financeAccountPositionMapping.Window = function (config) {
    Ext.core.finance.ux.financeAccountPositionMapping.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        width: 450,
        height: 350,
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
Ext.extend(Ext.core.finance.ux.financeAccountPositionMapping.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.core.finance.ux.financeAccountPositionMapping.Form();
        this.panel = new Ext.core.finance.ux.financeAccountPositionMapping.Panel();
        this.items = [this.form, this.panel];
        this.buttons = [{
            text: 'Save',
            iconCls: 'icon-save',
            handler: this.onSave,
            scope: this
        }, {
            text: 'Reset',
            iconCls: 'icon-Reset',
            handler: function () {
                Ext.getCmp('financeAccountPositionMapping-form').getForm().reset();
                var grid = Ext.getCmp('financeAccountPositionMapping-grid');
                var store = grid.getStore();
                store.removeAll();
            },
            scope: this
        }, {
            text: 'Close',
            iconCls: 'icon-exit',
            handler: this.onClose,
            scope: this
        }];

        Ext.core.finance.ux.financeAccountPositionMapping.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {
        
        var cntrlAccount = Ext.getCmp('ControlAccountId').getValue();

        Ext.Ajax.timeout = 6000000;
        Ext.MessageBox.show({
            msg: 'Saving attachment. Please wait....',
            progressText: 'Collecting...',
            width: 300,
            wait: true,
            waitConfig: { interval: 200 }
        });

        var gridDetail = Ext.getCmp('financeAccountPositionMapping-grid');
       
        var rec = '';

        if (cntrlAccount == '') {
            Ext.MessageBox.show({
                title: 'Error',
                msg: 'Please select the control account!',
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.ERROR,
                scope: this
            });
            return;
        }
        
        var selectedEmps = gridDetail.getStore();
        
        selectedEmps.each(function (item) {
            rec = rec + item.data['Id'] + ';';

        });


        FinanceAccountPositionMapping.Save(rec, cntrlAccount, function (result, response) {
            if (result.success) {
                Ext.MessageBox.hide();
                Ext.MessageBox.alert('Account-Position', 'Mapping has been completed successfully.');
            }
        });


    },
    onClose: function () {
        this.close();
    }
});
Ext.reg('financeAccountPositionMapping-window', Ext.core.finance.ux.financeAccountPositionMapping.Window);


/**
* @desc      Employee Detail grid
* @author   Dawit Kiros
* @copyright (c) 2014, LIFT
* @date     June 13, 2013
* @namespace Ext.core.finance.ux.financeAccountPositionMapping
* @class     Ext.core.finance.ux.financeAccountPositionMapping.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.core.finance.ux.financeAccountPositionMapping.Grid = function (config) {
    Ext.core.finance.ux.financeAccountPositionMapping.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: FinanceAccountPositionMapping.GetDetailByAccountId,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|AccountId',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'ASC'
            },
            fields: ['Id', 'Name'],
            remoteSort: false,
            listeners: {
                beforeLoad: function () {
                    Ext.getCmp('financeAccountPositionMapping-grid').body.mask('Loading...', 'x-mask-loading');
                },
                load: function () {
                    var grid = Ext.getCmp('financeAccountPositionMapping-grid');
                    //var store = grid.getStore();

                    grid.body.unmask();
                },
                loadException: function () {
                    Ext.getCmp('financeAccountPositionMapping-grid').body.unmask();
                },
                remove: function (store) {
                    var grid = Ext.getCmp('financeAccountPositionMapping-grid');

                },
                scope: this
            }
        }),
        id: 'financeAccountPositionMapping-grid',

        pageSize: 1000,
        stripeRows: true,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        border: false,
        columnLines: true,
        height: 170,
        clicksToEdit: 1,
        listeners: {
            afteredit: function (e) {

            }
        },
        viewConfig: {
            forceFit: true,
            autoFill: true
        },
        columns: [new Ext.erp.ux.grid.PagingRowNumberer({
            width: 35
        }), {
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
            width: 220,
            menuDisabled: false
        }]
    }, config));
};
Ext.extend(Ext.core.finance.ux.financeAccountPositionMapping.Grid, Ext.grid.EditorGridPanel, {
    initComponent: function () {

        Ext.core.finance.ux.financeAccountPositionMapping.Grid.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('financeAccountPositionMapping-grid', Ext.core.finance.ux.financeAccountPositionMapping.Grid);



/**
* @desc      Employee Detail panel
* @author   Dawit Kiros
* @copyright (c) 2014, LIFT
* @date     June 13, 2013
* @version   $Id: financeAccountPositionMapping.js, 0.1
* @namespace Ext.core.finance.ux.financeAccountPositionMapping
* @class     Ext.core.finance.ux.financeAccountPositionMapping.Panel
* @extends   Ext.Panel
*/
Ext.core.finance.ux.financeAccountPositionMapping.Panel = function (config) {
    Ext.core.finance.ux.financeAccountPositionMapping.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false,
        title: 'Positions',
        id: 'detailPanel',
        tbar: {
            xtype: 'toolbar',
            items: [{
                xtype: 'button',
                text: 'Add Positions',
                id: 'addattachPayrollItemsDetail',
                iconCls: 'icon-UserAdd',
                handler: function () {
                    var criteria = 'POSITIONS';
                    new Ext.core.finance.ux.positionsPicker.Window({
                        SelectedCriteria: criteria
                    }).show();
                }
            }, {
                xtype: 'button',
                text: 'Remove',
                id: 'removeEmpD',
                iconCls: 'icon-UserRemove',
                handler: this.onRemoveEmpClick,
                hidden: false
                ///disabled: !Ext.core.finance.ux.Reception.getPermission('Employee Additions/Deductions', 'CanDelete')
            }
               ]
        }
    }, config));
};

Ext.extend(Ext.core.finance.ux.financeAccountPositionMapping.Panel, Ext.Panel, {
    initComponent: function () {
        this.grid = new Ext.core.finance.ux.financeAccountPositionMapping.Grid();
        this.items = [{
            xtype: 'financeAccountPositionMapping-grid',
            id: 'financeAccountPositionMapping-grid'
        }];
        Ext.core.finance.ux.financeAccountPositionMapping.Panel.superclass.initComponent.apply(this, arguments);
    },


    onApplyApplicability: function () {

    },
    onRemoveEmpClick: function () {
        var grid = Ext.getCmp('financeAccountPositionMapping-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var record = grid.getSelectionModel().getSelected();


        grid.store.remove(record);


    },

    onRemoveAllClick: function () {

    },
    onRefreshClick: function () {

    }
});
Ext.reg('financeAccountPositionMapping-panel', Ext.core.finance.ux.financeAccountPositionMapping.Panel);
