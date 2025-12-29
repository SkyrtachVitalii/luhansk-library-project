import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || '';

export const connectToDB = async () => {
    const connectionState = mongoose.connection.readyState;

    if(connectionState === 1){
        console.log("✅ Вже підключено до MongoDB");
        return;
    }

    if(connectionState === 2){
        console.log("⏳ Підключення в процесі...");
        return;
    }

    try {
        if(!MONGO_URI){
            throw new Error("❌ MONGODB_URI не знайдено в .env файлі");
        }

        await mongoose.connect(MONGO_URI, {
            dbName: "luhansk_library",
            bufferCommands: true,
        })
        
    } catch (error) {
        console.error("❌ Помилка підключення до MongoDB:", error);
        throw new Error("Помилка підключення до бази даних");
    }
}