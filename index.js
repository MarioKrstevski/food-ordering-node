import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";

// import Comment from "./models/comment";
// import Order from "./models/order";
// import DailyMenu from "./models/dailyMenu";
import config from "./config.json";

import { users } from "./usersMock";

// and create our instances
const app = express();

// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

app.use(cors({ origin: true, credentials: true }));
const router = express.Router();

// set our port to either a predetermined port number if you have set it up, or 3030

// const API_PORT = process.env.API_PORT || 3000;
const API_PORT = config.port || 3000;
const DB_URI = config.dbUri;
// db config -- We are using mLab set your URI from mLab in secrets.js

// mongoose.connect(getSecret('dbUri'));

mongoose.connect(DB_URI, { useNewUrlParser: true });

var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// now we should configure the API to use bodyParser and look for JSON data in the request body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// login route
app.post("/login", (req, res) => {
  console.log("I have been hit");
  // body parser lets us use the req.body
  const { email, password } = req.body;
  console.log("I have been hit", req.body);

  if (!email) {
    // we should throw an error. we can do this check on the front end

    console.log("Failed at no email");
    return res.json({
      error: "You must provide username"
    });
  }

  if (!password) {
    // we should throw an error. we can do this check on the front end
    console.log("Failed at no password");

    return res.json({
      error: "You must provide password"
    });
  }

  if (email && password) {
    let userArray = users.filter(user => user.name === email);

    if (userArray.length === 0) {
      console.log("Failed at user doesnt exist");

      return res.json({
        error: "User doesn't exist, try another username"
      });
    }

    let ownerData = userArray[0];
    // we should throw an error. we can do this check on the front end

    if (ownerData.password !== password) {
      console.log("Failed at invalid password");

      return res.json({
        error: "Invalid password, try another one"
      });
    }

    console.log("Didnt fail");

    return res.json({
      name: ownerData.name,
      token: ownerData.token
    });
  }
});

router.get("/comments", (req, res) => {
  Comment.find((err, comments) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: comments });
  });
});
app.get("/test", (req, res) => {
    return res.json({
        data: [
            "First item", "Second item"
        ]
    })
});
router.get("/comments", (req, res) => {
  Comment.find((err, comments) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: comments });
  });
});

// get Order if exists for loged in user for today's date ( default )
// router.get("/myorder", (req, res) => {
//   const { userId, dateRequested } = req.body;

//   if (!userId || dateRequested) {
//     return res.json({
//       success: false,
//       error: " You need to provide both fields "
//     });
//   }
//   Order.findOne({ belongsTo: userId, date: dateRequested }, (err, myorder) => {
//     if (err) return res.json({ success: false, error: err });

//     return res.json({ success: true, myorder });
//   });
// });

// Use our router configuration when we call /api
app.use("/api", router);

app.listen(API_PORT, () => console.log(`Listening on port ${API_PORT}`));
