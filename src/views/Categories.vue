<template>
  <div>
    <div class="page-title">
      <h3>{{ 'CategoriesTitle' | localize }}</h3>
    </div>
    <section>
      <Loader v-if="loading" />
      <div class="row" v-else>
        <CategoriesCreate @created="addNewCategory" />
        <CategoriesEdit
          v-if="categories.length"
          :categories="categories"
          @updated="updateCategories"
          :key="categories.length + counter"
        />
        <p v-else class="center">You have no Categories</p>
      </div>
    </section>
  </div>
</template>

<script>
import CategoriesCreate from '@/components/CategoriesCreate';
import CategoriesEdit from '@/components/CategoriesEdit';

export default {
  metaInfo() {
    return {
      title: this.$title('CategoriesTitle'),
    };
  },
  name: 'categories',
  data: () => ({
    categories: [],
    loading: true,
    counter: 0,
  }),
  async mounted() {
    this.categories = await this.$store.dispatch('fetchCategories');
    this.loading = false;
  },
  components: {
    CategoriesCreate,
    CategoriesEdit,
  },
  methods: {
    addNewCategory(category) {
      this.categories.push(category);
    },
    updateCategories(categoryData) {
      const idx = this.categories.findIndex(c => c.id === categoryData.id);
      this.categories[idx].title = categoryData.title;
      this.categories[idx].limit = categoryData.limit;
      this.counter++;
    },
  },
};
</script>
