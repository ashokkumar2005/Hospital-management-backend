const SOSAlert = require('../models/SOSAlert');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const Hospital = require('../models/Hospital');

const triggerSOS = async (req, res, next) => {
  try {
    const { lat, lng, address } = req.body;
    const user = await User.findById(req.user._id);

    const alert = await SOSAlert.create({ user: req.user._id, location: { lat, lng, address } });

    // Find nearest hospitals for the response
    const nearbyHospitals = await Hospital.find({
      location: { $near: { $geometry: { type: 'Point', coordinates: [lng, lat] }, $maxDistance: 15000 } },
    }).limit(3);

    // Send emergency email to emergency contact
    if (user.emergencyContact?.email) {
      try {
        await sendEmail({
          to: user.emergencyContact.email,
          subject: '🚨 SOS EMERGENCY ALERT',
          html: `<h1 style="color:red">🚨 EMERGENCY SOS ALERT</h1>
                 <p><strong>${user.name}</strong> has triggered an emergency SOS!</p>
                 <p>Location: ${address || `Lat: ${lat}, Lng: ${lng}`}</p>
                 <p>Time: ${new Date().toLocaleString()}</p>
                 <p>Please contact them immediately or call emergency services.</p>`,
        });
        alert.sentToEmergencyContact = true;
        await alert.save();
      } catch (e) { console.log('SOS email failed:', e.message); }
    }

    res.json({ success: true, alert, nearbyHospitals });
  } catch (err) { next(err); }
};

const getSOSHistory = async (req, res, next) => {
  try {
    const alerts = await SOSAlert.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, alerts });
  } catch (err) { next(err); }
};

module.exports = { triggerSOS, getSOSHistory };
