// const mongoose = require('mongoose')
// require('../../../db/mongoose')
const Request = require("../../../models/Request");
const DN_Team = require("../../../models/Dn-Team");
// const Hack = require('../../../models/Hack')
const errorHandler = require("../../../middleware/errorHandler");
const teamCheck = require("../../../middleware/teamCheck");
const { NotFoundError, DuplicateEntryError } = require("../../../utils/error");
const { TeamFullError, BadRequestError } = require("../../../utils/error");

const reqStatus = async (req, res) => {
  try {
    const request = await Request.findOne({ _id: req.params.req_id });
    console.log(request);
    if (!request) {
      return errorHandler(new NotFoundError(), req, res);
    }
    const team = await DN_Team.findOne({
      _id: request.team_id,
      admin_id: req.participant._id,
    });
    if (!team) {
      return res.status(401).send("not authorized");
    }
    console.log(team);
    if (req.params.status == "accepted") {
      team.members.push({ uid: request.participant_id });
      await team.save();
      await request.remove();
      return res.status(201).send(team);
    } else if (req.params.status == "rejected") {
      await request.remove();
      res.status(201).send("rejected");
    }
  } catch (e) {
    if (e.code == 11000) {
      return errorHandler(new DuplicateEntryError(), req, res);
    }
    if (e.message && e.statusCode) {
      return errorHandler(e, req, res);
    } else {
      return errorHandler(new BadRequestError(), req, res);
    }
  }
};

module.exports = reqStatus;
