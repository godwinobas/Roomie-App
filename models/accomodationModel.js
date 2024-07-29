import mongoose from 'mongoose';

const accomodationSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  mapData: {
    type: String,
    required: true,
  },
  pictures: [
    {
      type: String,
      required: true,
    },
  ],
  description: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
});

export const Accomodation = mongoose.model('Accomodation', accomodationSchema);
