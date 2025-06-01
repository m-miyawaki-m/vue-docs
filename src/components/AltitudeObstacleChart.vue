<template>
  <apexchart
    type="line"
    height="350"
    :options="chartOptions"
    :series="chartSeries"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import VueApexCharts from 'vue3-apexcharts'

export default defineComponent({
  name: 'AltitudeObstacleChart',
  components: {
    apexchart: VueApexCharts
  },
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
  computed: {
    chartOptions(): any {
      return {
        chart: {
          type: 'line',
          height: 350,
          toolbar: { show: false },
          zoom: { enabled: false }
        },
        stroke: {
          width: [3, 2],
          curve: 'smooth'
        },
        fill: {
          type: ['solid', 'gradient'],
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.4,
            opacityTo: 0.1,
            stops: [0, 90, 100]
          }
        },
        markers: {
          size: 5,
          discrete: [
            {
              seriesIndex: 0, // 高度の線
              size: 5
            },
            {
              seriesIndex: 1, // 障害物にはポイント非表示
              size: 0
            }
          ]
        },
        colors: ['#2196F3', '#F48FB1'],
        xaxis: {
          categories: this.timeLabels,
          title: {
            text: '時間'
          }
        },
        yaxis: {
          title: {
            text: '高度 / 障害物'
          }
        },
        legend: {
          position: 'top'
        },
        
      }
    },
    chartSeries(): any[] {
      return [
        {
          name: '高度',
          type: 'line',
          data: this.altitudeData
        },
        {
          name: '障害物',
          type: 'area',
          data: this.obstacleData
        }
      ]
    }
  }
})
</script>
