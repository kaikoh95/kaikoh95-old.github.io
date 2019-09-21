const axios = require('axios');

<template>
  <div style="margin-top: 30px">
    <h1 id="venue" align="center"><span>{{venue.venueName}}</span></h1>
    <div align="center">
      <Card style="margin: 10px; width: 140px; height: 140px">
        <div style="text-align:center">
          <img :src="getPrimary()" style="text-align:center;width: 120px ; height: 120px">
        </div>
      </Card>
    </div>
    <div align="center" style="text-align:center">
      <table align="center" style="text-align: center; width: 80%; padding: 30px" frame="box">
        <tr style="margin-top: 100px">
          <th align="left">Admin</th>
          <td v-if="isAdmin" align="left" @click="visitUser()"><u>{{venue.admin.username}} (YOU)</u> -Click for details-</td>
          <td v-else align="left" @click="visitUser()"><u>{{venue.admin.username}}</u> -Click for details-</td>
        </tr>
        <tr>
          <th align="left">Category</th>
          <td align="left">{{venue.category.categoryName}}</td>
        </tr>
        <tr>
          <th align="left">City</th>
          <td align="left">{{venue.city}}</td>
        </tr>
        <tr>
          <th align="left">Address</th>
          <td align="left">{{venue.address}}</td>
        </tr>
        <tr>
          <th align="left">Star Rating</th>
          <td align="left">{{venue.meanStarRating || 3}} ★</td>
        </tr>
        <tr>
          <th align="left">Cost Rating</th>
          <td align="left">{{venue.modeCostRating || 0}} $</td>
        </tr>
        <tr>
          <th align="left">Date Added</th>
          <td align="left">{{venue.dateAdded.split('T')[0]}}</td>
        </tr>
        <tr>
          <th align="left">Description</th>
          <Collapse style="float: left; padding-right: 20px">
            <Panel style="text-align: left" name="1">
              {{venue.shortDescription}}
              <p slot="content">{{venue.longDescription}}</p>
            </Panel>
          </Collapse>
        </tr>
      </table>
      <div style="margin-top: 20px">
        <Button align="center" style="margin-right: 20px; text-align: center" type="secondary" onclick="window.location.href='/venues'">All Venues</Button>
        <Button type="primary" style="margin-right: 20px;" onclick="window.location.href='/reviews'">View Reviews</Button>
        <Button v-if="isAdmin" type="secondary" @click="modalEdit=true" style="margin-right: 20px">Edit Venue Details</Button>
      </div>
    </div>
    <div style="margin-top: 20px" align="center">
      <h3 v-if="isAdmin" align="center">Upload photos?</h3>
      <input v-if="isAdmin" type="file" multiple="multiple" id="uploads" v-on:change="fileChange">
      <Button v-if="isAdmin" type="secondary" @click="handleUpload()" style="margin-right: 20px">Submit</Button>
      <br>
      <br>
      <div v-if="hasPhotos">
        <h3 align="center">Click on a photo below for more details</h3>
        <br>
        <Scroll>
          <div style="margin: 20px; float: left;" align="left" v-for="photo in photos">
            <Card style="width: 240px; height: 240px">
              <div style="text-align:center">
                <img name=photo :src="getImage(photo)" v-on:click="photoClicked(photo)" style="float: left; width: 200px ; height: 200px">
              </div>
            </Card>
          </div>
        </Scroll>
      </div>
      <div v-else-if="noPhotos">
        <h3 v-if="isAdmin" align="center">You have no photos on your site...</h3>
        <br>
        <div  style="margin-top: 20px; float: center" align="center">
          <Card style="width: 240px; height: 240px">
            <div style="text-align:center">
              <img src='../src/assets/default.png' style="float: left; width: 200px ; height: 200px">
            </div>
          </Card>
        </div>
      </div>
    </div>
    <Footer style="margin-top: 20px" class="layout-footer">
      <Button type="warning" onclick="window.location.href='/'">Home</Button>
      2019 &copy; Travel Review Site
    </Footer>
    <Modal v-model="photoOptions">
      <p slot="header" style="text-align: center">
        <span>What do you want to do?</span>
      </p>
      <div style="text-align:center">
        <p>{{tempPhoto.photoDescription}}</p>
      </div>
      <div slot="footer">
        <Button type="primary" @click="setPrimary(tempPhoto)">Set as Primary</Button>
        <Button type="error" @click="deletePhoto(tempPhoto)">Delete</Button>
      </div>
    </Modal>
    <Modal
      v-model="modalEdit"
      title="Edit Venue"
      height="600px">
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100" >
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
          <Input v-model="formValidate.longDescription" placeholder="Enter a more detailed description" style="width: 300px"></Input>
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
      </Form>
      <div slot="footer">
        <Button type="success" @click="handleReset('formValidate')">Clear Fields</Button>
        <Button type="error" @click="handleCancel('formValidate')">Cancel</Button>
        <Button type="primary" @click="handleSubmit('formValidate')">Submit</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        photoOptions: false,
        venue: [],
        photos: [],
        hasPhotos: false,
        noPhotos: true,
        isAdmin: false,
        tempPhoto: '',
        uploads: [],
        errorFlag: false,
        modalEdit: false,
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
            { required: false, message: 'Cannot be empty', trigger: 'blur' }
          ],
          categoryId: [
            { required: false, message: 'Cannot be empty', trigger: 'blur' }
          ],
          shortDescription: [
            { required: false, message: 'Cannot be empty', trigger: 'blur' },
          ],
          longDescription: [
            { required: false, message: 'Cannot be empty', trigger: 'blur' }
          ],
          city: [
            { required: false, message: 'Cannot be empty', trigger: 'blur' }
          ],
          address: [
            { required: false, message: 'Cannot be empty', trigger: 'blur' }
          ],
          latitude: [
            { required: false, message: 'Cannot be empty', trigger: 'blur' }
          ],
          longitude: [
            { required: false, message: 'Cannot be empty', trigger: 'blur' }
          ],
        },
      }
    },

    mounted: function () {
      this.getOne();
      this.getImage();
      this.getPrimary();
    },
    methods: {
      getOne: function () {
        this.$http.get('http://localhost:4941/api/v1/venues/' + localStorage.venueId)
          .then(function (response) {
            this.venue = response.data;
            this.photos = this.venue.photos;
            if (this.photos.length > 0) {
              this.hasPhotos = true;
              this.noPhotos = false;
            } else {
              this.hasPhotos = false;
              this.noPhotos = true;
            }
            let venues = JSON.parse(localStorage.getItem("venues") || "[]");
            if (venues !== []) {
              for (let i = 0; i < venues.length; i++) {
                if (venues[i].venueId.toString() === localStorage.venueId.toString()) {
                  this.venue["meanStarRating"] = venues[i].meanStarRating;
                  this.venue["modeCostRating"] = venues[i].modeCostRating;
                }
              }
              if (this.venue.admin.userId.toString() === this.$cookies.get("UserId").toString()) {
                this.isAdmin = true;
              }
              localStorage.otherUserId = this.venue.admin.userId;
            }
          });
      },
      fileChange(e) {
        let files = e.target.files;
        if (!files.length)
          return;
        for (let i=0; i<files.length; i++) {
          this.uploads.push(files[i]);
        }
      },
      visitUser() {
        if (this.isAdmin === true) {
          window.location.href='/myProfile';
        } else {
          window.location.href='/user';
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
        window.location.reload();
      },
      getImage(photo) {
        return 'http://localhost:4941/api/v1/venues/' + localStorage.venueId + '/photos/' + photo.photoFilename;
      },
      getPrimary() {
        if (this.photos.length > 0) {
          for (let i=0; i<this.photos.length; i++) {
            if (this.photos[i].isPrimary === true) {
              return 'http://localhost:4941/api/v1/venues/' + localStorage.venueId + '/photos/' + this.photos[i].photoFilename;
            }
          }
        } else {
          return '../src/assets/default.png';
        }
      },
      photoClicked(photo) {
        this.tempPhoto = photo;
        this.photoOptions = true;
      },
      setPrimary(photo) {
        this.$http.post(
          'http://localhost:4941/api/v1/venues/' + localStorage.venueId + '/photos/' + photo.photoFilename + '/setPrimary',
          "",
          {headers: {'X-Authorization': this.$cookies.get("AuthToken")}
          })
          .then(function() {
            alert("You have set a the Primary Photo!");
            window.location.reload()
          }, function() {
            this.$Message.error("Only Admins can do that");
          });
      },
      deletePhoto(photo) {
        this.$http.delete(
          'http://localhost:4941/api/v1/venues/' + localStorage.venueId + '/photos/' + photo.photoFilename,
          {headers: {'X-Authorization': this.$cookies.get("AuthToken")}
          })
          .then(function() {
            alert("Successfully Deleted Photo!");
            window.location.reload()
          },function() {
            this.$Message.error("Only Admins can do that");
          });
      },
      handleSubmit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            let data = {
              "venueName": this.formValidate.venueName,
              "categoryId": this.formValidate.categoryId,
              "city": this.formValidate.city,
              "shortDescription": this.formValidate.shortDescription,
              "longDescription": this.formValidate.longDescription,
              "address": this.formValidate.address,
              "latitude": this.formValidate.latitude,
              "longitude": this.formValidate.longitude
            };
            let titles = ["venueName", "categoryId", "city", "shortDescription", "longDescription", "address", "latitude", "longitude"];
            for (let i = 0; i <titles.length; i++) {
              if (data[titles[i]].length === 0 || data[titles[i]].length === undefined) {
                delete data[titles[i]];
              }
            }
            if(data['categoryId'] !== undefined){
              data['categoryId'] = parseInt(data['categoryId'])
            }
            if(data['latitude'] !== undefined){
              data['latitude'] = parseFloat(data['latitude'])
            }
            if(data['longitude'] !== undefined){
              data['longitude'] = parseFloat(data['longitude'])
            }
            axios.patch('http://localhost:4941/api/v1/venues' + localStorage.venueId, JSON.stringify(data),
              {
                headers: {'X-Authorization': this.$cookies.get("AuthToken"), 'Content-Type': 'application/json'}
              })
              .then(function() {
                alert("You have successfully edited the venue!");
                window.location.href = '/venue';
              }, function() {
                alert('You may not be authorised to edit a venue! Please logout and try again');
                window.location.href = '/';
              })
          }else{
            this.$Message.error('Please fill in all fields!');
          }
        });
      },
      handleCancel(name) {
        this.reset(name);
        this.modalEdit = false;
        this.$Message.info('Editing cancelled!');
      },
      handleReset(name) {
        this.$refs[name].resetFields();
      }
    }
  }
</script>


