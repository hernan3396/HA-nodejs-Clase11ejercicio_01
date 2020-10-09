const mongoose = require('mongoose');
const Team = require('./models/Team');
const Goal = require('./models/Goal');
const { makeSortCriteria } = require('./utils');

module.exports = (app) => {
  app.get('/teams', async (req, res) => {
    try {
      const sortBy = req.query.sortBy || '';
      const order = parseInt(req.query.order, 10) || 1;
      const skip = parseInt(req.query.skip, 10) || 0;
      const sortCriteria = makeSortCriteria(sortBy, order);

      const docs = await Team.find().sort(sortCriteria).skip(skip).lean();

      res.json({
        count: docs.length,
        value: docs,
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  });

  app.get('/teams/:teamId', async (req, res) => {
    try {
      const teamId = req.params.teamId;
      const include = req.query.include;
      const exclude = req.query.exclude;

      const doc = await Team.findById(teamId)
        .select(include || exclude)
        .lean();

      if (doc) {
        res.json({
          count: 1,
          value: doc,
        });
      } else {
        res.status(404).json({
          error: 'No hay equipo con este ID',
        });
      }
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  });

  app.post('/teams', async (req, res) => {
    try {
      const team = req.body;

      const doc = await Team.create(team);

      res.status(201).json({
        count: 1,
        value: doc,
      });
    } catch (error) {
      if (error.name === 'ValidationError') {
        res.status(400).json({
          error: error.message,
        });
      } else {
        res.status(500).json({
          error: error.message,
        });
      }
    }
  });

  app.put('/teams/:teamId', async (req, res) => {
    try {
      const teamId = req.params.teamId;
      const updatePayload = req.body;

      const doc = await Team.findByIdAndUpdate(teamId, updatePayload, {
        new: true,
        runValidators: true,
      }).lean();

      if (doc) {
        res.json({
          count: 1,
          value: doc,
        });
      } else {
        res.status(404).json({
          error: 'No hay equipo con este ID',
        });
      }
    } catch (err) {
      res.status(500).json({
        error: err.message,
      });
    }
  });

  app.patch('/teams/:teamId', async (req, res) => {
    try {
      const teamId = req.params.teamId;
      const updatePayload = req.body;

      const doc = await Team.findByIdAndUpdate(teamId, updatePayload, {
        new: true,
        runValidators: true,
      }).lean();

      if (doc) {
        res.json({
          count: 1,
          value: doc,
        });
      } else {
        throw new Error('No hay equipo con este ID');
      }
    } catch (err) {
      res.status(400).json({
        error: err.message,
      });
    }
  });

  app.delete('/teams/:teamId', async (req, res) => {
    try {
      const teamId = req.params.teamId;

      const doc = await Team.findByIdAndDelete(teamId).lean();

      if (doc) {
        res.json({
          count: 1,
          value: doc,
        });
      } else {
        res.status(404).json({
          error: 'No hay equipo con este ID',
        });
      }
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  });

  app.post('/goals', async (req, res) => {
    try {
      const newGoal = await Goal.create(req.body);
      await Promise.all([
        Team.findByIdAndUpdate(newGoal.goalFor, {
          $push: {
            goalsScored: newGoal._id,
          },
        }),
        Team.findByIdAndUpdate(newGoal.goalAgainst, {
          $push: {
            goalsConceded: newGoal._id,
          },
        }),
      ]);

      const goalFilled = await newGoal
        .populate('goalFor', 'name code flag')
        .populate('goalAgainst', 'name code flag')
        .execPopulate();

      res.json({
        count: 1,
        value: goalFilled,
      });
    } catch (error) {
      if (error.name === 'ValidationError') {
        res.status(400).json({
          error: error.message,
        });
      } else {
        res.status(500).json({
          error: error.message,
        });
      }
    }
  });

  app.get('/goals', async (req, res) => {});

  app.get('/goals/:goalId', async (req, res) => {});

  app.delete('/goals/:goalId', async (req, res) => {});

  app.patch('/goals/:goalId', async (req, res) => {});
};
