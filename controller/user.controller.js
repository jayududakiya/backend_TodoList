const User = require("../model/user.model");
const passport = require("passport");
const bcrypt = require("bcrypt");
const saltRounds = 10;

exports.login = (req, res) => {
  res.render("login.ejs");
};

exports.register = (req, res) => {
  res.render("register.ejs");
};

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email: email, isDeleted: false });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create and save a new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });
    await newUser.save();
    // Alternatively, you can use `User.create(req.body)` if all fields are valid
    // const newUser = await User.create(req.body);
    // if (!newUser) return res.status(400).json({ message: 'Failed to create user' });

    // Automatically log in the new user after registration
    req.login(newUser, (err) => {
      if (err)
        return res
          .status(500)
          .json({ message: "Failed to log in after registration", error: err });
      res.redirect("/"); // Redirect to the home page or dashboard
    });
  } catch (err) {
    res.status(500).json({ message: "Error registering user.", error: err });
  }
};

exports.loginUser = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: info.message });
    req.logIn(user, (err) => {
      if (err) return next(err);
      res.status(200).json({ message: "Logged in successfully." });
    });
  })(req, res, next);
};

exports.logoutUser = (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/api/user/login");
  });
};
