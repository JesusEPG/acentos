import Debug from 'debug'
//import { Question, Answer } from '../models'
import { Activity, User } from '../models'
import mongoose from 'mongoose'

const debug = new Debug('acentos:db-api:statistics')

export default {

	

	findMistakesActivities: (_id) => {
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
  				{ $match: {"activities.type": 'Mistake'}},
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
			        	from: "activities",
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

	findActivityById: (_id) => {
		debug(`Finding activity with id: ${_id}`)
		return Activity.findOne({ _id })
	},

	getProfileStatistics: (_id) => {
		const id = mongoose.Types.ObjectId(_id)
		return User.aggregate(
		    [
				// Funciona para todos los tiempos y sin restriccion de tipo. Solo correcto vs incorrecto
				
				/*{ "$match" : {
					_id: id
				}},
				// Separate the items array into a stream of documents
  				{ "$unwind" : "$activities" },

        		{
			    	$group : {
			        	_id : null,
			        	totalCorrect: { $sum: "$activities.correctCount" },
			        	totalIncorrect: { $sum: "$activities.incorrectCount" },
			        	count: { $sum: 1 }
			    	}
			    }*/

			    
			    //Funciona para los todos los tiempos, con datos separados para Selection y Mistake
			    
			    { "$match" : {
					_id: id
				}},
				// Separate the items array into a stream of documents
  				{ "$unwind" : "$activities" },

  				{ "$match" : {
					'activities.lastAttempt': { $ne: null }
				}},

        		{
			    	$group : {
			        	_id : "$activities.type",
			        	totalCorrect: { $sum: "$activities.correctCount" },
			        	totalIncorrect: { $sum: "$activities.incorrectCount" },
			        	count: { $sum: 1 }
			    	}
			    }
		    ]/*,
		    function(err,result) {

		       // Result is an array of documents
		       if(err){
		       		console.log(err)
		       		return err
		       }

		       console.log('Prueba del query de estadisticas')

		       console.log(result)
		
		       return result
		    }*/
		)


	},

	getProfileDateStatistics: (_id, date) => {
		const id = mongoose.Types.ObjectId(_id)
		return User.aggregate(
		    [
				{ "$match" : {
					_id: id
				}},
  				{ "$unwind" : "$activities" },

  				{ "$match" : {
					"activities.lastAttempt": { $gt: date }
				}},

        		{
			    	$group : {
			        	_id : "$activities.type",
			        	totalCorrect: { $sum: "$activities.correctCount" },
			        	totalIncorrect: { $sum: "$activities.incorrectCount" },
			        	count: { $sum: 1 }
			    	}
			    }
		    ]/*,
		    function(err,result) {

		       // Result is an array of documents
		       if(err){
		       		console.log(err)
		       		return err
		       }

		       console.log('Prueba del query de estadisticas')

		       console.log(result)
		
		       return result
		    }*/
		)


	},

	getProfileMonthlyStatistics: (_id) => {
		const id = mongoose.Types.ObjectId(_id)
		return User.aggregate(
		    [
				// Funciona para todos los tiempos y sin restriccion de tipo. Solo correcto vs incorrecto
				
				/*{ "$match" : {
					_id: id
				}},
				// Separate the items array into a stream of documents
  				{ "$unwind" : "$activities" },

        		{
			    	$group : {
			        	_id : null,
			        	totalCorrect: { $sum: "$activities.correctCount" },
			        	totalIncorrect: { $sum: "$activities.incorrectCount" },
			        	count: { $sum: 1 }
			    	}
			    }*/

			    
			    //Funciona para los todos los tiempos, con datos separados para Selection y Mistake
			    
			    { "$match" : {
					_id: id
				}},
				// Separate the items array into a stream of documents
  				{ "$unwind" : "$activities" },

  				{ "$match" : {
					'activities.lastAttempt': { $ne: null }
				}},

        		{
			    	$group : {
			        	_id : "$activities.type",
			        	totalCorrect: { $sum: "$activities.correctCount" },
			        	totalIncorrect: { $sum: "$activities.incorrectCount" },
			        	count: { $sum: 1 }
			    	}
			    }
		    ]/*,
		    function(err,result) {

		       // Result is an array of documents
		       if(err){
		       		console.log(err)
		       		return err
		       }

		       console.log('Prueba del query de estadisticas')

		       console.log(result)
		
		       return result
		    }*/
		)


	},

}