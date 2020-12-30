Ext.ns('Ext.erp.CoreFin.ux.chartOfAccount');

Ext.erp.CoreFin.ux.chartOfAccount.Form = function (config) {
    Ext.erp.CoreFin.ux.chartOfAccount.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            submit: ChartOfAccount.Save
        },
        id: 'chartOfAccount-form',
        autoHeight: true,
        border: false,
        items: [{
            name: 'Id',
            xtype: 'hidden'
        }, {
            name: 'CreatedAt',
            xtype: 'hidden'
        }]
    }, config));
};
Ext.extend(Ext.erp.CoreFin.ux.chartOfAccount.Form, Ext.form.FormPanel);
Ext.reg('chartOfAccount-form', Ext.erp.CoreFin.ux.chartOfAccount.Form);

/**
* @desc      AccountCategory grid
* @author    Dawit Kiros
* @copyright (c) 2010, Cybersoft
* @date      November 01, 2010
* @namespace Ext.erp.CoreFin.ux.chartOfAccount
* @class     Ext.erp.CoreFin.ux.chartOfAccount.AccountCategoryGrid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.CoreFin.ux.chartOfAccount.AccountCategoryGrid = function (config) {
    Ext.erp.CoreFin.ux.chartOfAccount.AccountCategoryGrid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: ChartOfAccount.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Name',
                direction: 'ASC'
            },
            fields: ['Id', 'Name', 'Code'],
            remoteSort: true,
            pruneModifiedRecords: true
        }),
        id: 'accountCategory-grid',
        pageSize: 10,
        stripeRows: true,
        border: false,
        columnLines: true,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        viewConfig: {
            forceFit: true,
            autoFill: true
        },
        listeners: {
            containermousedown: function (grid, e) {
                grid.getSelectionModel().deselectRange(0, grid.pageSize);
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
        }, new Ext.grid.RowNumberer(), {
            dataIndex: 'Name',
            header: 'Name',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'Code',
            header: 'Code',
            sortable: true,
            width: 100,
            menuDisabled: true
        }]
    }, config));
};
Ext.extend(Ext.erp.CoreFin.ux.chartOfAccount.AccountCategoryGrid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.bbar = [{}];
        Ext.erp.CoreFin.ux.chartOfAccount.AccountCategoryGrid.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('accountCategory-grid', Ext.erp.CoreFin.ux.chartOfAccount.AccountCategoryGrid);

/**
* @desc      AccountType grid
* @author    Dawit Kiros
* @copyright (c) 2010, Cybersoft
* @date      November 01, 2010
* @namespace Ext.erp.CoreFin.ux.chartOfAccount
* @class     Ext.erp.CoreFin.ux.chartOfAccount.AccountTypeGrid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.CoreFin.ux.chartOfAccount.AccountTypeGrid = function (config) {
    Ext.erp.CoreFin.ux.chartOfAccount.AccountTypeGrid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: ChartOfAccount.GetAll,
            autoSave: false,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Name',
                direction: 'ASC'
            },
            fields: ['Id', 'Name', 'Code', 'BalanceSide'],
            remoteSort: true,
            pruneModifiedRecords: true,
            listeners: {
                load: function () {
                    if (this.store.data.length == 0) {
                        this.addRow();
                    }
                },
                scope: this
            }
        }),
        id: 'accountType-grid',
        pageSize: 10,
        stripeRows: true,
        border: false,
        columnLines: true,
        clicksToEdit: 1,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true,
            onEditorKey: function (field, e) {
                var k = e.getKey(), newCell, g = this.grid, ed = g.activeEditor;
                var shift = e.shiftKey;
                if (k == e.TAB) {
                    e.stopEvent();
                    ed.completeEdit();
                    if (shift) {
                        newCell = g.walkCells(ed.row, ed.col - 1, -1, this.acceptsNav, this);
                    } else {
                        newCell = g.walkCells(ed.row, ed.col + 1, 1, this.acceptsNav, this);
                        if (!newCell) { g.addRow(); }
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
        },
        listeners: {
            afteredit: function (e) {
                var record = e.record;
                var grid = Ext.getCmp('accountType-grid');
                if (e.field == 'BalanceSide') {
                    var cm = grid.getColumnModel();
                    var balanceSideCol = cm.getColumnAt(4);
                    var store = balanceSideCol.editor.store;
                    if (store.data.length == 0) {
                        record.set('BalanceSide', e.originalValue);
                    }
                }
            },
            containermousedown: function (grid, e) {
                grid.getSelectionModel().deselectRange(0, grid.pageSize);
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
        }, new Ext.grid.RowNumberer(), {
            dataIndex: 'Name',
            header: 'Name',
            sortable: true,
            width: 100,
            menuDisabled: true,
            editor: new Ext.form.TextField({
                allowBlank: false
            })
        }, {
            dataIndex: 'Code',
            header: 'Code',
            sortable: true,
            width: 100,
            menuDisabled: true,
            editor: new Ext.form.TextField({
                allowBlank: false
            })
        }, {
            dataIndex: 'BalanceSide',
            header: 'Balance Side',
            sortable: true,
            width: 100,
            menuDisabled: true,
            lazyRender: true,
            xtype: 'combocolumn',
            editor: new Ext.form.ComboBox({
                hiddenName: 'BalanceSideId',
                typeAhead: true,
                triggerAction: 'all',
                mode: 'local',
                store: new Ext.data.DirectStore({
                    reader: new Ext.data.JsonReader({
                        successProperty: 'success',
                        idProperty: 'Id',
                        root: 'data',
                        fields: ['Id', 'Name']
                    }),
                    autoLoad: true,
                    api: { read: Tsa.GetBalanceSides }
                }),
                valueField: 'Id',
                displayField: 'Name'
            })
        }]
    }, config));
};
Ext.extend(Ext.erp.CoreFin.ux.chartOfAccount.AccountTypeGrid, Ext.grid.EditorGridPanel, {
    initComponent: function () {
        this.bbar = [{}];
        Ext.erp.CoreFin.ux.chartOfAccount.AccountTypeGrid.superclass.initComponent.apply(this, arguments);
    },
    addRow: function () {
        var grid = Ext.getCmp('accountType-grid');
        var store = grid.getStore();
        var AccountType = store.recordType;
        var p = new AccountType({
            Name: '',
            Code: '',
            BalanceSide: ''
        });
        var count = store.getCount();
        grid.stopEditing();
        store.insert(count, p);
        if (count > 0) {
            grid.startEditing(count, 2);
        }
    }
});
Ext.reg('accountType-grid', Ext.erp.CoreFin.ux.chartOfAccount.AccountTypeGrid);

/**
* @desc      AccountGroup grid
* @author    Dawit Kiros
* @copyright (c) 2010, Cybersoft
* @date      November 01, 2010
* @namespace Ext.erp.CoreFin.ux.chartOfAccount
* @class     Ext.erp.CoreFin.ux.chartOfAccount.AccountGroupGrid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.CoreFin.ux.chartOfAccount.AccountGroupGrid = function (config) {
    Ext.erp.CoreFin.ux.chartOfAccount.AccountGroupGrid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: ChartOfAccount.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Name',
                direction: 'ASC'
            },
            fields: ['Id', 'Name', 'Code'],
            remoteSort: true,
            pruneModifiedRecords: true,
            listeners: {
                load: function () {
                    if (this.store.data.length == 0) {
                        this.addRow();
                    }
                },
                scope: this
            }
        }),
        id: 'accountGroup-grid',
        pageSize: 10,
        stripeRows: true,
        border: false,
        columnLines: true,
        clicksToEdit: 1,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true,
            onEditorKey: function (field, e) {
                var k = e.getKey(), newCell, g = this.grid, ed = g.activeEditor;
                var shift = e.shiftKey;
                if (k == e.TAB) {
                    e.stopEvent();
                    ed.completeEdit();
                    if (shift) {
                        newCell = g.walkCells(ed.row, ed.col - 1, -1, this.acceptsNav, this);
                    } else {
                        newCell = g.walkCells(ed.row, ed.col + 1, 1, this.acceptsNav, this);
                        if (!newCell) { g.addRow(); }
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
        },
        listeners: {
            containermousedown: function (grid, e) {
                grid.getSelectionModel().deselectRange(0, grid.pageSize);
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
        }, new Ext.grid.RowNumberer(), {
            dataIndex: 'Name',
            header: 'Name',
            sortable: true,
            width: 100,
            menuDisabled: true,
            editor: new Ext.form.TextField({
                allowBlank: false
            })
        }, {
            dataIndex: 'Code',
            header: 'Code',
            sortable: true,
            width: 100,
            menuDisabled: true,
            editor: new Ext.form.TextField({
                allowBlank: false
            })
        }]
    }, config));
};
Ext.extend(Ext.erp.CoreFin.ux.chartOfAccount.AccountGroupGrid, Ext.grid.EditorGridPanel, {
    initComponent: function () {
        this.bbar = [{}];
        Ext.erp.CoreFin.ux.chartOfAccount.AccountGroupGrid.superclass.initComponent.apply(this, arguments);
    },
    addRow: function () {
        var grid = Ext.getCmp('accountGroup-grid');
        var store = grid.getStore();
        var AccountGroup = store.recordType;
        var accountGroup = new AccountGroup({
            Name: '',
            Code: '',
            BalanceSide: ''
        });
        var count = store.getCount();
        grid.stopEditing();
        store.insert(count, accountGroup);
        if (count > 0) {
            grid.startEditing(count, 2);
        }
    }
});
Ext.reg('accountGroup-grid', Ext.erp.CoreFin.ux.chartOfAccount.AccountGroupGrid);

/**
* @desc      ControlAccount grid
* @author    Dawit Kiros
* @copyright (c) 2010, Cybersoft
* @date      November 01, 2010
* @namespace Ext.erp.CoreFin.ux.chartOfAccount
* @class     Ext.erp.CoreFin.ux.chartOfAccount.ControlAccountGrid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.CoreFin.ux.chartOfAccount.ControlAccountGrid = function (config) {
    Ext.erp.CoreFin.ux.chartOfAccount.ControlAccountGrid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: ChartOfAccount.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Name',
                direction: 'ASC'
            },
            fields: ['Id', 'RunningBalance', 'Name', 'Code','BudgetCode' ,'DateCreated', 'BalanceSide', 'IsActive'],
            remoteSort: true,
            pruneModifiedRecords: true,
            listeners: {
                load: function () {
                    if (this.store.data.length == 0) {
                        this.addRow();
                    }
                },
                scope: this
            }
        }),
        id: 'controlAccount-grid',
        accountGroupId: 0,
        searchResult: {},
        pageSize: 10,
        stripeRows: true,
        border: false,
        columnLines: true,
        clicksToEdit: 1,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true,
            onEditorKey: function (field, e) {
                var k = e.getKey(), newCell, g = this.grid, ed = g.activeEditor;
                var shift = e.shiftKey;
                if (k == e.TAB) {
                    e.stopEvent();
                    ed.completeEdit();
                    if (shift) {
                        newCell = g.walkCells(ed.row, ed.col - 1, -1, this.acceptsNav, this);
                    } else {
                        newCell = g.walkCells(ed.row, ed.col + 1, 1, this.acceptsNav, this);
                        if (!newCell) { g.addRow(); }
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
        },
        listeners: {
            beforeedit: function (e) {
                if (e.field == 'DateCreated') {
                    var formattedDate = Ext.util.Format.date(e.value, 'm/d/Y');
                    e.record.set('DateCreated', formattedDate);
                }
            },
            afteredit: function (e) {
                if (e.field == 'DateCreated') {
                    var formattedDate = Ext.util.Format.date(e.value, 'F d, Y');
                    e.record.set('DateCreated', formattedDate);
                }
            },
            containermousedown: function (grid, e) {
                grid.getSelectionModel().deselectRange(0, grid.pageSize);
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
        }, new Ext.grid.RowNumberer(), {
            dataIndex: 'RunningBalance',
            header: 'Running Balance',
            sortable: true,
            width: 100,
            menuDisabled: true,
            align: 'right',
            renderer: function (value) {
                return Ext.util.Format.number(value, '0,000.00 ');
            } /*,
            editor: new Ext.form.NumberField({
                allowBlank: false,
                allowNegative: true,
                listeners: {
                    focus: function (field) {
                        field.selectText();
                    }
                }
            })*/
        }, {
            dataIndex: 'Name',
            header: 'Name',
            sortable: true,
            width: 100,
            menuDisabled: true,
            editor: new Ext.form.TextField({
                allowBlank: false
            })
        }, {
            dataIndex: 'Code',
            header: 'Code',
            sortable: true,
            width: 100,
            menuDisabled: true,
            editor: new Ext.form.TextField({
                allowBlank: false
            })
        }, {
            dataIndex: 'BudgetCode',
            header: 'Budget Code',
            sortable: true,
            width: 100,
            menuDisabled: true,
            lazyRender: true,
            xtype: 'combocolumn',
            editor: new Ext.form.ComboBox({
                typeAhead: true,
                triggerAction: 'all',
                mode: 'local',
                store: new Ext.data.DirectStore({
                    reader: new Ext.data.JsonReader({
                        successProperty: 'success',
                        idProperty: 'Id',
                        root: 'data',
                        fields: ['Id', 'Code']
                    }),
                    autoLoad: true,
                    api: { read: Tsa.GetBudgetCodes }
                }),
                valueField: 'Id',
                displayField: 'Code'
            })
        }, {
            dataIndex: 'DateCreated',
            header: 'Date Created',
            sortable: true,
            width: 100,
            menuDisabled: true,
            hidden: true,
            editor: new Ext.form.DateField({
                format: 'm/d/Y',
                allowBlank: false
            })
        }, {
            dataIndex: 'BalanceSide',
            header: 'Balance Side',
            sortable: true,
            width: 100,
            menuDisabled: true,
            lazyRender: true,
            xtype: 'combocolumn',
            editor: new Ext.form.ComboBox({
                typeAhead: true,
                triggerAction: 'all',
                mode: 'local',
                store: new Ext.data.DirectStore({
                    reader: new Ext.data.JsonReader({
                        successProperty: 'success',
                        idProperty: 'Id',
                        root: 'data',
                        fields: ['Id', 'Name']
                    }),
                    autoLoad: true,
                    api: { read: Tsa.GetBalanceSides }
                }),
                valueField: 'Id',
                displayField: 'Name'
            })
        }, {
            dataIndex: 'IsActive',
            header: 'Is Active',
            sortable: true,
            width: 100,
            menuDisabled: true,
            xtype: 'combocolumn',
            editor: new Ext.form.ComboBox({

                typeAhead: true,
                editable: false,
                triggerAction: 'all',
                mode: 'local',
                store: new Ext.data.SimpleStore({
                    fields: ['Id', 'Name'],
                    data: [['Yes', 'Yes'], ['No', 'No']]
                }),
                valueField: 'Id',
                displayField: 'Name'
            })
        }]
    }, config));
};
Ext.extend(Ext.erp.CoreFin.ux.chartOfAccount.ControlAccountGrid, Ext.grid.EditorGridPanel, {
    initComponent: function () {
        this.bbar = [{}];
        Ext.erp.CoreFin.ux.chartOfAccount.ControlAccountGrid.superclass.initComponent.apply(this, arguments);
    },
    addRow: function () {
        var grid = Ext.getCmp('controlAccount-grid');
        var store = grid.getStore();
        var ControlAccount = store.recordType;
        var controlAccount = new ControlAccount({
            Name: '',
            Code: '',
            DateCreated: Ext.util.Format.date((new Date()).clearTime(), 'F d, Y'),
            RunningBalance: 0
        });
        var count = store.getCount();
        grid.stopEditing();
        store.insert(count, controlAccount);
        if (count > 0) {
            grid.startEditing(count, 3);
        }
    }
});
Ext.reg('controlAccount-grid', Ext.erp.CoreFin.ux.chartOfAccount.ControlAccountGrid);

/**
* @desc      SubsidiaryAccount grid
* @author    Dawit Kiros
* @copyright (c) 2010, Cybersoft
* @date      November 01, 2010
* @namespace Ext.erp.CoreFin.ux.chartOfAccount
* @class     Ext.erp.CoreFin.ux.chartOfAccount.SubsidiaryAccountGrid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.CoreFin.ux.chartOfAccount.SubsidiaryAccountGrid = function (config) {
    Ext.erp.CoreFin.ux.chartOfAccount.SubsidiaryAccountGrid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: ChartOfAccount.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Name',
                direction: 'ASC'
            },
            fields: ['Id', 'Name', 'Code', 'DateCreated', 'BalanceSide', 'RunningBalance'],
            remoteSort: true,
            pruneModifiedRecords: true,
            listeners: {
                load: function () {
                    if (this.store.data.length == 0) {
                        this.addRow();
                    }
                },
                scope: this
            }
        }),
        id: 'subsidiaryAccount-grid',
        controlAccountId: 0,
        searchResult: {},
        pageSize: 10,
        stripeRows: true,
        border: false,
        columnLines: true,
        clicksToEdit: 1,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true,
            onEditorKey: function (field, e) {
                var k = e.getKey(), newCell, g = this.grid, ed = g.activeEditor;
                var shift = e.shiftKey;
                if (k == e.TAB) {
                    e.stopEvent();
                    ed.completeEdit();
                    if (shift) {
                        newCell = g.walkCells(ed.row, ed.col - 1, -1, this.acceptsNav, this);
                    } else {
                        newCell = g.walkCells(ed.row, ed.col + 1, 1, this.acceptsNav, this);
                        if (!newCell) { g.addRow(); }
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
        },
        listeners: {
            beforeedit: function (e) {
                if (e.field == 'DateCreated') {
                    var formattedDate = Ext.util.Format.date(e.value, 'm/d/Y');
                    e.record.set('DateCreated', formattedDate);
                }
            },
            afteredit: function (e) {
                if (e.field == 'DateCreated') {
                    var formattedDate = Ext.util.Format.date(e.value, 'F d, Y');
                    e.record.set('DateCreated', formattedDate);
                } else if (e.field == 'BalanceSide') {
                    var grid = Ext.getCmp('subsidiaryAccount-grid');
                    var cm = grid.getColumnModel();
                    var balanceSideCol = cm.getColumnAt(5);
                    var store = balanceSideCol.editor.store;
                    if (store.data.length == 0) {
                        record.set('BalanceSide', e.originalValue);
                    }
                }
            },
            containermousedown: function (grid, e) {
                grid.getSelectionModel().deselectRange(0, grid.pageSize);
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
        }, new Ext.grid.RowNumberer(), {
            dataIndex: 'Name',
            header: 'Name',
            sortable: true,
            width: 100,
            menuDisabled: true,
            editor: new Ext.form.TextField({
                allowBlank: false
            })
        }, {
            dataIndex: 'Code',
            header: 'Code',
            sortable: true,
            width: 100,
            menuDisabled: true,
            editor: new Ext.form.TextField({
                allowBlank: false
            })
        }, {
            dataIndex: 'DateCreated',
            header: 'Date Created',
            sortable: true,
            width: 100,
            menuDisabled: true,
            editor: new Ext.form.DateField({
                allowBlank: false
            })
        }, {
            dataIndex: 'BalanceSide',
            header: 'Balance Side',
            sortable: true,
            width: 100,
            menuDisabled: true,
            lazyRender: true,
            xtype: 'combocolumn',
            editor: new Ext.form.ComboBox({
                typeAhead: true,
                triggerAction: 'all',
                mode: 'local',
                store: new Ext.data.DirectStore({
                    reader: new Ext.data.JsonReader({
                        successProperty: 'success',
                        idProperty: 'Id',
                        root: 'data',
                        fields: ['Id', 'Name']
                    }),
                    autoLoad: true,
                    api: { read: Tsa.GetBalanceSides }
                }),
                valueField: 'Id',
                displayField: 'Name'
            })
        }, {
            dataIndex: 'RunningBalance',
            header: 'Running Balance',
            sortable: true,
            width: 100,
            menuDisabled: true,
            align: 'right',
            renderer: function (value) {
                return Ext.util.Format.number(value, '0,000.00 ');
            },
            editor: new Ext.form.NumberField({
                allowBlank: false,
                allowNegative: true,
                listeners: {
                    focus: function (field) {
                        field.selectText();
                    }
                }
            })
        }]
    }, config));
};
Ext.extend(Ext.erp.CoreFin.ux.chartOfAccount.SubsidiaryAccountGrid, Ext.grid.EditorGridPanel, {
    initComponent: function () {
        this.bbar = [{}];
        Ext.erp.CoreFin.ux.chartOfAccount.SubsidiaryAccountGrid.superclass.initComponent.apply(this, arguments);
    },
    addRow: function () {
        var grid = Ext.getCmp('subsidiaryAccount-grid');
        var store = grid.getStore();
        var SubsidiaryAccount = store.recordType;
        var subsidiaryAccount = new SubsidiaryAccount({
            Name: '',
            Code: '',
            DateCreated: Ext.util.Format.date((new Date()).clearTime(), 'F d, Y'),
            BalanceSide: '',
            RunningBalance: ''
        });
        var count = store.getCount();
        grid.stopEditing();
        store.insert(count, subsidiaryAccount);
        if (count > 0) {
            grid.startEditing(count, 2);
        }
    }
});
Ext.reg('subsidiaryAccount-grid', Ext.erp.CoreFin.ux.chartOfAccount.SubsidiaryAccountGrid);

/**
* @desc      ChartOfAccount tree
* @author    Dawit Kiros
* @copyright (c) 2010, Cybersoft
* @date      November 01, 2010
* @namespace Ext.erp.CoreFin.ux.chartOfAccount
* @class     Ext.erp.CoreFin.ux.chartOfAccount.Tree
* @extends   Ext.Window
*/
Ext.erp.CoreFin.ux.chartOfAccount.Tree = function (config) {
    Ext.erp.CoreFin.ux.chartOfAccount.Tree.superclass.constructor.call(this, Ext.apply({
        id: 'chartOfAccount-tree',
        loader: new Ext.tree.TreeLoader({
            directFn: ChartOfAccount.PopulateTree,
            scope: this,
            paramsAsHash: true,
            paramOrder: 'node|type',
            listeners: {
                beforeload: function (treeLoader, node) {
                    this.baseParams = {
                        type: (node.attributes.type) ? node.attributes.type : 'root'
                    };
                }
            }
        }),
        selectedChartOfAccountId: 0,
        selectedChartOfAccountTypeId: 0,
        border: false,
        rootVisible: true,
        lines: true,
        autoScroll: true,
        stateful: false,
        root: {
            text: 'Chart of Accounts',
            id: 'root',
            type: 'root'
        },
        listeners: {
            click: function (node, e) {
                e.stopEvent();
                node.select();
                if (node.isExpandable()) {
                    node.reload();
                }
                var nodeIdInfo = node.attributes.id.split(':');
                var filterId = nodeIdInfo[0];
                var type = '', level = '';
                var panel = Ext.getCmp('chartOfAccount-panel');
                Ext.getCmp('sitemap').setValue(node.attributes.text);                
                switch (node.attributes.type) {
                    case 'root':
                        filterId = 0;
                        type = 'accountCategory';
                        level = 'Account Category';
                        grid = panel.accountCategoryGrid;
                        break;
                    case 'accountCategory':
                        type = 'accountType';
                        level = 'Account Type';
                        grid = panel.accountTypeGrid;
                        break;
                    case 'accountType':
                        type = 'accountGroup';
                        level = 'Account Group';
                        grid = panel.accountGroupGrid;
                        break;
                    case 'accountGroup':
                        type = 'controlAccount';
                        level = 'Control Account';
                        grid = panel.controlAccountGrid;
                        break;
//                    case 'controlAccount':
//                        type = 'subsidiaryAccount';
//                        level = 'Subsidiary Account';
//                        grid = panel.subsidiaryAccountGrid;
//                        break;
                    default:
                        grid = undefined;
                        break;
                }
                Ext.getCmp('currentGrid').setValue(level);
                if (grid != undefined) {
                    grid.filterId = filterId;
                    grid.type = type;
                    panel.loadGrid(grid);
                }
            },
            expand: function (p) {
                p.syncSize();
            }
        }
    }, config));
};
Ext.extend(Ext.erp.CoreFin.ux.chartOfAccount.Tree, Ext.tree.TreePanel, {
    initComponent: function () {
        this.tbar = [{
            xtype: 'displayfield',
            id: 'sitemap',
            style: 'font-weight: bold',
            value: 'Chart of Accounts'
        }, {
            xtype: 'tbfill'
        }, {
            xtype: 'button',
            id: 'collapse-all',
            iconCls: 'icon-collapse-all',
            tooltip: 'Collapse All',
            handler: function () {
                Ext.getCmp('chartOfAccount-tree').collapseAll();
                Ext.getCmp('sitemap').setValue('Chart of Accounts');
                var grid = Ext.getCmp('accountCategory-grid');
                Ext.getCmp('chartOfAccount-panel').loadGrid(grid);
            }
        }];
        Ext.erp.CoreFin.ux.chartOfAccount.Tree.superclass.initComponent.call(this, arguments);
    }
});
Ext.reg('chartOfAccount-tree', Ext.erp.CoreFin.ux.chartOfAccount.Tree);

/**
* @desc      ChartOfAccount panel
* @author    Dawit Kiros
* @copyright (c) 2010, Cybersoft
* @date      November 01, 2010
* @version   $Id: ChartOfAccount.js, 0.1
* @namespace Ext.erp.CoreFin.ux.chartOfAccount
* @class     Ext.erp.CoreFin.ux.chartOfAccount.Panel
* @extends   Ext.Panel
*/
Ext.erp.CoreFin.ux.chartOfAccount.Panel = function (config) {
    Ext.erp.CoreFin.ux.chartOfAccount.Panel.superclass.constructor.call(this, Ext.apply({
        id: 'chartOfAccount-panel',
        gridId: '',
        layout: 'fit',
        border: false
    }, config));
};
Ext.extend(Ext.erp.CoreFin.ux.chartOfAccount.Panel, Ext.Panel, {
    initComponent: function () {
        this.form = new Ext.erp.CoreFin.ux.chartOfAccount.Form();
        this.tree = new Ext.erp.CoreFin.ux.chartOfAccount.Tree();
        this.accountCategoryGrid = new Ext.erp.CoreFin.ux.chartOfAccount.AccountCategoryGrid();
        this.accountTypeGrid = new Ext.erp.CoreFin.ux.chartOfAccount.AccountTypeGrid();
        this.accountGroupGrid = new Ext.erp.CoreFin.ux.chartOfAccount.AccountGroupGrid();
        this.controlAccountGrid = new Ext.erp.CoreFin.ux.chartOfAccount.ControlAccountGrid();
        this.subsidiaryAccountGrid = new Ext.erp.CoreFin.ux.chartOfAccount.SubsidiaryAccountGrid();
        this.items = [{
            layout: 'border',
            border: false,
            items: [{
                region: 'west',
                border: true,
                width: 400,
                minSize: 200,
                maxSize: 400,
                layout: 'fit',
                margins: '0 3 0 0',
                items: [this.tree, this.form]
            }, {
                id: 'account-panel',
                region: 'center',
                border: true,
                layout: 'card',
                listeners: {
                    afterrender: function () {
                        var grid = this.accountCategoryGrid;
                        grid.filterId = 0;
                        grid.type = 'accountCategory';
                        this.loadGrid(grid);
                    },
                    scope: this
                },
                tbar: [{
                    xtype: 'button',
                    text: 'Save',
                    id: 'saveAccountInfo',
                    iconCls: 'icon-save',
                    handler: this.onSaveChartOfAccount
                }, {
                    xtype: 'tbseparator'
                }, {
                    xtype: 'button',
                    text: 'Delete',
                    id: 'deleteAccountInfo',
                    iconCls: 'icon-delete',
                    disabled: true,
                    handler: this.onDeleteChartOfAccount
                },{
                    xtype: 'button',
                    text: 'Update CodeAsDecimal',
                    id: '1',
                    iconCls: 'icon-save',
                    hidden: 'true',
                    handler: this.onUpdateCodeAsDecimal
                }, '->', {
                    xtype: 'button',
                    text: 'Map Account-Position',
                    id: 'btnAccountPositionMapping',
                    iconCls: 'icon-add',
                   
                    handler: this.onAccountPositionMapping
                }, {
                    xtype: 'tbseparator'
                }, {
                    xtype: 'displayfield',
                    id: 'currentGrid',
                    style: 'font-weight: bold',
                    value: 'Level'
                }],
                items: []
            }]
        }];
        Ext.erp.CoreFin.ux.chartOfAccount.Panel.superclass.initComponent.apply(this, arguments);
    },
    onAccountPositionMapping : function() {
        new Ext.core.finance.ux.financeAccountPositionMapping.Window({
            title : 'Account Position Mapping'
        }).show();
    },
    onUpdateCodeAsDecimal: function() {
        window.ChartOfAccount.UpdateCodeAsDecimal(function (response) {
            if (response.success) {
                Ext.MessageBox.show({
                    title: 'success',
                    msg: 'success',
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.INFO,
                    scope: this
                });

            } else {
                Ext.MessageBox.show({
                    title: 'error',
                    msg: 'unsuccessful',
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.ERROR,
                    scope: this
                });
            }
        });
    },
    onSaveChartOfAccount: function () {
        var mainPanel = Ext.getCmp('chartOfAccount-panel');
        var gridPanel = Ext.getCmp('account-panel');
        var gridId = gridPanel.gridId;
        switch (gridId) {
            case 'accountType-grid':
                mainPanel.saveAccountType();
                break;
            case 'accountGroup-grid':
                mainPanel.saveAccountGroup();
                break;
            case 'controlAccount-grid':
                mainPanel.saveControlAccount();
                break;
            case 'subsidiaryAccount-grid':
                mainPanel.saveSubsidiaryAccount();
                break;
            default:
                break;
        }
    },
    onDeleteChartOfAccount: function () {
        var mainPanel = Ext.getCmp('chartOfAccount-panel');
        var gridPanel = Ext.getCmp('account-panel');
        var gridId = gridPanel.gridId;
        switch (gridId) {
            case 'accountType-grid':
                mainPanel.deleteAccount(gridId, 'accountType');
                break;
            case 'accountGroup-grid':
                mainPanel.deleteAccount(gridId, 'accountGroup');
                break;
            case 'controlAccount-grid':
                mainPanel.deleteAccount(gridId, 'controlAccount');
                break;
            case 'subsidiaryAccount-grid':
                mainPanel.deleteAccount(gridId, 'subsidiaryAccount');
                break;
            default:
                break;
        }

    },
    loadGrid: function (grid) {
        var panel = Ext.getCmp('account-panel');
        panel.gridId = grid.id;
        grid.getStore().baseParams = { record: Ext.encode({ filterId: grid.filterId, type: grid.type }) };
        grid.getStore().load({ params: { start: 0, limit: grid.pageSize} });
        if (grid.store.data.length == 0) {

        }
        if (panel.getComponent(grid.id)) {
            panel.layout.setActiveItem(grid.id);
        } else {
            panel.add(grid).show();
            panel.layout.setActiveItem(grid.id);
        }
    },
    saveAccountType: function () {
        var form = Ext.getCmp('chartOfAccount-form');
        var grid = Ext.getCmp('accountType-grid');
        var rec = '';
        var store = grid.getStore();
        var modifiedRecords = store.getModifiedRecords();
        for (var i = 0; i < modifiedRecords.length; i++) {
            var item = modifiedRecords[i];
            if (item.data['Name'] != '' && item.data['Code'] != '' && item.data['BalanceSide'] != '') {
                rec = rec + item.data['Id'] + ':' +
                        item.data['Name'] + ':' +
                        item.data['Code'] + ':' +
                        item.data['BalanceSide'] + ';';
            }
        }
        if (rec.length == 0) {
            var msg = Ext.MessageBox;
            Ext.erp.CoreFin.ux.SystemMessageManager.show({
                title: 'Save failed',
                msg: 'Account type details should be filled',
                buttons: msg.OK,
                icon: msg.ERROR,
                cls: 'msgbox-critical',
                width: 400
            });
            return;
        }
        form.getForm().submit({
            waitMsg: 'Please wait...',
            params: { record: Ext.encode({ accountTypes: rec, type: grid.type, filterId: grid.filterId }) },
            success: function () {
                grid.getStore().load({ params: { start: 0, limit: grid.pageSize} });
                var tree = Ext.getCmp('chartOfAccount-tree');
                var selectedNode = tree.getSelectionModel().getSelectedNode();
                if (tree.getSelectionModel().isSelected(selectedNode)) {
                    selectedNode.reload();
                }
            },
            failure: function (form, action) {
                Ext.MessageBox.show({
                    title: 'Error',
                    msg: action.result.data,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.ERROR,
                    scope: this
                });
            }
        });
    },
    saveAccountGroup: function () {
        var form = Ext.getCmp('chartOfAccount-form');
        var grid = Ext.getCmp('accountGroup-grid');
        var rec = '';
        var store = grid.getStore();
        var modifiedRecords = store.getModifiedRecords();
        for (var i = 0; i < modifiedRecords.length; i++) {
            var item = modifiedRecords[i];
            if (item.data['Name'] != '' && item.data['Code'] != '') {
                rec = rec + item.data['Id'] + ':' +
                        item.data['Name'] + ':' +
                        item.data['Code'] + ';';
            }
        }
        if (rec.length == 0) {
            var msg = Ext.MessageBox;
            Ext.erp.CoreFin.ux.SystemMessageManager.show({
                title: 'Save failed',
                msg: 'Account group details should be filled',
                buttons: msg.OK,
                icon: msg.ERROR,
                cls: 'msgbox-critical',
                width: 400
            });
            return;
        }
        form.getForm().submit({
            waitMsg: 'Please wait...',
            params: { record: Ext.encode({ accountGroups: rec, type: grid.type, filterId: grid.filterId }) },
            success: function () {
                grid.getStore().load({ params: { start: 0, limit: grid.pageSize} });
                var tree = Ext.getCmp('chartOfAccount-tree');
                var selectedNode = tree.getSelectionModel().getSelectedNode();
                if (tree.getSelectionModel().isSelected(selectedNode)) {
                    selectedNode.reload();
                }
            },
            failure: function (form, action) {
                Ext.MessageBox.show({
                    title: 'Error',
                    msg: action.result.data,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.ERROR,
                    scope: this
                });
            }
        });
    },
    saveControlAccount: function () {
        var form = Ext.getCmp('chartOfAccount-form');
        var grid = Ext.getCmp('controlAccount-grid');
        var rec = '';
        var store = grid.getStore();
        var modifiedRecords = store.getModifiedRecords();
        for (var i = 0; i < modifiedRecords.length; i++) {
            var item = modifiedRecords[i];
            if (item.data['Name'] != '' && item.data['Code'] != '' && item.data['DateCreated'] != '' && item.data['BalanceSide'] != '' && !isNaN(item.data['RunningBalance'])) {
                var dateCreated = new Date(item.data['DateCreated']);
                var date = dateCreated.format('M/d/yyyy');
                var budgetCode = item.data['BudgetCode'];
                if (budgetCode == null)
                    var budgetCode = '';
                rec = rec + item.data['Id'] + ':' +
                        item.data['Name'] + ':' +
                        item.data['Code'] + ':' +
                        budgetCode + ':' +
                        date + ':' +
                        item.data['BalanceSide'] + ':' +
                        item.data['RunningBalance'] + ':' +
                        item.data['IsActive'] + ';';
            }
        }
        if (rec.length == 0) {
            var msg = Ext.MessageBox;
            Ext.MessageBox.show({
                title: 'Save failed',
                msg: 'Control account details should be filled',
                buttons: msg.OK,
                icon: msg.ERROR,
                cls: 'msgbox-critical',
                width: 400
            });
            return;
        }
        form.getForm().submit({
            waitMsg: 'Please wait...',
            params: { record: Ext.encode({ controlAccounts: rec, type: grid.type, filterId: grid.filterId }) },
            success: function () {
                grid.getStore().load({ params: { start: 0, limit: grid.pageSize} });
                var tree = Ext.getCmp('chartOfAccount-tree');
                var selectedNode = tree.getSelectionModel().getSelectedNode();
                if (tree.getSelectionModel().isSelected(selectedNode)) {
                    selectedNode.reload();
                }
            },
            failure: function (form, action) {
                Ext.MessageBox.show({
                    title: 'Error',
                    msg: action.result.data,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.ERROR,
                    scope: this
                });
            }
        });
    },
    saveSubsidiaryAccount: function () {
        var form = Ext.getCmp('chartOfAccount-form');
        var grid = Ext.getCmp('subsidiaryAccount-grid');
        var rec = '';
        var store = grid.getStore();
        var modifiedRecords = store.getModifiedRecords();
        for (var i = 0; i < modifiedRecords.length; i++) {
            var item = modifiedRecords[i];
            if (item.data['Name'] != '' && item.data['Code'] != '' && item.data['DateCreated'] != '' && item.data['BalanceSide'] != '' && !isNaN(item.data['RunningBalance'])) {
                rec = rec + item.data['Id'] + ':' +
                        item.data['Name'] + ':' +
                        item.data['Code'] + ':' +
                        item.data['DateCreated'] + ':' +
                        item.data['BalanceSide'] + ':' +
                        item.data['RunningBalance'] + ';';
            }
        }
        if (rec.length == 0) {
            var msg = Ext.MessageBox;
            Ext.erp.CoreFin.ux.SystemMessageManager.show({
                title: 'Save failed',
                msg: 'Subsidiary account details should be filled',
                buttons: msg.OK,
                icon: msg.ERROR,
                cls: 'msgbox-critical',
                width: 400
            });
            return;
        }
        form.getForm().submit({
            waitMsg: 'Please wait...',
            params: { record: Ext.encode({ subsidiaryAccounts: rec, type: grid.type, filterId: grid.filterId }) },
            success: function () {
                grid.getStore().load({ params: { start: 0, limit: grid.pageSize} });
                var tree = Ext.getCmp('chartOfAccount-tree');
                var selectedNode = tree.getSelectionModel().getSelectedNode();
                if (tree.getSelectionModel().isSelected(selectedNode)) {
                    selectedNode.reload();
                }
            },
            failure: function (form, action) {
                Ext.MessageBox.show({
                    title: 'Error',
                    msg: action.result.data,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.ERROR,
                    scope: this
                });
            }
        });
    },
    deleteAccount: function (gridId, type) {
        var grid = Ext.getCmp(gridId);
        if (!grid.getSelectionModel().hasSelection()) {
            Ext.MessageBox.show({
                title: 'Select',
                msg: 'You must select a record to delete.',
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
        Ext.MessageBox.show({
            title: 'Delete',
            msg: 'Are you sure you want to delete the selected row',
            buttons: {
                ok: 'Yes',
                no: 'No'
            },
            icon: Ext.MessageBox.QUESTION,
            scope: this,
            fn: function (btn) {
                if (btn == 'ok') {
                    var id = grid.getSelectionModel().getSelected().get('Id');
                    ChartOfAccount.Delete(id, type, function (result, response) {
                        grid.getStore().load({ params: { start: 0, limit: grid.pageSize} });
                        var tree = Ext.getCmp('chartOfAccount-tree');
                        var selectedNode = tree.getSelectionModel().getSelectedNode();
                        if (tree.getSelectionModel().isSelected(selectedNode)) {
                            selectedNode.reload();
                        }
                        if (!result.success) {
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
});
Ext.reg('chartOfAccount-panel', Ext.erp.CoreFin.ux.chartOfAccount.Panel);