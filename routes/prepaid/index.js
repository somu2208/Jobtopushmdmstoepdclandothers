import {appApi, updateApi} from '../../config/axios';


export const get_recharge_history_mdms = (router, payload) => {
    return appApi.get(router, { ...payload })
        .then(res => {
            return res.data.data;
        })
        .catch(err => console.log(err));
};

export const update_recharge_sync_date = (router, payload) => {
    return updateApi.post(router, { ...payload.data }, { params: { ...payload.params } })
        .then(res => {
            return res.data.data;
        })
        .catch(err => console.log(err));
};

