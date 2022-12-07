<template>
  <div id="game">
    <section id="monster" class="container">
      <h2>Monster Health</h2>
      <div class="healthbar">
        <div class="healthbar__value" :style="monsterStyleBar"></div>
      </div>
    </section>
    <section id="player" class="container">
      <h2>Your Health</h2>
      <div class="healthbar">
        <div class="healthbar__value" :style="playerStyleBar"></div>
      </div>
    </section>
    <section class="container" v-if="winner">
      <h2>Game Over</h2>
      <h3 v-if="winner === 'monster'">You lost!</h3>
      <h3 v-else-if="winner === 'player'">You win!</h3>
      <h3 v-else>draw</h3>
    </section>
    <section id="controls" v-else>
      <button @click="attackMonster">ATTACK</button>
      <button :disabled="canUseSpecialAttack" @click="specialAttackMonster">SPECIAL ATTACK</button>
      <button @click="healPlayer">HEAL</button>
      <button @click="surrender">SURRENDER</button>
      <button @click="startGame">Restart Game</button>
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
const rounds = ref(0)
const winner = ref(null)

const attackMonster = () => {
  monsterHealth.value -= randomValue(12, 5)
  attackPlayer()
  rounds.value++
}

const specialAttackMonster = () => {
  rounds.value++
  monsterHealth.value -= randomValue(25, 10)
  attackPlayer()
}

const attackPlayer = () => {
  playerHealth.value -= randomValue(18, 8)
}

const healPlayer = () => {
  const healValue = randomValue(20, 8)
  if (playerHealth.value + healValue > 100 ) {
    playerHealth.value = 100
  }
  else {
    playerHealth.value += healValue
  }
}

const surrender = () => {
  winner.value = 'monster'
}

const randomValue = (max, min) => {
  return Math.floor(Math.random() * (max - min)) + min
}

const startGame =  () => {
  playerHealth.value = 100
  monsterHealth.value = 100
  rounds.value = 0
  winner.value = null
}

watch(playerHealth, (newPlayerHealth, oldPlayerHealth) => {
      if(newPlayerHealth<=0 && monsterHealth.value <=0) {
        // a draw
        winner.value = "draw"
      }
      else if(newPlayerHealth<=0) {
        // player lost
        winner.value = "monster"
      }
    }
)

watch(monsterHealth, (newMonsterHealth, oldMonsterHealth) => {
      if(newMonsterHealth<=0 && playerHealth.value <=0) {
        // a draw
        winner.value = "draw"
      }
      else if(newMonsterHealth<=0){
        // monster lost
        winner.value = "player"
      }
    }
)

const monsterStyleBar = computed(
    () => {
      return (monsterHealth.value <= 0) ? { width:'0%' } : {width: monsterHealth.value + '%'}
    }
)

const playerStyleBar = computed(
    () => {
      return (playerHealth.value <= 0) ? { width:'0%' } : {width: playerHealth.value + '%'}
    }
)

const canUseSpecialAttack = computed(
    () => {
      return rounds.value%3!==0 || rounds.value==0
    }
)

</script>
