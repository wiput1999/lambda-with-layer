const { exec } = require("node:child_process");

exports.handler = async (event = {}) => {
  const commands = ["ls -R /var/task", "ls /opt"];
  for (const cmd of commands) {
    try {
      const res = await execShellCommand(cmd);
      console.log(`Result of ${cmd}:`, res);
    } catch (err) {
      console.log(`error executing command - ${cmd}:`, err);
    }
  }
};

function execShellCommand(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.warn(error);
      }
      resolve(stdout ? stdout : stderr);
    });
  });
}
