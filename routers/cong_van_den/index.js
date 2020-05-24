const express = require('express');
const router = express.Router();
const CVD = require('../../model/cong_van_den');

// add test data
// for (let index = 0; index < 50; index++) {
//   const time = new Date();
//   time.setDate(time.getDate() - 30 + index);
//   const time2 = new Date();
//   time2.setDate(time2.getDate() - 3 + index);
//   const rd = Math.floor(Math.random() * 8);
//   const rdsovb = Math.floor(Math.random() * 500);
//   CVD.create({
//     stt: index,
//     sovb: rdsovb,
//     loaivb: rd,
//     donvigui: `Ủy ban nhân dân ${index}`,
//     ngayden: time,
//     noidungvb: `Nội dung thực hiện ${index}`,
//     noidungbutphe: `Nội dung bút phê ${index}`,
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
//     nguoithuchienchinh: '5ec1feb640e5c83b803b724b',
//     thoihan: time2,
//     trangthai: 0,
//     filepatch: 'http://localhost:5000/pdf/1589772931193.pdf',
//     filename: 'Văn bản.PDF',
//   });
// }
//notificationQlcv
router.get('/notiCvd', async (req, res) => {
  try {
    const qlcv = await CVD.find({
      notification: 3,
    })
      .countDocuments()
      .exec();
    const guestCvd = await CVD.find({
      notification: 1,
    })
      .countDocuments()
      .exec();
    res.json({ qlcv, guestCvd });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// admin get with limit and page
router.get('/', async (req, res) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  let TrangThai;
  let ThoiHan;
  let Sort = { _id: 'desc' };
  if (req.query.trangthai) {
    if (req.query.trangthai == 5) {
      ThoiHan = { thoihan: { $lt: new Date() } };
    } else {
      TrangThai = { ...TrangThai, trangthai: req.query.trangthai };
    }
  }
  if (req.query.loaivb) {
    TrangThai = { ...TrangThai, loaivb: req.query.loaivb };
  }
  if (req.query.nguoithuchien) {
    TrangThai = { ...TrangThai, nguoithuchien: req.query.nguoithuchien };
  }
  if (req.query.nguoithuchienchinh) {
    TrangThai = {
      ...TrangThai,
      nguoithuchienchinh: req.query.nguoithuchienchinh,
    };
  }
  if (req.query.stt) {
    Sort = { stt: req.query.stt };
  }
  if (req.query.sovb) {
    Sort = { sovb: req.query.sovb };
  }
  if (req.query.ngayden) {
    Sort = { ngayden: req.query.ngayden };
  }
  if (req.query.thoihan) {
    Sort = { thoihan: req.query.thoihan };
  }
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await CVD.find({
    ...ThoiHan,
    ...TrangThai,
  })
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
    results.data = await CVD.find({
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
    res.status(500).json({ message: error.message });
  }
});

// admin get with limit and page have thoihan
router.get('/qlcv', async (req, res) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  // let sortTrangThai;
  //  if(req.query.trangthai===3){
  //    const d= new Date(thoihan).getTime()
  //   sortTrangThai='{}'
  //  }
  let TrangThai;
  let ThoiHan;
  let Sort = { _id: 'desc' };
  if (req.query.trangthai) {
    if (req.query.trangthai == 5) {
      ThoiHan = { $lt: new Date() };
    } else {
      TrangThai = { ...TrangThai, trangthai: req.query.trangthai };
    }
  }
  if (req.query.loaivb) {
    TrangThai = { ...TrangThai, loaivb: req.query.loaivb };
  }
  if (req.query.nguoithuchien) {
    TrangThai = { ...TrangThai, nguoithuchien: req.query.nguoithuchien };
  }
  if (req.query.nguoithuchienchinh) {
    TrangThai = {
      ...TrangThai,
      nguoithuchienchinh: req.query.nguoithuchienchinh,
    };
  }
  if (req.query.stt) {
    Sort = { stt: req.query.stt };
  }
  if (req.query.sovb) {
    Sort = { sovb: req.query.sovb };
  }
  if (req.query.ngayden) {
    Sort = { ngayden: req.query.ngayden };
  }
  if (req.query.thoihan) {
    Sort = { thoihan: req.query.thoihan };
  }

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await CVD.find({
    thoihan: { $exists: true, ...ThoiHan },
    ...TrangThai,
  })
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
    results.data = await CVD.find({
      thoihan: { $exists: true, ...ThoiHan },
      ...TrangThai,
    })
      .sort(Sort)
      .limit(limit)
      .skip(startIndex)
      .exec();
    console.log('reder call');

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// guest get with limit and page
router.get('/guest', async (req, res) => {
  const userId = req.query.id;
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  let TrangThai = { nguoithuchien: userId };
  let ThoiHan;
  let Sort = { _id: 'desc' };
  if (req.query.trangthai) {
    if (req.query.trangthai == 5) {
      ThoiHan = { thoihan: { $lt: new Date() } };
    } else {
      TrangThai = { ...TrangThai, trangthai: req.query.trangthai };
    }
  }
  if (req.query.loaivb) {
    TrangThai = { ...TrangThai, loaivb: req.query.loaivb };
  }
  if (req.query.nguoithuchien) {
    TrangThai = { ...TrangThai, nguoithuchien: req.query.nguoithuchien };
  }
  if (req.query.nguoithuchienchinh) {
    TrangThai = {
      ...TrangThai,
      nguoithuchienchinh: req.query.nguoithuchienchinh,
    };
  }
  if (req.query.stt) {
    Sort = { stt: req.query.stt };
  }
  if (req.query.sovb) {
    Sort = { sovb: req.query.sovb };
  }
  if (req.query.ngayden) {
    Sort = { ngayden: req.query.ngayden };
  }
  if (req.query.thoihan) {
    Sort = { thoihan: req.query.thoihan };
  }
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await CVD.find({
    ...ThoiHan,
    ...TrangThai,
  })
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
    results.data = await CVD.find({
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
  const io = res.locals['socketio'];

  try {
    console.log(req.body);
    const cvd = new CVD({
      stt: req.body.stt,
      sovb: req.body.sovb,
      loaivb: req.body.loaivb,
      donvigui: req.body.donvigui,
      ngayden: req.body.ngayden,
      noidungvb: req.body.noidungvb,
      noidungbutphe: req.body.noidungbutphe,
      nguoithuchien: req.body.nguoithuchien,
      nguoithuchienchinh: req.body.nguoithuchienchinh,
      thoihan: req.body.thoihan,
      trangthai: req.body.trangthai,
      filepatch: req.body.filepatch,
      filename: req.body.filename,
    });
    const newCvd = await cvd.save();
    // socket
    req.app.io.emit('socketAddCvd', newCvd);
    res.status(201).json(newCvd);
  } catch (error) {
    console.log(error);

    res.status(400).json({ message: error.message });
  }
});

// get one
router.get('/:id', getCvd, (req, res) => res.json(res.cvd));

// update one
router.patch('/:id', getCvd, async (req, res) => {
  if (req.body.stt) {
    res.cvd.stt = req.body.stt;
  }
  if (req.body.sovb) {
    res.cvd.sovb = req.body.sovb;
  }
  if (req.body.loaivb) {
    res.cvd.loaivb = req.body.loaivb;
  }
  if (req.body.donvigui) {
    res.cvd.donvigui = req.body.donvigui;
  }
  if (req.body.noidungvb) {
    res.cvd.noidungvb = req.body.noidungvb;
  }
  if (req.body.noidungbutphe) {
    res.cvd.noidungbutphe = req.body.noidungbutphe;
  }
  if (req.body.nguoithuchien) {
    res.cvd.nguoithuchien = req.body.nguoithuchien;
  }
  if (req.body.nguoithuchienchinh) {
    res.cvd.nguoithuchienchinh = req.body.nguoithuchienchinh;
  }
  if (req.body.thoihan) {
    res.cvd.thoihan = req.body.thoihan;
  }
  if (req.body.ngayden) {
    res.cvd.ngayden = req.body.ngayden;
  }
  if (req.body.trangthai) {
    res.cvd.trangthai = req.body.trangthai;
  }
  if (req.body.notification) {
    res.cvd.notification = req.body.notification;
  }
  if (req.body.filepatch) {
    res.cvd.filepatch = req.body.filepatch;
  }
  if (req.body.filename) {
    res.cvd.filename = req.body.filename;
  }
  if (req.body.thoihan === null) {
    res.cvd.thoihan = undefined;
  }
  try {
    const updateCvd = await res.cvd.save();
    req.app.io.emit('socketUpdateCvd', updateCvd);

    if (req.body.trangthai === 2) {
      req.app.io.emit('socketDeXuatHoanThanh', updateCvd);
    }
    if (req.body.trangthai === 3) {
      req.app.io.emit('socketTuChoiDeXuat', updateCvd);
    }
    if (req.body.trangthai === 4) {
      req.app.io.emit('socketHoanThanh', updateCvd);
    }
    // if (req.body.trangthai) {
    //   req.app.io.emit('updateNotification', updateCvd);
    // }
    res.json(updateCvd);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// delete one
router.delete('/:id', getCvd, async (req, res) => {
  try {
    const updateCvd = await res.cvd.remove();
    res.json({ message: 'Cvd deleted' });
    req.app.io.emit('socketdeleteCvd', updateCvd);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// middleware
async function getCvd(req, res, next) {
  let cvd;
  try {
    cvd = await CVD.findById(req.params.id);
    if (cvd == null) {
      return res.status(404).json({ message: 'Cannot find cvd' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  res.cvd = cvd;
  next();
}

module.exports = router;
