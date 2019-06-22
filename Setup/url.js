const { MONGO_USERNAME, MONGO_PASSWORD, MONGO_SECRET } = process.env;
module.exports = {
  url: `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@ds036617.mlab.com:36617/easysolve`,
  secret: `${MONGO_SECRET}`
};
