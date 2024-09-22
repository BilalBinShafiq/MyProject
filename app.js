const express = require("express");
const morgan = require("morgan");

const rootRouter = require("./routes/rootRoutes");
const proxyRouter = require("./routes/proxyRoutes");
const axios = require("axios");
const { HttpsProxyAgent } = require("https-proxy-agent");

const openGoLogin = require("./scripts/openGoLogin");
const loginGoLogin = require("./scripts/loginGoLogin");

const app = express();

// 1) MIDDLEWARE
app.use(morgan("dev"));
app.use(express.json()); // Middleware to parse JSON body
app.use((request, response, next) => {
  console.log("Hello from middleware");
  next();
});
app.use((request, response, next) => {
  request.requestTime = new Date().toISOString();
  next();
});

// Array of proxy strings
const proxyStrings = [
  "204.44.69.89:6342:jtrpzpdz:19dj72qq109t",
  // ,
  // "38.154.227.167:5868:jtrpzpdz:19dj72qq109t",
  // "45.127.248.127:5128:jtrpzpdz:19dj72qq109t",
  // "207.244.217.165:6712:jtrpzpdz:19dj72qq109t",
  // "64.64.118.149:6732:jtrpzpdz:19dj72qq109t",
  // "167.160.180.203:6754:jtrpzpdz:19dj72qq109t",
  // "104.239.105.125:6655:jtrpzpdz:19dj72qq109t",
  // "198.105.101.92:5721:jtrpzpdz:19dj72qq109t",
  // "154.36.110.199:6853:jtrpzpdz:19dj72qq109t",
  // "206.41.172.74:6634:jtrpzpdz:19dj72qq109t"
];

// Base URL of the external API
const BASE_URL = "https://ip-score.com";
// Function to create an axios instance with proxy
function createAxiosInstance(proxyString) {
  const proxyDetails = getProxyDetails(proxyString);
  const proxyUrl = `http://${proxyDetails.username}:${proxyDetails.password}@${proxyDetails.host}:${proxyDetails.port}`;
  const agent = new HttpsProxyAgent(proxyUrl);

  return axios.create({
    baseURL: BASE_URL,
    httpAgent: agent,
    httpsAgent: agent,
  });
}
// Asynchronous functions for making API requests
async function getMyIP(axiosInstance) {
  try {
    const response = await axiosInstance.get("/ip");
    console.log("Your IP:", response.data);
  } catch (error) {
    console.error("Error fetching IP:", error.message);
  }
}
async function getLocationAndISP(axiosInstance) {
  try {
    const response = await axiosInstance.get("/json");
    console.log("Location and ISP:", response.data);
  } catch (error) {
    console.error("Error fetching location and ISP:", error.message);
  }
}
async function getCustomIPInfo(axiosInstance, ip) {
  try {
    const response = await axiosInstance.post("/json", null, {
      params: { ip },
    });
    console.log(`Location and ISP of ${ip}:`, response.data);
  } catch (error) {
    console.error(
      `Error fetching location and ISP for IP ${ip}:`,
      error.message
    );
  }
}
async function getBlacklistsInfo(axiosInstance) {
  try {
    const response = await axiosInstance.get("/spamjson");
    console.log("Blacklist info:", response.data);
  } catch (error) {
    console.error("Error fetching blacklist info:", error.message);
  }
}
async function getCustomBlacklistsInfo(axiosInstance, ip) {
  try {
    const response = await axiosInstance.post("/spamjson", null, {
      params: { ip },
    });
    console.log(`Blacklist info for ${ip}:`, response.data);
  } catch (error) {
    console.error(`Error fetching blacklist info for IP ${ip}:`, error.message);
  }
}
async function getFullInfo(axiosInstance) {
  try {
    const response = await axiosInstance.get("/fulljson");
    console.log("Full info:", response.data);
  } catch (error) {
    console.error("Error fetching full info:", error.message);
  }
}
async function getCustomFullInfo(axiosInstance, ip) {
  try {
    const response = await axiosInstance.post("/fulljson", null, {
      params: { ip },
    });
    console.log(`Full info for ${ip}:`, response.data);
  } catch (error) {
    console.error(`Error fetching full info for IP ${ip}:`, error.message);
  }
}
// Function to check proxy
async function checkProxy(proxyString) {
  const axiosInstance = createAxiosInstance(proxyString);

  console.log(`Using proxy: ${proxyString}`);

  await getMyIP(axiosInstance);
  await getLocationAndISP(axiosInstance);
  await getBlacklistsInfo(axiosInstance);
  await getFullInfo(axiosInstance);
}
// Function to run the proxy check for each proxy in the array
async function run() {
  for (const proxyString of proxyStrings) {
    await checkProxy(proxyString);
  }
}

// openGoLogin();
loginGoLogin();

// 2) ROUTE HANDLERS

// 3) Routes
app.use("/", rootRouter);
app.use("/api/v1/proxies/", proxyRouter);

// 4) START SERVER
module.exports = app;
