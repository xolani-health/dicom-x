const express = require("express");
const fs = require("fs");
const fileUpload = require("express-fileupload");
const path = require("path");
const screenshot = require("screenshot-desktop");
const bodyParser = require("body-parser");
const cors = require("cors");
const { engine } = require("express-handlebars");
const session = require("express-session");
require("dotenv").config();

//dotenv.config({ path: "./.env" });
const app = express();
const port = process.env.PORT || 3000;

//Parsing middleware
//Parse application/x-www-form-urlencode
app.use(bodyParser.urlencoded({ extended: false }));

//Parse application/json
app.use(bodyParser.json());

// enable cors
app.use(cors());

app.use(
  session({
    secret: "bsdfhsgiufkbjsbdjfikbwdbfksdf",
    resave: false,
    saveUninitialized: true,
  })
);

//Set public path for static files and all
app.use(express.static("public"));

//Set templating engine
app.engine(".hbs", engine({ extname: ".hbs" }));
app.set("view engine", "hbs");

// const routes = require("./server/routes/signin");
app.use("/", require("./server/routes/signin"));
app.use("/", require("./server/routes/signup"));
app.use("/", require("./server/routes/dicomx"));

//Server Initialization code starts here
const server = app.listen(port, () => {
  console.log(`Application running on: http://localhost.com:${port}`);
});

//define routes
// app.use("/", require("./routes/pages"));
// app.use("/auth", require("./routes/auth"));

const io = require("socket.io")(server);
var userConnections = [];
io.on("connection", (socket) => {
  console.log("Socket ID is ", socket.id);
  socket.on("user-connect", (data) => {
    console.log(data);
    //console.log("User connected: ", data.hostId.displayName, data.meetingId);

    var otherUsers = userConnections.filter(
      (p) => p.meeting_id == data.meetingId
    );

    userConnections.push({
      connection_id: socket.id,
      user_id: data.hostId,
      meeting_id: data.meetingId,
    });

    var usersJoined = userConnections.length;

    otherUsers.forEach((v) => {
      socket.to(v.connection_id).emit("inform_others", {
        other_user_id: data.hostId,
        connection_id: socket.id,
        usersJoined: usersJoined,
        host: userConnections[0].user_id,
      });
    });

    socket.emit("inform_me", otherUsers);
  });

  socket.on("sdp-process", (data) => {
    socket.to(data.to_connection_id).emit("sdp-process", {
      message: data.message,
      from_connection_id: socket.id,
    });
  });

  socket.on("sent-message", (msg) => {
    var userMessage = userConnections.find((p) => p.connection_id == socket.id);
    if (userMessage) {
      var meetingid = userMessage.meeting_id;
      var from = userMessage.user_id;
      var list = userConnections.filter((p) => p.meeting_id == meetingid);
      list.forEach((v) => {
        socket.to(v.connection_id).emit("show-message", {
          from: from,
          message: msg,
        });
      });
    }
  });

  socket.on("get-screenshot", () => {
    screenshot.listDisplays().then((displays) => {
      // displays: [{ id, name }, { id, name }]
      screenshot({ screen: displays[displays.length - 1].id }).then((img) => {
        var imgStr = new Buffer.from(img).toString("base64");
        socket.emit("sent-screenshot", imgStr);
      });
    });
  });

  socket.on("send-file-others", (data) => {
    var userMessage = userConnections.find((p) => p.connection_id == socket.id);
    if (userMessage) {
      var meetingid = userMessage.meeting_id;
      var list = userConnections.filter((p) => p.meeting_id == meetingid);
      list.forEach((v) => {
        socket.to(v.connection_id).emit("show-sent-file", {
          userName: data.userName,
          meetingId: data.meetingId,
          filePath: data.filePath,
          fileName: data.fileName,
        });
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("Disconnected");
    var disconnectedUser = userConnections.find(
      (p) => p.connection_id == socket.id
    );
    if (disconnectedUser) {
      var disconnectedUserMeetingId = disconnectedUser.meeting_id;
      userConnections = userConnections.filter(
        (p) => p.connection_id != socket.id
      );

      var list = userConnections.filter(
        (p) => p.meeting_id == disconnectedUserMeetingId
      );
      list.forEach((v) => {
        socket.to(v.connection_id).emit("user-disconnected", {
          connection_id: socket.id,
        });
      });
    }
  });

  socket.on("btn-disconnect", () => {
    console.log("Disconnected");
    var disconnectedUser = userConnections.find(
      (p) => p.connection_id == socket.id
    );
    if (disconnectedUser) {
      var disconnectedUserMeetingId = disconnectedUser.meeting_id;
      userConnections = userConnections.filter(
        (p) => p.connection_id != socket.id
      );

      var list = userConnections.filter(
        (p) => p.meeting_id == disconnectedUserMeetingId
      );
      list.forEach((v) => {
        socket.to(v.connection_id).emit("user-disconnected", {
          connection_id: socket.id,
        });
      });
    }
  });
});

//File upload start here
app.use(fileUpload());
app.post("/attach-file", (req, res) => {
  var data = req.body;
  var attachedFile = req.files.zipFile;
  var dir = "public/attachedfiles/" + data.meetingId + "/";
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  attachedFile.mv(dir + attachedFile.name, function (error) {
    if (error) {
      console.log(`Could not upload the file: ${error}`);
    } else {
      console.log(`File upload successfully!`);
    }
  });
});
