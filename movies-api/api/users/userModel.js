import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';

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

UserSchema.statics.findByUserName = function (username) {
  return this.findOne({ username: username });
};
//old 
// UserSchema.methods.comparePassword = function (candidatePassword) {
//   const isMatch = this.password === candidatePassword;
//   if (!isMatch) {
//     throw new Error('Password mismatch');
//   }
//   return this;
// };

//added 11/12
UserSchema.methods.comparePassword = function(passw, cb) {
  bcrypt.compare(passw, this.password, (err, isMatch) => {
      if (err) {
          return cb(err);
      }
      cb(null, isMatch);
  });
};


UserSchema.pre('save', function(next) {
  const user = this;
  if (this.isModified('password') || this.isNew) {
      bcrypt.genSalt(10, (err, salt)=> {
          if (err) {
              return next(err);
          }
          bcrypt.hash(user.password, salt, null, (err, hash)=> {
              if (err) {
                  return next(err);
              }
              user.password = hash;
              next();
          });
      });
  } else {
      return next();
  }
});



export default mongoose.model('User', UserSchema);