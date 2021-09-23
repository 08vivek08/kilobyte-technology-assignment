const express = require('express');
const app = express();
const env = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');

// routes
const authRoutes = require("./src/routes/auth");
const addressRoutes = require("./src/routes/address");
const itemRoutes = require("./src/routes/item");
const orderRoutes = require("./src/routes/order");


// Enviromnment variable
env.config();

// DB connection
mongoose.set('debug', true);
mongoose.connect(`mongodb+srv://${process.env.MONGO_DB_USER}:${encodeURIComponent(process.env.MONGO_DB_PASSWORD)}@cluster0.dmkfo.mongodb.net/${process.env.MONGO_DB_DATABASE}?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Db Connected");
}).catch((err) => {
    console.log(`Error in DB connection: ${err}`);
});

// Middlewares
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// My routes
app.get('/', (req, res) => {
    return res.status(200).json({ message: 'hello' });
});

app.use('/api', authRoutes);
app.use('/api', addressRoutes);
app.use('/api', itemRoutes);
app.use('/api', orderRoutes);

app.listen(process.env.PORT, '::', () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});