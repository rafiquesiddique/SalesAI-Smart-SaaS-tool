const express = require('express');
const Activity = require('../models/Activity');

const router = express.Router();

// Get all activities
router.get('/', async (req, res) => {
  try {
    const { limit = 50, sort = '-createdAt' } = req.query;
    
    const activities = await Activity.find({ created_by: req.user._id })
      .sort(sort)
      .limit(parseInt(limit))
      .populate('lead_id', 'name company')
      .populate('created_by', 'name email');

    res.json({
      success: true,
      data: activities
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Create activity
router.post('/', async (req, res) => {
  try {
    const activityData = {
      ...req.body,
      created_by: req.user._id
    };

    const activity = new Activity(activityData);
    await activity.save();

    await activity.populate('lead_id', 'name company');

    res.status(201).json({
      success: true,
      data: activity,
      message: 'Activity created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Update activity
router.put('/:id', async (req, res) => {
  try {
    const activity = await Activity.findOneAndUpdate(
      { _id: req.params.id, created_by: req.user._id },
      req.body,
      { new: true, runValidators: true }
    ).populate('lead_id', 'name company');

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found'
      });
    }

    res.json({
      success: true,
      data: activity,
      message: 'Activity updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;