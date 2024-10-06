<template>
    <aside class="px-4 py-2 w-full">
        <ul class="flex items-center">
            <li>
                <ToggleSwitch
                    data-cy="prio-filter"
                    :checked="filters.priority"
                    @action:change="(evt: Event) => emitFilter(evt, 'priority')"
                    label-text="High Priority Only"
                />
            </li>
            <li class="ml-4 pl-4 border-l border-l-slate-300 border-l-solid">
                <ToggleSwitch
                    data-cy="read-filter"
                    :checked="filters.unread"
                    @action:change="(evt: Event) => emitFilter(evt, 'unread')"
                    label-text="Unread Only"
                />
            </li>
        </ul>
    </aside>
</template>

<script setup lang="ts">
import { ref, reactive, onBeforeMount } from 'vue'
import ToggleSwitch from './ToggleSwitch.vue'

const emits = defineEmits(['toggle:priority-filter', 'toggle:unread-filter'])

const filters = reactive({
    priority: false,
    unread: false
})

onBeforeMount(async () => {
    const storage = await chrome.storage.local.get('filters') ?? {}
    console.log(storage)
    filters.priority = <boolean>storage.filters.priority ?? false
    filters.unread = <boolean>storage.filters.unread ?? false
    emits('toggle:priority-filter', filters.priority)
    emits('toggle:unread-filter', filters.unread)
})

function emitFilter(evt: Event, filter: 'priority' | 'unread') {
    const target = <HTMLInputElement | undefined>evt.target
    if (!target) return
    const checked = target.checked

    emits(`toggle:${filter}-filter`, checked)
}
</script>

<style scoped></style>