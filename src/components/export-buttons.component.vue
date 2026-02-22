<template>
    <div class="flex flex-wrap items-center gap-2">
        <button
            @click="downloadPNG"
            :disabled="isBusy"
            type="button"
            class="inline-flex items-center h-10 justify-center gap-x-1.5 rounded-lg bg-indigo-600 px-4 text-sm font-bold text-white shadow-sm hover:bg-indigo-700 transition-all disabled:opacity-50"
            >
            <ArrowDownTrayIcon class="h-4 w-4" aria-hidden="true" />
                PNG
        </button>

        <button
            @click="downloadPDF"
            :disabled="isBusy"
            type="button"
            class="inline-flex items-center h-10 justify-center gap-x-1.5 rounded-lg bg-slate-700 px-4 text-sm font-bold text-white shadow-sm hover:bg-slate-800 transition-all disabled:opacity-50"
        >
            <DocumentArrowDownIcon class="h-4 w-4" aria-hidden="true" />
            PDF
        </button>

        <button
            @click="regenerate"
            :disabled="isBusy"
            type="button"
            class="inline-flex items-center h-10 justify-center gap-x-1.5 rounded-lg bg-white px-4 text-sm font-bold text-slate-700 shadow-sm border border-slate-200 hover:bg-slate-50 transition-all disabled:opacity-50"
        >
          <ArrowPathIcon
              :class="['h-4 w-4 text-slate-500', isGenerating ? 'animate-spin' : '']"
              aria-hidden="true"
          />
          {{ isGenerating ? 'Gerando...' : 'Novo' }}
        </button>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ArrowDownTrayIcon, DocumentArrowDownIcon, ArrowPathIcon } from '@heroicons/vue/20/solid'
import { usePuzzleStore } from '@/store/puzzle.store'

const props = defineProps<{
  targetRef: any 
}>()

const store = usePuzzleStore()
const isDownloading = ref(false)
const isGenerating = ref(false)
const isBusy = computed(() => isDownloading.value || isGenerating.value)

const getTargetElement = () => {
  const el = props.targetRef?.value || props.targetRef;
  return el?.$el || el;
}

async function downloadPNG() {
  const element = getTargetElement();
  // No Vite, não precisamos de process.client, o check de window é o padrão
  if (typeof window === 'undefined' || !element) return;

  isDownloading.value = true;
  try {
    const html2canvas = (await import('html2canvas')).default;
    const canvas = await html2canvas(element, {
      scale: 3,
      useCORS: true,
      backgroundColor: '#ffffff',
    });
    const link = window.document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `${store.title || 'caca-palavras'}.png`;
    link.click();
  } catch (e) {
    console.error("Erro PNG:", e);
  } finally {
    isDownloading.value = false;
  }
}

async function downloadPDF() {
  if (typeof window === 'undefined') return;
  
  const element = getTargetElement();
  if (!element) {
    window.alert("Erro: Área do caça-palavras não encontrada.");
    return;
  }

  isDownloading.value = true;
  try {
    const html2canvas = (await import('html2canvas')).default;
    const { jsPDF } = await import('jspdf');

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: canvas.width > canvas.height ? 'l' : 'p',
      unit: 'px',
      format: [canvas.width, canvas.height]
    });

    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save(`${store.title || 'caca-palavras'}.pdf`);
  } catch (e) {
    console.error("Erro PDF:", e);
    window.alert("Houve um erro ao gerar o PDF.");
  } finally {
    isDownloading.value = false;
  }
}

function regenerate() {
  isGenerating.value = true;
  try {
    store.generatePuzzle();
  } finally {
    setTimeout(() => { isGenerating.value = false }, 300);
  }
}
</script>