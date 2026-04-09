import asyncio
import logging
import sys
import os
import threading
from aiogram import Bot, Dispatcher, types
from aiogram.filters import CommandStart
from aiogram.types import Message, ReplyKeyboardMarkup, KeyboardButton, ReplyKeyboardRemove
from aiogram.enums import ParseMode
from aiogram.client.default import DefaultBotProperties
import aiohttp
from flask import Flask

BOT_TOKEN = os.getenv("BOT_TOKEN")
MINIAPP_URL = os.getenv("MINIAPP_URL", "https://effortless-entremet-6ace1b.netlify.app")
API_URL = os.getenv("API_URL", "http://localhost:3001/api")
PORT = int(os.getenv("PORT", 10000))

app = Flask(__name__)

@app.route('/')
def home():
    return "Bot is running", 200

@app.route('/health')
def health():
    return "OK", 200

def run_flask():
    app.run(host="0.0.0.0", port=PORT)

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
        "🔊 <b>LAB RECORDS STUDIO</b>\n"
        "━━━━━━━━━━━━━━━━━━━━\n\n"
        "Добро пожаловать в пространство чистого звука.\n\n"
        "📀 Запись\n"
        "🎧 Сведение\n"
        "🔊 Мастеринг\n\n"
        "📞 Пожалуйста, отправьте номер телефона для входа.",
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
        "📀 Вы успешно авторизованы.\n\n"
        "Чтобы открыть студию, нажмите кнопку меню рядом с полем ввода.",
        reply_markup=ReplyKeyboardRemove()
    )

async def run_bot():
    await dp.start_polling(bot)

async def main():
    flask_thread = threading.Thread(target=run_flask)
    flask_thread.daemon = True
    flask_thread.start()
    await run_bot()

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, stream=sys.stdout)
    asyncio.run(main())
