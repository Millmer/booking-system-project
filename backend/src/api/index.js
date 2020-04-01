const uuid = require('uuid');
const { Router } = require('express');
const Services = require('./../services');
const { hasRole } = require('./auth/utils');
const router = new Router();

const auth = require('./auth');
const bookings = require('./bookings');
const countries = require('./countries');
const cities = require('./cities');
const locations = require('./locations');
const users = require('./users');

router.use('/api/auth', auth);
router.use('/api/bookings', bookings);
router.use('/api/countries', countries);
router.use('/api/cities', cities);
router.use('/api/locations', locations);
router.use('/api/users', users);


/**
 * @api {post} /api/signed-image-upload      Sign S3 Upload URL
 * @apiName SignImageUpload
 * @apiGroup S3
 * @apiPermission Host
*/
router.post('/api/signed-image-upload', hasRole('HOST'), async (req, res) => {
  if (!req.body.folder || typeof req.body.folder !== 'string') res.status(400).json({ message: 'Upload folder required' });
  const allowedAdminFolders = ['cities', 'locations'];
  const allowedHostFolders = ['locations'];
  const isAllowedFolderAccess = (req.user.role === 'HOST') ? allowedHostFolders.includes(req.body.folder) : allowedAdminFolders.includes(req.body.folder);
  if (!isAllowedFolderAccess) res.status(403).json({ message: `Access Denied to folder ${req.body.folder}` });

  const acl = req.query.acl || 'public-read';
  const Key = `public/${req.body.folder}/`;
  const Bucket = process.env.IMAGE_UPLOAD_BUCKET;
  const Expires = 600; // 10 minutes
  
  // Enforce S3 to use a base path we enforce
  const params = {
    Bucket,
    Expires,
    Conditions: [
      ['eq', '$acl', acl],
      ["starts-with", "$Content-Type", "image/"],
      ['starts-with', '$key', Key]
    ]
  };

  try {
    const payload = await Services.Amazon.createPresignedPost(params);
    
    // Use interpolated key for S3
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#createPresignedPost-property
    const [identifier] = uuid().split('-');
    payload.fields.key = `public/${req.body.folder}/${identifier}-` + '${filename}';

    res.status(200).json(payload);
  } catch (error) {
    console.error(`signed-image-upload >> Error: ${error.stack}`);
    res.status(500).json({ message: 'Upload failed' });
  }
});

module.exports = router;