'use strict';

/**
 * The types of fields for Postgres Models.
 */
const PGTypes = {

    /**
    * The primary key of the table.
    */
    PK: 'PK',

    /**
    * Marks this field to auto encrypt/hash (for look up) but not auto decrypt it on retrieval.
    * The table will need to have a field with the same name as this set field with `__` as a prefix.
    * @example
    * //if you have an encrypted field called `phone` the sql query for creating the table may look like this
    *  CREATE TABLE IF NOT EXISTS users (
    *    phone VARCHAR (500),
    *    __phone VARCHAR (500) UNIQUE,
    *  );
    */
    Encrypt: 'E',

    /**
    * Marks this field to auto encrypt but not auto decrypt it on retrieval.
    * Same as `Encrypt` but with no lookup hash.
    */
    EncryptWithoutHash: 'EWH',

    /**
    * Marks this field as the encryption profile for encrypting/decrypting/hashing utilizing aws kms.
    */
    EncryptProfile: 'EP',

    /**
    * Marks this field to auto encrypt/hash (for look up) and to auto decrypt it on retrieval.
    */
    AutoCrypt: 'AC',

    /**
    * Marks this field to auto encrypt and auto decrypt it on retrieval.
    * Same as `AutoCrypt` but with no lookup hash.
    */
    AutoCryptWithoutHash: 'ACWH',

    /**
    * Marks this field to be hashed on creation (IE: Password and other information you want to protect)
    */
    Hash: 'H'
};

module.exports = PGTypes;
