import mongoose from "mongoose"

const connectToDatabase = async () => {
    try {
        const connection = mongoose.connect(
            "mongodb+srv://theveledrom:zeynep6192002@cluster0.fkbifzo.mongodb.net/todoappbackend?appName=Cluster0"
        )
        if (connection) {
            console.log("Connection established")
        }
    } catch (error) {
        console.log("error in connectToDatabse")
        throw error
    }



}

export default connectToDatabase