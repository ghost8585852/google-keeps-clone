import pg from "pg";

const {Pool}=pg;

const pool = new Pool({
    user:"postgres",
    host:"localhost",
    database:"keepers-App",
    password:"HarshDead7807632287#",
    port:5000,
});

export default pool;