const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
//npm library used to interact with file system
const fs = require("fs");
//used for converting the json format of the data into csv format.
const json2csv = require("json2csv").parse;


const app = express();
const port = 3010;

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());

//purchase request to buy the book with number passed in the request body
app.post("/purchase", (req, res) => {
  let item_number = req.body.item_number;
  let amount = req.body.amount;//amount of decrementing

  //axios request sent to catalog server inorder to check if the book is found and in stock
  axios
    .get('http://192.168.1.17:3011/numStock/' + item_number)
    .then(resw => {
      //show the results if not found or out of stock
      if (resw.data == "Item not found!" || resw.data == "Item Out of stock!") {
        res.send(resw.data);
      }
      else {
        //if book found and in stock
        //add the order to the orderdb in file OrderDB.CSV
        var newLine = '\r\n';

        var fields = ['BookId', 'BookCost','Time'];

        var appendThis = [
          {
            BookId: resw.data.ID,
            BookCost: resw.data.Cost,
            Time: new Date(),
          },
        ];
        

        
        fs.stat('OrderDB.CSV', function (err, stat) {
          if (err == null) {
            console.log('File exists');
        
            //write the actual data and end with newline
            var csv = json2csv(appendThis,{header:false})+newLine;
            var newCsv = csv.replace(/[\\"]/g, "");
            fs.appendFile('OrderDB.CSV', newCsv, function (err) {
              if (err) throw err;
              console.log('The "data to append" was appended to file!');
            });
          } else {
            //write the headers and newline
            console.log('New file, just writing headers');
            fields = fields + newLine;
        
            fs.writeFile('OrderDB.CSV', fields, function (err) {
              if (err) throw err;
              console.log('file saved');
            });
          }
        });
        //send axios request to catalog server to update numbe rof items in the stock of that book
        //inorder to use restful api's put need to passed all the fields of the book with the new update
        axios
          .put('http://192.168.1.17:3011/update', {
            ID: resw.data.ID,
            Topic: resw.data.Topic,
            Cost: resw.data.Cost,
            NumItem: resw.data.NumItem - amount,//the updated data
            Name: resw.data.Name
          })
          .then(resu => {
            console.log("Purchase done!")
            res.send("Thank you for visiting BAZAR.com \n" + "Bought book '" + resw.data.Name + "'")
          })
          .catch(error => {
            res.send("Something went wrong")
          });
      }

    }

    )
    .catch(error => {
      console.error(error);
    });


})

app.listen(port, () => console.log("Purchase Service is running on port " + port));