Ext.ns('Ext.core.finance.ux.AttendanceDeptTree');
/**
* @desc      AttendanceDeptTree tree
* @author    Dawit Kiros
* @copyright (c) 2012, LIFT
* @date      April 24, 2012
* @namespace Ext.erp.hrms.ux.AttendanceDeptTree
* @class     Ext.erp.hrms.ux.AttendanceDeptTree.Tree
* @extends   Ext.tree.TreePanel
*/
Ext.core.finance.ux.AttendanceDeptTree.Tree = function (config) {
    Ext.core.finance.ux.AttendanceDeptTree.Tree.superclass.constructor.call(this, Ext.apply({
        id: 'AttendanceDeptTree-tree',
        loader: new Ext.tree.TreeLoader({
            directFn: Tsa.PopulateAttendanceDeptTree
        }),
        selecteddeptId: 0,
        //selecteddeptTypeId: 0,
        border: false,
        rootVisible: true,
        lines: true,
        autoScroll: true,
        stateful: false,
        disabled: true,
        root: {
            text: 'Departments',
            id: 'root-dept'
        },
        tbar: [{
            xtype: 'displayfield',
            id: 'selected-dept',
            style: 'font-weight: bold'
        }, {
            xtype: 'tbfill'
        }, {
            xtype: 'button',
            id: 'expand-all-AttendanceDeptTree',
            iconCls: 'icon-expand-all',
            tooltip: 'Expand All',
            handler: function () {
                Ext.getCmp('AttendanceDeptTree-tree').expandAll();
            }
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            id: 'collapse-all-AttendanceDeptTree',
            iconCls: 'icon-collapse-all',
            tooltip: 'Collapse All',
            handler: function () {
                Ext.getCmp('AttendanceDeptTree-tree').collapseAll();
            }
        }],
        listeners: {
            click: function (node, e) {
                e.stopEvent();
                node.select();
                node.reload();
                node.getOwnerTree().selecteddeptTypeId = node.attributes.id == 'root-dept' ? 0 : node.attributes.text;
                node.getOwnerTree().selecteddeptId = node.attributes.id == 'root-dept' ? 0 : node.attributes.id;
                var periodId = Ext.getCmp('AttPeriodId').getValue();
                var employeeSelectionGrid = this.grid; // Ext.getCmp('PayrollAttendance-grid');
                var selecteddept = node.attributes.id == 'root-dept' ? '' : '[' + node.attributes.text + ']';
                //Ext.getCmp('selected-dept').setValue(selecteddept);
                employeeSelectionGrid.store.baseParams['record'] = Ext.encode({ deptId: node.id });
                employeeSelectionGrid.store.load({ params: { start: 0, limit: employeeSelectionGrid.pageSize, periodId: periodId} });
            },
            expand: function (p) {
                p.syncSize();
            }
        }
    }, config));
}
Ext.extend(Ext.core.finance.ux.AttendanceDeptTree.Tree, Ext.tree.TreePanel, {
    initComponent: function () {
        this.tbar = [{
            xtype: 'displayfield',
            id: 'selected-dept',
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
        Ext.core.finance.ux.AttendanceDeptTree.Tree.superclass.initComponent.call(this, arguments);
    }
});
Ext.reg('AttendanceDeptTree-tree', Ext.core.finance.ux.AttendanceDeptTree.Tree);