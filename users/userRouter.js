const express = require('express');
const User = require('./userDb');



const router = express.Router();

router.use((req, res, next) => {
  console.log('user router!');
  next();
});


router.post('/', requiredBody, (req, res) => {
  User.insert(req.body)
  .then(user => {
    res.status(200).json(user);
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({
      message: 'error adding the user'
    });
  });
});

router.post('/:id/posts',  [validateUserId, validatePost ,requiredBody],  async (req, res) => {
  const postInfo = { ...req.body, user_id: req.params.id}
  try {
    const post = await User.add(postInfo);
    res.status(201).json(postInfo);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err });

  }
  
});

router.get('/', validateUser, getHandler);

router.get('/:id', validateUserId, (req, res) => {
  res.status(200).json(req.user);
});

router.get('/:id/posts', validatePost, (req, res) => {
  res.status(200).json(req.userPost);
});

router.delete('/:id', validateUserId, (req, res) => {
  User.remove(req.params.id)
  .then(user => {
    if (user > 0) {
      res.status(200).json({ message: 'The user has been deleted'})
    } else {
      res.status(404).json({ message: 'the post was not found '})
    }
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({message: 'Error removing the post', error})
  })
});

router.put('/:id', [validateUserId, requiredBody] ,(req, res) => {
  User.update(req.params.id, req.body)
  .then(user => {
    if (user) {
      res.status(200).json(req.body);
    } else {
      res.status(404).json({message: 'the user could not be found '})
    }
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({message: 'Error updating the user', error })
  })
});

//custom middleware

function validateUserId(req, res, next) {
  const { id } = req.params;
  User.getById(id)
  .then(user => {
    if(user){
      req.user = user;
      next()
    } else {
      next(new Error('does not exist ya foo! '));
    }
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({message: 'exception', err});
  });
}

function validateUser(req, res, next) {
  const name = req.body;
  User.get(name)
  .then( user => {
    if(user){
      req.user = user
      next()
    } else {
      next(new Error('No user found'))
    }
  })
  .catch( err => {
    console.log(err);
    res.status(500).json({message: ' exception ' , err})
  })
}

function validatePost(req, res, next) {
  const { id } = req.params;
  User.getUserPosts(id)
  .then(userPost => {
    if(userPost){
      req.userPost = userPost;
      next()
    } else {
      next(new Error('does not exist ya foo! '));
    }
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({message: 'exception', err});
  });
}

function getHandler(req, res) {
  User.get(req.query)
    .then(user => {
      res.status(200).json(user);
    })
    .catch(error => {
      // log error to server
      console.log(error);
      res.status(500).json({
        message: 'Error retrieving the posts',
      });
    });
}


function requiredBody(req, res, next){
  if (req.body || req.body !== {}) {
    next();
  } else {
    res.status(400).json({message: 'Please include request body'})
  }
  }

module.exports = router;
