//helps manage servers and routes on top of Node.js
const express = require('express');

//Parse request body, using the req.body
const bodyParser = require('body-parser');

//Axios to help in requests to other services
const axios = require('axios');

//define app to be used for the routes
const app = express();
//port of running app
const port = 3000;

//ip address & port of catalog service 
const ipAdd_S1 = '192.168.1.17';
const port_S1 = '3011';

//ip address & port of order service 
const ipAdd_S2 = '192.168.1.11';
const port_S2 = '3010';

//body parser to help in parsing the requests' body
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());


//search request to get books according to topic passed as parameter in the API
app.get("/search/:topic", (req, res) => {
  let dataTobeSent = ""
  //get the topic parameter value 
  let query = req.params.topic;
  //axios route to send a request to the catalog service using its ip and port
  //parameter passed within the URI
  axios
    .get('http://' + ipAdd_S1 + ':' + port_S1 + '/search/' + query)
    .then(resw => {
      //show the results
      if (resw.data == 'Somthing wrong occurred!' || resw.data == 'No books found related to this topic') {
        console.log(resw.data);
        dataTobeSent = resw.data;
      }
      else {
        //if books found return the list of books in json format
        console.log("list of books related to this topic was found");
        dataTobeSent += "list of books related to this topic was found \n";
        resw.data.forEach(element => {
          dataTobeSent += "- Book Number is '" + element.ID + "' and Book Name is '" + element.Name + "'\n"
        });

      }
      res.send(dataTobeSent)
    })
    .catch(error => {
      console.error(error);
    });

})

//search request to get books according to topic passed as json in the request body 
app.get("/search", (req, res) => {
  let dataTobeSent = ""
  //get the topic by parsing the request body 
  let query = req.body.topic;

  //axios route to send a request to the catalog service using its ip and port
  //parameter passed in the body
  axios.get('http://' + ipAdd_S1 + ':' + port_S1 + '/search',
    {
      data: {
        topic: query
      }
    })
    .then(resw => {
      //show the result
      if (resw.data == 'error' || resw.data == 'no books found related to this topic') {
        console.log(resw.data);
        dataTobeSent += resw.data
      }
      else {
        //if books found return the list of books in json formate
        console.log("list of books related to this topic was found");
        dataTobeSent += "list of books related to this topic was found\n"
        resw.data.forEach(element => {
          dataTobeSent += "- Book Number is '" + element.ID + "' and Book Name is '" + element.Name + "'\n"
        });

      }
      res.send(dataTobeSent);
    })
    .catch(error => {
      console.error(error);
    });
})

//info request to get book information which number passed as parameter in the URI
app.get("/info/:item_number", (req, res) => {
  let dataTobeSent=""
  //get the item number value from the parameter
  let query = req.params.item_number;
  //axios request to catalog server passing the item_number in the URI
  axios
    .get('http://' + ipAdd_S1 + ':' + port_S1 + '/info/' + query)
    .then(resw => {
      //show the result
      if (resw.data == 'Somthing wrong occurred!' || resw.data == 'Book does not exist, make sure to enter valid item number') {
        console.log(resw.data);
        dataTobeSent=resw.data
      }
      else {
        //if book found return its info
        console.log("Book Found");
        dataTobeSent="Book Found\n"
        dataTobeSent+="- Book Name is '"+resw.data.Name+"'\n"
        dataTobeSent+="- Book Topic is '"+resw.data.Topic+"'\n"
        dataTobeSent+="- Book Cost is '"+resw.data.Cost+"'\n"
        dataTobeSent+="- Book Number of items is '"+resw.data.NumItem+"'\n"
      }
      res.send(dataTobeSent);
    })
    .catch(error => {
      console.error(error);
    });
})

//info request to get book information which number passed in the request body
app.get("/info", (req, res) => {
  let dataTobeSent=""
  //get the topic by parsing the request body 
  let query = req.body.item_number;

  //axios route to send a request to the catalog service using its ip and port
  //parameter passed in the body
  axios.get('http://' + ipAdd_S1 + ':' + port_S1 + '/info',
    {
      data: {
        item_number: query
      }
    })
    .then(resw => {
      //show the results
      if (resw.data == 'Somthing wrong occurred!' || resw.data == 'Book does not exist, make sure to enter valid item number') {
        console.log(resw.data);
        dataTobeSent=resw.data
      }
      else {
        //if book found return its info
        console.log("Book Found");
        dataTobeSent="Book Found\n"
        dataTobeSent+="- Book Name is '"+resw.data.Name+"'\n"
        dataTobeSent+="- Book Topic is '"+resw.data.Topic+"'\n"
        dataTobeSent+="- Book Cost is '"+resw.data.Cost+"'\n"
        dataTobeSent+="- Book Number of items is '"+resw.data.NumItem+"'\n"
      }
      res.send(dataTobeSent)
    })
    .catch(error => {
      console.error(error);
    });
})

//purchase request inorder to buy a book by passing its number in the URI
app.post("/purchase/:item_number", (req, res) => {
  //get the item number from the parameters
  let query = req.params.item_number;
  //axios request to purchase server providing its ip+port and pass the item number and the amount of decrement 
  //using put request to update the number of items in the stock
  axios
    .post('http://' + ipAdd_S2 + ':' + port_S2 + '/purchase', { item_number: query, amount: 1 })
    .then(resw => {
      //show the result of purchasing process
      res.send(resw.data);
    })
    .catch(error => {
      console.error(error);
    });
})

app.listen(port, () => console.log(`Front-End service is running on port ` + port));