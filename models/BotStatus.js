import db from "../util/database.js"

export default class BotStatus {
    constructor(id, uuid, type, activity, added_by, added_on, updated_on, deleted) {
        this.id = id;
        this.uuid = uuid;
        this.type = type;
        this.activity = activity;
        this.added_by = added_by;
        this.added_on = added_on;
        this.updated_on = updated_on;
        this.deleted = deleted;
    }

    // Enter a new message into the database
    save() {
        return db.execute(`insert into bot_status (uuid, type, activity, added_by) values(?,?,?,?)`,
            [
                this.uuid,
                this.type,
                this.activity,
                this.added_by,
            ])
    }

    update() {
        return db.execute(`update bot_status set uuid = ? where id = ?`, [this.uuid, this.id])
    }


    static fetchNumberOfItems() {
        return db.execute(`select count(*) as count from bot_status`);
    }

    static fetchItem(id) {
        return db.execute('select type, activity  from bot_status where id = ?', [id]);
    }
};
