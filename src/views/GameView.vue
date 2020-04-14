<template>
  <div class="game-view">
    <div class="game-header-section">
      <md-toolbar>
        <h3 class="md-title">Farkel Game</h3>
      </md-toolbar>
    </div>

    <div class="game-content-section">
      <div v-if="loading" class="game-loading-spinner">
        <md-progress-spinner :md-diameter="100" :md-stroke="10" md-mode="indeterminate" />
      </div>

      <div v-if="!loading" class="game-data-section">
        <md-card class="md-primary">
          <md-card-header>
            <md-card-header-text>
              <div class="md-title">
                <div>{{game.gameId}}</div>
              </div>
              <div class="md-subhead">
                <div>Game Phase: {{game.gamePhase}}</div>
                <div>{{gameMasterStatement}}</div>
              </div>
            </md-card-header-text>
          </md-card-header>
        </md-card>

        <div class="md-layout md-gutter">
          <ObserversList
            class="md-layout-item"
            @joinGame="joinGame"
            :actors="observers"
            :cookie="cookie"
          />

          <PlayersList
            class="md-layout-item"
            @readyToStart="readyToStart"
            :actors="players"
            :cookie="cookie"
          />

          <ActionsList class="md-layout-item" :actions="actions" :cookie="cookie" />
        </div>

        <ActionsBar />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import {
  FARKLE_GAME_COOKIE,
  WAITING_GAME_PHASE,
  GAME_ACTIONS,
  HTTP_METHODS
} from "@/utilities/Constants";
import { v4 as uuidv4 } from "uuid";
import { Game, GameActor, GameActionLogEntry } from "@/model/game.model";
import ActionsList from "@/components/ActionsList.vue";
import ObserversList from "@/components/ObserversList.vue";
import PlayersList from "@/components/PlayersList.vue";
import ActionsBar from "@/components/ActionsBar.vue";
import { HttpOptions, HttpResponse } from "vue-resource/types/vue_resource";

const HOST: string = "http://localhost:8080/farkel-backend";
const LOGGING_CLASS_NAME: string = "[GAME]";

@Component({
  components: {
    ActionsList,
    ObserversList,
    PlayersList,
    ActionsBar
  }
})
export default class GameView extends Vue {
  WAITING_PHASE_CONST: string = WAITING_GAME_PHASE;

  game: Game = new Game();
  cookie: string = "";
  headers: any = {};
  loading: boolean = true;

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

  get actions(): GameActionLogEntry[] {
    const actions: GameActionLogEntry[] = [];
    return this.game.actionLogs;
  }

  get me(): GameActor {
    return this.game.cookiesMap[this.cookie];
  }

  get isGameMaster(): boolean {
    return this.me.actorId === this.game.gameMasterPlayerId;
  }

  get gameMasterStatement(): string {
    if (this.isGameMaster) {
      return "You are the GameMaster";
    }

    const gameMaster = this.game.actorsMap[this.game.gameMasterPlayerId];
    const gameMasterDisplayName = gameMaster.displayName
      ? gameMaster.displayName
      : "???";

    return `Your GameMaster is ${gameMasterDisplayName}`;
  }

  mounted() {
    console.log(`${LOGGING_CLASS_NAME} - mounted`);
    this.initializeCookieAndHeaders();
    this.getGame(HTTP_METHODS.GET, `${HOST}/games/${this.$route.params.gameId}`, null);
  }

  initializeCookieAndHeaders() {
    this.cookie = this.$cookies.get(FARKLE_GAME_COOKIE);
    console.log(
        `${LOGGING_CLASS_NAME} - mounted - using existing cookie ${this.cookie}`
      );

    if (!this.cookie) {
      this.cookie = uuidv4();
      console.log(
        `${LOGGING_CLASS_NAME} - mounted - new cookie generated as ${this.cookie}`
      );
      this.$cookies.set(FARKLE_GAME_COOKIE, this.cookie);
    }

    this.headers = {
      [FARKLE_GAME_COOKIE]: this.cookie
    }
  }

  joinGame(actorId: string, displayName: string) {
    const url = `${HOST}/games/${this.$route.params.gameId}/actions/${actorId}`;

    const body = {
      actorId: actorId,
      gameAction: GAME_ACTIONS.JOIN_AS_PLAYER,
      metadata: {
        displayName: displayName
      }
    };

    this.getGame(HTTP_METHODS.PUT, url, body);
  }

  readyToStart(actorId: string) {
    const url = `${HOST}/games/${this.$route.params.gameId}/actions/${actorId}`;

    const body = {
      actorId: actorId,
      gameAction: GAME_ACTIONS.READY_TO_PLAY,
      metadata: { }
    };

    this.getGame(HTTP_METHODS.PUT, url, body);
  }

  getGame(httpMethod: string, url: string, body: any | undefined) {
    console.log(
      `${LOGGING_CLASS_NAME} - [${httpMethod}] url=${url}, cookie=${this.cookie}, body=${body}`
    );

    this.loading = true;

    let protocol: PromiseLike<HttpResponse> | null = null;

    if (httpMethod === HTTP_METHODS.GET) {
      protocol = this.$http.get(url, { headers: this.headers });
    } else if (httpMethod === HTTP_METHODS.PUT) {
      protocol = this.$http.put(url, body, { headers: this.headers });
    }

    if (!protocol) {
      console.error("Unknown or unimplemented http method: " + httpMethod);
      this.loading = false;
    }

    (protocol!).then(
      result => {
        if (result.ok && result.data) {
          console.log(
            `${LOGGING_CLASS_NAME} - getGame - SUCCESS`
          );
          this.game = result.data;
        } else {
          console.log(
            `${LOGGING_CLASS_NAME} - getGame - ERROR`
          );
          throw new Error(JSON.stringify(result));
        }
        this.loading = false;
      },
      error => {
        // TODO - show error in a friendly way to user
        console.log(error);
      }
    );
  }
}
</script>

<style lang="scss" scoped>
.game-content-section {
  padding: 1rem;
}
</style>