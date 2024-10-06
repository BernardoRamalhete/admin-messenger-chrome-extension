<template>
    <ul
        v-if="messages.length > 0"
        class="flex flex-col gap-[1px] w-full h-full overflow-y-auto grow"
    >
        <li
            v-for="message in messages"
            data-cy="message"
            :key="message.id"
            class="flex justify-between gap-4 px-4 py-2 border-b border-b-slate-500 border-b-solid last-of-type:border-b-0"
            :class="{
                'bg-slate-500': !message.read
            }"
        >
            <div class="flex flex-col gap-1">
                <p
                    data-cy="message-content"
                    class="text-lg"
                >
                    {{ message.content }}
                </p>
                <time :datetime="message.timestamp">{{ timeAgo(new Date(message.timestamp)) }}</time>
            </div>
            <div class="flex flex-col justify-between items-center">
                <span
                    data-cy="message-prio"
                    class="place-items-center border-slate-300 grid px-2 py-1 border border-solid rounded text-slate-300"
                >
                    {{ message.priority }}
                </span>
                <button
                    @click="markAsRead(message.id)"
                    class="hover:opacity-60 transition-opacity"
                    data-cy="read-btn"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                    >
                        <path
                            fill="currentColor"
                            d="M12 19a6.995 6.995 0 0 1 10-6.32V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h8.08c-.05-.33-.08-.66-.08-1M4 6l8 5l8-5v2l-8 5l-8-5zm13.34 16l-3.54-3.54l1.41-1.41l2.12 2.12l4.24-4.24L23 16.34z"
                        />
                    </svg>
                </button>
            </div>
        </li>
    </ul>
    <div
        v-else
        class="place-items-center grid w-full h-full grow"
    >
        <h1 class="text-xl">No messages at the moment</h1>
        <p v-if="hasFilterApplied">You can try to remove all filters</p>
    </div>
</template>

<script setup lang="ts">
import { toRefs } from 'vue'
import Message from '../types/Message'

const props = defineProps({
    messages: {
        type: Array<Message>,
        required: true
    },
    hasFilterApplied: {
        type: Boolean,
        default: false
    }
})

const emits = defineEmits(['action:read'])

function timeAgo(date: Date) {

    const time = date.getTime()

    type TimeFormat = [number, string] | [number, string, number]
    const timeFormats: TimeFormat[] = [
        [120, '1 minute ago'], // 60*2
        [3600, 'minutes', 60], // 60*60, 60
        [7200, '1 hour ago'], // 60*60*2
        [86400, 'hours', 3600], // 60*60*24, 60*60
        [172800, 'Yesterday'], // 60*60*24*2
        [604800, 'days', 86400], // 60*60*24*7, 60*60*24
        [1209600, 'Last week'], // 60*60*24*7*4*2
        [2419200, 'weeks', 604800], // 60*60*24*7*4, 60*60*24*7
        [4838400, 'Last month'], // 60*60*24*7*4*2
        [29030400, 'months', 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
        [58060800, 'Last year'], // 60*60*24*7*4*12*2
        [2903040000, 'years', 29030400], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
        [5806080000, 'Last century'], // 60*60*24*7*4*12*100*2
        [58060800000, 'centuries', 2903040000] // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
    ]

    const seconds = (new Date().getTime() - time) / 1000

    if (seconds < 60) return 'Just now'

    let i = 0
    let format: TimeFormat | undefined;
    while (format = timeFormats[i++])
        if (seconds < format[0]) {
            if (format[2] == null)
                return format[1];
            else
                return `${Math.floor(seconds / format[2])} ${format[1]} ago`;
        }

    return time
}

function markAsRead(messageId: string) {
    emits('action:read', messageId)
}
</script>