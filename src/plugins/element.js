import Vue from 'vue'
import {Form, FormItem, Input,Message,Button} from 'element-ui'
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
//弹框需要挂载
Vue.prototype.$message = Message
