<template>
  <a-form-model
    ref="ruleForm"
    :model="form"
    :rules="rules"
    :label-col="{ span: 4 }"
    :wrapper-col="{ span: 14 }"
  >
    <a-row>
      <a-col :span="12">
        <a-form-model-item label="Name" prop="name">
          <a-input
            v-model="form.name" 
            placeholder="User's name"
          /> </a-form-model-item
      ></a-col>
      <a-col :span="12">
        <a-form-model-item label="Email" required prop="email">
          <a-input
            v-model="form.email"
            placeholder="User's email"
          /> 
        </a-form-model-item>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="12">
        <a-form-model-item label="Phone" prop="phone">
          <a-input
            v-model="form.phone" 
            placeholder="User's phone"
          /> </a-form-model-item
      ></a-col>
      <a-col :span="12">
        <a-form-model-item  label="Nick name" required prop="nick_name">
          <a-input
            v-model="form.nick_name"
            placeholder="User's nickname"
          /> 
        </a-form-model-item>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="12">
        <a-form-model-item label="Login name" prop="login_name">
          <a-input
            v-model="form.login_name"
            placeholder="Login name"
          /> </a-form-model-item
      ></a-col>
      <a-col :span="12">
        <a-form-model-item label="Password" required prop="password">
          <a-input 
            v-model="form.password"
            placeholder="Password"
          /> 
        </a-form-model-item></a-col
      >
    </a-row>
    <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
      <a-button type="primary" @click="onSubmit" :loading="loading">
        Save
      </a-button>
      <a-button style="margin-left: 10px" @click="resetForm"> Cancel </a-button>
    </a-form-model-item>
  </a-form-model>
</template>

<script>
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}
import { assetState } from "@/util";
import { mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      uploadUrl: `${process.env.VUE_APP_BASE_URL}/api/upload_img`,
      header: { Authorization: localStorage.getItem("token") },
      optionAssetState: assetState,
      loading: false,
      fileList: [],
      previewVisible: false,
      previewImage: "",
      form: { state:1
      },
      rules: {
        name: [{ required: true, message: "Please input user's name", trigger: "blur" }],
        login_name: [
          { required: true, message: "Please input user login name", trigger: "change" },
        ],
        email: [{ required: true, message: "Please input email", trigger: "blur" }],
        phone: [{ required: true, message: "Please input phone", trigger: "blur" }],
        nick_name: [{ required: true, message: "Please input nickname", trigger: "blur" }],
        password: [
          { required: true, message: "Please input password", trigger: "blur" },
        ], 
      },
    };
  },
  computed: {
  },
  created() { 
  },
  methods: {
    beforeUpload(file) {
      file.name = `${this.form.title}-${file.name}`;
      // this.fileList = [...this.fileList, file];
      console.log("before upload:", file);
      return true;
    },
    async handlePreview(file) {
      console.log("preview:", file);
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      this.previewImage = file.url || file.preview;
      this.previewVisible = true;
    },
    uploadImage(file) {
      this.loading = true;
      const formData = new FormData();
      formData.append("file", file.file);
      this.$store.dispatch("upload", formData).then((res) => {
        console.log("log upload file:", res);
      });
    },
    handleChange(info) {
      console.log("change:", info);
      let fileList = [...info.fileList];
      // 1. Limit the number of uploaded files
      //    Only to show two recent uploaded files, and old ones will be replaced by the new
      fileList = fileList.slice(-2);
      // 2. read from response and show file link
      fileList = fileList.map((file) => {
        if (file.response) {
          // Component will show file.url as link
          return {...file,...file.response.url};
        }
        return file;
      });
      console.log("file upload:", fileList);
      this.fileList = fileList;
      // this.fileList = fileList;
    },
    handleCancel() {
      console.log("cancel file");
      this.$router.go(-1)
    },
    onSubmit() {
      // console.log("submit asset:", this.assetPost, this.form);
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          const kind = { ...this.form };
          this.$store.dispatch("user/saveUser", kind).then((res) => {
            this.loading = false;
            if (res.code === 200) {
              this.$message.success(res.msg);
              this.resetForm();
              this.$router.replace({ name: "account" });
            }else{
              this.$message.error(res.msg)
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm() {
      this.$refs.ruleForm.resetFields();
      this.$router.go(-1)
      this.$emit("close");
    },
  },
};
</script>
<style scoped>

</style>