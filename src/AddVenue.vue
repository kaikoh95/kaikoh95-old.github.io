<template>
  <div>
    <Form style="margin-top: 80px; margin-left: 500px" ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120" >
      <h1 style="margin-left: -500px; text-align: center; margin-bottom: 30px">Add a Venue</h1>
      <FormItem label="Name of Venue" prop="venueName">
        <Input v-model="formValidate.venueName" placeholder="Enter the venue name" style="width: 300px"></Input>
      </FormItem>
      <FormItem label="Category ID" prop="categoryId">
        <Select v-model="formValidate.categoryId" style="width: 300px">
          <Option value=1>Accommodation</Option>
          <Option value=2>Cafés & Restaurants</Option>
          <Option value=3>Attractions</Option>
          <Option value=4>Events</Option>
          <Option value=5>Nature Spots </Option>
        </Select>
      </FormItem>
        <FormItem label="City" prop="city">
          <Input v-model="formValidate.city" placeholder="Enter the city" style="width: 300px"></Input>
        </FormItem>
      <FormItem label="Short Description" prop="shortDescription">
        <Input v-model="formValidate.shortDescription" placeholder="Enter a short description" style="width: 300px"></Input>
      </FormItem>
      <FormItem label="Long Description" prop="longDescription">
        <Input v-model="formValidate.longDescription" placeholder="Enter a more detailed description" style="width: 500px"></Input>
      </FormItem>
      <FormItem label="Address" prop="address">
        <Input v-model="formValidate.address" placeholder="Enter address of venue" style="width: 300px"></Input>
      </FormItem>
      <FormItem label="Latitude" prop="latitude">
        <Input v-model="formValidate.latitude" placeholder="Enter latitude" style="width: 300px"></Input>
      </FormItem>
      <FormItem label="Longitude" prop="longitude">
        <Input v-model="formValidate.longitude" placeholder="Enter longitude" style="width: 300px"></Input>
      </FormItem>
      <FormItem>
        <Button type="warning" @click="handleReset('formValidate')" style="margin-right: 10px">Reset</Button>
        <Button type="primary" @click="handleSubmit('formValidate')">Submit</Button>
      </FormItem>
    </Form>
    <div style="margin-top: 20px" align="center">
      <h3 align="center">Upload photos?</h3>
      <input  type="file" multiple="multiple" id="uploads" v-on:change="fileChange">
      <Button type="secondary" @click="handleUpload()" style="margin-right: 20px">Submit</Button>
      <br>
      <br>
    </div>
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
        uploads: [],
        errorFlag: false,
        formValidate: {
          venueName: '',
          categoryId: '',
          shortDescription: '',
          longDescription: '',
          city: '',
          address: '',
          latitude: '',
          longitude: '',
        },
        ruleValidate: {
          venueName: [
            { required: true, message: 'Cannot be empty', trigger: 'blur' }
          ],
          categoryId: [
            { required: true, message: 'Cannot be empty', trigger: 'blur' }
          ],
          shortDescription: [
            { required: true, message: 'Cannot be empty', trigger: 'blur' },
          ],
          longDescription: [
            { required: true, message: 'Cannot be empty', trigger: 'blur' }
          ],
          city: [
            { required: true, message: 'Cannot be empty', trigger: 'blur' }
          ],
          address: [
            { required: true, message: 'Cannot be empty', trigger: 'blur' }
          ],
          latitude: [
            { required: true, message: 'Cannot be empty', trigger: 'blur' }
          ],
          longitude: [
            { required: true, message: 'Cannot be empty', trigger: 'blur' }
          ],
        },
      }
    },
    mounted: function () {
    },
    methods: {
      handleSubmit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            let data = {
              "venueName": this.formValidate.venueName,
              "categoryId": parseInt(this.formValidate.categoryId),
              "city": this.formValidate.city,
              "shortDescription": this.formValidate.shortDescription,
              "longDescription": this.formValidate.longDescription,
              "address": this.formValidate.address,
              "latitude": parseFloat(this.formValidate.latitude),
              "longitude": parseFloat(this.formValidate.longitude)
            };
            this.$http.post('http://localhost:4941/api/v1/venues', JSON.stringify(data),
              {
                headers: {'X-Authorization': this.$cookies.get("AuthToken"), 'Content-Type': 'application/json'}
              })
              .then(function() {
                alert("You have successfully added a new venue!");
                window.location.href = '/admin';
              }, function() {
                alert('You may not be authorised to add a venue! Please logout and try again');
                window.location.href = '/';
              })
          }else{
            this.$Message.error('Please fill in all fields!');
          }
        });
      },
      handleReset(name) {
        this.$refs[name].resetFields();
      },
      fileChange(e) {
        let files = e.target.files;
        if (!files.length)
          return;
        for (let i=0; i<files.length; i++) {
          this.uploads.push(files[i]);
        }
      },
      handleUpload() {
        if (this.uploads.length < 1) {
          alert('Nothing to upload...');
          return;
        }
        for (let i=0; i<this.uploads.length; i++) {
          let upload = this.uploads[i]
          if (upload.size > 20480) {
            alert('Image too large! Aborting...');
            window.location.reload();
          }
          let data = new FormData();
          data.append('photo', upload);
          data.append('description', '');
          data.append('makePrimary', 'false');
          this.$http.post('http://localhost:4941/api/v1/venues/' + localStorage.venueId + '/photos',
            data, {
              headers: {
                "X-Authorization": this.$cookies.get("AuthToken"),
                "Content-Type": 'multipart/form-data'
              }
            })
            .then(function () {
              this.errorFlag = false;
            }, function() {
              this.errorFlag = true;
            });
        }
        if (this.errorFlag === false) {
          alert('Successfully uploaded photo(s)!');
        } else {
          alert('Failed to upload photo(s)!')
        }
        this.uploads = [];
      }
    }
  }
</script>
