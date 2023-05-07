import { epdclServer } from '../config/axios';


export const insertInstantaneousEPDCL = (data, t) => {
    console.log("Inside dpdcl method");
    return epdclServer.post(`ibotInstDatas/pusIbotInstDatas`, data, { headers: { 'Authorization': `Bearer ${t}`, } }).then(res => res)
        .catch(err => err.response.data);
};

export const insertBlockEPDCL = (data, t) => {
    return epdclServer.post(`ibotBlockData/pushIbotBlockData`, data, { headers: { 'Authorization': `Bearer ${t}`, } }).then(res => res)
        .catch(err => err.response.data);
};

export const insertBillingEPDCL = (data, t) => {
    return epdclServer.post(`ibotBillingData/pusIbotBillingData`, data, { headers: { 'Authorization': `Bearer ${t}`, } }).then(res => res)
        .catch(err => err.response.data);
};
