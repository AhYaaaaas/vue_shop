import Vue from 'vue'
import
{
  Form, FormItem, Input, Message,
  Button, Container, Aside, Main,
  Header, Menu, MenuItem, Submenu,
  Breadcrumb, BreadcrumbItem,
  Card, Row, Col, Table, TableColumn,
  Switch, Tooltip,Pagination,Dialog,
  MessageBox,Tag,Tree,Select,Option
} from 'element-ui'
// import ElementUI from 'element-ui'
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Main)
Vue.use(Aside)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Menu)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
// Vue.use(ElementUI)
//弹框需要挂载
// ElementUI.Dialog.props.lockScroll.default = false;
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm



