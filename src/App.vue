<template>
    <div class="relative flex flex-col bg-slate-700 w-96 h-96 text-slate-200">
        <TopBar
            @toggle:priority-filter="getPriorityFilter"
            @toggle:unread-filter="getUnreadFilter"
        />
        <MessageList
            :messages="filteredMessages"
            :has-filter-applied="onlyHighPriority || onlyUnread"
            @action:read="markAsRead"
        />
        <BottomBar
            :has-error="hasError"
            :is-loading="isLoading"
            :error-msg="errorMessage"
        />
    </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeMount, ref, computed } from "vue";
import type { Ref } from "vue";
import Message from "./types/Message";
import getStorageMessages from "./helpers/getStorageMessages";
import MessageList from "./components/MessageList.vue";
import BottomBar from "./components/BottomBar.vue";
import TopBar from "./components/TopBar.vue";

const messages: Ref<Message[]> = ref([]);
const hasError = ref(false);
const isLoading = ref(false);
const errorMessage = ref("");

onBeforeMount(async () => {
    messages.value = await getStorageMessages();
});

onMounted(() => {
    // Handle chrome messages
    chrome.runtime.onMessage.addListener((message) => {
        switch (message.type) {
            case "MESSAGES":
                // Get messages from background
                hasError.value = false;
                isLoading.value = false;
                const parsedPayload = <Message[]>message.payload;
                setMessages(parsedPayload);
                break;
            case "ERROR":
                // Set error state
                hasError.value = true;
                isLoading.value = false;
                errorMessage.value = message.payload;
                break;
            case "LOADING":
                // Set loading state
                isLoading.value = true;
                break;
        }
    });
});

function setMessages(payload: Message[]) {
    messages.value = payload;
}

function markAsRead(messageId: string) {
    messages.value = messages.value.map((msg) => {
        if (msg.id === messageId) msg.read = true;
        return msg;
    });
    chrome.runtime.sendMessage({
        type: "READ",
        payload: messageId,
    });
}

const onlyHighPriority = ref(false);
function getPriorityFilter(value: boolean) {
    updateStorageFilters({ priority: value, unread: onlyUnread.value });
    onlyHighPriority.value = value;
}

const onlyUnread = ref(false);
function getUnreadFilter(value: boolean) {
    updateStorageFilters({ priority: onlyHighPriority.value, unread: value });
    onlyUnread.value = value;
}

async function updateStorageFilters(value: {
    priority: boolean;
    unread: boolean;
}) {
    await chrome.storage.local.set({ filters: value });
}

const filteredMessages = computed(() => {
    let result = messages.value;
    if (onlyHighPriority.value)
        result = messages.value.filter((msg) => msg.priority === "high");
    if (onlyUnread.value) result = messages.value.filter((msg) => !msg.read);

    return result;
});
</script>

<style></style>
