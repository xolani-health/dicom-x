const bcrypt = require("bcryptjs");
const pool = require("../database/db-connection");

//sign in users
exports.signup = (req, res) => {
  res.render("signup");
};

exports.insert = (req, res) => {
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

      if (req.body.idvFormType == "idv-form" && req.body.busFormType != "") {
        console.log("In the individual form");
        message.idvForm = true;
        //Deconstruct data from the signup form
        const {
          firstNameIdv,
          lastNameIdv,
          phoneNumberIdv,
          emailIdv,
          passwordIdv,
          cfmPasswordIdv,
          loginCheckIdv,
        } = req.body;

        //Authentication fro individual users starts here
        if (firstNameIdv == "") {
          message.firstNameIdv = `What's your first name`;
          return res.render("signup", { message, data });
        } else if (firstNameIdv.length < 2) {
          message.firstNameIdv = `Type a valid name`;
          return res.render("signup", { message, data });
        } else if (lastNameIdv == "") {
          message.lastNameIdv = `What's your last name`;
          return res.render("signup", { message, data });
        } else if (lastNameIdv.length < 2) {
          message.lastNameIdv = `Type a valid name`;
          return res.render("signup", { message, data });
        } else if (phoneNumberIdv == "") {
          message.phoneNumberIdv = `What's your phone number`;
          return res.render("signup", { message, data });
        } else if (emailIdv == "") {
          message.emailIdv = `Enter your email address`;
          return res.render("signup", { message, data });
        } else if (passwordIdv.length < 6) {
          message.passwordIdv = `Specify a strong password [6 chars]`;
          return res.render("signup", { message, data });
        } else if (passwordIdv !== cfmPasswordIdv) {
          message.cfmPasswordIdv = `Passwords do not match`;
          return res.render("signup", { message, data });
        } else {
          let userId;
          connection.query(
            "SELECT `email-address` FROM `tb-all-users` WHERE `email-address` = ?",
            [emailIdv],
            (error, result) => {
              if (error) {
                message.error = `Hello ${firstNameIdv}, an error occured in the query`;
              } else {
                if (result.length > 0) {
                  message.emailIdv = `Oops! Email already exist`;
                  res.render("signup", { message, data });
                } else {
                  //Insert form data into the database
                  connection.query(
                    "INSERT INTO `tb-all-users` SET ?",
                    {
                      "first-name": firstNameIdv,
                      "last-name": lastNameIdv,
                      "phone-number": phoneNumberIdv,
                      "email-address": emailIdv,
                      password: passwordIdv,
                      "last-login": currentTime.now,
                      "is-business": 0,
                    },
                    (error, result) => {
                      if (error) {
                        message.error = `Hello ${firstNameIdv},There was an error registering you, try again later`;
                        return res.render("signup", { message, data });
                      } else {
                        connection.query(
                          "SELECT `id` FROM `tb-all-users` WHERE `email-address` = ?",
                          [emailIdv],
                          (error, result) => {
                            if (error) {
                              message.error = `Oops! Try again later [selecting id]`;
                              return res.render("signup", { message, data });
                            } else {
                              userId = result[0].id;
                              connection.query(
                                "INSERT INTO `tb-individual` SET ?",
                                {
                                  "user-id": userId,
                                  "is-active": 1,
                                  "scan-credit": 0,
                                },
                                (error, result) => {
                                  if (error) {
                                    message.error = `Oops! Try again later [inserting into idivdual table]`;
                                    return res.render("signup", {
                                      message,
                                      data,
                                    });
                                  } else {
                                    message.success = `Awesome! ${firstNameIdv}, you've been successfully registered`;
                                    return res.render("signup", {
                                      message,
                                    });
                                  }
                                }
                              );
                            }
                          }
                        );
                      }
                    }
                  );
                }
              }
            }
          );
        }
      } else {
        console.log("In the business form");
        message.busForm = true;
        const {
          firstNameBus,
          lastNameBus,
          phoneNumberBus,
          emailBus,
          institution,
          passwordBus,
          cfmPasswordBus,
          loginCheckBus,
        } = req.body;

        //Authentication fro business users starts here
        if (firstNameBus == "") {
          message.firstNameBus = `What's your first name`;
          return res.render("signup", { message, data });
        } else if (firstNameBus.length < 2) {
          message.firstNameBus = `Type a valid name`;
          return res.render("signup", { message, data });
        } else if (lastNameBus == "") {
          message.lastNameBus = `What's your last name`;
          return res.render("signup", { message, data });
        } else if (lastNameBus.length < 2) {
          message.lastNameBus = `Type a valid name`;
          return res.render("signup", { message, data });
        } else if (phoneNumberBus == "") {
          message.phoneNumberBus = `What's your phone number`;
          return res.render("signup", { message, data });
        } else if (emailBus == "") {
          message.emailBus = `Enter your email address`;
          return res.render("signup", { message, data });
        } else if (institution == "") {
          message.institution = `What's your institution name`;
          return res.render("signup", { message, data });
        } else if (passwordBus.length < 6) {
          message.passwordBus = `Specify a strong password [6 chars]`;
          return res.render("signup", { message, data });
        } else if (passwordBus !== cfmPasswordBus) {
          message.cfmPasswordBus = `Passwords do not match`;
          return res.render("signup", { message, data });
        } else {
          connection.query(
            "SELECT `email-address` FROM `tb-all-users` WHERE `email-address` = ?",
            [emailBus],
            async (error, result) => {
              if (error) {
                message.error = `Hello ${firstNameBus}, an error occured in the query`;
                return res.render("signup", { message });
              } else {
                if (result.length > 0) {
                  message.emailBus = `Oops! Email already exist`;
                  return res.render("signup", { message, data });
                } else {
                  //Insert form data into the database
                  connection.query(
                    "INSERT INTO `tb-business` SET ?",
                    {
                      "first-name": firstNameBus,
                      "last-name": lastNameBus,
                      "phone-number": phoneNumberBus,
                      "email-address": emailBus,
                      password: passwordBus,
                      institution: institution,
                      "last-login": currentTime.now,
                    },
                    (error, result) => {
                      if (error) {
                        message.error = `Hello ${firstNameBus},There was an error registering you, try again later`;
                        return res.render("signup", { message });
                      } else {
                        message.success = `Awesome! ${firstNameBus}, you've been successfully registered`;
                        return res.render("signup", {
                          message,
                        });
                      }
                    }
                  );
                }
              }
            }
          );
        }
      }
    }
  });
};
