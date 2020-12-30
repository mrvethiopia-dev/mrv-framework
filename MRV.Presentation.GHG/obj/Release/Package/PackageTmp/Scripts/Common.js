Ext.ns('Ext.core.finance.ux.common');

/******************************************************************************************
*IFrame Component
*******************************************************************************************/

/**
* @desc      Panel to host html page
* @author    Dawit Kiros
* @copyright (c) 2013, Dawit Kiros
* @date      December 08, 2013
* @namespace Ext.core.finance.ux.common
* @class     Ext.core.finance.ux.common.IFrameComponent
* @extends   Ext.Panel
*/

Ext.core.finance.ux.common.IFrameComponent = Ext.extend(Ext.BoxComponent, {
    onRender: function (ct, position) {
        this.el = ct.createChild({ tag: 'iframe', id: 'iframe-' + this.id, frameBorder: 0, src: this.url });
    }
});
