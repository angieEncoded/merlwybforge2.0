
const db = require('../../util/database');

// set up the noticeme model
module.exports = class Xivjobs {
    constructor(id, job, role, added_by, added_on, updated_on) {
        this.id = id;
        this.job = job;
        this.role = role;
        this.added_by = added_by;
        this.added_on = added_on;
        this.updated_on = updated_on;
    }

    static fetchNumberOfItems() {
        return db.execute(`select count(*) as count from xiv_jobs`);
    }

    static fetchItem(id) {
        return db.execute('select reply from xiv_jobs where id = ?', [id]);
    }
};
