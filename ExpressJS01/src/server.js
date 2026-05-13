require("dotenv").config();

const express = require("express");

const mongoose = require("mongoose");

const cors = require("cors");

const apiRoutes =
require("./routes/api");

const app = express();

// cors
app.use(cors());

// middleware
app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);

// connect mongodb
mongoose.connect(
    process.env.MONGO_DB_URL
)
.then(() => {

    console.log(
        "MongoDB connected"
    );

})
.catch((error) => {

    console.log(error);
});

// routes
app.use("/api", apiRoutes);

// port
const PORT =
process.env.PORT || 8080;

// run server
app.listen(PORT, () => {

    console.log(
        `Server running at http://localhost:${PORT}`
    );
});