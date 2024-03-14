const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
  if (req.path === '/user/signup' || req.path === '/user/login') {
    return next();
  }
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).send('Authorization token missing');
  }

  try {
    const decoded = jwt.verify(token, '1234');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).send('Invalid token');
  }
};

module.exports = authenticateUser;



