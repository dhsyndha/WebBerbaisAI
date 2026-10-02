import app from "../server.mjs";

export default (req, res) => {
  req.url = req.url.replace(/^\/api(?=\/|$)/, "") || "/";
  app(req, res);
};