<script setup>
import { nextTick, ref } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { supabase } from '../lib/supabase'

const props = defineProps(['boards', 'deleteBoard', 'deleteMemo'])

const editingBoardId = ref(null) // 수정중 보드 ID
const titleInputRef = ref(null) // 보드 타이틀 수정용 인풋

const startEditing = (boardId) => {
  editingBoardId.value = boardId
  nextTick(() => {
    const input = document.querySelector('.board__input-title')
    if (input) {
      input.focus()
    }
  })
}

const saveTitle = (boardId, event) => {
  const board = props.boards.find((b) => b.id === boardId)
  if (board) {
    board.title = event.target.value !== '' ? event.target.value : '이름없음'
  }
  editingBoardId.value = null
}

const updateNoteOrder = async (boardId, notes) => {
  for (const note of notes) {
    await supabase.from('notes').update({ board_id: boardId }).match({ id: note.id })
  }
}
</script>

<template>
  <main class="block__grid">
    <section v-for="board in boards" :key="board.id" class="section">
      <button
        @click="props.deleteBoard(board.id, board.title)"
        v-if="board.id !== 0"
        class="block__btn-x"
      >
        x
      </button>
      <h3 v-if="editingBoardId !== board.id" @click="startEditing(board.id)">
        {{ board.title }}
      </h3>
      <input
        v-else
        type="text"
        :value="board.title"
        @blur="saveTitle(board.id, $event)"
        @keyup.enter="saveTitle(board.id, $event)"
        class="board__input-title"
        autofocus
        maxlength="18"
        ref="titleInputRef"
      />

      <VueDraggable
        v-model="board.notes"
        group="notes"
        animation="150"
        class="note-container"
        @end="updateNoteOrder(board.id, board.notes)"
      >
        <article v-for="note in board.notes" :key="note.id" class="note">
          {{ note.content }}
          <font-awesome-icon :icon="faTrash" @click="props.deleteMemo(note.id)" />
        </article>
        <!-- <template v-if="board.notes.length === 0"> -->
        <div class="empty-placeholder">
          <span class="empty-text">메모를 옮겨보세요...</span>
        </div>
        <!-- </template> -->
      </VueDraggable>
    </section>
  </main>
</template>

<style scoped>
.block__btn-x:hover {
  background-color: var(--sub-color);
  border: none;
  color: var(--main-color);
}

.block__grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  padding-bottom: 3rem;
}

.block__grid .section {
  flex: 1 1 calc(20% - 2rem);
  background-color: var(--sub-color);
  color: var(--main-color);
  height: 700px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 1rem;
  padding: 1rem;
  position: relative;
}

.block__grid .section:nth-child(1) {
  background-color: var(--main-color);
  border: 1px solid var(--sub-color);
  position: relative;
}

.section:nth-child(1)::before {
  content: '';
  width: 2rem;
  height: 4.5rem;
  background-color: var(--sub-color);
  position: absolute;
  top: -2.4rem;
  left: 2rem;
}

.block__btn-x {
  position: absolute;
  right: 1rem;
  border: none;
  background-color: var(--main-color);
  padding: 0.2rem 0.6rem;
  display: flex;
  justify-content: center;
  align-self: center;
  border-radius: 0.4rem;
  cursor: pointer;
  transition: 0.3s all;
}

.board__input-title {
  font-size: 1.5rem;
  font-weight: bold;
  border: none;
  outline: none;
  background: transparent;
  text-align: center;
  width: 100%;
  padding: 1rem 0;
  color: var(--main-color);
}

.empty-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.empty-text {
  font-size: 2rem;
  font-weight: 700;
  opacity: 0.5;
}

.note-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.note {
  width: 80%;
  padding: 1rem 2rem;
  background-color: var(--sub-color);
  color: var(--main-color);
  border-radius: 1rem;
  text-align: left;
  cursor: grab;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.4rem;
  border: 1px solid var(--main-color);
}

.note:hover {
  transform: scale(1.01);
  transition: 0.3s all;
}
</style>
