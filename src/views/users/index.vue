<template>
  <div class="users">
    <div class="body">
      <div class="body-header">
        <div class="body-search">
          <el-input
            placeholder="请输入要搜索的姓名"
            v-model="searchInfo"
            class="input"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="search"
            ></el-button>
          </el-input>
        </div>
        <div class="add-btn">
          <el-button type="primary" @click="dialogFormVisible = true"
            >添加用户</el-button
          >
        </div>
      </div>
      <div class="body-table">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column type="index" width="80"> </el-table-column>
          <el-table-column prop="username" label="姓名" width="180">
          </el-table-column>
          <el-table-column prop="email" label="邮箱" width="180">
          </el-table-column>
          <el-table-column prop="mobile" label="电话" width="180">
          </el-table-column>
          <el-table-column prop="role_name" label="角色" width="180">
          </el-table-column>
          <el-table-column label="状态" width="180">
            <template slot-scope="scope">
              <!-- scope.row 可以获取该行数据 -->
              <el-switch
                v-model="scope.row['mg_state']"
                active-color="#409EFF"
                inactive-color="#D9DCE2"
                :active-value="true"
                :inactive-value="false"
                @change="change(scope.row['id'], scope.row['mg_state'])"
              >
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-tooltip
                class="item"
                effect="dark"
                content="修改"
                placement="top"
              >
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  @click="edit(scope.row['id'])"
                ></el-button>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                content="删除"
                placement="top"
              >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  @click="deleteUser(scope.row['id'])"
                ></el-button>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                content="分配角色"
                placement="top"
              >
                <el-button
                  type="warning"
                  icon="el-icon-setting"
                  @click="allotRoles(scope.row)"
                ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          :current-page="currentPage"
          :page-sizes="[2, 4, 6]"
          :page-size="2"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
    <el-dialog
      title="用户信息"
      :visible.sync="dialogFormVisible"
      @close="closeDialog"
    >
      <el-form :model="form" :rules="rules" ref="dialogFormRef">
        <el-form-item
          label="用户名称"
          :label-width="formLabelWidth"
          prop="username"
        >
          <el-input v-model="form.username" :disabled="inputUse"></el-input>
        </el-form-item>
        <el-form-item
          label="用户密码"
          :label-width="formLabelWidth"
          prop="password"
          v-if="!inputUse"
        >
          <el-input v-model="form.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item
          label="手机号"
          :label-width="formLabelWidth"
          prop="mobile"
        >
          <el-input v-model="form.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <span>确定进行该操作吗</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirm">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="角色分配"
      :visible.sync="dialogRolesVisible"
      width="30%"
      @close="closeRolesDialog"
    >
      <p>当前用户:{{ uName }}</p>
      <p>当前角色:{{ uRoles }}</p>
      <el-select v-model="value" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.id"
          :label="item.roleName"
          :value="item.id"
        >
        </el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editCurrentRole">确 定</el-button>
        <el-button @click="dialogRolesVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  _getUsers,
  _editUser,
  updataUser,
  _change,
  _edit,
  _confirm,
  _allotRoles,
  _editCurrentRole,
} from "@/api/users";
import { Message } from "element-ui";
export default {
  name: "users",
  data() {
    /* 邮箱验证 */
    var checkEmail = (rule, value, cb) => {
      //邮箱验证规则
      const regEmail = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
      if (regEmail.test(value)) {
        return cb();
      } else {
        cb(new Error("请输入合法的邮箱"));
      }
    };
    /* 手机号验证 */
    var checkMobile = (rule, value, cb) => {
      //邮箱验证规则
      const regMobile = /^((13[0-9])|(17[0-1,6-8])|(15[^4,\\D])|(18[0-9]))\d{8}$/;
      if (regMobile.test(value)) {
        return cb();
      } else {
        cb(new Error("请输入合法的手机号"));
      }
    };
    return {
      tableData: [],
      searchInfo: "",
      currentPage: 1,
      total: 0,
      pageSize: 2,
      dialogTableVisible: false,
      dialogFormVisible: false,
      dialogRolesVisible: false,
      form: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        email: [{ validator: checkEmail, trigger: "blur" }],
        mobile: [{ validator: checkMobile, trigger: "blur" }],
      },
      formLabelWidth: "80px",
      dialogVisible: false,
      inputUse: false,
      uId: "",
      uName: "",
      uRoles: "",
      options: [],
      value: "",
    };
  },
  mounted() {
    this.getUsers();
  },
  methods: {
    getUsers() {
      const params = {
        query: this.searchInfo,
        pagenum: this.currentPage,
        pagesize: this.pageSize,
      };
      _getUsers(params)
        .then((res) => {
          if (res.meta.status == "200") {
            this.tableData = res.data.users;
            this.total = res.data.total;
          } else {
            Message.error(res.meta.msg);
          }
        })
        .catch((res) => {
          Message.error(res.meta.msg);
        });
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getUsers();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getUsers();
    },
    search() {
      this.getUsers();
    },
    closeDialog() {
      this.form.username = "";
      this.form.password = "";
      this.form.email = "";
      this.form.mobile = "";
      this.$refs.dialogFormRef.resetFields();
      this.inputUse = false;
    },
    editUser() {
      this.$refs.dialogFormRef.validate((vaild) => {
        if (!vaild) {
          return;
        } else {
          if (this.inputUse === false) {
            _editUser({
              username: this.form.username,
              password: this.form.password,
              email: this.form.email,
              mobile: this.form.mobile,
            })
              .then((res) => {
                if (res.meta.status == "200" || res.meta.status == "201") {
                  Message.success(res.meta.msg);
                  this.dialogFormVisible = false;
                  this.getUsers();
                } else {
                  Message.error(res.meta.msg);
                }
              })
              .catch((res) => {
                Message.error(res.meta.msg);
              });
          } else {
            updataUser(this.uId, {
              email: this.form.email,
              mobile: this.form.mobile,
            })
              .then((res) => {
                if (res.meta.status == "200" || res.meta.status == "201") {
                  Message.success(res.meta.msg);
                  this.dialogFormVisible = false;
                  this.getUsers();
                } else {
                  Message.error(res.meta.msg);
                }
              })
              .catch((res) => {
                Message.error(res.meta.msg);
              });
          }
        }
      });
    },
    change(uId, state) {
      _change(uId, state).then((res) => {
        if (res.meta.status == "200") {
          Message.success(res.meta.msg);
          this.getUsers();
        } else {
          Message.error(res.meta.msg);
        }
      });
    },
    edit(uId) {
      this.uId = uId;
      _edit(uId)
        .then((res) => {
          if (res.meta.status == "200") {
            this.form.username = res.data.username;
            this.form.email = res.data.email;
            this.form.mobile = res.data.mobile;
            this.inputUse = true;
            this.dialogFormVisible = true;
          } else {
            Message.error(res.meta.msg);
          }
        })
        .catch((res) => {
          Message.error(res.meta.msg);
        });
    },
    deleteUser(uId) {
      this.uId = uId;
      this.dialogVisible = true;
    },
    confirm() {
      _confirm(this.uId)
        .then((res) => {
          if (res.meta.status == "200") {
            Message.success(res.meta.msg);
            this.dialogVisible = false;
            this.getUsers();
          } else {
            Message.error(res.meta.msg);
          }
        })
        .catch((res) => {
          Message.error(res.meta.msg);
        });
    },
    allotRoles(role) {
      this.uId = role.id;
      this.uName = role.username;
      this.uRoles = role.role_name;
      _allotRoles()
        .then((res) => {
          if (res.meta.status == "200") {
            this.options = res.data;
          } else {
            Message.error(res.meta.msg);
          }
        })
        .catch((res) => {
          Message.error(res.meta.msg);
        });
      this.dialogRolesVisible = true;
    },
    editCurrentRole() {
      _editCurrentRole(this.uId, {
        rid: this.value,
      })
        .then((res) => {
          if (res.meta.status == "200") {
            this.dialogRolesVisible = false;
            this.getUsers();
          } else {
            Message.error(res.meta.msg);
          }
        })
        .catch((res) => {
          Message.error(res.meta.msg);
        });
    },
    closeRolesDialog() {
      this.value = "";
    },
  },
};
</script>
<style lang="scss">
.users {
  .body {
    background-color: #fff;
    padding: 20px;
    border-radius: 5px;
    .body-header {
      display: flex;
      margin-bottom: 20px;
      .input {
        width: 400px;
        margin-right: 20px;
      }
    }
    .body-table {
      .el-table {
        margin-bottom: 10px;
      }
    }
  }
  .el-dialog {
    width: 30%;
    p {
      margin: 10px;
    }
    .el-select {
      margin: 10px;
    }
  }
}
</style>
