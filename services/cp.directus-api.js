
import { cpApi } from "../config/axios";
import { CP_ENDPOINTS } from '../constants/CP_ENDPOINTS';

export const getRechargeSyncTime = (params) => {
    return cpApi.get(CP_ENDPOINTS.requests_sync, {
        params: { ...params }
    }).then(res => res[0])
        .catch(err => console.log(err.response));
};

export const updateLatestDateTime = (id = 1, d) => {
    console.log(id, d);
    return d && cpApi.patch(`requests_sync/${id}`, {
        "latest_date_time": d
    }, {
        params: {}
    }).then(res => {
    }).catch(err => console.log(err.response.data, '====ERROR====='));
};
export const insertInstantaneousData = (data, config = { params: {} }) => {
    return cpApi.post('instantaneous_data', data, config).then(res => res)
        .catch(err => console.log(err.response.data));
};

export const insertBlockData = (data, config = { params: {} }) => {
    return cpApi.post('blockload_data', data, config).then(res => res)
        .catch(err => console.log(err.response.data));
};

export const insertBillingData = (data, config = { params: {} }) => {
    return cpApi.post('billing_data', data, config).then(res => res)
        .catch(err => console.log(err.response.data));
};


export const getInstantaneousData = (query, config = { params: {} }) => {
    return cpApi.get(`instantaneous_data?${query}`, config);
};

export const getBlockLoadData = (query, config = { params: {} }) => {
    return cpApi.get(`blockload_data?${query}`, config);
};

export const getBillingData = (query, config = { params: {} }) => {
    return cpApi.get(`billing_data?${query}`, config);
};

export const patchWithRechargeId = (data, id, config = { params: {} }) => {
    return cpApi.patch(`requests/${id}`, data, config);
};