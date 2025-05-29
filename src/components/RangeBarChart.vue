<template>
  <apexchart
    type="rangeBar"
    height="350"
    :options="chartOptions"
    :series="series"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import VueApexCharts from 'vue3-apexcharts'

export default defineComponent({
  name: 'RangeBarChart',
  components: { apexchart: VueApexCharts },
  props: {
    items: {
      type: Array as () => {
        name: string
        data: { x: string; y: [number, number] }[]
      }[],
      required: true
    }
  },
  data() {
    return {
      chartOptions: {
        chart: {
          type: 'rangeBar',
          height: 350
        },
        plotOptions: {
          bar: {
            horizontal: true,
            barHeight: '60%'
          }
        },
        xaxis: {
          type: 'numeric', // 時刻（数値） or type: 'datetime' にも変更可能
          title: { text: '時間' }
        },
        tooltip: {
          custom({ series, seriesIndex, dataPointIndex, w }) {
            const range = w.globals.initialSeries[seriesIndex].data[dataPointIndex].y
            return `範囲: ${range[0]} ～ ${range[1]}`
          }
        }
      }
    }
  },
  computed: {
    series() {
      return this.items
    }
  }
})
</script>
