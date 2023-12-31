const url = `https://picsum.photos/v2/list?`;

// Функция создаёт img карточки
function displayData(data, elem) {
    let ImagesCards = '';

    data.forEach(item => {
    let cardBlock = `
    <div class = 'card'>
        <img class='card-image' src= '${item.download_url}'>
        <p class ='author'>${item.author}</p>
    </div>
    `;
    ImagesCards = ImagesCards + cardBlock;
    });
    localStorage.setItem("lastVisit", ImagesCards);
    document.querySelector(elem).innerHTML = ImagesCards;
};

// Функция для получения числа из Input 
function validateInput (inputClass) {
    const nummer = document.querySelector(inputClass).value;
    if(nummer != '' && !isNaN(nummer) && +nummer >= 1 && +nummer <= 100 ) return nummer;
}

// Функция принимает url параметры page и limit
function urlParams (url, page, limit) {
    let urlObj = new URL(url);
    urlObj.searchParams.set('page', page);
    urlObj.searchParams.set('limit', limit);
    return urlObj;
}

// Выводим последний визит при новом старте
document.querySelector('.section-data').innerHTML = localStorage.getItem('lastVisit');

// Ищим кнопку запроса
const btn = document.querySelector('.js-dtn-send');
// Вешаем обработчик на кнопку
btn.addEventListener('click', () => {
    localStorage.clear()
    // Promise
    const promise = new Promise((resolve, reject) => {
        const pageNumer = validateInput ('.js-input-pageNum');
        if(pageNumer) {
            resolve (pageNumer); //  Передаём дальше результат работы функции
            } else {
                reject ('Номер страницы вне диапазона от 1 до 10'); // есил pageNumer = fslse
            };
        });

    promise
        .then (pageNum => {
            return new Promise ((resolve, reject) => {
                const limitNummer = validateInput ('.js-input-limitNum');
                if(limitNummer) {
                    resolve (urlParams (url, pageNum, limitNummer));
                } else {
                    reject ('Лимит вне диапазона от 1 до 10'); // есил limitNummer = fslse
                    };
                });
            })

        .then (dataRequest => {
            // возвращаем fetch
            return fetch(dataRequest)
                .then((response) => {
                    return response.json()})
                .then((json) => {
                    return json;})
                .catch(() => {console.log('Error')})
                })

        .then(apiData => {
            document.querySelector('.js-text-error').innerHTML = '';
            displayData (apiData, '.section-data');
        })

        .catch (error => {
            document.querySelector('.js-text-error').innerHTML = error;
        })

// --- / btn
})
