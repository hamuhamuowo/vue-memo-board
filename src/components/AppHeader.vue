<script setup>
import { ref } from 'vue'

const props = defineProps(['addBoard', 'saveMemo'])
const memoContent = ref('')
const defaultBoardId = 0

const vibration = (target) => {
  target.classList.add('vibration')

  setTimeout(() => {
    target.classList.remove('vibration')
  }, 400)
}

const onChangeMemoContent = (e) => {
  memoContent.value = e.target.value
}

const onClickSaveMemo = (e) => {
  e.preventDefault()
  if (memoContent.value && memoContent.value.trim() !== '') {
    props.saveMemo(defaultBoardId, memoContent.value)
    memoContent.value = ''
    document.getElementById('memoInput').value = ''
  } else {
    if (e.target.type === 'text') {
      // 엔터로 조작했을 때
      vibration(e.target)
    } else if (e.target.type === 'button') {
      // 버튼을 클릭했을 때
      vibration(e.target.previousElementSibling)
    }
  }
}
</script>

<template>
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
        <button type="button" class="button form__btn-add" @click="props.addBoard">
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
</template>

<style scoped>
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
.form__btn-submit {
  background-color: var(--sub-color);
  border: none;
  color: var(--main-color);
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
