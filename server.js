const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
// const session = require("express-session");
const session = require("cookie-session");

const { v4: uuidv4 } = require("uuid");
const router = require("./router");
const router_api = require("./router-api");
// const SerialPort = require("serialport");
const axios = require("axios").default;

const app = express();

const port = process.env.PORT || 3000;

const server = require("http").createServer(app);
const io = require("socket.io")(server);

const url = "https://epark-project-api.herokuapp.com/";

// comment this if you are going to deploy the application
// const parsers = SerialPort.parsers;

// const parser = new parsers.Readline({
//   delimiter: "\r\n",
// });

// const serialport = new SerialPort("COM3", {
//   baudRate: 9600,
//   dataBits: 8,
//   parity: "none",
//   stopBits: 1,
//   flowControl: false,
// });

// serialport.pipe(parser);
// end comment here

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

// static assets
app.use("/css", express.static(path.join(__dirname, "public/css")));
app.use("/assets", express.static(path.join(__dirname, "public/assets")));
app.use("/fonts", express.static(path.join(__dirname, "public/fonts")));
app.use("/images", express.static(path.join(__dirname, "public/images")));
app.use("/js", express.static(path.join(__dirname, "public/js")));

app.set("views", [
  path.join(__dirname, "views"),
  path.join(__dirname, "views/admin/"),
  path.join(__dirname, "views/clerk/"),
  path.join(__dirname, "views/user/"),
]);

// app.use(
//   session({
//     secret: uuidv4(),
//     resave: false,
//     saveUninitialized: true,
//   })
// );
app.use(
  session({
    name: "session",
    keys: [uuidv4()],
  })
);

app.use("/", router);
app.use("/api", router_api);

io.on("connection", function (socket) {
  console.log("a user connected");
  socket.on("data", function (msg) {
    // comment out this if you are going to deploy this app
    // console.log("hello", serialport.isOpen);
    // if (!serialport.isOpen) {
    //   serialport.open();
    // }
    // parser.once("data", function (data) {
    //   console.log(data);
    //   if (data.includes("booking_id")) {
    //     axios
    //       .post(
    //         url + "/scan",
    //         JSON.stringify({ booking_id: data.split(":")[1] })
    //       )
    //       .then((response) => {
    //         console.log("detected!", response.data);
    //         if (serialport.isOpen) {
    //           serialport.close();
    //         }
    //         io.emit("redirect");
    //       })
    //       .catch(function (error) {
    //         console.log("not detected!", data);
    //         io.emit("redirect");
    //       });
    //   } else {
    //     console.log("not detected!", data);
    //     io.emit("redirect");
    //   }
    // });
    // end comment here
  });
});

server.listen(port, () => {
  console.log("listening on port " + port);
});
