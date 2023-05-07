import connection from '../config/db';
import { RECHARGE_HISTORY_TBL_COLUMNS, RECHARGE_HISTORY_MDAS_TABLE } from '../constants/DB_TBL/TBL_RECHARGE_HISTORY_TABLE';


const getAllInprogressRecords = () => {
    var sql = `SELECT * FROM ${RECHARGE_HISTORY_MDAS_TABLE} WHERE status = "Inprogress" AND time_format(timediff(NOW(), ${RECHARGE_HISTORY_TBL_COLUMNS.date_and_time_picked_by_client}),'%H') > 8`;
    return new Promise((resolve, reject)=> {
        connection.getConnection((err, db) => {
            if (err) throw err;

            db.query(sql, function (err, result, fields) {
                if (err) console.log(err);
                resolve(Object.values(JSON.parse(JSON.stringify(result))));
            });
            db.release();
        })
    }).catch(err => console.log(err, "WOOooooooo"))
}

const updateStatusToOpen = () => {
    getAllInprogressRecords().then(r => {
        connection.getConnection((err, db) => {
            if (err) throw err;
            r?.forEach(element => {
                let status = 'Suspended';
                console.log(element)
                if(element[RECHARGE_HISTORY_TBL_COLUMNS.read_write_param_id] == 41){
                    status = 'Open';
                }

                var sql = `UPDATE ${RECHARGE_HISTORY_MDAS_TABLE} SET ${RECHARGE_HISTORY_TBL_COLUMNS.status} = '${status}', ${RECHARGE_HISTORY_TBL_COLUMNS.mdestatus} = 'Request timeout' WHERE (${RECHARGE_HISTORY_TBL_COLUMNS.recharge_id} = '${element[RECHARGE_HISTORY_TBL_COLUMNS.recharge_id]}')`
                db.query(sql, function (err, result, fields) {
                    if (err) console.log(err);    
                    console.log(result);    
                });
            });
           db.release();
        });
    }).catch(err => {
        console.log(err)
    })
    
}



export default updateStatusToOpen;