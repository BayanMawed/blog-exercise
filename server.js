const express = require('express');
const bodyParser = require('body-parser')
const app = express();

app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({
    extended: true
}))

var db

const MongoClient = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectId


MongoClient.connect('mongodb://Bayan:Codi4ever@ds261929.mlab.com:61929/codidatabase', (err, client) => {
    if (err) return console.log(err)
    db = client.db('codidatabase')
    app.listen(3000, () => {
      console.log('listening on 3000')
    })
  })

app.get('/:sorting?', (req, res) => {
    switch ('/') {
        default:
            db.collection('posts').find().toArray(function (err, results) {
                res.render('index.ejs', {
                    posts: results
                })
            })
        sorting:
        if (sorting) 
            db.collection('posts').find().sort({date}).toArray(function (err, results) {
                res.render('index.ejs', {
                    posts: results
                })
            })
        title:
            db.collection('posts').find().sort({title}).toArray(function (err, results) {
                res.render('index.ejs', {
                    posts: results
                })
            })
    }

})

app.post('/add', (req, res) => {
    db.collection('posts').save(req.body, (err, result) => {
        if (err)
            return console.log(err)
        res.redirect('/')
    })
})

app.all('/edit/:id', (req, res) => {
    const {
        id
    } = req.params

    const _id = ObjectId(decodeURI(id))

    db.collection('posts').findOne({
        _id
    }, function (err, result) {
        if (err)
            return err
        res.render('update.ejs', {
            posts: result
        })
    })
})

app.post('/update/:id', (req, res) => {
    const {
        id
    } = req.params

    const _id = ObjectId(decodeURI(id))

    db.collection('posts').findOneAndUpdate({
        _id: _id
    },
        {
            $set: {
                title: req.body.title,
                text: req.body.text
            }
        }, function (err, result) {
            if (err)
                return err
            res.redirect('/')
        })
})

app.all('/delete/:id', (req, res) => {
    const {
        id
    } = req.params

    const _id = ObjectId(decodeURI(id))

    db.collection('posts').remove({
        _id
    }, function (err, result) {
        if (err)
            return err
        res.redirect('/')
    })
})