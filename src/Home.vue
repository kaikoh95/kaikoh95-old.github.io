<template>
  <div class="layout">
    <Layout>
      <Header style="background: #00CE00">
        <Menu mode="horizontal" style="background: #00CE00">
          <div class="layout-logo">
            <a href="/"><img src="./assets/travel-icon.png" width="300" height="55"></a>
          </div>
          <div v-if="loginFlag">
            <div class="layout-nav">
              <MenuItem style="float: right" onclick="window.location.href='/searchUser'">
                <Icon type="person"></Icon>
                Search Users
              </MenuItem>
              <MenuItem style="float: right" onclick="window.location.href='/venues'">
                <Icon type="map"></Icon>
                View Venues
              </MenuItem>
              <MenuItem style="float: right" onclick="window.location.href='/addVenue'">
                <Icon type="compose"></Icon>
                Add Venue
              </MenuItem>
            </div>
          </div>
          <div v-else-if="logoutFlag">
            <div class="layout-nav">
              <MenuItem style="float: right" onclick="window.location.href='/searchUser'">
                <Icon type="person"></Icon>
                Search Users
              </MenuItem>
              <MenuItem style="float: right" onclick="window.location.href='/venues'">
                <Icon type="map"></Icon>
                View Venues
              </MenuItem>
              <MenuItem style="float: right" onclick="window.location.href='/register'">
                <Icon type="plus"></Icon>
                Sign up
              </MenuItem>
              <MenuItem style="float: right" onclick="window.location.href='/login'">
                <Icon type="person"></Icon>
                Login
              </MenuItem>
            </div>
          </div>
        </Menu>
      </Header>
      <Content :style="{padding: '0 100px'}">
        <Breadcrumb style="text-align: center; margin: 40px">
          <BreadcrumbItem><h2>Welcome to TRAVEL, where tourist destinations are at your fingertips!</h2></BreadcrumbItem>
        </Breadcrumb>
        <Card>
          <div v-if="logoutFlag" style="min-height: 400px; text-align: center">
            Haven't signed up? What are you waiting for!
          </div>
          <div v-else-if="loginFlag" style="min-height: 400px; text-align: center">
            <h3>Welcome <h1><i><u>{{user}}</u></i></h1> What would you like to do today?</h3>
            <Card style="margin-top: 20px; margin-left: 400px; margin-right: 100px; width: 120px; height: 120px; float:left">
              <div style="text-align:center">
                <img v-bind:src="imageView" onclick="window.location.href='/myProfile'" alt="No image uploaded" style="text-align: center; width: 80px; height: 80px">
              </div>
              <br>
              <b>My Profile</b>
            </Card>
            <Card style="margin-top: 20px; margin-right: 100px; width: 120px; height: 120px; float: left">
              <div style="text-align:center">
                <img src="../src/assets/admin-venues.png" onclick="window.location.href='/admin'" alt="No image uploaded" style="text-align: center; width: 80px; height: 80px">
              </div>
              <br>
              <b>My Venues</b>
            </Card>
          </div>
        </Card>
      </Content>
    </Layout>
    <Footer class="layout-footer">
      <Button v-if="loginFlag" type="warning" @click="handleLogout">Logout</Button>
      2019 &copy; Travel Review Site
    </Footer>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        imageView: '',
        loginFlag: false,
        logoutFlag: true,
        user: ''
      }
    },
    mounted: function() {
      if (this.$cookies.get("AuthToken") !== null && this.$cookies.get("AuthToken") !== undefined && this.$cookies.get("AuthToken") !== "") {
        this.loginFlag = true;
        this.logoutFlag = false;
        this.getImage();
        this.getUsername();
      } else {
        this.loginFlag = false;
        this.logoutFlag = true;
      }
    },
    methods: {
      getUsername() {
        this.$http.get('http://localhost:4941/api/v1/users/'+ this.$cookies.get("UserId"), {
          headers: {'X-Authorization': this.$cookies.get("AuthToken")}
        })
          .then(function (response) {
            this.$cookies.set("Username", response.data.username);
            this.user = this.$cookies.get("Username");
          }, function() {
            this.handleLogout();
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
      handleLogout() {
        this.$http.post("http://localhost:4941/api/v1/users/logout", "", {
          headers: {"X-Authorization": this.$cookies.get("AuthToken")}
        })
          .then(function() {
            this.$cookies.remove("AuthToken");
            this.$cookies.remove("UserId");
            this.loginFlag = false;
            this.logoutFlag = true;
            alert("You have logged out successfully!");
            window.location.href = '/'
          }, function() {
            this.$cookies.remove("AuthToken");
            this.$cookies.remove("UserId");
            this.loginFlag = false;
            this.logoutFlag = true;
            alert("You have logged out successfully!");
            window.location.href = '/'
          });
      }
    }
  }
</script>
