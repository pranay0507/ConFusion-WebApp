const express = require('express');
const bodyParser = require('body-parser');
const mongoose  = require('mongoose');
const Favorites = require('../model/favorite');
const authenticate = require('../authenticate');
const { populate } = require('../model/favorite');
const cors = require('./cors');


const favoriteRouter = express.Router();
favoriteRouter.use(bodyParser.json());


favoriteRouter.route('/')

.get(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    Favorites.findOne({user:req.user._id})
    .populate(['user','dishes'])
    .then((favorite)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(favorite)
    },(err)=>next(err))
    .catch((err)=>next(err));
})

.post((cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    Favorites.findOne({user:req.user._id})
    .then(favorite=>{
        if(!favorite){
            return Favorites.create({user:req.user._id,dishes:req.body});
        }
        else{
            req.body.forEach(({_id})=>{
                if(favorite.dishes.indexOf(_id)<0){
                    favorite.dishes.push(_id);
                }
            });
            return favorite.save();
        }
    })
    .then(favorite=>Favorites.findById(favorite._id).populate(['user','dishes']))
    .then((favorite)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(favorite)
    },(err)=>next(err))
    .catch((err)=>next(err));
}))

.delete((cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    Favorites.findOneAndRemove({user:req.user._id})
    .then(favorite=>Favorites.findById(favorite._id).populate(['user','dishes']))
    .then((favorite)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(favorite)
    },(err)=>next(err))
    .catch((err)=>next(err));
}))

favoriteRouter.route('/:dishId')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200);})
.get(cors.cors,authenticate.verifyUser,(req,res,next) => {
  Favorites.findOne({user:req.user._id})
  .then((favorites)=>{
    if(!favorites){
      res.statusCode=200;
      res.setHeader("Content-Type","application/json");
      return res.json({"exists":false,"favorites":favorites})
    }
    else{
      if(favorites.dishes.indexOf(req.params.dishId)<0){
        res.statusCode=200;
        res.setHeader("Content-Type","application/json");
        return res.json({"exists":false,"favorites":favorites})
      }
      else{
        res.statusCode=200;
        res.setHeader("Content-Type","application/json");
        return res.json({"exists":true,"favorites":favorites})
      }
    }
  })
    
})

.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ user: req.user._id })
        .then(favorite => {
          if (!favorite) {
            return Favorites.create({ user: req.user._id, dishes: [req.params.dishId] });
          } else {
            if (favorite.dishes.indexOf(req.params.dishId) < 0) {
              favorite.dishes.push(req.params.dishId);
            }
            return favorite.save();
          }
        })
        .then(favorite => Favorites.findById(favorite._id)
        .populate(['user', 'dishes']))
        .then((favorite)=>{
            res.statusCode=200;
            res.setHeader('Content-Type','application/json');
            res.json(favorite)
        },(err)=>next(err))
        .catch((err)=>next(err));
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ user: req.user._id })
        .then(favorite => {
          if (!favorite || favorite.dishes.indexOf(req.params.dishId) < 0) {
            return Promise.reject(
                createError(404, `Dish ${req.params.dishId} not in favorites.`));
          } else {
            favorite.dishes.pull(req.params.dishId);
            return favorite.save();
          }
        })
        .then(favorite => Favorites.findById(favorite._id).populate(['user', 'dishes']))
        .then((favorite)=>{
            res.statusCode=200;
            res.setHeader('Content-Type','application/json');
            res.json(favorite)
        },(err)=>next(err))
        .catch((err)=>next(err));
  });

module.exports = favoriteRouter;