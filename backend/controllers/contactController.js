const Contact = require("../models/Contact");

exports.submitContact = async (req, res) => {
  try {
    const { firstName, lastName, email, subject, message } = req.body;
    if (!firstName || !lastName || !email || !message) {
      return res.status(400).json({ error: "firstName, lastName, email, and message are required" });
    }
    const entry = await Contact.create({ firstName, lastName, email, subject, message });
    res.json({ message: "Message received. We'll be in touch soon.", id: entry._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin: get all contact submissions
exports.getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin: mark contact as read/resolved
exports.updateContactStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await Contact.findByIdAndUpdate(id, { status }, { new: true });
    if (!updated) return res.status(404).json({ error: "Contact not found" });
    res.json({ message: "Status updated", data: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};