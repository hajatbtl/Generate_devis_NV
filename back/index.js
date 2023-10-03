const express = require("express");
const cors = require('cors');
//const generatorRoutes = require("./routes/generator.js");
const multer = require("multer");
const fse = require("fs-extra");

const app = express();
app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './upload')
      // cb(null, '/var/www/vhzosts/boring-hermann.212-227-197-242.plesk.page/httpdocs/front/build/upload')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + file.originalname) 
    }
  });
  
  const upload = multer({ storage });

  app.post('/api/upload', upload.single('file'), function (req, res, next) {
    const file = req.file;
    res.status(200).json(file.filename);
  })


//app.use('/api/generator/', generatorRoutes);


app.listen(5000, () => {
    console.log("backend connected!");
});

const devisRoutes = require("./routes/devis.js");
app.use(`/api/devis/`, devisRoutes);

const prestationRoutes = require("./routes/prestation.js");
app.use(`/api/prestation/`, prestationRoutes);

const notatsRoutes = require("./routes/notats.js");
app.use(`/api/notats/`, notatsRoutes);

const auth = require("./routes/auth.js");
app.use("/api/auth/", auth);

const devisWithPrestation = require("./routes/devisWithPrestation.js");
app.use("/api/devisWithPrestation/", devisWithPrestation);

const devisWithNotats = require("./routes/devisWithNotats.js");
app.use("/api/devisWithNotats/", devisWithNotats);

const clientRoutes = require("./routes/client.js");
app.use(`/api/client/`, clientRoutes);

const userRoutes = require("./routes/user.js");
app.use(`/api/user/`, userRoutes);
