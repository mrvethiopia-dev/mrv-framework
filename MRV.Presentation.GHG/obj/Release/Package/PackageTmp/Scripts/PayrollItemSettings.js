/*  *************************************************************************************
*   *************************************************************************************
*   
*   General UI Layout or Map
*   ________________________
*
*   *******************************************
*   *  t1  *  t2  *  t3  *  t4  *  t5  *  ... *
*   *******************************************
*   *                                         *
*   *               Settings                  *
*   *          tab pages fall here            *
*   *                                         *
*   *                                         *
*   *                                         *
*   *******************************************
*
*****************************************************************************************
*****************************************************************************************/



Ext.ns('Ext.core.finance.ux.payrollItemSettings');
Ext.ns('Ext.core.finance.ux.configurationSettings');
Ext.ns('Ext.core.finance.ux.PrjLocMappings');
Ext.ns('Ext.core.finance.ux.unassignedLocs.Grid');
Ext.ns('Ext.core.finance.ux.assignedLocs.Grid');


/**
* @desc      Payroll Item Settings form
* @author    Dawit Kiros Woldemichael
* @copyright (c) 2013, LIFT
* @date      Dec 15, 2013
* @namespace Ext.core.finance.ux.payrollItemSettings
* @class     Ext.core.finance.ux.payrollItemSettings.Form
* @extends   Ext.form.FormPanel
*/

Ext.core.finance.ux.payrollItemSettings.Form = function (config) {
    Ext.core.finance.ux.payrollItemSettings.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: PayrollItems.Get,
            submit: PayrollItems.Save
        },
        paramOrder: ['Id'],
        defaults: { labelStyle: 'text-align:right;', msgTarget: 'side' },
        id: 'payrollItemSettings-form',
        padding: 5,
        autoLabelWidth: true,
        autoHeight: true,
        border: false,
        isFormLoad: false,
        labelStyle: 'text-align:right;',
        labelWidth: 120,
        frame: true,
        items: []
    }, config));
}
Ext.extend(Ext.core.finance.ux.payrollItemSettings.Form, Ext.form.FormPanel);
Ext.reg('payrollItemSettings-form', Ext.core.finance.ux.payrollItemSettings.Form);


/**
* @desc      Employer Payroll Items grid
* @author    Dawit Kiros Woldemichael
* @copyright (c) 2013, LIFT
* @date      Dec 15, 2013
* @namespace Ext.core.finance.ux.PayrollItems
* @class     Ext.core.finance.ux.PayrollItems.Grid
* @extends   Ext.grid.GridPanel
*/

Ext.core.finance.ux.payrollItemSettings.Grid = function (config) {
    Ext.core.finance.ux.payrollItemSettings.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: PayrollItems.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: { field: 'Code', direction: 'ASC' },
            fields: ['Id', 'Name', 'PItemName', 'PercentageAmount', 'TaxableAfterAmount', 'ItemCode', 'SLAccount', 'IsActive'],
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
        id: 'payrollItemSettings-grid',
        pageSize: 20,
        stripeRows: true,
        enableDragDrop: true,
        columnLines: true,
        border: true,
        sm:  new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        viewConfig: { forceFit: true, autoFill: true },
        listeners: {
            rowClick: function (grid, rowIndex, e) {

                if (!this.getSelectionModel().hasSelection()) return;

                var id = this.getSelectionModel().getSelected().get('Id');
                var form = Ext.getCmp('payrollItemSettings-form');

                form.load({ params: { Id: id} });
            },
            scope: this
        },
        columns: [
         { dataIndex: 'Id', header: 'Id', sortable: true, hidden: true, width: 100, menuDisabled: true
        }, { dataIndex: 'Name', header: 'Item Name', sortable: true, width: 220, menuDisabled: false
        }, { dataIndex: 'PItemName', header: 'Coupled Item Name', sortable: true, width: 220, menuDisabled: false
        }, { dataIndex: 'PercentageAmount', header: 'Percentage Amount', sortable: true, width: 200, menuDisabled: true
        }, { dataIndex: 'TaxableAfterAmount', header: 'Taxable After Amount', sortable: true, width: 220, menuDisabled: true
        }, { dataIndex: 'ItemCode', header: 'Item Code', sortable: true, width: 300, menuDisabled: true
        }, { dataIndex: 'SLAccount', header: 'Payroll Item Account', sortable: true, width: 300, menuDisabled: true
        }, { dataIndex: 'IsActive', header: 'Is Active', sortable: true, width: 250,
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                if (value)
                    return '<img src="Content/images/app/yes.png"/>';
                else
                    return '<img src="Content/images/app/no.png"/>';
            }
        }]
    }, config));
};
Ext.extend(Ext.core.finance.ux.payrollItemSettings.Grid, Ext.grid.EditorGridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ mode: 'get' }) };
        this.bbar = new Ext.PagingToolbar({
            id: 'payrollItemSettings-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.core.finance.ux.payrollItemSettings.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getStore().load({ params: { start: 0, limit: this.pageSize} });
        Ext.core.finance.ux.payrollItemSettings.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('payrollItemSettings-grid', Ext.core.finance.ux.payrollItemSettings.Grid);


/**
* @desc     Employer Payroll Items form host window
* @author    Dawit Kiros Woldemichael
* @copyright (c) 2014, LIFT
* @date      Dec 15, 2013
* @namespace Ext.core.finance.ux.payrollItemSettings
* @class     Ext.core.finance.ux.payrollItemSettings.Window
* @extends   Ext.Window
*/

Ext.core.finance.ux.payrollItemSettings.Window = function (config) {
    Ext.core.finance.ux.payrollItemSettings.Window.superclass.constructor.call(this, Ext.apply({
        id: 'payrollItemSettings-window',
        title: 'Settings Window',
        layout: 'fit',
        width: 750,
        height: 450,
        closeAction: 'close',
        modal: true,
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;'
    }, config));
};
Ext.extend(Ext.core.finance.ux.payrollItemSettings.Window, Ext.Window, {
    initComponent: function () {
        this.form_s = new Ext.core.finance.ux.payrollItemSettings.Form();
        this.grid_emlyr = new Ext.core.finance.ux.payrollItemSettings.Grid();

        // Basic Settings (Separate Js File, PayrollConfigurationSettings.js)
        this.form_cs = new Ext.core.finance.ux.configurationSettings.Form();

        // Letter Settings (Separate Js File, LetterSettings.js)
        this.form_ls = new Ext.core.finance.ux.letterSettings.Form();

        // Letter Settings (Separate Js File, emailSettings.js)
        this.form_emails = new Ext.core.finance.ux.emailSendingSettings.Form();

        //Payroll Items Posting Settings
        this.grid_PayrollItems = new Ext.core.finance.ux.pstPayrollItems.Grid;
        this.grid_UnitAccountMapping = new Ext.core.finance.ux.unitAccountMapping.Grid();

        this.form_cs.load();
        this.form_ls.load();

        this.form_emails.load();

        var scrollerMenu = new Ext.ux.TabScrollerMenu({ maxText: 15, pageSize: 5 });
        var tabs = new Ext.TabPanel({
            activeTab: 0,
            id: 'tabPanel',
            enableTabScroll: true,
            resizeTabs: true,
            minTabWidth: 75,
            border: false,
            plugins: [scrollerMenu]
        });

        tabs.add(/*{

            title: 'Journal Settings',
            border: false,
            layout: 'border',
            id: 'tabPosting',
            items: [/*{
                region: 'west',
                width: 360,
                minSize: 100,
                maxSize: 400,
                layout: 'fit',
                items: [this.grid_PayrollItems]
            }
             { 
                region: 'center',
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
                    items: [this.grid_PayrollItems]
                }]
            }
            ]
        },*/ {
            title: 'Other Settings',
            border: false,
            layout: 'fit',
            id: 'settings',
            height: 500,
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
                items: [this.form_cs]
            }]
        }, {
            title: 'Letter Settings',
            border: false,
            layout: 'fit',
            id: 'letterSettings',
            height: 500,
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
                items: [this.form_ls]
            }]
        }, {
            title: 'Email Settings',
            border: false,
            layout: 'fit',
            id: 'emailSendingSettings',
            height: 500,
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
                items: [this.form_emails]
            }]
        }
        );

        this.items = [tabs];
        this.bbar = [{
            xtype: 'tbfill'
        }, {
            xtype: 'button',
            text: 'Save',
            id: 'saveTrans',
            iconCls: 'icon-save',
            handler: this.onSaveClick,
            scope: this
        }, { xtype: 'tbseparator' }, {
            text: 'Close',
            iconCls: 'icon-exit',
            handler: this.onClose,
            scope: this
        }];

        Ext.core.finance.ux.payrollItemSettings.Window.superclass.initComponent.call(this, arguments);
    },
    onSaveClick: function () {

        var currentTabId = Ext.getCmp('tabPanel').activeTab.id;

        if (currentTabId == 'employer_items') {
            this.form_s.getForm().submit({
                waitMsg: 'Please wait...',
                success: function (form, action) {
                },
                failure: function (form, action) {
                    Ext.MessageBox.show({
                        title: 'Error',
                        msg: action.result.data,
                        buttons: Ext.Msg.OK,
                        icon: Ext.MessageBox.ERROR,
                        scope: this
                    });
                }
            });
        }
        if (currentTabId == 'letterSettings') {
            this.form_ls.getForm().submit({
                waitMsg: 'Please wait...',
                success: function (form, action) {
                },
                failure: function (form, action) {
                    Ext.MessageBox.show({
                        title: 'Error',
                        msg: action.result.data,
                        buttons: Ext.Msg.OK,
                        icon: Ext.MessageBox.ERROR,
                        scope: this
                    });
                }
            });
        }
        if (currentTabId == 'emailSendingSettings') {
            this.form_emails.getForm().submit({
                waitMsg: 'Please wait...',
                success: function (form, action) {
                },
                failure: function (form, action) {
                    Ext.MessageBox.show({
                        title: 'Error',
                        msg: action.result.data,
                        buttons: Ext.Msg.OK,
                        icon: Ext.MessageBox.ERROR,
                        scope: this
                    });
                }
            });
        }
        if (currentTabId == 'settings') {
            Ext.Ajax.timeout = 6000000;
            this.form_cs.getForm().submit({
                waitMsg: 'Please wait...',
                success: function (form, action) {
                    Ext.MessageBox.show({
                        title: response.title,
                        msg: response.data,
                        buttons: Ext.Msg.OK,
                        height: 30,
                        scrollable: true,
                        icon: Ext.MessageBox.INFO,
                        scope: this
                    });
                },
                failure: function (form, action) {
                    Ext.MessageBox.show({
                        title: 'Error',
                        msg: action.result.data,
                        buttons: Ext.Msg.OK,
                        icon: Ext.MessageBox.ERROR,
                        scope: this
                    });
                }
            });
        }

        if (currentTabId == 'taxRates') {
            this.form_tax.getForm().submit({
                waitMsg: 'Please wait...',
                success: function (form, action) {
                },
                failure: function (form, action) {
                    Ext.MessageBox.show({
                        title: 'Error',
                        msg: action.result.data,
                        buttons: Ext.Msg.OK,
                        icon: Ext.MessageBox.ERROR,
                        scope: this
                    });
                }
            });
        }

        if (currentTabId == 'otRates') {
            this.form_ot.getForm().submit({
                waitMsg: 'Please wait...',
                success: function (form, action) {
                },
                failure: function (form, action) {
                    Ext.MessageBox.show({
                        title: 'Error',
                        msg: action.result.data,
                        buttons: Ext.Msg.OK,
                        icon: Ext.MessageBox.ERROR,
                        scope: this
                    });
                }
            });
        }

        if (currentTabId == 'transRates') {
            this.form_trans.getForm().submit({
                waitMsg: 'Please wait...',
                success: function (form, action) {
                },
                failure: function (form, action) {
                    Ext.MessageBox.show({
                        title: 'Error',
                        msg: action.result.data,
                        buttons: Ext.Msg.OK,
                        icon: Ext.MessageBox.ERROR,
                        scope: this
                    });
                }
            });
        }

        if (currentTabId == 'respRates') {
            this.form_resp.getForm().submit({
                waitMsg: 'Please wait...',
                success: function (form, action) {
                },
                failure: function (form, action) {
                    Ext.MessageBox.show({
                        title: 'Error',
                        msg: action.result.data,
                        buttons: Ext.Msg.OK,
                        icon: Ext.MessageBox.ERROR,
                        scope: this
                    });
                }
            });
        }
        if (currentTabId == 'tabPosting') {
            var gridPItem = Ext.getCmp('pstPayrollItems-grid');
            var store = gridPItem.getStore();
            var rec = '';
            store.each(function (item) {
                if (item.isModified) {

                    var PItemId = item.data['Id'];
                    var account = item.data['Account'];

                    if (account != '') {

                        rec = rec + PItemId + ':' + account + ';';
                    }

                }
            });

            PayrollItems.UpdatePItemAccounts(rec, function (result, response) {
                if (result.success) {
                    Ext.MessageBox.alert('Posting Settings', 'Payroll Item and Account mapping done successfully.');
                }
            });
        }
        if (currentTabId == 'tabPosting1') {
            var gridPItem = Ext.getCmp('pstPayrollItems-grid');
            var gridUnitAccount = Ext.getCmp('unitAccountMapping-grid');

            if (!gridPItem.getSelectionModel().hasSelection()) {
                Ext.MessageBox.show({
                    title: 'Select',
                    msg: 'You must select a particular payroll item to proceed.',
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.INFO,
                    scope: this
                });
                return;
            }
            var PItemId = gridPItem.getSelectionModel().getSelected().get('Id');
            var rec = '';

            if (!gridPItem.getSelectionModel().hasSelection()) return;
            
            var unitsAndAccounts = gridUnitAccount.getStore();

            unitsAndAccounts.each(function (item) {
                if (item.isModified) {
                    var account = item.data['Account'];

                    if (account != '') {
                        var UnitId = item.data['Id'];
                    }
                
                    rec = rec + UnitId + ':' +  account + ';';

                }    
            });

            PayrollItemsAccount.Save(rec, PItemId, function (result, response) {
                if (result.success) {
                    Ext.MessageBox.alert('Posting Settings', 'Payroll Item, Unit and Account mapping done successfully.');
                }
            });
        }
    },
    onClose: function () {        
        this.close();
    }
});
Ext.reg('payrollItemSettings-window', Ext.core.finance.ux.payrollItemSettings.Window);