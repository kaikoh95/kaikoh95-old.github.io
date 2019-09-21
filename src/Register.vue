<template>
  <div>
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="400" style="padding: 100px">
        <FormItem label="Username" prop="username">
            <Input v-model="formValidate.username" placeholder="Enter Username" style="width: 300px"></Input>
        </FormItem>
        <FormItem label="Given Name" prop="givenName">
            <Input v-model="formValidate.givenName" placeholder="Enter Given Name" style="width: 300px"></Input>
        </FormItem>
        <FormItem label="Family Name" prop="familyName">
            <Input v-model="formValidate.familyName" placeholder="Enter Family Name" style="width: 300px"></Input>
        </FormItem>
        <FormItem label="Email" prop="email">
            <Input v-model="formValidate.email" placeholder="Enter Email Address" style="width: 300px"></Input>
        </FormItem>
        <FormItem label="Password" prop="password">
            <Input type="password" v-model="formValidate.password" placeholder="Enter Password" style="width: 300px"></Input>
        </FormItem>
        <FormItem label="Repeat Password" prop="passwordRepeat">
            <Input type="password" v-model="formValidate.passwordRepeat" placeholder="Enter Password Again" style="width: 300px"></Input>
        </FormItem>
        <FormItem>
            <Button type="primary" @click="handleSubmit('formValidate')" style="margin-left: 50px; margin-right: 20px">Submit</Button>
            <Button type="default" @click="handleReset('formValidate')" style="margin-left: 20px">Reset</Button>
        </FormItem>
    </Form>
    <Footer class="layout-footer">
      <Button align="center" style="margin-right: 30px; text-align: center" type="primary" onclick="window.location.href='/venues'">All Venues</Button>
      <Button type="warning" onclick="window.location.href='/'">Home</Button>
      2019 &copy; Travel Review Site
    </Footer>
  </div>
</template>
<script>
    export default {
        data () {
            return {
                formValidate: {
                    username: "",
                    givenName: "",
                    familyName: "",
                    email: "",
                    password: "",
                    passwordRepeat: ""
                },
                ruleValidate: {
                    username: [
                      { required: true, message: 'Username cannot be empty', trigger: 'blur' }
                    ],
                    email: [
                      { required: true, message: 'Email cannot be empty', trigger: 'blur' },
                      { type: 'email', message: 'Incorrect email format', trigger: 'blur' }
                    ],
                    givenName: [
                      { required: true, message: 'Given Name cannot be empty', trigger: 'blur' }
                    ],
                    familyName: [
                      { required: true, message: 'Family Name cannot be empty', trigger: 'blur' }
                    ],
                    password: [
                      { required: true, message: 'Password cannot be empty', trigger: 'blur' }
                    ],
                    passwordRepeat: [
                      { required: true, message: 'Repeat Password cannot be empty', trigger: 'blur' }
                    ],
                }
            }
        },
        methods: {
            handleSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        if (this.formValidate.username.length > 64) {
                          this.$Message.error('Username cannot be longer than 64 characters!');
                        }
                        if (this.formValidate.passwordRepeat !== this.formValidate.password){
                          this.$Message.error('Passwords do not match!');
                        } else {
                            this.$resource['content-type'] = 'application/json';
                            this.$http.post('http://localhost:4941/api/v1/users',
                              JSON.stringify({
                                "username": this.formValidate.username,
                                "email": this.formValidate.email,
                                "givenName": this.formValidate.givenName,
                                "familyName": this.formValidate.familyName,
                                "password": this.formValidate.password
                              })
                            ).then(function () {
                              this.$http.post('http://localhost:4941/api/v1/users/login',
                                JSON.stringify({
                                "username": this.formValidate.username,
                                "password": this.formValidate.password
                                })
                              ).then(function (response) {
                                this.$cookies.set("AuthToken", response.data.token, "24h");
                                this.$cookies.set("UserId", response.data.userId, "24h");
                                alert("You have successfully been registered and logged in!");
                                window.location.href = '/'
                              }, function() {
                                this.$Message.error("Internal Server Error, please try again in a few moments!");
                              });
                            },function() {
                              this.$Message.error("Username or Email is already taken!");
                            });
                        }
                    } else {
                      this.$Message.error("Form is invalid!");
                    }
                });
            },
            handleReset(name) {
              this.$refs[name].resetFields();
            },
            handleHome() {
              window.location.href = '/'
            }
        }
    }
</script>
