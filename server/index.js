const express = require("express")
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const {google} = require("googleapis");  
const multer = require('./multer.js');
const fs = require("fs");

app.use(express.urlencoded({ extended: false }));

app.use(express.json());
const corsOptions = { 
  AccessControlAllowOrigin: '*',  
  origin: '*',  
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE' 
}
app.use(cors(corsOptions))

app.use(morgan("dev"));


const authenticateGoogle = function () {
    var auth = new google.auth.GoogleAuth({
        keyFile: `${__dirname}/keys.json`,
        scopes: "https://www.googleapis.com/auth/drive",
    });
    return auth;
};

const uploadToGoogleDrive = async (file, auth) => {
    const fileMetadata = {
      name: file.originalname,
      parents: ["17HCEI20ZhXIhJXGBSaCOLFhsLSp_RwzI"] 
    }
    const media = {
      mimeType: file.mimetype,
      body: fs.createReadStream(file.path)
    }
    const driveService = google.drive({ version: "v3", auth })
    const response = await driveService.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: "id"
    })
    return response
  }

  const deleteFile = (filePath) => {
    fs.unlink(filePath, () => {
      console.log("file deleted");
    });
  };

  app.post("/upload-to-google-drive", multer.single("file"), async (req, res, next) => {
    try {
      if (!req.file) {
        res.status(400).send("No file uploaded.");
        return;
      }
      const auth = authenticateGoogle();
      const response = await uploadToGoogleDrive(req.file, auth);
      deleteFile(req.file.path);
      res.status(200).json({ response });
    } catch (err) {
      console.log(err);
  }
});


var PORT = 8000

app.listen(PORT, () => {
    console.log(`Server running  on ${PORT}`);
});
