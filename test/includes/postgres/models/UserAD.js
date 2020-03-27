'use strict';

const BaseModel = require('../../../../lib/PGActiveModel.js');
const Base = require('../../../../lib/Base.js');
const PGTypes = require('../../../../lib/PGTypes.js');

class User extends Base(BaseModel, 'users', {
    id: PGTypes.PK,
    username: null,
    password: null,
    encrypted_profile: PGTypes.EncryptProfile,
    hashed_password: PGTypes.Hash,
    phone: PGTypes.Encrypt,
    auto_phone: PGTypes.AutoCrypt,
    memes: PGTypes.EncryptWithoutHash,
    auto_memes: PGTypes.AutoCryptWithoutHash,
    email: null,
    created_on: null,
    last_login: null,
}) {
    constructor(...args) {
        super(...args);
    }

    static async createUserWithRandomName(model) {
        model.username = 'user' + Math.floor(Math.random() * 1000);
        return await super.create(model);
    }
}

module.exports = User;
