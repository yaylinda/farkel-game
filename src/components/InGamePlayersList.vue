<template>
  <div class="in-game-players-list-component">
    <md-list class="full-height md-double-line">
      <md-subheader>Players</md-subheader>

      <!-- List Row for each Player -->
      <md-list-item v-for="(p, i) in players" :key="(p, i)">
        <md-icon v-if="isTurn(p.actorId)" :style="{ color: 'green' }">
          <md-tooltip>It is {{p.displayName}}'s turn</md-tooltip>
          <i class="fa fa-circle" />
        </md-icon>
        <md-icon v-else :style="{ color: 'gray' }">
          <i class="fa fa-circle" />
        </md-icon>

        <div class="md-list-item-text">
          <span>{{p.displayName}} <span v-if="p.cookie === me.cookie">(You)</span></span>
          <span>Score: {{p.score}}</span> 
        </div>

      </md-list-item>
    </md-list>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Game, GameActor } from "@/model/game.model";
import { GAME_ACTIONS } from "@/utilities/Constants";

@Component({
  components: {}
})
export default class InGamePlayersList extends Vue {
  LOGGING_CLASS_NAME: string = "[InGamePlayersList]";

  @Prop() game!: Game;
  @Prop() me: GameActor | undefined;

  get players(): GameActor[] {
    const players = [];
    for (let pid of this.game.playersOrder) {
      players.push(this.game.actorsMap[pid]);
    }
    return players;
  }

  isTurn(playerId: string): boolean {
    return playerId === this.game.currentTurnPlayerId;
  }

  isAboutToWin(playerId: string): boolean {
    return playerId === this.game.aboutToWinPlayerId;
  }

  isOnBoard(playerScore: number): boolean {
    return playerScore >= this.game.gameConfiguration.pointsToGetOnBoard;
  }
}
</script>

<style lang="scss" scoped>
.full-height {
  height: 100%;
}
</style>