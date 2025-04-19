const mongoose = require('mongoose');
const ActionDevice = require('./ActionDevice');
const DedicatedDeviceSchema = new mongoose.Schema(
    {
      _id: { type: Number,unique: true, required: true },
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
  