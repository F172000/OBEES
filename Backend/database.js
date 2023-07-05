const mysql2=require('mysql2');
require('dotenv').config();

const db=mysql2.createConnection(
    {
        host: process.env.HOST,
        user: process.env.USER ,
        password: process.env.PASSWORD ,
        database: process.env.DATABASE ,
    }
);
const connectdb=()=>{
db.connect((err)=>{
if(err) throw err;
console.log('Database is connected');
});
}
module.exports={ db , connectdb };