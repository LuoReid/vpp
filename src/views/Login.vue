<template>
  <div class="login">
    <div class="slogan">
      <img src="@/assets/slogan1.png" />
      <div class="slogan-content"> 
        <img src="@/assets/slogan-login.png" />
      </div>
      <span class="copy-right">© gosolar.com.au</span>
      <img src="@/assets/slogan2.png" class="slogan-right" />
    </div>
    <div class="main"> 
    <div class="login-pancel">
      <div class="login-form">
        <h2 class="title" title="GoSolar">
          <img src="@/assets/logo.png" v-if="false" />
          Login your Gosolar Account
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
              placeholder="Email"
              clearable
            ></a-input>
          </a-form-model-item>
          <a-form-model-item label prop="password">
            <a-input
              class="login-input"
              v-model="ruleForm.password"
              type="password"
              placeholder="Password"
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
                >Login</a-button
              >
            </div>
          </a-form-model-item>
          <a-form-model-item>
            <a-button type="link">Forget password?</a-button>
          </a-form-model-item>
        </a-form-model>
      </div>
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
          { required: true, message: "Please input your email", trigger: "change" },
          // { min: 3, max: 20, message: "长度在3到20个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "Please input your passwrod", trigger: "change" },
          // { min: 3, max: 20, message: "长度在3到20个字符", trigger: "blur" }
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
  justify-content: space-between;
}
.slogan{
  width: 35%;
  height: 100vh;
  background: #449CEB;
  position: relative;
}
.slogan-content{
  position: absolute;
  left: 50%;
  top:50%;
  transform: translate(-50%,-70%);
}
.slogan-right{
  /* width:78% ; */
  position: absolute;
  bottom: 0;
  right: -15%;
}
.main{
  width:65% ;
  display: flex;
  padding-left: 20%;
  /* justify-content: center; */
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
  border-radius: 0;
  background: rgba(255, 255, 255, 0.2);
  color: #333;
  border: none;
  border-bottom: 1px solid #979797;
}
.login-btn .btn-confirm {
  width: 300px;
  height: 50px;
  border-radius: 4px;
  font-weight: bold;
  background: rgba(52, 139, 218, 0.5);
  border: none;
}
.login-btn .btn-confirm.filled {
  font-weight: bold;
  background: rgba(52, 139, 218, 1);
}
.title{
  font-weight: bold;
  font-size: 36px;
}
.title img {
  width: 309px;
  height: 57px;
}
.copy-right{
  position: absolute;
  left: 50%;
  bottom:35px ;
  transform: translateX(-50%);
  font-weight: bold;
  font-size: 20px;
  color: #fff;
}
@media screen and (max-width: 1201px) {
  .login-pancel {
    width: 100%;
  }
}
</style>
