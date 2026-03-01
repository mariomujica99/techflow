const mongoose = require('mongoose');

const ProviderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    profileColor: { type: String, default: null },
    email: { type: String, default: '' },
    phoneNumber: { type: String, default: '' },
    pagerNumber: { type: String, default: '' },
    officeNumber: { type: String, default: '' },
    departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Provider', ProviderSchema);