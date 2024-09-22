const axios = require('axios');
const {
    HttpsProxyAgent
} = require('https-proxy-agent');
const express = require('express');
const app = express();
const port = 3000;

function logRiskScore(riskScore) {
    // Calculate the percentage and format it to three decimal places then return it
    return (riskScore * 100).toFixed(3);
}

function getProxyDetails(proxyString) {
    // Split the string by colon
    const [host, port, username, password] = proxyString.split(':');

    // Construct the proxy details object
    return {
        host: host,
        port: parseInt(port, 10), // Convert port to a number
        username: username,
        password: password
    };
}

// Function to check the proxy
async function checkProxy(proxyString) {
    const proxyDetails = getProxyDetails(proxyString);
    const proxyUri = `http://${proxyDetails.username}:${proxyDetails.password}@${proxyDetails.host}:${proxyDetails.port}`;
    const agent = new HttpsProxyAgent(proxyUri);

    try {
        // Sending the GET request through the proxy
        const response = await axios.get('https://ip.ipdataintel.com/#session12345', {
            httpsAgent: agent
        });

        // Processing the response
        const {
            ip,
            score,
            quality,
            error
        } = response.data;

        // Create an object to store the result
        const result = {
            proxyUri: proxyUri, // Proxy URI
            status: error ? 'Failed' : 'Success', // Status based on the error field
            resolvedIp: ip || 'Unknown', // The resolved IP from the proxy
            quality: quality || 'Unknown', // Proxy quality level
            riskScore: score || 'Unknown' // Risk score (or quality score)
        };

        // Log the result
        console.log('Proxy Test Result:');
        console.log(`Proxy URI   : ${result.proxyUri}`);
        console.log(`Status      : ${result.status}`);
        console.log(`Resolved IP : ${result.resolvedIp}`);
        console.log(`Quality     : ${result.quality}`);
        console.log(`Risk Score  : ${logRiskScore(result.riskScore)}%`);

    } catch (err) {
        // Handle the error if the proxy check failed
        console.error(`❌ Error: Proxy request failed - ${err.message}`);
    }
}

// Array of proxy strings
const proxyStrings = [
    // Add more proxy strings here
    "38.154.227.167:5868:jtrpzpdz:19dj72qq109t",
    "45.127.248.127:5128:jtrpzpdz:19dj72qq109t",
    "207.244.217.165:6712:jtrpzpdz:19dj72qq109t",
    "64.64.118.149:6732:jtrpzpdz:19dj72qq109t",
    "167.160.180.203:6754:jtrpzpdz:19dj72qq109t",
    "104.239.105.125:6655:jtrpzpdz:19dj72qq109t",
    "198.105.101.92:5721:jtrpzpdz:19dj72qq109t",
    "154.36.110.199:6853:jtrpzpdz:19dj72qq109t",
    "204.44.69.89:6342:jtrpzpdz:19dj72qq109t",
    "206.41.172.74:6634:jtrpzpdz:19dj72qq109t"
];

// Run the proxy check for each proxy
proxyStrings.forEach(proxyString => checkProxy(proxyString));

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.listen(port, () => {
    console.log(`App running at http://localhost:${port}`);
});