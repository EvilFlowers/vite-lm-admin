<template>
  <div class="h-screen flex items-center justify-center">
    <ElForm ref="loginForm" :model="loginInfo" label-position="left" label-width="80px" :rules="rules">
      <ElFormItem label="用户名" prop="username">
        <ElInput v-model="loginInfo.username" />
      </ElFormItem>
      <ElFormItem label="密码" prop="password">
        <ElInput v-model="loginInfo.password" />
      </ElFormItem>
      <ElButton @click="handleLogin">登录</ElButton>
    </ElForm>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, reactive } from "vue";
  import { ElInput, ElButton, ElForm, ElFormItem } from "element-plus";
  import { Encrypt } from "@/utils/crypto";
  import { login } from "@/api/system/user";

  export default defineComponent({
    name: "Login",
    components: { ElInput, ElButton, ElForm, ElFormItem },
    setup() {
      const loginForm = ref(null);
      const loginInfo = reactive({ username: "systemadmin", password: "administrator" });
      const rules = reactive({
        username: [{ required: true, message: "请输入登录用户名", trigger: "blur" }],
        password: [{ required: true, message: "请输入登录密码", trigger: "blur" }],
      });

      function handleLogin() {
        loginForm.value.validate((valid) => {
          console.log(valid);
          if (valid) {
            // console.log("通过");
            const loginData = { ...loginInfo, password: Encrypt(loginInfo.password) };
            console.log(loginData);
            login(loginData);
          } else {
            console.log("未通过");
          }
        });
        // console.log(username.value, password.value);
      }

      return {
        rules,
        handleLogin,
        loginForm,
        loginInfo,
      };
    },
  });
</script>

<style></style>
