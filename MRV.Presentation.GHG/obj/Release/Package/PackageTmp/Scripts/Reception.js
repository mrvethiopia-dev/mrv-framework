Ext.namespace('Ext.mrv.ghginventory.ux');
Ext.mrv.ghginventory.ux.Reception = function () {
    var options = {
        loginWindowClass: Ext.mrv.ghginventory.ux.reception.LoginWindow
    };

    var applicationPath = null,
        userName = null,
        lastUserRequest = null,
        applicationStarted = null,
        loginWindow = null,
        logoutWindow = null,
        permissions = null,
        context = null,
        instance = null;

    var onLoginSuccess = function (form, action) {
        userName = action.result.data.userName;
        loginWindow.close();
        if (context == this.TYPE_LOGIN || !applicationStarted) {
            (function () {
                this.location.href = location.protocol + '//' + location.host + applicationPath + '/Workbench';
            }).defer(10, window);
        }
    };

    var onLoginFailure = function () {
        loginWindow.setControlsDisabled(false);
    };

    var onLogoutSuccess = function () {
        window.onbeforeunload = Ext.emptyFn;
        window.location.href = location.protocol + '//' + location.host + applicationPath + '/Reception';
    };

    var onBeforeLogin = function (window) {
        window.setControlsDisabled(true);
    };

    var onExit = function () {
        if (context == this.TYPE_TOKEN_FAILURE) {
            Ext.mrv.ghginventory.ux.SystemMessageManager.wait(
                new Ext.mrv.ghginventory.ux.SystemMessage({
                    text: 'Please wait, signing out...',
                    type: Ext.mrv.ghginventory.ux.SystemMessage.TYPE_WAIT
                })
            );
        } else {
            Ext.mrv.ghginventory.ux.SystemMessageManager.wait(
                new Ext.mrv.ghginventory.ux.SystemMessage({
                    text: 'Please wait, signing out...',
                    type: Ext.mrv.ghginventory.ux.SystemMessageManager.TYPE_WAIT
                })
            );
            Reception.Logout(onLogoutSuccess);
        }
    };

    var onDestroy = function () {
        loginWindow = null;
        context = null;
    };

    var buildLoginWindow = function (config) {
        if (loginWindow === null) {
            config = config || {};
            Ext.apply(config, { draggable: false });
            loginWindow = new options['loginWindowClass'](config);
            loginWindow.on('exit', onExit, Ext.mrv.ghginventory.ux.Reception);
            loginWindow.on('loginsuccess', onLoginSuccess, Ext.mrv.ghginventory.ux.Reception);
            loginWindow.on('loginfailure', onLoginFailure, Ext.mrv.ghginventory.ux.Reception);
            loginWindow.on('beforelogin', onBeforeLogin, Ext.mrv.ghginventory.ux.Reception);
            loginWindow.on('destroy', onDestroy, Ext.mrv.ghginventory.ux.Reception);
        }
        if (!loginWindow.isVisible()) {
            loginWindow.show();
        }
    };

    return {
        TYPE_LOGIN: 2,
        TYPE_AUTHENTICATE: 4,
        TYPE_UNLOCK: 8,
        TYPE_TOKEN_FAILURE: 16,

        getInstance: function (started, config) {
            applicationStarted = started;
            instance = Ext.apply(options, config || {});
            return instance;
        },
        setApplicationPath: function (path) {
            applicationPath = path;
        },
        getApplicationPath: function () {
            return applicationPath;
        },
        initializeApp: function (config) {
            applicationPath = config.applicationPath;
            userName = config.userName;
            applicationStarted = true;
            permissions = config.permissions;
        },
        getPermission: function (operation, accessLevel) {
            var permission;
            switch (accessLevel) {
                case 'CanAdd':
                    permission = permissions[operation].CanAdd;
                    break;
                case 'CanEdit':
                    permission = permissions[operation].CanEdit;
                    break;
                case 'CanDelete':
                    permission = permissions[operation].CanDelete;
                    break;
                case 'CanView':
                    permission = permissions[operation].CanView;
                    break;
                case 'CanApprove':
                    permission = permissions[operation].CanApprove;
                    break;
                case 'CanCheck':
                    permission = permissions[operation].CanCheck;
                    break;
                case 'CanAuthorize':
                    permission = permissions[operation].CanAuthorize;
                    break;
                case 'CanBulkUpdate':
                    permission = permissions[operation].CanBulkUpdate;
                    break;
                default:
                    permission = false;
                    break;
            }
            return permission;
        },
        lockWorkbench: function () {
            if (context === this.TYPE_UNLOCK) {
                return;
            } else if (context !== null) {
                throw ('Reception.lockWorkbench: Current context is AUTHENTICATE but server returned LOCKED');
            }
            Ext.mrv.ghginventory.ux.SystemMessageManager.wait(
                new Ext.mrv.ghginventory.ux.SystemMessage({
                    text: 'Please wait, locking workbench...',
                    type: Ext.mrv.ghginventory.ux.SystemMessage.TYPE_WAIT
                })
            );
            Ext.mrv.ghginventory.ux.SystemMessageManager.hide();
            var reception = Ext.mrv.ghginventory.ux.Reception;
            reception.showLogin(reception.TYPE_UNLOCK);
        },
        restart: function () {
            var msg = Ext.MessageBox;
            Ext.mrv.ghginventory.ux.SystemMessageManager.show({
                title: 'Restart',
                msg: 'All unsaved data will be lost. Are you sure you want to restart?',
                buttons: msg.YESNO,
                icon: msg.QUESTION,
                cls: 'msgbox-question',
                width: 400,
                fn: function (buttonType) {
                    if (buttonType == 'yes') {
                        Ext.mrv.ghginventory.ux.SystemMessageManager.wait(
                            new Ext.mrv.ghginventory.ux.SystemMessage({
                                text: 'Restarting application...',
                                type: Ext.mrv.ghginventory.ux.SystemMessage.TYPE_WAIT
                            })
                        );
                        (function () {
                            window.onbeforeunload = Ext.emptyFn;
                            window.location.replace(location.protocol + '//' + location.host + applicationPath + '/Workbench');
                        }).defer(500, window);
                    }
                }
            });
        },

        logout: function () {
            var msg = Ext.MessageBox;
            Ext.mrv.ghginventory.ux.SystemMessageManager.show({
                title: 'Logout',
                msg: 'All unsaved data will be lost. Are you sure you want to sign out and exit',
                buttons: msg.YESNO,
                icon: msg.QUESTION,
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
                        Reception.Logout(onLogoutSuccess);
                    }
                }
            });
        },
        showLogout: function () {
            if (logoutWindow === null) {
                logoutWindow = new Ext.mrv.ghginventory.ux.reception.LogoutWindow();
                logoutWindow.on('destroy', function () {
                    logoutWindow = null;
                });
            }
            logoutWindow.show();
        },
        showLogin: function (contextType) {
            switch (contextType) {
                case this.TYPE_LOGIN:
                    context = contextType;
                    buildLoginWindow({
                        modal: applicationStarted,
                        applicationPath: applicationPath
                    });
                    break;
                case this.TYPE_AUTHENTICATE:
                    context = contextType;
                    buildLoginWindow({
                        usernameValue: userName,
                        modal: applicationStarted,
                        lastUserRequest: lastUserRequest ? lastUserRequest : 0,
                        draggable: true
                    });
                    break;
                case this.TYPE_UNLOCK:
                    context = contextType;
                    buildLoginWindow({
                        hideLanguageField: true,
                        usernameValue: userName,
                        showExit: !applicationStarted,
                        modal: applicationStarted,
                        draggable: true,
                        applicationPath: applicationPath
                    });
                    break;
                case this.TYPE_TOKEN_FAILURE:
                    context = contextType;
                    break;
                default:
                    throw ('No valid login context provided.');
            }
        },
        isClosed: function () {
            return context === this.TYPE_TOKEN_FAILURE;
        },
        isLocked: function () {
            return (context === this.TYPE_UNLOCK || context === this.TYPE_AUTHENTICATE);
        },
        confirmApplicationLeave: function () {
            return function (evt) {
                var message = 'Are you sure you want to exit your current session';
                if (typeof evt == "undefined") {
                    evt = window.event;
                }
                if (evt) {
                    evt.returnValue = message;
                }
                return message;
            };
        }
    };
} ();