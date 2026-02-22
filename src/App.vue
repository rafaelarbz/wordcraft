<template>
  <div class="min-h-screen bg-slate-50 flex flex-col font-inter selection:bg-indigo-100">
    
    <div class="w-full max-w-6xl mx-auto flex-grow px-4 sm:px-6 lg:px-8">
      <header role="banner" class="flex items-center gap-4 py-8 border-b border-slate-200">
        <div class="bg-indigo-600 p-2 rounded-lg shadow-indigo-200" aria-hidden="true">
          <img 
            src="/favicon.svg" 
            alt="Wordcraft Logo" 
            class="h-8 w-8" 
          />
        </div>
        <div>
          <h1 class="text-2xl font-black text-slate-900 tracking-tight">Wordcraft</h1>
          <p class="text-sm text-slate-500 font-medium italic">
            Gerador profissional de caça-palavras personalizado.
          </p>
        </div>
      </header>

      <main class="grid grid-cols-1 lg:grid-cols-3 gap-8 py-8">
        
        <aside class="lg:col-span-1 space-y-6">
          <h2 class="sr-only">Configurações do Jogo</h2>
          
          <section class="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
            <label for="title" class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Título do Projeto
            </label>
            <input
              id="title"
              v-model="store.title"
              type="text"
              placeholder="Ex: Frutas Tropicais"
              class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 transition-all outline-none text-slate-700"
            />
          </section>

          <section class="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
            <DifficultySelectorComponent />
          </section>

          <section class="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
            <WordChipComponent />
            <p class="mt-4 text-[11px] text-slate-400 leading-relaxed">
              <strong>Dica:</strong> Use entre 8 a 15 palavras para um melhor resultado visual.
            </p>
          </section>

          <div class="flex flex-col gap-3">
            <button
              @click="handleGenerate"
              :disabled="isBusy || store.words.length === 0"
              class="inline-flex w-full items-center justify-center rounded-xl bg-indigo-600 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ArrowPathIcon v-if="isBusy" class="h-5 w-5 animate-spin mr-2" />
              <SparklesIcon v-else class="h-5 w-5 mr-2" />
              {{ isBusy ? 'Gerando Desafio...' : 'Gerar Caça-Palavras' }}
            </button>

            <button
              @click="handleReset"
              :disabled="isBusy"
              class="inline-flex w-full items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-bold text-slate-600 border border-slate-200 hover:bg-slate-50 transition-all"
            >
              <TrashIcon class="h-5 w-5 mr-2 text-slate-400" />
              Limpar Tudo
            </button>
          </div>
        </aside>

        <section class="lg:col-span-2 space-y-6" aria-labelledby="puzzle-result-title">
          <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <header>
              <h2 id="puzzle-result-title" :class="['text-2xl font-extrabold transition-colors', !store.title ? 'text-slate-300 italic' : 'text-slate-900']">
                {{ store.title || 'Seu Caça-Palavras' }}
              </h2>
              <div class="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase mt-1">
                <span class="bg-slate-200 px-2 py-0.5 rounded text-slate-600">{{ store.getDifficultyLabel() }}</span>
                <span aria-hidden="true">•</span>
                <span>{{ store.size }} × {{ store.size }}</span>
              </div>
            </header>

            <div class="flex flex-wrap items-center gap-2 w-full sm:w-auto" v-if="store.isGenerated">
              <button 
                @click="store.showSolution = !store.showSolution"
                title="Mostrar/Esconder Respostas"
                :class="[
                  'inline-flex items-center h-10 px-4 rounded-lg text-sm font-bold transition-all border shrink-0',
                  store.showSolution 
                    ? 'bg-amber-50 text-amber-700 border-amber-200 ring-2 ring-amber-500/20' 
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                ]"
              >
                <component :is="store.showSolution ? EyeSlashIcon : EyeIcon" class="h-4 w-4 mr-1.5" />
                Gabarito
              </button>
              
              <ExportButtonsComponent :targetRef="puzzleRef" />
            </div>
          </div>

          <article 
            ref="puzzleRef" 
            class="bg-white rounded-2xl shadow-xl shadow-slate-200/60 overflow-hidden border border-slate-100 p-3 sm:p-6"
          >
            <h3 class="sr-only">Grid do Caça-Palavras</h3>
            <PuzzleGridComponent />
          </article>
        </section>

      </main>
    </div>

    <footer role="contentinfo" class="py-12 border-t border-slate-200 bg-white mt-12">
      <div class="max-w-6xl mx-auto px-4 text-center">
        <p class="text-sm font-bold text-slate-900 tracking-tight mb-6">Wordcraft Engine v2.0</p>
        
        <nav class="flex justify-center items-center gap-6" aria-label="Links sociais">
          <a href="https://github.com/rafaelarbz" target="_blank" rel="noopener noreferrer" class="group flex items-center text-slate-500 hover:text-slate-900 transition-colors">
            <span class="text-xs font-bold uppercase tracking-widest mr-2">Github</span>
            <div class="p-2 bg-slate-100 group-hover:bg-slate-200 rounded-full transition-colors text-slate-700">
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            </div>
          </a>

          <a href="https://linkedin.com/in/rafaelarsouza" target="_blank" rel="noopener noreferrer" class="group flex items-center text-slate-500 hover:text-blue-600 transition-colors">
            <span class="text-xs font-bold uppercase tracking-widest mr-2">Linkedin</span>
            <div class="p-2 bg-slate-100 group-hover:bg-blue-50 rounded-full transition-colors text-blue-600">
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            </div>
          </a>
        </nav>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { 
  SparklesIcon, ArrowPathIcon, TrashIcon, EyeSlashIcon, EyeIcon 
} from '@heroicons/vue/20/solid'
import { usePuzzleStore } from './store/puzzle.store'
import PuzzleGridComponent from './components/puzzle-grid.component.vue'
import DifficultySelectorComponent from './components/difficulty-selector.component.vue'
import WordChipComponent from './components/word-chip.component.vue'
import ExportButtonsComponent from './components/export-buttons.component.vue'

const store = usePuzzleStore()
const puzzleRef = ref(null)
const isBusy = ref(false)

async function handleGenerate() {
  if (isBusy.value) return
  isBusy.value = true
  await new Promise(r => setTimeout(r, 400)) // Feedback visual
  try {
    store.generatePuzzle()
  } finally {
    isBusy.value = false
  }
}

function handleReset() {
  if (confirm('Deseja apagar este caça-palavras?')) {
    store.resetGrid(12)
    store.words = []
    store.title = ''
    store.isGenerated = false
  }
}
</script>