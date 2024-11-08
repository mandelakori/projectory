const express = require('express');
const Project = require('../models/Project');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Middleware to protect routes
const protect = (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Not authorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Not authorized' });
  }
};

// Create Project
router.post('/', protect, async (req, res) => {
  const { title, description, requiredSkills } = req.body;

  try {
    const project = new Project({
      title,
      description,
      requiredSkills,
      createdBy: req.user,
    });

    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: 'Error creating project' });
  }
});

// Get All Projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching projects' });
  }
});

module.exports = router;
