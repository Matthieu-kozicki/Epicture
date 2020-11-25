<template>
    <th scope="row">{{NameProp}}</th>
    <td v-if="Imgurbool"><Button v-on:click="submit" label="Secondary" class="p-button-secondary">X</Button></td>
    <td v-else>none</td>
    <td v-if="Spotifybool"><Button v-on:click="submit" label="Secondary" class="p-button-secondary">X</Button></td>
    <td v-else>none</td>
    <td v-if="thridbool"><Button v-on:click="submit" label="Secondary" class="p-button-secondary">X</Button></td>
    <td v-else>none</td>
</template>

<script>
import { firebase } from '@firebase/app'
import '@firebase/auth'
import '@firebase/firestore'
import { db } from '../main'

export default {
  name: "Adminwidget",
  props: {
    NameProp: String,
    Imgurbool: Boolean,
    Spotifybool: Boolean,
    thridbool: Boolean,
    idProp: Number
  },
  data() {
    return {
      valueParam: ""
    };
  },
  async mounted() {
    console.log("Didmount")
  }
}
</script>

<style scoped>
#background {
  background-color: rgb(167, 167, 167);
  width: 30%;
}
</style>