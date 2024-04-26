import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import * as J from './jobs.js';
import * as C from './customer.js';
import * as I from './industrialist.js';

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
// app.use(express.static("public"));

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "DailyWagesDB",
    password: "postgres",
    port: 5432
})

db.connect();

// get call to show all the jobs
app.get("/jobs", async (req, res) => {
    try {
        const j = await db.query("SELECT * FROM industrialist i JOIN jobs ON i.id = jobs.industryId");
        let allJobs = [];
        allJobs = j.rows.map((job) => {
            let jobs = J.mapToJobs(job);
            // jobs["employer"] = J.mapToEmployer(job);
            return jobs;
        });
        res.status(200).json(allJobs);
    } catch(err) {
        console.log(err);
        res.status(500).send("INTERNAL SERVER ERROR");
    }
});

// post call to get the job with a specific id
app.post("/job", async (req, res) => {
    const id = req.query.id;
    const jobDetails = await db.query("SELECT * FROM jobs JOIN industrialist i ON jobs.industryId = i.id WHERE jobs.jobId = $1", [id]);
    if(jobDetails.rows.length != 0) {
        let job = J.mapToJobs(jobDetails.rows[0]);
        job["employer"] = J.mapToEmployer(jobDetails.rows[0])
        res.status(200).json(job);
    } else {
        res.status(404).send("JOB NOT FOUND");
    }
})

//username availability check
app.post("/username", async (req, res) => {
    try{
        const names = await db.query("SELECT customers.username FROM customers WHERE customers.username = $1",[req.body.username]);
        if(names.rowCount != 0) {
            res.status(200).send(true);
        } else {
            res.status(200).send(false);
        }
    } catch(error) {
        console.log(error);
        res.status(500).send("INTERNAL SERVER ERROR");
    }
});

// post call to insert data of a specific customer into database
app.post("/customer", async (req, res) => {

    const values = C.getCustomerDB(req.body);
    let obj = Object.values(values);
    let keys = Object.keys(values);
    let placeholder = Array(keys.length).fill('$',0).map((values,index) => values +(index+1)).join(', ');

    console.log(obj);
    try {
        const id = await db.query(`INSERT INTO customers(${keys.join(', ')}) VALUES (${placeholder}) RETURNING id`,obj);
        const add = C.getAddressDB(req.body, id.rows[0]);
        obj = Object.values(add);
        keys = Object.keys(add);
        placeholder = Array(keys.length).fill('$',0).map((values,index) => values + (index+1)).join(', ');

        await db.query(`INSERT INTO address(${keys.join(', ')}) VALUES (${placeholder})`,obj);
        res.status(200).send({
            login: true,
            id: id.rows[0].id
        });
    } catch(error) {
        console.log(error);
        res.status(500).send("INTERNAL SERVER ERROR");
    }
});

// get call to fetch data of a particular customer from DB
app.post("/client", authenticate, async (req,res) => {
    const id = req.clientId.rows[0].id;
    try {
        let cust = await db.query("SELECT * FROM customers JOIN address ON address.customerId = customers.id JOIN jobs ON jobs.customerId = customers.id WHERE customers.id = $1",[id]);
        if(cust.rows.length == 0) {
            cust = await db.query("SELECT * FROM customers JOIN address ON address.customerId = customers.id WHERE customers.id = $1",[id]);
        }
        const customer = C.mapToCustomer(cust.rows[0]);
        const allJobs = cust.rows.map((job) => J.mapToJobs(job));
        customer["jobs"] = allJobs
        res.status(200).json(customer);
    } catch(error) {
        console.log(error);
        res.status(500).send("INTERNAL SERVER ERROR");
    }
});

// we need username, password
async function authenticate(req, res, next) {
    const username = req.body.username;
    const pass = req.body.password;
    let user;
    try {
        
        const custId = await db.query(`SELECT customers.id, customers.username FROM customers WHERE customers.username = $1`,[username]);
        //check if username exist otherwise user will be shown the registration screen
        console.log(custId)
        if(custId.rows.length == 0) {
            res.status(404).send("USER DOES NOT EXIST");
        } else {
            user = await db.query("SELECT customers.pass FROM customers WHERE customers.username = $1 AND customers.pass = $2",[username, pass]);
            if(user.rows.length == 0) {
                res.status(401).send("incorrect password or username");
            } else {
                req.clientId = custId;
                next();
            }
        }
    } catch(error) {
        console.log(error);
        res.status(500).send("INTERNAL SERVER ERROR");
    }
}
//change the job status
app.put("/accept", authenticate, async (req, res) => {
    const clientId = req.query.clientId;
    const jobId = req.query.jobId;
    const status = req.query.status
    try {
        let job = await db.query("UPDATE jobs SET status = $1, customerId = $2 WHERE jobs.jobId = $3 ",[status,clientId,jobId]);
        let out = {"status": true}
        console.log(out)
        res.status(200).send(out);
    } catch(error) {
        res.status(500).send("INTERNAL SERVER ERROR");
    }   
});

app.listen(port, ()=> {
    console.log(`Server running on http://localhost:${port}`);
});

// -- CREATE TABLE customers(
//     --     	id serial primary key,
//     --     	name varchar(45) NOT NULL,
//     --     	gender varchar(1) NOT NULL,
//     --     	email varchar(45) NOT NULL,
//     --     	dateOfBirth varchar(45),
//     --     	phoneNumber varchar(20) NOT NULL,
//     --     	ratings integer,
//     --     	username varchar(45) NOT NULL,
//     --     	pass varchar(45) NOT NULL
//     --     );
        
//     --     CREATE TABLE industrialist(
//     --     	id serial primary key,
//     --     	personName varchar(45),
//     --     	gender varchar(1),
//     --     	phoneNumber varchar(11),
//     --     	email varchar(30),
//     --     	dateOfBirth varchar(45),
//     --     	orgName varchar(100),
//     --     	ratings integer,
//     --     	description text
//     --     );
        
//     --     CREATE TABLE address(
//     --     	addId serial primary key,
//     --     	latitude double precision,
//     --     	longitude double precision,
//     --     	houseNo varchar(10) NOT NULL,
//     --     	apartment varchar(30),
//     --     	city varchar(30) NOT NULL,
//     --     	state varchar(30) NOT NULL,
//     --     	pincode varchar(10),
//     --     	customerId integer references customers(id),
//     --     	industrialistId integer references industrialist(id)
//     --     );
        
        
//     --     CREATE TABLE jobs(
//     --     	jobId serial primary key,
//     --     	code varchar(10),
//     --     	type varchar(40),
//     --     	numberOfPieces integer,
//     --     	timeReq varchar(10) NOT NULL,
//     --     	amount float4 NOT NULL,
//     --     	deliveryTime timestamp NOT NULL,
//     --     	pickupTime timestamp NOT NULL,
//     --     	paymentOn varchar(20) NOT NULL,
//     --     	status varchar(10),
//     --     	workManual text,
//     --     	difficultyLevel varchar(1),
//     --     	customerId integer references customers(id),
//     --     	industryId integer references industrialist(id)
//     --     );
    
    
//     --     INSERT INTO customers (name, gender, email, dateOfBirth, phoneNumber, ratings, username, pass)
//     --     VALUES ('Shivam','m','shivam2671997@gmail.com','26-07-1997','9813179017',5,'shiva26','shivam')
        
//     --     INSERT INTO jobs(code, type, numberOfPieces, timeReq, amount, deliveryTime, pickupTime, paymentOn, status, workManual, difficultyLevel)
//     --     VALUES ('1','PACKING',100,'8',1000,'2024-04-16 08:00:00','2024-04-16 20:00:00','PICKUP','UNASSIGNED','Following steps need to be followed:\n1. open the packing paper and spread it on a clean surface.\n2.Place the object to pack on the packing paper.\n3.Fold the packing paper as per the marking instructions','E')
        
//     -- 	update jobs
//     -- 	set industryId = 2
//     -- 	WHERE jobs.code = '4';
//     --     INSERT INTO jobs(code, type, numberOfPieces, timeReq, amount, deliveryTime, pickupTime, paymentOn, status, workManual, difficultyLevel)
//     --     VALUES ('2','STITCHING',10,'16',800,'2024-04-18 08:00:00','2024-04-20 20:00:00','PICKUP','UNASSIGNED','Following steps need to be followed:\n1. Keep the cloth piece on the bottom border of the saree along the length.\n2. make the raw stitches along the length just to hold the cloth.\n3. Make final fine stitches to attach the cloth permanently.','M')
        
//     --     INSERT INTO jobs(code, type, numberOfPieces, timeReq, amount, deliveryTime, pickupTime, paymentOn, status, workManual, difficultyLevel)
//     --     VALUES ('3','LAUNDRY',200,'8',1400,'2024-04-16 08:00:00','2024-04-17 08:00:00','PICKUP','UNASSIGNED','Following steps need to be followed:\n1. clothes need to be soaked in the soap water for 1 Hr maximum. \n2. Need to wash the clothes gently\n3. Dry them \nNote: Handle gently as fine clothes stitches may break. Do not dry them in direct sunlight which will turn them in yellow.','M')
        
//     --     INSERT INTO jobs(code, type, numberOfPieces, timeReq, amount, deliveryTime, pickupTime, paymentOn, status, workManual, difficultyLevel)
//     --     VALUES ('4','DESIGNER',1,'48',10000,'2024-04-16 08:00:00','2024-04-18 08:00:00','ACCEPTANCE','UNASSIGNED','You need to design a website for a travelling company. The company has following features to show:\n1.Travelling/Holiday packages. \n2.Travelling destinations. \n3.Hotel Booking. \n4.Flight Bookings. \n5.Visa arrangements \nPrerequisites: processor with Designing tools installed on it','H')
        
//     --     INSERT INTO address(latitude,longitude,houseNo,apartment,city,state,pincode,customerId)
//     --     VALUES (13.03565,77.63431,'106','pulikeshi apartments','Bengaluru','Karnataka','560043',1)
        
//     --     INSERT INTO address(latitude,longitude,houseNo,apartment,city,state,pincode,industrialistId)
//     --     VALUES (13.03364,77.63733,'22','DMart','Bengaluru','Karnataka','560043',1)
        
//     --     INSERT INTO address(latitude,longitude,houseNo,apartment,city,state,pincode,industrialistId)
//     --     VALUES (13.03259,77.63445,'40/5B','Shobha Tailors','Bengaluru','Karnataka','560043',2)
        
//     --     INSERT INTO industrialist(personName, gender,phoneNumber,email,dateOfBirth,orgName,ratings,description)
//     --     VALUES ('Ramesh','M','7821845688','ramesh22@gmail.com','14-04-1980','Sanskar',5,'Provides high level embroidary design jobs')
        
        
//     --     INSERT INTO industrialist(personName, gender,phoneNumber,email,dateOfBirth,orgName,ratings,description)
//     --     VALUES ('Suresh','M','7821845688','suresh23@gmail.com','22-10-1975','Suresh Travels',5,'Connecting worlds by making travelling easy')
       
    
//     -- SELECT * FROM industrialist i JOIN jobs ON i.id = jobs.industryId
    
//     -- SELECT * FROM jobs JOIN industrialist i ON jobs.jobId = i.id WHERE jobs.jobId = 1
    
//     SELECT customers.username FROM customers WHERE customers.username = 'shiva26'
        
        