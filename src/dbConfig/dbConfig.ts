import mongoose from "mongoose"

export const Connect=async()=>{

    try {
        mongoose.connect(process.env.MONGO_URL!)
        const connection=mongoose.connection

        connection.on('connected',()=>{
            console.log("Mongodb connected successfully")
        })
        connection.on('error',(err)=>{
            console.log('Mongo connection error.Please make sure mongodb is running',err)
            process.exit(1)
        })
        
    } catch (error) {
        console.log('Something goes wrong!');
        console.log(error);
    }
}