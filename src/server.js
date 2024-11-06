import AuthRouter from "./Routes/authenticationRouter.js"
import express from "express"

const app = express()

app.use(express.json())

app.use('/authenticate', AuthRouter)

app.listen(8000,()=>{
    console.log("Server is running")
})