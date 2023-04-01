<!-- Home -->

<template>
  <n-card>
    <n-form size="large" :rules="rules" :model="model">
      <n-form-item-row label="Bili ID" path="biliid">
        <n-select v-model:value="model.biliId" :options="options" @update:value="accountSelected" />
      </n-form-item-row>
      <n-form-item-row label="Quest">
        <n-select v-model:value="model.quest" :options="questsOptions" :disabled="model.biliId === ''" />
      </n-form-item-row>
      <n-form-item-row label="Num">
        <n-input-number v-model:value="model.num" />
      </n-form-item-row>
      <n-form-item-row label="Gold Apple">
        <n-switch v-model:value="active" />
      </n-form-item-row>
    </n-form>
    <n-button type="primary" size="large" block :loading="loading" :disabled="disabled || loading" @click="handleOrder">Order</n-button>
  </n-card>
  <n-card>
    <n-data-table
      :columns="createColumns()"
      :data="OrderOptions"
      :bordered="false"
    />
  </n-card>
</template>

<script lang="ts" setup>
import { DataTableColumns, useMessage } from 'naive-ui'
import { computed, Ref, ref } from 'vue'
import { Order, newOrder, useOrder } from '../composables/order'
import { useRequest } from '../composables/request'
import { useCurrentUser } from '../composables/user'
import { QuestResponse, useQuest } from '../composables/quest'

const message = useMessage()

const rules = {
  num: {
    required: true,
    message: 'num is required.',
    trigger: 'blur'
  }
}

const model = ref({
  biliId: '',
  quest: '',
  num: 0
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

const quest: Ref<QuestResponse> = ref({ code: 0, quests: [] })
const questsOptions = computed(() => {
  return quest.value.quests.slice(0).sort((a, b) => parseInt(b.challengeNum) - parseInt(a.challengeNum)).map((value) => {
    return {
      label: `${value.questId}-${value.questPhase}`,
      value: `${value.questId}-${value.questPhase}`
    }
  })
})
const accountSelected = async (v: string): Promise<void> => {
  quest.value = await useQuest(v)
}

const active = ref(false)

const loading = ref(false)
const disabled = computed(() => model.value.biliId === '' || model.value.quest === '' || model.value.num === 0)

const handleOrder = async (e: Event): Promise<void> => {
  e.preventDefault()
  loading.value = true
  try {
    const quest = model.value.quest.match(/(\d*)-(\d*)/) as RegExpMatchArray
    await newOrder(parseInt(quest[1]), parseInt(quest[2]), model.value.num, model.value.biliId, active.value)
    orders.value.data = await useOrder()
  } catch (e) {
    message.error(e instanceof Error ? e.message : 'unknown error')
  }
  loading.value = false
}

const orders = ref(useRequest(useOrder()))
const OrderOptions = computed(() => (orders.value.data?.orders.length === 0
  ? []
  : orders.value.data?.orders.map((value: Order, index) => {
    return {
      no: index,
      biliId: value.biliId,
      finish: value.finish ? '√' : 'x',
      message: value.message === null ? '-' : value.message,
      quest: `${value.questId}-${value.questPhase}`,
      num: value.num
    }
  })))

const createColumns = (): DataTableColumns => {
  return [
    {
      title: 'No',
      key: 'no'
    },
    {
      title: 'Bili Account',
      key: 'biliId'
    },
    {
      title: 'Quest',
      key: 'quest'
    },
    {
      title: 'Num',
      key: 'num'
    },
    {
      title: 'Message',
      key: 'message'
    },
    {
      title: 'Finish',
      key: 'finish'
    }
  ]
}
</script>

<style scoped>
.n-card {
  margin: 10vh 0;
}
</style>
