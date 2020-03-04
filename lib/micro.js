const vusion = require('vusion-api');
const check = {
    recordSupAppVersion(params) {
        const {
            version,
            assets,
            microAppId,
        } = params;
        if (!version || !assets || !microAppId) {
            console.error('params missing');
            return Promise.reject();
        }
    },
    refreshAppVersion(params) {
        const {
            microId,
            microVersion,
            version,
            microAppId,
        } = params;
        if (!microId || !version || !microVersion || !microAppId) {
            console.error('params missing');
            return Promise.reject();
        }
    },
};
module.exports = {
    recordRefresh(params) {
        const result = check.recordSupAppVersion(params) || check.refreshAppVersion(params);
        if (result) {
            return result;
        }
        return this.recordSupAppVersion(params).then(() => this.refreshAppVersion(params));
    },

    recordSupAppVersion(params) {
        const result = check.recordSupAppVersion(params);
        if (result) {
            return result;
        }
        const {
            version,
            assets,
            microAppId,
            description,
        } = params;
        return vusion.ms.recordMicroAppVersion({
            version,
            assets,
            description,
            microAppId,
        });
    },
    refreshAppVersion(params) {
        const result = check.refreshAppVersion(params);
        if (result) {
            return result;
        }
        const {
            microId,
            microVersion,
            version,
            microAppId,
        } = params;
        return vusion.ms.refreshMicroVersion({
            microId,
            microVersion,
            version,
            microAppId,
        });
    },
};
