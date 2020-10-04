<template>
  <div>
    <div class="page-title">
      <h3>{{ 'TransactionsTitle' | localize }}</h3>
    </div>
    <Loader v-if="loading" />
    <p v-else-if="!records.length" class="center">
      {{ 'Message_NOTransactions' | localize }}
      <router-link to="/record">{{ 'AddTransaction' | localize }}</router-link>
    </p>
    <div v-else>
      <div class="input-field">
        <select ref="select" v-model="type" @change.prevent="changeHandler">
          <option value="expense">{{ 'Expenses' | localize }}</option>
          <option value="income">{{ 'Incomes' | localize }}</option>
        </select>
        <label>{{ 'SelectTransactionType' | localize }}</label>
      </div>
      <div class="history-chart">
        <TransactionsChart :chart-data="chartData" :type="type" />
      </div>

      <section>
        <TransactionsTable :records="items" />
        <Paginate
          v-model="page"
          :page-count="pageCount"
          :click-handler="pageChangeHandler"
          :prev-text="'Pagination_Prev' | localize"
          :next-text="'Pagination_Next' | localize"
          :container-class="'pagination center'"
          :page-class="'waves-effect'"
        />
      </section>
    </div>
  </div>
</template>

<script>
import localizeFilter from '@/filters/localize.filter';
import paginationMixin from '@/mixins/pagination.mixin';
import TransactionsTable from '@/components/TransactionsTable';
import TransactionsChart from '@/components/TransactionsChart';

export default {
  metaInfo() {
    return {
      title: this.$title('TransactionsTitle'),
    };
  },
  name: 'Transactions',
  mixins: [paginationMixin],
  data: () => ({
    select: null,
    loading: true,
    records: [],
    categories: [],
    type: 'expense',
  }),

  components: {
    TransactionsChart,
    TransactionsTable,
  },
  async mounted() {
    this.categories = await this.$store.dispatch('fetchCategories');
    this.records = await this.$store.dispatch('fetchRecords');
    this.setup();
    this.loading = false;
    //eslint-disable-next-line
    setTimeout(() => {
      // eslint-disable-next-line
      this.select = M.FormSelect.init(this.$refs.select);
    }, 0);
  },
  destroyed() {
    if (this.select && this.select.destroy) {
      this.select.destroy();
    }
  },
  methods: {
    setChartData() {
      const filteredCategories = this.categories.filter(cat => {
        return this.records.some(
          rec => rec.type === this.type && rec.categoryId === cat.id
        );
      });
      return {
        labels: filteredCategories.map(cat => cat.title),
        datasets: [
          {
            label: `${
              this.type === 'expense' ? 'Expenses' : 'Incomes'
            } by category`,
            data: filteredCategories.map(cat => {
              return this.records.reduce((acc, rec) => {
                if (rec.categoryId === cat.id && rec.type === this.type) {
                  acc += +rec.amount;
                }
                return acc;
              }, 0);
            }),
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
          },
        ],
      };
    },
    setup() {
      this.setupPagination(
        this.records.map(rec => ({
          ...rec,
          categoryName: this.categories.find(cat => cat.id === rec.categoryId)
            .title,
          typeClass: rec.type === 'expense' ? 'red' : 'green',
          typeText:
            rec.type === 'expense'
              ? localizeFilter('Expense')
              : localizeFilter('Income'),
        }))
      );
      this.chartData = this.setChartData();
    },
    changeHandler() {
      this.chartData = this.setChartData();
    },
  },
};
</script>
