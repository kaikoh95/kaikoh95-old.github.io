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
    </Form>
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
        ],
        profile:[]
      }
    },
    mounted: function () {
      this.getOne();
    },
    methods: {
      getOne: function () {
        this.$http.get('http://localhost:4941/api/v1/users/'+ localStorage.otherUserId, {
          headers: {'X-Authorization': this.$cookies.get("AuthToken")}
        })
          .then(function (response) {
            this.profile.push(response.data);
            this.getImage();
          },function() {
            alert("User does not exist! Please search again!");
            window.location.href='/searchUser';
          });
      },
      getImage() {
        this.$http.get('http://localhost:4941/api/v1/users/'+ localStorage.otherUserId + '/photo')
          .then(function (response) {
            if (response.data !== null && response.data !== undefined && response.data !== "") {
              this.imageView = "http://localhost:4941/api/v1/users/" + localStorage.otherUserId + "/photo";
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
        if (this.$cookies.get('UserId') === this.userId) {
          window.location.href='/myProfile';
        } else {
          this.getOne();
        }
      },
      handleCancel () {
        this.$Message.info('Search cancel!');
        this.userId = '';
      },
    }
  }
</script>


