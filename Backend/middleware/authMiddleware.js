import jwt from "jsonwebtoken";

const ensureAuthenticated = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(403).json({ message: "Unauthorized, token required" });
  }

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;   
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default ensureAuthenticated;
