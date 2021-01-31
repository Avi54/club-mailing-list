const express = require('express');
const bodyParser = require('body-parser');
const { urlencoded } = require('body-parser');
const https = require('https');
const { static } = require('express');
require('dotenv').config()

const app = express();

app.set('view engine', 'ejs')
app.use(express.static(__dirname + 'public')); 

app.use(bodyParser.urlencoded({ extended: false }))



app.get('/', (req, res) => {
    res.render('list')
})

// post 
app.post('/list', (req, res) => {
    const fName = req.body.fName
    const lName = req.body.lName
    const email = req.body.email

    const data = {  
        members: [
            {
                email_address: email,
                status: "subscribed", 
                merge_fields: {
                    FNAME: fName,
                    LNAME: lName
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data);

    const url = process.env.MAILCHIMP_URL

    const options = {
        method: "POST",
        auth: process.env.AUTH_KEY
    }

    const request = https.request(url, options, function(response){
        
        if (response.statusCode === 200){
            res.render('render/success')
        }   else{
            res.render('render/failure')
        }
        
        response.on("data", function(data){
            console.log(JSON.parse(data))
        })
    })

    request.write(jsonData);
    request.end();

})

app.listen(3000, () => {
    console.log('Server running on port 3000')
})

