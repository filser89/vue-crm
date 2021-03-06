import firebase from 'firebase/app';

export default {
  actions: {
    // eslint-disable-next-line
    async login({ dispatch, commit }, { email, password }) {
      // eslint-disable-next-line
      try {
        await firebase.auth().signInWithEmailAndPassword(email, password);
      } catch (e) {
        commit('setError', e);
        throw e;
      }
    },
    async register({ commit, dispatch }, { email, password, name }) {
      // eslint-disable-next-line
      try {
        await firebase.auth().createUserWithEmailAndPassword(email, password);
        const uid = await dispatch('getUid');
        await firebase
          .database()
          .ref(`/users/${uid}`)
          .set({
            info: {
              account: 10000,
              locale: 'en-US',
              name,
            },
          });
      } catch (e) {
        commit('setError', e);
        throw e;
      }
    },
    getUid() {
      const user = firebase.auth().currentUser;
      return user ? user.uid : null;
    },
    async logout({ commit }) {
      await firebase.auth().signOut();
      commit('clearInfo');
    },
  },
};
