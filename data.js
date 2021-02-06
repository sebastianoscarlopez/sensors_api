import mongodb from 'mongodb/index.js'
const { MongoClient } = mongodb

const connect = async (action) => {
	const client = new MongoClient(process.env.CONNECTIONSTRING, { useUnifiedTopology: true, useNewUrlParser: true })
	client.connect(async (err) => {
		// perform actions on the collection object
		await action(client)
		client.close()
	})
}


export const measurements = {
	insert: ({ sensorid, time, value }) => {
		connect(async (client) => {
			const collection = client.db("sensors").collection("measurements")
			collection.insertOne({ sensorid, time, value })
		})
	},
	get: async ({ filter, limit }) => {
		return new Promise((resolve, reject) => {	
			connect(async (client) => {
				const collection = client.db("sensors").collection("measurements")
				collection.find(filter).sort({ time: - 1 }).limit(limit).toArray().then(resolve)
			})
		})
	},
	reset: () => {
		connect(async (client) => {
			const collection = client.db("sensors").collection("measurements")
			collection.deleteMany({ })
		})
	},
}
