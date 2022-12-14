const DN_Team = require("../../../models/Dn-Team");
const errorHandler = require("../../../middleware/errorHandler");
const { BadRequestError } = require("../../../utils/error");

const leaveTeam = async (req, res) => {
  try {
    const team = await DN_Team.findOne({
      _id: req.params.team_id,
      "members.uid": req.participant._id,
    });
    if (!team) {
      return res.status(404).send("You're not in given team");
    }
    if (team.admin_id == req.participant._id) {
      return res
        .status(403)
        .send("admin cant leave team, try deleting it instead");
    }
    let updated = team.members.filter((member) => {
      return String(member.uid) !== String(req.participant._id);
    });
    console.log(updated);
    team.members = updated;
    await team.save();
    res.status(200).send(team);
  } catch (e) {
    errorHandler(new BadRequestError(), req, res);
  }
};

module.exports = leaveTeam;
