<!-- Home -->

<template>
  <n-card>
    <n-form size="large" :rules="rules" :model="model">
      <n-form-item-row label="Bili ID" path="biliid">
        <n-select v-model:value="model.biliId" :options="options" />
      </n-form-item-row>
      <n-form-item-row label="Quest ID" path="questphase">
        <n-input v-model:value="model.questid" />
      </n-form-item-row>
      <n-form-item-row label="Quest Phase" path="questid">
        <n-input v-model:value="model.questphase" />
      </n-form-item-row>
      <n-form-item-row label="Num" path="num">
        <n-input v-model:value="model.num" />
      </n-form-item-row>
    </n-form>
    <n-button type="primary" size="large" block :loading="loading" :disabled="disabled" @click="handleOrder">Order</n-button>
  </n-card>
</template>

<script lang="ts" setup>
import { useMessage } from 'naive-ui'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { newOrder } from '../composables/order'
import { useRequest } from '../composables/request'
import { useCurrentUser } from '../composables/user'

const message = useMessage()

const rules = {
  questid: {
    required: true,
    message: 'questid is required.',
    trigger: 'blur'
  },
  questphase: {
    required: true,
    message: 'questphase is required.',
    trigger: 'blur'
  },
  num: {
    required: true,
    message: 'num is required.',
    trigger: 'blur'
  }
}

const model = ref({
  biliId: '',
  questid: '',
  questphase: '',
  num: ''
})

const profile = useRequest(useCurrentUser())
const options = computed(() => {
  return profile.data.value?.biliAccos.map((value) => {
    return {
      label: value.name,
      value: value.id
    }
  })
})

const router = useRouter()
const loading = ref(false)
const disabled = computed<boolean>(() => model.value.questid === '' || model.value.num === '')
const handleOrder = async (e: Event): Promise<void> => {
  e.preventDefault()
  loading.value = true
  console.log(model.value)
  try {
    await newOrder(parseInt(model.value.questid), parseInt(model.value.questphase), parseInt(model.value.num), model.value.biliId)
    router.go(0)
  } catch (e) {
    message.error(e instanceof Error ? e.message : 'unknown error')
  }
  loading.value = false
}
</script>

<style scoped>
.n-card {
  margin: 10vh 0;
}
</style>
