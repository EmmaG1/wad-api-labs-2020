import express from 'express';
import {
  getMovies, getMovie, getMovieReviews
} from '../tmdb-api';
import movieModel from './movieModel' //new

const router = express.Router();
//old / get
// router.get('/', (req, res,next) => {
//   getMovies()
//   .then(movies => res.status(200).send(movies))
//   .catch((error) => next(error));
// });

//new ssssss
router.get('/', (req, res, next) => {
  movieModel.find().then(movies => res.status(200).send(movies)).catch(next);
});

//old id get
// router.get('/:id', (req, res, next) => {
//   const id = parseInt(req.params.id);
//   getMovie(id)
//   .then(movie => res.status(200).send(movie))
//   .catch((error) => next(error));
// });

//new
router.get('/:id', (req, res, next) => {
  const id = parseInt(req.params.id);
  movieModel.findByMovieDBId(id).then(movie => res.status(200).send(movie)).catch(next);
});

router.get('/:id/reviews', (req, res, next) => {
  const id = parseInt(req.params.id);
  getMovieReviews(id)
  .then(reviews => res.status(200).send(reviews))
  .catch((error) => next(error));
});

export default router;