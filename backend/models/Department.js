const mongoose = require('mongoose');

const DepartmentSchema = new mongoose.Schema(
  {
    departmentName: { type: String, required: true },
    departmentToken: { type: String, required: true, unique: true },
    departmentAdminToken: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Department', DepartmentSchema);