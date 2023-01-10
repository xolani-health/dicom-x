const baseUrl =
  window.ENVIRONMENT === "development"
    ? "http://localhost:4000/"
    : "https://tools.cornerstonejs.org/examples/";

//'https://xolanihealth.com/dcm/'
//'https://tools.cornerstonejs.org/examples/';

_initCornerstone();
const element = document.getElementById("cornerstone-element");

cornerstoneTools.init({
  showSVGCursors: true,
});

cornerstoneTools.toolColors.setActiveColor("rgb(252, 236, 3)");
cornerstone.enable(element);
const imageIds = [
  `wadouri:${baseUrl}1.dcm`,
  `wadouri:${baseUrl}2.dcm`,
  `wadouri:${baseUrl}assets/dicom/exotic/1.dcm`,
];

document.getElementById("selectFile").addEventListener("change", function (e) {
  // Add the file to the cornerstoneFileImageLoader and get unique number for that file
  const file = e.target.files[0];
  const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(file);

  cornerstone.loadImage(imageId).then(function (image) {
    cornerstone.displayImage(element, image);
    document.getElementById("image-data").classList.remove("d-none");
    document.getElementById("image-data2").classList.remove("d-none");
    document.getElementById("meta-data").classList.remove("d-none");
  });
});

//Drag and drop function

function handleFileSelect(evt) {
  evt.stopPropagation();
  evt.preventDefault();

  // Get the FileList object that contains the list of files that were dropped
  const files = evt.dataTransfer.files;

  // this UI is only built for a single file so just dump the first one
  file = files[0];
  const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(file);
  cornerstone.loadImage(imageId).then(function (image) {
    cornerstone.displayImage(element, image);
    document.getElementById("image-data").classList.remove("d-none");
    document.getElementById("image-data2").classList.remove("d-none");
    document.getElementById("meta-data").classList.remove("d-none");
  });
}

function handleDragOver(evt) {
  evt.stopPropagation();
  evt.preventDefault();
  evt.dataTransfer.dropEffect = "copy";
  document.getElementById("cornerstone-element").classList.add("active-drop");
}

function handleDragLeave(evt) {
  evt.stopPropagation();
  evt.preventDefault();
  document
    .getElementById("cornerstone-element")
    .classList.remove("active-drop");
}

// Setup the dnd listeners.
const dropZone = document.getElementById("cornerstone-element");
dropZone.addEventListener("dragover", handleDragOver, false);
dropZone.addEventListener("dragleave", handleDragLeave, false);
dropZone.addEventListener("drop", handleFileSelect, false);

// cornerstone.loadImage(imageIds[2]).then(function(image) {
//   //alert(imageIds[2]);
//   cornerstone.displayImage(element, image);
// });

function addCsTool(toolName) {
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
function copyText() {
  const text = document.getElementById("code");
  text.select();
  //alert(text);
  text.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(text.value);

  const button = document.getElementById("copyBtn");
  button.innerHTML = "Copied";
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
      element3.style.display = "none";
    }
  } else {
    element1.style.display = "none";
    element2.style.display = "block";
    if (args != "") {
      var element3 = document.getElementById(args);
      element3.style.display = "block";
    }
  }
}

function singletoggleHide(firstElement, secondElement) {
  var element1 = document.getElementById(firstElement);
  var element2 = document.getElementById(secondElement);

  if (element1.style.display === "none") {
    element1.style.display = "block";
    element2.style.display = "none";
    if (firstElement == "icn-mic_none") {
      muteAudio();
    } else {
      muteVideo();
    }
  } else {
    element1.style.display = "none";
    element2.style.display = "block";
    if (firstElement == "icn-mic_none") {
      muteAudio();
    } else {
      muteVideo();
    }
  }
}

function toggle(element) {
  var elemValue = document.getElementById(element);
  if (elemValue.style.display === "none") {
    console.log("clicked in block");
    elemValue.style.display = "block";
  } else {
    console.log("clicked in none");
    elemValue.style.display = "none";
  }
}

const videoSection = document.getElementById("video-section");
document.getElementById("start-video").addEventListener("click", () => {
  let currentState = JSON.parse(videoSection.getAttribute("data-state"));
  videoSection.dataset.state = !currentState;
  if (!currentState) {
    videoSection.classList.remove("d-none");
  } else {
    videoSection.classList.add("d-none");
  }
});

const joinCallSection = document.getElementById("join-call-section");
document.getElementById("join-call").addEventListener("click", () => {
  let currentState = JSON.parse(joinCallSection.getAttribute("data-state"));
  joinCallSection.dataset.state = !currentState;
  if (!currentState) {
    joinCallSection.classList.remove("d-none");
  } else {
    joinCallSection.classList.add("d-none");
  }
});

///////// toggle show show/hide script End//////////
