<template>
  <Header></Header>

  <main>
    <!-- dashboard -->
    <section class="bg-white shadow-2 mb-3">
      <div class="container">
        <!-- Breadcrumb -->
        <Breadcrumb :account="q_id" :list-router="'dao-list'" :list-name="'organizations'"/>
        <!-- /Breadcrumb -->
        <!-- Dashboard -->
        <Dashboard v-if="loaded === true" :dao="dao"/>
        <SkeletonDashboard v-else />

        <!-- /Dashboard -->
        <!-- Buttons -->
        <Buttons v-if="loaded" :dao="dao"/>
        <SkeletonButtons v-else />
        <!-- /Buttons -->
      </div>
    </section>

    <!-- Parts -->
    <section>
      <div class="container">
        <Overview v-if="loaded === true && this.$route.query.page === 'overview' && this.$route.query.page === undefined" :dao="dao"/>
        <Voting v-if="loaded === true && (this.$route.query.page === 'overview' || this.$route.query.page === undefined)" :dao="dao"/>
        <Voting v-if="loaded === true && this.$route.query.page === 'voting'" :dao="dao"/>
        <Treasury v-if="loaded === true && this.$route.query.page === 'treasury'" :dao="dao"/>
        <Members v-if="loaded === true && this.$route.query.page === 'members'" :dao="dao"/>
        <Tokens v-if="loaded === true && this.$route.query.page === 'tokens'" :dao="dao"/>
        <Organization v-if="loaded === true && this.$route.query.page === 'organization'" :dao="dao"/>
        <Documents v-if="loaded === true && this.$route.query.page === 'documents'" :docs="dao.docs"/>
        <SkeletonBody v-if="loaded === false" />
      </div>
    </section>
    <!-- /Parts -->
  </main>

  <Footer></Footer>
</template>

<script>
import Header from '@/components/layout/Header.vue'
import Footer from '@/components/layout/Footer.vue'
import Breadcrumb from '@/components/dao/Breadcrumb.vue'
import SkeletonBody from '@/components/dao/SkeletonBody.vue'
import Buttons from '@/components/dao/Buttons.vue'
import Dashboard from '@/components/dao/Dashboard.vue'
import Members from '@/components/dao/Members.vue'
import Organization from '@/components/dao/Organization.vue'
import Overview from '@/components/dao/Overview.vue'
import SkeletonButtons from '@/components/dao/SkeletonButtons.vue'
import SkeletonDashboard from '@/components/dao/SkeletonDashboard.vue'
import Treasury from '@/components/dao/Treasury.vue'
import Tokens from '@/components/dao/Tokens.vue'
import Voting from '@/components/dao/Voting.vue'
import Documents from '@/components/dao/Documents.vue'
// import { MDBProgress, MDBProgressBar } from 'mdb-vue-ui-kit'
// MDBContainer, MDBTable, MDBBreadcrumb, MDBBreadcrumbItem, MDBInput, MDBBtn, MDBBtnGroup
import { useI18n } from 'vue-i18n'
import { ref, reactive } from 'vue'
import _ from 'lodash'
import DAO from '@/types/DAO'
import DAOs from '@/types/DAOs'
//import * as nearAPI from "near-api-js"

export default {
  components: {
    Header, Footer, Breadcrumb, Dashboard, Buttons, Overview, Voting, Treasury, Members, Tokens, Organization, Documents
    , SkeletonDashboard, SkeletonButtons, SkeletonBody
    // , MDBProgress, MDBProgressBar //MDBChart //, MDBContainer, MDBTable, MDBBreadcrumb, MDBBreadcrumbItem, MDBInput, MDBBtn, MDBBtnGroup
  },
  setup() {
    const { t } = useI18n()
    const daos = ref(DAOs.data().daos)
    const search = ref('')
    const filter = reactive({})
    const favorites = [1]
    const q_id = null
    const q_page = null
    const dao = ref(DAO.data)
    const dao_data = ref(DAO.data)
    const proposals = null
    const statistics_ft = null
    const loaded = ref(false)

    return { t, dao, daos, q_id, q_page, search, filter, favorites, proposals, statistics_ft, loaded, dao_data}
  },
  created() {
    console.log(process.env.VUE_APP_DAO_DEFAULT)
    // dao id
    if (this.$route.params && this.$route.params.id) {
      this.q_id = this.$route.params.id
    } else {
      this.q_id = process.env.VUE_APP_DAO_DEFAULT
    }
    this.$store.commit('near/setContract', this.q_id)

    // page
    if (this.$route.query.page !== undefined) {
      this.q_page = this.$route.query.page
    } else {
      this.q_page = 'overview'
    }

    // dao
    this.dao.id = this.q_id
    this.dao.wallet = this.q_id
  },
  computed: {
    wallet() {
      return this.$store.getters['near/getWallet']
    },
    nearService() {
      return this.$store.getters['near/getService']
    },
  },
  mounted() {
    this.$store.commit('near/setContract', this.q_id)
    this.getState()
  },
  methods: {
    getState() {
      console.log('getState')
      this.nearService.getDaoById(this.q_id)
        .then(r => {
          console.log(r)
          //this.dao_state = r
          this.dao = r
          this.loaded = true
        })
        .catch((e) => {
          console.log(e)
        })
    },
    favorite_switch: function (id) {
      // console.log(this.favorites);
      // console.log(_.indexOf(this.favorites, id));

      if (_.indexOf(this.favorites, id) >= 0) {
        _.pull(this.favorites, id)
        console.log('Favorites REMOVE: ' + id)
      } else {
        this.favorites.push(id)
        console.log('Favorites ADD: ' + id)
      }

      // console.log(this.favorites);
    },
    favorite_is(id) {
      return _.indexOf(this.favorites, id) >= 0
    }

  }
}
</script>