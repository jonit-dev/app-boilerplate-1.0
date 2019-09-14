const bcrypt = require("bcryptjs");

const hashPassword = async password => {
  return await bcrypt.hash(password, 8);
};

module.exports = {
  hashPassword
};
