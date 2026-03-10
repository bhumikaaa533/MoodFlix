
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

/* ================= DATABASE ================= */

const mongoose=require("mongoose");
mongoose.connect(process.env.MONGO_URI) 
.then(() => {console.log("MongoDB connected");
})
.catch(err => {console.log("MongoDB error",err);
});


/* ================= USER MODEL ================= */

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  watchlist: [String]
});

const User = mongoose.model("User", userSchema);

/* ================= SIGNUP ================= */

app.post("/api/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      watchlist: []
    });

    await newUser.save();

    res.json({ message: "Signup successful" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error during signup" });
  }
});
console.log("Current users after sigup route:", User.find({})); // Debugging line to check users in the database

/* ================= LOGIN ================= */

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { email: user.email },
      "secretkey",
      { expiresIn: "1h" }
    );

    res.json({
      token,
      message: "Login successful",
      name: user.name
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= ADD TO WATCHLIST ================= */

app.post("/api/watchlist", async (req, res) => {
  try {
    const { email, movie } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.watchlist.push(movie);
    await user.save();

    res.json({ message: "Added to watchlist", watchlist: user.watchlist });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= GET WATCHLIST ================= */

app.get("/api/watchlist/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ watchlist: user.watchlist });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});


/*======Server Start=======*/

app.listen(5000,() => {
  console.log("Server running on port 5000");
});


require("dotenv").config()