<template>
  <div>
    <div class="page-title">
      <h3>{{ 'PlanningTitle' | localize }}</h3>
      <h4>{{ info.account | currency }}</h4>
    </div>
    <Loader v-if="loading" />
    <p v-else-if="!categories.length" class="center">
      {{ 'Message_NoCategories' | localize }}
      <router-link to="/categories"
        >{{ 'AddCategory' | localize }}
      </router-link>
    </p>
    <section v-else>
      <div v-for="cat of categories" :key="cat.id">
        <p>
          <strong>{{ cat.title }}:</strong>
          {{ cat.spent | currency('CNY') }} {{ 'PlanningOutOf' | localize }}
          {{ cat.limit | currency('CNY') }}
        </p>
        <div class="progress" v-tooltip.noloc="cat.tooltip">
          <div
            class="determinate"
            :class="[cat.progressColor]"
            :style="{ width: cat.progressPercent + '%' }"
          ></div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import localizeFilter from '@/filters/localize.filter';
import { mapGetters } from 'vuex';
import currencyFilter from '@/filters/currency.filter';
export default {
  metaInfo() {
    return {
      title: this.$title('PlanningTitle'),
    };
  },
  name: 'planning',
  data: () => ({
    loading: true,
    categories: [],
  }),
  computed: {
    ...mapGetters(['info']),
  },
  async mounted() {
    const records = await this.$store.dispatch('fetchRecords');
    const categories = await this.$store.dispatch('fetchCategories');
    this.categories = categories.map(c => {
      const spent = records
        .filter(r => r.categoryId === c.id && r.type === 'expense')
        .reduce((acc, r) => (acc += r.amount), 0);
      const percent = (100 * spent) / c.limit;
      const progressPercent = percent > 100 ? 100 : percent;
      const progressColor =
        percent < 60 ? 'green' : percent < 100 ? 'yellow' : 'red';
      const tooltipValue = c.limit - spent;
      const tooltip = `${
        tooltipValue < 0
          ? `${localizeFilter('OverSpentLimit')}`
          : `${localizeFilter('Left')}`
      } ${currencyFilter(Math.abs(tooltipValue))}`;
      return { ...c, progressPercent, progressColor, spent, tooltip };
    });
    this.loading = false;
  },
};
</script>
