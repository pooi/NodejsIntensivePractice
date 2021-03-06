

function init() {
    var vue = new Vue({
        el: '#app',
        data: {
            title: 'D&L',
            scrollData: {
                fab: false,
                offsetTop: 0,
                scrollT: 0,
                delta: 100,
                isShowFabTop: true,
                transition: 'slide-y-reverse-transition'
            },
            loginData:{

            },
            isShowTab: false,
            tabItems: [
                'Web', 'Shopping', 'Videos'
            ],
            currentTab: 'tab-Web',
            items: [],
            sheet: false,
            shares: [
                { img: 'kakao.png', title: 'Kakao' },
                { img: 'facebook.png', title: 'Facebook' },
            ],
            shareItem: {

            },
            filterDialog: false,
            isFilterProgress: false,
            categoryDialog: false,
            category: null,
            subcategory: null,
            categories: [
                '가방', '귀금속'
            ],
            subcategories: [],
            categoryData:{
                '가방': [
                    '여성용가방', '남성용가방', '기타가방'
                ],
                '귀금속': [
                    '반지', '목걸이', '시계', '귀걸이'
                ]
            },
            date: null,
            startDate: null,
            finishDate: null,
            dateModal: false,
            dateModal1: false,
            dateModal2: false,
            dateCheckbox: true,
            rgtDate: null,
            rgtStartDate: null,
            rgtFinishDate: null,
            rgtDateModal: false,
            rgtDateModal1: false,
            rgtDateModal2: false,
            rgtDateCheckbox: true,

            tags: [],
            date_2: null,
            startDate_2: null,
            finishDate_2: null,
            dateModal_2: false,
            dateModal1_2: false,
            dateModal2_2: false,
            dateCheckbox_2: true,
            searchItems: [],
            searchSnackbar : false
        },
        methods: {
            dateToMs: function (date) {
                if(date === null)
                    return null;
                var temp = date.split('-');
                var year = parseInt(temp[0]);
                var month = parseInt(temp[1]);
                var day = parseInt(temp[2]);
                var k = Date.parse(date);
                return k;
            },
            msToDate: function (ms) {
                if(ms === null)
                    return null;
                var date = new Date(ms);
                var dd = date.getDate();
                var mm = date.getMonth() + 1; //January is 0!

                var yyyy = date.getFullYear();
                if (dd < 10) {
                    dd = '0' + dd;
                }
                if (mm < 10) {
                    mm = '0' + mm;
                }
                var dateString = yyyy + "-" + mm + "-" + dd;
                return dateString
            },
            listToString: function (arr) {
                var result = "";
                for (var i = 0; i < arr.length; i++) {
                    result += arr[i];
                    if (i + 1 < arr.length) {
                        result += ";";
                    }
                }
                return result;
            },
            getLostItem: function () {
                var data = {
                    id: '1'
                };

                console.log("getLostItem");
                axios.post(
                    '/manage/lost',
                    data
                ).then(function (response) {
                    var res = response;
                    var data = res.data;
                    vue.items = vue.items.concat(data);
                }).catch(function (error) {
                    alert(error);
                });
            },
            rgtShareItem: function(item){
                this.sheet = true;
                this.shareItem = item;
                console.log(this.shareItem);
            },
            shareTo: function (title) {
                if(title === "Kakao"){

                    var tags = "";
                    var tagList = this.shareItem.tags.split(";");
                    for(var i=0; i<tagList.length; i++){
                        var tag = tagList[i];
                        if(tag !== ""){
                            tags += "#" + tag + " ";
                        }
                    }

                    Kakao.Link.sendDefault({
                        objectType: 'feed',
                        content: {
                            title: 'D&L 유실물' + " - " + vue.shareItem.id,
                            description: tags,
                            imageUrl: 'https://denl.xyz/' + vue.shareItem.photos,
                            link: {
                                mobileWebUrl: 'https://denl.xyz/manage/' + vue.shareItem.id,
                                webUrl: 'https://denl.xyz/manage/' + vue.shareItem.id
                            }
                        },
                        buttons: [
                            {
                                title: '확인하기',
                                link: {
                                    mobileWebUrl: 'https://denl.xyz/manage/' + vue.shareItem.id,
                                    webUrl: 'https://denl.xyz/manage/' + vue.shareItem.id
                                }
                            }
                        ]
                    });
                }
                this.sheet = false;

            },
            changeSubCategories2: function (item) {

                if (vue.categoryData.hasOwnProperty(item)) {
                    vue.category = item;
                    vue.subcategory = null;
                    var list = vue.categoryData[item];
                    vue.subcategories = list;
                }

                // console.log('changeSubCategories');
                // if(!vue.loadingSubCategory) {
                //     vue.subcategory = null;
                //     vue.loadingSubCategory = true;
                //
                //     setTimeout(function () {
                //         console.log('timeout');
                //         if (vue.categoryData.hasOwnProperty(vue.tempCategory)) {
                //             var list = vue.categoryData[vue.tempCategory];
                //             vue.subcategories = list;
                //         }
                //         vue.loadingSubCategory = false;
                //         clearTimeout();
                //     }, 500);
                // }

                // alert(vue.tempCategory);
                // if(vue.categoryData.hasOwnProperty(vue.tempCategory)){
                //     var list = vue.categoryData[vue.tempCategory];
                //     vue.subcategories = list;
                // }

            },
            searchWithFilter: function(){

                var data = {
                    category: this.category,
                    subcategory: this.subcategory,
                    date: this.dateToMs(this.date),
                    startDate: this.dateToMs(this.startDate),
                    finishDate: this.dateToMs(this.finishDate),
                    isAllDayDate: this.dateCheckbox,
                    rgtDate: this.dateToMs(this.rgtDate),
                    rgtStartDate: this.dateToMs(this.rgtStartDate),
                    rgtFinishDate: this.dateToMs(this.rgtFinishDate),
                    isAllDayRgtDate: this.rgtDateCheckbox
                };

                isFilterProgress = true;

                axios.post(
                    '/manage/filter',
                    data
                ).then(function (response) {
                    var res = response;
                    var data = res.data;
                    vue.items = [];
                    vue.items = vue.items.concat(data);
                    vue.filterDialog = false;
                    vue.isFilterProgress = false;
                }).catch(function (error) {
                    alert(error);
                    vue.filterDialog = false;
                    vue.isFilterProgress = false;
                });

            },
            clearFilter: function () {
                this.category= null;
                this.subcategory= null;
                this.date= null;
                this.startDate= null;
                this.finishDate= null;
                this.dateModal= false;
                this.dateModal1= false;
                this.dateModal2= false;
                this.dateCheckbox= true;
                this.rgtDate= null;
                this.rgtStartDate= null;
                this.rgtFinishDate= null;
                this.rgtDateModal= false;
                this.rgtDateModal1= false;
                this.rgtDateModal2= false;
                this.rgtDateCheckbox= true;

                this.filterDialog = false;

                this.searchWithFilter();
            },
            searchWithConditions: function(){
                vue.searchSnackbar = false;
                var data = {
                    // category: this.category,
                    // subcategory: this.subcategory,
                    date: this.dateToMs(this.date_2),
                    startDate: this.dateToMs(this.startDate_2),
                    finishDate: this.dateToMs(this.finishDate_2),
                    isAllDayDate: this.dateCheckbox_2,
                    tags: this.tags
                };
                console.log("tags: ", this.tags);

                // isFilterProgress = true;

                axios.post(
                    '/manage/search',
                    data
                ).then(function (response) {
                    var res = response;
                    var data = res.data;
                    vue.searchItems = [];
                    vue.searchItems = vue.searchItems.concat(data);
                    vue.searchSnackbar = true;
                    // vue.filterDialog = false;
                    // vue.isFilterProgress = false;
                }).catch(function (error) {
                    alert(error);
                    // vue.filterDialog = false;
                    // vue.isFilterProgress = false;
                });

            },
            clearSearchForm: function(){
                this.tags= [];
                this.date_2= null;
                this.startDate_2= null;
                this.finishDate_2= null;
                this.dateModal_2= false;
                this.dateModal1_2= false;
                this.dateModal2_2= false;
                this.dateCheckbox_2= true;
                this.searchItems= [];
            },
            removeLabel: function (item) {
                this.tags.splice(this.tags.indexOf(item), 1);
            },
        },
        mounted: [
            function () {
                // console.log("window", $(window));
                this.scrollData.isShowFabTop = true;
                $(window).scroll(
                    function (event) {

                        var scroll = $(window).scrollTop();

                        // vue.scrollData.scrollT += (scroll - vue.scrollData.offsetTop);
                        //
                        // if (vue.scrollData.scrollT > vue.scrollData.delta) {
                        //     vue.scrollData.isShowFabTop = false;
                        //     vue.scrollData.scrollT = 0;
                        //     // vue.isShowTab = true;
                        // } else if (vue.scrollData.scrollT < -vue.scrollData.delta) {
                        //     vue.scrollData.isShowFabTop = true;
                        //     vue.scrollData.scrollT = 0;
                        //     // vue.isShowTab = false;
                        // }
                        //
                        // vue.scrollData.offsetTop = scroll;

                        if(scroll <= 50){
                            vue.isShowTab = false;
                        }else{
                            vue.isShowTab = true;
                        }

                        // if (scroll === 0) {
                        //     vue.scrollData.isShowFabTop = true;
                        //     vue.scrollData.scrollT = 0;
                        //     vue.scrollData.offsetTop = 0;
                        //     // vue.isShowTab = false;
                        // }
                        // if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
                        //     vue.scrollData.isShowFabTop = true;
                        //     vue.isShowTab = false;
                        // }

                    }
                );
            },
            function () {
                var today = new Date();
                var dd = today.getDate();
                var mm = today.getMonth() + 1; //January is 0!

                var yyyy = today.getFullYear();
                if (dd < 10) {
                    dd = '0' + dd;
                }
                if (mm < 10) {
                    mm = '0' + mm;
                }
                var today = yyyy + "-" + mm + "-" + dd; //dd + '/' + mm + '/' + yyyy;
                // this.date = today;
                // this.startDate = today;
                // this.finishDate = today;
                // this.rgtDate = today;
                // this.rgtStartDate = today;
                // this.rgtFinishDate = today;
            },
            function () {
                var data = {
                };

                console.log("getLostItem");
                axios.post(
                    '/manage/lost',
                    data
                ).then(function (response) {
                    var res = response;
                    var data = res.data;
                    vue.items = vue.items.concat(data);
                }).catch(function (error) {
                    alert(error);
                });
            }
        ],
        watch: {
            tags () {
                vue.searchWithConditions();
            },
            date_2 () {
                vue.searchWithConditions();
            },
            startDate_2 (){
                vue.searchWithConditions();
            },
            finishDate_2 () {
                vue.searchWithConditions();
            }
        }
    });
    return vue;
}