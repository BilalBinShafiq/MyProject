const { exec, spawn } = require("child_process");

// Define the path to the GoLogin executable
const gologinPath = `"C:\\Users\\bilal_guu0lx4\\AppData\\Local\\Programs\\GoLogin\\GoLogin.exe"`;

// Function to check if GoLogin is running using PowerShell
async function isGoLoginRunning() {
  return new Promise((resolve, reject) => {
    const command = `powershell -Command "Get-Process | Where-Object { $_.ProcessName -like '*gologin*' }"`;
    exec(command, (err, stdout, stderr) => {
      if (err) {
        console.error("Error checking if GoLogin is running:", stderr);
        return reject(false);
      }
      resolve(stdout.includes("GoLogin"));
    });
  });
}

// Function to bring a running GoLogin instance to the front using PowerShell
function bringGoLoginToFront() {
  const script = `
    $process = Get-Process -Name "GoLogin" -ErrorAction SilentlyContinue;
    if ($process) {
      $hwnd = $process.MainWindowHandle;
      if ($hwnd -ne 0) {
        (New-Object -ComObject WScript.Shell).AppActivate($process.id);
      }
    }
  `;
  spawn("powershell.exe", ["-Command", script], { stdio: "inherit" });
}

// Function to open GoLogin or bring it to the front
async function openGoLogin() {
  try {
    const isRunning = await isGoLoginRunning();

    if (isRunning) {
      console.log("GoLogin is already running. Bringing to the front...");
      bringGoLoginToFront();
    } else {
      exec(gologinPath, (err) => {
        if (err) {
          console.error(`Error opening GoLogin: ${err}`);
        } else {
          console.log("GoLogin browser opened successfully.");
        }
      });
    }
  } catch (err) {
    console.error("Error during GoLogin launch:", err);
  }
}

module.exports = openGoLogin;
