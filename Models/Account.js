var mongoose = require("mongoose");
const Schema = mongoose.Schema;
const accountSchema = new Schema({
  email: {
    type: String,
  },
  password: {
    type: String,
  }
});
const Account = mongoose.model("Account", accountSchema);

module.exports = Account;