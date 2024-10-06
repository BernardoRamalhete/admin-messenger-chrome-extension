<template>
    <label class="inline-flex items-center cursor-pointer">
        <input
            :data-cy="dataCy"
            type="checkbox"
            :checked="checked"
            class="peer sr-only"
            @change="(evt: Event) => emits('action:change', evt)"
        />
        <div
            class="relative after:top-[2px] after:absolute after:content-[''] after:border-slate-300 peer-checked:after:border-slate-500 bg-slate-500 after:bg-white peer-checked:after:bg-slate-500 peer-checked:bg-slate-300 after:border rounded-full after:rounded-full w-11 after:w-5 h-6 after:h-5 after:transition-all peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer after:start-[2px]"
        ></div>
        <span class="font-medium text-sm ms-3">{{ labelText }}</span>
    </label>
</template>

<script setup lang="ts">
const props = defineProps({
    dataCy: {
        type: String,
        required: true,
    },
    labelText: {
        type: String,
        required: true,
    },
    checked: {
        type: Boolean,
        default: false,
    },
});
const emits = defineEmits(["action:change"]);
</script>

<style scoped></style>
