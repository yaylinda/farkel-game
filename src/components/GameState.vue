<template>
  <div class="game-state-component">
      <div class="game-stats-section">
        <div>It is currently {{currentTurnPlayer.displayName}}'s turn.</div>
        <md-chip>Score: {{game.diceManager.diceScore}}</md-chip>

      </div>

      <div class="game-dice-section md-layout md-alignment-center-space-between">
        <DieComponent class="md-layout-item md-size-30"
          v-for="(d, i) in game.diceManager.dice" 
          @dieToggle="handleDieToggle(i)"
          :die="d"
          :key="(d, i)" 
          :initialDisable="false"
        />
      </div>

      <div class="game-action-buttons">
        <md-tooltip v-if="!isMyTurn">These buttons are disabled when it is not your turn</md-tooltip>
        <md-button :disabled="!isMyTurn" @click="handleActionButtonClick('ROLL_DICE')">Roll</md-button>
        <md-button :disabled="!isMyTurn" @click="handleActionButtonClick('STAY')">Stay</md-button>
        <md-button :disabled="!isMyTurn" @click="handleActionButtonClick('COMMIT')">COMMIT</md-button>
      </div>

  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Game, GameActor } from "@/model/game.model";
import { GAME_ACTIONS } from "@/utilities/Constants";
import DieComponent from "@/components/DieComponent.vue";

@Component({
  components: {
    DieComponent
  }
})
export default class GameState extends Vue {

  LOGGING_CLASS_NAME: string = "[GameBoard]";

  @Prop() game!: Game;
  @Prop() me: GameActor | undefined;

  get isMyTurn() {
    return this.game.currentTurnPlayerId === this.me!.actorId;
  }

  get currentTurnPlayer() {
      return this.game.actorsMap[this.game.currentTurnPlayerId];
  }

  handleActionButtonClick(action: string) {
    this.$emit('doGameAction', action, null, action === 'COMMIT' ? false : true);
  }

  handleDieToggle(index: number) {
    console.log('handleDieToggle index:', index);
    const keeps = this.game.diceManager.dice.map(d => d.keep);
    this.$emit('doGameAction', 'CHOOSE_DICE', { keeps: keeps }, true);
  }
}
</script>

<style lang="scss" scoped>
.game-board-component {
    border: 1px black solid;
}
</style>