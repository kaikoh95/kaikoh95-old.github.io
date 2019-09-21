<template>
  <div style="margin-top: 10px">
    <h1 align="center"><span>Venues</span></h1>
    <br>
    <div style="text-align: center">
      <Button type="primary" @click="modalFilter=true" style="width: 90px">Search</Button>
      <Button type="success" @click="mainReset()" style="margin-left: 8px">Reset</Button>
    </div>
    <div style="text-align: right">
    <Page show-total="total" show-elevator="" style="margin-top: 10px" :total="total" :current="page" @on-change="changePage"></Page>
    </div>
    <br>
    <i-table border :columns="venuesColumns" :data="data1"></i-table>
    <br>
    <div style="text-align: right">
      <Page show-total="total" show-elevator="" style="margin-top: 10px" :total="total" :current="page" @on-change="changePage"></Page>
    </div>
    <br>
    <Modal
      v-model="modalFilter"
      title="Search Filters"
      @on-ok="handleOk"
      @on-cancel="handleCancel"
      height="400px">

      <span>City </span>
      <Input v-model="filterCity" placeholder="Input a City's Name" style="width: 300px"></Input>
      <br>
      <br>
      <span>Keywords </span>
      <Input v-model="filterQ" placeholder="Input related Search Words" style="width: 300px"></Input>
      <br>
      <br>
      <span>Categories </span>
      <Select v-model="filterCategoryId" placeholder="Choose a Category" style="width: 300px">
        <Option value="categoryId=1&">Accommodation</Option>
        <Option value="categoryId=2&">Cafés & Restaurants</Option>
        <Option value="categoryId=3&">Attractions</Option>
        <Option value="categoryId=4&">Events</Option>
        <Option value="categoryId=5&">Nature Spots </Option>
      </Select>
      <br>
      <br>
      <span>Star Rating </span>
      <Select v-model="filterMinStarRating" placeholder="Choose a Star Rating" style="width: 300px">
        <Option value="minStarRating=1&">1 ★</Option>
        <Option value="minStarRating=2&">2 ★</Option>
        <Option value="minStarRating=3&">3 ★</Option>
        <Option value="minStarRating=4&">4 ★</Option>
        <Option value="minStarRating=5&">5 ★</Option>
      </Select>
      <br>
      <br>
      <span>Cost Rating </span>
      <Select v-model="filterMaxCostRating" placeholder="Choose a Cost Rating" style="width: 300px">
        <Option value="maxCostRating=0&">Free (0)</Option>
        <Option value="maxCostRating=1&">$ (1)</Option>
        <Option value="maxCostRating=2&">$ $ (2)</Option>
        <Option value="maxCostRating=3&">$ $ $ (3)</Option>
        <Option value="maxCostRating=4&">$ $ $ $ (4)</Option>
      </Select>
      <br>
      <br>
      <span>Sort By </span>
      <Select v-model="filterSortBy" placeholder="Choose a Sorting Option" style="width: 300px">
        <Option value="sortBy=STAR_RATING&">Highest to Lowest Star Rating (default)</Option>
        <Option value="sortBy=STAR_RATING&reverseSort=True&">Lowest to Highest Star Rating</Option>
        <Option value="sortBy=COST_RATING&reverseSort=True&">Highest to Lowest Cost Rating</Option>
        <Option value="sortBy=COST_RATING&">Lowest to Highest Cost Rating</Option>
        <Option v-if="myLocation" value="sortBy=DISTANCE&">Nearest to Furthest Distance</Option>
        <Option v-if="myLocation" value="sortBy=DISTANCE&reverseSort=True&">Furthest to Nearest Distance</Option>
      </Select>
      <br>
      <br>
      <Button type="success" @click="reset">Clear Fields</Button>
    </Modal>
    <Footer class="layout-footer">
      <Button type="warning" onclick="window.location.href='/'">Home</Button>
      2019 &copy; Travel Review Site
    </Footer>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        modalFilter: false,

        filterCity: '',
        filterQ: '',
        filterCategoryId: '',
        filterMinStarRating: '',
        filterMaxCostRating: '',
        filterSortBy: '',

        queryCity: '',
        queryQ: '',
        queryLatitude: '',
        queryLongitude: '',

        myLocation: false,

        total: 0,
        page: 1,
        venues: [],
        data1: [],
        categories: [],

        venuesColumns: [
          {
            title: '#',
            align: 'center',
            width: 50,
            render: (h, params) => {
              let text = params.index + ((this.page - 1)*10) + 1;
              return h('div', {
                props: {},
              }, text)
            }
          },
          {
            title: 'Photo',
            key: 'primaryPhoto',
            align: 'center',
            width: 150,
            render: (h, params) => {
              return h('div', [
                h('img', {
                  style: {
                    width: '100px',
                    height: '100px',
                  },
                  attrs: {
                    src: this.getPhoto(
                      this.venues[params.index + ((this.page - 1)*10)].venueId,
                      this.venues[params.index + ((this.page - 1)*10)].primaryPhoto)
                  }
                })
              ]);
            }
          },
          {
            title: 'Name',
            key: 'venueName',
            align: 'center',
          },
          {
            title: 'Category Name',
            key: 'categoryName',
            align: 'center',
            width: 160
          },
          {
            title: 'City',
            key: 'city',
            align: 'center'
          },
          {
            title: 'Description',
            key: 'shortDescription',
            align: 'center',
            width: 250
          },
          {
            title: 'Distance Away',
            key: 'distance',
            align: 'center',
            render: (h, params) => {
              let text = '---';
              if (this.venues !== []) {
                text = this.venues[params.index + ((this.page - 1)*10)].distance + ' km';
              }
              return h('div', {
                props: {},
              }, text)
            }
          },
          {
            title: 'Stars',
            key: 'meanStarRating',
            align: 'center',
            render: (h, params) => {
              let text = this.venues[params.index + ((this.page - 1)*10)].meanStarRating + ' ★';
              return h('div', {
                props: {},
              }, text)
            }
          },
          {
            title: 'Cost',
            key: 'modeCostRating',
            align: 'center',
            render: (h, params) => {
              let text = 'Free';
              if (this.venues[params.index + ((this.page - 1)*10)].modeCostRating === 1) {
                text = '$ ';
              } else if (this.venues[params.index + ((this.page - 1)*10)].modeCostRating === 2) {
                text = '$ '.repeat(2);
              } else if (this.venues[params.index + ((this.page - 1)*10)].modeCostRating === 3) {
                text = '$ '.repeat(3);
              } else if (this.venues[params.index + ((this.page - 1)*10)].modeCostRating === 4) {
                text = '$ '.repeat(4);
              }
              return h('div', {
                props: {},
              }, text)
            }
          },
          {
            title: 'Action',
            key: 'action',
            align: 'center',
            width: 100,
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  on: {
                    click: () => {
                      this.show(params.index)
                    }
                  }
                }, 'View'),
              ]);
            }
          }
        ]
      }
    },
    mounted: function () {
      this.startGeo();
      if (this.$cookies.get("Location") === 'true') {
        this.myLocation = true;
      } else {
        this.myLocation = false;
      }
      this.getVenues();
    },
    methods: {
      getVenues: function() {
        if (this.filterCity !== undefined && this.filterCity !== null && this.filterCity !== '') {
          this.queryCity = 'city=' + this.filterCity + '&';
        } else {
          this.queryCity = '';
        }
        if (this.filterQ !== undefined && this.filterQ !== null && this.filterQ !== '') {
          this.queryQ = 'q=' + this.filterQ + '&';
        } else {
          this.queryQ = '';
        }
        if (this.filterCategoryId === undefined) {
          this.filterCategoryId = '';
        }
        if(this.filterMinStarRating === undefined) {
          this.filterMinStarRating = '';
        }
        if (this.filterMaxCostRating === undefined) {
          this.filterMaxCostRating = '';
        }
        if (this.filterSortBy === undefined) {
          this.filterSortBy = 'sortBy=STAR_RATING&';
        }

        let venuesUrl =
          'http://localhost:4941/api/v1/venues/?'+
          this.queryCity + this.queryQ + this.filterCategoryId +
          this.filterMinStarRating + this.filterMaxCostRating +
          this.filterSortBy;

        if (this.$cookies.get("Location") === 'true') {
          this.queryLatitude = 'myLatitude=' + this.$cookies.get("Latitude") + '&';
          this.queryLongitude = 'myLongitude=' + this.$cookies.get("Longitude") + '&';
          venuesUrl += this.queryLongitude;
          venuesUrl += this.queryLatitude;
        }
        this.$http.get(venuesUrl)
          .then(function (response) {
            this.venues = response.data;
            for (let i=0; i<this.venues.length; i++) {
              let distance = this.venues[i].distance;
              this.venues[i].distance = parseFloat(Math.round(parseFloat(distance) * 100) / 100).toFixed(3).toString();
              if (this.venues[i].meanStarRating === null || this.venues[i].meanStarRating === undefined) {
                this.venues[i].meanStarRating = '3';
              }
              if (this.venues[i].modeCostRating === null || this.venues[i].modeCostRating === undefined) {
                this.venues[i].modeCostRating = '0';
              }
            }
            this.getCategories();
          }, function() {
            alert('Server error, please try again later');
          });
      },
      getPhoto(venueId, primaryPhoto) {
        if (primaryPhoto !== null) {
          return 'http://localhost:4941/api/v1/venues/' + venueId + '/photos/' + primaryPhoto;
        } else {
          return '../src/assets/default.png';
        }
      },
      getCategories() {
        this.$http.get('http://localhost:4941/api/v1/categories')
          .then(function (response) {
            this.categories = response.data;
            for (let i=0; i<this.venues.length; i++) {
              for (let j=0; j<this.categories.length; j++) {
                if (this.venues[i].categoryId === this.categories[j].categoryId) {
                  this.venues[i].categoryName = this.categories[j].categoryName;
                }
              }
            }
            this.total = this.venues.length;
            this.data1 = this.venues.slice(0, 10);
            this.reset();
          }, function() {
            alert('Server error, please try again later');
          });
      },
      startGeo() {
        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(this.getPosition);
        } else {
          this.$Message.info("Unable to obtain your location");
          this.$cookies.set("Location", 'false');
        }
      },
      getPosition(position) {
        this.$cookies.set("Latitude", position.coords.latitude);
        this.$cookies.set("Longitude", position.coords.longitude);
        this.$cookies.set("Location", 'true');
      },
      getPageList(p, size) {
        return this.venues.slice((p - 1) * size, p * size);
      },
      changePage(p) {
        this.page = p;
        this.data1 = this.getPageList(p, 10);
      },
      show(index) {
        let id = this.data1[index].venueId;
        localStorage.venueId = id;
        localStorage.setItem("venues", JSON.stringify(this.data1));
        window.location.href = '/venue';

      },
      handleOk () {
        this.getVenues();
      },
      handleCancel () {
        this.$Message.info('Search cancel!');
      },
      reset() {
        this.filterCity = '';
        this.filterQ = '';
        this.filterCategoryId = '';
        this.filterMinStarRating = '';
        this.filterMaxCostRating = '';
        this.filterSortBy = ''
      },
      mainReset() {
        this.total = 0;
        this.page = 1;
        this.venues = [];
        this.data1 = [];
        this.categories = [];
        this.reset();
        this.getVenues();
      }
    }
  }
</script>


