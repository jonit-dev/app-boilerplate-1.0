import { model, Schema } from 'mongoose';

const logSchema: Schema = new Schema(
  {
    action: {
      type: String
    },
    emitter: {
      type: Schema.Types.ObjectId
    },
    target: {
      type: Schema.Types.ObjectId
    }
  },
  {
    timestamps: true
  }
);

export const Log = model("Log", logSchema);
