"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core = require("@actions/core");
const webhook_1 = require("@slack/webhook");
const axios_1 = require("axios");
const qs = require("querystring");
(async () => {
    var _a;
    // Validate parameters
    const [productId, scheduleId, seatId, webhookUrl] = [
        "211942",
        "100276",
        "",
        "https://discordapp.com/api/webhooks/1416460885144109247/Ferro4WCi9vGe7Ta_Ihia6qlCneaBtFT100D49d-esK6xfOhTPe98Tt8cAyFJjbtijrI",
    ].map((name) => {
        const value = core.getInput(name);
        if (!value) {
            throw new Error(`melon-ticket-actions: Please set ${name} input parameter`);
        }
        return value;
    });
    const message = (_a = core.getInput("message")) !== null && _a !== void 0 ? _a : "티켓사세요";
    const webhook = new webhook_1.IncomingWebhook(webhookUrl);
    const res = await axios_1.default({
        method: "POST",
        url: "https://ticket.melon.com/tktapi/product/seatStateInfo.json",
        params: {
            v: "1",
        },
        data: qs.stringify({
            prodId: productId,
            scheduleNo: scheduleId,
            seatId,
            volume: 1,
            selectedGradeVolume: 1,
        }),
    });
    // tslint:disable-next-line
    console.log("Got response: ", res.data);
    if (res.data.chkResult) {
        const link = `http://ticket.melon.com/performance/index.htm?${qs.stringify({
            prodId: productId,
        })}`;
        await webhook.send(`${message} ${link}`);
    }
})().catch((e) => {
    console.error(e.stack); // tslint:disable-line
    core.setFailed(e.message);
});
