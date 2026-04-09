<template>
  <v-app-bar border="b" class="ps-4" flat>
    <v-app-bar-nav-icon v-if="$vuetify.display.mobile" @click="$emit('toggle:sidebar')" />

    <v-app-bar-title>Application</v-app-bar-title>

    <template #append>
      <v-btn class="text-none me-2" height="48" icon slim>
        <v-avatar color="surface-light" icon="mdi-account" size="32" />

        <v-menu activator="parent">
          <v-list density="compact" nav>
            <v-list-item append-icon="mdi-logout" link title="Logout" />
          </v-list>
        </v-menu>
      </v-btn>
    </template>
  </v-app-bar>
</template>

<script setup>
  defineEmits(['toggle:sidebar'])
</script>
