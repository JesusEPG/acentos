import { simpleSelection } from '../db-api'
import { handleError } from '../utils'

export const simpleSelectionActivityMiddleware = async (req, res, next) => {
	try {
		req.simpleSelectionActivity = await simpleSelectionActivity.findById(req.params.id)
		next()
	} catch (err) {
		handleError(err, res)
	}
}