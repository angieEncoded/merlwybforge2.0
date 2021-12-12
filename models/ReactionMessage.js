import db from "../util/database.js"

export default class ReactionMessage {
    constructor(id, uuid, title, message_id, channel_id, guild_id, asking_channel, notes, deployed, added_by, modified_by, added_on, updated_on, deleted) {
        this.id = id;
        this.uuid = uuid;
        this.title = title;
        this.message_id = message_id;
        this.channel_id = channel_id;
        this.guild_id = guild_id;
        this.asking_channel = asking_channel;
        this.notes = notes;
        this.deployed = deployed;
        this.added_by = added_by;
        this.modified_by = modified_by;
        this.added_on = added_on;
        this.updated_on = updated_on;
        this.deleted = deleted;
    }

    // Enter a new message into the database
    save() {
        return db.execute(`insert into reaction_messages (uuid, title, channel_id, message_id, guild_id, asking_channel, notes, added_by, modified_by) values(?,?,?,?,?,?,?,?,?)`,
            [
                this.uuid,
                this.title,
                this.channel_id,
                this.message_id,
                this.guild_id,
                this.asking_channel,
                this.notes,
                this.added_by,
                this.modified_by
            ])
    }

    update() {
        return db.execute(`update reaction_messages set something = ? where something = ?`, [])
    }

    static fetchNumberOfItems() {
        return db.execute(`select count(*) as count from bot_status`);
    }

    static fetchMessage(messageId) {
        return db.execute(`select * from reaction_messages where message_id = ? `, [messageId])
    }

    static deleteMessageById(messageId) {
        return db.execute("delete from reaction_messages where message_id = ?", [messageId])
    }

    static fetchNotesById(messageId) {
        return db.execute("select notes from reaction_messages where message_id = ?", [messageId])
    }

};



