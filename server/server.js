import app from './src/app.js';
import connectDB  from './src/config/database.js';
const Port = 3000;
connectDB();
app.listen(Port,()=>{
  console.log('app is running on port 3000')
})

