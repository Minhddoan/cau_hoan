import { motion } from "motion/react";

const principles = [
  {
    element: "Kim",
    color: "text-gray-300",
    description: "Kim loại - Sự vững chắc và giàu sang",
  },
  {
    element: "Mộc",
    color: "text-green-500",
    description: "Gỗ - Tăng trưởng và phát triển",
  },
  {
    element: "Thủy",
    color: "text-blue-400",
    description: "Nước - Sự lưu chuyển và tuần hoàn",
  },
  {
    element: "Hỏa",
    color: "text-primary",
    description: "Lửa - Năng lượng và đam mê",
  },
  {
    element: "Thổ",
    color: "text-amber-600",
    description: "Đất - Sự ổn định và nuôi dưỡng",
  },
];

export function Philosophy() {
  return (
    <section className="py-32 px-6 md:px-12 bg-black relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block border border-primary/50 px-6 py-2 mb-6">
              <span className="tracking-[0.3em] uppercase text-primary text-sm">Triết Lý</span>
            </div>
            <h2 className="text-5xl md:text-6xl mb-8" style={{ fontWeight: 700 }}>
              Ngũ Hành
              <br />
              <span className="text-primary">Kim Mộc Thủy Hỏa Thổ</span>
            </h2>
            <p className="text-xl text-gray-400 leading-relaxed mb-8">
              Năm yếu tố cơ bản tạo nên sự cân bằng trong vũ trụ. Mỗi yếu tố có năng lượng riêng và tương tác với nhau theo quy luật sinh khắc.
            </p>
            <p className="text-lg text-gray-500 leading-relaxed">
              Việc hiểu và áp dụng đúng nguyên lý Ngũ Hành giúp tạo ra không gian sống hài hòa, thu hút may mắn và thịnh vượng.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            {principles.map((principle, index) => (
              <motion.div
                key={principle.element}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ x: 10 }}
                className="border-l-4 border-primary/50 pl-8 py-4 hover:border-primary transition-all duration-300 bg-gradient-to-r from-primary/5 to-transparent"
              >
                <div className="flex items-center gap-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                    className={`text-4xl ${principle.color}`}
                    style={{ fontWeight: 700 }}
                  >
                    {principle.element}
                  </motion.div>
                  <div>
                    <p className="text-gray-400">{principle.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
