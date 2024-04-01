const { User, Thought } = require('../models');

module.exports = {
    // Get ALL thoughts
    getThoughts(req, res) {
      Thought.find({})
        .then((thought) => res.json(thought))
        .catch((err) => res.status(500).json(err));
    },
    // get SINGLE thought
    getSingleThought(req, res) {
      Thought.findOne({ _id: req.params.thoughtId })

      //retrieve all documents from the User collection but exclude the __v field
        .select("-__v")
        
        .then((thought) =>
          !thought
            ? res.status(404).json({ message: "No thought found with this ID" })
            : res.json(thought)
        )
        .catch((err) => res.status(500).json(err));
    },
    //CREATE new thought
    createThought(req, res) {
      Thought.create(req.body)
        .then(({ _id }) => {
          return User.findOneAndUpdate(
            { _id: req.body.userId },
            { $push: { thoughts: _id } },
            { new: true }
          );
        })
        .then((thought) =>
          !thought
            ? res.status(404).json({ message: "No user found with this ID" })
            : res.json(thought)
        )
        .catch((err) => res.status(500).json(err));
    },
    //UPDATE a thought
    updateThought(req, res) {
      Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body },
        { runValidators: true, New: true }
      )
        .then((user) =>
          !user
            ? res.status(404).json({ message: "No thought found with this ID" })
            : res.json(user)
        )
        .catch((err) => res.status(500).json(err));
    },
    //DELETE a thought
    deleteThought(req, res) {
      Thought.findOneAndDelete({ _id: req.params.thoughtId })
        .then((thought) =>
          !thought
            ? res.status(404).json({ message: "No thought found with this ID" })
            : User.findOneAndUpdate(
                { thoughts: req.params.thoughtId },
                { $pull: { thoughts: req.params.thoughtId } },
                { new: true }
              )
        )
        .then((user) =>
          !user
            ? res.status(404).json({ message: 'Thought deleted, but no user found'})
            : res.json({ message: 'Thought successfully deleted' })
        )
        .catch((err) => res.status(500).json(err));
    },
    //CREATE reaction
    createReaction(req, res) {
      Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: req.body } },
        { runValidators: true, new: true }
      )
        .then((thought) =>
          !thought
            ? res.status(404).json({ message: 'No thought found with ID' })
            : res.json(thought)
        )
        .catch((err) => res.status(500).json(err));
    },
    //DELETE reaction
    deleteReaction(req, res) {
      Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { reactionId: req.params.reactionId } } },
        { runValidators: true, new: true }
      )
        .then((thought) =>
          !thought
            ? res.status(404).json({ message: 'No thought found with this ID' })
            : res.json(thought)
        )
        .catch((err) => res.status(500).json(err));
    },
  };