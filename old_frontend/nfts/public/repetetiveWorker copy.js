console.log("woert")
    self.onmessage = function(e) {
       console.log("Message received from main script"+ e.data);
    }
     postMessage("Date.now()");
    setInterval(() => {
        postMessage("Date.now()");
      }, 1000);
  
  
