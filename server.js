import express from "express";
import bodyParser from 'body-parser';

import Bill from './bills';

const app = express();

app.set('port', process.env.PORT || 3000);

app.get('/', (req, res) => {
    // res.type('text/plain');
    // res.send('Hello World');
    Bill.find((error, bills) => { 
        res.type('text/plain');
        res.send(bills);
    });
});

app.get('/api/bills', (req, res) => {
    Bill.find((error, bills) => {
        res.json(bills);
    });
});

app.get('/api/bills/:id', (req,res) => {
    Bill.find({id: req.params.id}, (error, b) => {
        if(b.length){
            res.json(b[0]);
        }
        else res.json({});
    })
});

app.use(bodyParser.json());
app.post('/api/bills/', (req, res) => {
    let b = new Bill({
        name: req.body.name,
        category: req.body.category,
        desc: req.body.desc,
        cost: req.body.cost,
        user: req.body.user,
        date: new Date(req.body.date),
    })
    // console.log(b);
    b.save((error, nb) => {
        if(error)  return res.send(500, 'database error');
        res.json({id: nb.id});
    });
});

app.put('/api/bills/', (req, res) => {
    let nb = {
        name: req.body.name,
        category: req.body.category,
        desc: req.body.desc,
        cost: req.body.cost,
        user: req.body.user,
        date: new Date(req.body.date),
    }
    Bill.update({id: req.body.id}, nb, (error)=>{
        if(error) return res.send(500, 'database error');
        res.json({ok: true});
    })
});

app.delete('/api/bills/:id', (req,res) => {
    Bill.remove({id: parseInt(req.params.id)}, (error) => {
        if(error) console.log(error);
        res.json({ok: true});
    });
})

    

app.listen(app.get('port'), () => {
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});