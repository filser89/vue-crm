<template>
  <div class="col s12 m6 l4">
    <div class="card light-blue bill-card">
      <div class="card-content white-text">
        <span class="card-title">{{ 'AmountFOREX' | localize }}</span>
        <p v-for="cur of currencies" :key="cur" class="currency-line">
          <span>{{ getCurrency(cur) | currency(cur) }}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['rates'],
  data: () => ({
    currencies: [],
  }),
  computed: {
    base() {
      return (
        this.$store.getters.info.account /
        (this.rates['CNY'] / this.rates['EUR'])
      );
    },
  },
  methods: {
    getCurrency(currency) {
      return Math.floor(this.base * this.rates[currency]);
    },
  },
  async mounted() {
    this.currencies = await Object.keys(this.rates).reverse();
  },
};
</script>
