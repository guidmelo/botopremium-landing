'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* ─── Particle Field ─── */
function ParticleField() {
  const mesh = useRef<THREE.Points>(null);
  const count = 1800;

  const { positions, sizes } = (() => {
    const pos = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6;
      sz[i] = Math.random() * 2.5 + 0.5;
    }
    return { positions: pos, sizes: sz };
  })();

  useFrame((state) => {
    if (!mesh.current) return;
    const t = state.clock.elapsedTime;
    mesh.current.rotation.y = t * 0.018;
    mesh.current.rotation.x = Math.sin(t * 0.008) * 0.06;

    const pos = mesh.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      pos[idx + 1] += Math.sin(t * 0.3 + i * 0.4) * 0.0008;
    }
    mesh.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[sizes, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.012}
        color="#D6BE8A"
        transparent
        opacity={0.35}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

/* ─── Floating Orbs ─── */
function FloatingOrbs() {
  const orb1 = useRef<THREE.Mesh>(null);
  const orb2 = useRef<THREE.Mesh>(null);
  const orb3 = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (orb1.current) {
      orb1.current.position.y = Math.sin(t * 0.4) * 0.8;
      orb1.current.position.x = -3 + Math.cos(t * 0.25) * 0.3;
    }
    if (orb2.current) {
      orb2.current.position.y = Math.sin(t * 0.3 + 2) * 0.6;
      orb2.current.position.x = 3 + Math.cos(t * 0.2) * 0.4;
    }
    if (orb3.current) {
      orb3.current.position.y = Math.sin(t * 0.5 + 4) * 0.5;
      orb3.current.position.x = Math.cos(t * 0.15) * 0.5;
    }
  });

  const material1 = new THREE.MeshBasicMaterial({
    color: new THREE.Color('#C6A769'),
    transparent: true,
    opacity: 0.06,
  });

  const material2 = new THREE.MeshBasicMaterial({
    color: new THREE.Color('#D6BE8A'),
    transparent: true,
    opacity: 0.04,
  });

  return (
    <>
      <mesh ref={orb1} position={[-3, 0, -1]} material={material1}>
        <sphereGeometry args={[1.8, 32, 32]} />
      </mesh>
      <mesh ref={orb2} position={[3, 0.5, -2]} material={material2}>
        <sphereGeometry args={[1.4, 32, 32]} />
      </mesh>
      <mesh ref={orb3} position={[0, -1, -3]} material={material1}>
        <sphereGeometry args={[2.2, 32, 32]} />
      </mesh>
    </>
  );
}

/* ─── Hero Component ─── */
export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const { scrollY } = useScroll();

  const heroY = useTransform(scrollY, [0, 600], [0, 160]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const textY = useTransform(scrollY, [0, 500], [0, -80]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const scrollToContact = () => {
    document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      ref={containerRef}
      className="relative h-screen min-h-[700px] overflow-hidden flex items-center"
    >
      {/* Three.js Canvas */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y: heroY }}
      >
        {isMounted && (
          <Canvas
            camera={{ position: [0, 0, 6], fov: 60 }}
            dpr={[1, 1.5]}
            gl={{ antialias: false, alpha: true }}
          >
            <ambientLight intensity={0.3} />
            <ParticleField />
            <FloatingOrbs />
          </Canvas>
        )}
      </motion.div>

      {/* Deep gradient overlay */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 60%, rgba(5,5,5,0.3) 0%, rgba(5,5,5,0.7) 60%, rgba(5,5,5,0.95) 100%)',
        }}
      />

      {/* Left edge gradient */}
      <div
        className="absolute inset-y-0 left-0 w-1/3 z-[2]"
        style={{ background: 'linear-gradient(90deg, rgba(5,5,5,0.8) 0%, transparent 100%)' }}
      />

      {/* Ambient glow top */}
      <div
        className="ambient-glow z-[1] w-[600px] h-[400px] -top-32 left-1/2 -translate-x-1/2"
        style={{ background: 'rgba(198, 167, 105, 0.04)' }}
      />

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40 z-[3]"
        style={{ background: 'linear-gradient(0deg, rgba(5,5,5,1) 0%, transparent 100%)' }}
      />

      {/* Content */}
      <motion.div
        className="container-premium relative z-10 pt-20 md:pt-0"
        style={{ y: textY, opacity: heroOpacity }}
      >
        <div className="max-w-5xl">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-4 mb-8"
          >
            <div className="h-px w-12 bg-gradient-to-r from-champagne/60 to-transparent" />
            <span className="text-eyebrow text-champagne/80">Harmonização Facial Premium</span>
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-champagne/30" />
          </motion.div>

          {/* Main headline */}
          <div className="overflow-hidden mb-3">
            <motion.h1
              className="text-display-hero text-warm-white leading-[0.9]"
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: '0%', opacity: 1 }}
              transition={{ delay: 0.5, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            >
              Excelência em
            </motion.h1>
          </div>
          <div className="overflow-hidden mb-8">
            <motion.h1
              className="text-display-hero leading-[0.9]"
              style={{
                background: 'linear-gradient(135deg, #E8D5A3 0%, #C6A769 35%, #D6BE8A 65%, #E8D5A3 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                backgroundSize: '200% auto',
              }}
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: '0%', opacity: 1 }}
              transition={{ delay: 0.65, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            >
              Harmonização Facial
            </motion.h1>
          </div>

          {/* Subheadline */}
          <motion.p
            className="text-warm-white/50 font-body font-light text-base md:text-lg max-w-xl leading-relaxed mb-10 tracking-wide"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            Procedimentos de alto padrão para mulheres que valorizam sofisticação, autoestima e resultados naturais.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex flex-wrap items-center gap-4"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.05, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <button
              onClick={scrollToContact}
              className="btn-gold"
              data-cursor
              data-cursor-label="Solicitar"
            >
              <span>Solicitar Avaliação Exclusiva</span>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="opacity-70">
                <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <button
              onClick={() => document.getElementById('procedimentos')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-premium"
              data-cursor
            >
              <span>Ver Procedimentos</span>
            </button>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            className="flex items-center gap-6 mt-12 pt-8 border-t border-champagne/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3, duration: 0.8 }}
          >
            {[
              { value: '80+', label: 'Unidades' },
              { value: '50k+', label: 'Pacientes' },
              { value: '5★', label: 'Avaliação' },
              { value: '2020', label: 'Fundação' },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col gap-0.5">
                <span className="font-display text-xl font-light text-champagne tracking-tight">{stat.value}</span>
                <span className="text-[0.6rem] font-body uppercase tracking-[0.18em] text-warm-white/30">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 right-8 md:right-12 z-10 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.8 }}
      >
        <span className="text-[0.55rem] font-body tracking-[0.3em] uppercase text-warm-white/25 rotate-90 origin-center mb-6">
          Scroll
        </span>
        <motion.div
          className="w-px h-12 bg-gradient-to-b from-champagne/50 to-transparent origin-top"
          animate={{ scaleY: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  );
}
