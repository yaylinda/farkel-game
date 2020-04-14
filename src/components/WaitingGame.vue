<template>
  <div class="waiting-game-component">
    <h3>Game ID: {{game.gameId}}</h3>

    <div class="waiting-game-actor-list-section">
      <md-card> 
          // list of observers
        </md-card>

        <md-card>
            // list of players
        </md-card>

        <md-card>
            // list of logs
        </md-card>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Game, GameActor } from "@/model/game.model";
import ObserversList from "@/components/ObserversList.vue";
import PlayersList from "@/components/PlayersList.vue";

@Component({
  components: {
    ObserversList,
    PlayersList
  }
})
export default class WaitingGame extends Vue {
  LOGGING_CLASS_NAME: string = "[WaitingGame]";

  @Prop() game!: Game;

  get observers(): GameActor[] {
    const observers: GameActor[] = [];
    this.game.observersRoster.forEach((id: string) =>
      observers.push(this.game.actorsMap[id]!)
    );
    return observers;
  }

  get players(): GameActor[] {
    const players: GameActor[] = [];
    this.game.playersRoster.forEach(id =>
      players.push(this.game.actorsMap[id]!)
    );
    return players;
  }

  constructor() {
    super();
    console.log(`${this.LOGGING_CLASS_NAME} - constructor`);
  }

  mounted() {
    console.log(`${this.LOGGING_CLASS_NAME} - mounted`);
  }
}
</script>

<style lang="scss" scoped>
.waiting-game-component {
  padding: 1rem;
}

.waiting-game-actor-list-section {
  display: flex;
  flex-direction: row;
}
</style>