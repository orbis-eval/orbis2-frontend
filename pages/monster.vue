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
      <ul>
        <li v-for="log in logs">
          <span :class="{'log--player':log.actionBy === 'player','log--monster':log.actionBy === 'monster'}">
            {{log.actionBy === 'player' ? 'Player':'Monster'}}
          </span>
          <span v-if="log.actionType === 'heal'" class="log--heal"> heals himself for <span class="log--heal">{{log.actionValue}}</span>
          </span>
          <span v-else>
            attacks and deals <span class="log--damage">{{log.actionValue}}</span>
          </span>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup>
import "@/assets/css/monster.css";

const playerHealth = ref(100)
const monsterHealth = ref(100)
const rounds = ref(0)
const winner = ref(null)

const logs = ref([])

const attackMonster = () => {
  let randomAttackValue = randomValue(12, 5);
  monsterHealth.value -= randomAttackValue
  addLogMessage('player', 'attack', randomAttackValue)
  attackPlayer()
  rounds.value++
}

const specialAttackMonster = () => {
  rounds.value++
  let randomAttackValue = randomValue(25, 10);
  monsterHealth.value -= randomAttackValue
  addLogMessage('player', 'special-attack', randomAttackValue)
  attackPlayer()
}

const attackPlayer = () => {
  let randomAttackValue = randomValue(18, 8);
  addLogMessage('monster', 'attack', randomAttackValue)
  playerHealth.value -= randomAttackValue
}

const healPlayer = () => {
  const healValue = randomValue(20, 8)
  addLogMessage('player', 'heal', healValue)
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
  logs.value = []
}

const addLogMessage = (who, what, value) => {
  logs.value.unshift({
    actionBy: who,
    actionType: what,
    actionValue: value
  })
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
