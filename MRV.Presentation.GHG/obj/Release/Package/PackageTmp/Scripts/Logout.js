﻿Ext.namespace('Ext.mrv.ghginventory.ux.reception');

Ext.mrv.ghginventory.ux.reception.LogoutWindowButton = Ext.extend(Ext.BoxComponent, {
    initComponent: function () {
        Ext.apply(this, {
            handler: this.handler || Ext.emptyFn,
            scope: this.scope || window,
            autoEl: {
                tag: 'div',
                cls: 'reception-LogoutWindow-button',
                children: [{
                    tag: 'div',
                    cls: 'button'
                }, {
                    tag: 'div',
                    cls: 'text',
                    html: this.text
                }]
            }
        });
        this.on('render', this._onRender, this, { single: true });
        Ext.mrv.ghginventory.ux.reception.LogoutWindowButton.superclass.initComponent.call(this);
    },
    _onRender: function () {
        Ext.fly(this.el.dom.firstChild).on('click', this.handler, this.scope);
    }
});

Ext.mrv.ghginventory.ux.reception.LogoutWindow = Ext.extend(Ext.Window, {
    initComponent: function () {
        Ext.apply(this, {
            cls: 'reception-LogoutWindow',
            height: 160,
            width: 260,
            draggable: false,
            modal: true,
            closable: false,
            resizable: false,
            layout: 'column',
            items: [
                new Ext.mrv.ghginventory.ux.reception.LogoutWindowButton({
                    cls: 'reception-LogoutWindow-lockButton',
                    overCls: 'over',
                    columnWidth: .33,
                    text: 'Lock',
                    handler: function () {
                        Ext.mrv.ghginventory.ux.Reception.lockWorkbench();
                        this.close();
                    },
                    scope: this
                }),
                new Ext.mrv.ghginventory.ux.reception.LogoutWindowButton({
                    cls: 'reception-LogoutWindow-logoutButton',
                    overCls: 'over',
                    columnWidth: .33,
                    text: 'Sign out',
                    handler: function () {
                        Ext.mrv.ghginventory.ux.Reception.logout();
                    }
                }),
                new Ext.mrv.ghginventory.ux.reception.LogoutWindowButton({
                    cls: 'reception-LogoutWindow-restartButton',
                    overCls: 'over',
                    columnWidth: .33,
                    text: 'Restart',
                    handler: function () {
                        Ext.mrv.ghginventory.ux.Reception.restart();
                    }
                })
            ],
            bbar: [{
                xtype: 'tbfill' 
            }, {
                text: 'Cancel',
                iconCls: 'icon-exit',
                handler: function () {
                    this.close();
                },
                scope: this
            }]
        });
        Ext.mrv.ghginventory.ux.reception.LogoutWindow.superclass.initComponent.call(this);
    }
});