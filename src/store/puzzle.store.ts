import { defineStore } from 'pinia';
import { ref, readonly } from 'vue';

export type Difficulty = 'easy' | 'medium' | 'hard';
export type Direction = [number, number];

export interface PlacedWord {
  word: string;
  positions: [number, number][];
}

const DIRECTIONS: Record<Difficulty, Direction[]> = {
  easy: [[0, 1], [1, 0]],
  medium: [[0, 1], [1, 0], [1, 1], [-1, 1]],
  hard: [[0, 1], [1, 0], [1, 1], [-1, 1], [0, -1], [-1, 0], [-1, -1], [1, -1]],
};

export const usePuzzleStore = defineStore('puzzle', () => {
    const title = ref('');
    const words = ref<string[]>(['ABACAXI', 'MELÃO', 'MORANGO', 'FRAMBOESA']);
    const difficulty = ref<Difficulty>('easy');
    const size = ref(12);
    const grid = ref<string[][]>([]);
    const placedWords = ref<PlacedWord[]>([]);
    const isGenerated = ref(false);
    const showSolution = ref(false);

    // Centraliza a normalização para evitar inconsistências
    function normalizeWord(w: string) {
        return w.toUpperCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^A-Z0-9]/gi, '')
        .trim();
    }

    function resetGrid(n: number) {
        size.value = n;
        grid.value = Array.from({ length: n }, () => Array(n).fill(''));
        placedWords.value = [];
        isGenerated.value = false;
    }

    function tryPlaceWord(word: string, dir: Direction, allowReverse: boolean): boolean {
        const wordToPlace = allowReverse && Math.random() < 0.3 
        ? word.split('').reverse().join('') 
        : word;
        
        const len = wordToPlace.length;
        const [dr, dc] = dir;
        
        // Tentativas aleatórias para a palavra
        for (let attempt = 0; attempt < 150; attempt++) {
        const r = Math.floor(Math.random() * size.value);
        const c = Math.floor(Math.random() * size.value);
        
        const endR = r + dr * (len - 1);
        const endC = c + dc * (len - 1);

        if (endR >= 0 && endR < size.value && endC >= 0 && endC < size.value) {
            let canPlace = true;
            let positions: [number, number][] = [];

            for (let i = 0; i < len; i++) {
            const rr = r + dr * i;
            const cc = c + dc * i;
            if (grid.value[rr]?.[cc] !== '' && grid.value[rr]?.[cc] !== wordToPlace[i]) {
                canPlace = false;
                break;
            }
            positions.push([rr, cc]);
            }

            if (canPlace) {
            positions.forEach(([rr, cc], i) => {
                grid.value[rr]![cc] = wordToPlace[i]!;
            });
            placedWords.value.push({ word, positions });
            return true;
            }
        }
        }
        return false;
    }

    function generatePuzzle() {
        const cleanWords = words.value.map(normalizeWord).filter(w => w.length > 1);
        const maxLen = Math.max(...cleanWords.map(w => w.length), 10);
        let currentSize = Math.max(maxLen + 2, Math.ceil(Math.sqrt(cleanWords.join('').length) * 1.5));

        let success = false;
        let attempts = 0;

        while (!success && attempts < 5) {
        resetGrid(currentSize);
        const sorted = [...cleanWords].sort((a, b) => b.length - a.length);
        let allPlaced = true;

        for (const word of sorted) {
            const dirs = [...DIRECTIONS[difficulty.value]].sort(() => Math.random() - 0.5);
            let placed = false;
            for (const d of dirs) {
            if (tryPlaceWord(word, d, difficulty.value === 'hard')) {
                placed = true;
                break;
            }
            }
            if (!placed) { allPlaced = false; break; }
        }

        if (allPlaced) {
            success = true;
        } else {
            currentSize += 2;
            attempts++;
        }
        }

        // Preencher vazios
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        for (let r = 0; r < size.value; r++) {
        for (let c = 0; c < size.value; c++) {
            if (grid.value[r]![c] === '') {
            grid.value[r]![c] = chars.charAt(Math.floor(Math.random() * chars.length));
            }
        }
        }
        isGenerated.value = true;
    }

    /** * Verifica se uma célula específica (r, c) faz parte de qualquer palavra colocada.
     * Retorna o objeto da palavra se encontrar, para podermos usar cores diferentes se quiser.
     */
    function isCellPartOfWord(r: number, c: number) {
        return placedWords.value.find(pw => 
            pw.positions.some(pos => pos[0] === r && pos[1] === c)
        );
    }

    function getDifficultyLabel(): string {
        switch (difficulty.value) {
            case 'easy': return 'Fácil';
            case 'medium': return 'Médio';
            case 'hard': return 'Difícil';
            default: return 'Indefinido';
        }
    }

    return { 
        title, words, difficulty, size, grid, placedWords, isGenerated, showSolution,
        normalizeWord, generatePuzzle, resetGrid, isCellPartOfWord, getDifficultyLabel
    };
});