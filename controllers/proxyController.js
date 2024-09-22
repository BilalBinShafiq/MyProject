let proxyDetailsArray = [];

// Function to split and extract proxy details
function getProxyDetails(proxyString) {
    const [host, port, username, password] = proxyString.split(':');
    return {
        host: host,
        port: parseInt(port, 10),
        username: username,
        password: password
    };
}

exports.getAllProxies = (request, response) => {
    response.status(200).json({
        status: 'success',
        requestedAt: request.requestTime,
        result: proxyDetailsArray.length, // Length of stored proxy details
        data: {
            proxies: proxyDetailsArray // Returning the proxy details array
        }
    });
}

exports.AddProxy = (request, response) => {
    const { proxyStrings } = request.body; // Expecting an array of proxy strings

    // Validate if proxyStrings is an array
    if (!Array.isArray(proxyStrings)) {
        return response.status(400).json({ status: 'fail', message: 'Invalid data format. Expected an array of strings.' });
    }

    // Ensure the array is not empty
    if (proxyStrings.length === 0) {
        return response.status(400).json({ status: 'fail', message: 'No proxy strings provided.' });
    }

    // Loop over each proxy string and extract details
    proxyStrings.forEach(proxyString => {
        const proxyDetails = getProxyDetails(proxyString);

        // Check if the proxy already exists to avoid duplicates
        const isDuplicate = proxyDetailsArray.some(
            (existingProxy) =>
                existingProxy.host === proxyDetails.host &&
                existingProxy.port === proxyDetails.port &&
                existingProxy.username === proxyDetails.username &&
                existingProxy.password === proxyDetails.password
        );

        if (!isDuplicate) {
            proxyDetailsArray.push(proxyDetails); // Store details if not a duplicate
        }
    });

    response.status(200).json({ status: 'success', message: 'Proxies processed and stored.' });
}

exports.getProxy = (request, response) => {
    const { host } = request.params; // Get host from route parameters

    // Find the proxy with the given host
    const proxy = proxyDetailsArray.find(proxy => proxy.host === host);

    // If no proxy is found, return 404
    if (!proxy) {
        return response.status(404).json({ status: 'fail', message: `Proxy with host ${host} not found.` });
    }

    // Return the found proxy details
    response.status(200).json({
        status: 'success',
        data: {
            proxy
        }
    });
}

exports.updateProxy = (request, response) => {
    const { host } = request.params;
    const { port, username, password } = request.body.proxy; // New data to update

    const proxyIndex = proxyDetailsArray.findIndex(proxy => proxy.host === host);

    if (proxyIndex === -1) {
        return response.status(404).json({ status: 'fail', message: `Proxy with host ${host} not found.` });
    }

    // Update the proxy details
    if (port) proxyDetailsArray[proxyIndex].port = parseInt(port, 10);
    if (username) proxyDetailsArray[proxyIndex].username = username;
    if (password) proxyDetailsArray[proxyIndex].password = password;

    response.status(200).json({
        status: 'success',
        message: `Proxy with host ${host} updated successfully.`,
        data: {
            updatedProxy: proxyDetailsArray[proxyIndex]
        }
    });
}

exports.deleteProxy = (request, response) => {
    const { host } = request.params;

    const proxyIndex = proxyDetailsArray.findIndex(proxy => proxy.host === host);

    if (proxyIndex === -1) {
        return response.status(404).json({ status: 'fail', message: `Proxy with host ${host} not found.` });
    }

    // Remove the proxy from the array
    proxyDetailsArray.splice(proxyIndex, 1);

    response.status(200).json({
        status: 'success',
        message: `Proxy with host ${host} deleted successfully.`
    });
}
