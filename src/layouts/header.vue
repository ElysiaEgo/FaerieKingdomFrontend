<template>
  <n-layout-header bordered>
    <n-button text @click="router.go(0)">
      <icon type="refresh" size="20" :depth="2" />
    </n-button>
    <n-space :size="20" align="center" style="line-height: 1">
      <n-dropdown placement="bottom-end" show-arrow :options="options" @select="handleOptionsSelect">
        <n-avatar size="small" round :src="avatarUrl" />
      </n-dropdown>
    </n-space>
  </n-layout-header>
</template>

<script lang="ts" setup>
import { h, computed } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { Icon } from '../components'
import avatarUrl from '../assets/avatar.jpg'

const router = useRouter()

const options = computed(() => [
  { key: 'profile', label: () => h(RouterLink, { to: '/profile' }, () => ('Your Profiles')) },
  { key: 'divider', type: 'divider' },
  { key: 'logout', label: 'Sign out' }
])

const handleOptionsSelect = async (key: unknown): Promise<void> => {
  if (key as string === 'logout') {
    localStorage.removeItem('token')
    localStorage.removeItem('userid')
    await router.replace({ name: 'login' })
  }
}
</script>

<style scoped>
.n-layout-header {
  position: sticky;
  top: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  padding: 9px 18px;
}

.n-button {
  margin-right: 15px;
}

.n-space {
  margin-left: auto;
}
</style>
