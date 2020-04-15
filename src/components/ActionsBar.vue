<template>
  <div class="actions-bar-component">

    <div v-if="game.gamePhase === 'WAITING'">
      <md-button @click="clickStartGame" class="md-raised md-primary">Start Game</md-button>
    </div>

    <div v-else-if="game.gamePhase === 'PLAYING'">

    </div>

    <div v-else-if="game.gamePhase === 'COMPLETED'">

    </div>

    <md-dialog-alert
      :md-active.sync="showStartGameDialog"
      md-title="Start Game"
      :md-content="startGameDialogContent"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Game } from '../model/game.model';
import { GAME_ACTIONS } from '@/utilities/Constants';

@Component({
  components: {}
})
export default class ActionsBar extends Vue {
  LOGGING_CLASS_NAME: string = "[ActionsBar]";

  @Prop() game!: Game;
  @Prop() cookie!: string;
  @Prop() isGameMaster!: boolean;
  @Prop() isMyTurn!: boolean;

  showStartGameDialog: boolean = false;
  startGameDialogContent: string = '';

  get isStartGameEnabled(): boolean {
    let numReady = 0;
    for (let playerId of this.game.playersRoster) {
      let player = this.game.actorsMap[playerId];
      if (player.playerReady) {
        numReady += 1;
      }
    }
    return numReady >= this.game.gameConfiguration.minNumPlayers;
  }

  constructor() {
    super();
    console.log(`${this.LOGGING_CLASS_NAME} - constructor`);
  }

  clickStartGame() {
    let numReady = 0;
    for (let playerId of this.game.playersRoster) {
      let player = this.game.actorsMap[playerId];
      if (player.playerReady) {
        numReady += 1;
      }
    }

    if (numReady >= this.game.gameConfiguration.minNumPlayers && this.isGameMaster) {
      this.$emit('doGameAction', GAME_ACTIONS.START_GAME, {});
      return;
    }
    
    if (!this.isGameMaster) {
      this.showStartGameDialog = true;
      this.startGameDialogContent = 'Only the GameMaster can start the game';
      return;
    }

    if (numReady < this.game.gameConfiguration.minNumPlayers) {
      this.showStartGameDialog = true;
      this.startGameDialogContent = `Need at least ${this.game.gameConfiguration.minNumPlayers} ready Players in order to start the game`;
      return;
    }
  }
}
</script>

<style lang="scss" scoped>
.actions-bar-component {
  border-width: 1px;
  border-color: black;
  border-style: solid;
}

</style>