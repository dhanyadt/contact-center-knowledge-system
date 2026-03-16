const express = require("express");
const router  = express.Router();

const {
  submitContact,
  getContacts,
  updateContactStatus
} = require("../controllers/contactController");

router.post("/contact",                    submitContact);
router.get("/admin/contacts",              getContacts);
router.put("/admin/contacts/:id/status",   updateContactStatus);

module.exports = router;