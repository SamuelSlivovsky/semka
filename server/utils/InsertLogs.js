const insertLogs = async (body) => {
    const logy = require("../models/log_table");
    (async () => {
        await logy.insertLog(body);
        return 200;
    })().catch((err) => {
        console.log("Error Kontroler");
        console.error(err);
        logy.insertLog({
            ...body,
            description: "Failed to insert log with body:" +
                " " + "IP:" + body.ip + " Status:" + body.status + " Description:" + body.description + " Riadok:" + body.riadok,
            riadok: null,
        });
        return 500;
    });
};
module.exports = {
    insertLogs
};