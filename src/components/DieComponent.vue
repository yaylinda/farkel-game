<template>
  <div class="dice-component">
    <div :class="`dice-face md-elevation-12 ${die.keep ? 'keep' : 'not-keep'}`">
      <div class="dice-value">{{ die.value ? die.value : '?' }}</div>
    </div>
    <div class="selection">
      <md-switch
        v-if="die.value && enabled"
        @change="$emit('dieToggle')" 
        v-model="die.keep"
        :disabled="!die.eligible"
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
.keep {
  border: 1px green solid;
}
.not-keep {
  border: 1px gray solid;
}
.dice-component {
  align-content: center;
}
.dice-face {
  display: flex;
  height: 5rem;
  width: 5rem;
  border-radius: 1rem;
  margin: auto;
  justify-content: center;
  align-items: center;
}
.dice-value {
  display: flex;
  height: 2rem;
  width: 2rem;
  border-radius: 50%;
  background-color: lightgray;
  justify-content: center;
  align-items: center;
}
</style>