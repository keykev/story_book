const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth.js')
const Story = require('../models/Story.js')

//GET   add_story page
router.get('/add',ensureAuth,(req,res) => {
    res.render('stories/add')
})

// POST  add_story result
router.post('/', async(req,res) => {
    try {
        req.body.user = req.user.id
        await Story.create(req.body)
        res.redirect('/dashboard')
    }
    catch(err) {
        console.log(err)
        res.render('error/500')
    }
})

router.get('/', ensureAuth, async(req,res) => {
    try {
        const stories = await Story.find({status: 'public'}).populate('user').sort({created_at: 'desc'}).lean()
        res.render('stories/index', {
            stories
        })
    }
    catch(err) {
        console.log(err)
        res.render('error/500')
    }
})

//GET   single stories
router.get('/:id',ensureAuth,async(req,res) => {
   try {
        let story = await Story.findById({_id: req.params.id}).populate('user').lean()
        
        if(!story) {
            return res.render('error/404')
        }
        res.render('stories/show', {
            story
        })
   } 
   catch(err) {
       console.log(err)
       res.render('error/500')
   }
})

router.get('/edit/:id', ensureAuth, async(req, res) => {
    try {
        const story = await Story.findOne({
            _id: req.params.id
        }).lean()
    
        if(!story) {
            return res.render('error/404')
        }
        
        if(story.user != req.user.id) {
            res.redirect('/stories')
        }
        else {
            res.render('stories/edit', {
                story,
            })
        }
    }
    catch(err) {
        console.log(err)
        res.render('error/500')
    }
    
})

router.put('/:id',ensureAuth, async(req,res) => {
    try {
        let story = await Story.findById(req.params.id)

        if(!story) {
            return render('error/404')
        }

        if(story.user != req.user.id) {
            res.redirect('/stories')
        }
        else {
            story = await Story.findOneAndUpdate({_id: req.params.id},req.body, {
                new:true,
                runValidators:true,
            })
            res.redirect('/dashboard')
        }
    }
    catch(err) {
        console.log(err)
        res.render('error/500')
    }
    
})

router.delete('/:id',ensureAuth, async(req,res) => {
    try {
        await Story.remove({_id: req.params.id})
        res.redirect('/dashboard')
    }
    catch(err) {
        console.log(err)
        res.render('error/500')
    }
})

//GET   user stories.
router.get('/user/:userId',ensureAuth,async(req,res) => {
    try {
        let stories = await Story.find({
            user:req.params.userId,
            status: 'public'    
        }).populate('user').lean()

        if(!stories) {
            return res.render('error/404')
        }
        res.render('stories/index',{
            stories
        })
    }
    catch(err) {
        console.log(err)
        res.render('error/500')
    }
})


module.exports = router




