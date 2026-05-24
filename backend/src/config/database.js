const mongoose=require('mongoose')

async function connectToDB(){
   try{ await mongoose.connect(process.env.MONGO_URI)
    console.log("connected to DB")
   }

    catch{
        console.log("error detected")
    }
}

module.exports=connectToDB;