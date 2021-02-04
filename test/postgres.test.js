
describe('Postgres', () => {

    var PGConnecter = require('../').PGConnecter;
    var pgOptions = {
        pg: {
            connectionString: 'postgres://postgres@localhost/pgtest',
        }
    };

    var pg = new PGConnecter(pgOptions);

    var User = require('./includes/postgres/models/User');
    var UserAD = require('./includes/postgres/models/UserAD');

    test('queryBatch init database', async () => {
        var createDB = await pg.queryBatch([
            {
                query: 'DROP TABLE IF EXISTS users',
                variables: null,
            },
            {
                query: `CREATE TABLE IF NOT EXISTS users (
                         id serial PRIMARY KEY,
                         username VARCHAR (50),
                         password VARCHAR (50),
                         encrypted_profile VARCHAR (500),
                         hashed_password VARCHAR (500),
                         phone VARCHAR (500),
                         __phone VARCHAR (500) UNIQUE,
                         auto_phone VARCHAR (500),
                         __auto_phone VARCHAR (500) UNIQUE,
                         memes VARCHAR (500),
                         auto_memes VARCHAR (500),
                         email VARCHAR (355) ,
                         created_on TIMESTAMP,
                         last_login TIMESTAMP
                      );`,
                variables: null,
            },
        ]);

        expect(createDB != null).toBe(true);
    });

    describe('Base Model', () => {
        var user1 = null;
        var user2 = null;
        var user3 = null;

        describe('Create', () => {
            test('Instantiate 3 users', () => {
                user1 = new User();
                user2 = new User();
                user3 = new User();
                expect(user1 != null && user2 != null && user3 != null).toBe(true);
            });

            test('Create user 1 with 1 property static [create()]', async ()=>{
                user1 = await User.create(
                    {
                        username: 'user1',
                    });

                expect(user1[0].username).toBe('user1');
            });

            test('Create user 2 with 2 properties static [create()]', async ()=>{
                user2 = await User.create(
                    {
                        username: 'user2',
                        password: 'ilikememes',
                    });

                expect(user2[0].password).toBe('ilikememes');
            });

            test('Create user 3 with 4 properties static with encrypt field [create()]', async ()=>{
                user3 = await User.create(
                    {
                        username: 'user3',
                        password: 'ilovemothers',
                        email: 'motherlover@lel.com'
                    });

                expect(user3[0].email).toBe('motherlover@lel.com');
            });

            test('Create user with random name; custom class method [.createUserWithRandomName()]', async ()=>{
                var nUser = await User.createUserWithRandomName(
                    {
                        password: 'whohaveibecome',
                    });

                expect(nUser[0].password).toBe('whohaveibecome');
            });
        });

        describe('Find', () => {
            test('Find user by id static [findById()]', async ()=>{
                var fUser = await User.findById(1);

                expect(fUser.id).toBe(1);
            });

            test('Find all by properties static [findALlBy()]', async ()=>{
                var fUser = await User.findAllBy(
                    {
                        username: ['user1', 'OR', 'user2'],
                    });

                expect(fUser.length).toBe(2);
            });

            test('Find all by multiple properties query static [findAllBy()]', async ()=>{
                var fUser = await User.findAllBy(
                    {
                        username: ['user2', 'OR', 'user3'],
                        email: null,
                    }, 'AND');

                expect(fUser[0].username).toBe('user2');
            });

            test('Find all static [findAll()]', async ()=>{
                var fUser = await User.findAll();

                expect(fUser.length).toBe(4);
            });
        });

        describe('Update', () => {
            test('Update user 3 password [.updateById()]', async ()=>{
                user3 = await User.updateById(user3[0].id,
                    {
                        password: 'password123',
                    });

                expect(user3[0]).toEqual(expect.objectContaining({
                    password: 'password123'
                }));
            });

            test('Update all users that have no passwords static [updateAllBy()]', async ()=>{

                var updatedUsers = await User.updateAllBy({password: null}, {password: 'bestpasswordinalltheland12346969420'});

                expect(updatedUsers).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({
                            password: 'bestpasswordinalltheland12346969420'
                        })
                    ])
                );
            });

            test('Update All with last_login date static [updateAll()]', async ()=>{
                var date = new Date();
                var updatedUsers = await User.updateAll(
                    {
                        last_login: date,
                    });

                expect(updatedUsers).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({
                            last_login: date,
                        })
                    ])
                );
            });
        });

        describe('Delete', () => {

            test('Delete user1 static [deleteById()]', async ()=>{

                user1 = await User.deleteById(user1[0].id);

                expect(user1).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({
                            username: 'user1',
                        })
                    ])
                );
            });

            test('Delete by property static [deleteAllBy()]', async ()=>{
                var deletedUsers = await User.deleteAllBy(
                    {
                        email: 'motherlover@lel.com',
                    });

                expect(deletedUsers).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({
                            email: 'motherlover@lel.com',
                        })
                    ])
                );
            });

            test('Delete All static [deleteAll()]', async ()=>{
                await User.deleteAll();
                var users = await User.findAll();

                expect(users.length).toBe(0);
            });
        });

    });

    describe('Active Model', () => {

        var user1 = null;
        var user2 = null;
        var user3 = null;
        var user4 = null;

        describe('Create', () => {
            test('Instantiate 3 users', () => {
                user1 = new UserAD();
                user2 = new UserAD();
                user3 = new UserAD();
                expect(user1 != null && user2 != null && user3 != null).toBe(true);
            });

            test('Create user 1 with 1 property [.create()]', async ()=>{
                user1.username = 'user1';
                await user1.create();

                expect(user1.username).toBe('user1');
            });

            test('Create user 2 with 2 properties Instantiate [.create()]', async ()=>{
                user2 = new UserAD({
                    username: 'user2',
                    password: 'ilikememes'});
                await user2.create();
                expect(user2.password).toBe('ilikememes');
            });

            test('Create user 3 with 3 properties static  [create()]', async ()=>{
                user3 = await UserAD.create(
                    {
                        username: 'user3',
                        password: 'ilovemothers',
                        email: 'motherlover@lel.com'
                    });
                expect(user3.email).toBe('motherlover@lel.com');
            });

            test('Create user with random name; custom class method [.createUserWithRandomName()]', async ()=>{
                var nUser = await UserAD.createUserWithRandomName(
                    {
                        password: 'whohaveibecome',
                    });

                expect(nUser.password).toBe('whohaveibecome');
            });
        });

        describe('Find', () => {
            test('Find user by id [.find()]', async ()=>{
                var fUser = new UserAD();

                fUser.id = user1.id;

                await fUser.find();

                expect(fUser.username).toBe('user1');
            });

            test('Find user by id static [.findById()]', async ()=>{
                var fUser = await UserAD.findById(user1.id);

                expect(fUser.username).toBe('user1');
            });

            test('Find all by properties static [findAllBy()]', async ()=>{
                var fUser = await UserAD.findAllBy(
                    {
                        username: ['user1', 'OR', 'user2'],
                    });

                expect(fUser[1].username).toBe('user2');
            });

            test('Find all by multiple properties query static [findAllBy()]', async ()=>{
                var fUser = await UserAD.findAllBy(
                    {
                        username: ['user2', 'OR', 'user3'],
                        email: null,
                    }, 'AND');

                expect(fUser[0].username).toBe('user2');
            });
        });

        describe('Update', () => {
            test('Update user 3 password [.save()]', async ()=>{
                user3.password = 'password123';
                user3.save();

                expect(user3).toEqual(expect.objectContaining({
                    password: 'password123'
                }));
            });

            test('Update all users that have no passwords static [updateAllBy()]', async ()=>{

                var updatedUsers = await UserAD.updateAllBy({password: null}, {password: 'bestpasswordinalltheland12346969420'});

                expect(updatedUsers).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({
                            password: 'bestpasswordinalltheland12346969420'
                        })
                    ])
                );
            });

            test('Update All with last_login date static [updateAll()]', async ()=>{
                var date = new Date();
                var updatedUsers = await UserAD.updateAll(
                    {
                        last_login: date,
                    });

                expect(updatedUsers).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({
                            last_login: date,
                        })
                    ])
                );
            });

        });
        describe('Delete', () => {
            test('Delete user1 [.delete()]', async ()=>{
                var id = user1.id;

                await user1.delete();
                var deletedUser = await UserAD.findById(id);

                expect(deletedUser).toBe(null);
                expect(user1.username).toBe(null);
            });

            test('Delete by property static [deleteAllBy()]', async ()=>{
                var deletedUsers = await UserAD.deleteAllBy(
                    {
                        email: 'motherlover@lel.com',
                    });

                expect(deletedUsers[0].email).toBe('motherlover@lel.com');
            });

            test('Delete All static [deleteAll()]', async ()=>{
                await UserAD.deleteAll();
                var users = await UserAD.findAll();

                expect(users.length).toBe(0);
            });
        });

        describe('Encryption', ()=>{

            describe('Create', () => {
                test('Instantiate 5 users', () => {
                    user1 = new UserAD();
                    user2 = new UserAD();
                    user3 = new UserAD();
                    user4 = new UserAD();
                    user5 = new UserAD();
                    expect(user1 != null && user2 != null && user3 != null && user4 != null && user5 != null).toBe(true);
                });

                test('Create user 1 with 4 property with encrypted property & encrypted without lookup hash property with no encrypted profile set [.create()]', async ()=>{
                    user1.username = 'user1';
                    user1.phone = '1231231234';
                    user1.memes = 'awkward penguin';
                    user1.auto_phone = '1231231234';
                    await user1.create();
                    if (await pg.options.crypto.isEncryptionEnabled()) {
                        expect(user1.memes).not.toBe('awkward penguin');
                    } else {
                        expect(user1.memes).toBe('awkward penguin');
                    }

                });

                test('Create user 2 with 3 properties Instantiate with encrypted property and setting encryptedProfile [.create()]', async ()=>{
                    user2 = new UserAD({
                        username: 'user2',
                        password: 'ilikememes',
                        phone: '12312312342'}, process.env.TEST_ALT_KMS_KEY);
                    await user2.create();
                    expect(user2.password).toBe('ilikememes');
                });

                test('Create user 3 with 6 properties static with encrypt field phone, hashed password and set encrypted_profile [create()]', async ()=>{
                    user3 = await UserAD.create(
                        {
                            username: 'user3',
                            password: 'ilovemothers',
                            hashed_password: 'hashmebro',
                            encrypted_profile: process.env.TEST_ALT_KMS_KEY,
                            email: 'motherlover@lel.com',
                            auto_memes: 'memer900',
                            phone: '1231231235'
                        });
                    expect(user3.email).toBe('motherlover@lel.com');
                });

                test('Create user 4 with 5 properties static with encrypt field phone, hashed password and and set encrypted_profile with encryption off [create()]', async ()=>{
                    try {
                        pgOptions.crypto = null;
                        pg = new PGConnecter(pgOptions);
                    } catch (_) {
                    }
                    user4 = await UserAD.create(
                        {
                            username: 'user4',
                            hashed_password: 'hashmebro',
                            encrypted_profile: process.env.TEST_ALT_KMS_KEY,
                            email: 'motherlover@lel.com',
                            phone: '1231231234'
                        });
                    expect(user4).toEqual(expect.objectContaining({
                        hashed_password: 'hashmebro',
                        phone: '1231231234'
                    }));
                    try {
                        pgOptions.crypto = require('@abeai/node-crypto').utils.pgCrypto;
                        pg = new PGConnecter(pgOptions);
                    } catch (_) {
                    }
                });

                test('Create user 5 with 3 properties Instantiate with auto crypt property and auto crypt without hash property [.create()]', async ()=>{

                    user5 = new UserAD({
                        username: 'user5',
                        memes: 'awkward penguin',
                        auto_memes: 'canihazmemesplz',
                        auto_phone: '12312312342'});
                    await user5.create();

                    expect(user5).toEqual(expect.objectContaining({
                        auto_memes: 'canihazmemesplz',
                        auto_phone: '12312312342'
                    }));
                });
            });

            describe('Find', () => {
                test('Find user by id and check hashed_password [.find()]', async ()=>{
                    var fUser = new UserAD();

                    fUser.id = user3.id;

                    await fUser.find();
                    var hp = fUser.hashed_password;

                    fUser.hashed_password = 'hashmebro';

                    var rehashedHP = (await fUser.encrypt('hashed_password')).hashed_password;

                    expect(hp).toBe(rehashedHP);
                });

                test('Find user by id static and check auto decryption [.findById()]', async ()=>{
                    var fUser = await UserAD.findById(user5.id);

                    expect(fUser).toEqual(expect.objectContaining({
                        auto_memes: 'canihazmemesplz',
                        auto_phone: '12312312342'
                    }));
                });

                test('Find all by auto crypted phone static with default profile [findAllBy()]', async ()=>{
                    var fUser = await UserAD.findAllBy(
                        {
                            auto_phone: ['12312312342', 'OR', '1231231234']
                        });

                    expect(fUser).toEqual(
                        expect.arrayContaining([
                            expect.objectContaining({
                                auto_phone: '12312312342'
                            }),
                            expect.objectContaining({
                                auto_phone: '1231231234'
                            })
                        ]));
                });

                test('Find all by auto crypted phone static with set profile [findAllBy()]', async ()=>{
                    var fUser = await UserAD.findAllBy(
                        {
                            phone: ['1231231235', 'OR', '12312312342'],
                            encrypted_profile: process.env.TEST_ALT_KMS_KEY
                        }, 'AND');

                    expect(fUser).toEqual(
                        expect.arrayContaining([
                            expect.objectContaining({
                                username: 'user3'
                            }),
                            expect.objectContaining({
                                auto_memes: 'memer900'
                            })
                        ]));
                });

                test('Find all by multiple properties query static [findAllBy()]', async ()=>{
                    var fUser = await UserAD.findAllBy(
                        {
                            username: ['user2', 'OR', 'user3'],
                            email: null,
                        }, 'AND');

                    expect(fUser[0].username).toBe('user2');
                });

                test('Find all by multiple properties query static array[findAllBy()]', async ()=>{
                    var fUser = await UserAD.findAllBy(
                        [{
                            username: ['user2', 'OR', 'user3']

                        },{
                          email: null
                        }], ['AND', 'AND']);

                    expect(fUser[0].username).toBe('user2');
                });
            });

            describe('Update', () => {
                test('Update user 3 password [.save()]', async ()=>{
                    user3.password = 'password123';
                    user3.save();
                    expect(user3).toEqual(expect.objectContaining({
                        password: 'password123'
                    }));
                });

                test('Update all users that have no passwords static [updateAllBy()]', async ()=>{

                    var updatedUsers = await UserAD.updateAllBy({password: null}, {password: 'bestpasswordinalltheland12346969420'});

                    expect(updatedUsers).toEqual(
                        expect.arrayContaining([
                            expect.objectContaining({
                                password: 'bestpasswordinalltheland12346969420'
                            })
                        ])
                    );
                });

                test('Update All with last_login date static [updateAll()]', async ()=>{
                    var date = new Date();
                    var updatedUsers = await UserAD.updateAll(
                        {
                            last_login: date,
                        });

                    expect(updatedUsers).toEqual(
                        expect.arrayContaining([
                            expect.objectContaining({
                                last_login: date,
                            })
                        ])
                    );
                });
            });

            describe('Redact', () => {
                test('Redact user 1 [redactSensitiveData()]', async ()=>{

                    user1.redactSensitiveData();

                    expect(user1.auto_phone).toBe('[redacted]');
                });

                test('Redact user 2 [redactSensitiveDataSymbol()]', async ()=>{
                    const redactSensitiveDataSymbol = require('../lib/redaction.js').redactSensitiveDataSymbol;

                    user2[redactSensitiveDataSymbol]();

                    expect(user2.phone).toBe('[redacted]');
                });
            });

            describe('Delete', () => {
                test('Delete user1 [.delete()]', async ()=>{
                    var id = user1.id;

                    await user1.delete();
                    var deletedUser = await UserAD.findById(id);

                    expect(deletedUser).toBe(null);
                    expect(user1.username).toBe(null);
                });

                test('Delete by property static [deleteAllBy()]', async ()=>{
                    var deletedUsers = await UserAD.deleteAllBy(
                        {
                            email: 'motherlover@lel.com',
                        });

                    expect(deletedUsers[0].email).toBe('motherlover@lel.com');
                });

                test('Delete user2 [.deleteById()]', async ()=>{
                    var id = user2.id;

                    await UserAD.deleteById(id);
                    var deletedUser = await UserAD.findById(id);

                    expect(deletedUser).toBe(null);
                });

                test('Delete All static [deleteAll()]', async ()=>{
                    await UserAD.deleteAll();
                    var users = await UserAD.findAll();

                    expect(users.length).toBe(0);
                });
            });
        });

    });

    test('Close connection', async ()=>{
        var end = await pg.pool.end();

        expect(end).toBe(undefined);
    });
});
