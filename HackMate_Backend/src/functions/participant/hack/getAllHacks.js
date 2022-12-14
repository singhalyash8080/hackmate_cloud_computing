const errorHandler = require('../../../middleware/errorHandler')
const paginate = require('../../../middleware/paginate')
const Hack = require('../../../models/Hack')
const { NotFoundError, BadRequestError } = require('../../../utils/error')

const getAllHacks = async(req,res) => {
    try {
        const page = Number(req.query.page)
        const hacks = await Hack.find().sort({_id:-1}) 
        let length = hacks.length
        let final = paginate(hacks,6,page)
        if(!final || final.length==0){
            return errorHandler(new NotFoundError,req,res)
        }
        res.status(200).send({final,length})
    } catch (e) {
        errorHandler(new BadRequestError,req,res)
        // res.status(400).send(e)
    }   
}

module.exports = getAllHacks