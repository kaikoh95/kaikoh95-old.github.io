<template>
  <div>
    <Form ref="formValidate" :model="formValidate" :label-width="200" style="margin: 200px; margin-left: 400px">
      <FormItem label="Given Name" prop="givenName">
        <Input v-model="formValidate.givenName" placeholder="Enter givenName" style="width: 300px"></Input>
      </FormItem>
      <FormItem label="Family Name" prop="familyName">
        <Input v-model="formValidate.familyName" placeholder="Enter familyName" style="width: 300px"></Input>
      </FormItem>
      <FormItem label="New Password" prop="password">
        <Input type="password" v-model="formValidate.password" placeholder="Enter password" style="width: 300px"></Input>
      </FormItem>
      <FormItem>
          <Button type="ghost" @click="handleBack('formValidate')" style="margin-right: 8px">Back</Button>
          <Button type="secondary" @click="handleReset('formValidate')" style="margin-right: 8px">Reset</Button>
          <Button type="primary" @click="handleCheck('formValidate')">Change</Button>
      </FormItem>
    </Form>
    <Modal
      v-model="modal1"
      title="Please enter old password for verification"
      @on-ok="handleOk"
      @on-cancel="handleCancel"
      height="30px" >
      <span>Old Password</span>
      <Input v-model="formValidate.oldPassword" type="password" placeholder="Enter old password" style="width: 300px"></Input>
    </Modal>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        modal1: false,
        formValidate: {
          givenName: '',
          familyName: '',
          password: '',
          oldPassword: '',
        },
      }
    },

    methods: {
      handleCheck() {
        if (this.formValidate.password.length > 0) {
          this.modal1 = true;
        } else {
          this.modal1 = false;
          this.handleSubmit();
        }
      },
      handleSubmit() {
        let data1 = {
            "givenName": this.formValidate.givenName,
            "familyName": this.formValidate.familyName,
            "password": this.formValidate.password
          };
          let name = ["givenName", "familyName", "password"];
          for (let i = 0; i<name.length; i++) {
            if (data1[name[i]].length === 0 || data1[name[i]].length === undefined) {
              delete data1[name[i]]
            }
          }
          this.formValidate.data1 = data1;
          this.$http.patch('http://localhost:4941/api/v1/users/' + this.$cookies.get("UserId"), JSON.stringify(this.formValidate.data1),
            {headers: {'X-Authorization': this.$cookies.get("AuthToken")}})
            .then(function () {
              alert("You have changed your information!");
              this.modal1 = false;
              window.location.href = '/myProfile'
            }, function() {
              this.$Message.error('Please fill in something!');
            })
      },
      handleOk() {
        this.$http.post('http://localhost:4941/api/v1/users/login',
          JSON.stringify({
            "username": this.$cookies.get("Username"),
            "password": this.formValidate.oldPassword
          })
        ).then(function(response) {
          this.$cookies.set("AuthToken", response.data.token, "24h");
          this.handleSubmit();
        }, function () {
          this.$Message.error('Invalid Credentials!');
        });
      },
      handleCancel() {
        this.$Message.info('Cancelled!');
      },
      handleReset(name) {
        this.$refs[name].resetFields();
        this.modal1 = false;
      },
      handleBack() {
        this.modal1 = false;
        window.location.href = '/myProfile'
      }
    }
  }
</script>
