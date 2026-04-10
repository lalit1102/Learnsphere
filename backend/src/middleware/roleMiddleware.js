const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if(!req.user || !roles.includes(req.user.role)){
      return res.status(403).json({ message: `Access denied for role: ${req.user?req.user.role:"Unknown"}` });
    }
    next();
  };
};

export default authorizeRoles;