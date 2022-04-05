const express = require("express");
const session = require("express-session");
const fs = require('fs');
const mysql = require("mysql");
const bodyParser = require('body-parser');
var exphbs  = require('express-handlebars');

const TWO_HOURS = 1000 * 60 * 60 * 2

const  {
    PORT = 3000 ,
    NODE_ENV = 'development',
    SESS_NAME = 'sid',
    SESS_SECRET = 'Symmetric Erncryption key',

    SESS_LIFETIME = TWO_HOURS
} = process.env

const IN_PROD = NODE_ENV === 'production'


// Creating a Connection to DB
var db = mysql.createConnection({
    host     : 'localhost',
    user     : 'web_pro',
    password : 'web_test123',
    database : 'paradise_db'
});

// Connecting to DB
db.connect((err)=>{
    if (err) throw err;
    console.log("Connected to DB")
}
);


const app = express()

app.use(bodyParser.urlencoded({
    extended: true
}))



//Init session API
app.use(session({
    name: SESS_NAME,
    resave: false,
    saveUninitialized: false,
    secret: SESS_SECRET,
    cookie: {
        maxAge: TWO_HOURS,
        sameSite: true,
        secure: IN_PROD,
    }
}))

// HandleBars Helper Creation
var hbs = exphbs.create({
    // Specify helpers which are only registered on this instance.
    helpers: {
        ifEquals: function(arg1, arg2, options) {
            return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
        }
        
    }
});

//Handlebars Set
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');


//Creating middleware function to redirect depending on auth level

const redirectLogin = (req,res,next)=>{
    if(!req.session.userId) {
        res.redirect('/login');
    }else{
        next();
    }
}

const redirectHome = (req,res,next)=>{
    if(req.session.userId){
        res.redirect('/home');
    }else{
        next();
    }
}

const redirectNonAdmin = (req,res,next)=>{
    if(req.session.role != 'ADMIN'){
        res.redirect("/");
    }else{
        next();
    }
}

const redirectToken = (req,res,next)=>{
    if(req.session.token){
        next()
    }else{
        res.redirect('/home');
    }
}



//GET RESPONCES

//Get responce for Home ONLY for auth users
app.get('/home',redirectLogin, function (req, res) {
    
    res.render('userhome',{
        fname : req.session.fn,
        lname : req.session.ln
    });
});

//Get responce for /search
app.get('/search',redirectNonAdmin,function (req,res){
    res.render('adminSearch',{
        fname : req.session.fn,
        lname : req.session.ln,
        reserv : req.session.pass
    })
})

// Get response to Home page
app.get('/',redirectHome,(req, res)=>{
    res.render('mainHome');
})

//Get response for Login
app.get('/login',redirectHome,(req, res)=>{
    fs.readFile("./public/login.html","utf8", (err, data) => {
        if (err){
            console.log(err);
        }
        else{
             res.end(data);
        }
    }
)})

//Get response for Register
app.get('/register',redirectHome,(req, res)=>{
    
    fs.readFile("./public/register.html","utf8", (err, data) => {
        if (err){
            console.log(err);
        }
        else{
             res.end(data);
        }
    }
)})
//Logout Root
app.get('/logout',redirectLogin, (req,res)=>{
    req.session.destroy(err => {
        if (err){
            return res.redirect('/home')
        }

        res.clearCookie(SESS_NAME)
        res.redirect('/')
    })
})

// Data Base Trials
app.get('/DB',(req, res)=>{
            let sql = "SELECT lot_ID FROM LOTS LEFT JOIN Reservations ON  Reservations.lot = LOTS.lot_ID WHERE LOTS.type = 'TENT' AND((('2021-07-01') NOT BETWEEN Darrival AND Ddepart) AND(('2021-07-20') NOT BETWEEN Darrival AND Ddepart) AND(Darrival NOT BETWEEN '2021-07-01' AND '2021-07-20') AND((Ddepart) NOT BETWEEN '2021-07-01' AND '2021-07-20') OR (Darrival IS NULL));"
            db.query(sql,(err,data)=>{
                if (err) throw err;
                console.log(data[0].lot_ID)
            });
            res.end();   
    }
)
// User screen Root
app.get('/user', redirectLogin,(req,res)=>{
    const sql = `SELECT Darrival, Ddepart, ppl_count, Tent_count, Stat, ref_num
                 FROM Reservations
                 WHERE ( USERID = ?)`;
    db.query(sql,[req.session.userId],(err,data)=>{
        if (err) throw err;
        
        Object.entries(data).forEach(row=>{
            let dateArv = row[1].Darrival
            let dateDep = row[1].Ddepart

            row[1].Darrival = dateArv.getDate() +'-'+(dateArv.getMonth()+1)+'-'+dateArv.getFullYear();
            row[1].Ddepart = dateDep.getDate() +'-'+(dateDep.getMonth()+1)+'-'+dateDep.getFullYear();
            
        })
        res.render('userOptions',{
            fname : req.session.fn,
            lname : req.session.ln,
            role : req.session.role,
            phone : req.session.phone,
            email : req.session.email,
            reserv : data

        });
    })
})

//Admin screen `Root
app.get('/admin',redirectNonAdmin,(req,res)=>{
    const sql = `SELECT ref_num, Stat,Darrival,Ddepart,usser.fname,usser.lname,usser.phone,ppl_count,Tent_count,lot
    FROM Reservations 
    LEFT JOIN usser ON usser.idUSER = Reservations.USERID
    WHERE (Darrival=?)
    OR (Ddepart =?)`;
    //NOT COMPLITED
    
    let x= new Date(Date.now())
    var today = x.getFullYear() + '-' + (x.getMonth()+1) + '-' + x.getDate()
    console.log(x)
    console.log(today)
    
    
    
    db.query(sql,[today,today],(err,data)=>{
        if (err) throw err;
        
        Object.entries(data).forEach(row=>{
            let dateArv = row[1].Darrival
            let dateDep = row[1].Ddepart

            row[1].Darrival = dateArv.getDate() +'-'+(dateArv.getMonth()+1)+'-'+dateArv.getFullYear();
            row[1].Ddepart = dateDep.getDate() +'-'+(dateDep.getMonth()+1)+'-'+dateDep.getFullYear();
            
        })
        res.render('adminOptions',{
            fname : req.session.fn,
            lname : req.session.ln,
            role : req.session.role,
            phone : req.session.phone,
            email : req.session.email,
            reserv : data
        })

    })

})

//Toggle Status of reserv
app.get("/toggle/:id",redirectLogin,(req,res)=>{
    let id = req.params.id;
    if (req.session.role = 'ADMIN'){
        let sql = `UPDATE Reservations
                    SET Stat = 'CANCELED'
                    WHERE (ref_num = ?);`;
        db.query(sql,[parseInt(id,10)],(err,data)=>{
            if (err){
                throw err;
            }
            res.redirect('/user');
            
        })
    }else{

    let sql = `UPDATE Reservations
    SET Stat = 'CANCELED'
    WHERE ((ref_num = ?) AND (USERID = ?)) ;`;
    db.query(sql,[parseInt(id,10),parseInt(req.session.userId,10)],(err,data)=>{
        if(err){throw err}
        res.redirect('/user');
        
    })
}
})

// Go to check Out
app.get("/cashier",redirectLogin,(req,res)=>{
    let a = new Date(req.session.checkin)
    let d = new Date(req.session.checkout)
    

    const diffTime = Math.abs(d - a)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    console.log(diffDays);
    console.log(typeof(diffDays));
    console.log(req.session.price);
    console.log(typeof(req.session.price));
    res.render('cashier',{
        fname : req.session.fn,
        lname : req.session.ln,
        phone : req.session.phone,
        email : req.session.email,
        diffDays : diffDays,
        spot : req.session.spot,
        checkIn: req.session.checkin,
        checkOut : req.session.checkout,
        rv : req.session.rv,
        adult : req.session.adult,
        children : req.session.children,
        tent : req.session.tent,
        price : (req.session.price * diffDays)
    })
})

//Confirm the reservation
app.get('/confirm',redirectLogin,redirectToken,(req,res)=>{
    req.session.token = false;
    const sql = `INSERT INTO Reservations( Stat, Darrival, Ddepart, ppl_count, tent_rent, USERID, lot, Tent_count)
    VALUES ('ACTIVE',?,?,?,0,?,?,?);`;
    if (!req.session.tent){req.session.tent=0}
    db.query(sql,
        [   req.session.checkin,
            req.session.checkout,
            parseInt(req.session.adult,10),
            req.session.userId,
            req.session.spot,
            parseInt(req.session.tent,10)],
            (err,data)=>{
                if (err) throw err;
                req.session.checkin = '';
                req.session.checkout='';
                req.session.adult='';
                req.session.idUSER='';
                req.session.spot='';
                req.session.tent='';
                res.render('confirm');

            })


})


app.use(express.static(__dirname+'/public'))



//POST RESPONCES

//Post Response at Login
app.post('/login',redirectHome,(req, res)=>{
    const { email, password } = req.body;
    const sql = `SELECT fname, lname, idUSER, Role, email, phone
                FROM usser 
                WHERE (email = ? ) 
                AND (secterKey = ? )` //SQL querry construction
    db.query(sql,[email,password],(err,data)=>{
         if (err) throw err;
        if (!data[0]){
            //Not a USER must Show error in Page. 
            fs.readFile("./public/login_error.html","utf8", (err, data) => {
                if (err){
                    console.log(err);
                }
                else{
                     res.end(data);
                }
            })
        }else{
            //If the SQL querry returns something
            req.session.userId = data[0].idUSER;
            req.session.role = data[0].Role;
            req.session.fn = data[0].fname ;
            req.session.ln=data[0].lname;
            req.session.phone=data[0].phone;
            req.session.email = data[0].email;
        
            res.redirect('/home');
        }    
    }
    )
})

//Post Response at Register
app.post('/register',redirectHome,(req, res)=>{
    const {name, bday, email, password } = req.body
    const findIfExists = `SELECT idUSER FROM usser WHERE (email = ?)`
    db.query(findIfExists,email,(err,data)=>{
        if(err) throw err;
        
        if (data==[]){
            res.end("<p>`Email already in use`</p>");
        }else{
            complexName = name.split(" ");
            const createUser = `INSERT INTO usser (fname,lname,email,secterKey,Role,bday,phone,isACamper) VALUES (?,?,?,?,'USER',?,'NULL',0);`
            db.query(createUser,[complexName[0],complexName[1],email,password,bday],(err,data)=>{
                if (err) throw err; 
            }
            )
            res.redirect('/');
        }
    })
})

//Search by name post responce
app.post('/search/name/',redirectNonAdmin,(req,res)=>{
    
    const {fname,lname} = req.body;
    let sql = `SELECT ref_num, Stat,Darrival,Ddepart,usser.fname,usser.lname,usser.phone,ppl_count,Tent_count,lot
    FROM Reservations 
    LEFT JOIN usser ON usser.idUSER = Reservations.USERID
    WHERE (usser.fname = ?)
    OR (usser.lname = ?)`
    db.query(sql,[fname,lname],(err,data)=>{
        if (err) throw err;

        Object.entries(data).forEach(row=>{
            let dateArv = row[1].Darrival
            let dateDep = row[1].Ddepart
            row[1].Darrival = dateArv.getDate() +'-'+(dateArv.getMonth()+1)+'-'+dateArv.getFullYear();
            row[1].Ddepart = dateDep.getDate() +'-'+(dateDep.getMonth()+1)+'-'+dateDep.getFullYear();   
        })
        req.session.pass = data
        res.redirect('/search');
    })
})

//Search by date post responce
app.post('/search/date/',redirectNonAdmin,(req,res)=>{
    
    const {sDate} = req.body;
    let sql = `SELECT ref_num, Stat,Darrival,Ddepart,usser.fname,usser.lname,usser.phone,ppl_count,Tent_count,lot
    FROM Reservations 
    LEFT JOIN usser ON usser.idUSER = Reservations.USERID
    WHERE (Darrival=?)
    OR (Ddepart =?)`
    db.query(sql,[sDate,sDate],(err,data)=>{
        if (err) throw err;
        Object.entries(data).forEach(row=>{
            let dateArv = row[1].Darrival
            let dateDep = row[1].Ddepart
            row[1].Darrival = dateArv.getDate() +'-'+(dateArv.getMonth()+1)+'-'+dateArv.getFullYear();
            row[1].Ddepart = dateDep.getDate() +'-'+(dateDep.getMonth()+1)+'-'+dateDep.getFullYear();   
        })
        req.session.pass = data
        res.redirect('/search');
    })
})


//Check Available post request
app.post('/',redirectLogin, function (req, res) {
    const {checkin, checkout, rv, adult,children,tent } = req.body


    if (rv == '0' || rv ==''){
        const tentSearch = `SELECT lot_ID 
        FROM LOTS LEFT JOIN Reservations ON Reservations.lot = LOTS.lot_ID 
        WHERE LOTS.type = 'TENT' 
        AND NOT( ( (?) NOT BETWEEN Darrival AND Ddepart) 
            AND( (?) NOT BETWEEN Darrival AND Ddepart) 
            AND(Darrival NOT BETWEEN (?) AND (?)) 
            AND((Ddepart) NOT BETWEEN (?) AND (?)))
            AND (Stat != 'CANCELED')
        GROUP BY lot_ID
        ORDER BY lot_ID`
        db.query(tentSearch, [checkin,checkout,checkin,checkout,checkin,checkout],(err,data)=>{
            if (err) throw err;
            let available= [1,2,3,4,5,6,7,8,9];
            // If lot.ID exist in available remove it from available
            Object.entries(data).forEach(row=>{
                if(available.includes(row[1].lot_ID)){
                    available.splice(available.indexOf(row[1].lot_ID),1)
                }
            })
            // No empty spots
            if(available.length == 0){
                res.end(`
                    <p>Δεν υπάρχουν ελεύθερες θέσεις για αυτές τις ημερομηνίες</p>
                    <a href='/'>Πίσω</a>
                    `
                    )
            }
            //No empty spots END

            //Ιf spots
                //Save DATA
            req.session.spot = available[0]
            req.session.checkin = checkin;
            req.session.checkout = checkout;
            req.session.rv = rv;
            req.session.adult = adult;
            req.session.children = children;
            req.session.tent = tent;
            req.session.price = 5;
            req.session.token = true;
                // Go to checkout
                res.redirect('/cashier');


        })
    }
    else if (tent == '0' || tent ==''){
        const rvSearch = `SELECT lot_ID 
        FROM LOTS LEFT JOIN Reservations ON Reservations.lot = LOTS.lot_ID 
        WHERE LOTS.type = 'RV' 
        AND NOT( ( (?) NOT BETWEEN Darrival AND Ddepart) 
            AND( (?) NOT BETWEEN Darrival AND Ddepart) 
            AND(Darrival NOT BETWEEN (?) AND (?)) 
            AND((Ddepart) NOT BETWEEN (?) AND (?)))
            AND (Stat != 'CANCELED')
        GROUP BY lot_ID
        ORDER BY lot_ID`
        db.query(rvSearch, [checkin,checkout,checkin,checkout,checkin,checkout],(err,data)=>{
            if (err) throw err;
            let available= [10,11,12,13,14,15,16,17,18];
            // If lot.ID exist in available remove it from available
            Object.entries(data).forEach(row=>{
                if(available.includes(row[1].lot_ID)){
                    available.splice(available.indexOf(row[1].lot_ID),1)
                }
            })

            console.log(available)

            // No empty spots
            if(available.length == 0){
                res.end(`
                    <p>Δεν υπάρχουν ελεύθερες θέσεις για αυτές τις ημερομηνίες</p>
                    <a href='/'>Πίσω</a>
                    `
                    )
            }
            //No empty spots END

            //Ιf spots
                //Save DATA
            req.session.spot = available[0]
            req.session.checkin = checkin;
            req.session.checkout = checkout;
            req.session.rv = rv;
            req.session.adult = adult;
            req.session.children = children;
            req.session.tent = tent;
            req.session.price = 8;
            req.session.token = true;
                // Go to checkout
                res.redirect('/cashier');


        })
    }
});



// Server Start
app.listen(PORT,()=>
console.log(`http://localhost:${PORT}`))