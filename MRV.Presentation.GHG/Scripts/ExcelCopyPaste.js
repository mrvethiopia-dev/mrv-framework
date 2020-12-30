var dummyRec = { continent: '',

    countryName: '',

    capital: '',

    countryCode: '',

    area: '',

    population: null,

    gdp: null,

    government: '',

    id: null,

    version: null
};

var gRow = -1;

var gCol = -1;

var store = new Ext.data.DirectStore({
    reader: new Ext.data.JsonReader({
        successProperty: 'success',
        idProperty: 'Id',
        root: 'data',
        fields: ['Id', 'CodeAndName']
    }),
    //autoLoad: true,
    //api: { read: Tsa.GetWoreda },
    listeners: {
        load: function() {
            //adding dummy record
            var RowRec = Ext.data.Record.create(data.fields);
            store.add(new RowRec(dummyRec));
        }

    }
});


var map = new Ext.KeyMap(grid.getEl(), [
        {
            key: "c",

            ctrl: true,

            fn: function(keyCode, e) {

                var recs = grid.getSelectionModel().getSelections();

                if (recs && recs.length != 0) {

                    var clipText = Ext.getCmp('grid-pnl').getCsvDataFromRecs(recs);

                    var ta = document.createElement('textarea');

                    ta.id = 'cliparea';

                    ta.style.position = 'absolute';

                    ta.style.left = '-1000px';

                    ta.style.top = '-1000px';

                    ta.value = clipText;

                    document.body.appendChild(ta);

                    document.designMode = 'off';

                    ta.focus();

                    ta.select();

                    setTimeout(function() {
                        document.body.removeChild(ta);

                    }, 100);

                }

            }

        }, {
            key: "v",

            ctrl: true,

            fn: function() {

                var ta = document.createElement('textarea');

                ta.id = 'cliparea';

                ta.style.position = 'absolute';

                ta.style.left = '-1000px';

                ta.style.top = '-1000px';

                ta.value = '';
                document.body.appendChild(ta);

                document.designMode = 'off';

                setTimeout(function() {

                    Ext.getCmp('grid-pnl').getRecsFromCsv(grid, ta);

                }, 100);

                ta.focus();

                ta.select();

            }

        }
    ]
);

        var grid = new Ext.grid.GridPanel({

            xtype: 'grid',

            id: 'grid-pnl',

            columns: data.columns,

            store: store,

            selModel: new Ext.ux.MultiCellSelectionModel({}),

            listeners: {

                cellclick: function (grid, row, col) {

                    gRow = row;

                    gCol = col;

                },

                viewready: function () {

                    var map = new Ext.KeyMap(grid.getEl(), [{

                        key: "c",

                        ctrl: true,

                        fn: function (keyCode, e) {

                            var recs = grid.getSelectionModel().getSelections();

                            if (recs && recs.length != 0) {

                                var clipText = Ext.getCmp('grid-pnl').getCsvDataFromRecs(recs);

                                var ta = document.createElement('textarea');

                                ta.id = 'cliparea';

                                ta.style.position = 'absolute';

                                ta.style.left = '-1000px';

                                ta.style.top = '-1000px';

                                ta.value = clipText;

                                document.body.appendChild(ta);

                                document.designMode = 'off';

                                ta.focus();

                                ta.select();

                                setTimeout(function () {

                                    document.body.removeChild(ta);

                                }, 100);

                            }

                        }

                    }, {

                        key: "v",

                        ctrl: true,

                        fn: function () {

                            var ta = document.createElement('textarea');

                            ta.id = 'cliparea';

                            ta.style.position = 'absolute';

                            ta.style.left = '-1000px';

                            ta.style.top = '-1000px';

                            ta.value = '';

                            document.body.appendChild(ta);

                            document.designMode = 'off';

                            setTimeout(function () {

                                Ext.getCmp('grid-pnl').getRecsFromCsv(grid, ta);

                            }, 100);

                            ta.focus();

                            ta.select();

                        }

                    }]);

                }

            },

            getCsvDataFromRecs: function (cells) {

                var clipText = '';

                var currRow = cells[0][0];

                for (var i = 0; i < cells.length; i++) {

                    var r = cells[i][0];

                    var c = cells[i][1];

                    var cv = this.initialConfig.columns[c].dataIndex;

                    var rec = this.getStore().getAt(r);

                    var val = rec.data[cv];

                    if (r === currRow) {

                        if (i === cells.length - 1)

                            clipText = clipText.concat(val);

                        else

                            clipText = clipText.concat(val, "\t");

                    } else {

                        currRow = r;

                        clipText = clipText.concat("\n", val, "\t");

                    }

                }

                return clipText;

            },

            getRecsFromCsv: function (grid, ta) {

                document.body.removeChild(ta);

                var RowRec = Ext.data.Record.create(data.fields);

                var del = '';

                if (ta.value.indexOf("\r\n")) {

                    del = "\r\n";

                } else if (ta.value.indexOf("\n")) {

                    del = "\n"

                }

                var rows = ta.value.split("\n");

                for (var i = 0; i < rows.length; i++) {

                    var cols = rows[i].split("\t");

                    var columns = grid.initialConfig.columns;

                    if (cols.length > columns.length)

                        cols = cols.slice(0, columns.length - 1)

                    if (gRow === -1 || gCol === -1) {

                        Ext.Msg.alert('Select a cell before pasting and try again!');

                        return;

                    }

                    var cfg = { continent: '',

                        countryName: '',

                        capital: '',

                        countryCode: '',

                        area: '',

                        population: 0,

                        gdp: 0,

                        government: '',

                        id: null,

                        version: null
                    };

                    var tmpRec = store.getAt(gRow);

                    var existing = false;

                    if (tmpRec) {

                        cfg = tmpRec.data;

                        existing = true;

                    }

                    var l = cols.length;

                    if (gCol + cols.length > columns.length)

                        l = columns.length - gCol;

                    for (var j = gCol; j < gCol + l; j++) {

                        if (cols[j] === "") {

                            return;

                        }

                        if (columns[j].dataIndex === 'population') {

                            if (isNaN(cols[j - gCol] * 1) || typeof (cols[j - gCol] * 1) != 'number') {

                                Ext.Msg.alert('ERROR', 'population is not a number. Skipping rest of the records!');

                                return;

                            }

                        }

                        if (columns[j].dataIndex === 'gdp') {

                            if (isNaN(cols[j - gCol] * 1) || typeof (cols[j - gCol] * 1) != 'number') {

                                Ext.Msg.alert('ERROR', 'gdp is not a number. Skipping rest of the records!');

                                return;

                            }

                        }

                        cfg[columns[j].dataIndex] = cols[j - gCol];

                    }

                    var tmpRow = gRow;

                    var tmpCol = gCol;

                    grid.getSelectionModel().clearSelections(true);

                    var tmpRec = new RowRec(cfg);

                    if (existing)

                        store.removeAt(tmpRow);

                    store.insert(tmpRow, tmpRec);

                    gRow = ++tmpRow;

                    gCol = tmpCol;

                }

                if (gRow === store.getCount()) {

                    var RowRec = Ext.data.Record.create(data.fields);

                    store.add(new RowRec({ continent: '',

                        countryName: '',

                        capital: '',

                        countryCode: '',

                        area: '',

                        population: null,

                        gdp: null,

                        government: '',

                        id: null,

                        version: null
                    }));

                }

                gRow = 0;

                gCol = 0;

            }

        });



        Ext.ns('Ext.core.finance.ux.ExcelCopyPaste');
        /**
        * @desc      Banks registration form
        * @author    Dawit Kiros
        * @copyright (c) 2014, LIFT
        * @date      July 01, 2013
        * @namespace Ext.core.finance.ux.ExcelCopyPaste
        * @class     Ext.core.finance.ux.ExcelCopyPaste.Form
        * @extends   Ext.form.FormPanel
        */
        Ext.core.finance.ux.ExcelCopyPaste.Form = function (config) {
            Ext.core.finance.ux.ExcelCopyPaste.Form.superclass.constructor.call(this, Ext.apply({
                api: {
                    load: PayrollBanks.Get,
                    submit: PayrollBanks.Save
                },
                paramOrder: ['Id'],
                defaults: {
                    anchor: '95%',
                    labelStyle: 'text-align:right;',
                    msgTarget: 'side'
                },
                id: 'ExcelCopyPaste-form',
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
                    name: 'Name',
                    xtype: 'textfield',
                    fieldLabel: 'Bank Name',
                    anchor: '99%',
                    allowBlank: false
                }]
            }, config));
        }
        Ext.extend(Ext.core.finance.ux.ExcelCopyPaste.Form, Ext.form.FormPanel);
        Ext.reg('ExcelCopyPaste-form', Ext.core.finance.ux.ExcelCopyPaste.Form);

        /**
        * @desc      Banks registration form host window
        * @author    Dawit Kiros
        * @copyright (c) 2014, LIFT
        * @date      July 01, 2013
        * @namespace Ext.core.finance.ux.ExcelCopyPaste
        * @class     Ext.core.finance.ux.ExcelCopyPaste.Window
        * @extends   Ext.Window
        */
        Ext.core.finance.ux.ExcelCopyPaste.Window = function (config) {
            Ext.core.finance.ux.ExcelCopyPaste.Window.superclass.constructor.call(this, Ext.apply({
                layout: 'fit',
                width: 500,
                autoHeight: true,
                closeAction: 'close',
                modal: true,
                resizable: false,
                buttonAlign: 'right',
                bodyStyle: 'padding:5px;',
                listeners: {
                    show: function () {
                        this.form.getForm().findField('Id').setValue(this.payrollBanksId);
                        if (this.payrollBanksId != '') {
                            this.form.load({ params: { Id: this.payrollBanksId} });
                        }
                    },
                    scope: this
                }
            }, config));
        }
        Ext.extend(Ext.core.finance.ux.ExcelCopyPaste.Window, Ext.Window, {
            initComponent: function () {
                this.form = new Ext.core.finance.ux.ExcelCopyPaste.Form();
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

                Ext.core.finance.ux.ExcelCopyPaste.Window.superclass.initComponent.call(this, arguments);
            },
            onSave: function () {

                if (!this.form.getForm().isValid()) return;
                this.form.getForm().submit({
                    waitMsg: 'Please wait...',
                    success: function () {
                        Ext.getCmp('ExcelCopyPaste-form').getForm().reset();
                        Ext.getCmp('ExcelCopyPaste-paging').doRefresh();
                    }
                });
            },
            onClose: function () {
                this.close();
            }
        });
        Ext.reg('ExcelCopyPaste-window', Ext.core.finance.ux.ExcelCopyPaste.Window);

        /**
        * @desc      Banks grid
        * @author    Dawit Kiros
        * @copyright (c) 2014, LIFT
        * @date      July 01, 2013
        * @namespace Ext.core.finance.ux.ExcelCopyPaste
        * @class     Ext.core.finance.ux.ExcelCopyPaste.Grid
        * @extends   Ext.grid.GridPanel
        */
        Ext.core.finance.ux.ExcelCopyPaste.Grid = function (config) {
            Ext.core.finance.ux.ExcelCopyPaste.Grid.superclass.constructor.call(this, Ext.apply({
                store: new Ext.data.DirectStore({
                    directFn: window.PayrollBanks.GetAll,
                    paramsAsHash: false,
                    paramOrder: 'start|limit|sort|dir|record',
                    root: 'data',
                    idProperty: 'Id',
                    totalProperty: 'total',
                    sortInfo: {
                        field: 'Code',
                        direction: 'ASC'
                    },
                    fields: ['Id', 'Name'],
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
                id: 'ExcelCopyPaste-grid',
                searchCriteria: {},
                pageSize: 35,
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
                        var form = Ext.getCmp('ExcelCopyPaste-form');
                        if (id != null) {

                        }
                    },
                    scope: this,
                    rowdblclick: function () {
                        if (!this.getSelectionModel().hasSelection()) return;
                        var id = this.getSelectionModel().getSelected().get('Id');

                        if (id != null) {
                            var hasEditPermission = Ext.core.finance.ux.Reception.getPermission('Banks', 'CanEdit');
                            if (hasEditPermission) {
                                new Ext.core.finance.ux.ExcelCopyPaste.Window({
                                    payrollBanksId: id,
                                    title: 'Edit Banks'
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
             dataIndex: 'Name',
             header: 'Bank Name',
             sortable: true,
             width: 55,
             menuDisabled: true
         }]
            }, config));
        };
        Ext.extend(Ext.core.finance.ux.ExcelCopyPaste.Grid, Ext.grid.GridPanel, {
            initComponent: function () {
                this.store.baseParams = { record: Ext.encode({ mode: 'get' }) };
                this.tbar = [];
                this.bbar = new Ext.PagingToolbar({
                    id: 'ExcelCopyPaste-paging',
                    store: this.store,
                    displayInfo: true,
                    pageSize: this.pageSize
                });
                Ext.core.finance.ux.ExcelCopyPaste.Grid.superclass.initComponent.apply(this, arguments);
            },
            afterRender: function () {
                this.getStore().load({
                    params: { start: 0, limit: this.pageSize }
                });
                Ext.core.finance.ux.ExcelCopyPaste.Grid.superclass.afterRender.apply(this, arguments);
            }
        });
        Ext.reg('ExcelCopyPaste-grid', Ext.core.finance.ux.ExcelCopyPaste.Grid);

        /**
        * @desc      Banks panel
        * @author    Dawit Kiros
        * @copyright (c) 2014, LIFT
        * @date      July 01, 2013
        * @version   $Id: ExcelCopyPaste.js, 0.1
        * @namespace Ext.core.finance.ux.ExcelCopyPaste
        * @class     Ext.core.finance.ux.ExcelCopyPaste.Panel
        * @extends   Ext.Panel
        */
        Ext.core.finance.ux.ExcelCopyPaste.Panel = function (config) {
            Ext.core.finance.ux.ExcelCopyPaste.Panel.superclass.constructor.call(this, Ext.apply({
                layout: 'fit',
                border: false,
                tbar: {
                    xtype: 'toolbar',
                    items: [{
                        
                    }]
                }
            }, config));
        }
        Ext.extend(Ext.core.finance.ux.ExcelCopyPaste.Panel, Ext.Panel, {
            initComponent: function () {
                this.items = [{
                    xtype: 'ExcelCopyPaste-grid',
                    id: 'ExcelCopyPaste-grid'
                }];
                Ext.core.finance.ux.ExcelCopyPaste.Panel.superclass.initComponent.apply(this, arguments);
            }
        });
        Ext.reg('ExcelCopyPaste-panel', Ext.core.finance.ux.ExcelCopyPaste.Panel);