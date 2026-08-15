import express from "express";
import createNewDB from "./db/newTable.js";
import notesRoutes from "./rootes/rootes.js"
import cors from "cors";

const App = express();
App.use(cors());
App.use(express.json());
await createNewDB();
 
App.use("/api/notes",notesRoutes);
const Port =  3000;

App.listen(Port,()=>{
    console.log(`server is live on port: ${Port}`);
});