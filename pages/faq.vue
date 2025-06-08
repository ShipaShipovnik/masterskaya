<template>
   <header class="bg-black-600 text-black py-6 shadow-md">
        <div class="container mx-auto px-4">
            <h1 class="text-3xl font-bold">Часто задаваемые вопросы</h1>
            <p class="mt-2 text-black-100">Найдите ответы на популярные вопросы о нашей платформе</p>
        </div>
    </header>

    <!-- Основной контент -->
    <main class="container mx-auto px-4 py-8">
        <!-- Поиск по FAQ -->
        <div class="mb-8 max-w-2xl mx-auto">
            <input 
                type="text" 
                placeholder="Поиск по вопросам..." 
                class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black-500"
            >
        </div>

        <!-- Категории вопросов -->
        <div class="grid md:grid-cols-2 gap-6">
            <!-- Общие вопросы -->
            <div class="bg-white rounded-xl shadow-md overflow-hidden">
                <div class="bg-black-500 text-black px-5 py-4">
                    <h2 class="text-xl font-semibold">Общие вопросы</h2>
                </div>
                <div class="p-5 space-y-4">
                    <div class="faq-item border-b border-gray-100 pb-4">
                        <h3 class="font-medium text-lg text-black-700">Что такое биржа творческих фриланс-услуг?</h3>
                        <p class="mt-2 text-gray-600">Это платформа, где заказчики могут найти исполнителей для творческих задач (дизайн, копирайтинг, анимация, музыка и т. д.), а фрилансеры — предлагать свои услуги и находить клиентов.</p>
                    </div>
                    <div class="faq-item border-b border-gray-100 pb-4">
                        <h3 class="font-medium text-lg text-black-700">Чем ваша биржа отличается от других?</h3>
                        <p class="mt-2 text-gray-600">Мы специализируемся именно на творческих услугах, предлагаем удобные инструменты для портфолио, безопасные сделки и комьюнити единомышленников.</p>
                    </div>
                    <div class="faq-item">
                        <h3 class="font-medium text-lg text-black-700">Как зарегистрироваться на платформе?</h3>
                        <p class="mt-2 text-gray-600">Нажмите «Регистрация», укажите email или войдите через соцсети, заполните профиль и подтвердите аккаунт.</p>
                    </div>
                </div>
            </div>

            <!-- Для фрилансеров -->
            <div class="bg-white rounded-xl shadow-md overflow-hidden">
                <div class="bg-black-500 text-black px-5 py-4">
                    <h2 class="text-xl font-semibold">Для фрилансеров</h2>
                </div>
                <div class="p-5 space-y-4">
                    <div class="faq-item border-b border-gray-100 pb-4">
                        <h3 class="font-medium text-lg text-black-700">Как создать привлекательное портфолио?</h3>
                        <p class="mt-2 text-gray-600">Добавьте качественные работы, опишите свой опыт, укажите специализацию и добавьте отзывы (если есть).</p>
                    </div>
                    <div class="faq-item border-b border-gray-100 pb-4">
                        <h3 class="font-medium text-lg text-black-700">Как повысить шансы на заказы?</h3>
                        <p class="mt-2 text-gray-600">
                            — Заполните профиль полностью.<br>
                            — Добавьте разнообразные примеры работ.<br>
                            — Укажите конкурентные цены.<br>
                            — Будьте активны в откликах.
                        </p>
                    </div>
                    <div class="faq-item">
                        <h3 class="font-medium text-lg text-black-700">Как происходит оплата?</h3>
                        <p class="mt-2 text-gray-600">Вы получаете деньги после успешного выполнения заказа. Средства можно вывести на карту, электронный кошелек или банковский счет.</p>
                    </div>
                </div>
            </div>

            <!-- Для заказчиков -->
            <div class="bg-white rounded-xl shadow-md overflow-hidden">
                <div class="bg-black-500 text-black px-5 py-4">
                    <h2 class="text-xl font-semibold">Для заказчиков</h2>
                </div>
                <div class="p-5 space-y-4">
                    <div class="faq-item border-b border-gray-100 pb-4">
                        <h3 class="font-medium text-lg text-black-700">Как найти подходящего исполнителя?</h3>
                        <p class="mt-2 text-gray-600">Используйте фильтры (бюджет, рейтинг, специализация), изучите портфолио и отзывы.</p>
                    </div>
                    <div class="faq-item border-b border-gray-100 pb-4">
                        <h3 class="font-medium text-lg text-black-700">Как оформить заказ?</h3>
                        <p class="mt-2 text-gray-600">
                            — Создайте задание с подробным описанием.<br>
                            — Выберите исполнителя из откликов или найдите сами.<br>
                            — Обсудите детали и подтвердите сделку.
                        </p>
                    </div>
                    <div class="faq-item">
                        <h3 class="font-medium text-lg text-black-700">Как гарантируется качество работы?</h3>
                        <p class="mt-2 text-gray-600">
                            — Исполнители проходят проверку (опционально).<br>
                            — Работа сдается через безопасную сделку.<br>
                            — Можно запросить правки перед оплатой.
                        </p>
                    </div>
                </div>
            </div>

            <!-- Безопасность и поддержка -->
            <div class="bg-white rounded-xl shadow-md overflow-hidden">
                <div class="bg-black-500 text-black px-5 py-4">
                    <h2 class="text-xl font-semibold">Безопасность и поддержка</h2>
                </div>
                <div class="p-5 space-y-4">
                    <div class="faq-item border-b border-gray-100 pb-4">
                        <h3 class="font-medium text-lg text-black-700">Что делать в случае спора?</h3>
                        <p class="mt-2 text-gray-600">Обратитесь в арбитраж — модераторы помогут разрешить конфликт.</p>
                    </div>
                    <div class="faq-item border-b border-gray-100 pb-4">
                        <h3 class="font-medium text-lg text-black-700">Как связаться с поддержкой?</h3>
                        <p class="mt-2 text-gray-600">Напишите в онлайн-чат или на почту <strong>support@вашсайт.com</strong>.</p>
                    </div>
                    <div class="faq-item">
                        <h3 class="font-medium text-lg text-black-700">Как удалить аккаунт?</h3>
                        <p class="mt-2 text-gray-600">В настройках профиля выберите «Удалить аккаунт».</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Дополнительная помощь -->
        <div class="mt-12 bg-black-50 rounded-xl p-6 text-center">
            <h2 class="text-2xl font-bold text-black-800">Не нашли ответа?</h2>
            <p class="mt-2 text-gray-600">Свяжитесь с нашей службой поддержки, и мы поможем!</p>
            <button class="mt-4 bg-black-600 hover:bg-black-700 text-black px-6 py-3 rounded-lg font-medium transition-colors">
                Написать в поддержку
            </button>
        </div>
    </main>
</template>

<script setup>

</script>

<style lang="scss" scoped>

</style>