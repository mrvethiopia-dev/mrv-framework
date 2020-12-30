Ext.ns('Ext.core.finance.ux.payrollOvertimeMain');

Ext.core.finance.ux.payrollOvertimeMain.Panel = function (config) {
    Ext.core.finance.ux.payrollOvertimeMain.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        id: 'payrollOvertimeMain-panel',
        border: false
    }, config));
};
Ext.extend(Ext.core.finance.ux.payrollOvertimeMain.Panel, Ext.Panel, {
    initComponent: function () {

        this.overtimeHeader = new Ext.core.finance.ux.payrollOvertimeHeader.Panel();
        this.overtimeDetail = new Ext.core.finance.ux.payrollOvertimeDetail.Panel();
         
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
                    items: [this.overtimeHeader, this.overtimeDetail]
                }]
            }]
        }];


        Ext.core.finance.ux.payrollOvertimeMain.Panel.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('payrollOvertimeMain-panel', Ext.core.finance.ux.payrollOvertimeMain.Panel);
