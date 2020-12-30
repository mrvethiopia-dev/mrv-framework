Ext.ns('Ext.core.finance.ux.attachPayrollItems');

Ext.core.finance.ux.attachPayrollItems.Panel = function (config) {
    Ext.core.finance.ux.attachPayrollItems.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        id: 'attachPayrollItems-panel',
        border: false
    }, config));
};
Ext.extend(Ext.core.finance.ux.attachPayrollItems.Panel, Ext.Panel, {
    initComponent: function () {
        this.pItemAttachmentDetail = new Ext.core.finance.ux.attachPayrollItemsDetail.Panel();
        this.pItemAttachmentHeader = new Ext.core.finance.ux.attachPayrollItemsHeader.Panel();

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
                    items: [this.pItemAttachmentHeader, this.pItemAttachmentDetail]
                }]
            }]
        }];

        Ext.core.finance.ux.attachPayrollItems.Panel.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('attachPayrollItems-panel', Ext.core.finance.ux.attachPayrollItems.Panel);