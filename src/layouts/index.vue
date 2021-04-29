<template>
  <ElContainer>
    <ElAside class="h-screen">
      <ElMenu>
        <ElMenuItem>Menu1</ElMenuItem>
        <ElSubmenu index="0">
          <template #title>
            <span class="iconify"></span>
            <span>SubMenuTitle</span>
          </template>
          <ElMenu>
            <ElMenuItem>SubMenu1</ElMenuItem>
          </ElMenu>
        </ElSubmenu>
      </ElMenu>
    </ElAside>
    <ElContainer>
      <ElHeader></ElHeader>
      <ElContainer>
        <ElMain>
          <i class="el-icon-edit"></i>
        </ElMain>
        <ElFooter></ElFooter>
      </ElContainer>
    </ElContainer>
  </ElContainer>
</template>

<script lang="ts">
  import { defineComponent } from "vue";
  import { ElContainer, ElMain, ElAside, ElHeader, ElFooter, ElMenu, ElSubmenu, ElMenuItem } from "element-plus";

  export default defineComponent({
    name: "Layout",
    components: { ElContainer, ElMain, ElAside, ElHeader, ElFooter, ElMenu, ElSubmenu, ElMenuItem },
  });
</script>
