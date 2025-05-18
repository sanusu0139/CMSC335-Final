const mongoose = require("mongoose");
const pokemonSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    equipped: {
      type: Boolean,
      default: false
    },
    inBox: {
      type: Boolean,
      default: false
    }
});

module.exports = mongoose.model("Pokemon", pokemonSchema);