import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

export default function SpiritualBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Create glowing particles
    const particleCount = 150;
    const particles = new THREE.BufferGeometry();
    const posArray = new Float32Array(particleCount * 3);
    const colorArray = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 10;
      posArray[i + 1] = (Math.random() - 0.5) * 10;
      posArray[i + 2] = (Math.random() - 0.5) * 10;

      // Saffron and gold colors
      const hue = Math.random() > 0.5 ? 0.12 : 0.15; // orange/gold hue
      const color = new THREE.Color().setHSL(hue, 1, 0.6);
      colorArray[i] = color.r;
      colorArray[i + 1] = color.g;
      colorArray[i + 2] = color.b;
    }

    particles.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

    const material = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
    });

    const particleSystem = new THREE.Points(particles, material);
    scene.add(particleSystem);

    camera.position.z = 5;

    // Floating lotus shape using points in a circle pattern
    const lotusCount = 60;
    const lotusGeometry = new THREE.BufferGeometry();
    const lotusPos = new Float32Array(lotusCount * 3);

    for (let i = 0; i < lotusCount; i++) {
      const angle = (i / lotusCount) * Math.PI * 2;
      const radius = 2.5 + Math.sin(i * 0.5) * 0.5;
      lotusPos[i * 3] = Math.cos(angle) * radius;
      lotusPos[i * 3 + 1] = Math.sin(angle) * radius * 0.6;
      lotusPos[i * 3 + 2] = (Math.random() - 0.5) * 2;
    }

    lotusGeometry.setAttribute('position', new THREE.BufferAttribute(lotusPos, 3));
    const lotusMaterial = new THREE.PointsMaterial({
      color: 0xffd700,
      size: 0.06,
      transparent: true,
      opacity: 0.6,
    });
    const lotusSystem = new THREE.Points(lotusGeometry, lotusMaterial);
    scene.add(lotusSystem);

    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;

      // Rotate particles slowly
      particleSystem.rotation.y = time * 0.2;
      particleSystem.rotation.x = time * 0.1;

      // Move lotus up and down
      lotusSystem.position.y = Math.sin(time * 0.5) * 0.3;
      lotusSystem.rotation.z = time * 0.3;

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="spiritual-canvas" />;
}
