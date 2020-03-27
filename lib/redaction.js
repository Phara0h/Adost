'use strict';

module.exports = {
    redactSensitiveDataSymbol: Symbol('crypto.redactSensitiveData'),
    redactSensitiveData,
};

function redactSensitiveData(model) {
    const encryptedFields = Object.keys(model.rawAttributes)
        .filter((fieldName)=>model.rawAttributes[fieldName].crypto_encrypted);

    return function(redactionCensor) {
        const filtered = Object.assign({}, this);

        for (var index = 0; index < encryptedFields.length; ++index) {
            const encryptedFieldName = encryptedFields[index];

            if (filtered[encryptedFieldName]) {
                filtered[encryptedFieldName] = redactionCensor;
            }
        }
        return filtered;
    };
}
