const mongoose = require("mongoose");
const DN_Team = require("./Dn-Team");
const Hack = require("./Hack");

const organiserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  logo: {
    type: String,
  },
  phone: {
    type: String,
    required: true,
    validate: {
      validator: function (phone) {
        return /^\d{10}$/.test(phone);
      },
      message: `Enter a valid phone number!`,
    },
  },
  college: {
    type: String,
    required: true,
  },
  uid: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  website: {
    type: String,
  },
});

organiserSchema.virtual("hacks", {
  ref: "Hack",
  localField: "_id",
  foreignField: "organiser_id",
});

// organiserSchema.methods.toJSON= function(){
//     const organiser = this
//     const organiserObject = organiser.toObject()

//     delete organiserObject.__v
//     delete organiserObject._id
//     delete organiserObject.uid

//     return organiserObject
// }

organiserSchema.post("remove", async function (doc, next) {
  const organiser = this;
  console.log(doc);
  try {
    const hacks = await Hack.find({ organiser_id: organiser._id });
    await Promise.all(hacks.map((hack) => hack.remove()));
    next();
  } catch (e) {
    next(e);
  }
});

const Organiser = mongoose.model("Organiser", organiserSchema);
module.exports = Organiser;
