import { getInstantaneousPh1, getInstantaneousPh3 } from '../../services/ibotapp.azure-api';
import { insertInstantaneousData, getRechargeSyncTime, updateLatestDateTime } from '../../services/cp.directus-api';
import { insertInstantaneousEPDCL } from '../../services/epdcl.server-api';
import { istDate, reduceHoursMins } from '../../utils/index';
import { replaceTfromDate, stringToDateTime_EPDCL } from '../../utils/index';

import ShortUniqueId from 'short-unique-id';



let token = null;//"eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJlcGRjbCIsImV4cCI6MTY4MzE4ODk5NSwiaWF0IjoxNjgzMTAyNTk1fQ.2ESpO4D8V0XGi6gZz9hB86C-Nxm--Tm5A45LR13SlnV3XTxg_LcxAbcI00aQ2TdYXcHTeMl8ih395CebEmFm5Q";
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
// Single Phase 
export const insertInstantaneousPh1 = async () => {
    console.log('Phase 1 inside');
    try {
        let time = null;
        await getRechargeSyncTime({ filter: { "object": { "_eq": "instantaneous1ph" } } }).then(res => time = res.latest_date_time).catch(err => console.log(err));
        console.log(time);
        await getInstantaneousPh1(time).then(async res => {
            console.log('Phase 1 getdata');
            let latestTime = null;
            const allItems = res.map((v, i) => {
                const uuid = new ShortUniqueId({ length: 25 });

                // if(i === 1) {
                const RTC = istDate(v.source_timestamp);
                if (!latestTime) {
                    latestTime = RTC;
                } else {
                    if (new Date(latestTime).getTime() < new Date(RTC).getTime()) {
                        latestTime = RTC;
                    }
                }
                // console.log("RTC", RTC);
                const payload = {
                    /* rtc: RTC,
                     voltage: v.voltage,
                     i_phase: v.phase_current,
                     i_neutral: v.neutral_current,
                     cumpoweron_dur: v.cumulative_power_on_duration,
                     signed_pf: v.signed_power_factor,
                     frequency: v.frequency,
                     apparentpower_va: v.apparent_power,
                     activepower_w: v.active_power,
                     powerfailures_cnt: v.cumulative_no_of_power_failures,
                     cumpoweroff_dur: v.cumulative_power_off_duration,
                     cumtamper_cnt: v.cumulative_tamper_count,
                     cumbill_cnt: v.cumulative_billing_count,
                     cumprog_cnt: v.cumulative_program_count,
                     last_billdate: v.last_billing_date,
                     cumenergy_imp_wh: v.cumulative_energy_kWh_import,
                     cumenergy_imp_vah: v.cumulative_energy_kVAh_import,
                     mdactive_imp_w: v.maximum_demand_kW,
                     mdactive_date: v.maximum_demand_kW_capture_time_new,
                     mdapparent_Imp_va: v.maximum_demand_kVA,
                     mdapparent_date: v.maximum_demand_kVA_capture_time_new,
                     loadlimit_functionstatus: v.load_limit_function_status,
                     loadlimitvalue_w: v.load_limit_value_kw,
                     meter_serial_number: v.meter_serial_number,
                     created_date: reduceHoursMins(new Date(), 0, 0),
                     transaction_id: uuid(),
                     cons_no: v.cons_no,
                     cons_id: v.cons_id*/

                    "TRANS_ID": uuid(),//v.transaction_id,
                    "CONS_NO": v.cons_no,
                    "CONS_ID": v.cons_id,
                    "RTC": v.rtc && stringToDateTime_EPDCL(replaceTfromDate(v.rtc)),
                    "VOLTAGE": v.voltage,
                    "I_PHASE": v.phase_current,
                    "I_NEUTRAL": v.neutral_current,
                    //"IR": v.ir,
                    //"IY": v.iy,
                    //"IB": v.ib,
                    //"VRN": v.vrn,
                    //"VYN": v.vyn,
                    //"VBN": v.vbn,
                    //"PF_R": v.pf_r,
                    // "PF_Y": v.pf_y,
                    // "PF_B": v.pf_b,
                    "CUMPOWERON_DUR": v.cumulative_power_on_duration,
                    "SIGNED_PF": v.signed_power_factor,
                    "FREQUENCY": v.frequency,
                    "APPARENTPOWER_VA": v.apparent_power,
                    "ACTIVEPOWER_W": v.activepower,
                    //   "REACTIVEPOWER_VAR": v.reactivepower_var,
                    "POWERFAILURES_CNT": v.cumulative_no_of_power_failures,
                    "CUMPOWEROFF_DUR": "1",
                    "CUMTAMPER_CNT": v.cumulative_tamper_count,
                    "CUMBILL_CNT": v.cumulative_billing_count,
                    "CUMPROG_CNT": v.cumulative_program_count,
                    "LAST_BILLDATE": v.last_billing_date && stringToDateTime_EPDCL(replaceTfromDate(v.last_billing_date)),
                    "CUMENERGY_IMP_WH": v.cumulative_energy_kWh_import,
                    "CUMENERGY_IMP_VAH": v.cumulative_energy_kVAh_import,
                    "MDACTIVE_IMP_W": v.maximum_demand_kW,
                    "MDACTIVE_DATE": v.maximum_demand_kW_capture_time_new && stringToDateTime_EPDCL(replaceTfromDate(v.maximum_demand_kW_capture_time_new)),
                    "MDAPPARENT_IMP_VA": v.maximum_demand_kVA,
                    "MDAPPARENT_DATE": v.maximum_demand_kVA_capture_time_new && stringToDateTime_EPDCL(replaceTfromDate(v.maximum_demand_kVA_capture_time_new)),
                    "LOADLIMIT_FUNCTIONSTATUS": v.load_limit_value_kw,
                    "LOADLIMITVALUE_W": v.load_limit_function_status,
                    "CREATED_DATE": reduceHoursMins(new Date(), 0, 0),
                    "METER_NUMBER": v.meter_serial_number

                };

                return payload;

                // }

            });
            // console.log(allItems.length);
            /* callApi(0, allItems, 2, (status) => {
                 if (status === 'completed') {
                     insertInstantaneousPh3();
                 }*/
            console.log(allItems.length);
            callApi(0, allItems, insertInstantaneousEPDCL, 2, (status) => {
                if (status === 'completed') {
                    console.log('Insta pahse 1 done');
                    insertInstantaneousPh3();
                    //console.log('EDPDCL data block started');
                    // insertBlockLoadData();
                }


            });



        });
    } catch (err) {
        console.error(err.message);
    }

};

export const insertInstantaneousPh3 = async () => {
    console.log('Phase 3 started');
    try {
        let time = null;
        await getRechargeSyncTime({ filter: { "object": { "_eq": "instantaneous3ph" } } }).then(res => time = res.latest_date_time);
        await getInstantaneousPh3(time).then(res => {
            let latestTime = null;
            console.log(res, "PH3----", res.length);
            const allItems = res?.map((v, i) => {
                const uuid = new ShortUniqueId({ length: 25 });

                // if(i === 1) {
                const RTC = istDate(v.source_timestamp);
                if (!latestTime) {
                    latestTime = RTC;
                } else {
                    if (new Date(latestTime).getTime() < new Date(RTC).getTime()) {
                        latestTime = RTC;
                    }
                }
                const payload = {
                    /* transaction_id: uuid(),
                     cons_no: v.cons_no,
                     cons_id: v.cons_id,
                     rtc: RTC,
                     ir: v.l1_current,
                     iy: v.l2_current,
                     ib: v.l3_current,
                     vrn: v.l1_voltage,
                     vyn: v.l2_voltage,
                     vbn: v.l3_voltage,
                     pf_r: v.l1_signed_power_factor,
                     pf_y: v.l2_signed_power_factor,
                     pf_b: v.l3_signed_power_factor,
                     cumpoweron_dur: v.cumulative_power_on_duration,
                     signed_pf: v.signed_three_phase_power_factor,
                     frequency: v.frequency,
                     apparentpower_va: v.apparent_power,
                     activepower_w: v.signed_active_power,
                     reactivepower_var: v.signed_reactive_power,
                     powerfailures_cnt: v.no_of_power_failures,
                     cumpoweroff_dur: v.cumulative_power_off_duration,
                     cumtamper_cnt: v.cumulative_tamper_count,
                     cumbill_cnt: v.cumulative_billing_count,
                     cumprog_cnt: v.cumulative_programming_count,
                     last_billdate: v.last_billing_date_new,
                     cumenergy_imp_wh: v.cumulative_energy_Wh_import,
                     cumenergy_imp_vah: v.cumulative_energy_VAh_import,
                     mdactive_imp_w: v.maximum_demand_active_import,
                     mdactive_date: v.maximum_demand_active_import_capture_time_new,
                     mdapparent_imp_va: v.maximum_demand_apparent_import,
                     mdapparent_date: v.maximum_demand_apparent_import_capture_time_new,
                     loadlimit_functionstatus: v.load_limit_function_status,
                     loadlimitvalue_w: v.load_limit_value_W,
                     created_date: reduceHoursMins(new Date(), 0, 0),
                     meter_serial_number: v.meter_serial_number */

                    "TRANS_ID": uuid(),
                    "CONS_NO": v.cons_no,
                    "CONS_ID": v.cons_id,
                    "RTC": v.rtc && stringToDateTime_EPDCL(replaceTfromDate(v.rtc)),
                    //  "VOLTAGE": v.voltage,
                    // "I_PHASE": v.i_phase,
                    // "I_NEUTRAL": v.i_neutral,
                    "IR": v.l1_current,
                    "IY": v.l2_current,
                    "IB": v.l3_current,
                    "VRN": v.l1_voltage,
                    "VYN": v.l2_voltage,
                    "VBN": v.l3_voltage,
                    "PF_R": v.l1_signed_power_factor,
                    "PF_Y": v.l2_signed_power_factor,
                    "PF_B": v.l3_signed_power_factor,
                    "CUMPOWERON_DUR": v.cumulative_power_on_duration,
                    "SIGNED_PF": v.signed_three_phase_power_factor,
                    "FREQUENCY": v.frequency,
                    "APPARENTPOWER_VA": v.apparent_power,
                    "ACTIVEPOWER_W": v.signed_active_power,
                    "REACTIVEPOWER_VAR": v.signed_reactive_power,
                    "POWERFAILURES_CNT": v.pno_of_power_failures,
                    "CUMPOWEROFF_DUR": v.cumulative_power_off_duration,
                    "CUMTAMPER_CNT": v.cumulative_tamper_count,
                    "CUMBILL_CNT": v.cumulative_billing_count,
                    "CUMPROG_CNT": v.cumulative_programming_count,
                    //"LAST_BILLDATE": v.last_billing_date_new && stringToDateTime_EPDCL(replaceTfromDate(last_billing_date_new)),
                    "CUMENERGY_IMP_WH": v.cumulative_energy_Wh_import,
                    "CUMENERGY_IMP_VAH": v.cumulative_energy_VAh_import,
                    "MDACTIVE_IMP_W": v.maximum_demand_active_import,
                    "MDACTIVE_DATE": v.maximum_demand_active_import_capture_time_new && stringToDateTime_EPDCL(replaceTfromDate(v.maximum_demand_active_import_capture_time_new)),
                    "MDAPPARENT_IMP_VA": v.maximum_demand_apparent_import,
                    "MDAPPARENT_DATE": v.maximum_demand_apparent_import_capture_time_new && stringToDateTime_EPDCL(replaceTfromDate(v.maximum_demand_apparent_import_capture_time_new)),
                    "LOADLIMIT_FUNCTIONSTATUS": v.load_limit_function_status,
                    "LOADLIMITVALUE_W": v.load_limit_value_W,
                    "CREATED_DATE": reduceHoursMins(new Date(), 0, 0),
                    "METER_NUMBER": v.meter_serial_number,


                };

                return payload;

                // }

            });
            console.log(allItems, 'Phase 3 recs');
            /*callApi(0, allItems, 3, (status) => {
                console.log(status, 'statusstatusstatusstatus');
            });*/

            console.log(allItems.length);
            callApi(0, allItems, insertInstantaneousEPDCL, 3, (status) => {
                if (status === 'completed') {
                    // insertInstantaneousPh3();
                    console.log('Insta pahse 3 done');
                    console.log('EDPDCL data block started');
                    // insertBlockLoadData();
                }
            });
        });


    } catch (err) {
        console.error(err.message);
    }
};



/*const callApi = (int, p = [], phase, cb = Function) => {
    if (int >= 0 && p.length > int) {
        insertInstantaneousData(p[int]).then(async res => {
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
};*/

const callApi = (int, p = [], insertFn, phase, cb = Function) => {
    //console.log("Threephase phase and d", phase);
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

