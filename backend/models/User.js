const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImageUrl: { type: String, default: null },
    profileImagePublicId: { type: String, default: null },
    profileColor: { type: String, default: null },
    role: { type: String, enum: ['admin', 'member'], default: 'member' },
    phoneNumber: { type: String, default: '' },
    pagerNumber: { type: String, default: '' },
    departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);