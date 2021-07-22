const urlParams = new URLSearchParams(window.location.search);

$(document).ready(() => {

    if (urlParams.get('page') === null)
        urlParams.set('page', 1)

    $(".currentPageNum").text(urlParams.get('page'))

    const totalNumberOfPages = $(".ds_contentWrapper").attr("totalpages");
    $(".totalPageNum").text(totalNumberOfPages)

    if (urlParams.get('page') == 1) {
        $(".prevPage").css({ "display": "none" })
    }
    if (urlParams.get('page') === totalNumberOfPages) {
        $(".nextPage").css({ "display": "none" })
    }

    $(".goToPageGo").click(function () {
        const pageNum = $(".pageNumberInput").val();
        if (pageNum > $(".ds_contentWrapper").attr("totalpages") || $(".ds_contentWrapper").attr("totalpages") === '1' || pageNum <= 0 || pageNum.trim() == '') {
            swal("ERROR", "Page number not available", "error");
        }
        else {
            urlParams.set('page', pageNum);
            window.location.search = urlParams.toString();
        }
    });

    $(".prevNext span").click(function () {
        let pageNum = parseInt(urlParams.get('page'))

        if ($(this).hasClass("prevPage")) {
            pageNum--;
        }
        else {
            pageNum++;
        }

        urlParams.set('page', pageNum);
        window.location.search = urlParams.toString();
    });

    $(".selectBox").change(function () {
        const selectedInterval = $(this).val();
        $.ajax({
            type: "POST",
            url: "/",
            data: { selectedInterval },
            success: function (msg) {
                if (msg === 'ok') {
                    return swal({
                        title: "Success!",
                        text: "Parameter Changed and Cron Job timing altered",
                        type: "success"
                    });
                }
                swal({ title: "Error!", text: "An Error Occured, please try again later", type: "error" });
            }
        });
    })

}); //$(document).ready

function addSort(sortElement) {
    const mylist = $(".ds_TableStyleBody");
    const listitems = mylist.children(".ds_TableStyleBodyList").get();

    if ($(sortElement).hasClass("sorted")) {
        $(sortElement).removeClass("sorted");

        listitems.sort(function (a, b) {
            const compA = $(a).find(sortElement).text().toUpperCase();
            const compB = $(b).find(sortElement).text().toUpperCase();
            return compA < compB ? -1 : compA > compB ? 1 : 0;
        });
    } else {
        $(sortElement).addClass("sorted");
        //alert(sortElement);
        listitems.sort(function (a, b) {
            const compA = $(a).find(sortElement).text().toUpperCase();
            const compB = $(b).find(sortElement).text().toUpperCase();
            return compA > compB ? -1 : compA < compB ? 1 : 0;
        });
    }

    $.each(listitems, function (idx, itm) {
        mylist.append(itm);
    });
}

function toDate(value) {
    const from = value.split("-");
    return new Date(from[2], from[1] - 1, from[0]);
}

function addSortDate(sortElement) {
    const mylist = $(".ds_TableStyleBody");
    const listitems = mylist.children(".ds_TableStyleBodyList").get();

    if ($(".ds_TableStyleHead").find(sortElement).hasClass("sorted")) {
        $(".ds_TableStyleHead").find(sortElement).removeClass("sorted");

        listitems.sort(function (a, b) {
            const compA = toDate($(a).find(sortElement).text());
            const compB = toDate($(b).find(sortElement).text());
            return compA < compB ? -1 : compA > compB ? 1 : 0;
        });
    } else {
        $(".ds_TableStyleHead").find(sortElement).addClass("sorted");

        listitems.sort(function (a, b) {
            const compA = toDate($(a).find(sortElement).text());
            const compB = toDate($(b).find(sortElement).text());
            return compA > compB ? -1 : compA < compB ? 1 : 0;
        });
    }

    $.each(listitems, function (idx, itm) {
        mylist.append(itm);
    });
}
