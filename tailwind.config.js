/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*/*/*.html","./node_modules/flowbite/**/*.js","./views/*.ejs"],
  theme: {
    extend: {
      fontFamily: {
        'spoqa2' : ['Spoqa Han Sans Neo', 'sans-serif'],
        'pretendard' : ['Pretendard','sans-serif']
      },
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
}
