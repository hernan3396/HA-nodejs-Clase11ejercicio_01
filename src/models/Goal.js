const { Schema, model } = require('mongoose');
const ObjectId = Schema.Types.ObjectId;

const goalSchema = new Schema(
  {
    author: { type: String, required: true },
    minute: { type: Number, required: true, min: 0, max: 90 },
    goalFor: {
      required: true,
      type: ObjectId,
      ref: 'Team',
    },
    goalAgainst: {
      required: true,
      type: ObjectId,
      ref: 'Team',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model('Goal', goalSchema);
