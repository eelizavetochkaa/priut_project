document.addEventListener('DOMContentLoaded', () => {
    // --- Код для модального окна и вкладок ---
    const moreInfoButton = document.querySelector('.hero__button');
    const modal = document.getElementById('moreInfoModal');
    const closeButton = document.querySelector('.close-button');
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    moreInfoButton.addEventListener('click', () => {
        modal.style.display = 'block';
        const initialActiveTab = document.querySelector('.tab-button.active');
        if (initialActiveTab && initialActiveTab.dataset.tab === 'aboutus' && document.getElementById('aboutus-content')) {
            fetchAndDisplayAboutUs(document.getElementById('aboutus-content'));
        }
    });

    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            button.classList.add('active');
            const tabId = button.dataset.tab;
            document.getElementById(`${tabId}-content`).classList.add('active');

            if (tabId === 'aboutus') {
                const aboutUsContentDiv = document.getElementById('aboutus-content');
                if (aboutUsContentDiv) {
                    fetchAndDisplayAboutUs(aboutUsContentDiv);
                }
            }
        });
    });

    const initialTabButton = document.querySelector('.tab-button.active');
    if (initialTabButton) {
        initialTabButton.click(); // Активировать начальную вкладку
    }
    // --- Конец кода для модального окна ---

    const aboutUsPageContent = document.getElementById('aboutUsPageContent');
    if (aboutUsPageContent) {
        fetchAndDisplayAboutUs(aboutUsPageContent);
    }

    // --- Загрузка данных "О нас" ---
    const ABOUT_US_API_ENDPOINT = 'http://localhost:3000/api/aboutus';

    // priutJava.js

// ... (остальной код до этой функции)

async function fetchAndDisplayAboutUs(targetElement) {
    console.log('Вызвана функция fetchAndDisplayAboutUs.');
    if (!targetElement) {
        console.error('targetElement не найден!');
        return;
    }

    console.log('targetElement найден:', targetElement.id);
    targetElement.innerHTML = '<p class="loading-message">Загрузка информации...</p>';

    try {
        console.log('Отправляем запрос к: http://localhost:3000/api/aboutus');
        const response = await fetch('http://localhost:3000/api/aboutus');
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

        const modalLink = document.createElement('a');
        modalLink.href = 'aboutus.html'; 
        modalLink.classList.add('modal-link');
        modalLink.textContent = 'Подробнее о приюте'; 
        targetElement.appendChild(modalLink);

    } catch (error) {
        console.error('Ошибка при загрузке данных "О нас":', error);
        if (targetElement) {
            targetElement.innerHTML = '<p class="error-message">Не удалось загрузить информацию. Пожалуйста, попробуйте позже.</p>';
        }
    }
}

    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        const nameInput = document.getElementById('contactName');
        const emailInput = document.getElementById('contactEmail');
        const messageInput = document.getElementById('contactMessage');
        const fileInput = document.getElementById('contactFile');
        const savedName = localStorage.getItem('contactName');
        const savedEmail = localStorage.getItem('contactEmail');
        const savedMessage = localStorage.getItem('contactMessage');

        if (savedName) nameInput.value = savedName;
        if (savedEmail) emailInput.value = savedEmail;
        if (savedMessage) messageInput.value = savedMessage;

        nameInput.addEventListener('input', () => localStorage.setItem('contactName', nameInput.value));
        emailInput.addEventListener('input', () => localStorage.setItem('contactEmail', emailInput.value));
        messageInput.addEventListener('input', () => localStorage.setItem('contactMessage', messageInput.value));

        function showValidationError(inputElement, message) {
            inputElement.classList.add('is-invalid');
            inputElement.classList.remove('is-valid'); 
            let errorSpan = inputElement.nextElementSibling;
            if (!errorSpan || !errorSpan.classList.contains('validation-error')) {
                errorSpan = document.createElement('span');
                errorSpan.classList.add('validation-error');
                inputElement.parentNode.insertBefore(errorSpan, inputElement.nextSibling);
            }
            errorSpan.textContent = message;
        }

        function hideValidationError(inputElement) {
            inputElement.classList.remove('is-invalid');
            inputElement.classList.add('is-valid'); 
            const errorSpan = inputElement.nextElementSibling;
            if (errorSpan && errorSpan.classList.contains('validation-error')) {
                errorSpan.remove();
            }
        }

        nameInput.addEventListener('input', () => {
            if (nameInput.value.trim() === '') {
                showValidationError(nameInput, 'Пожалуйста, введите ваше имя.');
            } else {
                hideValidationError(nameInput);
            }
        });

        emailInput.addEventListener('input', () => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailInput.value.trim() === '') {
                showValidationError(emailInput, 'Пожалуйста, введите ваш email.');
            } else if (!emailRegex.test(emailInput.value)) {
                showValidationError(emailInput, 'Пожалуйста, введите корректный email.');
            } else {
                hideValidationError(emailInput);
            }
        });

        messageInput.addEventListener('input', () => {
            if (messageInput.value.trim() === '') {
                showValidationError(messageInput, 'Пожалуйста, введите ваше сообщение.');
            } else {
                hideValidationError(messageInput);
            }
        });

        contactForm.addEventListener('submit', async (event) => {
            event.preventDefault(); 

            let isValid = true; 
            if (nameInput.value.trim() === '') {
                showValidationError(nameInput, 'Пожалуйста, введите ваше имя.');
                isValid = false;
            } else {
                hideValidationError(nameInput);
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailInput.value.trim() === '') {
                showValidationError(emailInput, 'Пожалуйста, введите ваш email.');
                isValid = false;
            } else if (!emailRegex.test(emailInput.value)) {
                showValidationError(emailInput, 'Пожалуйста, введите корректный email.');
                isValid = false;
            } else {
                hideValidationError(emailInput);
            }

            if (messageInput.value.trim() === '') {
                showValidationError(messageInput, 'Пожалуйста, введите ваше сообщение.');
                isValid = false;
            } else {
                hideValidationError(messageInput);
            }

            if (!isValid) {
                const firstInvalidField = document.querySelector('.is-invalid');
                if (firstInvalidField) {
                    firstInvalidField.focus();
                }
                return;
            }

            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const message = messageInput.value.trim();
            const file = fileInput && fileInput.files.length > 0 ? fileInput.files[0] : null;

            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('message', message);
            if (file) { 
                formData.append('file', file);
            }

            const API_ENDPOINT = 'http://localhost:3000/api/contact';
            const submitButton = contactForm.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.textContent = 'Отправка...';

            try {
                const response = await fetch(API_ENDPOINT, {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    alert('Сообщение успешно отправлено!');
                    contactForm.reset(); 
                    localStorage.removeItem('contactName');
                    localStorage.removeItem('contactEmail');
                    localStorage.removeItem('contactMessage');
                    nameInput.classList.remove('is-invalid', 'is-valid');
                    emailInput.classList.remove('is-invalid', 'is-valid');
                    messageInput.classList.remove('is-invalid', 'is-valid');
                    document.querySelectorAll('.validation-error').forEach(el => el.remove());

                } else {
                    const errorData = await response.json();
                    alert(`Ошибка при отправке сообщения: ${errorData.message || response.statusText}`);
                }
            } catch (error) {
                console.error('Ошибка сети или сервера:', error);
                alert('Произошла ошибка при отправке сообщения. Пожалуйста, попробуйте позже.');
            } finally {
                submitButton.disabled = false;
                submitButton.textContent = 'Отправить сообщение';
            }
        });
    }
});