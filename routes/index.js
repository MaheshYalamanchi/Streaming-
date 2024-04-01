const express = require('express');
const router = express.Router();
const path = require('path');
const invoke = require("../lib/http/invoke");
/* GET home page. */
router.post('/rolecreation', async(req, res, next) => {
  try {
    if (req && req.body ) {
      let responseData = await invoke.makeHttpCallUser_service("post", "/user/rolecreation",req.body);
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
router.get('/role', async(req, res, next) => {
  try {
      let responseData = await invoke.makeHttpCallUser_service("get", "/user/role");
      if (responseData && responseData.data) {
        res.status(200).send({ success :true ,message:responseData.data.message});
      } else {
        res.status(200).send({ success :false ,message:"Data Not found"});
      }
    }catch (error) {
    if (error && error.message) {
        res.status(400).send(error);
    } else {
        res.status(400).send(error);
    }
    }
});
router.put('/roleupdate/:roleid', async(req, res, next) => {
  try {
    if (req && req.body ) {
      let responseData = await invoke.makeHttpCallUser_service("put", "/user/roleupdate/" + req.params.roleid , req.body);
      if (responseData && responseData.data) {
        res.status(200).send({ success :true ,message:responseData.data.message});
      } else {
        res.status(200).send({ success :false ,message:"Data Not updated"});
      }
    } else {
      res.status(200).send({ success :false ,message:"data not found"});
    }
    }catch (error) {
    if (error && error.message) {
        res.status(400).send(error);
    } else {
        res.status(400).send(error);
    }
    }
});
router.delete('/roledelete/:roleId', async(req, res, next) => {
  try {
    if (req.params && req.params.roleId ) {
      let responseData = await invoke.makeHttpCallUser_service("delete", "/user/roledelete/"+req.params.roleId);
      if (responseData && responseData.data) {
        res.status(200).send({ success :true ,message:responseData.data.message});
      } else {
        res.status(200).send({ success :false ,message:"response not found"});
      }
    } else {
      res.status(200).send({ success :false ,message:"response not found"});
    }
    }catch (error) {
    if (error && error.message) {
        res.status(400).send(error);
    } else {
        res.status(400).send(error);
    }
    }
});
router.get('/role/:roleId', async(req, res, next) => {
  try {
    if (req.params && req.params.roleId ) {
      let responseData = await invoke.makeHttpCallUser_service("get", "/user/role/"+req.params.roleId);
      if (responseData && responseData.data) {
        res.status(200).send({ success :true ,message:responseData.data.message});
      } else {
        res.status(200).send({ success :false ,message:"response not found"});
      }
    } else {
      res.status(200).send({ success :false ,message:"response not found"});
    }
    }catch (error) {
    if (error && error.message) {
        res.status(400).send(error);
    } else {
        res.status(400).send(error);
    }
    }
});
router.post('/groupcreate', async(req, res, next) => {
  try {
    if (req && req.body ) {
      let responseData = await invoke.makeHttpCallUser_service("post", "/user/groupcreate",req.body);
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
router.get('/groupget/:groupId', async(req, res, next) => {
  try {
    if (req.params && req.params.groupId ) {
      let responseData = await invoke.makeHttpCallUser_service("get", "/user/groupget/"+req.params.groupId);
      if (responseData && responseData.data) {
        res.status(200).send({ success :true ,message:responseData.data.message});
      } else {
        res.status(200).send({ success :false ,message:"response not found"});
      }
    } else {
      res.status(200).send({ success :false ,message:"group id missing"});
    }
    }catch (error) {
    if (error && error.message) {
        res.status(400).send(error);
    } else {
        res.status(400).send(error);
    }
    }
});
router.put('/groupupdate/:groupId', async(req, res, next) => {
  try {
    if (req && req.body ) {
      let responseData = await invoke.makeHttpCallUser_service("put", "/user/groupupdate/" + req.params.groupId , req.body);
      if (responseData && responseData.data) {
        res.status(200).send({ success :true ,message:responseData.data.message});
      } else {
        res.status(200).send({ success :false ,message:"Data Not updated"});
      }
    } else {
      res.status(200).send({ success :false ,message:"data not found"});
    }
    }catch (error) {
    if (error && error.message) {
        res.status(400).send(error);
    } else {
        res.status(400).send(error);
    }
    }
});
router.delete('/groupdelete/:groupId', async(req, res, next) => {
  try {
    if (req.params && req.params.groupId ) {
      let responseData = await invoke.makeHttpCallUser_service("delete", "/user/groupdelete/"+req.params.groupId);
      if (responseData && responseData.data) {
        res.status(200).send({ success :true ,message:responseData.data.message});
      } else {
        res.status(200).send({ success :false ,message:"response not found"});
      }
    } else {
      res.status(200).send({ success :false ,message:"response not found"});
    }
    }catch (error) {
    if (error && error.message) {
        res.status(400).send(error);
    } else {
        res.status(400).send(error);
    }
    }
});
router.post('/menucreate', async(req, res, next) => {
  try {
    if (req && req.body ) {
      let responseData = await invoke.makeHttpCallUser_service("post", "/user/menucreate",req.body);
      if (responseData && responseData.data) {
        res.status(200).send({ success :true ,message:responseData.data.message});
      } else {
        res.status(200).send({ success :false ,message:"Data Not inserted"});
      }
    } else {
      res.status(200).send({ success :false ,message:"role id missing"});
    }
    }catch (error) {
    if (error && error.message) {
        res.status(400).send(error);
    } else {
        res.status(400).send(error);
    }
    }
}); 
router.get('/menuget', async(req, res, next) => {
  try {
    if (req) {
      let responseData = await invoke.makeHttpCallUser_service("get", "/user/menuget?role="+req.query.role);
      if (responseData && responseData.data) {
        res.status(200).send({ success :true ,message:responseData.data.message});
      } else {
        res.status(200).send({ success :false ,message:"response not found"});
      }
    } else {
      res.status(200).send({ success :false ,message:"response not found"});
    }
    }catch (error) {
    if (error && error.message) {
        res.status(400).send(error);
    } else {
        res.status(400).send(error);
    }
    }
});
router.put('/menuupdate/:menuId', async(req, res, next) => {
  try {
    if (req && req.body ) {
      let responseData = await invoke.makeHttpCallUser_service("put", "/user/menuupdate/" + req.params.menuId , req.body);
      if (responseData && responseData.data) {
        res.status(200).send({ success :true ,message:responseData.data.message});
      } else {
        res.status(200).send({ success :false ,message:"Data Not updated"});
      }
    } else {
      res.status(200).send({ success :false ,message:"data not found"});
    }
    }catch (error) {
    if (error && error.message) {
        res.status(400).send(error);
    } else {
        res.status(400).send(error);
    }
    }
});
router.delete('/menudelete/:menuId', async(req, res, next) => {
  try {
    if (req.params && req.params.menuId ) {
      let responseData = await invoke.makeHttpCallUser_service("delete", "/user/menudelete/"+req.params.menuId);
      if (responseData && responseData.data) {
        res.status(200).send({ success :true ,message:responseData.data.message});
      } else {
        res.status(200).send({ success :false ,message:"response not found"});
      }
    } else {
      res.status(200).send({ success :false ,message:"response not found"});
    }
    }catch (error) {
    if (error && error.message) {
        res.status(400).send(error);
    } else {
        res.status(400).send(error);
    }
    }
});
router.post('/org', async(req, res, next) => {
  try {
    if (req && req.body ) {
      let responseData = await invoke.makeHttpCallUser_service("post", "/user/org",req.body);
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
router.get('/orgget/:orgId', async(req, res, next) => {
  try {
    if (req.params && req.params.orgId ) {
      let responseData = await invoke.makeHttpCallUser_service("get", "/user/orgget/"+req.params.orgId);
      if (responseData && responseData.data) {
        res.status(200).send({ success :true ,message:responseData.data.message});
      } else {
        res.status(200).send({ success :false ,message:"response not found"});
      }
    } else {
      res.status(200).send({ success :false ,message:"response not found"});
    }
    }catch (error) {
    if (error && error.message) {
        res.status(400).send(error);
    } else {
        res.status(400).send(error);
    }
    }
});
router.post('/sessionstatus', async(req, res, next) => {
  try {
    if (req && req.body ) {
      let responseData = await invoke.makeHttpCallUser_service("post", "/user/sessionstatus",req.body);
      if (responseData && responseData.data&&responseData.data.success) {
        res.status(200).send({ success :true ,message:responseData.data.message});
      } else {
        res.status(200).send({ success :false ,message:"Data not found"});
      }
    } else {
      res.status(200).send({ success :false ,message:"Room id missing"});
    }
    }catch (error) {
    if (error && error.message) {
        res.status(400).send(error);
    } else {
        res.status(400).send(error);
    }
    }
});
router.get('/reportlog/:roomId/:userId', async(req, res, next) => {
  try {
    if (req && req.params ) {
      let responseData = await invoke.makeHttpCallUser_service("get", "/user/reportlog/"+req.params.roomId+"/"+req.params.userId);
      if (responseData && responseData.data && responseData.data.success) {
        res.status(200).send({ success :true ,message: "Data Found",Data:responseData.data.message});
      } else {
        res.status(200).send({ success :false ,message:"Data not found"});
      }
    } else {
      res.status(200).send({ success :false ,message:"Room id missing"});
    }
    }catch (error) {
    if (error && error.message) {
        res.status(400).send(error);
    } else {
        res.status(400).send(error);
    }
    }
});
router.get('/overview', async(req, res, next) => {
  try {
      let responseData = await invoke.makeHttpCallUser_service("get", "/user/overview");
      if (responseData && responseData.data) {
        res.status(200).send({ success :true ,message:responseData.data.message});
      } else {
        res.status(200).send({ success :false ,message:"response not found"});
      }
    }catch (error) {
    if (error && error.message) {
        res.status(400).send(error);
    } else {
        res.status(400).send(error);
    }
    }
});
router.post('/getSessionsStatus', async(req, res, next) => {
  try {
    if (req && req.body ) {
      let responseData = await invoke.makeHttpCallUser_service("post", "/user/getSessionsStatus",req.body);
      if (responseData && responseData.data&&responseData.data.success) {
        res.status(200).send({ success :true ,message:responseData.data.message});
      } else {
        res.status(200).send({ success :false ,message:"Data not found"});
      }
    } else {
      res.status(200).send({ success :false ,message:"Room id missing"});
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