const express = require('express');
const multer = require('multer');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.static('public'));

app.post('/upload', upload.single('video'), (req, res) => {
  const inputPath = req.file.path;
  const outputPath = path.join('uploads', `output_${Date.now()}.mp4`);

  exec(`ffmpeg -i ${inputPath} -t 30 -c copy ${outputPath}`, (err) => {
    if (err) {
      return res.status(500).send('Error processing video');
    }
    res.download(outputPath, () => {
      // Clean up files
      fs.unlinkSync(inputPath);
      fs.unlinkSync(outputPath);
    });
  });
});

app.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
});
