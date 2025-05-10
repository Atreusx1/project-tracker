import mongoose, { Schema, Document } from 'mongoose';

export interface IWorkSession extends Document {
  user: mongoose.Types.ObjectId;
  project: mongoose.Types.ObjectId;
  startTime: Date;
  endTime?: Date;
  description?: string;
}

const workSessionSchema = new Schema<IWorkSession>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date },
    description: { type: String },
  },
  { timestamps: true }
);

export const WorkSessionModel = mongoose.model<IWorkSession>('WorkSession', workSessionSchema);