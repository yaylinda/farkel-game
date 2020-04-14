<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <a href="rules.pdf" target="_blank">Rules</a>
    </div>
    <router-view/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class App extends Vue {

  public $material: any;

  constructor() {
    super();
    console.log('App constructor');
    console.log(`Running in ${process.env.NODE_ENV}`);
  }

  public mounted() {
    console.log('App mounted');
  }

}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
