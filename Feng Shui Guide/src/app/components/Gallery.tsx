import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { getGallery, getImageUrl } from "../../lib/api";

export function Gallery() {
  const [images, setImages] = useState<any[]>([]);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await getGallery();
        if (res.success) {
          setImages(res.data);
        }
      } catch (err) {
        console.error("Gallery check error:", err);
      }
    };
    fetchGallery();
  }, []);

  return (
    <section id="gallery" className="py-32 px-6 md:px-12 bg-gradient-to-b from-background to-black">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold" />
            <span className="tracking-[0.3em] uppercase text-gold text-sm" style={{ fontWeight: 700 }}>
              Thư Viện
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl mb-6 text-white" style={{ fontWeight: 700 }}>
            Kiến Trúc <span className="text-gold">Phương Đông</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl">
            Vẻ đẹp tinh tế và sự hài hòa trong kiến trúc truyền thống Á Đông
          </p>
        </motion.div>

        {images.length === 0 ? (
          <div className="text-white/40 italic py-10">Đang cập nhật hình ảnh...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[280px]">
            {images.map((image, index) => {
               // Assign a dynamic span pattern if not explicit
               const isLarge = index === 0 ? "col-span-1 md:col-span-2 row-span-2" : "col-span-1 row-span-1";

               return (
                  <motion.div
                    key={image.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ scale: 1.01 }}
                    className={`${isLarge} relative overflow-hidden group cursor-pointer`}
                  >
                    <img
                      src={getImageUrl(image.image_url)}
                      alt={image.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                    <div className="absolute inset-0 border border-gold/0 group-hover:border-gold/30 transition-all duration-400" />
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      whileHover={{ y: 0, opacity: 1 }}
                      className="absolute bottom-0 left-0 right-0 p-6"
                    >
                      <h3 className="text-xl text-white" style={{ fontWeight: 600 }}>
                        {image.title}
                      </h3>
                      {image.category && (
                        <p className="text-gold text-xs uppercase tracking-widest mt-2">{image.category}</p>
                      )}
                    </motion.div>
                  </motion.div>
               );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
