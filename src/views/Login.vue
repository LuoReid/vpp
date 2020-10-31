<template>
  <div class="login">
    <div class="login-pancel">
      <div class="login-form">
        <h2 class="title" title="GoSolar">
          <img src="@/assets/logo.png" />
        </h2>
        <a-form-model
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          class="form-pancel"
        >
          <a-form-model-item label prop="login_name">
            <a-input
              class="login-input"
              v-model="ruleForm.login_name"
              :autofocus="true"
              placeholder="请输入工号或手机号"
              clearable
            ></a-input>
          </a-form-model-item>
          <a-form-model-item label prop="password">
            <a-input
              class="login-input"
              v-model="ruleForm.password"
              type="password"
              placeholder="请输入密码"
              clearable
              @keyup.enter.native="login"
            ></a-input>
          </a-form-model-item>
          <a-form-model-item>
            <div class="login-btn">
              <a-button
                class="btn-confirm"
                :class="{ filled: formFilled }"
                @click="loginsubmit('ruleForm')"
                type="success"
                >确认登录</a-button
              >
            </div>
          </a-form-model-item>
        </a-form-model>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions } from "vuex";
export default {
  data() {
    return {
      ruleForm: { login_name: "", password: "" },
      rules: {
        login_name: [
          { required: true, message: "请输入工号或手机号", trigger: "change" },
          { min: 3, max: 20, message: "长度在3到20个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "change" },
          { min: 3, max: 20, message: "长度在3到20个字符", trigger: "blur" }
        ]
      }
    };
  },
  computed: {
    formFilled() {
      return this.ruleForm.login_name && this.ruleForm.password;
    }
  },
  methods: {
    ...mapActions(["login"]),
    loginsubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log("user:", this.login, this.ruleForm);
          this.login(this.ruleForm).then(res => {
            if (res.code === 200) {
              this.$router.replace({ path: this.$route.query.redirect || "/" });
            } else {
              return false;
            }
          });
        } else {
          return false;
        }
      });
    }
  }
};
</script>
<style scoped>
.login {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
.login-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
}
.form-pancel {
  padding: 5px;
  margin: 0;
}
.el-form-item {
  display: flex;
  flex-direction: row;
}
.login-btn {
  width: 100%;
  /* // height: 40px; */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.login-btn .btn {
  text-align: center;
  width: 100%;
}
.login-pancel {
  display: flex;
  justify-content: center;
  width: 30%;
}
.login-input {
  width: 300px;
  height: 50px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  border: none;
}
.login-btn .btn-confirm {
  width: 300px;
  height: 50px;
  border-radius: 4px;
  background: rgba(52, 139, 218, 0.5);
  border: none;
}
.login-btn .btn-confirm.filled {
  background: rgba(52, 139, 218, 1);
}

.title img {
  width: 309px;
  height: 57px;
}
@media screen and (max-width: 1201px) {
  .login-pancel {
    width: 100%;
  }
}
</style>
