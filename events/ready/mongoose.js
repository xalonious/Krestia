const mongoose = require("mongoose")
require("dotenv").config()
module.exports = (client) => {
    mongoose.connect(process.env.MONGOURL, {
        useUnifiedTopology : true,
        useNewUrlParser : true,
    }).then(console.log('✅  | Connected to DB'))
}