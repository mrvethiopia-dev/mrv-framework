Ext.ns('Ext.core.finance.ux.attachPayrollItemsHeader');


/**
* @desc      payrollItemsHeader registration form
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date     June 13, 2012
* @namespace Ext.core.finance.ux.attachPayrollItemsHeader
* @class     Ext.core.finance.ux.attachPayrollItemsHeader.Form
* @extends   Ext.form.FormPanel
*/
Ext.core.finance.ux.attachPayrollItemsHeader.Form = function (config) {
    Ext.core.finance.ux.attachPayrollItemsHeader.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: PayrollItems.Get,
            submit: PayrollItems.Save
        },
        paramOrder: ['id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'payrollItemsHeader-form',
        padding: 5,
        labelWidth: 100,
        autoHeight: true,
        border: false,
        baseCls: 'x-plain',
        items: [{
            name: 'Id',
            xtype: 'hidden'
        }]
    }, config));
};
Ext.extend(Ext.core.finance.ux.attachPayrollItemsHeader.Form, Ext.form.FormPanel);
Ext.reg('payrollItemsHeader-form', Ext.core.finance.ux.attachPayrollItemsHeader.Form);

/**
* @desc      payrollItemsHeader grid
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date     June 13, 2012
* @namespace Ext.core.finance.ux.attachPayrollItemsHeader
* @class     Ext.core.finance.ux.attachPayrollItemsHeader.Grid
* @extends   Ext.grid.GridPanel
*/

Ext.core.finance.ux.attachPayrollItemsHeader.Grid = function (config) {
    Ext.core.finance.ux.attachPayrollItemsHeader.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: PayrollItems.GetAllUserPayrollItems,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'PItemName',
                direction: 'ASC'
            },
            fields: ['Id', 'SLAccount', 'PItemName', 'PItemIsAddition', 'PItemIsTaxed', 'PItemApplicationType', 'PItemInitialTaxableAmount', 'PItemAmount', 'PItemApplicableFrom', 'PItemApplicableTo', 'IsReadOnly', 'IsActive'],
            remoteSort: false,
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
        id: 'PayrollItems-grid',
        searchCriteria: {},
        pageSize: 50,
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
                if (!this.getSelectionModel().hasSelection()) return;
                var id = this.getSelectionModel().getSelected().get('Id');
                var gridEmployees = Ext.getCmp('attachPayrollItemsDetail-grid');

                //Check if there is any unsaved data before reloading the grid 
               
                var ModifiedRecords = gridEmployees.getStore().getModifiedRecords();
                var count = 0;
                var i = 0;
                count = ModifiedRecords.length;

                    
                    gridEmployees.getStore().load({
                        params: {

                            start: 0,
                            limit: this.pageSize,
                            sort: '',
                            dir: '',
                            Id: id
                        }
                    });
                //}

            },
            scope: this
        },
        columns: [{
            dataIndex: 'Id',
            header: 'Id',
            sortable: true,
            hidden: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'PItemName',
            header: 'Payroll Item Name',
            sortable: true,
            width: 220,
            menuDisabled: false
        }, {
            dataIndex: 'SLAccount',
            header: 'Payroll Item Account',
            sortable: true,
            width: 200,
            menuDisabled: true
        }, {
            dataIndex: 'PItemIsAddition',
            header: 'Is Addition',
            sortable: true,
            width: 200,
            menuDisabled: true
        }, {
            dataIndex: 'PItemIsTaxed',
            header: 'Is Taxed',
            sortable: true,
            width: 220,
            menuDisabled: true
        }, {
            dataIndex: 'PItemApplicationType',
            header: 'Application Type',
            sortable: true,
            width: 220,
            menuDisabled: true
        }, {
            dataIndex: 'PItemAmount',
            header: ' Payroll Item Amount',
            sortable: true,
            width: 220,
            menuDisabled: true
        }, {
            dataIndex: 'PItemInitialTaxableAmount',
            header: 'Initial Taxable Amount',
            sortable: true,
            width: 220,
            menuDisabled: true
        }, {
            dataIndex: 'IsReadOnly',
            header: 'Is Read Only',
            sortable: true,
            hidden: true,
            width: 250,
            menuDisabled: true
        }, {
            dataIndex: 'IsActive',
            header: 'Is Active',
            sortable: true,
            width: 250,
            menuDisabled: true,
            hidden: true
        }]
    }, config));
};
Ext.extend(Ext.core.finance.ux.attachPayrollItemsHeader.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ mode: 'get' }) };
        this.tbar = [];
        this.bbar = new Ext.PagingToolbar({
            id: 'payrollItemsHeader-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.core.finance.ux.attachPayrollItemsHeader.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getStore().load({
            params: { start: 0, limit: this.pageSize, sort: 'PItemName',dir: 'ASC'
            }
        });
        Ext.core.finance.ux.attachPayrollItemsHeader.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('payrollItemsHeader-grid', Ext.core.finance.ux.attachPayrollItemsHeader.Grid);

//functions

function Amount_MeasurementUnit(val, x, store) {
    return val + ' ' + store.data.MeasurementUnit;
}

/**
* @desc      payrollItemsHeader panel
* @author    Dawit Kiros
* @copyright (c) 2014, LIFT
* @date     June 13, 2012
* @version   $Id: payrollItemsHeader.js, 0.1
* @namespace Ext.core.finance.ux.attachPayrollItemsHeader
* @class     Ext.core.finance.ux.attachPayrollItemsHeader.Panel
* @extends   Ext.Panel
*/
Ext.core.finance.ux.attachPayrollItemsHeader.Panel = function (config) {
    Ext.core.finance.ux.attachPayrollItemsHeader.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false,
        title: 'Payroll Items',
        //height: 600,
        tbar: {
            xtype: 'toolbar',
            items: [{
                xtype: 'button',
                text: 'Save',
                id: 'addEmp',
                iconCls: 'icon-save',
                handler: this.onSave,
                disabled: !Ext.core.finance.ux.Reception.getPermission('Employee Additions/Deductions', 'CanAdd')
            }, {
                xtype: 'tbseparator'
            }]
        }
    }, config));
};
Ext.extend(Ext.core.finance.ux.attachPayrollItemsHeader.Panel, Ext.Panel, {
    initComponent: function () {
        this.items = [{
            xtype: 'payrollItemsHeader-grid',
            id: 'payrollItemsHeader-grid'
        }];
        Ext.core.finance.ux.attachPayrollItemsHeader.Panel.superclass.initComponent.apply(this, arguments);
    },
    onSave: function () {
        Ext.Ajax.timeout = 6000000;
        Ext.MessageBox.show({
            msg: 'Saving attachment. Please wait....',
            progressText: 'Collecting...',
            width: 300,
            wait: true,
            waitConfig: { interval: 200 }
        });
        var gridHeader = Ext.getCmp('payrollItemsHeader-grid');
        var gridDetail = Ext.getCmp('attachPayrollItemsDetail-grid');
        var Id = gridHeader.getSelectionModel().getSelected().get('Id');
        var rec = '';

        if (!gridHeader.getSelectionModel().hasSelection()) return;
        

        var selectedEmps = gridDetail.getStore(); //.store.getModifiedRecords();  //gets the modifieds records
        
        ///////////////////// TO BE UPDATED with THE FOLLOWING CODE IN THE FUTURE 
        
        var modifiedRecords = gridDetail.getStore().getModifiedRecords();

        for (var i = 0; i <= modifiedRecords.length - 1; i++) {
            var appFrom = new Date(modifiedRecords[i].data.ApplicableFrom);
            var appTo = new Date(modifiedRecords[i].data.ApplicableTo);
            var newAmount = modifiedRecords[i].data.NewAmount;
        }

        /////////////////////////////////////////////////////////////////////////
        var empPItemAttachments = [];

        //        selectedEmps.each(function (item) { //Gets the data of each record
        //            empPItemAttachments.push(item.data);
        //        });

        selectedEmps.each(function (item) {
            var kk = item.data['ApplicableFrom'];
            if (item.data['ApplicableFrom'] == null || item.data['ApplicableTo'] == null || item.data['ApplyAlways'] == null) {
                Ext.MessageBox.show({
                    title: 'Invalid Applicability Option',
                    msg: 'One or more of your applicability options are empty. You should select the date of applicability (From Date -- To Date) for each employee.',
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.ERROR,
                    scope: this
                });
                return;
            }
            if ((item.data['NewAmount'] != 0)) {
                var appFrom = new Date(item.data['ApplicableFrom']);
                var appTo = new Date(item.data['ApplicableTo']);
                var dtFrom = appFrom.format('M/d/yyyy');
                var dtTo = appTo.format('M/d/yyyy');

                var deptID = 0;
                if (item.data['DeptId'] === null || typeof item.data['DeptId'] === 'undefined')
                    deptID = 0;
                    
                else
                    deptID = item.data['DeptId'];

                rec = rec + item.data['Id'] + ':' +
                        item.data['ApplyAlways'] + ':' + dtFrom + ':' + dtTo + ':' + item.data['NewAmount'] + ':' + deptID + ';';

            }
            else {
                Ext.MessageBox.show({
                    title: 'Invalid Applicability Option',
                    msg: 'Payroll item Amount cannot be empty. Please set a new amount for the selected payroll item and employee' + ' ' + item.data['IdentityNo'],
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.ERROR,
                    scope: this
                });
                return;
            }


        });


        //rec = Ext.encode(rec); //transform object into a string

        PayrollEmployeePayrollItems.SaveAttachment(rec, Id, function (result, response) {
            if (result.success) {
                Ext.MessageBox.hide();
                Ext.MessageBox.alert('Employee Payroll Item Attachment', 'Attachment has been completed successfully.');
            }
        });

    },

    onDeleteClick: function () {
        var grid = Ext.getCmp('payrollItemsHeader-grid');
        if (!grid.getSelectionModel().hasSelection()) {
            Ext.MessageBox.show({
                title: 'Select',
                msg: 'You must select an employee to delete.',
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
        Ext.MessageBox.show({
            title: 'Delete',
            msg: 'Are you sure you want to delete the selected employee',
            buttons: {
                ok: 'Yes',
                no: 'No'
            },
            icon: Ext.MessageBox.QUESTION,
            scope: this,
            animEl: 'Delete',
            fn: function (btn) {
                if (btn == 'ok') {
                    Ext.MessageBox.show({
                        title: 'Warning',
                        msg: 'Deleting this payroll item could make other related data invalid. Press Ok to delete, Press Cancel to abort.',
                        buttons: {
                            ok: 'Ok',
                            cancel: 'Cancel'
                        },
                        icon: Ext.MessageBox.WARNING,
                        scope: this,
                        fn: function (btn) {
                            if (btn == 'ok') {
                                var id = grid.getSelectionModel().getSelected().get('Id');
                                Attachment.Delete(id, function (result, response) {
                                    Ext.getCmp('payrollItemsHeader-paging').doRefresh();
                                }, this);
                            }
                        }
                    });
                }
            }
        });
    }
});
Ext.reg('payrollItemsHeader-panel', Ext.core.finance.ux.attachPayrollItemsHeader.Panel);