//load dotenv to get accces to the vars in .env
const envs = require('dotenv').config();
const superagent = require('superagent');
// callback
superagent
  .post('/api/pet')
  .send({ name: 'Manny', species: 'cat' }) // sends a JSON post body
  .set('X-API-Key', 'foobar')
  .set('accept', 'json')
  .end((err, res) => {
    // Calling the end function will send the request
    console.log('done');
  });
