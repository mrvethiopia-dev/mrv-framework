Ext.namespace('Ext.erp.core.ux');
Ext.erp.core.ux.ResponseInspector = function () {
    var tryDecode = function (value) {
        if ((typeof value).toLowerCase() === 'string') {
            var v;
            try {
                v = Ext.decode(value);
            } catch (e) {
                throw ('Argument does not seem to be json-encoded.');
            }
            return v;
        } else if ((typeof value).toLowerCase() === 'object') {
            return value;
        }
        throw ('Argument is neither of type String nor Object.');
    };

    return {

        /**
        * Failure type indicating response said "not authorized", since someone has
        * logged in with the same user credentials
        * @param {Number}
        */
        FAILURE_TOKEN: 8,

        /**
        * Failure type indicating response said "not authorized"
        * @param {Number}
        */
        FAILURE_AUTH: 4,

        /**
        * Failure type indicating response said "workbench locked"
        * @param {Number}
        */
        FAILURE_LOCK: 2,

        /**
        * Type indicating response stated no specific failure
        * @param {Number}
        */
        FAILURE_NONE: -1,

        isAuthenticationFailure: function (response) {
            if (response && response.responseText) {
                response = response.responseText;
            }
            try {
                var obj = tryDecode(response);
            } catch (e) {
                return false;
            }
            if (obj.authorized === false) {
                return true;
            }
            return false;
        },
        isWorkbenchLocked: function (response) {
            var obj = tryDecode(response);
            if (obj.locked === true) {
                return true;
            }
            return false;
        },
        doCallbackForDirectApiResponse: function (config) {
            var result = config.result,
               remotingObject = config.remotingObject,
               success = config.success,
               failure = config.failure,
               scope = config.scope;

            if (!result) {
                failure.call(scope, remotingObject);
            } else {
                if (remotingObject.code === Ext.Direct.exceptions.PARSE) {
                    failure.call(scope, remotingObject);
                } else {
                    success.call(scope, result);
                }
            }
        },
        getFailureType: function (response) {
            var resp = null;
            if (response) {
                if (response.responseText) {
                    resp = tryDecode(response.responseText);
                } else {
                    resp = tryDecode(response);
                }
            }
            if (resp.tokenFailure === true) {
                return this.FAILURE_TOKEN;
            }
            if (resp.authorized === false) {
                return this.FAILURE_AUTH;
            }
            if (resp.locked === true) {
                return this.FAILURE_LOCK;
            }
            return this.FAILURE_NONE;
        },
        isSuccess: function (response) {
            var resp;
            try {
                if (response.responseText) {
                    resp = tryDecode(response.responseText);
                } else {
                    resp = tryDecode(response);
                }

                if (resp.success === true) {
                    return resp;
                } else if (resp.success === false) {
                    return false;
                }
            } catch (e) {
                // ignore
            }
            return null;
        },
        generateMessage: function (response, options) {
            options = Ext.apply(options, {
                title: 'Message',
                text: 'Message'
            });
            return new Ext.erp.core.ux.SystemMessage(options);
        }
    };
} ();