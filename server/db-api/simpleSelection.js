import Debug from 'debug'
//import { Question, Answer } from '../models'
import { SimpleSelectionActivity } from '../models'

const debug = new Debug('acentos:db-api:simpleSelection')

export default {

	/*findAll: () => {
		debug('Finding all questions')
		//buscar populate
		return Question.find().populate('answers')

	},

	findById: (_id) => {
		debug(`Finding question with id: ${_id}`)
		return Question
			.findOne({ _id })
			.populate('user')
			.populate({
				path: 'answers',
				options: { sort: '-createdAt'},
				populate: {
					path: 'user',
					model: 'User'
				}
			})
	},*/

	create: (actv) => {
		console.log('Lllegue a db-api')
		console.log(actv)
		debug(`Creating new simple selection activity ${actv}`)
		const activity = new SimpleSelectionActivity(actv)
		return activity.save()
	}

	/*createAnswer: async (q, a) => {
		const answer = new Answer(a)
		const savedAnswer = await answer.save()
		q.answers.push(savedAnswer)
		await q.save()
		return savedAnswer
	}*/

}