# Node.js Light Switch
Toggling an Arduino-powered Remote-Controlled Light Switch on/off through a wonderful LAN server

## If You Sorta Know What You're Doing:
1. Prepare your Arduino
   - Upload the RemoteControl-RoomOutlets.ino file to your Arduino
   - Take note of the 'Port' that you upload to (e.g. Arduino IDE, under Tools -> `Port: "COM5 (Arduino/Genuino Uno)"`)
   - Put the circuit together.
2. Install [Node.JS](https://nodejs.org/en/download/), navigate to your preferred directory, and open up a Node-Powered command prompt
3. Clone the Repo with `git clone git@github.com:itimoto/NodeJS-Light-Switch`
   - Under *index.js*, change the `var portName = "COM5"` line to match the Arduino Port
4. Run `npm install` to install the necessary dependencies
   - We're primarily using [Express](https://github.com/expressjs/express), [WebSockets](https://github.com/websockets/ws), and [Serialport](https://github.com/serialport/node-serialport)
5. Run `node server.js` to initialize the server
   - Under *index.html*, be sure to change the `var socket = new Websocket("...` line to match your local IP
   - If you don't: you won't be able to access the WebSocket from other devices on your network
6. Put in `localhost:8080` in your friendly-neighborhood-browser and you'll be greeted with the Buttons
   - Press each button to toggle the light on/off

---
![Button-Lighting Demonstration](https://github.com/Itimoto/NodeJS-Light-Switch/blob/master/Misc.%20Files/IoT-demo.gif)
>*It's not the prettiest thing in the world, but it works... sometimes*

## Oh My Oh Why?
I've had a set of remote-controlled power sockets for a while (similar to [this](https://www.amazon.com/Beastron-Remote-Control-Electrical-Outlet/dp/B074CRGFPZ)) but fairly recently the remote had its last breath. Specifically, the battery ran out — but the battery's *strange* and *uncommon* and *it would have still been simpler to hook it up to an Arduino*

At the same time, I wanted to learn a bit about networking and passing along interactions online; this felt like a good time to try it out.

## Credit Given Where Credit is Due
I won't be the first to admit that this isn't *all* my work. Much of this code has been hobbled together from different online tutorials, ranging from [Node.js scripts interacting with Serial devices](https://itp.nyu.edu/physcomp/labs/labs-serial-communication/lab-serial-communication-with-node-js/) to setting up and [running an Express Server](https://gist.github.com/aerrity/fd393e5511106420fba0c9602cc05d35) to [an old StackOverflow question](https://stackoverflow.com/questions/22646996/how-do-i-run-a-node-js-script-from-within-another-node-js-script) that I used for running the Serial-Interacting script (*index.js*) from within the Server script.

I'm a bit of a script-kiddie in this case, and I'm not proud of it. I didn't know what I didn't know, and I needed a quick and tutorialized way of figuring out how Sockets and Node Syntax and the lot worked. Which brings us to, well:

## How's It Work (Serverwise)?
I'll assume that you know as much as I did:
> Servers are Computers. They can run an HTML page with fancy CSS, and Javascript's all over the place to make it nice and interactive.

> There are many flavors of JS. Some can run server Backends (Managing Files, Clients, etc.), others do Frontend stuff (Interactive pages, Games, etc.)

> One of the many flavors is Node.js, which you can use to talk to your Server and vice-versa.

> Other people have hooked up their Circuits to the Cloud. Hobbyist Internet-of-Things are possible, and are sometimes done in JS. Especially with Node.js

> Your computer has a local IP (192.168.X.XXX), assigned by your router, and a bunch of ports (e.g. 8080, 3000, etc.) that other computers can connect to. You've also used a Command Line and can program enough to write Snake 

> *That's all that you know about networking*

Now, there's a thing called *node.js.* Basically, it lets you run Javascript *on* your computer, rather than a Browser (where JS usually runs) It's a Backend & Frontend language, capable of running a server to which you and many people can hook up to. It's very nice, and comes with a handy thing called *npm* - the Node Package Manager, which lets you download/install packages (like other libraries (*modules*, for node.js)), update modules, etc. 

Making a server's fairly simple with Node. If you want to serve a single HTML file, you just need to execute `http-server` when you're in a terminal sharing a directory with the file. It'll be available at `localhost:8080`, but it doesn't do much.

Rather, if you want to do other, nonstatic things, you'll need to use Express, a framework allowing app execution, etc. Here (*server.js*), you'll start up the *separate* script (*index.js*) that'll interact with your Arduino, then start up the *index.html* file to interact with *index.js*. Then, it'll 'listen' on Port 8080 (meaning that it'll 'listen' for requests to view *index.html*, then promptly serve it to the clients)

We're executing *index.js* separately because it's running our WebSocket server. Now, the difference between WebSocket and Express isn't too bad; from what I understand, WebSocket gives you 'Sockets' allowing for bidirectional communication between the Server and the Client. That way, your *Client* can send information to the *Server*, and your Server can do other things with it.

Here, we're using Websocket to transmit a message ('1', '2', or '3') from our Client (see: *index.html*, under the first p5.js script) to our Server (see: *index.js*) Notice that we're sending it over Port 8081 instead of Port 8080 — this is to keep from interfering with the client, since Port 8080 is already displaying *index.html*. The WebSocket's Event Listeners (which constantly check for *'connection'* and *'message'* and *'close'*) notice the *'connection'*, triggering the `handleConnection()` function and, in turn, the `client.on('message',...)` listener.

Once the Client sends a message (with the `socket.send(message)` function executed on clicking the button), the `client.on('message',...)` listener picks it up and passes the message/data to `sendToSerial(data)`, which passes it to the Serial Port connected to the Arduino.

...

At any rate, that's a high-level view of the core components of the system. For more detailed explanations, go to the 'Credit Given Where Credit is Due' section. The Serialport tutorial (from ITPNYU) has been one of the *most* helpful guides in understanding Node.js

Hope this helps!

## What About Getting Physical?

The Remote has buttons. Each button can be manipulated.

Through careful experimentation, I found that if you sink (take down to *ground*) one side of the button, the button would turn on. In turn, if you hook up each button to an IO pin held normally-HIGH (with a 220 ohm resistor for circuit protection), you can toggle the button by taking the pin LOW for a short duration before taking it back HIGH again.

The only reason why we keep the pin LOW for longer than a few ms is because, well, it seems that it takes a few tries before each remote Power Socket receives the remote's signal.
