import Message from "./types/Message";
import getStorageMessages from "./helpers/getStorageMessages";

let notificationAmount = 0;

chrome.runtime.onStartup.addListener(startup);
chrome.runtime.onInstalled.addListener(startup);

async function startup() {
    //Create API pooling to fetch messages
    chrome.alarms.create("pollMsgs", { periodInMinutes: 0.5 });

    //Update notifications for unread messages
    const oldMsgs = await getStorageMessages()
    notificationAmount = 0;
    const unreadMsgs = oldMsgs.filter((msg) => !msg.read);
    updateNotificationBadge(unreadMsgs.length);
}

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "pollMsgs") {
        fetchMsgs();
    }
});

chrome.runtime.onMessage.addListener((message) => {
    switch (message.type) {
        case "RETRY":
            fetchMsgs();
            break;
        case "READ":
            const id = <string>message.payload;
            markAsRead(id);
            break;
        case "CLEAR":
            clearStorage();
    }
});

async function clearStorage() {
    await chrome.storage.local.clear();

    chrome.runtime.sendMessage({
        type: "MESSAGES",
        payload: [],
    });

    updateNotificationBadge(-1 * notificationAmount);
}

// Mock call to API
async function fetchMsgs() {
    const oldMsgs = await getStorageMessages();

    chrome.runtime.sendMessage({
        type: "LOADING",
    });
    // Get messages from API, filtering out old messages
    try {
        const newMsgs: Message[] = await mockFetch();

        const allMgs = [...newMsgs, ...oldMsgs];

        // Save messages to chrome storage
        await chrome.storage.local.set({ messages: allMgs });

        // Send messages to Vue app
        chrome.runtime.sendMessage({
            type: "MESSAGES",
            payload: allMgs,
        });

        updateNotificationBadge(newMsgs.length);
    } catch (error) {
        const err = <Error>error;
        chrome.runtime.sendMessage({
            type: "ERROR",
            payload: typeof error === "string" ? error : err.message,
        });
    }
}

// Updates badge counter
function updateNotificationBadge(newMgsQty: number) {
    notificationAmount += newMgsQty;

    const notificationText =
        notificationAmount <= 0 ? "" : String(notificationAmount);

    chrome.action.setBadgeText({ text: notificationText });
}

// Mark a message as read
async function markAsRead(messageId: string) {
    const msgs = await getStorageMessages();
    for (let i = 0; i < msgs.length; i++) {
        const msg = msgs[i];
        if (msg.id === messageId) {
            if (!msg.read) updateNotificationBadge(-1);
            msgs[i].read = true;
            break;
        }
    }

    await chrome.storage.local.set({ messages: msgs });
}

// Mock fetch behavior with  50% of chance of error
async function mockFetch(): Promise<Message[]> {
    return new Promise(function (resolve, reject) {
        const randomNumber = Math.ceil(Math.random() * 100000);
        if (randomNumber % 2 === 0) {
            setTimeout(() => reject("Could not fetch messages"), 2000);
            return;
        }

        setTimeout(
            () =>
                resolve([
                    {
                        id: `msg${randomNumber}`,
                        content:
                            "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                        priority: randomNumber % 3 === 0 ? "high" : "normal",
                        timestamp: new Date().toISOString(),
                        read: false,
                    },
                ]),
            3000
        );
    });
}
