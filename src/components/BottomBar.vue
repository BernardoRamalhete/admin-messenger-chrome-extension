<template>
    <aside class="flex justify-between items-center gap-4 px-4 py-2 w-full">
        <div class="flex items-center gap-4">
            <button @click="clearMessages" class="hover:opacity-60 transition-opacity" data-cy="clear-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><path fill="currentColor" d="M18.3 5.71a.996.996 0 0 0-1.41 0L12 10.59L7.11 5.7A.996.996 0 1 0 5.7 7.11L10.59 12L5.7 16.89a.996.996 0 1 0 1.41 1.41L12 13.41l4.89 4.89a.996.996 0 1 0 1.41-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4"/></svg>
            </button>
            <button @click="tryAgain" class="hover:opacity-60 transition-opacity" data-cy="reload-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><path fill="currentColor" d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4z"/></svg>
            </button>
            <p v-if="hasError" class="text-base">
                {{ errorMsg }}
            </p>
        </div>
        <LoadingSpinner v-if="isLoading"/>
    </aside>
</template>

<script setup lang="ts">
import LoadingSpinner from './LoadingSpinner.vue'

const props = defineProps({
    hasError: {
        type: Boolean,
        default: false
    },
    errorMsg: {
        type: String,
        default: ''
    },
    isLoading: {
        type: Boolean,
        default: false
    }
})

function tryAgain() {
    chrome.runtime.sendMessage({
        type: 'RETRY'
    })
}

function clearMessages() {
    chrome.runtime.sendMessage({
        type: 'CLEAR'
    })
}
</script>

<style scoped>

</style>