<script setup>
import { ref } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'

const boards = ref([
  {
    id: 1,
    title: 'board1',
    notes: [
      { id: 1, content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.' },
      { id: 2, content: 'Excepturi corrupti reru similique ipsa velit.' },
    ],
  },
  {
    id: 2,
    title: 'board2',
    notes: [
      { id: 3, content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.' },
      { id: 4, content: 'Excepturi corrupti reru similique ipsa velit.' },
    ],
  },
])

function onUpdate() {
  console.log('메모 위치 변경')
}

function onAdd(event) {
  console.log('새로운 보드에 메모 추가(이동)', event)
}

function onRemove(event) {
  console.log('보드에서 메모 제거', event)
}
</script>

<template>
  <div class="wrap">
    <header class="header">
      <div><h1>Vue Memo Board</h1></div>
      <div>
        <form action="" class="form">
          <button class="form__btn-add">추가</button>
          <input
            type="text"
            class="form__input"
            placeholder="내용을 입력하시고 엔터를 눌러주세요 ..."
            maxlength="100"
          />
          <button class="form__btn-submit">저장</button>
        </form>
      </div>
    </header>
    <main class="block__grid">
      <section v-for="board in boards" :key="board.id">
        <h3>{{ board.title }}</h3>
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
