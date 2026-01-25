'use client';

import { motion } from 'framer-motion';
import { Eye, Gem, Clock, Award } from 'lucide-react';

export default function CraftsmanshipPage() {
  const processes = [
    {
      icon: Eye,
      title: 'Design',
      description: 'Each timepiece begins as a vision, sketched by our master designers who blend classical elegance with contemporary innovation.',
      details: ['Hand-drawn technical illustrations', 'CAD precision modeling', '3D prototype development']
    },
    {
      icon: Gem,
      title: 'Materials',
      description: 'We source only the finest materials from around the world, ensuring each component meets our exacting standards.',
      details: ['18K gold from Swiss refineries', 'Sapphire crystals from specialized labs', 'Hand-selected exotic leathers']
    },
    {
      icon: Clock,
      title: 'Assembly',
      description: 'Our master watchmakers spend hundreds of hours hand-assembling each movement, a process that cannot be rushed.',
      details: ['Over 300 individual components', 'Microscopic precision work', 'Traditional hand-finishing techniques']
    },
    {
      icon: Award,
      title: 'Quality Control',
      description: 'Before leaving our atelier, every watch undergoes rigorous testing to ensure it meets the Luxero standard of excellence.',
      details: ['30-day precision testing', 'Water resistance verification', 'Final aesthetic inspection']
    }
  ];

  return (
    <div className="min-h-screen pt-32 pb-24">
      {/* Hero */}
      <section className="px-6 lg:px-12 mb-24">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <p className="text-gold-500 font-sans text-xs tracking-ultra-wide uppercase mb-4">
              The Art of Watchmaking
            </p>
            <h1 className="text-4xl lg:text-6xl font-serif font-light tracking-wide mb-8">
              Craftsmanship
            </h1>
            <p className="text-luxury-light font-sans text-lg leading-relaxed">
              Behind every Luxero timepiece lies hundreds of hours of meticulous craftsmanship, 
              where ancient techniques meet modern precision to create something truly extraordinary.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="px-6 lg:px-12 mb-24">
        <div className="max-w-6xl mx-auto">
          {processes.map((process, index) => (
            <motion.div
              key={process.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className={`grid lg:grid-cols-2 gap-12 items-center py-16 ${
                index < processes.length - 1 ? 'border-b border-luxury-gray/30' : ''
              }`}
            >
              <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 border border-gold-500/30 flex items-center justify-center">
                    <process.icon className="w-6 h-6 text-gold-500" />
                  </div>
                  <span className="text-gold-500 font-sans text-xs tracking-extra-wide uppercase">
                    Step {index + 1}
                  </span>
                </div>
                <h2 className="text-3xl font-serif font-light mb-6">{process.title}</h2>
                <p className="text-luxury-light font-sans leading-relaxed mb-8">
                  {process.description}
                </p>
                <ul className="space-y-3">
                  {process.details.map((detail) => (
                    <li key={detail} className="flex items-center gap-3 text-luxury-muted font-sans text-sm">
                      <span className="w-1.5 h-1.5 bg-gold-500 rounded-full" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                <div className="aspect-[4/3] bg-gradient-to-br from-luxury-gray/50 to-luxury-dark/50 flex items-center justify-center">
                  <process.icon className="w-24 h-24 text-gold-500/20" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="px-6 lg:px-12 py-24 bg-luxury-dark/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { number: '300+', label: 'Components per watch' },
              { number: '800', label: 'Hours of craftsmanship' },
              { number: '50', label: 'Master watchmakers' },
              { number: '130', label: 'Years of heritage' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <p className="text-4xl lg:text-5xl font-serif text-gold-500 mb-2">{stat.number}</p>
                <p className="text-luxury-muted font-sans text-sm tracking-wide">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Finishing Techniques */}
      <section className="px-6 lg:px-12 py-24">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-gold-500 font-sans text-xs tracking-ultra-wide uppercase mb-4">
              Artisanal Techniques
            </p>
            <h2 className="text-3xl lg:text-4xl font-serif font-light">
              Hand-Finishing Methods
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Côtes de Genève',
                description: 'Decorative parallel wave patterns applied to movement plates, requiring steady hands and years of practice.'
              },
              {
                title: 'Anglage',
                description: 'Hand-beveling of edges at precise 45-degree angles, then polished to a mirror finish.'
              },
              {
                title: 'Perlage',
                description: 'Circular graining patterns applied to base plates, each circle perfectly overlapping the next.'
              },
              {
                title: 'Guilloché',
                description: 'Intricate engraved patterns on dials, created using traditional rose engine lathes.'
              },
              {
                title: 'Blued Screws',
                description: 'Steel screws heated to exactly 290°C to achieve the signature deep blue color.'
              },
              {
                title: 'Hand Engraving',
                description: 'Decorative motifs carved by master engravers, each piece uniquely individual.'
              }
            ].map((technique, index) => (
              <motion.div
                key={technique.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card-luxury p-8"
              >
                <h3 className="text-lg font-serif font-light mb-4">{technique.title}</h3>
                <p className="text-luxury-muted font-sans text-sm leading-relaxed">
                  {technique.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
