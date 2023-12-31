const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    userType: {type: String, default: "User"},
    name: { type: String, trim:true, unique: false, required: true },
    lastname: { type: String, trim:true, unique: false, required: true },
    email: { type: String, trim:true, unique: true, required: true },
    telephone: { type: String, trim:true, unique: true, required: true },
    password: { type: String, required: true },
    playlist: [{ type: Schema.Types.ObjectId, ref: "Playlist" }], // Change this to an array
    admin: {type: Boolean, default:false}, // Gave a default false to admin
  },
  {
    timestamps: true,
  }
);

module.exports = model("User", userSchema);
