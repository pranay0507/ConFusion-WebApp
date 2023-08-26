const express = require('express');
const bodyParser = require('body-parser');
const Leaders = require('../model/leaders');
const authenticate = require('../authenticate');
const cors = require('./cors');

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200);})
.get(cors.cors,(req,res,next) => {
    Leaders.find(req.query)
    .then((lea)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(lea);
    },(err)=>next(err))
    .catch((err)=>next(err))
})
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    Leaders.create(req.body)
    .then((lea)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','applicaton/json');
        res.json(lea);
    },(err)=>next(err))
    .catch((err)=>next(err))
})
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /leaders');
})
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    Leaders.remove({})
    .then((lea)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(lea);
    },(err)=>next(err))
    .catch((err)=>next(err))
});


leaderRouter.route('/:leaderId')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200);})
.get(cors.cors,(req,res,next) => {
    Leaders.findById(req.params.leaderId)
    .then((lea)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(lea);
    },(err)=>next(err))
    .catch((err)=>next(err))
})
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    res.end(`POST operation cannot be supported for /leaders/: ${req.params.leaderId}`);
})
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    Leaders.findByIdAndUpdate(req.params.leaderId,{
        $set:req.body
    },{new:true})
    .then((lea)=>{
        res.statusCode=200;
        console.log("LeaderId updated",lea);
        res.setHeader('Content-Type','application/json');
    },(err)=>next(err))
    .catch((err)=>next(err))
})
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    Leaders.findByIdAndRemove(req.params.leaderId)
    .then((lea)=>{
        res.statusCode=200;
        console.log("LeaderId deleted",lea)
        res.setHeader('Content-Type','application/json');
        res.json(lea);
    },(err)=>next(err))
    .catch((err)=>next(err))
});

module.exports = leaderRouter;