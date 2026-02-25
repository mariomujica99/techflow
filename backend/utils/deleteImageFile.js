const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;

const deleteImageFile = async (imageUrl, publicId) => {
  if (!imageUrl) return;

  try {
    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
    } else {
      // fallback for any legacy local files
      const filename = imageUrl.split('/uploads/')[1];
      if (filename) {
        const filePath = path.join(__dirname, '..', 'uploads', filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    }
  } catch (error) {
    console.error('Error deleting image file:', error);
  }
};

module.exports = deleteImageFile;