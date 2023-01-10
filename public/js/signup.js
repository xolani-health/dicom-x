$(".idv-send-btn").click(function (e) {
  e.preventDefault();
  const firstNameIdv = $("#firstNameIdv").val();
  const lastNameIdv = $("#lastNameIdv").val();
  const phoneNumberIdv = $("#phoneNumberIdv").val();
  const emailIdv = $("#emailIdv").val();
  const passwordIdv = $("#passwordIdv").val();
  const cfmPasswordIdv = $("#cfmPasswordIdv").val();
  const base_url = window.location.origin;
  const error = [];
  const body = {};

  //Authentication fro individual users starts here
  if (firstNameIdv == "" || firstNameIdv.length < 2) {
    $("#firstNameIdv").addClass("error-focus").focus();
    $(".firstname-error-text").text("What's your fisrt name?");
    error[0] = "true";
    return;
  } else {
    $("#firstNameIdv").removeClass("error-focus");
    $(".firstname-error-text").text("");
    error[0] = "false";
    body.firstNameIdv = firstNameIdv;
  }

  if (lastNameIdv == "" || lastNameIdv.length < 2) {
    $("#lastNameIdv").addClass("error-focus").focus();
    $(".lastname-error-text").text("What's your last name?");
    error[1] = "true";
    return;
  } else {
    $("#lastNameIdv").removeClass("error-focus");
    $(".lastname-error-text").text("");
    error[1] = "false";
    body.lastNameIdv = lastNameIdv;
  }

  if (phoneNumberIdv == "") {
    $("#phoneNumberIdv").addClass("error-focus").focus();
    $(".phonenumber-error-text").text("What's your phone number");
    error[2] = "true";
    return;
  } else {
    $("#phoneNumberIdv").removeClass("error-focus");
    $(".phonenumber-error-text").text("");
    error[2] = "false";
    body.phoneNumberIdv = phoneNumberIdv;
  }

  if (emailIdv == "") {
    $("#emailIdv").addClass("error-focus").focus();
    $(".email-error-text").text("Enter your email address");
    error[3] = "true";
    return;
  } else {
    $("#emailIdv").removeClass("error-focus");
    $(".email-error-text").text("");
    error[3] = "false";
    body.emailIdv = emailIdv;
  }

  if (passwordIdv.length < 6) {
    $("#passwordIdv").addClass("error-focus").focus();
    $(".password-error-text").text("Type a strong password [6 chars]");
    error[4] = "true";
    return;
  } else {
    $("#passwordIdv").removeClass("error-focus");
    $(".password-error-text").text("");
    error[4] = "false";
    body.passwordIdv = passwordIdv;
  }

  if (passwordIdv !== cfmPasswordIdv) {
    $("#cfmPasswordIdv").addClass("error-focus").focus();
    $(".cfmpassword-error-text").text("Passwords do not match");
    error[5] = "true";
    return;
  } else {
    $("#cfmPasswordIdv").removeClass("error-focus");
    $(".cfmpassword-error-text").text("");
    error[5] = "false";
  }

  body.formType = "idv-form";

  if (error.includes("false")) {
    $.ajax({
      url: base_url + "/signup",
      type: "POST",
      data: body,
      success: function (response) {
        console.log("Success!");
      },
      error: function () {
        console.log("There was an error sending the file");
      },
    });
  }
});
