const app = require('./app');

const port = 3001; // Change this to a different port number

// 4) START SERVER
app.listen(port, () => {
    console.log(`App is running at http://localhost:${port}`);
    // run(); // Run the proxy checks when the server starts
});
