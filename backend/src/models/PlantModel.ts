const plantSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        type: {type:String, required: true},
        location: {type:String, required: true},
        limitWatering: {
            min: {type:Number},
            max: {type:Number}
        },
        limitTemp:{
            min: {type:Number},
            max: {type:Number}
        }
    },
    {timestamps: true}
);
const Plant = mongoose.model('Plant', plantSchema);
module.exports = Plant;