Ext.ns('Ext.core.finance.ux.FinanceBTR');
Ext.ns('Ext.core.finance.ux.FinanceBankBranchesBTR');
/**
* @desc      Cheques registration form
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.FinanceBTR
* @class     Ext.core.finance.ux.FinanceBTR.Form
* @extends   Ext.form.FormPanel
*/
Ext.core.finance.ux.FinanceBTR.Form = function (config) {
    Ext.core.finance.ux.FinanceBTR.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: FinanceBankCheques.Get,
            submit: FinanceBankCheques.Save
        },
        paramOrder: ['Id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'FinanceBTR-form',
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
            name: 'BranchId',
            xtype: 'textfield',
            hidden: true
        }, {
            name: 'StartNo',
            xtype: 'numberfield',
            fieldLabel: 'From',
            anchor: '75%',
            allowBlank: false
        }, {
            name: 'EndNo',
            xtype: 'numberfield',
            fieldLabel: 'End',
            anchor: '75%',
            allowBlank: false
        }, {
            name: 'CurrentNo',
            xtype: 'numberfield',
            fieldLabel: 'Current No',
            anchor: '75%',
            allowBlank: false
        }, {
            name: 'IsClosed',
            xtype: 'checkbox',
            checked: false,
            fieldLabel: 'Is Active'
        }]
    }, config));
}
Ext.extend(Ext.core.finance.ux.FinanceBTR.Form, Ext.form.FormPanel);
Ext.reg('FinanceBTR-form', Ext.core.finance.ux.FinanceBTR.Form);

/**
* @desc      Cheques registration form host window
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.FinanceBTR
* @class     Ext.core.finance.ux.FinanceBTR.Window
* @extends   Ext.Window
*/
Ext.core.finance.ux.FinanceBTR.Window = function (config) {
    Ext.core.finance.ux.FinanceBTR.Window.superclass.constructor.call(this, Ext.apply({
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
                this.form.getForm().findField('Id').setValue(this.chequeId);
                this.form.getForm().findField('BranchId').setValue(this.branchId);
                if (this.chequeId != 0) {
                    this.form.load({ params: { Id: this.chequeId} });
                }
            },
            scope: this
        }
    }, config));
}
Ext.extend(Ext.core.finance.ux.FinanceBTR.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.core.finance.ux.FinanceBTR.Form();
        this.items = [this.form];
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
        }];

        Ext.core.finance.ux.FinanceBTR.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {

        if (!this.form.getForm().isValid()) return;
        this.form.getForm().submit({
            waitMsg: 'Please wait...',
            success: function () {
                Ext.getCmp('FinanceBTR-form').getForm().reset();
                //Ext.getCmp('FinanceBTR-paging').doRefresh();
            }
        });
    },
    onClose: function () {
        this.close();
    }
});
Ext.reg('FinanceBTR-window', Ext.core.finance.ux.FinanceBTR.Window);

/**
* @desc      Banks grid
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.FinanceBankBranchesBTR
* @class     Ext.core.finance.ux.FinanceBankBranchesBTR.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.core.finance.ux.FinanceBankBranchesBTR.Grid = function (config) {
    Ext.core.finance.ux.FinanceBankBranchesBTR.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: PayrollBankBranches.GetAllCompanyBranches,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'BranchName',
                direction: 'ASC'
            },
            fields: ['Id', 'BranchName', 'Address'],
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
        id: 'FinanceBankBranchesBTR-grid',
        
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
                var gridCheques = Ext.getCmp('FinanceBTR-grid');


                gridCheques.getStore().load({
                    params: {

                        start: 0,
                        limit: this.pageSize,
                        sort: '',
                        dir: '',
                        branchId: id
                    }
                });
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
             menuDisabled: false
         }, {
             dataIndex: 'Address',
             header: 'Address',
             sortable: true,
             width: 55,
             menuDisabled: true
         }]
    }, config));
};
Ext.extend(Ext.core.finance.ux.FinanceBankBranchesBTR.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ mode: 'get' }) };
        this.bbar = new Ext.PagingToolbar({
            id: 'FinanceBankBranchesBTR-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        
        Ext.core.finance.ux.FinanceBankBranchesBTR.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getStore().load({
            params: { start: 0, limit: this.pageSize }
        });
        Ext.core.finance.ux.FinanceWorkshops.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('FinanceBankBranchesBTR-grid', Ext.core.finance.ux.FinanceBankBranchesBTR.Grid);

/**
* @desc      Cheques grid
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @namespace Ext.core.finance.ux.FinanceBTR
* @class     Ext.core.finance.ux.FinanceBTR.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.core.finance.ux.FinanceBTR.Grid = function (config) {
    Ext.core.finance.ux.FinanceBTR.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: FinanceBankCheques.GetChequesByBranchId,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|branchId',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Code',
                direction: 'ASC'
            },
            fields: ['Id', 'StartNo', 'EndNo','CurrentNo', 'IsClosed'],
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
        id: 'FinanceBTR-grid',
        searchCriteria: {},
        pageSize: 38,
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
                if (!this.getSelectionModel().hasSelection()) return;
                var id = this.getSelectionModel().getSelected().get('Id');

                var grid = Ext.getCmp('FinanceBankBranchesBTR-grid');
                var branchId = grid.getSelectionModel().getSelected().get('Id');

                if (id != null) {
                    var hasEditPermission = Ext.core.finance.ux.Reception.getPermission('Define Cheques', 'CanEdit');
                    if (hasEditPermission) {
                        new Ext.core.finance.ux.FinanceBTR.Window({
                            chequeId: id,
                            branchId : branchId,
                            title: 'Edit Cheques'
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
             dataIndex: 'StartNo',
             header: 'Start No',
             sortable: true,
             width: 55,
             menuDisabled: true
         },  {
             dataIndex: 'EndNo',
             header: 'End No',
             sortable: true,
             width: 55,
             menuDisabled: true
         },  {
             dataIndex: 'CurrentNo',
             header: 'Current No',
             sortable: true,
             width: 55,
             menuDisabled: true
         }, {
             dataIndex: 'IsClosed',
             header: 'Is Active',
             sortable: true,
             width: 50,
             menuDisabled: true,
             align: 'center',
             renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                 if (value)
                     return '<img src="Content/images/app/no.png"/>';
                 else
                     return '<img src="Content/images/app/yes.png"/>';
                     
             }
         }]
    }, config));
};
Ext.extend(Ext.core.finance.ux.FinanceBTR.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        //this.store.baseParams = { record: Ext.encode({ mode: 'get' }) };
        this.tbar = [{
            xtype: 'button',
            text: 'Add',
            id: 'addpayrollWoredas',
            iconCls: 'icon-add',
            handler: this.onAddClick,
            disabled: !Ext.core.finance.ux.Reception.getPermission('Define Cheques', 'CanAdd')
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Edit',
            id: 'editpayrollWoredas',
            iconCls: 'icon-edit',
            handler: this.onEditClick,
            disabled: !Ext.core.finance.ux.Reception.getPermission('Define Cheques', 'CanEdit')
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Delete',
            id: 'deletepayrollWoredas',
            iconCls: 'icon-delete',
            handler: this.onDeleteClick,
            disabled: !Ext.core.finance.ux.Reception.getPermission('Define Cheques', 'CanDelete')
            
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Void Cheque',
            id: 'btnVoidCheque',
            iconCls: 'icon-void',
            handler: this.onVoidClick,
            disabled: !Ext.core.finance.ux.Reception.getPermission('Define Cheques', 'CanDelete')
            
        }];
        this.bbar = new Ext.PagingToolbar({
            id: 'FinanceBTR-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.core.finance.ux.FinanceBTR.Grid.superclass.initComponent.apply(this, arguments);
    },
     onAddClick: function () {
        var branchGrid = Ext.getCmp('FinanceBankBranchesBTR-grid');
        if (!branchGrid.getSelectionModel().hasSelection()) return;
        var branchId = branchGrid.getSelectionModel().getSelected().get('Id');
        new Ext.core.finance.ux.FinanceBTR.Window({
             chequeId: 0,
            branchId : branchId,
            title: 'Add Cheques'
        }).show();
    },
    onEditClick: function () {
        var grid = Ext.getCmp('FinanceBTR-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');
           var branchGrid = Ext.getCmp('FinanceBankBranchesBTR-grid');
                var branchId = branchGrid.getSelectionModel().getSelected().get('Id');
                        new Ext.core.finance.ux.FinanceBTR.Window({
                            chequeId: id,
                            branchId : branchId,
                            title: 'Edit Cheques'
                        }).show();
    },
    onDeleteClick: function () {
        var grid = Ext.getCmp('FinanceBTR-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        Ext.MessageBox.show({
            title: 'Delete',
            msg: 'Are you sure you want to delete the selected Cheque?',
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
                    FinanceBTR.Delete(id, function (result, response) {
                        Ext.getCmp('FinanceBTR-paging').doRefresh();
                    }, this);
                }
            }
        });
    },
    onVoidClick: function () {
       var chequeGrid = Ext.getCmp('FinanceBTR-grid');
        if (!chequeGrid.getSelectionModel().hasSelection()) return;
        var cheqId = chequeGrid.getSelectionModel().getSelected().get('Id');
        new Ext.core.finance.ux.FinanceVoidCheques.Window({
             chequeId: cheqId,
            title: 'Void Cheques'
        }).show();
    }
//    afterRender: function () {
//        this.getStore().load({
//            params: { start: 0, limit: this.pageSize }
//        });
//        Ext.core.finance.ux.FinanceBTR.Grid.superclass.afterRender.apply(this, arguments);
//    }
});
Ext.reg('FinanceBTR-grid', Ext.core.finance.ux.FinanceBTR.Grid);

/**
* @desc      Cheques panel
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date      July 01, 2013
* @version   $Id: FinanceBTR.js, 0.1
* @namespace Ext.core.finance.ux.FinanceBTR
* @class     Ext.core.finance.ux.FinanceBTR.Panel
* @extends   Ext.Panel
*/
Ext.core.finance.ux.FinanceBTR.Panel = function (config) {
    Ext.core.finance.ux.FinanceBTR.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false
    
    }, config));
}
Ext.extend(Ext.core.finance.ux.FinanceBTR.Panel, Ext.Panel, {
    initComponent: function () {
//        this.items = [{
//            xtype: 'FinanceBTR-grid',
//            id: 'FinanceBTR-grid'
//        }];
        this.bankBranches = new Ext.core.finance.ux.FinanceBankBranchesBTR.Grid();
        this.cheques = new Ext.core.finance.ux.FinanceBTR.Grid();
        this.items = [{
            layout: 'border',
            border: false,
            items: [{
                region: 'west',
                border: true,
                collapsible: true,
                split: true,
                width: 470,
                minSize: 200,
                maxSize: 600,
                layout: 'fit',
                title: 'Banks',
                margins: '0 3 0 0',
                items: [this.bankBranches]
            }, {
                region: 'center',
                border: true,
                layout: 'fit',
                items: [this.cheques]
            }]
        }];
        Ext.core.finance.ux.FinanceBTR.Panel.superclass.initComponent.apply(this, arguments);
    },

   
});
Ext.reg('FinanceBTR-panel', Ext.core.finance.ux.FinanceBTR.Panel);