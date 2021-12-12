import db from "../util/database.js"

export default class Reaction {
    constructor(id, uuid, guild_id, reaction_message, emoji, emoji_id, role, added_by, added_on, updated_on, modified_by, deleted) {
        this.id = id;
        this.uuid = uuid;
        this.guild_id = guild_id;
        this.reaction_message = reaction_message
        this.emoji = emoji;
        this.emoji_id = emoji_id;
        this.role = role;
        this.added_by = added_by;
        this.added_on = added_on;
        this.updated_on = updated_on;
        this.modified_by = modified_by;
        this.deleted = deleted;
    }

    // Enter a new message into the database
    save() {
        return db.execute(`insert into reactions (uuid, guild_id, reaction_message, emoji, emoji_id, role, added_by, modified_by) values (?,?,?,?,?,?,?,?)`,
            [
                this.uuid,
                this.guild_id,
                this.reaction_message,
                this.emoji,
                this.emoji_id,
                this.role,
                this.added_by,
                this.modified_by
            ])
    }

    // update() {
    //     return db.execute(`update reactions set something = ? where something = ?`, [])
    // }

    static fetchReactionByName(emoji, guildId) {
        return db.execute(`select * from reactions where emoji = ? and guild_id = ?`, [emoji, guildId])
    }

    static fetchRoleByRoleId(role, guildId) {
        return db.execute(`select * from reactions where role = ? and guild_id = ?`, [role, guildId])
    }

    static fetchRoleByGuildIdAndReaction(guildId, reaction) {
        return db.execute(`select * from reactions where guild_id = ? and emoji_id = ?`, [guildId, reaction])
    }

    static fetchAllReactionsForMessage(messageId) {
        return db.execute(`select * from reactions where reaction_message = ?`, [messageId])
    }

    static fetchNumberOfItems(messageId) {
        return db.execute(`select count(*) as count from reactions where reaction_message = ?`, [messageId]);
    }

    static fetchItem(id) {
        return db.execute('select type, activity from bot_status where id = ?', [id]);
    }

    static deleteById(id) {
        return db.execute(`delete from reactions where id = ?`, [id])
    }



};



