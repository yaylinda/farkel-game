<template>
  <div class="observers-list-component">

        <div class="md-title">Observers</div>
        <div
          class="md-subhead"
        >People observing this Farkel Game</div>

      <md-card-content>
        <div>
         <div v-if="isObserver">
           You are currently observing this game. Press "Join" to play!
         </div>
        <div>
          There are currently {{others.length}} other people observing this game.
        </div>
        </div>
      </md-card-content>
    </md-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Game, GameActor } from "../model/game.model";

@Component({
  components: {}
})
export default class ObserversList extends Vue {
  LOGGING_CLASS_NAME: string = "[ObserversList]";

  @Prop() observers!: GameActor[];
  @Prop() cookie!: string;

  get isObserver(): boolean {
    for (let o of this.observers) {
      if (o.cookie === this.cookie) {
        return true;
      }
    }
    return false;
  }

  get others(): GameActor[] {
    return this.observers.filter((o) => o.cookie !== this.cookie);
  }

  constructor() {
    super();
    console.log(`${this.LOGGING_CLASS_NAME} - constructor`);
  }

  isMe(observer: GameActor): boolean {
    return observer.cookie === this.cookie;
  }
}
</script>

<style lang="scss" scoped>
</style>