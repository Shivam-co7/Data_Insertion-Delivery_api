/********************************************************
 *  Author : Shivam Cahturvedi                          *
 *  Date   : 13/8/22                                    *              
 *  Name   : Data_Insertion_Api                         *
 ********************************************************/

//Including Necessary Modules

const express    = require('express')              ;
const app        = express()                       ;

const upload     = require('express-fileupload')   ;
const exphbs     = require('express-handlebars')   ;
const mysql      = require('mysql')                ;
const bodyparser = require('body-parser')          ;
const Buffer     = require('buffer').Buffer        ;

//Setting up the modules & View engine

app.use(upload());
app.engine('hbs', exphbs.engine({extname: '.hbs' }));
app.set('view engine', 'hbs' );

//Creating server Connection

app.listen("8080", () =>{console.log("Connected to Server on port: 8080");});
app.use(bodyparser.urlencoded({ extended: true}));

//Creating Mysql-Databse connection

const db = mysql.createConnection({
    host        : "localhost"   ,
    user        : "root"        ,
    password    : ""            ,
    database    : "api_database",
    table       : "entries"
});

db.connect((err) => {
    if(err) throw err;
    console.log("Database Connected Successfully!");
});


//Setting api calls for requesting & inserting data

app.get('', (req, res) => {
    res.render('index');  
});

//Sent data with get method

app.get('/image', (req, res) => {

//Assigning data to variables

    global.ID   = req.query.number;
    global.NAME = req.query.person;

//Calling image.hbs file

    res.render('image');
});

//Sent data with post method

app.post("/api_insert", (req, res) => {
    
//Assigning GLOBAL data to local variable for sql query

    var id          = ID;
    var name        = NAME;
    let bill        = req.files?.Bill;
    let receiver    = req.files?.Receiver;
    let photo       = req.files?.Photo;

//Assigning buffer data

    let billbuf     = bill.data;
    let receiverbuf = receiver.data;
    let photobuf    = photo.data;

//Converting buffer data to json & Assigning 
    
    let billdata    = billbuf.toJSON();
    let receiverdata= receiverbuf.toJSON();
    let photodata   = photobuf.toJSON();

//Assigning sql query & calling it

    let sql = `INSERT INTO entries (lr_number, d_person, bill, receiver, photo_id) VALUES (${id}, '${name}', '${billdata}', '${receiverdata}', '${photodata}')`;

    db.query(sql, (err, result) => {
        if(err) throw err;
        
//Confirmation on terminal

        console.log("Data Stored in Database!\n");
    });

    
    //To Display what data is stored, on terminal
    
    console.log("Id: " + id + "\n" + "Name: " + name +"\n" + "Bill_Data: ");
    console.log(billdata)                                                  ;
    console.log("\nReceiver_Data: ")                                       ;
    console.log(receiverdata)                                              ;
    console.log("\nPhoto_ID_Data: ")                                       ;
    console.log(photodata)                                                 ;
    
    res.render("api_insert");
});

//To Display all data from data base on Client Side

app.get("/show", (req, res) => {

    db.query("SELECT * FROM entries", (err, result, fields) => {
        if(err) throw err;

        res.send(result);
    });

});
    