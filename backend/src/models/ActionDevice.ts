const mongoose = require('mongoose');
const actionDeviceSchema = new mongoose.Schema(
  {
    name:       { type: String, required: true,unique: true },
    type:       { type: String, enum: ['DedicatedDevice', 'SharedDevice'], required: true },
    status:     { type: String, enum: ['active', 'inactive'], default: 'active' },
    feed_key:   { type: String, required: true, unique: true },
    user:       { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true,
    discriminatorKey: 'type',
   }
);
const ActionDevice = mongoose.model('ActionDevice', actionDeviceSchema);
export default ActionDevice;

