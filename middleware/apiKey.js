module.exports = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== process.env.ADMIN_API_KEY) {
      return res.status(403).json({ error: 'Invalid API Key' });
  }
  next();
};
