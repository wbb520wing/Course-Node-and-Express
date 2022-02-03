const express = require('express');
const favoriteRouter = express.Router();
const Favorite = require('../models/favorite');
const authenticate = require('../authenticate');
const cors = require('./cors')




favoriteRouter.route('/')
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorite.find({ user: req.user._id })
      .populate('User')
      .populate('Campsite')
      .then(favorites => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorite)
      })
      .catch(err => next(err))
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id })
      .then(favorite => {
        if (favorite) {
          req.body.forEach(el => {
            if(!favorite.campsites.includes(el)){
              favorite.campsites.push(el)
            }
          })
        } else {
          Favorite.create(req.body).then(favorite => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(favorite)
          })
        }
      })
      .catch(err => next(err))
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorite')
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOneAndDelete({ user: req.user._id })
      .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
      })
      .catch(err => {
        res.setHeader('Content-Type', 'text/plain');
        res.end('You do not have any favorites to delete')
        return next(err)
      })
  })



favoriteRouter.route('/:campsiteId')
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end(`GET operation not supported on /favorite/${req.params.campsiteId}`);
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({user: req.user._id})
    .then(favorite =>{
      if(favorite && !favorite.campsites.includes(req.params.campsiteId)){
        favorite.campsites.push(req.params.campsiteId)
      } else if(favorite && favorite.campsites.includes(req.params.campsiteId)){
        res.end('That campsite is already in the list of favorites!')
      } else {
        Favorite.create(req.body)
      }
    })
    .catch(err => next(err))
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end(`PUT operation not supported on /favorite/${req.params.campsiteId}`)
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({user: req.user._id})
    .then(favorite =>{
      if(favorite){
        if(favorite.campsites.indexOf(req.params.campsiteId) !== -1){
          favorite.campsites.splice(favorite.campsites.indexOf(req.params.campsiteId), 1)
          favorite.save()
          .then(favorite => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(favorite)
          })
        }
      } else {
        res.setHeader('Content-Type', 'text/plain');
        res.end('You do not have any favorites to delete')
        return next(err)
      }
    })
    .catch(err => next(err))
  })



module.exports = favoriteRouter;