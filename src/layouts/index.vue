<template>
  <ElContainer>
    <div class="h-screen" :class="collapse ? 'w-16' : 'w-52'">
      <ElMenu :collapse="collapse">
        <ElMenuItem>
          <i class="el-icon-eleme"></i>
          <span>Menu1</span>
        </ElMenuItem>
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
    </div>
    <ElContainer>
      <ElHeader>
        <i class="el-icon-s-fold" @click="collapse = !collapse"></i>
      </ElHeader>
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
  import { defineComponent, ref } from "vue";
  import { ElContainer, ElMain, ElAside, ElHeader, ElFooter, ElMenu, ElSubmenu, ElMenuItem } from "element-plus";

  export default defineComponent({
    name: "Layout",
    components: { ElContainer, ElMain, ElAside, ElHeader, ElFooter, ElMenu, ElSubmenu, ElMenuItem },
    setup() {
      const collapse = ref(false);
      return {
        collapse,
      };
    },
  });
</script>
