$("#ss").on('change', function (e) {
    var valueSelected = this.value;

    $(".active").addClass("hidden")
    $(".active").removeClass("active")

    $(`#scoreboard-${valueSelected}`).addClass("active")
    $(`#scoreboard-${valueSelected}`).removeClass("hidden")
});