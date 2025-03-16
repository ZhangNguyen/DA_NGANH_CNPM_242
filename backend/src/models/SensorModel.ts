const sensorSchema = new mongoose.Schema(
    {
      name: { type: String, required: true },
  
      type: {
        type: String,
        enum: ['light', 'temperature', 'humidity'],
        required: true
      },
  
      status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'inactive'
      },
  
      data: { type: Number},
  
      recordedAt: {  //  Thời gian sensor đo, lấy từ Adafruit IO 
        type: Date,
      },
  
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    },
    { timestamps: true }  //  createdAt và updatedAt 
  );
  
  const Sensor = mongoose.model('Sensor', sensorSchema);
  export default Sensor;
  