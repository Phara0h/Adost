'use strict';

const BaseModel = require('../../../../lib/PGBaseModel.js');
const Base = require('../../../../lib/Base.js');
const PGTypes = require('../../../../lib/PGTypes.js');

class User extends Base(BaseModel, 'users', {
    id: PGTypes.PK,
    username: null,
    password: null,
    email: null,
    created_on: null,
    last_login: null,
}) {

    constructor() {
        super();
    }

    static async createUserWithRandomName(model) {
        model.username = 'user' + Math.floor(Math.random() * 1000);
        return await this.create(model);
    }
}

module.exports = User;
