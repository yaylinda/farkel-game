<template>
    <div class="home-view">
      <GoToGame />
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import GoToGame from "@/components/GoToGame.vue";

@Component({
  components: {
    GoToGame
  }
})
export default class Home extends Vue {
  LOGGING_CLASS_NAME: string = "[HOME]";

  constructor() {
    super();
    console.log(`${this.LOGGING_CLASS_NAME} - constructor`);
  }
}
</script>

<style lang="scss" scoped>
.home-view {
  padding: 1rem;
}
</style>