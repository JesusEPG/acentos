import Debug from 'debug'
//import { Question, Answer } from '../models'
import { Activity, User } from '../models'
import mongoose from 'mongoose'

const debug = new Debug('acentos:db-api:activities')

export default {

	findAllActivities: () => {
		debug('Finding all activities')
		return Activity.find()

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
  				{ $match: {"activities.type": 'Selection'}},
  				// Sorting pipeline
        		{ "$sort": { "activities.percentOverDue": -1 } },
        		// Optionally limit results
		        { "$limit": 10 },
		        {
		        	//Aquí van los campos que me voy a traer de cada activity
					"$project" : { 
						"_id": 0,
						"activities":1 }
				},
				{
					$lookup: {
			        	from: "activities",
			        	localField: "activities.activity",    // field in the orders collection
			        	foreignField: "_id",  // field in the items collection
			        	as: "fromActivities"
			      	}
			  	}
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

	findMistakesActivities: (_id) => {
		const id = mongoose.Types.ObjectId(_id)
		return User.aggregate(
		    [
				{ $match: {_id: id}},
  				//{ $match: {"activities.$.type": 'Seleccion Simple'}},

				// Separate the items array into a stream of documents
  				{ "$unwind" : "$activities" },
  				{ $match: {"activities.type": 'Mistake'}},
  				// Sorting pipeline
        		{ "$sort": { "activities.percentOverDue": -1 } },
        		// Optionally limit results
		        { "$limit": 10 },
		        {
		        	//Aquí van los campos que me voy a traer de cada activity
					"$project" : { 
						"_id": 0,
						"activities":1 }
				},
				{
					$lookup: {
			        	from: "activities",
			        	localField: "activities.activity",    // field in the orders collection
			        	foreignField: "_id",  // field in the items collection
			        	as: "fromActivities"
			      	}
			  	}
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

	findActivityById: (_id) => {
		return Activity.findOne({ _id })
	},

	createActivity: (actv) => {
		const activity = new Activity(actv)
		return activity.save()
	},


	updateActivity: (actv) => {

		return Activity.findOneAndUpdate({"_id": actv._id}, { $set: {
					
				"difficulty": actv.difficulty,
				"correctAnswer": actv.correctAnswer,
				"splittedString": actv.splittedString,
 				"possibleAnswers": actv.possibleAnswers,
 				"comment": actv.comment,
 				"fullString": actv.fullString

			} 
		}, {new: true})
	},

	updateUserActivities: (_id, activity) => {
	
		return User.update({"_id": _id, "activities.activity": activity.activity }, { $set: { 
					
				"activities.$.difficulty": activity.difficulty,
				"activities.$.lastAttempt": activity.lastAttempt,
				"activities.$.reviewInterval": activity.reviewInterval,
				"activities.$.percentOverDue": activity.percentOverDue,
				"activities.$.correctCount": activity.correctCount,
				"activities.$.incorrectCount": activity.incorrectCount,
				"activities.$.lastAnswer": activity.lastAnswer,
				"activities.$.modified": activity.modified,
				"activities.$.taken": false

			} 
		})
	},

	//inserta la nueva actividad a cada usuario
	updateUsersActivities: (activity) => {

		return User.updateMany({}, { $push: { 
				activities: { 
					activity: activity._id,
					type: activity.type,
					difficulty: activity.difficulty,
					percentOverDue: 1,
					reviewInterval: 1,
					lastAttempt: null,
					correctCount: 0,
    				incorrectCount: 0,
    				lastAnswer: null,
    				modified: false
				} 
			} 
		})
	},

	//Actualiza los datos user-activity luego de que el admin modifica un ejercicio
	updateUsersTakenActivity: (userId, activity) => {

		return User.findOneAndUpdate({"_id": userId, "activities.activity": activity._id }, { $set: { 
					
				"activities.$.difficulty": activity.difficulty,
				"activities.$.lastAttempt": null,
				"activities.$.reviewInterval": 1,
				"activities.$.percentOverDue": 1,
				"activities.$.correctCount": 0,
				"activities.$.incorrectCount": 0,
				"activities.$.lastAnswer": null,
				"activities.$.modified": true
			}
		}, {new: true})
	},

	//Actualiza los datos user-activity si la activity no está taken luego de que el admin modifica un ejercicio
	updateUsersActivity: (userId, activity) => {

		return User.findOneAndUpdate({"_id": userId, "activities.activity": activity._id }, { $set: { 
					
				"activities.$.difficulty": activity.difficulty,
				"activities.$.lastAttempt": null,
				"activities.$.reviewInterval": 1,
				"activities.$.percentOverDue": 1,
				"activities.$.correctCount": 0,
				"activities.$.incorrectCount": 0,
				"activities.$.lastAnswer": null,
				"activities.$.modified": false
			}
		}, {new: true})
	},
}