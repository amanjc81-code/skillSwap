import mongoose from 'mongoose';

const slotSchema = new mongoose.Schema(
  {
    dayOfWeek: {
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      required: true
    },
    startTime: {
      type: String, // HH:mm format, e.g. "17:00"
      required: true,
      match: /^([01]\d|2[0-3]):([0-5]\d)$/
    },
    endTime: {
      type: String, // HH:mm format, e.g. "19:00"
      required: true,
      match: /^([01]\d|2[0-3]):([0-5]\d)$/
    }
  },
  { _id: false }
);

const availabilitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true
    },
    timezone: {
      type: String,
      default: 'Asia/Kolkata'
    },
    slots: [slotSchema]
  },
  {
    timestamps: true
  }
);

export const Availability = mongoose.model('Availability', availabilitySchema);
