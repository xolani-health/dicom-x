const baseUrl =
  window.ENVIRONMENT === "development"
    ? "http://localhost:4000/"
    : "https://tools.cornerstonejs.org/examples/";

function toggleNavChildren(id) {
  document.querySelectorAll(".nav-child-container").forEach((child) => {
    if (!child.classList.contains("custom-hidden") && child.id !== id) {
      child.classList.add("custom-hidden");
    }
  });

  document.querySelectorAll(".dx-cornerstone-btn").forEach((child) => {
    console.log(child);
    if (child.classList.contains("active") && child.id !== id) {
      child.classList.removeClass("active");
    }
  });
  const elem = document.getElementById(id);
  elem.classList.toggle("custom-hidden");
  elem.classList.toggle("active");
}

function toggleActiveBtn(id) {
  document.querySelectorAll(".dx-cornerstone-btn").forEach((child) => {
    console.log(child);
    if (child.classList.contains("active") && child.id !== id) {
      child.classList.removeClass("active");
    }
  });

  const elem = document.getElementById(id);
  elem.classList.toggle("active");
}

const navbarSchema = [
  {
    name: "Magnify",
    title: "Magnify",
    icon: "loupe",
    children: [],
  },

  { name: "Zoom", title: "Zoom", icon: "zoom_in", children: [] },

  { name: "EllipticalRoi", title: "Ellipse", icon: "all_out", children: [] },

  { name: "TextMarker", title: "Text", icon: "edit_note", children: [] },

  {
    name: "Rotate",
    title: "Rotate",
    icon: "rotate_90_degrees_cw",
    children: [],
  },

  { name: "Pan", title: "Pan", icon: "open_with", children: [] },

  {
    name: "",
    title: "Angle",
    icon: "square_foot",
    children: [
      { name: "Angle", title: "Regular", icon: "chevron_left" },
      { name: "CobbAngle", title: "Cobb", icon: "ssid_chart" },
    ],
  },

  {
    name: "",
    title: "Freehand",
    icon: "polyline",
    children: [
      { name: "FreehandRoi", title: "Regular", icon: "gesture" },
      {
        name: "EllipticalRoi",
        title: "Elliptical ROI",
        icon: "check_box_outline_blank",
      },
      {
        name: "RectangleRoi",
        title: "Rectangular ROI",
        icon: "radio_button_unchecked",
      },
    ],
  },

  {
    name: "",
    title: "Length",
    icon: "settings_ethernet",
    children: [
      {
        name: "ArrowAnnotate",
        title: "Arrow Anotate",
        icon: "arrow_right_alt ",
      },
      { name: "Length", title: "Length", icon: "straighten" },
      {
        name: "Bidirectional",
        title: "Bidirectional",
        icon: "grid_goldenratio",
      },
    ],
  },

  {
    name: "",
    title: "Probe",
    icon: "radio_button_checked",
    children: [
      { name: "Probe", title: "Regular", icon: "adjust" },
      { name: "DragProbe", title: "Drag", icon: "adjust" },
    ],
  },

  {
    name: "",
    title: "WWWC",
    icon: "invert_colors",
    children: [
      { name: "Wwwc", title: "WWWC", icon: "invert_colors" },
      { name: "WwwcRegion", title: "Region", icon: "check_box_outline_blank" },
    ],
  },

  {
    name: "",
    title: "Scissors",
    icon: "highlight_alt",
    children: [
      { name: "FreehandScissors", title: "Freehand", icon: "content_cut" },
      { name: "CircleScissors", title: "Circle", icon: "join_full" },
      { name: "RectangleScissors", title: "Rectangle", icon: "rectangle" },
    ],
  },

  {
    name: "Reset",
    title: "Reset",
    icon: "restart_alt",
    children: [],
  },

  // {
  //   name: "",
  //   title: "Hide/Show Mask",
  //   icon: "visibility",
  //   children: [],
  // },

  // {
  //   name: "",
  //   title: "Fullscreen",
  //   icon: "fullscreen",
  //   children: [],
  // },

  // {
  //   name: "",
  //   title: "Help",
  //   icon: "help_outline",
  //   children: [],
  // },

  // {
  //   name: "",
  //   title: "User",
  //   icon: "account_circle",
  //   children: [
  //     { name: "", title: "Profile", icon: "account_circle" },
  //     { name: "", title: "Logout", icon: "logout" },
  //   ],
  // },
];

const headerElem = document.querySelector(".header-nav");
navbarSchema.forEach((navItem, index) => {
  let navChildItems = ``;
  navItem.children.forEach((child) => {
    navChildItems += `<span class="nav-child-item d-flex" onclick="addCsTool('${child.name}')">
      <span class="material-icons">${child.icon}</span>
      <span class="ms-2 nav-child-item-text" style="font-size: 0.8em;">${child.title}</span>
    </span>`;
  });

  let parsedNavItem = `
  
  <div class="d-flex flex-column position-relative nav-item py-2 px-0 text-white ${
    navChildItems.length ? "has-child" : ""
  }" id="nav-item-container-${index}" data-index=${index} style="z-index:10" onclick="addCsTool('${
    navItem.name
  }')">
      <span class="dx-cornerstone-btn d-flex cursor justify-content-start align-items-center p-2" id="nav-item-${index}">
        <span class="material-icons">${navItem.icon}</span>
        ${
          navChildItems.length
            ? `<span class="material-icons p-0 m-0">arrow_drop_down</span>`
            : ""
        }
      </span>
      
      ${
        navChildItems.length
          ? `
          <span class="nav-child-container custom-hidden d-flex flex-column text-nowrap" id="nav-child-${index}">
            ${navChildItems}
          </span>`
          : ""
      }
  </div>

  `;

  headerElem.innerHTML += parsedNavItem;
});

const navItems = document.querySelectorAll(".nav-item");

navItems.forEach((navItem) => {
  const childIdx = navItem.dataset.index;
  navItem.addEventListener("click", () => {
    if (navItem.classList.contains("has-child")) {
      toggleNavChildren("nav-child-" + childIdx);
    } else {
      toggleActiveBtn("nav-item-" + childIdx);
    }
  });
});

_initCornerstone();
const element = document.getElementById("cornerstone-element");

cornerstoneTools.init({
  showSVGCursors: true,
});

cornerstoneTools.toolColors.setActiveColor("rgb(252, 236, 3)");
cornerstone.enable(element);
// const imageIds = [
//   `wadouri:${baseUrl}1.dcm`,
//   `wadouri:${baseUrl}2.dcm`,
//   `wadouri:${baseUrl}assets/dicom/exotic/1.dcm`,
// ];

document.getElementById("selectFile").addEventListener("change", function (e) {
  // Add the file to the cornerstoneFileImageLoader and get unique number for that file
  const file = e.target.files[0];
  const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(file);
  dumpFile(file);
  cornerstone.loadImage(imageId).then(function (image) {
    cornerstone.displayImage(element, image);
    document.getElementById("image-data").classList.remove("d-none");
    document.getElementById("image-data2").classList.remove("d-none");
    document.getElementById("meta-data").classList.remove("d-none");
  });

  document.getElementById("output-mask-wrapper").classList.add("d-none"); // Clear Output Canvas
  document.getElementById("toggle-mask").classList.add("d-none"); // Display button for hiding and showing mask
  $(".select-model-btn").removeAttr("disabled");
});

function loadCanvasImage() {
  var element = document.getElementById("cornerstone-element"); // global variable
  var getCanvas; // global variable
  console.log("About to convert image");
  html2canvas(element, {
    onrendered: function (canvas) {
      getCanvas = canvas;
      var imageData = getCanvas.toDataURL("image/png");

      const ouputImageElement = document.querySelector("#input_image");
      ouputImageElement.src = imageData;
    },
  });
}

///////////////////// Drag and drop function Start ///////////////////////////
function handleFileSelect(evt) {
  evt.stopPropagation();
  evt.preventDefault();

  // Get the FileList object that contains the list of files that were dropped
  const files = evt.dataTransfer.files;

  // this UI is only built for a single file so just dump the first one
  var file = files[0];
  const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(file);
  dumpFile(file);
  cornerstone.loadImage(imageId).then(function (image) {
    cornerstone.displayImage(element, image);
    document.getElementById("image-data").classList.remove("d-none");
    document.getElementById("image-data2").classList.remove("d-none");
    document.getElementById("meta-data").classList.remove("d-none");
  });

  document.getElementById("output-mask-wrapper").classList.add("d-none"); // Clear Output Canvas
  document.getElementById("toggle-mask").classList.add("d-none"); // Display button for hiding and showing mask
  $(".select-model-btn").removeAttr("disabled");
}

function handleDragOver(evt) {
  evt.stopPropagation();
  evt.preventDefault();
  evt.dataTransfer.dropEffect = "copy";
  document
    .getElementById("cornerstone-element")
    .classList.add("drag-drop-active");
}

function handleDragLeave(evt) {
  evt.stopPropagation();
  evt.preventDefault();
  document
    .getElementById("cornerstone-element")
    .classList.remove("drag-drop-active");
}
///////////////////// Drag and drop function End ///////////////////////////

// Setup the Drag N' Drop listeners.
const dropZone = document.getElementById("cornerstone-element");
dropZone.addEventListener("dragover", handleDragOver, false);
dropZone.addEventListener("dragleave", handleDragLeave, false);
dropZone.addEventListener("drop", handleFileSelect, false);

function addCsTool(toolName) {
  console.log(`Clicked ${toolName}`);
  // Add the tool
  const apiTool = cornerstoneTools[`${toolName}Tool`];
  cornerstoneTools.addTool(apiTool);
  cornerstoneTools.setToolActive(toolName, { mouseButtonMask: 1 });
}

function addTextTool(toolName) {
  const TextMarkerTool = cornerstoneTools.TextMarkerTool;

  // set up the markers configuration
  const configuration = {
    markers: ["F5", "F4", "F3", "F2", "F1"],
    current: "F5",
    ascending: true,
    loop: true,
  };

  cornerstoneTools.addTool(TextMarkerTool, { configuration });
  cornerstoneTools.setToolActive("TextMarker", { mouseButtonMask: 1 });
}

function _initCornerstone() {
  // Externals
  cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
  cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
  cornerstoneTools.external.cornerstoneMath = cornerstoneMath;
  cornerstoneTools.external.cornerstone = cornerstone;
  cornerstoneTools.external.Hammer = Hammer;

  // Image Loader
  const config = {
    webWorkerPath: `${baseUrl}assets/image-loader/cornerstoneWADOImageLoaderWebWorker.js`,
    taskConfiguration: {
      decodeTask: {
        codecsPath: `${baseUrl}assets/image-loader/cornerstoneWADOImageLoaderCodecs.js`,
      },
    },
  };
  cornerstoneWADOImageLoader.webWorkerManager.initialize(config);
}

///////// Fullscreen display script //////////
var elem = document.documentElement;
function openFullscreen() {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) {
    /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    /* IE11 */
    elem.msRequestFullscreen();
  }
}

///////// Copy text script Start//////////
function copyText(copied, elementId) {
  const text = document.getElementById(copied);
  text.select();
  text.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(text.value);

  const button = document.getElementById(elementId);
  button.innerHTML = "task_alt";
  setTimeout(() => {
    button.innerHTML = "content_copy";
  }, 3000);
}

///////// Copy text script End //////////

///////// Countdown script Start//////////
let sMin = 5;
let time = sMin * 60;
function update() {
  let min = Math.floor(time / 60);
  let sec = time % 60;
  sec = sec < 10 ? "0" + sec : sec;

  // display the countdown timer in time format using the minutes and seconds variables
  document.getElementById("countDwn").innerHTML = min + ":" + sec;
  time--;

  // clear the interval if the minutes and seconds are both set to 0

  if (min == 0 && sec == 0) {
    clearInterval(interval);
    stopShare();
  } else {
    interval;
  }
}
///////// Countdown script End //////////

///////// toggle show show/hide script Start//////////
function toggleHide(element1, element2, args = "") {
  var element1 = document.getElementById(element1);
  var element2 = document.getElementById(element2);

  if (element1.style.display === "none") {
    element1.style.display = "block";
    element2.style.display = "none";
    if (args != "") {
      var element3 = document.getElementById(args);
      if (element3.style.display === "none") {
        element3.style.display = "block";
      } else {
        element3.style.display = "none";
      }
    }
  } else {
    element1.style.display = "none";
    element2.style.display = "block";
    if (args != "") {
      var element3 = document.getElementById(args);
      if (element3.style.display === "none") {
        element3.style.display = "block";
      } else {
        element3.style.display = "none";
      }
    }
  }
}

/////// toggle show/hide mask //////////

$("#toggle-mask").click(function () {
  $("#output-mask-wrapper").toggleClass("d-none");
});

function singletoggleHide(firstElement, secondElement) {
  var element1 = document.querySelector(`.${firstElement}`);
  var element2 = document.querySelector(`.${secondElement}`);

  if (element1.style.display === "none") {
    element1.style.display = "block";
    element2.style.display = "none";
    if (firstElement == "icn-mic_none") {
      //muteAudio();
    } else {
      //muteVideo();
    }
  } else {
    element1.style.display = "none";
    element2.style.display = "block";
    if (firstElement == "icn-mic_none") {
      //muteAudio();
    } else {
      //muteVideo();
    }
  }
}

function toggle(element) {
  var elem = document.getElementById(element);
  if (elem.style.display === "none") {
    elem.style.display = "block";
  } else {
    elem.style.display = "none";
  }
}

function toggleMeetingBtn(element) {
  var elem = document.getElementById(element);
  if (elem.classList.toString().includes("fade-me-out")) {
    elem.classList.remove("fade-me-out");
    elem.classList.add("fade-me-in");
  } else {
    elem.classList.remove("fade-me-in");
    elem.classList.add("fade-me-out");
  }
}

function toggleMetaData(element) {
  var element = document.getElementById(element);
  if (element.classList.toString().includes("d-none")) {
    element.classList.add("fade-me-in");
    element.classList.remove("fade-me-out");
    element.classList.remove("d-none");
  } else {
    element.classList.add("fade-me-out");
    element.classList.remove("fade-me-in");
    element.classList.add("d-none");
  }

  // $(`#${element}`).animate({
  //   height: "toggle",
  // });

  if ($(`#eye-off`).hasClass("d-none")) {
    $(`#eye-off`).removeClass("d-none");
    $(`#eye-on`).addClass("d-none");
  } else {
    $(`#eye-off`).addClass("d-none");
    $(`#eye-on`).removeClass("d-none");
  }
}

function showCounter(element) {
  var elem = document.querySelector(`.${element}`);
  if (elem.classList.toString().includes("fade-me-in")) {
    elem.classList.remove("fade-me-in");
    elem.classList.add("fade-me-out");
  }
}

const animate = (divClass, animation) => {
  const divClassList = document.querySelector(divClass).classList.toString();
  const divElement = document.querySelector(divClass);
  if (
    divClassList.includes(animation) &&
    divClassList.includes("animate__animated")
  ) {
    divElement.classList.remove(animation);
    divElement.classList.remove("animate__animated");
  } else {
    divElement.classList.add(animation);
    divElement.classList.add("animate__animated");
  }
};

//Generate unique meeting ID
function create_UUID() {
  var dt = new Date().getTime();
  var uuid = "xxxx-4xxx-yxxx".replace(/[xy]/g, function (c) {
    var r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid;
}

$(function () {
  $(document).on("click", ".join-connect-meeting-btn", function () {
    var meetingId = $("#join-meeting-id-input").val().replace(/-/g, "");
    var userId = $("#join-fullname-input").val();
    //var fullMeetingUrl = `${window.location}?meeting-id=${meetingId}`;

    if (userId.length == "") {
      $(".join-fullname-label").text("What's your name?");
      animate(".join-fullname-label", "animate__headShake");
      $("#join-fullname-input").focus();
      return false;
    } else if (userId.length < 3) {
      $(".join-fullname-label").text(
        "Your name should be more than 3 characters"
      );
      $("#join-fullname-input").focus();
      animate(".join-fullname-label", "animate__headShake");
      return false;
    } else if (meetingId.length == "") {
      $(".join-meeting-id-label").text("What's your meeting ID?");
      $("#join-meeting-id-input").focus();
      animate(".join-meeting-id-label", "animate__headShake");
      return false;
    } else if (meetingId.length != 12) {
      $(".join-meeting-id-label").text(
        'Your meeting ID should be 12 characters excluding this symbol "-" '
      );
      $("#join-meeting-id-input").focus();
      animate(".join-meeting-id-label", "animate__headShake");
      return false;
    } else {
      const hostId = {
        host: false,
        displayName: userId,
      };
      $("#join-meeting-modal").modal("hide");
      //myApp._init(hostId, meetingId);
      myApp._init(userId, meetingId);
    }
  });

  let userInput;

  $(document).on("click", "#start-meeting-btn", function () {
    //fullMeetingUrl = `${window.location}?meeting-id=${generatedId}`;
    const newId = create_UUID();
    document.querySelector("#start-meeting-id-input").value = newId;
    document.querySelector("#meeting-details-id").value = newId;
  });

  $(document).on("click", ".start-connect-meeting-btn", function () {
    //Get meeting ID
    meetingId = $("#start-meeting-id-input").val().replace(/-/g, "");
    //Get user full name
    userInput = $("#start-fullname-input").val();

    if (userInput.length == "") {
      $(".start-fullname-label").text("What's your name?");
      $("#start-fullname-input").focus();
      animate(".start-fullname-label", "animate__headShake");
      return false;
    } else if (userInput.length < 3) {
      $(".start-fullname-label").text(
        "Your name should be more than 3 characters"
      );
      $("#start-fullname-input").focus();
      animate(".start-fullname-label", "animate__headShake");
      return false;
    } else {
      const hostId = {
        host: true,
        displayName: userInput,
      };
      $("#start-meeting-modal").modal("hide");
      //myApp._init(hostId, meetingId);
      myApp._init(userInput, meetingId);
    }
  });
});

$("#toggle-bottom-navigation").click(function () {
  $(".bottom-navigation").toggleClass("hidden");
  $(".toggle-bottom-btn").toggleClass("mt-n5");
  $(".chat-box-wrapper").toggleClass("d-none");
});

$(".enable-fullsreen").on("click", function () {
  $(".video-wrapper").toggleClass("full-video-wrapper");
  $(".video-div").toggleClass("custom-video-size");
});

$("#toggle-chat-wrapper").on("click", function () {
  $(".chat-box-wrapper").toggleClass("show-box");
});

$(".leave-meeting-modal-btn").click(function () {
  $("#join-meeting-btn").removeClass("fade-me-out").addClass("fade-me-in");
  $("#start-meeting-btn").removeClass("fade-me-out").addClass("fade-me-in");
  $("#start-meeting-btn").removeClass("d-none");
  $("#join-meeting-btn").removeClass("d-none");
  $(".leave-meeting-btn").removeClass("fade-me-in").addClass("fade-me-out");
  $(".leave-meeting-btn").addClass("d-none");
  $("#leave-meeting-modal").modal("hide");
  $(".bottom-navigation").addClass("d-none");
  $("#video-call-wrapper").addClass("d-none");
});

const friendList = [];
function addFriend(id) {
  if (friendList.includes(id)) {
    var toPopIndex = friendList.indexOf(id);
    if (toPopIndex > -1) {
      friendList.splice(toPopIndex, 1);
    }
  } else {
    friendList.push(id);
  }
  $("#added-friends").val(friendList);
  if (friendList.length !== 0) {
    $(".add-friend-modal-btn").removeAttr("disabled");
  } else {
    $(".add-friend-modal-btn").attr("disabled", "");
  }
}

$(".leave-meeting-modal-btn").click(function () {
  $("#join-meeting-btn").removeClass("fade-me-out").addClass("fade-me-in");
  $("#start-meeting-btn").removeClass("fade-me-out").addClass("fade-me-in");
  $("#start-meeting-btn").removeClass("d-none");
  $("#join-meeting-btn").removeClass("d-none");
  $(".leave-meeting-btn").removeClass("fade-me-in").addClass("fade-me-out");
  $(".leave-meeting-btn").addClass("d-none");
  $("#leave-meeting-modal").modal("hide");
  $(".bottom-navigation").addClass("d-none");
  $("#video-call-wrapper").addClass("d-none");
});

function showScheduleModal(friendsFullName, friendsEmail) {
  $("#frnds-fullname-input").val(friendsFullName);
  $("#frnds-email-address-input").val(friendsEmail);
  $("#frnds-meeting-id-input").val(create_UUID());
}

$("#profile-picture-input").on("change", function () {
  const file = this.files[0];
  console.log(file.name);
  if (file) {
    let reader = new FileReader();
    reader.onload = function (event) {
      // $('#imgPreview').attr('src', event.target.result);
      //console.log(event.target.result);
      $(".profile-picture").attr("src", event.target.result);
    };
    reader.readAsDataURL(file);
  }
});

//Get default date
var dateControl = document.querySelector('input[type="date"]');
dateControl.value = new Date().toISOString().slice(0, 10);
dateControl.min = new Date().toISOString().slice(0, 10);

// Get time
var timeToFormat = document.querySelector("#time-input-to-format");
var timeNow = new Date();
timeToFormat.min = timeNow.getHours() + ":" + timeNow.getMinutes();
timeToFormat.value = timeNow.getHours() + ":" + timeNow.getMinutes();

var inputElement = document.querySelector("#frnds-schedule-time-input");
inputElement.value = getTIme();

function getTIme() {
  var timeSplit = timeToFormat.value.split(":"),
    hours,
    minutes,
    meridian;

  hours = timeSplit[0];
  minutes = timeSplit[1];
  if (hours > 12) {
    meridian = "PM";
    hours -= 12;
  } else if (hours < 12) {
    meridian = "AM";
    if (hours == 0) {
      hours = 12;
    }
  } else {
    meridian = "PM";
  }
  return hours + ":" + minutes + " " + meridian;
}

function onTimeChange() {
  inputElement.value = getTIme();
}

var greetingElement = document.querySelector(".greeting-now");
greetingElement.innerText = greeting(timeNow.getHours());

//Greetings
function greeting(hours) {
  if (hours >= 0 && hours <= 12) {
    return "Good Morning";
  } else {
    if (hours > 12 && hours <= 17) {
      return "Good Afternoon";
    } else {
      if (hours > 17 && hours <= 20) {
        return "Good Evening";
      } else {
        return "Good Night";
      }
    }
  }
}

// Load AI Models
function predict_emotion() {
  let ouputMaskWrapper = document.querySelector("#output-mask-wrapper");
  let maskLoader = document.querySelector(".mask-loader");
  maskLoader.classList.remove("d-none");
  let step1, step2, input;
  loadCanvasImage();

  setTimeout(() => {
    input = document.getElementById("input_image");
    step1 = tf.browser.fromPixels(input);
    step2 = tf.image.resizeBilinear(step1, [256, 256]);

    let model;
    (async function () {
      // const processedImage = tf.tensor2d(step1);
      model = await tf.loadLayersModel(
        "http://127.0.0.1:3000/models/output/model.json"
      );
      pred = model.predict(tf.expandDims(step2, 0));
      tensor = tf.browser.fromPixels(input);
      console.log("Before Casting");

      console.log("Initial Prediction Output:");
      console.log(pred.dataSync());

      pred = tf.squeeze(pred);
      console.log("Final Prediction Output:");
      console.log(pred.dataSync());

      var canvas = document.getElementById("output-mask");
      var conerstoneCanvas = document.querySelector(".cornerstone-canvas");
      console.log(conerstoneCanvas.clientHeight, conerstoneCanvas.clientWidth);
      canvas.style.width = conerstoneCanvas.clientWidth / 1.4 + "px";
      canvas.style.height = conerstoneCanvas.clientHeight / 1.4 + "px";

      tf.browser.toPixels(pred, canvas).then(() => {
        3;
        // It's not bad practice to clean up and make sure we got everything
        pred.dispose();
        console.log("Make sure we cleaned up", tf.memory().numTensors);
      });

      setTimeout(() => {
        var context = canvas.getContext("2d");
        var imageData = context.getImageData(
          0,
          0,
          conerstoneCanvas.clientWidth / 2,
          conerstoneCanvas.clientHeight / 2
        );
        var preserveColor = function (imageData, color) {
          // Get the pixel data from the source.
          var data = imageData.data;
          // Iterate through all the pixels.
          for (var i = 0; i < data.length; i += 4) {
            // Check if the current pixel should have preserved transparency. This simply compares whether the color we passed in is equivalent to our pixel data.
            var preserve =
              data[i] === color.r &&
              data[i + 1] === color.g &&
              data[i + 2] === color.b &&
              data[i + 3] === color.a;

            // Either preserve the initial transparency or set the transparency to 0.
            data[i + 3] = preserve ? data[i + 3] : 0;
          }
          return imageData;
        };

        // Get the new pixel data and set it to the canvas context.
        var newData = preserveColor(imageData, {
          r: 255,
          g: 255,
          b: 255,
          a: 255,
        });
        //7, 150, 167
        context.putImageData(newData, 0, 0);
        canvas.style.display = "block";
        ouputMaskWrapper.classList.remove("d-none");
        maskLoader.classList.add("d-none");
        document.getElementById("toggle-mask").classList.remove("d-none"); // Display button for hiding and showing mask
      }, 1000);
    })();
  }, 2000);
  // console.log(step2.shape);
  // console.log(step2);
}

// Make element dargable
dragElement(document.getElementById("meta-data"));

function dragElement(elmnt) {
  var pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    /* if present, the header is where you move the DIV from:*/
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    /* otherwise, move the DIV from anywhere inside the DIV:*/
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = elmnt.offsetTop - pos2 + "px";
    elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
  }

  function closeDragElement() {
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

// This function will read the file into memory and then start dumping it
function dumpFile(file) {
  var reader = new FileReader();
  reader.onload = function (file) {
    var arrayBuffer = reader.result;

    // Here we have the file data as an ArrayBuffer.  dicomParser requires as input a
    // Uint8Array so we create that here
    var byteArray = new Uint8Array(arrayBuffer);

    var kb = byteArray.length / 1024;
    var mb = kb / 1024;
    var byteStr = mb > 1 ? mb.toFixed(3) + " MB" : kb.toFixed(0) + " KB";

    // set a short timeout to do the parse so the DOM has time to update itself with the above message
    setTimeout(function () {
      var dataSet;
      // Invoke the paresDicom function and get back a DataSet object with the contents
      try {
        dataSet = dicomParser.parseDicom(byteArray);
        // Here we call dumpDataSet to update the DOM with the contents of the dataSet
        dumpDataSet(dataSet);
      } catch (err) {
        document.getElementById("statusText").innerHTML =
          "Status: Error - " + err + " (file of size " + byteStr + " )";
      }
    }, 30);
  };

  reader.readAsArrayBuffer(file);
}

function dumpDataSet(dataSet) {
  $("p[data-dicom]").each(function (index, value) {
    var attr = $(value).attr("data-dicom");
    var element = dataSet.elements[attr];
    var text = "";
    if (element !== undefined) {
      var str = dataSet.string(attr);
      if (str !== undefined) {
        text = str;
      }
    }
    $(value).text(text);
  });

  // $("span[data-dicomUint]").each(function (index, value) {
  //   var attr = $(value).attr("data-dicomUint");
  //   var element = dataSet.elements[attr];
  //   var text = "";
  //   if (element !== undefined) {
  //     if (element.length === 2) {
  //       text += dataSet.uint16(attr);
  //     } else if (element.length === 4) {
  //       text += dataSet.uint32(attr);
  //     }
  //   }

  //   $(value).text(text);
  // });
}
