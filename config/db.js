import mysql from 'mysql';

const connection = mysql.createPool({
  host: "52.183.129.149",
  user: "root",
  database: "mdms",
  password: "iBot@1234",
  port: 3306
});

export default connection;