import { getRechargeSyncTime, updateLatestDateTime, getInstantaneousData, getBlockLoadData, getBillingData } from '../../services/cp.directus-api';
import { insertInstantaneousEPDCL, insertBlockEPDCL, insertBillingEPDCL } from '../../services/epdcl.server-api';
import { replaceTfromDate, stringToDateTime_EPDCL } from '../../utils/index';
import { istDate, reduceHoursMins } from '../../utils/index';
import { getInstantaneousPh3, getInstantaneousPh1, billingPh1, billingPh3, getInstantaneousBlockph1, getInstantaneousBlockph3 } from '../../services/ibotapp.azure-api';
import ShortUniqueId from 'short-unique-id';
import axios from 'axios';



let token = null;//"eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJlcGRjbCIsImV4cCI6MTY4MzE4ODk5NSwiaWF0IjoxNjgzMTAyNTk1fQ.2ESpO4D8V0XGi6gZz9hB86C-Nxm--Tm5A45LR13SlnV3XTxg_LcxAbcI00aQ2TdYXcHTeMl8ih395CebEmFm5Q";
export const insertIntoEPDCL = async () => {
    try {
        await generateJWT().then(res => {
            token = res.data.token;
            console.log(token);
        }).catch(err => console.log(err));
        // await insertInstantaneous();
        //  console.log("Inside the Generate token method");
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
                console.log(i);
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
                    "MD_W_DATE": v.maximum_demand_kW_capture_time,// v.maximum_demand_kW_capture_time && stringToDateTime_EPDCL(replaceTfromDate(v.maximum_demand_kW_capture_time)),

                    "MD_VA": v.md_kVA,
                    "MD_VA_DATE": v.maximum_demand_kW_capture_time,//v.maximum_demand_kW_capture_time && stringToDateTime_EPDCL(replaceTfromDate(v.maximum_demand_kW_capture_time)),
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
                    "MD_VA_DATE": v.maximum_demand_VA_capture_time_import,//v.maximum_demand_VA_capture_time_import && stringToDateTime_EPDCL(replaceTfromDate(v.maximum_demand_VA_capture_time_import)),
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


export const insertInstantaneous = async () => {
    try {
        let time = null;
        await getRechargeSyncTime({ filter: { "object": { "_eq": "Instantaneous" } } }).then(res => { console.log(res); time = res?.latest_date_time; }).catch(err => console.log(err));
        await getInstantaneousData(`&filter={"created_date":{"_gt":"${time}"}}&sort=created_date&limit=-1`).then(res => {
            const allItems = res?.map((v, i) => {
                return {
                    "TRANS_ID": v.transaction_id,
                    "CONS_NO": v.cons_no,
                    "CONS_ID": v.cons_id,
                    "RTC": v.rtc && stringToDateTime_EPDCL(replaceTfromDate(v.rtc)),
                    "VOLTAGE": v.voltage,
                    "I_PHASE": v.i_phase,
                    "I_NEUTRAL": v.i_neutral,
                    "IR": v.ir,
                    "IY": v.iy,
                    "IB": v.ib,
                    "VRN": v.vrn,
                    "VYN": v.vyn,
                    "VBN": v.vbn,
                    "PF_R": v.pf_r,
                    "PF_Y": v.pf_y,
                    "PF_B": v.pf_b,
                    "CUMPOWERON_DUR": v.cumpoweron_dur,
                    "SIGNED_PF": v.signed_pf,
                    "FREQUENCY": v.frequency,
                    "APPARENTPOWER_VA": v.apparentpower_va,
                    "ACTIVEPOWER_W": v.activepower_w,
                    "REACTIVEPOWER_VAR": v.reactivepower_var,
                    "POWERFAILURES_CNT": v.powerfailures_cnt,
                    "CUMPOWEROFF_DUR": "1",
                    "CUMTAMPER_CNT": v.cumtamper_cnt,
                    "CUMBILL_CNT": v.cumbill_cnt,
                    "CUMPROG_CNT": v.cumprog_cnt,
                    "LAST_BILLDATE": v.last_billdate && stringToDateTime_EPDCL(replaceTfromDate(v.last_billdate)),
                    "CUMENERGY_IMP_WH": v.cumenergy_imp_wh,
                    "CUMENERGY_IMP_VAH": v.cumenergy_imp_vah,
                    "MDACTIVE_IMP_W": v.mdactive_imp_w,
                    "MDACTIVE_DATE": v.mdactive_date && stringToDateTime_EPDCL(replaceTfromDate(v.mdactive_date)),
                    "MDAPPARENT_IMP_VA": v.mdapparent_imp_va,
                    "MDAPPARENT_DATE": v.mdapparent_date && stringToDateTime_EPDCL(replaceTfromDate(v.mdapparent_date)),
                    "LOADLIMIT_FUNCTIONSTATUS": v.loadlimit_functionstatus,
                    "LOADLIMITVALUE_W": v.loadlimit_functionstatus,
                    "CREATED_DATE": v.created_date,
                    "METER_NUMBER": v.meter_serial_number,
                };
            });
            console.log(allItems.length);
            callApi(0, allItems, insertInstantaneousEPDCL, 9, (status) => {
                if (status === 'completed') {
                    console.log('EDPDCL data block started');
                    // insertBlockLoadData();
                }
            });


        });
    } catch (err) {
        console.error(err.message);
    }
};



export const insertBlockLoadData = async () => {
    try {
        let time = null;
        await getRechargeSyncTime({ filter: { "object": { "_eq": "Block" } } }).then(res => time = res?.latest_date_time);
        await getBlockLoadData(`&filter={"created_date":{"_gt":"${time}"}}&sort=created_date&limit=-1`).then(res => {
            const allItems = res?.map((v, i) => {
                return {
                    "TRANS_ID": v.transaction_id,
                    "CONS_NO": v.cons_no,
                    "CONS_ID": v.cons_id,
                    "RTC": v.rtc && stringToDateTime_EPDCL(replaceTfromDate(v.rtc)),
                    "V_AVG": v.v_avg,
                    "I_AVG": v.i_avg,
                    "IR": v.ir,
                    "IY": v.iy,
                    "IB": v.ib,
                    "VRN": v.vrn,
                    "VYN": v.vyn,
                    "VBN": v.vb,
                    "ENERGY_IMP_WH": v.energy_emp_wh,
                    "ENERGY_IMP_VAH": v.energy_imp_vah,
                    "ENERGY_EXP_WH": v.energy_exp_wh,
                    "ENERGY_EXP_VAH": v.energy_exp_vah,
                    "AVG_SIGNALSTRENTH": v.avg_signalstrength,
                    "METER_NUMBER": v.merer_serial_number,
                    "CREATED_DATE": v.created_date,

                };
            });
            console.log(allItems.length);
            callApi(0, allItems, insertBlockEPDCL, 10, (status) => {
                if (status === 'completed') {
                    console.log('EDPDCL Billing data started');
                    // insertBillingData();
                }
            });
        });
    } catch (err) {
        console.error(err.message);
    }
};

export const insertBillingData = async () => {
    try {
        let time = null;
        await getRechargeSyncTime({ filter: { "object": { "_eq": "Billing" } } }).then(res => time = res?.latest_date_time);

        console.log(time);
        await getBillingData(`&filter={"created_date":{"_gt":"${time}"}}&sort=created_date&limit=-1`).then(res => {
            const allItems = res?.map((v, i) => {
                return {

                    "TRANS_ID": v.transaction_id,
                    "CONS_NO": v.cons_no,
                    "CONS_ID": v.cons_id,
                    "PF_AVG": v.pg_avg,
                    "CUMENERGY_IMP_WH": v.cumenergy_imp_wh,
                    "CUMENERGY_IMP_VAH": v.cumenergy_imp_vah,
                    "MD_W": v.md_w,
                    "MD_W_DATE": v.md_w_date && stringToDateTime_EPDCL(replaceTfromDate(v.md_w_date)),
                    "MD_VA": v.md_va,
                    "MD_VA_DATE": v.md_va_date && stringToDateTime_EPDCL(replaceTfromDate(v.md_va_date)),
                    "POWER_ON_DURATION": v.power_on_duration,
                    "METER_NUMBER": v.meter_serial_number,
                    "CREATED_DATE": v.created_date

                };
            });
            console.log(allItems.length, "allItemsallItemsallItemsallItemsallItems");

            callApi(0, allItems, insertBillingEPDCL, 11, (status) => {
                console.log(allItems.length, "BILLING))))))))---");
                if (status === 'completed') {
                    console.log('EDPDCL Billing data');
                }
            });
        });
    } catch (err) {
        console.error(err.message);
    }
};


const callApi = (int, p = [], insertFn, phase, cb = Function) => {
    console.log(token, "tokentokentokentokentokentoken");
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

    console.log("Inside get generateJWT() method");
    return axios.post('http://59.144.184.77:8085/ibot/authenticate', {
        "username": "epdcl",
        "password": "epdc@32!1!#"
    }
    );
};