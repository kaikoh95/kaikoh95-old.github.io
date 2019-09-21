<template>
  <div>
    <div style="margin-top: 200px;text-align: center" align="center">
      <span>User ID</span>
      <Input v-model="userId" placeholder="Enter User ID" style="width: 300px"></Input>
      <br>
      <br>
      <Button style="margin-right: 30px" type="secondary" @click="reset()">Reset</Button>
      <Button type="success" @click="handleSubmit">Go</Button>
    </div>
    <Footer style="position: fixed" class="layout-footer">
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
        userId: ''
      }
    },
    mounted: function () {
    },
    methods: {
      handleSubmit() {
        localStorage.otherUserId = this.userId;
        if (this.$cookies.get('UserId') === this.userId) {
          window.location.href='/myProfile';
        } else {
          window.location.href='/user';
        }
      },
      reset() {
        this.userId = '';
      }
    }
  }
</script>


