const session = require("express-session");
const bcrypt = require("bcryptjs");
const pool = require("../database/db-connection");

//sign in users
exports.signin = (req, res) => {
  res.render("signin");
};

exports.auth = (req, res) => {
  //Get requested body data
  const data = req.body;
  //Variable storing messages to display to users
  const message = {};

  //Get current time function
  const currentTime = (() => {
    var time = new Date();
    var localTime = time.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
    return {
      now: localTime,
    };
  })();

  pool.getConnection((error, connection) => {
    if (error) {
      console.log(`Could not connect to database`);
    } else {
      console.log(`Connected to database as id ${connection.threadId}`);
      const { loginEmail, loginPassword } = req.body;
      if (loginEmail == "") {
        message.loginEmail = `Enter your email address`;
        return res.render("signin", { message, data });
      } else if (loginPassword.length < 6) {
        message.loginPassword = `Specify a strong password [6 chars]`;
        return res.render("signin", { message, data });
      } else {
        connection.query(
          "SELECT `email-address`, `password` FROM `tb-all-users` WHERE `email-address`= ? AND `password` = ?",
          [loginEmail, loginPassword],
          (error, result) => {
            if (error) {
              message.error = `Sorry, an error occured in the query`;
              res.render("signin", { message, data });
            } else {
              if (result.length > 0) {
                connection.query(
                  "UPDATE `tb-all-users` SET `last-login` = '" +
                    currentTime.now +
                    "' WHERE `tb-all-users`.`email-address` = ?",
                  [loginEmail],
                  (error, result) => {
                    if (error) {
                      message.error = `Sorry, an error occured in updating user last login`;
                    }
                  }
                );
                req.session.loginEmail = loginEmail;
                res.redirect("/dicom-x");
              } else {
                message.error = `Sorry, wrong username or password`;
                res.render("signin", { message, data });
              }
            }
          }
        );
      }
    }
  });
};
