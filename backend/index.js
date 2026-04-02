import express from 'express';
const app = express();
const port = 3200;

app.set('view engine','ejs')

app.get('/',(req,res)=>{
  res.render('list')
})

app.get('/add',(req,res)=>{
  res.render('add')
})

app.get('/update',(req,res)=>{
  res.render('update')
})

app.listen(port,()=>{
  console.log("Server is running ",port)
})