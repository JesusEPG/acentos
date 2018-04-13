import Debug from 'debug'
//import { Question, Answer } from '../models'
import { SimpleSelectionActivity } from '../models'
import { User } from '../models'

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
		console.log('Llegué a db-api')
		/* const prueba = {
			id: actv.id,
			word: actv.word,
			hidden: actv.hidden

		}*/
		debug(`Creating new simple selection activity ${actv}`)
		const activity = new SimpleSelectionActivity(actv)
		return activity.save()
	},

	testQuery: (_id) => {

			/*SimpleSelectionActivity.
	  			find({ _id }).
	  			select({ possibleAnswers: 1 }).
	  			sort({ 'possibleAnswers.id': -1 }).
	  			limit(2).	  			
	  			exec(function (err, docs) {
	  				if (err){
	  					console.log(err)
	  					return err
	  				}
	  				console.log(docs)
	  				return docs
	  			});*/

	  		/*SimpleSelectionActivity.aggregate(
		    [
				// Match the document(s) of interest
				{ "$match" : {
					_id: _id
				}},
			
				// Separate the items array into a stream of documents
  				{ "$unwind" : "$possibleAnswers" },
  				// Sorting pipeline
        		{ "$sort": { "possibleAnswers.id": -1 } },
        		// Optionally limit results
		        { "$limit": 2 },
		        {
					"$project" : { _id: 0, possibleAnswers : 1}
				}
		        // Grouping pipeline
		        //{ "$group": { 
		        //    "_id": '$roomId', 
		        //    "recommendCount": { "$sum": 1 }
		        //}},
		        // Optionally limit results
		        //{ "$limit": 5 }
		    ],
		    function(err,result) {

		       // Result is an array of documents
		       if(err){
		       		console.log(err)
		       		return err
		       }
		       console.log(result)
		       return result
		    }
		);*/
		User.updateMany({}, { $push: { activities: { activity: _id } } }, function(err,result) {

		       // Result is an array of documents
		       if(err){
		       		console.log(err)
		       		return err
		       }
		       console.log(result)
		       return result
		    })
	}

	/*createAnswer: async (q, a) => {
		const answer = new Answer(a)
		const savedAnswer = await answer.save()
		q.answers.push(savedAnswer)
		await q.save()
		return savedAnswer
	}*/

}