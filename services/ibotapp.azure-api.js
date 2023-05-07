
import { appApi } from "../config/axios";

export const getInstantaneousPh1 = (t) => {
    console.log("Inside get method of insta ph1");
    return appApi.get(`items/meter_instantaneous_profile_single_phase?access_token=1234&fields=meter_serial_number, server_timestamp,
    voltage,phase_current,neutral_current,cumulative_power_on_duration,signed_power_factor,
    frequency,apparent_power,active_power,cumulative_no_of_power_failures,cumulative_power_off_duration,cumulative_tamper_count,cumulative_billing_count,cumulative_program_count,
    last_billing_date,cumulative_energy_kWh_import,cumulative_energy_kVAh_import,maximum_demand_kW,maximum_demand_kW_capture_time,maximum_demand_kVA,maximum_demand_kVA_capture_time,load_limit_function_status,load_limit_value_kw,cons_id,cons_no,maximum_demand_kW_capture_time_new,maximum_demand_kVA_capture_time_new,source_timestamp&filter={"_and":
    [{"source_timestamp":{"_gt":"${t}"}},{"utility_id":{"_eq":"3"}}]}&sort=source_timestamp&limit=-1    
    `).then(res => res.data.data)
        .catch(err => err.response.data);
};

export const getInstantaneousPh3 = (t) => {
    return appApi.get(`items/meter_instantaneous_profile_three_phase?access_token=1234&fields=meter_serial_number,server_timestamp,l1_current,l2_current,
    l3_current,l1_voltage,l2_voltage,l3_voltage,l1_signed_power_factor,l2_signed_power_factor,
    l3_signed_power_factor,cumulative_power_on_duration,signed_three_phase_power_factor,
    frequency,apparent_power,signed_active_power,signed_reactive_power,no_of_power_failures,
    cumulative_power_off_duration,cumulative_tamper_count,cumulative_billing_count,
    cumulative_programming_count,last_billing_date,cumulative_energy_Wh_import,
    cumulative_energy_VAh_import,maximum_demand_active_import,
    maximum_demand_active_import_capture_time,maximum_demand_apparent_import,
    maximum_demand_apparent_import_capture_time,load_limit_function_status,cons_id,cons_no,maximum_demand_active_import_capture_time_new,maximum_demand_apparent_import_capture_time_new,last_billing_date_new,
    load_limit_value_W,source_timestamp&filter={"_and":
    [{"source_timestamp":{"_gt":"${t}"}},{"UtilityId":{"_eq":"3"}}]}&sort=source_timestamp&limit=-1
      
    `).then(res => res.data.data)
        .catch(err => err.response.data);
};

export const getInstantaneousBlockph1 = (t) => {
    return appApi.get(`items/meter_block_load_profile_single_phase?access_token=1234&fields=meter_serial_number,source_timestamp,average_voltage,
    average_current,block_energy_kWh_import,block_energy_VAh_import,block_energy_kWh_export,cons_id,cons_no,block_energy_VAh_export,average_signal_strength&filter={"_and":
    [{"source_timestamp":{"_gt":"${t}"}},{"utility_id":{"_eq":"3"}}]}&sort=source_timestamp&limit=-1
       
    `).then(res => res.data.data)
        .catch(err => err.response.data);
};

export const getInstantaneousBlockph3 = (t) => {
    return appApi.get(`items/meter_block_load_profile_three_phase?access_token=1234&fields=meter_serial_number,source_timestamp,average_voltage,
    current_lr,current_ly,current_lb,voltage_vrn,voltage_vyn,voltage_vbn,block_energy_Wh_import,
    block_energy_VAh_import,block_energy_Wh_export,block_energy_VAh_export,cons_id,cons_no,
    average_signal_strength&filter={"_and":
    [{"source_timestamp":{"_gt":"${t}"}},{"utility_id":{"_eq":"3"}}]}&sort=source_timestamp&limit=-1    
    `).then(res => res.data.data)
        .catch(err => err.response.data);
};


export const billingPh1 = (t) => {
    return appApi.get(`items/meter_billing_profile_single_phase_new?access_token=1234&fields=meter_serial_number,source_time_stamp,source_time_stamp,average_pf_for_billing,cumulative_energy_kWh_import,cumulative_energy_kVAh_import,
    md_kW,maximum_demand_kW_capture_time,md_kVA,maximum_demand_kVA_capture_time,cons_id,cons_no,total_billing_power_on_duration&filter={"_and":
    [{"source_time_stamp":{"_gt":"${t}"}},{"utility_id":{"_eq":"3"}}]}&sort=source_time_stamp&limit=-1    
    `).then(res => res.data.data)
        .catch(err => err.response.data);
};

export const billingPh3 = (t) => {
    return appApi.get(`items/meter_billing_profile_three_phase?access_token=1234&fields=source_timestamp,
    system_pf_for_billing_period_import,cumulative_energy_Wh_import,cons_id,cons_no,cumulative_energy_VAh_import,md_W_import,maximum_demand_W_capture_time_import,md_VA_import,maximum_demand_VA_capture_time_import,total_billing_power_on_duration,meter_serial_number&filter={"_and":
    [{"source_timestamp":{"_gt":"${t}"}},{"utility_id":{"_eq":"3"}}]}&sort=source_timestamp&limit=-1       
    `).then(res => {
        console.log(res.data);
        return res.data.data;
    })
        .catch(err => err.response.data);
};


export const getDataFromMdms = (t) => {
    return appApi.get(`mdmsquery/items/recharge_history_mdas?access_token=1234&filter={"_and":[{"updated_date_time":{"_gt":"${t}"}},{"created_by":{"_eq":"EPDCL"}}]}&sort=updated_date_time
    `);
};




