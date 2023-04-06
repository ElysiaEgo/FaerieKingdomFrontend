<!-- Home -->

<template>
  <n-card>
    <n-form size="large" :rules="rules" :model="model">
      <n-form-item-row label="B站账户" path="biliid">
        <n-select v-model:value="model.biliId" :options="options" @update:value="accountSelected" />
      </n-form-item-row>
      <n-form-item-row label="关卡">
        <n-cascader
          v-model:value="model.quest"
          expand-trigger="hover"
          :options="questsOptions"
          check-strategy="child"
          clearable
          show-path
          filterable
          :disabled="model.biliId === ''"
          :menu-props="{ style: '--n-column-width: auto;' }"
        />
      </n-form-item-row>
      <n-form-item-row label="次数">
        <n-input-number v-model:value="model.num" />
      </n-form-item-row>
      <n-form-item-row label="使用苹果">
        <n-checkbox-group v-model:value="apple">
          <n-checkbox value="gold" label="金苹果" />
          <n-checkbox value="silver" label="银苹果" />
          <n-checkbox value="copper" label="铜苹果" />
          <n-checkbox value="bronze" label="青铜苹果" />
        </n-checkbox-group>
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
import { CascaderOption, DataTableColumns, useMessage } from 'naive-ui'
import { computed, Ref, ref } from 'vue'
import { Order, newOrder, useOrder } from '../composables/order'
import { useRequest } from '../composables/request'
import { useCurrentUser } from '../composables/user'
import { QuestResponse, useQuest } from '../composables/quest'
import quests from '../assets/quests.json'
import wars from '../assets/wars.json'
import spots from '../assets/spots.json'

const message = useMessage()

const rules = {
  num: {
    required: true,
    message: '次数为必填项',
    trigger: 'blur'
  }
}

const model = ref({
  biliId: '',
  quest: '',
  num: 0
})

const apple = ref<string[]>([])

const profile = useRequest(useCurrentUser())
const options = computed(() => {
  return profile.data.value?.biliAccos.map((value) => {
    return {
      label: value.name + (value.isios ? '-ios' : '-bili'),
      value: value.id
    }
  })
})

const quest: Ref<QuestResponse> = ref({ code: 0, quests: [] })
const questsOptions = computed(() => {
  const questsInfos: Array<{questId: number, spotId: number, questName: string, apcost: number, phases: number[]}> = quests as any
  const spotsInfos: Array<{spotId: number, spotName: string, warId: number}> = spots as any
  const warsInfos: Array<{warid: number, name: string}> = wars as any

  const questsMap = new Map<number, {questId: string, questPhase: string}>()

  quest.value.quests.forEach((value) => {
    questsMap.set(parseInt(value.questId), value)
  })

  const result = warsInfos.sort((a, b) => a.warid - b.warid).map((war) => {
    return {
      label: war.name,
      value: `${war.name}-${war.warid}`,
      children: spotsInfos.filter((value) => value.warId === war.warid).map((spot) => {
        const currentQuests = questsInfos.filter((value) => value.spotId === spot.spotId)
        return {
          label: spot.spotName,
          value: `${spot.spotName}-${spot.spotId}`,
          children: currentQuests.map((quest) => {
            return {
              label: `${quest.questName}-${quest.questId}-${questsMap.get(quest.questId)?.questPhase ?? '1'}`,
              value: `${quest.questId}-${questsMap.get(quest.questId)?.questPhase ?? '1'}`
            }
          })
        }
      })
    }
  })
  const newResult: CascaderOption[] = []
  result.forEach((value) => {
    const newChild: CascaderOption[] = []
    value.children.forEach((val) => {
      if (val.children.length !== 0) newChild.push(val)
    })
    if (newChild.length !== 0) {
      newResult.push({
        label: value.label,
        value: value.value,
        children: newChild
      })
    }
  })
  return newResult
})
const accountSelected = async (v: string): Promise<void> => {
  quest.value = await useQuest(v)
}

const loading = ref(false)
const disabled = computed(() => model.value.biliId === '' || model.value.quest === '' || model.value.num === 0)

const handleOrder = async (e: Event): Promise<void> => {
  e.preventDefault()
  loading.value = true
  try {
    const quest = model.value.quest.match(/(\d*)-(\d*)/) as RegExpMatchArray
    await newOrder(parseInt(quest[1]), parseInt(quest[2]), model.value.num, model.value.biliId, [
      apple.value.includes('gold'),
      apple.value.includes('silver'),
      apple.value.includes('copper'),
      apple.value.includes('bronze')
    ])
    orders.value.data = await useOrder()
  } catch (e) {
    message.error(e instanceof Error ? e.message : '未知错误')
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
      title: 'B站账户',
      key: 'biliId'
    },
    {
      title: '关卡',
      key: 'quest'
    },
    {
      title: '次数',
      key: 'num'
    },
    {
      title: '消息',
      key: 'message'
    },
    {
      title: '完成情况',
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
