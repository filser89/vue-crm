<template>
  <div class="home">
    <div>
      <div class="page-title">
        <h3>{{ 'AccountTitle' | localize }}</h3>

        <button
          class="btn waves-effect waves-light btn-small"
          @click.prevent="refresh"
        >
          <i class="material-icons">refresh</i>
        </button>
      </div>
      <Loader v-if="loading" />
      <div v-else class="row">
        <HomeAccount :rates="currency.rates" />
        <HomeCurrency :rates="currency.rates" :date="currency.date" />
      </div>
    </div>
  </div>
</template>

<script>
import HomeAccount from '@/components/HomeAccount';
import HomeCurrency from '@/components/HomeCurrency';
export default {
  metaInfo() {
    return {
      title: this.$title('AccountTitle'),
    };
  },
  name: 'Home',
  data: () => ({
    loading: true,
    currency: null,
  }),
  async mounted() {
    this.currency = await this.setCurrency();
    this.loading = false;
  },
  components: {
    HomeAccount,
    HomeCurrency,
  },
  methods: {
    async setCurrency() {
      const currency = await this.$store.dispatch('fetchCurrency');
      return {
        ...currency,
        rates: Object.fromEntries(
          Object.entries(currency.rates).map(rate => [
            rate[0],
            parseFloat(rate[1]),
          ])
        ),
      };
    },
    async refresh() {
      this.loading = true;
      this.currency = await this.setCurrency();
      setTimeout(() => (this.loading = false), 500);
    },
  },
};
</script>
