<template>
  <v-navigation-drawer v-model="drawer">
    <v-list density="compact" item-props :items="items" nav />

    <template #append>
      <v-list-item
        class="ma-2"
        prepend-icon="mdi-cog"
        title="Settings"
        nav
        @click=""
      />
    </template>
  </v-navigation-drawer>
</template>

<script setup>
  import { ref } from 'vue'

  const drawer = defineModel({ default: false })

  const items = ref([
    { title: 'Dashboard', prependIcon: 'mdi-view-dashboard', href: '#todo1' },
    { title: 'Calendar', prependIcon: 'mdi-calendar', href: '#todo2' },
    { title: 'Reports', prependIcon: 'mdi-file', href: '#todo3' },
  ])
</script>
