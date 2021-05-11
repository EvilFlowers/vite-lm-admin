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
            <span class="iconify inline-block w-5 h-5 mr-2" data-icon="la:arrow-circle-up-solid"></span>
            <span>SubMenuTitle</span>
          </template>
          <ElMenuItem>
            <span class="iconify inline-block w-4 h-4" data-icon="system-uicons:browser-alt"></span>
            <span>SubMenu1</span>
          </ElMenuItem>
        </ElSubmenu>
      </ElMenu>
    </div>
    <ElContainer>
      <ElHeader class="flex items-center">
        <span @click="toggleCollapse">
          <span v-if="collapse">
            <span class="iconify w-5 h-5" data-icon="ant-design:menu-unfold-outlined"></span>
          </span>
          <span v-else>
            <span class="iconify w-5 h-5" data-icon="ant-design:menu-fold-outlined"></span>
          </span>
        </span>
      </ElHeader>
      <div>
        <ElTabs v-model="editableTabsValue" type="card">
          <ElTabPane
            v-for="item in editableTabs"
            :key="item.name"
            :label="item.title"
            :name="item.name"
            closable
          ></ElTabPane>
        </ElTabs>
      </div>
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
  import {
    ElContainer,
    ElMain,
    ElHeader,
    ElFooter,
    ElMenu,
    ElSubmenu,
    ElMenuItem,
    ElTabs,
    ElTabPane,
  } from "element-plus";

  export default defineComponent({
    name: "Layout",
    components: { ElContainer, ElMain, ElHeader, ElFooter, ElMenu, ElSubmenu, ElMenuItem, ElTabs, ElTabPane },
    setup() {
      const collapse = ref(false);
      function toggleCollapse() {
        collapse.value = !collapse.value;
      }
      return {
        collapse,
        toggleCollapse,
        editableTabsValue: "2",
        editableTabs: [
          {
            title: "Tab 1",
            name: "1",
            content: "Tab 1 content",
          },
          {
            title: "Tab 2",
            name: "2",
            content: "Tab 2 content",
          },
        ],
        tabIndex: 2,
      };
    },
  });
</script>
