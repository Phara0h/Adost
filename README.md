# Adost

## Documentation

Original base work was a forked from [@abeai/node-utils](https://github.com/abeai/node-utils)

## Classes

<dt><a href="#PGActiveModel">PGActiveModel</a> ⇐ <code><a href="#PGEncryptModel">PGEncryptModel</a></code></dt>
<dd><p>Postgres Active Model class to extend a custom model from.</p>
</dd>
<dt><a href="#PGBaseModel">PGBaseModel</a></dt>
<dd><p>Postgres Base Model class to extend a custom model from.</p>
</dd>
<dt><a href="#PGConnecter">PGConnecter</a></dt>
<dd><p>Postgres Connecter to initialize the singleton for connection.</p>
</dd>
<dt><a href="#PGEncryptModel">PGEncryptModel</a> ⇐ <code><a href="#PGBaseModel">PGBaseModel</a></code></dt>
<dd><p>Postgres Encryption Model class to extend a custom model from.</p>
</dd>
</dl>

## Constants

<dl>
<dt><a href="#PGTypes">PGTypes</a></dt>
<dd><p>The types of fields for Postgres Models.</p>
</dd>
</dl>

## PGActiveModel ⇐ [<code>PGEncryptModel</code>](#PGEncryptModel)
Postgres Active Model class to extend a custom model from.

**Kind**: global class  
**Extends**: [<code>PGEncryptModel</code>](#PGEncryptModel)  

* [PGActiveModel](#PGActiveModel) ⇐ [<code>PGEncryptModel</code>](#PGEncryptModel)
    * _instance_
        * [.addProperty(name, value)](#PGActiveModel+addProperty)
        * [.find()](#PGActiveModel+find) ⇒ [<code>PGActiveModel</code>](#PGActiveModel)
        * [.delete()](#PGActiveModel+delete) ⇒ [<code>PGActiveModel</code>](#PGActiveModel)
        * [.create()](#PGActiveModel+create) ⇒ [<code>PGActiveModel</code>](#PGActiveModel)
        * [.save()](#PGActiveModel+save) ⇒ [<code>PGActiveModel</code>](#PGActiveModel)
        * [.update()](#PGActiveModel+update) ⇒ [<code>PGActiveModel</code>](#PGActiveModel)
        * [.decrypt(...props)](#PGActiveModel+decrypt) ⇒ [<code>PGActiveModel</code>](#PGActiveModel)
        * [.encrypt(...props)](#PGActiveModel+encrypt) ⇒ [<code>PGActiveModel</code>](#PGActiveModel)
        * [.redactSensitiveData(redactionCensor)](#PGActiveModel+redactSensitiveData) ⇒ [<code>PGActiveModel</code>](#PGActiveModel)
        * [.getEncryptedProfile()](#PGActiveModel+getEncryptedProfile) ⇒ <code>String</code>
    * _static_
        * [.create(model)](#PGActiveModel.create) ⇒ [<code>PGActiveModel</code>](#PGActiveModel)
        * [.findById(id)](#PGActiveModel.findById) ⇒ [<code>PGActiveModel</code>](#PGActiveModel)
        * [.findLimtedBy(fieldValues, operator, limit)](#PGActiveModel.findLimtedBy) ⇒ [<code>Array.&lt;PGActiveModel&gt;</code>](#PGActiveModel)
        * [.findAllBy(fieldValues, operator)](#PGActiveModel.findAllBy) ⇒ [<code>Array.&lt;PGActiveModel&gt;</code>](#PGActiveModel)
        * [.findAll()](#PGActiveModel.findAll) ⇒ [<code>Array.&lt;PGActiveModel&gt;</code>](#PGActiveModel)
        * [.deleteById(id)](#PGActiveModel.deleteById) ⇒ [<code>PGActiveModel</code>](#PGActiveModel)
        * [.deleteLimitedBy(fieldValues, operator, limit)](#PGActiveModel.deleteLimitedBy) ⇒ [<code>Array.&lt;PGActiveModel&gt;</code>](#PGActiveModel)
        * [.deleteAllBy(fieldValues, operator)](#PGActiveModel.deleteAllBy) ⇒ [<code>Array.&lt;PGActiveModel&gt;</code>](#PGActiveModel)
        * [.deleteAll()](#PGActiveModel.deleteAll) ⇒ [<code>Array.&lt;PGActiveModel&gt;</code>](#PGActiveModel)
        * [.updateById(id, model, returnModel)](#PGActiveModel.updateById) ⇒ [<code>PGActiveModel</code>](#PGActiveModel)
        * [.updateLimitedBy(fieldValues, model, operator, returnModel, limit)](#PGActiveModel.updateLimitedBy) ⇒ [<code>Array.&lt;PGActiveModel&gt;</code>](#PGActiveModel)
        * [.updateAllBy(fieldValues, model, operator, returnModel)](#PGActiveModel.updateAllBy) ⇒ [<code>Array.&lt;PGActiveModel&gt;</code>](#PGActiveModel)
        * [.updateAll(model)](#PGActiveModel.updateAll) ⇒ [<code>Array.&lt;PGActiveModel&gt;</code>](#PGActiveModel)

<a name="PGActiveModel+addProperty"></a>

### pgActiveModel.addProperty(name, value)
Adds a property to this model that does not affect it from a database perspective.

**Kind**: instance method of [<code>PGActiveModel</code>](#PGActiveModel)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | The name of the property. |
| value | <code>Any</code> | The the value to set the property. |

<a name="PGActiveModel+find"></a>

### pgActiveModel.find() ⇒ [<code>PGActiveModel</code>](#PGActiveModel)
Retrieves the current model by its set field with type `PGTypes.PK`

**Kind**: instance method of [<code>PGActiveModel</code>](#PGActiveModel)  
**Returns**: [<code>PGActiveModel</code>](#PGActiveModel) - Returns it's self.  
<a name="PGActiveModel+delete"></a>

### pgActiveModel.delete() ⇒ [<code>PGActiveModel</code>](#PGActiveModel)
Deletes the current model by its set field with type `PGTypes.PK`

**Kind**: instance method of [<code>PGActiveModel</code>](#PGActiveModel)  
**Returns**: [<code>PGActiveModel</code>](#PGActiveModel) - Returns it's self.  
<a name="PGActiveModel+create"></a>

### pgActiveModel.create() ⇒ [<code>PGActiveModel</code>](#PGActiveModel)
Creates a new row with the currently set properties.

**Kind**: instance method of [<code>PGActiveModel</code>](#PGActiveModel)  
**Returns**: [<code>PGActiveModel</code>](#PGActiveModel) - Returns it's self.  
<a name="PGActiveModel+save"></a>

### pgActiveModel.save() ⇒ [<code>PGActiveModel</code>](#PGActiveModel)
Saves the model with its changed properties.

**Kind**: instance method of [<code>PGActiveModel</code>](#PGActiveModel)  
**Returns**: [<code>PGActiveModel</code>](#PGActiveModel) - Returns it's self.  
<a name="PGActiveModel+update"></a>

### pgActiveModel.update() ⇒ [<code>PGActiveModel</code>](#PGActiveModel)
Updates the model with the passed in changed properties.

**Kind**: instance method of [<code>PGActiveModel</code>](#PGActiveModel)  
**Returns**: [<code>PGActiveModel</code>](#PGActiveModel) - Returns it's self.  
<a name="PGActiveModel+decrypt"></a>

### pgActiveModel.decrypt(...props) ⇒ [<code>PGActiveModel</code>](#PGActiveModel)
Decrypts the properties on the model based on which stringed names are passed in as arguments.

**Kind**: instance method of [<code>PGActiveModel</code>](#PGActiveModel)  
**Returns**: [<code>PGActiveModel</code>](#PGActiveModel) - Returns it's self.  

| Param | Type | Description |
| --- | --- | --- |
| ...props | <code>String</code> | name of each property. |

<a name="PGActiveModel+encrypt"></a>

### pgActiveModel.encrypt(...props) ⇒ [<code>PGActiveModel</code>](#PGActiveModel)
Encrypts the properties on the model based on which stringed names are passed in as arguments.

**Kind**: instance method of [<code>PGActiveModel</code>](#PGActiveModel)  
**Returns**: [<code>PGActiveModel</code>](#PGActiveModel) - Returns it's self.  

| Param | Type | Description |
| --- | --- | --- |
| ...props | <code>String</code> | name of each property. |

<a name="PGActiveModel+redactSensitiveData"></a>

### pgActiveModel.redactSensitiveData(redactionCensor) ⇒ [<code>PGActiveModel</code>](#PGActiveModel)
Redacts all encrypted fields from the model.

**Kind**: instance method of [<code>PGActiveModel</code>](#PGActiveModel)  
**Returns**: [<code>PGActiveModel</code>](#PGActiveModel) - Returns it's self.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| redactionCensor | <code>String</code> | <code>&quot;[redacted]&quot;</code> | The string to replace the encrypted values with. |

<a name="PGActiveModel+getEncryptedProfile"></a>

### pgActiveModel.getEncryptedProfile() ⇒ <code>String</code>
Gets the encrypted profile that the model has set.

**Kind**: instance method of [<code>PGActiveModel</code>](#PGActiveModel)  
**Returns**: <code>String</code> - Returns it's self.  
<a name="PGActiveModel.create"></a>

### PGActiveModel.create(model) ⇒ [<code>PGActiveModel</code>](#PGActiveModel)
Creates a new row with the passed in props and values.

**Kind**: static method of [<code>PGActiveModel</code>](#PGActiveModel)  
**Returns**: [<code>PGActiveModel</code>](#PGActiveModel) - Returns it's self.  

| Param | Type | Description |
| --- | --- | --- |
| model | <code>Object</code> | A plain object with the name of the properties and their values to be set with the new model. |

**Example**  
```js
create({
      username: 'foo',
      email: 'test@test.com',
   });
```
<a name="PGActiveModel.findById"></a>

### PGActiveModel.findById(id) ⇒ [<code>PGActiveModel</code>](#PGActiveModel)
Retrives a model by it's PK.

**Kind**: static method of [<code>PGActiveModel</code>](#PGActiveModel)  
**Returns**: [<code>PGActiveModel</code>](#PGActiveModel) - Returns a new model.  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>String</code> | The PK of the model to retrieve. |

<a name="PGActiveModel.findLimtedBy"></a>

### PGActiveModel.findLimtedBy(fieldValues, operator, limit) ⇒ [<code>Array.&lt;PGActiveModel&gt;</code>](#PGActiveModel)
Retrives a limited amount models by the passed in `fieldValues`.

**Kind**: static method of [<code>PGActiveModel</code>](#PGActiveModel)  
**Returns**: [<code>Array.&lt;PGActiveModel&gt;</code>](#PGActiveModel) - Returns an array of new models.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| fieldValues | <code>Object</code> |  | A plain object with the properties and their values to retrive by. |
| operator | <code>String</code> | <code>AND</code> | The query operator to use between each of the `fieldValues` [`AND`, `OR`, 'NOT'] |
| limit | <code>Number</code> |  | The limit to stop searching when the records retrived are equal or greater than the set `limit`. |

**Example**  
```js
findLimtedBy({
      username: ['user2', 'OR', 'user3'],
      email: null,
   }, 'AND', 5);
```
<a name="PGActiveModel.findAllBy"></a>

### PGActiveModel.findAllBy(fieldValues, operator) ⇒ [<code>Array.&lt;PGActiveModel&gt;</code>](#PGActiveModel)
Retrives all models by the passed in fieldValues. Will stop searching when the records retrived are equal or greater than `limit`.

**Kind**: static method of [<code>PGActiveModel</code>](#PGActiveModel)  
**Returns**: [<code>Array.&lt;PGActiveModel&gt;</code>](#PGActiveModel) - Returns an array of new models.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| fieldValues | <code>Object</code> |  | A plain object with the properties and their values to retrive by. |
| operator | <code>String</code> | <code>AND</code> | The query operator to use between each of the fieldValues [`AND`, `OR`, 'NOT'] |

**Example**  
```js
findAllBy({
      username: ['user2', 'OR', 'user3'],
      email: null,
   }, 'AND');
```
<a name="PGActiveModel.findAll"></a>

### PGActiveModel.findAll() ⇒ [<code>Array.&lt;PGActiveModel&gt;</code>](#PGActiveModel)
Retrives all rows in the table of the model.

**Kind**: static method of [<code>PGActiveModel</code>](#PGActiveModel)  
**Returns**: [<code>Array.&lt;PGActiveModel&gt;</code>](#PGActiveModel) - Returns an array of new models.  
<a name="PGActiveModel.deleteById"></a>

### PGActiveModel.deleteById(id) ⇒ [<code>PGActiveModel</code>](#PGActiveModel)
Deletes a model that is found by it's PK with the passed in props and values.

**Kind**: static method of [<code>PGActiveModel</code>](#PGActiveModel)  
**Returns**: [<code>PGActiveModel</code>](#PGActiveModel) - Returns a new model or null  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>String</code> | The PK of the model to delete. |

<a name="PGActiveModel.deleteLimitedBy"></a>

### PGActiveModel.deleteLimitedBy(fieldValues, operator, limit) ⇒ [<code>Array.&lt;PGActiveModel&gt;</code>](#PGActiveModel)
Deletes a limited amount models by the passed in fieldValues.

**Kind**: static method of [<code>PGActiveModel</code>](#PGActiveModel)  
**Returns**: [<code>Array.&lt;PGActiveModel&gt;</code>](#PGActiveModel) - Returns an array of deleted models.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| fieldValues | <code>Object</code> |  | A plain object with the properties and their values to delete by. |
| operator | <code>String</code> | <code>AND</code> | The query operator to use between each of the fieldValues [`AND`, `OR`, 'NOT'] |
| limit | <code>Number</code> |  | The limit to stop deleting when the records retrived are equal or greater than the set `limit`. |

**Example**  
```js
deleteLimitedBy({
      registered: false,
   },'AND', 5);
```
<a name="PGActiveModel.deleteAllBy"></a>

### PGActiveModel.deleteAllBy(fieldValues, operator) ⇒ [<code>Array.&lt;PGActiveModel&gt;</code>](#PGActiveModel)
Deletes all models by the passed in `fieldValues`.

**Kind**: static method of [<code>PGActiveModel</code>](#PGActiveModel)  
**Returns**: [<code>Array.&lt;PGActiveModel&gt;</code>](#PGActiveModel) - Returns an array of deleted models.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| fieldValues | <code>Object</code> |  | A plain object with the properties and their values to delete by. |
| operator | <code>String</code> | <code>AND</code> | The query operator to use between each of the `fieldValues` [`AND`, `OR`, 'NOT'] |

**Example**  
```js
deleteAllBy({
      registered: true,
   });
```
<a name="PGActiveModel.deleteAll"></a>

### PGActiveModel.deleteAll() ⇒ [<code>Array.&lt;PGActiveModel&gt;</code>](#PGActiveModel)
Deletes all models in their table.

**Kind**: static method of [<code>PGActiveModel</code>](#PGActiveModel)  
**Returns**: [<code>Array.&lt;PGActiveModel&gt;</code>](#PGActiveModel) - Returns an array of deleted models or null  
<a name="PGActiveModel.updateById"></a>

### PGActiveModel.updateById(id, model, returnModel) ⇒ [<code>PGActiveModel</code>](#PGActiveModel)
Updates a model that is found by it's PK with the passed in props and values.

**Kind**: static method of [<code>PGActiveModel</code>](#PGActiveModel)  
**Returns**: [<code>PGActiveModel</code>](#PGActiveModel) - Returns a new model or null  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| id | <code>String</code> |  | The PK of the model to update. |
| model | <code>Object</code> |  | A plain object with the name of the properties and their values to update the model with. |
| returnModel | <code>Boolean</code> | <code>true</code> | If the updated model should be returned or not. It will return null if this is set to false. |

**Example**  
```js
updateById('09A75A84-A921-4F68-8FEF-B8392E3702C2',
  {
    password: 'bestpasswordinalltheland12346969420'
  });
```
<a name="PGActiveModel.updateLimitedBy"></a>

### PGActiveModel.updateLimitedBy(fieldValues, model, operator, returnModel, limit) ⇒ [<code>Array.&lt;PGActiveModel&gt;</code>](#PGActiveModel)
Updates models that are found by the passed in `fieldValues` with the passed in props and values of the `model`.

**Kind**: static method of [<code>PGActiveModel</code>](#PGActiveModel)  
**Returns**: [<code>Array.&lt;PGActiveModel&gt;</code>](#PGActiveModel) - Returns an array of updated models or null  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| fieldValues | <code>Object</code> |  | A plain object with the properties and their values to update by. |
| model | <code>Object</code> |  | A plain object with the name of the properties and their values to update the model with. |
| operator | <code>String</code> | <code>AND</code> | The query operator to use between each of the `fieldValues` [`AND`, `OR`, 'NOT'] |
| returnModel | <code>Boolean</code> | <code>true</code> | If the updated model should be returned or not. It will return null if this is set to false. |
| limit | <code>Number</code> |  | The limit to stop searching when the records retrived are equal or greater than the set `limit`. |

**Example**  
```js
updateLimitedBy({
    password: null
  },
  {
    password: 'bestpasswordinalltheland12346969420'
  },'AND', true, 5);
```
<a name="PGActiveModel.updateAllBy"></a>

### PGActiveModel.updateAllBy(fieldValues, model, operator, returnModel) ⇒ [<code>Array.&lt;PGActiveModel&gt;</code>](#PGActiveModel)
Updates all models that are found by the passed in `fieldValues` with the passed in props and values of the `model`.

**Kind**: static method of [<code>PGActiveModel</code>](#PGActiveModel)  
**Returns**: [<code>Array.&lt;PGActiveModel&gt;</code>](#PGActiveModel) - Returns an array of updated models or null  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| fieldValues | <code>Object</code> |  | A plain object with the properties and their values to update by. |
| model | <code>Object</code> |  | A plain object with the name of the properties and their values to update the model with. |
| operator | <code>String</code> | <code>AND</code> | The query operator to use between each of the `fieldValues` [`AND`, `OR`, 'NOT'] |
| returnModel | <code>Boolean</code> | <code>true</code> | If the updated model should be returned or not. It will return null if this is set to false. |

**Example**  
```js
updateAllBy({
    password: null
  },
  {
    password: 'bestpasswordinalltheland12346969420'
  });
```
<a name="PGActiveModel.updateAll"></a>

### PGActiveModel.updateAll(model) ⇒ [<code>Array.&lt;PGActiveModel&gt;</code>](#PGActiveModel)
Updates all models in their table with the passed in props and values of the `model`.

**Kind**: static method of [<code>PGActiveModel</code>](#PGActiveModel)  
**Returns**: [<code>Array.&lt;PGActiveModel&gt;</code>](#PGActiveModel) - Returns an array of updated models or null  

| Param | Type | Description |
| --- | --- | --- |
| model | <code>Object</code> | A plain object with the name of the properties and their values to update the models with. |

**Example**  
```js
updateAll({
    password: 'bestpasswordinalltheland12346969420'
  });
```
<a name="PGBaseModel"></a>

## PGBaseModel
Postgres Base Model class to extend a custom model from.

**Kind**: global class  
<a name="PGConnecter"></a>

## PGConnecter
Postgres Connecter to initialize the singleton for connection.

**Kind**: global class  
<a name="new_PGConnecter_new"></a>

### new PGConnecter(options)

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | The connection options. |
| options.crypto | <code>Crypto</code> | <code>postgres/crypto/interface.js</code> | The implemented crypto interface that follows `postgres/crypto/interface.js` |
| options.pg | <code>Object</code> |  | The options object to pass into `pg` lib. |
| options.pg.user | <code>String</code> | <code>process.env.PGUSER</code> | User's name. |
| options.pg.password | <code>String</code> | <code>process.env.PGPASSWORD</code> | User's password. |
| options.pg.database | <code>String</code> | <code>process.env.PGDATABASE</code> | Database's name. |
| options.pg.port | <code>Number</code> | <code>process.env.PGPORT</code> | Database's port. |
| options.pg.connectionString | <code>String</code> |  | Postgres formated connection string. e.g. postgres://user:password@host:5432/database |
| options.pg.ssl | <code>TLSSocket</code> |  | Options to be passed into the native Node.js TLSSocket socket. |
| options.pg.types | <code>pg.types</code> |  | Custom type parsers. See [node-postgres types](https://github.com/brianc/node-pg-types) for more details. |
| options.pg.statement_timeout | <code>Number</code> | <code>0</code> | Number of milliseconds before a statement in query will time out. |
| options.pg.query_timeout | <code>Number</code> | <code>0</code> | number of milliseconds before a query call will timeout. |
| options.pg.connectionTimeoutMillis | <code>Number</code> | <code>0</code> | Number of milliseconds to wait before timing out when connecting a new client. |
| options.pg.idleTimeoutMillis | <code>Number</code> | <code>10000</code> | Number of milliseconds a client must sit idle in the pool and not be checked out before it is disconnected from the backend and discarded. |
| options.pg.max | <code>Number</code> | <code>10</code> | Maximum number of clients the pool should contain. |

**Example**  
```js
var pgOptions = {
    pg: {
        connectionString: 'postgres://postgres@localhost/pgtest',
    }
};

try {
    pgOptions.crypto = require('@abeai/node-crypto').utils.pgCrypto;
} catch (_) {
    console.log(_);
}

var pg = new PGConnecter(pgOptions);
```
<a name="PGEncryptModel"></a>

## PGEncryptModel ⇐ [<code>PGBaseModel</code>](#PGBaseModel)
Postgres Encryption Model class to extend a custom model from.

**Kind**: global class  
**Extends**: [<code>PGBaseModel</code>](#PGBaseModel)  
<a name="PGTypes"></a>

## PGTypes
The types of fields for Postgres Models.

**Kind**: global constant  

* [PGTypes](#PGTypes)
    * [.PK](#PGTypes.PK)
    * [.Encrypt](#PGTypes.Encrypt)
    * [.EncryptWithoutHash](#PGTypes.EncryptWithoutHash)
    * [.EncryptProfile](#PGTypes.EncryptProfile)
    * [.AutoCrypt](#PGTypes.AutoCrypt)
    * [.AutoCryptWithoutHash](#PGTypes.AutoCryptWithoutHash)
    * [.Hash](#PGTypes.Hash)

<a name="PGTypes.PK"></a>

### PGTypes.PK
The primary key of the table.

**Kind**: static property of [<code>PGTypes</code>](#PGTypes)  
<a name="PGTypes.Encrypt"></a>

### PGTypes.Encrypt
Marks this field to auto encrypt/hash (for look up) but not auto decrypt it on retrieval.
The table will need to have a field with the same name as this set field with `__` as a prefix.

**Kind**: static property of [<code>PGTypes</code>](#PGTypes)  
**Example**  
```js
//if you have an encrypted field called `phone` the sql query for creating the table may look like this
 CREATE TABLE IF NOT EXISTS users (
   phone VARCHAR (500),
   __phone VARCHAR (500) UNIQUE,
 );
```
<a name="PGTypes.EncryptWithoutHash"></a>

### PGTypes.EncryptWithoutHash
Marks this field to auto encrypt but not auto decrypt it on retrieval.
Same as `Encrypt` but with no lookup hash.

**Kind**: static property of [<code>PGTypes</code>](#PGTypes)  
<a name="PGTypes.EncryptProfile"></a>

### PGTypes.EncryptProfile
Marks this field as the encryption profile for encrypting/decrypting/hashing utilizing aws kms.

**Kind**: static property of [<code>PGTypes</code>](#PGTypes)  
<a name="PGTypes.AutoCrypt"></a>

### PGTypes.AutoCrypt
Marks this field to auto encrypt/hash (for look up) and to auto decrypt it on retrieval.

**Kind**: static property of [<code>PGTypes</code>](#PGTypes)  
<a name="PGTypes.AutoCryptWithoutHash"></a>

### PGTypes.AutoCryptWithoutHash
Marks this field to auto encrypt and auto decrypt it on retrieval.
Same as `AutoCrypt` but with no lookup hash.

**Kind**: static property of [<code>PGTypes</code>](#PGTypes)  
<a name="PGTypes.Hash"></a>

### PGTypes.Hash
Marks this field to be hashed on creation (IE: Password and other information you want to protect)

**Kind**: static property of [<code>PGTypes</code>](#PGTypes)  
<a name="camelCase"></a>
