'use strict';

const BaseModel = require('./PGEncryptModel.js');
const PGConnecter = require('./PGConnecter.js');
const isEmpty = function isEmpty(obj) {
    return obj ? Object.keys(obj).length == 0 && !obj.length : true;
};
const { redactSensitiveDataSymbol } = require('./redaction');
const deepClone = require('./clone.js').cloneDeep;

const pg = new PGConnecter();

/**
 * Postgres Active Model class to extend a custom model from.
 * @extends PGEncryptModel
 * @example
 *
 *    class User extends Base(BaseModel, 'users', {
 *        id: PGTypes.PK,
 *        username: null,
 *        password: null,
 *        encrypted_profile: PGTypes.EncryptProfile,
 *        hashed_password: PGTypes.Hash,
 *        phone: PGTypes.Encrypt,
 *        auto_phone: PGTypes.AutoCrypt,
 *        memes: PGTypes.EncryptWithoutHash,
 *        auto_memes: PGTypes.AutoCryptWithoutHash,
 *        email: null,
 *        created_on: null,
 *        last_login: null,
 *    }) {
 *        constructor(...args) {
 *            super(...args);
 *        }
 *
 *        static async createUserWithRandomName(model) {
 *            model.username = 'user' + Math.floor(Math.random() * 1000);
 *            return await super.create(model);
 *        }
 *    }
 */
class PGActiveModel extends BaseModel {
    constructor(model, table, pk, encryptedProfileField, setModel, encryptProfile) {
        super(model, table, pk, encryptedProfileField, encryptProfile);

        this.changedProps = {};
        this._ = {};
        var keys = Object.keys(this._defaultModel);

        for (var i = 0; i < keys.length; i++) {
            const key = keys[i];

            Object.defineProperties(this, {
                [key]: {
                    get() {
                        return this._[key];
                    },
                    set(data) {
                        this.changedProps[key] = this._[key] = data;
                    }
                }
            });

            this._[key] = null;
        }

        this.changedProps = {};

        if (setModel) {
            var setKeys = Object.keys(setModel);

            for (var i = 0; i < setKeys.length; i++) {
                if (!setModel[setKeys[i]]) {
                    this[setKeys[i]] = setModel[setKeys[i]];
                } else if (Array.isArray(setModel[setKeys[i]])) {
                    this[setKeys[i]] = [...setModel[setKeys[i]]];
                } else if (setModel[setKeys[i]].constructor === Object) {
                    this[setKeys[i]] = deepClone(setModel[setKeys[i]]);
                } else {
                    this[setKeys[i]] = setModel[setKeys[i]];
                }
            }
        }

        if (encryptProfile && encryptedProfileField) {
            this[encryptedProfileField] = encryptProfile;
        }

        this.ChildClass = this.constructor;
    }

    /**
     * Adds a property to this model that does not affect it from a database perspective.
     *
     * @param {String} name The name of the property.
     * @param {Any} value The the value to set the property.
     */
    addProperty(name, value) {
        Object.defineProperties(this, {
            [name]: {
                get() {
                    return this._[name];
                },
                set(data) {
                    this._[name] = data;
                }
            }
        });
        this[name] = value;
    }

    /**
     * Retrieves the current model by its set field with type `PGTypes.PK`
     *
     * @returns {PGActiveModel} Returns it's self.
     */
    async find() {
        var foundModel = await this.ChildClass.findById(this[this._pkKey]);

        if (!foundModel) {
            throw new Error('Unable to find model with id ' + this[this.pkKey]);
        } else {
            this._setModel(foundModel);
        }
        return this;
    }

    /**
     * Deletes the current model by its set field with type `PGTypes.PK`
     *
     * @returns {PGActiveModel} Returns it's self.
     */
    async delete() {
        var deletedModel = await this.ChildClass.deleteById(this[this._pkKey]);

        if (deletedModel.length < 1) {
            throw new Error('Unable to delete model with id ' + this[this._pkKey]);
        } else {
            this._setModelPropsToNull();
        }

        return this;
    }

    /**
     * Creates a new row with the currently set properties.
     *
     * @returns {PGActiveModel} Returns it's self.
     */
    async create() {
        var newModel = await this.ChildClass.create(this.changedProps, true, this.getEncryptedProfile());

        if (!newModel) {
            throw new Error('Unable to create new model with id ' + this._[this._pkKey]);
        } else {
            this._setModel(newModel);
        }

        return this;
    }

    /**
     * Creates a new row with the passed in props and values.
     * @param {Object} model A plain object with the name of the properties and their values to be set with the new model.
     * @returns {PGActiveModel} Returns it's self.
     * @example
     *
     *    create({
     *       username: 'foo',
     *       email: 'test@test.com',
     *    });
     */
    static async create(model, nonStatic = false, encryptProfile) {
        var newModel = await super.create(model, true, encryptProfile || model[this.encryptedProfileField]);

        if (!newModel) {
            throw new Error('Unable to create new model');
        } else {
            newModel = nonStatic ? newModel[0] : new this(newModel[0]);
            newModel.changedProps = {};
        }

        return newModel;
    }

    /**
     * Saves the model with its changed properties.
     * @returns {PGActiveModel} Returns it's self.
     */
    async save() {
        if (!isEmpty(this.changedProps)) {
            await this.update(this.changedProps);
        }

        return this;
    }

    /**
     * Updates the model with the passed in changed properties.
     * @returns {PGActiveModel} Returns it's self.
     */
    async update(model) {
        var updatedModel = await this.ChildClass.updateById(
            this[this._pkKey],
            model,
            true,
            false,
            this.getEncryptedProfile()
        );

        if (!updatedModel) {
            throw new Error('Unable to update model with id ' + this[this._pkKey]);
        } else {
            this._setModel(updatedModel);
        }
        return this;
    }

    /**
     * Decrypts the properties on the model based on which stringed names are passed in as arguments.
     * @param {String} props name of each property.
     * @returns {PGActiveModel} Returns it's self.
     */
    async decrypt(...props) {
        var fields = {};

        for (var i = 0; i < props.length; i++) {
            var key = props[i];

            if (this[key]) {
                fields[key] = this[key];
            }
        }
        this._setModel(await this.ChildClass.decrypt(isEmpty(fields) ? this._ : fields, this.getEncryptedProfile()));
        return this;
    }

    /**
     * Encrypts the properties on the model based on which stringed names are passed in as arguments.
     * @param {String} props name of each property.
     * @returns {PGActiveModel} Returns it's self.
     */
    async encrypt(...props) {
        var fields = {};

        for (var i = 0; i < props.length; i++) {
            var key = props[i];

            if (this[key]) {
                fields[key] = this[key];
            }
        }
        this._setModel(await this.ChildClass.encrypt(isEmpty(fields) ? this._ : fields, this.getEncryptedProfile()));
        return this;
    }

    /**
     * Redacts all encrypted fields from the model.
     * @param {String} redactionCensor="[redacted]" The string to replace the encrypted values with.
     * @returns {PGActiveModel} Returns it's self.
     */
    redactSensitiveData(redactionCensor = '[redacted]') {
        var keys = Object.keys(this.ChildClass.encryptionFields);

        for (var i = 0; i < keys.length; i++) {
            this._[keys[i]] = redactionCensor;
        }
        return this;
    }

    [redactSensitiveDataSymbol](redactionCensor = '[redacted]') {
        return this.redactSensitiveData(redactionCensor);
    }

    _setModelPropsToNull() {
        var keys = Object.keys(this._defaultModel);

        for (var i = 0; i < keys.length; i++) {
            this[keys[i]] = null;
        }
        this.changedProps = {};
    }

    _setModel(model) {
        var keys = Object.keys(this._defaultModel);

        for (var i = 0; i < keys.length; i++) {
            if (model[keys[i]] !== undefined) {
                this._[keys[i]] = model[keys[i]];
            }
        }
        this.changedProps = {};
    }

    /**
     * Gets the encrypted profile that the model has set.
     * @returns {String} Returns it's self.
     */
    getEncryptedProfile() {
        return this.ChildClass.getEncryptedProfile(this) || this.changedProps[this.encryptedProfileField];
    }

    static _toADModels(objects) {
        var modelArray = [];

        for (var i = 0; i < objects.length; i++) {
            var newModel = new this(objects[i]);

            newModel.changedProps = {};
            modelArray.push(newModel);
        }
        return modelArray;
    }

    /**
     * Retrives a model by it's PK.
     * @param {String} id The PK of the model to retrieve.
     * @returns {PGActiveModel} Returns a new model.
     */
    static async findById(id, limit, params = '*') {
        return await this.findAllBy(
            {
                [this._pkKey]: id
            },
            'AND',
            true,
            limit,
            params
        ).then((res) => {
            return res && res.length > 0 ? res[0] : null;
        });
    }

    /**
     * Retrives a limited amount models by the passed in `fieldValues`.
     * @param {Object} fieldValues A plain object with the properties and their values to retrive by.
     * @param {String} operator=AND The query operator to use between each of the `fieldValues` [`AND`, `OR`, 'NOT']
     * @param {Number} limit The limit to stop searching when the records retrived are equal or greater than the set `limit`.
     * @returns {PGActiveModel[]} Returns an array of new models.
     * @example
     *
     *    findLimtedBy({
     *       username: ['user2', 'OR', 'user3'],
     *       email: null,
     *    }, 'AND', 5);
     */
    static async findLimtedBy(fieldValues, operator = 'AND', limit, params = '*') {
        var fModels = await super.findAllBy(fieldValues, operator, limit, params);

        return this._toADModels(fModels);
    }

    /**
     * Retrives all models by the passed in fieldValues. Will stop searching when the records retrived are equal or greater than `limit`.
     * @param {Object} fieldValues A plain object with the properties and their values to retrive by.
     * @param {String} operator=AND The query operator to use between each of the fieldValues [`AND`, `OR`, 'NOT']
     * @returns {PGActiveModel[]} Returns an array of new models.
     * @example
     *
     *    findAllBy({
     *       username: ['user2', 'OR', 'user3'],
     *       email: null,
     *    }, 'AND');
     */
    static async findAllBy(fieldValues, operator = 'AND', isById = false, params = '*') {
        var fModels = await super.findAllBy(fieldValues, operator, null, params);

        return isById ? fModels : this._toADModels(fModels);
    }

    /**
     * Retrives all rows in the table of the model.
     * @returns {PGActiveModel[]} Returns an array of new models.
     */
    static async findAll(limit,params = '*') {
        return await this._toADModels(await super.findAll(limit, params));
    }

    /**
     * Deletes a model that is found by it's PK with the passed in props and values.
     * @param {String} id The PK of the model to delete.
     * @returns {PGActiveModel} Returns a new model or null
     */
    static async deleteById(id) {
        return super.deleteById(id);
    }

    /**
     * Deletes a limited amount models by the passed in fieldValues.
     * @param {Object} fieldValues A plain object with the properties and their values to delete by.
     * @param {String} operator=AND The query operator to use between each of the fieldValues [`AND`, `OR`, 'NOT']
     * @param {Number} limit The limit to stop deleting when the records retrived are equal or greater than the set `limit`.
     * @returns {PGActiveModel[]} Returns an array of deleted models.
     * @example
     *
     *    deleteLimitedBy({
     *       registered: false,
     *    },'AND', 5);
     */
    static async deleteLimitedBy(fieldValues, operator = 'AND', limit) {
        return this._toADModels(await super.deleteAllBy(fieldValues, operator, limit));
    }

    /**
     * Deletes all models by the passed in `fieldValues`.
     * @param {Object} fieldValues A plain object with the properties and their values to delete by.
     * @param {String} operator=AND The query operator to use between each of the `fieldValues` [`AND`, `OR`, 'NOT']
     * @returns {PGActiveModel[]} Returns an array of deleted models.
     * @example
     *
     *    deleteAllBy({
     *       registered: true,
     *    });
     */
    static async deleteAllBy(fieldValues, operator = 'AND') {
        return this._toADModels(await super.deleteAllBy(fieldValues, operator));
    }

    /**
     *  Deletes all models in their table.
     * @returns {PGActiveModel[]} Returns an array of deleted models or null
     */
    static async deleteAll() {
        return this._toADModels(await super.deleteAll());
    }

    /**
     * Updates a model that is found by it's PK with the passed in props and values.
     * @param {String} id The PK of the model to update.
     * @param {Object} model A plain object with the name of the properties and their values to update the model with.
     * @param {Boolean} returnModel=true If the updated model should be returned or not. It will return null if this is set to false.
     * @returns {PGActiveModel} Returns a new model or null
     * @example
     *
     *  updateById('09A75A84-A921-4F68-8FEF-B8392E3702C2',
     *   {
     *     password: 'bestpasswordinalltheland12346969420'
     *   });
     */
    static async updateById(id, model, returnModel = true, isById = false, encryptProfile) {
        return await this.updateAllBy(
            {
                [this._pkKey]: id
            },
            model,
            'AND',
            returnModel,
            isById,
            encryptProfile
        ).then((res) => {
            return res && res.length > 0 ? res[0] : null;
        });
    }

    /**
     * Updates models that are found by the passed in `fieldValues` with the passed in props and values of the `model`.
     * @param {Object} fieldValues A plain object with the properties and their values to update by.
     * @param {Object} model A plain object with the name of the properties and their values to update the model with.
     * @param {String} operator=AND The query operator to use between each of the `fieldValues` [`AND`, `OR`, 'NOT']
     * @param {Boolean} returnModel=true If the updated model should be returned or not. It will return null if this is set to false.
     * @param {Number} limit The limit to stop searching when the records retrived are equal or greater than the set `limit`.
     * @returns {PGActiveModel[]} Returns an array of updated models or null
     * @example
     *
     *  updateLimitedBy({
     *     password: null
     *   },
     *   {
     *     password: 'bestpasswordinalltheland12346969420'
     *   },'AND', true, 5);
     */
    static async updateLimitedBy(fieldValues, model, operator = 'AND', returnModel = true, limit, encryptProfile) {
        var uModels = await super.updateAllBy(fieldValues, model, operator, returnModel, encryptProfile, limit);

        return this._toADModels(uModels);
    }

    /**
     *  Updates all models that are found by the passed in `fieldValues` with the passed in props and values of the `model`.
     * @param {Object} fieldValues A plain object with the properties and their values to update by.
     * @param {Object} model A plain object with the name of the properties and their values to update the model with.
     * @param {String} operator=AND The query operator to use between each of the `fieldValues` [`AND`, `OR`, 'NOT']
     * @param {Boolean} returnModel=true If the updated model should be returned or not. It will return null if this is set to false.
     * @returns {PGActiveModel[]} Returns an array of updated models or null
     * @example
     *
     *  updateAllBy({
     *     password: null
     *   },
     *   {
     *     password: 'bestpasswordinalltheland12346969420'
     *   });
     */
    static async updateAllBy(fieldValues, model, operator = 'AND', returnModel = true, isById = false, encryptProfile) {
        var uModels = await super.updateAllBy(fieldValues, model, operator, returnModel, encryptProfile);

        return isById ? uModels : this._toADModels(uModels);
    }

    /**
     *  Updates all models in their table with the passed in props and values of the `model`.
     * @param {Object} model A plain object with the name of the properties and their values to update the models with.
     * @returns {PGActiveModel[]} Returns an array of updated models or null
     * @example
     *
     *  updateAll({
     *     password: 'bestpasswordinalltheland12346969420'
     *   });
     */
    static async updateAll(model) {
        return this._toADModels(await super.updateAll(model));
    }

    toJSON() {
        return { ...this._ };
    }

    toString() {
        return { ...this._ };
    }
}

module.exports = PGActiveModel;
