import express from "express"
import * as bodyParser from "body-parser"
import { AppDataSource } from "./data-source"
import router from "./routes/index"

AppDataSource.initialize().then(async () => {

    // create express app
    const app = express()
    app.use(bodyParser.json())

    // setup express app here
    // router
    app.use('/', router)

    app.get("/", (req, res) => {
        res.send("API Running")
    })

    // start express server
    app.listen(process.env.PORT || 5000, ()=> {
        console.log('Server running at port 5000')
    })

    console.log("Express server has started on port 5000. Open http://localhost:5000/users to see results")

}).catch(error => console.log(error))
