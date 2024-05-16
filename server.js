const express = require("express");
const { default: mongoose } = require("mongoose");
const cors  = require('cors');
const helmet = require('helmet');
const path = require('path');
const bodyParser = require('body-parser');
const errorHandler = require('./controllers/errorController');

const authRoutes = require('./routes/auth');
const { failure } = require("./helpers/response");
const { StatusCodes } = require("http-status-codes");

class Server {
    constructor(){
        this.app = express();
        this.middleware();
        this.routes();
        this.errorHandler();
    }

    middleware(){
        this.app.use(bodyParser.json());
        this.app.use(express.static(path.join(__dirname, 'public')));
        this.app.use(helmet());
        this.app.use(cors());
    }

    routes(){
        this.app.use('/api', authRoutes);
        
        this.app.use('*', (req, res) => {
            return failure(res, null, 'Not Found', StatusCodes.NOT_FOUND);
        });
    }
    errorHandler(){
        this.app.use(errorHandler.handler);
    }

    start(){
        mongoose.connect(process.env.DATABASE_CONNECTION_STRING)
            .then(() => {
                this.app.listen(process.env.APP_PORT, () => {
                    console.log(`Server started on port`);
                });
            })
            .catch(err => {
                console.log(err);
            })
    }
}


module.exports = Server;