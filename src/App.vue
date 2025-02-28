<script setup>
import { nextTick, ref } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'

let id = 1
const editingBoardId = ref(null) // 수정중 보드 ID
const titleInputRef = ref(null) // 보드 타이틀 수정용 인풋
const boards = ref([
  {
    id: 0,
    title: `미설정`,
    notes: [],
  },
])
const memoContent = ref('')

function onChangeMemoContent(e) {
  memoContent.value = e.target.value
}

function onUpdate() {
  console.log('메모 위치 변경')
}

function onAdd(event) {
  console.log('새로운 보드에 메모 추가(이동)', event)
}

function onRemove(event) {
  console.log('보드에서 메모 제거', event)
}

function onClickDeleteBoard(boardId) {
  boards.value = boards.value.filter((b) => b.id !== boardId)
}

function onClickAddBoard(e) {
  e.preventDefault()
  boards.value.push({
    id: id++,
    title: '이름없음',
    notes: [],
  })
}

function onClickSaveMemo(e) {
  e.preventDefault()
  boards.value[0].notes.push({
    content: memoContent.value,
  })
  document.getElementById('memoInput').value = ''
}

function startEditing(boardId) {
  editingBoardId.value = boardId
  nextTick(() => {
    const input = document.querySelector('.board__input-title')
    if (input) {
      input.focus()
    }
  })
}

function saveTitle(boardId, event) {
  const board = boards.value.find((b) => b.id === boardId)
  if (board) {
    board.title = event.target.value !== '' ? event.target.value : '이름없음'
  }
  editingBoardId.value = null
}
</script>

<template>
  <div class="wrap">
    <header class="header">
      <div><h1>Vue Memo Board</h1></div>
      <div>
        <form action="" class="form" @submit.prevent>
          <button type="button" class="form__btn-add" @click="onClickAddBoard">보드 추가</button>
          <input
            type="text"
            id="memoInput"
            class="form__input"
            placeholder="내용을 입력하시고 저장 버튼을 눌러주세요 ..."
            maxlength="100"
            @input="onChangeMemoContent"
            @keyup.enter="onClickSaveMemo"
          />
          <button type="button" @click="onClickSaveMemo" class="form__btn-submit">메모 저장</button>
        </form>
      </div>
    </header>
    <main class="block__grid">
      <section v-for="board in boards" :key="board.id">
        <button @click="onClickDeleteBoard(board.id)" v-if="board.id !== 0" class="block__btn-x">
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
          ref="titleInputRef"
        />

        <VueDraggable
          v-model="board.notes"
          group="{ name: 'notes', pull: true, put: true }"
          animation="150"
          class="note-container"
          @update="onUpdate"
          @add="onAdd"
          @remove="onRemove"
        >
          <article v-for="note in board.notes" :key="note.id" class="note">
            {{ note.content }}
          </article>
          <template v-if="board.notes.length === 0">
            <div class="empty-placeholder">empty</div>
          </template>
        </VueDraggable>
      </section>
    </main>
  </div>
</template>

<style scoped>
.wrap {
  width: 90%;
  max-width: 1440px;
  margin: 0 auto;
  text-align: center;
}

.form {
  display: flex;
  gap: 1rem;
  margin: 5rem 0;
}

.form__input {
  padding: 1rem;
  width: 100%;
  outline: none;
  background-color: #ccc;
  border: none;
  font-size: 2rem;
  font-weight: 700;
  border-radius: 1rem;
}

.form button {
  width: 5rem;
  height: 5rem;
  border-radius: 1rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
}

.form button:hover {
  background-color: aquamarine;
}

.block__grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.block__grid section {
  flex: 1 1 calc(20% - 1rem);
  background-color: #ccc;
  height: 700px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 1rem;
  padding: 1rem;
  position: relative;
}

.block__btn-x {
  position: absolute;
  right: 1rem;
  border: none;
  background-color: aliceblue;
  padding: 0.2rem 0.6rem;
  display: flex;
  justify-content: center;
  align-self: center;
  border-radius: 0.4rem;
  cursor: pointer;
  transition: 0.3s all;
}

.block__btn-x:hover {
  background-color: aquamarine;
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
  padding: 1rem;
  background-color: aliceblue;
  border-radius: 1rem;
  text-align: left;
  cursor: grab;
}
</style>
