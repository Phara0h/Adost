'use strict';

const PGTypes = require('./PGTypes');
const PGEncryptModel = require('./PGEncryptModel');
const PGActiveModel = require('./PGActiveModel');

var Base = function(_class, tableName, model) {
    var _agg = class _Aggregate extends _class {
        constructor(...args) {

            /*  call base class constructor  */
            super(_agg.defaultModel, _agg.table, _agg.pkKey, _agg.encryptedProfileField, ...args);

        }
        static set table(name) {
            this._table = name;
        }

        static get table() {
            return this._table;
        }

        static set defaultModel(name) {
            this._defaultModel = name;
        }

        static get defaultModel() {
            return this._defaultModel;
        }

        static set pkKey(name) {
            this._pkKey = name;
        }

        static get pkKey() {
            return this._pkKey;
        }

        static set encryptionFields(v) {
            this._encryptionFields = v;
        }

        static get encryptionFields() {
            return this._encryptionFields;
        }

        static set encryptedProfileField(v) {
            this._encryptedProfileField = v;
        }

        static get encryptedProfileField() {
            return this._encryptedProfileField;
        }

    };

    var keys = Object.keys(model);

    for (var i = 0; i < keys.length; i++) {
        if (model[keys[i]] === PGTypes.PK) {
            _agg.pkKey = keys[i];
            break;
        }
    }

    _agg.table = tableName;
    _agg.defaultModel = model;

    if (_class == PGEncryptModel || _class == PGActiveModel) {

        _agg.encryptionFields = {};
        for (var i = 0; i < keys.length; i++) {
            var field = model[keys[i]];
            var key = keys[i];

            if (field === PGTypes.Encrypt || field === PGTypes.AutoCrypt || field === PGTypes.EncryptWithoutHash || field === PGTypes.AutoCryptWithoutHash || field === PGTypes.Hash) {
                _agg.encryptionFields[key] = field;
            } else if (field === PGTypes.EncryptProfile) {
                _agg.encryptedProfileField = key;
            }
        }
    }

    return _agg;
};

module.exports = Base;
