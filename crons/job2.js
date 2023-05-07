
import connection from '../config/db';
import { RECHARGE_HISTORY_TBL_COLUMNS, RECHARGE_HISTORY_MDAS_TABLE } from '../constants/DB_TBL/TBL_RECHARGE_HISTORY_TABLE';
import { READ_WRITE_PARAMS_TBL, READ_WRITE_PARAMS_TBL_COLUMNS } from '../constants/DB_TBL/READ_WRITE_PARAMS';
import {cronRCPcalls} from '../config/axios';

export const getAllOpenStatusRecords = () => {
    try {
        connection.getConnection((err, db) => {
            var results = null;
            if (err) throw err;
            var sql = `SELECT * FROM ${RECHARGE_HISTORY_MDAS_TABLE} WHERE ${RECHARGE_HISTORY_TBL_COLUMNS.status} like "Open" `;
            db.query(sql, function (err, rows, fields) {
                if (err) console.log(err);
                results = Object.values(JSON.parse(JSON.stringify(rows)));
                getReadWriteParams().then(res => {       
                    res?.length > 0 && results?.map((v, i) => {
                        var sql = `UPDATE ${RECHARGE_HISTORY_MDAS_TABLE} SET ${RECHARGE_HISTORY_TBL_COLUMNS.date_and_time_picked_by_client} = now(), ${RECHARGE_HISTORY_TBL_COLUMNS.status} = "Inprogress" WHERE (${RECHARGE_HISTORY_TBL_COLUMNS.recharge_id} = '${v[RECHARGE_HISTORY_TBL_COLUMNS.recharge_id]}')`;
                        updateStatusNtime(sql);
                        res.forEach((element, ii) => {
                            // console.log(v.read_write_param_id === element.read_write_param_id)
                            // console.log(v.read_write_param_id === element.read_write_param_id) 
                            v.read_write_param_id === element.read_write_param_id && callApi(v, element[READ_WRITE_PARAMS_TBL_COLUMNS.rest_api_name].trim())
                        });
                    })
                
                }).catch(err=> {
                    console.log(err);
                });
            

            });            
            db.release();
            
        });
    } catch {
        console.log("Error in DB connection !");
    }
}

const getReadWriteParams = () => {
    try {
        return new Promise((resolve, reject) => {

            connection.getConnection((err, db) => {
                if (err) throw err;
                var sql = `SELECT * FROM ${READ_WRITE_PARAMS_TBL}`;
                db.query(sql, function (err, rows, fields) {
                    if (err) reject(err);
                    resolve(Object.values(JSON.parse(JSON.stringify(rows))));              

                });            
                db.release();            
            });
        })

    } catch {
        console.log("Error in DB connection !");
    }

}

const findByFunctionId = (r, id, key) => {
    return r.filter(v => v[key] == id && v);
}

const updateStatusNtime = (sql) => {
    try {
        connection.getConnection((err, db) => {
            db.query(sql, function (err, rows, fields) {
                if (err) console.log(err);               
                // console.log(rows);
            });   
            db.release();
            
        });
    } catch {
        console.log("Error in DB connection !");
    }
}

const callApi = (o, p) => {
    const urlParams = `gRPCAPICallingFunction?deviceId=${o[RECHARGE_HISTORY_TBL_COLUMNS.meter_serial_number]};${p};${o[RECHARGE_HISTORY_TBL_COLUMNS.recharge_id]}`
    // Test purpose triggering the API only for function_id = 44
    if(o.read_write_param_id == 44) { 
        p && cronRCPcalls.get(urlParams).then(res => {
            console.log(res.data);
        }).catch(err => {
            var sql = `UPDATE ${RECHARGE_HISTORY_MDAS_TABLE} SET ${RECHARGE_HISTORY_TBL_COLUMNS.date_and_time_picked_by_client} = now(), ${RECHARGE_HISTORY_TBL_COLUMNS.status} = "Open" WHERE (${RECHARGE_HISTORY_TBL_COLUMNS.recharge_id} = '${o[RECHARGE_HISTORY_TBL_COLUMNS.recharge_id]}')`;
            updateStatusNtime(sql);
            console.log(err);
        })
    }
}


