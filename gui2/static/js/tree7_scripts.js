//Обработчик показа/скрытия выпадающего списка
$('#b-favorites').click(function () {
    var lFilters = $('#l-filters');
    if (lFilters.is(':hidden'))
        lFilters.show();
    else
        lFilters.hide();
});

