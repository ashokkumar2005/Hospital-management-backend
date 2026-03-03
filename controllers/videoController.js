const Video = require('../models/Video');

const getVideos = async (req, res, next) => {
  try {
    const { category } = req.query;
    const filter = { isActive: true };
    if (category) filter.category = category;
    const videos = await Video.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: videos.length, videos });
  } catch (err) { next(err); }
};

const extractYoutubeId = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

const addVideo = async (req, res, next) => {
  try {
    const { youtubeUrl, ...rest } = req.body;
    let youtubeId = rest.youtubeId;

    if (youtubeUrl && !youtubeId) {
      youtubeId = extractYoutubeId(youtubeUrl);
    }

    if (!youtubeId) {
      return res.status(400).json({ success: false, message: 'Could not extract valid YouTube ID. Please check the URL.' });
    }

    const video = await Video.create({ ...rest, youtubeId, addedBy: req.user._id });
    res.status(201).json({ success: true, video });
  } catch (err) { next(err); }
};

const deleteVideo = async (req, res, next) => {
  try {
    await Video.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Video deleted' });
  } catch (err) { next(err); }
};

module.exports = { getVideos, addVideo, deleteVideo };
