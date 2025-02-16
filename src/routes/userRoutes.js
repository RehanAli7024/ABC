const express = require('express');
const router = express.Router();
const User = require('../models/User.model');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// Get user profile
router.get('/profile', auth, async (req, res) => {
  res.send(req.user);
});

// Update user profile
router.patch('/profile', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['firstName', 'lastName', 'email', 'password', 'bio', 'phoneNumber', 'address'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    updates.forEach((update) => req.user[update] = req.body[update]);
    await req.user.save();
    res.send(req.user);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post('/profile-picture', auth, upload.single('profilePicture'), async (req, res) => {
  try {
    req.user.uploadProfilePicture(req.file);
    await req.user.save();
    res.send({ message: 'Profile picture uploaded successfully' });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post('/resume', auth, upload.single('resume'), async (req, res) => {
  try {
    req.user.uploadResume(req.file);
    await req.user.save();
    res.send({ message: 'Resume uploaded successfully' });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get('/profile-picture', auth, async (req, res) => {
  try {
    if (!req.user.profilePicture) {
      throw new Error('No profile picture found');
    }
    res.sendFile(req.user.profilePicture);
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
});
router.post('/register', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

// User login
router.post('/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password);
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get user profile
router.get('/profile', auth, async (req, res) => {
  res.send(req.user);
});

// Update user profile
router.patch('/profile', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['firstName', 'lastName', 'email', 'password', 'bio', 'phoneNumber', 'address'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    updates.forEach((update) => req.user[update] = req.body[update]);
    await req.user.save();
    res.send(req.user);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post('/profile-picture', auth, upload.single('profilePicture'), async (req, res) => {
    try {
      req.user.uploadProfilePicture(req.file);
      await req.user.save();
      res.send({ message: 'Profile picture uploaded successfully' });
    } catch (error) {
      res.status(400).send(error);
    }
  });
  
  // Resume upload
  router.post('/resume', auth, upload.single('resume'), async (req, res) => {
    try {
      req.user.uploadResume(req.file);
      await req.user.save();
      res.send({ message: 'Resume uploaded successfully' });
    } catch (error) {
      res.status(400).send(error);
    }
  });
  
  
  
  // Get profile picture
  router.get('/profile-picture', auth, async (req, res) => {
    try {
      if (!req.user.profilePicture) {
        throw new Error('No profile picture found');
      }
      res.sendFile(req.user.profilePicture);
    } catch (error) {
      res.status(404).send({ error: error.message });
    }
  });

module.exports = router;
