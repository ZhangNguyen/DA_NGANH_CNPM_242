
const actionDeviceSchema = new mongoose.Schema(
  {
    name:       { type: String, required: true },
    type:       { type: String, enum: ['pump','fan'], required: true },
    status:     { type: String, enum: ['active', 'inactive'], default: 'inactive' },
    isPumping:  { type: Boolean, default: false },
    isFanning:  { type: Boolean, default: false },// Manage Plant
    timeaction: {  type: Date,}
  },
  { timestamps: true }
);

const ActionDevice = mongoose.model('ActionDevice', actionDeviceSchema);
module.exports = ActionDevice;
