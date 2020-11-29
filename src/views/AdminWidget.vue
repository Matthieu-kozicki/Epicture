<template>
    <th scope="row">{{NameProp}}</th>
    <td v-if="Imgurbool"><i class="pi pi-check"></i></td>
    <td v-else><i class="pi pi-times"></i></td>
    <td v-if="Spotifybool"><i class="pi pi-check"></i></td>
    <td v-else><i class="pi pi-times"></i></td>
    <td v-if="Steambool"><i class="pi pi-check"></i></td>
    <td v-else><i class="pi pi-times"></i></td>
    <td v-if="Weatherbool"><i class="pi pi-check"></i></td>
    <td v-else><i class="pi pi-times"></i></td>
    <td v-if="Currencybool"><i class="pi pi-check"></i></td>
    <td v-else><i class="pi pi-times"></i></td>
    <td><Button v-on:click="deleteUser" label="Secondary" class="p-button-secondary">X</Button></td>
</template>

<script>
import { firebase } from '@firebase/app'
import '@firebase/auth'
import '@firebase/firestore'
import { db } from '../main'

/**
 * This widget is used on the Admin page to render a user
 * and its services
 */
export default {
  name: "Adminwidget",
  methods: {
    /**
     * This function is used to delete an user
     */
    deleteUser() {
      console.log(this.UserId);
      db.collection("users").doc(this.UserId).delete();
    }
  },
  props: {
    NameProp: String,
    Imgurbool: Boolean,
    Spotifybool: Boolean,
    Steambool: Boolean,
    Weatherbool: Boolean,
    Currencybool: Boolean,
    UserId: String,
    idProp: Number
  },
  data() {
    return {
      valueParam: ""
    };
  },
}
</script>

<style scoped>
#background {
  background-color: rgb(167, 167, 167);
  width: 30%;
}
</style>