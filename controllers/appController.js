import { Accomodation } from '../models/accomodationModel.js';

export const aUser = (req, res, next) => {
  let user;
  user = {
    username: req.user.username,
    email: req.user.email,
    avatar: req.user.avatar,
  };
  res.json({ data: user });
};

export const aAccomodation = async (req, res) => {
  try {
    const { mapData, pictures, description, address } = req.body;

    let owner = req.user._id;

    const addAccomodation = await Accomodation.create({
      owner,
      mapData,
      pictures,
      description,
      address,
    });

    // Respond with success message
    res.status(201).json({
      message: 'Accomodation added successfully!',
      address: addAccomodation.address,
    });
  } catch (error) {
    console.error('Error creating post:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const available = async (req, res) => {
  try {
    // Retrieve all posts from the database
    const allAccomodation = await Accomodation.find();

    // Respond with the posts
    res.status(200).json(allAccomodation);
  } catch (error) {
    console.error('Error fetching accomodation:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};
