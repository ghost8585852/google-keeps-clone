import pool from "./db.js";

async  function createNewDB(){
    await pool.query(`
        CREATE TABLE IF NOT EXISTS notes (
        id SERIAL PRIMARY KEY,
        title TEXT,
        content TEXT,
        backgroundcolor TEXT,
        image TEXT,
        isdeleted BOOLEAN NOT NULL DEFAULT FALSE
        );`
    );
    console.log("Table ready");
}

export default createNewDB;