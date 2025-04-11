import { ContactModel } from '../models/Contact.js'

const createContact = async (req, res) => {
  const { name, email, phone, address } = req.body;

  console.log("Incoming contact request body:", req.body);

  if (!name || !email || !phone || !address) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: "Unauthorized. User not found in request." });
    }

    const newContact = new ContactModel({
      name,
      email,
      phone,
      address,
      postedBy: req.user._id
    });

    const result = await newContact.save();
    console.log("Contact saved:", result);

    return res.status(201).json({ success: true, ...result._doc });
  } catch (err) {
    console.error("Error saving contact:", err);
    return res.status(500).json({ error: err.message });
  }
}

const getContacts = async (req, res) => {
    try {
        const contacts = await ContactModel.find({postedBy: req.user._id})
        return res.status(200).json({success: true, contacts})
    } catch(err) {
        return res.status(500).json({error: err.message})
    }
}

const getContact = async (req, res) => {
    const {id} = req.params;
    if(!id) {
        return res.status(401).json({error: "No Id Specified"})
    }
    try {
        const contacts = await ContactModel.findOne({_id: id})
        return res.status(200).json({success: true, ...contacts._doc})
    } catch(err) {
        return res.status(500).json({error: err.message})
    }
}

const updateContact = async (req, res) => {
    const {id} = req.params;
    if(!id) {
        return res.status(401).json({error: "No Id Specified"})
    }
    try {
        const result = await ContactModel.findByIdAndUpdate({_id: id}, {...req.body}, {new: true})
        return res.status(200).json({success: true, ...result._doc})
    } catch(err) {
        return res.status(500).json({error: err.message})
    }
}

const deleteContact = async (req, res) => {
    const {id} = req.params;
    if(!id) {
        return res.status(401).json({error: "No Id Specified"})
    }
    try {
        const contact = await ContactModel.findOne({_id: id})
        if(!contact) {
            return res.status(401).json({error: "No Record Exists"})
        }
        const deleteRecord = await ContactModel.findByIdAndDelete({_id: id})
        const contacts = await ContactModel.find({postedBy: req.user._id})
        return res.status(200).json({success: true, contacts})
    } catch(err) {
        return res.status(500).json({error: err.message})
    }
}



export { createContact, getContacts, getContact, updateContact, deleteContact}
