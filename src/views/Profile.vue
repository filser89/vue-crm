<template>
  <div>
    <div class="page-title">
      <h3>{{ 'ProfileTitle' | localize }}</h3>
    </div>

    <form class="form" @submit.prevent="submitHandler">
      <div class="input-field">
        <input
          id="description"
          type="text"
          v-model.trim="name"
          :class="{
            invalid: $v.name.$dirty && !$v.name.required,
          }"
        />
        <label for="description">{{ 'Name' | localize }}</label>
        <small
          v-if="$v.name.$dirty && !$v.name.required"
          class="helper-text invalid"
          >{{ 'Message_EnterName' | localize }}</small
        >
      </div>
      <!-- Switch -->
      <div class="switch">
        <label>
          Русский
          <input type="checkbox" v-model="isEnLocale" />
          <span class="lever"></span>
          English
        </label>
      </div>
      <button class="btn waves-effect waves-light" type="submit">
        {{ 'Edit' | localize }}
        <i class="material-icons right">send</i>
      </button>
    </form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { required } from 'vuelidate/lib/validators';
import localizeFilter from '@/filters/localize.filter';
export default {
  metaInfo() {
    return {
      title: this.$title('ProfileTitle'),
    };
  },
  name: 'profile',
  data: () => ({
    name: '',
    isEnLocale: true,
  }),
  computed: {
    ...mapGetters(['info']),
  },
  mounted() {
    this.name = this.info.name;
    this.isEnLocale = this.info.locale === 'en-US';
    // eslint-disable-next-line
    setTimeout(() => M.updateTextFields(), 0);
  },
  validations: {
    name: { required },
  },
  methods: {
    async submitHandler() {
      if (this.$v.$invalid) {
        this.$v.$touch();
        return;
      }
      try {
        await this.$store.dispatch('updateInfo', {
          name: this.name,
          locale: this.isEnLocale ? 'en-US' : 'ru-Ru',
        });
        this.$message(localizeFilter('Message_ProfileUpdated'));
        // eslint-disable-next-line
      } catch (e) {}
    },
  },
};
</script>

<style scoped>
.switch {
  margin-bottom: 2rem;
}
</style>
