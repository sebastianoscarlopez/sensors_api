import dotenv from 'dotenv'
import express from 'express'
import { measurements} from './data.js'

dotenv.config()

const app = express()

app.get('/', (req, res) => {
	res.send('sensors api')
})

const getTime = () => (new Date()).toISOString().replace(/[^0-9]/g, "").slice(0, -3)

app.get('/time', (req, res) => {
	res.send(getTime())
})

app.get('/measurements', async (req, res) => {
	const { sensorid, time, value, datalength='10', skip='0' } = req.query
	const filter = { sensorid }
	const values = await measurements.get({ sensorid, limit: parseInt(datalength), skip: parseInt(skip) })
	res.send(values)
})

app.get('/save', (req, res) => {
	const { sensorid, time = getTime(), value } = req.query
	const id = measurements.insert({ sensorid, time, value })
	res.send('')
})

app.get('/total', (req, res) => {
	res.send(measurements.total())
})

app.get('/reset', (req, res) => {
	measurements.reset()
	res.send('')
})

app.listen(process.env.PORT || 3000)

