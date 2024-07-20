const jwt = require('jsonwebtoken');

class Jwt {
    static sign(key){
        return jwt.sign(
            {...key},
            process.env.APP_SECRET,
            {
                expiresIn: '1800s',
                // audience: 'https://my-site.com',
                // algorithm: ["HS256"]
            }
        );
    }

    static verify(token) {
        return jwt.verify(token, process.env.APP_SECRET, (error, user) => {
            if (error){
                return null;
            }

            return user;
        });
    }
}

module.exports = Jwt;