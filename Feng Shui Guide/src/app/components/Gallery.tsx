import { motion } from "motion/react";

const images = [
  {
    url: "https://images.unsplash.com/photo-1698069005894-f01747b3f152?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxqYXBhbmVzZSUyMHRlbXBsZSUyMGFyY2hpdGVjdHVyZSUyMHJlZHxlbnwxfHx8fDE3NzU2NjQxNTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Cổng Torii Linh Thiêng",
    span: "col-span-2 row-span-2",
  },
  {
    url: "https://images.unsplash.com/photo-1701609858848-4a76cfe72e5f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxjaGluZXNlJTIwYXJjaGl0ZWN0dXJlJTIwdHJhZGl0aW9uYWwlMjBidWlsZGluZ3xlbnwxfHx8fDE3NzU2NjQxNTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Kiến Trúc Cổ Điển",
    span: "col-span-1 row-span-1",
  },
  {
    url: "https://images.unsplash.com/photo-1749516869657-ebd41ad535e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxjaGluZXNlJTIwYXJjaGl0ZWN0dXJlJTIwdHJhZGl0aW9uYWwlMjBidWlsZGluZ3xlbnwxfHx8fDE3NzU2NjQxNTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Tháp Cổ Đình",
    span: "col-span-1 row-span-1",
  },
  {
    url: "https://images.unsplash.com/photo-1760624493021-b895835809ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxmZW5nJTIwc2h1aSUyMHplbiUyMG1lZGl0YXRpb24lMjBnYXJkZW58ZW58MXx8fHwxNzc1NjY0MTU3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Vườn Thiền",
    span: "col-span-1 row-span-1",
  },
  {
    url: "https://images.unsplash.com/photo-1690885884531-5cf4d3eb978d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxqYXBhbmVzZSUyMHRlbXBsZSUyMGFyY2hpdGVjdHVyZSUyMHJlZHxlbnwxfHx8fDE3NzU2NjQxNTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Đình Làng Linh Khí",
    span: "col-span-1 row-span-1",
  },
];

export function Gallery() {
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[280px]">
          {images.map((image, index) => (
            <motion.div
              key={image.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.01 }}
              className={`${image.span} relative overflow-hidden group cursor-pointer`}
            >
              <img
                src={image.url}
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
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
