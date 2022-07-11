const express=require ('express');
const bodyParser=require ('body-parser');
const fs = require("fs");
const app=express();
const port=3009;
const csv = require('fast-csv');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
app.use(bodyParser.urlencoded({
    extended: true
  }));

app.use(bodyParser.json());
app.get("/search/:topic",(req,res)=> {
    let query=req.params.topic;
    const data = []

    fs.createReadStream('DB.CSV')
    .pipe(csv.parse({ headers: true }))
    .on('error', error => console.error(error))
    .on('data', (row) => {
        if(row.Topic==query){
            data.push({"Name":row.Name,"ID":row.ID});
        }
        
    })
    
    .on('end', () =>  {
        res.send(data);
        }
    );
   
    
})

app.get("/search",(req,res)=> {
    let query=req.body.topic;
    const data = []

    fs.createReadStream('DB.CSV')
    .pipe(csv.parse({ headers: true }))
    .on('error', error => console.error(error))
    .on('data', (row) => {
        if(row.Topic==query){
            data.push({"Name":row.Name,"ID":row.ID});
        }
        
    })
    
    .on('end', () =>  {
        res.send(data);
        }
    );
   
    
})

app.get("/info/:item_number",(req,res)=> {
    let query=req.params.item_number;
    const data = []
    fs.createReadStream('DB.CSV')
    .pipe(csv.parse({ headers: true }))
    .on('error', error => console.error(error))
    .on('data', (row) => {
        if(row.ID==query){
            data.push({"Name":row.Name,"Topic":row.Topic,"NumItem":row.NumItem,"Cost":row.Cost});
        }
    })
    
    .on('end', () =>  {
        res.send(data[0]);
        }
    );
   
    
})
app.get("/info",(req,res)=> {
    let query=req.body.item_number;
    const data = []
    fs.createReadStream('DB.CSV')
    .pipe(csv.parse({ headers: true }))
    .on('error', error => console.error(error))
    .on('data', (row) => {
        if(row.ID==query){
            data.push({"Name":row.Name,"Topic":row.Topic,"NumItem":row.NumItem,"Cost":row.Cost});
        }
    })
    
    .on('end', () =>  {
        res.send(data[0]);
        }
    );
   
    
})
app.listen(port, ()=> console.log("hello"));