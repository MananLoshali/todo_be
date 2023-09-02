import jwt from "jsonwebtoken";

//VERIFY USER HAS ACCESS TOKEN
export const verifyToken = (req, res, next) => {
  const authHeaders = req.headers.token;
  if (authHeaders) {
    const token = authHeaders.split(" ")[1];
    jwt.verify(token, process.env.JWT_SEC_KEY, (err, user) => {
      if (err) {
        return res.status(403).send({ error: err, msg: "ERROR IN JWT TOKEN" });
      } else {
        req.user = user;
        next();
      }
    });
  } else {
    return res.status(401).send({ msg: "You are not authenticated" });
  }
};

//USER HAS ACCESS TOKEN AND IT IS CORRECT USER HAVING ID SAME IN (REQUEST.PARAMS) OR IT IS ADMIN
export const verifyTokenAndAutherization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.params.id === req.user.id || req.user.isAdmin) {
      next();
    } else {
      return res
        .status(403)
        .send({ msg: "You are not correct user to access todos." });
    }
  });
};

//VERIFY USER HAS ACCESS TOKEN AND HE IS ADMIN
export const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(403).send({ msg: "You are not allowed to do that" });
    }
  });
};
