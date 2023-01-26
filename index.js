import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import mysql from "mysql2"
dotenv.config()

const app = express()
app.use(express.json())
app.use(cors())

const PORT = process.env.PORT || 3030
const CREDENTIAL = JSON.parse(process.env.CREDENTIAL)
const mysqlTable = "mock_data"

const db = mysql.createConnection(CREDENTIAL)

// check 
db.connect((err) => {
    if (err) {
        console.error(err)
        process.exit(1)
    }
    console.log("MySQL connected!")
})

// get: root
app.get("/", (req, res) => {
    console.log("MYSQL: I am root")
    res.send("MYSQL: I am root")
})

app.get("/gettable", (req, res) => {
    // Query
    const query = `SELECT * FROM ${mysqlTable} ORDER BY ID DESC LIMIT 10`
    // Send the Query
    db.query(query, (err, result) => {
        if (err) { 
            console.error(err)
            process.exit(1) 
        }
        // Result
        console.table(result)
        res.send("Query Sent!")
    })
})

// GET by ID
app.get("/class/:id", (req, res) => {
    // parameter and query
    const parameter = Number(req.params['id']) // .id works too
    const query = `SELECT * FROM ${mysqlTable} WHERE id=?`

    // send query
    db.query(query, [parameter], (err, result) => {
        if (err) { process.exit(1) }
        //result
        console.table(result)
        res.send("query sent!")
    })
})

// post
app.post("/post", (req, res) => {
    // param and query
    // const parameter = { id: null, first_name: "Anthony", last_name: "Styles", email: "Style@fashion.com", gender: "m", ip_address: "YourMom" }
    const parameter = req.body
    const query = `INSERT INTO ${mysqlTable} SET ?`;
    // send query
    db.query(query, parameter, (err, result) => {
        if(err) { 
            console.error(err)
            process.exit(1) 
        }

        console.log(result)
        res.send("post added")
    })
})

// delete Gisselle helped btw
app.delete("/delete/:id", (req, res) => {
    // param and query
    const parameter = (req.params['id']) // .id works too    put Number before (req.params['id])
    const query = `DELETE FROM ${mysqlTable} WHERE id=${id};` // ? instead of ${id} for secure
    // send query
    db.query(query, [parameter], (err, result) => {
        if (err) { 
            console.error(err)
            process.exit(1) 
        }
        //result
        console.table(result)
        res.send("Query Deleted!")
    })
})

app.listen(PORT, () => {
    console.log(`Listening on http://localhost${PORT}`)
})
