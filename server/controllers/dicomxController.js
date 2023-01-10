const nodemailer = require("nodemailer");
const pool = require("../database/db-connection");

let allUsers,
  allMeetings,
  firstName,
  lastName,
  emailAddress,
  phoneNumber,
  meetingId,
  oldPassword,
  newPassword,
  profilePicture,
  lastLogin,
  isBusiness,
  sessionEmail;

//find in users
exports.find = (req, res) => {
  //Authenticate user by email
  if (req.session.loginEmail) {
    sessionEmail = req.session.loginEmail;
    //console.log(sessionEmail);
  } else {
    res.redirect("/");
  }

  pool.getConnection((error, connection) => {
    if (error) {
      console.log(`Could not connect to database`);
      res.redirect("/");
    } else {
      console.log(`Connected to database as id ${connection.threadId}`);

      connection.query("SELECT * FROM `tb-all-users`", (error, users) => {
        if (!error) {
          allUsers = users;
        } else {
          console.log(error);
        }
      });

      connection.query(
        "SELECT * FROM `tb-scheduled-meeting`",
        (error, meetings) => {
          if (!error) {
            allMeetings = meetings;
          } else {
            console.log(error);
          }
        }
      );

      connection.query(
        "SELECT * FROM `tb-all-users` WHERE `email-address` LIKE ?",
        [sessionEmail],
        (error, users) => {
          if (!error && users != "") {
            firstName = users[0]["first-name"];
            lastName = users[0]["last-name"];
            emailAddress = users[0]["email-address"];
            phoneNumber = users[0]["phone-number"];
            meetingId = users[0]["meeting-id"];
            lastLogin = users[0]["last-login"];
            isBusiness = users[0]["is-business"];
          } else {
            console.log(error);
            res.redirect("/");
          }
        }
      );

      connection.query(
        "SELECT `frnds-full-name`, `frnds-email-address` FROM `tb-friend-list` WHERE `email-address` LIKE ?",
        [sessionEmail],
        (error, friendList) => {
          //When done with connection, release it
          connection.release();

          if (!error) {
            res.render("index", {
              friendList,
              allUsers,
              allMeetings,
              emailAddress,
              firstName,
              lastName,
              phoneNumber,
              lastLogin,
              layout: "../../views/layouts/home",
            });
          } else {
            console.log(error);
          }
        }
      );
    }
  });
};

//insert new friends
exports.insert = (req, res) => {
  //Get requested body data
  let userData = [];
  var data = req.body["added-friends"];
  pool.getConnection((error, connection) => {
    if (error) {
      console.log(`Could not connect to database`);
    } else {
      console.log(`Connected to database as id ${connection.threadId}`);
    }

    data.split(",").forEach((element) => {
      userData.push(parseInt(element));
    });

    console.log(userData);

    userData.map(function (id) {
      connection.query(
        "SELECT CONCAT(`first-name`, ' ', `last-name`) as `full-name`, `email-address` FROM `tb-all-users` WHERE id = ?",
        [id],
        (error, users) => {
          if (!error) {
            console.log(users);
            //Insert form data into the database
            connection.query(
              "INSERT INTO `tb-friend-list` SET ?",
              {
                "full-name": `${firstName} ${lastName}`,
                "email-address": sessionEmail,
                "frnds-full-name": users[0]["full-name"],
                "frnds-email-address": users[0]["email-address"],
              },
              (error, result) => {
                if (error) {
                  // message.error = `Hello ${firstNameIdv},There was an error registering you, try again later`;
                  console.log("Error adding friend");
                } else {
                  // message.success = `Awesome! ${firstNameIdv}, you've been successfully registered`;
                  console.log("Added friend successfully");
                }
              }
            );
          } else {
            console.log(error);
          }
        }
      );
    });
  });
  res.redirect("/dicom-x");
};

//insert new friends
exports.schedule = (req, res) => {
  //Get requested body data
  const data = req.body;
  console.log(data);

  const fullName = req.body["frnds-fullname-input"];
  const emailAddress = req.body["frnds-email-address-input"];
  const scheduledDate = req.body["frnds-schedule-date-input"];
  const scheduledTime = req.body["frnds-schedule-time-input"];
  const meetingId = req.body["frnds-meeting-id-input"];
  const meetingTitle = req.body["frnds-meeting-title-input"];
  const meetingDescription = req.body["frnds-meeting-description-input"];
  const sendersFullName = `${firstName} ${lastName}`;
  const dateTime = `${scheduledDate} - ${scheduledTime}`;

  const message = `<!DOCTYPE html> <html> <head> <meta charset="utf-8"> <meta name="viewport" content="width=device-width, initial-scale=1"> <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&display=swap" /> <title>Invitation from ${sendersFullName}</title> <style> html, body { font-family: "Roboto", sans-serif; width: 100%; max-width: 100%; height: 100%; max-height: 100%; } p, h3{color: #444;} </style> </head> <body> <div style="width: 50%; margin: auto;"> <div style="padding:20px; width:100%; background-color: #0796A7; padding:5px; position: relative;"> <span> <img src="https://xolanihealth.com/images/logo.png" alt="DICOM X Logo"></span> <span style="float: right;"> <img src="https://xolanihealth.com/images/logo.png" alt="DICOM X Logo"></span> </div><div style="padding: 10px 20px;"> <h3>Hello, ${fullName}</h3> <p>${sendersFullName} from <a href=" http://127.0.0.1:3000/dicom-x">DICOM-X</a> has scheduled a meeting with you. Find below the meeting details. </p><p>Subject: ${meetingTitle}</p><p>Description: ${meetingDescription}</p> <p>Meeting ID: <strong>${meetingId}</strong></p> <p>Date and time: <strong>${dateTime}.</strong></p> <p>Location: <a href=" http://127.0.0.1:3000/dicom-x">http://127.0.0.1:3000/dicom-x</a></p> <p style="margin-top: 30px;"><strong>Thanks, Xolani Health Team</strong></p>
  <p style="text-align: center; margin: 20px;"> <small>Don't have a DICOM-X account? </small><br><br> <a href="http://127.0.0.1:3000/"> <button type="button" style="cursor:pointer; background-color: #0796A7; color:#fff; padding: 20px 40px 20px 40px; border:0px; border-radius: 10px; font-size: medium;">Signup here</button></a> </p><p style="padding-top: 5px; text-align: center; color:#777; border-bottom: 2px solid #0796A7; padding-bottom: 20px;"> If you have any questions or enquiries, kindly reply to this mail or send an email to hello@xolanihealth.com<br> <small>Copyright © Xolani Health Limited. All rights reserved.</small></p> </div> </div> </body> </html>`;

  //email message options
  const mailOptions = {
    from: "xolanihealth@gmail.com",
    to: emailAddress,
    subject: `Scheduled meeting from ${sendersFullName}`,
    html: message,
  };

  //email transport configuration
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "xolanihealth@gmail.com",
      pass: "kzigldwrblnulxkg",
    },
  });

  // send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Email not sent");
    } else {
      console.log("Email sent successfully! to " + emailAddress);

      pool.getConnection((error, connection) => {
        if (error) {
          console.log(`Could not connect to database`);
        } else {
          //Insert meeting details into the database
          connection.query(
            "INSERT INTO `tb-scheduled-meeting` SET ?",
            {
              host: sendersFullName,
              "guest-name": fullName,
              "guest-email": emailAddress,
              "meetind-id": meetingId,
              description: meetingDescription,
              title: meetingTitle,
              "date-time": dateTime,
            },
            (error, result) => {
              if (error) {
                console.log("Error saving meeting details");
              } else {
                // message.success = `Awesome! ${firstNameIdv}, you've been successfully registered`;
                console.log("Meeting details saved successfully");
              }
            }
          );
        }
      });
    }
  });

  res.redirect("/dicom-x");
};

// update user profile
exports.updateProfile = (req, res) => {
  firstName = req.body["pr-first-name-input"];
  lastName = req.body["pr-last-name-input"];
  emailAddress = req.body["pr-email-address-input"];
  phoneNumber = req.body["pr-phone-number-input"];
  profilePicture = req.body["profile-picture-input"];
  oldPassword = req.body["pr-old-password-input"];
  newPassword = req.body["pr-new-password-input"];
  console.log(req.body);

  pool.getConnection((error, connection) => {
    if (error) {
      console.log(`Could not connect to database`);
    } else {
      console.log(`Connected to database as id ${connection.threadId}`);
      //Insert form data into the database
      console.log(
        firstName,
        lastName,
        phoneNumber,
        emailAddress,
        profilePicture
      );
      connection.query(
        "UPDATE `tb-all-users` SET `first-name` = ?, `last-name` = ?, `phone-number` = ?, `email-address` = ?, `profile-picture` = ? WHERE `tb-all-users`.`email-address` = '" +
          emailAddress +
          "'",
        [firstName, lastName, phoneNumber, emailAddress, profilePicture],
        (error, result) => {
          if (error) {
            // message.error = `Hello ${firstNameIdv},There was an error registering you, try again later`;
            console.log(error + "Error updating profile");
          } else {
            // message.success = `Awesome! ${firstNameIdv}, you've been successfully registered`;
            console.log("Profile updated successfully");
            res.redirect("/dicom-x");
          }
        }
      );
    }
  });
};

//Log user out
exports.logout = (req, res) => {
  if (req.session.loginEmail) {
    req.session.destroy();
    res.redirect("/");
  }
};
