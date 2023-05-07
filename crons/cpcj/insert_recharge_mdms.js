import { cpApi, appApi } from "../../config/axios";
import { CP_ENDPOINTS } from '../../constants/CP_ENDPOINTS';
import { reduceHoursMins, replaceTnZfromDate } from '../../utils/index';

const getRechargeSyncTime = () => {
    return cpApi.get(CP_ENDPOINTS.requests_sync, {
        params: {
            filter: '{"object":{"_eq":"requests"}}'
        }
    }).then(res => res[0])
        .catch(err => err.response.data);
};

const getDateFromCPTblRequests = async () => {
    try {
        const latestDateTime = await getRechargeSyncTime().then(res => res.latest_date_time).catch(err => null);
        if (latestDateTime) {
            return cpApi.get(CP_ENDPOINTS.requests, {
                params: {
                    filter: `{"created_date_time":{"_gt":"${latestDateTime}"}}`
                }
            });
        } else {
            console.warn('Failed to all API, No latest date time');
        }
    } catch (err) {
        console.error(err.message);
    }
};

export const pushRequestsFromCpToMdms = async () => {
    try {
        const records = await getDateFromCPTblRequests().then(res => res).catch(err => console.error(err));
        let latestTime = null;
        const data = records && records.map(v => {
            let read_write_param_id = null;
            switch (v.action) {
                case 'Recharge':
                    read_write_param_id = 41;
                    break;
                case 'Connect':
                    read_write_param_id = 16;
                    break;
                case 'Disconnect':
                    read_write_param_id = 49;
                    break;
                default:
                    read_write_param_id = null;
                // code block
            }
            if (!latestTime) {
                latestTime = v.created_date_time;
            } else {
                if (new Date(latestTime).getTime() < new Date(v.created_date_time).getTime()) {
                    latestTime = v.created_date_time;
                }
            }
            return {
                "recharge_id": v.id,
                "customer_service_number": v.customer_service_number,
                "account_number": v.customer_service_number,
                "recharge_amount": v.recharge_amount,
                "date_time": reduceHoursMins(v.created_date_time, 5, 30),
                "created_by": v.user_name,
                "status": "Open",
                "meter_serial_number": v.meter_serial_number,
                "utility_id": "3",
                "read_write_param_id": read_write_param_id

            };
        });
        insertDataIntoTBL(data, latestTime);

        // updateLatestDateTime(latestTime);
    } catch (err) {
        console.error(err.message);
    }

};

const insertDataIntoTBL = (data, latestTime) => {
    data && appApi.post('/mdmsquery/items/recharge_history_mdms', data, {
        params: {
            access_token: '1234'
        }
    }).then(res => {
        updateLatestDateTime(latestTime);
    }).catch(err => console.log(err.response.data));
};

const updateLatestDateTime = (d) => {
    d && cpApi.patch('requests_sync/1', {
        "latest_date_time": d
    }, {
        params: {}
    }).then(res => {
    }).catch(err => console.log(err.response.data, '====ERROR====='));
};
