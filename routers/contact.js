// ceci est un exemple :
const express =  require('express');
const router = express.Router();
const {Contact, contactSchema} = require('../models/contact');
const validate = require('../middlewares/validate');

router.get('/socket', async (req,res,next)=>{
    res.render("contact");
});

router.get('/', async (req,res,next)=>{
    const contacts = await Contact.find();
    res.json(contacts);
});

router.get('/findbyName/:name', async (req,res,next)=>{
    const contacts = await Contact.find({name : req.params['name']});
    res.json(contacts);
});

router.post('/', validate(contactSchema), async (req, res, next)=>{
    const contact = new Contact({ 
        name: req.body.contactName, 
        phone: req.body.contactPhone
    });
    await contact.save();
    res.send("contact has been created");
});

router.delete('/:id', async (req, res, next)=>{
    const { id } = req.params;
    await Contact.findByIdAndDelete(id);
    res.send('contact has been deleted');
});

router.put("/:id", async (req, res, next) => {
    const { id } = req.params;
    const newContact = await Contact.findByIdAndUpdate(id, {
        name: req.body.contactName, 
        phone: req.body.contactPhone
    });
    res.json(newContact);
})

module.exports = router;