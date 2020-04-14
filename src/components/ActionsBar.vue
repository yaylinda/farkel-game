<template>
  <div class="actions-bar-component">

  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
// import { Game, GameActionLogEntry } from "@/model/game.model";

@Component({
  components: {}
})
export default class ActionsBar extends Vue {
  LOGGING_CLASS_NAME: string = "[ActionsBar]";

  constructor() {
    super();
    console.log(`${this.LOGGING_CLASS_NAME} - constructor`);
  }
}
</script>

<style lang="scss" scoped>

</style>