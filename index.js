import dotenv from 'dotenv'
import express from 'express'
import { measurements} from './data.js'

dotenv.config()

const app = express()

app.get('/', (req, res) => {
	res.send('sensors api')
})

app.get('/measurements', async (req, res) => {
	const { sensorid, time, value } = req.query
	const values = await measurements.get()
	res.send(values)
})

app.get('/save', (req, res) => {
	const { sensorid, time = (new Date()).toISOString().replace(/[^0-9]/g, "").slice(0, -3), value } = req.query
	const id = measurements.insert({ sensorid, time, value })
	res.send('')
})

app.get('/reset', (req, res) => {
	measurements.reset()
	res.send('')
})

app.listen(process.env.PORT || 3000)

