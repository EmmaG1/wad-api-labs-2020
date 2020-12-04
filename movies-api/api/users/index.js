import express from 'express';
import User from './userModel';

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
router.post('/', (req, res ,next) => {
    User.create(req.body).then(user => res.status(200).json({success:true,token:"FakeTokenForNow"})).catch(next);
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