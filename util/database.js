import mysql2 from 'mysql2'


const pool = mysql2.createPool({
	host: process.env.DBHOST,
	user: process.env.DBUSERNAME,
	database: process.env.DBNAME,
	password: process.env.DBPASSWORD,
	charset: 'utf8mb4',
});




export default pool.promise();