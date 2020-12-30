Ext.ns('Ext.core.finance.ux.payrollPeriods');
/**
* @desc      Periods registration form
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.payrollPeriods
* @class     Ext.core.finance.ux.payrollPeriods.Form
* @extends   Ext.form.FormPanel
*/
Ext.core.finance.ux.payrollPeriods.Form = function (config) {
    Ext.core.finance.ux.payrollPeriods.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: PayrollBankBranches.Get,
            submit: PayrollBankBranches.Save
        },
        paramOrder: ['Id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:left;',
            msgTarget: 'side'
        },
        id: 'payrollPeriods-form',
        padding: 5,
        labelWidth: 150,
        autoHeight: true,
        border: true,
        baseCls: 'x-plain',
        items: [{ }]
    }, config));
}
Ext.extend(Ext.core.finance.ux.payrollPeriods.Form, Ext.form.FormPanel);
Ext.reg('payrollPeriods-form', Ext.core.finance.ux.payrollPeriods.Form);

/**
* @desc      Periods registration form host window
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.payrollPeriods
* @class     Ext.core.finance.ux.payrollPeriods.Window
* @extends   Ext.Window
*/
Ext.core.finance.ux.payrollPeriods.Window = function (config) {
    Ext.core.finance.ux.payrollPeriods.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        width: 700,
        height: 350,
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
Ext.extend(Ext.core.finance.ux.payrollPeriods.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.core.finance.ux.payrollPeriods.Form();
        this.grid = new Ext.core.finance.ux.payrollPeriods.Grid();
        this.items = [this.grid];
        this.buttons = [{
            text: 'Close Period',
            iconCls: 'icon-Close',
            handler: this.onDeactivate,
            scope: this
        }, {
            text: 'Activate Period',
            iconCls: 'icon-Unclose',
            handler: this.onActivate,
            scope: this
        }, {
            text: 'Exit',
            iconCls: 'icon-exit',
            handler: this.onClose,
            disabled: false,
            scope: this
        }];

        Ext.core.finance.ux.payrollPeriods.Window.superclass.initComponent.call(this, arguments);
    },
    onDeactivate: function () {
        var grid = Ext.getCmp('payrollPeriods-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var periodId = grid.getSelectionModel().getSelected().get('Id');
        window.Tsa.ClosePeriod(periodId, function (response) {
            if (response.success) {
                Ext.MessageBox.show({
                    title: 'Period Closing',
                    msg: response.data,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.INFO,
                    scope: this
                });
                grid.getStore().load({
                    params: {

                        start: 0,
                        limit: 1000,
                        sort: '',
                        dir: '',
                        record: Ext.encode({ mode: 'get' })
                    }
                });
            } else {
                Ext.MessageBox.show({
                    title: 'Period Closing',
                    msg: response.data,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.ERROR,
                    scope: this
                });
            }

        });

    },
    onActivate: function () {
        var grid = Ext.getCmp('payrollPeriods-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var periodId = grid.getSelectionModel().getSelected().get('Id');
        window.Tsa.ActivatePeriod(periodId, function (response) {
            if (response.success) {
                Ext.MessageBox.show({
                    title: 'Period Activated',
                    msg: response.data,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.INFO,
                    scope: this
                });
                grid.getStore().load({
                    params: {

                        start: 0,
                        limit: 1000,
                        sort: '',
                        dir: '',
                        record: Ext.encode({ mode: 'get' })
                    }
                });
            } else {
                Ext.MessageBox.show({
                    title: 'Period Activated',
                    msg: response.data,
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
Ext.reg('payrollPeriods-window', Ext.core.finance.ux.payrollPeriods.Window);

/**
* @desc      Periods grid
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.payrollPeriods
* @class     Ext.core.finance.ux.payrollPeriods.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.core.finance.ux.payrollPeriods.Grid = function (config) {
    Ext.core.finance.ux.payrollPeriods.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: Tsa.GetAllActivePeriods,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Code',
                direction: 'ASC'
            },
            fields: ['Id', 'Icon', 'FiscalYear', 'Name', 'StartDate', 'EndDate', 'TotalWorkingDays', 'IsActive'],
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
        id: 'payrollPeriods-grid',
        searchCriteria: {},
        pageSize: 30,
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
              

            },
            scope: this,
            rowdblclick: function () {
           
            }
        },
        columns: [
        PItemsSelModel, {
            dataIndex: 'Id',
            header: 'Id',
            sortable: true,
            hidden: true,
            width: 50,
            menuDisabled: true
        }, {
            dataIndex: 'Icon',
            header: '',
            sortable: false,
            width: 17,
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
            return '<img src="Content/images/app/calendar_edit.png"/>';
            }

        }, {
            dataIndex: 'FiscalYear',
            header: 'Fiscal Year',
            sortable: true,
            width: 100,
            menuDisabled: false
        }, {
            dataIndex: 'Name',
            header: 'Period',
            sortable: true,
            width: 200,
            menuDisabled: true
        }, {
            dataIndex: 'StartDate',
            header: 'Start Date',
            sortable: true,
            width: 175,
            menuDisabled: true
        }, {
            dataIndex: 'EndDate',
            header: 'End Date',
            sortable: true,
            width: 175,
            menuDisabled: true
        }, {
            dataIndex: 'TotalWorkingDays',
            header: 'Total Working Days',
            sortable: true,
            width: 75,
            menuDisabled: true
        }, {
            dataIndex: 'IsActive',
            header: '(Payroll) Is Closed',
            sortable: true,
            width: 150,
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                if (value)
                    return '<img src="Content/images/app/yes.png"/>';
                else
                    return '<img src="Content/images/app/no.png"/>';
            }

        }]
    }, config));
};
Ext.extend(Ext.core.finance.ux.payrollPeriods.Grid, Ext.grid.EditorGridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ mode: 'get' }) };
        this.tbar = [];
        this.bbar = new Ext.PagingToolbar({
            id: 'payrollPeriods-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.core.finance.ux.payrollPeriods.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getStore().load({
            params: { start: 0, limit: this.pageSize }
        });
        Ext.core.finance.ux.payrollPeriods.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('payrollPeriods-grid', Ext.core.finance.ux.payrollPeriods.Grid);

/**
* @desc      Payroll Items panel
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @version   $Id: payrollPeriods.js, 0.1
* @namespace Ext.core.finance.ux.payrollPeriods
* @class     Ext.core.finance.ux.payrollPeriods.Panel
* @extends   Ext.Panel
*/
Ext.core.finance.ux.payrollPeriods.Panel = function (config) {
    Ext.core.finance.ux.payrollPeriods.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false,
        tbar: {
            xtype: 'toolbar',
            items: [ {
                xtype: 'button',
                text: 'Close',
                id: 'btnCloseUnclose',
                iconCls: 'icon-exclamation',

                handler: this.OnCloseUncloseClick
            }]
        }
    }, config));
}
Ext.extend(Ext.core.finance.ux.payrollPeriods.Panel, Ext.Panel, {
    initComponent: function () {
        this.items = [{
            xtype: 'payrollPeriods-grid',
            id: 'payrollPeriods-grid'
        }];
        Ext.core.finance.ux.payrollPeriods.Panel.superclass.initComponent.apply(this, arguments);
    },


    OnCloseUncloseClick: function () {
        var grid = Ext.getCmp('payrollPeriods-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');
        var btn = Ext.getCmp('DeactivatePayrollItems').getText();
        payrollPeriods.ActivateDeactivate(id, btn, function (result, response) {
            if (result.success) {
                Ext.getCmp('payrollPeriods-paging').doRefresh();
                
            }
        });
    }
});
Ext.reg('payrollPeriods-panel', Ext.core.finance.ux.payrollPeriods.Panel);