// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require("three");

// Include any additional ThreeJS examples below
require("three/examples/js/controls/OrbitControls");

const canvasSketch = require("canvas-sketch");

const settings = {
  // Make the loop animated
  animate: true,
  // Get a WebGL canvas rather than 2D
  context: "webgl",

  // dimensions: [2048, 2048],
};

const isDev = process.env.NODE_ENV === "development";

const sketch = ({ context }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas,
  });

  // WebGL background color
  renderer.setClearColor("#000", 1);

  // Setup a camera
  const camera = new THREE.PerspectiveCamera(50, 1, 0.01, 500);
  camera.position.set(0, 0, -4);
  camera.lookAt(new THREE.Vector3());

  // Setup camera controller
  const controls = new THREE.OrbitControls(camera, context.canvas);

  // Setup your scene
  const scene = new THREE.Scene();

  // Setup a geometry
  const geometry = new THREE.SphereGeometry(1, 32, 16);

  const loader = new THREE.TextureLoader();
  const texture = loader.load("earth.jpg");
  const moonTexture = loader.load("moon.jpg");

  // Setup a material
  const material = new THREE.MeshStandardMaterial({
    map: texture,
    roughness: 1,
    metalness: 0,
  });

  // Setup a mesh with geometry + material

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
  const moonMaterial = new THREE.MeshStandardMaterial({
    map: moonTexture,
    roughness: 1,
    metalness: 0,
  });

  const moonGgroup = new THREE.Group();

  const moonMesh = new THREE.Mesh(geometry, moonMaterial);
  moonMesh.position.set(1.5, 1, 0);
  moonMesh.scale.setScalar(0.25);
  moonGgroup.add(moonMesh);

  scene.add(moonGgroup);

  const light = new THREE.PointLight("white", 1);
  light.position.set(2, 2, 0);
  scene.add(light);

  isDev && scene.add(new THREE.PointLightHelper(light, 0.15));

  scene.add(new THREE.AmbientLight("red", 0.1));

  // scene.add(new THREE.AxesHelper(5));

  // scene.add(new THREE.GridHelper(5, 50));

  // draw each frame
  return {
    // Handle resize events here
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight, false);
      camera.aspect = viewportWidth / viewportHeight;
      camera.updateProjectionMatrix();
    },
    // Update & render your scene here
    render({ time }) {
      mesh.rotation.y = time * 0.15;
      moonMesh.rotation.y = time * 0.15;
      moonGgroup.rotation.y = time * 0.5;

      controls.update();
      renderer.render(scene, camera);
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload() {
      controls.dispose();
      renderer.dispose();
    },
  };
};

canvasSketch(sketch, settings);
