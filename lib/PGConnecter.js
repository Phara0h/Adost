'use strict';

const {
    Pool
} = require('pg').native;

const crypto = require('./crypto/interface');

/**
* Postgres Connecter to initialize the singleton for connection.

* @param {Object} options The connection options.
* @param {Crypto} options.crypto=postgres/crypto/interface.js The implemented crypto interface that follows `postgres/crypto/interface.js`
* @param {Object} options.pg The options object to pass into `pg` lib.
* @param {String} options.pg.user=process.env.PGUSER User's name.
* @param {String} options.pg.password=process.env.PGPASSWORD User's password.
* @param {String} options.pg.database=process.env.PGDATABASE Database's name.
* @param {Number} options.pg.port=process.env.PGPORT Database's port.
* @param {String} options.pg.connectionString Postgres formated connection string. e.g. postgres://user:password@host:5432/database
* @param {TLSSocket} options.pg.ssl Options to be passed into the native Node.js TLSSocket socket.
* @param {pg.types} options.pg.types Custom type parsers. See [node-postgres types](https://github.com/brianc/node-pg-types) for more details.
* @param {Number} options.pg.statement_timeout=0 Number of milliseconds before a statement in query will time out.
* @param {Number} options.pg.query_timeout=0 number of milliseconds before a query call will timeout.
* @param {Number} options.pg.connectionTimeoutMillis=0 Number of milliseconds to wait before timing out when connecting a new client.
* @param {Number} options.pg.idleTimeoutMillis=10000 Number of milliseconds a client must sit idle in the pool and not be checked out before it is disconnected from the backend and discarded.
* @param {Number} options.pg.max=10 Maximum number of clients the pool should contain.
*
* @example
*
* var pgOptions = {
*     pg: {
*         connectionString: 'postgres://postgres@localhost/pgtest',
*     }
* };
*
* try {
*     pgOptions.crypto = require('@abeai/node-crypto').utils.pgCrypto;
* } catch (_) {
*     console.log(_);
* }
*
* var pg = new PGConnecter(pgOptions);
*
*/
class PGConnecter {
    constructor(options) {

        if (!!PGConnecter.instance) {
            if (options != null) {

                if (!options.crypto) {
                    options.crypto = crypto;
                }

                PGConnecter.instance.options = options;
                PGConnecter.instance.pool = new Pool(options.pg);
            }

            return PGConnecter.instance;
        }

        this.options = options ? options : {};

        this.pool = new Pool(this.options.pg);

        if (!this.options.crypto) {
            this.options.crypto = crypto;
        }

        PGConnecter.instance = this;

        return this;
    }

    async query(query, variables) {
        return await this.pool.query(query, variables);
    }

    /*
     *  array of query objects
     * query objects = {
        query: 'some query',
        variables: [1,'fish', 2, 'fish'],
        cb: async (results, nextQuery) => { return nextQuery; } // optional, return edited next query
      }

    WILL ROLLBACK ALL QUERIES IF ANY ERRORS HAPPEN
  */
    async queryBatch(queries) {
        try {
            var client = await this.pool.connect();
            var response = null;

            await client.query('BEGIN');

            for (var i = 0; i < queries.length; i++) {
                var results = await client.query(queries[i].query, queries[i].variables);

                if (queries[i].cb) {
                    await queries[i].cb(results, queries.length < i + 1 ? queries[i + 1] : null);
                }
            }

            response = await client.query('COMMIT');
        } catch (e) {
            await client.query('ROLLBACK');
            throw e;
        } finally {
            await client.release();
            return response;
        }
    }

    // Does not work with native.

    // async queryStream(query, varibles = []) {
    //
    //     var client = await this.pool.connect();
    //     var response = null;
    //     var qs = new QueryStream(query, [])
    //     var stream = client.query(qs);
    //
    //     stream.on('end', client.release);
    //
    //     return stream;
    // }

}

module.exports = PGConnecter;
