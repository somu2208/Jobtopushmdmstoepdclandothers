import { getInstantaneousBlockph1, getInstantaneousBlockph3 } from '../../services/ibotapp.azure-api';
import { insertInstantaneousData, getRechargeSyncTime, updateLatestDateTime, insertBlockData } from '../../services/cp.directus-api';

import { insertBlockEPDCL } from '../../services/epdcl.server-api';
import { istDate, reduceHoursMins } from '../../utils/index';
import ShortUniqueId from 'short-unique-id';
let token = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJlcGRjbCIsImV4cCI6MTY4MzE4ODk5NSwiaWF0IjoxNjgzMTAyNTk1fQ.2ESpO4D8V0XGi6gZz9hB86C-Nxm--Tm5A45LR13SlnV3XTxg_LcxAbcI00aQ2TdYXcHTeMl8ih395CebEmFm5Q";
/*export const insertIntoEPDCL = async () => {
    try {
        await generateJWT().then(res => {
            token = res.data.token;
        }).catch(err => console.log(err));
        // await insertInstantaneous();
    } catch (err) {
        console.error(err.message);

    }
};*/

export const insertInstantaneousBlockPh1 = async () => {
    try {
        let time = null;
        await getRechargeSyncTime({ filter: { "object": { "_eq": "block1ph" } } }).then(res => time = res.latest_date_time);
        await getInstantaneousBlockph1(time).then(res => {
            const allItems = res.map((v, i) => {
                const uuid = new ShortUniqueId({ length: 25 });

                const RTC = istDate(v.source_timestamp);

                return {
                    // transaction_id: uuid(),  /* UUID- 25 Chars */
                    // cons_no: v.cons_no, /*  keep null for now*/
                    // cons_id: v.cons_id, /* keep null for now*/
                    /* rtc: RTC,
                     v_avg: v.average_voltage,
                     i_avg: v.average_current,
                     energy_emp_wh: v.block_energy_kWh_import,
                     energy_imp_vah: v.block_energy_VAh_import,
                     energy_exp_wh: v.block_energy_kWh_export,
                     energy_exp_vah: v.block_energy_VAh_export,
                     avg_signalstrength: v.average_signal_strength,
                     created_date: reduceHoursMins(new Date(), 0, 0),
                     meter_serial_number: v.meter_serial_number */

                    "TRANS_ID": uuid(),
                    "CONS_NO": v.cons_no,
                    "CONS_ID": v.cons_id,
                    "RTC": v.rtc && stringToDateTime_EPDCL(replaceTfromDate(v.rtc)),
                    "V_AVG": v.average_voltage,
                    "I_AVG": v.average_current,
                    //"IR": v.ir,
                    //"IY": v.iy,
                    // "IB": v.ib,
                    //"VRN": v.vrn,
                    // "VYN": v.vyn,
                    // "VBN": v.vb,
                    "ENERGY_IMP_WH": v.block_energy_kWh_import,
                    "ENERGY_IMP_VAH": v.block_energy_VAh_import,
                    "ENERGY_EXP_WH": v.block_energy_kWh_export,
                    "ENERGY_EXP_VAH": v.block_energy_VAh_export,
                    "AVG_SIGNALSTRENTH": v.average_signal_strength,
                    "METER_NUMBER": v.merer_serial_number,
                    "CREATED_DATE": reduceHoursMins(new Date(), 0, 0)




                };

            });
            console.log(allItems.length, 'Records need to push');
            /*callApi(0, allItems, 4, (status) => {
                if (status === 'completed') {
                    insertInstantaneousBlockPh3();
                }
            });*/

            callApi(0, allItems, insertBlockEPDCL, 4, (status) => {
                if (status === 'completed') {
                    console.log('Block load pahse 1 done');
                    console.log('EDPDCL Billing data started');
                    // insertBillingData();
                    insertInstantaneousBlockPh3();
                }
            });
        });

    } catch (err) {
        console.error(err.message);
    }

};

export const insertInstantaneousBlockPh3 = async () => {
    console.log("*****insertInstantaneousBlockPh3*******");
    try {
        let time = null;
        await getRechargeSyncTime({ filter: { "object": { "_eq": "block3ph" } } }).then(res => time = res.latest_date_time);

        await getInstantaneousBlockph3(time).then(res => {
            const allItems = res.map((v, i) => {
                const uuid = new ShortUniqueId({ length: 25 });

                const RTC = istDate(v.source_timestamp);
                return {
                    /* transaction_id: uuid(),
                     cons_no: v.cons_no,
                     cons_id: v.cons_id,
                     rtc: RTC,
                     v_avg: v.average_voltage,
                     ir: v.current_lr,
                     iy: v.current_ly,
                     ib: v.current_lb,
                     vrn: v.voltage_vrn,
                     vyn: v.voltage_vyn,
                     vbn: v.voltage_vbn,
                     energy_emp_wh: v.block_energy_Wh_import,
                     energy_imp_vah: v.block_energy_VAh_import,
                     energy_exp_wh: v.block_energy_Wh_export,
                     energy_exp_vah: v.block_energy_VAh_export,
                     avg_signalstrength: v.average_signal_strength,
                     created_date: reduceHoursMins(new Date(), 0, 0),
                     meter_serial_number: v.meter_serial_number*/

                    "TRANS_ID": uuid(),
                    "CONS_NO": v.cons_no,
                    "CONS_ID": v.cons_id,
                    "RTC": v.rtc && stringToDateTime_EPDCL(replaceTfromDate(v.rtc)),
                    "V_AVG": v.average_voltage,
                    "I_AVG": v.average_current,
                    "IR": v.current_lr,
                    "IY": v.current_ly,
                    "IB": v.current_lb,
                    "VRN": v.voltage_vrn,
                    "VYN": v.voltage_vyn,
                    "VBN": v.voltage_vbn,
                    "ENERGY_IMP_WH": v.block_energy_kWh_import,
                    "ENERGY_IMP_VAH": v.block_energy_VAh_import,
                    "ENERGY_EXP_WH": v.block_energy_kWh_export,
                    "ENERGY_EXP_VAH": v.block_energy_VAh_export,
                    "AVG_SIGNALSTRENTH": v.average_signal_strength,
                    "METER_NUMBER": v.merer_serial_number,
                    "CREATED_DATE": reduceHoursMins(new Date(), 0, 0)


                };

            });
            console.log(allItems.length, "ph3 leg");
            /* callApi(0, allItems, 5, (status) => {
                 console.log(status, '**&&&***');
             });*/

            callApi(0, allItems, insertBlockEPDCL, 5, (status) => {
                if (status === 'completed') {
                    console.log("Blockload 3 phase completed");
                    console.log('EDPDCL Billing data started');
                    // insertBillingData();
                    // insertInstantaneousBlockPh3();
                }
            });
        });
    } catch (err) {
        console.error(err.message);
    }

};


/*const callApi = (int, p = [], phase, cb = Function) => {
    if (int >= 0 && p.length > int) {
        console.log(p[int].rtc);
        insertBlockData(p[int]).then(async res => {
            try {
                await updateLatestDateTime(phase, p[int].rtc);
                callApi((int + 1), p, phase, cb);
            } catch (err) {
                console.error(err.message);
            }
            console.log(res, int);
        }).catch(err => {
            callApi((int + 1), p, phase, cb);
            console.log(err);
        });
    } else {
        cb('completed');
    }
};
 */
const callApi = (int, p = [], insertFn, phase, cb = Function) => {
    //console.log("Threephase phase and d", phase);
    // console.log(token, "tokentokentokentokentokentoken");
    if (int >= 0 && p.length > int) {
        insertFn([p[int]], token).then(async res => {
            try {

                const d = p[int]?.CREATED_DATE || null;
                await updateLatestDateTime(phase, d);
                callApi((int + 1), p, insertFn, phase, cb);
            } catch (err) {
                console.error(err.message);
            }

        }).catch(err => {
            callApi((int + 1), p, insertFn, phase, cb);
            console.log(err);
        });
    } else {
        cb('completed');
    }
};