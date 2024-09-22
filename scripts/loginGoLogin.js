const { Builder, By, Key, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

// Path to GoLogin executable
const gologinPath = `"C:\\Users\\bilal_guu0lx4\\AppData\\Local\\Programs\\GoLogin\\GoLogin.exe"`;

async function loginGoLogin() {
  // Set up Chrome WebDriver options to use the GoLogin browser
  let options = new chrome.Options();
  options.setChromeBinaryPath(gologinPath);

  // Build Selenium WebDriver
  let driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();

  console.log("beforeTry");

  try {
    console.log("2");

    // Give time for the GoLogin application to fully launch
    await driver.sleep(10000); // Adjust based on how long it takes to launch
    console.log("3");

    // Optional: Maximize window to ensure visibility of elements
    await driver.manage().window().maximize();

    // Step 1: Click on the "I already have an account Log in" link if necessary
    try {
      const loginLinkText = "I already have an account Log in";
      const loginLink = await driver.findElement(
        By.xpath(`//*[contains(text(),'${loginLinkText}')]`)
      );
      await loginLink.click();
    } catch (e) {
      console.log("Login link not found or already displayed:", e.message);
    }

    // Step 2: Wait for the login form to be present and interact with it
    await driver.wait(until.elementLocated(By.id("username")), 10000);

    // Step 3: Find the username and password fields and enter details
    await driver.findElement(By.id("username")).sendKeys("your-username");
    await driver
      .findElement(By.id("password"))
      .sendKeys("your-password", Key.RETURN);

    // Step 4: Optionally, wait for a dashboard element or title to confirm login
    await driver.wait(until.titleContains("dashboard"), 10000);

    console.log("Logged in successfully!");
  } catch (err) {
    console.error("Error during Selenium automation:", err);
  } finally {
    await driver.quit();
  }
}

module.exports = loginGoLogin;
