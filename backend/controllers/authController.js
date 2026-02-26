const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const deleteImageFile = require('../utils/deleteImageFile');
const Department = require('../models/Department');

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '14d' });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, profileImageUrl, profileColor, adminInviteToken, phoneNumber, pagerNumber, departmentInviteToken } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Department Token Check
    const department = await Department.findOne({ departmentToken: departmentInviteToken });
    if (!department) {
      return res.status(401).json({ 
        message: 'Invalid Invite Token. Please try again or contact the admin for the code.' 
      });
    }

    // Determine user role
    let role = 'member';
    if (adminInviteToken && adminInviteToken === department.departmentAdminToken) {
      role = 'admin';
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      profileImageUrl,
      profileColor,
      role,
      phoneNumber: phoneNumber || '',
      pagerNumber: pagerNumber || '',
      departmentId: department._id,
    });

    await user.populate('departmentId', 'departmentName');

    // Return user data with JWT
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImageUrl: user.profileImageUrl,
      profileColor: user.profileColor,
      phoneNumber: user.phoneNumber,
      pagerNumber: user.pagerNumber,
      token: generateToken(user._id),
      departmentId: user.departmentId,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    await user.populate('departmentId', 'departmentName');

    // Return user data with JWT
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImageUrl: user.profileImageUrl,
      profileColor: user.profileColor,
      departmentId: user.departmentId,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private (Requires JWT)
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password').populate('departmentId', 'departmentName');
    if (!user) {
      return res.status(404).json({ message: 'User not found'});
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private (Requires JWT)
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const oldImageUrl = user.profileImageUrl;
    const oldPublicId = user.profileImagePublicId;

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phoneNumber = req.body.phoneNumber !== undefined ? req.body.phoneNumber : user.phoneNumber;
    user.pagerNumber = req.body.pagerNumber !== undefined ? req.body.pagerNumber : user.pagerNumber;
    
    // Handle profile image/color updates
    if (req.body.profileImageUrl !== undefined) {
      // User uploaded a new image - delete old one
      if (req.body.profileImageUrl && oldImageUrl && req.body.profileImageUrl !== oldImageUrl) {
        await deleteImageFile(oldImageUrl, oldPublicId);
      }
      // User switched to color - delete old image
      else if (req.body.profileImageUrl === null && oldImageUrl) {
        await deleteImageFile(oldImageUrl, oldPublicId);
      }
      user.profileImageUrl = req.body.profileImageUrl;
      user.profileImagePublicId = req.body.profileImagePublicId || null;
    }
    
    user.profileColor = req.body.profileColor !== undefined ? req.body.profileColor : user.profileColor;

    // Handle admin role upgrade
    if (req.body.adminInviteToken) {
      const dept = await Department.findById(user.departmentId);
      if (dept && req.body.adminInviteToken === dept.departmentAdminToken) {
        user.role = 'admin';
      }
    }

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    const updatedUser = await user.save();

    await updatedUser.populate('departmentId', 'departmentName');

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      profileImageUrl: updatedUser.profileImageUrl,
      profileColor: updatedUser.profileColor,
      phoneNumber: updatedUser.phoneNumber,
      pagerNumber: updatedUser.pagerNumber,
      departmentId: updatedUser.departmentId,
      token: generateToken(updatedUser._id),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc Delete current user account
// @route DELETE /api/auth/profile
// @access Private
const deleteUserAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete profile image if exists
    if (user.profileImageUrl) {
      await deleteImageFile(user.profileImageUrl, user.profileImagePublicId);
    }

    await user.deleteOne();
    res.json({ message: 'User account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { registerUser, loginUser, getUserProfile, updateUserProfile, deleteUserAccount };