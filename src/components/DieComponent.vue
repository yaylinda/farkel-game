<template>
  <div class="dice-component">

    <!-- <md-tooltip v-if="!!!enabled">You are not allowed to select dice at the moment</md-tooltip> -->

    <div class="dice-face">
      {{ die.value ? die.value : '?' }}
    </div>
    <div class="selection">
      <md-switch
        v-if="die.value && enabled"
        @change="$emit('dieToggle')" 
        v-model="die.keep"
        :disabled="!die.usedForDiceScore"
      ></md-switch>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Game, GameActor, Die } from "@/model/game.model";
import { GAME_ACTIONS } from "@/utilities/Constants";

@Component({
  components: {}
})
export default class DieComponent extends Vue {
  LOGGING_CLASS_NAME: string = "[Die]";

  @Prop() die!: Die;
  @Prop() enabled!: boolean;

}
</script>

<style lang="scss" scoped>
.dice-component {
  align-content: center;
}
.dice-face {
  height: 5rem;
  width: 5rem;
  border: 3px black solid;
  border-radius: 1rem;
  margin: auto;
  text-align: center;
  vertical-align: center;
}

</style>