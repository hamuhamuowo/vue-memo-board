<script setup>
import { nextTick, ref } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { v1 as uuidv1 } from 'uuid'

let id = 1
const randomId = ref(null)
const editingBoardId = ref(null) // 수정중 보드 ID
const titleInputRef = ref(null) // 보드 타이틀 수정용 인풋
const boards = ref([
  {
    id: 0,
    title: ``,
    notes: [],
  },
])
const memoContent = ref('')

const vibration = (target) => {
  target.classList.add('vibration')

  setTimeout(function () {
    target.classList.remove('vibration')
  }, 400)
}

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
    title: '이름을 설정하세요',
    notes: [],
  })
}

function onClickSaveMemo(e) {
  e.preventDefault()
  if (memoContent.value && memoContent.value.trim() !== '') {
    randomId.value = uuidv1()
    boards.value[0].notes.push({
      id: randomId.value,
      content: memoContent.value,
    })
  } else if (e.target.type === 'text') {
    // 엔터로 조작했을 때
    vibration(e.target)
  } else if (e.target.type === 'button') {
    // 버튼을 클릭했을 때
    vibration(e.target.previousElementSibling)
  }
  document.getElementById('memoInput').value = ''
  memoContent.value = ''
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

function onClickMemoDelete(id) {
  if (confirm('메모를 삭제하겟습니까?')) {
    for (let i = 0; i < boards.value.length; i++) {
      boards.value[i].notes = boards.value[i].notes.filter((note) => note.id !== id)
    }
  }
}
</script>

<template>
  <div class="wrap">
    <header class="header">
      <div>
        <span>메모장...</span>
        <pre>
.　 -、_　○_,-￣
　　　 〇
　　　 ｏ
○＝＝∧,,∧＝＝○
|| (⌒ (´-ω-`) ⌒) ||
/⌒⌒O⌒⌒O⌒⌒⌒i|
／＃　＃　＃　＃／)

</pre
        >
      </div>
      <div>
        <form action="" class="form" @submit.prevent>
          <button type="button" class="button form__btn-add" @click="onClickAddBoard">
            보드 추가
          </button>
          <input
            type="text"
            id="memoInput"
            class="form__input"
            placeholder="내용을 입력한 후 저장 버튼을 누르세요 ..."
            maxlength="255"
            autocomplete="off"
            @input="onChangeMemoContent"
            @keyup.enter="onClickSaveMemo"
          />
          <button type="button" @click="onClickSaveMemo" class="button form__btn-submit">
            메모 저장
          </button>
        </form>
      </div>
    </header>
    <main class="block__grid">
      <section v-for="board in boards" :key="board.id" class="section">
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
            <font-awesome-icon :icon="faTrash" @click="onClickMemoDelete(note.id)" />
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

.header {
  padding: 3rem 0;
  font-weight: 600;
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
  border: 1px solid var(--sub-color);
  font-size: 1.6rem;
  font-weight: 500;
  border-radius: 1rem;
  background-color: transparent;
  color: var(--sub-color);
}

.form__input::placeholder {
  color: var(--sub-color);
  opacity: 0.4;
}

.form .button {
  width: 5rem;
  height: 5rem;
  border-radius: 1rem;
  cursor: pointer;
  transition: all 0.1s;
}

.form__btn-add,
.form__btn-submit:hover {
  background-color: var(--main-color);
  border: 1px solid var(--sub-color);
  color: var(--sub-color);
}

.form__btn-add:hover,
.form__btn-submit,
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

.vibration {
  animation: vibration 0.1s infinite;
}

@keyframes vibration {
  from {
    transform: rotate(0.3deg);
  }
  to {
    transform: rotate(-0.3deg);
  }
}
</style>
