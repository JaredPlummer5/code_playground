/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}', // Note the addition of the `app` directory.
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}'
    ],
  theme: {
    extend: {
      colors: {
      customColor: '#111827', 
    },
},
  },
    plugins: [
        require('flowbite/plugin')
  ],
}

