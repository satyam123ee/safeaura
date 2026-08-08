import TrustedContact from '../models/trustedContact.model.js';

export const addContact = async (req, res) => {
  try {
    const contact = await TrustedContact.create({ ...req.body, userId: req.userId });
    res.status(201).json(contact);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const listContacts = async (req, res) => {
  const contacts = await TrustedContact.find({ userId: req.userId });
  res.json(contacts);
};

export const deleteContact = async (req, res) => {
  await TrustedContact.findOneAndDelete({ _id: req.params.id, userId: req.userId });
  res.json({ message: 'Contact removed' });
};
