<!-- Profiles -->

<template>
  <n-h1>Profiles</n-h1>
  <n-card>
    <n-form size="large" :rules="rules" :model="model">
      <n-form-item-row label="Bilibili Username" path="username">
        <n-input v-model:value="model.username" placeholder="Input your username" />
      </n-form-item-row>
      <n-form-item-row label="Password" path="password">
        <n-input v-model:value="model.password" type="password" placeholder="Input your password" />
      </n-form-item-row>
    </n-form>
    <n-button type="primary" size="large" block :loading="loading" :disabled="disabled" @click="handleLogin">Sign in</n-button>
    <br>
    <n-data-table
      :columns="createColumns()"
      :data="data"
      :bordered="false"
    />
  </n-card>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { DataTableColumns, useMessage } from 'naive-ui'
import { useCurrentUser } from '../composables/user'
import { usebiliAcco } from '../composables/biliAcco'
import { useRequest } from '../composables/request'

const rules = {
  username: {
    required: true,
    message: 'Username is required.',
    trigger: 'blur'
  },
  password: {
    required: true,
    message: 'Password is required.',
    trigger: 'blur'
  }
}

const model = ref({
  username: '',
  password: ''
})

const loading = ref(false)
const disabled = computed<boolean>(() => model.value.username === '' || model.value.password === '')

const message = useMessage()
const handleLogin = async (e: Event): Promise<void> => {
  e.preventDefault()
  loading.value = true
  try {
    await usebiliAcco(model.value.username, model.value.password)
    profile.value.data = await useCurrentUser()
  } catch (e) {
    message.error(e instanceof Error ? e.message : 'unknown error')
  }
  loading.value = false
}

interface BiliAcco {
  no: number
  account: string
}

const profile = ref(useRequest(useCurrentUser()))
const data = computed(() => (profile.value.data?.biliAccos.length === 0
  ? []
  : profile.value.data?.biliAccos.map((value, index) => {
    return {
      no: index,
      account: value.name
    }
  })))

const createColumns = (): DataTableColumns<BiliAcco> => {
  return [
    {
      title: 'No',
      key: 'no'
    },
    {
      title: 'Bili Account',
      key: 'account'
    }
  ]
}
</script>
