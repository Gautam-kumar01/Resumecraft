const mongoose = require('mongoose');

const activeVisitorSchema = new mongoose.Schema({
  visitorId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: 128
  },
  lastSeenAt: {
    type: Date,
    required: true,
    default: Date.now,
    expires: 120
  }
}, {
  versionKey: false
});

module.exports = mongoose.models.ActiveVisitor || mongoose.model('ActiveVisitor', activeVisitorSchema);

