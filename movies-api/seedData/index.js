import userModel from '../api/users/userModel';
import {movies} from './movies.js';
import movieModel from '../api/movies/movieModel' //new

const users = [
  {
    'username': 'user1',
    'password': 'test1',
  },
  {
    'username': 'user2',
    'password': 'test2',
  },
];

//deletes all user documents in collection and inserts test data OLD
// export async function loadUsers() {
//   console.log('load user Data');
//     try {
//       await userModel.deleteMany();
//       await userModel.collection.insertMany(users);
//       console.info(`${users.length} users were successfully stored.`);
//     } catch (err) {
//       console.error(`failed to Load user Data: ${err}`);
//     }
//   }

//new
export async function loadUsers() {
  console.log('load user Data');
    try {
      await userModel.deleteMany();
      await users.forEach(user => userModel.create(user));
      console.info(`${users.length} users were successfully stored.`);
    } catch (err) {
      console.error(`failed to Load user Data: ${err}`);
    }
  }

  // deletes all movies documents in collection and inserts test data
export async function loadMovies() {
  console.log('load seed data');
  console.log(movies.length);
  try {
    await movieModel.deleteMany();
    await movieModel.collection.insertMany(movies);
    console.info(`${movies.length} Movies were successfully stored.`);
  } catch (err) {
    console.error(`failed to Load movie Data: ${err}`);
  }
}