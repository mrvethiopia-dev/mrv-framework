Ext.ns('Ext.core.finance.ux.common.unitSelection');

/**
* @desc      unitSelection tree
* @author    Dawit Kiros
* @copyright (c) 2012, LIFT
* @date      April 24, 2012
* @namespace Ext.erp.hrms.ux.common.unitSelection
* @class     Ext.erp.hrms.ux.common.unitSelection.Tree
* @extends   Ext.tree.TreePanel
*/
Ext.core.finance.ux.common.unitSelection.Tree = function (config) {
    Ext.core.finance.ux.common.unitSelection.Tree.superclass.constructor.call(this, Ext.apply({
        id: 'unitSelection-tree',
        loader: new Ext.tree.TreeLoader({
            directFn: Ifms.GetPagedEmployee
        }),
        selectedUnitId: 0,
        //selectedUnitTypeId: 0,
        border: false,
        rootVisible: true,
        lines: true,
        autoScroll: true,
        stateful: false,
        root: {
            text: 'Units',
            id: 'root-unit'
        },
        tbar: [{
            xtype: 'displayfield',
            id: 'selected-unit',
            style: 'font-weight: bold'
        }, {
            xtype: 'tbfill'
        }, {
            xtype: 'button',
            id: 'expand-all-unitSelection',
            iconCls: 'icon-expand-all',
            tooltip: 'Expand All',
            handler: function () {
                Ext.getCmp('unitSelection-tree').expandAll();
            }
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            id: 'collapse-all-unitSelection',
            iconCls: 'icon-collapse-all',
            tooltip: 'Collapse All',
            handler: function () {
                Ext.getCmp('unitSelection-tree').collapseAll();
            }
        }],
        listeners: {
            click: function (node, e) {
                e.stopEvent();
                node.select();
                node.reload();
                //node.getOwnerTree().selectedUnitTypeId = node.attributes.id == 'root-unit' ? 0 : node.attributes.unitTypeId;
                node.getOwnerTree().selectedUnitId = node.attributes.id == 'root-unit' ? 0 : node.attributes.id;
                var unitSelectionGrid;
                if (this.grid == null)
                    unitSelectionGrid = Ext.getCmp('unitSelection-grid');
                else
                    unitSelectionGrid = this.grid;
                var selectedUnit = node.attributes.id == 'root-unit' ? '' : '[' + node.attributes.text + ']';
                Ext.getCmp('selected-unit').setValue(selectedUnit);
                unitSelectionGrid.store.baseParams['record'] = Ext.encode({ unitId: node.id });
                unitSelectionGrid.store.load({ params: { start: 0, limit: unitSelectionGrid.pageSize} });
            },
            expand: function (p) {
                p.syncSize();
            }
        }
    }, config));
}
Ext.extend(Ext.core.finance.ux.common.unitSelection.Tree, Ext.tree.TreePanel, {
    initComponent: function () {
        this.tbar = [{
            xtype: 'displayfield',
            id: 'selected-unit',
            style: 'font-weight: bold'
        }, {
            xtype: 'tbfill'
        }, {
            xtype: 'button',
            id: 'expand-all-assets',
            iconCls: 'icon-expand-all',
            tooltip: 'Expand All',
            handler: function () {
                Ext.getCmp('fixedAsset-tree').expandAll();
            }
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            id: 'collapse-all-assets',
            iconCls: 'icon-collapse-all',
            tooltip: 'Collapse All',
            handler: function () {
                Ext.getCmp('fixedAsset-tree').collapseAll();
            }
        }];
        Ext.core.finance.ux.common.unitSelection.Tree.superclass.initComponent.call(this, arguments);
    }
});
Ext.reg('unitSelection-tree', Ext.core.finance.ux.common.unitSelection.Tree);