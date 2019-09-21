<template>
  <div style="margin-top: 30px">
    <h1 id="reviews" align="center"><span>All Reviews</span></h1>
    <div style="margin: 20px" align="center">
      <Button align="center" style="margin-right: 30px; text-align: center" type="default" onclick="window.location.href='/venue'">Back</Button>
      <Button v-if="isNotAdmin" align="center" style="text-align: center" type="success" @click="reviewModal=true">Write a Review</Button>
    </div>
    <Table border :columns="reviewsColumn" :data="reviews"></Table>
    <Modal
      v-model="reviewModal"
      title="Write A Review"
      height="600px">
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100" >
        <FormItem label="Review" prop="reviewBody">
          <Input v-model="formValidate.reviewBody" placeholder="Enter Review Here" style="width: 300px"></Input>
        </FormItem>
        <FormItem label="Star Rating" prop="starRating">
          <Select v-model="formValidate.starRating" style="width: 300px">
            <Option value=1>1 ★</Option>
            <Option value=2>2 ★</Option>
            <Option value=3>3 ★</Option>
            <Option value=4>4 ★</Option>
            <Option value=5>5 ★</Option>
          </Select>
        </FormItem>
        <FormItem label="Cost Rating" prop="costRating">
          <Select v-model="formValidate.costRating" style="width: 300px">
            <Option value=0>Free</Option>
            <Option value=1>$</Option>
            <Option value=2>$ $</Option>
            <Option value=3>$ $ $</Option>
            <Option value=4>$ $ $ $</Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="success" @click="reset">Clear Fields</Button>
        <Button type="error" @click="handleCancel">Cancel</Button>
        <Button type="primary" @click="handleOk('formValidate')">Submit</Button>
      </div>
    </Modal>
    <Footer style="margin-top: 20px" class="layout-footer">
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
        reviewModal: false,
        isNotAdmin: false,
        formValidate: {
          reviewBody: '',
          starRating: 1,
          costRating: 0,
        },
        ruleValidate: {
          reviewBody: [
            { required: true, message: 'Cannot be empty', trigger: 'blur' }
          ],
          starRating: [
            { required: true, message: 'Cannot be empty', trigger: 'blur' }
          ],
          costRating: [
            { required: true, message: 'Cannot be empty', trigger: 'blur' },
          ],
        },
        reviews: [],
        reviewsColumn: [
          {
            title: 'Review Author',
            key: 'username',
            align: 'center',
          },
          {
            title: 'Review Body',
            key: 'reviewBody',
            align: 'center',
          },
          {
            title: 'Star Rating',
            key: 'starRating',
            align: 'center',
          },
          {
            title: 'Cost Rating',
            key: 'costRating',
            align: 'center',
          },
          {
            title: 'Time Posted',
            key:'postedTime',
            align: 'center',
          },
          {
            title: 'Date Posted',
            key:'postedDate',
            align: 'center',
          }
        ],
      }
    },
    mounted: function () {
      if (localStorage.otherUserId.toString() === this.$cookies.get("UserId").toString()) {
          this.isNotAdmin = false;
      } else {
        this.isNotAdmin = true;
      }
      this.getReviews();
    },
    methods: {
      getReviews() {
        this.$http.get('http://localhost:4941/api/v1/venues/' + localStorage.venueId + '/reviews')
          .then(function (response) {
            let result = response.data;
            for (let i = 0; i < result.length; i++) {
              result[i]['username'] = response.data[i].reviewAuthor.username;
              result[i]['postedTime'] = response.data[i].timePosted.split('T')[1].split('.')[0];
              result[i]['postedDate'] = response.data[i].timePosted.split('T')[0];
            }
            this.reviews = result;
            this.reviews.sort((a,b) => (a.timePosted < b.timePosted) ? 1 : ((b.timePosted < a.timePosted) ? -1 : 0));
          });
      },
      handleOk(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            let data = {
              "reviewBody": this.formValidate.reviewBody,
              "starRating": parseInt(this.formValidate.starRating),
              "costRating": parseInt(this.formValidate.costRating)
            };
            this.$http.post('http://localhost:4941/api/v1/venues/'+ localStorage.venueId +'/reviews', JSON.stringify(data),
              {headers: {
                'X-Authorization': this.$cookies.get("AuthToken"),
                'Content-Type': 'application/json'}
              })
              .then(function () {
                alert("Review has been created, thank you!");
                window.location.href = '/reviews';
              }, function() {
                alert("You are not allowed to give a review!");
                window.location.href = '/reviews';
              });
          } else {
            alert('Please fill in all entries!');
          }
        });
      },
      handleCancel () {
        this.reset();
        this.reviewModal = false;
        this.$Message.info('Search cancel!');
      },
      reset() {
        this.formValidate.reviewBody = '';
        this.formValidate.starRating = 1;
        this.formValidate.costRating = 0;
      },
    }
  }
</script>


