<script>

const defaultStyle = {width: '650px'};

export default {
  name: "food-create-and-edit-dialog",
  props: {entity: null, visible: Boolean, entityName: '', edit: Boolean, size: 'default'},
  data() {
    return {
      categoryOptions: [
        {label: 'Drink', value: 'Drink'},
        {label: 'Appetizer', value: 'Appetizer'},
        {label: 'Main dish', value: 'Main dish'},
        {label: 'Dessert', value: 'Dessert'}
      ]
    }
  },
  methods: {
    onSave() {
      this.$emit('saved', this.entity);
    },
    onCancel() {
      this.$emit('canceled');
    },
    getHeaderTitle() {
      return `${this.edit ? 'Edit' : 'New'} ${this.entityName}`;
    },
    getSubmitLabel() {
      return this.edit ? 'Update' : 'Create';
    },
    getDialogStyle() {
      let dialogStyle = defaultStyle;
      dialogStyle = this.size === 'standard' ? {width: '600px'} : defaultStyle;
      dialogStyle = this.size === 'large' ? {width: '900px'} : defaultStyle;
      return dialogStyle;
    }
  }
}
</script>

<template>

  <pv-dialog v-bind:visible="visible" :modal="true" :style="getDialogStyle()" class="p-fluid" :header="entityName">
    <template #header>
      <div class="flex justify-content-start">
        <div>{{ getHeaderTitle() }}</div>
      </div>
    </template>
    <div class="p-fluid">
      <div class="field">
        <label for="name">Name</label>
        <pv-input-text id="name" v-model="entity.name" aria-describedby="-help" :class="{'p-invalid':!entity.name}"/>
        <small id="name-help" v-if="!entity.name" class="p-invalid">Enter the name of the food</small>
      </div>
      <div class="field">
        <label for="category">Category</label>
        <pv-dropdown id="category" v-model="entity.category" :options="categoryOptions" optionLabel="label"
                     optionValue="value" :class="{'p-invalid':!entity.category}"/>
        <small v-if="!entity.category" class="p-invalid">Select the category of the food</small>
      </div>
      <div class="field">
        <label for="image">Image</label>
        <pv-input-text id="image" v-model="entity.image" :class="{'p-invalid':!entity.image}"/>
        <small v-if="!entity.image" class="p-invalid">Enter the Url Image of the food</small>
      </div>
      <div class="p-field">
        <label for="quantity">Quantity</label>
        <input id="quantity" v-model="entity.quantity" class="p-inputtext p-component" type="number"/>
        <small v-if="!entity.quantity" class="p-invalid">Enter the quantity of the food</small>
      </div>
      <div class="p-field">
        <label for="price">Price</label>
        <input id="price" v-model="entity.price" class="p-inputtext p-component" type="number"/>
        <small v-if="!entity.price" class="p-invalid">Enter the price of the food</small>
      </div>
    </div>
    <template #footer>
      <div class="flex justify-content-end">
        <pv-button type="button" :label="getSubmitLabel()" class="p-button-text button-green" icon="pi pi-check"
                   @click="onSave"/>
        <pv-button type="button" label="Cancel" severity="secondary" class="p-button-text button-brown"
                   icon="pi pi-times" @click="onCancel"/>
      </div>
    </template>
  </pv-dialog>

</template>

<style scoped>

</style>