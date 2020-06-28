const  express = require('express');
const bodyPaser = require('body-parser');

const app = express();

app.use(bodyPaser.json());
app.use(bodyPaser.urlencoded({extended: false }));

require ('./app/controllers/index')(app);

app.listen(3000);