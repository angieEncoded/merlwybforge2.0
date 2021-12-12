import BotStatus from "../models/BotStatus.js"
import logger from "../util/logging.js"

const ready = {
    name: 'ready',
    once: true,
    async execute(client) {

        // Set an initial status when she comes online
        const [rows] = await BotStatus.fetchNumberOfItems()
        const count = rows[0].count
        const [item] = await BotStatus.fetchItem(Math.floor(Math.random() * count) + 1);
        client.user.setActivity(item[0].activity, { type: item[0].type });

        // Set a status to change every hour
        try {
            setInterval(async () => {
                const [rows] = await BotStatus.fetchNumberOfItems()
                const count = rows[0].count
                const [item] = await BotStatus.fetchItem(Math.floor(Math.random() * count) + 1);
                client.user.setActivity(item[0].activity, { type: item[0].type });
            }, 3600000); // 1 hr in milliseconds = 3600000

        } catch (error) {
            logger.log({ level: 'error', message: error });
        }
        logger.log("info", `Merlwyb has come online and is logged in as ${client.user.tag}`)
        console.log(`Merlwyb has come online and is logged in as ${client.user.tag}`)

    },
};

export default ready

