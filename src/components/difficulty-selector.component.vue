<template>
    <div>
        <Listbox v-model="selectedDifficulty">
            <ListboxLabel class="block text-sm font-semibold text-slate-700 mb-2">
                Grau de Dificuldade
            </ListboxLabel>
            <div class="relative">
                <ListboxButton
                    class="relative w-full cursor-default rounded-md bg-white py-2 pl-3 pr-10 text-left border border-slate-300 shadow-sm focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-300 sm:text-sm"
                >
                    <span class="block truncate">{{ selectedOptionObject?.label }}</span>
                    
                    <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronUpDownIcon
                        class="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                    />
                    </span>
                </ListboxButton>

                <transition
                    leave-active-class="transition duration-100 ease-in"
                    leave-from-class="opacity-100"
                    leave-to-class="opacity-0"
                >
                    <ListboxOptions
                    class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10"
                    >
                    <ListboxOption
                        v-for="option in difficultyOptions"
                        :key="option.value"
                        :value="option.value"
                        v-slot="{ active, selected }"
                        as="template"
                    >
                        <li
                        :class="[
                            active ? 'bg-indigo-100 text-indigo-900' : 'text-slate-900',
                            'relative cursor-default select-none py-2 pl-10 pr-4',
                        ]"
                        >
                        <span
                            :class="[
                            selected ? 'font-medium' : 'font-normal',
                            'block truncate',
                            ]"
                        >
                            {{ option.label }}
                        </span>
                        
                        <span
                            :class="[
                            active ? 'text-indigo-700' : 'text-slate-500',
                            'block text-xs mt-0.5',
                            ]"
                        >
                            {{ option.description }}
                        </span>

                        <span
                            v-if="selected"
                            class="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-600"
                        >
                            <CheckIcon class="h-5 w-5" aria-hidden="true" />
                        </span>
                        </li>
                    </ListboxOption>
                    </ListboxOptions>
                </transition>
            </div>
        </Listbox>
    </div>
</template>

<script setup lang="ts">
import { usePuzzleStore, type Difficulty } from '@/store/puzzle.store'
import {
  Listbox,
  ListboxButton,
  ListboxLabel, // Importamos o Label
  ListboxOption,
  ListboxOptions,
} from '@headlessui/vue'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/20/solid' // Importamos os ícones
import { computed } from 'vue' // Importamos 'computed'

const store = usePuzzleStore()

const difficultyOptions = [
  {
    value: 'easy',
    label: 'Fácil',
    description: 'Palavras na horizontal e vertical.',
  },
  {
    value: 'medium',
    label: 'Médio',
    description: 'Inclui palavras na diagonal.',
  },
  {
    value: 'hard',
    label: 'Difícil',
    description: 'Inclui palavras invertidas e na diagonal.',
  },
]

const selectedDifficulty = computed({
  get: () => store.difficulty,
  set: (value: Difficulty) => {
    store.difficulty = value
  },
})

const selectedOptionObject = computed(() => {
  return difficultyOptions.find(
    (opt) => opt.value === selectedDifficulty.value
  )
})
</script>