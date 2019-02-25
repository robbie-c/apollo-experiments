import app from "./app";
import databaseConnection from "./config/dbConnection";

const PORT: number = Number(process.env.PORT) || 3000;

databaseConnection.then(() => app.listen(PORT)).catch(console.error);
