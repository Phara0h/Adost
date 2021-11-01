'use strict';

const PGConnecter = require('./PGConnecter');
const pg = new PGConnecter();

/**
 * Postgres Base Model class to extend a custom model from.
 *
 * @example
 *
 *    class User extends Base(BaseModel, 'users', {
 *        id: PGTypes.PK,
 *        username: null,
 *        password: null,
 *        email: null,
 *        created_on: null,
 *        last_login: null,
 *    }) {
 *
 *        constructor() {
 *            super();
 *        }
 *
 *        static async createUserWithRandomName(model) {
 *            model.username = 'user' + Math.floor(Math.random() * 1000);
 *            return await this.create(model);
 *        }
 *    }
 *
 */
class PGBaseModel {
    constructor(model, table, pk) {
        this.table = table;
        (this._defaultModel = model), (this._pkKey = pk);
        this.models = [];
    }

    static async query(query, values, modelConvert = true) {
        if (modelConvert) {
            return this._convertToModel(await pg.query(query, values));
        }
        return await pg.query(query, values);
    }

    static async findById(id, params = '*') {
        return await this.findAllBy({
            [this._pkKey]: id
        },'AND',1,params).then((res) => {
            return res && res.length > 0 ? res[0] : null;
        });
    }

    static async findAllBy(fieldValues, operator = 'AND', limit, params = '*') {
        var builtQuery = this._builtQuery(fieldValues, operator);

        var query = `SELECT ${params} FROM ${this.table} WHERE ${builtQuery.query} ${limit ? 'LIMIT ' + limit : ''}`;
 
        return this._convertToModel(await pg.query(query, builtQuery.values));
    }

    static async findAll() {
        return this._convertToModel(await pg.query(`SELECT * FROM ${this.table}`));
    }

    static async deleteById(id) {
        return await this.deleteAllBy({
            [this._pkKey]: id
        });
    }

    static async deleteAllBy(fieldValues, operator = 'AND', limit) {
        var builtQuery = this._builtQuery(fieldValues, operator);
        var query = `DELETE FROM ${this.table} WHERE ${builtQuery.query} ${limit ? 'LIMIT ' + limit : ''} RETURNING *;`;

        return this._convertToModel(await pg.query(query, builtQuery.values));
    }

    static async deleteAll() {
        var query = `DELETE FROM ${this.table} RETURNING *;`;

        return this._convertToModel(await pg.query(query));
    }

    static async create(model, returnModel = true) {
        var keys = Object.keys(model);
        var query = `INSERT INTO ${this.table} (${keys.toString()}) VALUES(`;

        for (var i = 0; i < keys.length; i++) {
            query += '$' + (i + 1) + (keys.length > i + 1 ? ', ' : ')');
        }
        if (returnModel) {
            query += ' RETURNING *';
        }

        return this._convertToModel(await pg.query(query, Object.values(model)));
    }

    static async updateById(id, model) {
        return await this.updateAllBy(
            {
                [this._pkKey]: id
            },
            model
        );
    }

    static async updateAllBy(fieldValues, model, operator = 'AND', returnModel = true, limit) {
        var modelKeys = Object.keys(model);
        var modelValues = Object.values(model);

        var query = `UPDATE ${this.table} SET `;

        for (var i = 0; i < modelKeys.length; i++) {
            query += `${modelKeys[i]}=$${i + 1}${modelKeys.length > i + 1 ? ', ' : ' '}`;
        }

        var builtQuery = this._buildQueryFromFV(fieldValues, operator, modelValues.length + 1);

        query += ` WHERE ${builtQuery.query} ${limit ? 'LIMIT ' + limit : ''}`;
        if (returnModel) {
            query += ' RETURNING *';
        }

        return this._convertToModel(await pg.query(query, [...modelValues, ...builtQuery.values]));
    }

    static async updateAll(model) {
        var modelKeys = Object.keys(model);

        var query = `UPDATE ${this.table} SET `;

        for (var i = 0; i < modelKeys.length; i++) {
            query += `${modelKeys[i]}=$${i + 1}${modelKeys.length < i + 1 ? ', ' : ''} RETURNING *`;
        }

        return this._convertToModel(await pg.query(query, Object.values(model)));
    }

    static _convertToModel(results) {
        this.models = [];

        if (results && results.rows) {
            var keys = Object.keys(this._defaultModel);

            for (var i = 0; i < results.rows.length; i++) {
                var model = {};

                for (var j = 0; j < keys.length; j++) {
                    model[keys[j]] = results.rows[i][keys[j]];
                }
                this.models.push(model);
            }
            return this.models;
        } else {
            return results;
        }
    }

    static _builtQuery(fieldValues, operator) {
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

    static _buildQueryFromFV(fieldValues, operator = 'AND', startIndex = 1) {
        var fieldValuesKey = Object.keys(fieldValues);
        var values = [];
        var query = '';

        for (var i = 0; i < fieldValuesKey.length; i++) {
            var val = fieldValues[fieldValuesKey[i]];

            if (Array.isArray(val)) {
                for (var j = 0; j < val.length; j++) {
                    if (val[j + 1] === null) {
                        query += `"${fieldValuesKey[i]}" IS NULL${j < val.length ? ` ${val[j]} ` : ' '}`;
                    } else {
                        values.push(val[j++]);
                        query += `"${fieldValuesKey[i]}"=$${startIndex}${j < val.length ? ` ${val[j]} ` : ' '}`;
                        startIndex++;
                    }
                }
                if (fieldValuesKey.length > i + 1) {
                    query += ` ${operator} `;
                }
            } else if (val === null) {
                query += `"${fieldValuesKey[i]}" IS NULL${fieldValuesKey.length > i + 1 ? ` ${operator} ` : ' '}`;
            } else {
                values.push(val);
                query += `"${fieldValuesKey[i]}"=$${startIndex}${fieldValuesKey.length > i + 1 ? ` ${operator} ` : ' '}`;
                startIndex++;
            }
        }
        return {
            query,
            values
        };
    }
}

module.exports = PGBaseModel;
