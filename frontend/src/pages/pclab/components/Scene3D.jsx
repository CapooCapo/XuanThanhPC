import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, useGLTF } from '@react-three/drei';
import { usePCBuilderStore } from '@/store/usePCBuilderStore';
import gsap from 'gsap';
import ErrorBoundary3D from '@/components/common/ErrorBoundary3D';
import { Suspense } from 'react';

const GenericComponent = ({ color, position, scale, wireframe = false, opacity = 1 }) => (
  <mesh position={position} scale={scale}>
    <boxGeometry args={[1, 1, 1]} />
    <meshStandardMaterial 
      color={color} 
      wireframe={wireframe} 
      transparent={opacity < 1} 
      opacity={opacity} 
    />
  </mesh>
);

const ModelLoader = ({ url, position, scale }) => {
  const { scene } = useGLTF(url);
  return <primitive object={scene.clone()} position={position} scale={scale} />;
};

const PCComponent = ({ url, position, scale, color, wireframe, opacity }) => {
  if (!url) return <GenericComponent color={color} position={position} scale={scale} wireframe={wireframe} opacity={opacity} />;
  
  return <ModelLoader url={url} position={position} scale={scale} />;
};

const PCChassis = () => {
  const { selectedComponents } = usePCBuilderStore();
  
  return (
    <group position={[0, -1, 0]}>
      {/* Base Case placeholder */}
      {selectedComponents.case ? (
        <ErrorBoundary3D fallback={<GenericComponent color="#00aaff" wireframe={true} opacity={0.3} scale={[2, 4, 4]} position={[0, 2, 0]} />}>
          <Suspense fallback={<GenericComponent color="#00aaff" wireframe={true} opacity={0.3} scale={[2, 4, 4]} position={[0, 2, 0]} />}>
            <PCComponent 
              url={selectedComponents.case.model3d_url} 
              color="#00aaff" 
              wireframe={true} 
              opacity={0.3} 
              scale={[2, 4, 4]} 
              position={[0, 2, 0]} 
            />
          </Suspense>
        </ErrorBoundary3D>
      ) : (
        <mesh position={[0, 2, 0]}>
          <boxGeometry args={[2, 4, 4]} />
          <meshStandardMaterial color="#1a1a1a" transparent opacity={0.5} wireframe />
        </mesh>
      )}

      {/* Motherboard Slot */}
      {selectedComponents.motherboard && (
        <ErrorBoundary3D fallback={<GenericComponent color="#111" scale={[0.1, 3, 3]} position={[-0.9, 2, 0]} />}>
          <Suspense fallback={<GenericComponent color="#111" scale={[0.1, 3, 3]} position={[-0.9, 2, 0]} />}>
            <PCComponent 
              url={selectedComponents.motherboard.model3d_url} 
              color="#111" 
              scale={[0.1, 3, 3]} 
              position={[-0.9, 2, 0]} 
            />
          </Suspense>
        </ErrorBoundary3D>
      )}

      {/* CPU Slot */}
      {selectedComponents.cpu && (
        <ErrorBoundary3D fallback={<GenericComponent color="#ccc" scale={[0.5, 0.5, 0.1]} position={[-0.8, 2.5, -0.5]} />}>
          <Suspense fallback={<GenericComponent color="#ccc" scale={[0.5, 0.5, 0.1]} position={[-0.8, 2.5, -0.5]} />}>
            <PCComponent 
              url={selectedComponents.cpu.model3d_url} 
              color="#ccc" 
              scale={[0.5, 0.5, 0.1]} 
              position={[-0.8, 2.5, -0.5]} 
            />
          </Suspense>
        </ErrorBoundary3D>
      )}

      {/* GPU Slot */}
      {selectedComponents.gpu && (
        <ErrorBoundary3D fallback={<GenericComponent color="#ff0044" scale={[1.5, 0.5, 0.8]} position={[0, 1.5, 0]} />}>
          <Suspense fallback={<GenericComponent color="#ff0044" scale={[1.5, 0.5, 0.8]} position={[0, 1.5, 0]} />}>
            <PCComponent 
              url={selectedComponents.gpu.model3d_url} 
              color="#ff0044" 
              scale={[1.5, 0.5, 0.8]} 
              position={[0, 1.5, 0]} 
            />
          </Suspense>
        </ErrorBoundary3D>
      )}
      
      {/* PSU Slot */}
      {selectedComponents.psu && (
        <ErrorBoundary3D fallback={<GenericComponent color="#333" scale={[1.5, 0.8, 1]} position={[0, 0.5, 1.2]} />}>
          <Suspense fallback={<GenericComponent color="#333" scale={[1.5, 0.8, 1]} position={[0, 0.5, 1.2]} />}>
            <PCComponent 
              url={selectedComponents.psu.model3d_url} 
              color="#333" 
              scale={[1.5, 0.8, 1]} 
              position={[0, 0.5, 1.2]} 
            />
          </Suspense>
        </ErrorBoundary3D>
      )}
    </group>
  );
};

const CameraAnimator = () => {
  const { cameraPosition } = usePCBuilderStore();
  // Create a reusable Vector3 to avoid garbage collection on every frame
  const targetPosition = useRef(new THREE.Vector3());
  
  useFrame((state) => {
    targetPosition.current.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);
    state.camera.position.lerp(targetPosition.current, 0.05);
    state.camera.lookAt(0, 1, 0);
  });
  
  return null;
};

const Scene3D = () => {
  return (
    <Canvas shadows camera={{ position: [5, 3, 5], fov: 45 }}>
      <color attach="background" args={['#0d0f12']} />
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      
      <PCChassis />
      
      <ContactShadows position={[0, -1.1, 0]} opacity={0.4} scale={10} blur={2} far={4} />
      <Environment preset="city" />
      <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 2 + 0.1} minDistance={3} maxDistance={10} />
    </Canvas>
  );
};

export default Scene3D;
