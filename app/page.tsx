import Header from '@/components/Header'
import HeroSection from '@/components/HeroSection'
import FeaturedProducts from '@/components/FeaturedProducts'
import ImageSlider from '@/components/ImageSlider'
import Footer from '@/components/Footer'
import BottomNavigation from '@/components/BottomNavigation'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <FeaturedProducts />
      <ImageSlider />
      <Footer />
      <BottomNavigation />
    </main>
  )
} 