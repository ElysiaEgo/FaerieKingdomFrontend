<!-- Sign In -->

<template>
  <n-h1 style="--font-size: 60px; --font-weight: 100">
    {{ $store.state.name }}
  </n-h1>
  <n-card size="large" style="--padding-bottom: 30px">
    <n-h2 style="--font-weight: 400">登录</n-h2>
    <n-form size="large" :rules="rules" :model="model">
      <n-form-item-row label="用户名" path="username">
        <n-input v-model:value="model.username" placeholder="输入用户名" />
      </n-form-item-row>
      <n-form-item-row label="密码" path="password">
        <n-input v-model:value="model.password" type="password" placeholder="输入密码" />
      </n-form-item-row>
    </n-form>
    <n-button type="primary" size="large" block :loading="loading" :disabled="disabled" @click="handleLogin">登录</n-button>
    <n-button type="primary" size="large" block :loading="loading" :disabled="disabled" @click="handleReg">注册</n-button>
    <br>
  </n-card>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import { useToken, useReg } from '../composables/token'

const router = useRouter()
const message = useMessage()

const rules = {
  username: {
    required: true,
    message: '用户名为必填项',
    trigger: 'blur'
  },
  password: {
    required: true,
    message: '密码为必填项',
    trigger: 'blur'
  }
}

const model = ref({
  username: '',
  password: ''
})

const loading = ref(false)

const disabled = computed(() => model.value.username === '' || model.value.password === '')

const handleLogin = async (e: Event): Promise<void> => {
  e.preventDefault()
  loading.value = true
  try {
    const login = await useToken(model.value.username, model.value.password)
    if (login.code === 0) {
      const route = router.currentRoute.value
      const redirect = route.query.redirect?.toString()
      await router.replace(redirect ?? route.redirectedFrom?.fullPath ?? '/')
    } else {
      message.error('账号或密码错误')
    }
  } catch (e) {
    message.error(e instanceof Error ? e.message : '未知错误')
  }
  loading.value = false
}

const handleReg = async (e: Event): Promise<void> => {
  e.preventDefault()
  loading.value = true
  try {
    const reg = await useReg(model.value.username, model.value.password)
    if (reg?.code === 0) {
      const route = router.currentRoute.value
      const redirect = route.query.redirect?.toString()
      await router.replace(redirect ?? route.redirectedFrom?.fullPath ?? '/')
    } else {
      message.error('用户名和密码必须为8字符以上')
      message.error('或者已有同名账户')
    }
  } catch (e) {
    message.error(e instanceof Error ? e.message : '未知错误')
  }
  loading.value = false
}
</script>

<style scoped>
.n-h1 {
  margin: 20vh auto 20px;
  text-align: center;
  letter-spacing: 5px;
  opacity: 0.8;
}

.n-card {
  margin: 0 auto;
  max-width: 380px;
  box-shadow: var(--box-shadow);
}
</style>
