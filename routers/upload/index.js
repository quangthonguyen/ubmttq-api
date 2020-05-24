const express = require('express');
const router = express.Router();
const os = require('os');

// upload single file pdf
router.post('/', (req, res) => {
  if (!req.files) {
    return res.status(400).json({ message: 'No file upload' });
  }
  const ramdomFileName = Date.now() + '.pdf';
  const file = req.files.pdfFile;
  file.mv(`${process.cwd()}/public/pdf/${ramdomFileName}`, (error) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ message: error.message });
    }
    console.log('Upload ', file.name, ' Successfull !');
    res.status(200).json({
      filepatch: `https://${req.headers.host}/pdf/${ramdomFileName}`,
      filename: file.name,
    });
  });
});

module.exports = router;
