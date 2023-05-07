import { billingPh1, billingPh3 } from '../../services/ibotapp.azure-api';
import { insertBillingData, getRechargeSyncTime, updateLatestDateTime } from '../../services/cp.directus-api';
import { insertInstantaneousEPDCL, insertBlockEPDCL, insertBillingEPDCL } from '../../services/epdcl.server-api';
import { istDate, reduceHoursMins, stringToDateTime, stringToDateTime_EPDCL, replaceTfromDate } from '../../utils/index';

import ShortUniqueId from 'short-unique-id';

let token = null;// "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJlcGRjbCIsImV4cCI6MTY4MzE4ODk5NSwiaWF0IjoxNjgzMTAyNTk1fQ.2ESpO4D8V0XGi6gZz9hB86C-Nxm--Tm5A45LR13SlnV3XTxg_LcxAbcI00aQ2TdYXcHTeMl8ih395CebEmFm5Q";
export const insertIntoEPDCL = async () => {
    try {
        await generateJWT().then(res => {
            token = res.data.token;
        }).catch(err => console.log(err));
        // await insertInstantaneous();
    } catch (err) {
        console.error(err.message);

    }
};

export const billingEveryMonthPh1 = async () => {
    try {
        let time = null;
        await getRechargeSyncTime({ filter: { "object": { "_eq": "billing1ph" } } }).then(res => time = res.latest_date_time);
        await billingPh1(time).then(res => {
            const allItems = res.map((v, i) => {
                const uuid = new ShortUniqueId({ length: 25 });
                const billingDate = istDate(v.source_time_stamp);

                /*    const RTC = istDate(v.source_timestamp);
                    if (!latestTime) {
                        latestTime = RTC;
                    } else {
                        if (new Date(latestTime).getTime() < new Date(RTC).getTime()) {
                            latestTime = RTC;
                        }
                    }*/

                return {
                    /* transaction_id: uuid(),
                     cons_no: v.cons_no,
                     cons_id: v.cons_id,
                     billing_date: billingDate,
                     pf_avg: v.average_pf_for_billing,
                     cumenergy_imp_wh: v.cumulative_energy_kWh_import,
                     cumenergy_imp_vah: v.cumulative_energy_kVAh_import,
                     md_w: v.md_kW,
                     md_w_date: stringToDateTime(v.maximum_demand_kW_capture_time),
                     md_va: v.md_kVA,
                     md_va_date: stringToDateTime(v.maximum_demand_kW_capture_time),
                     power_on_duration: v.total_billing_power_on_duration,
                     created_date: reduceHoursMins(new Date(), 0, 0),
                     meter_serial_number: v.meter_serial_number*/

                    "TRANS_ID": uuid(),
                    "CONS_NO": v.cons_no,
                    "CONS_ID": v.cons_id,
                    "PF_AVG": v.average_pf_for_billing,
                    "CUMENERGY_IMP_WH": v.cumulative_energy_kWh_import,
                    "CUMENERGY_IMP_VAH": v.cumulative_energy_kVAh_import,
                    "MD_W": v.md_kW,
                    "MD_W_DATE": v.maximum_demand_kW_capture_time,//v.maximum_demand_kW_capture_time && stringToDateTime_EPDCL(replaceTfromDate(v.maximum_demand_kW_capture_time)),

                    "MD_VA": v.md_kVA,
                    "MD_VA_DATE": v.maximum_demand_kW_capture_time,// v.maximum_demand_kW_capture_time && stringToDateTime_EPDCL(replaceTfromDate(v.maximum_demand_kW_capture_time)),
                    "POWER_ON_DURATION": v.total_billing_power_on_duration,
                    "METER_NUMBER": v.meter_serial_number,
                    "CREATED_DATE": reduceHoursMins(new Date(), 0, 0)



                };





            });
            /* callApi(0, allItems, 6, (status) => {
                 if (status === 'completed') {
                     billingEveryMonthPh3();
                 }
             });*/

            console.log(allItems.length);
            callApi(0, allItems, insertBillingEPDCL, 6, (status) => {
                if (status === 'completed') {
                    console.log('Billing pahse 1 done');
                    billingEveryMonthPh3();
                    //console.log('EDPDCL data block started');
                    // insertBlockLoadData();
                }


            });

        });

    } catch (err) {
        console.error(err.message);
    }

};

export const billingEveryMonthPh3 = async () => {
    try {
        let time = null;
        await getRechargeSyncTime({ filter: { "object": { "_eq": "billing3ph" } } }).then(res => time = res.latest_date_time);
        await billingPh3(time).then(res => {
            console.log("9999999", res);
            const allItems = res.map((v, i) => {
                const uuid = new ShortUniqueId({ length: 25 });

                const billingDate = istDate(v.source_timestamp);

                return {
                    /* transaction_id: uuid(),
                     cons_no: v.cons_no,
                     cons_id: v.cons_id,
                     billing_date: billingDate,
                     pf_avg: v.system_pf_for_billing_period_import,
                     cumenergy_imp_wh: v.cumulative_energy_Wh_import,
                     cumenergy_imp_vah: v.cumulative_energy_VAh_import,
                     md_w: v.md_W_import,
                     md_w_date: stringToDateTime(v.maximum_demand_W_capture_time_import),
                     md_va: v.md_VA_import,
                     md_va_date: stringToDateTime(v.maximum_demand_VA_capture_time_import),
                     power_on_duration: v.total_billing_power_on_duration,
                     created_date: reduceHoursMins(new Date(), 0, 0),
                     meter_serial_number: v.meter_serial_number*/


                    "TRANS_ID": uuid(),
                    "CONS_NO": v.cons_no,
                    "CONS_ID": v.cons_id,
                    "PF_AVG": v.system_pf_for_billing_period_import,
                    "CUMENERGY_IMP_WH": v.cumulative_energy_Wh_import,
                    "CUMENERGY_IMP_VAH": v.cumulative_energy_VAh_import,
                    "MD_W": v.md_W_import,
                    "MD_W_DATE": v.maximum_demand_W_capture_time_import,//v.maximum_demand_W_capture_time_import && stringToDateTime_EPDCL(replaceTfromDate(v.maximum_demand_W_capture_time_import)),
                    "MD_VA": v.md_VA_import,
                    "MD_VA_DATE": v.maximum_demand_VA_capture_time_import, //v.maximum_demand_VA_capture_time_import && stringToDateTime_EPDCL(replaceTfromDate(v.maximum_demand_VA_capture_time_import)),
                    "POWER_ON_DURATION": v.total_billing_power_on_duration,
                    "METER_NUMBER": v.meter_serial_number,
                    "CREATED_DATE": reduceHoursMins(new Date(), 0, 0)



                };

            });

            /* callApi(0, allItems, 7, (status) => {
                 if (status === 'completed') {
                     console.log('Billing pahse 3 done');
                 }
             });*/

            console.log(allItems.length);
            callApi(0, allItems, insertBillingEPDCL, 7, (status) => {
                if (status === 'completed') {
                    // insertInstantaneousPh3();
                    //console.log('EDPDCL data block started');
                    // insertBlockLoadData();
                    console.log('Billing pahse 3 done');
                }


            });

        });
    } catch (err) {
        console.error(err.message);
    }

};

/*const callApi = (int, p = [], phase, cb = Function) => {
    if (int >= 0 && p.length > int) {
        console.log(int, p[int].billing_date);
        insertBillingData(p[int]).then(async res => {
            try {
                await updateLatestDateTime(phase, p[int].billing_date);
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
}; */

const callApi = (int, p = [], insertFn, phase, cb = Function) => {
    // console.log("Threephase phase and d", phase);
    //console.log(token, "tokentokentokentokentokentoken");
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

const generateJWT = () => {
    return axios.post('http://59.144.184.77:8085/ibot/authenticate', {
        "username": "epdcl",
        "password": "epdc@32!1!#"
    }
    );
};