<template>
  <v-container>
    <h2>{{ name }} の詳細ページ</h2>
    <v-btn @click="$router.back()">戻る</v-btn>
  </v-container>
</template>

<script setup>
import { defineProps } from 'vue'

const { name } = defineProps(['name'])
</script>
