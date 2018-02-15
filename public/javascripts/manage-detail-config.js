

function init(init_data) {
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
            date: null,
            data: null
        },
        methods: {
            dateToMs: function (date) {
                var temp = date.split('-');
                var year = parseInt(temp[0]);
                var month = parseInt(temp[1]);
                var day = parseInt(temp[2]);
                var k = Date.parse(date);
                return k;
            },
            msToDate: function (ms) {
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
            }
        },
        mounted: [
            function () {
                vue.scrollData.isShowFabTop = true;
                $(window).scroll(
                    function (event) {

                        var scroll = $(window).scrollTop();

                        vue.scrollData.scrollT += (scroll - vue.scrollData.offsetTop);

                        if (vue.scrollData.scrollT > vue.scrollData.delta) {
                            vue.scrollData.isShowFabTop = false;
                            vue.scrollData.scrollT = 0;
                        } else if (vue.scrollData.scrollT < -vue.scrollData.delta) {
                            vue.scrollData.isShowFabTop = true;
                            vue.scrollData.scrollT = 0;
                        }

                        vue.scrollData.offsetTop = scroll;

                        if (scroll === 0) {
                            vue.scrollData.isShowFabTop = true;
                            vue.scrollData.scrollT = 0;
                            vue.scrollData.offsetTop = 0;
                        }
                        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 200) {
                            vue.scrollData.isShowFabTop = true;
                        }

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
                this.date = today;
            },
            function () {
                var json = init_data;
                this.data = JSON.parse(json);
                console.log(this.data);
                // this.texts = list
            }
        ]
    });
    return vue;
}