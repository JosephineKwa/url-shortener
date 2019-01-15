const mongoose = require('mongoose');
const common = require(`${__dirname}/../lib/common`);

const urlSchema = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now },
  modifiedAt: { type: Date, default: Date.now },
  original: { type: String, required: true },
  short: { type: String, required: true, unique: true },
  expiresAt: {
    type: Date, default: function() {
      if (this.expiryTime === -1) {
        return null;
      }

      const d = new Date();
      return d.setSeconds(d.getSeconds() + this.expiryTime);
    }
  },
  expiryTime: { type: Number, default: common.SECONDS_1_DAY }
});

module.exports = mongoose.model('Url', urlSchema);