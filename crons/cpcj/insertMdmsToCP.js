
import { getRechargeSyncTime } from '../../services/cp.directus-api';
import { getDataFromMdms } from '../../services/ibotapp.azure-api';
import { patchWithRechargeId, updateLatestDateTime } from '../../services/cp.directus-api';
import { istDate } from '../../utils/index';
export const insertMdmsToCP = async () => {
    try {
        let time = null;
        await getRechargeSyncTime({ filter: { "object": { "_eq": "recharge_history_mdas" } } }).then(res => {
            time = res?.latest_date_time;
            console.log(time);
        });
        await getDataFromMdms(time).then(res => {
            const data = res?.data?.data;
            const allItems = data.map((v, i) => {
                return {
                    recharge_id: v.recharge_id,
                    status: v.mde_status || v.status,
                    status_updated_time: istDate(v.updated_date_time),
                };
            });
            console.log(allItems);
            callApi(0, allItems, patchWithRechargeId, 8);
        });
    } catch (err) {
        console.error(err.message);
    }


};


const callApi = (int, p = [], insertFn, phase, cb = Function) => {
    const recharge_id = p[int]?.recharge_id;
    const status_updated_time = p[int]?.status_updated_time;
    delete p[int]?.recharge_id;
    if (int >= 0 && p.length > int) {
        insertFn(p[int], recharge_id).then(async res => {
            try {

                callApi((int + 1), p, insertFn, phase, cb);
                await updateLatestDateTime(phase, status_updated_time);
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