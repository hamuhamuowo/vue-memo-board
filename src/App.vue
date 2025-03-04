<script setup>
import { ref } from 'vue'
import AppHeader from './components/AppHeader.vue'
import NoteBoard from './components/NoteBoard.vue'
import { v1 as uuidv1 } from 'uuid'

const boards = ref([
  {
    id: 0,
    title: ``,
    notes: [],
  },
])

let id = 1
const addBoard = () => {
  boards.value.push({
    id: id++,
    title: '클릭 후 이름을 설정하세요',
    notes: [],
  })
}

const saveMemo = (memoContent) => {
  if (memoContent && memoContent.trim() !== '') {
    boards.value[0].notes.push({
      id: uuidv1(),
      content: memoContent,
    })
  }
}

const deleteBoard = (boardId, boardTitle) => {
  if (confirm(`${boardTitle} 보드를 삭제할가욤?`)) {
    boards.value = boards.value.filter((b) => b.id !== boardId)
  }
}

const deleteMemo = (noteId) => {
  if (confirm('삭제하시갯어용?')) {
    for (let i = 0; i < boards.value.length; i++) {
      boards.value[i].notes = boards.value[i].notes.filter((note) => note.id !== noteId)
    }
  }
}
</script>

<template>
  <div class="wrap">
    <AppHeader :add-board="addBoard" :save-memo="saveMemo" />
    <NoteBoard :boards="boards" :delete-board="deleteBoard" :delete-memo="deleteMemo" />
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
