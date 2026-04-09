import asyncio
import logging
import sys
import os
import socket
from aiogram import Bot, Dispatcher, types
from aiogram.filters import CommandStart
from aiogram.types import Message, ReplyKeyboardMarkup, KeyboardButton, ReplyKeyboardRemove
from aiogram.enums import ParseMode
from aiogram.client.default import DefaultBotProperties
import aiohttp
from aiohttp import web

# Фикс DNS
socket.getaddrinfo = lambda *args, **kwargs: [(socket.AF_INET, socket.SOCK_STREAM, 6, '', ('149.154.167.220', 443))]

BOT_TOKEN = os.getenv("BOT_TOKEN")
MINIAPP_URL = os.getenv("MINIAPP_URL", "https://effortless-entremet-6ace1b.netlify.app")
API_URL = os.getenv("API_URL", "http://localhost:3001/api")
PORT = int(os.getenv("PORT", 10000))

dp = Dispatcher()
bot = Bot(token=BOT_TOKEN, default=DefaultBotProperties(parse_mode=ParseMode.HTML))

start_keyboard = ReplyKeyboardMarkup(
    keyboard=[
        [KeyboardButton(text="📞 Отправить номер", request_contact=True)],
    ],
    resize_keyboard=True
)

@dp.message(CommandStart())
async def start_command(message: Message):
    await message.answer(
        "🔊 <b>ZÖRGE</b> — студия звукозаписи\n"
        "━━━━━━━━━━━━━━━━━━━━━━━━\n\n"
        "💎 <b>Создаём хиты</b>, <i>которые звучат дорого</i>.\n"
        "   Каждый трек — <u>на вес золота</u>.\n\n"
        "▸ 📀 <b>Профессиональная запись</b>\n"
        "▸ 🎧 <i>Качественное сведение</i>\n"
        "▸ 🔊 <u>Аналоговый мастеринг</u>\n"
        "▸ 🎼 <s>Обычная аранжировка</s> <b>Премиум саунд‑дизайн</b>\n\n"
        "<blockquote>🎛️ Оборудование премиум‑класса.\n"
        "🎤 Комфортное пространство для творчества.</blockquote>\n\n"
        "📞 Для доступа к услугам, пожалуйста, отправьте номер телефона.\n"
        "🔒 <tg-spoiler>Мы не передаём данные третьим лицам.</tg-spoiler>\n\n"
        "<code>✨ Добро пожаловать в ZÖRGE — место, где рождается звук.</code>",
        reply_markup=start_keyboard
    )

@dp.message(lambda msg: msg.contact is not None)
async def contact_handler(message: Message):
    phone = message.contact.phone_number
    user_id = message.from_user.id
    first_name = message.from_user.first_name
    username = message.from_user.username

    async with aiohttp.ClientSession() as session:
        try:
            async with session.post(f"{API_URL}/auth/register", json={
                "telegram_id": user_id,
                "phone": phone,
                "first_name": first_name,
                "username": username
            }) as resp:
                pass
        except:
            pass

    await message.answer(
    "✅ <b>РЕГИСТРАЦИЯ ПРОЙДЕНА</b>\n"
    "━━━━━━━━━━━━━━━━━━━━━━━━\n\n"
    "<i>Добро пожаловать в закрытое сообщество ZÖRGE.</i> 🔐\n\n"
    "🎛️ Теперь вам доступны:\n"
    "▸ 🗓️ <u>Аренда студии</u>\n"
    "▸ 📦 <u>Пакеты часов</u>\n"
    "▸ 🎚️ <u>Сведение и мастеринг</u>\n\n"
    "<blockquote>💡 Чтобы открыть студию, нажмите кнопку меню слева от поля ввода.</blockquote>\n\n"
    "<tg-spoiler>🔒 Ваш номер используется только для связи с администратором.</tg-spoiler>\n\n"
    "<code>🎧 ZÖRGE — место, где рождается звук.</code>",
    reply_markup=ReplyKeyboardRemove()
)

# Простой веб-сервер для Render
async def handle_health(request):
    return web.Response(text="OK")

async def run_web_server():
    app = web.Application()
    app.router.add_get('/', handle_health)
    app.router.add_get('/health', handle_health)
    runner = web.AppRunner(app)
    await runner.setup()
    site = web.TCPSite(runner, '0.0.0.0', PORT)
    await site.start()
    logging.info(f"Web server started on port {PORT}")

async def main():
    # Запускаем веб-сервер и бота параллельно
    await asyncio.gather(
        run_web_server(),
        dp.start_polling(bot)
    )

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, stream=sys.stdout)
    asyncio.run(main())
