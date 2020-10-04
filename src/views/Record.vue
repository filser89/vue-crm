<template>
  <div>
    <div class="page-title">
      <h3>{{ 'TitleNewRecord' | localize }}</h3>
    </div>
    <Loader v-if="loading" />
    <p v-else-if="!categories.length" class="center">
      {{ 'Message_NoCategories' | localize }}
      <router-link to="/categories">{{ 'AddCategory' | localize }}</router-link>
    </p>
    <form class="form" @submit.prevent="submitHandler" v-else>
      <div class="input-field">
        <select ref="select" v-model="category">
          <option v-for="cat of categories" :key="cat.id" :value="cat.id">{{
            cat.title
          }}</option>
        </select>
        <label>{{ 'SelectCategory' | localize }}</label>
      </div>

      <p>
        <label>
          <input
            class="with-gap"
            name="type"
            type="radio"
            value="income"
            v-model="type"
          />
          <span>{{ 'Income' | localize }}</span>
        </label>
      </p>

      <p>
        <label>
          <input
            class="with-gap"
            name="type"
            type="radio"
            value="expense"
            v-model="type"
          />
          <span>{{ 'Expense' | localize }}</span>
        </label>
      </p>

      <div class="input-field">
        <input
          id="amount"
          type="number"
          v-model.number="amount"
          :class="{ invalid: $v.amount.$dirty && !$v.amount.minValue }"
        />
        <label for="amount">{{ 'Amount' | localize }}</label>
        <span
          v-if="$v.amount.$dirty && !$v.amount.minValue"
          class="helper-text invalid"
          >{{ 'Message_MinimalValue' | localize }}
          {{ $v.amount.$params.minValue.min }}</span
        >
      </div>

      <div class="input-field">
        <input
          id="description"
          type="text"
          v-model="description"
          :class="{
            invalid: $v.description.$dirty && !$v.description.required,
          }"
        />
        <label for="description">{{ 'Description' | localize }}</label>
        <span
          v-if="$v.description.$dirty && !$v.description.required"
          class="helper-text invalid"
          >{{ 'Message_EnterDescription' | localize }}</span
        >
      </div>

      <button class="btn waves-effect waves-light" type="submit">
        {{ 'Create' | localize }}
        <i class="material-icons right">send</i>
      </button>
    </form>
  </div>
</template>

<script>
import localizeFilter from '@/filters/localize.filter';
import { required, minValue } from 'vuelidate/lib/validators';
import { mapGetters } from 'vuex';
export default {
  metaInfo() {
    return {
      title: this.$title('TitleNewRecord'),
    };
  },
  name: 'record',
  data: () => ({
    type: 'expense',
    amount: 100,
    description: '',
    select: null,
    loading: true,
    categories: [],
    category: null,
  }),
  validations: {
    amount: { minValue: minValue(100) },
    description: { required },
  },
  async mounted() {
    this.categories = await this.$store.dispatch('fetchCategories');
    this.loading = false;
    if (this.categories.length) {
      this.category = this.categories[0].id;
    }
    setTimeout(() => {
      // eslint-disable-next-line
      this.select = M.FormSelect.init(this.$refs.select);
      // eslint-disable-next-line
      M.updateTextFields();
    }, 0);
  },
  destroyed() {
    if (this.select && this.select.destroy) {
      this.select.destroy();
    }
  },
  computed: {
    ...mapGetters(['info']),
    canCreateRecord() {
      if (this.type === 'income') {
        return true;
      }
      return this.info.account >= this.amount;
    },
  },
  methods: {
    async submitHandler() {
      if (this.$v.$invalid) {
        this.$v.$touch();
        return;
      }

      if (this.canCreateRecord) {
        const formData = {
          categoryId: this.category,
          amount: this.amount,
          description: this.description,
          type: this.type,
          date: new Date().toJSON(),
        };
        try {
          await this.$store.dispatch('createRecord', formData);
          const account =
            this.type === 'income'
              ? this.info.account + this.amount
              : this.info.account - this.amount;

          await this.$store.dispatch('updateInfo', { account });
          this.$message('Record created');
          this.$v.$reset();
          this.amount = 100;
          this.description = '';
          // eslint-disable-next-line
        } catch (e) {}
      } else {
        this.$message(localizeFilter('Message_NotEnoughFunds'));
      }
    },
  },
};
</script>
