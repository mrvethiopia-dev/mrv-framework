Ext.ns('Ext.mrv.ghginventory.ux.sectors');
/**
* @desc      Sector registration form
* @author    Dawit Kiros
* @namespace Ext.mrv.ghginventory.ux.sectors
* @class     Ext.mrv.ghginventory.ux.sectors.Form
* @extends   Ext.form.FormPanel
*/
Ext.mrv.ghginventory.ux.sectors.Form = function (config) {
    Ext.mrv.ghginventory.ux.sectors.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: Sector.Get,
            submit: Sector.Save
        },
        id: 'sectors-form',
        paramOrder: ['id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        padding: 5,
        labelWidth: 100,
        autoHeight: true,
        border: false,
        baseCls: 'x-plain',
        items: [{
            name: 'Id',
            xtype: 'hidden'
        }, {
            name: 'ParentId',
            xtype: 'hidden'
        }, {
            xtype: 'textfield',
            name: 'Parent',
            fieldLabel: 'Parent Sector',
            allowBlank: false,
            disabled: true
        },  {
            name: 'Name',
            xtype: 'textfield',
            fieldLabel: 'Name',
            allowBlank: false
        },{
            name: 'Code',
            xtype: 'textfield',
            fieldLabel: 'Code',
            allowBlank: false
        },  {
            name: 'CanCaptureData',
            xtype: 'checkbox',
            checked: false,
            fieldLabel: 'Can Capture Data'
        }]
    }, config));
}
Ext.extend(Ext.mrv.ghginventory.ux.sectors.Form, Ext.form.FormPanel);
Ext.reg('sectors-form', Ext.mrv.ghginventory.ux.sectors.Form);

/**
* @desc      Sector registration form host window
* @author    Dawit Kiros
* @copyright (c) 2010, Cybersoft

* @namespace Ext.mrv.ghginventory.ux.sectors
* @class     Ext.mrv.ghginventory.ux.sectors.Window
* @extends   Ext.Window
*/
Ext.mrv.ghginventory.ux.sectors.Window = function (config) {
    Ext.mrv.ghginventory.ux.sectors.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'form',
        width: 500,
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        saveMode: 'add',
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;',
        listeners: {
            show: function () {
                var tree = Ext.getCmp('sectors-tree');
                var node = tree.getNodeById(tree.selectedsectorId);
                var parent = node.attributes.text;
                if (this.mode == 'edit') {
                    this.form.getForm().load({ params: { id: this.sectorId} });
                }
                this.form.getForm().findField('Parent').setValue(parent);
            }
        }
    }, config));
}
Ext.extend(Ext.mrv.ghginventory.ux.sectors.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.mrv.ghginventory.ux.sectors.Form({ mode: this.mode });
        this.items = [this.form];
        this.bbar = [{
            xtype: 'tbfill'
        }, {
            text: 'Save',
            iconCls: 'icon-save',
            scope: this,
            handler: this.onsectorSave
        }, {
            xtype: 'tbseparator'
        }, {
            text: 'Close',
            iconCls: 'icon-exit',
            handler: this.onsectorClose,
            scope: this
        }];
        this.tools = [{
            id: 'refresh',
            qtip: 'Reset',
            handler: function () {
                this.form.getForm().findField('Name').setRawValue('');
                this.form.getForm().findField('Code').setRawValue('');
            },
            scope: this
        }];
        Ext.mrv.ghginventory.ux.sectors.Window.superclass.initComponent.call(this, arguments);
    },
    onsectorSave: function () {
        if (!this.form.getForm().isValid()) return;
        if (this.parentId != 'root-sectors') {
            this.form.getForm().findField('ParentId').setValue(this.parentId);
        }
        var tree = Ext.getCmp('sectors-tree');
        var parentNode = tree.getNodeById(tree.selectedsectorId);
        var mode = this.mode;
        var win = this;
        this.form.getForm().submit({
            waitMsg: 'Please wait...',
            success: function () {
                var form = Ext.getCmp('sectors-form').getForm();
                form.findField('Name').setRawValue('');
                form.findField('Code').setRawValue('');
                Ext.getCmp('sectors-paging').doRefresh();
                if (mode == 'add') {
                    tree.getNodeById(tree.selectedsectorId).reload();
                }
                else {
                    parentNode.reload();
                    //tree.selectedsectorId = 0;
                    win.close();
                }
            },
            failure: function (option, response) {
                Ext.MessageBox.show({
                    title: 'Failure',
                    msg: response.result.data,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.ERROR,
                    scope: this
                });
            }
        });
    },
    onsectorClose: function () {
        this.close();
    }
});
Ext.reg('sectors-window', Ext.mrv.ghginventory.ux.sectors.Window);

/**
* @desc      Sector grid
* @author    Dawit Kiros
* @copyright (c) 2010, Cybersoft

* @namespace Ext.mrv.ghginventory.ux.sectors
* @class     Ext.mrv.ghginventory.ux.sectors.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.mrv.ghginventory.ux.sectors.Grid = function (config) {
    Ext.mrv.ghginventory.ux.sectors.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: Sector.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Name',
                direction: 'ASC'
            },
            fields: ['Id', 'Name', 'Code', 'Parent'],
            remoteSort: true,
            listeners: {
                beforeLoad: function () { Ext.getCmp('sectors-grid').body.mask('Loading...', 'x-mask-loading'); },
                load: function () { Ext.getCmp('sectors-grid').body.unmask(); },
                loadException: function () { Ext.getCmp('sectors-grid').body.unmask(); },
                scope: this
            }
        }),
        id: 'sectors-grid',
        selectedsectorTypeId: 0,
        pageSize: 30,
        height: 300,
        stripeRows: true,
        border: false,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        viewConfig: {
            forceFit: true,
            autoFill: true
        },
        columns: [{
            dataIndex: 'Id',
            header: 'Id',
            sortable: true,
            hidden: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'Name',
            header: 'Sector Name',
            sortable: true,
            width: 100,
            menuDisabled: true
        },  {
            dataIndex: 'Code',
            header: 'Sector Code',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'Parent',
            header: 'Parent Sector',
            sortable: false,
            width: 100,
            menuDisabled: true
        }]
    }, config));
}
Ext.extend(Ext.mrv.ghginventory.ux.sectors.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ sectorTypeId: this.sectorTypeId }) };
        this.tbar = [{
            xtype: 'button',
            text: 'Add',
            id: 'addsector',
            iconCls: 'icon-add',
            //disabled: !Ext.mrv.ghginventory.ux.Reception.getPermission('Sector', 'CanAdd'),
            handler: this.onAddClick
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Edit',
            id: 'editsector',
            iconCls: 'icon-edit',
            //disabled: !Ext.mrv.ghginventory.ux.Reception.getPermission('Sector', 'CanEdit'),
            handler: this.onEditClick
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Delete',
            id: 'deletesector',
            iconCls: 'icon-delete',
            //disabled: !Ext.mrv.ghginventory.ux.Reception.getPermission('Sector', 'CanDelete'),
            handler: this.onDeleteClick
        }, {
            xtype: 'tbfill'
        }];
        this.bbar = new Ext.PagingToolbar({
            id: 'sectors-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.mrv.ghginventory.ux.sectors.Grid.superclass.initComponent.apply(this, arguments);
        //Ext.getCmp('sectors-tree').expandAll();
    },
    onAddClick: function () {
        var tree = Ext.getCmp('sectors-tree');
        if (tree.selectedsectorId == 0) {
            Ext.MessageBox.show({
                title: 'Select',
                msg: 'You must select a parent sector from the left panel.',
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
        new Ext.mrv.ghginventory.ux.sectors.Window({
            sectorId: 0,
            parentId: tree.selectedsectorId,
            mode: 'add',
            title: 'Add Sector'
        }).show();
    },
    onEditClick: function () {
        var grid = Ext.getCmp('sectors-grid');
        if (!grid.getSelectionModel().hasSelection()) {
            Ext.MessageBox.show({
                title: 'Select',
                msg: 'You must select a sectors to edit.',
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
        var sectorId = grid.getSelectionModel().getSelected().get('Id');
        var parentId = grid.parentId;
        new Ext.mrv.ghginventory.ux.sectors.Window({
            title: 'Edit Sector',
            sectorId: sectorId,
            parentId: parentId,
            mode: 'edit'
        }).show();
    },
    onDeleteClick: function () {
        var tree = Ext.getCmp('sectors-tree');
        if (tree.selectedsectorId == 'root-sectors' || tree.selectedsectorId == 0) {
            Ext.MessageBox.show({
                title: 'Select',
                msg: 'You must select a sectors to delete.',
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
        var parentNode = tree.getNodeById(tree.selectedsectorId).parentNode;
        Ext.MessageBox.show({
            title: 'Delete',
            msg: 'Are you sure you want to delete the selected sectors',
            buttons: {
                ok: 'Yes',
                no: 'No'
            },
            icon: Ext.MessageBox.QUESTION,
            scope: this,
            animEl: 'delete',
            fn: function (btn) {
                if (btn == 'ok') {
                    Ext.MessageBox.show({
                        title: 'Warning',
                        msg: 'Deleting this sectors could make other related data invalid. Press Ok to delete, Press Cancel to abort.',
                        buttons: {
                            ok: 'Ok',
                            cancel: 'Cancel'
                        },
                        icon: Ext.MessageBox.WARNING,
                        scope: this,
                        fn: function (btn) {
                            if (btn == 'ok') {
                                Sector.Delete(tree.selectedsectorId, function (result) {
                                    Ext.getCmp('sectors-paging').doRefresh();
                                    if (result.success) {
                                        parentNode.reload();
                                        tree.selectedsectorId = 0;
                                    }
                                    else {
                                        Ext.MessageBox.show({
                                            title: 'Error',
                                            msg: result.data,
                                            buttons: Ext.Msg.OK,
                                            icon: Ext.MessageBox.ERROR,
                                            scope: this
                                        });
                                    }
                                }, this);
                            }
                        }
                    });
                }
            }
        });
    }
});
Ext.reg('sectors-grid', Ext.mrv.ghginventory.ux.sectors.Grid);

/**
* @desc      Sector tree
* @author    Dawit Kiros
* @copyright (c) 2010, Cybersoft

* @namespace Ext.mrv.ghginventory.ux.sectors
* @class     Ext.mrv.ghginventory.ux.sectors.Tree
* @extends   Ext.Window
*/
Ext.mrv.ghginventory.ux.sectors.Tree = function (config) {
    Ext.mrv.ghginventory.ux.sectors.Tree.superclass.constructor.call(this, Ext.apply({
        id: 'sectors-tree',
        loader: new Ext.tree.TreeLoader({
            directFn: Sector.PopulateTree
        }),
        selectedsectorId: 0,
        selectedsectorTypeId: 0,
        border: false,
        rootVisible: false,
        lines: true,
        
        useArrows: true,
        animate: true,
        autoScroll: true,
        enableDD: true,
        containerScroll: true,
        stateful: false,
        root: {
            text: 'Sectors',
            id: 'root-sectors'
        },
        listeners: {
            click: function (node, e) {
                e.stopEvent();
                node.select();
                if (node.isExpandable()) {
                    node.reload();
                }
                node.getOwnerTree().selectedsectorTypeId = node.attributes.id == 'root-sectors' ? 'root-sectors' : node.attributes.sectorTypeId;
                node.getOwnerTree().selectedsectorId = node.attributes.id;
                var sectorGrid = Ext.getCmp('sectors-grid');
                sectorGrid.parentId = node.id;
                sectorGrid.store.baseParams = { record: Ext.encode({ sectorId: node.id }) };
                sectorGrid.store.load({ params: { start: 0, limit: sectorGrid.pageSize} });
            },
            contextmenu: function (node, e) {
                node.select();
                node.getOwnerTree().selectedsectorTypeId = node.attributes.id == 'root-sectors' ? 'root-sectors' : node.attributes.sectorTypeId;
                node.getOwnerTree().selectedsectorId = node.attributes.id;
                var sectorGrid = Ext.getCmp('sectors-grid');
                sectorGrid.store.baseParams = { record: Ext.encode({ sectorId: node.id }) };
                sectorGrid.store.load({ params: { start: 0, limit: sectorGrid.pageSize} });
            },
            expand: function (p) {
                p.syncSize();
            },
            beforenodedrop: function (dropEvent) {
                if (dropEvent.rawEvent.ctrlKey) {
                    childNodeId = dropEvent.dropNode.id;
                    currentParentNodeId = dropEvent.target.id;
                    currentParentNode = dropEvent.tree.getNodeById(currentParentNodeId);

                    //if (currentParentNode.attributes.leaf) return false; //to avoid droping of one leaf element to another

                    Sector.Restructure(childNodeId, currentParentNodeId, function (result) {
                        if (result.success) {
                            currentParentNode.reload();
                        }
                        else {
                            Ext.MessageBox.show({
                                title: 'Error',
                                msg: result.data,
                                buttons: Ext.Msg.OK,
                                icon: Ext.MessageBox.ERROR,
                                scope: this
                            });
                        }
                    }, this);
                    return true;
                }
                else {
                    return false;
                }
            }
        }
    }, config));
}
Ext.extend(Ext.mrv.ghginventory.ux.sectors.Tree, Ext.tree.TreePanel, {
    initComponent: function () {
        this.tbar = [ {
            xtype: 'tbfill'
        }, {
            xtype: 'button',
            id: 'expand-all',
            iconCls: 'icon-expand-all',
            tooltip: 'Expand All',
            handler: function () {
                Ext.getCmp('sectors-tree').expandAll();
            }
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            id: 'collapse-all',
            iconCls: 'icon-collapse-all',
            tooltip: 'Collapse All',
            handler: function () {
                Ext.getCmp('sectors-tree').collapseAll();
            }
        }];
        Ext.mrv.ghginventory.ux.sectors.Tree.superclass.initComponent.call(this, arguments);
    }
});
Ext.reg('sectors-tree', Ext.mrv.ghginventory.ux.sectors.Tree);

/**
* @desc      Sector panel
* @author    Dawit Kiros
* @copyright (c) 2010, Cybersoft

* @version   $Id: Sector.js, 0.1
* @namespace Ext.mrv.ghginventory.ux.sectors
* @class     Ext.mrv.ghginventory.ux.sectors.Panel
* @extends   Ext.Panel
*/
Ext.mrv.ghginventory.ux.sectors.Panel = function (config) {
    Ext.mrv.ghginventory.ux.sectors.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false
    }, config));
}
Ext.extend(Ext.mrv.ghginventory.ux.sectors.Panel, Ext.Panel, {
    initComponent: function () {
        this.tree = new Ext.mrv.ghginventory.ux.sectors.Tree();
        this.grid = new Ext.mrv.ghginventory.ux.sectors.Grid();
        this.items = [{
            layout: 'border',
            border: false,
            items: [{
                region: 'west',
                border: true,
                width: 300,
                minSize: 200,
                maxSize: 400,
                layout: 'fit',
                margins: '0 3 0 0',
                items: [this.tree]
            }, {
                region: 'center',
                border: true,
                layout: 'fit',
                items: [this.grid]
            }]
        }];
        Ext.mrv.ghginventory.ux.sectors.Panel.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('sectors-panel', Ext.mrv.ghginventory.ux.sectors.Panel);
