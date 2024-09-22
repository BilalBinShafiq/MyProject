const { exec } = require('child_process');
const psList = require('ps-list');

// Define the path to the GoLogin executable, including the .exe file
const gologinPath = `"C:\\Users\\bilal\\AppData\\Local\\Programs\\GoLogin\\GoLogin.exe"`;

// Function to check if GoLogin is already running
async function isGoLoginRunning() {
    try {
        const processes = await psList();
        return processes.some(process => process.name.toLowerCase().includes('gologin'));
    } catch (err) {
        console.error('Error checking processes:', err);
        return false;
    }
}

// Function to open GoLogin browser
async function openGoLogin() {
    try {
        const isRunning = await isGoLoginRunning();

        if (isRunning) {
            console.log('GoLogin is already running.');
        } else {
            exec(gologinPath, (err) => {
                if (err) {
                    console.error(`Error opening GoLogin: ${err}`);
                } else {
                    console.log('GoLogin browser opened successfully.');
                }
            });
        }
    } catch (err) {
        console.error('Error during GoLogin launch:', err);
    }
}

// Export the function
module.exports = openGoLogin;