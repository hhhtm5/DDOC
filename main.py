import asyncio
import logging
import sys
from aiogram import Bot, Dispatcher, types
from aiogram.filters import CommandStart
from aiogram.types import Message, ReplyKeyboardMarkup, KeyboardButton, ReplyKeyboardRemove
from aiogram.enums import ParseMode
from aiogram.client.default import DefaultBotProperties
import aiohttp
from config import BOT_TOKEN, API_URL, MINIAPP_URL

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
        "🎙 <b>LAB RECORDS STUDIO</b>\n"
        "━━━━━━━━━━━━━━━━━━━━\n\n"
        "Рады приветствовать вас в нашем официальном боте.\n"
        "Здесь вы можете ознакомиться с услугами, ценами и забронировать время.\n\n"
        "<i>Пожалуйста, авторизуйтесь по номеру телефона, чтобы продолжить.</i> 📞",
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
        "✅ Вы успешно зарегистрированы!\n\n"
        "Теперь нажмите кнопку меню (слева от поля ввода), чтобы открыть студию.",
        reply_markup=ReplyKeyboardRemove()
    )

async def main():
    await dp.start_polling(bot)

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, stream=sys.stdout)
    asyncio.run(main())