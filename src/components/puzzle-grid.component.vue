<template>
  <div class="p-4 sm:p-8 bg-white rounded-xl shadow-sm border border-slate-200">
    <div v-if="!store.isGenerated" class="py-20 text-center border-2 border-dashed border-slate-200 rounded-lg">
      <p class="text-slate-400">Clique em "Gerar" para criar o caça-palavras</p>
    </div>

    <div v-else>
      <div class="mb-8 flex flex-wrap gap-3 justify-center">
        <span v-for="word in store.words" :key="word"
          @click="toggleFound(word)"
          :class="[
            'px-4 py-1.5 rounded-full border-2 text-sm font-bold cursor-pointer transition-all',
            foundWords.has(word) ? 'bg-green-500 border-green-500 text-white line-through opacity-50' : 'border-slate-200 text-slate-600 hover:border-indigo-400'
          ]">
          {{ word }}
        </span>
      </div>

      <div class="grid gap-0 mx-auto border-2 border-slate-900 w-fit"
          :style="{ gridTemplateColumns: `repeat(${store.size}, minmax(0, 1fr))` }">
            <template v-for="(row, r) in store.grid" :key="r">
              <div 
                v-for="(cell, c) in row" 
                :key="`${r}-${c}`"
                :class="[
                  'w-7 h-7 sm:w-10 sm:h-10 flex items-center justify-center border-[0.5px] border-slate-200 font-mono font-bold uppercase select-none transition-all duration-300',
                  // Lógica do Gabarito:
                  store.showSolution && store.isCellPartOfWord(r, c) 
                    ? 'bg-indigo-600 text-white border-indigo-700 z-10 scale-110 shadow-md' 
                    : 'bg-white text-slate-800'
                ]"
              >
                {{ cell }}
              </div>
            </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePuzzleStore } from '@/store/puzzle.store';
import { ref, watch } from 'vue';

const store = usePuzzleStore();
const foundWords = ref(new Set<string>());

const toggleFound = (word: string) => {
  if (foundWords.value.has(word)) foundWords.value.delete(word);
  else foundWords.value.add(word);
};

// Limpa o progresso se o grid mudar
watch(() => store.grid, () => foundWords.value.clear());
</script>