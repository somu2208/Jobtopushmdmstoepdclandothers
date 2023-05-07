import connection from '../config/db';
import ShortUniqueId  from 'short-unique-id';
import { SCHEDULE1_TBL, SCHEDULE1_TBL_COLUMNS, DAILY } from '../constants/DB_TBL/SCHEDULE1_TBL';;
import { METERS_TBL, METERS_TBL_COLUMNS } from '../constants/DB_TBL/METERS';
// import { CONSUMER_TBL, CONSUMER_TBL_COLUMNS } from '../constants/DB_TBL/CONSUMER_TBL'
import { RECHARGE_HISTORY_TBL_COLUMNS } from '../constants/DB_TBL/TBL_RECHARGE_HISTORY_TABLE';
import * as utils from '../utils'

export const insetIntoRechargeHistoryTBL = () => {
    var schedule1Results = null;
    try {
        connection.getConnection((err, db) => {
            if (err) throw err;
            var sql = `SELECT * FROM ${SCHEDULE1_TBL} WHERE ${SCHEDULE1_TBL_COLUMNS.schedule_type} like "${DAILY}"`;
            db.query(sql, function (err, rows, fields) {
                if (err) console.log(err);
                schedule1Results = Object.values(JSON.parse(JSON.stringify(rows)));
                getDataFromConsumerTBL(schedule1Results);

            });            
            db.release();
        });
    } catch {
        console.log("Error in DB connection !");
    }
}

const getDataFromConsumerTBL = async (sr) => {
    try {
        connection.getConnection((err, db) => {
            if (err) throw err;
            var sql = `SELECT ${METERS_TBL_COLUMNS.usc_number}, ${METERS_TBL_COLUMNS.meter_serial_number}, ${METERS_TBL_COLUMNS.utility_id} FROM ${METERS_TBL}`;
            const consumerPromise = new Promise((resolve, reject) => {
                db.query(sql, function (err, rows, fields) {
                    if (err) (err);
                    resolve(Object.values(JSON.parse(JSON.stringify(rows))));
                });
            })
            consumerPromise.then(res => {
                insertIntoRecharge_history_mdas(res, sr);
            }).catch(err => 
                console.log(err)
            )
            db.release();
        });
    } catch {
        console.log("Error in DB connection !");
    }
}

const insertIntoRecharge_history_mdas = (records, sr) => {
    // console.log(records, sr)
    try{
        connection.getConnection((err, db) => {
            if (err) throw err;
            
            const SQL_COLUMS = `${RECHARGE_HISTORY_TBL_COLUMNS.recharge_id}, ${RECHARGE_HISTORY_TBL_COLUMNS.recharge_amount}, ${RECHARGE_HISTORY_TBL_COLUMNS.meter_serial_number}, ${RECHARGE_HISTORY_TBL_COLUMNS.balance_at_recharge}, 
                                ${RECHARGE_HISTORY_TBL_COLUMNS.date_time}, ${RECHARGE_HISTORY_TBL_COLUMNS.created_by}, ${RECHARGE_HISTORY_TBL_COLUMNS.status}, ${RECHARGE_HISTORY_TBL_COLUMNS.unit_price_whie_recharge}, ${RECHARGE_HISTORY_TBL_COLUMNS.account_number},
                                ${RECHARGE_HISTORY_TBL_COLUMNS.read_write_param_id}, ${RECHARGE_HISTORY_TBL_COLUMNS.consumption_for_this_recharge}, ${RECHARGE_HISTORY_TBL_COLUMNS.time_of_consumption_update_for_this_recharge}, ${RECHARGE_HISTORY_TBL_COLUMNS.date_and_time_picked_by_client},
                                ${RECHARGE_HISTORY_TBL_COLUMNS.mdestatus}, ${RECHARGE_HISTORY_TBL_COLUMNS.mde_status_updated_time}, ${RECHARGE_HISTORY_TBL_COLUMNS.customer_service_number}, ${RECHARGE_HISTORY_TBL_COLUMNS.utility_id}`;
            var sql = `INSERT INTO ${process.env.RECHARGE_HISTORY_MDAS_TABLE} (
                    ${SQL_COLUMS}
                ) 
                VALUES (${Object.keys(RECHARGE_HISTORY_TBL_COLUMNS).map(() => '?').join(', ')})`;
            records.map((v, i) => {
                const uuid = new ShortUniqueId({ length: 16 })
                v[RECHARGE_HISTORY_TBL_COLUMNS.recharge_id] = uuid();
                v[RECHARGE_HISTORY_TBL_COLUMNS.recharge_amount] = 0;
                v[RECHARGE_HISTORY_TBL_COLUMNS.meter_serial_number] = v[RECHARGE_HISTORY_TBL_COLUMNS.meter_serial_number];
                v[RECHARGE_HISTORY_TBL_COLUMNS.balance_at_recharge] = 0;
                v[RECHARGE_HISTORY_TBL_COLUMNS.date_time] = new Date();
                v[RECHARGE_HISTORY_TBL_COLUMNS.created_by] = 'cron job';
                v[RECHARGE_HISTORY_TBL_COLUMNS.status] = 'Open';
                v[RECHARGE_HISTORY_TBL_COLUMNS.unit_price_whie_recharge] = 0;
                v[RECHARGE_HISTORY_TBL_COLUMNS.account_number] = v[RECHARGE_HISTORY_TBL_COLUMNS.usc_number];
                v[RECHARGE_HISTORY_TBL_COLUMNS.read_write_param_id] = sr?.[0].function_id || 0;
                v[RECHARGE_HISTORY_TBL_COLUMNS.consumption_for_this_recharge] = 0;
                v[RECHARGE_HISTORY_TBL_COLUMNS.time_of_consumption_update_for_this_recharge] = null;
                v[RECHARGE_HISTORY_TBL_COLUMNS.date_and_time_picked_by_client] = null;
                v[RECHARGE_HISTORY_TBL_COLUMNS.mdestatus] = '';
                v[RECHARGE_HISTORY_TBL_COLUMNS.mde_status_updated_time] = null;
                v[RECHARGE_HISTORY_TBL_COLUMNS.customer_service_number] = v[METERS_TBL_COLUMNS.usc_number];
                v[RECHARGE_HISTORY_TBL_COLUMNS.utility_id] = v[METERS_TBL_COLUMNS.utility_id];
                //  Object.keys(v).sort()
                // const sortedVal = utils.sortObject(v);
                // const currentRow = Object.values(sortedVal);
                const currentRow = [
                    v[RECHARGE_HISTORY_TBL_COLUMNS.recharge_id],
                v[RECHARGE_HISTORY_TBL_COLUMNS.recharge_amount],
                v[RECHARGE_HISTORY_TBL_COLUMNS.meter_serial_number],
                v[RECHARGE_HISTORY_TBL_COLUMNS.balance_at_recharge],
                v[RECHARGE_HISTORY_TBL_COLUMNS.date_time],
                v[RECHARGE_HISTORY_TBL_COLUMNS.created_by],
                v[RECHARGE_HISTORY_TBL_COLUMNS.status],
                v[RECHARGE_HISTORY_TBL_COLUMNS.unit_price_whie_recharge],
                v[RECHARGE_HISTORY_TBL_COLUMNS.account_number],
                v[RECHARGE_HISTORY_TBL_COLUMNS.read_write_param_id],
                v[RECHARGE_HISTORY_TBL_COLUMNS.consumption_for_this_recharge],
                v[RECHARGE_HISTORY_TBL_COLUMNS.time_of_consumption_update_for_this_recharge],
                v[RECHARGE_HISTORY_TBL_COLUMNS.date_and_time_picked_by_client],
                v[RECHARGE_HISTORY_TBL_COLUMNS.mdestatus],
                v[RECHARGE_HISTORY_TBL_COLUMNS.mde_status_updated_time],
                v[RECHARGE_HISTORY_TBL_COLUMNS.customer_service_number],
                v[METERS_TBL_COLUMNS.utility_id]
                ];
                // console.log(sql, currentRow);
                // console.log(currentRow, Object.keys(COLUMS).sort(), '==', Object.keys(COLUMS).map(() => '?').join(', '));
                // if(i == 1) {
                    // console.log(v)
                db.query(sql, [...currentRow], function (err, result, fields) {
                    if (err) console.log(err);
                    // console.log(result);

                });
            // }
            });
            db.release();
        });
    } catch {
        console.log("Error in DB connection !");
    }
}
