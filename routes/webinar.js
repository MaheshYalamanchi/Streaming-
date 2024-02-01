const express = require('express');
const router = express.Router();
const path = require('path');
const invoke = require("../lib/http/invoke");
/* GET home page. */
router.post('/joined', async(req, res, next) => {
    try {
      if (req && req.body ) {
        let responseData = await invoke.makeHttpCallUser_service("post", "/webinar/joined",req.body);
        if (responseData && responseData.data) {
          res.status(200).send({ success :true ,message:responseData.data.message});
        } else {
          res.status(200).send({ success :false ,message:"Data Not inserted"});
        }
      } else {
        res.status(200).send({ success :false ,message:"Data Not inserted"});
      }
      }catch (error) {
      if (error && error.message) {
          res.status(400).send(error);
      } else {
          res.status(400).send(error);
      }
      }
  });

module.exports = router;