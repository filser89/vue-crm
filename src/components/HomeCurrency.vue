<template>
  <div class="col s12 m6 l8">
    <div class="card orange darken-3 bill-card">
      <div class="card-content white-text">
        <div class="card-header">
          <span class="card-title">{{ 'Rates' | localize }}</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>{{ 'Currency' | localize }}</th>
              <th>{{ 'Rate' | localize }}</th>
              <th>{{ 'Date' | localize }}</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="cur of currencies" :key="cur">
              <td>{{ cur }}</td>
              <td>{{ rates[cur].toFixed(2) }}</td>
              <td>{{ date | date('date') }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['rates', 'date'],
  data: () => ({
    currencies: [],
  }),
  async mounted() {
    this.currencies = await Object.keys(this.rates).reverse();
  },
};
</script>
