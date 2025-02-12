<template>
    <MDBModal
        id="modalRemoveMember"
        tabindex="-1"
        labelledby="modalRemoveMemberLabel"
        v-model="active"
    >
        <MDBModalHeader>
          <MDBModalTitle id="modalRemoveMemberLabel"> {{ t('default.remove_member') }} </MDBModalTitle>
        </MDBModalHeader>
        <MDBModalBody class="text-start">
          <label for="account-input" class="form-label">{{ t('default.account') }}</label>
          <MDBSelect class="text-left" id="account-input" inputGroup :formOutline="false" aria-describedby="account-addon" v-model:options="accountsDropdown" v-model:selected="formAccount"
              @keyup="validateAccount()" @blur="validateAccount()" :isValid="!errors.formAccount" :isValidated="isValidated.formAccount" :invalidFeedback="errors.formAccount"
          />
          <br/>
          <label for="group-input" class="form-label">{{ t('default.group') }}</label>
          <MDBSelect class="text-left" id="group-input" inputGroup :formOutline="false" aria-describedby="group-addon" v-model:options="groupsDropdown" v-model:selected="formGroup"
              @keyup="validateGroup()" @blur="validateGroup()" :isValid="!errors.formGroup" :isValidated="isValidated.formGroup" :invalidFeedback="errors.formGroup"
          />
          <br/>
          <label for="note-input" class="form-label">{{ t('default.note') }}</label>
          <MDBInput class="text-left" id="note-input" min="0.00" inputGroup :formOutline="false" aria-describedby="note-addon" v-model.number="formNote"
              @keyup="validateNote()" @blur="validateNote()" :isValid="!errors.formNote" :isValidated="isValidated.formNote" :invalidFeedback="errors.formNote"
          >
          </MDBInput>
          
        </MDBModalBody>
        <MDBModalFooter>
          <MDBBtn color="secondary" @click="close()">{{ t('default.close') }}</MDBBtn>
          <MDBBtn color="primary" @click="vote()">{{ t('default.vote') }}</MDBBtn>
        </MDBModalFooter>
    </MDBModal>
</template>

<script>
import { ref, toRefs, watch } from "vue";
import { reactive } from "@vue/reactivity";
import { useI18n } from "vue-i18n";
import {requiredValidator, nearAccountValidator, isValid, maxLength} from '@/utils/validators'
import {
  MDBBtn,
  MDBInput,
  MDBSelect,
  MDBModal,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter
} from "mdb-vue-ui-kit";

export default {
  components: {
    MDBBtn
    , MDBInput, MDBSelect
    , MDBModal, MDBModalHeader, MDBModalTitle, MDBModalBody, MDBModalFooter
  },
  props: {
    show: {
      type: Number,
      required: true
    },
    contractId: {
      type: String,
      required: true
    },
    groups: {
      type: Object,
      required: true
    },
    tokenHolders: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const { t } = useI18n();

    const { show } = toRefs(props)

    const active = ref(false)
    
    const openModal = () => { active.value = true }

    watch(show, openModal)

    const formAccount = ref('')
    const formGroup = ref('Community')
    const formNote = ref('')

    const isValidated = ref({
        formAccount: false,
        formGroup: false,
        formNote: false,
    })

    const errors = reactive({});

    return {
      t, active
      , formAccount, formGroup, formNote
      , isValidated, errors
    };
  },
  computed: {
    factoryAccount() {
      return this.$store.getters['near/getFactoryAccount']
    },
    accountId() {
      return this.$store.getters['near/getAccountId']
    },
    nearService() {
      return this.$store.getters['near/getService']
    },
    accountsDropdown() {
      return Object.keys(this.tokenHolders).map(accountId => {return {value: accountId, text: accountId}})
    },
    groupsDropdown() {
      return [
        {value: 'Insiders', text: this.t('default.council')},
        {value: 'Community', text: this.t('default.community')},
        {value: 'Foundation', text: this.t('default.investor')},
      ]
    },
  },
  methods: {
    validateAccount(){
      const field = "formAccount"
      const requiredVal = requiredValidator(this.formAccount)
      const nearAccountVal = nearAccountValidator(this.formAccount)
      if (requiredVal.valid === false) {
        this.errors[field] = this.t('default.' + requiredVal.message, requiredVal.params)
      } else if (nearAccountVal.valid === false) {
        this.errors[field] = this.t('default.' + nearAccountVal.message, nearAccountVal.params)
      } else {
        this.errors[field] = null
      }
      this.isValidated.formAccount = true
    },
    validateGroup(){
      const field = "formGroup"
      const requiredVal = requiredValidator(this.formGroup)
      if (requiredVal.valid === false) {
        this.errors[field] = this.t('default.' + requiredVal.message, requiredVal.params)
      } else {
        this.errors[field] = null
      }
      this.isValidated.formGroup = true
    },
    validateNote(){
      const field = "formNote"
      const maxLengthVal = maxLength(this.formNote, 100)
      if (maxLengthVal.valid === false) {
        this.errors[field] = this.t('default.' + maxLengthVal.message, maxLengthVal.params)
      } else {
        this.errors[field] = null
      }
      this.isValidated.formNote = true
    },
    validate(){
      this.validateAccount()
      this.validateGroup()
      this.validateNote()
    },
    vote() {
      this.validate()
      if (isValid(this.errors) === true) {
        console.log(this.formGroup)
        console.log(this.formAccount)
        this.nearService.addProposal(
            this.contractId
            , this.formNote
            , [this.t('default.remove_member')]
            , {
                'RemoveMember': {
                    group: this.formGroup,
                    account_id: (this.formAccount + '.' + this.factoryAccount.split('.')[1])
                }
            }
            , 1
            , this.accountId
        ).then(r => {
            console.log(r)
            this.formAccount = ''
            this.formGroup = 0
            this.formNote = ''
            this.active = false
        }).catch((e) => {
            console.log(e)
        })
      }
    },
    close() {
      this.active = false
    },
  }
};
</script>