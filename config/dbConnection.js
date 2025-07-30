// For connecting to the MongoDB database

const mongoose = require("mongoose"); // For object model design schema we use in our database

const connectDb = async () => {
    try {
        const connect = await mongoose.connect(process.env.CONNECTION_STRING);
        console.log(
            "Database connected:", 
            connect.connection.host, 
            connect.connection.name
        );
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
};

module.exports = connectDb;