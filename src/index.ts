import express from "express"
import * as bodyParser from "body-parser"
import { AppDataSource } from "./data-source"
import router from "./routes/index"
require('dotenv').config()
import path from "path"

AppDataSource.initialize().then(async () => {

    const port = 5000

    // create express app
    const app = express()
    app.use(bodyParser.json({limit: '50mb'}))
    app.use(express.static('public'))

    // setup express app here
    // router
    app.use('/', router)

    app.get("/", (req, res) => {
        res.send(`Shamo API Running ${port}`)
    })

    // start express server
    app.listen(process.env.PORT || 5000, ()=> {
        console.log(`Server running at port ${port}`)
    })

    console.log(`Express server has started on port ${port}. Open http://localhost:${port} to see status`)

}).catch(error => console.log(error))
