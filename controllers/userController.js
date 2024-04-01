const { User, Thought } = require('../models');

module.exports = {

    //get ALL users
    getUsers(req, res) {
        User.find({})
        .then((user) => res.json(user))
        .catch((err) => res.status(500).json(err));
    },

    //get SINGLE user by ID
    getSingleUser(req, res) {
        User.findOne({_id: req.params.userId})
        .populate('thoughts')
        .populate('friends')

        //retrieve all documents from the User collection but exclude the __v field
        .select('-__v')

        .then((user) =>
        !user
        ? res.status(404).json ({message: 'No users found with that ID'})
        : res.json(user)
        )
        .catch((err) => res.status(500).json(err));
    },

    //CREATE user
    createUser(req, res) {
        User.create(req.body)
        .then((user) => res.json(user))
        .catch((err) => {
            console.log(err);
            return res.status(500).json(err);
        });
    },

    //UPDATE user
    updateUser(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $set: req.body },
            { runValidators: true, new: true}
        )
        .then((user) =>
        !user
        ? res.status(404).json ({message: 'No users found with that ID'})
        : res.json(user)
        )
        .catch((err) => res.status(500).json(err));
    },

    //DELETE a user (+ bonus: remove associated thoughts when user is deleted!)
    deleteUser(req, res) {
        User.findOneAndDelete({ _id: req.params.userId })
        .then((user) =>
        !user
          ? res.status(404).json({ message: 'No users found with this ID' })
          : Thought.deleteMany({ _id: { $in: user.thoughts } })
      )
      .then(() => res.json({ message: "User and Thought deleted!" }))
      .catch((err) => res.status(500).json(err));
    },
      //ADD friend
  addFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: req.params.friendId } },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No users found with this ID' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
  //DELETE friend
  deleteFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId } },
      { new: true }
    )
      .then(
        (user) =>
          !user
            ? res.status(404).json({ message: 'No User find with this ID!' })
            : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  }

};