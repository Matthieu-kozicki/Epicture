<template>
  <div id="container_main" class="container-fluid">
    <div class="row">
      <!-- left side -->
      <div id="left" class="col-2">
        <div id="card">
          <Card>
            <template v-slot:header>
              <!-- <img alt="User image" src="demo/images/usercard.png"> -->
              <i class="pi pi-user"></i>
            </template>
            <template v-slot:title>
              User Name
            </template>
          </Card>
        </div>

        <div id="pannel">
          <PanelMenu id="menu" :model="items" />
        </div>

        <div id="disconnect">
          <Button label="Secondary" class="p-button-secondary">Disconnect</Button>
        </div>
      </div>



      <!-- right side -->
      <div id="right" class="col-10">
        <div class="col-sm-1">
          <h2> Dashboard </h2>
        </div>
        <div class="col-sm-10"></div>
        <!-- here should be the widget -->
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
  background-color: white;
}
*, #container_main {
  padding: 0;
  margin: 0;
}
#pannel{
  width: 100%;
  margin: 1%
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
#card {
  padding: 5%;
}

</style>