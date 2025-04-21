const mongoose = require('mongoose');
import ActionDevice from './ActionDevice';
const DedicatedDeviceSchema = new mongoose.Schema(
    {
      _id: { type: Number,required: true },
      devicetype: {
        type: String,
        enum: ['pump','soil'],
        required: true
      },
      value:{type: Number},
      timeAction: {type: Date},
    }
  );
  const DedicatedDevice = ActionDevice.discriminator('DedicatedDevice', DedicatedDeviceSchema);
  export default DedicatedDevice;
  