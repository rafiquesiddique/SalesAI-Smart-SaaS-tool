const express = require('express');
const Lead = require('../models/Lead');

const router = express.Router();

// Get all leads
router.get('/', async (req, res) => {
  try {
    const { limit = 50, sort = '-createdAt' } = req.query;
    
    const leads = await Lead.find({ created_by: req.user._id })
      .sort(sort)
      .limit(parseInt(limit))
      .populate('created_by', 'name email');

    res.json({
      success: true,
      data: leads
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Create lead
router.post('/', async (req, res) => {
  try {
    const leadData = {
      ...req.body,
      created_by: req.user._id
    };

    const lead = new Lead(leadData);
    await lead.save();

    res.status(201).json({
      success: true,
      data: lead,
      message: 'Lead created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Update lead
router.put('/:id', async (req, res) => {
  try {
    const lead = await Lead.findOneAndUpdate(
      { _id: req.params.id, created_by: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    res.json({
      success: true,
      data: lead,
      message: 'Lead updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Delete lead
router.delete('/:id', async (req, res) => {
  try {
    const lead = await Lead.findOneAndDelete({
      _id: req.params.id,
      created_by: req.user._id
    });

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    res.json({
      success: true,
      message: 'Lead deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;