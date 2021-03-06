import firebase from "firebase/app";
export default {
  actions: {
    async createRecord(
      { commit, dispatch },
      { type, amount, description, categoryId, date }
    ) {
      try {
        const uid = await dispatch("getUid");
        const record = await firebase
          .database()
          .ref(`/users/${uid}/records`)
          .push({ date, type, amount, description, categoryId });
        return { date, type, amount, description, id: record.key, categoryId };
      } catch (e) {
        commit("setError", e);
        throw e;
      }
    },
    async fetchRecords({ commit, dispatch }) {
      // eslint-disable-next-line
      try {
        const uid = await dispatch("getUid");
        const records =
          (
            await firebase
              .database()
              .ref(`/users/${uid}/records`)
              .once("value")
          ).val() || {};
        return Object.keys(records).map((record) => ({
          ...records[record],
          id: record,
        }));
      } catch (e) {
        commit("setError", e);
        throw e;
      }
    },

    async fetchRecordById({ commit, dispatch }, id) {
      // eslint-disable-next-line
      try {
        const uid = await dispatch("getUid");
        const record =
          (
            await firebase
              .database()
              .ref(`/users/${uid}/records`)
              .child(id)
              .once("value")
          ).val() || {};
        return { ...record, id };
      } catch (e) {
        commit("setError", e);
        throw e;
      }
    },
  },
};
