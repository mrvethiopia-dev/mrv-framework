Ext.ns('Ext.mrv.ghginventory.ux.parameters');
/**
* @desc      Sector registration form
* @author    Dawit Kiros 
* @namespace Ext.mrv.ghginventory.ux.parameters
* @class     Ext.mrv.ghginventory.ux.parameters.Form
* @extends   Ext.form.FormPanel
*/
Ext.mrv.ghginventory.ux.parameters.Form = function (config) {
    Ext.mrv.ghginventory.ux.parameters.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: Sector.Get,
            submit: Sector.Save
        },
        id: 'parameters-form',
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
Ext.extend(Ext.mrv.ghginventory.ux.parameters.Form, Ext.form.FormPanel);
Ext.reg('parameters-form', Ext.mrv.ghginventory.ux.parameters.Form);

/**
* @desc      Sector registration form host window
* @author    Dawit Kiros
* @copyright (c) 2010, Cybersoft

* @namespace Ext.mrv.ghginventory.ux.parameters
* @class     Ext.mrv.ghginventory.ux.parameters.Window
* @extends   Ext.Window
*/
Ext.mrv.ghginventory.ux.parameters.Window = function (config) {
    Ext.mrv.ghginventory.ux.parameters.Window.superclass.constructor.call(this, Ext.apply({
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
                var tree = Ext.getCmp('parameters-tree');
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
Ext.extend(Ext.mrv.ghginventory.ux.parameters.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.mrv.ghginventory.ux.parameters.Form({ mode: this.mode });
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
        Ext.mrv.ghginventory.ux.parameters.Window.superclass.initComponent.call(this, arguments);
    },
    onsectorSave: function () {
        if (!this.form.getForm().isValid()) return;
        if (this.parentId != 'root-sectors') {
            this.form.getForm().findField('ParentId').setValue(this.parentId);
        }
        var tree = Ext.getCmp('parameters-tree');
        var parentNode = tree.getNodeById(tree.selectedsectorId);
        var mode = this.mode;
        var win = this;
        this.form.getForm().submit({
            waitMsg: 'Please wait...',
            success: function () {
                var form = Ext.getCmp('parameters-form').getForm();
                form.findField('Name').setRawValue('');
                form.findField('Code').setRawValue('');
                Ext.getCmp('parameters-paging').doRefresh();
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
Ext.reg('parameters-window', Ext.mrv.ghginventory.ux.parameters.Window);

/**
* @desc      Sector grid
* @author    Dawit Kiros
* @copyright (c) 2010, Cybersoft

* @namespace Ext.mrv.ghginventory.ux.parameters
* @class     Ext.mrv.ghginventory.ux.parameters.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.mrv.ghginventory.ux.parameters.Grid = function (config) {
    Ext.mrv.ghginventory.ux.parameters.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: Parameter.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Name',
                direction: 'ASC'
            },
            fields: ['Id', 'SectorId', 'Name', 'DataTypeId', 'TypeOfData', 'GHGTypeId', 'GHGType', 'UnitId', 'UOM', 'ParameterID', 'emptyCol'],
            remoteSort: true,
            listeners: {
                beforeLoad: function () {
                    Ext.getCmp('parameters-grid').body.mask('Loading...', 'x-mask-loading');
                },
                load: function () {
                    var grid = Ext.getCmp('parameters-grid');
                    var store = grid.getStore();

                    
                    grid.body.unmask();
                    this.addRow();
                },
                loadException: function () {
                    Ext.getCmp('parameters-grid').body.unmask();
                },
                remove: function (store) {
                    var grid = Ext.getCmp('parameters-grid');
                    
                },
                scope: this
            }
        }),
        id: 'parameters-grid',
        selectedsectorTypeId: 0,
        pageSize: 30,
        height: 300,
        stripeRows: true,
        border: false,
        columnLines:true,
        clicksToEdit: 1,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true,
            onEditorKey: function (field, e) {
                var k = e.getKey(), newCell = null, g = this.grid, ed = g.activeEditor;
                var shift = e.shiftKey;
                ctrlKeyPressed = e.ctrlKey;
                if ((k == e.TAB || k == e.ENTER) && e.ctrlKey == false) {
                    e.stopEvent();
                    field.gridEditor.completeEdit();

                    if (shift) {
                        newCell = g.walkCells(field.gridEditor.row, field.gridEditor.col - 1, -1, this.acceptsNav, this);
                    } else {
                        newCell = g.walkCells(field.gridEditor.row, field.gridEditor.col + 1, 1, this.acceptsNav, this);
                        if (!newCell) {
                            g.addRow();
                        }
                    }
                }
                if (newCell) {
                    g.startEditing(newCell[0], newCell[1]);
                }
            }
        }),
        viewConfig: {
            forceFit: true,
            autoFill: true
        },listeners: {           

            afteredit: function(e){ 
                var record = e.record;
                var grid = Ext.getCmp('parameters-grid');
                var store, cm;
                if (e.field == 'TypeOfData') {
                    cm = grid.getColumnModel();
                    var typeOfDataCol = cm.getColumnAt(4);
                    var editor = typeOfDataCol.editor;
                    store = editor.store;
                    if (store.data.length == 0) { 
                        record.set('DataTypeId', '');
                    } else {
                        try {                            
                            var dataTypeId = store.getById(editor.getValue()).data.Id;                            
                            record.set('DataTypeId', dataTypeId);

                        } catch (e) {
                            record.set('DataTypeId', '');
                            
                            Ext.MessageBox.show({
                                title: 'Error',
                                msg: 'Type of Data not selected. Please enter the Type of Data appropriately!',
                                buttons: Ext.Msg.OK,
                                icon: Ext.MessageBox.ERROR,
                                scope: this
                            });
                        }

                    }

                }
                else if (e.field == 'GHGType') {
                    cm = grid.getColumnModel();
                    var ghgTypeCol = cm.getColumnAt(6);
                    var editor = ghgTypeCol.editor;
                    store = editor.store;
                    if (store.data.length == 0) {
                        record.set('GHGTypeId', '');
                    } else {
                        try {
                            var ghgTypeId = store.getById(editor.getValue()).data.Id;
                            record.set('GHGTypeId', ghgTypeId);

                        } catch (e) {
                            record.set('GHGTypeId', '');

                            Ext.MessageBox.show({
                                title: 'Error',
                                msg: 'GHG Type not selected. Please enter the correct GHG Type!',
                                buttons: Ext.Msg.OK,
                                icon: Ext.MessageBox.ERROR,
                                scope: this
                            });
                        }

                    }

                }
                else if (e.field == 'UOM') {
                    cm = grid.getColumnModel();
                    var uomCol = cm.getColumnAt(8);
                    var editor = uomCol.editor;
                    store = editor.store;
                    if (store.data.length == 0) {
                        record.set('UnitId', '');
                    } else {
                        try {
                            var unitId = store.getById(editor.getValue()).data.Id;
                            record.set('UnitId', unitId);

                        } catch (e) {
                            record.set('UnitId', '');

                            Ext.MessageBox.show({
                                title: 'Error',
                                msg: 'UOM not selected. Please enter the correct UOM',
                                buttons: Ext.Msg.OK,
                                icon: Ext.MessageBox.ERROR,
                                scope: this
                            });
                        }

                    }

                }
            }
        },
        columns: [{
            dataIndex: 'Id',
            header: 'Id',
            sortable: true,
            hidden: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'SectorId',
            header: 'SectorId',
            sortable: true,
            hidden: true,
            width: 100,
            menuDisabled: true
        },{
            dataIndex: 'Name',
            header: 'Parameter Name',
            sortable: true,
            width: 150,
            menuDisabled: true,
            editor: new Ext.form.TextField({
                allowBlank: true,
                
                listeners: {
                    focus: function (field) {
                        field.selectText();
                    }
                }
            })
        }, {
            dataIndex: 'DataTypeId',
            header: 'DataTypeId',
            sortable: true,
            hidden: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'TypeOfData',
            header: 'TypeOfData',
            sortable: false,
            width: 150,
            menuDisabled: true,
            xtype: 'combocolumn',
            editor: new Ext.form.ComboBox({
                hiddenName: 'TypeOfData',
                typeAhead: false,
                triggerAction: 'all',
                mode: 'local',
                forceSelection: true,
                store: new Ext.data.DirectStore({
                    reader: new Ext.data.JsonReader({
                        successProperty: 'success',
                        idProperty: 'Id',
                        root: 'data',
                        fields: ['Id', 'Name']
                    }),
                    autoLoad: true,
                    api: { read: window.GHGDataTypes.GetAllDataTypes }
                }),
                valueField: 'Id',
                displayField: 'Name'
            })

        }, {
            dataIndex: 'GHGTypeId',
            header: 'GHGTypeId',
            sortable: true,
            hidden: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'GHGType',
            header: 'GHGType',
            sortable: false,
            width: 150,
            menuDisabled: true,
            xtype: 'combocolumn',
            editor: new Ext.form.ComboBox({
                hiddenName: 'GHGType',
                typeAhead: false,
                triggerAction: 'all',
                mode: 'local',
                forceSelection: true,
                store: new Ext.data.DirectStore({
                    reader: new Ext.data.JsonReader({
                        successProperty: 'success',
                        idProperty: 'Id',
                        root: 'data',
                        fields: ['Id', 'Name']
                    }),
                    autoLoad: true,
                    api: { read: window.GHGTypes.GetAllGHGTypes }
                }),
                valueField: 'Id',
                displayField: 'Name'
            })

        }, {
            dataIndex: 'UnitId',
            header: 'UnitId',
            sortable: true,
            hidden: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'UOM',
            header: 'UOM',
            sortable: false,
            width: 150,
            menuDisabled: true,
            xtype: 'combocolumn',
            editor: new Ext.form.ComboBox({
                hiddenName: 'UOM',
                typeAhead: false,
                triggerAction: 'all',
                mode: 'local',
                forceSelection: true,
                store: new Ext.data.DirectStore({
                    reader: new Ext.data.JsonReader({
                        successProperty: 'success',
                        idProperty: 'Id',
                        root: 'data',
                        fields: ['Id', 'Name']
                    }),
                    autoLoad: true,
                    api: { read: window.GHGUnits.GetAllUnits }
                }),
                valueField: 'Id',
                displayField: 'Name'
            })

        }, {
            dataIndex: 'ParameterID',
            header: 'Parameter ID ',
            sortable: true,
            width: 150,
            menuDisabled: true,
            editor: new Ext.form.TextField({
                allowBlank: true,

                listeners: {
                    focus: function (field) {
                        field.selectText();
                    }
                }
            })
        }, {
            dataIndex: 'emptyCol',
            header: '',
            sortable: false,
            width: 15,
            menuDisabled: true
        }]
    }, config));
}
Ext.extend(Ext.mrv.ghginventory.ux.parameters.Grid, Ext.grid.GridPanel, {
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
            id: 'parameters-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.mrv.ghginventory.ux.parameters.Grid.superclass.initComponent.apply(this, arguments);
        //Ext.getCmp('parameters-tree').expandAll();
    },

    onAddClick: function () {
        var tree = Ext.getCmp('parameters-tree');
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
        new Ext.mrv.ghginventory.ux.parameters.Window({
            sectorId: 0,
            parentId: tree.selectedsectorId,
            mode: 'add',
            title: 'Add Sector'
        }).show();
    },
    onEditClick: function () {
        var grid = Ext.getCmp('parameters-grid');
        if (!grid.getSelectionModel().hasSelection()) {
            Ext.MessageBox.show({
                title: 'Select',
                msg: 'You must select a parameters to edit.',
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
        var sectorId = grid.getSelectionModel().getSelected().get('Id');
        var parentId = grid.parentId;
        new Ext.mrv.ghginventory.ux.parameters.Window({
            title: 'Edit Sector',
            sectorId: sectorId,
            parentId: parentId,
            mode: 'edit'
        }).show();
    },
    onDeleteClick: function () {
        var tree = Ext.getCmp('parameters-tree');
        if (tree.selectedsectorId == 'root-sectors' || tree.selectedsectorId == 0) {
            Ext.MessageBox.show({
                title: 'Select',
                msg: 'You must select a parameters to delete.',
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
        var parentNode = tree.getNodeById(tree.selectedsectorId).parentNode;
        Ext.MessageBox.show({
            title: 'Delete',
            msg: 'Are you sure you want to delete the selected parameters',
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
                        msg: 'Deleting this parameters could make other related data invalid. Press Ok to delete, Press Cancel to abort.',
                        buttons: {
                            ok: 'Ok',
                            cancel: 'Cancel'
                        },
                        icon: Ext.MessageBox.WARNING,
                        scope: this,
                        fn: function (btn) {
                            if (btn == 'ok') {
                                Sector.Delete(tree.selectedsectorId, function (result) {
                                    Ext.getCmp('parameters-paging').doRefresh();
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

Ext.extend(Ext.mrv.ghginventory.ux.parameters.Grid, Ext.grid.EditorGridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ voucherTypeId: this.voucherTypeId }) };
        this.tbar = [{}];
        this.bbar = [{}];
        Ext.mrv.ghginventory.ux.parameters.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.addRow();
        Ext.mrv.ghginventory.ux.parameters.Grid.superclass.afterRender.apply(this, arguments);
    },
    addRow: function () {
        var grid = Ext.getCmp('parameters-grid');
        var store = grid.getStore();
        var voucher = store.recordType;
        var p = new voucher({


            Name:''

        });
        var count = store.getCount();
        grid.stopEditing();
        store.insert(count, p);
        if (count > 0) {
            grid.startEditing(count, 3);
        }
    },

});
Ext.reg('parameters-grid', Ext.mrv.ghginventory.ux.parameters.Grid);

/**
* @desc      Sector tree
* @author    Dawit Kiros
* @copyright (c) 2010, Cybersoft

* @namespace Ext.mrv.ghginventory.ux.parameters
* @class     Ext.mrv.ghginventory.ux.parameters.Tree
* @extends   Ext.Window
*/
Ext.mrv.ghginventory.ux.parameters.Tree = function (config) {
    Ext.mrv.ghginventory.ux.parameters.Tree.superclass.constructor.call(this, Ext.apply({
        id: 'parameters-tree',
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
                var parametersGrid = Ext.getCmp('parameters-grid');
                parametersGrid.parentId = node.id;
                parametersGrid.store.baseParams = { record: Ext.encode({ sectorId: node.id }) };
                parametersGrid.store.load({
                    params: { start: 0, limit: parametersGrid.pageSize },
                    
                });

                
            },
            contextmenu: function (node, e) {
                node.select();
                node.getOwnerTree().selectedsectorTypeId = node.attributes.id == 'root-sectors' ? 'root-sectors' : node.attributes.sectorTypeId;
                node.getOwnerTree().selectedsectorId = node.attributes.id;
                var parametersGrid = Ext.getCmp('parameters-grid');
                parametersGrid.store.baseParams = { record: Ext.encode({ sectorId: node.id }) };
                parametersGrid.store.load({ params: { start: 0, limit: parametersGrid.pageSize} });
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
Ext.extend(Ext.mrv.ghginventory.ux.parameters.Tree, Ext.tree.TreePanel, {
    initComponent: function () {
        this.tbar = [ {
            xtype: 'tbfill'
        }, {
            xtype: 'button',
            id: 'expand-all',
            iconCls: 'icon-expand-all',
            tooltip: 'Expand All',
            handler: function () {
                Ext.getCmp('parameters-tree').expandAll();
            }
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            id: 'collapse-all',
            iconCls: 'icon-collapse-all',
            tooltip: 'Collapse All',
            handler: function () {
                Ext.getCmp('parameters-tree').collapseAll();
            }
        }];
        Ext.mrv.ghginventory.ux.parameters.Tree.superclass.initComponent.call(this, arguments);
    }
});
Ext.reg('parameters-tree', Ext.mrv.ghginventory.ux.parameters.Tree);

/**
* @desc      Sector panel
* @author    Dawit Kiros
* @copyright (c) 2010, Cybersoft

* @version   $Id: Sector.js, 0.1
* @namespace Ext.mrv.ghginventory.ux.parameters
* @class     Ext.mrv.ghginventory.ux.parameters.Panel
* @extends   Ext.Panel
*/
Ext.mrv.ghginventory.ux.parameters.Panel = function (config) {
    Ext.mrv.ghginventory.ux.parameters.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false
    }, config));
}
Ext.extend(Ext.mrv.ghginventory.ux.parameters.Panel, Ext.Panel, {
    initComponent: function () {
        this.tree = new Ext.mrv.ghginventory.ux.parameters.Tree();
        this.grid = new Ext.mrv.ghginventory.ux.parameters.Grid();
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
        Ext.mrv.ghginventory.ux.parameters.Panel.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('parameters-panel', Ext.mrv.ghginventory.ux.parameters.Panel);
