const express =require('express')

const app=express();
const cookieparser=require("cookie-parser")
const cors=require("cors")



app.use(cookieparser())
app.use(express.json())
app.use(cors({
    origin:"http://localhost:5173",
   credentials: true
}))

app.use(express.urlencoded({ extended: true }));

const authRouter=require("./routes/auth.routes")
const interviewRouter=require("./routes/interview.routes")

app.use("/api/auth",authRouter)
app.use("/api/interview",interviewRouter)


module.exports=app;