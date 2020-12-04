import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const MovieSchema = new Schema({
    id: {type: Number, required: true}, //week 9 added id:{ , required:true}
    name: {type: String, required: true} //week 9 added ^
    
  });

const UserSchema = new Schema({
  username: { type: String, unique: true, required: true},
  password: {type: String, required: true },
  favourites: [MovieSchema]
});



export default mongoose.model('User', UserSchema);