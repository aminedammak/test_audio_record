const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
app.use(bodyParser.json());
app.use(cors());
var multer = require("multer");

const fileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads");
  },
  filename: function (req, file, cb) {
    let extension = "";
    if (file.mimetype === "audio/wav") {
      extension = "wav";
    }
    if (file.mimetype === "text/plain") {
      extension = "txt";
    }
    console.log("miiiiiimetype", file.mimetype);

    cb(null, new Date().getTime() + "_" + file.originalname + "." + extension);
  },
});

var upload = multer({ storage: fileStorage });
var type = upload.fields([
  { name: "soundBlob", maxCount: 1 },
  { name: "textfile", maxCount: 1 },
]);

app.post("/record", type, (req, res) => {
  console.log("bbbbb", req.body);
  console.log("req file axios", req.files);
  res.send(req.file);
});

app.listen(4000, () => {
  console.log("Deployment version", 56);

  console.log("listening on post 4000");
});
