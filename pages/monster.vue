<template>
  <div id="game">
    <section id="monster" class="container">
      <h2>Monster Health</h2>
      <div class="healthbar">
        <div class="healthbar__value" :style="{width: monsterHealth+'%'}"></div>
      </div>
    </section>
    <section id="player" class="container">
      <h2>Your Health</h2>
      <div class="healthbar">
        <div class="healthbar__value" :style="{width: playerHealth+'%'}"></div>
      </div>
    </section>
    <section id="controls">
      <button @click="attackMonster">ATTACK</button>
      <button>SPECIAL ATTACK</button>
      <button>HEAL</button>
      <button>SURRENDER</button>
    </section>
    <section id="log" class="container">
      <h2>Battle Log</h2>
      <ul></ul>
    </section>
  </div>
</template>

<script setup>
import "@/assets/css/monster.css";

const playerHealth = ref(100)
const monsterHealth = ref(100)

const attackMonster = () => {
  monsterHealth.value -= randomAttackValue(12, 5)
  attackPlayer()
  console.log(playerHealth.value)
  console.log(monsterHealth.value)
}

const attackPlayer = () => {
  playerHealth.value -= randomAttackValue(18, 8)
}

let randomAttackValue = (max, min) => {
  return Math.floor(Math.random() * (max - min)) + min
}

</script>
