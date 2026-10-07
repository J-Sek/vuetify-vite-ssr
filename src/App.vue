<template>
  <v-app>
    <AppSidebar v-model="drawer" />

    <AppHeader @toggle:sidebar="drawer = !drawer" />

    <v-main>
      <HelloWorld />
    </v-main>

    <v-btn
      class="ma-2"
      icon="mdi-theme-light-dark"
      location="bottom right"
      position="absolute"
      @click="$vuetify.theme.cycle()"
    />
  </v-app>
</template>

<script setup>
  import { ref } from 'vue'
  import AppHeader from '@/components/AppHeader.vue'
  import AppSidebar from '@/components/AppSidebar.vue'
  import HelloWorld from '@/components/HelloWorld.vue'

  const drawer = ref()
</script>
