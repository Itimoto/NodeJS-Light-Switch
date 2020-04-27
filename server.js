//  Tutorial for setting up Express-Server: https://gist.github.com/aerrity/fd393e5511106420fba0c9602cc05d35
//  Running the Child Process (the external 'index.js' script that accesses the arduino's serial port) https://stackoverflow.com/questions/22646996/how-do-i-run-a-node-js-script-from-within-another-node-js-script

console.log('Server-Side Code Running');

const childProcess = require('child_process');

function runScript(scriptPath, callback) {
    // keep track of whether callback has been invoked to prevent mutiple invocations
    var invoked = false;
    var process = childProcess.fork(scriptPath);

    // Listen for errors as they may prevent exit event from firing
    process.on('error', function (err) {
        if (invoked) return;
        invoked = true;
        callback(err);
    });

    // Execute the callback once the process has finished running
    process.on('exit', function (code) {
        if (invoked) return;
        invoke = true;
        var err = code === 0 ? null : new Error('exit code ' + code);
        callback(err);
    });
}

// Now, we'll run the external script and invoke a callback when complete:
runScript('./index.js', function (err) {
    if (err) throw err;
    console.log('Finished Running Index.JS');
});

const express = require('express');
const app = express();

// Serve files from the public directory
app.use(express.static('public'));

// Start the express web server listening on 8080
app.listen(8080, () => {
    console.log('listening on 8080');
});

// Serve the homepage
app.get('/', (req, res) => {
    res.sendFile(__dirName + '/index.html');
});
