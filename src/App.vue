<script setup>
import { ref, onMounted } from 'vue'
import AppHeader from './components/AppHeader.vue'
import NoteBoard from './components/NoteBoard.vue'
import {
  fetchBoards,
  fetchNotes,
  addBoard,
  deleteBoard,
  addNote,
  deleteNote,
  createDefaultBoard,
} from './lib/supabaseApi'

const boards = ref([])

const loadBoards = async () => {
  const fetchedBoards = await fetchBoards()

  if (fetchedBoards.length === 0) {
    const defaultBoard = await createDefaultBoard()
    if (defaultBoard) {
      defaultBoard.notes = [] // 기본 보드의 노트 배열 추가
      boards.value = [defaultBoard]
    }
  } else {
    // 보드별로 노트를 가져와서 boards 배열에 추가
    for (const board of fetchedBoards) {
      const notes = await fetchNotes(board.id) // 각 보드에 대한 노트 가져오기
      board.notes = notes || [] // notes가 없으면 빈 배열 할당
    }
    boards.value = fetchedBoards
  }
}

onMounted(async () => {
  loadBoards()
})

const handleAddBoard = async () => {
  const newBoard = await addBoard('새 보드')
  if (newBoard) boards.value.push(newBoard)
}

const handleDeleteBoard = async (boardId, boardTitle) => {
  if (confirm(`${boardTitle} 보드를 삭제할까요?`)) {
    await deleteBoard(boardId)
    boards.value = boards.value.filter((b) => b.id !== boardId)
  }
}

const handleSaveMemo = async (boardId, memoContent) => {
  if (memoContent && memoContent.trim() !== '') {
    const newNote = await addNote(boardId, memoContent)
    if (newNote) {
      const board = boards.value.find((b) => b.id === boardId)
      if (board) {
        board.notes.push(newNote) // 해당 보드의 notes 배열에 추가
      }
    }
  }
}

const handleDeleteMemo = async (noteId) => {
  if (confirm('삭제하시겠습니까?')) {
    await deleteNote(noteId)
    boards.value.forEach((board) => {
      board.notes = board.notes.filter((note) => note.id !== noteId)
    })
  }
}
</script>

<template>
  <div class="wrap">
    <AppHeader :add-board="handleAddBoard" :save-memo="handleSaveMemo" />
    <NoteBoard :boards="boards" :delete-board="handleDeleteBoard" :delete-memo="handleDeleteMemo" />
  </div>
</template>

<style scoped>
.wrap {
  width: 90%;
  max-width: 1440px;
  margin: 0 auto;
  text-align: center;
}
</style>
