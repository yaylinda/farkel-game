<template>
  <div class="game-state-component">

    <div class="game-message">
      <md-divider></md-divider>
      <md-subheader>It is {{currentTurnPlayer.displayName}}'s turn</md-subheader>
      <md-divider></md-divider>
      <md-subheader>{{game.lastActor}} did {{game.lastPerformedAction}}</md-subheader>
      <md-divider></md-divider>
      <md-subheader>Cumulative Turn Score: {{game.cumulativeTurnScore}}</md-subheader>
      <md-divider></md-divider>
    </div>

      <div v-if="availableButton('BROADCAST_CHOOSE_DICE') && (game.lastPerformedAction === 'COMMIT_ROLL_DICE' || game.lastPerformedAction === 'BROADCAST_CHOOSE_DICE')">
        <md-divider></md-divider>
        <md-subheader v-if="isMyTurn">Select which dice to keep and score</md-subheader>
        <md-subheader v-else>{{currentTurnPlayer.displayName}} is selecting dice</md-subheader>
        <md-divider></md-divider>
      </div>

    <div class="game-dice-section md-layout md-alignment-center-space-between">
      <DieComponent
        class="md-layout-item md-size-30"
        v-for="(d, i) in game.diceManager.dice"
        @dieToggle="handleDieToggle(i)"
        :die="d"
        :key="(d, i)"
        :enabled="availableButton('BROADCAST_CHOOSE_DICE') && isMyTurn"
      />
    </div>

    <div class="game-action-buttons">
      <md-tooltip v-if="!isMyTurn">It is not your turn</md-tooltip>
      <div v-for="(actionButton, i) in inGameActionButtons" :key="(actionButton, i)">
        <md-button
          @click="handleActionButtonClick(actionButton.id)"
          :disabled="!isMyTurn || !availableButton(actionButton.id)"
        >{{actionButton.buttonText}}</md-button>
      </div>
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

  inGameActionButtons: any[] = [
    { id: "BROADCAST_ROLL_DICE", buttonText: "BROADCAST_ROLL_DICE" },
    { id: "COMMIT_ROLL_DICE", buttonText: "COMMIT_ROLL_DICE" },
    { id: "COMMIT_CHOOSE_DICE", buttonText: "COMMIT_CHOOSE_DICE" },
    { id: "BROADCAST_STAY", buttonText: "BROADCAST_STAY" },
    { id: "COMMIT_STAY", buttonText: "COMMIT_STAY" }
  ];

  get isMyTurn() {
    return this.game.currentTurnPlayerId === this.me!.actorId;
  }

  get currentTurnPlayer() {
    return this.game.actorsMap[this.game.currentTurnPlayerId];
  }

  availableButton(actionButtonId: string): boolean {
    return this.game.availableActions.indexOf(actionButtonId) > -1;
  }

  handleActionButtonClick(actionButtonId: string) {
    console.log(
      `${this.LOGGING_CLASS_NAME} handleActionButtonClick actionButtonId: ${actionButtonId}`
    );

    let metadata = null;

    if (actionButtonId === "COMMIT_CHOOSE_DICE") {
      const keeps = this.game.diceManager.dice.map(d => d.keep);
      metadata = { keeps: JSON.stringify(keeps) }
    }

    this.$emit("doGameAction", actionButtonId, metadata);
  }

  handleDieToggle(index: number) {
    console.log(`${this.LOGGING_CLASS_NAME} handleDieToggle index: ${index}`);
    const keeps = this.game.diceManager.dice.map(d => d.keep);
    this.$emit("doGameAction", "BROADCAST_CHOOSE_DICE", { keeps: JSON.stringify(keeps) });
  }
}
</script>

<style lang="scss" scoped>
.game-board-component {
  border: 1px black solid;
}
