<template>
  <v-container class="d-flex align-center" style="width: 100%;">
    <v-select
      v-model="selectedType"
      :items="typeOptions"
      label="センサー種別"
      dense
      outlined
      style="max-width: 150px; margin-right: 16px"
    />
    <div style="flex: 1;">
      <apexchart
        type="rangeBar"
        height="300"
        :options="chartOptions"
        :series="chartSeries"
        :key="chartKey"
      />
    </div>
  </v-container>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeUnmount, onMounted, ref } from 'vue';
import VueApexCharts from 'vue3-apexcharts';

export default defineComponent({
  name: 'SensorOnOffChart',
  components: {
    apexchart: VueApexCharts
  },
  props: {
    data: {
      type: Object as () => Record<string, any[]>,
      required: true
    },
    timeRange: {
      type: Object as () => { min: number; max: number },
      required: true
    },
    missileRange: {
      type: Object as () => { start: number; end: number },
      required: true
    }
  },
  setup(props) {
    const selectedType = ref('typeA')
    const typeOptions = Object.keys(props.data)

    const chartKey = ref(0)
    let intervalId: number
    onMounted(() => {
      intervalId = window.setInterval(() => {
        chartKey.value++
      }, 1000)
    })

    onBeforeUnmount(() => {
      clearInterval(intervalId)
    })

    const chartSeries = computed(() => {
      return props.data[selectedType.value] || []
    })

    const chartOptions = computed(() => {
      return {
        chart: {
          type: 'rangeBar',
          toolbar: { show: false },
          zoom: { enabled: false },
          height: 300,
          animations: {
            enabled: false
          }
        },
        plotOptions: {
          bar: {
            horizontal: true,
            rangeBarGroupRows: true
          }
        },
        grid: {
          padding: {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0
          }
        },
        xaxis: {
          type: 'datetime',
          min: props.missileRange.start,
          max: props.missileRange.end,
          labels: {
            datetimeUTC: false,
            format: 'HH:mm'
          }
        },
        tooltip: {
          x: {
            format: 'yyyy-MM-dd HH:mm'
          }
        },
        title: {
          text: ''
        }
      }
    })

    return {
      selectedType,
      typeOptions,
      chartSeries,
      chartOptions,
      chartKey
    }
  }
})
</script>
