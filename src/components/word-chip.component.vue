<template>
  <div class="w-full">
    <label class="block text-sm font-semibold text-slate-700 mb-2">Palavras para o desafio</label>
    
    <div class="flex flex-wrap gap-2 w-full rounded-md border border-slate-300 bg-white p-2.5 focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
      <span v-for="(word, i) in store.words" :key="i" 
        class="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-bold text-indigo-700">
        {{ word }}
        <button @click="remove(i)" class="hover:text-red-500"><XMarkIcon class="h-3.5 w-3.5" /></button>
      </span>

      <input
        v-model="input"
        @keydown.enter.prevent="addWord"
        placeholder="Digite e aperte Enter..."
        class="flex-1 min-w-[120px] bg-transparent outline-none text-sm"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { XMarkIcon } from '@heroicons/vue/20/solid';
import { usePuzzleStore } from '@/store/puzzle.store';

const store = usePuzzleStore();
const input = ref('');

function addWord() {
  const normalized = store.normalizeWord(input.value);
  if (normalized && !store.words.includes(normalized)) {
    store.words.push(normalized);
    input.value = '';
  }
}

function remove(i: number) {
  store.words.splice(i, 1);
}
</script>