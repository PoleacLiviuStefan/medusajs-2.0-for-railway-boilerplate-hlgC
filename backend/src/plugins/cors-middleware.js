const cors = require("cors");

const corsMiddleware = () => {
  return (req, res, next) => {
    const corsOptions = {
      origin: "http://localhost:8000",
      credentials: true,
    };
    cors(corsOptions)(req, res, next);
  };
};

module.exports = corsMiddleware;
