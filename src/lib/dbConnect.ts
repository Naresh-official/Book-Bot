import mongoose from "mongoose";

type connection = {
    isConnected: boolean;
};

const connection: connection = {
    isConnected: false,
};

const dbConnect = async () => {
    try {
        if (connection.isConnected) {
            return;
        }
        const db = await mongoose.connect(process.env.MONGODB_URI as string);
        connection.isConnected = !!db.connections[0].readyState.valueOf();
    } catch (error: any) {
        console.log("Error connecting to MongoDB: ", error.message);
        process.exit(1);
    }
};

export default dbConnect;
