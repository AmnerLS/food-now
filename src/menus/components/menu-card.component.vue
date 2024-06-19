<script>

export default {
  name: "menu-card",
  props: { menu: Object }
}
</script>

<template>
  <pv-card style="width: 20rem;">
    <template #header>
      <img alt="menu header" :src="menu.image" style="width: auto; height: 100px;"/>
    </template>
    <template #title>{{menu.name}}</template>
    <template #subtitle>{{menu.price}}</template>
    <template #content>
      <p class="m-0">{{menu.description}} </p>
    </template>
    <template #footer>
      <div class="flex gap-4 mt-1">
        <Button label="View" severity="secondary" outlined class="w-full" />
        <Button label="Buy" class="w-full" />
      </div>
    </template>
  </pv-card>
</template>

<style scoped>

</style>