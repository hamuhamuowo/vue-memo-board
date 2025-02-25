<script>
export default {
  data() {
    return {
      msg: 'hello world',
    }
  },
  methods: {
    onClickAlert() {
      alert('click!')
    },
  },
}
</script>

<template>
  <div>{{ msg }}</div>
  <button v-on:click="onClickAlert">click</button>
</template>

<style scoped></style>
