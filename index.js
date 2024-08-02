const uWS = require('uWebSockets.js');
const namespaces = require('./data/namespaces');

const PORT = process.env.PORT || 9001;

const app = uWS.App();


let wsClients = [];
const dataOpen = [["OnOpen", namespaces[6].toString(), namespaces[7].toString()]];
let kutuIndex;
let shuffleKutu;

app.ws('/*', {
    // When a WebSocket connection is established
    open: (ws, req) => {
        console.log('A client connected!');
        ws.send(JSON.stringify(dataOpen));
        wsClients.push(ws);
    },

    // When a WebSocket message is received
    message: (ws, message, isBinary) => {
        const msg = isBinary ? message : Buffer.from(message).toString();
        console.log('Received message:', msg);
        
        let array;
        try {
          array = JSON.parse(msg);
          console.log('Received array:', array);
          // Further processing of the array can be done here
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }

        if (array[0] == "OnClick1"){
          kutuIndex = array[1];
          shuffleKutu = namespaces[0][array[1]].toString();
          let dataOnClick = [["OnClick1", namespaces[6].toString(), namespaces[7].toString(), kutuIndex, shuffleKutu]];
          ws.send(JSON.stringify(dataOnClick));
        } else if (array[0] == "OnClick1Kapanış"){
          namespaces[7] = 1;
          namespaces[2].push("OnClick1Kapanış");
          namespaces[2].push(kutuIndex);

          let dataOnClick = [namespaces[2], namespaces[3], ["OnClick1", namespaces[6].toString(), namespaces[7].toString()]];
          ws.send(JSON.stringify(dataOnClick));
        }

        
    },

    // When a WebSocket connection is closed
    close: (ws, code, message) => {
        console.log('A client disconnected.');
        wsClients = wsClients.filter(client => client !== ws);
    }
});

const broadcastMessage = (msg) => {
    wsClients.forEach(client => {
        client.send(msg);
    });
};

const Shuffle = () => {
  let beforeShuffle1 = [];
  let araShuffle1 = [];
  for (i=0; i<20; i++){
    beforeShuffle1.push(i);
  }
  
  for(i=0; i<beforeShuffle1.length; i++){
    let x = Math.floor(Math.random() * (beforeShuffle1.length));
    araShuffle1.push(beforeShuffle1[x]); 

    beforeShuffle1 = beforeShuffle1.filter(function(item) {
      return item !== beforeShuffle1[x]
    })
  }
  
  for(i=0; i<10; i++){
    namespaces[0].push(beforeShuffle1[i]);
    namespaces[0].push(araShuffle1[i]);
  }


  let beforeShuffle2 = [];
  let araShuffle2 = [];
  for (i=0; i<20; i++){
    beforeShuffle2.push(i);
  }
  
  for(i=0; i<beforeShuffle2.length; i++){
    let x = Math.floor(Math.random() * (beforeShuffle2.length));
    araShuffle2.push(beforeShuffle2[x]); 

    beforeShuffle2 = beforeShuffle2.filter(function(item) {
      return item !== beforeShuffle2[x]
    })
  }
  
  for(i=0; i<10; i++){
    namespaces[1].push(beforeShuffle2[i]);
    namespaces[1].push(araShuffle2[i]);
  }

  console.log(namespaces[0]);
  console.log(namespaces[1]);
}
Shuffle();

app.listen(PORT, (token) => {
    if (token) {
        console.log(`Listening to port ${PORT}`);
    } else {
        console.log(`Failed to listen to port ${PORT}`);
    }
});
