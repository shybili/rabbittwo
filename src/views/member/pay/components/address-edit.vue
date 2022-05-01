<template>
  <XtxDialog :title="`${formData.id?'修改':'添加'}收货地址`" v-model:visable="dialogVisible">
    <div class="address-edit">
      <div class="xtx-form">
      <div class="xtx-form-item">
        <div class="label">收货人：</div>
        <div class="field">
          <input v-model="formData.receiver" class="input" placeholder="请输入收货人" />
        </div>
      </div>
      <div class="xtx-form-item">
        <div class="label">手机号：</div>
        <div class="field">
          <input v-model="formData.contact" class="input" placeholder="请输入手机号" />
        </div>
      </div>
      <div class="xtx-form-item">
        <div class="label">地区：</div>
        <div class="field">
          <XtxCity @change="changeCity" :fullLocation="formData.fullLocation" placeholder="请选择所在地区"/>
        </div>
      </div>
      <div class="xtx-form-item">
        <div class="label">详细地址：</div>
        <div class="field">
          <input v-model="formData.address" class="input" placeholder="请输入详细地址" />
        </div>
      </div>
      <div class="xtx-form-item">
        <div class="label">邮政编码：</div>
        <div class="field">
          <input v-model="formData.postalCode" class="input" placeholder="请输入邮政编码" />
        </div>
      </div>
      <div class="xtx-form-item">
        <div class="label">地址标签：</div>
        <div class="field">
          <input v-model="formData.addressTags" class="input" placeholder="请输入地址标签，逗号分隔" />
        </div>
      </div>
    </div>
    </div>
    <template v-slot:footer>
      <XtxButton @click="dialogVisible=false" type="gray" style="margin-right:20px">取消</XtxButton>
      <XtxButton  @click="submit" type="primary">确认</XtxButton>
    </template>
  </XtxDialog>
</template>
<script>
import { reactive, ref } from 'vue'
import {addAddress ,editAddress} from '@/api/order'
import Message from '@/components/library/message'
export default {
  name: 'AddressEdit',
  setup (props,{emit}) {
    const dialogVisible = ref(false)
    // 打开函数，
    const open = (address) => {
      dialogVisible.value = true
      if(address.id) {
        for(let i in address) {
          formData[i] = address[i]
        }
      }else {
        for(let i in formData) {
        if(i === 'isDefault') {
          formData[i] = 1
        }else {
          formData[i] = null
        }
      }
      }
      
    }


    const formData = reactive({
      receiver: '',
      contact: '',
      provinceCode: '',
      cityCode: '',
      countyCode: '',
      address: '',
      postalCode: '',
      addressTags: '',
      isDefault: 1,
      fullLocation: ''
    })
// 
    const changeCity = (data) => {
      formData.provinceCode = data.provinceCode
      formData.cityCode = data.cityCode
      formData.countyCode = data.countryCode
      formData.fullLocation = data.fullLocation
    }

    const submit = () => {
      // console.log(formData);
      if(formData.id) {
        editAddress(formData).then(() => {
          // 提示
          Message({ type: 'success', text: '修改收货地址成功' })
          // 关闭
          dialogVisible.value = false
          // 触发自定义事件
          emit('addsuccess', formData)
        })
      }else {
        // 添加请求
        addAddress(formData).then(data => {
          // 需要设置ID
          formData.id = data.result.id
          // 提示
          Message({ type: 'success', text: '添加收货地址成功' })
          // 关闭
          dialogVisible.value = false
          // 触发自定义事件
          emit('addsuccess', formData)
        })
      }
      
    }
    return { dialogVisible, open ,formData ,changeCity,submit}
  }
}
</script>
<style scoped lang="less">
.address-edit {
  .xtx-dialog {
  :deep(.wrapper){
    width: 780px;
    .body {
      font-size: 14px;
    }
  }
}
.xtx-form {
  padding: 0;
  input {
    outline: none;
    &::placeholder {
      color: #ccc;
    }
  }
}
.xtx-city {
  width: 320px;
  :deep(.select) {
    height: 50px;
    line-height: 48px;
    display: flex;
    padding: 0 10px;
    justify-content: space-between;
    .placeholder {
      color: #ccc;
    }
    i {
      color: #ccc;
      font-size: 18px;
    }
    .value {
      font-size: 14px;
    }
  }
  :deep(.option) {
    top: 49px;
  }
}
}
</style>