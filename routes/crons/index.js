import { get_recharge_history_mdms, update_recharge_sync_date } from '../prepaid';
import connection from '../../config/db';
import endpoints from '../API_ROUTES';
import { RECHARGE_HISTORY_TBL_COLUMNS } from '../../constants/DB_TBL/TBL_RECHARGE_HISTORY_TABLE';
import { istDate, replaceTnZfromDate } from '../../utils';



const run_get_inset_task = async () => {
    const time = await get_recharge_history_mdms(endpoints.mdmsquery + endpoints.recharge_sync, {
        params: {
            "access_token": 1234,
            "profile": { "_eq": "Recharge" }
        }
    });
    if (time[0]) {
        var dateUTC = new Date(time[0].sync_date_time + '.000Z');
        var dateUTC = dateUTC.getTime();
        // var dateIST = new Date('2022-01-26 01:03:00');
        var dateIST = new Date(dateUTC);
        dateIST.setHours(dateIST.getHours() + 5);
        dateIST.setMinutes(dateIST.getMinutes() + 30);
        const dateTime = { "date_time": { "_gt": dateIST } };
        const get_records = await get_recharge_history_mdms(endpoints.mdmsquery + endpoints.recharge_history_mdms, {
            params: {
                "access_token": 1234,
                "filter": dateTime,
            }
        });
        console.log(get_records);

        (get_records && get_records.length > 0) && insertDataIntoTable(get_records);

    }
};

const update_recharge_date = (date) => {
    update_recharge_sync_date(endpoints.mdmsconnectd, {
        params: {
            "accessKey": 123,
            "pkValue": 1,
            "tableName": "recharge_sync"
        },
        data: {
            "sync_date_time": date
        }
    },
    );
};



const insertDataIntoTable = (records) => {
    // try {
    let latestTime = null;
    console.log("Before DB connection");

    connection.getConnection((err, db) => {
        if (err) throw err;

        const COLUMNNAMES = `${RECHARGE_HISTORY_TBL_COLUMNS.recharge_id}, ${RECHARGE_HISTORY_TBL_COLUMNS.customer_service_number}, ${RECHARGE_HISTORY_TBL_COLUMNS.account_number},
                ${RECHARGE_HISTORY_TBL_COLUMNS.recharge_amount}, ${RECHARGE_HISTORY_TBL_COLUMNS.balance_at_recharge}, ${RECHARGE_HISTORY_TBL_COLUMNS.date_time},
                ${RECHARGE_HISTORY_TBL_COLUMNS.created_by}, ${RECHARGE_HISTORY_TBL_COLUMNS.status}, ${RECHARGE_HISTORY_TBL_COLUMNS.unit_price_whie_recharge}, 
                ${RECHARGE_HISTORY_TBL_COLUMNS.meter_serial_number}, ${RECHARGE_HISTORY_TBL_COLUMNS.utility_id}, ${RECHARGE_HISTORY_TBL_COLUMNS.read_write_param_id},
                ${RECHARGE_HISTORY_TBL_COLUMNS.date_and_time_picked_by_client}, ${RECHARGE_HISTORY_TBL_COLUMNS.mdestatus}, ${RECHARGE_HISTORY_TBL_COLUMNS.mde_status_updated_time},
                ${RECHARGE_HISTORY_TBL_COLUMNS.consumption_for_this_recharge}, ${RECHARGE_HISTORY_TBL_COLUMNS.time_of_consumption_update_for_this_recharge}`;
        var sql = `INSERT INTO ${process.env.RECHARGE_HISTORY_MDAS_TABLE} (${COLUMNNAMES}) VALUES (${Object.keys(RECHARGE_HISTORY_TBL_COLUMNS).map(() => '?').join(', ')})`;

        records.map((v, i) => {
            if (!latestTime) {
                latestTime = v.date_time;
            } else {
                if (new Date(latestTime).getTime() < new Date(v.date_time).getTime()) {
                    latestTime = v.date_time;
                }
            }
            const currentRow = [v[RECHARGE_HISTORY_TBL_COLUMNS.recharge_id], v[RECHARGE_HISTORY_TBL_COLUMNS.customer_service_number], v[RECHARGE_HISTORY_TBL_COLUMNS.account_number],
            v[RECHARGE_HISTORY_TBL_COLUMNS.recharge_amount], v[RECHARGE_HISTORY_TBL_COLUMNS.balance_at_recharge], v[RECHARGE_HISTORY_TBL_COLUMNS.date_time] && replaceTnZfromDate(istDate(v[RECHARGE_HISTORY_TBL_COLUMNS.date_time])) || null, v[RECHARGE_HISTORY_TBL_COLUMNS.created_by],
            v[RECHARGE_HISTORY_TBL_COLUMNS.status], v[RECHARGE_HISTORY_TBL_COLUMNS.unit_price_whie_recharge], v[RECHARGE_HISTORY_TBL_COLUMNS.meter_serial_number], v[RECHARGE_HISTORY_TBL_COLUMNS.utility_id],
            v[RECHARGE_HISTORY_TBL_COLUMNS.read_write_param_id], v[RECHARGE_HISTORY_TBL_COLUMNS.date_and_time_picked_by_client] && replaceTnZfromDate(istDate(v[RECHARGE_HISTORY_TBL_COLUMNS.date_and_time_picked_by_client])) || null, v[RECHARGE_HISTORY_TBL_COLUMNS.mdestatus], v[RECHARGE_HISTORY_TBL_COLUMNS.mde_status_updated_time],
            v[RECHARGE_HISTORY_TBL_COLUMNS.consumption_for_this_recharge], RECHARGE_HISTORY_TBL_COLUMNS.time_of_consumption_update_for_this_recharge && replaceTnZfromDate(istDate(v[RECHARGE_HISTORY_TBL_COLUMNS.time_of_consumption_update_for_this_recharge])) || null];
            // if(i === 2 ) {
            //     console.log(v)
            console.log("Before inserting into table");
            db.query(sql, [...currentRow], function (err, result, fields) {
                if (err) console.log(err);
                console.log(result);
            });
            // }
        });
        db.release();
        console.log(latestTime);
        update_recharge_date(latestTime);
    });
    // } catch {
    //     console.log("Error in DB connection !");
    // }
};
export default run_get_inset_task;
