'use strict';

/**
* Postgres Crypto Interface
* @abstract
*/
class Crypto {
    constructor() {
    }

    static async isEncryptionEnabled() {
        return Promise.resolve(false);
    }
    static async checksum(field, encryptProfile) {
        return Promise.reject('no checksum crypto function');
    }
    static async hash(data, salt, profile = 'default') {
        return Promise.reject('no hash crypto function');
    }

    static async encrypt(data, profile = 'default') {
        return Promise.reject('no encrypt crypto function');
    }

    static async decrypt(data, profile = 'default') {
        return Promise.reject('no decrypt crypto function');
    }
}

module.exports = Crypto;
