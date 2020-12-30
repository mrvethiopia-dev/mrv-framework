Ext.ns('Ext.erp.ux.main');
/**
* @desc      Panel to host north items
* @author    Dawit Kiros Woldemichael
* @editor    Dawit Kiros Woldemichael
* @copyright (c) 2014, LIFT
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
                html: "<div id='header'><a style='float:right;margin-right:0px;' href='/'><img style='margin-top: 2px;' src='content/images/app/logo.png'/></a><div class='api-title'>Financial Management System</div></div>"
            }
        }, {
            xtype: 'toolbar',
            items: [
            {
                text: 'Setting',
                //hidden: Ext.core.finance.ux.Reception.getPermission('Journal Voucher (JV)', 'CanAdd'),
                menu: [
                    {
                        text: 'Payroll Settings',
                        iconCls: 'icon-settings',
                        handler: function () {
                            if (!Ext.core.finance.ux.Reception.getPermission('Journal Voucher (JV)', 'CanAdd')) {
                                Ext.MessageBox.show({
                                    title: 'Permission',
                                    msg: 'You can not access this page. Permission Error!',
                                    buttons: Ext.Msg.OK,
                                    icon: Ext.MessageBox.ERROR,
                                    scope: this
                                });
                                return;
                            } else {
                                new Ext.core.finance.ux.payrollItemSettings.Window().show();
                            }
                            
                        }
                    },
                     {
                        text: 'Finance Settings',
                        iconCls: 'icon-settings',
                        //hidden: true,
                        handler: function () {
                            if (!Ext.core.finance.ux.Reception.getPermission('Journal Voucher (JV)', 'CanAdd')) {
                                Ext.MessageBox.show({
                                    title: 'Permission',
                                    msg: 'You can not access this page. Permission Error!',
                                    buttons: Ext.Msg.OK,
                                    icon: Ext.MessageBox.ERROR,
                                    scope: this
                                });
                                return;
                            } else {
                                new Ext.core.finance.ux.financeSettings.Window().show();
                            }
                        }
                    }
                ]
            }, '->', '-', {
                //text: 'Setting',
                iconCls: 'icon-help',
                tooltip: 'Help',
                menu: [
                {
                    text: 'HTML',
                    iconCls: 'icon-html',
                    hidden:true,
                    handler: function() {
                        window.open('Help/HTML/Payroll Management System Help.html');
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


            }, '-', {
                xtype: 'button',
                id: 'btnExchangeRates',
                iconCls: 'icon-pound',
                tooltip: 'Weekly Exchange Rates',

                handler: function () {
                    new Ext.core.finance.ux.FinanceExchangeRates.Window({
                        title: 'Exchange Rates'
                    }).show();
                }
            }, '-', {
                xtype: 'button',
                id: 'btnChangePassword',
                iconCls: 'icon-cngpwd',
                tooltip: 'Change Password',

                handler: function () {
                    new Ext.core.finance.ux.changePassword.Window({
                        title: 'Change Password', CallerId: 0
                    }).show();
                }
            }, '-', {
                xtype: 'button',
                id: 'btnLogout',
                iconCls: 'icon-logout',
                //text: 'Logout',

                handler: function () {
                    var msg = Ext.MessageBox;
                    Ext.core.finance.ux.SystemMessageManager.show({
                        title: 'Logout',
                        msg: 'Are you sure you want to log out of the system?',
                        buttons: msg.YESNO,
                        icon: msg.WARNING,
                        cls: 'msgbox-question',
                        width: 400,
                        fn: function (buttonType) {
                            if (buttonType == 'yes') {
                                Ext.core.finance.ux.SystemMessageManager.wait(
                                    new Ext.core.finance.ux.SystemMessage({
                                        text: 'Please wait, signing out...',
                                        type: Ext.core.finance.ux.SystemMessageManager.TYPE_WAIT
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
* @copyright (c) 2014, LIFT
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
* @copyright (c) 2014, LIFT
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
* @copyright (c) 2014, LIFT
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
* @copyright (c) 2014, LIFT
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
    var reception = Ext.core.finance.ux.Reception;
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
        

        Ext.core.finance.ux.Reception.initializeApp(options);
        window.Workbench.GetModules(function (result) {
            var modules = result.data;
            for (i = 0; i < modules.length; i++) {
                var isCollapsed = true;
                if (modules[i].text == "Accounting Transactions")
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

            var canCheckJV = Ext.core.finance.ux.Reception.getPermission('Journal Voucher (JV)', 'CanCheck');
            var canCheckDV = Ext.core.finance.ux.Reception.getPermission('Disbursement Voucher (DV)', 'CanCheck');
            var canCheckCRV = Ext.core.finance.ux.Reception.getPermission('Cash Receipt Voucher (CRV)', 'CanCheck');

            var canApproveJV = Ext.core.finance.ux.Reception.getPermission('Journal Voucher (JV)', 'CanApprove');
            var canApproveDV = Ext.core.finance.ux.Reception.getPermission('Disbursement Voucher (DV)', 'CanApprove');
            var canApproveCRV = Ext.core.finance.ux.Reception.getPermission('Cash Receipt Voucher (CRV)', 'CanApprove');

            var canAuthorizeJV = Ext.core.finance.ux.Reception.getPermission('Journal Voucher (JV)', 'CanAuthorize');
            var canAuthorizeDV = Ext.core.finance.ux.Reception.getPermission('Disbursement Voucher (DV)', 'CanAuthorize');
            var canAuthorizeCRV = Ext.core.finance.ux.Reception.getPermission('Cash Receipt Voucher (CRV)', 'CanAuthorize');

            if (Ext.core.finance.ux.Reception.getPermission('Approve Requisition', 'CanApprove')) {
//                var runner = new Ext.util.TaskRunner();
//                runner.start({
//                    run: function() {
                        //Ext.getCmp('DocumentNotification-paging').moveFirst();
//                    Notification.ReadInvoiceConfirmation(function (result) {
//                    });
                        window.FinancePurchaseOrder.GetPOApprovalRequest(function(result) {
                            if (result.success) {
                                var t = new Ext.ToolTip({
                                    floating: {
                                        shim: true
                                    },
                                    style: {
                                        'color': '#5f5f5f',
                                        'font-size': '12px'
                                    },
                                    // anchor: 'bottom',
                                    // anchorToTarget: false,
                                    targetXY: [viewport.getWidth() - 330, viewport.getHeight() - 100],
                                    title: 'New PO Request',
                                    height: 300,
                                    html: "<table><tr><td><img style='margin-top:2px;' src='content/images/app/messagebox-info.png'/></td><td>A new <b>Purchase Order Request</b> awaits your approval. Please review the pending requests! </td></tr></table>",
                                    hideDelay: 15000,
                                    closable: true
                                });
                                t.show();
                                // t.showAt([0, 300]);
                                // t.showAt(t.el.getAlignToXY(viewport.el, 'bl-bl', [10, -10]));
                                t.el.slideIn('b');
                            } else {
                            }
                        });


//                    },
//                    interval: 60000 // in milli seconds
//                });
            }

            if (canCheckJV || canCheckDV || canCheckCRV) {
//                var runner = new Ext.util.TaskRunner();
//                runner.start({
//                    run: function () {
                        //Ext.getCmp('DocumentNotification-paging').moveFirst();
                        //                    Notification.ReadInvoiceConfirmation(function (result) {
                        //                    });
                        window.FinanceVoucher.GetCheckStatusRequest(function (result) {
                            if (result.success) {
                                var t = new Ext.ToolTip({
                                    floating: {
                                        shim: true
                                    },
                                    style: {
                                        'color': '#6f6f6f',
                                        'font-size': '12px'
                                    },
                                    // anchor: 'bottom',
                                    // anchorToTarget: false,
                                    targetXY: [viewport.getWidth() - 330, viewport.getHeight() - 80],
                                    title: 'Check Vouchers',
                                    height: 300,
                                    html: "<table background = #343434><tr><td><img style='margin-top:2px;' src='content/images/app/messagebox-info.png'/></td><td>There are new <b>Vouchers</b> which need to be checked. </td></tr></table>",
//                                    hideDelay: 15000000,
                                    dismissDelay: 150000,
                                    closable: true
                                });
                                t.show();
                                // t.showAt([0, 300]);
                                // t.showAt(t.el.getAlignToXY(viewport.el, 'bl-bl', [10, -10]));
                                t.el.slideIn('b');
                            } else {
                            }
                        });


//                    },
//                    interval: 60000 // in milli seconds
//                });
            }

            if (canApproveJV || canApproveDV || canApproveCRV) {
//                var runner = new Ext.util.TaskRunner();
//                runner.start({
//                    run: function () {
                        //Ext.getCmp('DocumentNotification-paging').moveFirst();
                        //                    Notification.ReadInvoiceConfirmation(function (result) {
                        //                    });
                        window.FinanceVoucher.GetApproveStatusRequest(function (result) {
                            if (result.success) {
                                var t = new Ext.ToolTip({
                                    floating: {
                                        shim: true
                                    },
                                    style: {
                                        'color': '#6f6f6f',
                                        'font-size': '12px'
                                    },
                                    // anchor: 'bottom',
                                    // anchorToTarget: false,
                                    targetXY: [viewport.getWidth() - 330, viewport.getHeight() - 140],
                                    title: 'Approve Vouchers',
                                    height: 300,
                                    html: "<table><tr><td><img style='margin-top:2px;' src='content/images/app/messagebox-info.png'/></td><td>There are new <b>Vouchers</b> waiting for your Approval. Please review and approve them! </td></tr></table>",
                                    //hideDelay: 15000000,
                                    dismissDelay: 150000,
                                    closable: true
                                });
                                t.show();
                                // t.showAt([0, 300]);
                                // t.showAt(t.el.getAlignToXY(viewport.el, 'bl-bl', [10, -10]));
                                t.el.slideIn('b');
                            } else {
                            }
                        });


//                    },
//                    interval: 60000 // in milli seconds
//                });
            }

            if (canAuthorizeJV || canAuthorizeDV || canAuthorizeCRV) {
//                var runner = new Ext.util.TaskRunner();
//                runner.start({
//                    run: function () {
                        //Ext.getCmp('DocumentNotification-paging').moveFirst();
                        //                    Notification.ReadInvoiceConfirmation(function (result) {
                        //                    });
                        window.FinanceVoucher.GetAuthorizeStatusRequest(function (result) {
                            if (result.success) {
                                var t = new Ext.ToolTip({
                                    floating: {
                                        shim: true
                                    },
                                    style: {
                                        'color': '#6f6f6f',
                                        'font-size': '12px'
                                    },

//                                    bodyStyle: {
//                                        background: '#00cc00',
//                                        'font-size': '16px',
//                                        color: '#FFF',
//                                        padding: '10px'
//                                    },
                                    targetXY: [viewport.getWidth() - 330, viewport.getHeight() - 200],
                                    title: 'Authorize Vouchers',
                                    height: 300,
                                    html: "<table><tr><td><img style='margin-top:2px;' src='content/images/app/messagebox-info.png'/></td><td>There are new <b>Vouchers</b> waiting for Authorization. Please review and authorize them! </td></tr></table>",
                                    //hideDelay: 15000000,
                                    dismissDelay: 150000,
                                    closable: true
                                });
                                t.show();
                                //t.showAt([0, 300]);
                                //t.showAt(t.el.getAlignToXY(viewport.el, 'bl-bl', [10, -10]));
                                t.el.slideIn('b');
                            } else {
                            }
                        });


//                    },
//                    interval: 60000 // in milli seconds
//                });
            }
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