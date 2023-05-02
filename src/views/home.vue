<!-- Home -->

<template>
  <n-card>
    <n-form size="large" :rules="rules" :model="model">
      <n-form-item-row label="B站账户" path="biliid">
        <n-select v-model:value="model.biliId" :options="options" />
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
import { computed, ref } from 'vue'
import { Order, newOrder, useOrder } from '../composables/order'
import { useRequest } from '../composables/request'
import { useCurrentUser } from '../composables/user'
import { useQuest, useWar, useSpot, useQuestPhaseDetail, Quest } from '../composables/gameAssets'

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

const questsInfos = useRequest(useQuest())
const spotsInfos = useRequest(useSpot())
const warsInfos = useRequest(useWar())
const questsDetailInfos = useRequest(useQuestPhaseDetail())
const questsMap = new Map<number, number[]>()
const spotMap = new Map<number, Quest[]>()

const questsOptions = computed(() => {
  if (questsInfos.loading.value || spotsInfos.loading.value || warsInfos.loading.value || questsDetailInfos.loading.value) {
    return []
  }
  questsDetailInfos.data.value?.forEach((value) => {
    if (questsMap.has(value.questId)) {
      questsMap.get(value.questId)?.push(value.phase)
    } else {
      questsMap.set(value.questId, [value.phase])
    }
  })
  questsInfos.data.value?.forEach((value) => {
    if (spotMap.has(value.spotId)) {
      spotMap.get(value.spotId)?.push(value)
    } else {
      spotMap.set(value.spotId, [value])
    }
  })

  const result = warsInfos.data.value?.slice().sort((a, b) => a.warid - b.warid).map((war) => {
    return {
      label: war.name,
      value: `${war.name}-${war.warid}`,
      children: spotsInfos.data.value?.filter((value) => value.warId === war.warid).map((spot) => {
        return {
          label: spot.name,
          value: spot.id,
          children: spotMap.get(spot.id)?.map((quest) => {
            return {
              label: `${quest.name}-${quest.id}`,
              value: quest.id,
              children: (questsMap.get(quest.id) ?? [1]).map((value) => {
                return {
                  label: `第${value}阶段`,
                  value: `${quest.id}-${value}`
                }
              })
            }
          })
        }
      })
    }
  })
  const newResult: CascaderOption[] = []
  result?.forEach((value) => {
    const newChild: CascaderOption[] = []
    value.children?.forEach((val) => {
      if (val.children?.length !== 0) newChild.push(val)
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
