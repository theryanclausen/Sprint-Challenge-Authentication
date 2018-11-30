const axios = require("axios");
const bcrypt = require('bcryptjs')
const { authenticate, generateToken } = require("./middlewares");
const db = require('../database/dbConfig')

module.exports = server => {
  server.post("/api/register", register);
  server.post("/api/login", login);
  server.get("/api/jokes", authenticate, getJokes);
};

const register = async (req, res) => {
  const creds = req.body;
  if (!creds.username || !creds.password) {
    return res.status(400).json({ error: "Username and password required!" });
  }
  const hash = await bcrypt.hash(creds.password, 14);
  creds.password = hash;
  try {
    const id = await db("users").insert(creds);
    return res.status(201).json(id);
  } catch (err) {
    return res.status(500).json({ error: "Server Error" });
  }
};

const login = async (req, res) => {
  // implement user login
  const creds = req.body;
  if (!creds.username || !creds.password) {
    return res.status(400).json({ error: "Username and password required!" });
  }
  try {
    const user = await db("users")
      .where({ username: creds.username })
      .first();
    if (user && bcrypt.compareSync(creds.password, user.password)) {
        const token = generateToken(user)
      return res.status(200).json({ message: "Welcome", token });
    } else {
      return res(401).json({error:"Bad token"});
    }
  } catch (err) {
    return res.status(500).json({ error: "Server Error" });
  }
};

const getJokes = async (req, res) => {
  try {
    const response = await axios.get(
      "https://safe-falls-22549.herokuapp.com/random_ten"
    );

    return res.status(200).json(response.data);
  } catch (err) {
    res.status(500).json({ message: "Error Fetching Jokes", error: err });
  }
};
