Ext.ns('Ext.core.finance.ux.payrollBankBranches');
/**
* @desc      Banks registration form
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.payrollBankBranches
* @class     Ext.core.finance.ux.payrollBankBranches.Form
* @extends   Ext.form.FormPanel
*/
Ext.core.finance.ux.payrollBankBranches.Form = function (config) {
    Ext.core.finance.ux.payrollBankBranches.Form.superclass.constructor.call(this, Ext.apply({
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
        id: 'payrollBankBranches-form',
        padding: 5,
        labelWidth: 150,
        autoHeight: true,
        border: true,
        baseCls: 'x-plain',
        items: [{
            name: 'ParentId',
            xtype: 'textfield',
            hidden: true
        }, {
            name: 'Id',
            xtype: 'textfield',
            hidden: true
        }, {
            name: 'BranchName',
            xtype: 'textfield',
            fieldLabel: 'Branch Name',
            anchor: '95%',
            allowBlank: false
        }, {
            name: 'Address',
            xtype: 'textfield',
            fieldLabel: 'Branch Address',
            anchor: '95%',
            allowBlank: false
        }, {
            name: 'IsCompany',
            xtype: 'checkbox',
            checked: false,
            fieldLabel: 'Is Company Branch',
            listeners: {
                scope: this,
                check: function (Checkbox, checked) {

                    var form = Ext.getCmp('payrollBankBranches-form').getForm();
                    var tAmount = form.findField('AccountNo');
                    if (checked) {
                        form.findField('AccountNo').setDisabled(false);
                        //tAmount.show();
                    }
                    else {
                        form.findField('AccountNo').setDisabled(true);
//                        tAmount.reset();
//                        tAmount.hide();
                    }
                }
            }
        }, {
            name: 'AccountNo',
            xtype: 'textfield',
            fieldLabel: 'Account No',
            anchor: '95%',
            disabled: true,
            allowBlank: false
        }]
    }, config));
}
Ext.extend(Ext.core.finance.ux.payrollBankBranches.Form, Ext.form.FormPanel);
Ext.reg('payrollBankBranches-form', Ext.core.finance.ux.payrollBankBranches.Form);

/**
* @desc      Banks registration form host window
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.payrollBankBranches
* @class     Ext.core.finance.ux.payrollBankBranches.Window
* @extends   Ext.Window
*/
Ext.core.finance.ux.payrollBankBranches.Window = function (config) {
    Ext.core.finance.ux.payrollBankBranches.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        width: 500,
        height: 350,
        closeAction: 'close',
        modal: true,
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;',
        listeners: {
            show: function () {
                this.form.getForm().findField('ParentId').setValue(this.payrollBanksId);
                if (this.payrollBanksId > 0) {
                    //this.form.load({ params: { Id: this.payrollBanksId} });
                }
            },
            scope: this
        }
    }, config));
}
Ext.extend(Ext.core.finance.ux.payrollBankBranches.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.core.finance.ux.payrollBankBranches.Form();
        this.grid = new Ext.core.finance.ux.payrollBankBranches.Grid();
        this.items = [this.form, this.grid];
        this.buttons = [{
            text: 'Save',
            iconCls: 'icon-save',
            handler: this.onSave,
            scope: this
        }, {
            text: 'Close',
            iconCls: 'icon-exit',
            handler: this.onClose,
            scope: this
        }, {
           
            text: 'Print List',
            iconCls: 'icon-Print',
            handler: this.onBankBranchesPrintClick,
            scope:this,
            hidden:true
        }];

        Ext.core.finance.ux.payrollBankBranches.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {

        if (!this.form.getForm().isValid()) return;
//        var isComp = this.form.getForm().findField('IsCompany');
//        var acctNo = this.form.getForm().findField('AccountNo');
//        if (isComp.checked == true && acctNo.getValue() == '') {
//            Ext.MessageBox.show({
//                title: 'Account No',
//                msg: 'Account No field can not be empty for company bank branches.',
//                buttons: Ext.Msg.OK,
//                icon: Ext.MessageBox.ERROR,
//                scope: this
//            });
//            
//            return;
//        };
        this.form.getForm().submit({
            waitMsg: 'Please wait...',
            success: function () {
                var form = Ext.getCmp('payrollBankBranches-form');
                //var form = Ext.getCmp('payrollBankBranches-form').getForm();
                
                // Ext.getCmp('payrollBankBranches-paging').doRefresh();
                var gridBranches = Ext.getCmp('payrollBankBranches-grid');
                //Ext.getCmp('ParentId').getValue();
                var parentId = form.getForm().findField('ParentId').getValue();
                form.getForm().findField('BranchName').reset();
                form.getForm().findField('Address').reset();
                form.getForm().findField('AccountNo').reset();
                gridBranches.getStore().load({
                    params: {

                        start: 0,
                        limit: 100,
                        sort: '',
                        dir: '',
                        ParentId: parentId
                    }
                });
            }
        });
    },
    onClose: function () {
        this.close();
    },
    onBankBranchesPrintClick: function () {
        var grid = Ext.getCmp('payrollBankBranches-grid');
        Ext.ux.GridPrinter.stylesheetPath = '/Content/css/print.css';
        Ext.ux.GridPrinter.print(grid);
    }
});
Ext.reg('payrollBankBranches-window', Ext.core.finance.ux.payrollBankBranches.Window);

/**
* @desc      Banks grid
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.payrollBankBranches
* @class     Ext.core.finance.ux.payrollBankBranches.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.core.finance.ux.payrollBankBranches.Grid = function (config) {
    Ext.core.finance.ux.payrollBankBranches.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: PayrollBankBranches.GetAllByParentId,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|ParentId',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Code',
                direction: 'ASC'
            },
            fields: ['Id', 'BranchName', 'Address','AccountNo'],
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
        id: 'payrollBankBranches-grid',
        searchCriteria: {},
        pageSize: 1000,
        height: 200,
        title: 'Bank Branches List',
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
                var form = Ext.getCmp('payrollBankBranches-form');
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
             dataIndex: 'BranchName',
             header: 'Branch Name',
             sortable: true,
             width: 55,
             menuDisabled: true
         }, {
             dataIndex: 'Address',
             header: 'Address',
             sortable: true,
             width: 55,
             menuDisabled: true
         }, {
             dataIndex: 'AccountNo',
             header: 'Account No',
             sortable: true,
             width: 55,
             menuDisabled: true
         }]
    }, config));
};
Ext.extend(Ext.core.finance.ux.payrollBankBranches.Grid, Ext.grid.GridPanel, {
    initComponent: function () {

        this.bbar = new Ext.PagingToolbar({
            id: 'payrollBankBranches-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        this.bbar.refresh.hide();
        Ext.core.finance.ux.payrollBankBranches.Grid.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('payrollBankBranches-grid', Ext.core.finance.ux.payrollBankBranches.Grid);
