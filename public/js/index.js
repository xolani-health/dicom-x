var AppProcess = (function () {
  let peer_connection_ids = [];
  let peer_connections = [];
  let remoteVideoStream = [];
  let remoteAudioStream = [];
  let serverProcess;
  let localVideo;
  let audio;
  let isAudioMute = true;
  let rtp_audio_senders = [];
  let rtp_video_senders = [];
  let video_states = {
    none: 0,
    camera: 1,
    screenShare: 2,
  };
  let current_video_state = video_states.none;
  let videoCameraTrack;

  // _init function Start Here //////////
  async function _init(SDP_function, myConId) {
    serverProcess = SDP_function;
    my_connection_id = myConId;
    eventProcess();
    localVideo = document.getElementById("local-video");
  }

  // Event Processing Start Here //////////
  function eventProcess() {
    //Microphone toggle off/on function
    $("#mic-off-on").on("click", async function () {
      if (!audio) {
        await loadAudio();
      }

      if (!audio) {
        alert("Audio permission not granted");
        return;
      }

      if (isAudioMute) {
        audio.enabled = true;
        $(this).html('<span class="material-icons w-100">mic_none</span>');
        updateMediaSenders(audio, rtp_audio_senders);
      } else {
        audio.enabled = false;
        $(this).html('<span class="material-icons w-100">mic_off</span>');
        removeMediaSenders(rtp_audio_senders);
      }
      isAudioMute = !isAudioMute;
    });

    //Video toggle off/on function
    $("#video-off-on").on("click", async function () {
      if (current_video_state == video_states.camera) {
        await videoProcess(video_states.none);
      } else {
        await videoProcess(video_states.camera);
      }
    });

    //MicropScreen Share toggle off/on function
    $("#screen-off-on").on("click", async function () {
      if (current_video_state == video_states.screenShare) {
        await videoProcess(video_states.none);
      } else {
        await videoProcess(video_states.screenShare);
      }
    });
  }

  // Load Audio Start Here //////////
  async function loadAudio() {
    try {
      var audioStream = await navigator.mediaDevices.getUserMedia({
        video: false,
        audio: true,
      });
      audio = audioStream.getAudioTracks()[0];
      audio.enabled = false;
    } catch (e) {
      console.log(e);
    }
  }

  // Connection Status Start Here //////////
  function connectionStatus(connection) {
    if (
      connection &&
      (connection.connectionState == "new" ||
        connection.connectionState == "connecting" ||
        connection.connectionState == "connected")
    ) {
      return true;
    } else {
      return false;
    }
  }

  // Update Media Senders Start Here //////////
  async function updateMediaSenders(track, rtp_senders) {
    for (var conId in peer_connection_ids) {
      if (connectionStatus(peer_connections[conId])) {
        if (rtp_senders[conId] && rtp_senders[conId].track) {
          rtp_senders[conId].replaceTrack(track);
        } else {
          rtp_senders[conId] = peer_connections[conId].addTrack(track);
        }
      }
    }
  }

  // Remove Media Senders Start Here //////////
  function removeMediaSenders(rtp_senders) {
    for (var conId in peer_connection_ids) {
      if (rtp_senders[conId] && connectionStatus(peer_connections[conId])) {
        peer_connections[conId].removeTrack(rtp_senders[conId]);
        rtp_senders[conId] = null;
      }
    }
  }

  // Remove Video Stream Start Here //////////
  function removeVideoStream(rtp_video_senders) {
    if (videoCameraTrack) {
      videoCameraTrack.stop();
      videoCameraTrack = null;
      localVideo.srcObject = null;
      removeMediaSenders(rtp_video_senders);
    }
  }

  // Video Processing Start Here //////////
  async function videoProcess(newVideoState) {
    if (newVideoState == video_states.none) {
      $("#video-off-on").html(
        '<span class="material-icons w-100">videocam</span>'
      );
      $("#screen-off-on").html(
        '<span class="material-icons w-100">screen_share</span>'
      );
      current_video_state = newVideoState;
      removeVideoStream(rtp_video_senders);
      return;
    }
    if (newVideoState == video_states.camera) {
      $("#video-off-on").html(
        '<span class="material-icons w-100">videocam_off</span>'
      );
      // $("#screen-off-on").html(
      //   '<span class="material-icons w-100">screen_share</span>'
      // );
    }

    // if (newVideoState == video_states.screenShare) {
    //   $("#video-off-on").html(
    //     '<span class="material-icons w-100">videocam</span>'
    //   );
    //   $("#screen-off-on").html(
    //     '<span class="material-icons w-100">stop_screen_share</span>'
    //   );
    // }

    try {
      var videoStream = null;
      if (newVideoState == video_states.camera) {
        videoStream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: 1920,
            height: 1000,
            facingMode: "user",
          },
          audio: false,
        });
      } else if (newVideoState == video_states.screenShare) {
        videoStream = await navigator.mediaDevices.getDisplayMedia({
          video: {
            width: 1920,
            height: 1000,
          },
          audio: false,
        });
        videoStream.oninactive = (e) => {
          remoteVideoStream(rtp_video_senders);
          $("#screen-off-on").html(
            '<span class="material-icons w-100">screen_share</span>'
          );
        };
      }

      if (videoStream && videoStream.getVideoTracks().length > 0) {
        videoCameraTrack = videoStream.getVideoTracks()[0];
        if (videoCameraTrack) {
          localVideo.srcObject = new MediaStream([videoCameraTrack]);
          updateMediaSenders(videoCameraTrack, rtp_video_senders);
        }
      }
    } catch (e) {
      console.log(e);
      return;
    }
    current_video_state = newVideoState;

    if (newVideoState == video_states.camera) {
      $("#video-off-on").html(
        '<span class="material-icons w-100">videocam_off</span>'
      );
      $("#screen-off-on").html(
        '<span class="material-icons w-100">screen_share</span>'
      );
    }

    if (newVideoState == video_states.screenShare) {
      $("#video-off-on").html(
        '<span class="material-icons w-100">videocam</span>'
      );
      $("#screen-off-on").html(
        '<span class="material-icons w-100">stop_screen_share</span>'
      );
    }
  }

  // ICE Candidates Configuration Start Here //////////
  const iceConfig = {
    iceServers: [
      {
        urls: "stun:stun.l.google.com:19302",
      },
      {
        urls: "stun:stun1.l.google.com:19302",
      },
    ],
  };

  // Set connection Start Here //////////
  async function setConnection(connection_id) {
    var connection = new RTCPeerConnection(iceConfig);

    connection.onnegotiationneeded = async function (event) {
      await setOffer(connection_id);
    };

    connection.onicecandidate = function (event) {
      if (event.candidate) {
        serverProcess(
          JSON.stringify({ icecandidate: event.candidate }),
          connection_id
        );
      }
    };

    connection.ontrack = function (event) {
      if (!remoteVideoStream[connection_id]) {
        remoteVideoStream[connection_id] = new MediaStream();
      }

      if (!remoteAudioStream[connection_id]) {
        remoteAudioStream[connection_id] = new MediaStream();
      }

      if (event.track.kind == "video") {
        remoteVideoStream[connection_id]
          .getVideoTracks()
          .forEach((t) => remoteVideoStream[connection_id].removeTrack(t));

        remoteVideoStream[connection_id].addTrack(event.track);
        var remoteVideoPlayer = document.getElementById("v_" + connection_id);
        console.log("v_" + connection_id);
        remoteVideoPlayer.srcObject = null;
        remoteVideoPlayer.srcObject = remoteVideoStream[connection_id];
        remoteVideoPlayer.load();
      } else if (event.track.kind == "audio") {
        remoteAudioStream[connection_id]
          .getAudioTracks()
          .forEach((t) => remoteAudioStream[connection_id].removeTrack(t));

        remoteAudioStream[connection_id].addTrack(event.track);
        var remoteAudioPlayer = document.getElementById("a_" + connection_id);
        remoteAudioPlayer.srcObject = null;
        remoteAudioPlayer.srcObject = remoteAudioStream[connection_id];
        remoteAudioPlayer.load();
      }
    };

    peer_connection_ids[connection_id] = connection_id;
    peer_connections[connection_id] = connection;

    if (
      current_video_state == video_states.camera ||
      current_video_state == video_states.screenShare
    ) {
      if (videoCameraTrack) {
        updateMediaSenders(videoCameraTrack, rtp_video_senders);
      }
    }

    return connection;
  }

  // Set Offer Start Here //////////
  async function setOffer(connection_id) {
    var connection = peer_connections[connection_id];
    var offer = await connection.createOffer();
    await connection.setLocalDescription(offer);
    serverProcess(
      JSON.stringify({
        offer: connection.localDescription,
      }),
      connection_id
    );
  }

  // SDP Process Start Here //////////
  async function SDPProcess(message, from_connection_id) {
    message = JSON.parse(message);
    if (message.answer) {
      await peer_connections[from_connection_id].setRemoteDescription(
        new RTCSessionDescription(message.answer)
      );
    } else if (message.offer) {
      if (!peer_connections[from_connection_id]) {
        await setConnection(from_connection_id);
      }
      await peer_connections[from_connection_id].setRemoteDescription(
        new RTCSessionDescription(message.offer)
      );
      const answer = await peer_connections[from_connection_id].createAnswer();
      await peer_connections[from_connection_id].setLocalDescription(answer);
      serverProcess(
        JSON.stringify({
          answer: answer,
        }),
        from_connection_id
      );
    } else if (message.icecandidate) {
      if (!peer_connections[from_connection_id]) {
        await setConnection(from_connection_id);
      }
      try {
        await peer_connections[from_connection_id].addIceCandidate(
          message.icecandidate
        );
      } catch (e) {
        console.log(e);
      }
    }
  }

  // Close Connection function Start Here //////////
  async function closeConnection(connection_id) {
    peer_connection_ids[connection_id] = null;
    if (peer_connections[connection_id]) {
      peer_connections[connection_id].close();
      peer_connections[connection_id] = null;
    }
    if (remoteAudioStream[connection_id]) {
      remoteAudioStream[connection_id].getTracks().forEach((t) => {
        if (t.stop) {
          t.stop();
        }
      });
      remoteAudioStream[connection_id] = null;
    }
    if (remoteVideoStream[connection_id]) {
      remoteVideoStream[connection_id].getTracks().forEach((t) => {
        if (t.stop) {
          t.stop();
        }
      });
      remoteVideoStream[connection_id] = null;
    }
  }

  // Return function Start Here //////////
  return {
    setNewConnection: async function (connection_id) {
      await setConnection(connection_id);
    },
    init: async function (SDP_function, my_connection_id) {
      await _init(SDP_function, my_connection_id);
    },
    processClientFunction: async function (data, from_connection_id) {
      await SDPProcess(data, from_connection_id);
    },
    closeConnectionFunction: async function (connection_id) {
      await closeConnection(connection_id);
    },
  };
})();

var myApp = (function () {
  let socket = null;
  let hostId = "";
  let meetingId = "";
  let messageCount = 0;
  var filesCount = 0;
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
  function init(uid, mid) {
    hostId = uid;
    meetingId = mid;
    if (hostId.length > 15) {
      var conCatId = hostId.slice(0, 15) + "...";
    } else {
      conCatId = hostId;
    }
    $(".local-user-name").text(`${conCatId} (You)`);
    $("#video-call-wrapper").removeClass("d-none");
    $(".bottom-navigation").removeClass("d-none");
    $(".leave-meeting-btn").removeClass("d-none");
    $(".join-meeting-btn").addClass("d-none");
    $(".start-meeting-btn").addClass("d-none");
    document.title = hostId;
    signalyingServer(hostId, meetingId);
    eventHandling();
  }

  // Signallying Server Start Here //////////
  function signalyingServer(hostId, meetingId) {
    socket = io.connect();

    var SDP_function = function (data, to_connection_id) {
      socket.emit("sdp-process", {
        message: data,
        to_connection_id: to_connection_id,
      });
    };

    socket.on("connect", () => {
      if (socket.connected) {
        AppProcess.init(SDP_function, socket.id);
        if (hostId != "" && meetingId != "") {
          socket.emit("user-connect", {
            hostId: hostId,
            meetingId: meetingId,
          });
        }
      }
    });

    socket.on("user-disconnected", (data) => {
      $(`#${data.connection_id}`).remove();
      AppProcess.closeConnectionFunction(data.connection_id);
    });

    socket.on("inform_others", function (data) {
      addUser(data.other_user_id, data.connection_id, data.usersJoined);
      $(".messages-count").removeClass("d-none");
      $(".messages-count").addClass("fade-me-in");
      if (data.hostId) {
        $(".meeting-host-name").text(data.hostId);
      }
      AppProcess.setNewConnection(data.connection_id);
    });

    socket.on("show-sent-file", (data) => {
      filesCount = filesCount + 1;
      var attachedFile = document.querySelector(".received-files");
      attachedFile.innerHTML +=
        '<a href="' +
        data.filePath +
        '" download><div class="d-flex justify-content-start flex-column border-dark border-bottom border-2 mt-2 w-100 cursor"> <div class="m-0 pt-2 pb-0 ps-2 pe-3 d-flex align-items-center"> <span class="material-icons"> description </span> <h6 class="ps-2 m-0 text-truncate fw-bold text-muted">' +
        data.fileName +
        ' </h6> </div> <span class="text-trucate text-muted ps-2" style="font-size: 0.8em;">sent by ' +
        data.userName +
        " at " +
        currentTime.now +
        "</span> </div></a>";
      $(".files-count").text(filesCount);
      $(".attachment-count").removeClass("d-none");
      $(".received-files").removeClass("d-none");
      $(".upload-helper-text").addClass("d-none");
      if ($(".attachment-count").hasClass("fade-me-out")) {
        $(".attachment-count").removeClass("fade-me-out");
        $(".attachment-count").addClass("fade-me-in");
      }
    });

    socket.on("inform_me", (other_users) => {
      console.log(other_users);
      var usersJoined = other_users.length + 1;
      if (other_users.length == 0) {
        $(".participants-count").text(usersJoined);
        $(".messages-count").removeClass("d-none");
        $(".messages-count").addClass("fade-me-in");
      }

      if (other_users) {
        for (let i = 0; i < other_users.length; i++) {
          if (other_users[i].user_id) {
            $(".meeting-host-name").text(other_users[i].user_id);
            $(".meeting-detail-id").text(other_users[i].meeting_id);
          }
          addUser(
            other_users[i].user_id,
            other_users[i].connection_id,
            usersJoined
          );
          AppProcess.setNewConnection(other_users[i].connection_id);
        }
      }
    });

    socket.on("sent-screenshot", function (data) {
      console.log(data);
      $("#screenshot-modal").modal("show");
      $("#download-screenshot").attr("href", "data:image/png;base64," + data);
      $(".screen-data").attr("src", "data:image/png;base64," + data);
    });

    socket.on("sdp-process", async function (data) {
      await AppProcess.processClientFunction(
        data.message,
        data.from_connection_id
      );
    });

    socket.on("show-message", (data) => {
      var time = new Date();
      var localTime = time.toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });

      messageCount = messageCount + 1;

      var div = $("<div class='border-bottom border-1 border-dark'>").html(
        `<span class='mr-3 chat-text'>${
          data.from.split(" ")[0]
        } - ${localTime}</span><br>> <span style='color:#ddd; font-size:0.8rem;'>${
          data.message
        }</span>`
      );
      $("#message-wrapper").append(div);
      $(".chats-count").text(messageCount);
      $(".messages-count").removeClass("d-none");
      if ($(".messages-count").hasClass("fade-me-out")) {
        $(".messages-count").removeClass("fade-me-out");
        $(".messages-count").addClass("fade-me-in");
      }
    });
  }

  function eventHandling() {
    //Get value of input and send to server
    $("#send-message").click(function () {
      socket.emit("sent-message", $("#input-message").val());
      var time = new Date();
      var localTime = time.toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });

      var div = $("<div class='border-bottom border-1 border-dark'>").html(
        `<span class='mr-3 chat-text'>${
          hostId.split(" ")[0]
        } - ${localTime}</span><br>> <span style='color:#ddd; font-size:0.8rem;'>${$(
          "#input-message"
        ).val()}</span>`
      );

      $("#message-wrapper").append(div);
      $("#input-message").val("");
    });

    //Disconnect user by clicking the leave call button
    $(".leave-meeting-modal-btn").on("click", function () {
      socket.emit("btn-disconnect", () => {});
    });

    //Get screen shot
    $("#screen-shot-btn").on("click", function () {
      socket.emit("get-screenshot", () => {});
    });

    //Request fullscreen
    $(".local-video").on("dblclick", function () {
      //alert("About to go full screen");
      this.requestFullscreen();
    });
  }

  // Add User Start Here //////////
  function addUser(other_user_id, connection_id, usersJoined) {
    var newDiv = $("#remote-video-wrapper").clone();
    newDiv = newDiv.attr("id", connection_id).addClass("remote-users");
    console.log(other_user_id);
    newDiv.find(".remote-user-name").text(other_user_id);
    newDiv.find("video").attr("id", "v_" + connection_id);
    newDiv.find("audio").attr("id", "a_" + connection_id);
    newDiv.removeClass("d-none");
    $("#video-call-wrapper").append(newDiv);

    $(".particpants-wrapper").append(
      ' <div class="d-flex justify-content-start align-items-center participants border-2 border-dark border-bottom"id="participant-' +
        connection_id +
        '"> <a class="p-1"> <img class="rounded-5 shadow-4" src="https://mdbootstrap.com/img/Photos/Avatars/man2.jpg" alt="Avatar" style="width: 30px; height: 30px;"> <span class="badge bg-success badge-dot"></span> </a> <h6 class="p-1 m-0 user-name text-white ms-2 fw-normal small text-truncate ">' +
        other_user_id +
        '</h6> <div class="d-flex flex-fill justify-content-end"> <button type="button" class="btn border-0 p-0"> <span class="material-icons"> more_vert </span> </button> </div> </div>'
    );
    $(".participants-count").text(usersJoined);
  }

  // //Request fullscreen
  // $(".remote-users").on("click", function () {
  //   alert("About to go full screen");
  //   // this.requestFullscreen();
  // });

  //Toggle show and hide participants section
  $(".participants-btn").on("click", function () {
    $(".participants-main-wrapper").show();
    $(".chat-main-wrapper").hide();
  });

  //Toggle show and hide chats section
  $(".chats-btn").on("click", function () {
    $(".chat-main-wrapper").show();
    $(".participants-main-wrapper").hide();
  });

  //Clear message count when read
  $(".chats-btn").click(function () {
    messageCount = 0;
    $(".chats-count").text("");
  });

  //Send files function start here
  var base_url = window.location.origin;
  $("#chosen-file").on("change", function () {
    var fileName = $(this).val().split("\\").pop();
    $(".validate-file-upload").text(fileName).removeClass("text-danger");
  });

  $(".send-file-btn").click(function (e) {
    e.preventDefault();
    var attachedFile = $("#chosen-file").prop("files")[0];
    if (!attachedFile) {
      $(".validate-file-upload")
        .text("Please choose a file")
        .addClass("text-danger");
      return;
    }
    var formData = new FormData();
    formData.append("zipFile", attachedFile);
    formData.append("meetingId", meetingId);
    formData.append("userName", hostId);

    $.ajax({
      url: base_url + "/attach-file",
      type: "POST",
      data: formData,
      contentType: false,
      processData: false,
      success: function (response) {
        console.log("Success!");
      },
      error: function () {
        console.log("There was an error sending the file");
      },
    });
    var receivedFileElement = document.querySelector(".sent-files");
    var receivedFileName = $("#chosen-file").val().split("\\").pop();
    var receivedPath =
      base_url + "/public/attachedfiles/" + meetingId + "/" + receivedFileName;
    receivedFileElement.innerHTML +=
      '<a href="' +
      receivedPath +
      '" download><div class="d-flex justify-content-start flex-column border-dark border mt-3 w-100 cursor"> <div class="m-0 pt-2 pb-0 ps-2 pe-3 d-flex align-items-center"> <span class="material-icons"> description </span> <h6 class="ps-2 m-0 text-truncate fw-bold text-muted">' +
      receivedFileName +
      ' </h6> </div> <span class="text-trucate text-muted ps-2" style="font-size: 0.8em;">Sent by you at ' +
      currentTime.now +
      "</span></div></a>";

    // $("#chosen-file").text("No file chosen");
    $(".sent-files").removeClass("d-none");
    $("#chosen-file").val("");
    $(".validate-file-upload").text("").removeClass("text-danger");

    socket.emit("send-file-others", {
      userName: hostId,
      meetingId: meetingId,
      filePath: receivedPath,
      fileName: receivedFileName,
    });
  });

  //Screen recording starts here

  let mediaRecorder;
  let chunks = [];
  let clipName;

  $("#start-record-screen-btn").click(function () {
    $("#screen-record-modal").modal("show");

    $(".screen-record-modal-btn").click(function () {
      clipName = $("#screen-recording-name").val();
      if (clipName == "") {
        $("#screen-recording-name").attr(
          "placeholder",
          "Please name your recording"
        );
        $("#screen-recording-name").focus();
      } else {
        $("#screen-record-modal").modal("hide");
        $("#stop-record-screen-btn").removeClass("d-none");
        $("#start-record-screen-btn").addClass("d-none");
        startRecording();
      }
    });
  });

  $("#stop-record-screen-btn").click(function () {
    $("#start-record-screen-btn").removeClass("d-none");
    $("#stop-record-screen-btn").addClass("d-none");
    mediaRecorder.stop();
  });

  async function captureScreen(
    mediaConstraints = {
      video: true,
    }
  ) {
    const screenStream = await navigator.mediaDevices.getDisplayMedia(
      mediaConstraints
    );
    return screenStream;
  }

  async function captureAudio(
    mediaConstraints = {
      audio: true,
      video: false,
    }
  ) {
    const audioStream = await navigator.mediaDevices.getUserMedia(
      mediaConstraints
    );
    return audioStream;
  }
  async function startRecording() {
    const screenStream = await captureScreen();
    const audioStream = await captureAudio();
    const stream = new MediaStream([
      ...screenStream.getTracks(),
      ...audioStream.getTracks(),
    ]);

    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.start();

    mediaRecorder.onstop = function (e) {
      stream.getTracks().forEach((track) => track.stop());
      const blob = new Blob(chunks, {
        type: "video/webm",
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = clipName + ".webm";
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 100);
    };

    mediaRecorder.ondataavailable = function (e) {
      chunks.push(e.data);
    };
  }

  return {
    _init: (uid, mid) => {
      init(uid, mid);
    },
  };
})();
