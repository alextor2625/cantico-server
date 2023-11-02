const { Schema, model } = require("mongoose");

const playlistSchema = new Schema(
  {
    name: {type: String, default:"My Songs"},
    songs: [{ type: Schema.Types.ObjectId, ref: "Songs" }],
  },
  {
    timestamps: true,
  }
);

module.exports = model("Playlist", playlistSchema);
