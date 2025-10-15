// Cookie Popup Manager
class CookiePopup {
    constructor(config = {}) {
        this.popup = null;
        this.acceptBtn = null;
        this.cookieName = 'cookieConsent';
        
        // Настройки кастомизации попапа с значениями по умолчанию
        this.config = {
            // Цвета
            backgroundColor: '#ffffff',
            textColor: '#666666',
            buttonColor: '#4CAF50',
            buttonTextColor: '#ffffff',
            
            // Размеры и позиционирование
            borderRadius: '12px',
            leftPosition: '20px',
            rightPosition: '20px',
            bottomPosition: '20px',
            
            // Тень
            shadowColor: 'rgba(0,0,0,0.2)',
            shadowBlur: '30px',
            shadowOffset: '0 10px',
            
            // Шрифт
            fontSize: '0.95rem',
            
            // Текст
            message: 'На сайте используется Яндекс Метрика, собираются и обрабатываются сооkiе-файлы и персональные данные пользователей заполненные в формах. Продолжая использовать сайт, вы соглашаетесь с <a href="#" class="policy-link" target="_blank">политикой обработки персональных данных</a>.',
            buttonText: 'ОК',
            thankYouMessage: 'Спасибо! Вы приняли условия обработки персональных данных.',
            
            // Ссылка на политику
            policyUrl: '#'
        };
        
        // Переопределяем настройки переданными параметрами
        Object.assign(this.config, config);
        
        this.injectStyles();
        this.createPopupHTML();
        this.init();
    }
    
    // Вставляем CSS стили в head документа
    injectStyles() {
        // Проверяем, не добавлены ли уже стили
        if (document.getElementById('cookie-popup-styles')) {
            return;
        }
        
        // Функция для затемнения цвета на 30%
        const darkenColor = (color, percent) => {
            const num = parseInt(color.replace("#", ""), 16);
            const amt = Math.round(2.55 * percent);
            const R = (num >> 16) - amt;
            const G = (num >> 8 & 0x00FF) - amt;
            const B = (num & 0x0000FF) - amt;
            return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
                (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
                (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
        };
        
        const darkButtonColor = darkenColor(this.config.buttonColor, 30);
        
        const styles = `
            .cookie-popup {
                position: fixed;
                bottom: ${this.config.bottomPosition};
                left: ${this.config.leftPosition};
                right: ${this.config.rightPosition};
                background: ${this.config.backgroundColor};
                border-radius: ${this.config.borderRadius};
                box-shadow: ${this.config.shadowOffset} ${this.config.shadowBlur} ${this.config.shadowColor};
                z-index: 1000;
                font-family: sans-serif;
                transform: translateY(100%);
                transition: transform 0.3s ease-in-out;
                max-width: 500px;
                margin: 0 auto;
            }
            
            .cookie-popup.show {
                transform: translateY(0);
            }
            
            .cookie-content {
                padding: 1.5rem;
                text-align: center;
            }
            
            .cookie-icon {
                font-size: 3rem;
                margin-bottom: 1rem;
            }
            
            .cookie-description {
                color: ${this.config.textColor};
                margin-bottom: 1.5rem;
                font-size: ${this.config.fontSize};
                line-height: 1.5;
            }
            
            .policy-link {
                color: ${this.config.buttonColor};
                text-decoration: underline;
                cursor: pointer;
                transition: color 0.3s ease;
            }
            
            .policy-link:hover {
                color: ${darkButtonColor};
                text-decoration: none;
            }
            
            .cookie-button-container {
                display: flex;
                justify-content: center;
            }
            
            .btn-ok {
                padding: 0.75rem 2rem;
                border: none;
                border-radius: 6px;
                font-size: 0.9rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                background: ${this.config.buttonColor};
                color: ${this.config.buttonTextColor};
                min-width: 120px;
            }
            
            .btn-ok:hover {
                background: ${darkButtonColor};
                transform: translateY(-2px);
                box-shadow: 0 4px 8px ${this.config.shadowColor};
            }
            
            @media (max-width: 768px) {
                .cookie-popup {
                    left: 10px;
                    right: 10px;
                    bottom: 10px;
                }
                
                .cookie-content {
                    padding: 1rem;
                }
                
                .cookie-button-container {
                    flex-direction: column;
                    align-items: center;
                }
                
                .btn-ok {
                    width: 100%;
                    max-width: 200px;
                }
            }
        `;
        
        const styleElement = document.createElement('style');
        styleElement.id = 'cookie-popup-styles';
        styleElement.textContent = styles;
        document.head.appendChild(styleElement);
    }
    
    // Создаем HTML структуру попапа динамически
    createPopupHTML() {
        // Создаем основной контейнер попапа
        this.popup = document.createElement('div');
        this.popup.className = 'cookie-popup';
        this.popup.id = 'cookiePopup';
        
        // Создаем контент попапа
        const cookieContent = document.createElement('div');
        cookieContent.className = 'cookie-content';
        
        // Создаем иконку
        const cookieIcon = document.createElement('div');
        cookieIcon.className = 'cookie-icon';
        cookieIcon.textContent = '🍪';
        
        // Создаем описание
        const cookieDescription = document.createElement('p');
        cookieDescription.className = 'cookie-description';
        cookieDescription.innerHTML = this.config.message.replace('#', this.config.policyUrl);  
        
        // Создаем контейнер для кнопки
        const cookieButtonContainer = document.createElement('div');
        cookieButtonContainer.className = 'cookie-button-container';
        
        // Создаем кнопку ОК
        this.acceptBtn = document.createElement('button');
        this.acceptBtn.className = 'btn-ok';
        this.acceptBtn.id = 'acceptCookies';
        this.acceptBtn.textContent = this.config.buttonText;
        
        // Собираем структуру
        cookieButtonContainer.appendChild(this.acceptBtn);
        cookieContent.appendChild(cookieIcon);
        cookieContent.appendChild(cookieDescription);
        cookieContent.appendChild(cookieButtonContainer);
        this.popup.appendChild(cookieContent);
        
        // Добавляем попап в body
        document.body.appendChild(this.popup);
    }
    
    init() {
        // Проверяем, есть ли уже согласие пользователя
        if (!this.hasUserConsent()) {
            this.showPopup();
        }
        
        // Добавляем обработчик события
        this.acceptBtn.addEventListener('click', () => this.handleAccept());
    }
    
    // Проверяем, дал ли пользователь согласие ранее
    hasUserConsent() {
        return localStorage.getItem(this.cookieName) !== null;
    }
    
    // Показываем попап с анимацией
    showPopup() {
        // Небольшая задержка для плавного появления
        setTimeout(() => {
            this.popup.classList.add('show');
        }, 500);
    }
    
    // Скрываем попап с анимацией
    hidePopup() {
        this.popup.classList.remove('show');
        
        // Удаляем попап из DOM после анимации
        setTimeout(() => {
            this.popup.style.display = 'none';
        }, 300);
    }
    
    // Обработка принятия cookies
    handleAccept() {
        this.saveUserChoice('accepted');
        this.hidePopup();
        this.showThankYouMessage(this.config.thankYouMessage);
    }
    
    // Сохраняем выбор пользователя в localStorage
    saveUserChoice(choice) {
        const consentData = {
            choice: choice,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
        };
        
        localStorage.setItem(this.cookieName, JSON.stringify(consentData));
    }
    
    // Показываем сообщение благодарности
    showThankYouMessage(message) {
        // Создаем временное уведомление
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 6px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 1001;
            font-size: 0.9rem;
            max-width: 300px;
            transform: translateX(100%);
            transition: transform 0.3s ease-in-out;
        `;
        
        document.body.appendChild(notification);
        
        // Анимация появления
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Автоматическое скрытие через 3 секунды
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // Метод для получения текущего статуса согласия
    getConsentStatus() {
        const consent = localStorage.getItem(this.cookieName);
        if (consent) {
            return JSON.parse(consent);
        }
        return null;
    }
    
    // Метод для сброса согласия (для тестирования)
    resetConsent() {
        localStorage.removeItem(this.cookieName);
        this.popup.style.display = 'block';
        this.showPopup();
    }
}

// Инициализация попапа после загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    // Проверяем, есть ли глобальная конфигурация
    const config = window.cookiePopupConfig || {};
    
    // Создаем экземпляр CookiePopup с конфигурацией
    window.cookiePopup = new CookiePopup(config);
    
    // Добавляем глобальную функцию для сброса (для тестирования)
    window.resetCookieConsent = function() {
        window.cookiePopup.resetConsent();
    };
    
    console.log('Cookie Popup инициализирован');
    console.log('Для сброса согласия используйте: resetCookieConsent()');
});

// Дополнительные утилиты для работы с cookies
const CookieUtils = {
    // Установка cookie
    setCookie: function(name, value, days = 365) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
    },
    
    // Получение cookie
    getCookie: function(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    },
    
    // Удаление cookie
    deleteCookie: function(name) {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
    }
};

// Экспортируем утилиты в глобальную область
window.CookieUtils = CookieUtils;
