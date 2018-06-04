const router = require('express').Router();

const algoliasearch = require('algoliasearch');
const client = algoliasearch('S3MZNSBUBH','1373e61f4532b1562c1b07be3b0e6f22');
const index = client.initIndex('amastoneclonehtdaa');

router.get('/', (req, res, next) => {
  if(req.query.query){
    index.search({
      query: req.query.query,
      page: req.query.page
    }, (err, content) => {
      res.json({
        success: true,
        message: "Here is your search",
        status: 200,
        content: content,
        search_result: req.query.query
      });
    });
  }
});

module.exports = router;