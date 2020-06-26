var express = require('express');
var router = express.Router();
var  fs = require('fs');
/* GET home page. */
router.get('/', function(req, res, next) {
  let data = {} 
  fs.readdirSync('public/images').forEach(ele=>{
    data [ele] = fs.readdirSync('public/images/'+ele)
  })
  res.render('index', { title: 'Express' ,data:data});
});
router.get('/train', function(req, res, next) {
  
  res.render('train');
});
router.get('/test', function(req, res, next) {
  
  res.render('test');
});
module.exports = router;
