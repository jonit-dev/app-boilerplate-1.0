"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const expo_server_sdk_1 = __importDefault(require("expo-server-sdk"));
class PushNotificationHelper {
    static sendPush(pushTokens, customMessage) {
        const expo = new expo_server_sdk_1.default();
        const messages = [];
        for (const pushToken of pushTokens) {
            // Check that all your push tokens appear to be valid Expo push tokens
            if (!expo_server_sdk_1.default.isExpoPushToken(pushToken)) {
                console.error(`Push token ${pushToken} is not a valid Expo push token`);
                continue;
            }
            // Construct a message (see https://docs.expo.io/versions/latest/guides/push-notifications.html)
            messages.push(Object.assign({ to: pushToken }, customMessage));
        }
        // The Expo push notification service accepts batches of notifications so
        // that you don't need to send 1000 requests to send 1000 notifications. We
        // recommend you batch your notifications to reduce the number of requests
        // and to compress them (notifications with similar content will get
        // compressed).
        const chunks = expo.chunkPushNotifications(messages);
        const tickets = [];
        (() => __awaiter(this, void 0, void 0, function* () {
            // Send the chunks to the Expo push notification service. There are
            // different strategies you could use. A simple one is to send one chunk at a
            // time, which nicely spreads the load out over time:
            for (const chunk of chunks) {
                try {
                    const ticketChunk = yield expo.sendPushNotificationsAsync(chunk);
                    console.log(ticketChunk);
                    // @ts-ignore
                    tickets.push(...ticketChunk);
                    // NOTE: If a ticket contains an error code in ticket.details.error, you
                    // must handle it appropriately. The error codes are listed in the Expo
                    // documentation:
                    // https://docs.expo.io/versions/latest/guides/push-notifications#response-format
                }
                catch (error) {
                    console.error(error);
                }
            }
        }))();
        // Later, after the Expo push notification service has delivered the
        // notifications to Apple or Google (usually quickly, but allow the the service
        // up to 30 minutes when under load), a "receipt" for each notification is
        // created. The receipts will be available for at least a day; stale receipts
        // are deleted.
        //
        // The ID of each receipt is sent back in the response "ticket" for each
        // notification. In summary, sending a notification produces a ticket, which
        // contains a receipt ID you later use to get the receipt.
        //
        // The receipts may contain error codes to which you must respond. In
        // particular, Apple or Google may block apps that continue to send
        // notifications to devices that have blocked notifications or have uninstalled
        // your app. Expo does not control this policy and sends back the feedback from
        // Apple and Google so you can handle it appropriately.
        const receiptIds = [];
        for (const ticket of tickets) {
            // NOTE: Not all tickets have IDs; for example, tickets for notifications
            // that could not be enqueued will have error information and no receipt ID.
            // @ts-ignore
            if (ticket.id) {
                // @ts-ignore
                receiptIds.push(ticket.id);
            }
        }
        const receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
        (() => __awaiter(this, void 0, void 0, function* () {
            // Like sending notifications, there are different strategies you could use
            // to retrieve batches of receipts from the Expo service.
            for (const chunk of receiptIdChunks) {
                try {
                    const receipts = yield expo.getPushNotificationReceiptsAsync(chunk);
                    console.log(receipts);
                    // The receipts specify whether Apple or Google successfully received the
                    // notification and information about an error, if one occurred.
                    // @ts-ignore
                    for (const receipt of receipts) {
                        if (receipt.status === "ok") {
                            continue;
                        }
                        else if (receipt.status === "error") {
                            console.error(`There was an error sending a notification: ${receipt.message}`);
                            if (receipt.details && receipt.details.error) {
                                // The error codes are listed in the Expo documentation:
                                // https://docs.expo.io/versions/latest/guides/push-notifications#response-format
                                // You must handle the errors appropriately.
                                console.error(`The error code is ${receipt.details.error}`);
                            }
                        }
                    }
                }
                catch (error) {
                    console.error(error);
                }
            }
        }))();
    }
}
exports.PushNotificationHelper = PushNotificationHelper;
