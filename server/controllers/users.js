const User = require("../models/User");
const bcrypt = require("bcryptjs");
const passport = require("passport");

module.exports = {
  postRegister: (req, res) => {
    console.log(req.body)
    const { name, email, password, password2 } = req.body;
    let errors = [];

    //Field checks
    if (!name || !email || !password || !password2) {
      errors.push({ msg: "Please fill in all fields" });
    }
    if (password !== password2) {
      errors.push({ msg: "Passwords do not match" });
    }
    if (password.length < 6) {
      errors.push({ msg: "Password should be at least 6 characters" });
    }

    if (errors.length > 0) {
      res.send({ error: errors });
    } else {
      User.findOne({ email: email }).then(user => {
        if (user) {
          errors.push({ msg: "Email is already registered" });
          res.send({ error: errors });
        } else {
          const newUser = new User({
            name,
            email,
            password,
            messages: {}
          });

          bcrypt.genSalt(10, (err, salt) =>
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser
                .save()
                .then(user => {
                  res.send({
                    success:
                      "Successfully registered. Please log in. Redirecting now..."
                  });
                })
                .catch(err => console.log(err));
            })
          );
        }
      });
    }
  },

  login: (req, res, next) => {
    passport.authenticate("local", function(err, user, info) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.json(info);
      }
      req.logIn(user, function(err) {
        if (err) {
          return next(err);
        }
        console.log('user logged in')
        return res.json({
          user: user
        });
      });
    })(req, res, next);
  },
  logout: (req, res) => {
    console.log("logging out");
    req.logOut();
    res.redirect("/users/");
  },
  session: (req, res) => {
    if (req.user) {
      res.send({ user: req.user });
    } else res.send({ Auth: false });
  }
};
