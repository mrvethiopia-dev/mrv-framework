Ext.ns('Ext.mrv.ghginventory.ux.common');

/******************************************************************************************
*IFrame Component
*******************************************************************************************/

/**
* @desc      Panel to host html page
* @author    Dawit Kiros


* @namespace Ext.mrv.ghginventory.ux.common
* @class     Ext.mrv.ghginventory.ux.common.IFrameComponent
* @extends   Ext.Panel
*/

Ext.mrv.ghginventory.ux.common.IFrameComponent = Ext.extend(Ext.BoxComponent, {
    onRender: function (ct, position) {
        this.el = ct.createChild({ tag: 'iframe', id: 'iframe-' + this.id, frameBorder: 0, src: this.url });
    }
});
