const Recipe = require("../models/Recipe");
const mongoose = require('mongoose');
const removeFile = require('../helpers/removeFile');
const emailQueue = require('../queues/emailQueue');
const User = require("../models/User");


const RecipeController = {
    index : async (req,res) => {
        let limit = 6;
        let page = req.query.page || 1;
        console.log(page);
        let recipes = await Recipe
        .find()
        .skip((page - 1) * limit) // 12
        .limit(limit)
        .sort({createdAt : -1 });

        let totalRecipeCount =await Recipe.countDocuments();
        
        let totalPagesCount =  Math.ceil(totalRecipeCount/limit);

        let links = {
            nextPage: totalPagesCount == page ? false : true,
            previousPage: page == 1 ? false : true,
            currentPage: page,
            loopableLinks: []
        };

        //generate loopableLink array
        for (let index = 0; index < totalPagesCount; index++) {
            let number = index+1;
            links.loopableLinks.push({ number })
        }

        let response = {
            links,
            data : recipes
        };
        return res.json(response);
    },

    store : async (req,res) => {
        try {
            const {title,description,ingredients} = req.body;
            const recipe = await Recipe.create({
                title,
                description,
                ingredients
            });
             //User.find ko null pay p ko lo chin tr pal htoke loh ya tal. Or password pr paw nay mal
             let users = await User.find(null,['email'])
             let emails = users.map(user => user.email) // email that that ya ag sis htoke tr
             emails = emails.filter(email => email != req.user.email) //email po yin login win htr tae mail ma pr ag sis htoke tr
            emailQueue.add({
                view : 'email',
                data : {
                    name : req.user.name,
                    recipe
                },
                from : req.user.email, // dr ka login win htr tae mail
                to : emails,
                subject : 'maayeloe'
            })
          
            return res.json(recipe);
        } catch (e) {
            return res.status(500).json({ msg : 'internet server error'});
        }
    },

    show : async (req,res) => {
        try {
            let id = req.params.id;
            if(!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ msg : 'not a valid id'});
            }
            let recipe = await Recipe.findById(id);
            if(!recipe) {
                return res.status(404).json({ msg : 'recipe not found'});
            }
            return res.json(recipe);
        }catch(e) {
            return res.status(500).json({ msg : 'internet server error'});
        }
    },

    destroy :async (req,res) => {
        try {
            let id = req.params.id;
            if(!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ msg : 'not a valid id'});
            }
            let recipe = await Recipe.findByIdAndDelete(id);
            await removeFile(__dirname+"/../public"+recipe.photo);

            if(!recipe) {
                return res.status(404).json({ msg : 'recipe not found'});
            }
            return res.json(recipe);
        }catch(e) {
            return res.status(500).json({ msg : 'internet server error'});
        }
    },

    update : async (req,res) => {
        try {
            let id = req.params.id;
            if(!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ msg : 'not a valid id'});
            }
            let recipe = await Recipe.findByIdAndUpdate(id, {
                ...req.body // title : "updated title value"
            });

            await removeFile(__dirname+"/../public"+recipe.photo);

            if(!recipe) {
                return res.status(404).json({ msg : 'recipe not found'});
            }
            return res.json(recipe);
        }catch(e) {
            return res.status(500).json({ msg : 'internet server error'});
        }
    },

    upload : async (req,res) => {
        try {
            let id = req.params.id;
            if(!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ msg : 'not a valid id'});
            }
            let recipe = await Recipe.findByIdAndUpdate(id, {
                photo : '/'+ req.file.filename
            });
            if(!recipe) {
                return res.status(404).json({ msg : 'recipe not found'});
            }
            return res.json(recipe);
        }catch(e) {
            console.log(e);
            return res.status(500).json({ msg : 'internet server error'});
        }
    }
};

module.exports = RecipeController;