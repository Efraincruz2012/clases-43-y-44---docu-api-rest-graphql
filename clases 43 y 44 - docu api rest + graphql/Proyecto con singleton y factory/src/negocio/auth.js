const jwt = require("jsonwebtoken");

function generateToken(user) {
  const token = jwt.sign({ data: user }, process.env.PRIVATE_KEY, { expiresIn: '24h' });
  return token;
}

const auth = (req, res, next) => {
  const token = req.cookies['user'];

  jwt.verify(token, process.env.PRIVATE_KEY, (err, decoded) => {
    if (err) {
      return res.render('login' );
    }

    req.user = decoded.data;
    next();
  });

};

module.exports = {
  generateToken, 
  auth
}
