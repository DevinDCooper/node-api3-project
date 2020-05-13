const express = require('express');
const Post = require('./postDb')


const router = express.Router();

router.use((req, res, next) => {
  console.log('post router!');
  next();
});

router.get('/', getHandler);



router.get('/:id', validatePostId ,(req, res) => {
  res.status(200).json(req.post);
});

router.delete('/:id', validatePostId, (req, res) => {
  Post.remove(req.params.id)
  .then(post => {
    if (post > 0) {
      res.status(200).json({ message: 'The post has been deleted'})
    } else {
      res.status(404).json({ message: 'the post was not found '})
    }
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({message: 'Error removing the post', error})
  })
});

router.put('/:id', [validatePostId, requiredBody ], (req, res) => {
  Post.update(req.params.id, req.body)
  .then(post => {
    if (post) {
      res.status(200).json(req.body);
    } else {
      res.status(404).json({message: 'the post could not be found '})
    }
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({message: 'Error updating the post', error })
  })
});

// custom middleware

function validatePostId(req, res, next) {
  const { id } = req.params;
  Post.getById(id)
  .then(post => {
    if(post){
      req.post = post;
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
  Post.get(req.query)
    .then(post => {
      res.status(200).json(post);
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
