import mongoose from 'mongoose';

const retryTimer = Number(process.env.MONGO_RETRY_TIMER) || 5000;
const mongoDbName = process.env.MONGO_DB;

class MongooseService {
    private count = 0;
    private maxRetries = 10;
    private mongooseOptions = {
        serverSelectionTimeoutMS: 5000,
    };

    constructor() {
        this.connectWithRetry();
    }

    getMongoose() {
        return mongoose;
    }

    connectWithRetry = () => {
        console.log(`[MongoDB] Attempting MongoDB connection #${this.count+1}.`);
        mongoose
            .connect(`mongodb://database:27017/${mongoDbName}`, this.mongooseOptions)
            .then(() => {
                console.log('[MongoDB] Successfully connected to MongoDB.');
            })
            .catch((err) => {
                console.log(`[MongoDB] Failed to connect #${this.count+1}. Error:`, err);
                this.count += 1;
                if (this.count >= this.maxRetries) {
                    console.log(`[MongoDB] Can't connect, max retries reached.`);
                    throw new Error(`Can't conenct to MongoDB`);
                }
                console.log(`[MongoDB] Retry in ${retryTimer / 1000 | 0} seconds.`);
                setTimeout(this.connectWithRetry, retryTimer);
            });
    };
}
export default new MongooseService();
