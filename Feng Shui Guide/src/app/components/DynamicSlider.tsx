import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination, EffectFade } from 'swiper/modules';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router';
import { getImagesByCategory, getImageUrl } from '../../lib/api';
import { useSettings } from '../context/SettingsContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { toast } from 'sonner';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

interface DynamicSliderProps {
  category: string;
  className?: string;
  overlayClassName?: string;
  showArrows?: boolean;
  showDots?: boolean;
  autoplay?: boolean;
  effect?: 'slide' | 'fade';
  renderContent?: boolean; // New prop to enable rendering text content
}

export function DynamicSlider({ 
  category, 
  className = "w-full h-full", 
  overlayClassName = "absolute inset-0 bg-black/40",
  showArrows = true,
  showDots = true,
  autoplay = true,
  effect = 'slide',
  renderContent = false
}: DynamicSliderProps) {
  const { setBookingOpen, setLoginOpen } = useSettings();
  const { user } = useAuth();
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await getImagesByCategory(category);
        if (res.success) {
          setImages(res.data);
        }
      } catch (err) {
        console.error(`Failed to fetch slider images for ${category}:`, err);
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, [category]);

  const renderSlideContent = (img: any) => {
    if (!renderContent) return null;

    return (
      <div className="absolute inset-0 z-10 flex items-center">
        <div className="container mx-auto px-8 md:px-16">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-4xl"
          >
            {/* Badge */}
            {img.badge && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="mb-8"
              >
                <div className="inline-flex items-center gap-3">
                  <div className="w-8 h-px bg-gold" />
                  <span className="border border-gold px-5 py-2 tracking-[0.3em] uppercase text-gold text-sm" style={{ fontWeight: 700 }}>
                    {img.badge}
                  </span>
                  <div className="w-8 h-px bg-gold" />
                </div>
              </motion.div>
            )}

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mb-8 leading-none tracking-tight text-white"
              style={{ fontSize: "clamp(3.5rem, 9vw, 8rem)", fontWeight: 800 }}
            >
              {img.title}
              {img.title_accent && (
                <>
                  <br />
                  <span style={{ color: "#c41e3a" }}>{img.title_accent}</span>
                </>
              )}
            </motion.h1>

            {img.subtitle && (
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.5 }}
                className="text-xl md:text-2xl text-white/65 mb-12 max-w-2xl leading-relaxed"
              >
                {img.subtitle}
              </motion.p>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.65 }}
              className="flex flex-wrap gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  if (!user) {
                    toast.error("Vui lòng đăng nhập để thực hiện đặt lịch tư vấn.", {
                      action: {
                        label: "Đăng nhập ngay",
                        onClick: () => setLoginOpen(true)
                      }
                    });
                    return;
                  }
                  setBookingOpen(true);
                }}
                className="bg-primary text-white px-12 py-4 hover:bg-primary/90 transition-colors shadow-2xl shadow-primary/30"
                style={{ fontWeight: 700 }}
              >
                Tư Vấn Ngay
              </motion.button>
              <Link to="/vat-pham">
                <motion.button
                  whileHover={{ scale: 1.04, backgroundColor: "rgba(212, 175, 55, 0.08)" }}
                  whileTap={{ scale: 0.96 }}
                  className="border border-gold text-gold px-12 py-4 transition-all w-full"
                  style={{ fontWeight: 700 }}
                >
                  Xem Vật Phẩm
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className={`${className} bg-neutral-900 animate-pulse`} />;
  }

  if (images.length === 0) {
    return null;
  }

  // Nếu chỉ có 1 ảnh, render ảnh tĩnh
  if (images.length === 1) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <img 
          src={getImageUrl(images[0].image_url)} 
          alt={images[0].title || category}
          className="w-full h-full object-cover"
        />
        {overlayClassName && <div className={overlayClassName} />}
        {renderSlideContent(images[0])}
      </div>
    );
  }

  // Nếu có từ 2 ảnh trở lên, render Swiper Slider
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Swiper
        modules={[Autoplay, Navigation, Pagination, EffectFade]}
        effect={effect}
        spaceBetween={0}
        slidesPerView={1}
        navigation={showArrows}
        pagination={showDots ? { clickable: true } : false}
        autoplay={autoplay ? { delay: 5000, disableOnInteraction: false } : false}
        loop={true}
        className="w-full h-full"
      >
        {images.map((img) => (
          <SwiperSlide key={img.id}>
            <div className="relative w-full h-full">
              <img 
                src={getImageUrl(img.image_url)} 
                alt={img.title || category}
                className="w-full h-full object-cover"
              />
              {overlayClassName && <div className={overlayClassName} />}
              {renderSlideContent(img)}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <style>{`
        .swiper-button-next, .swiper-button-prev {
          color: #D4AF37 !important;
          transform: scale(0.7);
        }
        .swiper-pagination-bullet {
          background: #D4AF37 !important;
          width: 8px;
          height: 8px;
          opacity: 0.5;
        }
        .swiper-pagination-bullet-active {
          background: #D4AF37 !important;
          width: 24px;
          border-radius: 4px;
          opacity: 1;
          transition: all 0.3s ease;
        }
      `}</style>
    </div>
  );
}
