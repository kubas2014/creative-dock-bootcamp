/* Requirements */
const express = require('express');
const router = express.Router();
const fetch = require("node-fetch");
const validator = require("./validator");


/* GET home page. */
router.get('/', function(req, res, next) {
    return res.status(200).send("Welcome to the address validator API");
});

/* POST text to API for analytics */
router.post('/validate', async (req,res,next) => {
  try {
    let result = await validator.Validate(req.body);
    if (result) {
      return res.status(200).send(result);
    }
  }
  //handle eventual errors
  catch (error) {
    return res.status(500).json({
      error: "Internal server error",
      message: error.message
    });
  }
});

/* Make routes accessible elsewhere */
module.exports = router;
