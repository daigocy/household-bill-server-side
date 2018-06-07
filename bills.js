import mongoose from 'mongoose';

mongoose.connect('mongodb://127.0.0.1:27017/bill');
console.log('connect to mongodb');


const counterSchema = mongoose.Schema({
    _id: String,
    seq: Number,
})
const Counter = mongoose.model('Counter', counterSchema);


const billSchema = mongoose.Schema({
    id: {type: Number, default: -1},
    name: String,
    category: Number,
    desc: String,
    cost: Number,
    user: Number,
    date: { type: Date, default: Date.now},
}, { versionKey: false });
billSchema.pre('save', function(next) {
    let doc = this;
    Counter.findByIdAndUpdate({_id: 'billIndex'}, {$inc: { seq: 1 }}, (error, counter) => {
        if(error) return next(error);
        doc.id = counter.seq;
        next();
    });
});

const Bill = mongoose.model('Bill', billSchema);

Bill.find((error, bills) => {
    if(bills.length) return;
    new Bill({
        name: '买菜', category: 0, desc: '买土豆，西红柿', cost: 10, user: 2
    }).save();
    new Bill({
        name: '买眼罩', category: 4, desc: '买眼罩', cost: 15, user: 0
    }).save();
})

export default Bill;