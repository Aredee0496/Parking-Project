const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const customerRoutes = require('./routes/Customer');
const officerRoutes = require('./routes/Officer');
const typeRoutes = require('./routes/Type');
const positRoutes = require('./routes/Posit');
const parkingRoutes = require('./routes/Parking');
const parkingstatusRoutes = require('./routes/Parkingstatus');
const carRoutes = require('./routes/Car');
const reservationRoutes = require('./routes/Reservation');
const reservationstatusRoutes = require('./routes/Reservationstatus');
const depositRoutes = require('./routes/Deposit');
const shuttleRoutes = require('./routes/Shuttle');
const callshuttleRoutes = require('./routes/Callshuttle');
const callshuttlestatusRoutes = require('./routes/Callshuttlestatus');
const receiptRoutes = require('./routes/Receipt');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

app.use('/api', authRoutes);
app.use('/api', customerRoutes);
app.use('/api', officerRoutes);
app.use('/api', typeRoutes);
app.use('/api', positRoutes);
app.use('/api', parkingRoutes);
app.use('/api', parkingstatusRoutes);
app.use('/api', carRoutes);
app.use('/api', reservationRoutes);
app.use('/api', reservationstatusRoutes);
app.use('/api', depositRoutes);
app.use('/api', shuttleRoutes);
app.use('/api', callshuttleRoutes);
app.use('/api', callshuttlestatusRoutes);
app.use('/api', receiptRoutes);



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
