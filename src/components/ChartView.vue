<template>
  <div>
    <h3>{{ item.name }} のステータスチャート</h3>
    <Line :data="chartData" :options="chartOptions" />
    <v-btn @click="$emit('back')">戻る</v-btn>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement)

const props = defineProps({
  item: Object
})

const chartData = computed(() => ({
  labels: ['A', 'B', 'C'],
  datasets: [
    {
      label: 'ダミーデータ',
      data: [10, 20, props.item.status === 'ok' ? 30 : 5],
      borderColor: 'blue',
      backgroundColor: 'lightblue',
    },
  ],
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false
}
</script>
