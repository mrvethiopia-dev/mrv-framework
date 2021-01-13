Ext.ns('Ext.mrv.ghginventory.ux.locations');
/**
* @desc      Location registration form
* @author    Dawit Kiros
* @namespace Ext.mrv.ghginventory.ux.locations
* @class     Ext.mrv.ghginventory.ux.locations.Form
* @extends   Ext.form.FormPanel
*/
Ext.mrv.ghginventory.ux.locations.Form = function (config) {
    Ext.mrv.ghginventory.ux.locations.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: Location.Get,
            submit: Location.Save
        },
        id: 'locations-form',
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
        },        {
            xtype: 'textfield',
            name: 'Parent',
            fieldLabel: 'Parent Location',
            allowBlank: false,
            disabled: true
        }, {
            hiddenName: 'LocationTypeId',
            xtype: 'combo',
            fieldLabel: 'Location Type',
            anchor: '90%',
            triggerAction: 'all',
            mode: 'local',
            editable: true,
            typeAhead: true,
            forceSelection: true,
            emptyText: '',
            allowBlank: false,
            store: new Ext.data.DirectStore({
                reader: new Ext.data.JsonReader({
                    successProperty: 'success',
                    idProperty: 'Id',
                    root: 'data',
                    fields: ['Id', 'Name']
                }),
                autoLoad: true,
                api: { read: Tsa.GetLocationTypes }
            }),
            valueField: 'Id', displayField: 'Name'
        }, {
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
            
            checked: true,
            hidden:true,
            fieldLabel: 'Can Capture Data'
        }]
    }, config));
}
Ext.extend(Ext.mrv.ghginventory.ux.locations.Form, Ext.form.FormPanel);
Ext.reg('locations-form', Ext.mrv.ghginventory.ux.locations.Form);

/**
* @desc      Location registration form host window
* @author    Dawit Kiros
* @copyright (c) 2010, Cybersoft
* @namespace Ext.mrv.ghginventory.ux.locations
* @class     Ext.mrv.ghginventory.ux.locations.Window
* @extends   Ext.Window
*/
Ext.mrv.ghginventory.ux.locations.Window = function (config) {
    Ext.mrv.ghginventory.ux.locations.Window.superclass.constructor.call(this, Ext.apply({
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
                var tree = Ext.getCmp('locations-tree');
                var node = tree.getNodeById(tree.selectedlocationId);
                var parent = node.attributes.text;
                if (this.mode == 'edit') {
                    this.form.getForm().load({ params: { id: this.locationId} });
                }
                this.form.getForm().findField('Parent').setValue(parent);
            }
        }
    }, config));
}
Ext.extend(Ext.mrv.ghginventory.ux.locations.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.mrv.ghginventory.ux.locations.Form({ mode: this.mode });
        this.items = [this.form];
        this.bbar = [{
            xtype: 'tbfill'
        }, {
            text: 'Save',
            iconCls: 'icon-save',
            scope: this,
            handler: this.onlocationSave
        }, {
            xtype: 'tbseparator'
        }, {
            text: 'Close',
            iconCls: 'icon-exit',
            handler: this.onlocationClose,
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
        Ext.mrv.ghginventory.ux.locations.Window.superclass.initComponent.call(this, arguments);
    },
    onlocationSave: function () {
        if (!this.form.getForm().isValid()) return;
        if (this.parentId != 'root-locations') {
            this.form.getForm().findField('ParentId').setValue(this.parentId);
        }
        var tree = Ext.getCmp('locations-tree');
        var parentNode = tree.getNodeById(tree.selectedlocationId);
        var mode = this.mode;
        var win = this;
        this.form.getForm().submit({
            waitMsg: 'Please wait...',
            success: function () {
                var form = Ext.getCmp('locations-form').getForm();
                form.findField('Name').setRawValue('');
                form.findField('Code').setRawValue('');
                Ext.getCmp('locations-paging').doRefresh();
                if (mode == 'add') {
                    tree.getNodeById(tree.selectedlocationId).reload();
                }
                else {
                    parentNode.reload();
                    //tree.selectedlocationId = 0;
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
    onlocationClose: function () {
        this.close();
    }
});
Ext.reg('locations-window', Ext.mrv.ghginventory.ux.locations.Window);

/**
* @desc      Location grid
* @author    Dawit Kiros
* @copyright (c) 2010, Cybersoft

* @namespace Ext.mrv.ghginventory.ux.locations
* @class     Ext.mrv.ghginventory.ux.locations.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.mrv.ghginventory.ux.locations.Grid = function (config) {
    Ext.mrv.ghginventory.ux.locations.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: Location.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Name',
                direction: 'ASC'
            },
            fields: ['Id', 'Name','NameA', 'Code', 'Type', 'Parent'],
            remoteSort: true,
            listeners: {
                beforeLoad: function () { Ext.getCmp('locations-grid').body.mask('Loading...', 'x-mask-loading'); },
                load: function () { Ext.getCmp('locations-grid').body.unmask(); },
                loadException: function () { Ext.getCmp('locations-grid').body.unmask(); },
                scope: this
            }
        }),
        id: 'locations-grid',
        selectedlocationTypeId: 0,
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
            header: 'Location Name',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'NameA',
            header: 'Amharic Location Name',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'Code',
            header: 'Location Code',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'Type',
            header: 'Location Type',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'Parent',
            header: 'Parent Location',
            sortable: false,
            width: 100,
            menuDisabled: true
        }]
    }, config));
}
Ext.extend(Ext.mrv.ghginventory.ux.locations.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ locationTypeId: this.locationTypeId }) };
        this.tbar = [{
            xtype: 'button',
            text: 'Add',
            id: 'addlocation',
            iconCls: 'icon-add',
            //disabled: !Ext.mrv.ghginventory.ux.Reception.getPermission('Location', 'CanAdd'),
            handler: this.onAddClick
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Edit',
            id: 'editlocation',
            iconCls: 'icon-edit',
            //disabled: !Ext.mrv.ghginventory.ux.Reception.getPermission('Location', 'CanEdit'),
            handler: this.onEditClick
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Delete',
            id: 'deletelocation',
            iconCls: 'icon-delete',
            //disabled: !Ext.mrv.ghginventory.ux.Reception.getPermission('Location', 'CanDelete'),
            handler: this.onDeleteClick
        }, {
            xtype: 'tbfill'
        }];
        this.bbar = new Ext.PagingToolbar({
            id: 'locations-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.mrv.ghginventory.ux.locations.Grid.superclass.initComponent.apply(this, arguments);
        //Ext.getCmp('locations-tree').expandAll();
    },
    onAddClick: function () {
        var tree = Ext.getCmp('locations-tree');
        if (tree.selectedlocationId == 0) {
            Ext.MessageBox.show({
                title: 'Select',
                msg: 'You must select a parent location from the left panel.',
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
        new Ext.mrv.ghginventory.ux.locations.Window({
            locationId: 0,
            parentId: tree.selectedlocationId,
            mode: 'add',
            title: 'Add Location'
        }).show();
    },
    onEditClick: function () {
        var grid = Ext.getCmp('locations-grid');
        if (!grid.getSelectionModel().hasSelection()) {
            Ext.MessageBox.show({
                title: 'Select',
                msg: 'You must select a locations to edit.',
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
        var locationId = grid.getSelectionModel().getSelected().get('Id');
        var parentId = grid.parentId;
        new Ext.mrv.ghginventory.ux.locations.Window({
            title: 'Edit Location',
            locationId: locationId,
            parentId: parentId,
            mode: 'edit'
        }).show();
    },
    onDeleteClick: function () {
        var tree = Ext.getCmp('locations-tree');
        if (tree.selectedlocationId == 'root-locations' || tree.selectedlocationId == 0) {
            Ext.MessageBox.show({
                title: 'Select',
                msg: 'You must select a locations to delete.',
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
        var parentNode = tree.getNodeById(tree.selectedlocationId).parentNode;
        Ext.MessageBox.show({
            title: 'Delete',
            msg: 'Are you sure you want to delete the selected locations',
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
                        msg: 'Deleting this locations could make other related data invalid. Press Ok to delete, Press Cancel to abort.',
                        buttons: {
                            ok: 'Ok',
                            cancel: 'Cancel'
                        },
                        icon: Ext.MessageBox.WARNING,
                        scope: this,
                        fn: function (btn) {
                            if (btn == 'ok') {
                                Location.Delete(tree.selectedlocationId, function (result) {
                                    Ext.getCmp('locations-paging').doRefresh();
                                    if (result.success) {
                                        parentNode.reload();
                                        tree.selectedlocationId = 0;
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
Ext.reg('locations-grid', Ext.mrv.ghginventory.ux.locations.Grid);

/**
* @desc      Location tree
* @author    Dawit Kiros
* @copyright (c) 2010, Cybersoft

* @namespace Ext.mrv.ghginventory.ux.locations
* @class     Ext.mrv.ghginventory.ux.locations.Tree
* @extends   Ext.Window
*/
Ext.mrv.ghginventory.ux.locations.Tree = function (config) {
    Ext.mrv.ghginventory.ux.locations.Tree.superclass.constructor.call(this, Ext.apply({
        id: 'locations-tree',
        loader: new Ext.tree.TreeLoader({
            directFn: Location.PopulateTree
        }),
        selectedlocationId: 0,
        selectedlocationTypeId: 0,
        border: false,
        rootVisible: true,
        lines: true,
        
        useArrows: true,
        animate: true,
        autoScroll: true,
        enableDD: true,
        containerScroll: true,
        stateful: false,
        root: {
            text: 'Geographic Locations',
            id: 'root-locations'
        },
        listeners: {
            click: function (node, e) {
                e.stopEvent();
                node.select();
                if (node.isExpandable()) {
                    node.reload();
                }
                node.getOwnerTree().selectedlocationTypeId = node.attributes.id == 'root-locations' ? 'root-locations' : node.attributes.locationTypeId;
                node.getOwnerTree().selectedlocationId = node.attributes.id;
                var locationGrid = Ext.getCmp('locations-grid');
                locationGrid.parentId = node.id;
                locationGrid.store.baseParams = { record: Ext.encode({ locationId: node.id }) };
                locationGrid.store.load({ params: { start: 0, limit: locationGrid.pageSize} });
            },
            contextmenu: function (node, e) {
                node.select();
                node.getOwnerTree().selectedlocationTypeId = node.attributes.id == 'root-locations' ? 'root-locations' : node.attributes.locationTypeId;
                node.getOwnerTree().selectedlocationId = node.attributes.id;
                var locationGrid = Ext.getCmp('locations-grid');
                locationGrid.store.baseParams = { record: Ext.encode({ locationId: node.id }) };
                locationGrid.store.load({ params: { start: 0, limit: locationGrid.pageSize} });
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

                    Location.Restructure(childNodeId, currentParentNodeId, function (result) {
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
Ext.extend(Ext.mrv.ghginventory.ux.locations.Tree, Ext.tree.TreePanel, {
    initComponent: function () {
        this.tbar = [ {
            xtype: 'tbfill'
        }, {
            xtype: 'button',
            id: 'expand-all',
            iconCls: 'icon-expand-all',
            tooltip: 'Expand All',
            handler: function () {
                Ext.getCmp('locations-tree').expandAll();
            }
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            id: 'collapse-all',
            iconCls: 'icon-collapse-all',
            tooltip: 'Collapse All',
            handler: function () {
                Ext.getCmp('locations-tree').collapseAll();
            }
        }];
        Ext.mrv.ghginventory.ux.locations.Tree.superclass.initComponent.call(this, arguments);
    }
});
Ext.reg('locations-tree', Ext.mrv.ghginventory.ux.locations.Tree);

/**
* @desc      Location panel
* @author    Dawit Kiros
* @copyright (c) 2010, Cybersoft

* @version   $Id: Location.js, 0.1
* @namespace Ext.mrv.ghginventory.ux.locations
* @class     Ext.mrv.ghginventory.ux.locations.Panel
* @extends   Ext.Panel
*/
Ext.mrv.ghginventory.ux.locations.Panel = function (config) {
    Ext.mrv.ghginventory.ux.locations.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false
    }, config));
}
Ext.extend(Ext.mrv.ghginventory.ux.locations.Panel, Ext.Panel, {
    initComponent: function () {
        this.tree = new Ext.mrv.ghginventory.ux.locations.Tree();
        this.grid = new Ext.mrv.ghginventory.ux.locations.Grid();
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
        Ext.mrv.ghginventory.ux.locations.Panel.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('locations-panel', Ext.mrv.ghginventory.ux.locations.Panel);
