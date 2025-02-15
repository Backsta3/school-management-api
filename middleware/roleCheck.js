module.exports = (role) => {
  return (req, res, next) => {
    const userRole = req.user['https://yourapp.com/role']; // Custom claim in JWT
    if (userRole === role || userRole === 'admin') {
      next();
    } else {
      res.status(403).send('Forbidden: You do not have permission to access this route.');
    }
  };
}