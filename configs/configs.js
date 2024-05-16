const hashing = {
    saltRounds: process.env.SALT_ROUNDS
};

const mail = {
    service: process.env.MAIL_SERVICE,
    ssl: process.env.MAIL_SSL == 'true',
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
    from: process.env.MAIL_FROM,
};


module.exports = {
    hashing,
    mail
};