import express from 'express';
import User from './userModel';
import jwt from 'jsonwebtoken';

const router = express.Router(); // eslint-disable-line

// old Get all users
router.get('/', (req, res, next) => { //added next here
    User.find().then(users =>  res.status(200).json(users)).catch(next); //added .catch(next) here
});

router.get('/:userName/favourites', (req, res, next) => {
    const user = req.params.userName;
    User.find( {username: user}).then(
        user => res.status(201).send(user.favourites)
    ).catch(next);
  });


// old post register
// router.post('/', (req, res ,next) => {
//     User.create(req.body).then(user => res.status(200).json({success:true,token:"FakeTokenForNow"})).catch(next);
// });

//added 11/12
// Register OR authenticate a user
router.post('/', async (req, res, next) => {
  if (!req.body.username || !req.body.password) {
    res.status(401).json({
      success: false,
      msg: 'Please pass username and password.',
    });
  }
  if (req.query.action === 'register') {
    await User.create(req.body).catch(next);
    res.status(201).json({
      code: 201,
      msg: 'Successful created new user.',
    });
  } else {
    const user = await User.findByUserName(req.body.username).catch(next);
      if (!user) return res.status(401).json({ code: 401, msg: 'Authentication failed. User not found.' });
      user.comparePassword(req.body.password, (err, isMatch) => {
        if (isMatch && !err) {
          // if user is found and password is right create a token
          const token = jwt.sign(user.username, process.env.secret);
          // return the information including token as JSON
          res.status(200).json({
            success: true,
            token: 'BEARER ' + token,
          });
        } else {
          res.status(401).json({
            code: 401,
            msg: 'Authentication failed. Wrong password.'
          });
        }
      });
    }
});


//new post added in week 9 lab
router.post('/:userName/favourites', (req, res, next) => {
    const newFavourite = req.body;
    const query = {username: req.params.userName};
    if (newFavourite && newFavourite.id) {
      User.find(query).then(
        user => {
          (user.favourites)?user.favourites.push(newFavourite):user.favourites =[newFavourite];
          User.findOneAndUpdate(query, {favourites:user.favourites}, {
            new: true, runValidators: true //added runValidators: true
          }).then(user => res.status(201).send(user)); 
        }
      ).catch(next);
    } else {
        res.status(401).send("Unable to find user")
    }
  });

// Update a user
router.put('/:id',  (req, res, next) => { //added next here
    if (req.body._id) delete req.body._id;
     User.update({
      _id: req.params.id,
    }, req.body, {
      upsert: false,
    })
    .then(user => res.json(200, user)).catch(next); //added .catch(next) here
});
export default router;