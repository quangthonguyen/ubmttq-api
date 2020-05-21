const express = require('express');
const router = express.Router();
const Users = require('../../model/user');

// GET ALL USER
router.get('/', async (req, res) => {
  try {
    const users = await Users.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CREATE ONE USER
router.post('/', async (req, res) => {
  try {
    const user = new Users({
      username: req.body.username,
      password: req.body.password,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      access: req.body.access,
    });
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET ONE USER
// router.get('/:id', getUser, (req, res) => res.json(res.user));
router.post('/login', async (req, res) => {
  if (req.body.username != null && req.body.password != null) {
    try {
      const user = await Users.find({
        username: req.body.username,
        password: req.body.password,
      });
      return res.json(user);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
  return res.status(400).json({ message: 'bad require' });
});

// UPDATE ONE USER
router.patch('/:id', getUser, async (req, res) => {
  if (req.body.username != null) {
    res.user.username = req.body.username;
  }
  if (req.body.password != null) {
    res.user.password = req.body.password;
  }
  if (req.body.firstname != null) {
    res.user.firstname = req.body.firstname;
  }
  if (req.body.lastname != null) {
    res.user.lastname = req.body.lastname;
  }
  if (req.body.access != null) {
    res.user.access = req.body.access;
  }
  try {
    const updateUser = await res.user.save();
    res.json(updateUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE ONE USER
router.delete('/:id', getUser, async (req, res) => {
  try {
    await res.user.remove();
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// MIDDLEWARE
async function getUser(req, res, next) {
  let user;
  try {
    user = await Users.findById(req.params.id);
    if (user == null) {
      return res.status(404).json({ message: 'Cannot find user' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  res.user = user;
  next();
}

module.exports = router;
