import express from 'express'
import { required, simpleSelectionActivityMiddleware } from '../middleware'
import { activities, statistics} from '../db-api'
import { handleError } from '../utils'
import { User, Activity } from '../models'
import moment from 'moment';


const app = express.Router()


//	GET	/api/profile
app.get('/', required, async (req, res) => {

	try{
		const data = await statistics.getProfileStatistics(req.user._id)
		res.status(200).json(data)

	} catch (err) {
		handleError(err, res)
	}

})

//	GET	/api/profile/weekly
app.get('/weekly', required, async (req, res) => {

	let date = generateDate(1, 'weeks')

	try{
		const data = await statistics.getProfileDateStatistics(req.user._id, date.pastDate)
		res.status(200).json(data)

	} catch (err) {
		handleError(err, res)
	}

})

//	GET	/api/profile/monthly
app.get('/monthly', required, async (req, res) => {

	let date = generateDate(1, 'months')

	try{
		const data = await statistics.getProfileDateStatistics(req.user._id, date.pastDate)
		res.status(200).json(data)

	} catch (err) {
		handleError(err, res)
	}

})

function generateDate(number, period){

	let currentDate = moment().utc()
	let pastDate = moment(currentDate).utc().subtract(number, period)

	let test = {
		currentDate: currentDate.toDate(),
		pastDate: pastDate.toDate()
	}

	return test
}

export default app