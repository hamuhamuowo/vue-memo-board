<script setup>
const boards = [
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
      { id: 1, content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.' },
      { id: 2, content: 'Excepturi corrupti reru similique ipsa velit.' },
    ],
  },
]
</script>

<template>
  <div class="wrap">
    <header class="header">
      <div><h1>vue memo board</h1></div>
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
        <h3>
          {{ board.title }}
        </h3>
        <article v-for="note in board.notes" :key="note.id" class="note">
          {{ note.content }}
        </article>
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
}

.block__grid section article {
  width: 80%;
  padding: 1rem;
  background-color: aliceblue;
  margin-bottom: 0.5rem;
  border-radius: 1rem;
  text-align: left;
}
</style>
