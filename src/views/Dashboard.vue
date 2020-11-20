<template>
  <div id="container_main" class="container-fluid">
    <div class="row">
      <!-- left side -->
      <div id="left" class="col-2">
        <div>
          <h1>icon et user tkt</h1>
        </div>

        <div>
          <PanelMenu :model="items" />
        </div>

        <div id="disconnect">
          <button>Disconnect</button>
        </div>
      </div>



      <!-- right side -->
      <div id="right" class="col-10">
        2 of 3
      </div>
    </div>
  </div>
</template>

<script>
import { firebase } from '@firebase/app'


import '@firebase/auth'
export default {
   methods: {
      disconnect: function() {
      console.log("Disconnected !")
      firebase.auth().signOut()
      this.$router.replace({name: "Login"})
   },
   toggle(event) {
         this.$refs.menu.toggle(event);
      }
   },
   data() {
		return {
			items: [
            {
               label: 'Service1',
               icon:'pi pi-fw pi-chart-bar',
               items: [
                  {
                     label: 'Widget1',
                     icon:'pi pi-fw pi-align-justify'
                  },
                  {
                     label: 'Widget2',
                     icon:'pi pi-fw pi-align-justify'
                  },
                  {
                     label: 'Widget3',
                     icon:'pi pi-fw pi-align-justify'
                  }
               ]
            },
            {
               label: 'Service2',
               icon:'pi pi-fw pi-desktop',
               items: [
                  {
                     label: 'Widget1',
                     icon:'pi pi-fw pi-align-justify'
                  },
                  {
                     label: 'Widget2',
                     icon:'pi pi-fw pi-align-justify'
                  },
                  {
                     label: 'Widget3',
                     icon:'pi pi-fw pi-align-justify'
                  }
               ]
            },
            {
               label: 'Service3',
               icon:'pi pi-fw pi-image',
               items: [
                  {
                     label: 'Widget1',
                     icon:'pi pi-fw pi-align-justify'
                  },
                  {
                     label: 'Widget2',
                     icon:'pi pi-fw pi-align-justify'
                  },
                  {
                     label: 'Widget3',
                     icon:'pi pi-fw pi-align-justify'
                  }
               ]
            }
         ]
		}
	}
}
</script>

<style>
@import './../../css/bootstrap.min.css';
#left {
  display: flex;
  flex-direction: column;
  height: 98.4vh;
  background-color:whitesmoke;
}
#right {
  background-color:white;
}
*, #container_main {
  padding: 0;
  margin: 0;
}
#nav {
  padding: 0;
  margin: 0;
}
#disconnect {
  align-self: center;
  position: absolute;
  bottom: 0;
}
</style>