const { Schema, model } = require('mongoose');
const { isFlag } = require('../utils');

const ObjectId = Schema.Types.ObjectId;

const teamSchema = new Schema(
  {
    name: { type: String, required: true },
    code: {
      type: String,
      required: [true, 'El código es requerido'],
      validate: [
        (code) => code.length === 2,
        'El código debe tener 2 caracteres',
      ],
    },
    flag: { type: String, required: true, validate: isFlag },
    goalsScored: [{ type: ObjectId, ref: 'Goal' }],
    goalsConceded: [{ type: ObjectId, ref: 'Goal' }],
  },
  {
    timestamps: true,
  }
);

module.exports = model('Team', teamSchema);
