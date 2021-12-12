import db from "../util/database.js"

export default class Noticeme {
    constructor(id, uuid, reply, added_by, added_on, updated_on, deleted) {
        this.id = id;
        this.uuid = uuid;
        this.reply = reply;
        this.added_by = added_by;
        this.added_on = added_on;
        this.updated_on = updated_on;
        this.deleted = deleted;
    }

    // Enter a new message into the database
    save() {
        return db.execute(`insert into notice_me (uuid, reply, added_by) values(?,?,?)`,
            [
                this.uuid,
                this.reply,
                this.added_by,
            ])
    }


    static fetchNumberOfItems() {
        return db.execute(`select count(*) as count from notice_me`);
    }

    static fetchItem(id) {
        return db.execute('select reply from notice_me where id = ?', [id]);
    }
};

