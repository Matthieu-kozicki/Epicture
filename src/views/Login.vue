<template>
  <div class="login" id="mainDiv">
    <h1>Dashboard du 93</h1>
    <input id="loginInput" v-bind:value="login" placeholder="Email address" inputmode="email" />
    <input id="loginInput" v-bind:value="password" placeholder="Password" type="password"/>
    <button v-on:click="test" id="connectButton" type="button">
      Connect
    </button>
  </div>
</template>

<script>
export default {
  name: 'Login',
  methods: {
    test() {
      console.log("weshh !!!");
    }
  },
  data: () => {
    return {
      login: "",
      password: "",
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

#loginInput {
  color:blueviolet;
  width: 200px;
  height: 50px;
  margin: 10px;
  align-self: center;
}

#mainDiv {
  display: flex;
  flex-direction: column;
}

#connectButton {
  width: auto;
  height: 50px;
  align-self: center;
  margin: 10px;
}
</style>