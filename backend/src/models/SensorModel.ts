const mongoose = require('mongoose');
const sensorSchema = new mongoose.Schema(
    {
      _id: { type: Number,unique: true, required: true },
      name: { type: String, required: true},
  
      type: {
        type: String,
        enum: ['light', 'temperature','humidity'],
        required: true
      },
  
      status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
      },
      timeUpdate: { type: Date},
      feedKey: { type: String, required: true},
      newestdata: { type: Number},
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    },
    { timestamps: true }  //  createdAt và updatedAt 
  );
  // sensorSchema.index({ feedKey: 1, user: 1 }, { unique: true });
  const Sensor = mongoose.model('Sensor', sensorSchema);
  export default Sensor;
  