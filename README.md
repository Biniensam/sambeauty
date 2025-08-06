# Beauty Haven - Premium Beauty E-commerce Website

A modern, responsive beauty e-commerce website built with Next.js, React, and Tailwind CSS, inspired by Cult Beauty's design and functionality.

## 🚀 Features

- **Modern Design**: Clean, elegant design with beautiful gradients and animations
- **Responsive Layout**: Fully responsive design that works on all devices
- **Interactive Components**: Hover effects, product cards with wishlist functionality
- **Product Filtering**: Filter products by categories (New In, Trending, Cult Picks)
- **Search Functionality**: Integrated search bar in the header
- **Shopping Cart**: Visual cart indicator with item count
- **Newsletter Signup**: Email subscription in the footer
- **Social Media Integration**: Social media links and sharing
- **Accessibility**: ARIA labels and semantic HTML for better accessibility

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **TypeScript**: Full TypeScript support
- **Fonts**: Inter (sans-serif) and Playfair Display (serif)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd beauty-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
beauty-website/
├── app/
│   ├── globals.css          # Global styles and Tailwind directives
│   ├── layout.tsx           # Root layout component
│   └── page.tsx             # Homepage
├── components/
│   ├── Header.tsx           # Navigation header with search
│   ├── HeroSection.tsx      # Hero banner section
│   ├── ProductCard.tsx      # Individual product card
│   ├── FeaturedProducts.tsx # Products grid with filtering
│   └── Footer.tsx           # Footer with links and newsletter
├── public/                  # Static assets
├── tailwind.config.js       # Tailwind configuration
├── next.config.js           # Next.js configuration
├── package.json             # Dependencies and scripts
└── README.md               # This file
```

## 🎨 Design System

### Colors
- **Primary**: Pink gradient (#ec4899 to #FF69B4)
- **Beauty Colors**: Custom beauty-themed color palette
- **Neutral**: Gray scale for text and backgrounds

### Typography
- **Headings**: Playfair Display (serif)
- **Body**: Inter (sans-serif)

### Components
- **Buttons**: Primary and secondary button styles
- **Cards**: Product cards with hover effects
- **Forms**: Styled input fields and buttons

## 🔧 Customization

### Adding New Products
Edit the `mockProducts` array in `components/FeaturedProducts.tsx`:

```typescript
const mockProducts = [
  {
    id: 'unique-id',
    name: 'Product Name',
    brand: 'Brand Name',
    price: 29.99,
    image: 'product-image-url',
    rating: 4.5,
    reviewCount: 123,
    isNew: true, // Optional
    isSale: true, // Optional
    discount: 20, // Optional
  },
  // ... more products
]
```

### Styling Customization
Modify `tailwind.config.js` to customize:
- Colors
- Fonts
- Animations
- Spacing

### Adding New Pages
1. Create a new file in the `app` directory
2. Export a default React component
3. Add navigation links in the Header component

## 📱 Responsive Design

The website is fully responsive with breakpoints:
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Design inspiration from [Cult Beauty](https://www.cultbeauty.com/)
- Icons from [Lucide React](https://lucide.dev/)
- Images from [Unsplash](https://unsplash.com/)

## 📞 Support

For support or questions, please open an issue in the GitHub repository. 