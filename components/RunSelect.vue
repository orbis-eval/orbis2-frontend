<template>
  <Listbox as="div" v-model="selected">
    <div class="relative mt-1">
      <ListboxButton
          class="
          relative
          w-full
          cursor-default
          rounded-md
          border
          py-2
          pl-3
          pr-10
          text-left
          shadow-sm
          focus:border-indigo-500
          focus:outline-none
          focus:ring-1
          focus:ring-indigo-500
          sm:text-sm">
        <span class="flex items-center">
          <PlayIcon class="h-6 w-6 flex-shrink-0 rounded-full" />
          <span class="ml-3 block truncate">{{ selected.name }}</span>
        </span>
        <span class="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
          <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
        </span>
      </ListboxButton>
      <transition leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100" leave-to-class="opacity-0">
        <ListboxOptions class="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          <ListboxOption as="template" v-for="run in props.runs" :key="run.id" :value="run" v-slot="{ active, selected }" @click="selectRun(run)">
            <li :class="[active ? 'text-white bg-indigo-600' : 'text-gray-900', 'relative cursor-default select-none py-2 pl-3 pr-9']">
              <div class="flex items-center">
                <PlayIcon class="h-6 w-6 flex-shrink-0 rounded-full" />
                <span :class="[selected ? 'font-semibold' : 'font-normal', 'ml-3 block truncate']">{{ run.name }}</span>
              </div>
              <span v-if="selected" :class="[active ? 'text-white' : 'text-indigo-600', 'absolute inset-y-0 right-0 flex items-center pr-4']">
                <CheckIcon class="h-5 w-5" aria-hidden="true" />
              </span>
            </li>
          </ListboxOption>
        </ListboxOptions>
      </transition>
    </div>
  </Listbox>
</template>

<script setup>
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/vue'
import { CheckIcon, ChevronUpDownIcon, PlayIcon } from '@heroicons/vue/20/solid'


const props = defineProps(
    {
      runs: {
        type: Array,
        default: []
      }
    }
)

const emit = defineEmits(['runSelect'])

const selected = ref(props.runs[0])

const selectRun = (selectedRun) => {
  selected.value = selectedRun
  emit('runSelect', selectedRun)
}



</script>
