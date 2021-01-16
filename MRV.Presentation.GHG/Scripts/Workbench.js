Ext.ns('Ext.erp.ux.main');
/**
* @desc      Panel to host north items
* @author    Dawit Kiros Woldemichael
* @editor    Dawit Kiros Woldemichael

* @date      November 12, 2010
* @namespace Ext.erp.ux.main
* @class     Ext.erp.ux.main.North
* @extends   Ext.Panel
*/
Ext.erp.ux.main.North = function () {
    Ext.erp.ux.main.North.superclass.constructor.call(this, Ext.apply({
        region: 'north',
        height: 59,
        border: false,
        header: false,
        items: [
        {
            xtype: 'box',
            autoEl: {
                tag: 'div',
                html: "<div id='header'><a style='float:right;margin-right:0px;' href='/'><img style='margin-top: 2px;' src='content/images/app/logo.png'/></a><div class='api-title'> EFCCC </div></div>"
            }
        }, {
            xtype: 'toolbar',
            items: [
            {
                text: 'Setting',
                hidden: true,
                menu: [
                   
                ]
            }, '->', '-', {
                //text: 'Setting',
                iconCls: 'icon-help',
                tooltip: 'Help',
                disabled: true,
                menu: [
                {
                    text: 'HTML',
                    iconCls: 'icon-html',
                    hidden:true,
                    handler: function() {
                        window.open('Help/HTML/Help.html');
                    }
                }, {
                    text: 'Help',
                    iconCls: 'icon-pdf',
                    handler: function() {

                        window.open('Help/UserManual.pdf');

                    }

                }]
            },'->', {
                xtype: 'displayfield',
                style: 'font-weight: bold;',
                value: '',
                id: 'loggedInUser-toolbar',
                autoWidth: true
            } , {
                xtype: 'displayfield',
                style: 'font-weight: bold;',
                value: '',
                id: 'loggedInUserFullName-toolbar',
                hidden:true


            }, '-',  {
                xtype: 'button',
                id: 'btnChangePassword',
                iconCls: 'icon-cngpwd',
                tooltip: 'Change Password',
                disabled:true,
                handler: function () {
                    new Ext.mrv.ghginventory.ux.changePassword.Window({
                        title: 'Change Password', CallerId: 0
                    }).show();
                }
            }, '-', {
                xtype: 'button',
                id: 'btnLogout',
                iconCls: 'icon-logout',
                //text: 'Logout',
                disabled: true,
                handler: function () {
                    var msg = Ext.MessageBox;
                    Ext.mrv.ghginventory.ux.SystemMessageManager.show({
                        title: 'Logout',
                        msg: 'Are you sure you want to log out of the system?',
                        buttons: msg.YESNO,
                        icon: msg.WARNING,
                        cls: 'msgbox-question',
                        width: 400,
                        fn: function (buttonType) {
                            if (buttonType == 'yes') {
                                Ext.mrv.ghginventory.ux.SystemMessageManager.wait(
                                    new Ext.mrv.ghginventory.ux.SystemMessage({
                                        text: 'Please wait, signing out...',
                                        type: Ext.mrv.ghginventory.ux.SystemMessageManager.TYPE_WAIT
                                    })
                                );
                                Workbench.Logout(function (request, response) {
                                    window.onbeforeunload = Ext.emptyFn;
                                    window.location.href = location.protocol + '//' + location.host + response.result.data.ApplicationPath + '/Reception';
                                });
                            }
                        }
                    });
                }
            }]
        }]
    }));
};
Ext.extend(Ext.erp.ux.main.North, Ext.Panel);
Ext.reg('north-panel', Ext.erp.ux.main.North);

/**
* @desc      Panel to host east items
* @author    Dawit Kiros Woldemichael

* @date      November 12, 2010
* @namespace Ext.erp.ux.main
* @class     Ext.erp.ux.main.East
* @extends   Ext.Panel
*/
Ext.erp.ux.main.East = function () {
    Ext.erp.ux.main.East.superclass.constructor.call(this, Ext.apply({
        title: 'Task Detail',
        region: 'east',
        margins: '0 0 0 3',
        cmargins: '0 0 0 3',
        width: 200,
        minSize: 100,
        maxSize: 300,
        collapsible: true,
        collapsed: true,
        layout: 'fit'
    }));
};
Ext.extend(Ext.erp.ux.main.East, Ext.Panel);
Ext.reg('east-panel', Ext.erp.ux.main.East);

/**
* @desc      Panel to host south items
* @author    Dawit Kiros Woldemichael

* @date      November 12, 2010
* @namespace Ext.erp.ux.main
* @class     Ext.erp.ux.main.South
* @extends   Ext.Panel
*/
Ext.erp.ux.main.South = function () {
    Ext.erp.ux.main.South.superclass.constructor.call(this, Ext.apply({
        title: 'South',
        region: 'south',
        width: 200,
        minSize: 100,
        maxSize: 300,
        collapsible: true
    }));
};
Ext.extend(Ext.erp.ux.main.South, Ext.Panel);
Ext.reg('south-panel', Ext.erp.ux.main.South);

/**
* @desc      Panel to host west items
* @author    Dawit Kiros Woldemichael

* @date      November 12, 2010
* @namespace Ext.erp.ux.main
* @class     Ext.erp.ux.main.South
* @extends   Ext.Panel
*/

Ext.erp.ux.main.West = function () {
    Ext.erp.ux.main.West.superclass.constructor.call(this, Ext.apply({
        id: 'menu-panel',
        title: 'Tasks',
        region: 'west',
        margins: '0 3 0 0',
        cmargins: '0 3 0 0',
        width: 200,
        minSize: 100,
        maxSize: 300,
        collapsible: true,
        layout: 'accordion'
    }));
};
Ext.extend(Ext.erp.ux.main.West, Ext.Panel);
Ext.reg('west-panel', Ext.erp.ux.main.West);

/**
* @desc      Panel to host content items in the center
* @author    Dawit Kiros Woldemichael
* @editor    Dawit Kiros Woldemichael

* @date      November 12, 2010
* @namespace Ext.erp.ux.main
* @class     Ext.erp.ux.main.Center
* @extends   Ext.Panel
*/
Ext.erp.ux.main.Center = function () {
    Ext.erp.ux.main.Center.superclass.constructor.call(this, Ext.apply({
        id: 'content-panel',
        collapsible: false,
        region: 'center',
        margins: '0 0 0 0',
        activeTab: 0,
        resizeTabs: true,
        minTabWidth: 100,
        tabWidth: 190,
        enableTabScroll: true,
        defaults: {
            autoScroll: true
        },
        items: [{
            title: 'Home',
            layout: 'fit',
            iconCls: 'icon-home',
            items: []
        }],
        plugins: new Ext.ux.TabCloseMenu()
    }));
};
Ext.extend(Ext.erp.ux.main.Center, Ext.TabPanel, {
    loadPage: function (id, href, text, cls) {
        var itemId = "\'" + id + "\'";
        var tab = this.getComponent(itemId);
        if (tab) {
            this.setActiveTab(tab);
        }
        else {
            Ext.getCmp('content-panel').add({
                id: itemId,
                title: text,
                closable: true,
                layout: 'fit',
                iconCls: cls,
                items: [{
                    xtype: href,
                    id: href,
                    mnuText: text
                }]
            }).show();
        }
    }
});
Ext.reg('center-panel', Ext.erp.ux.main.Center);

Ext.onReady(function () {
    Ext.BLANK_IMAGE_URL = 'Content/images/default/s.gif';
    Ext.Direct.addProvider(Ext.app.REMOTING_API);
    Ext.QuickTips.init();
    var northPanel = new Ext.erp.ux.main.North();
    var westPanel = new Ext.erp.ux.main.West();
    var centerPanel = new Ext.erp.ux.main.Center();

    var currentUser = Ext.getCmp('loggedInUser-toolbar');
    var loggedInUserFullName = Ext.getCmp('loggedInUserFullName-toolbar');
    var reception = Ext.mrv.ghginventory.ux.Reception;
    reception.getInstance(true);

    window.Workbench.InitializeApp(function (response, action) {
        if (!action.result.success) {
            window.location.replace(location.protocol + '//' + location.host + action.result.data.ApplicationPath + '/Reception');
            return;
        }
        var permissions = {};
        for (var i = 0; i < action.result.data.Permissions.length; i++) {
            var permission = action.result.data.Permissions[i];
            var operation = permission.Operation;
            permissions[operation] = {
                CanAdd: permission.CanAdd,
                CanEdit: permission.CanEdit,
                CanDelete: permission.CanDelete,
                CanView : permission.CanView,
                CanApprove : permission.CanApprove,
                CanCheck: permission.CanCheck,
                CanAuthorize: permission.CanAuthorize,
                CanBulkUpdate: permission.CanBulkUpdate
            };
        }
        var options = {
            applicationPath: action.result.data.ApplicationPath,
            userName: action.result.data.Username,
            permissions: permissions
        };

        currentUser.setValue(action.result.data.Username);
        loggedInUserFullName.setValue(action.result.data.FullName);
        Ext.getCmp('loggedInUser-toolbar').setValue(action.result.data.Username + ' - ');
        

        Ext.mrv.ghginventory.ux.Reception.initializeApp(options);
        window.Workbench.GetModules(function (result) {
            var modules = result.data;
            for (i = 0; i < modules.length; i++) {
                var isCollapsed = true;
                if (modules[i].text == "Setup")
                    isCollapsed = false;
                var mTree = new Ext.tree.TreePanel({
                    id: modules[i].text,
                    title: modules[i].text,
                    collapsed: isCollapsed,
                    iconCls: modules[i].iconCls,
                    loader: new Ext.tree.TreeLoader({
                        directFn: window.Workbench.GetOperations
                    }),
                    border: false,
                    rootVisible: false,
                    lines: true,
                    autoScroll: true,
                    stateful: false,
                    listeners: {
                        click: function (node, e) {
                            e.stopEvent();
                            centerPanel.loadPage(node.attributes.id, node.attributes.href, node.attributes.text, node.attributes.iconCls);
                        },
                        expand: function (p) {
                            p.syncSize();
                        }
                    },
                    root: {
                        text: modules[i].text,
                        id: modules[i].id
                    }
                });
                westPanel.add(mTree);
            }
            var viewport = new Ext.Viewport({
                layout: 'border',
                items: [northPanel, westPanel, centerPanel]
            });

            
            viewport.doLayout();
        });
    });

    Ext.Direct.on('exception', function (e) {
        var title = 'Direct Exception', message;
        if (Ext.isDefined(e.where)) {
            message = String.format('<b>{0}</b><p>The exception was thrown from {1}.{2}()</p><pre>{3}</pre>', Ext.util.Format.nl2br(e.message), e.action, e.method, e.where);
            var w = new Ext.Window({
                title: title,
                width: 600,
                height: 400,
                modal: true,
                layout: 'fit',
                border: false,
                maximizable: true,
                items: {
                    html: message,
                    autoScroll: true,
                    preventBodyReset: true,
                    bodyStyle: 'font-size:12px',
                    padding: 5
                },
                buttons: [{
                    text: 'OK',
                    handler: function () {
                        w.close();
                    }
                }],
                buttonAlign: 'center',
                defaultButton: 0
            }).show();
        } else {
            message = 'Error occured. Unable to process request.';
            Ext.Msg.alert(title, message);
        }
    });
});