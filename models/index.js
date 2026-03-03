const mongoose = require('mongoose');

// Unified model exports to prevent "OverwriteModelError"
// We import from the individual files but ensure we use the same model names
// as expected by different controllers.

const Notification = require('./Notification');
const SOSAlert = require('./SOSAlert');
const Feedback = require('./Feedback');
const Video = require('./Video');

// In case some controllers expect "HealthVideo" or "HealthRecord"
// we provide them here if they aren't already separate.

module.exports = {
  Notification,
  SOSAlert,
  Feedback,
  HealthVideo: Video, // mainController uses HealthVideo but it points to Video model
};
