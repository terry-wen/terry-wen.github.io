$("#ss").on('change', function (e) {
    var optionSelected = $("option:selected", this);
    var valueSelected = this.value;

    $(".active").addClass("hidden")
    $(".active").removeClass("active")

    $(`#scoreboard-${valueSelected}`).addClass("active")
    $(`#scoreboard-${valueSelected}`).removeClass("hidden")
});