const axios = require('axios');

<template>
  <div>
    <Form style="text-align: center">
      <FormItem>
        <Card style="margin-top:50px; margin-left: 650px; width: 120px; height: 120px">
          <div style="text-align:center">
            <img v-bind:src="imageView" alt="No image uploaded" style="text-align: center; width: 80px; height: 80px">
          </div>
        </Card>
      </FormItem>
      <FormItem>
        <h2 style="text-align: center; color: #00CE00"><span>User Information</span></h2>
        <br>
        <Table border :columns="columnHeadings" :data="profile"></Table>
      </FormItem>
      <div align="center">
        <Button align="center" style="text-align: center;" type="success" @click="searchUser= true">Search User</Button>
      </div>
      <br>
      <br>
      <Modal
        v-model="searchUser"
        title="Search for a user"
        @on-ok="handleOk"
        @on-cancel="handleCancel"
        height="400px" >
        <br>
        <span>User ID</span>
        <Input v-model="userId" placeholder="Enter User Id" style="width: 300px"></Input>
        <br>
        <br>
      </Modal>
      <FormItem>
        <h2 style="text-align: center; color: #00CE00"><span>Upload Profile Picture</span></h2>
        <p>(no larger than 20mb)</p>
        <br>
        <input type="file" single v-on:change="fileChange" accept=".jpeg,.jpg,.png">
        <br>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="insertPhoto()" style="margin-right: 20px">Submit</Button>
        <Button type="warning" @click="deletePhoto()">Delete</Button>
      </FormItem>
    </Form>
    <br>
    <Footer class="layout-footer">
      <Button align="center" style="margin-right: 30px; text-align: center" type="primary" onclick="window.location.href='/venues'">All Venues</Button>
      <Button type="warning" onclick="window.location.href='/'">Home</Button>
      2019 &copy; Travel Review Site
    </Footer>
  </div>
</template>

<script>
  export default {

    data() {
      return {
        userId: '',
        searchUser: false,
        fileName: '',
        imageView: '',
        columnHeadings: [
          {
            title: 'Username',
            key: 'username',
            align: 'center'
          },
          {
            title: 'Given Name',
            key: 'givenName',
            align: 'center'
          },
          {
            title: 'Family Name',
            key: 'familyName',
            align: 'center'
          },
          {
            title: 'Email',
            key: 'email',
            align: 'center'
          },
          {
            title: 'Action',
            key: 'action',
            fixed: 'right',
            width: 150,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      window.location.href='/infoChange'
                    }
                  }
                }, 'Update')
              ]);
            }
          }
        ],
        profile:[]
      }
    },
    mounted: function () {
      this.getOwn();
      this.getImage();
    },
    methods: {
      getOwn: function () {
        this.$http.get('http://localhost:4941/api/v1/users/'+ this.$cookies.get("UserId"), {
          headers: {'X-Authorization': this.$cookies.get("AuthToken")}
        })
          .then(function (response) {
            this.profile.push(response.data);
          },function() {
            alert("Invalid session, please login!");
            this.$cookies.remove("AuthToken");
            this.$cookies.remove("UserId");
            window.location.href='/';
          });
      },
      fileChange(event) {
        this.fileName = event.target.files[0];
      },
      insertPhoto: function () {
        if (this.fileName.size > 20480) {
          alert('Image too large! Aborting...');
          window.location.reload();
        }
        let extension = String(this.fileName.name.split('.').pop());
        if (extension === "jpg" || extension === "png") {
          extension = "jpeg";
        }
        let contentType = "image/" + extension;
        axios.put('http://localhost:4941/api/v1/users/'+ this.$cookies.get("UserId") + '/photo',
          this.fileName, {
            headers: {
              "X-Authorization": this.$cookies.get("AuthToken"),
              "Content-Type": contentType
            }
          })
          .then(function () {
            alert('Profile photo uploaded!');
            window.location.reload();
          }, function() {
            alert('Invalid photo uploaded!');
          });
      },
      deletePhoto() {
        this.$http.delete('http://localhost:4941/api/v1/users/'+ this.$cookies.get("UserId") + '/photo', {
            headers: {
              "X-Authorization": this.$cookies.get("AuthToken")
            }
          })
          .then(function () {
            alert("Profile photo deleted!");
            this.imageView = "";
            window.location.reload();
          }, function() {
            alert("Nothing to delete!");
          });
      },
      getImage() {
        this.$http.get('http://localhost:4941/api/v1/users/'+ this.$cookies.get("UserId") + '/photo')
          .then(function (response) {
            if (response.data !== null && response.data !== undefined && response.data !== "") {
              this.imageView = "http://localhost:4941/api/v1/users/" + this.$cookies.get("UserId")+ "/photo";
            } else {
              this.imageView = '../src/assets/default.png';
            }
          }, function() {
            this.imageView = '../src/assets/default.png';
          });
      },
      handleOk() {
        this.profile = [];
        localStorage.otherUserId = this.userId;
        window.location.href='/user';
      },
      handleCancel () {
        this.$Message.info('Search cancel!');
        this.userId = '';
      }
    }
  }
</script>


