require('dotenv').config();
const connectDB = require('../config/db');
const Department = require('../models/Department');

const seed = async () => {
  await connectDB();

  const existing = await Department.findOne({ departmentToken: 'DemoDept549984' });
  if (existing) {
    console.log('Department already exists:', existing.departmentName);
    process.exit(0);
  }

  const department = await Department.create({
    departmentName: 'Demonstration Department',
    departmentToken: 'DemoDept549984',
    departmentAdminToken: '973242',
  });

  console.log('Department seeded:', department);
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});