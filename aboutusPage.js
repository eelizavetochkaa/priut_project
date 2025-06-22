document.addEventListener('DOMContentLoaded', () => {
    const ABOUT_US_API_ENDPOINT = 'http://localhost:3000/api/aboutus';
    const aboutUsPageContent = document.getElementById('aboutUsPageContent');

    if (aboutUsPageContent) {
        fetchAndDisplayAboutUs(aboutUsPageContent);
    } else {
        console.error('Элемент #aboutUsPageContent не найден на странице!');
    }
});

async function fetchAndDisplayAboutUs(targetElement) {
    console.log('Вызвана функция fetchAndDisplayAboutUs.');
    if (!targetElement) {
        console.error('targetElement не найден!');
        return;
    }

    console.log('targetElement найден:', targetElement.id);
    targetElement.innerHTML = '<p class="loading-message">Загрузка информации...</p>';

    try {
        const missionElement = document.createElement('p');
        missionElement.textContent = `Миссия: ${data.missionStatement}`;
        targetElement.appendChild(missionElement);
        const modalLink = document.createElement('a');
        modalLink.href = 'aboutus.html'; 
        modalLink.classList.add('modal-link'); 
        modalLink.textContent = 'Подробнее о приюте'; 
        targetElement.appendChild(modalLink);
        console.log('Отправляем запрос к:', ABOUT_US_API_ENDPOINT);
        const response = await fetch(ABOUT_US_API_ENDPOINT);
        console.log('Получен ответ от API. Status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Ошибка HTTP: ${response.status} - ${errorText}`);
        }
        const data = await response.json();
        console.log('Получены данные:', data);

        targetElement.innerHTML = ''; 

        const titleElement = document.createElement('h3');
        titleElement.textContent = data.title;
        targetElement.appendChild(titleElement);

        data.paragraphs.forEach(paragraphText => {
            const pElement = document.createElement('p');
            pElement.textContent = paragraphText;
            targetElement.appendChild(pElement);
        });

        const yearElement = document.createElement('p');
        yearElement.textContent = `Основан в: ${data.foundingYear} году.`;
        targetElement.appendChild(yearElement);

        const missionElement = document.createElement('p');
        missionElement.textContent = `Миссия: ${data.missionStatement}`;
        targetElement.appendChild(missionElement);

    } catch (error) {
        console.error('Ошибка при загрузке данных "О нас":', error);
        if (targetElement) {
            targetElement.innerHTML = '<p class="error-message">Не удалось загрузить информацию. Пожалуйста, попробуйте позже.</p>';
        }
    }
}