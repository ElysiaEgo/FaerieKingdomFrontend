<template>
  <n-layout-sider
    :width="220" :native-scrollbar="false" :collapsed="collapsed" collapse-mode="width" show-trigger="bar" bordered
    @update:collapsed="toggle"
  >
    <router-link to="/" #="{ navigate, href }" custom>
      <n-a class="logo" :href="href" @click="navigate">
        <span>Faerie Kingdom</span>
      </n-a>
    </router-link>
    <n-menu :value="currentKey" :default-expanded-keys="expandedKeys" :options="options" :root-indent="18" @update:value="k => { currentKey = k }" />
  </n-layout-sider>
</template>

<script lang="ts" setup>
import { h, ref, computed, watchEffect } from 'vue'
import { useStore } from 'vuex'
import { useRoute, RouterLink } from 'vue-router'
import { MenuOption } from 'naive-ui'
import { Icon } from '../components'

const store = useStore()

const collapsed = computed(() => store.state.sidebarCollapsed)

const toggle = async (): Promise<void> => await store.dispatch('toggleSidebarCollapse')

interface Menu {
  id: string
  label: string
  icon?: string
  name?: string
  params?: { [key: string]: string }
  children?: Menu[]
}

// TODO: loading state
const data: Menu[] = [
  {
    id: '001',
    label: 'Dashboard',
    icon: 'dashboard',
    children: [
      {
        id: '0011',
        label: 'Home',
        name: 'home'
      }
    ]
  },
  {
    id: '002',
    label: 'User',
    icon: 'users',
    children: [
      {
        id: '0021',
        label: 'Profile',
        name: 'profile'
      }
    ]
  }
]

const mapping = (items: Menu[]): MenuOption[] => items.map(item => ({
  ...item,
  key: item.id,
  label: item.name != null ? () => h(RouterLink, { to: item }, { default: () => item.label }) : item.label,
  icon: item.icon != null ? () => h(Icon, { type: item.icon }) : undefined,
  children: item.children && mapping(item.children)
}))

const options = computed(() => mapping(data))

const route = useRoute()
const currentKey = ref<string>('')
const expandedKeys = ref<string[]>([])

const routeMatched = (menu: Menu): boolean => {
  return route.name === menu.name && (menu.params == null || JSON.stringify(route.params) === JSON.stringify(menu.params))
}

const matchExpanded = (items: Menu[]): boolean => {
  let matched = false
  for (const item of items) {
    if (item.children != null) {
      matchExpanded(item.children) && expandedKeys.value.push(item.id)
    }
    if (routeMatched(item)) {
      currentKey.value = item.id
      matched = true
    }
  }
  return matched
}

watchEffect(() => matchExpanded(data))
</script>

<style scoped>
.logo {
  position: sticky;
  top: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  padding: 12px 20px;
  /* border-bottom: 1px solid var(--border-color); */
  background: var(--color);
  font-size: 1.8em;
  font-weight: 600;
  line-height: 1;
  text-decoration: none;
  transition: padding 0.3s var(--bezier), font-size 0.3s var(--bezier);
}

.n-layout-sider--collapsed .logo {
  padding: 8px;
  font-size: 0;
}

.logo svg {
  flex: 0 0 32px;
  height: 32px;
  margin-right: 12px;
  transition: margin 0.3s var(--bezier);
}

.n-layout-sider--collapsed .logo svg {
  margin-right: 0;
}
</style>
