import dotenv from 'dotenv';

dotenv.config();

export const port = process.env.PORT || 3001;
export const dbUri = process.env.MONGO_URI;
export const clientUrl = process.env.CLIENT_URL;

