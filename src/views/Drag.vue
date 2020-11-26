<template>
  <div class="flex m-10">
    <draggable  id="test" class="dragArea list-group w-full" :list="list" @change="log">
      <component style="padding: 10px"
        v-for="(list, index) in list"
        :key="index"
        :is="list"
      />
    </draggable>
  </div>
</template>
<script>
  import { defineComponent } from 'vue'
  import { imgurAddSearchWidget } from './Service.vue'
  import { VueDraggableNext } from 'vue-draggable-next'
import ImgurSearchVue from '../widgets/Imgur/ImgurSearch.vue'
import { Button } from 'primevue/button'
  export default defineComponent({
    components: {
      ImgurSearchVue,
      draggable: VueDraggableNext,
    },
    data() {
      return {
        enabled: true,
        list: [
          ImgurSearchVue,
          ImgurSearchVue,
          // ImgurSearchVue,
          // ImgurSearchVue,
          // ImgurSearchVue,
          // ImgurSearchVue,
          ImgurSearchVue,
        ],
        dragging: false,
      }
    },
    methods: {
      log(event) {
        console.log(event)
      },
    },
  })
</script>
<style scoped>
#test {
  flex-direction: row;
  flex-wrap: wrap;
}
</style>