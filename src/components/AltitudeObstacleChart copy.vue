<template>
  <v-card>
    <v-card-title>飛行経路と障害物</v-card-title>
    <v-card-text>
      <canvas ref="canvasRef"></canvas>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import {
  CategoryScale,
  Chart,
  Filler,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Title,
  Tooltip
} from 'chart.js'
import { defineComponent, onMounted, ref } from 'vue'

Chart.register(LineController, LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend, Filler)

export default defineComponent({
  name: 'AltitudeObstacleChart',
  props: {
    timeLabels: {
      type: Array as () => string[],
      required: true
    },
    altitudeData: {
      type: Array as () => number[],
      required: true
    },
    obstacleData: {
      type: Array as () => number[],
      required: true
    }
  },
  setup(props) {
    const canvasRef = ref<HTMLCanvasElement | null>(null)

    onMounted(() => {
      if (canvasRef.value) {
        const maxAltitude = Math.max(...props.altitudeData)
        const yMax = Math.ceil(maxAltitude * 1.1)

        new Chart(canvasRef.value, {
          type: 'line',
          data: {
            labels: props.timeLabels,
            datasets: [
              {
                label: '高度',
                data: props.altitudeData,
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.1)',
                tension: 0.3,
                fill: false,
                pointRadius: 0
              },
              {
                label: '障害物',
                data: props.obstacleData,
                borderColor: 'rgba(255, 99, 132, 0.8)',
                backgroundColor: 'rgba(255, 99, 132, 0.3)',
                fill: 'origin',
                tension: 0.3,
                pointRadius: 0
              }
            ]
          },
          options: {
            responsive: true,
            plugins: {
              legend: { position: 'top' },
              title: { display: true, text: '飛行高度と障害物の推移' }
            },
            scales: {
              y: {
                beginAtZero: true,
                suggestedMax: yMax
              }
            }
          }
        })
      }
    })

    return {
      canvasRef
    }
  }
})
</script>