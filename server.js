// Import required modules
const mongoose = require('mongoose');
const dotenv = require('dotenv'); // You need to import dotenv

// Ensure you have dotenv installed and your .env file properly configured
dotenv.config({
    path: './config.env' // Only call dotenv once with the correct path
});

// Optional: If you need to replace any part in the connection string
// const DB = process.env.DATABASE.replace(
//     '<PASSWORD>',
//     process.env.DATABASE_LOCAL_PASSWORD
// )

// Connect to MongoDB
mongoose.connect(
    process.env.DATABASE_LOCAL, // Ensure your .env file has DATABASE_LOCAL variable set
).then(con => {
    console.log('DB connection successful!');
}).catch(err => {
    console.error('DB connection error:', err);
});

const app = require('./app'); // Import your Express app

const port = process.env.PORT || 3000; // Set a fallback for the port

// Start the server
app.listen(port, () => {
    console.log(`App is running at http://localhost:${port}`);
    // run(); // Uncomment if you need proxy checks when the server starts
});
