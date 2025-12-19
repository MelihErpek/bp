const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const Account = require("./Models/Account.js");

const mongoose = require("mongoose");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");

const app = express();
const port = 5000;
app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
    bodyParser.urlencoded({
        limit: "50mb",
        extended: true,
        parameterLimit: 100000000,
    })
);

const url =
    "mongodb+srv://melihnode:meliherpek1@cluster0.g1oel.mongodb.net/BrandPattern?authSource=admin&replicaSet=atlas-77ie5j-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true";

mongoose.connect(
    url,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
    },
    (err) => {
        if (err) {
            throw err;
        }
        console.log("Mongoose ile bağlantı kuruldu.");
    }
);

app.get("/", (req, res) => {
    res.json("Brand Pattern");
});






app.get("/addanaccount", async (req, res) => {

    const email = "zorluhan.zorlu@umww.com";
    const password = "zorluhanzorlu";

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    await Account.create({
        email,
        password: passwordHash,
    });

    return res.status(201).json({ ok: true });

});

app.post("/Login", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(400);
        return res.json({ hata: "All blanks must be filled." });
    }
    const user = await Account.findOne({ username });
    if (!user) {
        res.status(400);
        return res.json({ hata: "No account found with this username. Please check your username." });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        res.status(400);
        return res.json({ hata: "Incorrect password. Please try again." });
    }
    const token = jwt.sign({ id: user._id }, "melih");

    res.json({
        token,
        user,
    });
});




app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
