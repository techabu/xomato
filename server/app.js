require('dotenv').config()

const express = require('express')

const bodyParser    = require('body-parser')
const cors          = require('cors')

const router        = require('./routes/route')

var app = express()

app.use(cors())

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
// parse application/json
app.use(bodyParser.json({ limit: '50mb' }))


app.use('/api', router)

app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        res.status(status.codes['http']['unauthorized']).send(err.message)
    }
    if (err.name === 'ValidationError') {
        var valErrors = []
        Object.keys(err.errors).forEach(key => valErrors.push(err.errors[key].message))
        res.status(status.codes['http']['unprocessable']).send(valErrors)
    }

});


app.listen(process.env.PORT, () => console.log(`Server started at port : ${process.env.PORT}`))
