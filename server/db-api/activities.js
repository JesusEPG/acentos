import Debug from 'debug'
//import { Question, Answer } from '../models'
import { SelectionActivity, User } from '../models'
import mongoose from 'mongoose'

const debug = new Debug('acentos:db-api:activities')

export default {

	findAllSelectionActivities: () => {
		debug('Finding all activities')
		return SelectionActivity.find()

	},

	findSelectionActivities: (_id) => {
		const id = mongoose.Types.ObjectId(_id)
		return User.aggregate(
		    [
				// Match the user id
				//{ $match: { $and: [ { "_id": id }, {"activities.type": "Seleccion Simple"} ] } }, { $eq: [ "$qty", 250 ]
				//{ $match: { $and: [ {"_id": id }, {"activities.type": "Seleccion Simple" } ] } },
				{ $match: {_id: id}},
  				//{ $match: {"activities.$.type": 'Seleccion Simple'}},

				// Separate the items array into a stream of documents
  				{ "$unwind" : "$activities" },
  				{ $match: {"activities.type": 'Seleccion Simple'}},
  				// Sorting pipeline
        		{ "$sort": { "activities.percentOverDue": -1 } },
        		// Optionally limit results
		        { "$limit": 2 },
		        {
		        	//Aquí van los campos que me voy a traer de cada activity
					"$project" : { 
						"_id": 0,
						"activities":1 }
				},
				{
					$lookup: {
			        	from: "selectionactivities",
			        	localField: "activities.activity",    // field in the orders collection
			        	foreignField: "_id",  // field in the items collection
			        	as: "fromActivities"
			      	}
			  	}
				//{ $project: { fromItems: 0 } }
		        // Grouping pipeline
		        //{ "$group": { 
		        //    "_id": '$roomId', 
		        //    "recommendCount": { "$sum": 1 }
		        //}},
		        // Optionally limit results
		        //{ "$limit": 5 }
		    ]/*,
		    function(err,result) {

		       // Result is an array of documents
		       if(err){
		       		console.log(err)
		       		return err
		       }

		       console.log(result)
		       //console.log(result[0].fromActivities[0])

		       return result
		    }*/
		)
	},

	/*findById: (_id) => {
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

	createSelectionActivity: (actv) => {
		debug(`Creating new simple selection activity ${actv}`)
		const activity = new SelectionActivity(actv)
		return activity.save()
	},

	testQuery: (_id) => {
		return User.aggregate(
		    [
				// Match the user id
				{ "$match" : {
					_id: _id
				}},
				// Separate the items array into a stream of documents
  				{ "$unwind" : "$activities" },
  				// Sorting pipeline
        		{ "$sort": { "activities.difficulty": -1 } },
        		// Optionally limit results
		        { "$limit": 2 },
		        {
		        	//Aquí van los campos que me voy a traer de cada activity
					"$project" : { 
						"_id": 0,
						"activities":1 }
				},
				{
					$lookup: {
			        	from: "simpleselectionactivities",
			        	localField: "activities.activity",    // field in the orders collection
			        	foreignField: "_id",  // field in the items collection
			        	as: "fromActivities"
			      	}
			  	}
				//{
				//	$replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$fromItems", 0 ] }, "$$ROOT" ] } }
				//},
				//{ $project: { fromItems: 0 } }
		        // Grouping pipeline
		        //{ "$group": { 
		        //    "_id": '$roomId', 
		        //    "recommendCount": { "$sum": 1 }
		        //}},
		        // Optionally limit results
		        //{ "$limit": 5 }
		    ]/*,
		    function(err,result) {

		       // Result is an array of documents
		       if(err){
		       		console.log(err)
		       		return err
		       }

		       console.log(result)
		       console.log(result[0].fromActivities[0])

		       return result
		    }*/
		)
	},

	updateUserSelectionActivities: (_id, activity) => {
	
		return User.update({"_id": _id, "activities.activity": activity.activity }, { $set: { 
					
				"activities.$.difficulty": activity.difficulty,
				"activities.$.lastAttempt": activity.lastAttempt,
				"activities.$.reviewInterval": activity.reviewInterval,
				"activities.$.percentOverDue": activity.percentOverDue
			} 
		})
	},

	updateSelectionActivities: (_id, difficulty) => {

			/*SelectionActivity.
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

	  		/*SelectionActivity.aggregate(
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
		return User.updateMany({}, { $push: { 
				activities: { 
					activity: _id,
					type: "Seleccion Simple",
					difficulty: difficulty,
					percentOverDue: 1,
					reviewInterval: 1,
					lastAttempt: new Date()
				} 
			} 
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