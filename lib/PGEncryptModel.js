'use strict';

const BaseModel = require('./PGBaseModel.js');
const PGConnecter = require('./PGConnecter.js');
const PGTypes = require('./PGTypes.js');

const pg = new PGConnecter();

/**
 * Postgres Encryption Model class to extend a custom model from.
 * @extends PGBaseModel
 */
class PGEncryptModel extends BaseModel {
    constructor(model, table, pk, encryptedProfileField, encryptProfile = 'default') {
        super(model, table, pk);
        this._encryptProfile = encryptProfile;
        this.encryptedProfileField = encryptedProfileField;
        this.ChildClass = this.constructor;
    }

    static async findById(id, params = '*') {
        const newModel = await super.findById(id, params);

        return newModel ? await this.decrypt(newModel, this.getEncryptedProfile(newModel), true) : newModel;
    }

    static async findAllBy(fieldValues, operator = 'AND', limit, params = '*') {
        const newModels = await super.findAllBy(
            await this._queryFieldsHash(fieldValues, this.getEncryptedProfile(fieldValues)),
            operator,
            limit,
            params
        );

        for (var i = 0; i < newModels.length; i++) {
            if (newModels[i]) {
                newModels[i] = await this.decrypt(newModels[i], this.getEncryptedProfile(newModels[i]), true);
            }
        }
        return newModels;
    }

    static async findAll() {
        const newModels = await super.findAll();

        for (var i = 0; i < newModels.length; i++) {
            if (newModels[i]) {
                newModels[i] = await this.decrypt(newModels[i], this.getEncryptedProfile(newModels[i]), true);
            }
        }
        return newModels;
    }

    static async deleteById(id) {
        return super.deleteById(id);
    }

    static async deleteAllBy(fieldValues, operator = 'AND', limit) {
        return super.deleteAllBy(
            await this._queryFieldsHash(fieldValues, this.getEncryptedProfile(fieldValues)),
            operator,
            limit
        );
    }

    static async deleteAll() {
        return super.deleteAll();
    }

    static async create(model, returnModel = true, encryptProfile) {
        const newModel = await super.create(await this.encrypt(model, encryptProfile), returnModel);

        return [await this.decrypt(newModel && newModel.length > 0 ? newModel[0] : {}, encryptProfile, true)];
    }

    static async updateById(id, model, encryptProfile) {
        const newModel = await super.updateById(id, await this.encrypt(model, encryptProfile));

        return newModel ? await this.decrypt(newModel, this.getEncryptedProfile(newModel), true) : newModel;
    }

    static async updateAllBy(fieldValues, model, operator = 'AND', returnModel = true, encryptProfile, limit) {
        const newModels = await super.updateAllBy(
            await this._queryFieldsHash(fieldValues, encryptProfile),
            await this.encrypt(model, encryptProfile),
            operator,
            returnModel,
            limit
        );

        for (var i = 0; i < newModels.length; i++) {
            if (newModels[i]) {
                newModels[i] = await this.decrypt(newModels[i], this.getEncryptedProfile(newModels[i]), true);
            }
        }
        return newModels;
    }

    static async updateAll(model) {
        const newModels = await super.updateAll(await this.encrypt(model, this.getEncryptedProfile(model)));

        for (var i = 0; i < newModels.length; i++) {
            if (newModels[i]) {
                newModels[i] = await this.decrypt(newModels[i], this.getEncryptedProfile(newModels[i]), true);
            }
        }
        return newModels;
    }

    static getEncryptedProfile(model) {
        return model[this.encryptedProfileField] || this._encryptProfile || 'default';
    }

    static async decrypt(model, encryptProfile = 'default', onlyAutoCrypt = false) {
        if (await pg.options.crypto.isEncryptionEnabled()) {
            var keys = Object.keys(this._encryptionFields);

            for (var i = 0; i < keys.length; i++) {
                var field = model[keys[i]];
                var key = keys[i];

                if (field !== undefined) {
                    switch (this._encryptionFields[key]) {
                        case PGTypes.Encrypt:
                        case PGTypes.EncryptWithoutHash:
                            if (onlyAutoCrypt) {
                                break;
                            }
                        case PGTypes.AutoCrypt:
                        case PGTypes.AutoCryptWithoutHash:
                            if (field) {
                                model[key] = await pg.options.crypto.decrypt(field, encryptProfile);
                            }
                            break;
                        default:
                            break;
                    }
                }
            }
        }
        return model;
    }

    static async encrypt(model, encryptProfile = 'default') {
        if (await pg.options.crypto.isEncryptionEnabled()) {
            var keys = Object.keys(this._encryptionFields);

            for (var i = 0; i < keys.length; i++) {
                var field = model[keys[i]];
                var key = keys[i];

                if (field !== undefined) {
                    switch (this._encryptionFields[key]) {
                        case PGTypes.AutoCrypt:
                        case PGTypes.Encrypt:
                            model[`__${key}`] = await pg.options.crypto.checksum(field, encryptProfile);
                        case PGTypes.AutoCryptWithoutHash:
                        case PGTypes.EncryptWithoutHash:
                            model[key] = await pg.options.crypto.encrypt(field, encryptProfile);
                            break;
                        case PGTypes.Hash:
                            model[key] = await pg.options.crypto.hash(field, null, encryptProfile);
                            break;
                        default:
                            break;
                    }
                }
            }
        }
        return model;
    }
    static _builqueryFieldsHash(fieldValues, operator) {
        var builtQuery = { query: '', values: [] };

        if (Array.isArray(fieldValues)) {
            for (var i = 0; i < fieldValues.length; i++) {
                var a = this._buildQueryFromFV(fieldValues[i], operator[i] || 'AND', i + 1);

                builtQuery.query += a.query;
                if (i + 1 < fieldValues.length) {
                    builtQuery.query += ' ' + (operator[i] || 'AND') + ' ';
                }
                builtQuery.values = builtQuery.values.concat(a.values);
            }
        } else {
            builtQuery = this._buildQueryFromFV(fieldValues, operator);
        }
        return builtQuery;
    }
    static async _queryFieldsHash(fields, encryptProfile = 'default') {
        if (await pg.options.crypto.isEncryptionEnabled()) {
            var keys = Object.keys(this._encryptionFields);
            var isa = Array.isArray(fields);

            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];

                if (isa) {
                    for (var j = 0; j < fields.length; j++) {
                        await this._queryFieldToHash(fields[j], key, encryptProfile);
                    }
                } else {
                    await this._queryFieldToHash(fields, key, encryptProfile);
                }
            }
        }
        return fields;
    }

    static async _queryFieldToHash(fields, key, encryptProfile) {
        var field = fields[key];

        if (
            field !== undefined &&
            (PGTypes.AutoCrypt === this._encryptionFields[key] || PGTypes.Encrypt == this._encryptionFields[key])
        ) {
            // remove the unhashed filed nad replace it with the hashed version
            fields[`__${key}`] = fields[key];
            delete fields[key];
            key = `__${key}`;
            field = fields[key];

            if (Array.isArray(field)) {
                for (var j = 0; j < field.length; j++) {
                    // skip the operator in the query array.
                    if (j % 2 === 0) {
                        field[j] = await pg.options.crypto.checksum(field[j], encryptProfile);
                    }
                }
                fields[key] = field;
            } else {
                fields[key] = await pg.options.crypto.checksum(field, encryptProfile);
            }
        }
    }
}

module.exports = PGEncryptModel;
