const express = require('express');
const router = express.Router();
const CVDI = require('../../model/cong_van_di');

// add test data
// for (let index = 1; index < 50; index++) {
//   const time = new Date();
//   time.setDate(time.getDate() - 30 + index);
//   const rd = Math.floor(Math.random() * 13);
//   const rdsovb = Math.floor(Math.random() * 500);
//   CVDI.create({
//     stt: index,
//     sovb: index,
//     loaivb: rd,
//     ngaythang: time,
//     noidungvb: `Nội dung văn bản đi ${index}`,
//     nguoithuchien: [
//       '5ec1fe8040e5c83b803b7249',

//       '5ec1fe9f40e5c83b803b724a',

//       '5ec1feb640e5c83b803b724b',

//       '5ec1fed140e5c83b803b724c',

//       '5ec1feed40e5c83b803b724d',

//       '5ec1ff0140e5c83b803b724e',

//       '5ec1ff4540e5c83b803b724f',

//       '5ec1ff6340e5c83b803b7250',
//     ],
//     nguoinhan: [
//       '5ec1fe8040e5c83b803b7249',

//       '5ec1fe9f40e5c83b803b724a',

//       '5ec1feb640e5c83b803b724b',

//       '5ec1fed140e5c83b803b724c',

//       '5ec1feed40e5c83b803b724d',

//       '5ec1ff0140e5c83b803b724e',

//       '5ec1ff4540e5c83b803b724f',

//       '5ec1ff6340e5c83b803b7250',
//     ],
//     tacgia: '5ec1fe9f40e5c83b803b724a',
//     filepatch: 'http://localhost:5000/pdf/1589773047248.pdf',
//     filename: 'Văn bản.PDF',
//   });
// }

// admin get with limit and page
router.get('/', async (req, res) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);

  let TrangThai;
  let ThoiHan;
  let Sort = { _id: 'desc' };

  if (req.query.loaivb) {
    TrangThai = { ...TrangThai, loaivb: req.query.loaivb };
  }
  if (req.query.nguoithuchien) {
    TrangThai = { ...TrangThai, nguoithuchien: req.query.nguoithuchien };
  }
  if (req.query.nguoinhan) {
    TrangThai = { ...TrangThai, nguoinhan: req.query.nguoinhan };
  }
  if (req.query.tacgia) {
    TrangThai = { ...TrangThai, tacgia: req.query.tacgia };
  }
  if (req.query.stt) {
    Sort = { stt: req.query.stt };
  }
  if (req.query.sovb) {
    Sort = { sovb: req.query.sovb };
  }
  if (req.query.ngaythang) {
    Sort = { ngaythang: req.query.ngaythang };
  }
  if (req.query.thoihan) {
    Sort = { thoihan: req.query.thoihan };
  }

  const results = {};
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await CVDI.find({
    ...ThoiHan,
    ...TrangThai,
  })
    .countDocuments()
    .exec();

  results.pagination = { limit: limit, total: total };

  if (endIndex < total) {
    results.pagination.next = page + 1;
  }

  if (startIndex > 0) {
    results.pagination.previous = page - 1;
  }

  try {
    results.data = await CVDI.find({
      ...ThoiHan,
      ...TrangThai,
    })
      .sort(Sort)
      .limit(limit)
      .skip(startIndex)
      .exec();
    console.log('reder call');

    res.json(results);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// guest get with limit and page
router.get('/guest', async (req, res) => {
  const userId = req.query.id;
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);

  let TrangThai = { nguoinhan: userId };
  let ThoiHan;
  let Sort = { _id: 'desc' };

  if (req.query.loaivb) {
    TrangThai = { ...TrangThai, loaivb: req.query.loaivb };
  }
  if (req.query.nguoithuchien) {
    TrangThai = { ...TrangThai, nguoithuchien: req.query.nguoithuchien };
  }
  if (req.query.nguoinhan) {
    TrangThai = { ...TrangThai, nguoinhan: req.query.nguoinhan };
  }
  if (req.query.tacgia) {
    TrangThai = { ...TrangThai, tacgia: req.query.tacgia };
  }
  if (req.query.stt) {
    Sort = { stt: req.query.stt };
  }
  if (req.query.sovb) {
    Sort = { sovb: req.query.sovb };
  }
  if (req.query.ngaythang) {
    Sort = { ngaythang: req.query.ngaythang };
  }
  if (req.query.thoihan) {
    Sort = { thoihan: req.query.thoihan };
  }

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await CVDI.find({ ...ThoiHan, ...TrangThai })
    .countDocuments()
    .exec();

  const results = {};

  results.pagination = { limit: limit, total: total };

  if (endIndex < total) {
    results.pagination.next = page + 1;
  }

  if (startIndex > 0) {
    results.pagination.previous = page - 1;
  }

  try {
    results.data = await CVDI.find({
      ...ThoiHan,
      ...TrangThai,
    })
      .sort(Sort)
      .limit(limit)
      .skip(startIndex)
      .exec();
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// create one
router.post('/', async (req, res) => {
  try {
    console.log(req.body);
    const cvdi = new CVDI({
      stt: req.body.stt,
      sovb: req.body.sovb,
      loaivb: req.body.loaivb,
      ngaythang: req.body.ngaythang,
      noidungvb: req.body.noidungvb,
      nguoithuchien: req.body.nguoithuchien,
      nguoinhan: req.body.nguoinhan,
      tacgia: req.body.tacgia,
      filepatch: req.body.filepatch,
      filename: req.body.filename,
    });
    const newCvdi = await cvdi.save();
    console.log({ newcvdi: newCvdi });
    res.status(201).json(newCvdi);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// get one
router.get('/:id', getCvdi, (req, res) => res.json(res.cvdi));

// update one
router.patch('/:id', getCvdi, async (req, res) => {
  if (req.body.stt) {
    res.cvdi.stt = req.body.stt;
  }
  if (req.body.sovb) {
    res.cvdi.sovb = req.body.sovb;
  }
  if (req.body.loaivb) {
    res.cvdi.loaivb = req.body.loaivb;
  }
  if (req.body.ngaythang) {
    res.cvdi.ngaythang = req.body.ngaythang;
  }
  if (req.body.noidungvb) {
    res.cvdi.noidungvb = req.body.noidungvb;
  }
  if (req.body.nguoithuchien) {
    res.cvdi.nguoithuchien = req.body.nguoithuchien;
  }
  if (req.body.nguoinhan) {
    res.cvdi.nguoinhan = req.body.nguoinhan;
  }
  if (req.body.tacgia) {
    res.cvdi.tacgia = req.body.tacgia;
  }
  if (req.body.filepatch) {
    res.cvdi.filepatch = req.body.filepatch;
  }
  if (req.body.filename) {
    res.cvdi.filename = req.body.filename;
  }
  try {
    console.log(res.cvdi);

    const updateCvdi = await res.cvdi.save();
    res.json(updateCvdi);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// delete one
router.delete('/:id', getCvdi, async (req, res) => {
  try {
    await res.cvdi.remove();
    res.json({ message: 'Cvdi deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// middleware
async function getCvdi(req, res, next) {
  let cvdi;
  try {
    cvdi = await CVDI.findById(req.params.id);
    if (cvdi == null) {
      return res.status(404).json({ message: 'Cannot find cvdi' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  res.cvdi = cvdi;
  next();
}

module.exports = router;
