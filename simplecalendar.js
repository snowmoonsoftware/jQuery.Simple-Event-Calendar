var calendar = {
    init: function() {

        var DaysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];
        var d = new Date();

        var yearNumber = d.getFullYear();
        /**
         * Get current month and set as '.current-month' in title
         */
        var monthNumber = d.getMonth() + 1;

        computeFirstDayOfMonth(yearNumber, monthNumber)

        function GetMonthName(monthNumber) {
            var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            //var months = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
            return months[monthNumber - 1];
        }

        setMonth(monthNumber);

        function setMonth(monthNumber) {
            $('.month').text(GetMonthName(monthNumber) + ' ' + yearNumber);
            $('.month').attr('data-month', monthNumber);
            printDateNumber(monthNumber);
        }

        function computeFirstDayOfMonth(yearNumber, monthNumber) {
            var strDate = yearNumber + "/" + monthNumber + "/" + 1;
            var tmpDate = new Date(strDate);
            firstDay = tmpDate.getDay();//返回着这个月1号是的星期几
            firstDisplay = true;
        }

        $('.btn-next').on('click', function(e) {
            var monthNumber = parseInt($('.month').attr('data-month'));
            if (monthNumber > 11) {
                $('.month').attr('data-month', '0');
                var monthNumber = parseInt($('.month').attr('data-month'));
                yearNumber = yearNumber + 1;
            }
            computeFirstDayOfMonth(yearNumber, monthNumber + 1);
            setMonth(monthNumber + 1);
        });

        $('.btn-prev').on('click', function(e) {
            var monthNumber = parseInt($('.month').attr('data-month'));
            if (monthNumber < 2) {
                $('.month').attr('data-month', '13');
                var monthNumber = $('.month').attr('data-month');
                yearNumber = yearNumber - 1;
            }
            computeFirstDayOfMonth(yearNumber, monthNumber - 1);
            setMonth(monthNumber - 1);

        });

        /**
         * Get all dates for current month
         */

        function printDateNumber(monthNumber) {

            $($('tbody.event-calendar tr')).each(function(index) {
                $(this).empty();
            });

            $($('thead.event-days tr')).each(function(index) {
                $(this).empty();
            });

            //获取这个月中的天数
            function getDaysInMonth(month, year) {
                // Since no month has fewer than 28 days
                var date = new Date(year, month, 1);
                var days = [];
                while (date.getMonth() === month) {
                    var tmpArr = [];
                    tmpArr[0] = date.getDate();//多少号
                    tmpArr[1] = date.getDay();//星期几
                    days.push(tmpArr);
                    // days.push(new Date(date));
                    date.setDate(date.getDate() + 1);
                }
                return days;
            }

            i = 0;

            setDaysInOrder();

            //这个是绘制星期几标题的表格
            function setDaysInOrder() {
                var strWeek = DaysOfWeek.map(function(day){
                  return '<td>'+day+'</td>';
                }).join("");
                $('thead.event-days tr').append(strWeek);
            };

            //这个是填充日期的
            $(getDaysInMonth(monthNumber - 1, yearNumber)).each(function() {
                var day = $(this)[0];
                var week = $(this)[1];

                if(firstDisplay == true){
                    for (var i = 0; i < firstDay; i++) {
                        $('tbody.event-calendar tr.1').append('<td date-month="' + '' + '" date-day="' + '' + '" date-year="' + '' + '"><a href="#">' + '' + '</a></td>');
                    };
                    firstDisplay = false;
                }

                $('tbody.event-calendar tr.1').append('<td date-month="' + monthNumber + '" date-day="' + day + '" date-year="' + yearNumber + '"><a href="#">' + day + '</a></td>');
            });

            var date = new Date();
            var month = date.getMonth() + 1;
            var thisyear = new Date().getFullYear();
            setCurrentDay(month, thisyear);
            setEvent();
            displayEvent();
        }

        /**
         * Get current day and set as '.current-day'
         */
        function setCurrentDay(month, year) {
            var viewMonth = $('.month').attr('data-month');
            var eventYear = $('.event-days').attr('date-year');
            if (parseInt(year) === yearNumber) {
                if (parseInt(month) === parseInt(viewMonth)) {
                    $('tbody.event-calendar td[date-day="' + d.getDate() + '"]').addClass('current-day');
                }
            }
        };

        /**
         * Add class '.active' on calendar date
         */
        $('tbody td').on('click', function(e) {
            if ($(this).hasClass('event')) {
                $('tbody.event-calendar td').removeClass('active');
                $(this).addClass('active');
            } else {
                $('tbody.event-calendar td').removeClass('active');
            };
        });

        /**
         * Add '.event' class to all days that has an event
         */
        function setEvent() {
            $('.day-event').each(function(i) {
                var eventMonth = $(this).attr('date-month');
                var eventDay = $(this).attr('date-day');
                var eventYear = $(this).attr('date-year');
                var eventClass = $(this).attr('event-class');
                if (eventClass === undefined) eventClass = 'event';
                else eventClass = 'event ' + eventClass;

                if (parseInt(eventYear) === yearNumber) {
                    $('tbody.event-calendar tr td[date-month="' + eventMonth + '"][date-day="' + eventDay + '"]').addClass(eventClass);
                }
            });
        };

        /**
         * Get current day on click in calendar
         * and find day-event to display
         */
        function displayEvent() {
            $('tbody.event-calendar td').on('click', function(e) {
                $('.day-event').slideUp('fast');
                var monthEvent = $(this).attr('date-month');
                var dayEvent = $(this).text();
                $('.day-event[date-month="' + monthEvent + '"][date-day="' + dayEvent + '"]').slideDown('fast');
            });
        };

        /**
         * Close day-event
         */
        $('.close').on('click', function(e) {
            $(this).parent().slideUp('fast');
        });

        /**
         * Save & Remove to/from personal list
         */
        $('.save').click(function() {
            if (this.checked) {
                $(this).next().text('Remove from personal list');
                var eventHtml = $(this).closest('.day-event').html();
                var eventMonth = $(this).closest('.day-event').attr('date-month');
                var eventDay = $(this).closest('.day-event').attr('date-day');
                var eventNumber = $(this).closest('.day-event').attr('data-number');
                $('.person-list').append('<div class="day" date-month="' + eventMonth + '" date-day="' + eventDay + '" data-number="' + eventNumber + '" style="display:none;">' + eventHtml + '</div>');
                $('.day[date-month="' + eventMonth + '"][date-day="' + eventDay + '"]').slideDown('fast');
                $('.day').find('.close').remove();
                $('.day').find('.save').removeClass('save').addClass('remove');
                $('.day').find('.remove').next().addClass('hidden-print');
                remove();
                sortlist();
            } else {
                $(this).next().text('Save to personal list');
                var eventMonth = $(this).closest('.day-event').attr('date-month');
                var eventDay = $(this).closest('.day-event').attr('date-day');
                var eventNumber = $(this).closest('.day-event').attr('data-number');
                $('.day[date-month="' + eventMonth + '"][date-day="' + eventDay + '"][data-number="' + eventNumber + '"]').slideUp('slow');
                setTimeout(function() {
                    $('.day[date-month="' + eventMonth + '"][date-day="' + eventDay + '"][data-number="' + eventNumber + '"]').remove();
                }, 1500);
            }
        });

        function remove() {
            $('.remove').click(function() {
                if (this.checked) {
                    $(this).next().text('Remove from personal list');
                    var eventMonth = $(this).closest('.day').attr('date-month');
                    var eventDay = $(this).closest('.day').attr('date-day');
                    var eventNumber = $(this).closest('.day').attr('data-number');
                    $('.day[date-month="' + eventMonth + '"][date-day="' + eventDay + '"][data-number="' + eventNumber + '"]').slideUp('slow');
                    $('.day-event[date-month="' + eventMonth + '"][date-day="' + eventDay + '"][data-number="' + eventNumber + '"]').find('.save').attr('checked', false);
                    $('.day-event[date-month="' + eventMonth + '"][date-day="' + eventDay + '"][data-number="' + eventNumber + '"]').find('span').text('Save to personal list');
                    setTimeout(function() {
                        $('.day[date-month="' + eventMonth + '"][date-day="' + eventDay + '"][data-number="' + eventNumber + '"]').remove();
                    }, 1500);
                }
            });
        }

        /**
         * Sort personal list
         */
        function sortlist() {
            var personList = $('.person-list');

            personList.find('.day').sort(function(a, b) {
                return +a.getAttribute('date-day') - +b.getAttribute('date-day');
            }).appendTo(personList);
        }

        /**
         * Print button
         */
        $('.print-btn').click(function() {
            window.print();
        });

//默认点击下当前的天，弹出列表
        $('.current-day').click();
    },
};

$(document).ready(function() {
    calendar.init();
});
