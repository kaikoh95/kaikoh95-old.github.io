<template>
  <div>
    <Form ref="formLogin" :model="formLogin" :rules="ruleLogin" inline style="padding: 200px; text-align: center">
      <FormItem prop="user">
        <Input type="text" v-model="formLogin.user" placeholder="Username/Email">
        <Icon type="ios-person-outline" slot="prepend"></Icon>
        </Input>
      </FormItem>
      <br>
      <FormItem prop="password">
        <Input type="password" v-model="formLogin.password" placeholder="Password">
        <Icon type="ios-locked-outline" slot="prepend"></Icon>
        </Input>
      </FormItem>
      <br>
      <FormItem>
        <Button type="primary" @click="handleSubmit('formLogin')">Login</Button>
      </FormItem>
      <br>
      <span style="font-size:20px; vertical-align: middle">Not registered? You can sign up here! </span>
      <Button type="secondary" onclick="window.location.href='/register'">Register Now</Button>
    </Form>
    <Footer class="layout-footer" style="text-align: end">
      <Button type="warning" onclick="window.location.href='/'">Home</Button>
      2019 &copy; Travel Review Site
    </Footer>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        formLogin: {
          user: '',
          password: '',
          id: '',
          token: ''
        },
        ruleLogin: {
          user: [
            { required: true, message: 'Cannot be empty!', trigger: 'blur' }
          ],
          password: [
            { required: true, message: 'Cannot be empty!', trigger: 'blur' },
            { type: 'string', min: 1, message: 'Cannot be empty!', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      handleSubmit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            if((this.formLogin.user).indexOf("@") === -1) {
              this.$http.post('http://localhost:4941/api/v1/users/login',
                JSON.stringify({
                "username": this.formLogin.user,
                "password": this.formLogin.password
                })
              ).then(function (response){
                this.$cookies.set("AuthToken", response.data.token, "24h");
                this.$cookies.set("UserId", response.data.userId, "24h");
                alert("You have successfully logged in!");
                window.location.href = '/'
              }, function () {
                this.$Message.error('Invalid Credentials!');
              });
            }else{
              this.$http.post('http://localhost:4941/api/v1/users/login',
                JSON.stringify({
                "email": this.formLogin.user,
                "password": this.formLogin.password
              })
              ).then(function (response){
                this.$cookies.set("AuthToken", response.data.token, "24h");
                this.$cookies.set("UserId", response.data.userId, "24h");
                alert("You have successfully logged in!");
                window.location.href = '/'
              }, function () {
                  this.$Message.error('Invalid Credentials!');
                });
              }
            }
      });
    }
  }
  }
</script>

